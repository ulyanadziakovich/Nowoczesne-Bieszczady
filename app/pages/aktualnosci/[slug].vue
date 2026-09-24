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
    <PageHero variant="light" :kicker="post.category" :title="post.title" :description="post.date" />

    <section class="section">
      <div class="container article-layout">
        <div class="article">
          <p v-for="(paragraph, i) in bodyParagraphs" :key="i" class="lead paragraph">{{ paragraph }}</p>

          <NuxtLink to="/aktualnosci" class="back-link">← Wróć do aktualności</NuxtLink>
        </div>

        <img v-if="post.image" :src="resolveCmsUrl(post.image.src)" :alt="post.title" class="article-image" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.article-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 3rem;
  align-items: start;
}

.article-image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.1);
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-image {
    order: -1;
    max-width: 320px;
    margin: 0 auto;
  }
}

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
