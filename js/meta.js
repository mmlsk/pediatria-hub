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

  /* Pułapki międzymodułowe: 16 pułapek z podziałem na testowe i przyłóżkowe */
  const TRAPS = [
    { id: 't1',  category: 'bedside', t: 'HUS po biegunce STEC', mods: ['1', '3', '12', '15'], eq: 'Ból brzucha + krwista biegunka + małopłytkowość + AKI', out: 'Zespół hemolityczno-mocznicowy', tip: 'Nie podawać antybiotyków ani leków przeciwperystaltycznych przy krwistej biegunce z podejrzeniem STEC.' },
    { id: 't2',  category: 'test',    t: 'IgAV (Schönlein-Henoch)', mods: ['1', '12', '4'], eq: 'Ból brzucha + plamica na pośladkach i kończynach + krwinkomocz', out: 'Zapalenie naczyń związane z IgA', tip: 'Plamica nie wynika z małopłytkowości – morfologia i krzepnięcie są całkowicie prawidłowe!' },
    { id: 't3',  category: 'bedside', t: 'Gorączka i brzuch (ZUM / płuca)', mods: ['1', '2', '14'], eq: 'Ból brzucha + gorączka bez objawów dyzurycznych', out: 'Wyklucz ZUM lub zapalenie dolnego płata płuca', tip: 'U niemowląt i małych dzieci ZUM bywa niemy: mocz pobrany prawidłowo, zanim padnie antybiotyk.' },
    { id: 't4',  category: 'test',    t: 'Zaparcie a ZUM', mods: ['14', '1'], eq: 'Zaparcie lub dysfunkcja mikcji + nawracające ZUM', out: 'Leczyć czynnik ryzyka, nie tylko zakażenie', tip: 'Zaparcie i dysfunkcja pęcherza to częste, odwracalne przyczyny nawrotów ZUM.' },
    { id: 't5',  category: 'bedside', t: 'Guz brzucha (Nefroblastoma)', mods: ['10', '1'], eq: 'Guz w jamie brzusznej u małego dziecka', out: 'Podejrzenie guza Wilmsa: nie uciskać guza!', tip: 'Ucisk guza i biopsja grożą pęknięciem torebki i podniesieniem stopnia, rozpoznanie opiera się na USG/TK/MR.' },
    { id: 't6',  category: 'bedside', t: 'Guz śródpiersia przed sedacją', mods: ['11', '5'], eq: 'Węzły, zespół żyły głównej górnej, duszność w pozycji leżącej', out: 'RTG klatki piersiowej przed sedacją', tip: 'Guz śródpiersia i ucisk dróg oddechowych grożą nagłym zatrzymaniem krążenia w znieczuleniu.' },
    { id: 't7',  category: 'bedside', t: 'Wzrost ICP i triada Cushinga', mods: ['9', '5'], eq: 'Poranne bóle głowy + chlustające wymioty + bradykardia', out: 'Guz tylnego dołu, wzrost ICP: dno oka i MR', tip: 'Bezwzględny zakaz punkcji lędźwiowej przed wykluczeniem ciasnoty wewnątrzczaszkowej!' },
    { id: 't8',  category: 'test',    t: 'Zakrzepica w zespole nerczycowym', mods: ['4', '2', '12'], eq: 'Obrzęki + masywny białkomocz + hipoalbuminemia', out: 'Ryzyko zakażeń i zakrzepicy naczyniowej', tip: 'Utrata antytrombiny III i białka S sprzyja zakrzepicy żyły nerkowej i zatorowości płucnej.' },
    { id: 't9',  category: 'bedside', t: 'Ostra anafilaksja', mods: ['5', '8'], eq: 'Reakcja alergiczna pokarmowa z objawami oddechowymi/krążeniowymi', out: 'Adrenalina i.m. w pierwszej kolejności', tip: 'Adrenalina 0.01 mg/kg w przednio-boczną powierzchnię uda jako jedyny lek ratujący życie.' },
    { id: 't10', category: 'bedside', t: 'Szczepienia żywe a PNO', mods: ['13b', '2'], eq: 'Podejrzenie pierwotnego niedoboru odporności (SCID)', out: 'Szczepienia żywe bezwzględnie przeciwwskazane', tip: 'Atenuowane patogeny (BCG, MMR, rota, ospa) grożą uogólnionym poszczepiennym zakażeniem.' },
    { id: 't11', category: 'bedside', t: 'Pseudoperitonitis w DKA', mods: ['1', '5'], eq: 'Ostry brzuch + oddech Kussmaula + odwodnienie', out: 'Kwasica ketonowa w cukrzycy typu 1', tip: 'Zawsze glikemia z glukometru i gazometria przed wezwaniem chirurga do ostrego brzucha!' },
    { id: 't12', category: 'bedside', t: 'Szpatułka w zapaleniu nagłośni', mods: ['5', '2'], eq: 'Stridor wdechowy + ślinotok + pozycja wąchająca', out: 'Bezwzględny zakaz szpatułki w gardle!', tip: 'Dotknięcie nagłośni szpatułką wywołuje odruchowy skurcz krtani i natychmiastowe uduszenie.' },
    { id: 't13', category: 'test',    t: 'Płytki krwi w IgAV (PLT)', mods: ['12', '4'], eq: 'Plamica uniesiona + ból stawów + krwinkomocz', out: 'Liczba płytek krwi (PLT) jest prawidłowa!', tip: 'W zapaleniu naczyń IgA nie ma małopłytkowości. Nie podawać koncentratu płytek.' },
    { id: 't14', category: 'bedside', t: 'Transfuzja płytek w HUS', mods: ['15', '12'], eq: 'Trombocytopenia + schistocyty + ostre uszkodzenie nerek', out: 'Zakaz rutynowego przetaczania płytek (KKP)', tip: 'Przetaczanie płytek krwi w HUS nasila mikrozakrzepy w kłębuszkach nerkowych i pogłębia AKI.' },
    { id: 't15', category: 'test',    t: 'Celiakia przy niedoborze IgA', mods: ['8', '13b'], eq: 'Podejrzenie celiakii + wynik ujemny anty-tTG IgA', out: 'Zbadaj całkowite IgA lub przeciwciała anty-DGP IgG', tip: 'Wrodzony niedobór IgA daje fałszywie ujemny wynik przeciwciał w klasie IgA.' },
    { id: 't16', category: 'test',    t: 'Wymioty w zwężeniu odźwiernika (HPS)', mods: ['1', '3'], eq: 'Niemowlę 3-6 tyg. + chlustające wymioty bez żółci', out: 'Zasadowica hipochloremiczna i hipokaliemiczna', tip: 'Wymioty treścią żołądkową bez żółci wywołują zasadowicę metaboliczną, a nie kwasicę.' }
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

  /* Wikilinks & Backlinks – powiązania między atlasami i modułami z głębokimi kotwicami */
  const WIKILINKS = {
    '1': [
      { target: '5', atlas: 'nagle', sec: 'dka', label: 'Pseudoperitonitis diabetica w DKA', type: 'trap', concept: 'Kwasica ketonowa imitująca ostry brzuch chirurgiczny (odwodnienie, ból brzucha bez patologii chirurgicznej).' },
      { target: '2', atlas: 'zakazenia', sec: 'badanie', label: 'Gorączka + ból brzucha (ZUM, płuca)', type: 'diag', concept: 'U małych dzieci ból brzucha często maskuje zapalenie dolnego płata płuca lub niemy ZUM.' },
      { target: '3', atlas: 'gastro', sec: 'biegunki', label: 'Wgłobienie jelitowe vs ostra biegunka', type: 'diag', concept: 'Napadowy ból kolkowy, bladość, stolce galaretowate i obraz tarczy strzelniczej w USG.' },
      { target: '4', atlas: 'nefro', sec: 'kzn', label: 'Zapalenie naczyń IgAV (Schönlein-Henoch)', type: 'trap', concept: 'Ból brzucha i krwawienie z PP mogą wyprzedzać typową plamicę na kończynach o kilka dni.' },
      { target: '10', atlas: 'nowotwory', sec: 'guzy', label: 'Guz w jamie brzusznej (Wilms/Neuroblastoma)', type: 'trap', concept: 'Zakaz głębokiej i powtarzanej palpacji brzucha przy podejrzeniu nefroblastoma (ryzyko pęknięcia torebki).' },
      { target: '12', atlas: 'skazy', sec: 's12', label: 'Krwawienie z przewodu pokarmowego a skazy', type: 'diag', concept: 'Różnicowanie wrzodu, uchyłka Meckela, polipów i koagulopatii w krwawieniach z PP.' }
    ],
    '2': [
      { target: '1', atlas: 'brzuch', sec: 'algorytm', label: 'Adenitis mesenterica a ostre zapalenie wyrostka', type: 'diag', concept: 'Odczynowe zapalenie węzłów krezkowych w przebiegu wirusowych infekcji dróg oddechowych.' },
      { target: '5', atlas: 'nagle', sec: 'sepsa', label: 'Sepsa meningokokowa i wstrząs septyczny', type: 'trap', concept: 'Plamica piorunująca, obniżenie nawrotu kapilarnego, natychmiastowy ceftriakson i.v./i.m. i bolus płynowy.' },
      { target: '14', atlas: 'nefro', sec: 'zum', label: 'Nawracające zakażenia układu moczowego', type: 'diag', concept: 'Nietypowe i skąpoobjawowe ZUM u niemowląt; zawsze mocz na posiew PRZED wdrożeniem antybiotyku.' },
      { target: '15', atlas: 'nefro', sec: 'aki', label: 'Zespół HUS po zakażeniu E. coli STEC O157:H7', type: 'trap', concept: 'Bezwzględny zakaz antybiotykoterapii i leków przeciwperystaltycznych przy krwistej biegunce.' },
      { target: '13b', atlas: 'skazy', sec: 's13b', label: 'Szczepienia żywe a niedobory odporności (PNO)', type: 'trap', concept: 'Szczepionki atenuowane (BCG, MMR, ospa, rota) są bezwzględnie przeciwwskazane do czasu wykluczenia SCID.' }
    ],
    '3': [
      { target: '1', atlas: 'brzuch', sec: 'choroby', label: 'Wgłobienie jelita (maska ostrego nieżytu)', type: 'trap', concept: 'Apatia, wymioty i krew w stolcu brane błędnie za zapalenie żołądkowo-jelitowe.' },
      { target: '8', atlas: 'gastro', sec: 'alergie', label: 'Alergie pokarmowe i zespół FPIES', type: 'diag', concept: 'Ciężka nie-IgE-zależna enteropatia z wymiotami, wstrząsem hipowolemicznym i kwasicą.' },
      { target: '7', atlas: 'gastro', sec: 'ibd', label: 'Przewlekła biegunka a nieswoiste zapalenia jelit', type: 'diag', concept: 'Kalprotektyna w kale, krew utajona, spadek masy ciała, MR-enterografia.' },
      { target: '15', atlas: 'nefro', sec: 'aki', label: 'Krwista biegunka STEC ⤏ HUS i ostra niewydolność nerek', type: 'trap', concept: 'Konieczność monitorowania diurezy, morfologii (trombocytopenia, schistocyty) i kreatyniny.' }
    ],
    '4': [
      { target: '2', atlas: 'zakazenia', sec: 'badanie', label: 'Popaciorkowcowe Ostre KZN (PSGN)', type: 'diag', concept: 'Infekcja gardła (1-2 tyg.) lub skóry (3-6 tyg.) paciorkowcem grupy A z hipokomplementemią C3.' },
      { target: '12', atlas: 'skazy', sec: 's12', label: 'Powikłania zakrzepowo-zatorowe w zespole nerczycowym', type: 'trap', concept: 'Utrata antytrombiny III i białka S z moczem sprzyja zakrzepicy żyły nerkowej i zatorowości płucnej.' },
      { target: '15', atlas: 'nefro', sec: 'aki', label: 'Gwałtownie postępujące KZN (RPGN) ⤏ AKI', type: 'diag', concept: 'Obecność półksiężyców w >50% kłębuszków; pilne wdrożenie pulsów metyloprednizolonu.' },
      { target: '1', atlas: 'brzuch', sec: 'algorytm', label: 'Bóle brzucha w zespole nerczycowym', type: 'trap', concept: 'Ryzyko spontanicznego bakteryjnego zapalenia otrzewnej (SBP) wywołanego przez S. pneumoniae.' }
    ],
    '5': [
      { target: '1', atlas: 'brzuch', sec: 'algorytm', label: 'Kwasica ketonowa (DKA) imitująca ostry brzuch', type: 'trap', concept: 'Odwodnienie, oddech Kussmaula, zapach acetonu, hipokaliemia – oznaczenie glikemii i gazometria.' },
      { target: '2', atlas: 'zakazenia', sec: 'objawy', label: 'Wstrząs septyczny i zakażenia inwazyjne', type: 'diag', concept: 'Empiryczna antybiotykoterapia w 1. godzinie („złota godzina”), krystaloidy 10-20 ml/kg w bolusie.' },
      { target: '8', atlas: 'gastro', sec: 'alergie', label: 'Anafilaksja z objawami oddechowymi i krążeniowymi', type: 'trap', concept: 'Adrenalina 0.01 mg/kg i.m. w przednio-boczną powierzchnię uda jako jedyny lek ratujący życie.' },
      { target: '9', atlas: 'guzy', sec: 'objawy', label: 'Wzmożone ciśnienie śródczaszkowe (ICP) i triada Cushinga', type: 'trap', concept: 'Bradykardia, nadciśnienie tętnicze, nieregularny oddech; bezwzględny zakaz punkcji PMR bez TK.' },
      { target: '11', atlas: 'hemato', sec: 'chloniaki', label: 'Zespół lizy guza (TLS) i zespół żyły głównej górnej', type: 'trap', concept: 'Hiperkaliemia, kwas moczowy, hiperfosfatemia; ucisk dróg oddechowych przed znieczuleniem.' }
    ],
    '6': [
      { target: '1', atlas: 'brzuch', sec: 'algorytm', label: 'Ból w nadbrzuszu i perforacja wrzodu', type: 'diag', concept: 'Objawy otrzewnowe, deska na brzuchu, sierp powietrza pod przeponą w RTG przeglądowym.' },
      { target: '13a', atlas: 'skazy', sec: 's13a', label: 'Przewlekłe krwawienie ⤏ niedokrwistość mikrocytarna', type: 'diag', concept: 'Niedobór żelaza spowodowany utajoną utratą krwi ze śluzówki żołądka lub dwunastnicy.' },
      { target: '3', atlas: 'gastro', sec: 'biegunki', label: 'Zakażenie H. pylori a dyspepsja czynnościowa', type: 'diag', concept: 'Wskazania do gastroskopii z biopsją i eradykacji wg wytycznych ESPGHAN/NASPGHAN.' }
    ],
    '7': [
      { target: '1', atlas: 'brzuch', sec: 'algorytm', label: 'Ból w prawym dole biodrowym (ChLC vs wyrostek)', type: 'diag', concept: 'Zapalenie końcowego odcinka jelita krętego (ileitis terminalis) imitujące zapalenie wyrostka.' },
      { target: '3', atlas: 'gastro', sec: 'ibd', label: 'Biegunka z domieszką krwi i śluzu (WZJG)', type: 'diag', concept: 'Ciągłe zapalenie błony śluzowej od odbytnicy w górę; oznaczanie kalprotektyny w stolcu.' },
      { target: '13a', atlas: 'skazy', sec: 's13a', label: 'Niedokrwistość chorób przewlekłych i z niedoboru żelaza', type: 'diag', concept: 'Zaburzenia wchłaniania w jelicie cienkim oraz przewlekła utrata krwi i hepcydyna.' },
      { target: '8', atlas: 'gastro', sec: 'alergie', label: 'Alergie pokarmowe a eozynofilowe zapalenie jelit', type: 'diag', concept: 'Różnicowanie przewlekłych stanów zapalnych śluzówki z enteropatią alergiczną.' }
    ],
    '8': [
      { target: '5', atlas: 'nagle', sec: 'nagle', label: 'Wstrząs anafilaktyczny po ekspozycji pokarmowej', type: 'trap', concept: 'Gwałtowny skurcz oskrzeli, obrzęk krtani, hipotensja; adrenalina domięśniowo natychmiast.' },
      { target: '3', atlas: 'gastro', sec: 'alergie', label: 'Zespół FPIES u niemowląt', type: 'diag', concept: 'Wymioty i zapaść naczyniowa 1-4h po spożyciu białka mleka lub soi bez udziału IgE.' },
      { target: '1', atlas: 'brzuch', sec: 'choroby', label: 'Alergia na białka mleka krowiego (APLV) a kolki', type: 'diag', concept: 'Krew w stolcu u niemowlęcia, dieta eliminacyjna matki karmiącej lub preparat eHF.' }
    ],
    '9': [
      { target: '5', atlas: 'nagle', sec: 'drgawki', label: 'Wklinowanie migdałków i odruch Cushinga', type: 'trap', concept: 'Wzrost ICP w guzach tylnego dołu czaszki; ryzyko wklinowania przy punkcji lędźwiowej.' },
      { target: '1', atlas: 'brzuch', sec: 'algorytm', label: 'Poranne wymioty i nudności bez bólu brzucha', type: 'trap', concept: 'Chlustające poranne wymioty przynoszące ulgę w bólu głowy to osiowy objaw ciasnoty.' },
      { target: '2', atlas: 'zakazenia', sec: 'zomr', label: 'Różnicowanie z ropnym i gruźliczym ZOMR', type: 'diag', concept: 'Objawy oponowe, gorączka, badanie dna oka przed jakimkolwiek nakłuciem kanału kręgowego.' }
    ],
    '10': [
      { target: '1', atlas: 'brzuch', sec: 'choroby', label: 'Guz w jamie brzusznej u małego dziecka', type: 'trap', concept: 'Podejrzenie nefroblastoma (guz Wilmsa) – nie uciskać brzucha, biopsja przeciwwskazana.' },
      { target: '4', atlas: 'nefro', sec: 'kzn', label: 'Guz Wilmsa a nadciśnienie nerkopochodne', type: 'diag', concept: 'Ucisk tętnicy nerkowej, hiperreninemia, krwinkomocz bez cech ostrego zapalenia.' },
      { target: '12', atlas: 'skazy', sec: 's12', label: 'Neuroblastoma a naciekanie szpiku i skaza', type: 'diag', concept: 'Krwiaki okularowe (racoon eyes), małopłytkowość, katecholaminy i ich metabolity w moczu.' }
    ],
    '11': [
      { target: '5', atlas: 'nagle', sec: 'nagle', label: 'Zespół żyły głównej górnej i guz śródpiersia', type: 'trap', concept: 'RTG klatki piersiowej PRZED znieczuleniem ogólnym lub sedacją (ryzyko nagłego zatrzymania krążenia).' },
      { target: '13a', atlas: 'skazy', sec: 's13a', label: 'Niedokrwistość aregeneratywna w ostrych białaczkach', type: 'diag', concept: 'Pancytopenia, blasty w rozmazie krwi, spadek retikulocytów, bolesność kości.' },
      { target: '12', atlas: 'skazy', sec: 's12', label: 'Skaza małopłytkowa w ostrej białaczce limfoblastycznej', type: 'diag', concept: 'Wybroczyny, krwawienia ze śluzówek, trombocytopenia <20 tys./µl.' },
      { target: '2', atlas: 'zakazenia', sec: 'objawy', label: 'Gorączka neutropeniczna w trakcie chemioterapii', type: 'trap', concept: 'Stan nagłego zagrożenia życia – natychmiastowe podanie antybiotyków o szerokim spektrum i.v.' }
    ],
    '12': [
      { target: '1', atlas: 'brzuch', sec: 'choroby', label: 'Wgłobienie jelita w plamicy Schönleina-Henocha (IgAV)', type: 'diag', concept: 'Krwiak śródścienny staje się czołem wgłobienia; ból brzucha może wyprzedzać osutkę.' },
      { target: '4', atlas: 'nefro', sec: 'kzn', label: 'Nefropatia w przebiegu IgAV (Schönlein-Henoch)', type: 'diag', concept: 'Krwinkomocz, białkomocz, konieczność monitorowania osadu moczu i ciśnienia przez 6 miesięcy.' },
      { target: '2', atlas: 'zakazenia', sec: 'objawy', label: 'Wybroczyny w sepsie meningokokowej vs ITP', type: 'trap', concept: 'Dziecko z ITP czuje się dobrze mimo płytek <10 tys.; dziecko z sepsą jest wstrząsowe i splątane.' },
      { target: '15', atlas: 'nefro', sec: 'aki', label: 'Małopłytkowość ze zużycia w zespole HUS', type: 'trap', concept: 'Mikroangiopatia zakrzepowa nerkowa, brak cech DIC (układ krzepnięcia osoczowego prawidłowy).' }
    ],
    '13a': [
      { target: '6', atlas: 'gastro', sec: 'biegunki', label: 'Przewlekła utrata krwi w chorobie wrzodowej', type: 'diag', concept: 'Niedokrwistość mikrocytarna z niedoboru żelaza (niska ferrytyna, podwyższone TIBC).' },
      { target: '15', atlas: 'nefro', sec: 'aki', label: 'Niedokrwistość nerkopochodna w PChN', type: 'diag', concept: 'Niedobór endogennej erytropoetyny (EPO), wskazanie do leczenia rekombinowanym EPO.' },
      { target: '12', atlas: 'skazy', sec: 's12', label: 'Anemia hemolityczna mikroangiopatyczna (MAHA)', type: 'trap', concept: 'Schistocyty (fragmentocyty) w rozmazie, wzrost LDH, spadek haptoglobiny w HUS.' },
      { target: '11', atlas: 'hemato', sec: 'objawy', label: 'Pancytopenia w nacieczeniu szpiku kostnego', type: 'diag', concept: 'Wyparcie czerwonokrwinkowej linii przez blasty białaczkowe (ALL/AML).' }
    ],
    '13b': [
      { target: '2', atlas: 'zakazenia', sec: 'badanie', label: 'Przeciwwskazania do szczepionek żywych w PNO', type: 'trap', concept: 'Ryzyko uogólnionego poszczepiennego zakażenia (BCG, polio OPV, rota, odra) przy defekcie limfocytów T.' },
      { target: '14', atlas: 'nefro', sec: 'zum', label: 'Nawracające zakażenia i 10 objawów Jeffrey Modell', type: 'diag', concept: '>=2 ciężkie zapalenia płuc w roku, >=4 zapalenia ucha, ropnie narządowe wskazują na PNO.' },
      { target: '11', atlas: 'hemato', sec: 'chloniaki', label: 'Zwiększone ryzyko chłoniaków w defektach naprawy DNA', type: 'diag', concept: 'Zespoły łamliwości chromosomów (ataksja-teleangiektazja, Nijmegen) predysponują do chłoniaków.' }
    ],
    '14': [
      { target: '1', atlas: 'brzuch', sec: 'algorytm', label: 'Ból brzucha i wymioty jako maska ZUM u małych dzieci', type: 'diag', concept: 'Niemowlęta nie zgłaszają dysurii; gorączka bez przyczyny wymaga wykluczenia ZUM.' },
      { target: '2', atlas: 'zakazenia', sec: 'badanie', label: 'Gorączka o nieznanej przyczynie (FWS)', type: 'diag', concept: 'ZUM jest najczęstszym zakażeniem bakteryjnym u gorączkujących niemowląt bez objawów kataralnych.' },
      { target: '15', atlas: 'nefro', sec: 'aki', label: 'Refluks pęcherzowo-moczowodowy (VUR) a bliznowacenie nerek', type: 'diag', concept: 'Odpływ wsteczny zakażonego moczu prowadzi do nefropatii refluksowej i PChN.' }
    ],
    '15': [
      { target: '2', atlas: 'zakazenia', sec: 'objawy', label: 'Zespół HUS po zakażeniu jelitowym STEC', type: 'trap', concept: 'Najczęstsza przyczyna nabytej ostrej niewydolności nerek u dzieci do 5. r.ż.; zakaz antybiotyków.' },
      { target: '4', atlas: 'nefro', sec: 'kzn', label: 'Kłębuszkowe zapalenia nerek prowadzące do schyłkowej PChN', type: 'diag', concept: 'Postępująca utrata nefronów, wskazania do leczenia nerkozastępczego i przeszczepu nerki.' },
      { target: '5', atlas: 'nagle', sec: 'nagle', label: 'Przednerkowe AKI we wstrząsie i odwodnieniu', type: 'diag', concept: 'Szybkie wyrównanie wolemii chroni przed nieodwracalną ostrą martwicą cewek (ATN).' },
      { target: '13a', atlas: 'skazy', sec: 's13a', label: 'Niedokrwistość i osteodystrofia nerkowa w PChN', type: 'diag', concept: 'Zaburzenia gospodarki Ca-P, retencja fosforanów, niedobór aktywnej witaminy D3 i EPO.' }
    ],
    '0': [
      { target: '5', atlas: 'nagle', sec: 'nagle', label: 'Stany nagłe w kardiologii dziecięcej', type: 'diag', concept: 'Napady anoksemiczne w Fallota, wady przewodozależne, wlew prostaglandyny E1.' },
      { target: '2', atlas: 'zakazenia', sec: 'objawy', label: 'Choroba Kawasakiego i zespół PIMS-TS', type: 'trap', concept: 'Gorączka >5 dni, zapalenie spojówek, malinowy język; powikłania wieńcowe, leczenie IVIG + ASA.' },
      { target: '13a', atlas: 'skazy', sec: 's13a', label: 'Fizjologiczna niedokrwistość niemowląt', type: 'diag', concept: 'Spadek stężenia hemoglobiny w 8-12 tygodniu życia w wyniku fizjologicznego spadku EPO.' }
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

  /* 8 Kluczowych zespołów objawowych (Symptom Explorer) – mosty różnicowania */
  const SYMPTOM_CLUSTERS = [
    {
      id: 's1',
      name: 'Ból brzucha + wymioty',
      icon: '🤢',
      tag: 'Ostre stany brzuszne i metaboliczne',
      mods: ['1', '5', '3', '9'],
      redFlags: [
        'Obrona mięśniowa i objawy otrzewnowe (Blumberg) ➔ perforacja / zapalenie wyrostka [1]',
        'Oddech Kussmaula, zapach acetonu, odwodnienie ➔ kwasica ketonowa DKA [5]',
        'Napadowy płacz, podkurczanie nóżek, stolec „galaretka porzeczkowa” ➔ wgłobienie jelitowe [3]',
        'Poranne chlustające wymioty przynoszące ulgę, bradykardia ➔ guz mózgu / ciasnota ICP [9]'
      ],
      keyRule: 'Zanim skierujesz dziecko na stół operacyjny z „ostrym brzuchem”: ZAWSZE sprawdź glikemię (wyklucz DKA!) oraz wykonaj USG jamy brzusznej (wyrostek vs wgłobienie).',
      branches: [
        { mod: '1', name: 'Ostre zapalenie wyrostka robaczkowego', clue: 'Ból rozpoczyna się w nadbrzuszu/śródbrzuszu, migruje do prawego dołu biodrowego, objaw Blumberga i Jaworskiego (+)', atlas: 'brzuch', sec: 'algorytm', linkText: 'Algorytm ostrego brzucha' },
        { mod: '5', name: 'Kwasica ketonowa (Pseudoperitonitis diabetica)', clue: 'Hiperglikemia >200 mg/dl, kwasica metaboliczna pH <7.3, ketonuria, tachypnoe bez cech chirurgicznych w USG', atlas: 'nagle', sec: 'nagle', linkText: 'Protokół DKA w stanach nagłych' },
        { mod: '3', name: 'Wgłobienie jelitowe (Intussusception)', clue: 'Niemowlę 5–10 m.ż., napady kolki z okresami apatii, objaw tarczy strzelniczej / donuta w USG', atlas: 'brzuch', sec: 'choroby', linkText: 'Wgłobienie jelita – diagnostyka i leczenie' },
        { mod: '9', name: 'Guz tylnego dołu czaszki (Wzmożone ICP)', clue: 'Wymioty na czczo rano, ból głowy budzący ze snu, brak gorączki i obrony brzusznej; tarcza zastoinowa', atlas: 'guzy', sec: 'objawy', linkText: 'Triada objawów wzmożonego ICP' }
      ],
      trap: {
        type: 'bedside',
        badge: '🚨 Zagrożenie życia / Błąd w sztuce',
        title: 'Laparotomia u dziecka w stanie kwasicy ketonowej (DKA)',
        desc: 'Znieczulenie ogólne dziecka w ciężkiej kwasicy ketonowej imitującej ostry brzuch grozi natychmiastowym wstrząsem i zatrzymaniem krążenia. Pierwszy krok to glukometr i gazometria, nie chirurg!'
      },
      examTip: 'Pytania LEK/PES: Dziecko z bólem brzucha i wymiotami + tachypnoe bez gorączki = najpierw glikemia i gazometria.'
    },
    {
      id: 's2',
      name: 'Gorączka + osutka / wybroczyny',
      icon: '🩸',
      tag: 'Zakażenia piorunujące i skazy naczyniowe',
      mods: ['2', '12', '11', '13b'],
      redFlags: [
        'Szybko narastające wybroczyny i wylewy podskórne + CRT >3s ➔ sepsa meningokokowa / plamica piorunująca [2]',
        'Plamica uniesiona (palpabilis) na pośladkach i wyprostach kończyn dolnych + ból stawów ➔ IgAV (Schönlein-Henoch) [12]',
        'Bladość, powiększenie węzłów i wątroby/śledziony, wybroczyny na tułowiu i śluzówkach ➔ ostra białaczka [11]',
        'Gorączka ≥5 dni, zapalenie spojówek bez wysięku, malinowy język, obrzęk dłoni/stóp ➔ choroba Kawasakiego [13b]'
      ],
      keyRule: 'Test szklankowy (diaskopia): wykwit nieblednący pod uciskiem to wybroczyna! Przy gorączce i wybroczynach – natychmiast ceftriakson i.v./i.m. w 1. godzinie bez czekania na wyniki posiewów.',
      branches: [
        { mod: '2', name: 'Inwazyjna choroba meningokokowa (Sepsa)', clue: 'Plamica piorunująca, obniżony stan świadomości, tachykardia, CRT >3s, konieczność natychmiastowej antybiotykoterapii', atlas: 'zakazenia', sec: 'objawy', linkText: 'Algorytm sepsy i wstrząsu septycznego' },
        { mod: '12', name: 'Zapalenie naczyń związane z IgA (IgAV / HSP)', clue: 'Plamica uniesiona, prawidłowa liczba płytek krwi (PLT norma!), ból brzucha, zapalenie stawów i krwinkomocz', atlas: 'skazy', sec: 's12', linkText: 'Kryteria EULAR/PRINTO dla IgAV' },
        { mod: '11', name: 'Ostra białaczka limfoblastyczna (ALL)', clue: 'Wybroczyny ze skazy płytkowej (PLT <20 tys./µl) + niedokrwistość + limfadenopatia + bóle kostne', atlas: 'hemato', sec: 'objawy', linkText: 'Objawy rozrostowe i skaza w ALL' },
        { mod: '13b', name: 'Choroba Kawasakiego / Zespół PIMS-TS', clue: 'Gorączka >5 dni, wielopostaciowa osutka, malinowy język, zmiany w naczyniach wieńcowych w echo serca', atlas: 'skazy', sec: 's13b', linkText: 'Kryteria diagnostyczne Kawasakiego' }
      ],
      trap: {
        type: 'test',
        badge: '⚠️ Pułapka testowa (Klucz vs Wytyczne)',
        title: 'IgAV to NIE jest skaza małopłytkowa',
        desc: 'W zapaleniu naczyń IgA liczba płytek krwi (PLT) oraz parametry koagulologiczne (APTT, PT, INR) są całkowicie PRAWIDŁOWE. Zlecanie koncentratu płytek lub osocza to kardynalny błąd testowy!'
      },
      examTip: 'Różnicowanie: Sepsa = zły stan ogólny, gorączka, tachykardia; IgAV = stan ogólny zazwyczaj dobry/stabilny, wykwity głównie na pośladkach i wyprostach nóg.'
    },
    {
      id: 's3',
      name: 'Krwiomocz + obrzęki / nadciśnienie',
      icon: '💧',
      tag: 'Nefrologia i onkologia dziecięca',
      mods: ['4', '15', '10', '14'],
      redFlags: [
        'Oliguria/anuria, kreatynina podwyższona, mocz koloru popłuczyn mięsnych ➔ ostre popaciorkowcowe KZN / AKI [4][15]',
        'Triada: niedokrwistość hemolityczna + małopłytkowość + ostra niewydolność nerek ➔ HUS po biegunce krwistej [15]',
        'Jednostronny, gładki opór w jamie brzusznej nieprzekraczający linii środkowej + nadciśnienie ➔ guz Wilmsa [10]',
        'Gorączka z dreszczami, ból w okolicy lędźwiowej, leukocyturia i bakteriuria ➔ Ostre odmiedniczkowe ZZN (OOZN) [14]'
      ],
      keyRule: 'Różnicuj zespół nefrytyczny (obrzęki powiek, nadciśnienie, krwinkomocz, skąpomocz) z nerczycowym (masywny białkomocz >50 mg/kg/doba, hipoalbuminemia <2.5 g/dl, uogólnione obrzęki bez nadciśnienia).',
      branches: [
        { mod: '4', name: 'Popaciorkowcowe Ostre KZN (PSGN)', clue: 'Przebyta angina (1–2 tyg. wcześniej) lub liszajec (3–6 tyg. wcześniej), spadek składowej dopełniacza C3, wałeczki erytrocytarne', atlas: 'nefro', sec: 'kzn', linkText: 'Diagnostyka PSGN i dopełniacza' },
        { mod: '15', name: 'Zespół hemolityczno-mocznicowy (STEC-HUS)', clue: 'Krwista biegunka w wywiadzie, schistocyty w rozmazie krwi obwodowej, gwałtowny wzrost mocznika i kreatyniny', atlas: 'nefro', sec: 'aki', linkText: 'Postępowanie w HUS i wskazania do dializy' },
        { mod: '10', name: 'Guz Wilmsa (Nefroblastoma)', clue: 'Niebolesny guz brzucha u dziecka 2–4 lata, mikroskopowy krwinkomocz, nadciśnienie w wyniku ucisku tętnicy nerkowej', atlas: 'nowotwory', sec: 'guzy', linkText: 'Protokół guza Wilmsa i SIOP' },
        { mod: '14', name: 'Zakażenie układu moczowego (OOZN)', clue: 'Wysoka gorączka, objaw Goldflama (+), leukocyturia, dodatni posiew moczu z nakłucia lub cewnikowania', atlas: 'nefro', sec: 'zum', linkText: 'Klasyfikacja ZUM i diagnostyka ZUM' }
      ],
      trap: {
        type: 'bedside',
        badge: '🚨 Zagrożenie życia / Błąd w sztuce',
        title: 'Zakaz podawania antybiotyków przy STEC-HUS',
        desc: 'Leczenie krwistej biegunki antybiotykami lub lekami przeciwbiegunkowymi (loperamid) indukuje gwałtowne uwalnianie toksyny Shiga i wywołuje pełnoobjawowy zespół hemolityczno-mocznicowy ze zniszczeniem nerek.'
      },
      examTip: 'W zespole nerczycowym pamiętaj o ryzyku powikłań zakrzepowych (utrata antytrombiny III) i zakażeń pneumokokowych (utrata immunoglobulin).'
    },
    {
      id: 's4',
      name: 'Drgawki + zaburzenia świadomości',
      icon: '⚡',
      tag: 'Neurologia i stany nagłe',
      mods: ['5', '2', '9', '15'],
      redFlags: [
        'Drgawki trwające >5 minut bez odzyskania przytomności ➔ stan padaczkowy (Status epilepticus) [5]',
        'Gorączka, sztywność karku, objaw Brudzińskiego/Kerniga, wybroczyny ➔ ropne ZOMR [2]',
        'Triada Cushinga: bradykardia + nadciśnienie + nieregularny oddech ➔ wklinowanie migdałków / guz [9]',
        'Kurcze mięśni, parestezje, objaw Chvostka i Trousseau, wydłużenie QT ➔ hipokalcemia / mocznica [15]'
      ],
      keyRule: 'W każdym epizodzie drgawek natychmiast oznacz glikemię z opuszki palca! Hipoglikemia to najczęstsza natychmiastowo odwracalna przyczyna drgawek. Po 5 minutach podaj benzodiazepinę (midazolam policzkowo/domięśniowo lub diazepam doodbytniczo).',
      branches: [
        { mod: '5', name: 'Stan padaczkowy i drgawki gorączkowe złożone', clue: 'Czas trwania >15 min, napad ogniskowy, niedowład ponapadowy Todda lub nawrót w ciągu 24h', atlas: 'nagle', sec: 'drgawki', linkText: 'Algorytm leczenia stanu padaczkowego' },
        { mod: '2', name: 'Bakteryjne zapalenie opon mózgowo-rdzeniowych', clue: 'Pleocytoza neutrofilowa w PMR, wysokie białko, spadek glukozy PMR/surowica <0.4; pilna antybiotykoterapia', atlas: 'zakazenia', sec: 'zomr', linkText: 'Analiza płynu mózgowo-rdzeniowego' },
        { mod: '9', name: 'Guz mózgu i ciasnota wewnątrzczaszkowa', clue: 'Napady padaczkowe o początku ogniskowym, objawy ubytkowe, poranne bóle głowy i wymioty', atlas: 'guzy', sec: 'objawy', linkText: 'Guzy OUN – lokalizacja i objawy' },
        { mod: '15', name: 'Encefalopatia mocznicowa i zaburzenia elektrolitowe', clue: 'Moczówka, oliguria, hiperkaliemia, skrajna hipokalcemia lub hiponatremia', atlas: 'nefro', sec: 'aki', linkText: 'Zaburzenia elektrolitowe w AKI' }
      ],
      trap: {
        type: 'bedside',
        badge: '🚨 Zagrożenie życia / Błąd w sztuce',
        title: 'Zakaz punkcji lędźwiowej przed wykluczeniem ciasnoty śródczaszkowej',
        desc: 'Wykonanie nakłucia lędźwiowego przy wzmożonym ciśnieniu śródczaszkowym (obrzęk tarczy nerwu II, triada Cushinga) grozi natychmiastowym wklinowaniem pnia mózgu w otwór wielki i zgonem.'
      },
      examTip: 'Proste drgawki gorączkowe: wiek 6 m.ż.–5 lat, uogólnione toniczno-kloniczne, <15 min, 1 raz na 24h, bez deficytów neurologicznych – nie wymagają rutynowego EEG ani TK!'
    },
    {
      id: 's5',
      name: 'Duszność + świst oddechowy',
      icon: '🫁',
      tag: 'Drogi oddechowe i stany zagrożenia życia',
      mods: ['5', '8', '11'],
      redFlags: [
        'Nagły napad kaszlu w trakcie zabawy/jedzenia, jednostronne osłabienie szmeru ➔ zaaspirowane ciało obce [5]',
        'Świst wdechowy (stridor), szczekający kaszel, chrypka, zaciąganie dołków ➔ podgłośniowe zapalenie krtani (Krup) [5]',
        'Obrzęk warg/języka, pokrzywka, duszność wydechowa, spadek ciśnienia ➔ wstrząs anafilaktyczny [8]',
        'Duszność nasilająca się w pozycji leżącej, poszerzenie żył szyjnych, obrzęk twarzy (twarz nalana) ➔ guz śródpiersia (SVCS) [11]'
      ],
      keyRule: 'Rozróżnij świst wdechowy (stridor = górne drogi oddechowe: krtań, tchawica) od wydechowego (wheezing = dolne drogi: oskrzela, astma, zapalenie oskrzelików). Bezwzględny zakaz wkładania szpatułki do gardła przy podejrzeniu zapalenia nagłośni!',
      branches: [
        { mod: '5', name: 'Podgłośniowe zapalenie krtani (Krup / Laryngotracheitis)', clue: 'Etiologia wirusowa (parainfluenza), nasilenie w nocy, deksametazon p.o./i.m. 0.15–0.6 mg/kg + nebulizacja z L-adrenaliny', atlas: 'nagle', sec: 'krup', linkText: 'Skala Westleya i protokół krupu' },
        { mod: '8', name: 'Anafilaksja układu oddechowego', clue: 'Ekspozycja na alergen pokarmowy lub użądlenie owada; adrenalina 0.01 mg/kg domięśniowo w przednio-boczne udo', atlas: 'gastro', sec: 'alergie', linkText: 'Postępowanie w ostrej anafilaksji' },
        { mod: '11', name: 'Chłoniak śródpiersia / Zespół żyły głównej górnej', clue: 'Guz w przednim śródpiersiu (chłoniak T-komórkowy), ucisk tchawicy, bezwzględne RTG klatki przed jakąkolwiek sedacją', atlas: 'hemato', sec: 'chloniaki', linkText: 'Stany nagłe w hematoonkologii' }
      ],
      trap: {
        type: 'bedside',
        badge: '🚨 Zagrożenie życia / Błąd w sztuce',
        title: 'Szpatułka w gardle przy ostrym zapaleniu nagłośni',
        desc: 'Próba oglądania gardła szpatułką u dziecka z podejrzeniem zapalenia nagłośni (świst, ślinotok, pozycja wąchająca) wywołuje natychmiastowy odruchowy skurcz krtani i asfiksję.'
      },
      examTip: 'Krup leczymy sterydem (deksametazon) ZAWSZE, nawet w łagodnej postaci. Antybiotyk jest bezcelowy, bo przyczyną są wirusy parainfluozy.'
    },
    {
      id: 's6',
      name: 'Przewlekła biegunka + spadek masy ciała',
      icon: '🌾',
      tag: 'Gastroenterologia i wchłanianie pokarmów',
      mods: ['3', '7', '8', '13a'],
      redFlags: [
        'Biegunka z krwią i śluzem, bóle brzucha budzące ze snu, afty, przetoki okołoodbytnicze ➔ nieswoiste zapalenia jelit (IBD) [7]',
        'Wzdęty brzuch, zanik mięśni pośladkowych, zmiana usposobienia, opóźnienie wzrastania ➔ celiakia [8]',
        'Gwałtowne wymioty i biegunka ze wstrząsem 2-4h po podaniu mleka/soi ➔ zespół FPIES [8]',
        'Niedokrwistość mikrocytarna oporna na doustne żelazo + biegunka tłuszczowa ➔ zespół złego wchłaniania [13a]'
      ],
      keyRule: 'Przewlekła biegunka (>4 tygodnie) wymaga różnicowania osmotycznej (ustępuje na czczo, pH stolca <5.5, luki osmotyczne) od wydzielniczej (nie ustępuje na czczo) i zapalnej (krew, leukocyty, kalprotektyna).',
      branches: [
        { mod: '7', name: 'Choroba Leśniowskiego-Crohna / WZJG', clue: 'Wysoka kalprotektyna w kale, przyspieszone OB/CRP, zmiany okołoodbytnicze, MR-enterografia i kolonoskopia', atlas: 'gastro', sec: 'ibd', linkText: 'Różnicowanie ChLC vs WZJG w atlasie' },
        { mod: '8', name: 'Celiakia (Enteropatia z nadwrażliwości na gluten)', clue: 'Przeciwciała anty-tTG IgA + całkowite IgA; u dzieci stężenie >10x górna granica normy pozwala na rozpoznanie bez biopsji', atlas: 'gastro', sec: 'celiakia', linkText: 'Wytyczne ESPGHAN dla celiakii' },
        { mod: '3', name: 'Biegunka poinfekcyjna i wtórny niedobór laktazy', clue: 'Wodniste, pieniste, strzelające stolce z odparzeniami pośladków po przebytym rotawirusowym zapaleniu jelit', atlas: 'gastro', sec: 'biegunki', linkText: 'Algorytm nawadniania i diety' },
        { mod: '13a', name: 'Niedokrwistość z niedoboru żelaza (Sideropenia)', clue: 'Spadek MCV, MCH, ferrytyny przy podwyższonym TIBC w wyniku przewlekłego krwawienia śluzówkowego lub enteropatii', atlas: 'skazy', sec: 's13a', linkText: 'Diagnostyka różnicowa niedokrwistości' }
      ],
      trap: {
        type: 'test',
        badge: '⚠️ Pułapka testowa (Klucz vs Wytyczne)',
        title: 'Rozpoznanie celiakii u pacjenta z selektywnym niedoborem IgA',
        desc: 'U 2-3% pacjentów z celiakią występuje wrodzony niedobór IgA. Test anty-tTG w klasie IgA da wynik fałszywie ujemny! W algorytmie ZAWSZE oznacza się całkowite stężenie IgA lub bada przeciwciała w klasie IgG (anty-DGP IgG).'
      },
      examTip: 'Testy alergiczne skórne (prick) i swoiste IgE są całkowicie nieprzydatne w celiakii, ponieważ celiakia jest chorobą autoimmunologiczną, a nie alergią IgE-zależną!'
    },
    {
      id: 's7',
      name: 'Powiększenie węzłów + gorączka',
      icon: '🔬',
      tag: 'Limfadenopatia i rozrosty układu chłonnego',
      mods: ['2', '11', '13b'],
      redFlags: [
        'Powiększenie węzłów nadobojczykowych lub śródpiersiowych ➔ podejrzenie złośliwego rozrostu nowotworowego [11]',
        'Węzeł twardy, niebolesny, zrośnięty z podłożem, pakiet węzłowy, brak cech ostrego zapalenia skóry ➔ chłoniak [11]',
        'Wysoka gorączka, powiększenie węzłów szyjnych, naloty na migdałkach, hepatosplenomegalia ➔ mononukleoza zakaźna (EBV) [2]',
        'Nawracające ropnie węzłów chłonnych wywołane przez Catalase(+) patogeny (np. S. aureus, Serratia) ➔ Przewlekła choroba ziarniniakowa (CGD) [13b]'
      ],
      keyRule: 'Węzły nadobojczykowe ZAWSZE są patologiczne i wymagają pilnej biopsji! Węzły szyjne i pachwinowe u dzieci są często odczynowe. Jeśli limfadenopatia trwa >4-6 tygodni bez tendencji do regresji – wskazana biopsja węzła w całości.',
      branches: [
        { mod: '11', name: 'Chłoniak Hodgkina i chłoniaki nie-Hodgkina (NHL)', clue: 'Niebolesna limfadenopatia, objawy ogólne B (gorączka, nocne poty, spadek masy ciała >10%), eozynofilia, poszerzenie śródpiersia', atlas: 'hemato', sec: 'chloniaki', linkText: 'Klasyfikacja Ann Arbor i chłoniaki' },
        { mod: '2', name: 'Mononukleoza zakaźna (EBV) i cytomegalia (CMV)', clue: 'Limfocytoza z obecnością atypowych limfocytów (komórki Downey) >10%, przeciwciała anty-VCA IgM, odczyn heterofilny Paula-Bunnella-Davidsohna', atlas: 'zakazenia', sec: 'ebv', linkText: 'Obraz kliniczny i diagnostyka EBV' },
        { mod: '13b', name: 'Pierwotne niedobory odporności (PNO / CGD)', clue: 'Defekt wybuchu tlenowego fagocytów (test NBT / DHR), zakażenia węzłów bakteriami katalazo-dodatnimi i grzybami', atlas: 'skazy', sec: 's13b', linkText: '10 objawów ostrzegawczych PNO' }
      ],
      trap: {
        type: 'test',
        badge: '⚠️ Pułapka testowa (Klucz vs Wytyczne)',
        title: 'Podanie amoksycyliny lub ampicyliny w mononukleozie (EBV)',
        desc: 'Podanie aminopenicyliny pacjentowi z zakażeniem EBV w 90% przypadków wywołuje odczynową, swędzącą osutkę plamisto-grudkową. Nie jest to prawdziwa alergia na penicylinę, lecz reakcja immunologiczna w przebiegu wiremii.'
      },
      examTip: 'Biopsja aspiracyjna cienkoigłowa (BAC) węzła u dziecka jest BŁĘDEM w diagnostyce chłoniaka – nie pozwala ocenić architektoniki tkankowej. Standardem jest pobranie całego węzła chirurgicznie!'
    },
    {
      id: 's8',
      name: 'Bladość + żółtaczka / ciemny mocz',
      icon: '🟡',
      tag: 'Hemoliza i mikroangiopatie zakrzepowe',
      mods: ['13a', '15', '12'],
      redFlags: [
        'Gwałtowny spadek Hb, ciemny mocz (barwa coli / ciemnego piwa), żółtaczka, splenomegalia ➔ kryza hemolityczna [13a]',
        'Niedokrwistość + małopłytkowość + skąpomocz po biegunce ➔ mikroangiopatia HUS [15]',
        'Pojawienie się żółtaczki po ekspozycji na bób lub leki (kotrimoksazol, nitrofurantoina) ➔ niedobór G6PD (fawizm) [13a]',
        'Zaburzenia krzepnięcia, spadek fibrynogenu, wzrost D-dimerów, krwawienia z wkłuć ➔ zespół DIC [12]'
      ],
      keyRule: 'W anemii z żółtaczką pierwszy krok to ocena retikulocytów i odczynu Coombsa. Wysokie retikulocyty + spadek haptoglobiny + wzrost LDH i bilirubiny pośredniej = hemoliza! Dodatni BTA (Coombs) = autoimmunologiczna niedokrwistość hemolityczna (AIHA).',
      branches: [
        { mod: '13a', name: 'Niedokrwistość hemolityczna (Wrodzona vs AIHA)', clue: 'Sferocytoza wrodzona (spadek oporności osmotycznej, mutacja ankiryny/spektryny) lub AIHA (dodatni bezpośredni test antyglobulinowy Coombsa)', atlas: 'skazy', sec: 's13a', linkText: 'Algorytm diagnostyki hemolizy' },
        { mod: '15', name: 'Mikroangiopatyczna niedokrwistość hemolityczna (MAHA / HUS)', clue: 'Obecność fragmentów erytrocytów (schistocytów / helmet cells) w rozmazie krwi, ujemny test Coombsa (mechaniczne niszczenie)', atlas: 'nefro', sec: 'aki', linkText: 'Rozmaz krwi w HUS i nefropatii' },
        { mod: '12', name: 'Koagulopatia ze zużycia (DIC)', clue: 'Jednoczesna aktywacja krzepnięcia i fibrynolizy, wydłużenie PT i APTT, skrajny spadek fibrynogenu (<100 mg/dl)', atlas: 'skazy', sec: 'diag', linkText: 'Kryteria rozpoznania DIC u dzieci' }
      ],
      trap: {
        type: 'bedside',
        badge: '🚨 Zagrożenie życia / Błąd w sztuce',
        title: 'Przetoczenie koncentratu płytek krwi (KKP) w zespole HUS',
        desc: 'W zespole HUS oraz TTP płytki są zużywane w mikrozakrzepach nerkowych i naczyniowych. Podanie koncentratu krwinek płytkowych (KKP) „dolewa oliwy do ognia” nasilając zakrzepicę w kłębuszkach nerkowych i grożąc nieodwracalnym zniszczeniem nerek!'
      },
      examTip: 'Kluczowe różnicowanie anemii: Niedobór żelaza = retikulocyty NISKIE, ferrytyna NISKA. Hemoliza = retikulocyty WYSOKIE, LDH WYSOKIE, haptoglobina NIEWYKRYWALNA.'
    }
  ];

  /* Trenażer Badań Obrazowych i EKG (12 kluczowych przypadków: 4 EKG, 4 RTG, 4 USG) */
  const IMAGING_TRAINER_CASES = [
    // --- 🫀 EKG (4 przypadki) ---
    {
      id: 'ekg-norm',
      modality: 'ekg',
      title: 'Fizjologiczne EKG dziecka (Wariant normy)',
      short: 'Normy wiekowe & załamki T',
      mods: ['0'],
      atlas: 'zakazenia',
      sec: 'badanie',
      vignette: '6-letni chłopiec badany rutynowo przed obozem sportowym. Bez dolegliwości, rozwój prawidłowy. Zapis EKG na papierze milimetrowym 25 mm/s, 10 mm/mV. HR 95/min, oś serca +75° (prawogram fizjologiczny), ujemne załamki T w odprowadzeniach przedsercowych V1–V3.',
      svgType: 'ekg-norm',
      hotspot: {
        id: 'hotspot-t-neg',
        name: 'Ujemne załamki T w V1–V3',
        targetX: 195,
        targetY: 85,
        radius: 40,
        hint: 'Fizjologiczna inwersja załamków T w odprowadzeniach prawokomorowych V1–V3 to zjawisko normy rozwojowej u dzieci od 1. tygodnia do nawet 10.–12. r.ż.!'
      },
      clinicalQuestion: {
        q: 'Jak zinterpretujesz ujemne załamki T w odprowadzeniach V1–V3 u 6-letniego dziecka bez objawów klinicznych?',
        opts: [
          'Jest to prawidłowy wariant rozwoju dziecięcego (dziecięcy typ załamków T), nie wymaga leczenia ani ograniczenia aktywności.',
          'Wskazuje na niedokrwienie ściany przedniej i wymaga pilnej koronarografii.',
          'Świadczy o zapaleniu mięśnia sercowego i wymaga natychmiastowej hospitalizacji na OIT.',
          'Jest to patognomoniczny objaw zespołu Brugadów typu 1.'
        ],
        correct: 0,
        explanation: 'U dzieci po okresie noworodkowym (od ok. 7. doby życia) załamki T w odprowadzeniach prawokomorowych (V1–V3) są fizjologicznie ujemne. Odwracają się do pozycji dodatniej dopiero w wieku szkolnym/dojrzewania (tzw. zwrot załamków T). Dodatni załamek T w V1 w wieku 2 lat jest zjawiskiem PATOLOGICZNYM (świadczy o przeroście prawej komory RVH!).',
        pearl: 'Złota zasada egzaminacyjna: Dodatni załamek T w odprowadzeniu V1 między 1. tygodniem a 8. rokiem życia to objaw patologiczny (przerost prawej komory / RVH)!'
      }
    },
    {
      id: 'ekg-svt',
      modality: 'ekg',
      title: 'Częstoskurcz nadkomorowy (SVT / PSVT)',
      short: 'Wąskie QRS, HR 230/min, brak P',
      mods: ['5'],
      atlas: 'nagle',
      sec: 'nagle',
      vignette: '9-miesięczne niemowlę z nagłym niepokojem, bladością i dusznością. Tętno obwodowe nitkowate, trudne do zliczenia. Monitor wykazuje HR 230/min, wąskie zespoły QRS (<80 ms), brak widocznych załamków P przed zespołami QRS.',
      svgType: 'ekg-svt',
      hotspot: {
        id: 'hotspot-narrow-qrs',
        name: 'Wąskie zespoły QRS bez załamków P przy skrajnej tachykardii',
        targetX: 180,
        targetY: 80,
        radius: 45,
        hint: 'Rytmiczny częstoskurcz o stałym interwale RR, wąskich zespołach QRS i braku załamków P przy HR >220/min u niemowlęcia to podręcznikowy SVT!'
      },
      clinicalQuestion: {
        q: 'Dziecko jest stabilne krążeniowo (ciśnienie prawidłowe, CRT 2s). Jaki jest prawidłowy pierwszy krok postępowania wg wytycznych PALS?',
        opts: [
          'Manewry stymulacji nerwu błędnego (worek z lodem na twarz niemowlęcia na 15–20 s), a przy braku powrotu rytmu zatokowego – adenozyna i.v. 0.1 mg/kg w szybkim bolusie.',
          'Natychmiastowa kardiowersja elektryczna zsynchronizowana 2 J/kg bez wcześniejszych leków.',
          'Masaż zatoki szyjnej i uciskanie gałek ocznych (odruch Aschnera).',
          'Podanie doustnego digoksyny i wyczekanie na efekt przez 24 godziny.'
        ],
        correct: 0,
        explanation: 'U stabilnego krążeniowo niemowlęcia z SVT pierwszym krokiem są manewry wagalne (u niemowląt: lód w woreczku foliowym przyłożony do górnej połowy twarzy na 15–20 s, bez blokowania dróg oddechowych). Zakazane jest uciskanie gałek ocznych! W razie braku efektu lekiem pierwszego wyboru jest adenozyna i.v. (0.1 mg/kg, maks. 6 mg) podana metodą dwóch strzykawek przez wkłucie możliwie blisko serca.',
        pearl: 'Adenozyna ma okres półtrwania <10 sekund! Musi być podana w szybkim pchnięciu i natychmiast przepłukana minimum 5–10 ml 0.9% NaCl metodą trójnika.'
      }
    },
    {
      id: 'ekg-lqts',
      modality: 'ekg',
      title: 'Zespół wydłużonego odstępu QT (LQTS)',
      short: 'Skorygowany QTc > 470 ms (Bazett)',
      mods: ['5'],
      atlas: 'nagle',
      sec: 'drgawki',
      vignette: '12-letnia dziewczynka po nagłym epizodzie utraty przytomności (omdlenia) podczas skoku do zimnej wody na basenie. W badaniu EKG: miarowy rytm zatokowy HR 65/min, odstęp QT wynosi 520 ms. Po skorygowaniu wzorem Bazetta: QTc = 540 ms (norma < 460 ms).',
      svgType: 'ekg-lqts',
      hotspot: {
        id: 'hotspot-qt-interval',
        name: 'Maksymalnie wydłużony odstęp QT / szeroki załamek T',
        targetX: 235,
        targetY: 90,
        radius: 45,
        hint: 'Odstęp od początku załamka Q do końca załamka T zajmuje ponad połowę całego cyklu RR (QT > 1/2 RR przy miarowym rytmie)!'
      },
      clinicalQuestion: {
        q: 'Jakie leczenie jest terapią pierwszego wyboru u pacjentów z wrodzonym LQTS, a jakich leków należy bezwzględnie unikać?',
        opts: [
          'Leczeniem z wyboru są beta-adrenolityki (np. propranolol, nadolol); bezwzględnie przeciwwskazane są leki wydłużające QT (makrolidy, ondansetron, hydroksyzyna).',
          'Leczeniem z wyboru są leki antyarytmiczne klasy IA (chinidyna) i amiodaron.',
          'Wskazana jest natychmiastowa suplementacja wapnia i wlew digoksyny.',
          'Schorzenie ma charakter łagodny i nie wymaga farmakoterapii, zaleca się intensywne sporty wyczynowe.'
        ],
        correct: 0,
        explanation: 'Podstawą leczenia wrodzonego LQTS są nieselektywne beta-blokery (nadolol, propranolol), które redukują ryzyko złośliwych komorowych zaburzeń rytmu (Torsade de Pointes ➔ migotanie komór) wyzwalanych wyrzutem katecholamin (np. podczas pływania, dźwięku budzika, wysiłku). Bezwzględny zakaz stosowania leków z listy CredibleMeds (erytromycyna, azytromycyna, ondansetron, amiodaron, trójpierścieniowe leki przeciwdepresyjne).',
        pearl: 'Reguła kciuka w pediatrii: Jeśli odstęp QT przekracza połowę odstępu R-R (QT > 0.5 RR), odstęp QTc jest niemal na pewno patologicznie wydłużony!'
      }
    },
    {
      id: 'ekg-hyperkalemia',
      modality: 'ekg',
      title: 'Hiperkaliemia w ostrej niewydolności nerek',
      short: 'Wysokie, spiczaste załamki T (K+ > 7.0 mmol/l)',
      mods: ['15', '5'],
      atlas: 'nefro',
      sec: 'aki',
      vignette: '5-letni chłopiec w 4. dobie zespołu HUS po biegunce krwistej. Bezmoczu od 18 godzin. W surowicy: K+ 7.4 mmol/l, kreatynina 4.2 mg/dl. EKG wykazuje symetryczne, spiczaste, namiotowate załamki T o wąskiej podstawie w odprowadzeniach przedsercowych.',
      svgType: 'ekg-hyperkalemia',
      hotspot: {
        id: 'hotspot-t-peaked',
        name: 'Wysoki, namiotowaty załamek T o wąskiej podstawie',
        targetX: 205,
        targetY: 55,
        radius: 40,
        hint: 'Namiotowaty, symetryczny, wąski załamek T przekraczający wysokością zespół QRS to pierwszy i najbardziej czuły objaw kardiotoksyczności potasu!'
      },
      clinicalQuestion: {
        q: 'W EKG stwierdzono cechy kardiotoksyczności hiperkaliemii (K+ 7.4 mmol/l). Jaki lek należy podać NATYCHMIAST w celu stabilizacji błony kardiomiocytów?',
        opts: [
          '10% glukonian wapnia (lub chlorek wapnia) i.v. pod kontrolą kardiomonitora.',
          'Furosemid i.v. w dawce 5 mg/kg jako jedyny lek ratunkowy.',
          'Wlew chlorku potasu w 5% glukozie.',
          'Wodorowęglan sodu w bolusie bez monitorowania rytmu.'
        ],
        correct: 0,
        explanation: 'Glukonian wapnia (10% 0.5 ml/kg i.v.) NIE obniża stężenia potasu we krwi, ale NATYCHMIAST (w 1–3 min) stabilizuje potencjał spoczynkowy błony komórkowej kardiomiocytów, chroniąc przed migotaniem komór i asystolią. Kolejnym krokiem jest przesunięcie potasu do wnętrza komórek (glukoza z insuliną, salbutamol w nebulizacji, wodorowęglan sodu) oraz usunięcie potasu z ustroju (żywice jonowymienne, hemodializa).',
        pearl: 'Pamiętaj: Wapń chroni serce natychmiast, ale nie usuwa potasu! Zawsze po wapniu musisz wdrożyć leki przesuwające potas do komórek (insulina + glukoza).'
      }
    },

    // --- 🩻 RTG (4 przypadki) ---
    {
      id: 'rtg-croup',
      modality: 'rtg',
      title: 'Podgłośniowe zapalenie krtani (Krup / Laryngotracheitis)',
      short: 'RTG AP szyi: Objaw wieży kościoła (Steeple sign)',
      mods: ['5'],
      atlas: 'nagle',
      sec: 'krup',
      vignette: '2-letni chłopiec z nagłym szczekającym kaszlem, chrypką i świstem wdechowym (stridor) nasilającym się w nocy. Na radiogramie przednio-tylnym (AP) szyi widoczne podgłośniowe, stożkowate zwężenie słupa powietrza w krtani i tchawicy.',
      svgType: 'rtg-croup',
      hotspot: {
        id: 'hotspot-steeple',
        name: 'Objaw wieży kościoła (Steeple sign / Pencil point)',
        targetX: 150,
        targetY: 130,
        radius: 35,
        hint: 'Podgłośniowy obrzęk błony śluzowej krtani powoduje symetryczne, stożkowate zwężenie drogi oddechowej przypominające wieżę gotyckiego kościoła lub zaostrzony ołówek.'
      },
      clinicalQuestion: {
        q: 'Jakie jest leczenie z wyboru u dziecka z podgłośniowym zapaleniem krtani i świstem wdechowym w spoczynku (krup umiarkowany/ciężki)?',
        opts: [
          'Deksametazon p.o./i.m. (0.15–0.6 mg/kg) + nebulizacja z L-adrenaliny (1 mg/ml 1:1000) w dawce 0.5 ml/kg (maks. 5 ml) z tlenem.',
          'Wziewny antybiotyk beta-laktamowy i natychmiastowa bronchoskopia sztywna.',
          'Podanie leków przeciwkaszlowych (kodeina) i ułożenie dziecka na płasko na plecach.',
          'Empiryczna ampicylina z sulbaktamem i płukanie gardła solanką.'
        ],
        correct: 0,
        explanation: 'Podstawą leczenia krupu jest sterydoterapia (deksametazon doustnie lub domięśniowo), która zmniejsza obrzęk podgłośniowy. W stanach duszności spoczynkowej natychmiast dołączamy nebulizację z nie-rozcieńczonej L-adrenaliny z tlenem (obkurcza naczynia błony śluzowej krtani w 10–30 min). Antybiotyki są bezcelowe, gdyż etiologia w >95% jest wirusowa (parainfluenza).',
        pearl: 'Efekt adrenaliny w nebulizacji mija po ok. 2 godzinach (efekt odbicia / rebound)! Dziecko po inhalacji z adrenaliny musi pozostać pod obserwacją na oddziale przez minimum 3–4 godziny.'
      }
    },
    {
      id: 'rtg-pneumoperitoneum',
      modality: 'rtg',
      title: 'Perforacja przewodu pokarmowego (Pneumoperitoneum)',
      short: 'RTG przeglądowe brzucha: Sierp powietrza pod przeponą',
      mods: ['1', '6'],
      atlas: 'brzuch',
      sec: 'algorytm',
      vignette: '14-letni chłopiec z nagłym, przeszywającym bólem w nadbrzuszu o charakterze „uderzenia nożem”, następowym stwardnieniem powłok brzusznych (brzuch deskowaty) i objawami wstrząsu. RTG klatki piersiowej i jamy brzusznej w pozycji stojącej.',
      svgType: 'rtg-perforation',
      hotspot: {
        id: 'hotspot-crescent',
        name: 'Sierp wolnego powietrza pod prawą kopułą przepony',
        targetX: 215,
        targetY: 85,
        radius: 35,
        hint: 'Półksiężycowaty rąbek przejrzystości gazowej pomiędzy górną powierzchnią wątroby a dolnym zarysem prawej kopuły przepony – pewny dowód perforacji narządu drążonego!'
      },
      clinicalQuestion: {
        q: 'Obecność wolnego powietrza pod kopułą przepony (pneumoperitoneum) u pacjenta z objawami ostrego brzucha stanowi bezwzględne wskazanie do:',
        opts: [
          'Pilnej laparotomii / laparoskopii chirurgicznej w trybie natychmiastowym po wstępnej resuscytacji płynowej.',
          'Planowej kolonoskopii diagnostycznej w znieczuleniu miejscowym.',
          'Zgłębnikowania żołądka i podania doustnego kontrastu barytowego.',
          'Wdrożenia leczenia zachowawczego inhibitorami pompy protonowej (IPP) p.o.'
        ],
        correct: 0,
        explanation: 'Sierp powietrza pod przeponą w połączeniu z objawami otrzewnowymi (obrona mięśniowa, objaw Blumberga) to dowód przedziurawienia ściany żołądka, dwunastnicy lub jelita (np. pęknięty wrzód, perforacja wyrostka, uraz). Wymaga pilnej interwencji chirurgicznej. Podanie baru drogą pokarmową jest bezwzględnie przeciwwskazane (grozi chemicznym zapaleniem otrzewnej).',
        pearl: 'Jeżeli pacjent nie może stać do zdjęcia RTG, wykonaj zdjęcie w pozycji leżącej na LEWYM boku promieniem poziomym – gaz zbierze się nad prawym brzegiem wątroby!'
      }
    },
    {
      id: 'rtg-ileus',
      modality: 'rtg',
      title: 'Mechaniczna niedrożność jelit (Ileus mechanicznym)',
      short: 'RTG przeglądowe: Poziomy płynów i rozdęte pętle',
      mods: ['1'],
      atlas: 'brzuch',
      sec: 'algorytm',
      vignette: '7-letnia dziewczynka po operacji wyrostka robaczkowego 2 lata temu, przyjęta z narastającym bólem brzucha, wzdęciem, zatrzymaniem gazów i stolca oraz obfitymi wymiotami treścią zieloną (żółciową). RTG jamy brzusznej w projekcji AP.',
      svgType: 'rtg-ileus',
      hotspot: {
        id: 'hotspot-fluid-levels',
        name: 'Mnogie poziomy płynno-gazowe w pętlach jelitowych',
        targetX: 155,
        targetY: 155,
        radius: 45,
        hint: 'Układające się schodkowato poziome linie oddzielające płyn od gazu w rozdętych pętlach jelita cienkiego (obraz girland / schodów).'
      },
      clinicalQuestion: {
        q: 'Jakie jest najczęstsze powikłanie odległe po przebytej w przeszłości laparotomii u dzieci, prowadzące do mechanicznej niedrożności jelit?',
        opts: [
          'Niedrożność ze zrostów otrzewnowych (pasma zrostowe uciskające światło jelita).',
          'Wrodzony megacolon (choroba Hirschsprunga).',
          'Pierwotna atrezja dwunastnicy.',
          'Przerostowe stwardnienie tętnic krezkowych.'
        ],
        correct: 0,
        explanation: 'U dzieci po wcześniejszych zabiegach chirurgicznych w jamie brzusznej (np. po zapaleniu wyrostka robaczkowego) najczęstszą przyczyną ostrej niedrożności mechanicznej są zrosty pooperacyjne (adhesions). Początkowe postępowanie to odbarczenie żołądka sondą, zakaz żywienia doustnego, krystaloidy i.v. i pilna konsultacja chirurgiczna.',
        pearl: 'Wymioty o zabarwieniu żółciowym (zielone/brunatne) u dziecka z bólem brzucha są ZAWSZE objawem alarmowym niedrożności przewodu pokarmowego do czasu wykluczenia!'
      }
    },
    {
      id: 'rtg-mediastinum',
      modality: 'rtg',
      title: 'Guz przedniego śródpiersia (Chłoniak / Zespół SVCS)',
      short: 'RTG klatki: Poszerzenie śródpiersia i ucisk tchawicy',
      mods: ['11', '5'],
      atlas: 'hemato',
      sec: 'chloniaki',
      vignette: '11-letni chłopiec z dusznością nasilającą się w pozycji leżącej (ortopnoe), obrzękiem i zaczerwienieniem twarzy („nalana twarz”), poszerzeniem żył szyjnych i suchym kaszlem. RTG klatki piersiowej wykazuje masywne poszerzenie cienia przednio-górnego śródpiersia z uciskiem tchawicy.',
      svgType: 'rtg-mediastinum',
      hotspot: {
        id: 'hotspot-mediastinal-mass',
        name: 'Masywne poszerzenie cienia śródpiersia z uciskiem dróg oddechowych',
        targetX: 150,
        targetY: 110,
        radius: 50,
        hint: 'Patologiczny cień w śródpiersiu przednim przekraczający 1/3 szerokości klatki piersiowej, zwężający i przemieszczający słup powietrza tchawicy w lewo.'
      },
      clinicalQuestion: {
        q: 'Jakie jest kardynalne zalecenie bezpieczeństwa przed sedacją lub zabiegiem chirurgicznym u dziecka z podejrzeniem guza przedniego śródpiersia?',
        opts: [
          'Bezwzględny zakaz sedacji i znieczulenia ogólnego w pozycji na wznak przed dokładną oceną drożności dróg oddechowych (ryzyko nagłego uduszenia i NZK).',
          'Natychmiastowe podanie morfiny i.v. w celu uspokojenia dziecka.',
          'Ułożenie dziecka na plecach z uniesionymi nogami w pozycji Trendelenburga.',
          'Planowe wykonanie biopsji otwartej w znieczuleniu miejscowym bez tlenoterapii.'
        ],
        correct: 0,
        explanation: 'Guz przedniego śródpiersia (najczęściej chłoniak T-ALL lub chłoniak Hodgkina) pod wpływem sedacji i miorelaksacji traci napięcie mięśniowe podtrzymujące drogi oddechowe. Dochodzi do natychmiastowego zaciśnięcia tchawicy i pnia płucnego, co uniemożliwia wentylację i prowadzi do zgonu na stole operacyjnym. Dziecko musi być zdiagnozowane w pozycji siedzącej/półsiedzącej!',
        pearl: 'Zasada onkologiczna: Każde dziecko z zespołem żyły głównej górnej (SVCS) lub dużą masą w śródpiersiu traktuj jako pacjenta z bezpośrednim zagrożeniem zatrzymania krążenia w znieczuleniu!'
      }
    },

    // --- 📡 POCUS / USG (4 przypadki) ---
    {
      id: 'usg-intussusception',
      modality: 'usg',
      title: 'Wgłobienie jelitowe (Intussusception)',
      short: 'USG brzucha: Objaw tarczy strzelniczej (Target sign)',
      mods: ['1', '3'],
      atlas: 'brzuch',
      sec: 'choroby',
      vignette: '7-miesięczne niemowlę z napadami nagłego, kurczowego płaczu z podkurczaniem nóżek, przeplatanymi okresami apatii. W stolcu pojawił się śluz podbarwiony krwią („galaretka porzeczkowa”). W badaniu USG jamy brzusznej głowicą liniową w prawym śródbrzuszu.',
      svgType: 'usg-target',
      hotspot: {
        id: 'hotspot-target-sign',
        name: 'Objaw tarczy strzelniczej / donuta (Target / Donut sign)',
        targetX: 150,
        targetY: 140,
        radius: 45,
        hint: 'Koncentryczne pierścienie w przekroju poprzecznym: zewnętrzny hipoechogenny cylinder wgłabiający (intussuscipiens) i wewnętrzny cylinder wgłobiony (intussusceptum) z krezką.'
      },
      clinicalQuestion: {
        q: 'Jakie jest postępowanie pierwszego rzutu u stabilnego dziecka z niepowikłanym wgłobieniem jelitowym trwającym <24–48 godzin?',
        opts: [
          'Nieoperacyjne odprowadzenie wgłobienia (dezynwaginacja) metodą wlewu powietrznego lub soli fizjologicznej pod kontrolą USG/RTG.',
          'Natychmiastowa resekcja jelita grubego z wyłonieniem stomii.',
          'Leczenie zachowawcze antybiotykami i lekiem rozkurczowym p.o.',
          'Intensywny masaż brzucha przez powłoki i podanie wlewki z parafiny.'
        ],
        correct: 0,
        explanation: 'Złotym standardem diagnostyki wgłobienia jest USG (czułość bliska 100%). U dziecka stabilnego, bez objawów zapalenia otrzewnej i bez cech perforacji, leczeniem pierwszego wyboru jest pneumatyczna (powietrzem) lub hydrostatyczna (solą fizjologiczną) dezynwaginacja pod kontrolą USG lub fluoroskopii. Skuteczność wynosi 80–90%.',
        pearl: 'Objaw tarczy w przekroju poprzecznym odpowiada objawowi pseudonerki (pseudokidney sign) lub kanapki (sandwich sign) w przekroju podłużnym!'
      }
    },
    {
      id: 'usg-appendicitis',
      modality: 'usg',
      title: 'Ostre zapalenie wyrostka robaczkowego',
      short: 'USG: Nieściśliwy wyrostek > 6 mm i coprolith',
      mods: ['1'],
      atlas: 'brzuch',
      sec: 'algorytm',
      vignette: '10-letni chłopiec z bólem brzucha od 14 godzin, który rozpoczął się wokół pępka i przemieścił do prawego dołu biodrowego. Gorączka 38.2°C, dodatni objaw Jaworskiego i Blumberga. W badaniu USG prawego dołu biodrowego głowicą liniową z uciskiem.',
      svgType: 'usg-appendix',
      hotspot: {
        id: 'hotspot-thick-appendix',
        name: 'Pogrubiały, nieściśliwy wyrostek o średnicy > 6 mm z kamieniem kałowym',
        targetX: 165,
        targetY: 135,
        radius: 40,
        hint: 'Ślepo zakończona cewkowa struktura o zewnętrznej średnicy >6 mm, niepodatna na ucisk głowicą (non-compressible), z hiperechogennym kamieniem kałowym dającym cień akustyczny.'
      },
      clinicalQuestion: {
        q: 'Które z poniższych kryteriów ultrasonograficznych NAJSILNIEJ potwierdza rozpoznanie ostrego zapalenia wyrostka robaczkowego u dziecka?',
        opts: [
          'Zewnętrzna średnica wyrostka > 6 mm mierzona od ściany do ściany przy ucisku głowicą oraz brak podatności na kompresję.',
          'Obecność gazu w bańce odbytnicy.',
          'Prawidłowa grubość błony śluzowej żołądka poniżej 5 mm.',
          'Zmniejszenie przepływu nerkowego w badaniu Doppler.'
        ],
        correct: 0,
        explanation: 'Podstawowe kryteria USG ostrego zapalenia wyrostka robaczkowego to: 1) średnica zewnętrzna > 6 mm przy ucisku, 2) brak podatności na kompresję głowicą (sztywny wałek), 3) pogrubienie ściany > 2 mm z przekrwieniem w color Dopplerze, 4) obecność kamienia kałowego (coprolith / appendicolith) z cieniem akustycznym, 5) hiperechogenna zapalnie zmieniona tkanka tłuszczowa krezki.',
        pearl: 'USG jest badaniem z wyboru u dzieci z podejrzeniem zapalenia wyrostka robaczkowego ze względu na brak promieniowania jonizującego (w przeciwieństwie do TK)!'
      }
    },
    {
      id: 'usg-pyloric-stenosis',
      modality: 'usg',
      title: 'Przerostowe zwężenie odźwiernika (Pyloric Stenosis / HPS)',
      short: 'USG odźwiernika: Grubość mięśniówki ≥ 3 mm, długość ≥ 15 mm',
      mods: ['1', '3'],
      atlas: 'gastro',
      sec: 'biegunki',
      vignette: '4-tygodniowy noworodek płci męskiej z chlustającymi wymiotami treścią pokarmową bez żółci po każdym karmieniu. Dziecko jest odwodnione, stale głodne. W gazometrii: zasadowica metaboliczna hipochloremiczna i hipokaliemiczna. W badaniu USG okolicy odźwiernika.',
      svgType: 'usg-pylorus',
      hotspot: {
        id: 'hotspot-pylorus-muscle',
        name: 'Przerost błony mięśniowej odźwiernika (grubość ≥ 3 mm)',
        targetX: 155,
        targetY: 130,
        radius: 40,
        hint: 'Pogrubiały pierścień mięśniówki odźwiernika o grubości ≥3 mm oraz wydłużony kanał odźwiernika ≥15 mm (objaw tarczy / podwójnej szyny).'
      },
      clinicalQuestion: {
        q: 'Jakie jest bezwzględne postępowanie przedoperacyjne przed pyloromiotomią u dziecka z HPS?',
        opts: [
          'Wyrównanie zaburzeń wodno-elektrolitowych i kwasowo-zasadowych (nawodnienie 0.9% NaCl + KCl w celu skorygowania zasadowicy hipochloremicznej).',
          'Natychmiastowa operacja w ciągu pierwszych 2 godzin bez wyrównywania elektrolitów.',
          'Płukanie żołądka roztworem wodorowęglanu sodu.',
          'Podanie leków prokinetycznych (metoklopramid) i kontynuacja karmienia piersią.'
        ],
        correct: 0,
        explanation: 'Przerostowe zwężenie odźwiernika (HPS) NIE jest nagłym stanem chirurgicznym, lecz nagłym stanem METABOLICZNYM! Operacja pyloromiotomii metodą Fredeta-Ramstedta może być bezpiecznie przeprowadzona dopiero po całkowitym wyrównaniu odwodnienia i hipochloremicznej zasadowicy metabolicznej. Znieczulenie dziecka z niewyrównaną alkalozą grozi bezdechem ponarkozowym.',
        pearl: 'Reguła liczbowa HPS do zapamiętania na testy: Liczba Pi (π ≈ 3.1415): grubość mięśniówki ≥ 3 mm, długość kanału ≥ 14–15 mm!'
      }
    },
    {
      id: 'usg-wilms',
      modality: 'usg',
      title: 'Guz Wilmsa vs Neuroblastoma w USG jamy brzusznej',
      short: 'USG brzucha: Guz nerki vs linia pośrodkowa',
      mods: ['10', '4'],
      atlas: 'nowotwory',
      sec: 'guzy',
      vignette: '3-letnia dziewczynka, u której matka podczas kąpieli wyczuła niebolesny, gładki opór w lewym boku. Dziecko w stanie ogólnym dobrym, ciśnienie tętnicze 125/80 mmHg (podwyższone). USG jamy brzusznej wykazuje dużą, litą masę w lewej nerce z zachowanym rąbkiem zdrowego miąższu nerkowego (objaw pazura).',
      svgType: 'usg-wilms',
      hotspot: {
        id: 'hotspot-wilms-mass',
        name: 'Śródnerkowa masa guzowa nieprzekraczająca linii pośrodkowej',
        targetX: 140,
        targetY: 145,
        radius: 50,
        hint: 'Dobrze odgraniczony, jednorodny guz rozwijający się wewnątrz miąższu nerki (objaw szponu / claw sign), który przemieszcza naczynia, ale ich nie nacieka i nie przekracza linii pośrodkowej ciała.'
      },
      clinicalQuestion: {
        q: 'Która z poniższych cech radiologicznych i klinicznych najsilniej przemawia za GUZEM WILMSA, a przeciwko NEUROBLASTOMA?',
        opts: [
          'Wychodzi z miąższu nerki, jest dobrze odgraniczony torebką, rzadko przekracza linię środkową i rzadko zawiera zwapnienia.',
          'Wychodzi ze zwojów współczulnych, przekracza linię pośrodkową ciała i w 85% zawiera zwapnienia w TK/USG.',
          'Objawia się podwyższonym wydalaniem kwasu wanilinomigdałowego (VMA) w dobowej zbiórce moczu.',
          'Daje wczesne przerzuty do kości i szpiku z krwiakami okularowymi (racoon eyes).'
        ],
        correct: 0,
        explanation: 'Guz Wilmsa (Nefroblastoma) rośnie śródnerkowo (objaw claw sign), jest gładki, otorbiony i typowo nie przekracza linii pośrodkowej ciała. Neuroblastoma (nerwiak zarodkowy) wywodzi się z rdzenia nadnercza lub pnia współczulnego, jest guzowaty, nieregularny, oblepia i nacieka naczynia, niemal zawsze przekracza linię środkową, w 85% zawiera zwapnienia i wydziela katecholaminy (VMA/HVA).',
        pearl: 'Zasada badania fizykalnego: Podejrzenie guza Wilmsa to BEZWZGLĘDNY ZAKAZ głębokiej i powtarzanej palpacji brzucha (ryzyko pęknięcia torebki i rozsiewu nowotworu)!'
      }
    }
  ];

  /* Stacje egzaminu praktycznego OSCE – badanie fizykalne i status praesens */
  const OSCE_STATIONS = [
    {
      id: 'stacja-1-odwodnienie',
      number: 1,
      title: 'Stacja 1: 5-miesięczne niemowlę z gorączką i wymiotami',
      shortTitle: 'Odwodnienie niemowlęcia',
      topic: 'Ciężkie odwodnienie / Wstrząs hipowolemiczny / Gorączka u niemowlęcia',
      mods: ['3', '2', '5', '15'],
      patient: {
        name: 'Jaś Kowalczyk',
        age: '5 miesięcy',
        weight: '6.8 kg (wyjściowo 7.5 kg, ubytek 9.3%)',
        gender: 'm',
        avatarType: 'infant',
        vitalsInitial: { hr: 178, rr: 48, bp: '72/42', temp: '38.5°C', crt: '4.0 s', spo2: '97%' }
      },
      briefing: {
        scenario: 'Matka zgłasza się z 5-miesięcznym synem z powodu gorączki do 38.6°C od 2 dni oraz obfitych wymiotów treścią pokarmową po każdej próbie karmienia. Od 12 godzin pieluszka jest całkowicie sucha. Chłopiec jest apatyczny, podsypiający, z trudem nawiązuje kontakt wzrokowy.',
        task: 'Zbierz celowany wywiad od matki, przeprowadź pełne badanie fizykalne na interaktywnej sylwetce niemowlęcia, rozpoznaj stopień odwodnienia, uniknij błędu krytycznego i sformułuj wzorcowy raport Status Praesens.'
      },
      scale: {
        id: "cds_gorelick",
        name: "Clinical Dehydration Scale (CDS) / Skala Gorelicka",
        maxScore: 8,
        unit: "pkt",
        items: [
          {
            id: "stan_ogolny",
            label: "Stan ogólny / zachowanie",
            triggerManeuvers: ["m_stan_swiadomosci"],
            score: 2,
            maxItemScore: 2,
            findingVal: "Apatyczne, podsypiające, letarg (2 pkt)",
            normVal: "Żywe, prawidłowy kontakt (0 pkt)"
          },
          {
            id: "oczy",
            label: "Wygląd gałek ocznych",
            triggerManeuvers: ["m_oczy"],
            score: 2,
            maxItemScore: 2,
            findingVal: "Głęboko zapadnięte w oczodołach (2 pkt)",
            normVal: "Prawidłowo osadzone (0 pkt)"
          },
          {
            id: "sluzowki",
            label: "Wilgotność błon śluzowych jamy ustnej",
            triggerManeuvers: ["m_sluzowki"],
            score: 2,
            maxItemScore: 2,
            findingVal: "Skrajnie suche, spierzchnięte, brak śliny (2 pkt)",
            normVal: "Wilgotne, obfita ślina (0 pkt)"
          },
          {
            id: "lzy",
            label: "Łzy przy płaczu",
            triggerManeuvers: ["m_oczy"],
            triggerQuestions: [3],
            score: 2,
            maxItemScore: 2,
            findingVal: "Płacz całkowicie bezłzowy (2 pkt)",
            normVal: "Obecne łzy (0 pkt)"
          }
        ],
        interpretations: [
          { max: 0, label: "Brak cech odwodnienia (<3%)", color: "var(--green)", tip: "Nawadnianie doustne w domu ORS, edukacja rodziców." },
          { max: 4, label: "Łagodne / umiarkowane odwodnienie (3–6%)", color: "var(--amber)", tip: "Doustny płyn nawadniający (50 ml/kg w 4 h) lub sonda żołądkowa." },
          { max: 8, label: "Ciężkie odwodnienie (>6–9%) / Zagrożenie wstrząsem", color: "var(--red)", tip: "Pilny dostęp naczyniowy i.v./i.o. i bolus krystaloidów 20 ml/kg w 20 minut!" }
        ]
      },
      interview: [
        { q: 'Ile razy dziecko wymiotowało w ciągu ostatniej doby?', a: 'Praktycznie po każdym podaniu piersi lub wody, co najmniej 7-8 razy, chlustało treścią mleczną bez domieszki żółci.', isKey: true },
        { q: 'Kiedy pojawiła się ostatnia mokra pieluszka?', a: 'Wczoraj wieczorem, czyli ponad 12 godzin temu. Pieluszka była prawie sucha z pomarańczowym nalotem moczanów.', isKey: true },
        { q: 'Czy występowała biegunka?', a: 'Dziś rano był tylko jeden mały, wodnisto-śluzowaty stolec.', isKey: false },
        { q: 'Czy dziecko płacze ze łzami?', a: 'Właśnie zauważyłam, że od rana płacze całkowicie bez łez, a usta ma suche jak papier.', isKey: true },
        { q: 'Czy w domu ktoś jeszcze choruje?', a: 'Starszy brat miał 3 dni temu łagodną infekcję kataralną.', isKey: false }
      ],
      zones: [
        {
          id: 'glowa_ciemie',
          name: 'Głowa i ciemiączko',
          icon: '👶',
          x: 48, y: 18,
          maneuvers: [
            { id: 'm_ciemie', label: 'Zbadaj napięcie ciemiączka przedniego', isKey: true, isFatal: false, finding: 'Ciemiączko przednie (2.0 x 2.0 cm) wyraźnie zapadnięte poniżej kości czaszki, tętnienie niewyczuwalne (cecha ciężkiego odwodnienia).', reaction: 'lethargy' },
            { id: 'm_oczy', label: 'Zbadaj gałki oczne i łzawienie', isKey: true, isFatal: false, finding: 'Gałki oczne głęboko zapadnięte w oczodołach, spojówki podsuszone, płacz całkowicie bezłzowy.', reaction: 'lethargy' }
          ]
        },
        {
          id: 'jama_ustna',
          name: 'Jama ustna i gardło',
          icon: '👄',
          x: 48, y: 26,
          maneuvers: [
            { id: 'm_sluzowki', label: 'Oceń wilgotność błon śluzowych jamy ustnej', isKey: true, isFatal: false, finding: 'Błona śluzowa jamy ustnej i język spierzchnięte, matowe, skrajnie suche, brak śliny na dnie jamy ustnej.', reaction: 'cry' },
            { id: 'm_gardlo', label: 'Obejrzyj gardło i migdałki', isKey: false, isFatal: false, finding: 'Błona śluzowa bladoróżowa, migdałki bez obrzęku i bez nalotów.', reaction: 'cry' },
            {
              id: 'm_pojenie_force',
              label: 'Podaj butelkę z glukozą doustnie do wypicia',
              isKey: false,
              isFatal: true,
              fatalMessage: 'BŁĄD KRYTYCZNY! Próba forsownego pojenia doustnego u apatycznego niemowlęcia z uporczywymi wymiotami wywołała zachłyśnięcie treścią żołądkową, kaszel, sinicę obwodową i nagły spadek SpO₂ do 80%!',
              complicationVitals: { hr: 195, rr: 58, bp: '65/35', spo2: '80%', crt: '5.0 s' },
              finding: 'Dziecko dławi się, zachłystuje płynem, sinieje wokół ust, saturacja gwałtownie spada do 80%! Wymaga natychmiastowego odessania i tlenoterapii biernej!',
              reaction: 'crisis'
            }
          ]
        },
        {
          id: 'szyja_opony',
          name: 'Szyja i objawy oponowe',
          icon: '🧣',
          x: 48, y: 32, backX: 48, backY: 26,
          maneuvers: [
            { id: 'm_szyja_opony', label: 'Zbadaj objawy oponowe (sztywność karku, Brudziński)', isKey: true, isFatal: false, finding: 'Brak oporu przy przyginaniu bródki do klatki piersiowej, objaw Brudzińskiego ujemny, ciemię zapadnięte (brak cech ciasnoty i zapalenia opon).', reaction: 'normal' },
            { id: 'm_wezly_szyjne', label: 'Zbadaj węzły chłonne szyjne', isKey: false, isFatal: false, finding: 'Węzły chłonne szyjne drobne, pojedyncze, niebolesne, przesuwalne.', reaction: 'normal' }
          ]
        },
        {
          id: 'klatka_pluca',
          name: 'Klatka piersiowa i płuca',
          icon: '🫁',
          x: 48, y: 40,
          maneuvers: [
            { id: 'm_osluch_pluc', label: 'Osłuchaj pola płucne obustronnie', isKey: true, isFatal: false, finding: 'Szmer pęcherzykowy symetryczny, czysty, brak świstów i rzężeń. Widoczne tachypnoe kompensacyjne (oddech kwasiczy Kussmaula).', reaction: 'normal' },
            { id: 'm_tor_oddechu', label: 'Oceń tor i wysiłek oddechowy', isKey: false, isFatal: false, finding: 'Tor brzuszny, umiarkowane zaciąganie dołka podsercowego, częstość oddechów 48/min.', reaction: 'normal' }
          ]
        },
        {
          id: 'serce_krazenie',
          name: 'Układ krążenia i serce',
          icon: '❤️',
          x: 54, y: 44,
          maneuvers: [
            { id: 'm_osluch_serca', label: 'Osłuchaj tony serca i oceń HR', isKey: true, isFatal: false, finding: 'Czynność serca miarowa, tachykardia 178/min, tony czyste, ciche, bez szmerów patologicznych.', reaction: 'normal' },
            { id: 'm_tetno_udowe', label: 'Zbadaj tętno na tętnicach promieniowych i udowych', isKey: true, isFatal: false, finding: 'Tętno na tętnicach promieniowych nitkowate, bardzo słabo wyczuwalne, na tętnicach udowych symetryczne, osłabione (cecha wstrząsu hipowolemicznego).', reaction: 'lethargy' }
          ]
        },
        {
          id: 'brzuch',
          name: 'Brzuch i narządy',
          icon: '🤰',
          x: 48, y: 55,
          maneuvers: [
            { id: 'm_palpacja_brzucha', label: 'Palpacja powierzchowna i głęboka brzucha', isKey: true, isFatal: false, finding: 'Brzuch miękki, niebolesny, w poziomie powłok, brak oporów patologicznych, objawy otrzewnowe ujemne, wątroba wystaje 1 cm spod łuku żebrowego (norma niemowlęca).', reaction: 'normal' },
            { id: 'm_perystaltyka', label: 'Osłuchaj perystaltykę jelit', isKey: false, isFatal: false, finding: 'Perystaltyka leniwa, rzadka, bez cech metaliczności.', reaction: 'normal' }
          ]
        },
        {
          id: 'skora_turgor',
          name: 'Skóra, turgor i nawrót kapilarny',
          icon: '🖐️',
          x: 35, y: 52,
          maneuvers: [
            { id: 'm_fald_skorny', label: 'Zbadaj fałd skórny na brzuchu', isKey: true, isFatal: false, finding: 'Fałd skórny uniesiony na powłokach brzucha rozprostowuje się bardzo leniwie (>2.5 sekundy) – pewny objaw ciężkiego odwodnienia!', reaction: 'lethargy' },
            { id: 'm_crt', label: 'Zbadaj czas nawrotu kapilarnego (CRT) na mostku', isKey: true, isFatal: false, finding: 'Nawrót kapilarny znacznie wydłużony: 4.0 sekundy (norma <2s). Skóra marmurkowata na obwodzie, chłodne stópki i dłonie.', reaction: 'lethargy' }
          ]
        },
        {
          id: 'moczoplciowe',
          name: 'Narządy płciowe i mikcja',
          icon: '🩲',
          x: 48, y: 68,
          maneuvers: [
            { id: 'm_pielucha_mocz', label: 'Oceń stan pieluszki i okolicy krocza', isKey: true, isFatal: false, finding: 'Pieluszka całkowicie sucha, brak świeżego moczu. Jądra obustronnie w mosznie, ujście cewki prawidłowe, brak cech odparzenia.', reaction: 'normal' }
          ]
        },
        {
          id: 'uklad_nerwowy',
          name: 'Układ nerwowy i kontakt',
          icon: '🧠',
          x: 48, y: 12,
          maneuvers: [
            { id: 'm_stan_swiadomosci', label: 'Oceń stan świadomości i napięcie mięśniowe', isKey: true, isFatal: false, finding: 'Niemowlę letargiczne, podsypiające, reaguje słabym kwileniem dopiero na silny bodziec bólowy, uogólniona wiotkość (hipotonia osiowa).', reaction: 'lethargy' }
          ]
        }
      ],
      synthesis: {
        questionDiagnostic: 'Jakie jest Twoje rozpoznanie główne po zbadaniu niemowlęcia?',
        optionsDiagnostic: [
          { id: 'd1', label: 'Ciężkie odwodnienie (stopień III, ubytek >9% m.c.) zagrażające wstrząsem hipowolemicznym', isCorrect: true, explanation: 'Zapadnięte ciemię, podsuszone gałki bez łez, fałd >2s, CRT 4s, tachykardia 178/min i anuria potwierdzają odwodnienie ciężkie.' },
          { id: 'd2', label: 'Łagodne odwodnienie (stopień I, ubytek <3% m.c.) do leczenia domowego ORS', isCorrect: false, explanation: 'Błędna ocena! Obecność letargu, zapadniętego ciemiączka i CRT 4s wyklucza odwodnienie łagodne.' },
          { id: 'd3', label: 'Ropne zapalenie opon mózgowo-rdzeniowych z ciasnotą śródczaszkową', isCorrect: false, explanation: 'W zapaleniu opon ciemię byłoby napięte i tętniące, a nie głęboko zapadnięte.' }
        ],
        differentialOptions: [
          { id: 'diff1', label: 'Zakażenie układu moczowego (ZUM) jako ognisko gorączki', isCorrect: true },
          { id: 'diff2', label: 'Wirusowy nieżyt żołądkowo-jelitowy (Rotawirus/Norowirus)', isCorrect: true },
          { id: 'diff3', label: 'Wgłobienie jelitowe', isCorrect: false }
        ],
        actionOptions: [
          { id: 'act1', label: 'Natychmiastowe założenie dostępu naczyniowego (i.v. / i.o.) i bolus krystaloidów 20 ml/kg w 20 minut', isCorrect: true },
          { id: 'act2', label: 'Pobranie badań: gazometria, elektrolity, mocznik, kreatynina, glukoza, mocz na posiew cewnikiem', isCorrect: true },
          { id: 'act3', label: 'Wstrzymanie pojenia doustnego do czasu opanowania wymiotów i stabilizacji hemodynamicznej', isCorrect: true },
          { id: 'act_fatal', label: 'Pojenie na siłę doustnym płynem nawadniającym i odesłanie do domu', isCorrect: false, isFatal: true, fatalMessage: 'Dziecko uległo zachłyśnięciu i wstrząsowi hipowolemicznemu!' }
        ]
      },
      statusPraesens: {
        title: 'Status Praesens: 5-miesięczne niemowlę z ciężkim odwodnieniem',
        sections: [
          { num: '1', title: 'Stan ogólny i rozwój fizyczny', content: 'Niemowlę płci męskiej, wiek 5 miesięcy, masa ciała 6.8 kg (wyjściowo 7.5 kg, ubytek masy ciała ok. 9.3%). Stan ogólny ciężki, dziecko letargiczne, podsypiające, kontakt wzrokowy utrudniony, reakcja na bodźce słaba, kwiląca. Budowa ciała prawidłowa, symetryczna.' },
          { num: '2', title: 'Skóra, tkanka podskórna i węzły chłonne', content: 'Skóra blada, marmurkowata na dystalnych częściach kończyn, chłodna. Fałd skórny na powłokach brzusznych rozprostowuje się bardzo leniwie (>2.5 sekundy). Czas nawrotu włośniczkowego (CRT) na mostku wynosi 4.0 sekundy. Węzły chłonne obwodowe (podżuchwowe, szyjne, pachowe, pachwinowe) niewyczuwalne. Brak osutki, wybroczyn i obrzęków.' },
          { num: '3', title: 'Głowa i szyja', content: 'Czaszka kształtna, ciemiączko przednie o wymiarach 2.0 x 2.0 cm, wyraźnie zapadnięte poniżej kości pokrywy czaszki, tętnienie niewyczuwalne. Gałki oczne głęboko zapadnięte w oczodołach, spojówki suche, płacz bezłzowy. Błona śluzowa jamy ustnej i język spierzchnięte, matowe, skrajnie suche, brak śliny. Gardło i migdałki bladoróżowe, bez nalotów. Szyja bez oporów, objawy oponowe ujemne.' },
          { num: '4', title: 'Układ oddechowy i klatka piersiowa', content: 'Klatka piersiowa symetryczna, tor oddechowy brzuszny. Liczba oddechów 48/min (tachypnoe kwasicze). Umiarkowane zaciąganie dołka podsercowego. Opukowo odgłos jawny symetryczny. Osłuchowo nad całymi polami płucnymi szmer pęcherzykowy symetryczny, czysty, bez świstów, furczeń i rzężeń.' },
          { num: '5', title: 'Układ krążenia i serce', content: 'Okolica przedsercowa bez uwypukleń. Czynność serca miarowa, tachykardia 178/min. Tony serca czyste, ciche, dźwięczne, bez szmerów patologicznych. Tętno na tętnicach promieniowych nitkowate, ledwo wyczuwalne, na tętnicach udowych symetryczne, osłabione. Ciśnienie tętnicze 72/42 mmHg (hipotensja).' },
          { num: '6', title: 'Jama brzuszna', content: 'Brzuch w poziomie powłok, symetryczny, miękki, niebolesny palpacyjnie, bez obrony mięśniowej i oporów patologicznych. Objawy otrzewnowe ujemne. Wątroba wystaje 1 cm spod prawego łuku żebrowego, brzeg ostry, elastyczny. Śledziona niewyczuwalna. Perystaltyka jelitowa leniwa, rzadka.' },
          { num: '7', title: 'Narządy moczowo-płciowe', content: 'Pieluszka całkowicie sucha, anuria od ponad 12 godzin. Narządy płciowe męskie uformowane prawidłowo, jądra obustronnie w mosznie, ujście cewki moczowej prawidłowe, okolica odbytu bez odparzeń.' },
          { num: '8', title: 'Układ kostno-stawowy i kończyny', content: 'Kończyny symetryczne, bez obrzęków i deformacji. Ruchomość bierna i czynna w stawach zachowana. Odwodzenie w stawach biodrowych pełne, symetryczne, objawy Ortolaniego i Barlowa ujemne.' },
          { num: '9', title: 'Układ nerwowy i zmysły', content: 'Świadomość obniżona (apatia, letarg), niemowlę reaguje kwileniem dopiero na bodźce bolesne. Napięcie mięśniowe obniżone (wiotkość osiowa). Objawy oponowe (sztywność karku, objaw Brudzińskiego) ujemne. Źrenice równe, okrągłe, prawidłowo reagujące na światło.' }
        ],
        conclusions: 'Rozpoznanie: Ciężkie odwodnienie izoosmotyczne (stopień III) w przebiegu ostrego nieżytu żołądkowo-jelitowego / ZUM, wstrząs hipowolemiczny skompensowany. Pilne zlecenia: dostęp i.v./i.o., bolus krystaloidów 20 ml/kg (136 ml 0.9% NaCl w 20 min), gazometria, jonogram, mocz na posiew cewnikiem.'
      }
    },
    {
      id: 'stacja-2-brzuch',
      number: 2,
      title: 'Stacja 2: 6-letni chłopiec z ostrym bólem brzucha',
      shortTitle: 'Ostry brzuch u 6-latka',
      topic: 'Ostre zapalenie wyrostka robaczkowego / Różnicowanie ostrego brzucha',
      mods: ['1', '5', '2', '10'],
      patient: {
        name: 'Kacper Wiśniewski',
        age: '6 lat',
        weight: '21.0 kg',
        gender: 'm',
        avatarType: 'child',
        vitalsInitial: { hr: 118, rr: 24, bp: '105/65', temp: '38.0°C', crt: '1.5 s', spo2: '99%' }
      },
      briefing: {
        scenario: 'Ojciec zgłasza się z 6-letnim synem z powodu nasilającego się od 14 godzin bólu brzucha. Początkowo ból zlokalizowany był wokół pępka, od 4 godzin przeniósł się do prawego dołu biodrowego. Chłopiec zwymiotował raz treścią żołądkową, odmawia chodzenia i leży na prawym boku z podkurczonymi nogami.',
        task: 'Zbierz celowany wywiad, zbadaj pacjenta ze szczególnym uwzględnieniem manewrów otrzewnowych i wykluczenia innych patologii, sformułuj rozpoznanie i wzorcowy Status Praesens.'
      },
      scale: {
        id: "pas_alvarado",
        name: "Pediatric Appendicitis Score (PAS) / Skala Alvarado",
        maxScore: 10,
        unit: "pkt",
        items: [
          {
            id: "migracja",
            label: "Migracja bólu z pępka do prawego dołu biodrowego",
            triggerQuestions: [0],
            score: 1,
            maxItemScore: 1,
            findingVal: "Obecna – ból przeniósł się do prawego dołu (1 pkt)",
            normVal: "Brak migracji (0 pkt)"
          },
          {
            id: "jadlowstret",
            label: "Jadłowstręt / brak apetytu",
            triggerIntro: true,
            score: 1,
            maxItemScore: 1,
            findingVal: "Obecny – odmawia posiłków i picia (1 pkt)",
            normVal: "Apetyt zachowany (0 pkt)"
          },
          {
            id: "nudnosci",
            label: "Nudności i wymioty",
            triggerIntro: true,
            score: 1,
            maxItemScore: 1,
            findingVal: "Wymiotował treścią pokarmową (1 pkt)",
            normVal: "Brak wymiotów (0 pkt)"
          },
          {
            id: "tkliwosc_pdp",
            label: "Wyraźna bolesność w punkcie McBurneya",
            triggerManeuvers: ["m_mcburney", "m_obrona_miesniowa"],
            score: 2,
            maxItemScore: 2,
            findingVal: "Silna bolesność w punkcie McBurneya (2 pkt)",
            normVal: "Prawy dół niebolesny (0 pkt)"
          },
          {
            id: "obrona_blumberg",
            label: "Objawy otrzewnowe (Blumberg) i obrona mięśniowa",
            triggerManeuvers: ["m_blumberg", "m_obrona_miesniowa"],
            score: 2,
            maxItemScore: 2,
            findingVal: "Dodatni objaw Blumberga i obrona powłok (2 pkt)",
            normVal: "Objawy otrzewnowe ujemne (0 pkt)"
          },
          {
            id: "goraczka",
            label: "Gorączka / temperatura ≥ 37.5°C",
            triggerVitals: true,
            score: 1,
            maxItemScore: 1,
            findingVal: "Temperatura 38.0°C (1 pkt)",
            normVal: "<37.5°C (0 pkt)"
          },
          {
            id: "kaszel_jaworski",
            label: "Ból przy kaszlu / wstrząsach / objaw Jaworskiego",
            triggerManeuvers: ["m_jaworski"],
            triggerQuestions: [1],
            score: 1,
            maxItemScore: 1,
            findingVal: "Ból przy wstrząsach i dodatni objaw Jaworskiego (1 pkt)",
            normVal: "Ujemny objaw Jaworskiego (0 pkt)"
          },
          {
            id: "leukocytoza",
            label: "Leukocytoza >10 000/µl z przesunięciem w lewo",
            triggerLab: true,
            score: 1,
            maxItemScore: 1,
            findingVal: "W toku badań (przewidywana leukocytoza 14.5 tys./µl) (1 pkt)",
            normVal: "W normie (0 pkt)"
          }
        ],
        interpretations: [
          { max: 3, label: "Małe prawdopodobieństwo (≤3 pkt)", color: "var(--green)", tip: "Zapalenie wyrostka mało prawdopodobne, bezpieczna obserwacja ambulatoryjna." },
          { max: 6, label: "Niejednoznaczne (4–6 pkt)", color: "var(--amber)", tip: "Wymaga pilnego USG jamy brzusznej i aktywnej obserwacji chirurgicznej." },
          { max: 10, label: "Wysokie prawdopodobieństwo (≥7 pkt)", color: "var(--red)", tip: "Pilna konsultacja chirurga dziecięcego i przygotowanie do apendektomii!" }
        ]
      },
      interview: [
        { q: 'Gdzie ból zaczął się na początku, a gdzie boli teraz?', a: 'Rano bolało go w okolicach pępka i w dołku, ale od kilku godzin pokazuje dokładnie prawy dolny róg brzucha.', isKey: true },
        { q: 'Czy ból nasila się przy chodzeniu lub wstrząsach?', a: 'Tak, w samochodzie płakał na każdej nierówności drogi, a teraz nie chce w ogóle wstać z kozetki.', isKey: true },
        { q: 'Czy ma objawy dyzuryczne lub ból przy sikaniu?', a: 'Nie, sika normalnie, mocz jasny, nie piecze.', isKey: false },
        { q: 'Czy bolało go gardło w ostatnich dniach?', a: 'Nie, gardło było całkowicie zdrowe, nie miał też kataru ani kaszlu.', isKey: true },
        { q: 'Czy w stolcu była krew lub śluz?', a: 'Nie, wczoraj stolec był prawidłowy, od rana się nie wypróżniał.', isKey: false }
      ],
      zones: [
        {
          id: 'glowa_gardlo',
          name: 'Głowa i gardło',
          icon: '🗣️',
          x: 48, y: 15,
          maneuvers: [
            { id: 'm_gardlo_wyrostek', label: 'Zbadaj gardło i migdałki', isKey: true, isFatal: false, finding: 'Błona śluzowa gardła różowa, migdałki blade, bez powiększenia i nalotów (wyklucza anginę i zapalenie węzłów krezkowych na tle infekcji gardła).', reaction: 'normal' },
            { id: 'm_zapach_acetonu', label: 'Oceń zapach powietrza wydechowego', isKey: true, isFatal: false, finding: 'Brak zapachu acetonu/kwaśnych jabłek, brak cech kwasicy ketonowej DKA.', reaction: 'normal' }
          ]
        },
        {
          id: 'klatka_pluca',
          name: 'Klatka piersiowa i płuca',
          icon: '🫁',
          x: 48, y: 32,
          maneuvers: [
            { id: 'm_osluch_pluc_dol', label: 'Osłuchaj dolne pola płucne obustronnie', isKey: true, isFatal: false, finding: 'Szmer pęcherzykowy symetryczny, czysty nad obydwoma płucami, brak stłumienia i rzężeń u podstawy (wyklucza zapalenie dolnego płata prawego płuca).', reaction: 'normal' }
          ]
        },
        {
          id: 'serce',
          name: 'Układ krążenia',
          icon: '❤️',
          x: 54, y: 35,
          maneuvers: [
            { id: 'm_serce_norma', label: 'Osłuchaj czynność serca', isKey: false, isFatal: false, finding: 'Czynność serca miarowa, HR 118/min (tachykardia skojarzona z bólem i temperaturą 38.0°C), tony czyste.', reaction: 'normal' }
          ]
        },
        {
          id: 'brzuch_ogladanie',
          name: 'Brzuch – oglądanie i osłuchiwanie',
          icon: '👁️',
          x: 48, y: 48,
          maneuvers: [
            { id: 'm_ogladanie_brzucha', label: 'Oceń wysklepienie i ruchomość oddechową powłok', isKey: true, isFatal: false, finding: 'Brzuch symetryczny, w poziomie powłok, ruchomość oddechowa w prawym dole biodrowym wyraźnie osłabiona (ochrona powłok przed ruchem).', reaction: 'pain' },
            { id: 'm_osluch_brzucha', label: 'Osłuchaj perystaltykę jelit', isKey: true, isFatal: false, finding: 'Szmery perystaltyczne znacznie ściszone, leniwe, w prawym dolnym kwadrancie niemal niesłyszalne.', reaction: 'pain' }
          ]
        },
        {
          id: 'brzuch_palpacja',
          name: 'Brzuch – palpacja i objawy otrzewnowe',
          icon: '⚡',
          x: 58, y: 55, backX: 58, backY: 52,
          maneuvers: [
            { id: 'm_obrona_miesniowa', label: 'Palpacja powierzchowna powłok brzusznych', isKey: true, isFatal: false, finding: 'Miejscowa obrona mięśniowa (défense musculaire) wyczuwalna w prawym dole biodrowym. Pacjent napina powłoki przy próbie dotknięcia.', reaction: 'pain' },
            { id: 'm_mcburney', label: 'Zbadaj bolesność w punkcie McBurneya', isKey: true, isFatal: false, finding: 'Ostry ból przy ucisku w punkcie McBurneya (1/3 odległości od kolca biodrowego do pępka). Chłopiec krzyczy z bólu i cofa miednicę.', reaction: 'cry' },
            { id: 'm_blumberg', label: 'Zbadaj objaw Blumberga (otrzewnowy)', isKey: true, isFatal: false, finding: 'DODATNI OBJAW BLUMBERGA! Gwałtowne zwolnienie ucisku w prawym dole biodrowym wywołuje przeszywający ból (podrażnienie otrzewnej ściennej).', reaction: 'cry' },
            { id: 'm_rovsing', label: 'Zbadaj objaw Rovsinga', isKey: true, isFatal: false, finding: 'DODATNI OBJAW ROVSINGA: Ucisk w lewym dole biodrowym wywołuje ból w prawym dole biodrowym wskutek przemieszczenia gazów w okrężnicy.', reaction: 'pain' },
            { id: 'm_jaworski', label: 'Zbadaj objaw Jaworskiego (psoas sign)', isKey: true, isFatal: false, finding: 'DODATNI OBJAW JAWORSKIEGO: Uniesienie wyprostowanej prawej kończyny dolnej z jednoczesnym uciskiem w prawym dole nasila ból (wyrostek zakątniczy).', reaction: 'pain' },
            { id: 'm_goldflam', label: 'Zbadaj objaw Goldflama obustronnie', isKey: false, isFatal: false, finding: 'Objaw Goldflama obustronnie ujemny, okolica lędźwiowa niebolesna.', reaction: 'normal' }
          ]
        },
        {
          id: 'narzady_plciowe',
          name: 'Narządy płciowe i moszna',
          icon: '🩲',
          x: 48, y: 68,
          maneuvers: [
            { id: 'm_moszna', label: 'Zbadaj jądra i mosznę obustronnie', isKey: true, isFatal: false, finding: 'Jądra prawidłowo w mosznie, symetryczne, bez obrzęku, bez zaczerwienienia, niebolesne. Brak cech skrętu jądra ani przyczepka jądra!', reaction: 'normal' },
            {
              id: 'm_pomin_moszne',
              label: 'Zaniechaj badania moszny i podaj dożylnie morfinę przed chirurgiem',
              isKey: false,
              isFatal: true,
              fatalMessage: 'BŁĄD KRYTYCZNY! Podanie silnych opioidów bez zbadania moszny i bez wcześniejszej konsultacji chirurga zamaskowało objawy otrzewnowe, opóźniło operację i doprowadziło do perforacji wyrostka z rozlanym zapaleniem otrzewnej!',
              complicationVitals: { hr: 145, rr: 32, bp: '85/50', temp: '39.4°C', crt: '3.0 s' },
              finding: 'Brzuch staje się deskowaty, gorączka rośnie do 39.4°C, rozlane zapalenie otrzewnej i wstrząs septyczny!',
              reaction: 'crisis'
            }
          ]
        },
        {
          id: 'skora_konczyny',
          name: 'Skóra i kończyny',
          icon: '🦵',
          x: 35, y: 78,
          maneuvers: [
            { id: 'm_skora_wybroczyny', label: 'Oglądanie skóry pośladków i kończyn dolnych', isKey: true, isFatal: false, finding: 'Skóra czysta, bez plamicy, bez wybroczyn, stawy kolanowe i skokowe bez obrzęków (wykluczenie plamicy Schönleina-Henocha IgAV).', reaction: 'normal' }
          ]
        }
      ],
      synthesis: {
        questionDiagnostic: 'Jakie jest najbardziej prawdopodobne rozpoznanie kliniczne?',
        optionsDiagnostic: [
          { id: 'd1', label: 'Ostre zapalenie wyrostka robaczkowego (Appendicitis acuta)', isCorrect: true, explanation: 'Klasyczna triada: ból okołopępkowy wędrujący do prawego dołu biodrowego, objaw Blumberga, Rovsinga i Jaworskiego oraz obrona mięśniowa.' },
          { id: 'd2', label: 'Ostre zapalenie węzłów krezkowych (Adenitis mesenterica)', isCorrect: false, explanation: 'Przemawiałby wywiad niedawnej infekcji gardła i brak wyraźnych objawów otrzewnowych.' },
          { id: 'd3', label: 'Skręt jądra prawego z promieniowaniem do brzucha', isCorrect: false, explanation: 'Badanie moszny było całkowicie prawidłowe.' }
        ],
        differentialOptions: [
          { id: 'diff1', label: 'Zapalenie uchyłka Meckela', isCorrect: true },
          { id: 'diff2', label: 'Adenitis mesenterica (zapalenie węzłów krezkowych)', isCorrect: true },
          { id: 'diff3', label: 'Kwasica ketonowa w cukrzycy typu 1 (Pseudoperitonitis diabetica)', isCorrect: true }
        ],
        actionOptions: [
          { id: 'act1', label: 'Pilna konsultacja chirurga dziecięcego i przygotowanie do zabiegu operacyjnego', isCorrect: true },
          { id: 'act2', label: 'Zlecenie USG jamy brzusznej (ocena średnicy wyrostka >6 mm, brak podatności na ucisk)', isCorrect: true },
          { id: 'act3', label: 'Dostęp naczyniowy i.v., nawodnienie krystaloidami, bezwzględna dieta ścisła (na czczo)', isCorrect: true }
        ]
      },
      statusPraesens: {
        title: 'Status Praesens: 6-letni chłopiec z ostrym zapaleniem wyrostka robaczkowego',
        sections: [
          { num: '1', title: 'Stan ogólny i rozwój fizyczny', content: 'Chłopiec w wieku 6 lat, masa ciała 21 kg. Stan ogólny średnio ciężki, dziecko cierpiące, leży na prawym boku z podkurczonymi kończynami dolnymi, unika zmiany pozycji i poruszania się. Świadomość pełna, kontakt logiczny zachowany.' },
          { num: '2', title: 'Skóra, tkanka podskórna i węzły chłonne', content: 'Skóra czysta, różowa, ucieplona prawidłowo, nawrót kapilarny CRT 1.5 sekundy. Brak wykwitów, plamicy i wybroczyn na skórze pośladków i kończyn dolnych. Węzły chłonne obwodowe niewyczuwalne.' },
          { num: '3', title: 'Głowa i szyja', content: 'Czaszka prawidłowa, gałki oczne ułożone symetrycznie, spojówki różowe, źrenice równe z prawidłową reakcją na światło. Błona śluzowa jamy ustnej wilgotna, język z delikatnym białym nalotem. Gardło i migdałki blade, bez cech infekcji. Brak zapachu acetonu. Szyja ruchoma, objawy oponowe ujemne.' },
          { num: '4', title: 'Układ oddechowy i klatka piersiowa', content: 'Klatka piersiowa kształtna, symetryczna. Liczba oddechów 24/min. Odgłos opukowy jawny nad całymi płucami. Osłuchowo szmer pęcherzykowy symetryczny, prawidłowy, brak rzężeń i świstów (brak cech zapalenia płuc u podstawy).' },
          { num: '5', title: 'Układ krążenia i serce', content: 'Czynność serca miarowa, HR 118/min (tachykardia bólowa/gorączkowa). Tony serca czyste, dźwięczne, bez szmerów patologicznych. Tętno na tętnicach promieniowych i udowych symetryczne, dobrze wypełnione. Ciśnienie tętnicze 105/65 mmHg.' },
          { num: '6', title: 'Jama brzuszna', content: 'Brzuch w poziomie powłok, symetryczny, słabiej ruchomy oddechowo w prawym dolnym kwadrancie. Osłuchowo perystaltyka leniwa, ściszona. Palpacyjnie wyczuwalna miejscowa obrona mięśniowa w prawym dole biodrowym. Wybitna bolesność w punkcie McBurneya. Objaw Blumberga DODATNI w prawym dole biodrowym. Objaw Rovsinga DODATNI. Objaw Jaworskiego (psoas) DODATNI. Objaw Goldflama obustronnie ujemny. Wątroba i śledziona niepowiększone.' },
          { num: '7', title: 'Narządy moczowo-płciowe', content: 'Narządy płciowe męskie prawidłowe. Jądra obustronnie w worku mosznowym, symetryczne, niebolesne, bez obrzęku i bez zaczerwienienia skóry moszny (wykluczono skręt jądra i przyczepka).' },
          { num: '8', title: 'Układ kostno-stawowy i kończyny', content: 'Kończyny symetryczne, stawy kolanowe i skokowe bez obrzęków i bolesności. Ruchomość w stawach zachowana.' },
          { num: '9', title: 'Układ nerwowy i zmysły', content: 'Świadomość pełna, zorientowany w miejscu i czasie. Objawy oponowe ujemne. Objawy ogniskowe ujemne.' }
        ],
        conclusions: 'Rozpoznanie: Ostre zapalenie wyrostka robaczkowego (Appendicitis acuta). Pilne postępowanie: konsultacja chirurga dziecięcego, USG jamy brzusznej, morfologia z rozmazem, CRP, mocz ogólny, kaniula i.v., płynoterapia krystaloidowa, dieta ścisła.'
      }
    },
    {
      id: 'stacja-3-krup',
      number: 3,
      title: 'Stacja 3: 3-letnia dziewczynka z dusznością i szczekającym kaszlem',
      shortTitle: 'Krup (podgłośniowe ZK)',
      topic: 'Ostra duszność krtaniowa / Skala Westleya / Epiglottitis vs Krup',
      mods: ['2', '5'],
      patient: {
        name: 'Zosia Dąbrowska',
        age: '3 lata',
        weight: '14.5 kg',
        gender: 'f',
        avatarType: 'child',
        vitalsInitial: { hr: 135, rr: 38, bp: '100/60', temp: '38.2°C', crt: '1.5 s', spo2: '94%' }
      },
      briefing: {
        scenario: 'Matka przywiozła na ostry dyżur 3-letnią córkę o 2:00 w nocy. Dziecko obudziło się z nagłym, głośnym szczekającym kaszlem, chrypką i świszczącym oddechem. Dziewczynka siedzi wtulona w matkę, oddycha z wyraźnym wysiłkiem.',
        task: 'Oceń pacjentkę wg trójkąta PAT i skali Westleya, przeprowadź badanie fizykalne unikając błędu zagrażającego obturacją, rozpoznaj krup i wygeneruj profesjonalny Status Praesens.'
      },
      scale: {
        id: "westley_croup",
        name: "Skala Ciężkości Krupu wg Westleya (Westley Score)",
        maxScore: 17,
        unit: "pkt",
        items: [
          {
            id: "stridor",
            label: "Stridor wdechowy",
            triggerManeuvers: ["m_stridor_ocena"],
            score: 2,
            maxItemScore: 2,
            findingVal: "Obecny w spoczynku (2 pkt) [0=brak, 1=przy płaczu, 2=w spoczynku]",
            normVal: "Brak stridoru (0 pkt)"
          },
          {
            id: "zaciaganie",
            label: "Zaciąganie ścian klatki piersiowej",
            triggerManeuvers: ["m_zaciaganie_retractions"],
            score: 2,
            maxItemScore: 3,
            findingVal: "Umiarkowane zaciąganie dołka i żeber (2 pkt) [0=brak, 1=dyskretne, 2=umiarkowane, 3=ciężkie]",
            normVal: "Brak zaciągania (0 pkt)"
          },
          {
            id: "wentylacja",
            label: "Wentylacja / szmer pęcherzykowy",
            triggerManeuvers: ["m_osluch_pluc_krup"],
            score: 0,
            maxItemScore: 2,
            findingVal: "Prawidłowa wentylacja obustronna (0 pkt) [0=prawidłowa, 1=ściszona, 2=znacznie osłabiona]",
            normVal: "Prawidłowa (0 pkt)"
          },
          {
            id: "sinica",
            label: "Sinica (Cyanosis)",
            triggerManeuvers: ["m_pat_ocena"],
            score: 0,
            maxItemScore: 5,
            findingVal: "Brak sinicy, skóra różowa (0 pkt) [0=brak, 4=przy płaczu, 5=w spoczynku]",
            normVal: "Brak sinicy (0 pkt)"
          },
          {
            id: "swiadomosc",
            label: "Stan świadomości",
            triggerManeuvers: ["m_pat_ocena"],
            score: 0,
            maxItemScore: 5,
            findingVal: "Prawidłowa świadomość, niepokój (0 pkt) [0=prawidłowa, 5=apatia/letarg]",
            normVal: "Prawidłowa (0 pkt)"
          }
        ],
        interpretations: [
          { max: 2, label: "Łagodny krup (≤2 pkt)", color: "var(--green)", tip: "Deksametazon p.o. 0.15 mg/kg, chłodne nawilżone powietrze, leczenie domowe." },
          { max: 5, label: "Umiarkowany krup (3–5 pkt)", color: "var(--amber)", tip: "Deksametazon p.o./i.m. + nebulizacja z L-Adrenaliny 1:1000 (0.5 ml/kg), obserwacja min. 2–4 h." },
          { max: 11, label: "Ciężki krup (6–11 pkt)", color: "var(--red)", tip: "Deksametazon i.v./i.m. + natychmiastowa adrenalina w nebulizacji z tlenem, hospitalizacja." },
          { max: 17, label: "Zagrażająca niewydolność oddechowa (≥12 pkt)", color: "var(--red)", tip: "OIOM dziecięcy, przygotowanie do intubacji (rurka o 0.5–1 mm mniejsza)." }
        ]
      },
      interview: [
        { q: 'O której godzinie i jak nagle wystąpiły objawy?', a: 'Około północy. W dzień miała tylko lekki katarek, a nagle w nocy obudził ją szczekający kaszel i świst.', isKey: true },
        { q: 'Czy dziecko połyka ślinę, czy ma ślinotok?', a: 'Połyka normalnie, piła wodę godzinę temu, nie ślini się.', isKey: true },
        { q: 'Czy była szczepiona przeciwko Hib (Haemophilus influenzae typu b)?', a: 'Tak, zgodnie z kalendarzem szczepień otrzymała wszystkie dawki.', isKey: true },
        { q: 'Czy wcześniej miała już podobne epizody?', a: 'W zeszłym roku w zimie miała podobny kaszel, lekarz w przychodni podał jej wtedy steryd wziewny i przeszło.', isKey: false }
      ],
      zones: [
        {
          id: 'ogladanie_pat',
          name: 'Trójkąt Oceny Pediatrycznej (PAT)',
          icon: '📐',
          x: 48, y: 12,
          maneuvers: [
            { id: 'm_pat_ocena', label: 'Oceń wygląd, pracę oddechową i krążenie (PAT)', isKey: true, isFatal: false, finding: 'PAT: Wygląd – dziecko przytomne, zaniepokojone, reaguje na matkę; Praca oddechowa – wzmożona (zaciąganie, stridor); Krążenie – różowe zabarwienie skóry.', reaction: 'normal' }
          ]
        },
        {
          id: 'jama_ustna_szpatulka',
          name: 'Jama ustna i gardło',
          icon: '👄',
          x: 48, y: 22,
          maneuvers: [
            {
              id: 'm_szpatulka_fatal',
              label: 'Włóż szpatułkę głęboko do gardła, aby obejrzeć nagłośnię',
              isKey: false,
              isFatal: true,
              fatalMessage: 'BŁĄD KRYTYCZNY! Próba badania gardła szpatułką u małego dziecka z ostrą dusznością krtaniową wywołała odruchowy skurcz krtani, całkowitą obturację, sinicę i spadek SpO₂ do 78%! Zagrożenie nagłym zatrzymaniem krążenia!',
              complicationVitals: { hr: 165, rr: 52, bp: '85/50', spo2: '78%', crt: '3.0 s' },
              finding: 'Dziecko gwałtownie sinieje, przestaje oddychać, zaciąga krtań, saturacja spada do 78%! Wymaga natychmiastowej L-adrenaliny i wentylacji workiem z maską!',
              reaction: 'crisis'
            },
            { id: 'm_ogladanie_bezinwazyjne', label: 'Bezinwazyjne oglądanie jamy ustnej bez przyborów', isKey: true, isFatal: false, finding: 'Błona śluzowa różowa, brak ślinotoku, brak przymusowej pozycji pochylonej („wąchającej”), migdałki bez masywnego obrzęku.', reaction: 'normal' }
          ]
        },
        {
          id: 'szyja_stridor',
          name: 'Szyja i stridor krtaniowy',
          icon: '🗣️',
          x: 48, y: 28,
          maneuvers: [
            { id: 'm_stridor_ocena', label: 'Oceń fazę i głośność stridoru', isKey: true, isFatal: false, finding: 'Wyraźny stridor wdechowy obecny w spoczynku, głośniejszy przy płaczu i niepokoju. Głos z cechami chrypki, kaszel typowo szczekający.', reaction: 'cry' }
          ]
        },
        {
          id: 'klatka_oddech',
          name: 'Klatka piersiowa i płuca',
          icon: '🫁',
          x: 48, y: 38,
          maneuvers: [
            { id: 'm_zaciaganie_retractions', label: 'Oceń zaciąganie klatki piersiowej', isKey: true, isFatal: false, finding: 'Umiarkowane zaciąganie dołka podsercowego, dołka jarzmowego oraz przestrzeni międzyżebrowych przy każdym wdechu.', reaction: 'pain' },
            { id: 'm_osluch_pluc_krup', label: 'Osłuchaj pola płucne', isKey: true, isFatal: false, finding: 'Głośne przewodzenie stridoru z krtani nad całą klatkę piersiową; szmer pęcherzykowy symetryczny, obustronny, brak rzężeń i świstów wydechowych.', reaction: 'normal' },
            { id: 'm_westley_score', label: 'Oblicz punktację w skali Westleya', isKey: true, isFatal: false, finding: 'Skala Westleya: Stridor w spoczynku (2) + Zaciąganie umiarkowane (2) + Wentylacja prawidłowa (0) + Sinica brak (0) + Świadomość prawidłowa (0) = 4 pkt (Krup umiarkowany).', reaction: 'normal' }
          ]
        },
        {
          id: 'serce_krążenie',
          name: 'Układ krążenia',
          icon: '❤️',
          x: 54, y: 42,
          maneuvers: [
            { id: 'm_serce_krup', label: 'Osłuchaj serce i oceń nawrót kapilarny CRT', isKey: false, isFatal: false, finding: 'Tony serca czyste, miarowe, HR 135/min (tachykardia w reakcji na niepokój i duszność), CRT 1.5 sekundy.', reaction: 'normal' }
          ]
        },
        {
          id: 'brzuch_spokoj',
          name: 'Brzuch i układ ruchowy',
          icon: '🤰',
          x: 48, y: 55,
          maneuvers: [
            { id: 'm_brzuch_krup', label: 'Zbadaj brzuch na kolanach matki', isKey: false, isFatal: false, finding: 'Brzuch miękki, niebolesny, bez oporów patologicznych, brak powiększenia narządów.', reaction: 'normal' }
          ]
        }
      ],
      synthesis: {
        questionDiagnostic: 'Jakie jest rozpoznanie kliniczne i stopień nasilenia wg skali Westleya?',
        optionsDiagnostic: [
          { id: 'd1', label: 'Podgłośniowe zapalenie krtani (Krup wirusowy) o nasileniu umiarkowanym (Westley 4 pkt)', isCorrect: true, explanation: 'Szczekający kaszel w nocy, stridor w spoczynku, chrypka i zaciąganie bez ślinotoku to klasyczny krup wirusowy.' },
          { id: 'd2', label: 'Ostre zapalenie nagłośni (Epiglottitis acuta)', isCorrect: false, explanation: 'Przeciw epiglottitis przemawia: szczepienie Hib, brak ślinotoku, brak pozycji wąchającej i możliwość przełykania.' },
          { id: 'd3', label: 'Zaostrzenie astmy oskrzelowej z dusznością wydechową', isCorrect: false, explanation: 'W krupie duszność jest wdechowa (stridor), w astmie wydechowa (furczenia, świsty).' }
        ],
        differentialOptions: [
          { id: 'diff1', label: 'Ciało obce w krtani/tchawicy', isCorrect: true },
          { id: 'diff2', label: 'Ostre zapalenie nagłośni (Epiglottitis)', isCorrect: true },
          { id: 'diff3', label: 'Ropień zagardłowy', isCorrect: true }
        ],
        actionOptions: [
          { id: 'act1', label: 'Pozostawienie dziecka na kolanach matki (minimalizacja stresu)', isCorrect: true },
          { id: 'act2', label: 'Deksametazon doustnie lub domięśniowo (0.15–0.6 mg/kg, jednorazowo)', isCorrect: true },
          { id: 'act3', label: 'Nebulizacja z L-adrenaliny 1:1000 (0.5 mg/kg, max 5 mg) pod kontrolą kardiomonitora', isCorrect: true },
          { id: 'act_fatal', label: 'Przymusowe położenie dziecka i głębokie badanie gardła szpatułką', isCorrect: false, isFatal: true, fatalMessage: 'Wywołało całkowite zablokowanie krtani!' }
        ]
      },
      statusPraesens: {
        title: 'Status Praesens: 3-letnia dziewczynka z podgłośniowym zapaleniem krtani (Krup)',
        sections: [
          { num: '1', title: 'Stan ogólny i rozwój fizyczny', content: 'Dziewczynka w wieku 3 lat, masa ciała 14.5 kg. Stan ogólny średnio ciężki, dziecko zaniepokojone, siedzi na kolanach matki. Świadomość pełna, kontakt logiczny zachowany, kaszel głośny, szczekający, chrypka.' },
          { num: '2', title: 'Skóra, tkanka podskórna i węzły chłonne', content: 'Skóra różowa, ciepła, bez cech sinicy obwodowej i centralnej. Czas nawrotu kapilarnego CRT 1.5 sekundy. Brak osutki i wybroczyn. Węzły chłonne szyjne drobne, niebolesne.' },
          { num: '3', title: 'Głowa i szyja', content: 'Czaszka prawidłowa. Błona śluzowa jamy ustnej różowa, wilgotna, brak ślinotoku. Oglądanie gardła bez przyborów nie wykazuje zmian zapalnych. Szyja ruchoma symetrycznie. Słyszalny głośny stridor wdechowy w spoczynku, nasilający się przy płaczu.' },
          { num: '4', title: 'Układ oddechowy i klatka piersiowa', content: 'Klatka piersiowa symetryczna. Liczba oddechów 38/min (tachypnoe). Widoczne umiarkowane zaciąganie dołka podsercowego, dołka jarzmowego i przestrzeni międzyżebrowych. Osłuchowo obustronnie szmer pęcherzykowy symetryczny z przewodzeniem stridoru z górnych dróg oddechowych, bez rzężeń i świstów wydechowych. Punktacja w skali Westleya: 4 punkty (krup umiarkowany).' },
          { num: '5', title: 'Układ krążenia i serce', content: 'Czynność serca miarowa, HR 135/min. Tony serca czyste, dźwięczne, bez szmerów. Tętno obwodowe symetryczne, dobrze wypełnione. Saturacja SpO2 94% na powietrzu atmosferycznym.' },
          { num: '6', title: 'Jama brzuszna', content: 'Brzuch miękki, w poziomie powłok, niebolesny, bez oporów patologicznych i objawów otrzewnowych. Wątroba i śledziona w normie. Perystaltyka prawidłowa.' },
          { num: '7', title: 'Narządy moczowo-płciowe', content: 'Prawidłowe dla wieku i płci, bez odchyleń.' },
          { num: '8', title: 'Układ kostno-stawowy i kończyny', content: 'Kończyny symetryczne, bez obrzęków i deformacji, ruchomość w stawach zachowana.' },
          { num: '9', title: 'Układ nerwowy i zmysły', content: 'Świadomość zachowana, dziecko zorientowane, reagujące na otoczenie. Objawy oponowe ujemne.' }
        ],
        conclusions: 'Rozpoznanie: Podgłośniowe zapalenie krtani (Laryngotracheobronchitis acuta - Krup wirusowy), 4 pkt w skali Westleya (umiarkowany). Zlecenia: deksametazon p.o. 0.15 mg/kg (2.2 mg jednorazowo), chłodne nawilżone powietrze, w razie braku poprawy nebulizacja z L-adrenaliny 1:1000 (4 ml).'
      }
    },
    {
      id: 'stacja-4-igav',
      number: 4,
      title: 'Stacja 4: 10-letni chłopiec z plamicą i bólem stawów',
      shortTitle: 'Plamica Schönleina-Henocha (IgAV)',
      topic: 'Zapalenie naczyń IgAV / Nefropatia / Różnicowanie wybroczyn ze skazami',
      mods: ['12', '4', '1', '15'],
      patient: {
        name: 'Michał Zieliński',
        age: '10 lat',
        weight: '34.0 kg',
        gender: 'm',
        avatarType: 'child',
        vitalsInitial: { hr: 88, rr: 18, bp: '128/82', temp: '37.3°C', crt: '1.5 s', spo2: '99%' }
      },
      briefing: {
        scenario: 'Matka zgłasza się z 10-letnim synem z powodu uniesionej, plamistej wysypki na pośladkach i nogach, która pojawiła się wczoraj, oraz nasilającego się bólu obu stawów skokowych utrudniającego chodzenie. Przed 10 dniami przebył zapalenie gardła leczone objawowo.',
        task: 'Przeprowadź pełne badanie fizykalne, oceń charakter wykwitów, ciśnienie tętnicze oraz mocz, uniknij pominięcia powikłania nerkowego i przygotuj wzorcowy raport Status Praesens.'
      },
      scale: {
        id: "eular_printo_pres",
        name: "Kryteria EULAR/PRINTO/PRES dla IgAV (Schönlein-Henoch)",
        maxScore: 4,
        unit: "kryteria",
        items: [
          {
            id: "purpura_obowiazkowa",
            label: "Kryterium bezwzględne: Uniesiona plamica (purpura palpabilis)",
            triggerManeuvers: ["m_purpura_palpabilis"],
            isMandatory: true,
            score: 1,
            maxItemScore: 1,
            findingVal: "SPEŁNIONE – symetryczna purpura palpabilis na kończynach dolnych i pośladkach",
            normVal: "Brak plamicy"
          },
          {
            id: "brzuch_kryterium",
            label: "Kryterium dodatkowe 1: Rozlany ból brzucha o ostrym początku",
            triggerManeuvers: ["m_brzuch_palpacja_igav"],
            triggerQuestions: [1],
            isMandatory: false,
            score: 1,
            maxItemScore: 1,
            findingVal: "SPEŁNIONE – kurczowe bóle okołopępkowe",
            normVal: "Brak bólów brzucha"
          },
          {
            id: "stawy_kryterium",
            label: "Kryterium dodatkowe 2: Zapalenie / bolesność stawów (Arthritis/Arthralgia)",
            triggerManeuvers: ["m_stawy_badanie"],
            isMandatory: false,
            score: 1,
            maxItemScore: 1,
            findingVal: "SPEŁNIONE – obustronny obrzęk i bolesność stawów skokowych",
            normVal: "Stawy bez zmian"
          },
          {
            id: "nerki_kryterium",
            label: "Kryterium dodatkowe 3: Zajęcie nerek (krwinkomocz / białkomocz / NT)",
            triggerManeuvers: ["m_mocz_stix", "m_pomiar_rr"],
            isMandatory: false,
            score: 1,
            maxItemScore: 1,
            findingVal: "SPEŁNIONE – erytrocyty +++, białkomocz ++, RR podwyższone (128/82 mmHg)",
            normVal: "Mocz prawidłowy"
          }
        ],
        interpretations: [
          { max: 1, label: "Kryteria niespełnione (<2 kryteriów)", color: "var(--amber)", tip: "Wymaga obecności plamicy uniesionej oraz co najmniej jednego kryterium dodatkowego." },
          { max: 4, label: "KRYTERIA IgAV SPEŁNIONE (Plamica + kryteria narządowe)", color: "var(--green)", tip: "Potwierdzone zapalenie naczyń związane z IgA. Obowiązkowe cotygodniowe monitorowanie nerek (mocz, RR)." }
        ]
      },
      interview: [
        { q: 'Czy wykwity bledną pod uciskiem szklanką?', a: 'Sprawdzałam szklanką w domu – plamki w ogóle nie znikają, a pod palcem czuć je jak drobne grudki.', isKey: true },
        { q: 'Czy chłopiec skarży się na ból brzucha?', a: 'Tak, od rana narzeka na kurczowy ból w okolicach pępka, ale nie wymiotował.', isKey: true },
        { q: 'Jaki kolor ma mocz dziecka?', a: 'Dziś rano mocz był ciemniejszy niż zwykle, jakby lekko podbarwiony herbatą.', isKey: true },
        { q: 'Czy miał gorączkę lub dreszcze?', a: 'Nie, temperatura nie przekraczała 37.3°C, czuje się ogólnie w miarę dobrze poza bólem nóg.', isKey: false }
      ],
      zones: [
        {
          id: 'skora_plamica',
          name: 'Skóra – ocena osutki i wybroczyn',
          icon: '🟣',
          x: 35, y: 72, backX: 48, backY: 64,
          maneuvers: [
            { id: 'm_purpura_palpabilis', label: 'Zbadaj wykwity na kończynach dolnych i pośladkach', isKey: true, isFatal: false, finding: 'Symetryczna, uniesiona plamica (purpura palpabilis) – wyczuwalne palpacyjnie grudki i plamki krwotoczne na pośladkach, udach i podudziach. Nie bledną pod uciskiem.', reaction: 'normal' },
            { id: 'm_skora_tulow', label: 'Obejrzyj skórę tułowia, klatki piersiowej i twarzy', isKey: true, isFatal: false, finding: 'Tułów, twarz i kończyny górne całkowicie wolne od wykwitów (wyklucza uogólnioną plamicę piorunującą w sepsie meningokokowej).', reaction: 'normal' }
          ]
        },
        {
          id: 'stawy_skokowe',
          name: 'Stawy skokowe i kolanowe',
          icon: '🦵',
          x: 48, y: 84, backX: 48, backY: 86,
          maneuvers: [
            { id: 'm_stawy_badanie', label: 'Zbadaj stawy skokowe i kolanowe obustronnie', isKey: true, isFatal: false, finding: 'Obustronny obrzęk i bolesność uciskowa stawów skokowych, ruchomość czynna ograniczona z powodu bólu, brak ucieplenia i zaczerwienienia (jałowe zapalenie naczyń okołostawowych).', reaction: 'pain' }
          ]
        },
        {
          id: 'brzuch_igav',
          name: 'Jama brzuszna',
          icon: '🤰',
          x: 48, y: 52, backX: 30, backY: 52,
          maneuvers: [
            { id: 'm_brzuch_palpacja_igav', label: 'Palpacja brzucha i ocena pod kątem wgłobienia', isKey: true, isFatal: false, finding: 'Brzuch miękki, umiarkowanie tkliwy w okolicy pępka, perystaltyka zachowana, brak objawów otrzewnowych, brak wyczuwalnego oporu w kształcie kiełbaski (brak wgłobienia jelita).', reaction: 'pain' }
          ]
        },
        {
          id: 'cisnienie_tetnicze',
          name: 'Pomiar ciśnienia tętniczego',
          icon: '🩺',
          x: 30, y: 44, backX: 25, backY: 44,
          maneuvers: [
            { id: 'm_pomiar_rr', label: 'Zmierz ciśnienie tętnicze na ramieniu odpowiednim mankietem', isKey: true, isFatal: false, finding: 'Ciśnienie tętnicze 128/82 mmHg – PODWYŻSZONE (>95. centyla dla wieku, płci i wzrostu!). Wskazuje na zajęcie nerek w przebiegu IgAV.', reaction: 'normal' }
          ]
        },
        {
          id: 'badanie_moczu_stix',
          name: 'Badanie ogólne moczu (test paskowy)',
          icon: '🧪',
          x: 65, y: 65, backX: 72, backY: 65,
          maneuvers: [
            { id: 'm_mocz_stix', label: 'Wykonaj test paskowy moczu (stix)', isKey: true, isFatal: false, finding: 'KRWINKOMOCZ (erytrocyty +++) oraz BIAŁKOMOCZ (++ ok. 1.0 g/l). Cechy kłębuszkowego zapalenia nerek (nefropatia IgA)!', reaction: 'normal' },
            {
              id: 'm_pomin_rr_mocz',
              label: 'Zaniechaj badania moczu i ciśnienia, zdiagnozuj alergię pokarmową i wypisz',
              isKey: false,
              isFatal: true,
              fatalMessage: 'BŁĄD KRYTYCZNY! Pominięcie badania ciśnienia i moczu doprowadziło do nierozpoznania nefropatii IgA i rozwoju gwałtownie postępującego KZN z obrzękami i encefalopatią nadciśnieniową (RR 160/105 mmHg)!',
              complicationVitals: { hr: 98, rr: 20, bp: '160/105', crt: '2.0 s' },
              finding: 'Chłopiec rozwija masywne obrzęki powiek, silny ból głowy, ciśnienie skacze do 160/105 mmHg (encefalopatia nadciśnieniowa)!',
              reaction: 'crisis'
            }
          ]
        },
        {
          id: 'glowa_gardlo_igav',
          name: 'Głowa, oczy i gardło',
          icon: '🗣️',
          x: 48, y: 15,
          maneuvers: [
            { id: 'm_gardlo_igav', label: 'Zbadaj gardło i jamę ustną', isKey: false, isFatal: false, finding: 'Błona śluzowa bladoróżowa, migdałki bez ostrych zmian ropnych, cechy przebytej niedawno infekcji.', reaction: 'normal' }
          ]
        },
        {
          id: 'klatka_serce_pluca',
          name: 'Klatka piersiowa – serce i płuca',
          icon: '🫁',
          x: 48, y: 35,
          maneuvers: [
            { id: 'm_klatka_igav', label: 'Osłuchaj serce i płuca', isKey: false, isFatal: false, finding: 'Szmer pęcherzykowy prawidłowy, tony serca czyste, miarowe, HR 88/min.', reaction: 'normal' }
          ]
        }
      ],
      synthesis: {
        questionDiagnostic: 'Jakie jest ostateczne rozpoznanie kliniczne?',
        optionsDiagnostic: [
          { id: 'd1', label: 'Zapalenie naczyń związane z IgA (Plamica Schönleina-Henocha / IgAV) z zajęciem skóry, stawów, PP i nerek', isCorrect: true, explanation: 'Typowa triada: purpura palpabilis, bolesność stawów, kurczowe bóle brzucha oraz krwinkomocz z białkomoczem po infekcji paciorkowcowej.' },
          { id: 'd2', label: 'Małopłytkowość immunologiczna (ITP)', isCorrect: false, explanation: 'W IgAV liczba płytek krwi jest prawidłowa, a wykwity są uniesione (zapalenie naczyń, nie skaza płytkowa).' },
          { id: 'd3', label: 'Sepsa meningokokowa', isCorrect: false, explanation: 'Przeciwko sepsie przemawia dobry stan ogólny, brak gorączki i brak wykwitów na tułowiu.' }
        ],
        differentialOptions: [
          { id: 'diff1', label: 'Małopłytkowość immunologiczna (ITP)', isCorrect: true },
          { id: 'diff2', label: 'Reaktywne zapalenie stawów', isCorrect: true },
          { id: 'diff3', label: 'Toczeń rumieniowaty układowy (SLE)', isCorrect: true }
        ],
        actionOptions: [
          { id: 'act1', label: 'Monitorowanie ciśnienia tętniczego i cotygodniowa kontrola osadu moczu i białkomoczu', isCorrect: true },
          { id: 'act2', label: 'Odpoczynek łóżkowy w fazie zaostrzenia stawowego, leki przeciwbólowe (paracetamol/NLPZ w porozumieniu z nefrologiem)', isCorrect: true },
          { id: 'act3', label: 'Konsultacja nefrologa dziecięcego z uwagi na krwinkomocz, białkomocz i nadciśnienie tętnicze', isCorrect: true }
        ]
      },
      statusPraesens: {
        title: 'Status Praesens: 10-letni chłopiec z plamicą Schönleina-Henocha (IgAV)',
        sections: [
          { num: '1', title: 'Stan ogólny i rozwój fizyczny', content: 'Chłopiec w wieku 10 lat, masa ciała 34 kg. Stan ogólny dość dobry, dziecko przytomne, zorientowane w miejscu i czasie, chód utrudniony z powodu bólu stawów skokowych. Budowa ciała prawidłowa.' },
          { num: '2', title: 'Skóra, tkanka podskórna i węzły chłonne', content: 'Na skórze pośladków, powierzchni wyprostnych ud i podudzi obecna symetryczna osutka o charakterze uniesionej plamicy (purpura palpabilis) – wyczuwalne palpacyjnie grudki i plamki krwotoczne o średnicy 2–6 mm, nieblednące pod uciskiem. Tułów, klatka piersiowa, twarz i kończyny górne wolne od wykwitów. Węzły chłonne obwodowe niepowiększone.' },
          { num: '3', title: 'Głowa i szyja', content: 'Czaszka prawidłowa, symetryczna. Spojówki różowe, twardówki białe, źrenice równe, reakcja na światło prawidłowa. Śluzówki jamy ustnej wilgotne, różowe, bez wybroczyn. Gardło czyste, migdałki bez nalotów. Szyja ruchoma, objawy oponowe ujemne.' },
          { num: '4', title: 'Układ oddechowy i klatka piersiowa', content: 'Klatka piersiowa symetryczna, tor oddechowy piersiowo-brzuszny. Liczba oddechów 18/min. Odgłos opukowy jawny. Osłuchowo nad całymi polami płucnymi szmer pęcherzykowy symetryczny, prawidłowy.' },
          { num: '5', title: 'Układ krążenia i serce', content: 'Czynność serca miarowa, HR 88/min. Tony czyste, dźwięczne, bez szmerów. Tętno obwodowe równe, dobrze wypełnione. Ciśnienie tętnicze 128/82 mmHg – podwyższone (>95. centyla dla wieku i płci).' },
          { num: '6', title: 'Jama brzuszna', content: 'Brzuch w poziomie powłok, symetryczny, miękki, umiarkowanie tkliwy przy palpacji okolicy pępka, bez obrony mięśniowej i objawów otrzewnowych. Wątroba i śledziona niebadalne. Perystaltyka prawidłowa, brak oporów patologicznych (brak cech wgłobienia jelitowego).' },
          { num: '7', title: 'Narządy moczowo-płciowe', content: 'Rozwój narządów zewnętrznych prawidłowy męski, jądra w mosznie, niebolesne. Badanie ogólne moczu (test paskowy): krwinkomocz (erytrocyty +++), białkomocz (++ ok. 1.0 g/l).' },
          { num: '8', title: 'Układ kostno-stawowy i kończyny', content: 'Stawy skokowe obustronnie obrzęknięte, bolesne uciskowo, ruchomość bierna ograniczona bólowo, bez ucieplenia i zaczerwienienia skóry. Stawy kolanowe tkliwe, bez widocznego wysięku. Kręgosłup bez bolesności.' },
          { num: '9', title: 'Układ nerwowy i zmysły', content: 'Stan neurologiczny bez odchyleń, objawy oponowe ujemne, nerwy czaszkowe bez cech porażenia.' }
        ],
        conclusions: 'Rozpoznanie: Zapalenie naczyń związane z IgA (Plamica Schönleina-Henocha, IgAV) z zajęciem skóry, stawów, przewodu pokarmowego i nerek (nefropatia IgA). Postępowanie: oszczędzający tryb życia, kontrola nefrologiczna, monitorowanie ciśnienia tętniczego 2x dziennie, cotygodniowe badanie ogólne moczu i wskaźnika białko/kreatynina przez 6 miesięcy.'
      }
    }
  ];

  /* Apteczka Pediatryczna & Generator Recept (Baza leków ambulatoryjnych, szpitalnych i ratunkowych) */
  const PEDIATRIC_DRUG_DATABASE = [
    {
      id: 'amoxicillin',
      name: 'Amoksycylina',
      category: 'oral_abx',
      categoryName: 'Antybiotyki doustne (zawiesiny)',
      defaultRoute: 'p.o.',
      tradeNames: ['Hiconcil', 'Duomox', 'Ospamox', 'Amotaks'],
      forms: [
        { id: 'susp_500', name: 'proszek do sporządzania zawiesiny doustnej 500 mg / 5 ml', strengthMgPerMl: 100, packSizes: [60, 100] },
        { id: 'susp_250', name: 'proszek do sporządzania zawiesiny doustnej 250 mg / 5 ml', strengthMgPerMl: 50, packSizes: [60, 100] }
      ],
      indications: [
        {
          id: 'aom',
          name: 'Ostre zapalenie ucha środkowego (AOM)',
          doseMgPerKgDay: 90,
          dosesPerDay: 2,
          intervalHours: 12,
          durationDays: 10,
          note: 'Wysoka dawka 90 mg/kg/d (eradykacja S. pneumoniae PRSP). Kuracja 10 dni u dzieci <2 r.ż. lub powikłanych, 5-7 dni u starszych >2 r.ż.'
        },
        {
          id: 'cap',
          name: 'Pozaszpitalne zapalenie płuc (CAP)',
          doseMgPerKgDay: 90,
          dosesPerDay: 3,
          intervalHours: 8,
          durationDays: 7,
          note: 'Lek 1. rzutu w typowym bakteryjnym zapaleniu płuc u dzieci. Podawany co 8h.'
        },
        {
          id: 'strep_alt',
          name: 'Angina paciorkowcowa (alternatywa przy braku penicyliny V)',
          doseMgPerKgDay: 50,
          dosesPerDay: 2,
          intervalHours: 12,
          durationDays: 10,
          note: 'Lekiem 1. rzutu pozostaje fenoksymetylopenicylina. Amoksycylina jest alternatywą o lepszym smaku.'
        }
      ],
      parentAdvice: 'Wstrząsnąć butelką przed każdym użyciem. Podawać w trakcie lub po posiłku. Po sporządzeniu przechowywać w lodówce (2-8°C) do 14 dni.',
      warning: 'U dzieci z podejrzeniem mononukleozy zakaźnej (EBV) amoksycylina w >90% wywołuje uogólnioną osutkę plamisto-grudkową (niebędącą alergią na penicylinę)!'
    },
    {
      id: 'augmentin',
      name: 'Amoksycylina + Kwas klawulanowy',
      category: 'oral_abx',
      categoryName: 'Antybiotyki doustne (zawiesiny)',
      defaultRoute: 'p.o.',
      tradeNames: ['Augmentin ES', 'Amoksiklav Quicktab', 'Taromentin'],
      forms: [
        { id: 'susp_400_57', name: 'zawiesina doustna 400 mg + 57 mg / 5 ml (stosunek 7:1)', strengthMgPerMl: 80, packSizes: [70, 140] },
        { id: 'susp_es_600', name: 'zawiesina Augmentin ES 600 mg + 42.9 mg / 5 ml (stosunek 14:1)', strengthMgPerMl: 120, packSizes: [50, 100] }
      ],
      indications: [
        {
          id: 'aom_recurrent',
          name: 'AOM po nieskuteczności amoksycyliny / nawrotowe AOM',
          doseMgPerKgDay: 90,
          dosesPerDay: 2,
          intervalHours: 12,
          durationDays: 10,
          note: 'Wskazany przy podejrzeniu szczepów wytwarzających beta-laktamazy (H. influenzae, M. catarrhalis).'
        },
        {
          id: 'uti',
          name: 'Zakażenie układu moczowego (ZUM)',
          doseMgPerKgDay: 40,
          dosesPerDay: 3,
          intervalHours: 8,
          durationDays: 7,
          note: 'Stosowany w ambulatoryjnym leczeniu ZUM (E. coli, Proteus).'
        }
      ],
      parentAdvice: 'Podawać na początku posiłku w celu zmniejszenia ryzyka dolegliwości żołądkowo-jelitowych i biegunki. Przechowywać w lodówce do 7-10 dni.',
      warning: 'Zawiera kwas klawulanowy, który często powoduje luźne stolce i biegunkę. Zaleca się równoległe stosowanie probiotyku.'
    },
    {
      id: 'penicillin_v',
      name: 'Fenoksymetylopenicylina (Penicylina V)',
      category: 'oral_abx',
      categoryName: 'Antybiotyki doustne (zawiesiny)',
      defaultRoute: 'p.o.',
      tradeNames: ['Ospen 750', 'Ospen 1000'],
      forms: [
        { id: 'susp_750', name: 'zawiesina doustna 750 000 j.m. / 5 ml (Ospen 750)', strengthUnitsPerMl: 150000, packSizes: [60] }
      ],
      indications: [
        {
          id: 'pharyngitis',
          name: 'Angina paciorkowcowa (PBHA / S. pyogenes)',
          doseUnitsPerKgDay: 100000,
          dosesPerDay: 2,
          intervalHours: 12,
          durationDays: 10,
          note: 'BEZWZGLĘDNY LEK 1. RZUTU! Dawkowanie 100 000 j.m./kg/d w 2 dawkach co 12h. Kuracja MUSI trwać pełne 10 dni!'
        }
      ],
      parentAdvice: 'Podawać 1 godzinę przed posiłkiem lub 2 godziny po posiłku. Bezwzględnie kontynuować przez pełne 10 dni, nawet jeśli gorączka ustąpi po 48 godzinach!',
      warning: 'Złota zasada egzaminacyjna: Skrócenie kuracji penicyliną poniżej 10 dni drastycznie zwiększa ryzyko gorączki reumatycznej!'
    },
    {
      id: 'cefuroxime_axetil',
      name: 'Cefuroksym aksetyl (II generacja)',
      category: 'oral_abx',
      categoryName: 'Antybiotyki doustne (zawiesiny)',
      defaultRoute: 'p.o.',
      tradeNames: ['Zinnat', 'Bioracef'],
      forms: [
        { id: 'susp_125', name: 'granulat do zawiesiny doustnej 125 mg / 5 ml', strengthMgPerMl: 25, packSizes: [50, 100] },
        { id: 'susp_250', name: 'granulat do zawiesiny doustnej 250 mg / 5 ml', strengthMgPerMl: 50, packSizes: [50, 100] }
      ],
      indications: [
        {
          id: 'uti_child',
          name: 'Zakażenie układu moczowego (ZUM)',
          doseMgPerKgDay: 20,
          dosesPerDay: 2,
          intervalHours: 12,
          durationDays: 7,
          note: 'Lek z wyboru w ambulatoryjnym leczeniu ZUM u niemowląt i dzieci.'
        },
        {
          id: 'lyme_early',
          name: 'Wczesna borelioza z Lyme (rumień wędrujący <8 r.ż.)',
          doseMgPerKgDay: 30,
          dosesPerDay: 2,
          intervalHours: 12,
          durationDays: 14,
          note: 'Lek 1. rzutu obok amoksycyliny u dzieci poniżej 8 lat (przeciwwskazanie do doksycykliny).'
        }
      ],
      parentAdvice: 'Podawać z posiłkiem (tłuszcz w pokarmie zwiększa biodostępność). Zawiesina ma specyficzny gorzki posmak – nie rozgryzać granulek.',
      warning: 'Wykazuje oporność krzyżową tylko u znikomej części pacjentów z alergią na penicylinę (<2%).'
    },
    {
      id: 'azithromycin',
      name: 'Azytromycyna (Makrolid azotowy)',
      category: 'oral_abx',
      categoryName: 'Antybiotyki doustne (zawiesiny)',
      defaultRoute: 'p.o.',
      tradeNames: ['Sumamed', 'Azitrox', 'Macromax'],
      forms: [
        { id: 'susp_100', name: 'proszek do sporządzania zawiesiny doustnej 100 mg / 5 ml', strengthMgPerMl: 20, packSizes: [20] },
        { id: 'susp_200_forte', name: 'zawiesina doustna forte 200 mg / 5 ml', strengthMgPerMl: 40, packSizes: [20, 30] }
      ],
      indications: [
        {
          id: 'atypical_pneumonia',
          name: 'Atypowe zapalenie płuc (Mycoplasma, Chlamydia)',
          doseMgPerKgDay: 10,
          dosesPerDay: 1,
          intervalHours: 24,
          durationDays: 3,
          note: 'Dawkowanie: 10 mg/kg/dobę 1 raz na dobę przez 3 dni (kuracja 3-dniowa dzięki długiemu okresowi półtrwania >60h).'
        },
        {
          id: 'pertussis',
          name: 'Krztusiec (Bordetella pertussis)',
          doseMgPerKgDay: 10,
          dosesPerDay: 1,
          intervalHours: 24,
          durationDays: 5,
          note: 'Dzień 1: 10 mg/kg, dni 2-5: 5 mg/kg raz na dobę.'
        }
      ],
      parentAdvice: 'Podawać 1 raz na dobę o stałej porze. Nie wymaga lodówki, trzymać w temp. pokojowej do 5-10 dni.',
      warning: 'Azytromycyna wydłuża odstęp QT w EKG! Zachować ostrożność u dzieci z zespołem LQTS.'
    },
    {
      id: 'paracetamol',
      name: 'Paracetamol (Acetaminofen)',
      category: 'antipyretic',
      categoryName: 'Leki przeciwgorączkowe i przeciwbólowe',
      defaultRoute: 'p.o. / p.r.',
      tradeNames: ['Paracetamol Hasco', 'Panadol Baby', 'Calpol', 'Efferalgan'],
      forms: [
        { id: 'susp_120', name: 'zawiesina doustna 120 mg / 5 ml (24 mg/ml)', strengthMgPerMl: 24, packSizes: [100] },
        { id: 'susp_250_forte', name: 'zawiesina doustna forte 250 mg / 5 ml (50 mg/ml)', strengthMgPerMl: 50, packSizes: [85, 150] }
      ],
      indications: [
        {
          id: 'fever_pain',
          name: 'Gorączka i ból u dzieci od 1. doby życia',
          doseMgPerKgDose: 15,
          maxDoseMgPerKgDay: 60,
          intervalHours: 4,
          note: 'Dawka jednorazowa doustna: 15 mg/kg m.c. co 4-6 godzin (maks. 4 razy na dobę, maks. 60 mg/kg/dobę). Doodbytniczo: 20 mg/kg m.c.'
        }
      ],
      parentAdvice: 'Nie przekraczać 4 dawek na dobę. Odstęp między dawkami minimum 4 godziny. Można stosować bezpiecznie od urodzenia, również w ospie wietrznej.',
      warning: 'Lek z wyboru w ospie wietrznej! Przedawkowanie grozi ostrą niewydolnością wątroby (odtrutka: N-acetylocysteina).'
    },
    {
      id: 'ibuprofen',
      name: 'Ibuprofen (NLPZ)',
      category: 'antipyretic',
      categoryName: 'Leki przeciwgorączkowe i przeciwbólowe',
      defaultRoute: 'p.o. / p.r.',
      tradeNames: ['Ibum', 'Nurofen dla dzieci', 'Pediprofen'],
      forms: [
        { id: 'susp_100', name: 'zawiesina doustna 100 mg / 5 ml (20 mg/ml)', strengthMgPerMl: 20, packSizes: [100] },
        { id: 'susp_200_forte', name: 'zawiesina doustna forte 200 mg / 5 ml (40 mg/ml)', strengthMgPerMl: 40, packSizes: [100, 150] }
      ],
      indications: [
        {
          id: 'fever_inflam',
          name: 'Gorączka, ból, stan zapalny (od ukończenia 3. m.ż. lub >5 kg)',
          doseMgPerKgDose: 10,
          maxDoseMgPerKgDay: 30,
          intervalHours: 6,
          note: 'Dawka jednorazowa: 10 mg/kg m.c. co 6-8 godzin (maks. 3-4 razy na dobę, maks. 30-40 mg/kg/dobę).'
        }
      ],
      parentAdvice: 'Podawać podczas posiłku. Odstęp minimum 6-8 godzin. Dobrze nawadniać dziecko.',
      warning: 'BEZWZGLĘDNY ZAKAZ w ospie wietrznej (ryzyko paciorkowcowego martwiczego zapalenia powięzi)! Nie zalecany w ciężkim odwodnieniu.'
    },
    {
      id: 'salbutamol',
      name: 'Salbutamol (SABA)',
      category: 'inhalation',
      categoryName: 'Leki wziewne i nebulizacje',
      defaultRoute: 'nebulizacja / pMDI',
      tradeNames: ['Ventolin płyn do nebulizacji 1 mg/ml', 'Ventolin aerozol'],
      forms: [
        { id: 'neb_1mg_ml', name: 'roztwór do nebulizacji 1 mg / ml (ampułki 2.5 ml = 2.5 mg)', strengthMgPerMl: 1.0, packSizes: [20] }
      ],
      indications: [
        {
          id: 'bronchospasm',
          name: 'Zaostrzenie astmy / duszność wydechowa z obturacją',
          doseMgPerKgDose: 0.15,
          minDoseMg: 1.25,
          maxDoseMg: 2.5,
          note: 'Dawka jednorazowa: 0.15 mg/kg m.c. (min. 1.25 mg, maks. 2.5-5.0 mg) rozcieńczone w 2.0 ml 0.9% NaCl w nebulizatorze pneumatycznym.'
        }
      ],
      parentAdvice: 'Inhalować przez maseczkę twarzową lub ustnik do wyczerpania roztworu (ok. 5-10 minut). Może powodować przejściowe przyspieszenie akcji serca.',
      warning: 'W ciężkiej duszności podawać co 20 minut w pierwszej godzinie (3 dawki). Nieskuteczny w zapaleniu oskrzelików (bronchiolitis).'
    },
    {
      id: 'budesonide',
      name: 'Budezonid (wziewny GKS)',
      category: 'inhalation',
      categoryName: 'Leki wziewne i nebulizacje',
      defaultRoute: 'nebulizacja',
      tradeNames: ['Pulmicort', 'Nebbud', 'Budixon Neb'],
      forms: [
        { id: 'neb_025', name: 'zawiesina do nebulizacji 0.25 mg / ml (ampułki 2 ml = 0.5 mg)', strengthMgPerMl: 0.25, packSizes: [20] },
        { id: 'neb_050', name: 'zawiesina do nebulizacji 0.5 mg / ml (ampułki 2 ml = 1.0 mg)', strengthMgPerMl: 0.5, packSizes: [20] }
      ],
      indications: [
        {
          id: 'asthma_attack',
          name: 'Zaostrzenie astmy oskrzelowej',
          doseMgPerDose: 0.5,
          intervalHours: 12,
          durationDays: 7,
          note: '0.5 - 1.0 mg co 12 godzin w nebulizacji.'
        },
        {
          id: 'croup_alt',
          name: 'Podgłośniowe zapalenie krtani (Krup) – alternatywa dla deksametazonu',
          doseMgPerDose: 2.0,
          intervalHours: 12,
          durationDays: 1,
          note: 'Duża dawka 2.0 mg jednorazowo w nebulizacji (ampułki 2 x 1mg).'
        }
      ],
      parentAdvice: 'Po inhalacji przemyć twarz dziecka wilgotną ściereczką oraz podać łyk wody do wypłukania jamy ustnej (zapobieganie grzybicy/pleśniawkom!).',
      warning: 'Budezonid to zawiesina – nie stosować w inhalatorach ultradźwiękowych (ulega rozbiciu). Wyłącznie nebulizatory pneumatyczno-tłokowe lub siateczkowe MESH.'
    },
    {
      id: 'dexamethasone',
      name: 'Deksametazon',
      category: 'systemic_steroid',
      categoryName: 'Steroidoterapia ogólna',
      defaultRoute: 'p.o. / i.m. / i.v.',
      tradeNames: ['Dexamethason WZF amp. 4mg/ml', 'Demezon'],
      forms: [
        { id: 'amp_4mg', name: 'roztwór do wstrzykiwań 4 mg / ml (ampułki 1 ml)', strengthMgPerMl: 4.0 }
      ],
      indications: [
        {
          id: 'croup_oral',
          name: 'Podgłośniowe zapalenie krtani (Krup / Laryngotracheitis)',
          doseMgPerKgDose: 0.15,
          maxDoseMg: 8.0,
          note: 'Złoty standard: 0.15 - 0.6 mg/kg m.c. doustnie jednorazowo (zawartość ampułki 4 mg/ml można podać doustnie ze słodkim syropem!).'
        },
        {
          id: 'meningitis_adj',
          name: 'Ropne ZOMR (adjuwant przed lub z 1. dawką antybiotyku)',
          doseMgPerKgDose: 0.15,
          intervalHours: 6,
          durationDays: 4,
          note: '0.15 mg/kg i.v. co 6h przez 4 dni. Zmniejsza powikłania neurologiczne i głuchotę w zapaleniu pneumokokowym i Hib.'
        }
      ],
      parentAdvice: 'Działanie w krupie rozwija się po ok. 1-2 godzinach i utrzymuje do 24-48 godzin. Często wystarcza jedna dawka.',
      warning: 'W zapaleniu opon mózgowo-rdzeniowych podać przed lub równocześnie z pierwszą dawką antybiotyku. Podanie po antybiotyku nie przynosi korzyści neurologicznych!'
    },
    {
      id: 'ceftriaxone_iv',
      name: 'Ceftriakson (III generacja i.v.)',
      category: 'hospital_iv',
      categoryName: 'Leki szpitalne i.v. & Wlewy',
      defaultRoute: 'i.v. / i.m.',
      tradeNames: ['Biotrakson', 'Rocephin'],
      forms: [
        { id: 'vial_1g', name: 'proszek do sporządzania roztworu do wstrzykiwań 1.0 g', strengthMgPerUnit: 1000 },
        { id: 'vial_2g', name: 'proszek do sporządzania roztworu do wstrzykiwań 2.0 g', strengthMgPerUnit: 2000 }
      ],
      indications: [
        {
          id: 'sepsis_empiric',
          name: 'Sepsa, wstrząs septyczny, ciężkie zakażenia ogólne',
          doseMgPerKgDay: 100,
          dosesPerDay: 1,
          intervalHours: 24,
          maxDailyMg: 4000,
          note: '100 mg/kg m.c./dobę 1 x dziennie w powolnym wlewie i.v. (30 min) rozcieńczony w 0.9% NaCl lub 5% glukozie.'
        },
        {
          id: 'meningitis_iv',
          name: 'Ropne ZOMR u dzieci powyżej okresu noworodkowego',
          doseMgPerKgDay: 100,
          dosesPerDay: 2,
          intervalHours: 12,
          maxDailyMg: 4000,
          note: 'W ZOMR zaleca się podział na 2 dawki (50 mg/kg co 12h) lub 100 mg/kg 1x dz.'
        }
      ],
      hospitalOrder: 'Ceftriakson {DOSE_MG} mg i.v. w 50-100 ml 0.9% NaCl we wlewie trwającym 30 minut, 1 raz na dobę.',
      warning: 'BEZWZGLĘDNY ZAKAZ podawania z roztworami zawierającymi wapń (np. Płyn Ringera, glukonian wapnia) – grozi wytrąceniem soli w płucach i nerkach noworodków i niemowląt!'
    },
    {
      id: 'ors_rehydration',
      name: 'Doustny Płyn Nawadniający (DPN / ORS)',
      category: 'rehydration',
      categoryName: 'Nawadnianie & Elektrolity',
      defaultRoute: 'p.o.',
      tradeNames: ['Acidolit', 'Orsalit', 'Floridral', 'Hipp ORS'],
      forms: [
        { id: 'sachet_reduced', name: 'saszetki o obniżonej osmolarności (WHO/ESPGHAN 245 mOsm/l)', packSizes: [10] }
      ],
      indications: [
        {
          id: 'dehydration_mild_mod',
          name: 'Nawadnianie w ostrej biegunce i wymiotach (odwodnienie lekkie do umiarkowanego)',
          doseFormula: '50-100 ml/kg w ciągu pierwszych 4 godzin',
          maintenanceFormula: '10 ml/kg po każdym luźnym stolcu, 2-5 ml/kg po każdym epizodzie wymiotów',
          note: 'Złoty standard ESPGHAN: hipoosmolarny DPN podawany chłodny, małymi porcjami (łyżeczką co 1-2 minuty).'
        }
      ],
      parentAdvice: 'Rozpuścić 1 saszetkę w dokładnie 200 ml przegotowanej, ostudzonej wody. Nie dosładzać sokiem ani cukrem! Podawać schłodzony z lodówki, łyżeczką co 2-3 minuty.',
      warning: 'Wczesne ponowne żywienie: po 4 godzinach wstępnego nawadniania NALEŻY natychmiast wznowić normalną dietę odpowiednią do wieku!'
    },
    {
      id: 'maintenance_fluids',
      name: 'Płynoterapia infuzyjna i.v. (Reguła Hollidaya-Segara)',
      category: 'hospital_iv',
      categoryName: 'Leki szpitalne i.v. & Wlewy',
      defaultRoute: 'i.v.',
      forms: [
        { id: 'fluid_iso', name: 'Izotoniczny roztwór zrównoważony z 5% glukozą (np. Plasmalyte + 5% Glc lub 0.9% NaCl + 5% Glc + 20 mmol/l KCl)' }
      ],
      indications: [
        {
          id: 'holliday_segar',
          name: 'Zapotrzebowanie dobowe na płyny podtrzymujące',
          formula: '100 ml/kg (pierwsze 10 kg) + 50 ml/kg (kolejne 10-20 kg) + 20 ml/kg (>20 kg)',
          note: 'Rutynowym płynem podtrzymującym powinien być płyn IZOTONICZNY ze względu na ryzyko jatrogennej hiponatremii.'
        }
      ],
      hospitalOrder: 'Wlew podtrzymujący: {TOTAL_ML_DAY} ml/dobę ({ML_PER_HOUR} ml/h) w pompie infuzyjnej z suplementacją KCl 20 mmol/l po potwierdzeniu diurezy.',
      warning: 'Złota zasada bezpieczeństwa: Nigdy nie dodawaj potasu (KCl) do płynów i.v. przed upewnieniem się, że dziecko oddaje mocz (ryzyko śmiertelnej hiperkaliemii)!'
    },
    {
      id: 'midazolam',
      name: 'Midazolam (Benzodiazepina)',
      category: 'emergency_sedation',
      categoryName: 'Leki ratunkowe i sedacja',
      defaultRoute: 'bukalnie / i.v. / i.m.',
      tradeNames: ['Buccolam', 'Midanium'],
      forms: [
        { id: 'buccal_oral', name: 'roztwór do podania w jamie ustnej (strzykawki doustne Buccolam 2.5mg, 5mg, 7.5mg, 10mg)' },
        { id: 'amp_5mg_ml', name: 'roztwór do wstrzykiwań 5 mg / ml (ampułki 1 ml / 3 ml)' }
      ],
      indications: [
        {
          id: 'status_seizure',
          name: 'Przedłużający się napad drgawek (>5 minut)',
          doseMgPerKgDose: 0.2,
          maxDoseMg: 10.0,
          note: 'Lek 1. rzutu pozaszpitalnie i w SOR: 0.2-0.3 mg/kg m.c. na błonę śluzową policzka (bukalnie) lub 0.15-0.2 mg/kg i.v./i.o.'
        }
      ],
      hospitalOrder: 'Midazolam {DOSE_MG} mg bukalnie (pomiędzy dziąsło a policzek) lub powolny bolus i.v. w 2 minuty.',
      warning: 'Ryzyko depresji oddechowej i bezdechu! Zawsze miej pod ręką sprzęt do wentylacji workiem z maską i tlenoterapię (odtrutka: Flumazenil).'
    }
  ];

  /* 10 Klinicznych Wyzwań Recepturowych (Trening Ordynacji Leków) */
  const PRESCRIPTION_CHALLENGES = [
    {
      id: 'chal_aom',
      title: 'Wyzwanie 1: 3-letni Jaś (15 kg) z ostrym ropnym zapaleniem ucha środkowego (AOM)',
      vignette: '3-letni chłopiec zgłasza się z rodzicami do gabinetu POZ z powodu silnego bólu prawego ucha od 24 godzin, gorączki 38.8°C i niepokoju. W otoskopii: błona bębenkowa prawa przekrwiona, uwypuklona, bez refleksu świetlnego. Jest to pierwszy epizod, brak alergii na leki.',
      drugId: 'amoxicillin',
      weight: 15,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Wybór leku pierwszego rzutu',
          q: 'Jaki antybiotyk jest lekiem pierwszego rzutu w niepowikłanym ostrym zapaleniu ucha środkowego u dzieci wg wytycznych polskich (NPOA) i międzynarodowych?',
          opts: [
            'Amoksycylina bez inhibitora',
            'Amoksycylina z kwasem klawulanowym (Augmentin)',
            'Cefuroksym aksetyl (Zinnat)',
            'Azytromycyna (Sumamed)'
          ],
          correct: 0,
          explanation: 'Amoksycylina bez inhibitora jest bezwzględnym lekiem pierwszego rzutu w AOM. Głównym patogenem bakteryjnym jest Streptococcus pneumoniae, który nie wytwarza beta-laktamaz, lecz ma zmienione białka PBP – dlatego wymaga WYSOKIEJ dawki amoksycyliny, a nie inhibitora!'
        },
        {
          step: 2,
          title: 'Krok 2: Zalecana dobowa dawka leku',
          q: 'Jaka jest zalecana dobowa dawka amoksycyliny w AOM u 15-kg dziecka?',
          opts: [
            '90 mg/kg m.c./dobę w 2 dawkach podzielonych co 12 godzin (1350 mg/d ➔ 675 mg co 12h)',
            '40-50 mg/kg m.c./dobę w 3 dawkach co 8 godzin (600 mg/d)',
            '20 mg/kg m.c./dobę 1 raz na dobę',
            '150 mg/kg m.c./dobę w 4 dawkach'
          ],
          correct: 0,
          explanation: 'W Polsce ze względu na rozpowszechnienie szczepów S. pneumoniae o obniżonej wrażliwości na penicylinę (PRSP) w AOM i CAP bezwzględnie obowiązuje wysoka dawka 90 mg/kg/d podzielona na 2 dawki co 12h (lub 3 dawki co 8h).'
        },
        {
          step: 3,
          title: 'Krok 3: Wybór stężenia i objętość pojedynczej dawki',
          q: 'Wybierasz zawiesinę doustną Hiconcil 500 mg / 5 ml (100 mg/ml). Ile mililitrów zawiesiny rodzic musi podać dziecku na jedną dawkę (co 12 godzin)?',
          opts: [
            '6.75 ml (ok. 6.8 ml) co 12 godzin',
            '3.4 ml co 12 godzin',
            '13.5 ml co 12 godzin',
            '5.0 ml co 12 godzin'
          ],
          correct: 0,
          explanation: 'Dawka jednorazowa wynosi 675 mg. Przy stężeniu 500 mg w 5 ml (czyli 100 mg w 1 ml): 675 mg / 100 mg/ml = 6.75 ml (do odmierzenia strzykawką dozującą jako 6.7-6.8 ml).'
        },
        {
          step: 4,
          title: 'Krok 4: Czas kuracji i kalkulacja liczby opakowań',
          q: 'Ile dni powinna trwać kuracja u 3-latka i ile opakowań zawiesiny (butelka 100 ml) musisz przepisać na e-recepcie?',
          opts: [
            'Czas kuracji: 10 dni; Należy przepisać 2 opakowania po 100 ml (całkowita objętość 135 ml)',
            'Czas kuracji: 5 dni; Wystarczy 1 opakowanie po 100 ml',
            'Czas kuracji: 3 dni; Wystarczy 1 opakowanie 60 ml',
            'Czas kuracji: 14 dni; Należy przepisać 3 opakowania po 100 ml'
          ],
          correct: 0,
          explanation: 'Zgodnie z wytycznymi w AOM kuracja trwa 10 dni u dzieci poniżej 2 lat lub z powikłaniami / obustronnym AOM. Całkowite zapotrzebowanie to 2 x 6.75 ml x 10 dni = 135 ml. Jedna butelka 100 ml nie wystarczy! Wypisanie tylko 1 opakowania to częsty błąd skutkujący przedwczesnym przerwaniem antybiotykoterapii.'
        }
      ],
      pearl: 'Pamiętaj: W AOM nie bój się dawki 90 mg/kg/dobę! Niska dawka (40-50 mg/kg) nie osiąga stężenia terapeutycznego w jamie bębenkowej i prowadzi do nawrotu.'
    },
    {
      id: 'chal_angina',
      title: 'Wyzwanie 2: 6-letnia Zosia (22 kg) z ostrą anginą paciorkowcową (PBHA)',
      vignette: '6-letnia dziewczynka z nagłym bólem gardła, gorączką 39.0°C, bólem głowy i nudnościami. W badaniu: migdałki podniebienne powiększone, żywoczerwone z ropnymi nalotami w kryptach, tkliwe powiększone węzły chłonne szyjne przednie, brak kaszlu i kataru (Centor/McIsaac = 4 punkty). Szybki test antygenowy Strep A dodatni.',
      drugId: 'penicillin_v',
      weight: 22,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Lek pierwszego wyboru',
          q: 'Jaki antybiotyk jest bezwzględnym lekiem pierwszego wyboru w anginie wywołanej przez Streptococcus pyogenes (PBHA)?',
          opts: [
            'Fenoksymetylopenicylina (Penicylina V / Ospen)',
            'Amoksycylina z kwasem klawulanowym (Augmentin)',
            'Azytromycyna (Sumamed)',
            'Cefadroksyl'
          ],
          correct: 0,
          explanation: 'Fenoksymetylopenicylina (Ospen) jest jedynym lekiem pierwszego wyboru w anginie paciorkowcowej. Streptococcus pyogenes wykazuje 100% wrażliwości na penicylinę na całym świecie – nigdy nie opisano szczepu opornego! Stosowanie leków o szerszym spektrum (Augmentin, cefalosporyny) jest błędem sztuki.'
        },
        {
          step: 2,
          title: 'Krok 2: Zalecane dawkowanie dobowe',
          q: 'Jakie jest zalecane dawkowanie fenoksymetylopenicyliny (Ospen) u 22-kg dziecka?',
          opts: [
            '100 000 j.m./kg m.c./dobę w 2 dawkach podzielonych co 12 godzin (2.2 mln j.m./d ➔ 1.1 mln j.m. co 12h)',
            '20 000 j.m./kg m.c./dobę 1 raz na dobę',
            '250 000 j.m./kg m.c./dobę w 4 dawkach',
            '50 mg/kg m.c./dobę'
          ],
          correct: 0,
          explanation: 'Dawka pediatryczna penicyliny V w anginie paciorkowcowej wynosi 100 000 j.m./kg m.c./dobę, podawana w 2 dawkach podzielonych co 12 godzin (maks. 2-3 mln j.m./dobę).'
        },
        {
          step: 3,
          title: 'Krok 3: Objętość dawki zawiesiny Ospen 750 (750 000 j.m. / 5 ml)',
          q: 'Dla zawiesiny Ospen 750 (750 000 j.m./5 ml = 150 000 j.m./ml), ile ml wynosi dawka jednorazowa (1.1 mln j.m.)?',
          opts: [
            '7.3 ml co 12 godzin',
            '3.5 ml co 12 godzin',
            '14.6 ml co 12 godzin',
            '5.0 ml co 12 godzin'
          ],
          correct: 0,
          explanation: '1 100 000 j.m. / 150 000 j.m./ml = 7.33 ml. Podajemy 7.3 ml co 12 godzin.'
        },
        {
          step: 4,
          title: 'Krok 4: Czas trwania kuracji (Pułapka egzaminacyjna!)',
          q: 'Mama pyta, czy jeśli po 3 dniach gardło przestanie boleć i gorączka minie, może odstawić antybiotyk. Co odpowiadasz?',
          opts: [
            'Bezwzględnie NIE! Kuracja penicyliną V MUSI trwać pełne 10 dni, aby dokonać całkowitej eradykacji PBHA i zapobiec gorączce reumatycznej.',
            'Tak, po 48h bezgorączkowych można zakończyć leczenie.',
            'Wystarczy skrócić do 5 dni, jeśli test kontrolny będzie ujemny.',
            'Można zamienić na witaminę C.'
          ],
          correct: 0,
          explanation: 'Kardynalna zasada: Kuracja penicyliną w anginie paciorkowcowej MUSI trwać 10 dni! Objawy ustępują zazwyczaj po 24-48h, ale przedwczesne odstawienie grozi nawrotem i rozwojem ostrej gorączki reumatycznej.'
        }
      ],
      pearl: 'Jedyny powód leczenia anginy paciorkowcowej pełnymi 10 dniami penicyliny to prewencja powikłań odległych: gorączki reumatycznej i uszkodzenia zastawek serca!'
    },
    {
      id: 'chal_varicella',
      title: 'Wyzwanie 3: 4-letni Staś (18 kg) z gorączką 39.3°C w przebiegu ospy wietrznej',
      vignette: '4-letni chłopiec w 3. dobie ospy wietrznej z licznymi wykwitami plamistymi, grudkowymi i pęcherzykowymi na tułowiu, twarzy i owłosionej skórze głowy. Od rana gorączka wzrosła do 39.3°C, dziecko marudne, obolałe.',
      drugId: 'paracetamol',
      weight: 18,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Kardynalny wybór leku przeciwgorączkowego',
          q: 'Jaki lek przeciwgorączkowy wolno podać dziecku z ospą wietrzną, a który jest BEZWZGLĘDNIE ZAKAZANY?',
          opts: [
            'Wolno podać PARACETAMOL; bezwzględnie ZAKAZANY jest IBUPROFEN (i inne NLPZ).',
            'Wolno podać IBUPROFEN; zakazany jest PARACETAMOL z powodu wątroby.',
            'Należy podawać kwas acetylosalicylowy (Aspirynę).',
            'Należy podawać naprzemiennie ibuprofen z paracetamolem co 2 godziny.'
          ],
          correct: 0,
          explanation: 'W ospie wietrznej lekiem z wyboru jest PARACETAMOL. Stosowanie ibuprofenu i innych NLPZ jest bezwzględnie przeciwwskazane, ponieważ drastycznie zwiększa ryzyko inwazyjnych zakażeń paciorkowcowych skóry i tkanki podskórnej, w tym martwiczego zapalenia powięzi (necrotizing fasciitis) oraz sepsy!'
        },
        {
          step: 2,
          title: 'Krok 2: Obliczenie dawki pojedynczej paracetamolu',
          q: 'Jaka jest prawidłowa jednorazowa dawka paracetamolu p.o. dla dziecka o masie 18 kg?',
          opts: [
            '270 mg (15 mg/kg m.c.) co 4-6 godzin',
            '180 mg (10 mg/kg m.c.) co 8 godzin',
            '500 mg co 12 godzin',
            '100 mg co 4 godziny'
          ],
          correct: 0,
          explanation: 'Dawka jednorazowa paracetamolu u dzieci wynosi 15 mg/kg m.c. doustnie (18 kg x 15 mg/kg = 270 mg). Można ją powtarzać co 4-6 godzin (maks. 4 razy na dobę, maks. 60 mg/kg/dobę).'
        },
        {
          step: 3,
          title: 'Krok 3: Wybór zawiesiny i objętość w ml',
          q: 'Wybierasz zawiesinę Paracetamol forte 250 mg / 5 ml (50 mg/ml). Ile ml odpowiada dawce 270 mg?',
          opts: [
            '5.4 ml co 4-6 godzin',
            '2.7 ml co 4-6 godzin',
            '10.8 ml co 4-6 godzin',
            '7.5 ml co 4-6 godzin'
          ],
          correct: 0,
          explanation: '270 mg / 50 mg/ml = 5.4 ml. Odmierzamy 5.4 ml strzykawką dozującą dołączoną do opakowania.'
        }
      ],
      pearl: 'Pytanie pewniak na egzaminie: Wirus ospy wietrznej (VZV) + Ibuprofen = Martwicze zapalenie powięzi i sepsa paciorkowcowa! Jedynym bezpiecznym lekiem przeciwgorączkowym jest Paracetamol.'
    },
    {
      id: 'chal_cap',
      title: 'Wyzwanie 4: 5-letni Olek (20 kg) z typowym pozaszpitalnym zapaleniem płuc (CAP)',
      vignette: '5-letni chłopiec z gorączką 39.0°C od 3 dni, kaszlem wilgotnym, przyspieszonym oddechem (32/min) i bólem w klatce piersiowej po stronie prawej. Osłuchowo: trzeszczenia i szmer oskrzelowy nad polem dolnym płuca prawego. Stan ogólny stabilny, saturacja 96%.',
      drugId: 'amoxicillin',
      weight: 20,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Lek pierwszego rzutu w typowym CAP',
          q: 'Jaki antybiotyk doustny jest lekiem 1. wyboru u dziecka z typowym bakteryjnym zapaleniem płuc leczonym ambulatoryjnie?',
          opts: [
            'Amoksycylina w wysokiej dawce 90 mg/kg/d',
            'Azytromycyna',
            'Cefuroksym aksetyl',
            'Cyprofloksacyna'
          ],
          correct: 0,
          explanation: 'Etiologia typowego bakteryjnego zapalenia płuc u dzieci to Streptococcus pneumoniae. Lekiem pierwszego rzutu jest amoksycylina w wysokiej dawce 90 mg/kg/dobę.'
        },
        {
          step: 2,
          title: 'Krok 2: Wyliczenie dawki dobowej i pojedynczej',
          q: 'Dla 20-kg dziecka dawka dobowa amoksycyliny wynosi 1800 mg (90 mg/kg). Jak podzielisz tę dawkę?',
          opts: [
            '600 mg co 8 godzin (w 3 dawkach) lub 900 mg co 12 godzin (w 2 dawkach)',
            '1800 mg 1 raz na dobę',
            '300 mg co 4 godziny',
            '400 mg co 12 godzin'
          ],
          correct: 0,
          explanation: 'Amoksycylina jako antybiotyk beta-laktamowy działa w mechanizmie czasowo-zależnym (T > MIC). W zapaleniu płuc zaleca się podział na 3 dawki co 8h (600 mg co 8h) lub 2 dawki co 12h (900 mg co 12h).'
        },
        {
          step: 3,
          title: 'Krok 3: Objętość zawiesiny 500 mg / 5 ml (100 mg/ml)',
          q: 'W schemacie 3 x dziennie po 600 mg, ile ml zawiesiny 500 mg/5 ml należy podać na jedną dawkę?',
          opts: [
            '6.0 ml co 8 godzin',
            '12.0 ml co 8 godzin',
            '3.0 ml co 8 godzin',
            '8.0 ml co 8 godzin'
          ],
          correct: 0,
          explanation: '600 mg / 100 mg/ml = 6.0 ml zawiesiny co 8 godzin przez 7-10 dni.'
        }
      ],
      pearl: 'Makrolidy (np. azytromycyna) w CAP włączamy TYLKO przy podejrzeniu etiologii atypowej (np. wiek szkolny, suchy męczący kaszel, rzężenia, brak reakcji na amoksycylinę po 48h) lub ciężkiej nadwrażliwości na beta-laktamy!'
    },
    {
      id: 'chal_uti',
      title: 'Wyzwanie 5: 18-miesięczna Hania (11 kg) z pierwszym epizodem ZUM',
      vignette: '18-miesięczna dziewczynka gorączkująca do 38.7°C od 2 dni bez uchwytnego ogniska infekcji w drogach oddechowych. W badaniu ogólnym moczu pobranym ze środkowego strumienia: leukocyturia (30-40 wpw), azotyny (+), białko (+). Zabezpieczono posiew moczu.',
      drugId: 'cefuroxime_axetil',
      weight: 11,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Wybór antybiotyku w ambulatoryjnym ZUM',
          q: 'Który z poniższych leków jest rekomendowany w empirycznym doustnym leczeniu ZUM u niemowlęcia / małego dziecka?',
          opts: [
            'Cefuroksym aksetyl (np. Zinnat 125 mg / 5 ml)',
            'Furazydyna (Furagina)',
            'Acyklowir',
            'Erytromycyna'
          ],
          correct: 0,
          explanation: 'Cefalosporyna II generacji (Cefuroksym aksetyl) lub amoksycylina z kwasem klawulanowym to leki pierwszego wyboru w ZUM u małych dzieci. Furazydyna nie osiąga stężenia terapeutycznego w miąższu nerkowym (nie nadaje się do leczenia OOZN / gorączkowego ZUM) i nie jest zalecana w monoterapii ostrego ZUM u niemowląt.'
        },
        {
          step: 2,
          title: 'Krok 2: Dawka dobowej cefuroksymu',
          q: 'Zalecana dawka cefuroksymu w ZUM wynosi 20-30 mg/kg/dobę w 2 dawkach co 12h. Ile mg wynosi dawka pojedyncza dla 11-kg dziecka przy dawce 25 mg/kg/d?',
          opts: [
            'ok. 137.5 mg co 12 godzin (275 mg/doba)',
            '500 mg co 12 godzin',
            '50 mg co 12 godzin',
            '250 mg 1 raz na dobę'
          ],
          correct: 0,
          explanation: '11 kg x 25 mg/kg = 275 mg na dobę. Podzielone na 2 dawki: 275 mg / 2 = 137.5 mg co 12 godzin.'
        },
        {
          step: 3,
          title: 'Krok 3: Objętość zawiesiny 125 mg / 5 ml (25 mg/ml)',
          q: 'Ile ml zawiesiny Zinnat 125 mg/5 ml odpowiada dawce 137.5 mg?',
          opts: [
            '5.5 ml co 12 godzin przez 7-10 dni',
            '2.5 ml co 12 godzin',
            '11.0 ml co 12 godzin',
            '7.0 ml co 12 godzin'
          ],
          correct: 0,
          explanation: '137.5 mg / 25 mg/ml = 5.5 ml co 12 godzin z posiłkiem przez 7-10 dni.'
        }
      ],
      pearl: 'Pamiętaj: Każdy pierwszy epizod gorączkowego ZUM u małego dziecka wymaga wykonania USG nerek i dróg moczowych w celu wykluczenia wad układu moczowego i odpływu pęcherzowo-moczowodowego (VUR)!'
    },
    {
      id: 'chal_croup',
      title: 'Wyzwanie 6: 2-letni Filip (13 kg) z podgłośniowym zapaleniem krtani (Krup)',
      vignette: '2-letni chłopiec obudził się w nocy z płaczem, zachrypniętym głosem, szczekającym kaszlem i głośnym świstem wdechowym (stridorem) w spoczynku. Dziecko w ramionach matki, zaciąga dołek jarzmowy. Skala Westleya: 4 punkty (krup umiarkowany).',
      drugId: 'dexamethasone',
      weight: 13,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Złoty standard farmakoterapii krupu',
          q: 'Jaki lek stanowi podstawę leczenia podgłośniowego zapalenia krtani (krupu)?',
          opts: [
            'Deksametazon doustnie jednorazowo (0.15-0.6 mg/kg) + nebulizacja z L-adrenaliny przy stridorze spoczynkowym',
            'Amoksycylina doustnie przez 10 dni',
            'Syrop przeciwkaszlowy z kodeiną',
            'Ceftriakson i.v.'
          ],
          correct: 0,
          explanation: 'Glikokortykosteroid (deksametazon p.o./i.m.) redukuje obrzęk podgłośniowy krtani. W razie duszności spoczynkowej natychmiast dołączamy nebulizację z nie-rozcieńczonej L-adrenaliny 1:1000 z tlenem.'
        },
        {
          step: 2,
          title: 'Krok 2: Dawka deksametazonu',
          q: 'Przy dawce 0.15 mg/kg m.c. dla dziecka 13 kg, ile mg deksametazonu należy podać?',
          opts: [
            'ok. 2.0 mg doustnie (0.5 ml z ampułki 4 mg / ml)',
            '8.0 mg doustnie',
            '20 mg doustnie',
            '0.2 mg doustnie'
          ],
          correct: 0,
          explanation: '13 kg x 0.15 mg/kg = 1.95 mg (ok. 2 mg). Zawartość ampułki do wstrzykiwań Dexamethason 4 mg/ml (czyli 0.5 ml) można podać doustnie, np. ze słodkim syropem lub musem owocowym.'
        }
      ],
      pearl: 'Triada krupu: chrypka, szczekający kaszel, świst wdechowy (stridor). Pamiętaj: NIE zaglądaj do gardła szpatułką na siłę (ryzyko nagłego skurczu krtani i asfiksji)!'
    },
    {
      id: 'chal_asthma',
      title: 'Wyzwanie 7: 7-letni Bartek (25 kg) z zaostrzeniem astmy oskrzelowej',
      vignette: '7-letni chłopiec z rozpoznaną astmą oskrzelową zgłasza się z dusznością wydechową, suchym kaszlem i świstami słyszalnymi z odległości po wysiłku fizycznym na basenie. Liczba oddechów 30/min, saturacja 94%, osłuchowo liczne furczenia i świsty wydechowe.',
      drugId: 'salbutamol',
      weight: 25,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Lek doraźny pierwszego wyboru',
          q: 'Jaki lek i droga podania są postępowaniem z wyboru w celu natychmiastowego przerwania obturacji oskrzeli?',
          opts: [
            'Szybko działający beta-2-mimetyk (SABA – Salbutamol) w inhalacji / nebulizacji',
            'Glikokortykosteroid doustny jako jedyny lek',
            'Teofilina dożylnie',
            'Antybiotyk makrolidowy'
          ],
          correct: 0,
          explanation: 'Salbutamol (SABA) w inhalacji przez komorę inhalacyjną (spejser) lub nebulizator pneumatyczny to lek pierwszego rzutu znoszący skurcz mięśniówki oskrzeli w ciągu kilku minut.'
        },
        {
          step: 2,
          title: 'Krok 2: Dawka salbutamolu do nebulizacji',
          q: 'Jaka jest dawka salbutamolu w roztworze do nebulizacji 1 mg/ml (Ventolin) dla 25-kg dziecka?',
          opts: [
            '2.5 mg (1 ampułka 2.5 ml) rozcieńczona w 2 ml 0.9% NaCl',
            '0.5 mg w 5 ml wody',
            '10 mg nierozcieńczone',
            '5 kropli doustnie'
          ],
          correct: 0,
          explanation: 'Dawka salbutamolu wynosi 0.15 mg/kg (25 kg x 0.15 mg/kg = 3.75 mg, ale standardowa dawka jednorazowa ampułkowa u dzieci w tym wieku wynosi 2.5 mg). Rozcieńczamy w 2 ml soli fizjologicznej i inhalujemy przez 5-10 minut.'
        }
      ],
      pearl: 'Złota zasada w astmie: Brak świstów u dziecka z ciężką dusznością wydechową i sinicą to objaw „cichej klatki piersiowej” (silent chest) – skrajne zmęczenie mięśni oddechowych i stan bezpośredniego zagrożenia życia!'
    },
    {
      id: 'chal_seizure',
      title: 'Wyzwanie 8: 10-miesięczny Tymek (9.5 kg) z przedłużającymi się drgawkami gorączkowymi',
      vignette: '10-miesięczne niemowlę z gorączką 39.5°C w przebiegu infekcji wirusowej nagle zesztywniało i ma uogólnione drgawki toniczno-kloniczne. Napad trwa już 6 minut i nie ustępuje samoistnie. Zespół ratownictwa medycznego lub SOR bez kaniulacji żyły.',
      drugId: 'midazolam',
      weight: 9.5,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Przerwanie przedłużających się drgawek',
          q: 'Jaki lek i droga podania są preferowane wg PALS/ERC przy braku dostępu naczyniowego u drgającego dziecka >5 min?',
          opts: [
            'Midazolam na błonę śluzową policzka (bukalnie) 0.2-0.3 mg/kg lub Diazepam doodbytniczo (wlewka p.r. 5 mg)',
            'Paracetamol w czopku',
            'Doustny kwas walproinowy',
            'Fenytoina domięśniowo'
          ],
          correct: 0,
          explanation: 'Przy braku dostępu i.v. lekiem 1. wyboru jest Midazolam podany na błonę śluzową policzka (Buccolam) lub Diazepam doodbytniczo we wlewce (wlewka 5 mg dla dzieci <15 kg).'
        },
        {
          step: 2,
          title: 'Krok 2: Dawka Midazolamu bukalnego',
          q: 'Dla niemowlęcia o masie 9.5 kg (wiek 10 miesięcy), jaka dawka gotowej strzykawki Buccolam jest zarejestrowana?',
          opts: [
            '2.5 mg bukalnie (strzykawka z żółtą etykietą, dla wieku 6 m.ż. - 1 rok)',
            '5.0 mg bukalnie',
            '10 mg bukalnie',
            '0.5 mg bukalnie'
          ],
          correct: 0,
          explanation: 'Gotowy preparat Buccolam dla wieku 6-12 miesięcy ma stałą dawkę 2.5 mg w strzykawce doustnej, co idealnie odpowiada dawce ok. 0.25 mg/kg dla 9.5-kg niemowlęcia.'
        }
      ],
      pearl: 'Pamiętaj: Każdy napad drgawek trwający >5 minut traktujemy i leczymy jak stan padaczkowy (Status Epilepticus) – nie czekaj na samoistne ustąpienie po 5. minucie!'
    },
    {
      id: 'chal_mycoplasma',
      title: 'Wyzwanie 9: 9-letnia Maja (28 kg) z atypowym zapaleniem płuc',
      vignette: '9-letnia dziewczynka od tygodnia skarży się na suchy, napadowy, męczący kaszel, ból głowy i stan podgorączkowy 37.8°C. Wcześniej leczona amoksycyliną przez 4 doby bez poprawy. Osłuchowo nad płucami skąpe trzeszczenia, RTG: obustronne nacieki śródmiąższowe.',
      drugId: 'azithromycin',
      weight: 28,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Zmiana antybiotyku na lek atypowy',
          q: 'Brak poprawy po amoksycylinie i cechy zapalenia śródmiąższowego u 9-latki sugerują Mycoplasma pneumoniae. Jaki antybiotyk należy zastosować?',
          opts: [
            'Azytromycyna (Sumamed) – makrolid działający na drobnoustroje wewnątrzkomórkowe',
            'Augmentin w wyższej dawce',
            'Cefuroksym',
            'Ampicylina'
          ],
          correct: 0,
          explanation: 'Mycoplasma pneumoniae nie posiada ściany komórkowej (peptydoglikanu), dlatego wszystkie antybiotyki beta-laktamowe (penicyliny, cefalosporyny) są na nią całkowicie nieskuteczne! Lekiem z wyboru są makrolidy (Azytromycyna, Klarytromycyna).'
        },
        {
          step: 2,
          title: 'Krok 2: Dawka azytromycyny',
          q: 'Jaka jest dawka azytromycyny dla 28-kg dziewczynki?',
          opts: [
            '10 mg/kg m.c./dobę 1 raz na dobę przez 3 dni (280 mg/dobę)',
            '50 mg/kg m.c./dobę co 8 godzin przez 10 dni',
            '100 mg co 12 godzin przez 7 dni',
            '500 mg co 6 godzin'
          ],
          correct: 0,
          explanation: 'Standardowy schemat azytromycyny u dzieci to 10 mg/kg m.c. raz dziennie przez 3 dni (maks. 500 mg/dobę). Lek kumuluje się w komórkach i działa w tkankach jeszcze przez kilka dni po zakończeniu przyjmowania.'
        }
      ],
      pearl: 'Pamiętaj: Mycoplasma pneumoniae NIE ma ściany komórkowej! Dlatego penicyliny i cefalosporyny w ogóle na nią nie działają.'
    },
    {
      id: 'chal_shock',
      title: 'Wyzwanie 10: 3-letni Antoś (14 kg) we wczesnym wstrząsie septycznym',
      vignette: '3-letni chłopiec przyjęty na SOR z wysoką gorączką 40.0°C, wybroczynami na skórze ud (plamica piorunująca), tachykardią 180/min, CRT 4 sekundy i chłodnymi marmurkowatymi kończynami. Ciśnienie tętnicze 78/40 mmHg.',
      drugId: 'ceftriaxone_iv',
      weight: 14,
      steps: [
        {
          step: 1,
          title: 'Krok 1: Natychmiastowa resuscytacja płynowa we wstrząsie (PALS)',
          q: 'Jaki bolus płynowy i.v./i.o. należy podać natychmiast u dziecka we wstrząsie septycznym?',
          opts: [
            '20 ml/kg m.c. zrównoważonego krystaloidu lub 0.9% NaCl (280 ml) w bolusie pod ciśnieniem w ciągu 10-15 minut',
            '5 ml/kg 5% glukozy w powolnym wlewie 4-godzinnym',
            'Wlew 10% NaCl',
            'Furosemid 2 mg/kg'
          ],
          correct: 0,
          explanation: 'Zgodnie z wytycznymi PALS i Surviving Sepsis Campaign: natychmiastowy bolus płynu izotonicznego wynosi 20 ml/kg (dla 14 kg = 280 ml) podany szybko w ciągu 10-15 min, z ponowną oceną cech przewodnienia (wątroba, rzężenia).'
        },
        {
          step: 2,
          title: 'Krok 2: Antybiotykoterapia w Złotej Godzinie (Golden Hour)',
          q: 'Jaki antybiotyk dożylny należy podać natychmiast w ciągu 1. godziny u dziecka z podejrzeniem sepsy meningokokowej / pozaszpitalnej?',
          opts: [
            'Ceftriakson i.v. w dawce 100 mg/kg/dobę (1400 mg) + Wankomycyna',
            'Amoksycylina doustnie',
            'Gentamycyna w maści',
            'Oczekiwanie na wynik posiewu krwi przez 48 godzin'
          ],
          correct: 0,
          explanation: 'We wstrząsie septycznym każda godzina opóźnienia antybiotyku zwiększa śmiertelność! Należy natychmiast podać cefalosporynę III generacji i.v. (Ceftriakson 100 mg/kg/d lub Cefotaksym) w skojarzeniu z wankomycyną.'
        }
      ],
      pearl: 'Zasada Złotej Godziny (Golden Hour): Pobierz posiewy krwi i natychmiast podaj antybiotyk o szerokim spektrum i.v. w ciągu maksymalnie 60 minut od podejrzenia sepsy!'
    }
  ];


  /* ---------- ATLAS OSUTEK I ZAKAŻEŃ DZIECIĘCYCH (PEDIATRIC RASH DATABASE) ---------- */
  const PEDIATRIC_RASH_DATABASE = [
    {
      id: 'odra',
      name: 'Odra (Morbilli)',
      altName: 'Choroba pierwsza',
      etiology: 'Wirus odry (Morbillivirus, ssRNA(-))',
      incubation: '8–12 dni do zwiastunów, ok. 14 dni do pojawienia się osutki',
      prodrome: '3–4 dni wysoka gorączka (39–40°C), katar, szczekający suchy kaszel, obfite zapalenie spojówek ze światłowstrętem ("pies szczeka, oczy płaczą")',
      pathognomonic: 'Plamki Koplika – białe wykwity wielkości ziaren piasku na przekrwionej śluzówce policzków przy dolnych trzonowcach (pojawiają się 24–48h przed osutką, znikają w 2. dobie wysypki)',
      rashType: 'Gruboplamisto-grudkowa, zlewająca się, żywoczerwona (skóra między wykwitami zmieniona rumieniowo)',
      spread: 'Zstępująca (od góry do dołu): dzień 1 – za uszami, linia włosów, twarz, szyja; dzień 2 – klatka piersiowa, brzuch, plecy; dzień 3 – ramiona, dłonie, uda, podudzia i stopy',
      evolution: 'Trwa 5–6 dni; ustępuje w tej samej kolejności (od głowy w dół), pozostawiając brunatne przebarwienia (złogi hemosyderyny) oraz drobne otrębiaste łuszczenie',
      glassTest: 'blanching',
      glassTestNote: 'Wykwity bledną pod uciskiem szkiełka (osutka rumieniowo-zapalna, brak wynaczynienia krwi)',
      bodyRegions: ['face', 'ears', 'neck', 'chest', 'back', 'arms', 'hands', 'legs', 'feet'],
      specialZones: [
        { label: 'Plamki Koplika', desc: 'Błona śluzowa policzków naprzeciw dolnych zębów trzonowych' },
        { label: 'Początek za uszami', desc: 'Wykwity zaczynają się za małżowinami usznymi na linii włosów' }
      ],
      complications: 'Zapalenie ucha środkowego (najczęstsze), zapalenie płuc (olbrzymiokomórkowe Hechta lub bakteryjne – główna przyczyna zgonu), zapalenie mózgu (1:1000), podostre stwardniające zapalenie mózgu (SSPE, 1:10 000 po 7–10 latach)',
      treatment: 'Objawowe; suplementacja witaminy A w wysokiej dawce (200 000 j.m. u dzieci >1 r.ż.) zmniejsza śmiertelność i powikłania oczne',
      isolation: 'Izolacja chorego przez 4 dni od wystąpienia wysypki. BEZWZGLĘDNY OBOWIĄZEK natychmiastowego zgłoszenia do Sanepidu (PSSE)!',
      pearl: 'Odra jest jedną z najbardziej zakaźnych chorób świata (R0 = 12–18). Brunatnienie i otrębiaste łuszczenie to znak rozpoznawczy fazy ustępowania.'
    },
    {
      id: 'plonica',
      name: 'Płonica / Szkarlatyna (Scarlatina)',
      altName: 'Choroba druga',
      etiology: 'Streptococcus pyogenes (PBHA – paciorkowiec beta-hemolizujący grupy A) wytwarzający toksyny erytrogenne (pirogenne SpeA/B/C)',
      incubation: '1–5 dni (bardzo krótki!)',
      prodrome: 'Nagły początek: wysoka gorączka (>39°C), dreszcze, silny ból gardła (angina paciorkowcowa), wymioty, ból brzucha',
      pathognomonic: 'Trójkąt Fiłatowa (bladość wokół ust przy płonących policzkach), linie Pastii (wybroczyny w zgięciach łokciowych/pachwinowych), język malinowy od 3.–4. doby',
      rashType: 'Drobniutko plamisto-grudkowa (wielkości łebka od szpilki), szorstka w dotyku jak "papier ścierny" lub "skóra gęsia"',
      spread: 'Najgęstsza na tułowiu, podbrzuszu, pośladkach, w dołach pachowych i pachwinach; twarz z rumieniem policzków i bladym trójkątem wokół ust',
      evolution: 'Ustępuje po 3–6 dniach; po 2–3 tygodniach występuje charakterystyczne GRUBOPŁATOWE łuszczenie naskórka (szczególnie dłoni i stóp)',
      glassTest: 'blanching',
      glassTestNote: 'Drobna osutka blednie pod uciskiem szkiełka; linie Pastii w fałdach zgięciowych nie bledną całkowicie z powodu mikrowylewów krwawych',
      bodyRegions: ['cheeks', 'chest', 'abdomen', 'back', 'groin', 'elbows', 'thighs'],
      specialZones: [
        { label: 'Trójkąt Fiłatowa', desc: 'Blada skóra wokół ust i skrzydełek nosa wolna od wykwitów' },
        { label: 'Linie Pastii', desc: 'Ciemnoczerwone pasma wybroczynowe w zgięciach łokciowych i pachwinowych' },
        { label: 'Język malinowy', desc: 'Żywoczerwony język z przerosłymi brodawkami od 3.–4. dnia' }
      ],
      complications: 'Wczesne ropne: ropień okołomigdałkowy, zapalenie ucha środkowego; Późne immunologiczne: gorączka reumatyczna, ostre kłębuszkowe zapalenie nerek (PSGN)',
      treatment: 'Fenoksymetylopenicylina (Penicylina V) p.o. 100 000 j.m./kg/dobę w 2 dawkach co 12h przez PEŁNE 10 DNI (zapobieganie gorączce reumatycznej!)',
      isolation: 'Izolacja przez 24 godziny od podania pierwszej skutecznej dawki penicyliny (po 24h pacjent nie zakaża).',
      pearl: 'Pamiętaj: Skrócenie kuracji penicyliną z 10 do 5–7 dni to kardynalny błąd – nie eradykuje paciorkowca z krypt migdałków i grozi gorączką reumatyczną!'
    },
    {
      id: 'rozyczka',
      name: 'Różyczka (Rubella)',
      altName: 'Choroba trzecia',
      etiology: 'Wirus różyczki (Rubivirus, Togaviridae, ssRNA(+))',
      incubation: '14–21 dni (średnio 16–18 dni)',
      prodrome: 'Bardzo łagodny: stan podgorączkowy, złe samopoczucie, bolesne powiększenie węzłów chłonnych karkowych, podpotylicznych i zausznych (często 24h przed wysypką)',
      pathognomonic: 'Bolesne powiększenie węzłów chłonnych podpotylicznych i zausznych + plamki Forchheimera (drobne wybroczynki na podniebieniu miękkim)',
      rashType: 'Bladoróżowa, drobno- i średnioplamisto-grudkowa, NIE ZLEWA SIĘ (w odróżnieniu od odry)',
      spread: 'Zstępująca: pojawia się na twarzy i w ciągu 24h szybko rozprzestrzenia się na tułów i kończyny; trwa krótko (2–3 dni)',
      evolution: 'Znika szybko bez pozostawiania przebarwień i bez łuszczenia',
      glassTest: 'blanching',
      glassTestNote: 'Blednie całkowicie pod uciskiem szkiełka (osutka rumieniowa)',
      bodyRegions: ['face', 'neck_lymph', 'chest', 'back', 'arms', 'legs'],
      specialZones: [
        { label: 'Węzły podpotyliczne', desc: 'Bolesne, powiększone węzły chłonne zauszne i karkowe' },
        { label: 'Plamki Forchheimera', desc: 'Drobne czerwone plamki na podniebieniu miękkim' }
      ],
      complications: 'Zapalenie stawów (zwłaszcza u dziewcząt i kobiet), małopłytkowość poinfekcyjna; ZESPÓŁ RÓŻYCZKI WRODZONEJ (zespół Gregga: wady serca, zaćma, głuchota) u płodów matek zakażonych w I trymestrze ciąży',
      treatment: 'Objawowe; bezwzględna ochrona kobiet ciężarnych',
      isolation: 'Izolacja chorego przez 7 dni od wystąpienia wysypki. Zakaz kontaktu z ciężarnymi!',
      pearl: 'Powiększenie węzłów chłonnych podpotylicznych i zausznych to najczulszy kliniczny drogowskaz różyczki w teście i na oddziale.'
    },
    {
      id: 'rumien_zakazny',
      name: 'Rumień zakaźny / Parwowirus B19',
      altName: 'Choroba piąta (Erythema infectiosum)',
      etiology: 'Parwowirus B19 (ssDNA) – tropizm do erytroblastów szpiku',
      incubation: '4–14 dni (do 21 dni)',
      prodrome: 'Brak lub bardzo dyskretny (stan podgorączkowy, katar)',
      pathognomonic: '"Spoliczkowane dziecko" (jaskrawoczerwony rumień na policzkach) + girlandowata/koronkowata osutka na ramionach i udach nasilająca się pod wpływem ciepła i kąpieli',
      rashType: 'Trzyetapowa: 1) rumień policzków z bladością okołoustną; 2) girlandowata, siateczkowata osutka na kończynach; 3) zmienność i nawroty po kąpieli/wysiłku',
      spread: 'Twarz (policzki) ➔ ramiona, uda, pośladki; dłonie i stopy zazwyczaj wolne',
      evolution: 'Może nawracać i blednąć przez 1–3 tygodnie pod wpływem ciepłej wody, słońca lub emocji; nie łuszczy się',
      glassTest: 'blanching',
      glassTestNote: 'Blednie całkowicie pod uciskiem szkiełka',
      bodyRegions: ['cheeks', 'arms', 'thighs', 'buttocks'],
      specialZones: [
        { label: 'Spoliczkowane dziecko', desc: 'Intensywnie czerwony, lśniący rumień obu policzków' },
        { label: 'Koronka / Girlanda', desc: 'Siateczkowate, girlandowate zmiany na zewnętrznej powierzchni ramion i ud' }
      ],
      complications: 'Przełom aplastyczny (u osób z przewlekłą hemolizą, np. sferocytozą), zespół rękawiczek i skarpetek, obrzęk uogólniony płodu (hydrops fetalis) u ciężarnych',
      treatment: 'Objawowe; pacjent z chwilą pojawienia się wysypki NIE JEST JUŻ ZAKAŹNY (faza zakaźna to wiremia przed osutką)',
      isolation: 'Dziecko NIE WYMAGA izolacji i może chodzić do przedszkola/szkoły. Bezwzględny zakaz kontaktu z kobietami w ciąży!',
      pearl: 'Gdy pojawia się "spoliczkowana twarz", zakaźność minęła! Dziecko nie zakaża rówieśników w klasie, ale zakażenie jest śmiertelnie groźne dla płodu.'
    },
    {
      id: 'rumien_nagly',
      name: 'Rumień nagły / Gorączka trzydniowa',
      altName: 'Choroba szósta (Exanthema subitum)',
      etiology: 'Ludzki herpeswirus typu 6 (HHV-6B), rzadziej HHV-7',
      incubation: '9–10 dni',
      prodrome: '3–5 dni bardzo wysokiej gorączki (39.5–40.5°C) przy zaskakująco dobrym stanie ogólnym, bez kataru czy kaszlu; częste drgawki gorączkowe!',
      pathognomonic: 'Błyskawiczne pojawienie się bladoróżowej osutki W MOMENCIE GWAŁTOWNEGO SPADKU GORĄCZKI ("kryzys temperaturowy")',
      rashType: 'Drobne, bladoróżowe plamki i grudki wielkości 2–3 mm, nie zlewają się',
      spread: 'Przede wszystkim TUŁÓW (klatka piersiowa, brzuch, plecy), rzadziej szyja i nasady ramion; TWARZ I KOŃCZYNY DOLNE SĄ OSZCZĘDZONE',
      evolution: 'Trwa zaledwie 24–48 godzin i znika bez śladu, bez przebarwień i bez łuszczenia',
      glassTest: 'blanching',
      glassTestNote: 'Blednie całkowicie pod uciskiem szkiełka',
      bodyRegions: ['chest', 'abdomen', 'back', 'neck'],
      specialZones: [
        { label: 'Tułów centralnie', desc: 'Wykwity skupione głównie na klatce piersiowej i brzuchu' },
        { label: 'Twarz wolna', desc: 'Twarz i nogi pozostają całkowicie wolne od wysypki' }
      ],
      complications: 'Drgawki gorączkowe (w fazie gwałtownego narastania gorączki), bardzo rzadko zapalenie mózgu',
      treatment: 'Objawowe (leki przeciwgorączkowe, nawadnianie doustne); brak wskazań do antybiotykoterapii',
      isolation: 'Dziecko przestaje zakażać z chwilą normalizacji temperatury ciała.',
      pearl: 'Złota zasada pediatrii: Gdy gorączka nagle spada do normy i pojawia się wysypka na brzuszku – to rumień nagły. Antybiotyk jest tu błędem w sztuce!'
    },
    {
      id: 'ospa_wietrzna',
      name: 'Ospa wietrzna (Varicella)',
      altName: 'Wiatrówka',
      etiology: 'Wirus ospy wietrznej i półpaśca (VZV – Varicella Zoster Virus, HHV-3)',
      incubation: '10–21 dni (najczęściej 14–16 dni)',
      prodrome: '1–2 dni stan podgorączkowy, ból głowy, spadek apetytu',
      pathognomonic: 'Polimorfizm wykwitów (plamka ➔ grudka ➔ pęcherzyk "kropla rosy" ➔ krostka ➔ strupek) w kilku rzutach ("gwiaździste niebo") + zajęcie owłosionej skóry głowy i śluzówek',
      rashType: 'Pęcherzykowa na podłożu rumieniowym, silnie swędząca; wykwity wielopostaciowe na jednym obszarze',
      spread: 'Zaczyna się na tułowiu i owłosionej skórze głowy, potem twarz i kończyny (rozkład dośrodkowy: więcej na tułowiu niż dystalnie na kończynach)',
      evolution: 'Rzuty co 24–48h przez 3–5 dni; pęcherzyki zasychają w strupki po 6–8 dniach; strupki odpadają po 1–2 tygodniach bez blizn (chyba że doszło do nadkażenia bakteryjnego)',
      glassTest: 'vesicle',
      glassTestNote: 'Pęcherzyki nie znikają pod uciskiem (zawierają płyn bogaty w cząstki wirusa); rumień wokół pęcherzyka blednie',
      bodyRegions: ['scalp', 'face', 'chest', 'back', 'abdomen', 'arms', 'legs', 'mucosa'],
      specialZones: [
        { label: 'Owłosiona skóra głowy', desc: 'Obecność pęcherzyków na głowie we włosach to kluczowa cecha różnicowa' },
        { label: 'Błony śluzowe', desc: 'Bolesne nadżerki w jamie ustnej i okolicy narządów płciowych' }
      ],
      complications: 'Bakteryjne zakażenia skóry (liszajec, martwicze zapalenie powięzi!), ostra ataksja móżdżkowa (chód na szerokiej podstawie), zapalenie płuc, zespół Reye\'a (po kwasie acetylosalicylowym)',
      treatment: 'Objawowe: Paracetamol na gorączkę (BEZWZGLĘDNY ZAKAZ IBUPROFENU/NLPZ!), kąpiele odkażające, leki p/świądowe; Acyklowir w grupach ryzyka',
      isolation: 'Pacjent zakaża od 1–2 dni PRZED pojawieniem się osutki aż do zaschnięcia WSZYSTKICH pęcherzyków w strupki. Strupki nie są zakaźne!',
      pearl: 'PUŁAPKA LEK: Ibuprofen w ospie jest ZAKAZANY – dramatycznie zwiększa ryzyko inwazyjnych zakażeń paciorkowcowych i martwiczego zapalenia powięzi!'
    },
    {
      id: 'hfmd',
      name: 'Choroba dłoni, stóp i jamy ustnej (HFMD)',
      altName: 'Bostonka (Hand, Foot and Mouth Disease)',
      etiology: 'Enterowirusy, najczęściej Coxsackie A16 oraz Enterowirus 71 (EV71)',
      incubation: '3–6 dni',
      prodrome: 'Stan podgorączkowy, ból gardła, ślinotok, odmowa jedzenia i picia (bolesne afty)',
      pathognomonic: 'Owalne, podłużne, szarawe pęcherzyki otoczone czerwoną obwódką na dłoniach, podeszwach stóp i pośladkach + bolesne afty i nadżerki w jamie ustnej (herpangina)',
      rashType: 'Pęcherzykowa: małe, twarde pęcherzyki układające się wzdłuż linii papilarnych, nie pękają łatwo',
      spread: 'Dłonie (powierzchnia dłoniowa), podeszwy stóp, błona śluzowa jamy ustnej, pośladki, rzadziej kolana i łokcie',
      evolution: 'Trwa 7–10 dni, pęcherzyki wchłaniają się bez pękania; po 4–8 tygodniach może wystąpić bezbolesne odklejanie się płytek paznokciowych (onychomadesis)',
      glassTest: 'vesicle',
      glassTestNote: 'Szare pęcherzyki są wyczuwalne i widoczne pod uciskiem szkiełka; obwódka rumieniowa blednie',
      bodyRegions: ['palms', 'soles', 'mouth', 'buttocks'],
      specialZones: [
        { label: 'Powierzchnia dłoniowa', desc: 'Szarawe pęcherzyki wzdłuż linii zgięciowych dłoni' },
        { label: 'Podeszwy stóp', desc: 'Bolesne pęcherzyki na podeszwach utrudniające chodzenie' },
        { label: 'Onychomadesis (późne)', desc: 'Oddzielanie się i schodzenie paznokci 1–2 miesiące po chorobie' }
      ],
      complications: 'Odwodnienie z powodu bolesności połykania (odmowa picia); przy enterowirusie 71: aseptyczne ZOMR, zapalenie pnia mózgu, obrzęk płuc',
      treatment: 'Wyłącznie objawowe: leki przeciwbólowe (paracetamol, ibuprofen), chłodne płyny, unikanie kwaśnych pokarmów',
      isolation: 'W okresie gorączkowym i świeżych wykwitów. Wirus wydala się ze stolcem przez kilka tygodni.',
      pearl: 'Schodzące paznokcie (onychomadesis) po kilku tygodniach od gorączki to późny objaw przebytej bostonki – nie wymaga leczenia przeciwgrzybiczego!'
    },
    {
      id: 'kawasaki',
      name: 'Choroba Kawasakiego (Kawasaki Disease)',
      altName: 'Zespół skórno-śluzówkowo-węzłowy (MCLS)',
      etiology: 'Ostre, uogólnione zapalenie naczyń średniego kalibru o podłożu autoimmunologicznym wyzwalane przez infekcję',
      incubation: 'Nie dotyczy (choroba naczyniowa niezakaźna bezpośrednio)',
      prodrome: 'Wysoka gorączka trwająca ≥5 dni (nie ustępuje po paracetamolu i antybiotykach!) u dziecka typowo w wieku 6 m.ż. – 5 lat',
      pathognomonic: 'Gorączka ≥5 dni + min. 4 z 5 kryteriów: 1) bezwysiękowe zapalenie spojówek; 2) truskawkowy język i spierzchnięte wargi; 3) polimorficzna osutka (nie pęcherzykowa!); 4) obrzęk i rumień dłoni/stóp; 5) węzeł szyjny >1.5 cm',
      rashType: 'Polimorficzna: najczęściej plamisto-grudkowa, rumieniowa lub tarczowata; nasilona w okolicy pieluszkowej; NIGDY NIE JEST PĘCHERZYKOWA',
      spread: 'Tułów, okolica krocza, kończyny, bez pęcherzyków',
      evolution: 'W fazie podostrej (po 2–3 tygodniach) charakterystyczne płatowe łuszczenie naskórka rozpoczynające się wokół płytek paznokciowych dłoni i stóp',
      glassTest: 'blanching',
      glassTestNote: 'Rumień i osutka bledną pod uciskiem szkiełka',
      bodyRegions: ['eyes', 'lips', 'neck_lymph', 'chest', 'groin', 'hands_edema', 'feet_edema'],
      specialZones: [
        { label: 'Oczy bez ropy', desc: 'Obustronne przekrwienie spojówek bez wydzieliny ropnej (oszczędza rąbek rogówki)' },
        { label: 'Wargi i język', desc: 'Spierzchnięte, krwawiące wargi i żywoczerwony język truskawkowy' },
        { label: 'Obrzęk dłoni i stóp', desc: 'Twardy, bolesny obrzęk i rumień grzbietów rąk i stóp' }
      ],
      complications: 'TĘTNIAKI TĘTNIC WIEŃCOWYCH (u 25% nieleczonych dzieci!), zawał mięśnia sercowego, zapalenie mięśnia sercowego, tętniaki naczyń obwodowych',
      treatment: 'PILNE podanie Immunoglobulin i.v. (IVIG) 2 g/kg m.c. w pojedynczym wlewie w ciągu pierwszych 10 dni gorączki + Kwas acetylosalicylowy (ASA) w dawce p/zapalnej, potem p/płytkowej',
      isolation: 'Choroba NIE JEST zakaźna. Wymaga natychmiastowej hospitalizacji i kontroli echokardiograficznej (ECHO serca)!',
      pearl: 'Gorączka trwająca >5 dni u malucha + czerwone oczy bez ropy + język malinowy = natychmiast zleć ECHO serca i podaj IVIG. Walczysz o tętnice wieńcowe!'
    },
    {
      id: 'plamica_iga',
      name: 'Plamica związana z IgA (Schönleina-Henocha)',
      altName: 'Zapalenie naczyń związane z IgA (IgAV)',
      etiology: 'Zapalenie małych naczyń krwionośnych z odkładaniem kompleksów IgA1; często po przebytej infekcji dróg oddechowych',
      incubation: 'Objawy pojawiają się zwykle 1–3 tygodnie po infekcji gardła',
      prodrome: 'Złe samopoczucie, stan podgorączkowy, pobolewania stawów lub brzucha',
      pathognomonic: 'Uniesiona plamica (purpura palpabilis) nieblednąca pod uciskiem, zlokalizowana grawitacyjnie na pośladkach i wyprostnych powierzchniach kończyn dolnych + PRAWIDŁOWE PŁYTKI KRWI',
      rashType: 'Wybroczyny i uniesione grudki krwotoczne (purpura palpabilis), początkowo czerwone, potem purpurowe i brunatne; wyczuwalne palpacyjnie',
      spread: 'Ściśle grawitacyjna i symetryczna: pośladki, tylne powierzchnie ud, podudzia, stawy skokowe; tułów i twarz zazwyczaj wolne',
      evolution: 'Nowe rzuty wykwitów mogą pojawiać się przy pionizacji; ustępuje w ciągu 4–6 tygodni',
      glassTest: 'non_blanching',
      glassTestNote: 'NIE BLEDNIE POD UCISKIEM SZKIEŁKA (wynaczynienie krwinek czerwonych do skóry właściwej na skutek leukocytoklastycznego zapalenia naczyń)',
      bodyRegions: ['buttocks', 'thighs_back', 'shins', 'ankles'],
      specialZones: [
        { label: 'Pośladki i łydki', desc: 'Symetryczne skupiska purpura palpabilis na wyprostnych powierzchniach nóg i pośladkach' },
        { label: 'Obrzęk stawów', desc: 'Bolesny obrzęk okołostawowy bez ucieplenia (zwłaszcza stawy skokowe)' }
      ],
      complications: 'Nefropatia IgA (krwinkomocz, białkomocz, niewydolność nerek – decyduje o rokowaniu!), wgłobienie jelitowe (intussusception), krwawienie z przewodu pokarmowego',
      treatment: 'Odpoczynek w łóżku, unikanie pionizacji w fazie ostrej, nawadnianie; glikokortykosteroidy w ciężkim bólu brzucha lub zapaleniu nerek; kontrola moczu i ciśnienia przez 6 miesięcy',
      isolation: 'Choroba niezakaźna.',
      pearl: 'Nieblednąca wysypka na pośladkach + prawidłowa morfologia z normalną liczbą płytek krwi = plamica Schönleina-Henocha. Zawsze monitoruj mocz przez 6 miesięcy!'
    },
    {
      id: 'meningokokemia',
      name: 'Meningokokemia / Posocznica meningokokowa',
      altName: 'Inwazyjna Choroba Meningokokowa (IChM)',
      etiology: 'Neisseria meningitidis (meningokoki grupy B, C, W, Y) – Gram-ujemna dwoinka',
      incubation: '2–10 dni (zwykle 3–4 dni)',
      prodrome: 'Piorunujący początek: wysoka gorączka, dreszcze, silny ból mięśni nóg, bladość powłok, sinica wokół ust, zimne stopy i dłonie, tachykardia, skrajna apatia',
      pathognomonic: 'Osutka wybroczynowa i martwicza (petechiae / purpura fulminans) – NIE BLEDNIE W TEŚCIE SZKLANKOWYM i błyskawicznie powiększa się w ciągu minut/godzin!',
      rashType: 'Początkowo drobne czerwone wybroczynki (jak ukłucia szpilką), szybko przechodzące w zlewające się, podbiegnięte krwawo plamy o nieregularnym, gwiazdkowatym kształcie z siną martwicą centralną',
      spread: 'Dowolna lokalizacja: tułów, kończyny (szczególnie podudzia), pośladki, spojówki',
      evolution: 'Gwałtowny postęp w ciągu 2–6 godzin od pierwszych wybroczyn do rozległej martwicy krwotocznej i wstrząsu septycznego',
      glassTest: 'non_blanching',
      glassTestNote: 'BEZWZGLĘDNIE NIE BLEDNIE POD UCISKIEM SZKIEŁKA (test szklankowy ujemny) – stan bezpośredniego zagrożenia życia!',
      bodyRegions: ['chest', 'abdomen', 'arms', 'shins', 'feet', 'petechiae_all'],
      specialZones: [
        { label: 'Gwiazdkowate wybroczyny', desc: 'Nieregularne, sine podbiegnięcia krwawe nieblednące pod uciskiem' },
        { label: 'Zimne dłonie i stopy', desc: 'Objaw centralizacji krążenia we wczesnym wstrząsie septycznym' }
      ],
      complications: 'Wstrząs septyczny, zespół Waterhouse\'a-Friderichsena (krwotoczna martwica nadnerczy), DIC, amputacje kończyn z powodu martwicy, zgon w ciągu kilkunastu godzin',
      treatment: 'NATYCHMIASTOWE podanie Ceftriaksonu (100 mg/kg i.v./i.m.) lub penicyliny krystalicznej – NIE CZEKAĆ na wyniki badań ani transport! Wezwanie ZRM z kodem pilności 1.',
      isolation: 'Izolacja kropelkowa przez pierwsze 24h antybiotykoterapii. Chemioprofilaktyka osób z bliskiego kontaktu (Ceftriakson, Ryfampicyna lub Ciprofloksacyna).',
      pearl: 'ZASADA TESTU SZKLANKOWEGO: Jeśli gorączkujące dziecko ma choć jedną wybroczynę nieblednącą pod szklanką – natychmiast wstrzyknij Ceftriakson i wezwij erkę!'
    }
  ];

  /* ---------- TRENING DIAGNOSTYCZNY OSUTEK (10 ZAGADEK KLINICZNYCH) ---------- */
  const RASH_PUZZLES = [
    {
      id: 'puz_odra',
      title: 'Przypadek 1: 4-letni Antoś z wysoką gorączką i zapaleniem spojówek',
      vignette: '4-letni nieszczepiony chłopiec zostaje przyprowadzony do poradni z powodu gorączki 40°C od 4 dni, męczącego szczekającego kaszlu, kataru i silnego zapalenia spojówek ze światłowstrętem. Dziś rano za uszami i na czole pojawiła się zlewająca, żywoczerwona osutka plamisto-grudkowa. W badaniu jamy ustnej na wysokości dolnych zębów trzonowych widoczne białe punkciki na czerwonym tle.',
      rashId: 'odra',
      step1: {
        q: 'Jakie jest najbardziej prawdopodobne rozpoznanie?',
        opts: [
          'Odra (Morbilli)',
          'Płonica (Szkarlatyna)',
          'Rumień nagły (HHV-6)',
          'Choroba Kawasakiego'
        ],
        correct: 0,
        explanation: 'Obraz kliniczny: wysoka gorączka z triadą zwiastunową (kaszel, katar, zapalenie spojówek ze światłowstrętem – "pies szczeka, oczy płaczą"), plamki Koplika na błonie śluzowej policzków oraz zstępująca zlewająca się osutka gruboplamisto-grudkowa za uszami są patognomoniczne dla odry.'
      },
      step2: {
        q: 'Jakie jest właściwe postępowanie kliniczne i sanitarne?',
        opts: [
          'Leczenie objawowe, podanie witaminy A w wysokiej dawce, izolacja do 4 dni po wysypce i natychmiastowe zgłoszenie do Sanepidu',
          'Przepisanie amoksycyliny doustnie na 10 dni',
          'Podanie acyklowiru i kąpiele w nadmanganianie potasu',
          'Zlecenie testów alergicznych i podanie sterydów systemowych'
        ],
        correct: 0,
        explanation: 'W odrze stosuje się leczenie objawowe oraz suplementację witaminy A, która redukuje ryzyko powikłań płucnych i śmiertelności. Odra podlega obowiązkowemu, natychmiastowemu zgłoszeniu do Sanepidu (PSSE), a pacjent wymaga izolacji do 4. doby od wystąpienia osutki.'
      },
      pearl: 'Pamiętaj: Plamki Koplika znikają już w 2. dobie wysypki. W fazie zdrowienia osutka odrowa brunatnieje i łuszczy się otrębiasto!'
    },
    {
      id: 'puz_plonica',
      title: 'Przypadek 2: 6-letnia Zuzia z nagłym bólem gardła i szorstką wysypką',
      vignette: '6-letnia dziewczynka gorączkuje od wczoraj do 39.4°C, skarży się na silny ból gardła przy połykaniu i dwukrotnie zwymiotowała. W badaniu: migdałki powiększone, krwistoczerwone z ropnymi nalotami. Na tułowiu i w pachwinach drobnoplamista osutka szorstka w dotyku jak papier ścierny. Twarz zaczerwieniona z wyraźną bladością wokół ust. W zgięciach łokciowych widoczne ciemnoczerwone pasma.',
      rashId: 'plonica',
      step1: {
        q: 'Jakie rozpoznanie i objawy patognomoniczne opisano w tym przypadku?',
        opts: [
          'Płonica (Szkarlatyna) – trójkąt Fiłatowa i linie Pastii',
          'Odra – plamki Koplika',
          'Różyczka – plamki Forchheimera',
          'Rumień zakaźny – objaw spoliczkowanego dziecka'
        ],
        correct: 0,
        explanation: 'Etiologia paciorkowcowa (PBHA), angina z wymiotami, szorstka drobnoplamista osutka, blady trójkąt wokół ust (trójkąt Fiłatowa) oraz linijne wybroczyny w zgięciach łokciowych (linie Pastii) jednoznacznie definiują płonicę (szkarlatynę).'
      },
      step2: {
        q: 'Jaki antybiotyk i jaki czas leczenia należy bezwzględnie zastosować?',
        opts: [
          'Penicylina V (fenoksymetylopenicylina) doustnie przez pełne 10 dni',
          'Amoksycylina z kwasem klawulanowym przez 5 dni',
          'Azytromycyna przez 3 dni',
          'Cefuroksym aksetyl przez 7 dni'
        ],
        correct: 0,
        explanation: 'Lekiem z wyboru w płonicy jest penicylina V stosowana przez PEŁNE 10 DNI. Skrócenie czasu leczenia grozi nawrotem zakażenia i rozwojem późnych powikłań immunologicznych (gorączki reumatycznej i kłębuszkowego zapalenia nerek).'
      },
      pearl: 'Płatowe łuszczenie naskórka na dłoniach i stopach pojawia się dopiero po 2–3 tygodniach od początku szkarlatyny i potwierdza przebycie zakażenia.'
    },
    {
      id: 'puz_ospa',
      title: 'Przypadek 3: 3-letni Jaś z wielopostaciową swędzącą wysypką',
      vignette: '3-letni Jaś z gorączką 38.5°C od 2 dni. Mama zauważyła na ciele wykwity w różnym stadium: obok czerwonych plamek i grudek występują pęcherzyki z przezroczystym płynem na czerwonym tle oraz przysychające strupki. Wykwity obecne są na tułowiu, twarzy, a pojedyncze pęcherzyki znaleziono we włosach na skórze głowy i na podniebieniu.',
      rashId: 'ospa_wietrzna',
      step1: {
        q: 'Jakie jest rozpoznanie kliniczne?',
        opts: [
          'Ospa wietrzna (Varicella)',
          'Opryszczkowe zapalenie jamy ustnej',
          'Liszajec zakaźny',
          'Choroba bostońska (HFMD)'
        ],
        correct: 0,
        explanation: 'Polimorfizm wykwitów (równoczesna obecność plamek, pęcherzyków "kropli rosy" i strupków – obraz "gwiaździstego nieba") oraz kluczowa lokalizacja na owłosionej skórze głowy i błonach śluzowych to cechy charakterystyczne ospy wietrznej.'
      },
      step2: {
        q: 'Który powszechny lek przeciwgorączkowy jest BEZWZGLĘDNIE PRZECIWWSKAZANY w tym schorzeniu?',
        opts: [
          'Ibuprofen (i inne NLPZ)',
          'Paracetamol',
          'Kwas askorbinowy',
          'Dimebon'
        ],
        correct: 0,
        explanation: 'Ibuprofen i inne NLPZ są bezwzględnie przeciwwskazane w ospie wietrznej, ponieważ wielokrotnie zwiększają ryzyko ciężkich inwazyjnych zakażeń paciorkowcowych tkanek miękkich i martwiczego zapalenia powięzi (Necrotizing Fasciitis). Jedynym bezpiecznym lekiem przeciwgorączkowym jest paracetamol!'
      },
      pearl: 'Zasada izolacji w ospie: Pacjent przestaje zakażać dopiero wtedy, gdy WSZYSTKIE pęcherzyki zaschną w strupki (zwykle po 6–7 dniach od pierwszego wysiewu).'
    },
    {
      id: 'puz_rumien_nagly',
      title: 'Przypadek 4: 9-miesięczna Martynka z osutką po ustąpieniu gorączki',
      vignette: '9-miesięczne niemowlę gorączkowało przez 3 dni do 40.2°C. W badaniu fizykalnym nie stwierdzano żadnych uchwytnych przyczyn gorączki, dziecko piło płyny i było w niezłym stanie ogólnym. Czwartego dnia temperatura spadła gwałtownie do 36.8°C i natychmiast na klatce piersiowej i brzuszku pojawiła się drobna, bladoróżowa osutka plamisto-grudkowa. Twarz i nóżki pozostały zupełnie gładkie.',
      rashId: 'rumien_nagly',
      step1: {
        q: 'Jaki patogen wywołał ten stan chorobowy?',
        opts: [
          'Ludzki herpeswirus typu 6 (HHV-6)',
          'Parwowirus B19',
          'Wirus Coxsackie A16',
          'Streptococcus pyogenes'
        ],
        correct: 0,
        explanation: 'Rumień nagły (gorączka trzydniowa, choroba szósta) wywoływany jest przez ludzkiego wirusa opryszczki typu 6 (HHV-6B). Klasyczna dynamika to gwałtowny spadek wysokiej gorączki z jednoczesnym wysiewem osutki na tułowiu.'
      },
      step2: {
        q: 'Jakie postępowanie należy wdrożyć w tym momencie?',
        opts: [
          'Uspokojenie rodziców, brak wskazań do antybiotykoterapii czy badań, powrót do normalnej aktywności',
          'Wdrożenie amoksycyliny z kwasem klawulanowym',
          'Pobranie płynu mózgowo-rdzeniowego z nakłucia lędźwiowego',
          'Podanie acyklowiru dożylnie'
        ],
        correct: 0,
        explanation: 'Pojawienie się osutki w rumieniu nagłym oznacza koniec choroby! Dziecko jest już zdrowe, nie wymaga żadnych leków ani antybiotyków. Wdrożenie antybiotyku w tym momencie to błąd, który często prowadzi do błędnego rozpoznania "alergii na antybiotyk".'
      },
      pearl: 'Złota zasada: Gdy przychodzi niemowlę po 3 dniach gorączki z wysypką na tułowiu, zbadaj uszy i gardło, uspokój mamę i NIE ZAPISUJ ANTYBIOTYKU.'
    },
    {
      id: 'puz_rumien_zakazny',
      title: 'Przypadek 5: 8-letni Michał z "płonącymi" policzkami i siateczką na rękach',
      vignette: '8-letni chłopiec bez gorączki i bez żadnych dolegliwości przyszedł ze szkoły z intensywnie czerwonymi, zlewającymi się rumieniami na obu policzkach, wyglądającymi jak po wymierzeniu silnego policzka. Następnego dnia na ramionach i udach pojawiła się girlandowata, siateczkowata osutka, która mocno ściemniała i stała się wyraźniejsza po wieczornej ciepłej kąpieli.',
      rashId: 'rumien_zakazny',
      step1: {
        q: 'Jakie jest rozpoznanie kliniczne?',
        opts: [
          'Rumień zakaźny (Piąta choroba / Parwowirus B19)',
          'Toczeń rumieniowaty układowy (SLE)',
          'Płonica (Szkarlatyna)',
          'Reakcja fototoksyczna'
        ],
        correct: 0,
        explanation: 'Klasyczny objaw "spoliczkowanego dziecka" (slapped cheek) oraz girlandowata/koronkowata osutka na kończynach nasilająca się pod wpływem ciepła są patognomoniczne dla rumienia zakaźnego (zakażenie Parwowirusem B19).'
      },
      step2: {
        q: 'Dlaczego zakażenie to stanowi szczególne zagrożenie dla kobiet w ciąży?',
        opts: [
          'Parwowirus niszczy komórki prekursorowe erytrocytów płodu, powodując ciężką niedokrwistość, obrzęk uogólniony płodu (hydrops fetalis) i wewnątrzmaciczne obumarcie',
          'Wywołuje wady cewy nerwowej w I trymestrze',
          'Powoduje wrodzoną zaćmę i głuchotę',
          'Prowadzi do przedwczesnego zarośnięcia przewodu tętniczego'
        ],
        correct: 0,
        explanation: 'Parwowirus B19 wykazuje tropizm do antygenu P na komórkach linii czerwonokrwinkowej w wątrobie i szpiku płodu. Zakażenie ciężarnej może wywołać aplazję erytrocytarną, ciężką niedokrwistość, uogólniony obrzęk płodu (hydrops fetalis) i śmierć wewnątrzmaciczną.'
      },
      pearl: 'Zapamiętaj: Pacjent z rumieniem zakaźnym w chwili pojawienia się osutki na twarzy NIE JEST JUŻ ZAKAŹNY. Może uczęszczać do szkoły, lecz musi unikać kontaktu z ciężarnymi.'
    },
    {
      id: 'puz_hfmd',
      title: 'Przypadek 6: 2-letnia Julka z bolesnymi pęcherzykami na dłoniach i w buzi',
      vignette: '2-letnia dziewczynka od wczoraj nie chce pić ani jeść, obficie się ślini i ma stan podgorączkowy 37.9°C. W badaniu jamy ustnej widoczne bolesne afty i nadżerki na języku i błonie śluzowej policzków. Na powierzchni dłoniowej rączek oraz podeszwach stóp widoczne podłużne, szarawe pęcherzyki o średnicy 3–5 mm otoczone czerwoną obwódką.',
      rashId: 'hfmd',
      step1: {
        q: 'Jakie jest rozpoznanie?',
        opts: [
          'Choroba dłoni, stóp i jamy ustnej (HFMD / Bostonka)',
          'Ospa wietrzna z nietypową lokalizacją',
          'Rumień wielopostaciowy (EM)',
          'Opryszczkowe zapalenie jamy ustnej (HSV)'
        ],
        correct: 0,
        explanation: 'Triada: owrzodzenia w jamie ustnej (herpangina) + podłużne szare pęcherzyki na dłoniach i podeszwach stóp (oraz pośladkach) to klasyczny obraz choroby dłoni, stóp i jamy ustnej wywołanej przez enterowirusy (Coxsackie A16 / EV71).'
      },
      step2: {
        q: 'Jaki późny objaw może wystąpić za 4–8 tygodni, o którym warto uprzedzić zaniepokojonych rodziców?',
        opts: [
          'Onychomadesis – bezbolesne oddzielanie się i schodzenie płytek paznokciowych',
          'Przewlekłe zapalenie stawów',
          'Przebarwienia hemosyderynowe skóry',
          'Łysienie plackowate'
        ],
        correct: 0,
        explanation: 'Onychomadesis (schodzenie paznokci) to łagodne, późne powikłanie HFMD wynikające z przejściowego zahamowania macierzy paznokcia w fazie ostrej infekcji. Paznokcie odrastają samoistnie i nie wymaga to leczenia przeciwgrzybiczego.'
      },
      pearl: 'W HFMD najważniejsze jest nawadnianie: podawaj chłodne, niekwaśne napoje i lody, które łagodzą ból afty w buzi i chronią przed odwodnieniem.'
    },
    {
      id: 'puz_rozyczka',
      title: 'Przypadek 7: 15-letnia Kasia z powiększonymi węzłami za uszami i delikatną wysypką',
      vignette: '15-letnia dziewczyna zgłasza bolesne zgrubienia na karku i za uszami od 2 dni. Dziś na twarzy i szyi pojawiła się jasnoróżowa, drobnoplamista osutka, która nie zlewa się ze sobą i szybko przenosi się na tułów. Temperatura ciała 37.6°C. W badaniu gardła na podniebieniu miękkim obecne drobne czerwone punkciki (plamki Forchheimera).',
      rashId: 'rozyczka',
      step1: {
        q: 'Jakie jest najbardziej prawdopodobne rozpoznanie?',
        opts: [
          'Różyczka (Rubella)',
          'Odra (Morbilli)',
          'Mononukleoza zakaźna (EBV)',
          'Toksoplazmoza węzłowa'
        ],
        correct: 0,
        explanation: 'Bolesna limfadenopatia podpotyliczna i zauszna wyprzedzająca wysypkę, plamki Forchheimera na podniebieniu oraz bladoróżowa, niezlewająca się osutka to podręcznikowy obraz różyczki.'
      },
      step2: {
        q: 'Jakie wady wchodzą w skład klasycznej triady Gregga w zespole różyczki wrodzonej (CRS)?',
        opts: [
          'Wady serca (PDA/zwężenie tętnicy płucnej), wady narządu wzroku (zaćma/mikroftalmia) oraz głuchota odbiorcza',
          'Rozszczep wargi, wodonercze i polidaktylia',
          'Zarośnięcie przełyku, wady kręgów i brak odbytu (VACTERL)',
          'Tętniaki naczyń wieńcowych, zapalenie opon i wodogłowie'
        ],
        correct: 0,
        explanation: 'Klasyczna triada Gregga w zespole różyczki wrodzonej obejmuje: wady serca (przetrwały przewód tętniczy Botalla, zwężenie pnia płucnego), uszkodzenie narządu wzroku (zaćma, retinopatia, jaskra) oraz niedosłuch lub głuchotę odbiorczą.'
      },
      pearl: 'Różyczka u dzieci przebiega łagodnie, ale u nieszczepionej ciężarnej w I trymestrze ryzyko uszkodzenia płodu sięga 85–90%!'
    },
    {
      id: 'puz_kawasaki',
      title: 'Przypadek 8: 2-letni Kubuś z gorączką od 6 dni, czerwonymi oczami i obrzękiem stópek',
      vignette: '2-letni chłopiec gorączkuje od 6 dni do 39.8°C. Pediatra w POZ zapisał amoksycylinę 3 dni temu, bez poprawy. W badaniu: obustronne nastrzyknięcie spojówek bez wydzieliny ropnej, spierzchnięte krwawiące wargi, żywoczerwony język truskawkowy, polimorficzna plamisto-grudkowa osutka na tułowiu, bolesny twardy obrzęk i rumień stóp oraz powiększony pojedynczy węzeł chłonny na szyi o średnicy 2.2 cm.',
      rashId: 'kawasaki',
      step1: {
        q: 'Jakie schorzenie należy natychmiast rozpoznać i jakie badanie pilnie wykonać?',
        opts: [
          'Choroba Kawasakiego – pilne badanie echokardiograficzne (ECHO serca)',
          'Mononukleoza zakaźna – USG jamy brzusznej',
          'Płonica z powikłaniami – wymaz z gardła',
          'Młodzieńcze idiopatyczne zapalenie stawów (MIZS) – przeciwciała ANA'
        ],
        correct: 0,
        explanation: 'Gorączka ≥5 dni + 5 z 5 kryteriów klinicznych (spojówki bez ropy, truskawkowy język i wargi, osutka, obrzęk dłoni/stóp, węzeł szyjny >1.5 cm) spełniają kryteria pełnoobjawowej choroby Kawasakiego. Złotym standardem monitorowania powikłań jest pilne ECHO serca.'
      },
      step2: {
        q: 'Jakie leczenie ratujące naczynia wieńcowe należy wdrożyć bez zbędnej zwłoki?',
        opts: [
          'Wlew immunoglobulin i.v. (IVIG 2 g/kg) + Kwas acetylosalicylowy (ASA)',
          'Wysokie dawki deksametazonu w monoterapii',
          'Ceftriakson i.v. z wankomycyną',
          'Cyklosporyna A z plazmaferezą'
        ],
        correct: 0,
        explanation: 'Leczeniem z wyboru podanym przed 10. dniem gorączki są immunoglobuliny i.v. (IVIG 2 g/kg mc.) w pojedynczym wlewie w skojarzeniu z kwasem acetylosalicylowym (ASA). Zmniejsza to ryzyko tętniaków wieńcowych z 25% do <3–4%.'
      },
      pearl: 'W chorobie Kawasakiego nie czekaj na 10. dzień – im szybciej podasz IVIG, tym mniejsze ryzyko nieodwracalnego tętniaka naczyń wieńcowych!'
    },
    {
      id: 'puz_plamica_iga',
      title: 'Przypadek 9: 7-letni Olek z wyczuwalną fioletową wysypką na nóżkach i bólem brzuszka',
      vignette: '7-letni chłopiec 2 tygodnie po anginie zgłasza się z bólem obu stawów skokowych i kurczowym bólem brzuszka. Na pośladkach i tylnych powierzchniach podudzi widoczne symetryczne, uniesione grudki krwotoczne o barwie purpurowo-czerwonej, które nie bledną pod uciskiem palca ani szkiełka. W morfologii krwi: płytki krwi 280 000/µl (norma), leukocyty 9 800/µl.',
      rashId: 'plamica_iga',
      step1: {
        q: 'Jakie jest rozpoznanie kliniczne i kluczowa cecha różnicowa w badaniach krwi?',
        opts: [
          'Zapalenie naczyń związane z IgA (Plamica Schönleina-Henocha) – prawidłowa liczba płytek krwi',
          'Małopłytkowość immunologiczna (ITP) – trombocytopenia',
          'Meningokokemia – leukopenia i małopłytkowość',
          'Zespół hemolityczno-mocznicowy (HUS) – niedokrwistość hemolityczna mikroangiopatyczna'
        ],
        correct: 0,
        explanation: 'Uniesiona plamica (purpura palpabilis) o rozkładzie grawitacyjnym w połączeniu z bólami stawów i brzucha oraz PRAWIDŁOWĄ liczbą płytek krwi jednoznacznie potwierdza zapalenie naczyń związane z IgA (Schönleina-Henocha). Prawidłowe płytki wykluczają ITP i białaczkę!'
      },
      step2: {
        q: 'Jakie badanie dodatkowe decyduje o odległym rokowaniu i musi być regularnie kontrolowane przez min. 6 miesięcy?',
        opts: [
          'Badanie ogólne moczu (białkomocz, krwinkomocz) i pomiar ciśnienia tętniczego',
          'Gastroskopia',
          'RTG stawów skokowych',
          'Miano przeciwciał ASO'
        ],
        correct: 0,
        explanation: 'O odległym rokowaniu w plamicy IgA decyduje zajęcie nerek (nefropatia IgA). Każdy pacjent wymaga cotygodniowego badania ogólnego moczu i pomiaru ciśnienia tętniczego przez pierwsze tygodnie, a następnie comiesięcznego przez minimum 6 miesięcy od początku choroby.'
      },
      pearl: 'Bądź czujny chirurgicznie: Silny ból brzucha z krwawym stolcem u dziecka z plamicą Schönleina-Henocha to podejrzenie wgłobienia jelitowego (intussusception)!'
    },
    {
      id: 'puz_meningokokemia',
      title: 'Przypadek 10: 18-miesięczny Tymek z plamicą nieblednącą pod szklanką i zimnymi stópkami',
      vignette: '18-miesięczny chłopiec rano był zdrowy. Od południa gorączka 40°C, dreszcze, wymioty i narastające osłabienie. Przy przyjęciu: dziecko podsypiające, jęczące, tętno 175/min, nawrót kapilarny CRT 4 sekundy, dłonie i stopy sine i lodowate. Na udach i brzuszku matka zauważyła 5 minut temu drobne ciemnoczerwone wykwity o nieregularnym kształcie, które NIE BLEDNĄ przy ucisku szklanym naczyniem (test szklankowy ujemny).',
      rashId: 'meningokokemia',
      step1: {
        q: 'Jaki stan bezpośredniego zagrożenia życia należy rozpoznać?',
        opts: [
          'Meningokokemia (posocznica meningokokowa / inwazyjna choroba meningokokowa we wstrząsie septycznym)',
          'Ospa wietrzna o ciężkim przebiegu',
          'Ostry rumień guzowaty',
          'Zespół wstrząsu toksycznego (TSS)'
        ],
        correct: 0,
        explanation: 'Błyskawicznie narastająca osutka wybroczynowa/martwicza nieblednąca w teście szklankowym, skrajna tachykardia, wydłużony nawrót kapilarny CRT >2s i zimne kończyny u gorączkującego malucha to podręcznikowy wczesny wstrząs septyczny w przebiegu meningokokemii.'
      },
      step2: {
        q: 'Jaka jest PIERWSZA i najważniejsza czynność terapeutyczna, którą musisz podjąć natychmiast?',
        opts: [
          'Natychmiastowe podanie Ceftriaksonu (lub penicyliny krystalicznej) i.v./i.m. + bolus płynowy 20 ml/kg i wezwanie ZRM z kodem 1 do OIT',
          'Wykonanie nakłucia lędźwiowego i pobranie PMR przed podaniem antybiotyku',
          'Skierowanie dziecka do szpitala transportem własnym rodziców',
          'Podanie paracetamolu i obserwacja wykwitów przez 2 godziny'
        ],
        correct: 0,
        explanation: 'Złota zasada Złotej Godziny w meningokokemii: podaj antybiotyk bakteriobójczy (Ceftriakson i.v. lub i.m.) NATYCHMIAST, w gabinecie lub karetce! Nie wolno opóźniać antybiotykoterapii dla nakłucia lędźwiowego czy posiewów krwi. Rozpocznij resuscytację płynową (20 ml/kg bolus) i transportuj na OIT.'
      },
      pearl: 'Pamiętaj: Test szklankowy to najprostszy i najważniejszy test ratujący życie w pediatrii. Każda nieblednąca plamka u gorączkującego dziecka to sepsa do czasu wykluczenia!'
    }
  ];

  const modById = Object.fromEntries(MODS.map(m => [m.id, m]));
  const atById = Object.fromEntries(ATLASES.map(a => [a.id, a]));
  return { GROUPS, MODS, ATLASES, TRAPS, CONF, BANKS, WIKILINKS, SEMANTIC_GAPS, OSCE_STATIONS, SYMPTOM_CLUSTERS, IMAGING_TRAINER_CASES, PEDIATRIC_DRUG_DATABASE, PRESCRIPTION_CHALLENGES, PEDIATRIC_RASH_DATABASE, RASH_PUZZLES, modById, atById };
})();
