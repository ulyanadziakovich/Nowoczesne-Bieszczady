/**
 * Powiększone zdjęcia na telefonie: zamiast strzałek pasek zdjęć przewijany
 * palcem (scroll-snap). Na komputerze bez zmian — jedno zdjęcie i strzałki.
 * `openIndex` — numer otwartego zdjęcia; pasek przewija się do niego po otwarciu,
 * a przesuwanie palcem aktualizuje numer (licznik „3 / 29”).
 */
export function useSwipeLightbox(openIndex: Ref<number | null>) {
  const isTouch = ref(false)
  const trackEl = ref<HTMLElement | null>(null)
  let mql: MediaQueryList | null = null
  const update = () => (isTouch.value = !!mql?.matches)

  onMounted(() => {
    mql = window.matchMedia('(max-width: 700px), (pointer: coarse)')
    update()
    mql.addEventListener('change', update)
  })
  onUnmounted(() => mql?.removeEventListener('change', update))

  // Po otwarciu przewijamy pasek od razu (bez animacji) do klikniętego zdjęcia.
  watch(openIndex, async (index, before) => {
    if (index === null || before !== null || !isTouch.value) return
    await nextTick()
    const el = trackEl.value
    if (el) el.scrollLeft = index * el.clientWidth
  })

  let frame = 0
  function onTrackScroll() {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const el = trackEl.value
      if (!el || openIndex.value === null) return
      openIndex.value = Math.round(el.scrollLeft / el.clientWidth)
    })
  }

  return { isTouch, trackEl, onTrackScroll }
}
