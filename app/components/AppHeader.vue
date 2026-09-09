<script setup lang="ts">
const links = ['O nas', 'Edukacja', 'Wydarzenia', 'Turystyka', 'Aktualności', 'Kontakt']
const menuOpen = ref(false)
</script>

<template>
  <header class="header">
    <TopBar />

    <div class="main-row">
      <div class="logo">
        <span class="logo-badge">NB</span>
        <span>NOWOCZESNE<br />BIESZCZADY</span>
      </div>

      <div class="nav-group">
        <nav class="nav" :class="{ open: menuOpen }">
          <a v-for="(link, i) in links" :key="link" href="#" :class="{ active: i === 0 }">{{ link }}</a>
        </nav>

        <div class="tools">
          <button class="icon-btn" aria-label="Szukaj">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <a href="#" class="lang">PL <span class="chevron">⌄</span></a>
        </div>
      </div>

      <button class="burger" :class="{ open: menuOpen }" aria-label="Menu" @click="menuOpen = !menuOpen">
        <span /><span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  color: #fff;
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

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  font-size: 0.7rem;
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
  border-color: #e8672c;
}

.tools {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  padding: 0;
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
  justify-self: end;
}

.burger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #fff;
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
    background: #12181f;
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

  .burger {
    display: flex;
  }
}
</style>
