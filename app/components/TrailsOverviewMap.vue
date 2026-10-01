<script setup lang="ts">
// Overview map of every audited trail. Leaflet needs a real DOM, so the library
// itself is imported dynamically inside onMounted and the whole component is
// expected to be rendered inside <ClientOnly>. GPX tracks are ~900 KB in total,
// so they are fetched lazily (only once the map scrolls into view), in parallel,
// and every track is simplified to at most MAX_POINTS points before drawing.
import 'leaflet/dist/leaflet.css'
import type { ComponentPublicInstance } from 'vue'
import type { Map as LeafletMap, Polyline } from 'leaflet'

export interface OverviewTrail {
  slug: string
  title: string
  difficulty: TrailDifficulty
  lengthKm: number
  gpxFile?: string | null
}

const props = defineProps<{ trails: OverviewTrail[] }>()

/**
 * The difficulty palette lives in app.vue as --diff-easy/--diff-medium/--diff-hard, the single
 * source of truth shared with the legend, the filter dots, the card dots and the pills. Leaflet
 * only accepts literal colour strings, so the custom properties are read off the document once
 * the map boots — safe here because this component always runs in the browser, inside
 * <ClientOnly>, and the stylesheet is in place long before boot() is called.
 */
const fallbackColor = '#6c766e'
let palette: Record<TrailDifficulty, string> | null = null

function resolvePalette(): Record<TrailDifficulty, string> {
  const style = getComputedStyle(document.documentElement)
  const read = (name: string): string => style.getPropertyValue(name).trim() || fallbackColor
  return {
    latwa: read('--diff-easy'),
    srednia: read('--diff-medium'),
    trudna: read('--diff-hard'),
  }
}

/** A polyline that keeps ~300 points still traces a Bieszczady loop faithfully at overview zoom. */
const MAX_POINTS = 300
/** Bieszczady, used until the real bounds of the loaded tracks are known. */
const INITIAL_CENTER: [number, number] = [49.35, 22.4]
const INITIAL_ZOOM = 9

type Pt = [number, number]

const mappable = computed(() => props.trails.filter((trail) => Boolean(trail.gpxFile)))

const rootEl = ref<HTMLElement | null>(null)
const mapEl = ref<HTMLElement | null>(null)

const status = ref<'idle' | 'loading' | 'ready'>('idle')
const loadedCount = ref(0)
const failedTitles = ref<string[]>([])
const zoomUnlocked = ref(false)

const popupEls = new Map<string, HTMLElement>()
let map: LeafletMap | null = null
let observer: IntersectionObserver | null = null
let abort: AbortController | null = null
let bounds: [number, number, number, number] | null = null // south, west, north, east

function registerPopup(slug: string, el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLElement) popupEls.set(slug, el)
  else popupEls.delete(slug)
}

function colorFor(difficulty: TrailDifficulty): string {
  return palette?.[difficulty] ?? fallbackColor
}

function parseGpx(xml: string): Pt[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length) throw new Error('Nieprawidłowy dokument GPX')
  const nodes = doc.getElementsByTagName('trkpt')
  const points: Pt[] = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!
    const lat = Number(node.getAttribute('lat'))
    const lon = Number(node.getAttribute('lon'))
    if (Number.isFinite(lat) && Number.isFinite(lon)) points.push([lat, lon])
  }
  if (points.length < 2) throw new Error('Plik GPX nie zawiera śladu')
  return points
}

/** Distance from p to segment a–b, with longitude scaled by kx so degrees stay roughly isotropic. */
function segmentDistance(p: Pt, a: Pt, b: Pt, kx: number): number {
  const ax = a[1] * kx
  const ay = a[0]
  let dx = b[1] * kx - ax
  let dy = b[0] - ay
  const len2 = dx * dx + dy * dy
  let t = 0
  if (len2 > 0) {
    t = ((p[1] * kx - ax) * dx + (p[0] - ay) * dy) / len2
    if (t < 0) t = 0
    else if (t > 1) t = 1
  }
  dx = p[1] * kx - (ax + t * dx)
  dy = p[0] - (ay + t * dy)
  return Math.sqrt(dx * dx + dy * dy)
}

function douglasPeucker(points: Pt[], tolerance: number, kx: number): Pt[] {
  const n = points.length
  if (n < 3) return points
  const keep = new Uint8Array(n)
  keep[0] = 1
  keep[n - 1] = 1
  const stack: number[] = [0, n - 1]
  while (stack.length) {
    const end = stack.pop()!
    const start = stack.pop()!
    let worst = -1
    let index = -1
    for (let i = start + 1; i < end; i++) {
      const d = segmentDistance(points[i]!, points[start]!, points[end]!, kx)
      if (d > worst) {
        worst = d
        index = i
      }
    }
    if (index > 0 && worst > tolerance) {
      keep[index] = 1
      stack.push(start, index, index, end)
    }
  }
  const out: Pt[] = []
  for (let i = 0; i < n; i++) if (keep[i]) out.push(points[i]!)
  return out
}

