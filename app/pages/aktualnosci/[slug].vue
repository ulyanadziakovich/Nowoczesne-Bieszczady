<script setup lang="ts">
const route = useRoute()
const page = await usePageTexts('strona-aktualnosci')
usePageTheme(page)
const common = await usePageTexts('site-settings')
const { data } = await useCmsCollection<NewsPost>('news', { order: 'id:desc' })
const post = computed(() => data.value?.records.find((p) => p.slug === route.params.slug))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: page.t('notFound') })
}

useHead({ title: () => [post.value?.title, page.t('pageTitle'), common.t('siteName')].filter(Boolean).join(' — ') })

const bodyParagraphs = computed(() => (post.value?.body || '').split(/\n\s*\n/).filter(Boolean))

// Treść to zwykły tekst — rozpoznajemy w niej strukturę, żeby nie była ścianą tekstu:
//  • akapit w całości pogrubiony (**…**) → śródtytuł,
//  • akapit, którego ostatnia linia zaczyna się od „– ” (np. „– powiedział …”) → cytat z podpisem.
type Block = { type: 'heading' | 'quote' | 'paragraph'; text: string; cite?: string }
const bodyBlocks = computed<Block[]>(() =>
  bodyParagraphs.value.map((raw) => {
    const text = raw.trim()
    const heading = text.match(/^\*\*([^*\n]+)\*\*$/)
    if (heading) return { type: 'heading', text: heading[1]!.trim() }
    const quote = text.match(/^([\s\S]+?)\n\s*([–—-]\s.{1,90})$/)
    if (quote) return { type: 'quote', text: quote[1]!.trim(), cite: quote[2]!.trim() }
    return { type: 'paragraph', text }
  }),
)
const gallery = computed(() => galleryImages(post.value))

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
          <template v-for="(block, i) in bodyBlocks" :key="i">
            <h2 v-if="block.type === 'heading'" class="article-subheading">{{ block.text }}</h2>
            <blockquote v-else-if="block.type === 'quote'" class="article-quote">
              <p v-html="formatParagraph(block.text)" />
              <cite>{{ block.cite }}</cite>
            </blockquote>
            <p v-else class="lead paragraph" :class="{ lede: i === 0 }" v-html="formatParagraph(block.text)" />
          </template>

          <section v-if="gallery.length" class="article-gallery">
            <div class="gallery-head">
              <h2>{{ page.t('galleryTitle') }}</h2>
              <span class="gallery-count">{{ page.plural('photos', gallery.length) }}</span>
            </div>
            <GalleryLightbox :images="gallery" :alt-prefix="post.title" layout="mosaic" />
          </section>

          <NuxtLink to="/aktualnosci" class="back-link">{{ page.t('backLink') }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.article-subheading {
  margin: 2.6rem 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.6vw, 1.6rem);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-title);
}

.article-subheading::before {
  content: '';
  display: block;
  width: 32px;
  height: 2px;
  margin-bottom: 0.9rem;
  background: var(--amber);
}

.article-quote {
  margin: 1.8rem 0;
  padding: 0.3rem 0 0.3rem 1.4rem;
  border-left: 3px solid var(--amber);
}

.article-quote p {
  margin: 0 0 0.6rem;
  font-family: var(--font-display);
  font-size: clamp(1.08rem, 2vw, 1.25rem);
  font-style: italic;
  line-height: 1.6;
  color: var(--text-title);
  white-space: pre-line;
}

.article-quote cite {
  font-size: 0.85rem;
  font-style: normal;
  font-weight: 700;
  color: var(--amber);
}

@media (max-width: 600px) {
  .article-quote {
    margin: 1.4rem 0;
    padding-left: 1rem;
  }
}

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

.article-gallery {
  margin: 2.5rem 0 2rem;
}

.gallery-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e4dfd2;
}

.gallery-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--ink);
}

.gallery-count {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--amber);
}
</style>
