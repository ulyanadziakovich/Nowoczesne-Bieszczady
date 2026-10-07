<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
const page = await usePageTexts('strona-o-nas')
await usePageTitle(() => page.t('partnerzyTitle'))

// Partnerzy z formularza „Strona: O nas” (zakładka „Partnerzy”).
const partners = computed(
  () => (page.data.value?.partners ?? []) as { id?: number; name: string; logo?: CmsImage | null; url?: string }[],
)

</script>

<template>
  <div>
    <h2>{{ page.t('partnerzyTitle') }}</h2>
    <RichText :html="page.html('partnerzyText')" :lead="false" />

    <div class="partners">
      <component
        :is="partner.url ? 'a' : 'div'"
        v-for="(partner, i) in partners"
        :key="partner.id ?? i"
        :href="partner.url || undefined"
        :target="partner.url ? '_blank' : undefined"
        :rel="partner.url ? 'noopener' : undefined"
        class="partner-badge"
      >
        <img v-if="partner.logo" :src="resolveCmsUrl(partner.logo.src)" :alt="partner.name" />
        <span v-else>{{ partner.name }}</span>
      </component>
    </div>
  </div>
</template>

<style scoped>
a.partner-badge {
  color: inherit;
  text-decoration: none;
}

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
