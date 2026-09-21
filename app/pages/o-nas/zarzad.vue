<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Zarząd i Zespół — O nas — Nowoczesne Bieszczady' })

const { data } = await useCmsCollection<TeamMember>('team', { order: 'order' })
const teamMembers = computed(() => data.value?.records ?? [])
const content = usePageContent()
</script>

<template>
  <div>
    <h2>Zarząd i Zespół</h2>
    <p>{{ content.body('zarzad-intro') }}</p>

    <div class="team">
      <div v-for="member in teamMembers" :key="member.id" class="member-card card-surface">
        <div class="avatar">{{ member.name.charAt(0) }}</div>
        <h3>{{ member.name }}</h3>
        <p>{{ member.role }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.member-card {
  padding: 1.75rem;
  text-align: center;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--alpine);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 auto 1rem;
}

.member-card h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 800;
}

.member-card p {
  margin: 0;
  font-size: 0.85rem;
  color: #5a6a62;
}

@media (max-width: 600px) {
  .team {
    grid-template-columns: 1fr;
  }
}
</style>
