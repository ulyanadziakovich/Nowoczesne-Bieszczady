<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Statut Stowarzyszenia — O nas — Nowoczesne Bieszczady' })

const content = usePageContent()
const pages = computed(() => (content.body('statut-galeria') || '').split('\n').map((s) => s.trim()).filter(Boolean))
</script>

<template>
  <div>
    <h2>Statut Stowarzyszenia</h2>
    <p>{{ content.body('statut-intro') }}</p>

    <div class="actions">
      <a :href="content.image('statut-intro')" class="btn btn-amber" download>Pobierz Statut (PDF)</a>
      <a :href="content.image('statut-intro')" target="_blank" rel="noopener" class="btn btn-outline">Otwórz w nowej karcie</a>
    </div>

    <p v-if="pages.length" class="pages-hint">Kliknij stronę, żeby ją powiększyć.</p>
    <GalleryLightbox :images="pages" alt-prefix="Statut Stowarzyszenia" layout="scroll" />
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0.5rem 0 1.5rem;
}

.pages-hint {
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  color: #8a938c;
}
</style>
