<script setup lang="ts">
definePageMeta({ solidHeader: true })
useHead({ title: 'Korona Ustrzyckich Gór — Nowoczesne Bieszczady' })

const { data: peaksData } = await useCmsCollection<Peak>('peaks', { order: 'order' })
const peaks = computed(() => peaksData.value?.records ?? [])

const { data: eventsData } = await useCmsCollection<EventItem>('events')
const sportEvents = computed(() => (eventsData.value?.records ?? []).filter((e) => e.tag === 'sport'))

const content = usePageContent()

const routeStats = computed(() => [{ label: 'Szczytów w pętli', value: String(peaks.value.length) }, ...content.pairs('korona-gor-stats')])
const heroStats = computed(() => [`${peaks.value.length} szczytów w pętli`, ...content.pairs('korona-gor-stats').map((p) => p.value)])
</script>

<template>
  <div>
    <PageHero
      variant="light"
      kicker="Turystyka górska"
      title="Korona Ustrzyckich Gór"
      :description="content.body('korona-gor-hero-description')"
      :stats="heroStats"
    />

    <section class="section">
      <div class="container">
        <div class="stat-bar">
          <div v-for="stat in routeStats" :key="stat.label" class="stat-tile">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Pięć szczytów, jedna pętla</span>
          <h2 class="section-title">Szczyty do zdobycia</h2>
          <p class="lead">{{ content.body('korona-gor-intro') }}</p>
        </div>

        <div class="timeline">
          <div v-for="(peak, i) in peaks" :key="peak.id" class="timeline-item">
            <div class="node-col">
              <span class="node">{{ i + 1 }}</span>
            </div>
            <div class="node-card">
              <span class="elevation">{{ peak.elevation }} m n.p.m.</span>
              <h3>{{ peak.name }}</h3>
              <p>{{ peak.note }}</p>
              <span v-if="peak.tower" class="tower-badge">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M8 21h8M9 21l1-14M15 21l-1-14M7 7h10L12 3 7 7zM8.5 11h7M9 15h6" />
                </svg>
                Wieża widokowa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Wydarzenia sportowe</span>
          <h2 class="section-title">Rajdy i mecze terenowe</h2>
        </div>

        <div class="grid-2">
          <EventCard
            v-for="event in sportEvents"
            :key="event.id"
            :image="event.image"
            :title="event.title"
            :date="event.date"
            :time="event.time"
            :place="event.place"
            :free-entry="event.freeEntry"
            more-href="/aktualnosci"
            :tickets-href="event.ticketsHref"
          />
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

.timeline {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  margin-top: 1rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: repeating-linear-gradient(to right, #c7cfc8 0, #c7cfc8 6px, transparent 6px, transparent 12px);
  z-index: 0;
}

.timeline-item {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.node-col {
  display: flex;
}

.node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--alpine);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
  box-shadow: 0 8px 18px rgba(19, 94, 36, 0.35);
  flex-shrink: 0;
}

.node-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.elevation {
  color: var(--amber);
  font-weight: 800;
  font-size: 0.8rem;
}

.node-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--ink);
}

.node-card p {
  margin: 0;
  color: #5a6a62;
  font-size: 0.85rem;
  line-height: 1.55;
}

.tower-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: center;
  margin-top: 0.4rem;
  background: var(--mist);
  color: var(--alpine);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
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

  .timeline {
    flex-direction: column;
    gap: 0;
  }

  .timeline::before {
    top: 0;
    bottom: 0;
    left: 20px;
    right: auto;
    width: 2px;
    height: auto;
    background: repeating-linear-gradient(to bottom, #c7cfc8 0, #c7cfc8 6px, transparent 6px, transparent 12px);
  }

  .timeline-item {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    padding-bottom: 1.75rem;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }
}
</style>
