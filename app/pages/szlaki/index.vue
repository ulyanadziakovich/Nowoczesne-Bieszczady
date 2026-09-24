<script setup lang="ts">
definePageMeta({ solidHeader: true })
useHead({ title: 'Nasze szlaki rowerowe — Nowoczesne Bieszczady' })

const { data: trailsData } = await useCmsCollection<Trail>('trails')
const trails = computed(() => trailsData.value?.records ?? [])
const content = usePageContent()

const difficultyFilter = ref<TrailDifficulty | 'all'>('all')
const bikeFilter = ref<TrailBikeType | 'all'>('all')
const maxLength = ref(60)

const difficultyOptions = [
  { value: 'all' as const, label: 'Wszystkie' },
  ...(Object.entries(difficultyLabels) as [TrailDifficulty, string][]).map(([value, label]) => ({ value, label })),
]

const bikeOptions = [
  { value: 'all' as const, label: 'Wszystkie' },
  ...(Object.entries(bikeTypeLabels) as [TrailBikeType, string][]).map(([value, label]) => ({ value, label })),
]

const filtered = computed(() =>
  trails.value.filter((trail) => {
    if (difficultyFilter.value !== 'all' && trail.difficulty !== difficultyFilter.value) return false
    if (bikeFilter.value !== 'all' && !trailBikeTypes(trail).includes(bikeFilter.value)) return false
    if (trail.lengthKm > maxLength.value) return false
    return true
  }),
)

const sliderMin = 10
const sliderMax = 60
const sliderFill = computed(() => ((maxLength.value - sliderMin) / (sliderMax - sliderMin)) * 100)
const sliderStyle = computed(() => ({
  background: `linear-gradient(to right, var(--amber) ${sliderFill.value}%, #e9e5db ${sliderFill.value}%)`,
}))

const heroStats = computed(() => {
  const lengths = trails.value.map((t) => t.lengthKm)
  if (!lengths.length) return []
  return [`${trails.value.length} zaudytowane trasy`, `${Math.min(...lengths)}–${Math.max(...lengths)} km długości`, '3 poziomy trudności']
})

function dotClass(difficulty: TrailDifficulty) {
  return `dot dot-${difficulty === 'latwa' ? 'easy' : difficulty === 'srednia' ? 'medium' : 'hard'}`
}

const difficultyGroups = computed(() =>
  (['latwa', 'srednia', 'trudna'] as TrailDifficulty[])
    .map((difficulty) => ({
      difficulty,
      label: difficultyLabels[difficulty],
      trails: trails.value.filter((t) => t.difficulty === difficulty),
    }))
    .filter((group) => group.trails.length > 0),
)

function resetFilters() {
  difficultyFilter.value = 'all'
  bikeFilter.value = 'all'
  maxLength.value = 60
}
</script>

<template>
  <div>
    <PageHero
      variant="light"
      kicker="Turystyka rowerowa"
      title="Nasze szlaki rowerowe"
      :description="content.body('szlaki-hero-description')"
      :stats="heroStats"
    />

    <section class="section">
      <div class="container">
        <div class="desktop-filtered">
        <div class="filters">
          <div class="filter">
            <span class="filter-label">Trudność</span>
            <div class="segmented">
              <button
                v-for="option in difficultyOptions"
                :key="option.value"
                class="segment"
                :class="{ active: difficultyFilter === option.value }"
                @click="difficultyFilter = option.value"
              >
                <i v-if="option.value !== 'all'" :class="dotClass(option.value)" />
                {{ option.label }}
              </button>
            </div>
          </div>

          <span class="filter-divider" />

          <div class="filter">
            <span class="filter-label">Typ roweru</span>
            <div class="segmented">
              <button
                v-for="option in bikeOptions"
                :key="option.value"
                class="segment"
                :class="{ active: bikeFilter === option.value }"
                @click="bikeFilter = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <span class="filter-divider" />

          <div class="filter filter-range">
            <label class="filter-label" for="length">Maks. długość <strong>{{ maxLength }} km</strong></label>
            <input id="length" v-model.number="maxLength" type="range" :min="sliderMin" :max="sliderMax" step="2" :style="sliderStyle" />
          </div>

          <button class="reset" @click="resetFilters">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
            </svg>
            Wyczyść
          </button>
        </div>

        <p class="results-count">Znaleziono <strong>{{ filtered.length }}</strong> {{ filtered.length === 1 ? 'trasę' : 'tras' }}</p>

        <TransitionGroup v-if="filtered.length" name="trail-fade" tag="div" class="grid-2">
          <TrailCard v-for="trail in filtered" :key="trail.slug" :trail="trail" />
        </TransitionGroup>

        <div v-else class="empty">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <p>Brak tras spełniających wybrane kryteria.</p>
          <button class="link-btn" @click="resetFilters">Wyczyść filtry i pokaż wszystkie</button>
        </div>
        </div>

        <div class="mobile-groups">
          <div v-for="group in difficultyGroups" :key="group.difficulty" class="mobile-group">
            <h3 class="mobile-group-title"><i :class="dotClass(group.difficulty)" />{{ group.label }}</h3>
            <div class="scroll-row">
              <div v-for="trail in group.trails" :key="trail.slug" class="scroll-card">
                <TrailCard :trail="trail" />
              </div>
              <div class="scroll-spacer" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-tight project-note">
      <div class="container">
        <div class="note-card">
          <div class="note-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M3 20l6-14 4 9 3-6 5 11H3z" />
            </svg>
          </div>
          <div>
            <span class="kicker">{{ content.title('szlaki-project-note') }}</span>
            <p class="lead">{{ content.body('szlaki-project-note') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.1rem 1.5rem;
  margin-bottom: 2rem;
  background: #fff;
  border: 1px solid #eee9dd;
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(26, 36, 32, 0.05);
}

.filter {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.filter-range {
  gap: 0.85rem;
  min-width: 190px;
}

.filter-divider {
  width: 1px;
  height: 26px;
  background: #e9e5db;
  flex-shrink: 0;
}

.filter-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #8a938c;
  white-space: nowrap;
}

.filter-label strong {
  color: var(--ink);
  font-weight: 800;
}

.segmented {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--stone);
  border-radius: 999px;
  padding: 3px;
}

