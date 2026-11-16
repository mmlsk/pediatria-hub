---
name: Pediatria V · Hub nauki
description: Wspólny system projektowy Hubu i 9 interaktywnych atlasów pediatrycznych dla trybu jasnego (ciepły papier kliniczny) i ciemnego (Obsidian Carbon).
colors:
  teal-clinical: "#0C7A85"
  teal-deep: "#075760"
  teal-soft: "#DDF1F2"
  teal-dark: "#0F828E"
  teal-glow-dark: "#4FD1DD"
  slate-indigo: "#245B7A"
  slate-indigo-soft: "#E1EFF5"
  slate-indigo-dark: "#4FA3CC"
  emergency-red: "#B93424"
  emergency-red-soft: "#FBE6E2"
  emergency-red-dark: "#E55B4B"
  exam-amber: "#9A5F09"
  exam-amber-soft: "#FCEFD6"
  exam-amber-dark: "#E59A24"
  diagnostic-blue: "#2B63AE"
  diagnostic-blue-soft: "#E1ECF9"
  diagnostic-blue-dark: "#4E8FE6"
  verified-green: "#2F8450"
  verified-green-soft: "#E1F3E7"
  verified-green-dark: "#3BB36E"
  search-hit: "#C84700"
  paper-bg: "#F5F6F2"
  surface-white: "#FFFFFF"
  surface-wash: "#EFF2F0"
  ink-slate: "#13232C"
  ink-secondary: "#44545D"
  ink-muted: "#596870"
  line-sage: "#DCE2E0"
  obsidian-bg: "#090C0E"
  obsidian-surface: "#11161A"
  obsidian-elevated: "#171E24"
  obsidian-ink: "#F1F5F7"
  obsidian-secondary: "#B3C0C8"
  obsidian-muted: "#8A9BA5"
  obsidian-line: "#222B32"
typography:
  display:
    fontFamily: "'Cabinet Grotesk', 'Satoshi', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.8vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "'Cabinet Grotesk', 'Satoshi', system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0em"
  body:
    fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.08em"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  badge: "6px"
  control: "10px"
  card: "14px"
  card-lg: "22px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.teal-clinical}"
    textColor: "{colors.surface-white}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "11.2px 18.4px"
  button-primary-hover:
    backgroundColor: "{colors.teal-deep}"
    textColor: "{colors.surface-white}"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.pill}"
    padding: "11.2px 18.4px"
  chip-default:
    backgroundColor: "{colors.paper-bg}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "2.2px 9.6px"
  chip-active:
    backgroundColor: "{colors.ink-slate}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
  card-surface:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.card}"
    padding: "19.2px 20.8px"
  input-search:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.pill}"
    padding: "11.2px 16px 11.2px 41.6px"
  nav-item-active:
    backgroundColor: "{colors.ink-slate}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    height: "44px"
  table-wrapper:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.card}"
    padding: "8.8px 12px"
---

# Design System: Pediatria V · Hub nauki

## Overview

**Creative North Star: "Kliniczny atlas kieszonkowy"**

System wizualny łączy powłokę Hubu (`css/hub.css`) i 9 modułowych atlasów klinicznych (`atlasy/atlas-base.css`, `atlasy/atlas-mobile.css` oraz arkusze modułowe) w jedno narzędzie edukacyjne w trybie Operate + Read. Interfejs stawia na natychmiastową czytelność tabel, schematów decyzyjnych i pytań egzaminacyjnych bez zbędnych ozdobników, przechodząc płynnie z sesji biurkowych do obsługi jedną ręką na telefonie.

Tryb jasny bazuje na ciepłym papierze o niskim olśnieniu (`#F5F6F2`), a tryb ciemny na głębokiej palecie Obsidian Carbon (`#090C0E`), w której hierarchia budowana jest kontrastem krawędzi i powściągliwym światłem akcentów, bez ciężkich białych bloków i efektu halo. Oba tryby zachowują identyczną gramatykę semantyczną dla „podwójnej prawdy klinicznej” oraz stanów nagłych.

