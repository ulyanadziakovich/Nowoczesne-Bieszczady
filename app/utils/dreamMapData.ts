// Content source: "Wnioski i rekomendacje do mapy marzeń Ustrzyki 2036" —
// warsztaty "Ustrzyki 2036: Warsztat Przyszłości" (Stowarzyszenie Nowoczesne
// Bieszczady, 2026). 18 postulatów mieszkańców, każdy z opisem wyzwania i
// proponowanym rozwiązaniem. Kategorie i pozycje na "niebie" są redakcyjnym
// dodatkiem (ODT ich nie definiuje) — do skorygowania w razie potrzeby.

export type DreamMapCategory = 'ekologia' | 'turystyka' | 'mlodziez' | 'seniorzy' | 'infrastruktura'

export interface DreamMapPoint {
  id: number
  category: DreamMapCategory
  title: string
  challenge: string
  solution: string
  /** Position on the night-sky map, in % of the sky area. */
  px: number
  py: number
}

export const CATEGORY_COLORS: Record<DreamMapCategory, string> = {
  ekologia: '#135e24',
  turystyka: '#1f6fa8',
  mlodziez: '#c9672e',
  seniorzy: '#0f6e56',
  infrastruktura: '#8a4a2e',
}

export const CATEGORY_NAMES: Record<DreamMapCategory, string> = {
  ekologia: 'Ekologia',
  turystyka: 'Turystyka',
  mlodziez: 'Młodzież',
  seniorzy: 'Seniorzy',
  infrastruktura: 'Infrastruktura',
}

export const CATEGORY_CONSTELLATIONS: Record<DreamMapCategory, string> = {
  ekologia: 'Gwiazdozbiór Życia',
  turystyka: 'Gwiazdozbiór Odkrywców',
  mlodziez: 'Gwiazdozbiór Energii',
  seniorzy: 'Gwiazdozbiór Mądrości',
  infrastruktura: 'Gwiazdozbiór Fundamentów',
}

/**
 * Explicit edges (star id pairs) tracing each constellation's actual shape —
 * not just "connect the points in order". Modeled on real constellations
 * whose star count matches each category:
 *  - infrastruktura (7): Wielki Wóz / Ursa Major — bowl (closed
 *    quadrilateral) + handle (open, bent arc), the classic dipper shape.
 *  - turystyka (4): Krzyż Południa / Crux — two crossing lines, not
 *    connected to each other at their ends.
 *  - mlodziez (4): Delfin / Delphinus — a small closed diamond/kite.
 *  - seniorzy (2): a single line — real asterisms often are just a pair
 *    (e.g. Ursa Major's own "pointer stars").
 *  - ekologia (1): a lone bright star, no line — see CATEGORY_TAIL.
 */
export const CATEGORY_LINES: Record<DreamMapCategory, [number, number][]> = {
  ekologia: [],
  turystyka: [
    [5, 7], // Gacrux -> Acrux: the long arm
    [2, 14], // Mimosa -> Delta Crucis: the short arm, crossing the long one
  ],
  mlodziez: [
    [9, 16],
    [16, 10],
    [10, 17],
    [17, 9],
  ],
  seniorzy: [[11, 18]],
  infrastruktura: [
    // bowl (Dubhe -> Merak -> Phecda -> Megrez -> Dubhe)
    [1, 4],
    [4, 6],
    [6, 8],
    [8, 1],
    // handle (Megrez -> Alioth -> Mizar -> Alkaid), open — doesn't close
    [8, 12],
    [12, 13],
    [13, 15],
  ],
}

/** A short decorative "tail" flourish extending from one star in each
 * constellation — not a postulate, purely for the hand-drawn look real
 * constellation figures have (Delphinus' own faint tail star is the direct
 * inspiration). */
export const CATEGORY_TAIL: Record<DreamMapCategory, { fromId: number; x: number; y: number }> = {
  ekologia: { fromId: 3, x: 64, y: 30 },
  turystyka: { fromId: 7, x: 75, y: 64 }, // continues past Acrux, like Crux's real pointer to the pole
  mlodziez: { fromId: 10, x: 48, y: 38 },
  seniorzy: { fromId: 18, x: 42, y: 64 },
  infrastruktura: { fromId: 15, x: 36, y: 2 }, // continues the handle's curve past Alkaid
}

