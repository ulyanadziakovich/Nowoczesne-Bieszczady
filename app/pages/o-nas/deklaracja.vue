<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Deklaracja członkowska — O nas — Nowoczesne Bieszczady' })

const content = usePageContent()
const { data: settings } = await useCmsSingle<SiteSettings>('site-settings')
</script>

<template>
  <div>
    <h2>Deklaracja członkowska</h2>
    <p>{{ content.body('deklaracja-intro') }}</p>

    <a :href="content.image('deklaracja-intro')" class="btn btn-amber" download>Pobierz deklarację członkowską (PDF)</a>

    <div class="steps">
      <div class="step">
        <span class="num">1</span>
        <p>Pobierz i wypełnij formularz deklaracji.</p>
      </div>
      <div class="step">
        <span class="num">2</span>
        <p>Podpisz dokument odręcznie lub elektronicznie.</p>
      </div>
      <div class="step">
        <span class="num">3</span>
        <p>
          Prześlij skan na <a :href="`mailto:${settings?.email}`">{{ settings?.email }}</a> lub dostarcz osobiście.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  margin: 0.5rem 0 2rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.num {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--alpine);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
}

.step p {
  margin: 0.15rem 0 0;
}
</style>
