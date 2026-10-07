<script setup lang="ts">
// Nagrodzone prace pod konkursem — pogrupowane według kategorii, ze znaczkiem
// nagrody. Kliknięcie otwiera duży podgląd z podpisem (tytuł, autor, nagroda).
interface Laureate {
  image?: CmsImage | null
  title: string
  author: string
  category?: string
  award: 'i-miejsce' | 'ii-miejsce' | 'iii-miejsce' | 'wyroznienie'
}

const props = defineProps<{ title?: string; items: Laureate[] }>()
const page = usePageTextsSync('strona-kultura')

const awardLabel = (award: Laureate['award']) =>
  ({
    'i-miejsce': page.t('awardFirst'),
    'ii-miejsce': page.t('awardSecond'),
    'iii-miejsce': page.t('awardThird'),
    wyroznienie: page.t('awardMention'),
  })[award] ?? ''

const works = computed(() => props.items.filter((w) => w.image?.src))
const RANK: Record<Laureate['award'], number> = { 'i-miejsce': 1, 'ii-miejsce': 2, 'iii-miejsce': 3, wyroznienie: 4 }

// Kategorie w kolejności z CMS; w każdej: podium (I–III miejsce) i wyróżnienia.
const groups = computed(() => {
  const order: string[] = []
  const map = new Map<string, { work: Laureate; index: number }[]>()
  works.value.forEach((work, index) => {
    const key = work.category?.trim() || ''
    if (!map.has(key)) {
      map.set(key, [])
      order.push(key)
    }
    map.get(key)!.push({ work, index })
  })
  return order.map((category) => {
    const items = map.get(category)!.slice().sort((x, y) => RANK[x.work.award] - RANK[y.work.award])
    return {
      category,
      podium: items.filter((i) => i.work.award !== 'wyroznienie'),
      mentions: items.filter((i) => i.work.award === 'wyroznienie'),
    }
  })
})
const activeCategory = ref(0)
const active = computed(() => groups.value[activeCategory.value] ?? groups.value[0])

const openIndex = ref<number | null>(null)
const current = computed(() => (openIndex.value === null ? null : works.value[openIndex.value]))
function open(i: number) {
  openIndex.value = i
}

