<script setup lang="ts">
const links = [
  { label: 'Szlaki rowerowe', to: '/szlaki' },
  { label: 'Ustrzyki 2036', to: '/ustrzyki-2036' },
  { label: 'Korona Ustrzyckich Gór', to: '/korona-gor' },
  { label: 'Kultura', to: '/kultura' },
  { label: 'Inicjatywy', to: '/inicjatywy' },
  {
    label: 'O nas',
    to: '/o-nas/misja',
    children: [
      { label: 'Kim jesteśmy / Misja', to: '/o-nas/misja' },
      { label: 'Cele Stowarzyszenia', to: '/o-nas/cele' },
      { label: 'Statut Stowarzyszenia', to: '/o-nas/statut' },
      { label: 'Deklaracja członkowska', to: '/o-nas/deklaracja' },
      { label: 'Zarząd i Zespół', to: '/o-nas/zarzad' },
      { label: 'Sprawozdania', to: '/o-nas/sprawozdania' },
      { label: 'Partnerzy i Grantodawcy', to: '/o-nas/partnerzy' },
    ],
  },
  { label: 'Aktualności', to: '/aktualnosci' },
  { label: 'Kontakt', to: '/kontakt' },
]

const { data: settings } = await useCmsSingle<SiteSettings>('site-settings')

const menuOpen = ref(false)
const openMobileGroup = ref<string | null>(null)
const scrolled = useScrolled()
const route = useRoute()

function toggleMobileGroup(label: string) {
  openMobileGroup.value = openMobileGroup.value === label ? null : label
}

function isActive(to: string) {
  return route.path === to || (to !== '/' && route.path.startsWith(to.split('/').slice(0, 2).join('/')))
}

function closeMenu() {
  menuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    openMobileGroup.value = null
  },
)

watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<template>
  <header class="header" :class="{ scrolled: scrolled || menuOpen || route.meta.solidHeader }">
    <TopBar />

    <div class="main-row">
      <NuxtLink to="/" class="logo-badge">
        <img :src="resolveCmsUrl(settings?.logo?.src)" alt="Nowoczesne Bieszczady" />
      </NuxtLink>

      <div class="nav-group">
        <nav class="nav">
          <div v-for="link in links" :key="link.label" class="nav-item" :class="{ 'has-children': link.children }">
            <NuxtLink :to="link.to" :class="{ active: isActive(link.to) }">
              {{ link.label }}
              <span v-if="link.children" class="chevron">⌄</span>
            </NuxtLink>

            <div v-if="link.children" class="dropdown">
              <NuxtLink v-for="child in link.children" :key="child.label" :to="child.to">{{ child.label }}</NuxtLink>
            </div>
          </div>
        </nav>
      </div>

      <BurgerButton :open="menuOpen" @toggle="menuOpen = !menuOpen" />
    </div>

    <Teleport to="body">
      <Transition name="menu-fade">
        <div v-if="menuOpen" class="mobile-menu">
          <div class="mobile-menu-top">
            <NuxtLink to="/" class="logo-badge" @click="closeMenu">
              <img :src="resolveCmsUrl(settings?.logo?.src)" alt="Nowoczesne Bieszczady" />
            </NuxtLink>
            <button class="close-btn" aria-label="Zamknij menu" @click="closeMenu">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav class="mobile-nav">
            <div v-for="(link, i) in links" :key="link.label" class="mobile-nav-item" :style="{ '--i': i }">
              <NuxtLink v-if="!link.children" :to="link.to" class="mobile-nav-link">
                <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="mobile-nav-label">{{ link.label }}</span>
              </NuxtLink>

              <button v-else type="button" class="mobile-nav-link as-button" @click="toggleMobileGroup(link.label)">
                <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="mobile-nav-label">{{ link.label }}</span>
                <svg
                  class="chev"
                  :class="{ open: openMobileGroup === link.label }"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div v-if="link.children" class="mobile-submenu" :class="{ open: openMobileGroup === link.label }">
                <div class="mobile-submenu-inner">
                  <NuxtLink v-for="child in link.children" :key="child.label" :to="child.to" class="mobile-sublink">
                    {{ child.label }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </nav>

          <div class="mobile-menu-footer">
            <a href="mailto:biuro@nowoczesnebieszczady.pl">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18v12H3z" /><path d="M3 7l9 6 9-6" /></svg>
              biuro@nowoczesnebieszczady.pl
            </a>
            <a href="tel:+48507068728">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" /></svg>
              507 068 728
            </a>
            <a href="https://www.facebook.com/nowoczesne.bieszczady/?locale=pl_PL" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.4.2-.8.8-.8H16V8z" /></svg>
              Facebook
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  color: #fff;
  background: transparent;
  transition: background 0.2s;
}

