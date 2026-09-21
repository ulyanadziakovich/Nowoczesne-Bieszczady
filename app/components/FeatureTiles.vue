<script setup lang="ts">
const { data } = await useCmsCollection<FlagshipTile>('flagship-tiles', { order: 'order' })
const tiles = computed(() => data.value?.records ?? [])
</script>

<template>
  <section class="tiles">
    <FeatureTile
      v-for="tile in tiles"
      :key="tile.id"
      :image="tile.image"
      :title="tile.title"
      :description="tile.description"
      :back="tile.back"
      :more-href="tile.moreHref"
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
