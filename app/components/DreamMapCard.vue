<script setup lang="ts">
import { CATEGORY_COLORS, CATEGORY_NAMES, voteWord, type DreamMapPoint } from '~/utils/dreamMapData'

defineProps<{ point: DreamMapPoint }>()

const { hasVoted, voteFor } = useDreamMapPoints()
</script>

<template>
  <article class="card card-surface">
    <div class="card-head">
      <span
        class="card-pill"
        :style="{ background: CATEGORY_COLORS[point.category] + '1a', color: CATEGORY_COLORS[point.category] }"
      >
        {{ CATEGORY_NAMES[point.category] }}
      </span>

      <button
        type="button"
        class="vote-btn"
        :class="{ voted: hasVoted(point.id) }"
        :disabled="hasVoted(point.id)"
        :aria-pressed="hasVoted(point.id)"
        :aria-label="
          hasVoted(point.id)
            ? `Zagłosowano, ${point.votes} ${voteWord(point.votes)}`
            : `Zagłosuj na ten postulat, obecnie ${point.votes} ${voteWord(point.votes)}`
        "
        @click="voteFor(point.id)"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" :fill="hasVoted(point.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.8 4.8 4.9 3.8c2.1-.7 4.3.1 5.6 1.9l1.5 2 1.5-2c1.3-1.8 3.5-2.6 5.6-1.9 3.1 1 4.5 4.2 2.9 7.4-2.5 4.7-10 9.3-10 9.3z" />
        </svg>
        {{ point.votes }}
      </button>
    </div>

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

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.card-pill {
  display: inline-flex;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.vote-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  background: none;
  color: var(--ink);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s,
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.vote-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: var(--amber);
  color: var(--amber);
}

.vote-btn.voted {
  background: var(--amber);
  border-color: var(--amber);
  color: #fff;
  cursor: default;
}

.vote-btn:active:not(:disabled) {
  transform: scale(0.94);
}

.vote-btn svg {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vote-btn.voted svg {
  transform: scale(1.15);
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
