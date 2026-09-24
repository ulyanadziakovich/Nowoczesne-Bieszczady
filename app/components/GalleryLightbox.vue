<script setup lang="ts">
const props = defineProps<{ images: string[]; altPrefix: string }>()

const openIndex = ref<number | null>(null)

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
  <div v-if="images.length" class="gallery">
    <button
      v-for="(img, i) in images"
      :key="i"
      type="button"
      class="gallery-item"
      :aria-label="`Powiększ zdjęcie ${i + 1} z ${images.length}`"
      @click="open(i)"
    >
      <img :src="resolveCmsUrl(img)" :alt="`${altPrefix} — zdjęcie ${i + 1}`" />
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
