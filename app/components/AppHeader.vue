<script setup lang="ts">
const links = [
  { label: 'O nas', href: '#' },
  { label: 'Edukacja', href: '#' },
  { label: 'Wydarzenia', href: '#wydarzenia' },
  { label: 'Turystyka', href: '#' },
  { label: 'Aktualności', href: '#wydarzenia' },
  { label: 'Kontakt', href: '#kontakt' },
]
const menuOpen = ref(false)
const scrolled = useScrolled()
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <TopBar />

    <div class="main-row">
      <a href="#" class="logo-badge">NB</a>

      <div class="nav-group">
        <nav class="nav" :class="{ open: menuOpen }">
          <a v-for="(link, i) in links" :key="link.label" :href="link.href" :class="{ active: i === 0 }">{{ link.label }}</a>
        </nav>

        <div class="tools">
          <a href="#" class="lang">PL <span class="chevron">⌄</span></a>
        </div>
      </div>

      <BurgerButton :open="menuOpen" @toggle="menuOpen = !menuOpen" />
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
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
  gap: 3.5rem;
  padding: 1.25rem 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
}

.logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  color: #fff;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.nav-group {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: #d7dce1;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid transparent;
}

.nav a:hover {
  color: #fff;
}

.nav a.active {
  color: #fff;
  border-color: var(--amber);
}

.tools {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lang {
  color: #d7dce1;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
}

.chevron {
  display: inline-block;
  margin-left: 0.1rem;
}

@media (max-width: 800px) {
  .main-row {
    display: flex;
    justify-content: space-between;
    padding: 1.25rem;
    border-bottom: none;
  }

  .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--ink);
  }

  .nav.open {
    display: flex;
  }

  .nav a {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .tools {
    display: none;
  }
}
</style>
