<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
const page = await usePageTexts('strona-o-nas')
await usePageTitle(() => page.t('celeTitle'))
// Cele z formularza „Strona: O nas” (zakładka „Cele”); do czasu przeniesienia
// danych — ze starej kolekcji „Cele”.
const { data } = await useCmsCollection<Goal>('goals', { order: 'order' })
const goals = computed<{ id?: number; title: string; description?: string }[]>(() => {
  const own = (page.data.value?.goals ?? []) as { title: string; description?: string }[]
  return own.length ? own : (data.value?.records ?? [])
})


</script>

<template>
  <div>
    <h2>{{ page.t('celeTitle') }}</h2>
    <RichText :html="page.html('celeText')" :lead="false" />

    <div class="goals">
      <div v-for="(goal, i) in goals" :key="goal.id ?? i" class="goal-card card-surface">
        <h3>{{ goal.title }}</h3>
        <p>{{ goal.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.goals {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.goal-card {
  padding: 1.5rem;
}

.goal-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--alpine);
}

.goal-card p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .goals {
    grid-template-columns: 1fr;
  }
}
</style>
