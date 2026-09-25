<script setup lang="ts">
definePageMeta({ solidHeader: true })
useHead({ title: 'Kultura i wydarzenia — Nowoczesne Bieszczady' })

const { data: editionsData } = await useCmsCollection<FestivalEdition>('festival-editions', { order: 'year:desc' })
const festivalEditions = computed(() => editionsData.value?.records ?? [])

const { data: contestsData } = await useCmsCollection<Contest>('contests')
// Painting contest hidden for now — kept in the CMS, just not shown here.
const contests = computed(() => (contestsData.value?.records ?? []).filter((c) => !c.title.toLowerCase().includes('malarski')))

const content = usePageContent()

const heroStats = computed(() => [`${festivalEditions.value.length} edycji festiwalu`, `${contests.value.length} cykliczne konkursy`, 'Wydarzenia co roku'])

const cultureStats = computed(() => [
  { label: 'Edycji festiwalu', value: String(festivalEditions.value.length) },
  ...content.pairs('kultura-stats'),
  { label: 'Konkursy cykliczne', value: String(contests.value.length) },
])

function descriptionParagraphs(text: string) {
  return text.split(/\n\s*\n/).filter(Boolean)
}

// `**word**` in a description becomes a bold sub-heading line — the field is
// plain text, so this is the only formatting it supports, and only ever
// comes from content we write ourselves (never user input).
function formatParagraph(text: string) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

// Entry form / participant statement / rules — only the photo contest has
// these right now, keyed generically in page-content so no schema change
// was needed to add them.
const photoContestDocuments = computed(() =>
  [
    { key: 'konkurs-fotograficzny-karta' },
    { key: 'konkurs-fotograficzny-oswiadczenie' },
    { key: 'konkurs-fotograficzny-regulamin' },
  ]
    .map((d) => ({ title: content.title(d.key), url: resolveCmsUrl(content.image(d.key)) }))
    .filter((d) => d.url),
)

const photoContestFacts = computed(() => content.pairs('konkurs-fotograficzny-fakty'))

const FACT_STYLE: Record<string, { color: string; icon: string }> = {
  Kategorie: { color: '#1f6fa8', icon: 'landscape' },
  'Zdjęcia na osobę': { color: 'var(--alpine)', icon: 'photos' },
  'Termin zgłoszeń': { color: 'var(--amber)', icon: 'calendar' },
  'Gala i nagrody': { color: '#8a4a2e', icon: 'trophy' },
}

function factStyle(label: string) {
  return FACT_STYLE[label] ?? { color: 'var(--alpine)', icon: 'landscape' }
}

function isPhotoContest(contest: Contest) {
  return contest.title.toLowerCase().includes('fotograficzny')
}

