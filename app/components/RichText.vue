<script setup lang="ts">
// Wyświetla dłuższy tekst z CMS z zachowaniem struktury (akapity, śródtytuły,
// listy, linki) — patrz parseRichText(). Pierwszy akapit jest wyróżniony.
// `html` = treść z edytora CMS (ma pierwszeństwo), `text` = zwykły tekst.
const props = withDefaults(defineProps<{ text?: string | null; html?: string | null; tone?: 'light' | 'dark'; lead?: boolean }>(), {
  text: '',
  html: '',
  tone: 'light',
  lead: true,
})

const safeHtml = computed(() => sanitizeCmsHtml(props.html))
const blocks = computed(() => (safeHtml.value ? [] : parseRichText(props.text)))
const firstParagraph = computed(() => blocks.value.findIndex((b) => b.type === 'paragraph'))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- treść z CMS, przefiltrowana w sanitizeCmsHtml() -->
  <div v-if="safeHtml" class="rich rich-html" :class="[`tone-${tone}`, { 'with-lead': lead }]" v-html="safeHtml" />
  <div v-else-if="blocks.length" class="rich" :class="`tone-${tone}`">
    <template v-for="(block, i) in blocks" :key="i">
      <h2 v-if="block.type === 'heading'" class="rich-heading">{{ block.text }}</h2>

      <p v-else-if="block.type === 'paragraph'" class="rich-p" :class="{ 'rich-lead': lead && i === firstParagraph }">
        <template v-for="(part, k) in splitUrls(block.text)" :key="k">
          <a v-if="part.url" :href="part.text" target="_blank" rel="noopener">{{ shortUrl(part.text) }}</a>
          <template v-else>{{ part.text }}</template>
        </template>
      </p>

      <ul v-else-if="block.type === 'list'" class="rich-list">
        <li v-for="(item, k) in block.items" :key="k">
          <span class="rich-list-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.text }}</span>
        </li>
      </ul>

      <ul v-else-if="block.type === 'links'" class="rich-links">
        <li v-for="(item, k) in block.items" :key="k">
          <a :href="item.url" target="_blank" rel="noopener">
            <span class="rich-link-label">{{ item.label }}</span>
            <span class="rich-link-go" aria-hidden="true">→</span>
          </a>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.rich {
  max-width: 720px;
  overflow-wrap: anywhere;
}

.rich-p {
  margin: 0 0 1rem;
  font-size: 1rem;
  line-height: 1.75;
}

.rich-p:last-child {
  margin-bottom: 0;
}

.rich-lead {
  font-size: 1.12rem;
  line-height: 1.7;
}

.rich-heading {
  margin: 2.2rem 0 0.8rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.3;
}

.rich-heading::before {
  content: '';
  display: block;
  width: 28px;
  height: 2px;
  margin-bottom: 0.8rem;
  background: #a9541f;
}

.rich-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0 0 1.2rem;
  padding: 0;
  list-style: none;
}

.rich-list li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem 0.45rem 0.7rem;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
}

.rich-list-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.rich-links {
  display: grid;
  gap: 0.5rem;
  margin: 0 0 1.2rem;
  padding: 0;
  list-style: none;
}

.rich-links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s, border-color 0.15s;
}

.rich-links a:hover {
  transform: translateX(3px);
}

.rich-link-go {
  flex-shrink: 0;
  font-weight: 700;
  color: #a9541f;
}

.rich-p a {
  color: #a9541f;
  font-weight: 600;
  text-underline-offset: 3px;
}

/* Treść z edytora CMS: te same style dla zwykłych znaczników HTML. */
.rich-html :deep(p) {
  margin: 0 0 1rem;
  font-size: 1rem;
  line-height: 1.75;
}

.rich-html.with-lead :deep(p:first-child) {
  font-size: 1.12rem;
  line-height: 1.7;
}

.rich-html :deep(h1),
.rich-html :deep(h2),
.rich-html :deep(h3),
.rich-html :deep(h4) {
  margin: 2.2rem 0 0.8rem;
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.3;
}

.rich-html :deep(h1),
.rich-html :deep(h2) {
  font-size: 1.35rem;
}

.rich-html :deep(h3),
.rich-html :deep(h4) {
  font-size: 1.12rem;
}

.rich-html :deep(h2)::before {
  content: '';
  display: block;
  width: 28px;
  height: 2px;
  margin-bottom: 0.8rem;
  background: #a9541f;
}

.rich-html :deep(ul),
.rich-html :deep(ol) {
  margin: 0 0 1.2rem;
  padding-left: 1.3rem;
  line-height: 1.7;
}

.rich-html :deep(li) {
  margin-bottom: 0.35rem;
}

.rich-html :deep(li::marker) {
  color: #a9541f;
}

.rich-html :deep(li p) {
  margin: 0;
}

.rich-html :deep(blockquote) {
  margin: 1.4rem 0;
  padding: 0.2rem 0 0.2rem 1.2rem;
  border-left: 3px solid #a9541f;
  font-style: italic;
}

.rich-html :deep(a) {
  color: #a9541f;
  font-weight: 600;
  text-underline-offset: 3px;
}

.rich-html :deep(:last-child) {
  margin-bottom: 0;
}

.tone-light.rich-html {
  color: #6c7173;
}

.tone-light.rich-html.with-lead :deep(p:first-child) {
  color: #566c71;
}

.tone-light.rich-html :deep(h1),
.tone-light.rich-html :deep(h2),
.tone-light.rich-html :deep(h3),
.tone-light.rich-html :deep(h4),
.tone-light.rich-html :deep(strong) {
  color: #151d1c;
}

.tone-dark.rich-html {
  color: #eef1ee;
}

.tone-dark.rich-html :deep(h1),
.tone-dark.rich-html :deep(h2),
.tone-dark.rich-html :deep(h3),
.tone-dark.rich-html :deep(h4) {
  color: #fff;
}

.tone-dark.rich-html :deep(a) {
  color: #f3c99f;
}

/* Jasne tło (nagłówek bez zdjęcia, treść strony) — kolory z palety strony. */
.tone-light .rich-p {
  color: #6c7173;
}

.tone-light .rich-lead {
  color: #566c71;
}

.tone-light .rich-heading {
  color: #151d1c;
}

.tone-light .rich-list li {
  background: #fff;
  border: 1px solid #e6e2d8;
  color: #151d1c;
}

.tone-light .rich-links a {
  background: #fff;
  border: 1px solid #e6e2d8;
  color: #151d1c;
}

.tone-light .rich-links a:hover {
  border-color: #a9541f;
}

/* Ciemne tło (nagłówek ze zdjęciem). */
.tone-dark .rich-p,
.tone-dark .rich-lead {
  color: #eef1ee;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
}

.tone-dark .rich-heading {
  color: #fff;
}

.tone-dark .rich-list li,
.tone-dark .rich-links a {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
}

.tone-dark .rich-p a,
.tone-dark .rich-link-go {
  color: #f3c99f;
}
</style>
