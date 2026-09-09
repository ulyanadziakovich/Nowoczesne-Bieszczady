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
  gap: 5px;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.burger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #fff;
}

@media (max-width: 800px) {
  .burger {
    display: flex;
  }
}
</style>
