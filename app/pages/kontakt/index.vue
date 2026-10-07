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

    <section class="section contact-section">
      <div class="container contact-grid">
        <!-- Dane kontaktowe: duże, klikalne pozycje z ikonami. -->
        <aside class="contact-info">
          <h2 class="info-title">{{ page.t('infoTitle') }}</h2>
          <p class="info-text">{{ page.t('infoText') }}</p>

          <ul class="channels">
            <li v-if="settings?.email">
              <a :href="`mailto:${settings.email}`" class="channel">
                <span class="channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                </span>
                <span class="channel-text">
                  <span class="channel-label">{{ page.t('labelEmail') }}</span>
                  <span class="channel-value">{{ settings.email }}</span>
                </span>
              </a>
            </li>
            <li v-if="settings?.phone">
              <a :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="channel">
                <span class="channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" /></svg>
                </span>
                <span class="channel-text">
                  <span class="channel-label">{{ page.t('labelPhone') }}</span>
                  <span class="channel-value">{{ settings.phone }}</span>
                </span>
              </a>
            </li>
            <li v-if="settings?.address">
              <div class="channel">
                <span class="channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                </span>
                <span class="channel-text">
                  <span class="channel-label">{{ page.t('labelAddress') }}</span>
                  <span class="channel-value">{{ settings.address }}</span>
                </span>
              </div>
            </li>
            <li v-if="settings?.facebookUrl">
              <a :href="settings.facebookUrl" target="_blank" rel="noopener" class="channel">
                <span class="channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.4.2-.8.8-.8H16V8z" /></svg>
                </span>
                <span class="channel-text">
                  <span class="channel-label">{{ page.t('socialTitle') }}</span>
                  <span class="channel-value">{{ settings.facebookLabel || 'Facebook' }}</span>
                </span>
                <span class="channel-arrow" aria-hidden="true">→</span>
              </a>
            </li>
          </ul>
        </aside>

        <!-- Formularz -->
        <form class="contact-form" @submit.prevent="submit">
          <h2 class="form-title">{{ page.t('formTitle') }}</h2>

          <div v-if="sent" class="success" role="status">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" /></svg>
            <span>{{ page.t('formSuccess') }}</span>
          </div>

          <div class="field-row">
            <label class="field">
              <span>{{ page.t('formName') }}</span>
              <input v-model="form.name" type="text" required autocomplete="name" :placeholder="page.t('formNamePlaceholder')" />
            </label>
            <label class="field">
              <span>{{ page.t('formEmail') }}</span>
              <input v-model="form.email" type="email" required autocomplete="email" :placeholder="page.t('formEmailPlaceholder')" />
            </label>
          </div>

          <label class="field">
            <span>{{ page.t('formMessage') }}</span>
            <textarea v-model="form.message" required rows="6" :placeholder="page.t('formMessagePlaceholder')" />
          </label>

          <div class="form-footer">
            <p class="form-note">{{ page.t('formNote') }}</p>
            <button type="submit" class="submit">
              {{ page.t('formSubmit') }}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-section {
  padding-top: 5rem;
  padding-bottom: 6rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.25fr);
  gap: clamp(2.5rem, 5vw, 5rem);
  /* Formularz kończy się równo z ostatnią kartą kontaktu (Facebook). */
  align-items: end;
}

/* --- Dane kontaktowe --- */
.info-title {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-title);
}

.info-text {
  margin: 0 0 2rem;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text-lead);
}

.channels {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.channel {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.05rem 1.25rem;
  border: 1px solid #e6e2d8;
  border-radius: 16px;
  background: #fff;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

a.channel:hover {
  border-color: var(--amber);
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(26, 36, 32, 0.08);
}

.channel-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(168, 85, 31, 0.1);
  color: var(--amber);
}

.channel-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.channel-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-body);
}

.channel-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-title);
  overflow-wrap: anywhere;
}

.channel-arrow {
  color: var(--amber);
  font-weight: 700;
}

/* --- Formularz --- */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.75rem, 3vw, 2.75rem);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 30px 70px rgba(26, 36, 32, 0.1);
}

.form-title {
  margin: 0 0 0.25rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.2vw, 1.9rem);
  font-weight: 600;
  color: var(--text-title);
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field span {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-title);
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.95rem 1.05rem;
  border: 1.5px solid #e3ded1;
  border-radius: 12px;
  background: #fbfaf7;
  color: var(--text-title);
  font: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--amber);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(168, 85, 31, 0.12);
}

.form-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.25rem;
}

.form-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-body);
}

.submit {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.95rem 1.6rem;
  border: none;
  border-radius: 999px;
  background: var(--amber);
  color: #fff;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(168, 85, 31, 0.3);
}

.success {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 1rem 1.15rem;
  border-radius: 12px;
  background: rgba(168, 85, 31, 0.08);
  color: var(--text-title);
  font-size: 0.92rem;
  line-height: 1.5;
}

.success svg {
  flex-shrink: 0;
  color: var(--amber);
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .contact-section {
    padding-top: 3rem;
    padding-bottom: 4rem;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .channel {
    gap: 0.8rem;
    padding: 0.9rem 1rem;
  }

  .channel-icon {
    width: 40px;
    height: 40px;
  }

  .channel-value {
    font-size: 0.88rem;
    overflow-wrap: normal;
    word-break: normal;
  }

  .form-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .submit {
    justify-content: center;
  }
}
</style>
