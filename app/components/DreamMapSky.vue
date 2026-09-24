<script setup lang="ts">
import {
  CATEGORY_COLORS,
  CATEGORY_CONSTELLATIONS,
  CATEGORY_LINES,
  CATEGORY_NAMES,
  CATEGORY_TAIL,
  type DreamMapCategory,
} from '~/utils/dreamMapData'
import { useDreamMapPoints } from '~/composables/useDreamMapPoints'

const { points, highlightedId } = useDreamMapPoints()

const { data: settings } = await useCmsSingle<{ heroImage?: CmsImage | null }>('dream-map-settings')
const heroBackgroundImage = computed(
  () =>
    `linear-gradient(180deg, rgba(4, 7, 14, 0.72) 0%, rgba(4, 7, 14, 0.15) 30%, rgba(4, 7, 14, 0.2) 58%, rgba(4, 7, 14, 0.8) 100%), ` +
    `linear-gradient(200deg, rgba(201, 103, 46, 0.22) 0%, transparent 42%), ` +
    `url('${resolveCmsUrl(settings.value?.heroImage?.src)}')`,
)

const CATEGORIES = Object.keys(CATEGORY_NAMES) as DreamMapCategory[]

const CONST_LABEL_POS: Record<DreamMapCategory, { x: number; y: number }> = {
  turystyka: { x: 80, y: 18 },
  ekologia: { x: 40, y: 44 },
  infrastruktura: { x: 4, y: 50 },
  seniorzy: { x: 14, y: 66 },
  mlodziez: { x: 38, y: 2 },
}

const STAR_RADIUS = 9

const activeFilter = ref<'all' | DreamMapCategory>('all')
const selectedId = ref<number | null>(null)
const infoOpen = ref(false)

function isDimmed(cat: DreamMapCategory) {
  return activeFilter.value !== 'all' && activeFilter.value !== cat
}

const lines = computed(() => {
  const segments: { x1: number; y1: number; x2: number; y2: number; color: string; cat: DreamMapCategory; tail?: boolean }[] = []
  for (const cat of CATEGORIES) {
    // Each category's shape is a fixed list of edges (star-id pairs) —
    // not "connect them in order" — so it can trace an actual figure
    // (a dipper's bowl-and-handle, a cross, a diamond...) rather than a
    // generic zig-zag or polygon.
    for (const [fromId, toId] of CATEGORY_LINES[cat]) {
      const a = points.value.find((p) => p.id === fromId)
      const b = points.value.find((p) => p.id === toId)
      if (!a || !b) continue
      segments.push({ x1: a.px, y1: a.py, x2: b.px, y2: b.py, color: CATEGORY_COLORS[cat], cat })
    }
    // Decorative tail flourish, like real constellation drawings have.
    const tail = CATEGORY_TAIL[cat]
    const tailFrom = points.value.find((p) => p.id === tail.fromId)
    if (tailFrom) {
      segments.push({ x1: tailFrom.px, y1: tailFrom.py, x2: tail.x, y2: tail.y, color: CATEGORY_COLORS[cat], cat, tail: true })
    }
  }
  return segments
})

const selected = computed(() => points.value.find((p) => p.id === selectedId.value) ?? null)

function openStar(id: number) {
  selectedId.value = id
}

function closeModal() {
  selectedId.value = null
}

// Desktop: hovering already shows the info popover, so a click does
// something else useful instead of re-opening the same thing — it jumps
// down to that postulate's card in the full list below (DreamMapBoard.vue
// picks up highlightedId and scrolls/highlights it). Touch has no hover,
// so tapping there still opens the full modal as before.
function onStarClick(id: number) {
  if (isHoverCapable.value) {
    closeModal()
    highlightedId.value = id
  } else {
    openStar(id)
  }
}

// Desktop/trackpad: show the star's info on hover, hide it when the mouse
// leaves — no click needed. Touch devices (phone/tablet) have no real
// "hover", so they keep the tap-to-open/tap-to-close behavior untouched.
const isHoverCapable = ref(false)
const popoverPos = ref<{ x: number; y: number; above: boolean } | null>(null)
const skyEl = ref<HTMLElement | null>(null)
const popoverEl = ref<HTMLElement | null>(null)
const POPOVER_HALF_WIDTH = 170 // half of .star-popover's width + a little breathing room

