<script setup lang="ts">
const { data } = useCmsCollection<EventItem>('events', { order: 'id' })
const events = computed(() => (data.value?.records ?? []).filter((e) => e.tag !== 'sport').slice(0, 3))
</script>

<template>
  <section id="wydarzenia" class="events">
    <div class="section-head-row">
      <div>
        <span class="kicker">Kalendarz</span>
        <h2>Wyróżnione wydarzenia</h2>
      </div>
      <NuxtLink to="/aktualnosci" class="all-link">Zobacz wszystkie wydarzenia</NuxtLink>
    </div>

    <div class="grid">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :image="resolveCmsUrl(event.image?.src)"
        :title="event.title"
        :date="event.date"
        :time="event.time"
        :place="event.place"
        :free-entry="event.freeEntry"
        more-href="#wydarzenia"
        :tickets-href="event.ticketsHref"
      />
    </div>
  </section>
</template>

<style scoped>
.events {
  scroll-margin-top: 110px;
  background: var(--mist);
  padding: 5rem 3rem;
}

.section-head-row {
  max-width: 1200px;
  margin: 0 auto 2.5rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--ink);
}

.all-link {
  color: var(--amber);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
}

.all-link:hover {
  text-decoration: underline;
}

.grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 900px) {
  .events {
    padding: 3rem 1.5rem;
  }

  .section-head-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
