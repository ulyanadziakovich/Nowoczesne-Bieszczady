<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Statut Stowarzyszenia — O nas — Nowoczesne Bieszczady' })

const content = usePageContent()
</script>

<template>
  <div>
    <h2>Statut Stowarzyszenia</h2>
    <p>{{ content.body('statut-intro') }}</p>

    <a :href="content.image('statut-intro')" class="btn btn-amber" download>Pobierz Statut (PDF)</a>

    <div class="statut-preview card-surface">
      <p class="placeholder-note">{{ content.body('statut-placeholder-note') }}</p>
    </div>
  </div>
</template>

<style scoped>
.btn {
  margin: 0.5rem 0 2rem;
}

.statut-preview {
  padding: 2rem;
}

.placeholder-note {
  margin: 0;
  color: #8a938c;
  font-style: italic;
  font-size: 0.92rem;
}
</style>