**Key Characteristics:**
- Spokojny, medyczny akcent główny (`--teal`) uzupełniony chłodnym łupkowym błękitem (`--violet: #245B7A`) zamiast fioletu dekoracyjnego.
- Ścisła dyscyplina semantyczna czerwieni (`--red`): zarezerwowana wyłącznie dla stanów zagrożenia życia, czerwonych flag, błędów oraz akcentu modułów ostrych/onkologicznych.
- Wyraźne wizualne rozdzielenie „Pod zaliczenie (klucz zakładu)” (bursztyn) od „Aktualnie klinicznie (wytyczne)” (zieleń lub diagnostyczny błękit).
- Spójna para krojów `Cabinet Grotesk` + `Satoshi` wsparta przez `JetBrains Mono` dla wartości liczbowych, dawek, wyników i identyfikatorów pytań.
- Ergonomia dotyku na urządzeniach mobilnych: minimalna wysokość celów `44px`, dolna belka nawigacji poniżej `720px` oraz przyklejone kolumny w szerokich tabelach.

## Colors

Paleta łączy neutralne tła o kontrolowanym kontraście z kodowaniem klinicznym opartym na zmiennych CSS zdefiniowanych równolegle dla `:root` (tryb jasny) i `:root[data-theme="dark"]` (Obsidian Carbon).

### Primary
- **Teal Clinical** (`--teal`: `#0C7A85`, ciemny: `#0F828E`): Główny kolor akcji (`btn.pri`), fokusów, aktywnych zakładek atlasów, ścieżek progresu oraz wskaźników aktywnej sekcji.
- **Teal Deep / Glow** (`--teal-d`: `#075760`, ciemny: `#4FD1DD`): Tekst linków, etykiety `eyebrow`, stan `:hover` akcji głównych oraz czytelny akcent tekstowy na ciemnych powierzchniach.
- **Teal Soft** (`--teal-l`: `#DDF1F2`, ciemny: `rgba(18, 153, 166, 0.18)`): Delikatne podświetlenia aktywnych pozycji menu atlasu, zaznaczonych filtrów i pierścieni focus.

### Secondary
- **Slate Indigo** (`--violet`: `#245B7A`, ciemny: `#4FA3CC`): Akcent grupy D (onkologia, hematologia, immunologia) oraz odznak dydaktycznych i czynnościowych; zastępuje krzykliwy fiolet chłodnym odcieniem klinicznym (docelowo ujednolicanym także w `atlasy/atlas-base.css`).
- **Emergency Red** (`--red`: `#B93424`, ciemny: `#E55B4B`): Kolor wysokiego alarmu dla stanów zagrożenia życia (grupa A, `red flags`), błędnych odpowiedzi testowych i komunikatów `Klucz niepewny`.
- **Exam Amber** (`--amber`: `#9A5F09`, ciemny: `#E59A24`): Oznaczenia pytań wnioskowanych (`Klucz wnioskowany`), pułapek egzaminacyjnych i kolumny `Pod zaliczenie`.
- **Diagnostic Blue** (`--blue`: `#2B63AE`, ciemny: `#4E8FE6`): Grupa C (nefrologia), badania diagnostyczne oraz warianty porównawcze `Aktualnie klinicznie`.
- **Verified Green** (`--green`: `#2F8450`, ciemny: `#3BB36E`): Poprawne odpowiedzi, potwierdzone klucze (`Klucz z pliku`) oraz perełki kliniczne.
- **Search Hit Orange** (`--hit`: `#C84700`, ciemny: `#C94D0C`): Wyróżnienia trafień wyszukiwania oraz przycisków kontekstowych o podwyższonej widoczności.

