<script setup lang="ts">
// Wpisy z Aktualności, przy których w CMS zaznaczono tę podstronę
// („Pokaż także na podstronach”). Bez takich wpisów sekcja się nie pokazuje.
const props = withDefaults(defineProps<{ place: string; limit?: number; kicker?: string; title?: string }>(), { limit: 6 })

const { data } = useCmsCollection<NewsPost>('news', { order: 'id:desc' })
const common = usePageTextsSync('site-settings')
const posts = computed(() =>
  byCmsOrder(data.value?.records ?? [])
    .filter((p) => (p.showOn ?? []).includes(props.place))
    .slice(0, props.limit),
)
</script>

<template>
  <section v-if="posts.length" class="section related-news">
    <div class="container">
      <div class="related-head">
        <div>
          <span class="kicker">{{ kicker || common.t('relatedKicker') }}</span>
          <h2 class="section-title">{{ title || common.t('relatedTitle') }}</h2>
        </div>
        <NuxtLink to="/aktualnosci" class="related-all">{{ common.t('relatedAll') }}</NuxtLink>
      </div>
      <div class="grid-3">
        <NuxtLink v-for="post in posts" :key="post.slug" :to="`/aktualnosci/${post.slug}`" class="related-card card-surface">
          <img :src="resolveCmsUrl(post.image?.src)" :alt="post.title" loading="lazy" />
          <div class="related-body">
            <span class="related-meta">{{ post.date }} · {{ post.category }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <span class="related-link">{{ common.t('readMore') }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.related-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.related-all {
  color: var(--amber);
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
  white-space: nowrap;
}

.related-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.related-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.14);
}

.related-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.related-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.4rem 1.5rem;
}

.related-meta {
  color: var(--amber);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.related-body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  line-height: 1.3;
  color: var(--text-title);
}

.related-body p {
  margin: 0;
  color: var(--text-body);
  font-size: 0.9rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-link {
  margin-top: auto;
  padding-top: 0.4rem;
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.85rem;
}

@media (max-width: 700px) {
  .related-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