function simplifyTrack(points: Pt[]): Pt[] {
  if (points.length <= MAX_POINTS) return points
  const kx = Math.cos((points[0]![0] * Math.PI) / 180)
  let tolerance = 0.0001 // ~11 m
  let result = douglasPeucker(points, tolerance, kx)
  while (result.length > MAX_POINTS && tolerance < 0.05) {
    tolerance *= 1.6
    result = douglasPeucker(points, tolerance, kx)
  }
  if (result.length > MAX_POINTS) {
    const stride = Math.ceil(result.length / MAX_POINTS)
    const strided = result.filter((_, i) => i % stride === 0)
    const last = result[result.length - 1]!
    if (strided[strided.length - 1] !== last) strided.push(last)
    result = strided
  }
  return result
}

function growBounds(points: Pt[]) {
  for (const [lat, lon] of points) {
    if (!bounds) bounds = [lat, lon, lat, lon]
    else {
      if (lat < bounds[0]) bounds[0] = lat
      if (lon < bounds[1]) bounds[1] = lon
      if (lat > bounds[2]) bounds[2] = lat
      if (lon > bounds[3]) bounds[3] = lon
    }
  }
}

async function boot() {
  const target = mapEl.value
  if (!target || map) return
  status.value = 'loading'
  palette = resolvePalette()

  const L = await import('leaflet')
  if (!mapEl.value) return // unmounted while the chunk was loading

  const instance = L.map(target, {
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
    zoomSnap: 0.25, // fractional zoom lets fitBounds fill the frame instead of rounding down a whole level
    scrollWheelZoom: false, // never steal the page scroll — unlocked on click
    dragging: !L.Browser.mobile, // on touch, one-finger panning must scroll the page first
    tap: false,
    attributionControl: true,
  })
  map = instance

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(instance)

  // Casings sit below every coloured track so overlapping trails stay readable.
  const casingPane = instance.createPane('trailCasing')
  casingPane.style.zIndex = '400'
  casingPane.style.pointerEvents = 'none'
  instance.createPane('trailLine').style.zIndex = '410'

  instance.on('click', unlockInteraction)

  abort = new AbortController()
  const { signal } = abort

  await Promise.all(
    mappable.value.map(async (trail) => {
      try {
        const response = await fetch(trail.gpxFile!, { signal })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const points = simplifyTrack(parseGpx(await response.text()))
        if (!map || signal.aborted) return
        drawTrail(L, instance, trail, points)
        growBounds(points)
        loadedCount.value += 1
      } catch (error) {
        if (signal.aborted) return
        // One broken GPX must never take the rest of the map down.
        failedTitles.value = [...failedTitles.value, trail.title]
        console.warn(`[TrailsOverviewMap] nie udało się wczytać ${trail.gpxFile}`, error)
      }
    }),
  )

  if (!map || signal.aborted) return
  if (bounds) instance.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], { padding: [28, 28] })
  status.value = 'ready'
}

function drawTrail(
  L: typeof import('leaflet'),
  instance: LeafletMap,
  trail: OverviewTrail,
  points: Pt[],
) {
  const color = colorFor(trail.difficulty)

  L.polyline(points, {
    pane: 'trailCasing',
    color: '#ffffff',
    weight: 7,
    opacity: 0.85,
    interactive: false,
    lineJoin: 'round',
    lineCap: 'round',
  }).addTo(instance)

  const line: Polyline = L.polyline(points, {
    pane: 'trailLine',
    color,
    weight: 4,
    opacity: 0.95,
    lineJoin: 'round',
    lineCap: 'round',
  }).addTo(instance)

  const popup = popupEls.get(trail.slug)
  if (popup) line.bindPopup(popup, { closeButton: true, autoPanPadding: [24, 24] })

  line.on('mouseover', () => line.setStyle({ weight: 7, opacity: 1 }))
  line.on('mouseout', () => {
    if (!line.isPopupOpen()) line.setStyle({ weight: 4, opacity: 0.95 })
  })
  line.on('click', () => line.setStyle({ weight: 7, opacity: 1 }))
  line.on('popupclose', () => line.setStyle({ weight: 4, opacity: 0.95 }))
}

function unlockInteraction() {
  if (!map || zoomUnlocked.value) return
  map.scrollWheelZoom.enable()
  map.dragging.enable()
  zoomUnlocked.value = true
}

