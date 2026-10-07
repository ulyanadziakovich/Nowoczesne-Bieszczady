<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    kicker?: string
    title: string
    description?: string
    /** Sformatowany opis z edytora CMS (HTML) — zastępuje `description`, gdy jest. */
    descriptionHtml?: string
    image?: string
    variant?: 'photo' | 'light'
    stats?: string[]
  }>(),
  {
    variant: 'photo',
  },
)

// Długi opis z CMS dzielimy: pierwszy akapit zostaje w nagłówku jako wstęp,
// a reszta trafia pod nagłówek do osobnej, wygodnej do czytania kolumny
// (zwiniętej, gdy jest bardzo długa) — zamiast ściany tekstu w nagłówku.
const split = computed(() => {
  const html = sanitizeCmsHtml(props.descriptionHtml)
  const m = html.match(/^\s*(<p>[\s\S]*?<\/p>)([\s\S]*)$/)
  return m ? { lead: m[1]!, rest: m[2]!.trim() } : { lead: html, rest: '' }
})
</script>

<template>
  <section v-if="variant === 'light'" class="page-hero light">
    <div class="topo" />
    <div class="container content">
      <div v-if="kicker" class="kicker-row">
        <span class="kicker">{{ kicker }}</span>
        <span class="dash-line" />
        <span class="badge-dot">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 2l1.8 5.6H20l-4.6 3.5L17.2 17 12 13.4 6.8 17l1.8-5.9L4 7.6h6.2z" />
          </svg>
        </span>
      </div>
      <h1>{{ title }}</h1>
      <RichText v-if="split.lead" class="hero-text hero-lead" :html="split.lead" />
      <RichText v-else-if="description" class="hero-text" :text="description" />

      <div v-if="stats?.length" class="stats-row">
        <template v-for="(stat, i) in stats" :key="stat">
          <span v-if="i" class="stats-sep" />
          <span class="stat">{{ stat }}</span>
        </template>
      </div>
    </div>
  </section>

  <section v-if="variant === 'light' && split.rest" class="page-intro">
    <div class="container">
      <div class="intro-column">
        <RichText :html="split.rest" :lead="false" collapsible collapsed-height="28rem" />
      </div>
    </div>
  </section>

  <section v-if="variant !== 'light'" class="page-hero" :style="{ backgroundImage: `url(${image})` }">
    <div class="overlay" />
    <div class="container content">
      <span v-if="kicker" class="kicker">{{ kicker }}</span>
      <h1>{{ title }}</h1>
      <RichText v-if="description || descriptionHtml" class="hero-text" :text="description" :html="descriptionHtml" tone="dark" />
    </div>
  </section>
</template>

<style scoped>
/* ---- Opis pod nagłówkiem: jedna wyśrodkowana kolumna do czytania ---- */
.page-intro {
  --fade-to: #fff;
  background: #fff;
  padding: 4.5rem 0 4rem;
  border-bottom: 1px solid rgba(26, 36, 32, 0.06);
}

.intro-column {
  max-width: 760px;
  margin: 0 auto;
}

.intro-column :deep(.rich-html p),
.intro-column :deep(.rich-p) {
  font-size: 1.06rem;
  line-height: 1.85;
}

.intro-column :deep(.rich-html h2),
.intro-column :deep(.rich-heading) {
  margin-top: 2.6rem;
  font-size: clamp(1.35rem, 2.4vw, 1.7rem);
}

.intro-column :deep(.rich-html > :first-child),
.intro-column :deep(.rich > :first-child) {
  margin-top: 0;
}

.hero-lead {
  max-width: 820px;
}

.hero-lead :deep(p) {
  font-size: clamp(1.08rem, 1.6vw, 1.22rem) !important;
  line-height: 1.7 !important;
}

@media (max-width: 800px) {
  .page-intro {
    padding: 3rem 0 2.75rem;
  }
}

.page-hero {
  position: relative;
  margin-top: 0;
  padding-top: 9rem;
  padding-bottom: 4rem;
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 14, 18, 0.75) 0%, rgba(10, 14, 18, 0.35) 55%, rgba(10, 14, 18, 0.75) 100%);
}

.content {
  position: relative;
  color: #fff;
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 600;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.35);
}

.hero-text {
  margin-top: 1rem;
}

/* ---- Light variant: plain content header, no photo ---- */

.page-hero.light {
  position: relative;
  overflow: hidden;
  background: var(--stone);
  padding-top: 7.5rem;
  padding-bottom: 2.75rem;
  min-height: 0;
  display: block;
  border-bottom: 1px solid rgba(26, 36, 32, 0.08);
}

.page-hero.light .topo {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-image: repeating-radial-gradient(circle at 12% 20%, transparent 0, transparent 26px, rgba(19, 94, 36, 0.06) 27px, transparent 28px),
    repeating-radial-gradient(circle at 92% 75%, transparent 0, transparent 34px, rgba(201, 103, 46, 0.05) 35px, transparent 36px);
}

.page-hero.light .content {
  position: relative;
  color: var(--text-title);
}

.stats-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
}

.stat {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--alpine);
  letter-spacing: 0.01em;
}

.stats-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b7c2b7;
}

.kicker-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.dash-line {
  flex: 1;
  max-width: 140px;
  height: 0;
  border-top: 1.5px dashed rgba(26, 36, 32, 0.25);
}

.badge-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--amber);
  color: var(--amber);
  flex-shrink: 0;
}

.page-hero.light h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  text-shadow: none;
}


@media (max-width: 800px) {
  .page-hero {
    padding-top: 7rem;
    padding-bottom: 2.5rem;
    min-height: 240px;
  }

  .page-hero.light {
    padding-top: 6.5rem;
    padding-bottom: 2rem;
  }
}
</style>
