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

  /* Wikilinks & Backlinks – powiązania między atlasami i modułami */
  const WIKILINKS = {
    '1': [
      { target: '5', label: 'Pseudoperitonitis diabetica w DKA', type: 'trap', concept: 'Kwasica ketonowa imitująca ostry brzuch chirurgiczny (odwodnienie, ból brzucha bez patologii chirurgicznej).' },
      { target: '2', label: 'Gorączka + ból brzucha (ZUM, płuca)', type: 'diag', concept: 'U małych dzieci ból brzucha często maskuje zapalenie dolnego płata płuca lub niemy ZUM.' },
      { target: '3', label: 'Wgłobienie jelitowe vs ostra biegunka', type: 'diag', concept: 'Napadowy ból kolkowy, bladość, stolce galaretowate i obraz tarczy strzelniczej w USG.' },
      { target: '4', label: 'Zapalenie naczyń IgAV (Schönlein-Henoch)', type: 'trap', concept: 'Ból brzucha i krwawienie z PP mogą wyprzedzać typową plamicę na kończynach o kilka dni.' },
      { target: '10', label: 'Guz w jamie brzusznej (Wilms/Neuroblastoma)', type: 'trap', concept: 'Zakaz głębokiej i powtarzanej palpacji brzucha przy podejrzeniu nefroblastoma (ryzyko pęknięcia torebki).' },
      { target: '12', label: 'Krwawienie z przewodu pokarmowego a skazy', type: 'diag', concept: 'Różnicowanie wrzodu, uchyłka Meckela, polipów i koagulopatii w krwawieniach z PP.' }
    ],
    '2': [
      { target: '1', label: 'Adenitis mesenterica a ostre zapalenie wyrostka', type: 'diag', concept: 'Odczynowe zapalenie węzłów krezkowych w przebiegu wirusowych infekcji dróg oddechowych.' },
      { target: '5', label: 'Sepsa meningokokowa i wstrząs septyczny', type: 'trap', concept: 'Plamica piorunująca, obniżenie nawrotu kapilarnego, natychmiastowy ceftriakson i.v./i.m. i bolus płynowy.' },
      { target: '14', label: 'Nawracające zakażenia układu moczowego', type: 'diag', concept: 'Nietypowe i skąpoobjawowe ZUM u niemowląt; zawsze mocz na posiew PRZED wdrożeniem antybiotyku.' },
      { target: '15', label: 'Zespół HUS po zakażeniu E. coli STEC O157:H7', type: 'trap', concept: 'Bezwzględny zakaz antybiotykoterapii i leków przeciwperystaltycznych przy krwistej biegunce.' },
      { target: '13b', label: 'Szczepienia żywe a niedobory odporności (PNO)', type: 'trap', concept: 'Szczepionki atenuowane (BCG, MMR, ospa, rota) są bezwzględnie przeciwwskazane do czasu wykluczenia SCID.' }
    ],
    '3': [
      { target: '1', label: 'Wgłobienie jelita (maska ostrego nieżytu)', type: 'trap', concept: 'Apatia, wymioty i krew w stolcu brane błędnie za zapalenie żołądkowo-jelitowe.' },
      { target: '8', label: 'Alergie pokarmowe i zespół FPIES', type: 'diag', concept: 'Ciężka nie-IgE-zależna enteropatia z wymiotami, wstrząsem hipowolemicznym i kwasicą.' },
      { target: '7', label: 'Przewlekła biegunka a nieswoiste zapalenia jelit', type: 'diag', concept: 'Kalprotektyna w kale, krew utajona, spadek masy ciała, MR-enterografia.' },
      { target: '15', label: 'Krwista biegunka STEC ⤏ HUS i ostra niewydolność nerek', type: 'trap', concept: 'Konieczność monitorowania diurezy, morfologii (trombocytopenia, schistocyty) i kreatyniny.' }
    ],
    '4': [
      { target: '2', label: 'Popaciorkowcowe Ostre KZN (PSGN)', type: 'diag', concept: 'Infekcja gardła (1-2 tyg.) lub skóry (3-6 tyg.) paciorkowcem grupy A z hipokomplementemią C3.' },
      { target: '12', label: 'Powikłania zakrzepowo-zatorowe w zespole nerczycowym', type: 'trap', concept: 'Utrata antytrombiny III i białka S z moczem sprzyja zakrzepicy żyły nerkowej i zatorowości płucnej.' },
      { target: '15', label: 'Gwałtownie postępujące KZN (RPGN) ⤏ AKI', type: 'diag', concept: 'Obecność półksiężyców w >50% kłębuszków; pilne wdrożenie pulsów metyloprednizolonu.' },
      { target: '1', label: 'Bóle brzucha w zespole nerczycowym', type: 'trap', concept: 'Ryzyko spontanicznego bakteryjnego zapalenia otrzewnej (SBP) wywołanego przez S. pneumoniae.' }
    ],
    '5': [
      { target: '1', label: 'Kwasica ketonowa (DKA) imitująca ostry brzuch', type: 'trap', concept: 'Odwodnienie, oddech Kussmaula, zapach acetonu, hipokaliemia – oznaczenie glikemii i gazometria.' },
      { target: '2', label: 'Wstrząs septyczny i zakażenia inwazyjne', type: 'diag', concept: 'Empiryczna antybiotykoterapia w 1. godzinie („złota godzina”), krystaloidy 10-20 ml/kg w bolusie.' },
      { target: '8', label: 'Anafilaksja z objawami oddechowymi i krążeniowymi', type: 'trap', concept: 'Adrenalina 0.01 mg/kg i.m. w przednio-boczną powierzchnię uda jako jedyny lek ratujący życie.' },
      { target: '9', label: 'Wzmożone ciśnienie śródczaszkowe (ICP) i triada Cushinga', type: 'trap', concept: 'Bradykardia, nadciśnienie tętnicze, nieregularny oddech; bezwzględny zakaz punkcji PMR bez TK.' },
      { target: '11', label: 'Zespół lizy guza (TLS) i zespół żyły głównej górnej', type: 'trap', concept: 'Hiperkaliemia, kwas moczowy, hiperfosfatemia; ucisk dróg oddechowych przed znieczuleniem.' }
    ],
    '6': [
      { target: '1', label: 'Ból w nadbrzuszu i perforacja wrzodu', type: 'diag', concept: 'Objawy otrzewnowe, deska na brzuchu, sierp powietrza pod przeponą w RTG przeglądowym.' },
      { target: '13a', label: 'Przewlekłe krwawienie ⤏ niedokrwistość mikrocytarna', type: 'diag', concept: 'Niedobór żelaza spowodowany utajoną utratą krwi ze śluzówki żołądka lub dwunastnicy.' },
      { target: '3', label: 'Zakażenie H. pylori a dyspepsja czynnościowa', type: 'diag', concept: 'Wskazania do gastroskopii z biopsją i eradykacji wg wytycznych ESPGHAN/NASPGHAN.' }
    ],
    '7': [
      { target: '1', label: 'Ból w prawym dole biodrowym (ChLC vs wyrostek)', type: 'diag', concept: 'Zapalenie końcowego odcinka jelita krętego (ileitis terminalis) imitujące zapalenie wyrostka.' },
      { target: '3', label: 'Biegunka z domieszką krwi i śluzu (WZJG)', type: 'diag', concept: 'Ciągłe zapalenie błony śluzowej od odbytnicy w górę; oznaczanie kalprotektyny w stolcu.' },
      { target: '13a', label: 'Niedokrwistość chorób przewlekłych i z niedoboru żelaza', type: 'diag', concept: 'Zaburzenia wchłaniania w jelicie cienkim oraz przewlekła utrata krwi i hepcydyna.' },
      { target: '8', label: 'Alergie pokarmowe a eozynofilowe zapalenie jelit', type: 'diag', concept: 'Różnicowanie przewlekłych stanów zapalnych śluzówki z enteropatią alergiczną.' }
    ],
    '8': [
      { target: '5', label: 'Wstrząs anafilaktyczny po ekspozycji pokarmowej', type: 'trap', concept: 'Gwałtowny skurcz oskrzeli, obrzęk krtani, hipotensja; adrenalina domięśniowo natychmiast.' },
      { target: '3', label: 'Zespół FPIES u niemowląt', type: 'diag', concept: 'Wymioty i zapaść naczyniowa 1-4h po spożyciu białka mleka lub soi bez udziału IgE.' },
      { target: '1', label: 'Alergia na białka mleka krowiego (APLV) a kolki', type: 'diag', concept: 'Krew w stolcu u niemowlęcia, dieta eliminacyjna matki karmiącej lub preparat eHF.' }
    ],
    '9': [
      { target: '5', label: 'Wklinowanie migdałków i odruch Cushinga', type: 'trap', concept: 'Wzrost ICP w guzach tylnego dołu czaszki; ryzyko wklinowania przy punkcji lędźwiowej.' },
      { target: '1', label: 'Poranne wymioty i nudności bez bólu brzucha', type: 'trap', concept: 'Chlustające poranne wymioty przynoszące ulgę w bólu głowy to osiowy objaw ciasnoty.' },
      { target: '2', label: 'Różnicowanie z ropnym i gruźliczym ZOMR', type: 'diag', concept: 'Objawy oponowe, gorączka, badanie dna oka przed jakimkolwiek nakłuciem kanału kręgowego.' }
    ],
    '10': [
      { target: '1', label: 'Guz w jamie brzusznej u małego dziecka', type: 'trap', concept: 'Podejrzenie nefroblastoma (guz Wilmsa) – nie uciskać brzucha, biopsja przeciwwskazana.' },
      { target: '4', label: 'Guz Wilmsa a nadciśnienie nerkopochodne', type: 'diag', concept: 'Ucisk tętnicy nerkowej, hiperreninemia, krwinkomocz bez cech ostrego zapalenia.' },
      { target: '12', label: 'Neuroblastoma a naciekanie szpiku i skaza', type: 'diag', concept: 'Krwiaki okularowe (racoon eyes), małopłytkowość, katecholaminy i ich metabolity w moczu.' }
    ],
    '11': [
      { target: '5', label: 'Zespół żyły głównej górnej i guz śródpiersia', type: 'trap', concept: 'RTG klatki piersiowej PRZED znieczuleniem ogólnym lub sedacją (ryzyko nagłego zatrzymania krążenia).' },
      { target: '13a', label: 'Niedokrwistość aregeneratywna w ostrych białaczkach', type: 'diag', concept: 'Pancytopenia, blasty w rozmazie krwi, spadek retikulocytów, bolesność kości.' },
      { target: '12', label: 'Skaza małopłytkowa w ostrej białaczce limfoblastycznej', type: 'diag', concept: 'Wybroczyny, krwawienia ze śluzówek, trombocytopenia <20 tys./µl.' },
      { target: '2', label: 'Gorączka neutropeniczna w trakcie chemioterapii', type: 'trap', concept: 'Stan nagłego zagrożenia życia – natychmiastowe podanie antybiotyków o szerokim spektrum i.v.' }
    ],
    '12': [
      { target: '1', label: 'Wgłobienie jelita w plamicy Schönleina-Henocha (IgAV)', type: 'diag', concept: 'Krwiak śródścienny staje się czołem wgłobienia; ból brzucha może wyprzedzać osutkę.' },
      { target: '4', label: 'Nefropatia w przebiegu IgAV (Schönlein-Henoch)', type: 'diag', concept: 'Krwinkomocz, białkomocz, konieczność monitorowania osadu moczu i ciśnienia przez 6 miesięcy.' },
      { target: '2', label: 'Wybroczyny w sepsie meningokokowej vs ITP', type: 'trap', concept: 'Dziecko z ITP czuje się dobrze mimo płytek <10 tys.; dziecko z sepsą jest wstrząsowe i splątane.' },
      { target: '15', label: 'Małopłytkowość ze zużycia w zespole HUS', type: 'trap', concept: 'Mikroangiopatia zakrzepowa nerkowa, brak cech DIC (układ krzepnięcia osoczowego prawidłowy).' }
    ],
    '13a': [
      { target: '6', label: 'Przewlekła utrata krwi w chorobie wrzodowej', type: 'diag', concept: 'Niedokrwistość mikrocytarna z niedoboru żelaza (niska ferrytyna, podwyższone TIBC).' },
      { target: '15', label: 'Niedokrwistość nerkopochodna w PChN', type: 'diag', concept: 'Niedobór endogennej erytropoetyny (EPO), wskazanie do leczenia rekombinowanym EPO.' },
      { target: '12', label: 'Anemia hemolityczna mikroangiopatyczna (MAHA)', type: 'trap', concept: 'Schistocyty (fragmentocyty) w rozmazie, wzrost LDH, spadek haptoglobiny w HUS.' },
      { target: '11', label: 'Pancytopenia w nacieczeniu szpiku kostnego', type: 'diag', concept: 'Wyparcie czerwonokrwinkowej linii przez blasty białaczkowe (ALL/AML).' }
    ],
    '13b': [
      { target: '2', label: 'Przeciwwskazania do szczepionek żywych w PNO', type: 'trap', concept: 'Ryzyko uogólnionego poszczepiennego zakażenia (BCG, polio OPV, rota, odra) przy defekcie limfocytów T.' },
      { target: '14', label: 'Nawracające zakażenia i 10 objawów Jeffrey Modell', type: 'diag', concept: '>=2 ciężkie zapalenia płuc w roku, >=4 zapalenia ucha, ropnie narządowe wskazują na PNO.' },
      { target: '11', label: 'Zwiększone ryzyko chłoniaków w defektach naprawy DNA', type: 'diag', concept: 'Zespoły łamliwości chromosomów (ataksja-teleangiektazja, Nijmegen) predysponują do chłoniaków.' }
    ],
    '14': [
      { target: '1', label: 'Ból brzucha i wymioty jako maska ZUM u małych dzieci', type: 'diag', concept: 'Niemowlęta nie zgłaszają dysurii; gorączka bez przyczyny wymaga wykluczenia ZUM.' },
      { target: '2', label: 'Gorączka o nieznanej przyczynie (FWS)', type: 'diag', concept: 'ZUM jest najczęstszym zakażeniem bakteryjnym u gorączkujących niemowląt bez objawów kataralnych.' },
      { target: '15', label: 'Refluks pęcherzowo-moczowodowy (VUR) a bliznowacenie nerek', type: 'diag', concept: 'Odpływ wsteczny zakażonego moczu prowadzi do nefropatii refluksowej i PChN.' }
    ],
    '15': [
      { target: '2', label: 'Zespół HUS po zakażeniu jelitowym STEC', type: 'trap', concept: 'Najczęstsza przyczyna nabytej ostrej niewydolności nerek u dzieci do 5. r.ż.; zakaz antybiotyków.' },
      { target: '4', label: 'Kłębuszkowe zapalenia nerek prowadzące do schyłkowej PChN', type: 'diag', concept: 'Postępująca utrata nefronów, wskazania do leczenia nerkozastępczego i przeszczepu nerki.' },
      { target: '5', label: 'Przednerkowe AKI we wstrząsie i odwodnieniu', type: 'diag', concept: 'Szybkie wyrównanie wolemii chroni przed nieodwracalną ostrą martwicą cewek (ATN).' },
      { target: '13a', label: 'Niedokrwistość i osteodystrofia nerkowa w PChN', type: 'diag', concept: 'Zaburzenia gospodarki Ca-P, retencja fosforanów, niedobór aktywnej witaminy D3 i EPO.' }
    ],
    '0': [
      { target: '5', label: 'Stany nagłe w kardiologii dziecięcej', type: 'diag', concept: 'Napady anoksemiczne w Fallota, wady przewodozależne, wlew prostaglandyny E1.' },
      { target: '2', label: 'Choroba Kawasakiego i zespół PIMS-TS', type: 'trap', concept: 'Gorączka >5 dni, zapalenie spojówek, malinowy język; powikłania wieńcowe, leczenie IVIG + ASA.' },
      { target: '13a', label: 'Fizjologiczna niedokrwistość niemowląt', type: 'diag', concept: 'Spadek stężenia hemoglobiny w 8-12 tygodniu życia w wyniku fizjologicznego spadku EPO.' }
    ]
  };

  /* 8 Kluczowych luk semantycznych (mosty myślowe / pułapki PES i kolokwiów) */
  const SEMANTIC_GAPS = [
    {
      id: 'gap-1',
      from: '1',
      to: '5',
      fromName: 'Ból brzucha [1]',
      toName: 'Stany nagłe / DKA [5]',
      title: 'Pseudoperitonitis diabetica w DKA',
      clinicalReason: 'Ciężka kwasica ketonowa (pH < 7.1, HCO3 < 10) wraz z odwodnieniem i drażnieniem splotu trzewnego przez ciała ketonowe wywołuje silny ból brzucha z obroną mięśniową i objawami otrzewnowymi (pseudoperitonitis), mimo całkowicie zdrowego wyrostka robaczkowego.',
      examTrap: 'Zlecenie pilnej operacji chirurgicznej (laparotomii) u dziecka z nierozpoznaną cukrzycą typu 1. Znieczulenie ogólne w głębokiej kwasicy ketonowej grozi natychmiastową zapaścią naczyniową! ZAWSZE zbadaj glikemię i gazometrię przy ostrym brzuchu z oddechem Kussmaula.',
      mods: ['1', '5']
    },
    {
      id: 'gap-2',
      from: '2',
      to: '15',
      fromName: 'Zakażenia [2]',
      toName: 'Niewydolność nerek AKI [15]',
      title: 'Zespół HUS po zakażeniu E. coli STEC O157:H7',
      clinicalReason: 'Toksyna Shiga (Stx) produkowana w jelicie łączy się z receptorami Gb3 komórek śródbłonka naczyń włosowatych kłębuszków nerkowych, indukując mikrozakrzepy, mechaniczną hemolizę erytrocytów (schistocyty) oraz ostrą niewydolność nerek.',
      examTrap: 'Podanie antybiotyku lub leku przeciwbiegunkowego (np. loperamidu) dziecku z krwistą biegunką! Rozpad bakterii gwałtownie uwalnia toksynę do krążenia, drastycznie podnosząc ryzyko pełnoobjawowego HUS i konieczności dializoterapii.',
      mods: ['2', '15', '3']
    },
    {
      id: 'gap-3',
      from: '4',
      to: '12',
      fromName: 'Zespół nerczycowy [4]',
      toName: 'Skazy / Zakrzepica [12]',
      title: 'Zakrzepica i zatorowość w zespole nerczycowym',
      clinicalReason: 'Masywny neselektywny białkomocz prowadzi do utraty antytrombiny III (AT-III), białka S i plazminogenu przez uszkodzony filtr kłębuszkowy. Wątroba kompensacyjnie zwiększa syntezę fibrynogenu, co przy hipowolemii wywołuje skrajny stan prozakrzepowy.',
      examTrap: 'Skupienie się wyłącznie na obrzękach i hipoalbuminemii z pominięciem powikłań naczyniowych. Zakrzepica żyły nerkowej (nagły ból w lędźwiach, krwiomocz, powiększenie nerki) oraz zatorowość płucna to główne zagrażające życiu powikłania zespołu nerczycowego.',
      mods: ['4', '12']
    },
    {
      id: 'gap-4',
      from: '13b',
      to: '2',
      fromName: 'Zaburzenia odporności [13b]',
      toName: 'Szczepienia u dzieci [2]',
      title: 'Bezwzględne przeciwwskazania do szczepionek żywych',
      clinicalReason: 'Atenuowane patogeny szczepionkowe (BCG, rotawirusy, MMR, VZV) u pacjenta z defektem odporności komórkowej (SCID, defekty limfocytów T) namnażają się bez przeszkód, prowadząc do uogólnionego zakażenia (np. poszczepiennego zgonu z powodu BCG-itis).',
      examTrap: 'Zaszczepienie noworodka szczepionką BCG w 1. dobie życia przy dodatnim wywiadzie rodzinnym wczesnych zgonów w niemowlęctwie lub ciężkich infekcji. Szczepienia żywe są bezwzględnie wstrzymane do czasu pełnej diagnostyki immunologicznej (TREC, subpopulacje limfocytów).',
      mods: ['13b', '2']
    },
    {
      id: 'gap-5',
      from: '10',
      to: '4',
      fromName: 'Nowotwory lite / Wilms [10]',
      toName: 'Nefrologia i Nadciśnienie [4][15]',
      title: 'Guz Wilmsa vs Neuroblastoma (nadciśnienie i linia środkowa)',
      clinicalReason: 'Nefroblastoma rozwija się śródnerkowo i uciska naczynia nerkowe, powodując hiperreninemię i wtórne nadciśnienie tętnicze. Guz rośnie gładko i typowo nie przekracza linii pośrodkowej ciała. Neuroblastoma wywodzi się ze zwojów współczulnych, przekracza linię środkową i wydziela katecholaminy.',
      examTrap: 'Głęboka, powtarzana palpacja brzucha u dziecka z podejrzeniem guza Wilmsa. Ucisk grozi natychmiastowym pęknięciem torebki guza i rozsiewem komórek nowotworowych po otrzewnej, co podnosi stopień zaawansowania do III.',
      mods: ['10', '4', '15']
    },
    {
      id: 'gap-6',
      from: '9',
      to: '5',
      fromName: 'Guzy mózgu [9]',
      toName: 'Stany nagłe / Wzmożone ICP [5]',
      title: 'Triada Cushinga i ryzyko wklinowania migdałków',
      clinicalReason: 'Guz tylnego dołu czaszki zaburza krążenie PMR w komorze czwartej, prowadząc do ostrego wodogłowia. Odruch Cushinga (nadciśnienie tętnicze + bradykardia + nieregularny oddech) to przedagonalny objaw krytycznego wzrostu ciśnienia śródczaszkowego.',
      examTrap: 'Wykonanie punkcji lędźwiowej (LP) u dziecka z porannymi wymiotami i bólem głowy bez wcześniejszego badania dna oka i TK/MR. Gwałtowny spadek ciśnienia płynu w kanale kręgowym prowadzi do natychmiastowego wklinowania migdałków móżdżku w otwór wielki i zgonu.',
      mods: ['9', '5']
    },
    {
      id: 'gap-7',
      from: '3',
      to: '8',
      fromName: 'Biegunki [3]',
      toName: 'Alergie pokarmowe / FPIES [8]',
      title: 'Zespół FPIES imitujący wstrząs septyczny i ostry brzuch',
      clinicalReason: 'Food Protein-Induced Enterocolitis Syndrome to ciężka reakcja nie-IgE-zależna wyzwalana białkiem mleka, soi lub zbóż. Po 1-4 godzinach od spożycia pojawiają się gwałtowne chlustające wymioty, obfita biegunka, odwodnienie, kwasica metaboliczna i hipotensja.',
      examTrap: 'Pomylenie rzutu FPIES z sepsą lub wgłobieniem jelitowym i podawanie niepotrzebnych antybiotyków lub leków hamujących perystaltykę. Leczeniem ostrej fazy jest natychmiastowa płynoterapia dożylna krystaloidami oraz ewentualnie deksametazon i.v.',
      mods: ['3', '8', '5']
    },
    {
      id: 'gap-8',
      from: '12',
      to: '1',
      fromName: 'Skazy krwotoczne / IgAV [12]',
      toName: 'Ból brzucha [1]',
      title: 'Wgłobienie jelita w plamicy Schönleina-Henocha',
      clinicalReason: 'Zapalenie drobnych naczyń krwionośnych przewodu pokarmowego prowadzi do obrzęku ściany jelita i krwiaków śródściennych. Taki krwiak stanowi anatomiczny punkt wyjścia (lead point) dla wgłobienia jelitowego (często cienko-cienkiego).',
      examTrap: 'Ból brzucha i krwawienie z odbytu mogą wyprzedzać charakterystyczną plamicę uniesioną na pośladkach i kończynach o 3-7 dni! Co kluczowe na egzaminie: w IgAV liczba płytek krwi jest PRAWIDŁOWA (to zapalenie naczyń, a nie trombocytopenia).',
      mods: ['12', '1', '4']
    }
  ];

  const modById = Object.fromEntries(MODS.map(m => [m.id, m]));
  const atById = Object.fromEntries(ATLASES.map(a => [a.id, a]));
  return { GROUPS, MODS, ATLASES, TRAPS, CONF, BANKS, WIKILINKS, SEMANTIC_GAPS, modById, atById };
})();