### Neutral
- **Warm Paper Canvas** (`--bg`: `#F5F6F2` | **Obsidian Canvas** `#090C0E`): Główne tło strony i kontenerów bazowych.
- **Elevated Card Surface** (`--surface`: `#FFFFFF` | **Obsidian Surface** `#11161A`): Tło kart, tabel `.tw`, kontenerów pytań i modali.
- **Muted Wash Surface** (`--surface-2`: `#EFF2F0` / `#EEF2F0` | **Obsidian Elevated** `#171E24`): Nagłówki tabel `th`, nieaktywne opcje pytań w quizach, szuflady boczne i karty wtórne.
- **Ink Hierarchy** (`--ink`: `#13232C`, `--ink-2`: `#44545D`, `--muted`: `#596870` | ciemny: `#F1F5F7`, `#B3C0C8`, `#8A9BA5`): Podstawowy tekst, teksty pomocnicze/podtytuły oraz metadane zachowujące kontrast `>= 4.5:1`.
- **Hairline Borders** (`--line`: `#DCE2E0`, `--line-2`: `#E9EDEB` | ciemny: `#222B32`, `#192026`): 1-pikselowe ramki oddzielające powierzchnie w miejsce ciężkich cieni.

### Named Rules
**The Clinical Red Discipline Rule.** Kolor `--red` (`#B93424` / `#E55B4B`) jest zarezerwowany wyłącznie dla stanów zagrożenia życia (czerwone flagi, anafilaksja, sepsa, wzmożone ICP), krytycznych błędów klinicznych oraz negatywnej weryfikacji odpowiedzi — nigdy jako ozdobnik przycisków nawigacji czy statystyk.

**The Obsidian Carbon Rule.** W trybie ciemnym `[data-theme="dark"]` nigdy nie nakłada się białego `#fff` na karty ani przyciski wtórne; tła bazują na `--bg` (`#090C0E`), `--surface` (`#11161A`) i `--surface-2` (`#171E24`), a aktywne przyciski odwracane są przez `--ink` z tekstem `--ink-inv` (`#090C0E`) lub `--on-accent`.

## Typography

**Display Font:** `Cabinet Grotesk` (wagi `700`, `800`, fallback `'Satoshi', system-ui, sans-serif`)
**Body Font:** `Satoshi` (wagi `400`, `500`, `700`, fallback `'Inter', system-ui, sans-serif`)
**Label/Mono Font:** `JetBrains Mono` (z fallbackiem `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` oraz `font-variant-numeric: tabular-nums` w klasie `.mono`, statystykach i dawkach)

**Character:** Geometryczny i wyrazisty `Cabinet Grotesk` nadaje nagłówkom autorytet atlasu akademickiego, podczas gdy neutralny `Satoshi` utrzymuje długie akapity kliniczne i tabele diagnostyczne w wysokiej czytelności na ekranach mobilnych i biurkowych.

### Hierarchy
- **Display** (`800`, `clamp(2.5rem, 5.8vw, 4.5rem)`, `line-height: 1.1`, `letter-spacing: -0.015em`): Główny tytuł sekcji Hero Hubu (`2.2rem–3.8rem` w atlasach).
- **Headline** (`800`, `clamp(1.7rem, 3.4vw, 2.4rem)`, `line-height: 1.15`, `letter-spacing: -0.01em`): Nagłówki sekcji modułowych `h2` (`1.6rem–2.2rem` w `atlas-base.css`).
- **Title** (`700`, `1.15rem–1.2rem`, `line-height: 1.3`, `font-family: var(--font-body)`): Tytuły kart chorobowych, grup pytań i boksów różnicowania (`h3`).
- **Body** (`400–500`, `1rem` / `16px`, `line-height: 1.6`): Treść wykładowa, stems pytań i omówienia (`max-width: 72ch–75ch` dla komfortu czytania; w sekcjach Hero `max-width: 52ch–66ch`).
- **Label & Telemetry** (`700–800`, `0.72rem–0.8rem`, `letter-spacing: 0.04em–0.09em`, `text-transform: uppercase`): Etykiety `.eyebrow`, nagłówki tabel `th`, odznaki statusu `.kb`, `.tbadge` i przyciski nawigacji.
- **Mono & Tabular** (`500–800`, `0.78rem–0.92rem`, `tabular-nums`): Numeracja pytań `[12]`, dawki leków, wartości laboratoryjne, skróty klawiaturowe `<kbd>` i wskaźniki punktowe.

