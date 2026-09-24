<script setup lang="ts">
const { data } = useCmsCollection<NewsPost>('news', { order: 'id:desc' })
const posts = computed(() => (data.value?.records ?? []).slice(0, 3))
</script>

<template>
  <section id="aktualnosci" class="events">
    <div class="section-head-row">
      <div>
        <span class="kicker">Blog</span>
        <h2>Najnowsze aktualności</h2>
      </div>
      <NuxtLink to="/aktualnosci" class="all-link">Zobacz wszystkie aktualności</NuxtLink>
    </div>

    <div class="grid">
      <NuxtLink v-for="post in posts" :key="post.slug" :to="`/aktualnosci/${post.slug}`" class="card post-card">
        <img :src="resolveCmsUrl(post.image?.src)" :alt="post.title" class="image" />
        <div class="body">
          <span class="meta">{{ post.date }} · {{ post.category }}</span>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt }}</p>
          <span class="link">Czytaj więcej →</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.events {
  scroll-margin-top: 110px;
  background: var(--mist);
  padding: 5rem 3rem;
}

.section-head-row {
  max-width: 1200px;
  margin: 0 auto 2.5rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--ink);
}

.all-link {
  color: var(--amber);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
}

.all-link:hover {
  text-decoration: underline;
}

.grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.post-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.08);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 48px rgba(26, 36, 32, 0.14);
}

.post-card .image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.post-card:hover .image {
  transform: scale(1.06);
}

.post-card .body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.post-card .meta {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--amber);
  text-transform: uppercase;
}

.post-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.35;
}

.post-card p {
  margin: 0;
  color: #5a6a62;
  font-size: 0.88rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card .link {
  margin-top: auto;
  padding-top: 0.5rem;
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .events {
    padding: 3rem 1.5rem;
  }

  .section-head-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  .grid {
    display: flex;
    grid-template-columns: unset;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    margin: 0 -1.5rem;
    padding: 0 1.5rem;
    scroll-padding-left: 1.5rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .grid::-webkit-scrollbar {
    display: none;
  }

  .grid :deep(.card) {
    flex: 0 0 82%;
    scroll-snap-align: start;
  }
}
</style>
