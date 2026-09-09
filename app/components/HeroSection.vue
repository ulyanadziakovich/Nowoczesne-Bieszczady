<script setup lang="ts">
withDefaults(
  defineProps<{
    image?: string
    title?: string
    subtitle?: string
    cta?: string
  }>(),
  {
    image: '/images/hero.avif',
    title: 'NOWOCZESNE BIESZCZADY',
    subtitle: 'Tworzymy wydarzenia, konkursy i inicjatywy, które budują tożsamość regionu.',
    cta: 'DOWIEDZ SIĘ WIĘCEJ',
  },
)
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${image})` }">
    <div class="overlay" />
    <div class="content">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <a href="#" class="cta">{{ cta }}</a>
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
  background: linear-gradient(180deg, rgba(10, 14, 18, 0.85) 0%, rgba(10, 14, 18, 0.15) 35%, rgba(10, 14, 18, 0.55) 100%);
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  padding: 0 1.5rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
}

p {
  margin: 1rem 0 2rem;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  font-weight: 300;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
}

.cta {
  display: inline-block;
  background: var(--amber);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  padding: 0.9rem 2rem;
}

.cta:hover {
  background: #a8551f;
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