### Named Rules
**The Tabular Data Integrity Rule.** Wszystkie liczby kliniczne (dawki mg/kg, wyniki PAS/McIsaac/Holliday-Segar, liczniki pytań i osie czasu) muszą używać `font-variant-numeric: tabular-nums` lub kroju monospace, aby kolumny i liczniki nie skakały przy zmianie wartości.

**The iOS Form Zoom Rule.** W mediach dotykowych (`pointer: coarse`) pola `input`, `select` i `textarea` wymuszają `font-size: max(16px, 1em)`, aby zapobiegać automatycznemu powiększaniu widoku w Safari na iOS.

## Layout

Kontener centralny `.wrap` ogranicza szerokość roboczą do `min(1180px, 100% - 2rem)` (`100% - 1.2rem` poniżej `720px`), a sekcje rozdzielane są rytmem pionowym `clamp(2.5rem, 6vw, 4.5rem)` oraz subtelną poziomą linią `--line`.

- **Siatki bazowe:** 4-kolumnowe (`.map`, `.loop`, `.kpis`, `.stats`), 3-kolumnowe (`.grid3`) i 2-kolumnowe (`.grid2`, `.dual`, `.dcards`, `.cmp`) redukują się płynnie w progach `1000px`, `900px` (`grid-template-columns: 1fr` dla kart, `1fr 1fr` dla `.kpis`) oraz `560px` (`1fr` dla `.kpis`).
- **Nawigacja adaptacyjna:** Do `720px` główna belka nawigacji działa u góry ekranu (`--bar-h: 64px`); poniżej `720px` `--bar-h` spada do `58px`, a `.menu` dokuje na stałe do dolnej krawędzi (`padding-bottom` uwzględnia `env(safe-area-inset-bottom)` i `44px` minimalnej wysokości przycisków). Poniżej `380px` dolne etykiety zachowują rozmiar `12px` z `flex: 1 1 auto` przy wysokości paska `49px`, a w trybie treningu `.trening-next-sticky` rezerwuje `margin-right: calc(38px + env(safe-area-inset-right))` dla przycisku `#btnQuickNotes`.
- **Tabele i schematy SVG (`.tw`, `.fig`):** Poniżej `640px` nagłówki `.tw th` zmniejszają się do `0.72rem`, a szerokie tabele porównawcze (`.heat`, `.dhy`) przypinają pierwszą kolumnę (`position: sticky; left: 0`) nad horyzontalnym przewijaniem `.tw`.

## Elevation & Depth

System jest płaski i oparty na wyraźnych ramkach `1px solid var(--line)` z bardzo miękkim cieniem warstwowym w trybie jasnym oraz kontrastem warstw powierzchni w trybie ciemnym.

### Shadow Vocabulary
- **Card Elevation Light** (`box-shadow: 0 1px 2px rgba(19, 35, 44, 0.06), 0 8px 24px rgba(19, 35, 44, 0.06)` w Hubie; `0 6px 20px` w atlasach): Standardowe uniesienie kart i kontenerów figur.
- **Popover / Modal Elevation Light** (`box-shadow: 0 2px 4px rgba(19, 35, 44, 0.06), 0 18px 48px rgba(19, 35, 44, 0.12)`): Dialog wyszukiwarki, rozwijane menu `.nav-pop` oraz powiadomienia `.toast`.
- **Obsidian Carbon Layering Dark** (`box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 8px 24px rgba(0, 0, 0, 0.46)`): Subtelny wewnętrzny highlight od góry i głęboki cień bazowy na kartach; dla overlayów highlight `0.06` oraz cień `0 20px 52px rgba(0, 0, 0, 0.64)`.
- **Active Primary Accent Shadow** (`box-shadow: 0 6px 18px rgba(12, 122, 133, 0.28)` w trybie jasnym; `0 4px 14px rgba(0, 0, 0, 0.45)` w ciemnym): Delikatne zakotwiczenie przycisku CTA bez neonowego rozbłysku.