.header.scrolled {
  background: var(--ink);
}

.main-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 1.25rem 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
}

.logo-badge {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-badge img {
  height: 40px;
  width: auto;
  display: block;
}

.nav-group {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  min-width: 0;
}

.nav {
  display: flex;
  gap: 1.1rem;
}

.nav-item {
  position: relative;
}

.nav-item > a {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  color: #d7dce1;
  text-decoration: none;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.nav-item > a:hover {
  color: #fff;
}

.nav-item > a.active {
  color: #fff;
  border-color: var(--amber);
}

.chevron {
  font-size: 0.65rem;
  transition: transform 0.15s;
}

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 260px;
  padding: 0.5rem 0;
  background: var(--ink);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

.nav-item.has-children:hover .dropdown,
.nav-item.has-children:focus-within .dropdown {
  display: block;
}

.dropdown a {
  display: block;
  padding: 0.65rem 1.25rem;
  color: #d7dce1;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
}

.dropdown a:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

@media (max-width: 1100px) {
  .nav {
    gap: 0.85rem;
  }

  .nav-item > a {
    font-size: 0.7rem;
  }
}

@media (max-width: 800px) {
  .nav-group {
    display: none;
  }

  .main-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7rem 1.25rem;
    border-bottom: none;
  }

  .logo-badge img {
    height: 22px;
  }
}

/* ---------- Premium full-screen mobile menu ---------- */

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: none;
  flex-direction: column;
  background: #fff;
  color: var(--ink);
  overflow: hidden;
}

@media (max-width: 800px) {
  .mobile-menu {
    display: flex;
  }
}

.mobile-menu-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee9dd;
  flex-shrink: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--stone);
  border: 1px solid #e9e5db;
  color: var(--ink);
  cursor: pointer;
}

.mobile-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0.5rem 0 1rem;
  min-height: 0;
  overflow-y: auto;
}

.mobile-nav-item {
  border-bottom: 1px solid #eee9dd;
  opacity: 0;
  transform: translateY(10px);
  animation: nav-item-in 0.4s ease forwards;
  animation-delay: calc(var(--i) * 0.04s);
}

.mobile-nav-item:first-child {
  border-top: 1px solid #eee9dd;
}

@keyframes nav-item-in {
  to {
    opacity: 1;
    transform: none;
  }
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  width: 100%;
  padding: 1.3rem 1.5rem;
  background: none;
  border: none;
  color: var(--ink);
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 700;
  font-family: var(--font-display);
  text-align: left;
  cursor: pointer;
  transition: color 0.15s;
}

.mobile-nav-link:active,
.mobile-nav-link:hover {
  color: var(--ink);
}

.mobile-nav-item:has(.mobile-nav-link:hover),
.mobile-nav-item:has(.mobile-nav-link:active) {
  background: var(--mist);
}

.idx {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: #7a8a7e;
  flex-shrink: 0;
}

.mobile-nav-label {
  flex: 1;
}

.chev {
  flex-shrink: 0;
  color: #b7c2b7;
  transition: transform 0.25s;
}

.chev.open {
  transform: rotate(180deg);
  color: var(--amber);
}

.mobile-submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-submenu.open {
  max-height: 480px;
  padding-bottom: 0.75rem;
}

.mobile-submenu-inner {
  padding-left: 4.1rem;
  padding-right: 1.5rem;
}

.mobile-sublink {
  display: block;
  overflow: hidden;
  color: #5a6a62;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0.6rem 0;
}

.mobile-sublink:hover {
  color: var(--ink);
}

.mobile-menu-footer {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.5rem;
  background: var(--stone);
}

.mobile-menu-footer a {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--ink);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
}

.mobile-menu-footer a svg {
  flex-shrink: 0;
  color: var(--amber);
}

.mobile-menu-footer a:hover {
  color: var(--amber);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>