function clampX(x: number) {
  return Math.min(Math.max(x, POPOVER_HALF_WIDTH + 8), window.innerWidth - POPOVER_HALF_WIDTH - 8)
}

// Everything must stay inside the hero section — never spill into the
// section below and never get clipped. We place it below the star first
// (best guess before it exists in the DOM), then once it's actually
// rendered we know its real height and can tell whether it still fits
// above the hero's own bottom edge; if not, flip it above the star instead
// (clamped so it also can't poke out above the hero's top edge).
async function onStarHoverEnter(id: number, evt: MouseEvent) {
  if (!isHoverCapable.value) return
  openStar(id)
  const starRect = (evt.currentTarget as HTMLElement).getBoundingClientRect()
  const x = clampX(starRect.left + starRect.width / 2)
  popoverPos.value = { x, y: starRect.bottom + 12, above: false }

  await nextTick()
  const heroRect = skyEl.value?.getBoundingClientRect()
  if (!heroRect) return
  const popH = popoverEl.value?.offsetHeight ?? 300

  if (starRect.bottom + 12 + popH <= heroRect.bottom - 8) {
    popoverPos.value = { x, y: starRect.bottom + 12, above: false }
  } else {
    const y = Math.max(starRect.top - 12, heroRect.top + popH + 8)
    popoverPos.value = { x, y, above: true }
  }
}

function onStarHoverLeave() {
  if (isHoverCapable.value) closeModal()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal()
    infoOpen.value = false
  }
}

// --- Background twinkling stars (canvas) ---
const canvasEl = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let bgStars: { x: number; y: number; r: number; base: number; speed: number; phase: number }[] = []
let raf = 0
let t = 0
const reducedMotion = ref(false)

function resizeCanvas() {
  const canvas = canvasEl.value
  if (!canvas) return
  const w = (canvas.width = canvas.offsetWidth)
  const h = (canvas.height = canvas.offsetHeight)
  bgStars = []
  const count = Math.min(90, Math.floor((w * h) / 14000))
  for (let i = 0; i < count; i++) {
    bgStars.push({
      x: Math.random() * w,
      y: Math.random() * h * 0.78,
      r: Math.random() * 1.1 + 0.3,
      base: Math.random() * 0.45 + 0.2,
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * 6.28,
    })
  }
}

