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

    <ul class="team">
      <li v-for="member in teamMembers" :key="member.id" class="member-row">
        <svg class="avatar" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
        <span class="name">{{ member.name }}</span>
        <span class="role">{{ member.role }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.team {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  max-width: 560px;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid #eee9dd;
}

.member-row:first-child {
  border-top: 1px solid #eee9dd;
}

.avatar {
  flex-shrink: 0;
  color: var(--alpine);
}

.name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--ink);
}

.role {
  margin-left: auto;
  padding-left: 1rem;
  font-size: 0.82rem;
  color: #8a978f;
  text-align: right;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .member-row {
    flex-wrap: wrap;
  }

  .role {
    margin-left: calc(18px + 0.75rem);
    padding-left: 0;
    text-align: left;
    flex-basis: 100%;
  }
}
</style>
