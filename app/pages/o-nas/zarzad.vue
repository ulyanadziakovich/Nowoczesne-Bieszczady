<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
const page = await usePageTexts('strona-o-nas')
await usePageTitle(() => page.t('zarzadTitle'))

// Osoby z formularza „Strona: O nas” (zakładka „Zarząd i Zespół”).
const teamMembers = computed(
  () => (page.data.value?.team ?? []) as { id?: number; name: string; role?: string; photo?: CmsImage | null }[],
)

</script>

<template>
  <div>
    <h2>{{ page.t('zarzadTitle') }}</h2>
    <RichText :html="page.html('zarzadText')" :lead="false" />

    <ul class="team">
      <li v-for="(member, i) in teamMembers" :key="member.id ?? i" class="member-row">
        <img v-if="member.photo" class="avatar avatar-photo" :src="resolveCmsUrl(member.photo.src)" :alt="member.name" />
        <svg v-else class="avatar" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
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

.avatar-photo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
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
