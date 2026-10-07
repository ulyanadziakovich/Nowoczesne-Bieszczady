<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
const page = await usePageTexts('strona-o-nas')
await usePageTitle(() => page.t('misjaPageTitle'))
</script>

<template>
  <div>
    <h2>{{ page.t('misjaTitle') }}</h2>
    <RichText :html="page.html('misjaText')" :lead="false" />
  </div>
</template>
