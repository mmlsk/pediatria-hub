/* Metadane hubu: moduły kursu, atlasy, grupy, pułapki międzymodułowe */
window.HUB_META = (function () {
  const GROUPS = {
    A: { name: 'Stany nagłe i choroby zakaźne', short: 'Nagłe i zakaźne', color: 'var(--red)', soft: 'var(--red-l)', hex: '#C23B2A' },
    B: { name: 'Gastroenterologia i alergologia', short: 'Gastro i alergie', color: 'var(--amber)', soft: 'var(--amber-l)', hex: '#B8730F' },
    C: { name: 'Nefrologia', short: 'Nefrologia', color: 'var(--blue)', soft: 'var(--blue-l)', hex: '#2B63AE' },
    D: { name: 'Onkologia, hematologia i immunologia', short: 'Onko-hemato-immuno', color: 'var(--violet)', soft: 'var(--violet-l)', hex: '#6E4CB0' }
  };

  /* Moduły wg zakresu przedmiotu. at = atlas, a = kotwica w atlasie */
  const MODS = [
    { id: '1',   g: 'A', n: 'Ból brzucha',                    at: 'brzuch', a: 'badanie',     d: 'Lokalizacja, objawy otrzewnowe, różnicowanie wg wieku' },
    { id: '2',   g: 'A', n: 'Zakażenia u dzieci',             at: 'zakazenia', a: 'wiek',     d: 'Drogi oddechowe, wysypki, neuroinfekcje, sepsa, szczepienia' },
    { id: '5',   g: 'A', n: 'Stany nagłe',                    at: 'nagle',  a: 'pat',         d: 'PAT, ABCDE, wstrząs, drgawki, anafilaksja, DKA' },
    { id: '3',   g: 'B', n: 'Biegunki',                       at: 'gastro', a: 'm3',          d: 'Ocena odwodnienia, infekcje, celiakia, IBD, alergia' },
    { id: '6',   g: 'B', n: 'Choroba wrzodowa',               at: 'gastro', a: 'm6',          d: 'Cechy alarmowe, H. pylori: nieinwazyjnie vs inwazyjnie' },
    { id: '7',   g: 'B', n: 'Nieswoiste zapalenia jelit',     at: 'gastro', a: 'm7',          d: 'ChLC vs WZJG, kalprotektyna, endoskopia, MR-enterografia' },
    { id: '8',   g: 'B', n: 'Alergie pokarmowe',              at: 'gastro', a: 'm8',          d: 'IgE vs non-IgE, anafilaksja, FPIES, próba prowokacji' },
    { id: '4',   g: 'C', n: 'Kłębuszkowe zapalenia nerek',    at: 'nefro',  a: 'kzn',         d: 'Zespół nefrytyczny vs nerczycowy, C3/C4, wskazania do biopsji' },
    { id: '14',  g: 'C', n: 'ZUM u dzieci',                   at: 'nefro',  a: 'zum',         d: 'Objawy niespecyficzne u niemowląt, mocz przed antybiotykiem, USG i CUM' },
    { id: '15',  g: 'C', n: 'AKI i PChN',                     at: 'nefro',  a: 'aki',         d: 'KDIGO, przednerkowe, nerkowe, zanerkowe, powikłania PChN' },
    { id: '9',   g: 'D', n: 'Guzy mózgu',                     at: 'guzy',   a: 'wystepowanie', d: 'Poranne bóle głowy, dno oka, MR, podnamiotowe vs nadnamiotowe' },
    { id: '10',  g: 'D', n: 'Nowotwory lite',                 at: 'lite',   a: 'epi',         d: 'Wilms, neuroblastoma, mięsaki, siatkówczak, nie uciskać guza' },
    { id: '11',  g: 'D', n: 'Nowotwory krwiotwórcze i chłonne', at: 'onko11', a: 'objawy',          d: 'Objawy B, cytopenie, zespół żyły głównej górnej, lizy guza' },
    { id: '12',  g: 'D', n: 'Skazy krwotoczne',               at: 'hemato', a: 's12',         d: 'Płytkowe vs osoczowe vs naczyniowe, ITP, hemofilia, vWD, IgAV' },
    { id: '13a', g: 'D', n: 'Niedokrwistości',                at: 'hemato', a: 's13a',        d: 'Podział wg MCV i retikulocytów, żelazo, hemoliza, aplazja' },
    { id: '13b', g: 'D', n: 'Zaburzenia odporności',          at: 'hemato', a: 's13b',        d: '10 objawów ostrzegawczych PNO, przesiew, szczepienia żywe' },
    { id: '0',   g: 'A', n: 'Poza modułami (ogólna)',        at: 'ogolne', a: 'start',       d: 'Kardiologia, rozwój, żywienie, metabolizm, endokrynologia' }
  ];

  /* Atlasy – w kolejności kursu */
  const ATLASES = [
    { id: 'brzuch', dir: 'atlas-bol-brzucha', t: 'Pacjent z bólem brzucha', tag: '[1]', mods: ['1'],
      d: 'Badanie brzucha, mapa bólu, wiek a przyczyna, algorytm różnicowania.',
      secs: [['badanie', 'Badanie'], ['mapa', 'Mapa bólu'], ['wiek', 'Wiek'], ['algorytm', 'Algorytm'], ['choroby', 'Choroby'], ['zadania', 'Zadania testowe'], ['klucz', 'Klucz vs wytyczne'], ['pulapki', 'Pułapki'], ['zrodla', 'Źródła']] },
    { id: 'zakazenia', dir: 'modul-2-zakazenia', t: 'Zakażenia u dzieci', tag: '[2]', mods: ['2'],
      d: 'Wiek i patogeny, gorączka, drogi oddechowe, wysypki, neuroinfekcje, sepsa, szczepienia i dawkowanie.',
      secs: [['wiek', 'Wiek i patogeny'], ['goraczka', 'Gorączka'], ['gora', 'Górne DO'], ['dolne', 'Dolne DO'], ['wysypki', 'Wysypki'], ['neuro', 'Neuroinfekcje'], ['sepsa', 'Sepsa'], ['szczepienia', 'Szczepienia'], ['dawki', 'Dawki'], ['zadania', 'Zadania testowe'], ['klucz', 'Klucz vs wytyczne'], ['pulapki', 'Pułapki']] },
    { id: 'gastro', dir: 'modul-3-6-7-8-gastro-alergologia', t: 'Gastroenterologia i alergie', tag: '[3][6][7][8]', mods: ['6', '3', '7', '8'],
      d: 'Wrzód i H. pylori, biegunki, IBD, alergie pokarmowe: od objawów do diagnostyki.',
      secs: [['start', 'Start'], ['m6', '[6] Wrzodowa'], ['m3', '[3] Biegunki'], ['m7', '[7] IBD'], ['m8', '[8] Alergie'], ['pulapki', 'Pułapki'], ['klucz', 'Klucz vs wytyczne'], ['trening', 'Trening'], ['zrodla', 'Źródła']] },
    { id: 'nefro', dir: 'modul-4-14-15-nefrologia', t: 'Nefrologia dziecięca', tag: '[4][14][15]', mods: ['4', '14', '15'],
      d: 'KZN, zespół nerczycowy, AKI, PChN i zakażenia układu moczowego.',
      secs: [['przeglad', 'Przegląd'], ['kzn', '[4] KZN'], ['zn', '[4] Zespół nerczycowy'], ['aki', '[15] AKI'], ['pchn', '[15] PChN'], ['zum', '[14] ZUM'], ['zadania', 'Zadania testowe'], ['klucz', 'Klucz vs wytyczne'], ['pulapki', 'Pułapki'], ['zrodla', 'Źródła']] },
    { id: 'nagle', dir: 'modul-5-stany-nagle', t: 'Stany nagłe u dzieci', tag: '[5]', mods: ['5'],
      d: 'PAT i ABCDE, normy i dawki, wstrząs, anafilaksja, drgawki, DKA, zatrucia, NZK.',
      secs: [['pat', 'PAT'], ['normy', 'Dawki'], ['oddech', 'Oddech'], ['wstrzas', 'Wstrząs'], ['anafilaksja', 'Anafilaksja'], ['drgawki', 'Drgawki'], ['dka', 'DKA'], ['zatrucia', 'Zatrucia'], ['nzk', 'NZK'], ['icp', 'ICP'], ['zadania', 'Zadania'], ['klucz', 'Klucz/wytyczne'], ['pulapki', 'Pułapki'], ['zrodla', 'Źródła']] },
    { id: 'guzy', dir: 'modul-9-guzy-mozgu', t: 'Guzy mózgu u dzieci', tag: '[9]', mods: ['9'],
      d: 'Występowanie, objawy, diagnostyka, karty guzów, rdzeń i leczenie.',
      secs: [['wystepowanie', 'Występowanie'], ['objawy', 'Objawy'], ['diagnostyka', 'Diagnostyka'], ['guzy', 'Karty guzów'], ['rdzen', 'Rdzeń'], ['leczenie', 'Leczenie'], ['zadania', 'Zadania testowe'], ['klucz', 'Klucz vs wytyczne'], ['pulapki', 'Pułapki'], ['zrodla', 'Źródła']] },
    { id: 'lite', dir: 'nowotwory-lite-modul-10', t: 'Nowotwory lite u dzieci', tag: '[10]', mods: ['10'],
      d: 'Epidemiologia, mapa guzów, objawy, badanie, diagnostyka i różnicowanie.',
      secs: [['epi', 'Epidemiologia'], ['mapa', 'Mapa guzów'], ['wiek', 'Wiek'], ['objawy', 'Objawy'], ['badanie', 'Badanie'], ['diagnostyka', 'Diagnostyka'], ['guzy', 'Karty guzów'], ['rozn', 'Różnicowanie'], ['zadania', 'Zadania testowe'], ['klucz', 'Klucz vs wytyczne'], ['pulapki', 'Pułapki'], ['zrodla', 'Źródła']] },
    { id: 'onko11', dir: 'modul-11-hemato-onko', t: 'Nowotwory układu krwiotwórczego i chłonnego', tag: '[11]', mods: ['11'],
      d: 'ALL, AML, CML, Hodgkin i NHL: objawy, stany nagłe, badanie i diagnostyka przed sedacją.',
      secs: [['mapa','Mapa'],['objawy','Objawy'],['nagle','Stany nagłe'],['badanie','Badanie'],['diagnostyka','Diagnostyka'],['wiek','Wiek'],['zadania','Zadania testowe'],['rozbieznosci','Pula vs wytyczne'],['perly','Perły'],['zrodla','Źródła']] },
    { id: 'hemato', dir: 'modul-12-13-skazy-niedokrwistosci-odpornosc', t: 'Skazy, anemie i odporność', tag: '[12][13a][13b]', mods: ['12', '13a', '13b'],
      d: 'Skazy krwotoczne, niedokrwistości oraz zaburzenia odporności u dzieci.',
      secs: [['s12', '[12] Skazy'], ['diag', 'Diagnostyka'], ['leczenie', 'Leczenie'], ['s13a', '[13a] Niedokrwistości'], ['zelazo', 'Żelazo'], ['s13b', '[13b] Odporność'], ['jmf', 'JMF'], ['wiek', 'Wiek'], ['zadania', 'Zadania'], ['klucz', 'Pula vs wytyczne'], ['zrodla', 'Źródła']] }
  ];

  /* Pułapki międzymodułowe: zakres projektu (anty-błąd) */
  const TRAPS = [
    { t: 'HUS', mods: ['1', '3', '12', '15'], eq: 'Ból brzucha + krwista biegunka + małopłytkowość + AKI', out: 'Zespół hemolityczno-mocznicowy', tip: 'Nie podawać antybiotyków ani leków przeciwperystaltycznych przy krwistej biegunce z podejrzeniem STEC.' },
    { t: 'IgAV (HSP)', mods: ['1', '12', '4'], eq: 'Ból brzucha + plamica na pośladkach i kończynach + krwinkomocz', out: 'Zapalenie naczyń związane z IgA', tip: 'Plamica nie wynika z małopłytkowości, a morfologia i krzepnięcie są prawidłowe.' },
    { t: 'Gorączka i brzuch', mods: ['1', '2', '14'], eq: 'Ból brzucha + gorączka bez objawów dyzurycznych', out: 'Wyklucz ZUM lub zapalenie dolnego płata płuca', tip: 'U niemowląt i małych dzieci ZUM bywa niemy: mocz pobrany prawidłowo, zanim padnie antybiotyk.' },
    { t: 'Zaparcie a ZUM', mods: ['14', '1'], eq: 'Zaparcie lub dysfunkcja mikcji + nawracające ZUM', out: 'Leczyć czynnik ryzyka, nie tylko zakażenie', tip: 'Zaparcie i dysfunkcja pęcherza to częste, odwracalne przyczyny nawrotów.' },
    { t: 'Guz brzucha', mods: ['10', '1'], eq: 'Guz w jamie brzusznej u małego dziecka', out: 'Podejrzenie nefroblastoma: nie uciskać guza', tip: 'Ucisk guza i biopsja grożą rozsiewem i podniesieniem stopnia, rozpoznanie opiera się na obrazowaniu.' },
    { t: 'Przed sedacją', mods: ['11', '5'], eq: 'Węzły, zespół żyły głównej górnej, duszność u dziecka z podejrzeniem chłoniaka', out: 'RTG klatki piersiowej przed sedacją', tip: 'Guz śródpiersia i uciśnięcie dróg oddechowych mogą zakończyć się zatrzymaniem krążenia w znieczuleniu.' },
    { t: 'Ból głowy i wymioty', mods: ['9', '5'], eq: 'Poranne bóle głowy + wymioty + zaburzenia widzenia', out: 'Guz tylnego dołu, wzrost ICP: dno oka i MR', tip: 'Poranne bóle głowy i wymioty to cechy wzrostu ICP: badanie dna oka i obrazowanie MR.' },
    { t: 'Zespół nerczycowy', mods: ['4', '2', '12'], eq: 'Obrzęki + masywny białkomocz + hipoalbuminemia', out: 'Ryzyko zakażeń i zakrzepicy', tip: 'Utrata IgG i antytrombiny z moczem oraz hipoalbuminemia sprzyjają zakażeniom i zakrzepicy.' },
    { t: 'Anafilaksja', mods: ['5', '8'], eq: 'Reakcja alergiczna pokarmowa z objawami układowymi', out: 'Adrenalina i.m. w pierwszej kolejności', tip: 'Alergia pokarmowa IgE-zależna to najczęstsza przyczyna anafilaksji u dzieci.' },
    { t: 'Szczepienia żywe', mods: ['13b', '2'], eq: 'Podejrzenie pierwotnego niedoboru odporności', out: 'Szczepienia żywe przeciwwskazane do czasu wyjaśnienia', tip: 'Przesiew: morfologia z rozmazem, immunoglobuliny, subpopulacje limfocytów.' }
  ];

  const CONF = {
    src: { n: 'Klucz z pliku', short: 'z pliku', c: 'var(--green)', l: 'var(--green-l)', d: 'Klucz zaznaczony w pliku lub omówieniu zakładu' },
    inf: { n: 'Klucz wnioskowany', short: 'wnioskowany', c: 'var(--amber)', l: 'var(--amber-l)', d: 'Brak zaznaczenia w pliku, odpowiedź wynika z wykładu i wytycznych' },
    unk: { n: 'Klucz niepewny', short: 'niepewny', c: 'var(--red)', l: 'var(--red-l)', d: 'Warianty puli są sprzeczne lub brak klucza' },
    did: { n: 'Dydaktyczne', short: 'dydaktyczne', c: 'var(--violet)', l: 'var(--violet-l)', d: 'Zadanie dydaktyczne spoza puli' },
    own: { n: 'Autorskie', short: 'autorskie', c: 'var(--blue)', l: 'var(--blue-l)', d: 'Zadanie autorskie wg wytycznych' }
  };

  const BANKS = {
    zaklad: { id: 'zaklad', n: 'Pula zakładowa (V rok)', short: 'Zakładowa', icon: '🏛️', desc: 'Baza pytań z kolokwiów i zaliczeń zakładowych' },
    lek:    { id: 'lek',    n: 'Baza pytań LEK',          short: 'LEK',       icon: '🩺', desc: 'Pytania z Państwowego Egzaminu Lekarskiego' },
    pes:    { id: 'pes',    n: 'Baza pytań PES',          short: 'PES',       icon: '🎓', desc: 'Pytania z Państwowego Egzaminu Specjalizacyjnego' },
    mp:     { id: 'mp',     n: 'Medycyna Praktyczna (5000 pytań)', short: 'MP 5000', icon: '📖', desc: 'Pytania z bazy mp.premium i 5000 pytań z pediatrii' },
    custom: { id: 'custom', n: 'Dodane pytania (Własne)', short: 'Własne',   icon: '✏️', desc: 'Pytania wprowadzone przez użytkownika' }
  };

  const modById = Object.fromEntries(MODS.map(m => [m.id, m]));
  const atById = Object.fromEntries(ATLASES.map(a => [a.id, a]));
  return { GROUPS, MODS, ATLASES, TRAPS, CONF, BANKS, modById, atById };
})();
