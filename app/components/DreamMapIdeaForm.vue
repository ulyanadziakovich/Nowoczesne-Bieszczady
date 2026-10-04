<script setup lang="ts">
// Formularz „Zgłoś swój pomysł” — zgłoszenia trafiają do CMS (kolekcja
// „Zgłoszone pomysły”) i, gdy skonfigurowano wysyłkę, na e-mail stowarzyszenia.
// Wszystkie teksty formularza można zmienić w CMS (treści strony, klucze dream-map-form-*).
const content = usePageContent()

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
  <section id="zglos-pomysl" class="idea-form-wrap">
    <div class="idea-intro">
      <span class="kicker">{{ content.title('dream-map-form-kicker', 'Twój głos') }}</span>
      <h2>{{ content.title('dream-map-form-intro', 'Zgłoś swój pomysł') }}</h2>
      <p>{{ content.body('dream-map-form-intro', 'Masz pomysł, jak zmienić Ustrzyki Dolne na lepsze? Opisz go — przeczytamy każde zgłoszenie.') }}</p>
    </div>

    <div v-if="status === 'sent'" class="idea-success" role="status">
      <strong>{{ content.title('dream-map-form-success', 'Dziękujemy!') }}</strong>
      <p>{{ content.body('dream-map-form-success', 'Twój pomysł do nas dotarł. Skontaktujemy się, jeśli będziemy mieli pytania.') }}</p>
      <button type="button" class="btn btn-outline" @click="status = 'idle'">Zgłoś kolejny pomysł</button>
    </div>

    <form v-else class="idea-form" @submit.prevent="submit">
      <label>
        <span>1. Tytuł pomysłu</span>
        <input v-model="form.title" type="text" required maxlength="150" />
      </label>
      <label>
        <span>2. Opis problemu do rozwiązania</span>
        <textarea v-model="form.problem" rows="4" required maxlength="3000" />
      </label>
      <label>
        <span>3. Propozycja rozwiązania / Twój pomysł</span>
        <textarea v-model="form.solution" rows="4" required maxlength="3000" />
      </label>
      <label>
        <span>4. Kontakt (e-mail lub telefon)</span>
        <input v-model="form.contact" type="text" required maxlength="200" autocomplete="email" />
      </label>
      <!-- pole-pułapka na boty, niewidoczne dla ludzi -->
      <input v-model="form.website" class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <p v-if="status === 'error'" class="idea-error" role="alert">
        Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę.
      </p>
      <button type="submit" class="btn btn-amber" :disabled="status === 'sending'">
        {{ status === 'sending' ? 'Wysyłanie…' : 'Wyślij pomysł' }}
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
  border-color: var(--alpine);
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
  background: #eaf3e2;
}

.idea-success strong {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--alpine);
}

.idea-success p {
  margin: 0.5rem 0 1rem;
  color: #3d3d38;
}

@media (max-width: 800px) {
  .idea-form-wrap {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
}
</style>