function drawFrame() {
  const canvas = canvasEl.value
  if (!canvas || !ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  t += 0.016
  for (const s of bgStars) {
    const a = Math.max(0, Math.min(1, s.base + Math.sin(t * s.speed * 60 + s.phase) * 0.22))
    ctx.beginPath()
    ctx.arc(s.x, s.y, Math.max(0.2, s.r), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(240,234,214,${a})`
    ctx.fill()
  }
  raf = requestAnimationFrame(drawFrame)
}

// --- Occasional shooting stars ---
const shootingStars = ref<{ id: number; top: number; left: number; angle: number }[]>([])
let shootId = 0
let shootTimer: ReturnType<typeof setTimeout> | undefined

function scheduleShoot() {
  if (reducedMotion.value) return
  shootTimer = setTimeout(() => {
    const id = shootId++
    shootingStars.value.push({
      id,
      top: 5 + Math.random() * 40,
      left: 5 + Math.random() * 50,
      angle: 15 + Math.random() * 25,
    })
    setTimeout(() => {
      shootingStars.value = shootingStars.value.filter((s) => s.id !== id)
    }, 1500)
    scheduleShoot()
  }, 4000 + Math.random() * 8000)
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  isHoverCapable.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  document.addEventListener('keydown', onKeydown)

  const canvas = canvasEl.value
  if (canvas) {
    ctx = canvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    if (!reducedMotion.value) drawFrame()
  }
  if (!reducedMotion.value) {
    shootTimer = setTimeout(scheduleShoot, 3000)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(raf)
  clearTimeout(shootTimer)
})
</script>

<template>
  <div class="hero-block">
  <section
    ref="skyEl"
    class="sky"
    aria-label="Cyfrowa Mapa Marzeń — interaktywna mapa postulatów mieszkańców"
    :style="{ backgroundImage: heroBackgroundImage }"
  >
    <canvas ref="canvasEl" class="bg-canvas" aria-hidden="true" />

    <!-- Own coordinate box, inset below the site's fixed nav bar and above
         the bottom title gradient, so no star/line/label can ever end up
         hidden or unclickable behind either — regardless of how short the
         photo gets on small screens. -->
    <div class="star-field">
      <svg class="const-svg" aria-hidden="true">
        <line
          v-for="(seg, i) in lines"
          :key="i"
          :x1="`${seg.x1}%`"
          :y1="`${seg.y1}%`"
          :x2="`${seg.x2}%`"
          :y2="`${seg.y2}%`"
          :style="{ color: seg.color }"
          :class="{ highlight: activeFilter === seg.cat, dim: isDimmed(seg.cat), tail: seg.tail }"
        />
      </svg>

      <div class="const-labels" aria-hidden="true">
        <span
          v-for="cat in CATEGORIES"
          :key="cat"
          class="const-label"
          :style="{ left: CONST_LABEL_POS[cat].x + '%', top: CONST_LABEL_POS[cat].y + '%', color: CATEGORY_COLORS[cat] }"
          :class="{ highlight: activeFilter === cat, dim: isDimmed(cat) }"
        >
          {{ CATEGORY_CONSTELLATIONS[cat] }}
        </span>
      </div>

      <div class="stars-layer" role="list" aria-label="Postulaty mieszkańców">
        <button
          v-for="p in points"
          :key="p.id"
          type="button"
          class="star"
          role="listitem"
          :class="{ dimmed: isDimmed(p.category) }"
          :style="{
            left: p.px + '%',
            top: p.py + '%',
            color: CATEGORY_COLORS[p.category],
            animationDelay: (p.id % 7) * 0.35 + 's',
          }"
          :aria-label="`${p.title}, ${CATEGORY_NAMES[p.category]}`"
          @click="onStarClick(p.id)"
          @mouseenter="onStarHoverEnter(p.id, $event)"
          @mouseleave="onStarHoverLeave"
        >
          <span
            class="star-core"
            :style="{
              background: `radial-gradient(circle at 38% 32%, #fff, ${CATEGORY_COLORS[p.category]}dd 40%, ${CATEGORY_COLORS[p.category]})`,
              filter: `drop-shadow(0 0 ${STAR_RADIUS * 0.85}px ${CATEGORY_COLORS[p.category]}cc)`,
            }"
          />
          <span class="star-label">{{ p.title }}</span>
        </button>
      </div>

    </div>

    <header class="sky-header">
      <h1>Cyfrowa Mapa <span>Marzeń</span></h1>
      <p>Ustrzyki Dolne 2036 — Warsztat Przyszłości</p>
      <div class="header-actions">
        <button type="button" class="hdr-btn" @click="infoOpen = true">O projekcie</button>
      </div>
    </header>

    <!-- Desktop hover preview: a compact card anchored to the star's real
         on-screen position, teleported to <body> and fixed-positioned so
         no ancestor's overflow:hidden can clip it — but always kept inside
         the hero section's own bounds (flips above the star, clamped, if
         it wouldn't otherwise fit — see onStarHoverEnter). Opens/closes
         purely by hovering the star. -->
    <Teleport to="body">
      <div
        v-if="isHoverCapable && selected && popoverPos"
        ref="popoverEl"
        class="star-popover"
        :class="{ above: popoverPos.above }"
        :style="{ left: popoverPos.x + 'px', top: popoverPos.y + 'px' }"
      >
        <div class="modal-accent-bar" :style="{ background: CATEGORY_COLORS[selected.category] }" />
        <div class="popover-body">
          <span
            class="modal-cat-badge"
            :style="{ background: CATEGORY_COLORS[selected.category] + '1a', color: CATEGORY_COLORS[selected.category] }"
          >
            {{ CATEGORY_NAMES[selected.category] }}
          </span>
          <h2>{{ selected.title }}</h2>
          <p class="modal-label">Wyzwanie</p>
          <p class="modal-text">{{ selected.challenge }}</p>
          <p class="modal-label">Propozycja rozwiązania</p>
          <p class="modal-text">{{ selected.solution }}</p>
        </div>
      </div>
    </Teleport>

    <!-- MODAL (touch only — desktop uses the hover popover above instead) -->
    <div v-if="!isHoverCapable" class="modal-overlay" :class="{ visible: selected }" @click.self="closeModal">
      <div v-if="selected" class="modal-card">
        <div class="modal-accent-bar" :style="{ background: CATEGORY_COLORS[selected.category] }" />
        <button type="button" class="modal-close" aria-label="Zamknij" @click="closeModal">×</button>
        <div class="modal-body">
          <span
            class="modal-cat-badge"
            :style="{ background: CATEGORY_COLORS[selected.category] + '1a', color: CATEGORY_COLORS[selected.category] }"
          >
            {{ CATEGORY_NAMES[selected.category] }}
          </span>
          <h2>{{ selected.title }}</h2>
          <p class="modal-label">Wyzwanie</p>
          <p class="modal-text">{{ selected.challenge }}</p>
          <p class="modal-label">Propozycja rozwiązania</p>
          <p class="modal-text">{{ selected.solution }}</p>
        </div>
      </div>
    </div>

    <!-- INFO -->
    <div class="info-overlay" :class="{ visible: infoOpen }" @click.self="infoOpen = false">
      <div class="info-box">
        <button type="button" class="info-close" aria-label="Zamknij" @click="infoOpen = false">×</button>
        <h2>O projekcie</h2>
        <p>
          Bieszczady to jedno z najciemniejszych miejsc na mapie Polski. Mieszkańcy Ustrzyk Dolnych spojrzeli w to niebo i
          rozłożyli na nim swoje marzenia o mieście za dekadę.
        </p>
        <p>
          Każda gwiazda to postulat zgłoszony podczas warsztatów „Ustrzyki 2036: Warsztat Przyszłości”. Gwiazdozbiory
          łączą postulaty w kategorie tematyczne — kliknij gwiazdę, by poznać szczegóły.
        </p>
        <div class="info-credit">
          <strong>Stowarzyszenie Nowoczesne Bieszczady</strong><br />
          Projekt „Ustrzyki 2036: Warsztat Przyszłości” • 3 warsztaty kreatywne • 18 postulatów mieszkańców
        </div>
      </div>
    </div>
  </section>

  <nav class="filter-strip" aria-label="Filtruj według kategorii">
    <div class="filter-strip-inner">
      <button
        type="button"
        class="filter-btn filter-btn-all"
        :class="{ active: activeFilter === 'all' }"
        :style="{ '--cat-color': '#ffd89b', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#f0ead6' }"
        @click="activeFilter = 'all'"
      >
        <span class="dot" style="background: #f0ead6" />Wszystkie
      </button>
      <button
        v-for="cat in CATEGORIES"
        :key="cat"
        type="button"
        class="filter-btn"
        :class="{ active: activeFilter === cat }"
        :style="{ '--cat-color': CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat], color: CATEGORY_COLORS[cat] }"
        @click="activeFilter = cat"
      >
        <span class="dot" :style="{ background: CATEGORY_COLORS[cat] }" />{{ CATEGORY_NAMES[cat] }}
      </button>

      <span class="filter-strip-stat">{{ points.length }} postulatów</span>
    </div>
  </nav>
  </div>
</template>

<style scoped>
.hero-block {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  min-height: 480px;
  max-height: 900px;
}

.sky {
  position: relative;
  width: 100%;
  flex: 1 1 auto;
  /* Lets the photo shrink below its own content size on short viewports —
     the filter strip below (flex-shrink: 0) always keeps its full height,
     so both stay on screen together without scrolling. */
  min-height: 0;
  overflow: hidden;
  /* Layered gradients + the CMS-hosted photo itself are set together via
     :style (see heroBackgroundImage) so the photo URL can be dynamic —
     these only cover position/size/repeat, which don't conflict with that. */
  background-color: #060a14;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: normal, soft-light, normal;
  color: #f0ead6;
  font-family: var(--font-body);
}

h1,
h2 {
  font-family: var(--font-display);
}

.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.star-field {
  position: absolute;
  /* Fixed-pixel clearance from the site's own fixed nav (~96px tall) at the
     top — this box shrinks/grows with the photo, but never starts inside
     the nav's real footprint, so a star can never end up unclickable
     underneath it, on any screen height. */
  top: 96px;
  left: 0;
  right: 0;
  bottom: 32px;
}

.const-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.const-svg line {
  stroke: rgba(240, 234, 214, 0.55);
  stroke-width: 1;
  transition: opacity 0.4s, stroke-width 0.3s, stroke 0.3s;
}

.const-svg line.highlight {
  stroke: currentColor;
  opacity: 1;
  stroke-width: 1.8;
  filter: drop-shadow(0 0 3px currentColor);
}

.const-svg line.dim {
  opacity: 0.06;
}

.const-svg line.tail {
  opacity: 0.3;
  stroke-dasharray: 2 5;
}

.const-svg line.tail.highlight {
  opacity: 0.55;
  stroke-width: 1.2;
}

.const-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.const-label {
  position: absolute;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.3;
  filter: saturate(0.15) brightness(1.6);
  transition: opacity 0.4s, filter 0.4s;
  white-space: nowrap;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

.const-label.highlight {
  opacity: 0.95;
  filter: saturate(1) brightness(1);
  text-shadow: 0 0 12px currentColor, 0 2px 6px rgba(0, 0, 0, 0.8);
}

.const-label.dim {
  opacity: 0.06;
}

.stars-layer {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Visual dot can be tiny; keep the actual click/tap target comfortable. */
  width: 30px;
  height: 30px;
  margin-left: -15px;
  margin-top: -15px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s;
  animation: star-twinkle 3.4s ease-in-out infinite;
}

.star::before {
  content: '';
  position: absolute;
  inset: -90%;
  border-radius: 50%;
  background: radial-gradient(circle, currentColor 0%, transparent 70%);
  opacity: 0.4;
  pointer-events: none;
}

.star-core {
  position: absolute;
  inset: 32%;
  border-radius: 50%;
}

@keyframes star-twinkle {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.18);
  }
}

.star:focus-visible {
  transform: scale(1.6);
  z-index: 6;
  outline: none;
  box-shadow: 0 0 0 3px #ffd89b !important;
}

/* Hover-only visuals gated behind an actual hover-capable pointer — on
   touch, matching :hover on a clickable element makes mobile Safari
   consume the first tap just to satisfy :hover (showing the label) and
   require a second tap to fire the real click that opens the modal. */
@media (hover: hover) and (pointer: fine) {
  .star:hover {
    transform: scale(1.6);
    z-index: 6;
    outline: none;
  }
}

.star.dimmed {
  opacity: 0.1;
  pointer-events: none;
}

.star-label {
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.95), 0 2px 4px rgba(0, 0, 0, 0.9);
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.star:focus-visible .star-label {
  opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
  .star:hover .star-label {
    opacity: 1;
  }
}

.sky-header {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4rem 1.75rem 3rem;
  background: linear-gradient(0deg, rgba(6, 10, 20, 0.88) 0%, rgba(6, 10, 20, 0.35) 65%, transparent 100%);
  /* Only the actual buttons below should catch clicks — the rest of this
     box overlaps the star field and must let clicks fall through to it. */
  pointer-events: none;
}

.sky-header h1 {
  font-size: clamp(2rem, 4.8vw, 3.4rem);
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.4);
}

.sky-header h1 span {
  color: #ffd89b;
}

.sky-header p {
  font-size: clamp(0.8rem, 1.6vw, 0.95rem);
  color: rgba(240, 234, 214, 0.75);
  margin: 0.5rem 0 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.hdr-btn {
  padding: 0.5rem 1.1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  color: #f0ead6;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-body);
  pointer-events: auto;
  transition: background 0.2s, transform 0.15s;
}

.hdr-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

/* --- Filter strip: its own solid bar below the photo, not overlapping stars --- */
.filter-strip {
  flex-shrink: 0;
  background: var(--ink);
  padding: 0.9rem 1.75rem;
}

.filter-strip-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.filter-strip-stat {
  margin-left: auto;
  font-size: 0.75rem;
  color: rgba(240, 234, 214, 0.5);
  white-space: nowrap;
}

.filter-btn {
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  border: 1.5px solid;
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-body);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: inherit;
  transition: transform 0.15s, background 0.2s;
}

.filter-btn:hover:not(.active) {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.1);
}

.filter-btn.active {
  background: var(--cat-color);
  color: #060a14 !important;
}

.filter-btn.active .dot {
  background: #060a14 !important;
}

/* Hardcoded (no custom-property indirection) so "Wszystkie" — active by
   default on page load — is guaranteed readable from the very first
   paint, instead of depending on --cat-color/var() resolving in time. */
.filter-btn-all.active {
  background: #ffd89b !important;
  color: #060a14 !important;
}

.filter-btn-all.active .dot {
  background: #060a14 !important;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 800px) {
  .filter-strip-stat {
    margin-left: 0;
    width: 100%;
    order: 10;
  }
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 10, 20, 0.88);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  padding: 1rem;
}

