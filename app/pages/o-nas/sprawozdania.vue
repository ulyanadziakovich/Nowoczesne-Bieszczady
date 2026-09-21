<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Sprawozdania — O nas — Nowoczesne Bieszczady' })

const { data } = await useCmsCollection<Report>('reports', { order: 'year:desc' })
const reports = computed(() => data.value?.records ?? [])
const content = usePageContent()
</script>

<template>
  <div>
    <h2>Sprawozdania i transparentność</h2>
    <p>{{ content.body('sprawozdania-intro') }}</p>

    <ul class="reports-list">
      <li v-for="report in reports" :key="report.id">
        <span class="year">{{ report.year }}</span>
        <span class="title">{{ report.title }}</span>
        <a :href="report.fileUrl || `/files/sprawozdanie-${report.year}.pdf`" class="btn btn-outline" download>Pobierz PDF</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.reports-list {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reports-list li {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
  padding: 1.1rem 1.5rem;
  transition: transform 0.15s, box-shadow 0.15s;
}

.reports-list li:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.1);
}

.year {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--alpine);
  flex-shrink: 0;
}

.title {
  flex: 1;
  font-size: 0.92rem;
  color: var(--ink);
}

.btn {
  padding: 0.55rem 1.1rem;
  font-size: 0.78rem;
}

@media (max-width: 700px) {
  .reports-list li {
    flex-wrap: wrap;
  }
}
</style>
