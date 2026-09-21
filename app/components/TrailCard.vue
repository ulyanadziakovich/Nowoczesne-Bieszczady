<script setup lang="ts">
const props = defineProps<{ trail: Trail }>()

const dotClass = computed(() => `dot dot-${props.trail.difficulty === 'latwa' ? 'easy' : props.trail.difficulty === 'srednia' ? 'medium' : 'hard'}`)
const bikeTypes = computed(() => trailBikeTypes(props.trail))
</script>

<template>
  <NuxtLink :to="`/szlaki/${trail.slug}`" class="trail-card">
    <div class="image-wrap">
      <img :src="trail.image" :alt="trail.title" />
      <span class="badge-pill"><i :class="dotClass" />{{ difficultyLabels[trail.difficulty] }}</span>
    </div>

    <div class="body">
      <h3>{{ trail.title }}</h3>
      <p class="teaser">{{ trail.teaser }}</p>

      <p class="meta-line">
        <span>{{ trail.lengthKm }} km</span>
        <span class="sep">·</span>
        <span>{{ trail.elevationM }} m przewyższeń</span>
        <span class="sep">·</span>
        <span class="time">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
          </svg>
          {{ trail.durationHours }}
        </span>
      </p>

      <div class="bikes">
        <span v-for="type in bikeTypes" :key="type" class="bike-tag">{{ bikeTypeLabels[type] }}</span>
      </div>

      <span class="cta-link">
        Zobacz trasę i pobierz GPX
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.trail-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.08);
  transition: transform 0.15s, box-shadow 0.15s;
}

.trail-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 48px rgba(26, 36, 32, 0.14);
}

.image-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #fff;
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.trail-card:hover .image-wrap img {
  transform: scale(1.06);
}

.badge-pill {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-easy {
  background: var(--leaf);
}

.dot-medium {
  background: var(--amber);
}

.dot-hard {
  background: #a8341c;
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

.meta-line {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink);
}

.sep {
  color: #b7c2b7;
  font-weight: 400;
}

.time {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.bikes {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.bike-tag {
  background: var(--mist);
  color: var(--ink);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.cta-link {
  margin-top: auto;
  padding-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--amber);
  font-weight: 700;
  font-size: 0.85rem;
  transition: gap 0.15s;
}

.trail-card:hover .cta-link {
  gap: 0.65rem;
}
</style>
