<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
const page = await usePageTexts('strona-o-nas')
await usePageTitle(() => page.t('statutTitle'))
// Strony statutu i plik PDF: do czasu wgrania w formularzu — z „Tekstów na stronach” (etap 2).
const content = usePageContent()
const pdfUrl = computed(() => page.file('statutFile') ?? content.image('statut-intro'))
const pages = computed(() => {
  const own = (page.data.value?.statutPages ?? []) as CmsGalleryImage[]
  return own.length ? own.map((p) => p.src) : (content.body('statut-galeria') || '').split('\n').map((s) => s.trim()).filter(Boolean)
})
</script>

<template>
  <div>
    <h2>{{ page.t('statutTitle') }}</h2>
    <RichText :html="page.html('statutText')" :lead="false" />

    <div class="actions">
      <a :href="pdfUrl" class="btn btn-amber" download>{{ page.t('statutDownload') }}</a>
      <a :href="pdfUrl" target="_blank" rel="noopener" class="btn btn-outline">{{ page.t('statutOpen') }}</a>
    </div>

    <p v-if="pages.length" class="pages-hint">{{ page.t('statutHint') }}</p>
    <GalleryLightbox :images="pages" :alt-prefix="page.t('statutTitle')" layout="scroll" />
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0.5rem 0 1.5rem;
}

.pages-hint {
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  color: #8a938c;
}
</style>
