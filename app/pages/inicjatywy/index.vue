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
}
</style>
