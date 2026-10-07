<script setup lang="ts">
definePageMeta({ solidHeader: true })

const route = useRoute()
const page = await usePageTexts('strona-trasa')
usePageTheme(page)
const common = await usePageTexts('site-settings')
const labels = useTrailLabels()
const { data: trailsData } = await useCmsCollection<Trail>('trails')
// Ukryta trasa (nieaktywna w CMS) zachowuje się jak nieistniejąca — 404.
const trail = computed(() => trailsData.value?.records.find((t) => t.slug === route.params.slug && isCmsActive(t)))

if (!trail.value) {
  throw createError({ statusCode: 404, statusMessage: page.t('notFound') })
}

useHead({ title: () => [trail.value?.title, common.t('siteName')].filter(Boolean).join(' — ') })

const bikeTypes = computed(() => (trail.value ? trailBikeTypes(trail.value) : []))
const descriptionBlocks = computed(() => parseTrailDescription(trail.value?.description))
const highlights = computed(() => (trail.value?.highlights || '').split('\n').filter(Boolean))
const stops = computed(() => (trail.value?.stops || '').split('\n').filter(Boolean))
const safety = computed(() => (trail.value?.safety || '').split('\n').filter(Boolean))
const gallery = computed(() => galleryImages(trail.value))
const gpxUrl = computed(() => (trail.value ? trailGpxUrl(trail.value) : undefined))

const naturalValuesParagraphs = computed(() => (trail.value?.naturalValues || '').split(/\n\s*\n/).filter(Boolean))
const culturalValuesParagraphs = computed(() => (trail.value?.culturalValues || '').split(/\n\s*\n/).filter(Boolean))
const touristInfoParagraphs = computed(() => (trail.value?.touristInfo || '').split(/\n\s*\n/).filter(Boolean))

const waypointRows = computed(() =>
  (trail.value?.waypoints || '')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [km, point, meaning] = line.split('|').map((s) => s.trim())
      return { km, point, meaning }
    }),
)

const hasSurfaceBreakdown = computed(() => {
  const t = trail.value
  return !!t && t.surfaceAsfalt + t.surfaceSzuter + t.surfaceTeren > 0
})

// Nawierzchnia jako realny przelicznik km na trasie, a nie surowy procent.
function surfaceKm(percent: number) {
  if (!trail.value) return '0'
  return ((percent / 100) * trail.value.lengthKm).toFixed(1).replace('.0', '')
}

const infoRows = computed(() => {
  const t = trail.value
  if (!t) return []
  const rows: { label: string; value: string }[] = [{ label: page.t('rowName'), value: t.title }]
  if (t.startFinish) rows.push({ label: page.t('rowStart'), value: t.startFinish })
  if (t.routeCharacter) rows.push({ label: page.t('rowCharacter'), value: t.routeCharacter })
  rows.push({ label: page.t('rowLength'), value: `${t.lengthKm} km` })
  rows.push({ label: page.t('rowElevation'), value: `+${t.elevationM} m / -${t.descentM ?? t.elevationM} m` })
  if (t.elevationMinM != null && t.elevationMaxM != null) {
    rows.push({ label: page.t('rowRange'), value: `${t.elevationMinM}–${t.elevationMaxM} ${page.t('rowRangeUnit')}` })
  }
  rows.push({ label: page.t('rowTime'), value: t.durationHours })
  rows.push({ label: page.t('rowDifficulty'), value: labels.difficulty.value[t.difficulty] })
  if (t.recommendedBike) rows.push({ label: page.t('rowBike'), value: t.recommendedBike })
  if (t.surfaceDescription) rows.push({ label: page.t('rowSurface'), value: t.surfaceDescription })
  return rows
})

const pillClass = computed(() => {
  const d = trail.value!.difficulty
  return `pill pill-${d === 'latwa' ? 'easy' : d === 'srednia' ? 'medium' : 'hard'}`
})

// Poglądowy wykres profilu wysokościowego — używany tylko gdy brak realnego zdjęcia profilu z GPX.
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const elevationPoints = computed(() => {
  const seed = trail.value!.slug.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  const rand = seededRandom(seed)
  const steps = 14
  let y = 45
  const pts: string[] = []
  for (let i = 0; i < steps; i++) {
    y = Math.max(8, Math.min(88, y + (rand() - 0.45) * 32))
    pts.push(`${((i / (steps - 1)) * 100).toFixed(1)},${(100 - y).toFixed(1)}`)
  }
  return pts.join(' ')
})

