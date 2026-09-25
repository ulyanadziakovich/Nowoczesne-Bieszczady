<script setup lang="ts">
const route = useRoute()
const { data } = await useCmsCollection<NewsPost>('news')
const post = computed(() => data.value?.records.find((p) => p.slug === route.params.slug))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono wpisu' })
}

useHead({ title: `${post.value.title} — Aktualności — Nowoczesne Bieszczady` })

const bodyParagraphs = computed(() => (post.value?.body || '').split(/\n\s*\n/).filter(Boolean))
const gallery = computed(() => (post.value?.gallery || '').split('\n').map((s) => s.trim()).filter(Boolean))

// Plain text field, so this is the only formatting it supports:
// **word** → bold, and lines starting with "● " get a styled accent dot
// instead of a plain bullet character sitting flush in the text.
function formatParagraph(text: string) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const bolded = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return bolded
    .split('\n')
    .map((line) => {
      const m = line.match(/^●\s*(.*)$/)
      return m ? `<span class="bullet-line"><span class="bullet-dot">●</span>${m[1]}</span>` : line
    })
    .join('\n')
}
</script>

<template>
  <div v-if="post">
    <PageHero variant="light" :kicker="post.category" :title="post.title" :description="post.date" />

    <section class="section">
      <div class="container article-container">
        <img v-if="post.image" :src="resolveCmsUrl(post.image.src)" :alt="post.title" class="cover-image" />

        <div class="article">
          <p
            v-for="(paragraph, i) in bodyParagraphs"
            :key="i"
            class="lead paragraph"
            :class="{ lede: i === 0 }"
            v-html="formatParagraph(paragraph)"
          />

          <GalleryLightbox v-if="gallery.length" :images="gallery" :alt-prefix="post.title" />

          <NuxtLink to="/aktualnosci" class="back-link">← Wróć do aktualności</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.article-container {
  max-width: 780px;
}

.cover-image {
  width: 100%;
  max-height: 460px;
  object-fit: cover;
  display: block;
  border-radius: 18px;
  box-shadow: 0 20px 44px rgba(26, 36, 32, 0.14);
  margin-bottom: 2.5rem;
}

.article {
  max-width: 100%;
}

.paragraph {
  margin: 0 0 1.35rem;
  white-space: pre-line;
}

.paragraph.lede {
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--ink);
}

.paragraph strong {
  display: inline-block;
  margin: 0.2rem 0;
  color: var(--alpine);
  font-weight: 800;
}

.paragraph :deep(.bullet-line) {
  display: block;
  padding: 0.2rem 0;
}

.paragraph :deep(.bullet-dot) {
  display: inline-block;
  color: var(--amber);
  font-size: 0.65em;
  margin-right: 0.65rem;
  vertical-align: middle;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e3ded1;
  width: 100%;
  color: var(--alpine);
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
}

@media (max-width: 700px) {
  .cover-image {
    max-height: 260px;
    margin-bottom: 1.75rem;
  }

  .paragraph.lede {
    font-size: 1.05rem;
  }
}
</style>
