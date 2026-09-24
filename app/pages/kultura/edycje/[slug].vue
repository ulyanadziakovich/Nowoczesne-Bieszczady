<script setup lang="ts">
definePageMeta({ solidHeader: true })

const route = useRoute()
const { data } = await useCmsCollection<FestivalEdition>('festival-editions')
const edition = computed(() => data.value?.records.find((e) => e.slug === route.params.slug))

if (!edition.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono edycji' })
}

useHead({ title: `${edition.value.title} — Granie Bez Granic — Nowoczesne Bieszczady` })

const gallery = computed(() => (edition.value?.gallery || '').split('\n').map((s) => s.trim()).filter(Boolean))
</script>

<template>
  <div v-if="edition">
    <PageHero variant="light" kicker="Festiwal Granie Bez Granic" :title="edition.title" :description="edition.year" />

    <section class="section">
      <div class="container article">
        <p class="lead paragraph">{{ edition.description }}</p>

        <GalleryLightbox :images="gallery" :alt-prefix="edition.title" />

        <NuxtLink to="/kultura" class="back-link">← Wróć do Kultury</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.article {
  max-width: 820px;
}

.paragraph {
  margin: 0 0 2rem;
  white-space: pre-line;
}

.back-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
}
</style>
