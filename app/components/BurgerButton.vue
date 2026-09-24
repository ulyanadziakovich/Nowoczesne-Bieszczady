<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <button class="burger" :class="{ open }" aria-label="Menu" @click="$emit('toggle')">
    <span /><span /><span />
  </button>
</template>

<style scoped>
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.burger span {
  width: 18px;
}

.burger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.burger.open span:nth-child(1) {
  transform: translateY(5px) rotate(45deg);
}

.burger.open span:nth-child(2) {
  opacity: 0;
}

.burger.open span:nth-child(3) {
  transform: translateY(-5px) rotate(-45deg);
}

@media (max-width: 800px) {
  .burger {
    display: flex;
  }
}
</style>
