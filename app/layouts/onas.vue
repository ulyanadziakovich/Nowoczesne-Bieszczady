<script setup lang="ts">
const content = usePageContent()

const items = [
  { label: 'Kim jesteśmy / Misja', to: '/o-nas/misja' },
  { label: 'Cele Stowarzyszenia', to: '/o-nas/cele' },
  { label: 'Statut Stowarzyszenia', to: '/o-nas/statut' },
  { label: 'Deklaracja członkowska', to: '/o-nas/deklaracja' },
  { label: 'Zarząd i Zespół', to: '/o-nas/zarzad' },
  { label: 'Sprawozdania', to: '/o-nas/sprawozdania' },
  { label: 'Partnerzy i Grantodawcy', to: '/o-nas/partnerzy' },
]
</script>

<template>
  <div>
    <PageHero
      variant="light"
      kicker="Stowarzyszenie"
      title="O nas"
      :description="content.body('onas-hero-description')"
      :stats="content.lines('onas-stats')"
    />

    <section class="section">
      <div class="container onas-grid">
        <aside class="onas-nav">
          <NuxtLink v-for="item in items" :key="item.to" :to="item.to" active-class="active">{{ item.label }}</NuxtLink>
        </aside>

        <div class="onas-content">
          <slot />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.onas-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  align-items: start;
}

.onas-nav {
  position: sticky;
  top: 6.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.onas-nav a {
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #4a4a44;
  font-size: 0.88rem;
  font-weight: 600;
  border-left: 3px solid transparent;
}

.onas-nav a:hover {
  background: var(--stone);
  color: var(--ink);
}

.onas-nav a.active {
  border-color: var(--amber);
  background: var(--stone);
  color: var(--ink);
}

.onas-content :deep(h2) {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--ink);
  margin: 0 0 1.25rem;
}

.onas-content :deep(p) {
  color: #4a4a44;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 1.1rem;
}

.onas-content :deep(ul) {
  color: #4a4a44;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .onas-grid {
    grid-template-columns: 1fr;
  }

  .onas-nav {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .onas-nav a {
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 0.5rem 0.25rem;
  }

  .onas-nav a.active {
    border-color: var(--amber);
  }
}
</style>
