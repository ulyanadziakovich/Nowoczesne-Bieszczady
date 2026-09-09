<script setup lang="ts">
const tiles = [
  {
    title: 'Edukacja',
    description: 'Programy i szkolenia z outdoor leadership oraz nowych technologii w górach.',
    image: '/images/bieszczady.avif',
    back: 'Warsztaty, szkolenia i mentoring dla mieszkańców regionu — od kompetencji cyfrowych po liderstwo w terenie. Uczymy się razem, żeby działać skuteczniej.',
    moreHref: '#edukacja',
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
    partnerImage: '/images/partner-bieszczady-plus.jpg',
    partnerHref: 'https://bieszczady.plus/odkrywaj',
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
      :back="tile.back"
      :more-href="tile.moreHref"
      :partner-image="tile.partnerImage"
      :partner-href="tile.partnerHref"
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
    gap: 1rem;
    margin: -3rem 0 1.5rem;
    padding: 0;
    scroll-padding-left: 1.25rem;
  }

  .tiles :deep(.tile) {
    flex: 0 0 74%;
    scroll-snap-align: start;
  }

  .tiles :deep(.tile:first-child) {
    margin-left: 1.25rem;
  }

  .tiles :deep(.tile:last-child) {
    margin-right: 1.25rem;
  }
}
</style>
