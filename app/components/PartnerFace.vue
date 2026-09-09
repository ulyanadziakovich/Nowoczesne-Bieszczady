<script setup lang="ts">
defineProps<{ image: string; href?: string }>()
</script>

<template>
  <div class="face-partner" :style="{ backgroundImage: `url(${image})` }">
    <div class="overlay" />
    <p class="label">Poznaj stronę partnera</p>
    <a :href="href" target="_blank" rel="noopener" class="link" @click.stop>bieszczady.plus</a>
  </div>
</template>

<style scoped>
.face-partner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  padding-bottom: 1.5rem;
  background-size: cover;
  background-position: center;
  backface-visibility: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  transform: rotateY(180deg);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(20, 25, 20, 0.1) 0%, rgba(20, 25, 20, 0.8) 100%);
}

.label {
  position: relative;
  margin: 0 0 0.75rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
}

.link {
  position: relative;
  display: inline-block;
  margin-top: 1.25rem;
  background: var(--amber);
  color: #fff;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
}

.link:hover {
  background: #a8551f;
}
</style>
