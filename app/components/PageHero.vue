<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string
    title: string
    description?: string
    image?: string
    variant?: 'photo' | 'light'
    stats?: string[]
  }>(),
  {
    image: '/images/bieszczady.avif',
    variant: 'photo',
  },
)
</script>

<template>
  <section v-if="variant === 'light'" class="page-hero light">
    <div class="topo" />
    <div class="container content">
      <div v-if="kicker" class="kicker-row">
        <span class="kicker">{{ kicker }}</span>
        <span class="dash-line" />
        <span class="badge-dot">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 2l1.8 5.6H20l-4.6 3.5L17.2 17 12 13.4 6.8 17l1.8-5.9L4 7.6h6.2z" />
          </svg>
        </span>
      </div>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>

      <div v-if="stats?.length" class="stats-row">
        <template v-for="(stat, i) in stats" :key="stat">
          <span v-if="i" class="stats-sep" />
          <span class="stat">{{ stat }}</span>
        </template>
      </div>
    </div>
  </section>

  <section v-else class="page-hero" :style="{ backgroundImage: `url(${image})` }">
    <div class="overlay" />
    <div class="container content">
      <span v-if="kicker" class="kicker">{{ kicker }}</span>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  margin-top: 0;
  padding-top: 9rem;
  padding-bottom: 4rem;
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 14, 18, 0.75) 0%, rgba(10, 14, 18, 0.35) 55%, rgba(10, 14, 18, 0.75) 100%);
}

.content {
  position: relative;
  color: #fff;
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 600;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.35);
}

p {
  margin: 1rem 0 0;
  max-width: 640px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #eef1ee;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
}

/* ---- Light variant: plain content header, no photo ---- */

.page-hero.light {
  position: relative;
  overflow: hidden;
  background: var(--stone);
  padding-top: 7.5rem;
  padding-bottom: 2.75rem;
  min-height: 0;
  display: block;
  border-bottom: 1px solid rgba(26, 36, 32, 0.08);
}

.page-hero.light .topo {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-image: repeating-radial-gradient(circle at 12% 20%, transparent 0, transparent 26px, rgba(19, 94, 36, 0.06) 27px, transparent 28px),
    repeating-radial-gradient(circle at 92% 75%, transparent 0, transparent 34px, rgba(201, 103, 46, 0.05) 35px, transparent 36px);
}

.page-hero.light .content {
  position: relative;
  color: var(--ink);
}

.stats-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
}

.stat {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--alpine);
  letter-spacing: 0.01em;
}

.stats-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b7c2b7;
}

.kicker-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.dash-line {
  flex: 1;
  max-width: 140px;
  height: 0;
  border-top: 1.5px dashed rgba(26, 36, 32, 0.25);
}

.badge-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--amber);
  color: var(--amber);
  flex-shrink: 0;
}

.page-hero.light h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  text-shadow: none;
}

.page-hero.light p {
  color: #4a4a44;
  text-shadow: none;
}

@media (max-width: 800px) {
  .page-hero {
    padding-top: 7rem;
    padding-bottom: 2.5rem;
    min-height: 240px;
  }

  .page-hero.light {
    padding-top: 6.5rem;
    padding-bottom: 2rem;
  }
}
</style>