.modal-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

.modal-card {
  max-width: 480px;
  width: 100%;
  position: relative;
  background: linear-gradient(145deg, rgba(19, 32, 64, 0.97), rgba(12, 21, 39, 0.99));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  max-height: 85vh;
  overflow-y: auto;
}

.modal-accent-bar {
  height: 4px;
  width: 100%;
}

.modal-body {
  padding: 1.6rem 1.75rem 1.75rem;
}

.modal-cat-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.modal-body h2 {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.9rem;
}

.modal-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7a94;
  margin: 0.9rem 0 0.3rem;
}

.modal-text {
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(240, 234, 214, 0.82);
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 0.85rem;
  right: 0.95rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.3);
  color: #f0ead6;
  font-size: 1.1rem;
  cursor: pointer;
  line-height: 1;
}

/* Desktop hover dropdown — teleported to <body> and fixed-positioned at
   the star's real on-screen coordinates (see popoverPos), so it's never
   clipped by .sky's overflow:hidden and can freely overlap the section
   below when a star sits near the bottom of the hero. */
.star-popover {
  position: fixed;
  transform: translateX(-50%);
  width: 320px;
  max-width: calc(100vw - 48px);
  z-index: 500;
  background: linear-gradient(145deg, rgba(19, 32, 64, 0.98), rgba(12, 21, 39, 0.99));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  animation: popover-in 0.15s ease-out;
  /* Teleported to <body>, so it no longer sits inside .sky and can't
     inherit its color: #f0ead6 — without this the title (which has no
     color of its own) falls back to the page's dark body text color and
     goes near-invisible on this dark card. */
  color: #f0ead6;
  font-family: var(--font-body);
}

