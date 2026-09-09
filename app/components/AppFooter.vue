<script setup lang="ts">
const links = ['O nas', 'Edukacja', 'Wydarzenia', 'Turystyka', 'Aktualności', 'Kontakt']
const facebookUrl = 'https://www.facebook.com/nowoczesne.bieszczady/?locale=pl_PL'
</script>

<template>
  <footer id="kontakt" class="footer">
    <div class="top">
      <div class="brand">
        <span class="logo-badge">NB</span>
        <div>
          <p class="name">NOWOCZESNE BIESZCZADY</p>
          <p class="tagline">Stowarzyszenie działające na rzecz rozwoju regionu</p>
        </div>
      </div>

      <nav class="links">
        <a v-for="link in links" :key="link" href="#">{{ link }}</a>
      </nav>

      <div class="contact">
        <p class="location">Ustrzyki Dolne, Podkarpackie</p>
        <a href="mailto:biuro@nowoczesnebieszczady.pl" class="contact-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
          </svg>
          biuro@nowoczesnebieszczady.pl
        </a>
        <a href="tel:+48507068728" class="contact-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
          </svg>
          507 068 728
        </a>
      </div>
    </div>

    <div class="bottom">
      <p>© {{ new Date().getFullYear() }} Nowoczesne Bieszczady. Wszystkie prawa zastrzeżone.</p>
      <a :href="facebookUrl" target="_blank" rel="noopener" class="social" aria-label="Facebook">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M14 8h-2c-.5 0-1 .5-1 1v2h3l-.5 3H11v7H8v-7H6v-3h2V9c0-2 1.5-4 4-4h2z" />
        </svg>
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  scroll-margin-top: 110px;
  background: var(--ink);
  color: #d7dce1;
  padding: 3.5rem 3rem 1.5rem;
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  max-width: 280px;
}

.logo-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  font-size: 0.7rem;
  font-weight: 800;
  color: #fff;
}

.name {
  margin: 0 0 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.03em;
}

.tagline {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.4;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.links a {
  color: #d7dce1;
  text-decoration: none;
  font-size: 0.85rem;
}

.links a:hover {
  color: #fff;
}

.contact p {
  margin: 0 0 0.6rem;
  font-size: 0.85rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #d7dce1;
  text-decoration: none;
}

.contact-item:hover {
  color: #fff;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  font-size: 0.75rem;
}

.social {
  color: #d7dce1;
  display: flex;
}

.social:hover {
  color: var(--amber);
}

@media (max-width: 800px) {
  .footer {
    padding: 2.5rem 1.5rem 1.5rem;
  }

  .top {
    flex-direction: column;
    gap: 2rem;
  }

  .bottom {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
