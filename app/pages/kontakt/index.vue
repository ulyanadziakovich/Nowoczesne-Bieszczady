<script setup lang="ts">
definePageMeta({ solidHeader: true })
const page = await usePageTexts('strona-kontakt')
usePageTheme(page)
await usePageTitle(() => page.t('pageTitle'))
const { data: settings } = await useCmsSingle<SiteSettings>('site-settings')

const form = reactive({ name: '', email: '', message: '' })
const sent = ref(false)

function submit() {
  // Formularz działa na razie wyłącznie po stronie klienta — do podpięcia realnego wysyłania
  // (np. przez endpoint /api/kontakt) w kolejnym etapie.
  sent.value = true
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>

<template>
  <div>
    <PageHero
      variant="light"
      :kicker="page.t('heroKicker')"
      :title="page.t('heroTitle')"
      :description-html="page.html('heroDescription')"
      :stats="page.lines('stats')"
    />

    <section class="section">
      <div class="container layout">
        <form class="form card-surface" @submit.prevent="submit">
          <h2>{{ page.t('formTitle') }}</h2>

          <div v-if="sent" class="success">{{ page.t('formSuccess') }}</div>

          <label>
            {{ page.t('formName') }}
            <input v-model="form.name" type="text" required :placeholder="page.t('formNamePlaceholder')" />
          </label>

          <label>
            {{ page.t('formEmail') }}
            <input v-model="form.email" type="email" required :placeholder="page.t('formEmailPlaceholder')" />
          </label>

          <label>
            {{ page.t('formMessage') }}
            <textarea v-model="form.message" required rows="5" :placeholder="page.t('formMessagePlaceholder')" />
          </label>

          <button type="submit" class="btn btn-amber">{{ page.t('formSubmit') }}</button>
        </form>

        <aside class="info">
          <div class="info-card card-surface">
            <h3>{{ page.t('infoTitle') }}</h3>
            <p>{{ settings?.address }}</p>
            <a :href="`mailto:${settings?.email}`" class="contact-item">{{ settings?.email }}</a>
            <a :href="`tel:${settings?.phone?.replace(/\s/g, '')}`" class="contact-item">{{ settings?.phone }}</a>
          </div>

          <div v-if="settings?.facebookUrl" class="info-card card-surface">
            <h3>{{ page.t('socialTitle') }}</h3>
            <a :href="settings.facebookUrl" target="_blank" rel="noopener" class="contact-item">{{ settings.facebookLabel || 'Facebook' }}</a>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 3rem;
  align-items: start;
}

.form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.6rem;
}

.success {
  background: #e4efe0;
  color: var(--alpine);
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
  font-size: 0.88rem;
  font-weight: 600;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ink);
}

input,
textarea {
  font-family: inherit;
  font-size: 0.92rem;
  padding: 0.75rem 0.9rem;
  border: 1.5px solid #d7dcd6;
  border-radius: 10px;
  background: #fff;
  resize: vertical;
  transition: border-color 0.15s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--alpine);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  padding: 1.75rem;
}

.info-card h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 800;
}

.info-card p {
  margin: 0 0 0.75rem;
  color: #5a6a62;
  font-size: 0.9rem;
}

.contact-item {
  display: block;
  color: var(--alpine);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.contact-item:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