### Named Rules
**The Crisp Edge First Rule.** Granica elementu jest definiowana przez `1px solid var(--line)` (lub `--line-2`), a cień jedynie ją wspiera; w trybie ciemnym to kontrast między `#090C0E`, `#11161A` i `#171E24` buduje głębię.

## Shapes

Język form konsekwentnie odróżnia elementy interaktywne (pełne kapsuły) od kontenerów treści (zaokrąglone prostokąty).

- **Kapsuły kontrolne (`999px`):** Wszystkie przyciski (`.btn`), chipy filtrujące (`.chip`), pigułki statusu (`.pill`), przełączniki segmentowe (`.tgl`), pola wyszukiwania (`.field`) oraz pozycje nawigacji.
- **Karty i panele (`14px` `--r` oraz `22px` `--r-lg`):** Sekcje i grupy modułów na ekranie startowym (`22px`), a karty wiedzy, pytania `.q`, kontenery tabel `.tw` i akordeony (`12px–14px`).
- **Znaczniki mikro (`6px`–`10px`):** Tagi numerów modułów (`.mod` `6px`), etykiety pewności klucza (`.kb`, `.tbadge` `6px`), warianty odpowiedzi (`.opt` `10px`) i boksy callout (`10px`).

## Components

Komponenty zachowują jednolitą obsługę interakcji (`:focus-visible` z obrysem `3px solid var(--teal)` lub `var(--focus-ring)`, reakcja `:active { transform: scale(0.975–0.98) }` wyciszana pod `@media (prefers-reduced-motion: reduce)`).

### Buttons
- **Shape:** Pełna kapsuła (`999px` radius), krój pogrubiony (`700–800`).
- **Primary:** Tło `--teal`, biały tekst `--on-accent`, padding `0.7rem 1.15rem` (`.btn.pri` w Hubie) lub `0.45rem 0.95rem` (`.btn` w atlasach); hover przyciemnia tło do `--teal-d` w trybie jasnym lub rozjaśnia do `--teal-hover` (`#139AA8`) w ciemnym.
- **Hover / Focus:** Przesunięcie `-1px` w pionie (wyłączane na `hover: none` i `reduced-motion`), obrys fokusu `3px solid var(--teal)`.
- **Secondary / Outline (`.btn.sec`, `.btn.o`, `.btn.ghost`):** Tło `--surface`, tekst `--ink` lub `--teal-d`, ramka `1px–1.5px solid var(--line)` lub `var(--teal)`; w trybie ciemnym atlasy zachowują `--surface` i `--line` z tekstem `--ink`.

### Chips
- **Style:** Pigułki `999px`, padding `0.14rem 0.6rem` (`.chip`) lub `0.08rem 0.5rem` (`.pill`), warianty semantyczne kolorów (`s`/czerwony, `i`/niebieski, `e`/zielony, `f`/slate-indigo, `gap`/bursztynowy, `hit`/pomarańczowy).
- **State:** Aktywny stan filtrów i zakładek zmienia tło na `--ink` (`--teal` w przyciskach `.tabs`/`.filters` atlasów) z kontrastowym tekstem `--ink-inv` / `--on-accent`.

### Cards / Containers
- **Corner Style:** `14px` (`--r`) dla standardowych kart (`.card`, `.kpi`, `.q`, `.tcard`) oraz `22px` (`--r-lg`) dla głównych kontenerów grup i mapy.
- **Background:** `--surface` (`#FFFFFF` / `#11161A`); warianty ostrzegawcze i porównawcze `.callout` / `.tcard` wykorzystują miękkie tła `*-l` lub `5px solid` akcent górnej krawędzi (`.tcard`).
- **Shadow Strategy:** Warstwa standardowa `var(--shadow)`; tabele osadzone wewnątrz `.card` (`.card .tw`) znoszą własne tło, obramowanie i padding, by uniknąć podwójnej ramki.
- **Border:** `1px solid var(--line)`.
- **Internal Padding:** `1.2rem 1.3rem` w kartach głównych, `1rem 1.1rem` w `.tcard`/`.kpi`.