const { isTouch, trackEl, onTrackScroll } = useSwipeLightbox(openIndex)
function close() {
  openIndex.value = null
}
function step(d: number) {
  if (openIndex.value === null) return
  openIndex.value = (openIndex.value + d + works.value.length) % works.value.length
}
function onKey(e: KeyboardEvent) {
  if (openIndex.value === null) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') step(-1)
  else if (e.key === 'ArrowRight') step(1)
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="works.length" class="laureates">
    <div class="laureates-head">
      <h3 v-if="title" class="laureates-title">{{ title }}</h3>
      <div v-if="groups.length > 1" class="laureates-tabs" role="tablist">
        <button
          v-for="(group, i) in groups"
          :key="group.category"
          type="button"
          role="tab"
          class="tab"
          :class="{ active: i === activeCategory }"
          :aria-selected="i === activeCategory"
          @click="activeCategory = i"
        >
          {{ group.category }}
        </button>
      </div>
    </div>

    <div v-if="active" :key="active.category" class="laureates-panel">
      <!-- Podium: I miejsce duże, II i III obok. -->
      <div v-if="active.podium.length" class="podium" :class="`podium-${active.podium.length}`">
        <button
          v-for="({ work, index }, k) in active.podium"
          :key="index"
          type="button"
          class="work"
          :class="{ 'work-main': k === 0 }"
          @click="open(index)"
        >
          <img :src="resolveCmsUrl(work.image!.src)" :alt="`${work.title} — ${work.author}`" loading="eager" />
          <span class="work-caption">
            <span class="award" :class="`award-${work.award}`">{{ awardLabel(work.award) }}</span>
            <span class="work-title">{{ work.title }}</span>
            <span class="work-author">{{ work.author }}</span>
          </span>
        </button>
      </div>

      <!-- Wyróżnienia: pasek mniejszych zdjęć, przewijany w bok. -->
      <div v-if="active.mentions.length" class="mentions">
        <p class="mentions-label">{{ page.t('awardMention') }} · {{ active.mentions.length }}</p>
        <div class="mentions-strip">
          <button v-for="{ work, index } in active.mentions" :key="index" type="button" class="mention" @click="open(index)">
            <span class="mention-media">
              <img :src="resolveCmsUrl(work.image!.src)" :alt="`${work.title} — ${work.author}`" loading="eager" />
            </span>
            <span class="mention-title">{{ work.title }}</span>
            <span class="mention-author">{{ work.author }}</span>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="current" class="lb" @click.self="close">
        <button type="button" class="lb-close" aria-label="Zamknij" @click="close">×</button>
        <!-- Telefon: prace w pasku przewijanym palcem. -->
        <div v-if="isTouch" ref="trackEl" class="lb-track" @scroll.passive="onTrackScroll">
          <figure v-for="(work, i) in works" :key="i" class="lb-figure lb-slide">
            <img :src="resolveCmsUrl(work.image!.src)" :alt="`${work.title} — ${work.author}`" loading="lazy" decoding="async" />
            <figcaption>
              <span class="award" :class="`award-${work.award}`">{{ awardLabel(work.award) }}</span>
              <strong>{{ work.title }}</strong>
              <span>{{ work.author }}<template v-if="work.category"> · {{ work.category }}</template></span>
            </figcaption>
          </figure>
        </div>
        <button v-if="works.length > 1 && !isTouch" type="button" class="lb-nav lb-prev" aria-label="Poprzednia praca" @click="step(-1)">‹</button>
        <figure v-if="!isTouch" class="lb-figure">
          <img :src="resolveCmsUrl(current.image!.src)" :alt="`${current.title} — ${current.author}`" />
          <figcaption>
            <span class="award" :class="`award-${current.award}`">{{ awardLabel(current.award) }}</span>
            <strong>{{ current.title }}</strong>
            <span>{{ current.author }}<template v-if="current.category"> · {{ current.category }}</template></span>
          </figcaption>
        </figure>
        <button v-if="works.length > 1 && !isTouch" type="button" class="lb-nav lb-next" aria-label="Następna praca" @click="step(1)">›</button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.laureates {
  margin-top: 4.5rem;
  padding-top: 3.5rem;
  border-top: 1px solid #e3ded1;
}

.laureates-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem 2rem;
  margin-bottom: 2rem;
}

.laureates-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  font-weight: 600;
  line-height: 1.15;
  color: var(--text-title);
}

.laureates-tabs {
  display: flex;
  gap: 0.35rem;
  padding: 0.3rem;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(26, 36, 32, 0.07);
  overflow-x: auto;
  scrollbar-width: none;
}

.laureates-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 0.55rem 1.1rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-body);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tab.active {
  background: var(--amber);
  color: #fff;
}

.laureates-panel {
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* --- Podium --- */
.podium {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  height: clamp(420px, 46vw, 600px);
}

.podium-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.podium-2 {
  grid-template-rows: 1fr;
}

.work {
  position: relative;
  overflow: hidden;
  padding: 0;
  border: none;
  border-radius: 18px;
  background: #1a2420;
  font: inherit;
  text-align: left;
  cursor: zoom-in;
}

.work-main {
  grid-row: 1 / -1;
}

.work img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s ease;
}

.work:hover img {
  transform: scale(1.04);
}

.work-caption {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  padding: 3.5rem 1.4rem 1.2rem;
  background: linear-gradient(to top, rgba(8, 12, 10, 0.82), rgba(8, 12, 10, 0));
  color: #fff;
}

.work-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.25;
}

.work-main .work-title {
  font-size: clamp(1.25rem, 2.2vw, 1.7rem);
}

.work-author {
  font-size: 0.85rem;
  opacity: 0.85;
}

