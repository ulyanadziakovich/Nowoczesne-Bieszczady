<script setup lang="ts">
definePageMeta({ layout: 'onas', solidHeader: true })
useHead({ title: 'Kim jesteśmy — O nas — Nowoczesne Bieszczady' })

const content = usePageContent()
</script>

<template>
  <div>
    <h2>Kim jesteśmy / Nasza Misja</h2>
    <p v-for="(paragraph, i) in content.paragraphs('misja-body')" :key="i">{{ paragraph }}</p>
  </div>
</template>
