<script setup lang="ts">
// Wyświetla dłuższy tekst z CMS z zachowaniem struktury (akapity, śródtytuły,
// listy, linki) — patrz parseRichText(). Pierwszy akapit jest wyróżniony.
// `html` = treść z edytora CMS (ma pierwszeństwo), `text` = zwykły tekst.
const props = withDefaults(
  defineProps<{
    text?: string | null
    html?: string | null
    tone?: 'light' | 'dark'
    lead?: boolean
    /** Długi tekst pokazuje się zwinięty, z przyciskiem „Czytaj całość”. */
    collapsible?: boolean
    collapsedHeight?: string
  }>(),
  {
  text: '',
  html: '',
  collapsible: false,
  collapsedHeight: '24rem',
  tone: 'light',
  lead: true,
})

const safeHtml = computed(() => sanitizeCmsHtml(props.html))

// Zwijamy tylko naprawdę długie teksty (po długości samej treści, żeby serwer
// i przeglądarka wyrenderowały to samo — bez mierzenia i „skakania” strony).
const plainLength = computed(() => (safeHtml.value ? safeHtml.value.replace(/<[^>]+>/g, '') : props.text || '').length)
const canCollapse = computed(() => props.collapsible && plainLength.value > 1100)
const expanded = ref(false)
const common = usePageTextsSync('site-settings')
const shell = ref<HTMLElement | null>(null)
function toggle() {
  expanded.value = !expanded.value
  if (!expanded.value) shell.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const blocks = computed(() => (safeHtml.value ? [] : parseRichText(props.text)))
const firstParagraph = computed(() => blocks.value.findIndex((b) => b.type === 'paragraph'))
</script>

<template>
  <div v-if="safeHtml || blocks.length" ref="shell" class="rich-shell" :class="[`tone-${tone}`, { 'is-collapsed': canCollapse && !expanded }]">
  <div class="rich-clip" :style="canCollapse && !expanded ? { maxHeight: collapsedHeight } : undefined">
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
  </div>
  <button v-if="canCollapse" type="button" class="rich-toggle" :aria-expanded="expanded" @click="toggle">
    <span>{{ expanded ? common.t('readLess') : common.t('readFull') }}</span>
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" :class="{ flipped: expanded }">
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>
  </div>
</template>

<style scoped>
.rich-shell {
  position: relative;
}

.rich-clip {
  position: relative;
}

/* Tylko zwinięty tekst jest przycinany — rozwinięty może opływać zdjęcie obok. */
.rich-shell.is-collapsed .rich-clip {
  overflow: hidden;
}

/* Zwinięty tekst gaśnie łagodnie w kolor tła sekcji (--fade-to ustawia rodzic). */
.rich-shell.is-collapsed .rich-clip::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 7rem;
  background: linear-gradient(to bottom, transparent, var(--fade-to, var(--mist)));
  pointer-events: none;
}

.rich-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.1rem;
  padding: 0.7rem 1.3rem;
  border: 1.5px solid var(--amber);
  border-radius: 999px;
  background: transparent;
  color: var(--amber);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.rich-toggle:hover {
  background: var(--amber);
  color: #fff;
}

.rich-toggle svg {
  transition: transform 0.2s;
}

.rich-toggle svg.flipped {
  transform: rotate(180deg);
}

.tone-dark .rich-toggle {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}

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
  background: var(--amber);
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
  color: var(--amber);
}

.rich-p a {
  color: var(--amber);
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
  background: var(--amber);
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
  color: var(--amber);
}

.rich-html :deep(li p) {
  margin: 0;
}

/* Lista, w której każdy punkt to sam link (np. wypożyczalnie) → kafelki ze strzałką. */
.rich-html :deep(ul:has(> li > p > a:only-child):not(:has(> li > p > :not(a)))) {
  display: grid;
  gap: 0.5rem;
  padding-left: 0;
  list-style: none;
}

.rich-html :deep(ul:has(> li > p > a:only-child):not(:has(> li > p > :not(a))) a) {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border: 1px solid #e6e2d8;
  border-radius: 12px;
  background: #fff;
  color: var(--text-title);
  text-decoration: none;
  transition: transform 0.15s, border-color 0.15s;
}

.rich-html :deep(ul:has(> li > p > a:only-child):not(:has(> li > p > :not(a))) a)::after {
  content: '→';
  color: var(--amber);
  font-weight: 700;
}

.rich-html :deep(ul:has(> li > p > a:only-child):not(:has(> li > p > :not(a))) a:hover) {
  transform: translateX(3px);
  border-color: var(--amber);
}

.rich-html :deep(blockquote) {
  margin: 1.4rem 0;
  padding: 0.2rem 0 0.2rem 1.2rem;
  border-left: 3px solid var(--amber);
  font-style: italic;
}

.rich-html :deep(a) {
  color: var(--amber);
  font-weight: 600;
  text-underline-offset: 3px;
}

.rich-html :deep(:last-child) {
  margin-bottom: 0;
}

.tone-light.rich-html {
  color: var(--text-body);
}

.tone-light.rich-html.with-lead :deep(p:first-child) {
  color: var(--text-lead);
}

.tone-light.rich-html :deep(h1),
.tone-light.rich-html :deep(h2),
.tone-light.rich-html :deep(h3),
.tone-light.rich-html :deep(h4),
.tone-light.rich-html :deep(strong) {
  color: var(--text-title);
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
  color: var(--text-body);
}

.tone-light .rich-lead {
  color: var(--text-lead);
}

.tone-light .rich-heading {
  color: var(--text-title);
}

.tone-light .rich-list li {
  background: #fff;
  border: 1px solid #e6e2d8;
  color: var(--text-title);
}

.tone-light .rich-links a {
  background: #fff;
  border: 1px solid #e6e2d8;
  color: var(--text-title);
}

.tone-light .rich-links a:hover {
  border-color: var(--amber);
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
