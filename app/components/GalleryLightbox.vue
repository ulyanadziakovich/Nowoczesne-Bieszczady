<script setup lang="ts">
const props = withDefaults(defineProps<{ images: string[]; altPrefix: string; layout?: 'grid' | 'scroll' | 'mosaic' }>(), {
  layout: 'grid',
})

const openIndex = ref<number | null>(null)

// Mozaika: na komputerze widać 5 pierwszych zdjęć (reszta pod licznikiem „+N”
// na piątym kafelku), na telefonie wszystkie zdjęcia w przewijanym pasku.
const MOSAIC_SIZE = 5
const visibleImages = computed(() => props.images)
const mosaicCount = computed(() => Math.min(props.images.length, MOSAIC_SIZE))
const hiddenCount = computed(() => props.images.length - mosaicCount.value)

// „Zobacz wszystkie” rozwija mozaikę w siatkę kafelków ze wszystkimi zdjęciami;
// dopiero kliknięcie kafelka otwiera powiększenie.
const expanded = ref(false)
const galleryEl = ref<HTMLElement | null>(null)

function isMoreTile(i: number) {
  return props.layout === 'mosaic' && !expanded.value && hiddenCount.value > 0 && i === mosaicCount.value - 1
}

function onItemClick(i: number) {
  if (isMoreTile(i)) expanded.value = true
  else open(i)
}

function toggleExpanded() {
  expanded.value = !expanded.value
  if (!expanded.value) galleryEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function open(i: number) {
  openIndex.value = i
}

function close() {
  openIndex.value = null
}

function prev() {
  if (openIndex.value === null) return
  openIndex.value = (openIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  if (openIndex.value === null) return
  openIndex.value = (openIndex.value + 1) % props.images.length
}

function onKeydown(e: KeyboardEvent) {
  if (openIndex.value === null) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    v-if="images.length"
    ref="galleryEl"
    class="gallery"
    :class="{
      'gallery-scroll': layout === 'scroll',
      'gallery-mosaic': layout === 'mosaic' && !expanded,
      [`mosaic-count-${mosaicCount}`]: layout === 'mosaic' && !expanded,
      'gallery-tiles': layout === 'mosaic' && expanded,
    }"
  >
    <button
      v-for="(img, i) in visibleImages"
      :key="i"
      type="button"
      class="gallery-item"
      :aria-label="isMoreTile(i) ? `Pokaż wszystkie ${images.length} zdjęć` : `Powiększ zdjęcie ${i + 1} z ${images.length}`"
      @click="onItemClick(i)"
    >
      <img :src="resolveCmsUrl(img)" :alt="`${altPrefix} — zdjęcie ${i + 1}`" :loading="i === 0 ? 'eager' : 'lazy'" />
      <template v-if="isMoreTile(i)">
        <span class="mosaic-more">
          <span class="mosaic-more-count">+{{ hiddenCount }}</span>
          <span class="mosaic-more-label">Zobacz wszystkie</span>
        </span>
      </template>
    </button>
  </div>
  <div v-if="layout === 'mosaic' && images.length > 1" class="mosaic-footer" :class="{ 'mosaic-footer-mobile-only': hiddenCount === 0 && !expanded }">
    <p v-if="!expanded" class="mosaic-swipe-hint">Przesuń, aby zobaczyć więcej →</p>
    <button type="button" class="mosaic-toggle" @click="toggleExpanded">
      {{ expanded ? 'Zwiń galerię' : `Pokaż wszystkie zdjęcia (${images.length})` }}
    </button>
  </div>

  <Teleport to="body">
    <div v-if="openIndex !== null" class="lightbox-overlay" @click.self="close">
      <button type="button" class="lightbox-close" aria-label="Zamknij" @click="close">×</button>

      <button
        v-if="images.length > 1"
        type="button"
        class="lightbox-nav lightbox-prev"
        aria-label="Poprzednie zdjęcie"
        @click="prev"
      >
        ‹
      </button>

      <img
        v-if="openIndex !== null"
        :src="resolveCmsUrl(images[openIndex])"
        :alt="`${altPrefix} — zdjęcie ${openIndex + 1}`"
        class="lightbox-image"
      />

      <button
        v-if="images.length > 1"
        type="button"
        class="lightbox-nav lightbox-next"
        aria-label="Następne zdjęcie"
        @click="next"
      >
        ›
      </button>

      <span v-if="images.length > 1 && openIndex !== null" class="lightbox-count">{{ openIndex + 1 }} / {{ images.length }}</span>
    </div>
  </Teleport>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 0.5rem 0 1.5rem;
}

.gallery-item {
  border: none;
  padding: 0;
  margin: 0;
  background: none;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.1);
  transition: transform 0.15s, box-shadow 0.15s;
}

.gallery-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px rgba(26, 36, 32, 0.18);
}

.gallery-item img {
  width: 100%;
  display: block;
}

@media (max-width: 700px) {
  .gallery {
    grid-template-columns: 1fr;
  }
}

/* Horizontal filmstrip variant — for tall, page-like image sets (e.g. a
   scanned document) where a 2-column grid isn't a natural fit. */
