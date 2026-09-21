<script setup lang="ts">
const props = defineProps<{
  image?: string
  image2?: string
  title: string
  description: string
  buttonLabel?: string
  back?: string
  moreHref?: string
  partnerImage?: string
  partnerHref?: string
  plain?: boolean
}>()

const flipped = ref(false)
const flippable = computed(() => !!(props.back || props.partnerImage))
</script>

<template>
  <article v-if="flippable" class="tile flip">
    <div class="tile-inner" :class="{ flipped }" @click="flipped = !flipped">
      <div class="face face-front">
        <div v-if="plain" class="tile-image-wrap tile-plain">
          <span class="plain-label">{{ title }}</span>
        </div>
        <div v-else class="tile-image-wrap">
          <img :src="image" :alt="title" class="tile-image" />
        </div>
        <div class="tile-body">
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
        <span class="hint">Klik</span>
      </div>

      <PartnerFace v-if="partnerImage" :image="partnerImage" :href="partnerHref" />
      <div v-else class="face face-back">
        <div class="tile-body">
          <h3>{{ title }}</h3>
          <p>{{ back }}</p>
        </div>
        <NuxtLink v-if="moreHref" :to="moreHref" class="tile-button" @click.stop>Więcej</NuxtLink>
      </div>
    </div>
  </article>

  <article v-else class="tile">
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
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
}

.tile-image-wrap {
  position: relative;
  height: 190px;
  overflow: hidden;
  flex-shrink: 0;
}

.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tile-plain {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--green) 0%, var(--alpine) 100%);
  text-align: center;
  padding: 1rem;
}

.plain-label {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.01em;
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
  color: #5a6a62;
  font-size: 0.9rem;
  line-height: 1.5;
}

.tile-button {
  display: inline-block;
  margin-top: 1.25rem;
  background: var(--ink);
  color: #fff;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
}

.tile-button:hover {
  background: var(--amber);
}

.tile.flip {
  height: 340px;
  background: none;
  box-shadow: none;
  perspective: 1500px;
}

.tile-inner {
  position: relative;
  height: 100%;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}

.tile-inner.flipped {
  transform: rotateY(180deg);
}

.face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
}

.face-back {
  transform: rotateY(180deg);
}

.face-back h3 {
  color: var(--alpine);
}

.face-back .tile-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.face-back .tile-button {
  align-self: center;
  margin: 0 0 1.25rem;
}

.hint {
  margin: 0.25rem 0 1.25rem;
  align-self: center;
  color: #9aa39c;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
