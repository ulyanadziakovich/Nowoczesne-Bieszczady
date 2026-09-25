<script setup lang="ts">
definePageMeta({ solidHeader: true })
useHead({ title: 'Inicjatywy społeczne i edukacja — Nowoczesne Bieszczady' })

const heroStats = ['Warsztaty podcastowe', 'Cykliczne debaty', 'Otwarte dla mieszkańców']

const content = usePageContent()
</script>

<template>
  <div>
    <PageHero
      variant="light"
      kicker="Edukacja i społeczność"
      title="Inicjatywy społeczne i edukacja"
      :description="content.body('inicjatywy-hero-description')"
      :stats="heroStats"
    />

    <section class="section">
      <div class="container two-col">
        <div>
          <span class="kicker">Projekt warsztatowy</span>
          <h2 class="section-title">{{ content.title('inicjatywy-eterze') }}</h2>
          <p v-for="(paragraph, i) in content.paragraphs('inicjatywy-eterze')" :key="i" class="lead paragraph">{{ paragraph }}</p>
        </div>
        <img :src="resolveCmsUrl(content.image('inicjatywy-eterze'))" alt="Bieszczady w eterze" class="side-image" />
      </div>
    </section>

    <section class="section section-alt">
      <div class="container two-col reverse">
        <img :src="resolveCmsUrl(content.image('inicjatywy-burza'))" alt="Bieszczadzka Burza Mózgów" class="side-image" />
        <div>
          <span class="kicker">Debaty społeczne</span>
          <h2 class="section-title">{{ content.title('inicjatywy-burza') }}</h2>
          <p v-for="(paragraph, i) in content.paragraphs('inicjatywy-burza')" :key="i" class="lead paragraph">{{ paragraph }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="note-card">
          <div class="note-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
              <path d="M7 8h9M7 12h9M7 16h5" />
            </svg>
          </div>
          <div class="note-text">
            <span class="kicker">Bądź na bieżąco</span>
            <h3>Relacje ze spotkań i warsztatów</h3>
            <p>
              Zdjęcia, podsumowania i najświeższe wieści z „Bieszczad w eterze”, „Bieszczadzkiej Burzy Mózgów” i innych
              naszych inicjatyw publikujemy na bieżąco w Aktualnościach.
            </p>
          </div>
          <NuxtLink to="/aktualnosci" class="btn btn-amber">Zobacz aktualności</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.two-col {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.two-col.reverse {
  grid-template-columns: 1fr 1.2fr;
}

.two-col.reverse > *:first-child {
  order: 1;
}

.two-col.reverse > *:last-child {
  order: 2;
}

.side-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 20px 44px rgba(26, 36, 32, 0.14);
}

.paragraph {
  margin: 0 0 1rem;
}

h3 {
  margin: 2rem 0 1rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
}

@media (max-width: 900px) {
  .two-col,
  .two-col.reverse {
    grid-template-columns: 1fr;
  }

  .two-col.reverse > *:first-child {
    order: 2;
  }

  .two-col.reverse > *:last-child {
    order: 1;
  }

  .side-image {
    height: 220px;
  }

  .note-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
}

.note-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--stone);
  border-left: 3px solid var(--amber);
  border-radius: 4px;
  padding: 2rem;
  flex-wrap: wrap;
}

.note-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fff;
  color: var(--amber);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.note-text {
  flex: 1;
  min-width: 220px;
}

.note-card .kicker {
  display: block;
  font-size: 0.75rem;
}

.note-card h3 {
  margin: 0.5rem 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.note-card p {
  margin: 0;
  color: #5a6a62;
}
</style>
