<script setup lang="ts">
defineProps<{
  image: string
  image2?: string
  title: string
  description: string
  buttonLabel?: string
}>()
</script>

<template>
  <article class="tile">
    <div class="tile-image-wrap">
      <img :src="image" :alt="title" class="tile-image" />
      <img v-if="image2" :src="image2" :alt="title" class="tile-image tile-image-alt" />
    </div>
    <div class="tile-body">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <a v-if="buttonLabel" href="#" class="tile-button">{{ buttonLabel }}</a>
    </div>
  </article>
</template>

<style scoped>
.tile {
  background: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
}

.tile-image-wrap {
  position: relative;
  height: 190px;
  overflow: hidden;
}

.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tile-image-alt {
  position: absolute;
  inset: 0;
  clip-path: polygon(38% 0, 100% 0, 100% 100%, 58% 100%);
  box-shadow: -2px 0 0 rgba(255, 255, 255, 0.9);
}

.tile-body {
  padding: 1.25rem 1.5rem;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

p {
  margin: 0;
  color: #5a6472;
  font-size: 0.9rem;
  line-height: 1.5;
}

.tile-button {
  display: inline-block;
  margin-top: 1.25rem;
  background: #12181f;
  color: #fff;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
}

.tile-button:hover {
  background: #e8672c;
}
</style>
