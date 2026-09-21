<script setup lang="ts">
definePageMeta({ solidHeader: true })
useHead({ title: 'Aktualności — Nowoczesne Bieszczady' })

const { data } = await useCmsCollection<NewsPost>('news', { order: 'id:desc' })
const newsPosts = computed(() => data.value?.records ?? [])
const content = usePageContent()
</script>

<template>
  <div>
    <PageHero
      variant="light"
      kicker="Blog"
      title="Aktualności"
      :description="content.body('aktualnosci-hero-description')"
      :stats="[`${newsPosts.length} opublikowane wpisy`, 'Aktualizowane na bieżąco']"
    />

    <section class="section">
      <div class="container">
        <div class="grid-3">
          <NuxtLink v-for="post in newsPosts" :key="post.slug" :to="`/aktualnosci/${post.slug}`" class="post-card card-surface">
            <img :src="post.image" :alt="post.title" />
            <div class="body">
              <span class="meta">{{ post.date }} · {{ post.category }}</span>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
              <span class="link">Czytaj więcej →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.14);
}

.post-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.post-card:hover img {
  transform: scale(1.06);
}

.body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.meta {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--amber);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.body p {
  margin: 0;
  color: #5a6a62;
  font-size: 0.88rem;
  line-height: 1.5;
  flex: 1;
}

.link {
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.82rem;
}
</style>
