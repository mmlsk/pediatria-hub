/* Pediatria V – moduł kliniczny: Wirtualny Pacjent (SOR / Izba Przyjęć) */
(function () {
  'use strict';
  window.HUB_CLINICAL = window.HUB_CLINICAL || {};
  window.HUB_CLINICAL.patient = function (ctx) {
    const { OSCE_STATIONS } = window.HUB_META;
    const { $, $$, main, esc, pct, toast, save, getNotes, saveNotes } = ctx;

/* ---------- WIRTUALNY PACJENT (SOR / IZBA PRZYJĘĆ) ---------- */

const EMERGENCY_DRUG_CARDS = {
  krup: {
    weight: 9.5,
    drugs: [
      {
        name: "Deksametazon (Dexaven)",
        dosePerKg: "0.15 – 0.6 mg/kg p.o. / i.m. / i.v.",
        calcDose: "1.4 – 3.8 mg (np. amp. 4 mg/1 ml = 0.95 ml)",
        route: "p.o. lub i.m. (powolne i.v.)",
        indication: "Lek 1. rzutu w każdym stopniu krupu. Działa przeciwobrzękowo po 1–2 h.",
        badge: "Lek 1. rzutu"
      },
      {
        name: "L-Adrenalina 1:1000 (1 mg/ml) – Nebulizacja",
        dosePerKg: "0.5 mg/kg (0.5 ml/kg), max 5 ml (5 mg)",
        calcDose: "4.75 ml roztworu 1:1000 (lub 4.0 ml + 1 ml 0.9% NaCl)",
        route: "Nebulizacja z tlenem (przepływ 6–8 l/min)",
        indication: "Stridor spoczynkowy (krup umiarkowany/ciężki). Efekt w 10–20 min.",
        badge: "Ratunkowy"
      },
      {
        name: "Budezonid (Pulmicort) – alternatywa wziewna",
        dosePerKg: "2 mg jednorazowo w nebulizacji",
        calcDose: "2 ampułki po 1 mg/2 ml = 4 ml",
        route: "Wziewnie (nebulizator)",
        indication: "W razie niemożności podania deksametazonu p.o.",
        badge: "Alternatywa wziewna"
      },
      {
        name: "Tlenoterapia bierna (Blow-by)",
        dosePerKg: "Przepływ do SpO₂ >94%",
        calcDose: "Maseczka lub dren trzymany w odległości 2–3 cm od twarzy",
        route: "Biernie bez uciskania maski",
        indication: "Unikaj ciasnego mocowania maski – stres nasila obturację krtani!",
        badge: "Podstawa PALS"
      }
    ],
    redFlags: [
      "NIGDY nie badaj gardła szpatułką – ryzyko odruchowego zatrzymania oddechu i skurczu głośni!",
      "Po nebulizacji z adrenaliny obowiązkowa obserwacja min. 2–4 h (ryzyko efektu odbicia / rebound)."
    ]
  },
  wglobienie: {
    weight: 8.5,
    drugs: [
      {
        name: "Krystaloidy (0.9% NaCl lub Plazmalyte) – Bolus",
        dosePerKg: "10 – 20 ml/kg i.v. w 20–30 min",
        calcDose: "85 – 170 ml i.v.",
        route: "Dożylnie (wlew kroplowy lub push-pull)",
        indication: "Uzupełnienie łożyska naczyniowego przed sedacją i procedurą odgłobienia.",
        badge: "Wstrząs / Hipowolemia"
      },
      {
        name: "Paracetamol i.v. (Perfalgan 10 mg/ml)",
        dosePerKg: "15 mg/kg i.v. (wlew 15 min)",
        calcDose: "127.5 mg = 12.8 ml roztworu 10 mg/ml",
        route: "Wlew dożylny",
        indication: "Ból o umiarkowanym nasileniu, bezpieczny przed zabiegiem.",
        badge: "Przeciwbólowy"
      },
      {
        name: "Metamizol (Pyralgina) – alternatywa",
        dosePerKg: "10 – 15 mg/kg i.v.",
        calcDose: "85 – 127.5 mg (ok. 0.17 – 0.25 ml amp. 500 mg/ml)",
        route: "Powolne i.v. (min. 5 minut)",
        indication: "Silny ból kolkowy, po wykluczeniu wstrząsu.",
        badge: "Rozkurczowy"
      },
      {
        name: "Amoksycylina z kwasem klawulanowym (Augmentin)",
        dosePerKg: "30 mg/kg i.v.",
        calcDose: "255 mg i.v.",
        route: "Wstrzyknięcie / wlew dożylny",
        indication: "Profilaktyka okołooperacyjna / podejrzenie martwicy lub perforacji pętli jelitowej.",
        badge: "Antybiotyk"
      }
    ],
    redFlags: [
      "Dieta bezwzględnie ścisła (na czczo) do czasu wykonania USG i decyzji chirurga!",
      "Przeciwwskazania do odgłobienia pneumatycznego/hydrostatycznego: zapalenie otrzewnej, perforacja jelita, wstrząs hipowolemiczny."
    ]
  },
  drgawki: {
    weight: 13,
    drugs: [
      {
        name: "Diazepam wlewka doodbytnicza (Rektiole)",
        dosePerKg: "0.5 mg/kg p.r.",
        calcDose: "Wlewka 5 mg p.r. (dla dzieci <15 kg; powtórka po 5 min w razie braku efektu)",
        route: "Doodbytniczo",
        indication: "Lek 1. rzutu przy braku dostępu naczyniowego u małego dziecka.",
        badge: "Lek 1. rzutu (p.r.)"
      },
      {
        name: "Midazolam (Buccolam roztwór 5 mg/ml)",
        dosePerKg: "0.2 – 0.3 mg/kg bukkalnie / i.n.",
        calcDose: "Bukkalnie: 2.6 – 3.9 mg (Midazolam 5 mg/ml = 0.5 – 0.8 ml)",
        route: "Na błonę śluzową policzka lub donosowo",
        indication: "Szybkie i bezpieczne podanie bez szarpania o żyłę u drgającego dziecka.",
        badge: "Lek 1. rzutu (bukk.)"
      },
      {
        name: "Klonazepam i.v.",
        dosePerKg: "0.05 mg/kg powoli i.v.",
        calcDose: "0.65 mg (z amp. 1 mg/1 ml rozcieńczonej do 10 ml: 6.5 ml)",
        route: "Powolne wstrzyknięcie i.v. pod kontrolą oddechu",
        indication: "W stanach drgawkowych z istniejącym wkłuciem żylnym.",
        badge: "Dożylny BZD"
      },
      {
        name: "Lewetiracetam (Keppra) – Lek 2. rzutu",
        dosePerKg: "40 – 60 mg/kg we wlewie i.v. w 10 minut",
        calcDose: "520 – 780 mg (np. 650 mg w 50 ml 0.9% NaCl)",
        route: "Wlew i.v. w 10–15 minut",
        indication: "Stan drgawkowy oporny na 2 dawki benzodiazepin (>10–15 min).",
        badge: "Lek 2. rzutu"
      },
      {
        name: "10% Glukoza (w razie hipoglikemii)",
        dosePerKg: "2 – 5 ml/kg i.v. (bolus)",
        calcDose: "26 – 65 ml 10% Glukozy i.v.",
        route: "Powolny bolus i.v.",
        indication: "Zawsze zbadaj glikemię! Hipoglikemia <60 mg/dl wymaga natychmiastowej korekty.",
        badge: "Glikemia"
      }
    ],
    redFlags: [
      "Pamiętaj o regule ABC: udrożnij drogi oddechowe, podaj 100% tlen z rezerwuarem, ułóż na boku.",
      "Uwaga na depresję oddechową po 2 dawkach benzodiazepin – przygotuj worek samorozprężalny z maską!"
    ]
  },
  dka: {
    weight: 28,
    drugs: [
      {
        name: "0.9% NaCl – Początkowa rehydratacja (1. godzina)",
        dosePerKg: "10 – 20 ml/kg w ciągu pierwszych 60 minut",
        calcDose: "280 – 560 ml 0.9% NaCl w 1 h",
        route: "Wlew dożylny",
        indication: "Wypełnienie łożyska naczyniowego PRZED rozpoczęciem wlewu insuliny!",
        badge: "Krok 1: Płyny"
      },
      {
        name: "Insulina krótzkodziałająca (Actrapid) – ciągły wlew",
        dosePerKg: "0.05 – 0.1 j./kg/h (rozpocząć PO 1 h nawadniania!)",
        calcDose: "1.4 – 2.8 j./h (np. 50 j. w 50 ml 0.9% NaCl = wlew 1.4 – 2.8 ml/h)",
        route: "Ciągły wlew dożylny pompą infuzyjną",
        indication: "NIGDY nie podawaj bolusa insuliny i.v.! Grozi obrzękiem mózgu i hipokaliemią.",
        badge: "Krok 2: Insulina"
      },
      {
        name: "Chlorek potasu (KCl 15%) – suplementacja",
        dosePerKg: "20 – 40 mmol/l płynu infuzyjnego (po uzyskaniu mikcji)",
        calcDose: "Zależnie od kaliemii, po potwierdzeniu diurezy",
        route: "Dodatek do płynów infuzyjnych (max stężenie 40 mmol/l obwodowo)",
        indication: "Wlew insuliny powoduje gwałtowny spadek stężenia K⁺ w surowicy.",
        badge: "Elektrolity"
      },
      {
        name: "20% Mannitol (w razie obrzęku mózgu)",
        dosePerKg: "0.5 – 1.0 g/kg i.v. w 20 minut",
        calcDose: "70 – 140 ml 20% Mannitolu (lub 3% NaCl 5 ml/kg = 140 ml)",
        route: "Szybki wlew i.v.",
        indication: "Wskazania: ból głowy, bradykardia, spadek GCS, nierówne źrenice.",
        badge: "Obrzęk mózgu"
      }
    ],
    redFlags: [
      "BEZWZGLĘDNY ZAKAZ podawania bolusa insuliny i.v. – ryzyko śmiertelnego obrzęku mózgu!",
      "Nie obniżaj glikemii szybciej niż o 70–100 mg/dl/h. Przy glikemii <250–300 mg/dl dołącz 5% glukozę do płynów!"
    ]
  },
  sepsa: {
    weight: 15,
    drugs: [
      {
        name: "Krystaloidy zbilansowane (Plazmalyte / Ringer / 0.9% NaCl)",
        dosePerKg: "10 – 20 ml/kg w szybkim bolusie w 5–10 minut (metoda push-pull)",
        calcDose: "150 – 300 ml w bolusie (do 40–60 ml/kg w pierwszej godzinie)",
        route: "Dożylnie / doszpikowo (i.o.) strzykawką na siłę",
        indication: "Natychmiastowe wypełnienie łożyska naczyniowego we wstrząsie septycznym.",
        badge: "Resuscytacja płynowa"
      },
      {
        name: "Ceftriakson (lub Cefotaksym) i.v. / i.o.",
        dosePerKg: "100 mg/kg i.v. (Ceftriakson jednorazowo lub w 2 dawkach)",
        calcDose: "1500 mg (1.5 g) i.v. w ciągu pierwszych 60 minut („Złota Godzina”)",
        route: "Dożylnie lub doszpikowo (wstrzyknięcie w 3–5 min)",
        indication: "Antybiotyk empiryczny o szerokim spektrum. Nigdy nie opóźniaj dla badań!",
        badge: "Złota Godzina (Abx)"
      },
      {
        name: "Noradrenalina (wlew we wstrząsie ciepłym / naczyniorozszerzonym)",
        dosePerKg: "0.05 – 0.3 µg/kg/min",
        calcDose: "0.75 – 4.5 µg/min w pompie infuzyjnej",
        route: "Ciągły wlew i.v. / i.o.",
        indication: "Wstrząs oporny na płynoterapię (hipotensja, szerokie ciśnienie tętna).",
        badge: "Aminy presyjne"
      },
      {
        name: "Adrenalina (wlew we wstrząsie zimnym / kardiogennym)",
        dosePerKg: "0.05 – 0.3 µg/kg/min",
        calcDose: "0.75 – 4.5 µg/min",
        route: "Ciągły wlew i.v. / i.o.",
        indication: "Zimne kończyny, wydłużony CRT >3s, słabe tętno obwodowe.",
        badge: "Inotropowo"
      },
      {
        name: "Hydrokortyzon i.v. (przy podejrzeniu z. Waterhouse-Friderichsena)",
        dosePerKg: "1 – 2 mg/kg i.v. (lub dawka stresowa 50 mg/m²)",
        calcDose: "25 – 30 mg i.v.",
        route: "Wstrzyknięcie dożylne",
        indication: "Wstrząs oporny na katecholaminy z niewydolnością kory nadnerczy.",
        badge: "GKS ratunkowy"
      }
    ],
    redFlags: [
      "BEZWZGLĘDNY ZAKAZ PUNKCJI LĘDŹWIOWEJ we wstrząsie i przy cechach DIC (ryzyko wklinowania i krwawienia)!",
      "Plamica nieblednąca pod uciskiem + gorączka = sepsa meningokokowa! Czas to życie."
    ]
  }
};
window.EMERGENCY_DRUG_CARDS = EMERGENCY_DRUG_CARDS;

const PATIENT_CASES = [
  {
    id: 'krup',
    title: '10-miesięczny chłopiec z dusznością wdechową i szczekającym kaszlem',
    shortTitle: 'Podgłośniowe zapalenie krtani (Krup)',
    category: 'Drogi oddechowe / Laryngologia',
    difficulty: 'Średni',
    age: '10 miesięcy',
    weight: 9.5,
    gender: 'Chłopiec',
    chiefComplaint: 'Nagła duszność w nocy, chrypka, głośny świst wdechowy, szczekający kaszel.',
    vitalsInitial: { hr: 152, rr: 50, spo2: 91, temp: 38.3, bp: '86/52', crt: 2.0, pgcs: 14, gluc: 98 },
    intro: 'Rodzice przybiegają na SOR o 2:30 w nocy z 10-miesięcznym Jasiem na rękach. Od 2 dni miał katar i stan podgorączkowy, ale około północy obudził się z płaczem, zachrypniętym głosem i głośnym szczekającym kaszlem. Już z progu gabinetu słyszysz wyraźny świst wdechowy (stridor). Dziecko płacze, jest przestraszone, widoczne jest zaciąganie dołka jarzmowego i przestrzeni międzyżebrowych.',
    stages: [
      {
        id: 'pat',
        name: 'Etap 1: Ocena wstępna (PAT / ABCDE)',
        prompt: 'Dziecko jest w ramionach matki, płacze, ma stridor wdechowy i duszność. Jakie są Twoje pierwsze decyzje?',
        options: [
          {
            id: 'krup_calm',
            text: 'Pozostawienie dziecka w ramionach matki, uspokojenie rodziców i podaż tlenu metodą blow-by (z bliska bez uciskania maski)',
            type: 'key',
            points: 10,
            why: 'Płacz i stres drastycznie zwiększają opór w drogach oddechowych i mogą doprowadzić do całkowitej niedrożności krtani. Uspokojenie i tlen bierny to podstawa.'
          },
          {
            id: 'krup_westley',
            text: 'Ocena nasilenia duszności w skali Westleya (stridor w spoczynku + zaciąganie mięśni = krup umiarkowany/ciężki)',
            type: 'key',
            points: 10,
            why: 'Skala Westleya warunkuje natychmiastowe wdrożenie adrenaliny w nebulizacji obok glikokortykosteroidu.'
          },
          {
            id: 'krup_spatula',
            text: 'Natychmiastowe badanie gardła metalową szpatułką w celu wykluczenia ciała obcego lub zapalenia nagłośni',
            type: 'harmful',
            points: -15,
            why: 'KARDYNALNY BŁĄD! Drażnienie gardła szpatułką u dziecka z dusznością krtaniową grozi odruchowym kurczem głośni i natychmiastowym zatrzymaniem krążenia/oddechu.'
          },
          {
            id: 'krup_force_iv',
            text: 'Natychmiastowe unieruchomienie dziecka i próba kaniulacji żyły obwodowej (venflon)',
            type: 'harmful',
            points: -10,
            why: 'Bolesne procedury i krępowanie dziecka w ciężkiej duszności krtaniowej nasilają stridor. Leki (deksametazon, adrenalina) podaje się wziewnie lub doustnie/domięśniowo bez szarpania o żyłę.'
          }
        ],
        vitalsDelta: { hr: -8, rr: -4, spo2: +2 }
      },
      {
        id: 'exam',
        name: 'Etap 2: Badanie fizykalne i celowany wywiad',
        prompt: 'Dziecko jest spokojniejsze w ramionach mamy. Co sprawdzasz w badaniu i wywiadzie?',
        options: [
          {
            id: 'krup_auscult',
            text: 'Osłuchanie klatki piersiowej (symetria szmeru pęcherzykowego, przenoszony świst krtaniowy, wykluczenie świstów wydechowych i rzężeń)',
            type: 'key',
            points: 10,
            why: 'Pozwala odróżnić krup (duszność wdechowa) od obturacji dolnych dróg oddechowych (zapalenie oskrzelików, astma – duszność wydechowa).'
          },
          {
            id: 'krup_vacc',
            text: 'Wywiad w kierunku szczepień (szczepienie przeciwko Haemophilus influenzae typ b – Hib)',
            type: 'key',
            points: 10,
            why: 'Szczepienie przeciw Hib czyni ostre zapalenie nagłośni (epiglottitis) skrajnie mało prawdopodobnym.'
          },
          {
            id: 'krup_lay_down',
            text: 'Położenie dziecka płasko na plecach na kozetce w celu dokładnego zbadania brzucha i gardła',
            type: 'harmful',
            points: -15,
            why: 'Pozycja leżąca u małego dziecka z obrzękiem krtani powoduje zapadanie się języka i nagły wzrost duszności. Dziecko musi samo wybrać pozycję (zwykle siedząca).'
          },
          {
            id: 'krup_temp',
            text: 'Pomiar temperatury ciała (termometr bezdotykowy na czole: 38.3°C)',
            type: 'neutral',
            points: 0,
            why: 'Przydatne w różnicowaniu: podgłośniowe zapalenie krtani to zwykle stan podgorączkowy (<38.5°C), zapalenie nagłośni – wysoka gorączka z septycznym wyglądem.'
          }
        ],
        vitalsDelta: { hr: -6, rr: -2, spo2: +1 }
      },
      {
        id: 'diagnostics',
        name: 'Etap 3: Zlecenia badań laboratoryjnych i obrazowych',
        prompt: 'Czy i jakie badania dodatkowe zlecasz w tym momencie?',
        options: [
          {
            id: 'krup_clinical_dx',
            text: 'Rozpoznanie jest kliniczne – rezygnacja z natychmiastowych inwazyjnych badań krwi i RTG na rzecz wdrożenia leczenia',
            type: 'key',
            points: 15,
            why: 'Podgłośniowe zapalenie krtani rozpoznaje się na podstawie wywiadu i badania fizykalnego. Czas poświęcony na RTG czy gazometrię opóźnia podanie leków i męczy dziecko.'
          },
          {
            id: 'krup_rtg',
            text: 'Zlecenie RTG tkanek miękkich szyi AP (poszukiwanie „objawu wieży / steeple sign”) przed podaniem leków',
            type: 'harmful',
            points: -10,
            why: 'RTG szyi nie jest rutynowo potrzebne i nigdy nie może opóźniać podania leków doraźnych przy duszności spoczynkowej!'
          },
          {
            id: 'krup_blood_gas',
            text: 'Pobranie gazometrii z nakłucia tętnicy promieniowej i wymaz z gardła na posiew',
            type: 'harmful',
            points: -15,
            why: 'Skrajnie bolesne procedury. Wymaz z gardła grozi kurczem krtani, a gazometria w krupie nie wnosi nic do decyzji terapeutycznych na tym etapie.'
          }
        ],
        vitalsDelta: { hr: 0, rr: 0, spo2: 0 }
      },
      {
        id: 'treatment',
        name: 'Etap 4: Leczenie doraźne i dalsze postępowanie',
        prompt: 'Dziecko waży 9.5 kg. Jakie leki i w jakiej formie ordynujesz natychmiast?',
        options: [
          {
            id: 'krup_dex',
            text: 'Deksametazon doustnie (lub domięśniowo) w jednorazowej dawce 0.15–0.6 mg/kg (np. 4 mg)',
            type: 'key',
            points: 15,
            why: 'Glikokortykosteroid to lek z wyboru o udowodnionej skuteczności w każdym stopniu krupu. Działa przeciwobrzękowo po 1-2h i zapobiega nawrotom.'
          },
          {
            id: 'krup_adr',
            text: 'Nebulizacja z L-Adrenaliny 1:1000 (1 mg/ml) – dawka 0.5 ml/kg (max 5 ml, czyli u Jasia 4.5 ml) z tlenem',
            type: 'key',
            points: 15,
            why: 'Adrenalina w nebulizacji obkurcza naczynia podgłośniowe i przynosi spektakularną poprawę w ciągu 10-20 minut w krupie umiarkowanym/ciężkim.'
          },
          {
            id: 'krup_abx',
            text: 'Antybiotyk dożylny (Ceftriakson 100 mg/kg i.v.) z podejrzeniem bakteryjnego zapalenia krtani',
            type: 'harmful',
            points: -15,
            why: 'Błąd sztuki. Podgłośniowe zapalenie krtani to zakażenie wirusowe (głównie wirus paragrypy 1-3). Antybiotykoterapia jest bezskuteczna i szkodliwa.'
          },
          {
            id: 'krup_sedation',
            text: 'Hydroksyzyna lub syrop przeciwkaszlowy z kodeiną na uspokojenie kaszlu',
            type: 'harmful',
            points: -10,
            why: 'Leki uspokajające i hamujące ośrodek oddechowy są bezwzględnie przeciwwskazane u dzieci z niewydolnością oddechową.'
          },
          {
            id: 'krup_obs',
            text: 'Obserwacja na oddziale/SOR przez minimum 2–4 godziny po nebulizacji z adrenaliny',
            type: 'key',
            points: 10,
            why: 'Działanie adrenaliny mija po ok. 2 godzinach i może wystąpić efekt z odbicia (rebound effect). Dziecko może być wypisane dopiero po upewnieniu się, że deksametazon już działa.'
          }
        ],
        vitalsDelta: { hr: -22, rr: -20, spo2: +6, crt: 1.0, pgcs: 15 }
      }
    ],
    debrief: {
      diagnosis: 'Ostre podgłośniowe zapalenie krtani (Krup wirusowy, Laryngotracheitis acuta)',
      code: 'J05.0',
      etiology: 'Wirusy paragrypy (typ 1 i 2), RSV, adenowirusy',
      keyRules: [
        'Duszność wdechowa + szczekający kaszel + stridor = KRUP. Wiek typowy: 6 mies. – 3 lata.',
        'NIGDY nie badaj gardła szpatułką przy duszności krtaniowej (ryzyko odruchowego zatrzymania oddechu).',
        'Deksametazon 0.15–0.6 mg/kg jednorazowo (p.o. lub i.m.) jest lekiem pierwszego rzutu.',
        'W duszności spoczynkowej (krup umiarkowany/ciężki): nebulizacja z L-Adrenaliny 1:1000 (0.5 ml/kg, max 5 ml).',
        'Po inhalacji z adrenaliny obowiązkowa obserwacja min. 2–4 h (ryzyko efektu odbicia po ustąpieniu działania adrenaliny).'
      ],
      pearls: '„Zostaw dziecko w ramionach matki – płacz zwęża głośnię o kolejne 50%!”'
    }
  },
  {
    id: 'wglobienie',
    title: '7-miesięczne niemowlę z napadowym płaczem, wymiotami i krwią w stolcu',
    shortTitle: 'Wgłobienie jelita (Intussusception)',
    category: 'Chirurgia dziecięca / Ostry brzuch',
    difficulty: 'Średni',
    age: '7 miesięcy',
    weight: 8.5,
    gender: 'Chłopiec',
    chiefComplaint: 'Napadowe bóle brzucha co 15 minut, wymioty, stolec o wyglądzie galaretki malinowej.',
    vitalsInitial: { hr: 144, rr: 36, spo2: 98, temp: 37.1, bp: '84/50', crt: 2.5, pgcs: 13, gluc: 92 },
    intro: 'Rodzice przyjeżdżają na izbę przyjęć z 7-miesięcznym Stasiem. Chłopiec wcześniej był okazem zdrowia. Od 6 godzin występują nagłe ataki przeraźliwego krzyku z podkurczaniem nóżek trwające kilka minut, po których dziecko opada z sił, jest blade i podsypia. Dwukrotnie zwymiotował mlekiem i żółcią. W pieluszce pojawił się czerwonawy śluz („galaretka malinowa”).',
    stages: [
      {
        id: 'pat',
        name: 'Etap 1: Ocena wstępna (PAT / ABCDE)',
        prompt: 'Chłopiec leży apatyczny, blady, z podsychającymi wargami. Jakie są Twoje pierwsze decyzje?',
        options: [
          {
            id: 'wgl_iv_fluids',
            text: 'Natychmiastowe założenie kaniuli i.v. i wdrożenie wlewu krystaloidów (0.9% NaCl 10–20 ml/kg) w celu wyrównania hipowolemii',
            type: 'key',
            points: 10,
            why: 'Wgłobienie prowadzi do obrzęku ściany jelita i ucieczki płynów do tzw. trzeciej przestrzeni; wstrząs hipowolemiczny rozwija się podstępnie.'
          },
          {
            id: 'wgl_npo',
            text: 'Ścisły reżim zerowy (NPO – nic doustnie) oraz założenie zgłębnika żołądkowego w celu odbarczenia',
            type: 'key',
            points: 10,
            why: 'Odbarczenie żołądka zapobiega zachłyśnięciu treścią żołądkową i przygotowuje niemowlę do zabiegu w znieczuleniu ogólnym.'
          },
          {
            id: 'wgl_syrup',
            text: 'Podanie doustnego syropu przeciwbólowego (paracetamol z ibuprofenem) lub podanie herbatki z rumianku',
            type: 'harmful',
            points: -15,
            why: 'BŁĄD! Bezwzględny zakaz pojenia i karmienia dziecka w podejrzeniu niedrożności przewodu pokarmowego; grozi aspiracją i wymiotami.'
          }
        ],
        vitalsDelta: { hr: -10, crt: -1.0, bp: '90/55' }
      },
      {
        id: 'exam',
        name: 'Etap 2: Badanie fizykalne i celowany wywiad',
        prompt: 'Dziecko jest nawadniane. Przystępujesz do badania brzucha. Na co zwracasz szczególną uwagę?',
        options: [
          {
            id: 'wgl_palpation',
            text: 'Delikatna palpacja jamy brzusznej w poszukiwaniu walcowatego, kiełbaskowatego oporu w prawym górnym kwadrancie brzucha',
            type: 'key',
            points: 10,
            why: 'Walcowaty guz w rzucie okrężnicy poprzecznej i „pustka” w prawym dole biodrowym (objaw Dance’a) to klasyczna cecha wgłobienia krętniczo-kątniczego.'
          },
          {
            id: 'wgl_peritoneal',
            text: 'Ocena objawów zapalenia otrzewnej (obrona mięśniowa, objaw Blumberga, twardy deskowaty brzuch)',
            type: 'key',
            points: 10,
            why: 'Obecność zapalenia otrzewnej świadczy o martwicy ściany jelita lub perforacji i BEZWZGLĘDNIE wyklucza repozycję pneumatyczną/hydrostatyczną!'
          },
          {
            id: 'wgl_massage',
            text: 'Mocny, głęboki masaż brzucha przez powłoki w celu ręcznego rozmasowania oporu',
            type: 'harmful',
            points: -15,
            why: 'KARDYNALNY BŁĄD! Ręczne ugniatanie niedokrwionego jelita grozi jego natychmiastowym pęknięciem i septycznym zapaleniem otrzewnej.'
          }
        ],
        vitalsDelta: { hr: 0, rr: 0 }
      },
      {
        id: 'diagnostics',
        name: 'Etap 3: Zlecenia badań laboratoryjnych i obrazowych',
        prompt: 'Jakie badanie obrazowe jest złotym standardem w diagnostyce wgłobienia?',
        options: [
          {
            id: 'wgl_usg',
            text: 'Pilne USG jamy brzusznej (poszukiwanie obrazu „tarczy strzelniczej / donuta” w przekroju poprzecznym i „pseudonerki” w podłużnym)',
            type: 'key',
            points: 15,
            why: 'USG ma blisko 100% czułość i swoistość w rękach doświadczonego radiologa. Jest badaniem pierwszego rzutu, bez promieniowania jonizującego.'
          },
          {
            id: 'wgl_labs',
            text: 'Morfologia, elektrolity, mocznik, kreatynina, CRP oraz oznaczenie grupy krwi z próbą krzyżową',
            type: 'key',
            points: 10,
            why: 'Niezbędne do oceny zaburzeń elektrolitowych oraz na wypadek konieczności pilnej operacji chirurgicznej.'
          },
          {
            id: 'wgl_ct',
            text: 'Tomografia komputerowa (TK) jamy brzusznej z kontrastem dożylnym i doustnym',
            type: 'harmful',
            points: -10,
            why: 'Błąd postępowania. TK jest zbędne, opóźnia leczenie i niepotrzebnie naraża niemowlę na dużą dawkę promieniowania.'
          }
        ],
        vitalsDelta: { hr: 0, rr: 0 }
      },
      {
        id: 'treatment',
        name: 'Etap 4: Leczenie doraźne i dalsze postępowanie',
        prompt: 'USG potwierdziło wgłobienie krętniczo-kątnicze bez cech perforacji i bez martwicy. Jakie leczenie wdrażasz?',
        options: [
          {
            id: 'wgl_pneumatic',
            text: 'Pilna nieoperacyjna repozycja doodbytnicza (pneumatyczna powietrzem lub hydrostatyczna solą/kontrastem) pod kontrolą USG/fluoroskopii',
            type: 'key',
            points: 15,
            why: 'Pneumatyczna insuflacja powietrza pod ścisłą kontrolą ciśnienia jest metodą z wyboru o skuteczności >80-90% i mniejszym ryzyku powikłań niż repozycja płynem.'
          },
          {
            id: 'wgl_surg_cons',
            text: 'Powiadomienie dyżurnego chirurga dziecięcego i przygotowanie sali operacyjnej w razie niepowodzenia lub powikłań repozycji',
            type: 'key',
            points: 10,
            why: 'Zabieg repozycji musi odbywać się w ośrodku chirurgicznym, aby w razie perforacji lub niepowodzenia w 3 próbach natychmiast wykonać laparotomię.'
          },
          {
            id: 'wgl_laxatives',
            text: 'Podanie doustnych leków przeczyszczających (laktuloza, parafina) i odesłanie do domu na obserwację stolca',
            type: 'harmful',
            points: -15,
            why: 'ŚMIERTELNY BŁĄD! Leki przeczyszczające w mechanicznej niedrożności jelit nasilają perystaltykę przeciwko przeszkodzie, prowadząc do martwicy i pęknięcia jelita.'
          }
        ],
        vitalsDelta: { hr: -20, rr: -6, pgcs: 15, crt: -0.5 }
      }
    ],
    debrief: {
      diagnosis: 'Wgłobienie jelita (Intussusceptio ileocolica)',
      code: 'K56.1',
      etiology: 'Idiopatyczne (przerost kępek Peyera po infekcji wirusowej), punkt wyjścia: uchyłek Meckela, polip, plamica Henocha-Schönleina (IgAV)',
      keyRules: [
        'Klasyczna triada: 1. Kolkowy napadowy ból brzucha z podkurczaniem nóg, 2. Wymioty, 3. Stolec jak „galaretka malinowa”.',
        'Szczyt zachorowań: 4.–9. miesiąc życia (najczęstsza przyczyna niedrożności u niemowląt).',
        'Złoty standard diagnostyki: USG jamy brzusznej (objaw tarczy strzelniczej / donuta).',
        'Leczenie z wyboru: repozycja doodbytnicza powietrzem (pneumatyczna) pod kontrolą USG/RTG.',
        'Przeciwwskazania do repozycji nieoperacyjnej: zapalenie otrzewnej, perforacja (wolny gaz w jamie brzusznej), przedłużający się wstrząs.'
      ],
      pearls: '„Pomiędzy napadami niemowlę z wgłobieniem bywa uderzająco apatyczne i senne!”'
    }
  },
  {
    id: 'drgawki',
    title: '2.5-letnia dziewczynka w trwającym napadzie drgawek toniczno-klonowych z gorączką',
    shortTitle: 'Przedłużający się stan drgawkowy (PALS)',
    category: 'Neurologia dziecięca / PALS',
    difficulty: 'Wysoki',
    age: '2.5 roku',
    weight: 13.0,
    gender: 'Dziewczynka',
    chiefComplaint: 'Uogólnione drgawki toniczno-klonowe trwające od 15 minut, temperatura 39.6°C, utrata przytomności.',
    vitalsInitial: { hr: 168, rr: 18, spo2: 86, temp: 39.6, bp: '102/68', crt: 3.0, pgcs: 4, gluc: 82 },
    intro: 'Zespół ratownictwa medycznego przywozi na sygnale 2.5-letnią Zosię. Dziewczynka od 15 minut ma nieprzerwane uogólnione drgawki toniczno-klonowe całego ciała, sinicę wokół ust i ślinotok. Matka podaje, że dziecko od rana gorączkowało do 39.6°C. W domu nie podano żadnych leków przeciwdrgawkowych. Dziewczynka jest nieprzytomna, oczy zwrócone ku górze.',
    stages: [
      {
        id: 'pat',
        name: 'Etap 1: Ocena wstępna (PAT / ABCDE)',
        prompt: 'Dziecko ma sinicę, płytki nieregularny oddech i uogólnione drgawki. Jak zabezpieczasz ABC?',
        options: [
          {
            id: 'drg_abc',
            text: 'A & B: Ułożenie na boku (pozycja bezpieczna), delikatne odessanie śliny z jamy ustnej i podaż 100% tlenu przez maskę z rezerwuarem',
            type: 'key',
            points: 10,
            why: 'Niedotlenienie w trakcie napadu drgawkowego potęguje uszkodzenie neuronów. Ochrona dróg oddechowych i natychmiastowa tlenoterapia to absolutny priorytet.'
          },
          {
            id: 'drg_spatula_teeth',
            text: 'Włożenie drewnianej szpatułki lub palców między zęby dziecka, aby zapobiec przygryzieniu języka',
            type: 'harmful',
            points: -15,
            why: 'KARDYNALNY BŁĄD! Wkładanie czegokolwiek do ust w trakcie drgawek grozi wyłamaniem zębów, aspiracją do dróg oddechowych i odruchowym skurczem krtani.'
          },
          {
            id: 'drg_gluc',
            text: 'D: Natychmiastowe oznaczenie glikemii z krwi włośniczkowej glukometrem',
            type: 'key',
            points: 10,
            why: 'Hipoglikemia jest częstą, odwracalną przyczyną stanu drgawkowego u małych dzieci (glukoza u Zosi wynosi 82 mg/dl – norma).'
          },
          {
            id: 'drg_restrain',
            text: 'Siłowe przytrzymywanie rąk i nóg dziecka przez personel, aby zatrzymać drgawki mechanicznie',
            type: 'harmful',
            points: -10,
            why: 'Siłowe unieruchamianie drgających kończyn może doprowadzić do zwichnięć stawów i złamań kości u dziecka.'
          }
        ],
        vitalsDelta: { spo2: +7, hr: -8 }
      },
      {
        id: 'exam',
        name: 'Etap 2: Badanie fizykalne i wywiad',
        prompt: 'Tlen podany (saturacja wzrosła do 93%), ale drgawki nadal trwają (17. minuta). Co sprawdzasz w trakcie?',
        options: [
          {
            id: 'drg_skin_rash',
            text: 'Obejrzenie całej powierzchni skóry (poszukiwanie wybroczyn i plamicy krwotocznej – podejrzenie neuroinfekcji meningokokowej)',
            type: 'key',
            points: 10,
            why: 'Gorączka z drgawkami i wybroczynami to podejrzenie piorunującej sepsy z ZOMR, wymagające natychmiastowego ceftriaksonu obok leków przeciwdrgawkowych.'
          },
          {
            id: 'drg_oral_antipyretic',
            text: 'Podanie doustnego syropu przeciwgorączkowego łyżeczką w przerwie między drgawkami',
            type: 'harmful',
            points: -15,
            why: 'Podanie płynu lub leku doustnie dziecku nieprzytomnemu grozi natychmiastowym zachłyśnięciem i zgonem!'
          },
          {
            id: 'drg_pupils',
            text: 'Ocena źrenic (szerokość, symetria, reakcja na światło) w celu wykluczenia wklinowania mózgu',
            type: 'key',
            points: 10,
            why: 'Asymetria źrenic (anizokoria) lub sztywna szeroka źrenica wskazuje na ciasnotę wewnątrzczaszkową / obrzęk mózgu.'
          }
        ],
        vitalsDelta: { hr: 0, rr: 0 }
      },
      {
        id: 'diagnostics',
        name: 'Etap 3: Zlecenia badań laboratoryjnych i obrazowych',
        prompt: 'Jakie badania diagnostyczne są uzasadnione na tym etapie?',
        options: [
          {
            id: 'drg_labs_stat',
            text: 'Pobranie krwi na gazometrię, jonogram (sód – wykluczenie hiponatremii!), CRP, prokalcytoninę i morfologię',
            type: 'key',
            points: 10,
            why: 'Zaburzenia elektrolitowe (zwłaszcza hiponatremia w przebiegu infekcji lub nadmiernego pojenia wodą) są częstą przyczyną drgawek.'
          },
          {
            id: 'drg_lumbar_now',
            text: 'Natychmiastowe wykonanie punkcji lędźwiowej podczas trwającego napadu drgawkowego',
            type: 'harmful',
            points: -15,
            why: 'BEZWZGLĘDNIE PRZECIWWSKAZANE! Trwający napad drgawkowy, zaburzenia oddychania i niestabilność hemodynamiczna wykluczają nakłucie lędźwiowe.'
          }
        ],
        vitalsDelta: { hr: 0, rr: 0 }
      },
      {
        id: 'treatment',
        name: 'Etap 4: Leczenie doraźne i dalsze postępowanie (Algorytm PALS)',
        prompt: 'Zosia waży 13 kg. Napad trwa już >15 minut. Jakie leczenie farmakologiczne wdrażasz NATYCHMIAST?',
        options: [
          {
            id: 'drg_benzo_1',
            text: 'I rzut: Midazolam na błonę śluzową policzka (buccal) 0.5 mg/kg (u Zosi 6.5 mg) lub Diazepam doodbytniczo (p.r.) 0.5 mg/kg (6.5 mg) lub i.v. jeśli jest wkłucie',
            type: 'key',
            points: 15,
            why: 'Benzodiazepiny to leki I rzutu w stanie drgawkowym. Midazolam dopoliczkowy lub diazepam doodbytniczy działają błyskawicznie i nie wymagają opóźniania na wkłucie żylne.'
          },
          {
            id: 'drg_levetiracetam',
            text: 'II rzut (w razie braku ustąpienia po 5-10 min od benzo): Lewetyracetam i.v. 40–60 mg/kg (lub Fosfenytoina / Walproinian i.v.)',
            type: 'key',
            points: 15,
            why: 'Standard PALS/ERC: jeśli napad nie ustąpi po pierwszej dawce benzodiazepiny (lub po powtórzeniu po 5 min), natychmiast wdraża się lek przeciwdrgawkowy II rzutu we wlewie.'
          },
          {
            id: 'drg_antipyretic_iv',
            text: 'Obniżenie temperatury: Paracetamol i.v. 15 mg/kg (~200 mg) lub w czopku p.r. oraz fizyczne chłodzenie',
            type: 'key',
            points: 10,
            why: 'Paracetamol obniża temperaturę i przerywa komponent gorączkowy pobudzający drgawki.'
          },
          {
            id: 'drg_wait_30m',
            text: 'Wstrzymanie się z lekami przeciwdrgawkowymi i czekanie aż napad sam ustąpi, aby nie maskować obrazu EEG',
            type: 'harmful',
            points: -15,
            why: 'ŚMIERTELNY BŁĄD! Napad trwający > 5 minut jest stanem zagrożenia życia, a po 30 minutach dochodzi do nieodwracalnej apoptozy neuronów i obrzęku mózgu.'
          }
        ],
        vitalsDelta: { hr: -35, rr: +6, spo2: +5, temp: -1.6, pgcs: 8, crt: -1.0 }
      }
    ],
    debrief: {
      diagnosis: 'Przedłużający się stan drgawkowy w przebiegu drgawek gorączkowych złożonych (Status epilepticus febrilis)',
      code: 'G41.9',
      etiology: 'Wysoka gorączka w infekcji wirusowej u predysponowanego małego dziecka; napad złożony (>15 minut)',
      keyRules: [
        'Definicja stanu drgawkowego: napad trwający > 5 minut (operacyjna) lub seria napadów bez odzyskania przytomności.',
        'I rzut: Midazolam dopoliczkowo 0.5 mg/kg LUB Diazepam p.r. 0.5 mg/kg LUB Diazepam/Midazolam i.v. 0.2 mg/kg.',
        'II rzut (po 10–15 min): Lewetyracetam i.v. (40–60 mg/kg) lub Fosfenytoina i.v. (20 mg/kg PE) lub Walproinian i.v. (40 mg/kg).',
        'Zawsze sprawdź glikemię! Hipoglikemia to natychmiast odwracalna przyczyna drgawek (wtedy 10% glukoza 2–5 ml/kg i.v.).',
        'NIGDY nie wkładaj niczego między zęby drgającego dziecka!'
      ],
      pearls: '„Midazolam dopoliczkowy działa tak samo szybko jak dożylny, a nie tracisz 10 minut na szukanie żyły!”'
    }
  },
  {
    id: 'dka',
    title: '9-letni chłopiec z oddechem Kussmaula, odwodnieniem i zaburzeniami świadomości',
    shortTitle: 'Cukrzycowa kwasica ketonowa (DKA)',
    category: 'Endokrynologia dziecięca / Zaburzenia metaboliczne',
    difficulty: 'Wysoki',
    age: '9 lat',
    weight: 28.0,
    gender: 'Chłopiec',
    chiefComplaint: 'Głęboki, przyspieszony oddech, zapach acetonu, silne bóle brzucha, wymioty, senność.',
    vitalsInitial: { hr: 136, rr: 38, spo2: 97, temp: 36.6, bp: '90/56', crt: 3.5, pgcs: 12, gluc: 512 },
    intro: 'Na SOR trafia 9-letni Filip. Rodzice zgłaszają, że od 2–3 tygodni chłopiec pił ogromne ilości płynów (nawet 4–5 litrów na dobę) i ciągle biegał do łazienki, a w nocy zaczął moczyć się do łóżka. W tym czasie schudł ok. 3 kg. Od wczoraj skarży się na silne bóle brzucha i wymiotuje. Dziś rano stał się splątany, śpiący, a jego oddech jest uderzająco głęboki i głośny. Z ust wyczuwalny jest słodkawy zapach pieczonych jabłek / acetonu.',
    stages: [
      {
        id: 'pat',
        name: 'Etap 1: Ocena wstępna (PAT / ABCDE)',
        prompt: 'Filip ma suchy, obłożony język, zapadnięte gałki oczne i oddech Kussmaula. Jakie są Twoje pierwsze kroki?',
        options: [
          {
            id: 'dka_glucose_iv',
            text: 'Natychmiastowe oznaczenie glikemii z palca (wynik: 512 mg/dl) oraz założenie 2 dostępów naczyniowych i.v.',
            type: 'key',
            points: 10,
            why: 'Glikemia > 200 mg/dl z objawami kwasicy i odwodnienia to kliniczne rozpoznanie DKA. Dostęp żylny jest konieczny do natychmiastowej płynoterapii.'
          },
          {
            id: 'dka_insulin_bolus',
            text: 'Natychmiastowe podanie bolusa insuliny krótko działającej i.v. (np. 0.15 j./kg dożylnie w strzykawce)',
            type: 'harmful',
            points: -20,
            why: 'KARDYNALNY, ŚMIERTELNY BŁĄD W PEDIATRII! W pediatrycznym DKA NIGDY NIE PODAJE SIĘ BOLUSA INSULINY! Gwałtowny spadek glikemii i osmolalności prowadzi do obrzęku mózgu i zgonu!'
          },
          {
            id: 'dka_neuro_check',
            text: 'Wyjściowa ocena neurologiczna w skali Glasgow (pGCS) i regularny monitoring pod kątem objawów obrzęku mózgu',
            type: 'key',
            points: 10,
            why: 'Obrzęk mózgu jest główną przyczyną zgonów w dziecięcym DKA (0.5–1% przypadków). Każdy ból głowy, spadek pGCS czy bradykardia to sygnał alarmowy.'
          }
        ],
        vitalsDelta: { hr: 0, bp: '90/56' }
      },
      {
        id: 'exam',
        name: 'Etap 2: Badanie fizykalne i celowany wywiad',
        prompt: 'Badanie przedmiotowe wykazuje bolesność palpacyjną brzucha z obroną mięśniową. Jak to interpretujesz?',
        options: [
          {
            id: 'dka_pseudoperitonitis',
            text: 'Rozpoznanie rzekomego zapalenia otrzewnej (pseudoperitonitis diabetica) – ból brzucha wynika z kwasicy, odwodnienia krezki i ketonemii; ustąpi po nawodnieniu',
            type: 'key',
            points: 10,
            why: 'Bóle brzucha w DKA są bardzo częste. Unikaj niepotrzebnej laparotomii u dziecka z ciężką kwasicą metaboliczną!'
          },
          {
            id: 'dka_dehydration_calc',
            text: 'Oszacowanie stopnia odwodnienia (suche śluzówki, zapadnięte oczy, CRT 3.5s, podsypianie = ok. 8–10% ubytku masy ciała)',
            type: 'key',
            points: 10,
            why: 'W DKA deficyt płynowy wynosi zazwyczaj 7–10%. Wyrównuje się go równomiernie przez 48 godzin, aby zapobiec nagłym zmianom osmolalności.'
          },
          {
            id: 'dka_surg_op',
            text: 'Pilne wezwanie chirurga i natychmiastowe skierowanie na blok operacyjny z podejrzeniem ostrego zapalenia wyrostka',
            type: 'harmful',
            points: -15,
            why: 'Znieczulenie ogólne i operacja u niewyrównanego metabolicznie pacjenta z DKA wiążą się z ogromnym ryzykiem zapaści krążeniowej i zgonu.'
          }
        ],
        vitalsDelta: { hr: 0, rr: 0 }
      },
      {
        id: 'diagnostics',
        name: 'Etap 3: Zlecenia badań laboratoryjnych i obrazowych',
        prompt: 'Jakie badania laboratoryjne są niezbędne do prowadzenia leczenia DKA?',
        options: [
          {
            id: 'dka_gas_lytes',
            text: 'Gazometria (ocena pH i HCO3-), jonogram (sód, potas!) z wyliczeniem sodu skorygowanego i luki anionowej, ketonemia/ketonuria',
            type: 'key',
            points: 15,
            why: 'Gazometria definiuje ciężkość DKA (pH < 7.10 = postać ciężka). Monitorowanie stężenia potasu jest kluczowe przed podaniem insuliny!'
          },
          {
            id: 'dka_bicarb_iv',
            text: 'Zlecenie szybkiego wlewu wodorowęglanu sodu (NaHCO3 8.4%) w celu natychmiastowej korekcji pH',
            type: 'harmful',
            points: -15,
            why: 'BŁĄD SZTUKI! Rutynowe podanie wodorowęglanów w DKA zwiększa ryzyko obrzęku mózgu, paradoksalnej kwasicy OUN i hipokaliemii. Podaje się je wyłącznie przy pH < 6.9 z wstrząsem.'
          }
        ],
        vitalsDelta: { hr: 0, rr: 0 }
      },
      {
        id: 'treatment',
        name: 'Etap 4: Leczenie doraźne i dalsze postępowanie (Złoty Standard ISPAD)',
        prompt: 'Filip waży 28 kg. pH wynosi 7.12, potas 4.2 mmol/l. Jaki jest prawidłowy protokół postępowania?',
        options: [
          {
            id: 'dka_phase1_fluids',
            text: 'Faza I: Wstępna resuscytacja płynowa – 0.9% NaCl w dawce 10–20 ml/kg (u Filipa ~300–500 ml) w ciągu 1 godziny. NAJPIERW płyny przed jakąkolwiek insuliną!',
            type: 'key',
            points: 15,
            why: 'Zasada kardynalna ISPAD: przez pierwszą godzinę podaje się wyłącznie krystaloidy w celu przywrócenia perfuzji nerek i tkanek.'
          },
          {
            id: 'dka_insulin_infusion',
            text: 'Faza II: Wlew ciągły insuliny krótko działającej (0.05–0.1 j./kg/h = ~1.4–2.8 j./h) rozpoczęty DOPIERO po 1–2 h nawadniania płynowego',
            type: 'key',
            points: 15,
            why: 'Insulina w małym wlewie ciągłym hamuje lipolizę i ketogenezę. Spadek glikemii nie powinien przekraczać 90 mg/dl na godzinę.'
          },
          {
            id: 'dka_potassium_add',
            text: 'Dodanie chlorku potasu (KCl) do płynów infuzyjnych zaraz po upewnieniu się, że pacjent oddaje mocz i potas < 5.5 mmol/l',
            type: 'key',
            points: 10,
            why: 'Insulina przemieszcza potas do komórek; brak suplementacji potasu prowadzi do groźnej dla życia hipokaliemii i zaburzeń rytmu serca.'
          },
          {
            id: 'dka_glucose_add',
            text: 'Dołączenie 5% glukozy do płynów, gdy glikemia spadnie do 250–300 mg/dl, utrzymując wlew insuliny',
            type: 'key',
            points: 10,
            why: 'Zapobiega hipoglikemii i zbyt szybkiemu spadkowi osmolalności, pozwalając na kontynuację wlewu insuliny aż do ustąpienia kwasicy (pH > 7.30).'
          }
        ],
        vitalsDelta: { hr: -26, rr: -14, crt: -2.0, pgcs: 3, gluc: -260, bp: '102/64' }
      }
    ],
    debrief: {
      diagnosis: 'Cukrzycowa kwasica ketonowa (DKA) w przebiegu nowo rozpoznanej cukrzycy typu 1',
      code: 'E10.1',
      etiology: 'Bezwzględny niedobór insuliny u dziecka z niszczeniem komórek beta trzustki (proces autoimmunologiczny)',
      keyRules: [
        'Kryteria rozpoznania DKA: Glikemia > 200 mg/dl (11 mmol/l) + pH < 7.30 lub HCO3- < 18 mmol/l + ketonemia / ketonuria.',
        'W pediatrycznym DKA NIGDY NIE DAJE SIĘ BOLUSA INSULINY (ryzyko zgonu z powodu obrzęku mózgu!).',
        'Złota reguła ISPAD: NAJPIERW płyny (0.9% NaCl 10–20 ml/kg w 1. godzinie), a wlew ciągły insuliny (0.05–0.1 j./kg/h) dopiero po 1–2 godzinach.',
        'Gdy glikemia spadnie do 250–300 mg/dl, dodaj 5% glukozę do płynów (NIE wyłączaj insuliny, dopóki kwasica nie ustąpi!).',
        'Zawsze suplementuj potas po wznowieniu diurezy (insulina wpycha potas do wnętrza komórek).'
      ],
      pearls: '„Ból brzucha i głęboki oddech u dziecka, które schudło i dużo pije = najpierw zbadaj cukier!”'
    }
  },
  {
    id: 'sepsa',
    title: '3-letni chłopiec z plamicą piorunującą, wysoką gorączką i wstrząsem',
    shortTitle: 'Wstrząs septyczny (Sepsa meningokokowa)',
    category: 'Choroby zakaźne / Intensywna terapia (OITD)',
    difficulty: 'Wysoki',
    age: '3 lata',
    weight: 15.0,
    gender: 'Chłopiec',
    chiefComplaint: 'Szybko szerząca się wysypka wybroczynowa (plamica), hipotensja, zimne kończyny, obniżony kontakt.',
    vitalsInitial: { hr: 178, rr: 46, spo2: 92, temp: 39.8, bp: '70/40', crt: 4.5, pgcs: 10, gluc: 68 },
    intro: 'Rodzice przywożą na SOR 3-letniego Bartka. Rano chłopiec był w przedszkolu, bawił się normalnie. Około godziny 14:00 dostał dreszczy i gorączki 39.8°C. Po 3 godzinach na pośladkach i udach pojawiły się drobne, czerwono-fioletowe plamki, które w ciągu kilkudziesięciu minut zlewają się w ciemne wybroczyny i nie znikają pod uciskiem. Dziecko jest „przelewające się”, ma chłodne marmurkowate ręce i stopy pomimo gorączki tułowia.',
    stages: [
      {
        id: 'pat',
        name: 'Etap 1: Ocena wstępna (PAT / ABCDE)',
        prompt: 'Bartek ma ciśnienie 70/40 mmHg (ciężka hipotensja), tętno 178/min i szybko narastającą plamicę. Jakie są natychmiastowe działania ratunkowe?',
        options: [
          {
            id: 'sep_access_io',
            text: 'Natychmiastowe założenie 2 wkłuć dożylnych o dużym świetle, a w razie niepowodzenia w ciągu 60–90 sekund – natychmiastowe wkłucie doszpikowe (i.o.) w guzowatość piszczeli',
            type: 'key',
            points: 15,
            why: 'We wstrząsie septycznym z obkurczeniem naczyń obwodowych nie wolno marnować czasu na przedłużające się próby kłucia żył. Dostęp doszpikowy ratuje życie!'
          },
          {
            id: 'sep_oxygen_high',
            text: 'Wdrożenie tlenoterapii biernej 100% z rezerwuarem bezzwłocznie',
            type: 'key',
            points: 10,
            why: 'We wstrząsie zaopatrzenie tkanek w tlen jest drastycznie obniżone; maksymalizacja utlenowania krwi zmniejsza kwasicę mleczanową.'
          },
          {
            id: 'sep_wait_peripheral',
            text: 'Wielokrotne próby kłucia żył obwodowych przez 20 minut z unikaniem wkłucia doszpikowego z obawy przed inwazyjnością',
            type: 'harmful',
            points: -20,
            why: 'ŚMIERTELNY BŁĄD! Czas ma znaczenie krytyczne (Złota Godzina sepsy). Każda minuta bez płynów i antybiotyku dramatycznie zwiększa śmiertelność.'
          }
        ],
        vitalsDelta: { spo2: +5 }
      },
      {
        id: 'exam',
        name: 'Etap 2: Badanie fizykalne i wywiad',
        prompt: 'Dostęp naczyniowy jest gotowy. Co sprawdzasz w badaniu pod kątem sepsy meningokokowej i powikłań?',
        options: [
          {
            id: 'sep_glass_test',
            text: 'Test szklankowy wykwitów skórnych (brak blednięcia pod uciskiem = wybroczyny/martwica naczyniowa w zespole Waterhouse’a-Friderichsena)',
            type: 'key',
            points: 10,
            why: 'Plamica nieblednąca pod uciskiem u gorączkującego dziecka to objaw patognomoniczny dla uogólnionego wykrzepiania wewnątrznaczyniowego (DIC) i posocznicy meningokokowej.'
          },
          {
            id: 'sep_contra_lp',
            text: 'Kategoryczne odstąpienie od wykonywania punkcji lędźwiowej (LP) na tym etapie',
            type: 'key',
            points: 10,
            why: 'Wstrząs septyczny, niestabilność hemodynamiczna oraz cechy skazy krwotocznej (DIC) są BEZWZGLĘDNYMI przeciwwskazaniami do punkcji lędźwiowej!'
          },
          {
            id: 'sep_do_lp',
            text: 'Natychmiastowe ułożenie dziecka na boku z przygiętymi kolanami i wykonanie punkcji lędźwiowej przed podaniem antybiotyku',
            type: 'harmful',
            points: -20,
            why: 'KARDYNALNY BŁĄD! Wykonanie nakłucia lędźwiowego u dziecka we wstrząsie lub z DIC grozi krwiakiem kanału kręgowego, wgłobieniem migdałków móżdżku i natychmiastowym zatrzymaniem krążenia!'
          }
        ],
        vitalsDelta: { hr: 0, bp: '70/40' }
      },
      {
        id: 'diagnostics',
        name: 'Etap 3: Zlecenia badań laboratoryjnych i obrazowych',
        prompt: 'Pobierasz krew z igły doszpikowej/wenflonu. Jakie badania zlecasz w trybie pilnym?',
        options: [
          {
            id: 'sep_labs_stat',
            text: 'Posiew krwi (jeśli nie opóźnia leczenia), gazometria z kwasem mlekowym (lactate > 4 mmol/l), morfologia, krzepnięcie (PT/INR, APTT, fibrynogen, D-dimery – ocena DIC)',
            type: 'key',
            points: 15,
            why: 'Poziom mleczanów odzwierciedla hipoperfuzję tkankową, a koagulogram pozwala wcześnie rozpoznać zespół DIC i przygotować preparaty krwiopochodne (FFP, płytki).'
          },
          {
            id: 'sep_delay_abx_for_blood',
            text: 'Wstrzymanie podania antybiotyku do czasu udanego pobrania krwi na posiew i moczu na posiew',
            type: 'harmful',
            points: -20,
            why: 'ŚMIERTELNY BŁĄD! W sepsie meningokokowej antybiotyk podaje się natychmiast. Jeśli pobranie krwi opóźniałoby lek o więcej niż 5 minut – podaje się antybiotyk bez wahania!'
          }
        ],
        vitalsDelta: { hr: 0, bp: '70/40' }
      },
      {
        id: 'treatment',
        name: 'Etap 4: Leczenie doraźne i dalsze postępowanie (Złota Godzina)',
        prompt: 'Bartek waży 15 kg. Jakie leczenie płynowe i przeciwbakteryjne wdrażasz w pierwszych minutach?',
        options: [
          {
            id: 'sep_fluid_bolus',
            text: 'Natychmiastowy bolus krystaloidów (0.9% NaCl lub Plasmalyte) w dawce 20 ml/kg (u Bartka 300 ml) podany pod ciśnieniem (strzykawką push-pull) w ciągu 10 minut',
            type: 'key',
            points: 15,
            why: 'Płynoterapia ratunkowa w bolusie 20 ml/kg jest podstawą leczenia wstrząsu septycznego. Płyn należy podać jak najszybciej pod ciśnieniem, oceniając wątrobę i płuca pod kątem przewodnienia.'
          },
          {
            id: 'sep_ceftriaxone',
            text: 'Natychmiastowa podaż Ceftriaksonu i.v./i.o. w dawce 100 mg/kg (u Bartka 1.5 g i.v./i.o.)',
            type: 'key',
            points: 15,
            why: 'Ceftriakson lub Cefotaksym to leki I rzutu w inwazyjnej chorobie meningokokowej. Podany w pierwszej godzinie ratuje życie.'
          },
          {
            id: 'sep_vasoactive',
            text: 'W razie braku poprawy ciśnienia po 40–60 ml/kg płynów – wczesne włączenie wlewu ciągłego amin katecholowych (Adrenalina / Noradrenalina)',
            type: 'key',
            points: 10,
            why: 'Wstrząs oporny na płynoterapię wymaga natychmiastowego wsparcia wazopresyjnego i inotropowego.'
          },
          {
            id: 'sep_slow_drip_only',
            text: 'Podanie wyłącznie powolnego wlewu kroplowego płynu podtrzymującego (np. 50 ml/h) z obawy przed obrzękiem płuc',
            type: 'harmful',
            points: -20,
            why: 'ŚMIERTELNY BŁĄD! U dziecka we wstrząsie septycznym powolny wlew kroplowy prowadzi do asystolii lub PEA z powodu głębokiej hipowolemii.'
          },
          {
            id: 'sep_picu_transfer',
            text: 'Pilne wezwanie zespołu OITD (Intensywnej Terapii Dziecięcej) oraz zgłoszenie do Sanepidu w celu profilaktyki osób z kontaktu',
            type: 'key',
            points: 10,
            why: 'Dziecko w sepsie meningokokowej wymaga leczenia na OIT. Osoby z bliskiego kontaktu (domownicy, dzieci z przedszkola) wymagają natychmiastowej chemioprofilaktyki (Ciprofloksacyna / Ryfampicyna).'
          }
        ],
        vitalsDelta: { hr: -28, rr: -16, bp: '92/58', crt: -2.5, pgcs: 4 }
      }
    ],
    debrief: {
      diagnosis: 'Piorunujący wstrząs septyczny w przebiegu inwazyjnej choroby meningokokowej (Zesp. Waterhouse’a-Friderichsena)',
      code: 'A39.2',
      etiology: 'Neisseria meningitidis (dwoinka zapalenia opon mózgowo-rdzeniowych), najczęściej serogrupa B lub C',
      keyRules: [
        'Złota Godzina sepsy: dostęp naczyniowy/doszpikowy + tlen + bolus płynowy 20 ml/kg w <10 min + antybiotyk (Ceftriakson) w <60 min.',
        'Wkłucie doszpikowe (i.o.) w piszczel należy założyć po 2 nieudanych próbach kłucia żył lub po 90 sekundach.',
        'BEZWZGLĘDNY ZAKAZ PUNKCJI LĘDŹWIOWEJ we wstrząsie i przy objawach DIC!',
        'Nigdy nie opóźniaj podania antybiotyku w oczekiwaniu na posiew krwi.',
        'Plamica nieblednąca pod uciskiem (ujemny test szklankowy) + gorączka = sepsa meningokokowa aż do udowodnienia przeciwnego.'
      ],
      pearls: '„Płyny podawaj strzykawką na siłę (push-pull) – grawitacyjna kroplówka we wstrząsie kapie za wolno!”'
    }
  }
];

let SIM_ACTIVE = null;

function viewPatient(parts, params) {
  // 1. Sprawdź czy to stacja OSCE: '#/pacjent/osce/stacja-...'
  if (parts[1] === 'osce' && parts[2]) {
    const station = (OSCE_STATIONS || []).find(s => s.id === parts[2]);
    if (!station) {
      toast('Nie znaleziono stacji OSCE');
      location.hash = '#/pacjent?tab=osce';
      return;
    }
    ctx.osce.openStation(station);
    return;
  }

  // 2. Bezpośrednie wejście '#/pacjent/stacja-...'
  const directOsce = (OSCE_STATIONS || []).find(s => s.id === parts[1]);
  if (directOsce) {
    ctx.osce.openStation(directOsce);
    return;
  }

  // 3. Sprawdź czy to przypadek SOR: '#/pacjent/krup'
  const caseId = parts[1];
  if (caseId && caseId !== 'osce') {
    const caseItem = PATIENT_CASES.find(c => c.id === caseId);
    if (!caseItem) {
      toast('Nie znaleziono scenariusza klinicznego');
      location.hash = '#/pacjent';
      return;
    }
    if (!SIM_ACTIVE || SIM_ACTIVE.caseId !== caseId) {
      startPatientSim(caseItem);
    }
    renderActivePatientSim(caseItem);
    return;
  }

  // 4. Lista: zakładka SOR vs OSCE
  const tab = (parts[1] === 'osce' || (params && params.tab === 'osce')) ? 'osce' : 'sor';
  if (tab === 'osce') {
    ctx.osce.renderOsceStationList();
  } else {
    renderPatientCaseList();
  }
}

function startPatientSim(caseItem) {
  SIM_ACTIVE = {
    caseId: caseItem.id,
    stageIdx: 0,
    state: 'deciding', // 'deciding' | 'reviewed' | 'finished'
    selectedOptionIds: new Set(),
    score: 0,
    maxScore: 0,
    history: [],
    currentVitals: { ...caseItem.vitalsInitial },
    showEmergencyTray: false
  };
}

function renderEmergencyDrugTray(caseItem) {
  const cardData = EMERGENCY_DRUG_CARDS[caseItem.id];
  if (!cardData) return '';

  return `
  <div class="card emergency-doses-tray" style="margin:1rem 0;background:var(--surface);border:2px solid var(--red);box-shadow:var(--shadow-md)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem;flex-wrap:wrap;gap:.5rem">
      <div style="display:flex;align-items:center;gap:.5rem">
        <span style="font-size:1.3rem">🚨</span>
        <div>
          <h3 style="margin:0;font-size:1.1rem;color:var(--red)">Panel Dawek Ratunkowych (PALS / SOR)</h3>
          <div style="font-size:.8rem;color:var(--ink-muted)">
            Wyliczone dawki doraźne dla wagi pacjenta: <b>${caseItem.weight} kg</b> (${caseItem.age})
          </div>
        </div>
      </div>
      <button class="btn btn-sm btn-subtle" id="btnCloseEmergencyTray" style="font-size:.78rem">✕ Zamknij panel</button>
    </div>

    <!-- Siatka leków -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:.7rem;margin-bottom:.8rem">
      ${cardData.drugs.map(drug => `
        <div style="background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:.75rem .9rem;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;gap:.4rem">
              <b style="font-size:.92rem;color:var(--ink)">${drug.name}</b>
              <span class="chip" style="background:var(--red-l);color:var(--red);font-weight:700;font-size:.68rem;padding:.15rem .4rem;border:0">${drug.badge}</span>
            </div>
            <div style="font-size:.8rem;color:var(--ink-muted);margin-bottom:.3rem">
              Dawka/kg: <b>${drug.dosePerKg}</b>
            </div>
            <div style="padding:.45rem .6rem;background:var(--surface);border:1.5px solid var(--teal);border-radius:6px;margin-bottom:.4rem">
              <span style="font-size:.74rem;color:var(--teal-d);display:block;font-weight:700">WYKORZYSTAJ:</span>
              <b style="font-size:.96rem;color:var(--teal);display:block">${drug.calcDose}</b>
            </div>
            <div style="font-size:.78rem;color:var(--ink-muted);margin-bottom:.2rem">
              <b>Droga:</b> ${drug.route}
            </div>
          </div>
          <div style="font-size:.76rem;color:var(--ink);background:rgba(12,122,133,0.06);padding:.35rem .5rem;border-radius:4px;margin-top:.4rem;line-height:1.35">
            ${drug.indication}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Czerwone flagi / ostrzeżenia -->
    <div style="background:rgba(194,59,42,0.08);border:1px solid rgba(194,59,42,0.28);padding:.7rem .9rem;border-radius:8px;font-size:.82rem;line-height:1.45;color:var(--ink)">
      <b style="color:var(--red)">⚠️ CZERWONE FLAGI I PRZECIWWSKAZANIA:</b>
      <ul style="margin:.3rem 0 0 1.1rem;padding:0">
        ${cardData.redFlags.map(rf => `<li>${rf}</li>`).join('')}
      </ul>
    </div>
  </div>`;
}

window.getClinicalRank = getClinicalRank;
function getClinicalRank(completedCount) {
  if (completedCount >= 9) return { title: "Lekarz Dyżurny SOR Dziecięcego 🏆", color: "var(--teal)" };
  if (completedCount >= 6) return { title: "Młodszy Rezydent Pediatrii 🌟", color: "var(--green)" };
  if (completedCount >= 3) return { title: "Stażysta Izby Przyjęć 🏥", color: "var(--amber)" };
  return { title: "Praktykant Pediatryczny 🩺", color: "var(--ink-muted)" };
}

function renderPatientCaseList() {
  window.scrollTo(0, 0);
  window.PATIENT_HUB_FILTER = window.PATIENT_HUB_FILTER || "all";

  const completedSor = Object.keys(ctx.S.patientCases || {}).length;
  const completedOsce = Object.keys(ctx.S.osceCases || {}).length;
  const totalCompleted = completedSor + completedOsce;
  const totalCases = PATIENT_CASES.length + (OSCE_STATIONS || []).length;

  let totalScoreSum = 0;
  let scoredCount = 0;
  Object.values(ctx.S.patientCases || {}).forEach(c => {
    if (c.bestScore !== undefined) {
      totalScoreSum += c.bestScore;
      scoredCount++;
    }
  });
  Object.values(ctx.S.osceCases || {}).forEach(c => {
    if (c.score !== undefined) {
      totalScoreSum += c.score;
      scoredCount++;
    }
  });
  const avgScore = scoredCount ? Math.round(totalScoreSum / scoredCount) : 0;
  const rank = getClinicalRank(totalCompleted);

  const currentFilter = window.PATIENT_HUB_FILTER;

  const sorFiltered = PATIENT_CASES.filter(c => {
    if (currentFilter === "osce") return false;
    if (currentFilter === "infant") return c.weight < 10 || c.age.includes("miesięc");
    if (currentFilter === "older") return c.weight >= 10 && !c.age.includes("miesięc");
    return true;
  });

  const osceFiltered = (OSCE_STATIONS || []).filter(s => {
    if (currentFilter === "sor") return false;
    if (currentFilter === "infant") return s.patient.avatarType === "infant" || s.patient.age.includes("miesięc");
    if (currentFilter === "older") return s.patient.avatarType === "child" && !s.patient.age.includes("miesięc");
    return true;
  });

  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:1040px">
    <div class="eyebrow">Symulator kliniczny · Ostry dyżur SOR & Egzamin OSCE</div>
    <h2>Wirtualny Pacjent – stany nagłe i badanie fizykalne</h2>

    <!-- Główne zakładki nawigacyjne -->
    <div class="conn-tabs" role="tablist" style="margin-bottom:1.2rem">
      <button class="conn-tab-btn ${currentFilter !== "osce" ? "active" : ""}" data-ptab="sor" role="tab" aria-selected="${currentFilter !== "osce"}">
        🚨 SOR / Ostry Dyżur (${PATIENT_CASES.length})
      </button>
      <button class="conn-tab-btn ${currentFilter === "osce" ? "active" : ""}" data-ptab="osce" role="tab" aria-selected="${currentFilter === "osce"}">
        📋 Stacje OSCE / Badanie fizykalne (${(OSCE_STATIONS || []).length})
      </button>
    </div>

    <!-- Pasek statystyk i Rangi klinicznej -->
    <div class="card" style="margin-bottom:1.5rem;background:var(--surface);border-left:4px solid var(--teal);padding:1rem 1.3rem">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem">
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-muted);text-transform:uppercase;letter-spacing:.04em">Status postępów klinicznych:</div>
          <div style="display:flex;align-items:center;gap:.6rem;margin-top:.2rem;flex-wrap:wrap">
            <span class="sim-rank-chip" style="border-color:${rank.color};color:${rank.color}">
              ${rank.title}
            </span>
            <span style="font-size:.9rem;color:var(--ink-muted)">
              Ukończono <b>${totalCompleted} z ${totalCases}</b> scenariuszy (${Math.round((totalCompleted/totalCases)*100)}%)
            </span>
          </div>
        </div>
        <div style="display:flex;gap:1.5rem;align-items:center">
          <div style="text-align:right">
            <span class="srcline" style="display:block;font-size:.78rem">Średnia skuteczność</span>
            <b style="font-size:1.35rem;color:${avgScore >= 75 ? "var(--green)" : (avgScore >= 60 ? "var(--amber)" : "var(--ink)")}">
              ${avgScore > 0 ? avgScore + "%" : "–"}
            </b>
          </div>
          <div style="text-align:right">
            <span class="srcline" style="display:block;font-size:.78rem">Zaliczone stacje</span>
            <b style="font-size:1.35rem;color:var(--teal)">${totalCompleted} / ${totalCases}</b>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtry kategorialne (chips) -->
    <div class="sim-filter-bar" role="toolbar" aria-label="Filtry przypadków klinicznych">
      <button class="sim-filter-chip ${currentFilter === "all" ? "active" : ""}" data-filter="all">
        Wszystkie (${totalCases})
      </button>
      <button class="sim-filter-chip ${currentFilter === "sor" ? "active" : ""}" data-filter="sor">
        🚨 Tylko SOR (${PATIENT_CASES.length})
      </button>
      <button class="sim-filter-chip ${currentFilter === "osce" ? "active" : ""}" data-filter="osce">
        📋 Tylko OSCE (${(OSCE_STATIONS || []).length})
      </button>
      <button class="sim-filter-chip ${currentFilter === "infant" ? "active" : ""}" data-filter="infant">
        👶 Niemowlęta (<1 r.ż.)
      </button>
      <button class="sim-filter-chip ${currentFilter === "older" ? "active" : ""}" data-filter="older">
        👦 Dzieci starsze
      </button>
    </div>

    <!-- SEKCJA: PRZYPADKI SOR -->
    ${sorFiltered.length > 0 ? `
      <div style="margin-bottom:2rem">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.8rem">
          <span style="font-size:1.3rem">🚨</span>
          <h3 style="margin:0;font-size:1.2rem">Stany Nagłe i Resuscytacja (SOR)</h3>
          <span class="chip" style="background:rgba(194,59,42,0.1);color:var(--red);font-weight:700;border:0">${sorFiltered.length}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:1.1rem">
          ${sorFiltered.map(c => {
            const saved = (ctx.S.patientCases || {})[c.id];
            const hasScore = saved && saved.bestScore !== undefined;
            return `<div class="card" style="display:flex;flex-direction:column;justify-content:space-between;border-top:3.5px solid var(--red)">
              <div>
                <div style="display:flex;gap:.4rem;align-items:center;margin-bottom:.5rem;flex-wrap:wrap">
                  <span class="chip" style="background:var(--red-l);color:var(--red);font-weight:700;border:0">${esc(c.category.split("/")[0].trim())}</span>
                  <span class="chip">${c.age} · ${c.weight} kg</span>
                  ${hasScore ? `<span class="chip" style="background:${saved.bestScore >= 80 ? "var(--green-l)" : (saved.bestScore >= 60 ? "var(--amber-l)" : "var(--red-l)")};color:${saved.bestScore >= 80 ? "var(--green)" : (saved.bestScore >= 60 ? "var(--amber)" : "var(--red)")};font-weight:700;border:0">Wynik: ${saved.bestScore}%</span>` : '<span class="chip" style="background:var(--surface);color:var(--muted)">Nowy</span>'}
                </div>
                <h4 style="font-size:1.1rem;margin-bottom:.4rem;font-family:var(--font-display)">${esc(c.title)}</h4>
                <p class="srcline" style="margin-bottom:.8rem;font-size:.86rem;line-height:1.45">${esc(c.chiefComplaint)}</p>
              </div>
              <div style="display:flex;gap:.5rem;align-items:center;border-top:1px solid var(--line-2);padding-top:.8rem;margin-top:.6rem;flex-wrap:wrap">
                <a class="btn pri sm" href="#/pacjent/${c.id}">${hasScore ? "Zagraj ponownie →" : "Rozpocznij symulację →"}</a>
                <a class="btn sec sm" href="#/kalkulator?w=${c.weight}" title="Otwórz kalkulator dla tego pacjenta">🧮 Dawki</a>
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>
    ` : ""}

    <!-- SEKCJA: STACJE OSCE -->
    ${osceFiltered.length > 0 ? `
      <div style="margin-bottom:2rem">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.8rem">
          <span style="font-size:1.3rem">📋</span>
          <h3 style="margin:0;font-size:1.2rem">Stacje Egzaminacyjne OSCE i Status Praesens</h3>
          <span class="chip" style="background:var(--teal-l);color:var(--teal-d);font-weight:700;border:0">${osceFiltered.length}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:1.1rem">
          ${osceFiltered.map(station => {
            const saved = (ctx.S.osceCases || {})[station.id];
            const isPassed = saved && saved.score >= 60;
            const totalKey = station.zones.flatMap(z => z.maneuvers).filter(m => m.isKey).length;
            return `<div class="card" style="display:flex;flex-direction:column;justify-content:space-between;border-top:3.5px solid var(--teal)">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem;flex-wrap:wrap;gap:.4rem">
                  <span class="badge" style="background:var(--teal);color:var(--on-accent);font-weight:800;font-size:.72rem">STACJA ${station.number}</span>
                  <span style="font-size:.78rem;color:var(--ink-muted);font-weight:700">${station.patient.age} · ${station.patient.weight}</span>
                </div>
                <h4 style="font-size:1.08rem;margin-bottom:.35rem;font-family:var(--font-display)">
                  <a href="#/pacjent/osce/${station.id}">${esc(station.title)}</a>
                </h4>
                <div style="font-size:.82rem;color:var(--teal);font-weight:700;margin-bottom:.5rem">
                  🩺 ${station.scale ? station.scale.name.split("/")[0].trim() : station.topic}
                </div>
                <p class="srcline" style="margin-bottom:.8rem;font-size:.86rem;line-height:1.4">${esc(station.briefing.scenario)}</p>
                <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.6rem">
                  <span class="badge" style="background:rgba(12,122,133,0.1);color:var(--teal);font-size:.72rem">📍 ${station.zones.length} stref</span>
                  <span class="badge" style="background:rgba(12,122,133,0.1);color:var(--teal);font-size:.72rem">🔑 ${totalKey} manewrów</span>
                  <span class="badge" style="background:rgba(194,59,42,0.1);color:var(--red);font-size:.72rem">⚠️ Błędy krytyczne</span>
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--line-2);padding-top:.8rem;margin-top:.6rem">
                <div>
                  ${saved ? `
                    <span class="chip" style="background:${isPassed ? "var(--green-l)" : "var(--red-l)"};color:${isPassed ? "var(--green)" : "var(--red)"};font-weight:700;border:0;font-size:.74rem">
                      ${isPassed ? "✓ Zdane" : "✗ Do poprawy"}: ${saved.score}%
                    </span>
                  ` : '<span class="chip" style="background:var(--surface);color:var(--muted);font-size:.74rem">Nowa stacja</span>'}
                </div>
                <a class="btn pri sm" href="#/pacjent/osce/${station.id}">${saved ? "Powtórz badanie →" : "Rozpocznij stację →"}</a>
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>
    ` : ""}

  </div></section>`;

  $$('.conn-tab-btn[data-ptab]').forEach(b => {
    b.onclick = () => {
      if (b.dataset.ptab === 'osce') {
        window.PATIENT_HUB_FILTER = 'osce';
      } else {
        window.PATIENT_HUB_FILTER = 'sor';
      }
      renderPatientCaseList();
    };
  });

  $$('.sim-filter-chip[data-filter]').forEach(b => {
    b.onclick = () => {
      window.PATIENT_HUB_FILTER = b.dataset.filter;
      renderPatientCaseList();
    };
  });
}

function getVitalStatus(key, val) {
  if (key === 'spo2') return val >= 95 ? 'ok' : (val >= 90 ? 'warn' : 'danger');
  if (key === 'crt') return val <= 2 ? 'ok' : (val <= 3 ? 'warn' : 'danger');
  if (key === 'pgcs') return val >= 14 ? 'ok' : (val >= 11 ? 'warn' : 'danger');
  if (key === 'gluc') return (val >= 70 && val <= 140) ? 'ok' : ((val > 140 && val <= 250) || (val >= 55 && val < 70) ? 'warn' : 'danger');
  if (key === 'temp') return (val >= 36.4 && val <= 37.5) ? 'ok' : (val <= 38.5 ? 'warn' : 'danger');
  if (key === 'hr') return (val >= 80 && val <= 140) ? 'ok' : (val <= 165 ? 'warn' : 'danger');
  if (key === 'rr') return (val >= 20 && val <= 35) ? 'ok' : (val <= 45 ? 'warn' : 'danger');
  return 'ok';
}

function renderVitalsMonitor(v) {
  return `<div class="vitals-monitor">
    <div class="vital-chip ${getVitalStatus('hr', v.hr)}"><span class="v-lab">❤️ Tętno</span><span class="v-val">${v.hr}</span><span class="v-unit">/min</span></div>
    <div class="vital-chip ${getVitalStatus('spo2', v.spo2)}"><span class="v-lab">🫁 Saturacja</span><span class="v-val">${v.spo2}%</span><span class="v-unit">SpO2</span></div>
    <div class="vital-chip ${getVitalStatus('rr', v.rr)}"><span class="v-lab">💨 Oddech</span><span class="v-val">${v.rr}</span><span class="v-unit">/min</span></div>
    <div class="vital-chip"><span class="v-lab">🩸 Ciśnienie</span><span class="v-val" style="font-size:1.05rem">${v.bp}</span><span class="v-unit">mmHg</span></div>
    <div class="vital-chip ${getVitalStatus('temp', v.temp)}"><span class="v-lab">🌡️ Temp</span><span class="v-val">${Number(v.temp || 0).toFixed(1)}</span><span class="v-unit">°C</span></div>
    <div class="vital-chip ${getVitalStatus('crt', v.crt)}"><span class="v-lab">⏱️ CRT</span><span class="v-val">${Number(v.crt || 0).toFixed(1)}s</span><span class="v-unit">nawrót</span></div>
    <div class="vital-chip ${getVitalStatus('pgcs', v.pgcs)}"><span class="v-lab">🧠 pGCS</span><span class="v-val">${v.pgcs}</span><span class="v-unit">/15</span></div>
    <div class="vital-chip ${getVitalStatus('gluc', v.gluc)}"><span class="v-lab">🍬 Cukier</span><span class="v-val">${v.gluc}</span><span class="v-unit">mg/dl</span></div>
  </div>`;
}

function renderPatientImagingBadge(patientId) {
  const map = {
    krup: { link: '#/badania?tab=imaging&case=rtg-croup', text: '🔬 Przećwicz RTG krtani (Objaw wieży kościoła) w Trenażerze Badań →', col: 'var(--blue)', bg: 'var(--blue-l)' },
    wglobienie: { link: '#/badania?tab=imaging&case=usg-intussusception', text: '🔬 Przećwicz USG brzucha (Objaw tarczy) w Trenażerze Badań →', col: 'var(--teal-d)', bg: 'var(--teal-l)' },
    drgawki: { link: '#/badania?tab=imaging&case=ekg-svt', text: '🔬 Przećwicz EKG (SVT / LQTS) w Trenażerze Badań →', col: 'var(--red)', bg: 'var(--red-l)' },
    dka: { link: '#/badania?tab=gas', text: '🔬 Przećwicz Gazometrię i Lukę Anionową w Trenażerze Badań →', col: 'var(--amber)', bg: 'var(--amber-l)' },
    sepsa: { link: '#/badania?tab=cbc', text: '🔬 Przećwicz Morfologię krwi i PMR w Trenażerze Badań →', col: 'var(--violet)', bg: 'var(--violet-l)' }
  };
  const item = map[patientId];
  if (!item) return '';
  return `<div style="margin-top:.6rem"><a class="chip" href="${item.link}" style="background:${item.bg};color:${item.col};font-weight:700;text-decoration:none">${item.text}</a></div>`;
}


function renderActivePatientSim(caseItem) {
  if (SIM_ACTIVE.state === 'finished') {
    return renderPatientReport(caseItem);
  }

  const s = caseItem.stages[SIM_ACTIVE.stageIdx];
  const isReviewed = SIM_ACTIVE.state === 'reviewed';

  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:920px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem">
      <a class="btn sec sm" href="#/pacjent">← Wróć do listy pacjentów</a>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <button class="btn sec sm" id="btnToggleEmergencyTray" style="font-weight:700;color:var(--red);border-color:rgba(194,59,42,0.3)">
          🚨 Dawki ratunkowe (${caseItem.weight} kg) ${SIM_ACTIVE.showEmergencyTray ? "▲" : "▼"}
        </button>
        <a class="btn sec sm" href="#/kalkulator?w=${caseItem.weight}" target="_blank" title="Otwórz kalkulator dawek w nowym oknie">🧮 Pełny kalkulator</a>
      </div>
    </div>

    <!-- Nagłówek pacjenta -->
    <div class="card" style="background:var(--surface);border-left:4px solid var(--teal);padding:1.1rem 1.4rem">
      <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.3rem">
        <span class="chip" style="background:var(--teal-l);color:var(--teal-d);font-weight:700;border:0">${esc(caseItem.shortTitle)}</span>
        <span class="chip">${caseItem.age} · ${caseItem.weight} kg · ${caseItem.gender}</span>
      </div>
      <h2 style="font-size:1.35rem;margin:.3rem 0">${esc(caseItem.title)}</h2>
      <p class="srcline" style="margin-top:.4rem;font-size:.9rem">${esc(caseItem.intro)}</p>
      ${renderPatientImagingBadge(caseItem.id)}
    </div>

    <!-- Monitor parametrów życiowych -->
    ${renderVitalsMonitor(SIM_ACTIVE.currentVitals)}

    <!-- Panel Dawek Ratunkowych (SOR / PALS) -->
    ${SIM_ACTIVE.showEmergencyTray ? renderEmergencyDrugTray(caseItem) : ''}

    <!-- Pasek postępu etapów -->
    <div class="sim-steps">
      ${caseItem.stages.map((st, i) => {
        let cls = '';
        if (i < SIM_ACTIVE.stageIdx) cls = 'done';
        else if (i === SIM_ACTIVE.stageIdx) cls = 'active';
        return `<div class="sim-step-item ${cls}">
          <span>${i < SIM_ACTIVE.stageIdx ? '✓' : (i + 1) + '.'}</span>
          <span>${esc(st.name.replace(/Etap \d+:\s*/, ''))}</span>
        </div>`;
      }).join('')}
      <div class="sim-step-item ${SIM_ACTIVE.stageIdx >= caseItem.stages.length ? 'active' : ''}">
        <span>5.</span>
        <span>Raport</span>
      </div>
    </div>

    <!-- Karta aktualnego etapu -->
    <div class="card" style="padding:1.4rem">
      <div class="eyebrow">${esc(s.name)}</div>
      <h3 style="font-size:1.25rem;margin:.3rem 0 .7rem 0">${esc(s.prompt)}</h3>

      ${!isReviewed ? `
        <p class="srcline" style="margin-bottom:1rem">Zaznacz wszystkie działania, które uważasz za wskazane w tym momencie:</p>
        <div class="action-grid" id="actionGrid">
          ${s.options.map(opt => {
            const isSel = SIM_ACTIVE.selectedOptionIds.has(opt.id);
            return `<label class="sim-action-card ${isSel ? 'selected' : ''}" data-opt="${opt.id}">
              <input type="checkbox" ${isSel ? 'checked' : ''}>
              <div style="flex:1">
                <span style="font-weight:600;font-size:.96rem">${esc(opt.text)}</span>
              </div>
            </label>`;
          }).join('')}
        </div>
        <div style="margin-top:1.4rem;display:flex;justify-content:flex-end">
          <button class="btn pri" id="btnSubmitStage" style="font-size:1.02rem;padding:.75rem 1.6rem">Zatwierdź działania i sprawdź reakcję pacjenta →</button>
        </div>
      ` : `
        <div style="background:var(--bg);border-radius:10px;padding:1rem;margin-bottom:1.2rem;border:1px solid var(--line-2)">
          <b style="font-size:1.05rem;display:block;margin-bottom:.4rem">Podsumowanie Twoich decyzji w tym etapie:</b>
          <p class="srcline">Poniżej sprawdzisz merytoryczną ocenę każdego działania oraz zmianę parametrów życiowych pacjenta.</p>
        </div>

        <div class="action-grid">
          ${s.options.map(opt => {
            const wasSelected = SIM_ACTIVE.selectedOptionIds.has(opt.id);
            let cls = '';
            let badge = '';
            if (opt.type === 'key') {
              cls = 'rev-key';
              badge = wasSelected
                ? `<span class="chip" style="background:var(--green-l);color:var(--green);font-weight:700;border:0">✓ Trafne działanie kluczowe (+${opt.points} pkt)</span>`
                : `<span class="chip" style="background:var(--amber-l);color:var(--amber);font-weight:700;border:0">⚠ Przeoczone działanie kluczowe (0 pkt)</span>`;
            } else if (opt.type === 'harmful') {
              cls = 'rev-harmful';
              badge = wasSelected
                ? `<span class="chip" style="background:var(--red-l);color:var(--red);font-weight:700;border:0">✗ Błąd sztuki / działanie szkodliwe (${opt.points} pkt)</span>`
                : `<span class="chip" style="background:var(--green-l);color:var(--green);font-weight:700;border:0">✓ Prawidłowo uniknięto błędu</span>`;
            } else {
              cls = 'rev-neutral';
              badge = `<span class="chip" style="background:var(--surface);color:var(--muted)">○ Działanie neutralne (0 pkt)</span>`;
            }

            return `<div class="sim-action-card ${cls}" style="cursor:default">
              <div style="flex:1">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;flex-wrap:wrap;gap:.4rem">
                  ${badge}
                  ${wasSelected ? '<span class="chip" style="border-color:transparent;background:var(--surface);font-weight:700">Twoja decyzja: Wybrano</span>' : ''}
                </div>
                <div style="font-weight:700;font-size:.96rem;margin-bottom:.3rem">${esc(opt.text)}</div>
                <div class="srcline" style="font-size:.86rem;line-height:1.4">${esc(opt.why)}</div>
              </div>
            </div>`;
          }).join('')}
        </div>

        <div style="margin-top:1.4rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;border-top:1px solid var(--line-2);padding-top:1rem">
          <span style="font-weight:700;color:var(--teal)">Parametry pacjenta zostały zaktualizowane powyżej.</span>
          <button class="btn pri" id="btnNextStage" style="font-size:1.02rem;padding:.75rem 1.6rem">
            ${SIM_ACTIVE.stageIdx + 1 < caseItem.stages.length ? 'Przejdź do kolejnego etapu →' : 'Zobacz końcowy raport i podsumowanie →'}
          </button>
        </div>
      `}
    </div>
  </div></section>`;

  // Obsługa Panelu Dawek Ratunkowych
  const btnToggleEmerg = $("#btnToggleEmergencyTray");
  if (btnToggleEmerg) {
    btnToggleEmerg.onclick = () => {
      SIM_ACTIVE.showEmergencyTray = !SIM_ACTIVE.showEmergencyTray;
      renderActivePatientSim(caseItem);
    };
  }
  const btnCloseEmerg = $("#btnCloseEmergencyTray");
  if (btnCloseEmerg) {
    btnCloseEmerg.onclick = () => {
      SIM_ACTIVE.showEmergencyTray = false;
      renderActivePatientSim(caseItem);
    };
  }

  // Obsługa wyboru opcji
  if (!isReviewed) {
    const grid = $('#actionGrid');
    if (grid) {
      grid.addEventListener('click', e => {
        const card = e.target.closest('[data-opt]');
        if (!card) return;
        const optId = card.dataset.opt;
        const cb = card.querySelector('input[type="checkbox"]');
        if (e.target !== cb) {
          cb.checked = !cb.checked;
        }
        if (cb.checked) {
          SIM_ACTIVE.selectedOptionIds.add(optId);
          card.classList.add('selected');
        } else {
          SIM_ACTIVE.selectedOptionIds.delete(optId);
          card.classList.remove('selected');
        }
      });
    }

    const submitBtn = $('#btnSubmitStage');
    if (submitBtn) {
      submitBtn.onclick = () => submitPatientStage(caseItem);
    }
  } else {
    const nextBtn = $('#btnNextStage');
    if (nextBtn) {
      nextBtn.onclick = () => nextPatientStage(caseItem);
    }
  }
}

function submitPatientStage(caseItem) {
  const s = caseItem.stages[SIM_ACTIVE.stageIdx];
  let stageScore = 0;
  let stageMax = 0;

  s.options.forEach(opt => {
    if (opt.type === 'key') {
      stageMax += opt.points;
      if (SIM_ACTIVE.selectedOptionIds.has(opt.id)) {
        stageScore += opt.points;
      }
    } else if (opt.type === 'harmful') {
      if (SIM_ACTIVE.selectedOptionIds.has(opt.id)) {
        stageScore += opt.points; // ujemne punkty
      }
    }
  });

  SIM_ACTIVE.score += stageScore;
  SIM_ACTIVE.maxScore += stageMax;

  // Aktualizacja parametrów życiowych
  if (s.vitalsDelta) {
    const v = SIM_ACTIVE.currentVitals;
    const d = s.vitalsDelta;
    if (d.hr) v.hr = Math.max(50, Math.min(220, v.hr + d.hr));
    if (d.rr) v.rr = Math.max(10, Math.min(80, v.rr + d.rr));
    if (d.spo2) v.spo2 = Math.max(60, Math.min(100, v.spo2 + d.spo2));
    if (d.crt) v.crt = Math.max(1.0, Math.min(6.0, Math.round((v.crt + d.crt) * 10) / 10));
    if (d.pgcs) v.pgcs = Math.max(3, Math.min(15, v.pgcs + d.pgcs));
    if (d.temp) v.temp = Math.max(35.0, Math.min(41.5, Math.round((v.temp + d.temp) * 10) / 10));
    if (d.gluc) v.gluc = Math.max(30, Math.min(600, v.gluc + d.gluc));
    if (d.bp) v.bp = d.bp;
  }

  SIM_ACTIVE.history.push({
    stageIdx: SIM_ACTIVE.stageIdx,
    selectedOptionIds: new Set(SIM_ACTIVE.selectedOptionIds),
    stageScore,
    stageMax
  });

  SIM_ACTIVE.state = 'reviewed';
  renderActivePatientSim(caseItem);
  const target = document.querySelector('.vitals-monitor') || document.querySelector('.sim-steps');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextPatientStage(caseItem) {
  if (SIM_ACTIVE.stageIdx + 1 < caseItem.stages.length) {
    SIM_ACTIVE.stageIdx++;
    SIM_ACTIVE.state = 'deciding';
    SIM_ACTIVE.selectedOptionIds = new Set();
    renderActivePatientSim(caseItem);
    const target = document.querySelector('.vitals-monitor') || document.querySelector('.sim-steps');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    SIM_ACTIVE.state = 'finished';
    renderPatientReport(caseItem);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function renderPatientReport(caseItem) {
  const max = Math.max(1, SIM_ACTIVE.maxScore);
  const score = Math.max(0, SIM_ACTIVE.score);
  const pct = Math.min(100, Math.round((score / max) * 100));

  let grade = 'Niezaliczone (krytyczne błędy)';
  let gradeColor = 'var(--red)';
  let gradeIcon = '❌';

  if (pct >= 90) {
    grade = 'Celujący (Ekspert SOR)';
    gradeColor = 'var(--green)';
    gradeIcon = '⭐';
  } else if (pct >= 75) {
    grade = 'Bardzo dobry (Prawidłowa stabilizacja)';
    gradeColor = 'var(--green)';
    gradeIcon = '🟢';
  } else if (pct >= 60) {
    grade = 'Zadowalający (Zaliczony z uwagami)';
    gradeColor = 'var(--amber)';
    gradeIcon = '🟡';
  }

  // Zapisz najlepszy wynik
  ctx.S.patientCases = ctx.S.patientCases || {};
  const prev = ctx.S.patientCases[caseItem.id];
  const best = prev ? Math.max(prev.bestScore || 0, pct) : pct;
  ctx.S.patientCases[caseItem.id] = {
    bestScore: best,
    lastPlayed: Date.now()
  };
  save();

  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:920px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
      <a class="btn sec sm" href="#/pacjent">← Wróć do listy pacjentów</a>
      <span class="chip" style="font-weight:700">${esc(caseItem.shortTitle)}</span>
    </div>

    <!-- Karta wyniku -->
    <div class="card" style="text-align:center;padding:2.2rem 1.5rem;border-top:4px solid ${gradeColor}">
      <div style="font-size:2.8rem;margin-bottom:.4rem">${gradeIcon}</div>
      <h2 style="font-size:1.8rem;margin-bottom:.4rem;font-family:var(--font-display)">Twój wynik: ${pct}% (${score}/${max} pkt)</h2>
      <b style="font-size:1.15rem;color:${gradeColor}">${grade}</b>
      <p class="srcline" style="max-width:600px;margin:1rem auto 0 auto">
        ${pct >= 75
          ? 'Świetna robota! Wdrożyłeś optymalne procedury PALS/SOR, uniknąłeś przeciwwskazań i skutecznie ustabilizowałeś parametry życiowe dziecka.'
          : 'Zwróć szczególną uwagę na błędy krytyczne (czerwone karty) – w pediatrycznych stanach nagłych zaniechanie lub niewłaściwa kolejność leków może zadecydować o życiu pacjenta.'}
      </p>

      <div style="display:flex;gap:.8rem;justify-content:center;margin-top:1.6rem;flex-wrap:wrap">
        <button class="btn pri" id="btnExportPatientNote">📋 Kopiuj kartę pacjenta do Notatnika</button>
        <button class="btn sec" id="btnRestartPatient">🔄 Powtórz ten przypadek</button>
        <a class="btn sec" href="#/pacjent">🩺 Wybierz innego pacjenta</a>
      </div>
    </div>

    <!-- Ostateczne rozpoznanie i omówienie debrief -->
    <div class="card" style="margin-top:1.5rem;padding:1.6rem">
      <div class="eyebrow">Karta wypisowa i podsumowanie merytoryczne</div>
      <h3 style="font-size:1.35rem;margin:.4rem 0 .8rem 0">${esc(caseItem.debrief.diagnosis)} (${esc(caseItem.debrief.code)})</h3>
      <p class="srcline" style="margin-bottom:1.2rem"><b>Etiologia:</b> ${esc(caseItem.debrief.etiology)}</p>

      <div style="background:var(--bg);padding:1.1rem 1.3rem;border-radius:10px;margin-bottom:1.4rem;border:1px solid var(--line-2)">
        <b style="font-size:1.05rem;color:var(--teal-d);display:block;margin-bottom:.6rem">💡 Złote zasady egzaminacyjne (Klucz Zakładu & PES):</b>
        <ul style="margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.4rem">
          ${caseItem.debrief.keyRules.map(r => `<li style="font-size:.94rem">${esc(r)}</li>`).join('')}
        </ul>
      </div>

      <div class="tip" style="margin:0">
        <h4>Perła kliniczna ostrego dyżuru</h4>
        <p>${esc(caseItem.debrief.pearls)}</p>
      </div>
    </div>
  </div></section>`;

  $('#btnRestartPatient').onclick = () => {
    startPatientSim(caseItem);
    renderActivePatientSim(caseItem);
  };

  $('#btnExportPatientNote').onclick = () => {
    const md = `# Raport kliniczny: ${caseItem.shortTitle}
**Rozpoznanie:** ${caseItem.debrief.diagnosis} (${caseItem.debrief.code})
**Data symulacji:** ${new Date().toLocaleString('pl-PL')}
**Pacjent:** ${caseItem.age}, masa ciała: ${caseItem.weight} kg, płeć: ${caseItem.gender}
**Wynik postępowania ratunkowego:** ${pct}% (${score}/${max} pkt) – ${grade}

---
### Wyjściowe parametry życiowe:
- Tętno (HR): ${caseItem.vitalsInitial.hr}/min
- Saturacja (SpO2): ${caseItem.vitalsInitial.spo2}%
- Oddechy (RR): ${caseItem.vitalsInitial.rr}/min
- Ciśnienie tętnicze: ${caseItem.vitalsInitial.bp} mmHg
- Temperatura: ${caseItem.vitalsInitial.temp}°C
- Nawrót kapilarny (CRT): ${caseItem.vitalsInitial.crt}s
- Świadomość (pGCS): ${caseItem.vitalsInitial.pgcs}/15
- Glikemia: ${caseItem.vitalsInitial.gluc} mg/dl

---
### Złote reguły i kluczowe wnioski:
${caseItem.debrief.keyRules.map(r => `- ${r}`).join('\n')}

**Perła kliniczna:**
> ${caseItem.debrief.pearls}
`;

    const notes = getNotes();
    notes.unshift({
      id: 'note_' + Date.now(),
      title: `SOR: ${caseItem.shortTitle} (${pct}%)`,
      content: md,
      body: md,
      updatedAt: Date.now(),
      updated: Date.now()
    });
    saveNotes(notes);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).catch(() => {});
    }
    toast('Zapisano kartę pacjenta w Notatniku i skopiowano do schowka!');
  };
}

    return { viewPatient, cases: PATIENT_CASES, getVitalStatus, renderPatientCaseList };
  };
})();