const elevationArea = computed(() => `0,100 ${elevationPoints.value} 100,100`)
</script>

<template>
  <div v-if="trail">
    <PageHero variant="light" :kicker="labels.difficulty.value[trail.difficulty]" :title="trail.title" :description="trail.teaser" />

    <section class="section">
      <div class="container layout">
        <div class="main">
          <div class="gpx-banner card-surface">
            <div class="gpx-banner-text">
              <h3>{{ page.t('gpxTitle') }}</h3>
              <p>{{ page.t('gpxText') }}</p>
            </div>
            <a v-if="trail.gpxAvailable && gpxUrl" :href="gpxUrl" download class="btn btn-amber gpx-btn">{{ page.t('gpxButton') }}</a>
            <button v-else class="btn btn-amber gpx-btn is-disabled" disabled>{{ page.t('gpxSoon') }}</button>
          </div>

          <GalleryLightbox v-if="gallery.length" class="gallery-top" :images="gallery" :alt-prefix="trail.title" layout="mosaic" />

          <h2 class="section-title small first">{{ page.t('infoTitle') }}</h2>
          <div class="info-table card-surface">
            <div v-for="row in infoRows" :key="row.label" class="info-row">
              <span class="info-label">{{ row.label }}</span>
              <span class="info-value">{{ row.value }}</span>
            </div>
          </div>

          <div class="bikes">
            <span v-for="type in bikeTypes" :key="type" class="bike-tag">{{ labels.bike.value[type] }}</span>
          </div>

          <h2 class="section-title small">{{ page.t('elevationTitle') }}</h2>
          <div class="elevation card-surface">
            <img v-if="trail.elevationProfileImage" :src="resolveCmsUrl(trail.elevationProfileImage.src)" :alt="`Profil wysokościowy — ${trail.title}`" class="elevation-image" />
            <template v-else>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="elevation-svg">
                <polygon :points="elevationArea" fill="url(#elevGradient)" />
                <polyline :points="elevationPoints" fill="none" stroke="var(--alpine)" stroke-width="1.6" vector-effect="non-scaling-stroke" />
                <defs>
                  <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--alpine)" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="var(--alpine)" stop-opacity="0.02" />
                  </linearGradient>
                </defs>
              </svg>
              <p class="elevation-note">{{ page.t('elevationNote') }}</p>
            </template>
          </div>

          <template v-if="trail.routeMapImage">
            <h2 class="section-title small">{{ page.t('mapTitle') }}</h2>
            <div class="route-map card-surface">
              <img :src="resolveCmsUrl(trail.routeMapImage.src)" :alt="`${page.t('mapTitle')} — ${trail.title}`" />
            </div>
          </template>

          <h2 class="section-title small">{{ page.t('descriptionTitle') }}</h2>
          <template v-for="(block, i) in descriptionBlocks" :key="i">
            <h3 v-if="block.type === 'heading'" class="desc-heading">{{ block.text }}</h3>
            <p v-else-if="block.type === 'paragraph'" class="lead paragraph">{{ block.text }}</p>
            <div v-else-if="block.type === 'segments'" class="segments">
              <div v-for="(seg, j) in block.items" :key="j" class="segment">
                <span v-if="seg.label" class="segment-label">{{ seg.label }}</span>
                <p>{{ seg.text }}</p>
              </div>
            </div>
            <ol v-else-if="block.type === 'stages'" class="stages">
              <li v-for="(stage, j) in block.items" :key="j" class="stage">
                <span class="stage-dot" aria-hidden="true">{{ j + 1 }}</span>
                <div class="stage-head">
                  <span v-if="stage.range" class="stage-range">{{ stage.range }}</span>
                  <h4 class="stage-title">{{ stage.title }}</h4>
                </div>
                <p v-for="(b, k) in stage.body" :key="k" class="stage-body">{{ b }}</p>
              </li>
            </ol>
          </template>
          <p v-if="trail.routeOverview" class="route-overview">
            <strong>{{ page.t('overviewLabel') }}</strong> {{ trail.routeOverview }}
          </p>

          <template v-if="waypointRows.length">
            <h2 class="section-title small">{{ page.t('waypointsTitle') }}</h2>
            <div class="waypoints-table card-surface">
              <div class="wp-row wp-head">
                <span>{{ page.t('waypointsKm') }}</span><span>{{ page.t('waypointsPoint') }}</span><span>{{ page.t('waypointsMeaning') }}</span>
              </div>
              <div v-for="(row, i) in waypointRows" :key="i" class="wp-row">
                <span class="wp-km">{{ row.km }}</span>
                <span class="wp-point">{{ row.point }}</span>
                <span class="wp-meaning">{{ row.meaning }}</span>
              </div>
            </div>
          </template>

          <h2 class="section-title small">{{ page.t('highlightsTitle') }}</h2>
          <ul class="highlights">
            <li v-for="item in highlights" :key="item">
              <span class="hl-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
              </span>
              <span>{{ item }}</span>
            </li>
          </ul>

          <h2 class="section-title small">{{ page.t('stopsTitle') }}</h2>
          <ul class="list">
            <li v-for="item in stops" :key="item">{{ item }}</li>
          </ul>

          <section v-if="naturalValuesParagraphs.length" class="values-card values-nature">
            <div class="values-head">
              <span class="values-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15" /><path d="M5 19c3-4 6-6 9-7" /></svg>
              </span>
              <h2 class="values-title">{{ page.t('natureTitle') }}</h2>
            </div>
            <p v-for="(p, i) in naturalValuesParagraphs" :key="i" class="values-p">
              <strong v-if="splitLeadLabel(p).label">{{ splitLeadLabel(p).label }}: </strong>{{ splitLeadLabel(p).rest }}
            </p>
          </section>

          <section v-if="culturalValuesParagraphs.length" class="values-card values-culture">
            <div class="values-head">
              <span class="values-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v3M10.5 3.5h3" /><path d="M8 10l4-4 4 4" /><path d="M7 21V10h10v11" /><path d="M4 21h16" /><path d="M10.5 21v-4h3v4" /></svg>
              </span>
              <h2 class="values-title">{{ page.t('cultureTitle') }}</h2>
            </div>
            <p v-for="(p, i) in culturalValuesParagraphs" :key="i" class="values-p">
              <strong v-if="splitLeadLabel(p).label">{{ splitLeadLabel(p).label }}: </strong>{{ splitLeadLabel(p).rest }}
            </p>
          </section>

          <template v-if="hasSurfaceBreakdown">
            <h2 class="section-title small">{{ page.t('surfaceTitle') }}</h2>
            <div class="surface-bar">
              <span class="asfalt" :style="{ width: trail.surfaceAsfalt + '%' }" />
              <span class="szuter" :style="{ width: trail.surfaceSzuter + '%' }" />
              <span class="teren" :style="{ width: trail.surfaceTeren + '%' }" />
            </div>
            <ul class="surface-legend">
              <li><i class="asfalt" />{{ page.t('surfaceAsphalt') }} — {{ surfaceKm(trail.surfaceAsfalt) }} km</li>
              <li><i class="szuter" />{{ page.t('surfaceGravel') }} — {{ surfaceKm(trail.surfaceSzuter) }} km</li>
              <li><i class="teren" />{{ page.t('surfaceTerrain') }} — {{ surfaceKm(trail.surfaceTeren) }} km</li>
            </ul>
          </template>

          <template v-if="touristInfoParagraphs.length">
            <h2 class="section-title small">{{ page.t('touristTitle') }}</h2>
            <p v-for="(p, i) in touristInfoParagraphs" :key="i" class="lead paragraph">
              <strong v-if="splitLeadLabel(p).label" class="lead-label">{{ splitLeadLabel(p).label }}: </strong>{{ splitLeadLabel(p).rest }}
            </p>
          </template>

          <div v-if="trail.finalRecommendation" class="final-recommendation">
            <div class="fr-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M12 2l1.8 5.6H20l-4.6 3.5L17.2 17 12 13.4 6.8 17l1.8-5.9L4 7.6h6.2z" />
              </svg>
            </div>
            <div>
              <span class="kicker">{{ page.t('recommendationTitle') }}</span>
              <p>{{ trail.finalRecommendation }}</p>
            </div>
          </div>
        </div>

        <aside class="sidebar">
          <div class="sidebar-card card-surface">
            <h3>{{ page.t('safetyTitle') }}</h3>
            <ul class="safety-list">
              <li v-for="tip in safety" :key="tip">
                <strong v-if="splitLeadLabel(tip).label" class="lead-label">{{ splitLeadLabel(tip).label }}: </strong>{{ splitLeadLabel(tip).rest }}
              </li>
            </ul>
          </div>

          <p v-if="trail.auditNotes" class="audit-notes">{{ trail.auditNotes }}</p>

          <NuxtLink to="/szlaki" class="back-link">{{ page.t('backLink') }}</NuxtLink>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 3rem;
  align-items: start;
}

