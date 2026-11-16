# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Obecni użytkownicy:** prywatne narzędzie edukacyjne autora oraz zamknięte grono testerów.
- **Docelowi użytkownicy:** studenci V roku medycyny przygotowujący się do kolokwiów i zaliczeń z pediatrii na komputerze, iPadzie i iPhonie, również bez dostępu do sieci (offline PWA).
- **Zadanie użytkownika:** szybkie opanowanie materiału modułowego, przećwiczenie puli pytań zaliczeniowych i klinicznych, konfrontacja wymagań egzaminacyjnych z aktualną wiedzą medyczną oraz powtórka przypadków przed zaliczeniem.

## Product Purpose

„Pediatria V · Hub nauki” łączy dziewięć interaktywnych atlasów modułowych z bazą 2669 zadań testowych i otwartych, trybami treningu, symulacją egzaminu, modułami klinicznymi (przypadki SOR, stacje OSCE, kalkulatory, szczepienia, diagnostyka), grafem powiązań oraz notatkami Markdown w jednej aplikacji webowej działającej także offline. Sukces oznacza szybkie przejście od lektury atlasu do rozwiązania powiązanych pytań, natychmiastową weryfikację błędów i utrzymanie ciągłości postępu między sesjami.

## Positioning

- **Podwójna prawda kliniczno-egzaminacyjna:** jawne rozdzielenie odpowiedzi „Do zaliczenia (wg klucza zakładu)” od „Aktualna wiedza kliniczna” w pytaniach z rozbieżnościami, uzupełnione o wskaźniki pewności klucza i częstość powtarzania pytań w rocznikach (2014–2026).
- **Jedno środowisko nauki bez przełączania narzędzi:** ścisłe powiązanie sekcji 9 atlasów z modułami pytań, mapą pułapek, fiszkami, notatnikiem i pracą offline w ramach pojedynczej statycznej aplikacji PWA.

## Operating Context

- **Scenariusze nauki:** dłuższe sesje przy biurku (czytanie atlasów, egzamin próbny, graf powiązań) oraz krótkie powtórki jedną ręką na iPhonie/iPadzie (rozwiązywanie zadań w kartach, szybki trening błędów, kalkulator pediatryczny, szybkie notatki).
- **Warunki otoczenia:** różne warunki oświetleniowe wymagające pełnego wsparcia trybu jasnego i ciemnego oraz niestabilny dostęp do internetu (pełny cache statyczny przez `sw.js` i instalowalność PWA z `manifest.webmanifest`).
- **Język i bezpieczeństwo merytoryczne:** wyłącznie język polski i polska terminologia pediatryczna z wyraźnym zastrzeżeniem edukacyjnym (decyzje kliniczne należy weryfikować z ChPL i aktualnymi wytycznymi).

## Capabilities and Constraints

- **Architektura bez backendu:** statyczny zestaw HTML/CSS/vanilla JS (`index.html`, `js/app.js`, `js/meta.js`, `js/logic.js`, `js/questions.js`, `js/questions_zaklad.js`, `atlasy/*`, `sw.js`) hostowany na GitHub Pages (`.github/workflows/deploy.yml`), bez kont użytkowników i bez serwera.
- **Trwałość danych użytkownika w `localStorage`:** każda zmiana musi zachować kompatybilność zapisanych odpowiedzi (`S.ans`), zakładek (`S.bm`), notatek oraz własnych/importowanych pytań (`pediatria_hub_custom_questions_v1`) i nie wymagać ręcznego czyszczenia stanu przez testerów.
- **Sprawdzenia automatyczne i ręczne:** logika domenowa posiada testy jednostkowe w `tests/hub.test.mjs` (`node --test`). Dane naukowe i pytania są osadzone lokalnie w plikach `js/` i `atlasy/`.

## Brand Commitments

- **Nazwa:** `Pediatria V · Hub nauki` (`Pediatria V – hub`).
- **Zobowiązanie merytoryczne:** zachowanie istniejącej polskiej kopii naukowej i zastrzeżeń klinicznych; brak dodawania zmyślonych roszczeń klinicznych, statystyk skuteczności ani fikcyjnych opinii.

## Evidence on Hand

- `index.html`, `manifest.webmanifest`, `sw.js` — powłoka PWA i precache offline.
- `js/meta.js`, `js/logic.js`, `js/app.js` — metadane modułów, logika domenowa (kalkulatory, parser importu pytań, ocenianie egzaminu, Markdown) i router widoków.
- `js/questions.js` (413 pytań modułowych) oraz `js/questions_zaklad.js` (2256 pytań z puli zakładowej).
- `atlasy/*` — 9 modułowych atlasów pediatrycznych wraz ze wspólnym arkuszem `atlasy/atlas-mobile.css`.
- `tests/hub.test.mjs` — zestaw testów jednostkowych dla `js/logic.js`.
- **Braki, których nie wolno fabrykować:** brak zewnętrznych referencji, brak metryk analitycznych z produkcji, brak publicznych case studies użytkowników (aplikacja w fazie prywatnej / testów zamkniętych).

## Product Principles

1. **Chroń podwójną prawdę:** nigdy nie zacieraj różnicy między historycznym kluczem zakładowym a współczesnymi wytycznymi klinicznymi.
2. **Zero utraty postępu:** aktualizacje interfejsu, routingu i Service Workera nie mogą psuć schematów zapisanych w `localStorage`.
3. **Ergonomia nauki jedną ręką:** najważniejsze akcje podczas czytania i rozwiązywania zadań muszą być wygodne dotykowo na iPhonie i iPadzie bez kompromisu dla widoku desktopowego.
4. **Natychmiastowa gotowość offline:** aplikacja działa bez zależności zewnętrznych wymaganych do podstawowej nauki i bez backendu.
5. **Uczciwość edukacyjna:** materiały wspierają przygotowanie do zaliczeń i nie zastępują ChPL ani oficjalnych wytycznych przy decyzjach klinicznych.

## Accessibility & Inclusion

- Priorytet na dostępność dotykową (min. 44 px cele dotykowe w trybie mobilnym), obsługę klawiatury i czytelność treści w trybie jasnym oraz ciemnym (`data-theme="dark"`).
- Respektowanie preferencji systemowych `prefers-reduced-motion: reduce` przy zachowaniu czytelnej sygnalizacji zmiany stanu i wyniku odpowiedzi.
