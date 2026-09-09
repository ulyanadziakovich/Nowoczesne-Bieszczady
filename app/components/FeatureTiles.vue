<script setup lang="ts">
const tiles = [
  {
    title: 'Edukacja',
    description: 'Programy i szkolenia z outdoor leadership oraz nowych technologii w górach.',
    image: '/images/bieszczady.avif',
  },
  {
    title: 'Wydarzenia',
    description: 'Innowacja. Edukacja. Przygoda w górach.',
    image: '/images/bieszczady.avif',
    image2: '/images/hero.avif',
    buttonLabel: 'Kalendarz Wydarzeń',
  },
  {
    title: 'Turystyka',
    description: 'Dynamiczne trasy rowerowe i piesze odkrywające Bieszczady na nowo.',
    image: '/images/bieszczady.avif',
  },
]
</script>

<template>
  <section class="tiles">
    <FeatureTile
      v-for="tile in tiles"
      :key="tile.title"
      :image="tile.image"
      :image2="tile.image2"
      :title="tile.title"
      :description="tile.description"
      :button-label="tile.buttonLabel"
    />
  </section>
</template>

<style scoped>
.tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: -4rem auto 4rem;
  padding: 0 1.5rem;
  position: relative;
}

@media (max-width: 900px) {
  .tiles {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    margin-top: -2.5rem;
    padding: 0 1.5rem;
  }

  .tiles :deep(.tile) {
    flex: 0 0 85%;
    scroll-snap-align: start;
  }
}
</style>