.award {
  display: inline-block;
  margin-bottom: 0.2rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
}

.award-i-miejsce {
  background: linear-gradient(135deg, #d4ae3a, #9a7a12);
}

.award-ii-miejsce {
  background: linear-gradient(135deg, #b9c0c5, #6f787f);
}

.award-iii-miejsce {
  background: linear-gradient(135deg, #c98450, #8f5128);
}

/* --- Wyróżnienia --- */
.mentions {
  margin-top: 1.75rem;
}

.mentions-label {
  margin: 0 0 0.8rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--amber);
}

.mentions-strip {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

.mention {
  flex: 0 0 clamp(200px, 22vw, 260px);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
  cursor: zoom-in;
  scroll-snap-align: start;
}

.mention-media {
  display: block;
  overflow: hidden;
  margin-bottom: 0.55rem;
  border-radius: 12px;
  aspect-ratio: 4 / 3;
  background: #1a2420;
}

.mention-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.mention:hover .mention-media img {
  transform: scale(1.05);
}

.mention-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-title);
}

.mention-author {
  font-size: 0.8rem;
  color: var(--text-body);
}

/* Tablet i telefon: zwycięzca na całą szerokość, II i III obok siebie. */
@media (max-width: 900px) {
  .podium {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    height: auto;
  }

  .podium-1 {
    grid-template-columns: 1fr;
  }

  .work {
    aspect-ratio: 4 / 3;
  }

  .work-main {
    grid-column: 1 / -1;
    grid-row: auto;
    aspect-ratio: 16 / 11;
  }

  .work:not(.work-main) .work-caption {
    padding: 2.5rem 0.8rem 0.75rem;
  }

  .work:not(.work-main) .work-title {
    font-size: 0.88rem;
  }

  .work:not(.work-main) .work-author {
    font-size: 0.75rem;
  }
}

@media (max-width: 600px) {
  .laureates {
    margin-top: 3rem;
    padding-top: 2.5rem;
  }

  .laureates-tabs {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    width: 100%;
    overflow: visible;
  }

  .tab {
    padding: 0.55rem 0.4rem;
    font-size: 0.74rem;
    line-height: 1.2;
    white-space: normal;
    text-align: center;
  }

  .podium {
    gap: 0.6rem;
  }

  .work {
    border-radius: 12px;
  }

  .mention {
    flex-basis: 62%;
  }
}

/* --- Duży podgląd --- */
.lb {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 4.5rem;
  background: rgba(6, 10, 14, 0.96);
  backdrop-filter: blur(8px);
}

.lb-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
}

.lb-figure img {
  max-width: 100%;
  max-height: calc(100dvh - 12rem);
  object-fit: contain;
  border-radius: 6px;
}

.lb-figure figcaption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
}

.lb-figure figcaption strong {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: #fff;
}

.lb-track {
  position: absolute;
  inset: 0;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.lb-track::-webkit-scrollbar {
  display: none;
}

.lb-slide {
  flex: 0 0 100%;
  justify-content: center;
  padding: 3.5rem 0.75rem 2rem;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

.lb-slide img {
  max-height: calc(100dvh - 13rem);
}

.lb-close,
.lb-nav {
  position: fixed;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  line-height: 1;
  cursor: pointer;
}

.lb-close {
  z-index: 2;
  top: 1.25rem;
  right: 1.5rem;
  width: 42px;
  height: 42px;
  font-size: 1.4rem;
}

.lb-nav {
  top: 50%;
  width: 52px;
  height: 52px;
  font-size: 1.8rem;
  transform: translateY(-50%);
}

.lb-prev {
  left: 1rem;
}

.lb-next {
  right: 1rem;
}

@media (max-width: 700px) {
  .lb {
    padding: 3.5rem 0.75rem;
  }

  .lb-nav {
    width: 42px;
    height: 42px;
    font-size: 1.4rem;
  }

  .lb-prev {
    left: 0.4rem;
  }

  .lb-next {
    right: 0.4rem;
  }
}
</style>