export const DREAM_MAP_POINTS: DreamMapPoint[] = [
  {
    id: 1,
    category: 'infrastruktura',
    title: 'Kompleksowa modernizacja ciągu głównego i budowa obwodnicy',
    challenge:
      'Główna arteria komunikacyjna przez centrum miasta zmaga się ze złym stanem nawierzchni i zaniedbanymi chodnikami. Brak obwodnicy sprawia, że cały ruch tranzytowy i turystyczny ściska się w sercu miasta, obniżając bezpieczeństwo pieszych.',
    solution:
      'Kompleksowa przebudowa i estetyzacja głównego ciągu drogowego wraz z wymianą chodników i nową zielenią miejską, dopełniona budową obwodnicy wyprowadzającej ruch tranzytowy poza centrum.',
    px: 10,
    py: 44,
  },
  {
    id: 2,
    category: 'turystyka',
    title: 'Sieć Łagodnych Ścieżek Spacerowych i Zielonych Korytarzy',
    challenge:
      'Brak łatwo dostępnych, wytyczonych tras spacerowych o łagodnym nachyleniu w lasach i terenach zielonych wokół miasta — seniorzy, rodziny z dziećmi i osoby uprawiające nordic walking potrzebują alternatywy dla stromych szczytów górskich.',
    solution:
      'Utworzenie, we współpracy z Nadleśnictwem Ustrzyki Dolne i sąsiednimi sołectwami, sieci łagodnych, utwardzonych ścieżek z ławkami, zadaszeniami i tablicami edukacyjnymi, dostosowanych do osób w każdym wieku.',
    px: 58,
    py: 38,
  },
  {
    id: 3,
    category: 'ekologia',
    title: 'Bulwary nad Strwiążem — Czysta Rzeka, Plaża Miejska i Przestrzeń do Wypoczynku',
    challenge:
      'Rzeka Strwiąż, naturalny błękitny krwiobieg Ustrzyk Dolnych, przez lata ulegała zaniedbaniu i zanieczyszczeniu. Przestrzeń wokół niej w centrum miasta jest dziś nieatrakcyjna i zarośnięta.',
    solution:
      'Oczyszczenie koryta rzeki i reprezentacyjne zagospodarowanie jej brzegów w centrum — estetyczne bulwary spacerowe, strefy rekreacji i piaszczysto-trawiasta plaża miejska, m.in. przy Parku Pod Dębami.',
    px: 58,
    py: 36,
  },
  {
    id: 4,
    category: 'infrastruktura',
    title: 'Mobilność Bez Barier i Bezkolizyjne Cyklostrady',
    challenge:
      'Niewystarczająca siatka połączeń autobusowych i kolejowych utrudnia codzienne dojazdy do pracy, szkół czy lekarza. Brak bezpiecznych ścieżek rowerowych uniemożliwia mieszkańcom podmiejskich wsi wygodny dojazd do centrum.',
    solution:
      'Zintegrowany system transportu zbiorowego poprzez reaktywację i częstsze kursy połączeń kolejowych i autobusowych, dopełniony siecią bezpiecznych cyklostrad łączących okoliczne miejscowości z centrum.',
    px: 8,
    py: 30,
  },
  {
    id: 5,
    category: 'turystyka',
    title: 'Profesjonalne Trasy Rowerowe Nowej Generacji',
    challenge:
      'Mimo dynamicznego rozwoju turystyki rowerowej w Bieszczadach, Ustrzyki Dolne nie mają profesjonalnych, utwardzonych tras. Rowerzyści jeżdżą po zarośniętych bezdrożach lub niebezpiecznych drogach publicznych, bez infrastruktury dla e-bike.',
    solution:
      'Sieć nowoczesnych, oznakowanych tras rowerowych łączących miasto z atrakcjami regionu (Żukowa, Holica, Ustjanowa), z Miejscami Obsługi Rowerzystów, stacjami ładowania e-bike i czytelną nawigacją turystyczną.',
    px: 73,
    py: 26,
  },
  {
    id: 6,
    category: 'infrastruktura',
    title: 'Basen dla Każdego — modernizacja i nowe atrakcje',
    challenge:
      'Baza basenowa wymaga unowocześnienia: wysokie ceny biletów, brak ulg lokalnych, niedostateczna temperatura wody i uboga strefa relaksu (mała saunarnia, brak jacuzzi).',
    solution:
      'Rozbudowa strefy regeneracji (jacuzzi, saunarnia, fitness), poprawa parametrów technicznych i preferencyjne karnety dla mieszkańców — nowoczesne, przystępne cenowo centrum rekreacji i zdrowia.',
    px: 20,
    py: 24,
  },
  {
    id: 7,
    category: 'turystyka',
    title: 'Centrum Narciarstwa Biegowego i Nartorolek — całoroczne trasy',
    challenge:
      'Mimo wieloletnich tradycji narciarskich brakuje dobrze przygotowanej infrastruktury biegowej, systemu sztucznego naśnieżania i utwardzonego podłoża — ogranicza to całoroczny trening młodzieży i osłabia zimową ofertę turystyczną.',
    solution:
      'Profesjonalne, całoroczne trasy do narciarstwa biegowego i nartorolek (nawierzchnia asfaltowa) z systemem sztucznego naśnieżania, oświetleniem do treningu po zmroku i bieżącym utrzymaniem.',
    px: 73,
    py: 50,
  },
  {
    id: 8,
    category: 'infrastruktura',
    title: 'Dostępny Stadion — energooszczędne oświetlenie i całodobowa aktywność',
    challenge:
      'Stadion miejski ma niewykorzystany potencjał rekreacyjny — brak oświetlenia bieżni uniemożliwia mieszkańcom, seniorom i młodzieży bezpieczne korzystanie z obiektu po zmroku, zwłaszcza jesienią i zimą.',
    solution:
      'Szybka, ekologiczna modernizacja poprzez montaż autonomicznego, solarnego oświetlenia LED — stadion dostępny i bezpieczny przez cały rok, także wieczorami.',
    px: 22,
    py: 38,
  },
  {
    id: 9,
    category: 'mlodziez',
    title: 'Park Pod Dębami 2.0 — Nowoczesna Strefa Kultury, Sportu i Chilloutu',
    challenge:
      'Park Pod Dębami ma ogromny potencjał, ale jego infrastruktura zestarzała się: przetarte ścieżki, zniszczona scena, betonowe ławki, brak zadaszenia i oferty sportowej dla młodzieży.',
    solution:
      'Nowoczesny amfiteatr z zadaszeniem, wymiana mebli miejskich na drewnianą małą architekturę, strefa chilloutu nad rzeką i profesjonalny, bezpieczny tor downhillowy dla młodzieży.',
    px: 48,
    py: 10,
  },
  {
    id: 10,
    category: 'mlodziez',
    title: 'Pokoleniowa Strefa Zabawy — Nowoczesny i Bezpieczny Plac Zabaw',
    challenge:
      'Brak nowoczesnego, bezpiecznego placu zabaw — obecne urządzenia są przestarzałe, a okoliczne gminy wiejskie mają znacznie nowocześniejszą infrastrukturę rekreacyjną niż miasto.',
    solution:
      'Flagowy, certyfikowany plac zabaw (przy Urzędzie Gminy lub w rewitalizowanym Parku Pod Dębami) z bezpieczną nawierzchnią, interaktywnymi urządzeniami dla różnych grup wiekowych, w tym dla dzieci z niepełnosprawnościami.',
    px: 48,
    py: 26,
  },
  {
    id: 11,
    category: 'seniorzy',
    title: 'Urządzenie traktu na cmentarz w Brzegach',
    challenge:
      'Brak bezpiecznego, oświetlonego chodnika — piesi, w tym często seniorzy, poruszają się skrajem ruchliwej jezdni. Dodatkowo w rejonie oczyszczalni ścieków stale unosi się uciążliwy zapach.',
    solution:
      'Budowa bezpiecznego, oświetlonego chodnika prowadzącego pod cmentarz, równolegle z modernizacją miejskiej oczyszczalni ścieków, co wyeliminuje uciążliwości zapachowe.',
    px: 18,
    py: 48,
  },
  {
    id: 12,
    category: 'infrastruktura',
    title: 'Rozwój kierunku Ustjanowa i podstawowa infrastruktura',
    challenge:
      'Brak bezpiecznego chodnika łączącego Ustrzyki Dolne z Ustjanową zagraża pieszym. Brak sieci kanalizacyjnej w tym kierunku blokuje potencjał inwestycyjny i wpływa negatywnie na środowisko.',
    solution:
      'Budowa oświetlonego ciągu pieszo-rowerowego oraz dokończenie rozbudowy magistrali kanalizacyjnej w kierunku Ustjanowej — bezpieczeństwo i otwarcie obszaru na nowy rozwój.',
    px: 30,
    py: 30,
  },
  {
    id: 13,
    category: 'infrastruktura',
    title: 'Czyszczone Ustrzyki — Estetyka i porządek w przestrzeni publicznej',
    challenge:
      'Zardzewiałe barierki, zarastające chodniki i zniszczona mała architektura obniżają estetykę miasta i sprawiają wrażenie zaniedbania.',
    solution:
      'Program szybkich interwencji estetycznych: odmalowanie barierek, regularne czyszczenie chodników, odnowienie małej architektury i "Miejskie Pogotowie Estetyczne" reagujące na zgłoszenia mieszkańców.',
    px: 33,
    py: 20,
  },
  {
    id: 14,
    category: 'turystyka',
    title: 'Latarnia Bieszczadów — Komin kombinatu jako nowoczesny witacz',
    challenge:
      'Potężny komin byłego kombinatu przy wjeździe do miasta jest bezużyteczną, szarą pozostałością zamiast budować pozytywne pierwsze wrażenie u przyjezdnych.',
    solution:
      'Przekształcenie komina w estetyczny "witacz" miejski — artystyczny mural lub energooszczędna iluminacja LED widoczna z daleka po zmroku, nowy symbol wjazdowy do Ustrzyk.',
    px: 88,
    py: 40,
  },
  {
    id: 15,
    category: 'infrastruktura',
    title: 'Drugie życie — inwestycje w opuszczone obiekty',
    challenge:
      'Obiekty o bogatej historii, jak dawny Hotel Laworta czy budynek Mleczarni, od lat niszczeją — to strata wizualna i zmarnowany potencjał gospodarczy oraz turystyczny.',
    solution:
      'Miejski pakiet inwestycyjny i aktywne pozyskiwanie partnerów prywatnych (PPP lub inwestorzy indywidualni) do nadania budynkom nowych funkcji — centra, hotele, coworking.',
    px: 30,
    py: 8,
  },
  {
    id: 16,
    category: 'mlodziez',
    title: 'Miejskie Centrum Spotkań, Bowlingu i Integracji',
    challenge:
      'Brak nowoczesnego, całorocznego miejsca spotkań dla młodzieży i dorosłych — kręgielni, strefy gier czy przestrzeni na wydarzenia integracyjne, zwłaszcza jesienią i zimą.',
    solution:
      'Wielofunkcyjne centrum kulturalno-rozrywkowe łączące tor bowlingowy, strefę gier towarzyskich i salę klubowo-warsztatową na potańcówki, występy i spotkania integracyjne.',
    px: 58,
    py: 18,
  },
  {
    id: 17,
    category: 'mlodziez',
    title: 'VR Chill Café — Młodzieżowa Kawiarnia Technologiczno-Językowa',
    challenge:
      'Brak bezpiecznego, nowoczesnego miejsca dla młodzieży szkolnej, by odpocząć po lekcjach, wspólnie się uczyć lub skorzystać z cyfrowej rozrywki bez dużych kosztów.',
    solution:
      'Kawiarnia technologiczno-językowa łącząca strefę relaksu ze stanowiskami VR i konsolami, przestrzeń wspólnej nauki oraz bezpłatne kluby konwersacyjne z języków obcych.',
    px: 38,
    py: 18,
  },
  {
    id: 18,
    category: 'seniorzy',
    title: 'Centrum Wolontariatu Międzypokoleniowego',
    challenge:
      'Brak wspólnej przestrzeni łączącej energię młodzieży z doświadczeniem seniorów — osoby starsze borykają się z samotnością, młodzież szuka pierwszych doświadczeń społecznych.',
    solution:
      'Centrum Wolontariatu oparte na modelu lokalnego "Banku Czasu" — seniorzy dzielą się wiedzą i rzemiosłem, młodzież wspiera w cyfryzacji i codziennych sprawach, budując międzypokoleniowe więzi.',
    px: 34,
    py: 58,
  },
]
