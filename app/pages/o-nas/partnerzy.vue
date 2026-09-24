<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Partnerzy i Grantodawcy — O nas — Nowoczesne Bieszczady' })

const { data } = await useCmsCollection<Partner>('partners', { order: 'order' })
const partners = computed(() => data.value?.records ?? [])
const content = usePageContent()
</script>

<template>
  <div>
    <h2>Partnerzy i Grantodawcy</h2>
    <p>{{ content.body('partnerzy-intro') }}</p>

    <div class="partners">
      <div v-for="partner in partners" :key="partner.id" class="partner-badge">
        <img v-if="partner.logo" :src="resolveCmsUrl(partner.logo.src)" :alt="partner.name" />
        <span v-else>{{ partner.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.partners {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.partner-badge {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s, box-shadow 0.15s;
  padding: 1.5rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.partner-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.1);
}

.partner-badge img {
  max-width: 100%;
  max-height: 56px;
  object-fit: contain;
}

@media (max-width: 700px) {
  .partners {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
