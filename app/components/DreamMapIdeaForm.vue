<script setup lang="ts">
// Formularz „Zgłoś swój pomysł” — zgłoszenia trafiają do CMS (kolekcja
// „Zgłoszone pomysły”) i, gdy skonfigurowano wysyłkę, na e-mail stowarzyszenia.
// Wszystkie teksty formularza można zmienić w CMS (treści strony, klucze dream-map-form-*).
const page = usePageTextsSync('dream-map-settings')
// compact = jedna kolumna, bez własnego tła (wewnątrz okienka z kafelka)
defineProps<{ compact?: boolean }>()

const form = reactive({ title: '', problem: '', solution: '', contact: '', website: '' })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

async function submit() {
  if (status.value === 'sending') return
  status.value = 'sending'
  try {
    await $fetch('/api/dream-map-idea', { method: 'POST', body: { ...form } })
    status.value = 'sent'
    Object.assign(form, { title: '', problem: '', solution: '', contact: '', website: '' })
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section class="idea-form-wrap" :class="{ compact }">
    <div class="idea-intro">
      <span class="kicker">{{ page.t('ideaKicker') }}</span>
      <h2>{{ page.t('ideaTitle') }}</h2>
      <p>{{ page.t('ideaText') }}</p>
    </div>

    <div v-if="status === 'sent'" class="idea-success" role="status">
      <strong>{{ page.t('ideaSuccessTitle') }}</strong>
      <p>{{ page.t('ideaSuccessText') }}</p>
      <button type="button" class="btn btn-outline" @click="status = 'idle'">{{ page.t('ideaAgain') }}</button>
    </div>

    <form v-else class="idea-form" @submit.prevent="submit">
      <label>
        <span>{{ page.t('ideaField1') }}</span>
        <input v-model="form.title" type="text" required maxlength="150" />
      </label>
      <label>
        <span>{{ page.t('ideaField2') }}</span>
        <textarea v-model="form.problem" rows="4" required maxlength="3000" />
      </label>
      <label>
        <span>{{ page.t('ideaField3') }}</span>
        <textarea v-model="form.solution" rows="4" required maxlength="3000" />
      </label>
      <label>
        <span>{{ page.t('ideaField4') }}</span>
        <input v-model="form.contact" type="text" required maxlength="200" autocomplete="email" />
      </label>
      <!-- pole-pułapka na boty, niewidoczne dla ludzi -->
      <input v-model="form.website" class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <p v-if="status === 'error'" class="idea-error" role="alert">
        {{ page.t('ideaError') }}
      </p>
      <button type="submit" class="btn btn-amber" :disabled="status === 'sending'">
        {{ status === 'sending' ? page.t('ideaSending') : page.t('ideaSubmit') }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.idea-form-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: 2.5rem;
  align-items: start;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(26, 36, 32, 0.08);
  padding: 2.5rem;
}

.kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--amber);
}

.idea-intro h2 {
  margin: 0.4rem 0 0.75rem;
  font-family: var(--font-display);
  font-size: 1.9rem;
  color: var(--ink);
}

.idea-intro p {
  margin: 0;
  color: #4a4a44;
  line-height: 1.6;
}

.idea-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.idea-form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.idea-form label span {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink);
}

.idea-form input,
.idea-form textarea {
  font: inherit;
  font-size: 0.95rem;
  padding: 0.75rem 0.9rem;
  border: 1.5px solid #dcd8cc;
  border-radius: 10px;
  background: #fbfaf6;
  color: var(--ink);
  resize: vertical;
}

.idea-form input:focus,
.idea-form textarea:focus {
  outline: none;
  border-color: #a9541f;
  background: #fff;
}

.idea-form .btn {
  align-self: flex-start;
}

.hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.idea-error {
  margin: 0;
  color: #ad0000;
  font-size: 0.9rem;
}

.idea-success {
  padding: 1.5rem;
  border-radius: 14px;
  background: #fbf3ec;
}

.idea-success strong {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: #a9541f;
}

.idea-success p {
  margin: 0.5rem 0 1rem;
  color: #3d3d38;
}

.idea-form-wrap.compact {
  grid-template-columns: 1fr;
  gap: 1.5rem;
  box-shadow: none;
  padding: 2.25rem 2rem 2rem;
}

@media (max-width: 800px) {
  .idea-form-wrap {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
}
</style>
