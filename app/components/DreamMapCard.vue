<script setup lang="ts">
import { CATEGORY_COLORS, CATEGORY_NAMES, type DreamMapPoint } from '~/utils/dreamMapData'

defineProps<{ point: DreamMapPoint }>()
</script>

<template>
  <article class="card card-surface">
    <span
      class="card-pill"
      :style="{ background: CATEGORY_COLORS[point.category] + '1a', color: CATEGORY_COLORS[point.category] }"
    >
      {{ CATEGORY_NAMES[point.category] }}
    </span>
    <h3>{{ point.title }}</h3>

    <p class="field-label">Wyzwanie</p>
    <p class="field-text">{{ point.challenge }}</p>

    <p class="field-label">Propozycja rozwiązania</p>
    <p class="field-text">{{ point.solution }}</p>
  </article>
</template>

<style scoped>
.card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
}

/* Flashed when this card is reached by clicking its star on the sky map
   above (desktop only) — fades out on its own after a couple seconds. */
.card.highlighted {
  outline: 3px solid var(--amber);
  outline-offset: 3px;
  animation: card-flash 2.4s ease-out;
}

@keyframes card-flash {
  from {
    outline-color: var(--amber);
  }
  to {
    outline-color: transparent;
  }
}

.card-pill {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 0.85rem;
}

.card h3 {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--ink);
}

.field-label {
  margin: 0 0 0.25rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--amber);
}

.field-label:not(:first-of-type) {
  margin-top: 0.9rem;
}

.field-text {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #5a6a62;
}
</style>
