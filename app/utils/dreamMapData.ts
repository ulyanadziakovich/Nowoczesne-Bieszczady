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

/** Draws a constellation line through these point ids, in order. */
export const CATEGORY_LINES: Record<DreamMapCategory, number[]> = {
  ekologia: [3],
  turystyka: [2, 5, 7, 14],
  mlodziez: [9, 10, 16, 17],
  seniorzy: [11, 18],
  infrastruktura: [1, 4, 6, 8, 12, 13, 15],
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
    px: 15,
    py: 22,
  },
  {
    id: 2,
    category: 'turystyka',
    title: 'Sieć Łagodnych Ścieżek Spacerowych i Zielonych Korytarzy',
    challenge:
      'Brak łatwo dostępnych, wytyczonych tras spacerowych o łagodnym nachyleniu w lasach i terenach zielonych wokół miasta — seniorzy, rodziny z dziećmi i osoby uprawiające nordic walking potrzebują alternatywy dla stromych szczytów górskich.',
    solution:
      'Utworzenie, we współpracy z Nadleśnictwem Ustrzyki Dolne i sąsiednimi sołectwami, sieci łagodnych, utwardzonych ścieżek z ławkami, zadaszeniami i tablicami edukacyjnymi, dostosowanych do osób w każdym wieku.',
    px: 28,
    py: 14,
  },
  {
    id: 3,
    category: 'ekologia',
    title: 'Bulwary nad Strwiążem — Czysta Rzeka, Plaża Miejska i Przestrzeń do Wypoczynku',
    challenge:
      'Rzeka Strwiąż, naturalny błękitny krwiobieg Ustrzyk Dolnych, przez lata ulegała zaniedbaniu i zanieczyszczeniu. Przestrzeń wokół niej w centrum miasta jest dziś nieatrakcyjna i zarośnięta.',
    solution:
      'Oczyszczenie koryta rzeki i reprezentacyjne zagospodarowanie jej brzegów w centrum — estetyczne bulwary spacerowe, strefy rekreacji i piaszczysto-trawiasta plaża miejska, m.in. przy Parku Pod Dębami.',
    px: 62,
    py: 18,
  },
  {
    id: 4,
    category: 'infrastruktura',
    title: 'Mobilność Bez Barier i Bezkolizyjne Cyklostrady',
    challenge:
      'Niewystarczająca siatka połączeń autobusowych i kolejowych utrudnia codzienne dojazdy do pracy, szkół czy lekarza. Brak bezpiecznych ścieżek rowerowych uniemożliwia mieszkańcom podmiejskich wsi wygodny dojazd do centrum.',
    solution:
      'Zintegrowany system transportu zbiorowego poprzez reaktywację i częstsze kursy połączeń kolejowych i autobusowych, dopełniony siecią bezpiecznych cyklostrad łączących okoliczne miejscowości z centrum.',
    px: 80,
    py: 28,
  },
  {
    id: 5,
    category: 'turystyka',
    title: 'Profesjonalne Trasy Rowerowe Nowej Generacji',
    challenge:
      'Mimo dynamicznego rozwoju turystyki rowerowej w Bieszczadach, Ustrzyki Dolne nie mają profesjonalnych, utwardzonych tras. Rowerzyści jeżdżą po zarośniętych bezdrożach lub niebezpiecznych drogach publicznych, bez infrastruktury dla e-bike.',
    solution:
      'Sieć nowoczesnych, oznakowanych tras rowerowych łączących miasto z atrakcjami regionu (Żukowa, Holica, Ustjanowa), z Miejscami Obsługi Rowerzystów, stacjami ładowania e-bike i czytelną nawigacją turystyczną.',
    px: 72,
    py: 8,
  },
  {
    id: 6,
    category: 'infrastruktura',
    title: 'Basen dla Każdego — modernizacja i nowe atrakcje',
    challenge:
      'Baza basenowa wymaga unowocześnienia: wysokie ceny biletów, brak ulg lokalnych, niedostateczna temperatura wody i uboga strefa relaksu (mała saunarnia, brak jacuzzi).',
    solution:
      'Rozbudowa strefy regeneracji (jacuzzi, saunarnia, fitness), poprawa parametrów technicznych i preferencyjne karnety dla mieszkańców — nowoczesne, przystępne cenowo centrum rekreacji i zdrowia.',
    px: 19,
    py: 48,
  },
  {
    id: 7,
    category: 'turystyka',
    title: 'Centrum Narciarstwa Biegowego i Nartorolek — całoroczne trasy',
    challenge:
      'Mimo wieloletnich tradycji narciarskich brakuje dobrze przygotowanej infrastruktury biegowej, systemu sztucznego naśnieżania i utwardzonego podłoża — ogranicza to całoroczny trening młodzieży i osłabia zimową ofertę turystyczną.',
    solution:
      'Profesjonalne, całoroczne trasy do narciarstwa biegowego i nartorolek (nawierzchnia asfaltowa) z systemem sztucznego naśnieżania, oświetleniem do treningu po zmroku i bieżącym utrzymaniem.',
    px: 34,
    py: 40,
  },
  {
    id: 8,
    category: 'infrastruktura',
    title: 'Dostępny Stadion — energooszczędne oświetlenie i całodobowa aktywność',
    challenge:
      'Stadion miejski ma niewykorzystany potencjał rekreacyjny — brak oświetlenia bieżni uniemożliwia mieszkańcom, seniorom i młodzieży bezpieczne korzystanie z obiektu po zmroku, zwłaszcza jesienią i zimą.',
    solution:
      'Szybka, ekologiczna modernizacja poprzez montaż autonomicznego, solarnego oświetlenia LED — stadion dostępny i bezpieczny przez cały rok, także wieczorami.',
    px: 27,
    py: 56,
  },
  {
    id: 9,
    category: 'mlodziez',
    title: 'Park Pod Dębami 2.0 — Nowoczesna Strefa Kultury, Sportu i Chilloutu',
    challenge:
      'Park Pod Dębami ma ogromny potencjał, ale jego infrastruktura zestarzała się: przetarte ścieżki, zniszczona scena, betonowe ławki, brak zadaszenia i oferty sportowej dla młodzieży.',
    solution:
      'Nowoczesny amfiteatr z zadaszeniem, wymiana mebli miejskich na drewnianą małą architekturę, strefa chilloutu nad rzeką i profesjonalny, bezpieczny tor downhillowy dla młodzieży.',
    px: 64,
    py: 46,
  },
  {
    id: 10,
    category: 'mlodziez',
    title: 'Pokoleniowa Strefa Zabawy — Nowoczesny i Bezpieczny Plac Zabaw',
    challenge:
      'Brak nowoczesnego, bezpiecznego placu zabaw — obecne urządzenia są przestarzałe, a okoliczne gminy wiejskie mają znacznie nowocześniejszą infrastrukturę rekreacyjną niż miasto.',
    solution:
      'Flagowy, certyfikowany plac zabaw (przy Urzędzie Gminy lub w rewitalizowanym Parku Pod Dębami) z bezpieczną nawierzchnią, interaktywnymi urządzeniami dla różnych grup wiekowych, w tym dla dzieci z niepełnosprawnościami.',
    px: 76,
    py: 53,
  },
  {
    id: 11,
    category: 'seniorzy',
    title: 'Urządzenie traktu na cmentarz w Brzegach',
    challenge:
      'Brak bezpiecznego, oświetlonego chodnika — piesi, w tym często seniorzy, poruszają się skrajem ruchliwej jezdni. Dodatkowo w rejonie oczyszczalni ścieków stale unosi się uciążliwy zapach.',
    solution:
      'Budowa bezpiecznego, oświetlonego chodnika prowadzącego pod cmentarz, równolegle z modernizacją miejskiej oczyszczalni ścieków, co wyeliminuje uciążliwości zapachowe.',
    px: 46,
    py: 38,
  },
  {
    id: 12,
    category: 'infrastruktura',
    title: 'Rozwój kierunku Ustjanowa i podstawowa infrastruktura',
    challenge:
      'Brak bezpiecznego chodnika łączącego Ustrzyki Dolne z Ustjanową zagraża pieszym. Brak sieci kanalizacyjnej w tym kierunku blokuje potencjał inwestycyjny i wpływa negatywnie na środowisko.',
    solution:
      'Budowa oświetlonego ciągu pieszo-rowerowego oraz dokończenie rozbudowy magistrali kanalizacyjnej w kierunku Ustjanowej — bezpieczeństwo i otwarcie obszaru na nowy rozwój.',
    px: 56,
    py: 44,
  },
  {
    id: 13,
    category: 'infrastruktura',
    title: 'Czyszczone Ustrzyki — Estetyka i porządek w przestrzeni publicznej',
    challenge:
      'Zardzewiałe barierki, zarastające chodniki i zniszczona mała architektura obniżają estetykę miasta i sprawiają wrażenie zaniedbania.',
    solution:
      'Program szybkich interwencji estetycznych: odmalowanie barierek, regularne czyszczenie chodników, odnowienie małej architektury i "Miejskie Pogotowie Estetyczne" reagujące na zgłoszenia mieszkańców.',
    px: 40,
    py: 60,
  },
  {
    id: 14,
    category: 'turystyka',
    title: 'Latarnia Bieszczadów — Komin kombinatu jako nowoczesny witacz',
    challenge:
      'Potężny komin byłego kombinatu przy wjeździe do miasta jest bezużyteczną, szarą pozostałością zamiast budować pozytywne pierwsze wrażenie u przyjezdnych.',
    solution:
      'Przekształcenie komina w estetyczny "witacz" miejski — artystyczny mural lub energooszczędna iluminacja LED widoczna z daleka po zmroku, nowy symbol wjazdowy do Ustrzyk.',
    px: 85,
    py: 15,
  },
  {
    id: 15,
    category: 'infrastruktura',
    title: 'Drugie życie — inwestycje w opuszczone obiekty',
    challenge:
      'Obiekty o bogatej historii, jak dawny Hotel Laworta czy budynek Mleczarni, od lat niszczeją — to strata wizualna i zmarnowany potencjał gospodarczy oraz turystyczny.',
    solution:
      'Miejski pakiet inwestycyjny i aktywne pozyskiwanie partnerów prywatnych (PPP lub inwestorzy indywidualni) do nadania budynkom nowych funkcji — centra, hotele, coworking.',
    px: 10,
    py: 40,
  },
  {
    id: 16,
    category: 'mlodziez',
    title: 'Miejskie Centrum Spotkań, Bowlingu i Integracji',
    challenge:
      'Brak nowoczesnego, całorocznego miejsca spotkań dla młodzieży i dorosłych — kręgielni, strefy gier czy przestrzeni na wydarzenia integracyjne, zwłaszcza jesienią i zimą.',
    solution:
      'Wielofunkcyjne centrum kulturalno-rozrywkowe łączące tor bowlingowy, strefę gier towarzyskich i salę klubowo-warsztatową na potańcówki, występy i spotkania integracyjne.',
    px: 18,
    py: 64,
  },
  {
    id: 17,
    category: 'mlodziez',
    title: 'VR Chill Café — Młodzieżowa Kawiarnia Technologiczno-Językowa',
    challenge:
      'Brak bezpiecznego, nowoczesnego miejsca dla młodzieży szkolnej, by odpocząć po lekcjach, wspólnie się uczyć lub skorzystać z cyfrowej rozrywki bez dużych kosztów.',
    solution:
      'Kawiarnia technologiczno-językowa łącząca strefę relaksu ze stanowiskami VR i konsolami, przestrzeń wspólnej nauki oraz bezpłatne kluby konwersacyjne z języków obcych.',
    px: 32,
    py: 70,
  },
  {
    id: 18,
    category: 'seniorzy',
    title: 'Centrum Wolontariatu Międzypokoleniowego',
    challenge:
      'Brak wspólnej przestrzeni łączącej energię młodzieży z doświadczeniem seniorów — osoby starsze borykają się z samotnością, młodzież szuka pierwszych doświadczeń społecznych.',
    solution:
      'Centrum Wolontariatu oparte na modelu lokalnego "Banku Czasu" — seniorzy dzielą się wiedzą i rzemiosłem, młodzież wspiera w cyfryzacji i codziennych sprawach, budując międzypokoleniowe więzi.',
    px: 50,
    py: 66,
  },
]
