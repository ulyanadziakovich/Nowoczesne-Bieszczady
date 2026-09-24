<script setup lang="ts">
import { CATEGORY_COLORS, CATEGORY_NAMES, type DreamMapCategory } from '~/utils/dreamMapData'
import { useDreamMapPoints } from '~/composables/useDreamMapPoints'

const { points, highlightedId } = useDreamMapPoints()

const CATEGORIES = Object.keys(CATEGORY_NAMES) as DreamMapCategory[]
const activeFilter = ref<'all' | DreamMapCategory>('all')

const filtered = computed(() =>
  activeFilter.value === 'all' ? points.value : points.value.filter((p) => p.category === activeFilter.value),
)

// Set when a star is clicked on the sky map above (desktop only — see
// DreamMapSky.vue's onStarClick). Show every category so the card is
// guaranteed to actually be in the grid, then scroll to and flash it.
let unhighlightTimer: ReturnType<typeof setTimeout> | undefined
watch(highlightedId, async (id) => {
  if (id == null) return
  activeFilter.value = 'all'
  await nextTick()
  document.getElementById(`postulat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  clearTimeout(unhighlightTimer)
  unhighlightTimer = setTimeout(() => {
    if (highlightedId.value === id) highlightedId.value = null
  }, 2600)
})

/** Same 18 postulates, grouped by category — used for the mobile layout,
 * where each category is its own sideways-scrolling row instead of one
 * filterable grid. */
const grouped = computed(() =>
  CATEGORIES.map((cat) => ({
    cat,
    items: points.value.filter((p) => p.category === cat),
  })).filter((g) => g.items.length),
)
</script>

<template>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <span class="kicker">18 postulatów mieszkańców</span>
        <h2 class="section-title">Wszystkie punkty mapy marzeń</h2>
        <p class="lead">
          Pełna lista wniosków i rekomendacji z warsztatów „Ustrzyki 2036” — wyzwanie i proponowane rozwiązanie przy
          każdym punkcie.
        </p>
      </div>

      <!-- Desktop: filterable single grid -->
      <div class="desktop-board">
        <nav class="filters" aria-label="Filtruj według kategorii">
          <button
            type="button"
            class="filter-chip"
            :class="{ active: activeFilter === 'all' }"
            :style="activeFilter === 'all' ? { background: 'var(--ink)', borderColor: 'var(--ink)' } : {}"
            @click="activeFilter = 'all'"
          >
            Wszystkie
          </button>
          <button
            v-for="cat in CATEGORIES"
            :key="cat"
            type="button"
            class="filter-chip"
            :class="{ active: activeFilter === cat }"
            :style="
              activeFilter === cat
                ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] }
                : { borderColor: CATEGORY_COLORS[cat], color: CATEGORY_COLORS[cat] }
            "
            @click="activeFilter = cat"
          >
            <span class="dot" :style="{ background: CATEGORY_COLORS[cat] }" />
            {{ CATEGORY_NAMES[cat] }}
          </button>
        </nav>

        <div class="grid-3 board">
          <DreamMapCard
            v-for="p in filtered"
            :id="`postulat-${p.id}`"
            :key="p.id"
            :point="p"
            :class="{ highlighted: highlightedId === p.id }"
          />
        </div>
      </div>

      <!-- Mobile: postulates grouped by category, each row scrolls sideways -->
      <div class="mobile-board">
        <div v-for="group in grouped" :key="group.cat" class="category-row">
          <div class="category-row-head">
            <span class="category-dot" :style="{ background: CATEGORY_COLORS[group.cat] }" />
            <h3>{{ CATEGORY_NAMES[group.cat] }}</h3>
            <span class="category-count">{{ group.items.length }}</span>
          </div>
          <div class="category-scroller">
            <DreamMapCard v-for="p in group.items" :key="p.id" class="scroller-card" :point="p" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mobile-board {
  display: none;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 2.5rem;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  background: #fff;
  color: var(--ink);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-body);
  transition: transform 0.15s;
}

.filter-chip:hover {
  transform: translateY(-1px);
}

.filter-chip.active {
  color: #fff !important;
}

.filter-chip.active .dot {
  background: #fff !important;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.board {
  align-items: stretch;
}

/* --- Mobile category rows --- */
.category-row {
  margin-bottom: 2rem;
}

.category-row:last-child {
  margin-bottom: 0;
}

.category-row-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-row-head h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink);
}

.category-count {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 700;
  color: #8a978f;
}

.category-scroller {
  display: flex;
  gap: 0.9rem;
  overflow-x: auto;
  /* A plain child of .container, same as .category-row-head above it — no
     negative-margin bleed trick. That technique didn't line up reliably
     with overflow-x scrolling in practice; this way the first card's left
     edge is guaranteed to match the heading's, because nothing is being
     cancelled and re-added. */
  padding-bottom: 0.5rem;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-scroller::-webkit-scrollbar {
  display: none;
}

.scroller-card {
  scroll-snap-align: start;
  flex: 0 0 82%;
  max-width: 340px;
}

@media (max-width: 900px) {
  .desktop-board {
    display: none;
  }

  .mobile-board {
    display: block;
  }
}
</style>
