<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Wolontariat — O nas — Nowoczesne Bieszczady' })

// Cała treść podstrony z jednej zakładki CMS „Wolontariat”: tytuł, opis i dokumenty.
interface VolunteeringPage {
  title?: string
  description?: string
  documents?: { label: string; file: CmsFile | null }[]
}

const { data } = await useCmsSingle<VolunteeringPage>('volunteering')
const title = computed(() => data.value?.title || 'Wolontariat')
const paragraphs = computed(() =>
  (data.value?.description || 'Wkrótce zamieścimy tutaj informacje o wolontariacie w Stowarzyszeniu Nowoczesne Bieszczady.')
    .split(/\n\s*\n/)
    .filter(Boolean),
)
const documents = computed(() => (data.value?.documents ?? []).filter((d) => d.file?.filename))

function fileUrl(file: CmsFile) {
  return resolveCmsUrl(`/uploads/${file.directory}${file.filename}`)
}
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>

    <ul v-if="documents.length" class="docs-list">
      <li v-for="(doc, i) in documents" :key="i">
        <span class="doc-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
        </span>
        <span class="title">{{ doc.label }}</span>
        <a :href="fileUrl(doc.file!)" class="btn btn-outline" target="_blank" rel="noopener">Pobierz / zobacz</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.docs-list {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.docs-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
  padding: 1.1rem 1.5rem;
}

.doc-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e3eedb;
  color: var(--alpine);
}

.title {
  flex: 1;
  font-weight: 600;
  color: var(--ink);
}

@media (max-width: 560px) {
  .docs-list li {
    flex-wrap: wrap;
  }
}
</style>
