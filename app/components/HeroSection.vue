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
    subtitle: 'Innowacja. Edukacja. Przygoda w górach.',
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  position: relative;
  color: #fff;
  padding: 0 1.5rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  letter-spacing: 0.02em;
}

p {
  margin: 1rem 0 2rem;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  font-weight: 300;
}

.cta {
  display: inline-block;
  background: #e8672c;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  padding: 0.9rem 2rem;
}

.cta:hover {
  background: #d1571f;
}

@media (max-width: 800px) {
  .hero {
    min-height: 100svh;
    height: auto;
    justify-content: flex-end;
    text-align: left;
    padding-bottom: 4rem;
  }

  .content {
    padding: 0 1.5rem;
  }

  h1 {
    font-size: 2.1rem;
    line-height: 1.15;
  }

  p {
    font-size: 1rem;
    margin: 0.75rem 0 1.5rem;
  }

  .cta {
    padding: 0.8rem 1.5rem;
  }
}
</style>
