<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    paragraph1?: string
    paragraph2?: string
    tagline?: string
    image?: string
  }>(),
  {
    kicker: 'Stowarzyszenie',
    title: 'Krótko o nas',
    paragraph1:
      'Stowarzyszenie Nowoczesne Bieszczady powstało w 2016 roku w Ustrzykach Dolnych. Prowadzimy działalność doradczą, edukacyjną i kulturalną — wspieramy ekonomię społeczną, edukację demokracji lokalnej, aktywność kulturalną oraz rozwój Ustrzyk Dolnych i Powiatu Bieszczadzkiego.',
    paragraph2:
      'Nasi członkowie to przedsiębiorcy, nauczyciele, pracownicy samorządowi i specjaliści różnych branż. Stawiamy na profesjonalizm i zaangażowanie.',
    tagline: '„SKUTECZNI DLA WAS”',
    image: '/images/bieszczady.avif',
  },
)

// Tekst z CMS jest dowolnej długości — dzielimy go na czytelne bloki zamiast
// jednej ściany tekstu. Treść się nie zmienia, rozpoznajemy tylko strukturę:
//  • linia zakończona „?” → śródtytuł,
//  • linia zaczynająca się od emoji → karta „filaru” (tytuł + opis),
//  • linia z wcięciem → punkt listy pod poprzednią kartą,
//  • krótki blok zaraz po kartach → wyróżnione podsumowanie,
//  • reszta → zwykłe akapity.
type Block =
  | { type: 'question'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'pillars'; items: { icon: string; title: string; text: string; points: string[] }[] }
  | { type: 'closing'; lines: string[] }

const EMOJI = /^(\p{Extended_Pictographic}️?|\p{Regional_Indicator}{2})\s*/u

function splitTitle(rest: string) {
  // „Rozwój Turystyki i InfrastrukturyInicjujemy…” → tytuł / opis (sklejone w CMS bez spacji)
  const m = rest.match(/^(.{3,90}?[a-ząćęłńóśźż])([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż][\s\S]*)$/)
  return m ? { title: m[1].trim(), text: m[2].trim() } : { title: '', text: rest.trim() }
}

const blocks = computed<Block[]>(() => {
  const text = [props.paragraph1, props.paragraph2].filter(Boolean).join('\n\n')
  const groups = text.split(/\n\s*\n/)
  const out: Block[] = []
  groups.forEach((group) => {
    const lines = group.split('\n').filter((l) => l.trim())
    // Krótki blok tuż po kartach „filarów” (albo ostatni blok) = podsumowanie.
    const afterPillars = out[out.length - 1]?.type === 'pillars'
    if (afterPillars && lines.length <= 3 && !lines.some((l) => EMOJI.test(l.trim())) && lines.join(' ').length < 400) {
      out.push({ type: 'closing', lines: lines.map((l) => l.trim()) })
      return
    }
    for (const raw of lines) {
      const line = raw.trim()
      const prev = out[out.length - 1]
      const emoji = line.match(EMOJI)
      if (emoji) {
        const item = { icon: emoji[1], ...splitTitle(line.slice(emoji[0].length)), points: [] as string[] }
        if (prev?.type === 'pillars') prev.items.push(item)
        else out.push({ type: 'pillars', items: [item] })
      } else if (/^\s/.test(raw) && prev?.type === 'pillars') {
        prev.items[prev.items.length - 1].points.push(line)
      } else if (line.endsWith('?') && line.length <= 90) {
        out.push({ type: 'question', text: line })
      } else {
        out.push({ type: 'paragraph', text: line.replace(/\s{2,}/g, ' ') })
      }
    }
  })
  return out
})

// Układ: wstęp (wszystko przed kartami) obok zdjęcia, karty w pełnej szerokości,
// a to, co po kartach, w ciemnym pasie podsumowania.
const firstPillars = computed(() => blocks.value.findIndex((b) => b.type === 'pillars'))
const introBlocks = computed(() => (firstPillars.value < 0 ? blocks.value : blocks.value.slice(0, firstPillars.value)))
const pillarItems = computed(() => blocks.value.flatMap((b) => (b.type === 'pillars' ? b.items : [])))
const outroBlocks = computed(() => (firstPillars.value < 0 ? [] : blocks.value.slice(firstPillars.value).filter((b) => b.type !== 'pillars')))
</script>