/* Grid items default to `min-width: auto`, so the main column and the sidebar
   refuse to shrink below their content's min-content width and push the whole
   page past the viewport on narrow phones. Let both tracks take exactly the
   width the grid gives them, and break the long, unhyphenatable place names
   and URLs that arrive from the CMS instead of widening the layout. */
.main,
.sidebar {
  min-width: 0;
  overflow-wrap: anywhere;
}

/* CMS images must never exceed their column. */
.main img,
.sidebar img {
  max-width: 100%;
}

.section-title.small {
  font-size: 1.4rem;
  margin-top: 2.5rem;
}

.section-title.small.first {
  margin-top: 0;
}

.info-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.info-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--mist);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row:nth-child(odd) {
  background: var(--mist);
}

.info-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #5a6a62;
}

.info-value {
  font-size: 0.92rem;
  color: var(--ink);
}

.gpx-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
}

/* Flex item: without this the heading's min-content width keeps the banner
   from fitting the column. */
.gpx-banner-text {
  min-width: 0;
}

.gpx-banner-text h3 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.gpx-banner-text p {
  margin: 0;
  font-size: 0.85rem;
  color: #5a6a62;
}

.gpx-banner .gpx-btn {
  width: auto;
  flex-shrink: 0;
}

.gallery-top {
  margin-bottom: 2rem;
}