### Inputs / Fields
- **Style:** Zaokrąglenie `999px` (wyszukiwarka `.field`) lub `10px–12px` (pola formularzy, kalkulatory i edytor `textarea.code`), ramka `1.5px solid var(--line)`, tło `--surface`.
- **Focus:** Zmiana koloru ramki na `--teal` oraz poświata `0 0 0 4px var(--teal-l)` zamiast domyślnego outline przeglądarki.
- **Error / Disabled:** Przyciski wyłączone obniżają krycie (`opacity: 0.5; pointer-events: none`), a wyłączone opcje quizu zachowują pełny kontrast tekstu (`opacity: 1`).

### Navigation
- **Style & Behavior:** Górny przyklejony pasek `.bar` (`64px`, `backdrop-filter: blur(12px)` na desktopie; w trybie mobilnym bez `backdrop-filter` z pełnym `--bg`), z kapsułami zakładek oraz popoverem `.nav-pop`. Poniżej `720px` główna nawigacja Hubu dokuje na dole ekranu (`min-height: 44px` per zakładka, `12px` etykiety poniżej `380px`). W osadzonych atlasach (`.nav`) `atlas-mobile.css` odkleja podrzędny pasek `html.hub-embedded .nav` dla uniknięcia podwójnego nagłówka.

### Table Wrapper (`.tw`) & Dual-Truth Box
- **`atlasy/atlas-base.css` `.tw`:** Kontener tabel (`overflow-x: auto`, `border: 1px solid var(--line)`, `border-radius: var(--r)`, `background: var(--surface)`, `padding: 0.55rem 0.75rem`), który poniżej `640px` kompresuje nagłówki (`0.72rem`) oraz przypina pierwszą kolumnę w macierzach `.heat` i `.dhy`.
- **Podwójna prawda (`.dual`, `.vs`, `.pw`):** Dwukolumnowe zestawienie zestawiające `Pod zaliczenie` (`--amber-l`) z `Aktualnie klinicznie` (`--green-l` lub `--blue-l`) o wyrównanej gęstości i nagłówkach wersalikowych.

## Do's and Don'ts

### Do:
- **Do** stosować `--teal` (`#0C7A85` / `#0F828E`) jako jedyny główny kolor akcji i nawigacji aktywnej we wszystkich nowych widokach i komponentach.
- **Do** używać par zmiennych semantycznych (`--surface`, `--surface-2`, `--ink`, `--line` oraz odpowiedników `*-l`) z `:root` i `:root[data-theme="dark"]` zamiast twardych wartości `#fff` lub `#000`.
- **Do** używać `JetBrains Mono` / `tabular-nums` dla dawek pediatrycznych, zakresów referencyjnych, wyników skal i identyfikatorów zadań.
- **Do** zachować minimalny rozmiar dotykowy `44px` na elementach klikalnych w trybie mobilnym oraz testować kolizje przyklejonych pasków z `#btnQuickNotes` i bezpiecznymi marginesami `env(safe-area-inset-*)`.

### Don't:
- **Don't** używać czerwieni (`--red`) do dekoracji, zwykłych odznak kategorii czy głównych CTA — pozostaje zarezerwowana wyłącznie dla stanów zagrożenia życia, czerwonych flag, błędów oraz modułów ostrych/onkologicznych.
- **Don't** wprowadzać fioletu dekoracyjnego spoza palety w miejsce łupkowego `--violet: #245B7A` (`#4FA3CC` w trybie ciemnym).
- **Don't** zacierać rozróżnienia między „Pod zaliczenie” (`--amber`) a „Aktualnie klinicznie” (`--green` / `--blue`) ani ukrywać pewności klucza.
- **Don't** duplikować bazowych klas (`.pill`, `.tcard`, `.tbadge`, `.btn.o`, `.kpis`, `.chk`, `.tw`) w arkuszach modułowych — rozszerzaj wspólny `atlasy/atlas-base.css`.
