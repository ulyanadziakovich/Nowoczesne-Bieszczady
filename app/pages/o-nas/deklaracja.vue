<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
const page = await usePageTexts('strona-o-nas')
await usePageTitle(() => page.t('deklaracjaTitle'))
const fileUrl = computed(() => page.file('deklaracjaFile'))
const step3 = computed(() => page.t('deklaracjaStep3').split('{email}'))
const { data: settings } = await useCmsSingle<SiteSettings>('site-settings')
</script>

<template>
  <div>
    <h2>{{ page.t('deklaracjaTitle') }}</h2>
    <RichText :html="page.html('deklaracjaText')" :lead="false" />
    <a v-if="fileUrl" :href="fileUrl" class="btn btn-amber" target="_blank" rel="noopener">{{ page.t('deklaracjaDownload') }}</a>
    <button v-else type="button" class="btn btn-amber is-disabled" disabled>{{ page.t('deklaracjaSoon') }}</button>

    <div class="steps">
      <div class="step">
        <span class="num">1</span>
        <p>{{ page.t('deklaracjaStep1') }}</p>
      </div>
      <div class="step">
        <span class="num">2</span>
        <p>{{ page.t('deklaracjaStep2') }}</p>
      </div>
      <div class="step">
        <span class="num">3</span>
        <p>
          {{ step3[0] }}<a v-if="step3.length > 1" :href="`mailto:${settings?.email}`">{{ settings?.email }}</a>{{ step3.slice(1).join('') }}
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
