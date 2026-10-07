<script setup lang="ts">
// Sekcja „zdjęcie + historia”: duże zdjęcie w pionie, które na komputerze zostaje
// przyklejone obok tekstu podczas przewijania; na tablecie i telefonie zdjęcie
// jest na całą szerokość nad tekstem. Długi tekst jest zwinięty („Czytaj całość”).
withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    html?: string
    image?: string
    alt?: string
    reverse?: boolean
    tone?: 'white' | 'stone'
  }>(),
  { tone: 'white' },
)
</script>

<template>
  <section class="story" :class="[`story-${tone}`, { 'story-reverse': reverse }]">
    <div class="container story-grid">
      <figure v-if="image" class="story-media">
        <img :src="image" :alt="alt || title || ''" loading="lazy" />
      </figure>
      <div class="story-body">
        <span v-if="kicker" class="kicker">{{ kicker }}</span>
        <h2 v-if="title" class="story-title">{{ title }}</h2>
        <RichText v-if="html" :html="html" :lead="true" collapsible collapsed-height="17rem" />
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.story {
  padding: 6rem 0;
}

.story-white {
  --fade-to: #fff;
  background: #fff;
}

.story-stone {
  --fade-to: var(--stone);
  background: var(--stone);
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2.5rem, 5vw, 5rem);
  align-items: center;
}

.story-reverse .story-media {
  order: 2;
}

/* Dwie równe połowy: poziome zdjęcie 4:3 i tekst wyśrodkowany obok niego. */
.story-media {
  margin: 0;
  overflow: hidden;
  border-radius: 22px;
  aspect-ratio: 4 / 3;
  box-shadow: 0 30px 70px rgba(26, 36, 32, 0.16);
}

.story-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 1.2s ease;
}

.story-media:hover img {
  transform: scale(1.03);
}

.story-body {
  min-width: 0;
  padding-top: 0.5rem;
}

.story-title {
  margin: 0 0 1.25rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.4vw, 2.2rem);
  font-weight: 600;
  line-height: 1.15;
  color: var(--text-title);
}

.story-body :deep(.rich) {
  max-width: none;
}

.story-body :deep(.rich-html p) {
  font-size: 1.04rem;
  line-height: 1.85;
}

/* Tablet: zdjęcie szerokie nad tekstem. */
@media (max-width: 1023px) {
  .story {
    padding: 4.5rem 0;
  }

  .story-grid {
    grid-template-columns: 1fr;
  }

  .story-reverse .story-media {
    order: 0;
  }

  .story-media {
    position: static;
    aspect-ratio: 16 / 9;
    border-radius: 18px;
  }
}

/* Telefon: mniejsze odstępy, zdjęcie trochę wyższe. */
@media (max-width: 600px) {
  .story {
    padding: 3.25rem 0;
  }

  .story-media {
    aspect-ratio: 4 / 3;
    border-radius: 14px;
  }

  .story-title {
    margin-bottom: 1.1rem;
  }
}
</style>
