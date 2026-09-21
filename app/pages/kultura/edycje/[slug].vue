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

        <div v-if="gallery.length" class="gallery">
          <img v-for="(img, i) in gallery" :key="i" :src="img" :alt="`${edition.title} — zdjęcie ${i + 1}`" />
        </div>

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
}

.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.gallery img {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.1);
  display: block;
}

@media (max-width: 700px) {
  .gallery {
    grid-template-columns: 1fr;
  }
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
