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
    <!-- Zdjęcie „pływa” z boku, a tekst je opływa i dalej płynie pod nim. -->
    <div class="container story-flow">
      <figure v-if="image" class="story-media">
        <img :src="image" :alt="alt || title || ''" loading="lazy" />
      </figure>
      <span v-if="kicker" class="kicker story-kicker">{{ kicker }}</span>
      <h2 v-if="title" class="story-title">{{ title }}</h2>
      <RichText v-if="html" :html="html" :lead="true" collapsible collapsed-height="17rem" />
      <slot />
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

/* Po zdjęciu wszystko wraca do pełnej szerokości. */
.story-flow::after {
  content: '';
  display: block;
  clear: both;
}

.story-media {
  float: left;
  width: 48%;
  margin: 0.4rem 3.5rem 1.5rem 0;
  overflow: hidden;
  border-radius: 22px;
  aspect-ratio: 4 / 3;
  box-shadow: 0 30px 70px rgba(26, 36, 32, 0.16);
}

.story-reverse .story-media {
  float: right;
  margin: 0.4rem 0 1.5rem 3.5rem;
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

.story-kicker {
  display: block;
}

.story-title {
  margin: 0 0 1.25rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.4vw, 2.2rem);
  font-weight: 600;
  line-height: 1.15;
  color: var(--text-title);
}

.story-flow :deep(.rich) {
  max-width: none;
}

.story-flow :deep(.rich-html p) {
  font-size: 1.04rem;
  line-height: 1.85;
}

/* Tablet i telefon: zdjęcie na całą szerokość nad tekstem. */
@media (max-width: 1023px) {
  .story {
    padding: 4.5rem 0;
  }

  .story-media,
  .story-reverse .story-media {
    float: none;
    width: 100%;
    margin: 0 0 2rem;
    aspect-ratio: 16 / 9;
    border-radius: 18px;
  }
}

@media (max-width: 600px) {
  .story {
    padding: 3.25rem 0;
  }

  .story-media,
  .story-reverse .story-media {
    aspect-ratio: 4 / 3;
    border-radius: 14px;
  }

  .story-title {
    margin-bottom: 1.1rem;
  }
}
</style>
