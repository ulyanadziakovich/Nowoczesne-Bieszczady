<script setup lang="ts">
// Kafelek „Zgłoś swój pomysł” — zawsze ostatni w siatce postulatów.
// Kliknięcie otwiera formularz w okienku.
const content = usePageContent()
const open = ref(false)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <button type="button" class="idea-tile" @click="open = true">
    <span class="idea-plus" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </span>
    <span class="idea-kicker">{{ content.title('dream-map-form-kicker', 'Twój głos') }}</span>
    <span class="idea-title">{{ content.title('dream-map-form-intro', 'Zgłoś swój pomysł') }}</span>
    <span class="idea-text">{{ content.body('dream-map-form-intro', 'Masz pomysł, jak zmienić Ustrzyki Dolne na lepsze? Opisz go — przeczytamy każde zgłoszenie.') }}</span>
    <span class="idea-cta">Zgłoś pomysł →</span>
  </button>

  <Teleport to="body">
    <div v-if="open" class="idea-overlay" @click.self="open = false">
      <div class="idea-dialog" role="dialog" aria-modal="true" aria-label="Zgłoś swój pomysł">
        <button type="button" class="idea-close" aria-label="Zamknij" @click="open = false">×</button>
        <DreamMapIdeaForm compact />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.idea-tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  width: 100%;
  min-height: 100%;
  padding: 1.75rem;
  border: 1.5px dashed rgba(169, 84, 31, 0.45);
  border-radius: 18px;
  background: linear-gradient(160deg, #fffaf5 0%, #fff 60%);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.idea-tile:hover {
  transform: translateY(-3px);
  border-color: #a9541f;
  box-shadow: 0 18px 40px rgba(169, 84, 31, 0.12);
}

.idea-plus {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 0.3rem;
  border-radius: 50%;
  background: #a9541f;
  color: #fff;
  transition: transform 0.25s;
}

.idea-tile:hover .idea-plus {
  transform: rotate(90deg);
}

.idea-kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #a9541f;
}

.idea-title {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 600;
  line-height: 1.25;
  color: #151d1c;
}

.idea-text {
  font-size: 0.92rem;
  line-height: 1.65;
  color: #6c7173;
}

.idea-cta {
  margin-top: auto;
  padding-top: 0.6rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #a9541f;
}

.idea-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(21, 29, 28, 0.6);
  backdrop-filter: blur(4px);
}

.idea-dialog {
  position: relative;
  width: min(640px, 100%);
  max-height: calc(100dvh - 3rem);
  overflow-y: auto;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
}

.idea-close {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 1;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: #f2f0ec;
  color: #151d1c;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
}

.idea-close:hover {
  background: #e7e4dd;
}

@media (max-width: 600px) {
  .idea-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .idea-dialog {
    max-height: 92dvh;
    border-radius: 20px 20px 0 0;
  }
}
</style>