const announcementText =
  'Z dumą zapraszamy na Festiwal „Granie Bez Granic” — nowe wydarzenie, którego jesteśmy organizatorem. Połączenie koncertów, astronomii i ekologii, w sercu Ustrzyk Dolnych, tam gdzie niebo naprawdę jest ciemne.'
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
          <NuxtLink v-for="edition in festivalEditions" :key="edition.id" :to="`/kultura/edycje/${edition.slug}`" class="edition-card card-surface">
            <div class="edition-image-wrap">
              <img :src="resolveCmsUrl(edition.image?.src)" :alt="edition.title" />
              <span v-if="edition.featured" class="featured-badge">Najnowsza</span>
            </div>
            <div class="edition-body">
              <span class="year">{{ edition.year }}</span>
              <h3>{{ edition.title }}</h3>
              <p>{{ edition.description }}</p>
              <span class="link">Zobacz opis i galerię →</span>
            </div>
          </NuxtLink>

          <!-- Not an edition — a standalone announcement for the upcoming
               festival, shown alongside them in the same grid/card style. -->
          <article class="edition-card card-surface announcement-card">
            <div class="edition-image-wrap announcement-image-wrap">
              <img
                :src="resolveCmsUrl('/uploads/festival-editions/granie-bez-granic-2026-zapowiedz.jpg')"
                alt="Zapowiedź: Festiwal Granie Bez Granic, 12–13 lipca, Bieszczadzkie Centrum Dziedzictwa Kulturowego „Fanto”"
                class="announcement-image"
              />
              <span class="featured-badge">Zapowiedź</span>
            </div>
            <div class="edition-body">
              <p class="announcement-text">{{ announcementText }}</p>
            </div>
          </article>
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

        <div
          v-for="(contest, i) in contests"
          :key="contest.id"
          class="two-col contest-row"
          :class="{ reverse: i % 2 === 1 }"
        >
          <img :src="resolveCmsUrl(contest.image?.src)" :alt="contest.title" class="side-image" />
          <div>
            <h3 class="contest-title">{{ contest.title }}</h3>
            <p class="lead paragraph" v-html="formatParagraph(descriptionParagraphs(contest.description)[0])" />

            <div v-if="isPhotoContest(contest) && photoContestFacts.length" class="fact-grid">
              <div
                v-for="fact in photoContestFacts"
                :key="fact.label"
                class="fact-item"
                :style="{ '--fact-color': factStyle(fact.label).color }"
              >
                <span class="fact-icon">
                  <svg v-if="factStyle(fact.label).icon === 'landscape'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="8.5" cy="9.5" r="1.5" />
                    <path d="M21 16l-5.5-5.5L11 15l-2.5-2.5L3 18" />
                  </svg>
                  <svg v-else-if="factStyle(fact.label).icon === 'photos'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="7" y="7" width="14" height="14" rx="2" />
                    <path d="M17 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
                  </svg>
                  <svg v-else-if="factStyle(fact.label).icon === 'calendar'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M8 3v4M16 3v4M3 10h18" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3" />
                  </svg>
                </span>
                <span class="fact-label">{{ fact.label }}</span>
                <span class="fact-value">{{ fact.value }}</span>
              </div>
            </div>

            <p
              v-for="(paragraph, j) in descriptionParagraphs(contest.description).slice(1)"
              :key="j"
              class="lead paragraph"
              v-html="formatParagraph(paragraph)"
            />
            <p v-if="contest.fundingNote" class="funding-note">{{ contest.fundingNote }}</p>

            <div v-if="isPhotoContest(contest) && photoContestDocuments.length" class="documents">
              <p class="documents-label">Dokumenty do pobrania</p>
              <div v-for="doc in photoContestDocuments" :key="doc.url" class="document-row">
                <span class="document-name">
                  <svg class="document-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                    <path d="M14 2v5h5" />
                  </svg>
                  {{ doc.title }}
                </span>
                <div class="document-actions">
                  <a :href="doc.url" target="_blank" rel="noopener" class="doc-btn">Podgląd</a>
                  <a :href="doc.url" download class="doc-btn doc-btn-solid">Pobierz</a>
                </div>
              </div>
            </div>

            <NuxtLink to="/aktualnosci" class="link">Śledź aktualności →</NuxtLink>
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

.edition-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.edition-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px rgba(26, 36, 32, 0.14);
}

.edition-image-wrap {
  position: relative;
  overflow: hidden;
  background: var(--stone);
}

.edition-image-wrap img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.edition-card:hover img {
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

.edition-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.year {
  color: var(--amber);
  font-weight: 800;
  font-size: 0.85rem;
}

.edition-body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
}

.edition-body p {
  margin: 0;
  color: #5a6a62;
  font-size: 0.88rem;
  line-height: 1.5;
  /* Card teaser only — the same field also fills the full detail-page
     article body, so the card itself always stays compact. */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.edition-body p.funding-note {
  color: #8a938c;
  font-size: 0.76rem;
  line-height: 1.5;
  padding-top: 0.25rem;
  border-top: 1px solid #eee9dd;
}

/* Konkursy — plain editorial rows (image + text, alternating sides)
   instead of boxed tiles, so the section reads like normal page copy. */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
  align-items: center;
}

.two-col.reverse {
  grid-template-columns: 1.2fr 1fr;
}

.two-col.reverse > *:first-child {
  order: 1;
}

.two-col.reverse > *:last-child {
  order: 2;
}

.contest-row {
  margin-top: 3.5rem;
  padding-top: 3.5rem;
  border-top: 1px solid #e3ded1;
}

.section-head + .contest-row {
  margin-top: 3rem;
  padding-top: 0;
  border-top: none;
}

.contest-title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--ink);
}

.contest-row .paragraph {
  margin: 0 0 1.1rem;
  white-space: pre-line;
}

