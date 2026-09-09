<template>
  <div class="scroll-hint" aria-hidden="true">
    <span class="mouse">
      <span class="dot" />
    </span>
  </div>
</template>

<style scoped>
.scroll-hint {
  display: flex;
  justify-content: center;
  padding-bottom: 2.5rem;
}

@media (max-width: 800px) {
  .scroll-hint {
    display: none;
  }
}

.mouse {
  position: relative;
  width: 24px;
  height: 38px;
  border: 2px solid rgba(18, 24, 31, 0.4);
  border-radius: 14px;
}

.dot {
  position: absolute;
  top: 6px;
  left: 50%;
  width: 4px;
  height: 8px;
  background: var(--ink);
  border-radius: 2px;
  transform: translateX(-50%);
  animation: scroll-dot 1.6s infinite;
}

@keyframes scroll-dot {
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  70% {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  100% {
    opacity: 0;
  }
}
</style>
