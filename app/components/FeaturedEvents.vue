<script setup lang="ts">
const events = [
  {
    title: 'Rajd Rowerowy Bieszczady',
    date: '14 czerwca 2026',
    time: '09:00',
    place: 'Ustrzyki Dolne, Rynek',
    image: '/images/bieszczady.avif',
    freeEntry: true,
  },
  {
    title: 'Warsztaty Fotografii Górskiej',
    date: '22 czerwca 2026',
    time: '16:00',
    place: 'Dom Kultury, Ustrzyki Dolne',
    image: '/images/hero.avif',
    freeEntry: true,
  },
  {
    title: 'Koncert pod Gwiazdami',
    date: '5 lipca 2026',
    time: '20:00',
    place: 'Amfiteatr, Ustrzyki Dolne',
    image: '/images/bieszczady.avif',
    freeEntry: false,
    ticketsHref: '#bilety',
  },
]
</script>

<template>
  <section id="wydarzenia" class="events">
    <div class="header">
      <h2>Wyróżnione wydarzenia</h2>
      <a href="#" class="all-link">Zobacz wszystkie wydarzenia</a>
    </div>

    <div class="grid">
      <EventCard
        v-for="event in events"
        :key="event.title"
        :image="event.image"
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

.header {
  max-width: 1200px;
  margin: 0 auto 2.5rem;
  display: flex;
  align-items: baseline;
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

  .header {
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
