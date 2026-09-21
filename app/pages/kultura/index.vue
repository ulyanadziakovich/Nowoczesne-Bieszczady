<script setup lang="ts">
definePageMeta({ solidHeader: true })
useHead({ title: 'Kultura i wydarzenia — Nowoczesne Bieszczady' })

const { data: editionsData } = await useCmsCollection<FestivalEdition>('festival-editions', { order: 'year:desc' })
const festivalEditions = computed(() => editionsData.value?.records ?? [])

const { data: contestsData } = await useCmsCollection<Contest>('contests')
const contests = computed(() => contestsData.value?.records ?? [])

const content = usePageContent()

const heroStats = computed(() => [`${festivalEditions.value.length} edycji festiwalu`, `${contests.value.length} cykliczne konkursy`, 'Wydarzenia co roku'])

const cultureStats = computed(() => [
  { label: 'Edycji festiwalu', value: String(festivalEditions.value.length) },
  ...content.pairs('kultura-stats'),
  { label: 'Konkursy cykliczne', value: String(contests.value.length) },
])
</script>

<template>
  <div>
    <PageHero
      variant="light"
      kicker="Kultura"
      title="Kultura i wydarzenia"
      :description="content.body('kultura-hero-description')"
      :stats="heroStats"
    />

    <section class="section">
      <div class="container">
        <div class="stat-bar">
          <div v-for="stat in cultureStats" :key="stat.label" class="stat-tile">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Festiwal Granie Bez Granic</span>
          <h2 class="section-title">Archiwum edycji</h2>
          <p class="lead">Muzyczne wydarzenie łączące kultury i pokolenia — zobacz relacje z poprzednich edycji festiwalu.</p>
        </div>

        <div class="grid-3">
          <div v-for="edition in festivalEditions" :key="edition.id" class="edition-card card-surface">
            <div class="edition-image-wrap">
              <img :src="edition.image" :alt="edition.title" />
              <span v-if="edition.featured" class="featured-badge">Najnowsza</span>
            </div>
            <div class="edition-body">
              <span class="year">{{ edition.year }}</span>
              <h3>{{ edition.title }}</h3>
              <p>{{ edition.description }}</p>
              <a href="#" class="link">Zobacz relację foto/wideo →</a>
            </div>
          </div>
        </div>

        <div class="note-card">
          <div class="note-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M9 18V5l12-2v13M9 9l12-2M6 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm12-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
          </div>
          <div class="note-text">
            <span class="kicker">Nadchodząca edycja</span>
            <h3>{{ content.title('kultura-upcoming') }}</h3>
            <p>{{ content.body('kultura-upcoming') }}</p>
          </div>
          <NuxtLink to="/aktualnosci" class="btn btn-amber">Śledź aktualności</NuxtLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Konkursy</span>
          <h2 class="section-title">Konkursy fotograficzne i malarskie</h2>
        </div>

        <div class="grid-2">
          <div v-for="contest in contests" :key="contest.id" class="contest-card card-surface">
            <div class="contest-image-wrap">
              <img :src="contest.image" :alt="contest.title" />
            </div>
            <div class="contest-body">
              <h3>{{ contest.title }}</h3>
              <p>{{ contest.description }}</p>
              <a href="#" class="link">Zobacz galerię prac →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stat-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  background: linear-gradient(165deg, var(--ink-light) 0%, var(--ink) 65%);
  border-radius: 22px;
  padding: 2.25rem;
  box-shadow: 0 24px 60px rgba(26, 36, 32, 0.22);
}

.stat-tile {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-tile:last-child {
  border-right: none;
}

.stat-tile strong {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
}

.stat-tile span {
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.edition-card,
.contest-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.edition-card:hover,
.contest-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px rgba(26, 36, 32, 0.14);
}

.edition-image-wrap,
.contest-image-wrap {
  position: relative;
  overflow: hidden;
}

.edition-image-wrap img,
.contest-image-wrap img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.edition-card:hover img,
.contest-card:hover img {
  transform: scale(1.06);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--amber);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

.edition-body,
.contest-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.year {
  color: var(--amber);
  font-weight: 800;
  font-size: 0.85rem;
}

.edition-body h3,
.contest-body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
}

.edition-body p,
.contest-body p {
  margin: 0;
  color: #5a6a62;
  font-size: 0.88rem;
  line-height: 1.5;
}

.link {
  margin-top: 0.5rem;
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.82rem;
  text-decoration: none;
}

.note-card {
  margin-top: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--stone);
  border-left: 3px solid var(--amber);
  border-radius: 4px;
  padding: 2rem;
  flex-wrap: wrap;
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

.note-text {
  flex: 1;
  min-width: 220px;
}

.note-card .kicker {
  display: block;
  font-size: 0.75rem;
}

.note-card h3 {
  margin: 0.5rem 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.note-card p {
  margin: 0;
  color: #5a6a62;
}

@media (max-width: 900px) {
  .stat-bar {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 1.5rem;
  }

  .stat-tile:nth-child(2) {
    border-right: none;
  }

  .stat-tile:nth-child(-n + 2) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1.25rem;
  }

  .note-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
}
</style>
