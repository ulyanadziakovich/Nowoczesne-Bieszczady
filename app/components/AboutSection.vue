<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    paragraph1?: string
    paragraph2?: string
    tagline?: string
    image?: string
  }>(),
  {
    kicker: 'Stowarzyszenie',
    title: 'Krótko o nas',
    paragraph1:
      'Stowarzyszenie Nowoczesne Bieszczady powstało w 2016 roku w Ustrzykach Dolnych. Prowadzimy działalność doradczą, edukacyjną i kulturalną — wspieramy ekonomię społeczną, edukację demokracji lokalnej, aktywność kulturalną oraz rozwój Ustrzyk Dolnych i Powiatu Bieszczadzkiego.',
    paragraph2:
      'Nasi członkowie to przedsiębiorcy, nauczyciele, pracownicy samorządowi i specjaliści różnych branż. Stawiamy na profesjonalizm i zaangażowanie.',
    tagline: '„SKUTECZNI DLA WAS”',
    image: '/images/bieszczady.avif',
  },
)
</script>

<template>
  <section class="about">
    <div class="about-text">
      <span class="kicker">{{ kicker }}</span>
      <h2>{{ title }}</h2>
      <p>{{ paragraph1 }}</p>
      <p>{{ paragraph2 }}</p>
      <span class="tagline">{{ tagline }}</span>
    </div>
    <div class="about-image" :style="{ backgroundImage: `url(${image})` }" />
  </section>
</template>

<style scoped>
.about {
  display: flex;
  min-height: 480px;
  background: var(--stone);
}

.about-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
  padding: 4rem 5vw;
  max-width: 640px;
}

.about-text .kicker {
  margin-bottom: -0.5rem;
}

h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.75rem;
  font-weight: 600;
  color: var(--alpine);
}

p {
  margin: 0;
  color: #4a4a44;
  font-size: 1.05rem;
  line-height: 1.65;
}

.tagline {
  color: var(--amber);
  font-weight: 700;
  letter-spacing: 0.03em;
}

.about-image {
  flex: 1;
  background-size: cover;
  background-position: center 75%;
  clip-path: polygon(12% 0, 100% 0, 100% 100%, 0 100%);
}

@media (max-width: 800px) {
  .about {
    flex-direction: column;
    min-height: auto;
  }

  .about-text {
    max-width: none;
    padding: 3rem 1.5rem;
  }

  h2 {
    font-size: 1.9rem;
  }

  .about-image {
    height: 220px;
    clip-path: none;
  }
}
</style>