.segment {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6c766e;
  background: transparent;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
}

.segment:hover {
  color: var(--ink);
}

.segment.active {
  background: #fff;
  color: #a8551f;
  box-shadow: 0 4px 12px rgba(26, 36, 32, 0.1);
}

.segment .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-easy {
  background: var(--leaf);
}

.dot-medium {
  background: #f2b263;
}

.dot-hard {
  background: #e57a63;
}

input[type='range'] {
  appearance: none;
  -webkit-appearance: none;
  width: 120px;
  height: 5px;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--amber);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--amber);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  cursor: pointer;
}

.reset {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  color: #8a938c;
  background: transparent;
  border: none;
  padding: 0.5rem 0;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s;
}

.reset:hover {
  color: #a8551f;
  text-decoration: underline;
}

.results-count {
  margin: 0 0 1.5rem;
  color: #5a6a62;
  font-size: 0.9rem;
  font-weight: 600;
}

.results-count strong {
  color: var(--ink);
  font-size: 1rem;
}

.grid-2 {
  position: relative;
}

.mobile-groups {
  display: none;
}

.mobile-group + .mobile-group {
  margin-top: 2rem;
}

.mobile-group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
}

.mobile-group-title .dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.scroll-row {
  display: flex;
  gap: 0.9rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 1.25rem;
  padding: 0.75rem 0 2.75rem 1.25rem;
  margin: 0 -1.25rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.scroll-row::-webkit-scrollbar {
  display: none;
}

.scroll-card {
  flex: 0 0 auto;
  width: 78vw;
  max-width: 300px;
  scroll-snap-align: start;
}

.scroll-card :deep(.trail-card) {
  height: 100%;
}

.scroll-card :deep(.image-wrap) {
  height: 160px;
}

.scroll-card :deep(h3) {
  font-size: 1.05rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scroll-spacer {
  flex: 0 0 0.4rem;
}

.trail-fade-move,
.trail-fade-enter-active,
.trail-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.trail-fade-enter-from,
.trail-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.trail-fade-leave-active {
  position: absolute;
  width: 100%;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  text-align: center;
  color: #8a938c;
  padding: 4rem 2rem;
  border: 1.5px dashed #d7dcd6;
  border-radius: 18px;
}

.empty p {
  margin: 0;
  font-size: 0.95rem;
  color: #5a6a62;
}

.link-btn {
  font-family: inherit;
  background: none;
  border: none;
  color: var(--amber);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}

.link-btn:hover {
  text-decoration: underline;
}

.project-note {
  border-top: 1px solid rgba(26, 36, 32, 0.08);
}

.note-card {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  background: var(--stone);
  border-left: 3px solid var(--amber);
  border-radius: 4px;
  padding: 2rem;
}

.note-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fff;
  color: var(--amber);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.note-card .kicker {
  display: block;
  font-size: 0.75rem;
}

.note-card .lead {
  max-width: 720px;
  margin-top: 0.6rem;
}

@media (max-width: 900px) {
  .desktop-filtered {
    display: none;
  }

  .mobile-groups {
    display: block;
  }

  .note-card {
    flex-direction: column;
    padding: 1.5rem;
  }
}
</style>
