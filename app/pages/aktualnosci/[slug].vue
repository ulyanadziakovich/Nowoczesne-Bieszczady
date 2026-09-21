<script setup lang="ts">
const route = useRoute()
const { data } = await useCmsCollection<NewsPost>('news')
const post = computed(() => data.value?.records.find((p) => p.slug === route.params.slug))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono wpisu' })
}

useHead({ title: `${post.value.title} — Aktualności — Nowoczesne Bieszczady` })

const bodyParagraphs = computed(() => (post.value?.body || '').split(/\n\s*\n/).filter(Boolean))
</script>

<template>
  <div v-if="post">
    <PageHero :kicker="post.category" :title="post.title" :description="post.date" :image="post.image" />

    <section class="section">
      <div class="container article">
        <p v-for="(paragraph, i) in bodyParagraphs" :key="i" class="lead paragraph">{{ paragraph }}</p>

        <NuxtLink to="/aktualnosci" class="back-link">← Wróć do aktualności</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.article {
  max-width: 720px;
}

.paragraph {
  margin: 0 0 1.25rem;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
}
</style>
