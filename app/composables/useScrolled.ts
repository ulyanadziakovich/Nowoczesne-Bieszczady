export function useScrolled(threshold = 80) {
  const scrolled = ref(false)

  function onScroll() {
    scrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return scrolled
}