<template>
  <section class="about">
    <div class="about-inner">
      <header class="about-head">
        <div class="head-title">
          <span class="kicker">{{ kicker }}</span>
          <h2>{{ title }}</h2>
        </div>
        <div class="head-intro">
          <template v-for="(block, i) in introBlocks" :key="i">
            <p v-if="block.type === 'question'" class="question">{{ block.text }}</p>
            <p v-else-if="block.type === 'paragraph'" class="paragraph">{{ block.text }}</p>
            <p v-else-if="block.type === 'closing'" class="paragraph">{{ block.lines.join(' ') }}</p>
          </template>
        </div>
      </header>

      <div class="about-photo" :style="{ backgroundImage: `url(${image})` }" role="img" aria-label="Bieszczady">
        <span v-if="tagline" class="photo-tagline">{{ tagline }}</span>
      </div>

      <div v-if="pillarItems.length" class="pillars">
        <article v-for="(item, j) in pillarItems" :key="j" class="pillar">
          <span class="pillar-num">{{ String(j + 1).padStart(2, '0') }}</span>
          <h3 v-if="item.title">{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <ul v-if="item.points.length">
            <li v-for="(point, k) in item.points" :key="k">{{ point }}</li>
          </ul>
        </article>
      </div>

      <div v-if="outroBlocks.length" class="outro">
        <template v-for="(block, i) in outroBlocks" :key="i">
          <template v-if="block.type === 'closing'">
            <p v-for="(line, k) in block.lines" :key="k" :class="k === 0 && block.lines.length > 1 ? 'outro-lead' : 'outro-statement'">{{ line }}</p>
          </template>
          <p v-else-if="block.type === 'question'" class="outro-lead">{{ block.text }}</p>
          <p v-else class="outro-text">{{ block.text }}</p>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Styl „redakcyjny”: dużo powietrza, cienkie linie zamiast pudełek,
   szeryfowe nagłówki jak w hero — bez kart, które powtarzałyby kafelki i aktualności. */
.about {
  --a-bg: #fff;
  /* Tylko kolory z palety: #151d1c, #566c71, #6c7173, #615b3a, #a9541f */
  --a-title: #151d1c;
  --a-head: #151d1c;
  --a-text: #6c7173;
  --a-accent: #a9541f;
  --a-lead: #566c71;
  --a-olive: #615b3a;
  --a-line: #d9d3c3;
  background: var(--a-bg);
}

.about .kicker {
  color: var(--a-accent);
}

.about-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 7rem 1.5rem 7.5rem;
  overflow-wrap: anywhere;
}

.about-head {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 4rem;
  align-items: start;
}

.head-title .kicker {
  display: block;
  margin-bottom: 0.9rem;
}

h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 4.6vw, 3.6rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--a-title);
}

.head-intro {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.4rem;
}

.question {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--a-olive);
}

.paragraph {
  margin: 0;
  color: var(--a-lead);
  font-size: 1.08rem;
  line-height: 1.8;
}

.about-photo {
  position: relative;
  aspect-ratio: 21 / 8;
  margin-top: 4rem;
  border-radius: 6px;
  background-size: cover;
  background-position: center 65%;
  overflow: hidden;
}

.about-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 22, 15, 0) 45%, rgba(10, 22, 15, 0.55) 100%);
}

.photo-tagline {
  position: absolute;
  left: 2.5rem;
  bottom: 2rem;
  z-index: 1;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.6vw, 2.1rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
}

/* Filary: cztery kolumny rozdzielone cienkimi liniami. */
.pillars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 4.5rem;
  border-top: 1px solid var(--a-line);
}

.pillar {
  padding: 2.2rem 1.75rem 0;
  border-left: 1px solid var(--a-line);
}

.pillar:first-child {
  padding-left: 0;
  border-left: none;
}

.pillar:last-child {
  padding-right: 0;
}

.pillar-num {
  display: block;
  margin-bottom: 1.1rem;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--a-accent);
}

.pillar h3 {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--a-head);
}

.pillar p {
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.75;
  color: var(--a-text);
}

.pillar ul {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--a-text);
}

.pillar li {
  position: relative;
  padding-left: 1.1rem;
}

.pillar li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.8em;
  width: 0.55rem;
  height: 1px;
  background: var(--a-accent);
}

.pillar li + li {
  margin-top: 0.55rem;
}

/* Podsumowanie: wyśrodkowane zdanie jak cytat. */
.outro {
  max-width: 820px;
  margin: 5.5rem auto 0;
  text-align: center;
}

.outro p {
  margin: 0;
}

.outro-lead {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--a-accent);
}

.outro-statement {
  margin-top: 1.1rem !important;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  font-weight: 600;
  line-height: 1.35;
  color: var(--a-lead);
}

.outro-text {
  margin-top: 1.4rem !important;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--a-text);
}

@media (max-width: 1000px) {
  .pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-top: none;
  }

  .pillar,
  .pillar:first-child,
  .pillar:last-child {
    padding: 2rem 1.75rem 2rem 0;
    border-left: none;
    border-top: 1px solid var(--a-line);
  }
}

@media (max-width: 760px) {
  .about-inner {
    padding: 4rem 1.25rem 4.5rem;
  }

  .about-head {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .question {
    font-size: 1.25rem;
  }

  .paragraph {
    font-size: 1rem;
  }

  .about-photo {
    aspect-ratio: 4 / 3;
    margin-top: 2.5rem;
  }

  .photo-tagline {
    left: 1.25rem;
    bottom: 1.1rem;
  }

  .pillars {
    grid-template-columns: 1fr;
    margin-top: 2.5rem;
  }

  .pillar,
  .pillar:first-child,
  .pillar:last-child {
    padding: 1.75rem 0;
  }

  .pillar-num {
    margin-bottom: 0.7rem;
  }

  .outro {
    margin-top: 2.5rem;
  }
}
</style>