.bikes {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 1.5rem 0 0;
}

.bike-tag {
  background: var(--mist);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
}

.paragraph {
  margin: 0 0 1rem;
}

.route-overview {
  margin: 0 0 1rem;
  padding: 0.9rem 1.1rem;
  background: var(--mist);
  font-size: 0.9rem;
  color: #4a4a44;
  border-left: 3px solid var(--amber);
}

.route-overview strong {
  color: var(--ink);
}

.elevation {
  padding: 1.5rem;
}

.elevation-svg {
  width: 100%;
  height: 160px;
  display: block;
}

.elevation-note {
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  color: #8a938c;
}

.elevation-image {
  width: 100%;
  height: auto;
  display: block;
}

.route-map {
  padding: 1.5rem;
}

.route-map img {
  width: 100%;
  height: auto;
  display: block;
}

.list {
  margin: 0;
  padding-left: 1.25rem;
  color: #4a4a44;
  line-height: 1.8;
}

.waypoints-table {
  overflow: hidden;
}

.wp-row {
  display: grid;
  grid-template-columns: 70px 1fr 1.4fr;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--mist);
}

.wp-row:last-child {
  border-bottom: none;
}

.wp-head {
  background: var(--ink);
  color: #fff;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.wp-km {
  font-weight: 800;
  color: var(--amber);
}

.wp-point {
  font-weight: 700;
  color: var(--ink);
}

.wp-meaning {
  color: #5a6a62;
}

.surface-bar {
  display: flex;
  height: 14px;
  overflow: hidden;
  margin-top: 0.5rem;
  border-radius: 999px;
}

.surface-bar .asfalt,
.surface-legend .asfalt {
  background: var(--ink);
}

.surface-bar .szuter,
.surface-legend .szuter {
  background: var(--amber);
}

.surface-bar .teren,
.surface-legend .teren {
  background: #b7c2b7;
}

.surface-legend {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  display: flex;
  /* Three legend entries do not fit on one line below ~400px; the row gap only
     applies once they wrap, so desktop keeps its single-line layout. */
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  font-size: 0.82rem;
  color: #4a4a44;
}

.surface-legend li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.surface-legend i {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 50%;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.gallery img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

.final-recommendation {
  margin-top: 2.5rem;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  background: var(--stone);
  border-left: 3px solid var(--amber);
  border-radius: 4px;
  padding: 1.75rem;
}

.final-recommendation .fr-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  color: var(--amber);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* Flex item next to the fixed-width icon: must be allowed to shrink. */
.final-recommendation > div:last-child {
  min-width: 0;
}

.final-recommendation p {
  margin: 0.4rem 0 0;
  color: #4a4a44;
  font-size: 0.95rem;
  line-height: 1.6;
}

.sidebar {
  position: sticky;
  top: 6.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  padding: 1.5rem;
}

.sidebar-card h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 800;
}

