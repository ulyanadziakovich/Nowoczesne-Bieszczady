<script setup lang="ts">
useHead({ title: 'Ustrzyki 2036: Warsztat Przyszłości — Nowoczesne Bieszczady' })

// Same key/collection as DreamMapSky.vue — Nuxt dedupes this to one fetch,
// so the SSR fallback below can show the real CMS photo too, not a blank one.
const { data: heroSettings } = await useCmsSingle<{ heroImage?: CmsImage | null; aboutImage?: CmsImage | null }>(
  'dream-map-settings',
)
const fallbackBackgroundImage = computed(
  () =>
    `linear-gradient(180deg, rgba(4, 7, 14, 0.72) 0%, rgba(4, 7, 14, 0.15) 30%, rgba(4, 7, 14, 0.2) 58%, rgba(4, 7, 14, 0.8) 100%), ` +
    `linear-gradient(200deg, rgba(201, 103, 46, 0.22) 0%, transparent 42%), ` +
    `url('${resolveCmsUrl(heroSettings.value?.heroImage?.src)}')`,
)
const aboutImageUrl = computed(() => resolveCmsUrl(heroSettings.value?.aboutImage?.src))
</script>

<template>
  <div>
    <ClientOnly>
      <DreamMapSky />
      <template #fallback>
        <div class="sky-fallback" :style="{ backgroundImage: fallbackBackgroundImage }" />
      </template>
    </ClientOnly>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Ustrzyki 2036: Warsztat Przyszłości</span>
          <h2 class="section-title">Skąd wzięła się ta mapa</h2>
        </div>

        <div class="about">
          <div class="about-text">
            <p class="lead">
              Inicjatywa „Ustrzyki 2036: Warsztat Przyszłości” to autorski projekt realizowany przez Stowarzyszenie
              Nowoczesne Bieszczady we współpracy z lokalnymi partnerami: Centrum Koordynacji i Wspierania Aktywności
              Społeczno-Gospodarczej w Stefkowej oraz Powiatowym Urzędem Pracy w Ustrzykach Dolnych.
            </p>
            <p>
              Główną intencją projektu było odejście od tradycyjnych, często biernych formuł konsultacji społecznych
              na rzecz stworzenia przestrzeni realnego, żywego i twórczego współdecydowania. Chcieliśmy dać
              mieszkańcom narzędzie do kształtowania przestrzeni publicznej oraz budowania poczucia sprawstwa —
              udowadniając, że głos każdego z nas ma znaczenie.
            </p>
            <p>
              Prezentowana Cyfrowa Mapa Marzeń jest bezpośrednim owocem procesu konsultacji społecznych i pracy
              warsztatowej. Przy jednym stole usiedli przedstawiciele bardzo różnych środowisk — od seniorów
              dzielących się mądrością życiową, przez lokalnych liderów i członków organizacji pozarządowych, aż po
              młodzież z Młodzieżowej Rady Gminy.
            </p>
            <p>
              Niniejsza mapa nie jest katalogiem roszczeń ani formą krytyki dotychczasowych działań. Jest głosem
              troski, dojrzałej odpowiedzialności oraz autentycznej miłości do naszej małej ojczyzny. Traktujemy
              wypracowane postulaty jako partnerskie zaproszenie do dialogu.
            </p>
            <p class="funding-note">
              Inicjatywa jest współfinansowana ze środków otrzymanych od Narodowego Instytutu Wolności — Centrum
              Rozwoju Społeczeństwa Obywatelskiego w ramach Rządowego Programu Fundusz Inicjatyw Obywatelskich
              NOWEFIO na lata 2021–2030, za pośrednictwem Stowarzyszenia „Pro Carpathia”.
            </p>
          </div>

          <div v-if="aboutImageUrl" class="about-image-wrap">
            <img :src="aboutImageUrl" alt="Warsztat „Ustrzyki 2036” — mieszkańcy pracują nad mapą przyszłości miasta" class="about-image" />
          </div>
        </div>
      </div>
    </section>

    <DreamMapBoard />
  </div>
</template>

<style scoped>
.sky-fallback {
  height: 100vh;
  height: 100dvh;
  min-height: 480px;
  max-height: 900px;
  background-color: #060a14;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: normal, soft-light, normal;
}

.about {
  display: flex;
  align-items: center;
  gap: 3.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.about-text {
  flex: 1.15;
  min-width: 0;
}

.about-text p {
  color: #4a4a44;
  font-size: 1rem;
  line-height: 1.75;
  margin: 0 0 1.25rem;
}

.about-image-wrap {
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(26, 36, 32, 0.16);
}

.about-image {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 900px) {
  .about {
    flex-direction: column;
    gap: 2rem;
  }

  .about-image-wrap {
    order: -1;
    width: 100%;
  }
}

.funding-note {
  font-size: 0.85rem !important;
  color: #8a978f !important;
  padding-top: 1rem;
  border-top: 1px solid #e3ded1;
}

</style>