.star-popover.above {
  transform: translate(-50%, -100%);
}

@keyframes popover-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.popover-body {
  padding: 1.1rem 1.25rem 1.25rem;
}

.popover-body h2 {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.6rem;
}

/* INFO */
.info-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 10, 20, 0.9);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  padding: 1rem;
}

.info-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

.info-box {
  max-width: 500px;
  width: 100%;
  position: relative;
  background: linear-gradient(145deg, rgba(19, 32, 64, 0.97), rgba(12, 21, 39, 0.99));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1.75rem;
  max-height: 85vh;
  overflow-y: auto;
}

.info-box h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.9rem;
}

.info-box p {
  font-size: 0.85rem;
  line-height: 1.65;
  color: rgba(240, 234, 214, 0.78);
  margin: 0 0 0.6rem;
}

.info-credit {
  font-size: 0.75rem;
  color: #6b7a94;
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  line-height: 1.6;
}

.info-close {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f0ead6;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
}

@media (max-width: 800px) {
  .star-field {
    /* Mobile nav has no TopBar row and less padding — shorter. */
    top: 58px;
  }

  .sky-header {
    padding: 1.5rem 1.1rem 1.5rem;
  }

  .filter-strip {
    padding: 0.7rem 1rem;
  }

  .filter-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.68rem;
  }
}

/* Short viewports (laptops with browser chrome, landscape phones): shrink
   the header so it never gets clipped as the photo compresses to keep the
   filter strip on screen without scrolling. */
@media (max-height: 700px) {
  .hero-block {
    min-height: 420px;
  }

  .sky-header {
    padding: 1.5rem 1.5rem 1.25rem;
  }

  .sky-header h1 {
    font-size: clamp(1.5rem, 4vw, 2.2rem);
  }

  .sky-header p {
    margin-top: 0.2rem;
  }

  .header-actions {
    margin-top: 0.6rem;
  }
}

@media (max-height: 520px) {
  .hero-block {
    min-height: 340px;
  }

  .sky-header {
    padding: 1rem 1.25rem 0.9rem;
  }

  .header-actions {
    margin-top: 0.4rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .star,
  .modal-overlay,
  .info-overlay {
    transition-duration: 0.01ms !important;
  }

  .star {
    animation: none !important;
  }
}
</style>