.contest-row .paragraph strong {
  display: inline-block;
  margin-bottom: 0.15rem;
  color: var(--alpine);
  font-weight: 800;
}

.contest-row .paragraph:last-of-type {
  margin-bottom: 0;
}

.side-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 18px;
  box-shadow: 0 20px 44px rgba(26, 36, 32, 0.14);
}

.contest-row .funding-note {
  color: #8a938c;
  font-size: 0.85rem;
  line-height: 1.5;
  padding-top: 1rem;
  margin-top: 1.25rem;
  border-top: 1px solid #eee9dd;
}

.contest-row .link {
  display: inline-block;
  margin-top: 1.25rem;
}

.fact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin: 1.35rem 0;
}

.fact-item {
  position: relative;
  background: var(--mist);
  border-radius: 12px;
  padding: 0.9rem 1rem 0.9rem 1.1rem;
  border-left: 3px solid var(--fact-color);
  transition: transform 0.15s;
}

.fact-item:hover {
  transform: translateY(-2px);
}

.fact-icon {
  display: flex;
  color: var(--fact-color);
  margin-bottom: 0.5rem;
}

.fact-label {
  display: block;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--fact-color);
  margin-bottom: 0.3rem;
}

.fact-value {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--ink);
}

@media (max-width: 480px) {
  .fact-grid {
    grid-template-columns: 1fr;
  }
}

.documents {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #eee9dd;
}

.documents-label {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--amber);
}

.document-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
}

.document-row:not(:last-child) {
  border-bottom: 1px solid #eee9dd;
}

.document-name {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ink);
}

.document-icon {
  flex-shrink: 0;
  color: var(--amber);
}

.document-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.doc-btn {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  border: 1.5px solid var(--ink);
  color: var(--ink);
  transition:
    background 0.15s,
    color 0.15s;
}

.doc-btn:hover {
  background: var(--ink);
  color: #fff;
}

.doc-btn-solid {
  background: var(--amber);
  border-color: var(--amber);
  color: #fff;
}

.doc-btn-solid:hover {
  background: #a8551f;
  border-color: #a8551f;
}

@media (max-width: 480px) {
  .document-row {
    flex-wrap: wrap;
    padding: 0.75rem 0;
  }

  .document-actions {
    width: 100%;
  }

  .doc-btn {
    flex: 1;
    justify-content: center;
    padding: 0.55rem 0.85rem;
  }
}

@media (max-width: 900px) {
  .two-col,
  .two-col.reverse {
    grid-template-columns: 1fr;
  }

  .two-col.reverse > *:first-child {
    order: 2;
  }

  .two-col.reverse > *:last-child {
    order: 1;
  }

  .contest-row {
    margin-top: 2.5rem;
    padding-top: 2.5rem;
  }

  .contest-title {
    font-size: 1.35rem;
  }

  .fact-grid {
    margin: 1.1rem 0;
  }

  /* Archiwum edycji — horizontal scroll carousel instead of a stacked
     single column, matching the same pattern used elsewhere on the site
     (FeatureTiles, FeaturedEvents). */
  .grid-3 {
    display: flex;
    grid-template-columns: unset;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    margin: 0 -1.5rem;
    padding: 0 1.5rem;
    scroll-padding-left: 1.5rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .grid-3::-webkit-scrollbar {
    display: none;
  }

  .grid-3 :deep(.edition-card) {
    flex: 0 0 82%;
    scroll-snap-align: start;
  }

  .grid-3 :deep(.edition-card:last-child) {
    margin-right: 0.5rem;
  }
}

/* Preserves the line breaks from the original announcement text instead
   of collapsing it into one dense block. */
.announcement-text {
  white-space: pre-line;
}

/* Not a link — no lift/shadow hover or pointer cursor, that would imply
   it's clickable. */
.announcement-card {
  cursor: default;
}

.announcement-card:hover {
  transform: none;
  box-shadow: inherit;
}

/* The banner has its own baked-in text/logo — cropping any of it off
   would break the design, so it's shown whole instead of filling a
   fixed-height box. */
.announcement-image-wrap {
  background: #060a14;
}

.announcement-image {
  height: auto !important;
  object-fit: contain !important;
}

.link {
  margin-top: auto;
  padding-top: 0.5rem;
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