.gallery-scroll {
  display: flex;
  grid-template-columns: unset;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 0.85rem;
  scroll-padding-left: 0.25rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gallery-scroll::-webkit-scrollbar {
  display: none;
}

.gallery-scroll .gallery-item {
  flex: 0 0 auto;
  width: 160px;
  scroll-snap-align: start;
}

@media (max-width: 700px) {
  .gallery-scroll {
    grid-template-columns: unset;
  }
}

/* Mozaika: jedno duże zdjęcie po lewej i do czterech mniejszych obok. */
.gallery-mosaic {
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 420px;
  gap: 0.6rem;
}

.gallery-mosaic .gallery-item:nth-child(n + 6) {
  display: none;
}

.mosaic-swipe-hint {
  display: none;
}

.mosaic-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin: -0.75rem 0 1.5rem;
}

.mosaic-toggle {
  padding: 0.55rem 1.1rem;
  border: 1px solid #d9d3c3;
  border-radius: 999px;
  background: #fff;
  color: var(--alpine);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.mosaic-toggle:hover {
  background: #f4f1e8;
  border-color: var(--alpine);
}

/* Rozwinięta galeria: wszystkie zdjęcia jako równe kwadratowe kafelki. */
.gallery-tiles {
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.5rem;
}

.gallery-tiles .gallery-item {
  aspect-ratio: 1;
  border-radius: 10px;
  box-shadow: none;
}

.gallery-tiles .gallery-item img {
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-tiles .gallery-item:hover {
  transform: none;
  box-shadow: none;
}

.gallery-tiles .gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-mosaic .gallery-item {
  position: relative;
  border-radius: 0;
  box-shadow: none;
}

.gallery-mosaic .gallery-item:hover {
  transform: none;
  box-shadow: none;
}

.gallery-mosaic .gallery-item img {
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-mosaic .gallery-item:hover img {
  transform: scale(1.04);
}

.gallery-mosaic .gallery-item:first-child {
  grid-row: 1 / 3;
  border-radius: 16px 0 0 16px;
}

.gallery-mosaic .gallery-item:nth-child(3) {
  border-top-right-radius: 16px;
}

.gallery-mosaic .gallery-item:nth-child(5) {
  border-bottom-right-radius: 16px;
}

/* Mniej niż 5 zdjęć: układ się dopasowuje, bez pustych pól. */
.gallery-mosaic.mosaic-count-1 {
  grid-template-columns: 1fr;
}
.gallery-mosaic.mosaic-count-1 .gallery-item:first-child {
  border-radius: 16px;
}
.gallery-mosaic.mosaic-count-2,
.gallery-mosaic.mosaic-count-3 {
  grid-template-columns: 2fr 1fr;
}
.gallery-mosaic.mosaic-count-2 .gallery-item:nth-child(2) {
  grid-row: 1 / 3;
  border-radius: 0 16px 16px 0;
}
.gallery-mosaic.mosaic-count-3 .gallery-item:nth-child(2) {
  border-top-right-radius: 16px;
}
.gallery-mosaic.mosaic-count-3 .gallery-item:nth-child(3) {
  border-radius: 0 0 16px 0;
}
.gallery-mosaic.mosaic-count-4 .gallery-item:nth-child(4) {
  grid-column: 2 / 4;
  border-bottom-right-radius: 16px;
}

.mosaic-more {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  background: rgba(16, 26, 21, 0.55);
  color: #fff;
  transition: background 0.2s;
}

.gallery-item:hover .mosaic-more {
  background: rgba(16, 26, 21, 0.68);
}

.mosaic-more-count {
  font-family: var(--font-display);
  font-size: 1.8rem;
  line-height: 1;
}

.mosaic-more-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@media (max-width: 700px) {
  /* Telefon: wszystkie zdjęcia w poziomym, przewijanym palcem pasku. */
  .gallery-mosaic,
  .gallery-mosaic[class*='mosaic-count-'] {
    display: flex;
    height: auto;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 0.6rem;
    margin-right: -1rem;
    padding-right: 1rem;
    scrollbar-width: none;
  }

  .gallery-mosaic::-webkit-scrollbar {
    display: none;
  }

  .gallery-mosaic .gallery-item,
  .gallery-mosaic .gallery-item:nth-child(n),
  .gallery-mosaic[class*='mosaic-count-'] .gallery-item:nth-child(n) {
    display: block;
    flex: 0 0 82%;
    height: 240px;
    grid-row: auto;
    grid-column: auto;
    border-radius: 14px;
    scroll-snap-align: start;
  }

  .mosaic-more {
    display: none;
  }

  .mosaic-swipe-hint {
    display: block;
    margin: 0;
    font-size: 0.78rem;
    color: #8a978f;
  }

  .mosaic-footer {
    justify-content: space-between;
    margin: 0.5rem 0 1.5rem;
  }

  .gallery-tiles {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.35rem;
  }

  .gallery-tiles .gallery-item {
    border-radius: 6px;
  }
}

@media (min-width: 701px) {
  .mosaic-footer-mobile-only {
    display: none;
  }
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 10, 20, 0.92);
  backdrop-filter: blur(6px);
  padding: 4rem 1.5rem;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  object-fit: contain;
}

.lightbox-close {
  position: fixed;
  top: 1.25rem;
  right: 1.5rem;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #f0ead6;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #f0ead6;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.18);
}

.lightbox-prev {
  left: 1rem;
}

.lightbox-next {
  right: 1rem;
}

.lightbox-count {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(240, 234, 214, 0.75);
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 700px) {
  .lightbox-overlay {
    padding: 3.5rem 0.75rem;
  }

  .lightbox-nav {
    width: 44px;
    height: 44px;
    font-size: 1.5rem;
  }

  .lightbox-prev {
    left: 0.4rem;
  }

  .lightbox-next {
    right: 0.4rem;
  }
}
</style>