.gpx-btn {
  width: 100%;
  justify-content: center;
}

.hint {
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  color: #8a938c;
}

.safety-list {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #4a4a44;
}

.audit-notes {
  margin: 0;
  padding: 1rem 1.25rem;
  background: var(--mist);
  font-size: 0.75rem;
  line-height: 1.5;
  color: #8a938c;
  font-style: italic;
  white-space: pre-line;
}

.back-link {
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .info-row {
    grid-template-columns: 140px 1fr;
  }

  .wp-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .wp-head {
    display: none;
  }

  .wp-km {
    font-size: 0.78rem;
  }

  .gallery {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 520px) {
  /* At 320px the two-column table spends 204px on label + gap + padding and
     leaves ~68px for the value, which single words like "Bieszczadzka" cannot
     fit. Stack label over value and keep the label visually subordinate
     (smaller, uppercase, muted) so it still reads as a table, not prose. */
  .info-row {
    grid-template-columns: 1fr;
    gap: 0.2rem;
    padding: 0.75rem 1rem;
  }

  .info-label {
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .info-value {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .wp-row {
    padding: 0.75rem 1rem;
  }

  .gpx-banner {
    padding: 1.25rem;
    gap: 1rem;
  }

  /* Stacked banner: a full-width button beats one squeezed beside the copy,
     and gives a proper tap target. */
  .gpx-banner .gpx-btn {
    width: 100%;
  }

  .elevation,
  .route-map,
  .sidebar-card {
    padding: 1.25rem;
  }

  .final-recommendation {
    padding: 1.25rem;
    gap: 1rem;
  }

  .audit-notes {
    padding: 1rem;
  }

  /* 0.85rem inline link is a ~17px tall tap target; raise it to 44px. */
  .back-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
}

/* Opis trasy: nagłówki, kafelki odcinków i oś czasu etapów */
.desc-heading {
  margin: 2rem 0 1rem;
  font-family: var(--font-body);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--alpine);
}

.segments {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.segment {
  padding: 1rem 1.1rem;
  background: #fff;
  border-radius: 12px;
  border-top: 3px solid var(--leaf);
  box-shadow: 0 6px 18px rgba(26, 36, 32, 0.06);
}

.segment:nth-child(3n + 2) {
  border-top-color: var(--amber);
}

.segment:nth-child(3n + 3) {
  border-top-color: var(--alpine);
}

.segment-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--ink);
}

.segment p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.6;
  color: #4a4a44;
}

.stages {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
}

.stage {
  position: relative;
  padding: 0 0 1.6rem 3rem;
}

.stage::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(var(--leaf), rgba(137, 190, 58, 0.25));
}

.stage:last-child::before {
  display: none;
}

.stage-dot {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--alpine);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 0 0 4px #e3eedb;
}

.stage-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.7rem;
  min-height: 32px;
  margin-bottom: 0.5rem;
}

.stage-range {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #f6e7da;
  color: var(--amber);
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.stage-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
}

.stage-body {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #4a4a44;
}

/* Co warto zobaczyć */
.highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.highlights li {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  color: #3d3d38;
  line-height: 1.5;
}

.hl-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e3eedb;
  color: var(--alpine);
}

/* Walory jako kolorowe karty */
.values-card {
  margin-top: 2.5rem;
  padding: 1.6rem 1.75rem 0.9rem;
  border-radius: 16px;
}

.values-nature {
  background: linear-gradient(135deg, #eaf3e2, #f4f8ef);
  border: 1px solid #d6e7c7;
}

.values-culture {
  background: linear-gradient(135deg, #f8ece1, #fbf5ee);
  border: 1px solid #efd9c6;
}

.values-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.values-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.values-nature .values-icon,
.values-nature strong {
  color: var(--alpine);
}

.values-culture .values-icon,
.values-culture strong {
  color: var(--amber);
}

.values-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--ink);
}

.values-p {
  margin: 0 0 0.9rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #3d3d38;
}

.lead-label {
  color: var(--alpine);
}

@media (max-width: 640px) {
  .segments {
    grid-template-columns: 1fr;
  }

  .values-card {
    padding: 1.25rem 1.2rem 0.6rem;
  }
}
</style>
