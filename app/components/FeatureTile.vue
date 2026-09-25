<script setup lang="ts">
const props = defineProps<{
  image?: string
  title: string
  description: string
  moreHref: string
}>()

const TILE_META: Record<string, { tags: string[]; cta: string }> = {
  '/szlaki': { tags: ['Pliki GPX', 'Filtry trudności'], cta: 'Zobacz trasy' },
  '/ustrzyki-2036': { tags: ['18 postulatów', 'Mapa marzeń'], cta: 'Zobacz mapę marzeń' },
  '/korona-gor': { tags: ['Szczyty', 'Kalendarz rajdów'], cta: 'Zobacz szczyty' },
  '/inicjatywy': { tags: ['Warsztaty', 'Debaty społeczne'], cta: 'Zobacz inicjatywy' },
}
const DEFAULT_META = { tags: [] as string[], cta: 'Zobacz więcej' }

const meta = computed(() => TILE_META[props.moreHref] ?? DEFAULT_META)
</script>

<template>
  <NuxtLink :to="moreHref" class="tile">
    <div class="image-wrap">
      <img :src="image" :alt="title" class="image" />
    </div>

    <div class="body">
      <h3>{{ title }}</h3>
      <p class="teaser">{{ description }}</p>

      <div v-if="meta.tags.length" class="tags">
        <span v-for="tag in meta.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <span class="btn btn-amber tile-cta">
        {{ meta.cta }}
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.08);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 48px rgba(26, 36, 32, 0.14);
}

.image-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.tile:hover .image {
  transform: scale(1.06);
}

.body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
}

.teaser {
  margin: 0;
  color: #5a6a62;
  font-size: 0.88rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--mist);
  color: var(--ink);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.tile-cta {
  margin-top: auto;
  align-self: flex-start;
  font-size: 0.82rem;
  padding: 0.7rem 1.3rem;
}

.tile-cta svg {
  transition: transform 0.15s;
}

.tile:hover .tile-cta svg {
  transform: translateX(3px);
}

/* Desktop only — noticeably smaller cards, matching the old flip-tile's
   compact footprint, with room left below the row before the next
   section instead of the cards themselves filling the space. */
@media (min-width: 901px) {
  .image-wrap {
    height: 175px;
  }

  .body {
    padding: 1.1rem 1.25rem 1.25rem;
    gap: 0.6rem;
  }

  h3 {
    font-size: 1.05rem;
  }

  .teaser {
    font-size: 0.83rem;
  }

  .tile-cta {
    padding: 0.55rem 1.1rem;
    font-size: 0.78rem;
  }
}
</style>
