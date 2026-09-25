<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="app-main">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <AppFooter />
  </div>
</template>

<style>
:root {
  --ink: #1a2420;
  --ink-light: #1f2b25;
  --alpine: #135e24;
  --green: #23ab41;
  --leaf: #89be3a;
  --amber: #a8551f;
  --stone: #f3f1ea;
  --mist: #eff2ef;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Fraunces', Georgia, serif;
}

* {
  box-sizing: border-box;
}

html {
  overflow-x: hidden;
}

body {
  margin: 0;
  overflow-x: hidden;
  font-family: var(--font-body);
  background: var(--mist);
  color: var(--ink);
}

/* Sticky footer: on tall/large viewports where the page content is
   shorter than the screen, .app-main grows to fill the remaining space
   instead of leaving the footer floating right under short content. */
.app-shell {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  flex-direction: column;
}

.app-main {
  flex: 1 0 auto;
}

/* ---- Shared page/design-system utilities (used across all subpages) ---- */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section {
  padding: 5rem 0;
}

.section-tight {
  padding: 3.5rem 0;
}

.section-alt {
  background: var(--stone);
}

.kicker {
  display: inline-block;
  color: var(--amber);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 1rem;
}

.section-head {
  max-width: 720px;
  margin: 0 auto 3rem;
  text-align: center;
}

.lead {
  color: #4a4a44;
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.01em;
  padding: 0.85rem 1.6rem;
  border: 1.5px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  background: none;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}

.btn-amber {
  background: var(--amber);
  color: #fff;
}

.btn-amber:hover {
  background: #8f4a1c;
}

.btn-ink {
  background: var(--ink);
  color: #fff;
}

.btn-ink:hover {
  background: var(--alpine);
}

.btn-outline {
  border-color: var(--ink);
  color: var(--ink);
}

.btn-outline:hover {
  background: var(--ink);
  color: #fff;
}

.btn[disabled],
.btn.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.card-surface {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 36px rgba(26, 36, 32, 0.08);
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.pill-easy {
  background: #e4efe0;
  color: var(--alpine);
}

.pill-medium {
  background: #fbe9d9;
  color: var(--amber);
}

.pill-hard {
  background: #f5e0dd;
  color: #a8341c;
}

@media (max-width: 900px) {
  .section {
    padding: 3rem 0;
  }

  .section-tight {
    padding: 2.5rem 0;
  }

  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }

  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 1.8rem;
  }
}
</style>
