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
  return order.map((category) => ({ category, items: map.get(category)! }))
})

const openIndex = ref<number | null>(null)
const current = computed(() => (openIndex.value === null ? null : works.value[openIndex.value]))
function open(i: number) {
  openIndex.value = i
}
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
    <h3 v-if="title" class="laureates-title">{{ title }}</h3>

    <div v-for="group in groups" :key="group.category" class="laureates-group">
      <p v-if="group.category" class="laureates-category">{{ group.category }}</p>
      <div class="laureates-grid">
        <button v-for="{ work, index } in group.items" :key="index" type="button" class="work" @click="open(index)">
          <span class="work-media">
            <img :src="resolveCmsUrl(work.image!.src)" :alt="`${work.title} — ${work.author}`" loading="lazy" />
            <span class="award" :class="`award-${work.award}`">{{ awardLabel(work.award) }}</span>
          </span>
          <span class="work-title">{{ work.title }}</span>
          <span class="work-author">{{ work.author }}</span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="current" class="lb" @click.self="close">
        <button type="button" class="lb-close" aria-label="Zamknij" @click="close">×</button>
        <button v-if="works.length > 1" type="button" class="lb-nav lb-prev" aria-label="Poprzednia praca" @click="step(-1)">‹</button>
        <figure class="lb-figure">
          <img :src="resolveCmsUrl(current.image!.src)" :alt="`${current.title} — ${current.author}`" />
          <figcaption>
            <span class="award" :class="`award-${current.award}`">{{ awardLabel(current.award) }}</span>
            <strong>{{ current.title }}</strong>
            <span>{{ current.author }}<template v-if="current.category"> · {{ current.category }}</template></span>
          </figcaption>
        </figure>
        <button v-if="works.length > 1" type="button" class="lb-nav lb-next" aria-label="Następna praca" @click="step(1)">›</button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.laureates {
  margin-top: 3.5rem;
  padding-top: 3rem;
  border-top: 1px solid #e3ded1;
}

.laureates-title {
  margin: 0 0 1.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.8vw, 2.1rem);
  font-weight: 600;
  color: var(--text-title);
}

.laureates-group + .laureates-group {
  margin-top: 2.5rem;
}

.laureates-category {
  margin: 0 0 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--amber);
}

.laureates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.work {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.work-media {
  position: relative;
  display: block;
  overflow: hidden;
  margin-bottom: 0.65rem;
  border-radius: 14px;
  aspect-ratio: 4 / 3;
  background: #1a2420;
  box-shadow: 0 14px 34px rgba(26, 36, 32, 0.12);
}

.work-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.work:hover .work-media img {
  transform: scale(1.05);
}

.award {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(21, 29, 28, 0.78);
  backdrop-filter: blur(4px);
}

.work-media .award {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
}

.award-i-miejsce {
  background: linear-gradient(135deg, #c9a227, #9a7a12);
}

.award-ii-miejsce {
  background: linear-gradient(135deg, #a9b1b7, #6f787f);
}

.award-iii-miejsce {
  background: linear-gradient(135deg, #c27a45, #8f5128);
}

.work-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-title);
}

.work-author {
  font-size: 0.88rem;
  color: var(--text-body);
}

.lb {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 4.5rem;
  background: rgba(6, 10, 14, 0.94);
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
  .laureates-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .work-title {
    font-size: 0.92rem;
  }

  .work-author {
    font-size: 0.8rem;
  }

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
