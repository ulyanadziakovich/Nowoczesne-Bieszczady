<script setup lang="ts">
definePageMeta({ solidHeader: true })

const route = useRoute()
const { data: trailsData } = await useCmsCollection<Trail>('trails')
const trail = computed(() => trailsData.value?.records.find((t) => t.slug === route.params.slug))

if (!trail.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono trasy' })
}

useHead({ title: `${trail.value.title} — Nowoczesne Bieszczady` })

const bikeTypes = computed(() => (trail.value ? trailBikeTypes(trail.value) : []))
const descriptionParagraphs = computed(() => (trail.value?.description || '').split(/\n\s*\n/).filter(Boolean))
const highlights = computed(() => (trail.value?.highlights || '').split('\n').filter(Boolean))
const stops = computed(() => (trail.value?.stops || '').split('\n').filter(Boolean))
const safety = computed(() => (trail.value?.safety || '').split('\n').filter(Boolean))
const gallery = computed(() => (trail.value?.gallery || '').split('\n').filter(Boolean))

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
  const rows: { label: string; value: string }[] = [{ label: 'Nazwa trasy', value: t.title }]
  if (t.startFinish) rows.push({ label: 'Punkt startu/mety', value: t.startFinish })
  if (t.routeCharacter) rows.push({ label: 'Charakter trasy', value: t.routeCharacter })
  rows.push({ label: 'Długość z GPX', value: `${t.lengthKm} km` })
  rows.push({ label: 'Przewyższenia z GPX', value: `+${t.elevationM} m / -${t.descentM ?? t.elevationM} m` })
  if (t.elevationMinM != null && t.elevationMaxM != null) {
    rows.push({ label: 'Zakres wysokości', value: `${t.elevationMinM}–${t.elevationMaxM} m n.p.m.` })
  }
  rows.push({ label: 'Szacowany czas przejazdu', value: t.durationHours })
  rows.push({ label: 'Poziom trudności', value: difficultyLabels[t.difficulty] })
  if (t.recommendedBike) rows.push({ label: 'Rekomendowany rower', value: t.recommendedBike })
  if (t.surfaceDescription) rows.push({ label: 'Nawierzchnia', value: t.surfaceDescription })
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
    <PageHero variant="light" :kicker="difficultyLabels[trail.difficulty]" :title="trail.title" :description="trail.teaser" />

    <section class="section">
      <div class="container layout">
        <div class="main">
          <div class="gpx-banner card-surface">
            <div class="gpx-banner-text">
              <h3>Pobierz nawigację GPX</h3>
              <p>Plik do wgrania na nawigację rowerową lub zegarek GPS.</p>
            </div>
            <a v-if="trail.gpxAvailable && trail.gpxFile" :href="trail.gpxFile" download class="btn btn-amber gpx-btn">Pobierz plik GPX</a>
            <button v-else class="btn btn-amber gpx-btn is-disabled" disabled>GPX wkrótce dostępny</button>
          </div>

          <div v-if="gallery.length" class="gallery gallery-top">
            <img v-for="(img, i) in gallery" :key="i" :src="img" :alt="`${trail.title} — zdjęcie ${i + 1}`" />
          </div>

          <h2 class="section-title small first">Podstawowe informacje</h2>
          <div class="info-table card-surface">
            <div v-for="row in infoRows" :key="row.label" class="info-row">
              <span class="info-label">{{ row.label }}</span>
              <span class="info-value">{{ row.value }}</span>
            </div>
          </div>

          <div class="bikes">
            <span v-for="type in bikeTypes" :key="type" class="bike-tag">{{ bikeTypeLabels[type] }}</span>
          </div>

          <h2 class="section-title small">Profil wysokościowy</h2>
          <div class="elevation card-surface">
            <img v-if="trail.elevationProfileImage" :src="trail.elevationProfileImage" :alt="`Profil wysokościowy — ${trail.title}`" class="elevation-image" />
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
              <p class="elevation-note">Wykres poglądowy — pełne dane wysokościowe dostępne w pliku GPX.</p>
            </template>
          </div>

          <template v-if="trail.routeMapImage">
            <h2 class="section-title small">Mapa przebiegu trasy</h2>
            <div class="route-map card-surface">
              <img :src="trail.routeMapImage" :alt="`Mapa przebiegu trasy — ${trail.title}`" />
            </div>
          </template>

          <h2 class="section-title small">Opis trasy</h2>
          <p v-for="(paragraph, i) in descriptionParagraphs" :key="i" class="lead paragraph">{{ paragraph }}</p>
          <p v-if="trail.routeOverview" class="route-overview">
            <strong>Przebieg trasy:</strong> {{ trail.routeOverview }}
          </p>

          <template v-if="waypointRows.length">
            <h2 class="section-title small">Najważniejsze punkty na trasie</h2>
            <div class="waypoints-table card-surface">
              <div class="wp-row wp-head">
                <span>Km</span><span>Punkt / miejscowość</span><span>Znaczenie</span>
              </div>
              <div v-for="(row, i) in waypointRows" :key="i" class="wp-row">
                <span class="wp-km">{{ row.km }}</span>
                <span class="wp-point">{{ row.point }}</span>
                <span class="wp-meaning">{{ row.meaning }}</span>
              </div>
            </div>
          </template>

          <h2 class="section-title small">Co warto zobaczyć</h2>
          <ul class="list">
            <li v-for="item in highlights" :key="item">{{ item }}</li>
          </ul>

          <h2 class="section-title small">Miejsca odpoczynku i gastronomia</h2>
          <ul class="list">
            <li v-for="item in stops" :key="item">{{ item }}</li>
          </ul>

          <template v-if="naturalValuesParagraphs.length">
            <h2 class="section-title small">Walory przyrodnicze</h2>
            <p v-for="(p, i) in naturalValuesParagraphs" :key="i" class="lead paragraph">{{ p }}</p>
          </template>

          <template v-if="culturalValuesParagraphs.length">
            <h2 class="section-title small">Walory historyczne i kulturowe</h2>
            <p v-for="(p, i) in culturalValuesParagraphs" :key="i" class="lead paragraph">{{ p }}</p>
          </template>

          <template v-if="hasSurfaceBreakdown">
            <h2 class="section-title small">Nawierzchnia</h2>
            <div class="surface-bar">
              <span class="asfalt" :style="{ width: trail.surfaceAsfalt + '%' }" />
              <span class="szuter" :style="{ width: trail.surfaceSzuter + '%' }" />
              <span class="teren" :style="{ width: trail.surfaceTeren + '%' }" />
            </div>
            <ul class="surface-legend">
              <li><i class="asfalt" />Asfalt — {{ surfaceKm(trail.surfaceAsfalt) }} km</li>
              <li><i class="szuter" />Szuter — {{ surfaceKm(trail.surfaceSzuter) }} km</li>
              <li><i class="teren" />Teren — {{ surfaceKm(trail.surfaceTeren) }} km</li>
            </ul>
          </template>

          <template v-if="touristInfoParagraphs.length">
            <h2 class="section-title small">Informacje turystyczne i audytowe</h2>
            <p v-for="(p, i) in touristInfoParagraphs" :key="i" class="lead paragraph">{{ p }}</p>
          </template>

          <div v-if="trail.finalRecommendation" class="final-recommendation">
            <div class="fr-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M12 2l1.8 5.6H20l-4.6 3.5L17.2 17 12 13.4 6.8 17l1.8-5.9L4 7.6h6.2z" />
              </svg>
            </div>
            <div>
              <span class="kicker">Rekomendacja końcowa</span>
              <p>{{ trail.finalRecommendation }}</p>
            </div>
          </div>
        </div>

        <aside class="sidebar">
          <div class="sidebar-card card-surface">
            <h3>Bezpieczeństwo</h3>
            <ul class="safety-list">
              <li v-for="tip in safety" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <p v-if="trail.auditNotes" class="audit-notes">{{ trail.auditNotes }}</p>

          <NuxtLink to="/szlaki" class="back-link">← Wróć do wszystkich tras</NuxtLink>
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
  gap: 1.25rem;
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
</style>
