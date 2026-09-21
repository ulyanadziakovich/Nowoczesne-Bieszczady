<script setup lang="ts">
withDefaults(
  defineProps<{
    image?: string
    kicker?: string
    title?: string
    subtitle?: string
    cta?: string
    ctaHref?: string
  }>(),
  {
    image: '/images/hero.avif',
    kicker: 'Ustrzyki Dolne · Bieszczady',
    title: 'NOWOCZESNE BIESZCZADY',
    subtitle: 'Tworzymy wydarzenia, konkursy i inicjatywy, które budują tożsamość regionu.',
    cta: 'Dowiedz się więcej',
    ctaHref: '/o-nas/misja',
  },
)
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${image})` }">
    <div class="overlay" />
    <div class="content">
      <div class="kicker-row">
        <span class="dash-line" />
        <span class="kicker-dot" />
        <span class="kicker">{{ kicker }}</span>
        <span class="kicker-dot" />
        <span class="dash-line" />
      </div>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <NuxtLink :to="ctaHref" class="btn btn-amber cta">{{ cta }}</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 480px;
  height: 62vh;
  background-size: cover;
  background-position: center;
  text-align: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 14, 18, 0.82) 0%, rgba(15, 22, 19, 0.32) 40%, rgba(10, 14, 18, 0.6) 100%);
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kicker-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  margin-bottom: 1.25rem;
}

.kicker-row .kicker {
  margin: 0;
  color: #fff;
  font-size: 0.78rem;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.kicker-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--amber);
  flex-shrink: 0;
}

.dash-line {
  width: 36px;
  height: 0;
  border-top: 1.5px dashed rgba(255, 255, 255, 0.45);
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 4.75rem);
  font-weight: 600;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
}

p {
  margin: 1rem 0 2rem;
  max-width: 600px;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  font-weight: 300;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
}

.cta {
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.9rem 2.2rem;
}

@media (max-width: 800px) {
  .hero {
    min-height: 380px;
    height: 56svh;
    text-align: left;
  }

  .content {
    top: auto;
    bottom: 4.5rem;
    transform: none;
    padding: 0 1.5rem;
    align-items: flex-start;
  }

  .kicker-row {
    justify-content: flex-start;
  }

  .dash-line:last-child {
    display: none;
  }

  h1 {
    font-size: 1.9rem;
    line-height: 1.15;
  }

  p {
    font-size: 0.95rem;
    margin: 0.6rem 0 1.25rem;
  }

  .cta {
    padding: 0.8rem 1.5rem;
  }
}
</style>