function lockInteraction() {
  if (!map || !zoomUnlocked.value) return
  map.scrollWheelZoom.disable()
  zoomUnlocked.value = false
}

onMounted(() => {
  const root = rootEl.value
  if (!root) return
  if (typeof IntersectionObserver !== 'function') {
    void boot()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer?.disconnect()
      observer = null
      void boot()
    },
    { rootMargin: '200px' },
  )
  observer.observe(root)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
  abort?.abort()
  abort = null
  map?.remove()
  map = null
})
</script>

<template>
  <div ref="rootEl" class="trails-map">
    <div
      class="map-shell card-surface"
      role="region"
      :aria-label="`Mapa ${mappable.length} szlaków rowerowych w Bieszczadach`"
      @mouseleave="lockInteraction"
    >
      <div ref="mapEl" class="map-canvas" />

      <p v-if="status !== 'ready'" class="map-status" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true" />
        Wczytywanie tras… {{ loadedCount }}/{{ mappable.length }}
      </p>

      <p v-if="status === 'ready' && !zoomUnlocked" class="map-hint" aria-hidden="true">
        Kliknij mapę, aby przybliżać i przesuwać
      </p>
    </div>

    <div class="map-footer">
      <ul class="legend">
        <li v-for="(label, difficulty) in difficultyLabels" :key="difficulty">
          <i class="legend-dot" :class="`legend-dot-${difficulty}`" />
          {{ label }}
        </li>
      </ul>
      <p v-if="failedTitles.length" class="legend-error">
        Nie udało się wczytać śladu: {{ failedTitles.join(', ') }}.
      </p>
    </div>

    <!-- Popup bodies live here until Leaflet moves them into an open popup, which keeps
         the NuxtLink inside Vue's tree so clicking it navigates without a page reload. -->
    <div class="popup-host" aria-hidden="true">
      <div
        v-for="trail in mappable"
        :key="trail.slug"
        :ref="(el) => registerPopup(trail.slug, el)"
        class="trail-popup"
      >
        <strong class="popup-title">{{ trail.title }}</strong>
        <span class="popup-meta">{{ difficultyLabels[trail.difficulty] }} · {{ trail.lengthKm }} km</span>
        <NuxtLink :to="`/szlaki/${trail.slug}`" class="popup-link">
          Zobacz trasę
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * Leaflet gives its panes and controls z-indexes from 400 up to 1000, far above
 * the site header's 20. `position: relative` alone does not contain them — only
 * a stacking context does — so without this the map paints straight over the
 * fixed header while scrolling past it.
 */
.map-shell {
  position: relative;
  isolation: isolate;
  height: 520px;
  overflow: hidden;
  background: var(--mist);
}

.map-canvas {
  width: 100%;
  height: 100%;
}

.map-status,
.map-hint {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.94);
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(26, 36, 32, 0.14);
  pointer-events: none;
}

.map-status {
  top: 1rem;
}

.map-hint {
  bottom: 1rem;
  color: #6c766e;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid #ded9cc;
  border-top-color: var(--amber);
  border-radius: 50%;
  animation: map-spin 0.8s linear infinite;
}

@keyframes map-spin {
  to {
    transform: rotate(360deg);
  }
}

.map-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem 1.5rem;
  margin-top: 1.25rem;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c766e;
}

.legend-dot {
  width: 14px;
  height: 4px;
  border-radius: 999px;
  flex-shrink: 0;
}

/* Same custom properties the Leaflet lines are drawn with, so the legend can never drift. */
.legend-dot-latwa {
  background: var(--diff-easy);
}

.legend-dot-srednia {
  background: var(--diff-medium);
}

.legend-dot-trudna {
  background: var(--diff-hard);
}

.legend-error {
  margin: 0;
  font-size: 0.78rem;
  color: #a8341c;
}

.popup-host {
  display: none;
}

.trail-popup {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 170px;
}

.popup-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}

.popup-meta {
  font-size: 0.78rem;
  color: #6c766e;
}

.popup-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--amber);
  text-decoration: none;
}

.popup-link:hover {
  text-decoration: underline;
}

.map-shell :deep(.leaflet-container) {
  font-family: var(--font-body);
  background: var(--mist);
}

.map-shell :deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(26, 36, 32, 0.18);
}

.map-shell :deep(.leaflet-popup-content) {
  margin: 0.8rem 1rem;
}

.map-shell :deep(.leaflet-control-attribution) {
  font-size: 0.65rem;
}

@media (max-width: 900px) {
  .map-shell {
    height: 380px;
  }

  .legend {
    gap: 0.9rem;
  }
}
</style>
