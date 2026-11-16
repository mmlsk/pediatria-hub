/* Pediatria V – moduł kliniczny: Atlas badań laboratoryjnych, obrazowych i osutek dziecięcych */
(function () {
  'use strict';
  window.HUB_CLINICAL = window.HUB_CLINICAL || {};
  window.HUB_CLINICAL.diagnostics = function (ctx) {
    const { IMAGING_TRAINER_CASES, PEDIATRIC_RASH_DATABASE, RASH_PUZZLES } = window.HUB_META;
    const { $, $$, main, esc, norm, safeStorageSet, toast, ASHORT } = ctx;

/* ---------- ATLAS BADAŃ LABORATORYJNYCH I OBRAZOWYCH ---------- */
let DIAG_TAB = 'pmr'; // 'pmr' | 'gas' | 'urine' | 'cbc' | 'imaging' | 'osutki'

/* ---------- ATLAS OSUTEK DZIECIĘCYCH (RASH ENGINE) ---------- */
const RASH_STORE_KEY = 'pediatria_hub_rashes_v1';
let RASH_STATE = {
  subTab: 'catalog', // 'catalog' | 'matrix' | 'puzzles'
  selectedId: 'odra',
  glassTestActive: false,
  matrixFilter: 'all',
  selectedForCompare: ['odra', 'plonica'],
  puzzleIdx: 0,
  puzzleStep: 1,
  puzzleAnswers: {},
  puzzlesDone: []
};
try {
  const rsRaw = localStorage.getItem(RASH_STORE_KEY);
  if (rsRaw) {
    const parsed = JSON.parse(rsRaw);
    Object.assign(RASH_STATE, parsed);
    if (!RASH_STATE.puzzleAnswers) RASH_STATE.puzzleAnswers = {};
    if (!RASH_STATE.puzzlesDone) RASH_STATE.puzzlesDone = [];
    if (!RASH_STATE.selectedForCompare) RASH_STATE.selectedForCompare = ['odra', 'plonica'];
  }
} catch (e) { /* ignoruj */ }
function saveRashState() {
  safeStorageSet(RASH_STORE_KEY, JSON.stringify(RASH_STATE));
}
const IMAGING_STORE_KEY = 'pediatria_hub_imaging_v1';
let IMAGING_PROGRESS = {};
try {
  const ipRaw = localStorage.getItem(IMAGING_STORE_KEY);
  if (ipRaw) IMAGING_PROGRESS = JSON.parse(ipRaw);
} catch (e) { /* ignoruj */ }
function saveImagingProgress() {
  safeStorageSet(IMAGING_STORE_KEY, JSON.stringify(IMAGING_PROGRESS));
}
let ACTIVE_IMAGING_CASE_ID = 'ekg-norm';
let IMAGING_MODALITY_FILTER = 'all'; // 'all' | 'ekg' | 'rtg' | 'usg'
let IMAGING_SHOW_HINT = false;
let IMAGING_LAST_FEEDBACK = null;

function viewDiagnostics(parts, params) {
  if (params && params.tab && ['pmr', 'gas', 'urine', 'cbc', 'imaging', 'osutki'].includes(params.tab)) {
    DIAG_TAB = params.tab;
  }
  if (params && params.osutka) {
    RASH_STATE.selectedId = params.osutka;
    DIAG_TAB = 'osutki';
  }
  if (params && params.case) {
    ACTIVE_IMAGING_CASE_ID = params.case;
    DIAG_TAB = 'imaging';
  }
  if (params && params.modality && ['all', 'ekg', 'rtg', 'usg'].includes(params.modality)) {
    IMAGING_MODALITY_FILTER = params.modality;
    DIAG_TAB = 'imaging';
  }

  const render = () => {
    main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:960px">
      <div class="eyebrow">Diagnostyka laboratoryjna & Obrazowa</div>
      <h2>Atlas badań & Lab Trainer</h2>
      <p class="lead">Interaktywny interpretator wyników badań w pediatrii: płyn mózgowo-rdzeniowy, gazometria z luką anionową, osad moczu, algorytm anemii oraz trenażer EKG, RTG i USG (POCUS) z hotspotami patologii.</p>

      <!-- Nawigacja zakładek -->
      <div class="calc-tab-nav" id="diagTabNav">
        <button class="calc-tab-btn ${DIAG_TAB === 'pmr' ? 'active' : ''}" data-dtab="pmr">🧠 Płyn mózgowo-rdzeniowy (PMR)</button>
        <button class="calc-tab-btn ${DIAG_TAB === 'gas' ? 'active' : ''}" data-dtab="gas">🫁 Gazometria & Luka Anionowa</button>
        <button class="calc-tab-btn ${DIAG_TAB === 'urine' ? 'active' : ''}" data-dtab="urine">🧪 Badanie i Osad Moczu</button>
        <button class="calc-tab-btn ${DIAG_TAB === 'cbc' ? 'active' : ''}" data-dtab="cbc">🩸 Morfologia & Anemie</button>
        <button class="calc-tab-btn ${DIAG_TAB === 'imaging' ? 'active' : ''}" data-dtab="imaging">🔬 EKG, RTG & USG</button>
        <button class="calc-tab-btn ${DIAG_TAB === 'osutki' ? 'active' : ''}" data-dtab="osutki">🧬 Osutki Dziecięce</button>
      </div>

      <!-- Treść zakładki -->
      <div id="diagTabContent">
        ${renderDiagContent(DIAG_TAB)}
      </div>

      <!-- Mini-Quiz Diagnostyczny -->
      <h3 style="margin:2.8rem 0 .4rem">Mini-quiz: Rozpoznaj pacjenta po badaniu</h3>
      <p class="muted" style="margin-bottom:.9rem">Sprawdź swoją czujność kliniczną na typowych zagadkach egzaminacyjnych.</p>
      <div class="card" id="labQuizContainer" style="padding:1.4rem">
        ${renderLabQuiz()}
      </div>
    </div></section>`;

    attachEvents();
  };

  const renderDiagContent = tab => {
    switch (tab) {
      case 'pmr': return renderDiagPMR();
      case 'gas': return renderDiagGas();
      case 'urine': return renderDiagUrine();
      case 'cbc': return renderDiagCBC();
      case 'imaging': return renderDiagImaging();
      case 'osutki': return renderDiagRashes();
      default: return renderDiagPMR();
    }
  };

  /* 1. PMR */
  const renderDiagPMR = () => {
    return `<div class="lab-calc-box">
      <div class="acts" style="justify-content:space-between;margin-bottom:1rem">
        <div>
          <h3 style="font-size:1.25rem">Kalkulator i Różnicownik PMR</h3>
          <span class="muted" style="font-size:.82rem">Wpisz parametry lub wybierz gotowy profil pacjenta.</span>
        </div>
        <div class="acts">
          <span class="srcline" style="font-weight:700">Wklej profil:</span>
          <button class="btn sec sm" data-pmr-set="bact">ZOMR Ropne (Bakteryjne)</button>
          <button class="btn sec sm" data-pmr-set="viral">ZOMR Wirusowe</button>
          <button class="btn sec sm" data-pmr-set="tb">ZOMR Gruźlicze</button>
          <button class="btn sec sm" data-pmr-set="norm">PMR Prawidłowy</button>
        </div>
      </div>

      <div class="lab-inputs-grid">
        <div class="lab-input-group">
          <label>Cytoza (/µl) [norma < 5]</label>
          <input type="number" id="pmrCytoza" value="1800">
        </div>
        <div class="lab-input-group">
          <label>Granulocyty (%)</label>
          <input type="number" id="pmrNeutro" min="0" max="100" value="85">
        </div>
        <div class="lab-input-group">
          <label>Białko w PMR (mg/dl) [15–45]</label>
          <input type="number" id="pmrProtein" value="180">
        </div>
        <div class="lab-input-group">
          <label>Glukoza w PMR (mg/dl)</label>
          <input type="number" id="pmrGlc" value="18">
        </div>
        <div class="lab-input-group">
          <label>Glikemia w surowicy (mg/dl)</label>
          <input type="number" id="pmrSerumGlc" value="95">
        </div>
      </div>

      <div id="pmrVerdict"></div>
    </div>

    <!-- Tabela różnicująca PMR -->
    <div class="card" style="padding:1.2rem">
      <h4 style="margin-bottom:.6rem">Oficjalna tabela różnicowania płynu mózgowo-rdzeniowego (PMR):</h4>
      <div style="overflow-x:auto">
        <table class="md-preview table" style="width:100%;font-size:.85rem">
          <thead>
            <tr>
              <th>Cecha</th>
              <th>Norma (starsze dziecko)</th>
              <th>ZOMR Bakteryjne (ropne)</th>
              <th>ZOMR Wirusowe (aseptyczne)</th>
              <th>ZOMR Gruźlicze</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Wygląd</b></td>
              <td>Wodojasny, przejrzysty</td>
              <td>Mętny / ropny</td>
              <td>Przejrzysty / opalizujący</td>
              <td>Opalizujący (siateczka włóknikowa!)</td>
            </tr>
            <tr>
              <td><b>Cytoza (/µl)</b></td>
              <td>< 5 (noworodek < 20)</td>
              <td>Bardzo wysoka (1000–10 000+)</td>
              <td>Podwyższona (50–500)</td>
              <td>Podwyższona (100–500)</td>
            </tr>
            <tr>
              <td><b>Przewaga komórek</b></td>
              <td>Limfocyty (100%)</td>
              <td><b>Granulocyty wielojądrzaste (>75–80%)</b></td>
              <td><b>Limfocyty / jednojądrzaste</b></td>
              <td><b>Limfocyty</b> (początkowo neutrofile)</td>
            </tr>
            <tr>
              <td><b>Białko (mg/dl)</b></td>
              <td>15–45 mg/dl</td>
              <td>Wysokie (100–500 mg/dl)</td>
              <td>Nieznacznie podwyższone (50–100)</td>
              <td><b>Ekstremalnie wysokie (>500 mg/dl!)</b></td>
            </tr>
            <tr>
              <td><b>Glukoza (PMR/krew)</b></td>
              <td>> 0.6 (60% glikemii)</td>
              <td><b>Obniżona (< 0.4, często < 0.2)</b></td>
              <td><b>Prawidłowa (> 0.5–0.6)</b></td>
              <td><b>Bardzo niska (< 0.3)</b></td>
            </tr>
            <tr>
              <td><b>Kluczowe leczenie</b></td>
              <td>–</td>
              <td>Ceftriakson + Wankomycyna + Deksametazon</td>
              <td>Objawowe / Acyklowir (HSV/VZV)</td>
              <td>4 leki przeciwprątkowe (RIPE) + GKS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;
  };

  /* 2. Gazometria */
  const renderDiagGas = () => {
    return `<div class="lab-calc-box">
      <div class="acts" style="justify-content:space-between;margin-bottom:1rem">
        <div>
          <h3 style="font-size:1.25rem">Kalkulator Gazometrii & Luki Anionowej (AG)</h3>
          <span class="muted" style="font-size:.82rem">Automatyczna ocena zaburzeń RKZ i luki anionowej w surowicy.</span>
        </div>
        <div class="acts">
          <span class="srcline" style="font-weight:700">Przypadki:</span>
          <button class="btn sec sm" data-gas-set="dka">DKA (Ketoza cukrzycowa)</button>
          <button class="btn sec sm" data-gas-set="diarrhea">Odwodnienie biegunkowe</button>
          <button class="btn sec sm" data-gas-set="asthma">Ostra astma (zmęczenie)</button>
          <button class="btn sec sm" data-gas-set="pyloric">Zwężenie odźwiernika (PS)</button>
        </div>
      </div>

      <div class="lab-inputs-grid">
        <div class="lab-input-group">
          <label>pH krwi [7.35–7.45]</label>
          <input type="number" id="gasPh" step="0.01" value="7.18">
        </div>
        <div class="lab-input-group">
          <label>pCO2 (mmHg) [35–45]</label>
          <input type="number" id="gasPco2" value="22">
        </div>
        <div class="lab-input-group">
          <label>HCO3- (mmol/l) [22–26]</label>
          <input type="number" id="gasHco3" value="8">
        </div>
        <div class="lab-input-group">
          <label>Sód Na+ (mmol/l) [135–145]</label>
          <input type="number" id="gasNa" value="136">
        </div>
        <div class="lab-input-group">
          <label>Chlorki Cl- (mmol/l) [98–106]</label>
          <input type="number" id="gasCl" value="98">
        </div>
      </div>

      <div id="gasVerdict"></div>
    </div>`;
  };

  /* 3. Mocz */
  const renderDiagUrine = () => {
    return `<div class="card" style="padding:1.4rem">
      <h3 style="font-size:1.25rem;margin-bottom:.4rem">Badanie Ogólne i Osad Moczu w Nefrologii Dziecięcej</h3>
      <p class="muted" style="margin-bottom:1.2rem">Różnicowanie kłębuszkowych i cewkowych zapaleń nerek na podstawie wałeczków i białkomoczu.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:1rem;margin-bottom:1.6rem">
        <div class="card" style="border-left:4px solid var(--red)">
          <b style="color:var(--red);font-size:1.05rem">Wałeczki erytrocytarne & Krwinkomocz dysmorficzny</b>
          <p class="srcline" style="margin:.4rem 0">Patognomoniczne dla <b>kłębuszkowego zapalenia nerek (KZN)</b>, np. ostrego poinfekcyjnego (APSGN) lub nefropatii IgA.</p>
          <span class="chip" style="background:var(--red-l);color:var(--red)">Zespół nefrytyczny</span>
        </div>
        <div class="card" style="border-left:4px solid var(--amber)">
          <b style="color:var(--amber);font-size:1.05rem">Wałeczki leukocytarne</b>
          <p class="srcline" style="margin:.4rem 0">Świadczą o zapaleniu miąższu nerki: <b>Ostre odmiedniczkowe zapalenie nerek (PZN)</b> lub śródmiąższowe zapalenie nerek.</p>
          <span class="chip" style="background:var(--amber-l);color:var(--amber)">PZN / ZUM górnych dróg</span>
        </div>
        <div class="card" style="border-left:4px solid var(--teal)">
          <b style="color:var(--teal);font-size:1.05rem">Wałeczki szkliste & ziarniste</b>
          <p class="srcline" style="margin:.4rem 0">Mogą pojawiać się przy odwodnieniu, po wysiłku lub w ostrym uszkodzeniu nerek (AKI / ostra martwica cewek ATN).</p>
          <span class="chip" style="background:var(--teal-l);color:var(--teal)">Uszkodzenie cewek / Odwodnienie</span>
        </div>
      </div>

      <h4 style="margin:1.4rem 0 .5rem">Kryteria Bakteriomoczu Znamiennego w ZUM u Dzieci:</h4>
      <div style="display:grid;gap:.5rem;font-size:.88rem">
        <div class="calc-syrup-row" style="background:var(--bg)">
          <b>Środkowy strumień moczu (ze zbiórki)</b>
          <div style="font-weight:800;color:var(--teal)">≥ 10^5 CFU / ml (jednego uropatogenu)</div>
        </div>
        <div class="calc-syrup-row" style="background:var(--bg)">
          <b>Mocz pobrany przez cewnik pęcherzowy</b>
          <div style="font-weight:800;color:var(--teal)">≥ 10^4 CFU / ml</div>
        </div>
        <div class="calc-syrup-row" style="background:var(--bg)">
          <b>Nakłucie nadłonowe pęcherza (złoty standard)</b>
          <div style="font-weight:800;color:var(--green)">Każda liczba bakterii (nawet 1 CFU/ml!)</div>
        </div>
      </div>
      <p class="srcline" style="margin-top:.8rem;color:var(--red)">⚠️ <b>Worek do zbiórki moczu:</b> służy wyłącznie do WYKLUCZENIA ZUM (wynik ujemny wyklucza zakażenie). Dodatni wynik z woreczka NIE upoważnia do rozpoznania ZUM bez potwierdzenia cewnikowaniem/środkowym strumieniem!</p>
    </div>`;
  };

  /* 4. CBC */
  const renderDiagCBC = () => {
    return `<div class="card" style="padding:1.4rem">
      <h3 style="font-size:1.25rem;margin-bottom:.4rem">Morfologia Krwi i Algorytm Różnicowania Niedokrwistości</h3>
      <p class="muted" style="margin-bottom:1.2rem">Klasyfikacja niedokrwistości na podstawie wskaźnika MCV, retikulocytów i RDW.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:1rem;margin-bottom:1.4rem">
        <div class="card" style="border-top:4px solid var(--amber)">
          <b>1. Anemia mikrocytarna (niskie MCV)</b>
          <div style="font-size:.84rem;margin-top:.4rem">
            <div>• <b>Niedobór żelaza (IDA):</b> RDW wysokie (>15%), ferrytyna niska, wskaźnik Mentzera > 13.</div>
            <div style="margin-top:.3rem">• <b>Talasemia minor:</b> RDW prawidłowe, liczba krwinek RBC często wysoka, Mentzer < 13.</div>
          </div>
        </div>
        <div class="card" style="border-top:4px solid var(--teal)">
          <b>2. Anemia normocytarna (prawidłowe MCV)</b>
          <div style="font-size:.84rem;margin-top:.4rem">
            <div>• <b>Retikulocyty > 2%:</b> Hemoliza (sferocytoza wrodzona, AIHA, niedobór G6PD, HUS).</div>
            <div style="margin-top:.3rem">• <b>Retikulocyty < 0.5%:</b> Aplazja szpiku (PRCA, aplastyczna), białaczka, choroba przewlekła.</div>
          </div>
        </div>
        <div class="card" style="border-top:4px solid var(--violet)">
          <b>3. Anemia makrocytarna (wysokie MCV)</b>
          <div style="font-size:.84rem;margin-top:.4rem">
            <div>• <b>Megaloblastyczna:</b> Niedobór witaminy B12 lub kwasu foliowego (hypersegmentacja neutrofilów).</div>
            <div style="margin-top:.3rem">• <b>Niemegaloblastyczna:</b> Niedoczynność tarczycy, zespół Blackfana-Diamonda.</div>
          </div>
        </div>
      </div>

      <div class="card" style="background:var(--teal-xl);border-color:var(--teal)">
        <b>Wzór Mentzera (różnicowanie IDA vs Talasemia):</b>
        <div style="font-size:1.1rem;font-weight:800;color:var(--teal);margin:.3rem 0">Wskaźnik Mentzera = MCV / RBC</div>
        <p class="srcline">Wynik <b>> 13</b> wskazuje na niedobór żelaza (Iron Deficiency Anemia). Wynik <b>< 13</b> silnie przemawia za nosicielstwem talasemii (cecha talasemii).</p>
      </div>
    </div>`;
  };

  /* 5. SVG Generator dla Trenażera Badań Obrazowych i EKG */
  const renderImagingSvg = (caseItem, showHighlight) => {
    const { svgType, hotspot } = caseItem;
    const hx = hotspot.targetX;
    const hy = hotspot.targetY;
    const hr = hotspot.radius;

    const highlightSvg = showHighlight ? `
      <g class="imaging-hotspot-overlay">
        <circle cx="${hx}" cy="${hy}" r="${hr}" fill="rgba(34,197,94,0.22)" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="6,3" class="imaging-pulse-circle" />
        <circle cx="${hx}" cy="${hy}" r="5" fill="#22c55e" />
        <rect x="${Math.max(10, hx - 65)}" y="${hy > 150 ? hy - hr - 26 : hy + hr + 8}" width="130" height="20" rx="4" fill="rgba(15,23,42,0.92)" stroke="#22c55e" stroke-width="1"/>
        <text x="${Math.max(75, hx)}" y="${hy > 150 ? hy - hr - 12 : hy + hr + 22}" fill="#fff" font-size="9.5" font-weight="700" text-anchor="middle">🎯 ${esc(hotspot.name.slice(0, 22))}</text>
      </g>` : '';

    const hitZone = `<circle cx="${hx}" cy="${hy}" r="${hr}" fill="transparent" class="imaging-hit-circle" data-hotspot-hit="1" tabindex="0" role="button" aria-label="${esc('Zlokalizuj patologię: ' + hotspot.name)}" style="cursor:crosshair" />`;

    let body = '';

    if (svgType === 'ekg-norm') {
      body = `
        <defs>
          <pattern id="ekgSmGrid" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M 4 0 L 0 0 0 4" fill="none" stroke="#fecdd3" stroke-width="0.5"/></pattern>
          <pattern id="ekgGrid" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="url(#ekgSmGrid)"/><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f43f5e" stroke-width="0.9" stroke-opacity="0.55"/></pattern>
        </defs>
        <rect width="320" height="220" fill="#fff5f5"/>
        <rect width="320" height="220" fill="url(#ekgGrid)"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#38bdf8" font-size="10.5" font-family="monospace" font-weight="700">V1 · 25 mm/s · 10 mm/mV · HR 95/min (6 lat)</text>
        <path d="M 12 110 L 18 110 L 18 70 L 26 70 L 26 110 L 32 110" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
        <text x="36" y="113" fill="#64748b" font-size="8.5" font-family="monospace">10mm</text>
        <path d="M 45 110 Q 53 98 61 110 L 70 110 L 73 115 L 79 50 L 86 128 L 94 110 L 105 110 Q 120 134 135 110 L 155 110 Q 163 98 171 110 L 180 110 L 183 115 L 189 50 L 196 128 L 204 110 L 212 110 Q 228 136 244 110 L 265 110 Q 273 98 281 110 L 290 110 L 293 115 L 299 50 L 306 128 L 314 110" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="189" y="42" fill="#0f172a" font-size="9" font-weight="700" text-anchor="middle">R</text>
        <text x="228" y="152" fill="#0f172a" font-size="8.5" font-weight="700" text-anchor="middle">Ujemny T w V1</text>
      `;
    } else if (svgType === 'ekg-svt') {
      body = `
        <defs>
          <pattern id="ekgSmGridSvt" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M 4 0 L 0 0 0 4" fill="none" stroke="#fecdd3" stroke-width="0.5"/></pattern>
          <pattern id="ekgGridSvt" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="url(#ekgSmGridSvt)"/><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f43f5e" stroke-width="0.9" stroke-opacity="0.55"/></pattern>
        </defs>
        <rect width="320" height="220" fill="#fff5f5"/>
        <rect width="320" height="220" fill="url(#ekgGridSvt)"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#ef4444" font-size="10.5" font-family="monospace" font-weight="700">MONITOR II · HR 230/min · WĄSKIE QRS (&lt;80ms) · SVT</text>
        <path d="M 8 110 L 14 110 L 14 70 L 20 70 L 20 110 L 24 110" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M 24 110 L 27 115 L 30 42 L 34 126 L 37 110 Q 45 98 52 110 L 58 110 L 61 115 L 64 42 L 68 126 L 71 110 Q 79 98 86 110 L 92 110 L 95 115 L 98 42 L 102 126 L 105 110 Q 113 98 120 110 L 126 110 L 129 115 L 132 42 L 136 126 L 139 110 Q 147 98 154 110 L 160 110 L 163 115 L 166 42 L 170 126 L 173 110 Q 181 98 188 110 L 194 110 L 197 115 L 200 42 L 204 126 L 207 110 Q 215 98 222 110 L 228 110 L 231 115 L 234 42 L 238 126 L 241 110 Q 249 98 256 110 L 262 110 L 265 115 L 268 42 L 272 126 L 275 110 Q 283 98 290 110 L 296 110 L 299 115 L 302 42 L 306 126 L 310 110" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="166" y1="145" x2="200" y2="145" stroke="#ef4444" stroke-width="2"/>
        <text x="183" y="160" fill="#ef4444" font-size="9" text-anchor="middle" font-weight="700">RR = 130 ms (brak P)</text>
      `;
    } else if (svgType === 'ekg-lqts') {
      body = `
        <defs>
          <pattern id="ekgSmGridLqts" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M 4 0 L 0 0 0 4" fill="none" stroke="#fecdd3" stroke-width="0.5"/></pattern>
          <pattern id="ekgGridLqts" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="url(#ekgSmGridLqts)"/><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f43f5e" stroke-width="0.9" stroke-opacity="0.55"/></pattern>
        </defs>
        <rect width="320" height="220" fill="#fff5f5"/>
        <rect width="320" height="220" fill="url(#ekgGridLqts)"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#f59e0b" font-size="10.5" font-family="monospace" font-weight="700">LEAD II · HR 62/min · QT = 520 ms · QTc = 540 ms (LQTS)</text>
        <path d="M 15 110 Q 23 99 31 110 L 38 110 L 41 114 L 46 48 L 52 124 L 57 110 L 80 110 Q 102 70 124 110 L 180 110 Q 188 99 196 110 L 202 110 L 205 114 L 210 48 L 216 124 L 221 110 L 244 110 Q 266 70 288 110 L 315 110" fill="none" stroke="#0f172a" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="204" y1="140" x2="288" y2="140" stroke="#dc2626" stroke-width="2"/>
        <line x1="204" y1="134" x2="204" y2="146" stroke="#dc2626" stroke-width="2"/>
        <line x1="288" y1="134" x2="288" y2="146" stroke="#dc2626" stroke-width="2"/>
        <text x="246" y="156" fill="#dc2626" font-size="9.5" font-weight="700" text-anchor="middle">Wydłużony QT = 520 ms (&gt; 1/2 RR)</text>
      `;
    } else if (svgType === 'ekg-hyperkalemia') {
      body = `
        <defs>
          <pattern id="ekgSmGridK" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M 4 0 L 0 0 0 4" fill="none" stroke="#fecdd3" stroke-width="0.5"/></pattern>
          <pattern id="ekgGridK" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="url(#ekgSmGridK)"/><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f43f5e" stroke-width="0.9" stroke-opacity="0.55"/></pattern>
        </defs>
        <rect width="320" height="220" fill="#fff5f5"/>
        <rect width="320" height="220" fill="url(#ekgGridK)"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#ef4444" font-size="10.5" font-family="monospace" font-weight="700">V3 · K+ = 7.4 mmol/l · NAMIOTOWATY ZAŁAMEK T</text>
        <path d="M 15 110 Q 25 108 35 110 L 48 110 L 53 116 L 60 62 L 67 124 L 72 110 L 80 110 L 92 24 L 104 110 L 150 110 Q 160 108 170 110 L 180 110 L 185 116 L 192 62 L 199 124 L 204 110 L 205 110 L 217 24 L 229 110 L 290 110" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="217" y="18" fill="#b91c1c" font-size="10" font-weight="800" text-anchor="middle">▲ Wysoki T (K+ &gt; 7.0)</text>
      `;
    } else if (svgType === 'rtg-croup') {
      body = `
        <rect width="320" height="220" fill="#0b0f19"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="700">RTG SZYI AP · KRUP (LARYNGOTRACHEITIS) · 2 LATA</text>
        <rect x="125" y="45" width="50" height="155" fill="#1e293b" opacity="0.6" rx="4"/>
        <path d="M 80 40 Q 150 55 220 40" stroke="#475569" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M 30 195 Q 110 205 140 215" stroke="#475569" stroke-width="7" fill="none"/>
        <path d="M 290 195 Q 210 205 180 215" stroke="#475569" stroke-width="7" fill="none"/>
        <path d="M 128 55 L 128 85 L 144 130 L 144 185 L 156 185 L 156 130 L 172 85 L 172 55 Z" fill="#020617" stroke="#38bdf8" stroke-width="1.8"/>
        <line x1="75" y1="130" x2="135" y2="130" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3,2"/>
        <text x="70" y="125" fill="#f59e0b" font-size="9.5" font-weight="700" text-anchor="end">Steeple sign</text>
        <text x="70" y="138" fill="#cbd5e1" font-size="8" text-anchor="end">(Objaw wieży)</text>
      `;
    } else if (svgType === 'rtg-perforation') {
      body = `
        <rect width="320" height="220" fill="#0b0f19"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#ef4444" font-size="10" font-family="monospace" font-weight="700">RTG BRZUCHA / KLATKI (STOJĄCE) · PNEUMOPERITONEUM</text>
        <ellipse cx="60" cy="90" rx="35" ry="50" fill="none" stroke="#334155" stroke-width="2.5"/>
        <ellipse cx="260" cy="90" rx="35" ry="50" fill="none" stroke="#334155" stroke-width="2.5"/>
        <path d="M 150 100 Q 215 60 280 100" fill="none" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
        <path d="M 150 100 Q 215 88 280 100 L 280 180 L 150 180 Z" fill="#334155"/>
        <path d="M 165 88 Q 215 66 265 88 Q 215 80 165 88 Z" fill="#020617" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="215" y="120" fill="#f87171" font-size="9.5" font-weight="700" text-anchor="middle">Sierp powietrza pod przeponą</text>
        <line x1="215" y1="108" x2="215" y2="82" stroke="#f87171" stroke-width="1.5" stroke-dasharray="2,2"/>
      `;
    } else if (svgType === 'rtg-ileus') {
      body = `
        <rect width="320" height="220" fill="#0b0f19"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#f59e0b" font-size="10" font-family="monospace" font-weight="700">RTG BRZUCHA AP · NIEDROŻNOŚĆ MECHANICZNA JELIT</text>
        <rect x="75" y="70" width="75" height="50" rx="10" fill="#1e293b" stroke="#475569" stroke-width="1.8"/>
        <rect x="75" y="70" width="75" height="25" rx="8" fill="#020617"/>
        <line x1="75" y1="95" x2="150" y2="95" stroke="#38bdf8" stroke-width="2.2"/>
        <rect x="115" y="130" width="85" height="52" rx="10" fill="#1e293b" stroke="#475569" stroke-width="1.8"/>
        <rect x="115" y="130" width="85" height="25" rx="8" fill="#020617"/>
        <line x1="115" y1="155" x2="200" y2="155" stroke="#ef4444" stroke-width="2.5"/>
        <rect x="175" y="90" width="80" height="48" rx="10" fill="#1e293b" stroke="#475569" stroke-width="1.8"/>
        <rect x="175" y="90" width="80" height="22" rx="8" fill="#020617"/>
        <line x1="175" y1="112" x2="255" y2="112" stroke="#38bdf8" stroke-width="2.2"/>
        <text x="155" y="196" fill="#f59e0b" font-size="9.5" font-weight="700" text-anchor="middle">Poziomy płynów (Obraz schodów)</text>
      `;
    } else if (svgType === 'rtg-mediastinum') {
      body = `
        <rect width="320" height="220" fill="#0b0f19"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#f87171" font-size="10" font-family="monospace" font-weight="700">RTG KLATKI PIERSIOWEJ PA · GUZ ŚRÓDPIERSIA PRZEDNIEGO</text>
        <ellipse cx="65" cy="120" rx="45" ry="65" fill="#020617" stroke="#334155" stroke-width="2"/>
        <ellipse cx="245" cy="120" rx="45" ry="65" fill="#020617" stroke="#334155" stroke-width="2"/>
        <path d="M 115 50 C 85 85 85 140 120 170 L 190 170 C 225 140 225 85 195 50 Z" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 150 30 Q 135 60 128 85 L 128 105" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <text x="150" y="195" fill="#ef4444" font-size="9" font-weight="700" text-anchor="middle">Masa &gt; 1/3 szerokości klatki (Zespół SVCS)</text>
      `;
    } else if (svgType === 'usg-target') {
      body = `
        <rect width="320" height="220" fill="#080c14"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="700">USG BRZUCHA · GŁOWICA LINIOWA · OBJAW TARCZY</text>
        <line x1="305" y1="40" x2="305" y2="200" stroke="#475569" stroke-width="1"/>
        <text x="312" y="80" fill="#64748b" font-size="7">2cm</text>
        <text x="312" y="140" fill="#64748b" font-size="7">4cm</text>
        <circle cx="150" cy="140" r="46" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <circle cx="150" cy="140" r="32" fill="#0f172a" stroke="#cbd5e1" stroke-width="4"/>
        <ellipse cx="146" cy="138" rx="18" ry="14" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="154" cy="142" r="5" fill="#475569" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="150" y="65" fill="#38bdf8" font-size="10.5" font-weight="700" text-anchor="middle">Objaw tarczy strzelniczej (Target sign)</text>
        <text x="150" y="78" fill="#94a3b8" font-size="8.5" text-anchor="middle">Wgłobienie jelitowe (Intussusception)</text>
      `;
    } else if (svgType === 'usg-appendix') {
      body = `
        <rect width="320" height="220" fill="#080c14"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#f59e0b" font-size="10" font-family="monospace" font-weight="700">USG DÓŁ BIODROWY PRAWY · ZAPALENIE WYROSTKA</text>
        <rect x="20" y="35" width="280" height="18" fill="#1e293b" opacity="0.6"/>
        <path d="M 60 120 L 220 120 Q 235 135 220 150 L 60 150" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <circle cx="145" cy="132" r="7" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
        <polygon points="138,138 152,138 156,215 134,215" fill="#020617"/>
        <line x1="185" y1="120" x2="185" y2="150" stroke="#ef4444" stroke-width="2"/>
        <text x="192" y="138" fill="#ef4444" font-size="9" font-weight="700">8.2 mm</text>
        <text x="150" y="80" fill="#f59e0b" font-size="9.5" font-weight="700" text-anchor="middle">Nieściśliwy wyrostek &gt;6 mm + kamień kałowy</text>
      `;
    } else if (svgType === 'usg-pylorus') {
      body = `
        <rect width="320" height="220" fill="#080c14"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="700">USG ODŹWIERNIKA · ZWĘŻENIE ODŹWIERNIKA (HPS)</text>
        <rect x="90" y="96" width="130" height="24" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="90" y="138" width="130" height="24" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <line x1="90" y1="129" x2="220" y2="129" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="155" y1="96" x2="155" y2="120" stroke="#ef4444" stroke-width="2"/>
        <text x="162" y="112" fill="#ef4444" font-size="8.5" font-weight="700">3.8 mm (≥3mm)</text>
        <line x1="90" y1="172" x2="220" y2="172" stroke="#38bdf8" stroke-width="2"/>
        <text x="155" y="188" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">Długość kanału: 17 mm (≥15mm)</text>
      `;
    } else if (svgType === 'usg-wilms') {
      body = `
        <rect width="320" height="220" fill="#080c14"/>
        <rect x="0" y="0" width="320" height="24" fill="#0f172a"/>
        <text x="10" y="16" fill="#22c55e" font-size="10" font-family="monospace" font-weight="700">USG JAMY BRZUSZNEJ · LEWA NERKA · GUZ WILMSA</text>
        <path d="M 90 70 C 130 65 180 75 190 120 C 195 160 170 205 120 205 C 80 200 65 150 70 110 Z" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <circle cx="140" cy="145" r="44" fill="#334155" stroke="#64748b" stroke-width="2"/>
        <path d="M 98 115 Q 120 122 135 110" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
        <path d="M 180 115 Q 160 122 145 110" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="250" cy="135" rx="8" ry="12" fill="#020617" stroke="#ef4444" stroke-width="1.8"/>
        <text x="250" y="158" fill="#ef4444" font-size="8" text-anchor="middle">Aorta (wolna)</text>
        <text x="140" y="60" fill="#22c55e" font-size="9.5" font-weight="700" text-anchor="middle">Objaw pazura (Claw sign) ➔ guz nerki</text>
      `;
    }

    return `<svg id="imagingSvgCanvas" data-case-id="${caseItem.id}" viewBox="0 0 320 220" class="imaging-canvas-svg" role="group" aria-label="${esc(caseItem.title + ' — kliknij obraz lub naciśnij Enter na obszarze patologii')}">${body}${highlightSvg}${hitZone}</svg>`;
  };

  /* 5. Interactive Imaging & EKG Trainer */
  const renderDiagImaging = () => {
    const cases = IMAGING_TRAINER_CASES || [];
    const totalCases = cases.length;
    const solvedCount = cases.filter(c => IMAGING_PROGRESS[c.id] && IMAGING_PROGRESS[c.id].solved).length;
    const progressPct = Math.round((solvedCount / (totalCases || 1)) * 100);

    const filteredCases = cases.filter(c => {
      if (IMAGING_MODALITY_FILTER === 'all') return true;
      return c.modality === IMAGING_MODALITY_FILTER;
    });

    const activeCase = cases.find(c => c.id === ACTIVE_IMAGING_CASE_ID) || filteredCases[0] || cases[0];
    const cProg = (activeCase && IMAGING_PROGRESS[activeCase.id]) || { hotspot: false, solved: false, selectedOpt: null };

    const modMap = {
      ekg: { icon: '🫀', name: 'EKG Pediatryczne', col: 'var(--red)', bg: 'var(--red-l)' },
      rtg: { icon: '🩻', name: 'RTG Dziecięce', col: 'var(--blue)', bg: 'var(--blue-l)' },
      usg: { icon: '📡', name: 'POCUS / USG', col: 'var(--teal-d)', bg: 'var(--teal-l)' }
    };
    const modInfo = modMap[activeCase.modality] || { icon: '🔬', name: 'Badanie', col: 'var(--ink)', bg: 'var(--surface)' };

    return `<div class="imaging-trainer-wrapper">
      <!-- Pasek filtrów i postępu ogólnego -->
      <div class="imaging-filter-bar">
        <div class="imaging-filter-pills">
          <button class="imaging-filter-btn ${IMAGING_MODALITY_FILTER === 'all' ? 'active' : ''}" data-mod-filter="all">Wszystkie (${totalCases})</button>
          <button class="imaging-filter-btn ${IMAGING_MODALITY_FILTER === 'ekg' ? 'active' : ''}" data-mod-filter="ekg">🫀 EKG (4)</button>
          <button class="imaging-filter-btn ${IMAGING_MODALITY_FILTER === 'rtg' ? 'active' : ''}" data-mod-filter="rtg">🩻 RTG (4)</button>
          <button class="imaging-filter-btn ${IMAGING_MODALITY_FILTER === 'usg' ? 'active' : ''}" data-mod-filter="usg">📡 POCUS / USG (4)</button>
        </div>
        <div class="acts" style="gap:.4rem;align-items:center">
          <span class="chip" style="background:var(--surface);font-weight:700">
            Opanowano: <b>${solvedCount}/${totalCases}</b> (${progressPct}%)
          </span>
        </div>
      </div>

      <!-- Karuzela / Pasek wyboru 12 przypadków -->
      <div class="imaging-case-carousel">
        ${filteredCases.map(c => {
          const cp = IMAGING_PROGRESS[c.id] || {};
          const isAct = c.id === activeCase.id;
          const m = modMap[c.modality] || { icon: '🔬' };
          let badgeText = 'Do rozwiązania';
          let badgeStyle = 'background:var(--bg);color:var(--ink-muted)';
          if (cp.solved) {
            badgeText = '✓ Ukończone';
            badgeStyle = 'background:var(--green-l);color:var(--green);font-weight:700';
          } else if (cp.hotspot) {
            badgeText = '🎯 Wykryto';
            badgeStyle = 'background:var(--amber-l);color:var(--amber);font-weight:700';
          }
          return `<button class="imaging-case-chip ${isAct ? 'active' : ''} ${cp.solved ? 'solved' : ''}" data-case-id="${c.id}">
            <div class="imaging-case-chip-head">
              <span>${m.icon} ${c.modality.toUpperCase()}</span>
              <span class="chip" style="${badgeStyle};padding:.1rem .4rem;font-size:.7rem">${badgeText}</span>
            </div>
            <div class="imaging-case-chip-title">${esc(c.title)}</div>
            <div class="imaging-case-chip-sub">${esc(c.short)}</div>
          </button>`;
        }).join('')}
      </div>

      <!-- Główny widok aktywnego przypadku -->
      <div class="card" style="padding:1.4rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.6rem;margin-bottom:1rem">
          <div>
            <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.3rem;flex-wrap:wrap">
              <span class="chip" style="background:${modInfo.bg};color:${modInfo.col};font-weight:800;border:0">${modInfo.icon} ${modInfo.name}</span>
              <a class="chip" href="#/atlas/${activeCase.atlas}/${activeCase.sec}" target="_self">📖 Atlas: ${esc(ASHORT[activeCase.atlas] || activeCase.atlas)}</a>
              <span class="chip" style="color:var(--ink-muted)">Moduł ${activeCase.mods.join(', ')}</span>
            </div>
            <h3 style="font-size:1.35rem;margin:.2rem 0">${esc(activeCase.title)}</h3>
          </div>
          <div class="acts">
            <button class="btn sec sm" id="btnResetImagingCase" title="Zresetuj ten przypadek">Od nowa</button>
            <button class="btn sec sm" id="btnNextImagingCase">Następny przypadek →</button>
          </div>
        </div>

        <!-- Opis przypadku (Winieta kliniczna) -->
        <div style="background:var(--bg);border-left:3.5px solid ${modInfo.col};border-radius:var(--r);padding:.9rem 1.1rem;margin-bottom:1.2rem;font-size:.92rem;line-height:1.5">
          <b>Winieta kliniczna:</b> ${esc(activeCase.vignette)}
        </div>

        <!-- Ekran diagnostyczny (Monitor medyczny z SVG) -->
        <div class="imaging-monitor-screen">
          <div class="imaging-monitor-header">
            <span>PED-IMG DIAGNOSTIC MONITOR v5.0 · ${esc(activeCase.short)}</span>
            <span style="color:#38bdf8">STANDALONE VECTOR ENGINE</span>
          </div>

          <!-- Pasek statusu kroku 1 -->
          ${!cProg.hotspot ? `
            <div style="padding:.6rem 1rem;background:rgba(2,6,23,0.7);border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-size:.84rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
              <span>🎯 <b>Krok 1:</b> Zlokalizuj patologię / kluczowy objaw (kliknij bezpośrednio na obrazie)</span>
              <button class="btn sec sm" id="btnImagingHint" style="padding:.2rem .6rem;font-size:.78rem">💡 ${IMAGING_SHOW_HINT ? 'Ukryj podpowiedź' : 'Pokaż podpowiedź'}</button>
            </div>
          ` : `
            <div style="padding:.65rem 1rem;background:rgba(34,197,94,0.14);border-bottom:1px solid rgba(34,197,94,0.35);color:#86efac;font-size:.85rem">
              <span style="font-weight:700">✓ Krok 1 ukończony: Wykryto patologię!</span>
              <div style="font-size:.82rem;color:#f1f5f9;margin-top:.2rem"><b>${esc(activeCase.hotspot.name)}:</b> ${esc(activeCase.hotspot.hint)}</div>
            </div>
          `}

          <!-- SVG Canvas -->
          ${renderImagingSvg(activeCase, cProg.hotspot || IMAGING_SHOW_HINT)}
        </div>

        <!-- Informacja zwrotna po kliknięciu -->
        ${IMAGING_LAST_FEEDBACK ? `
          <div style="margin-top:.8rem;padding:.75rem 1rem;border-radius:var(--r);background:${IMAGING_LAST_FEEDBACK.type === 'hit' ? 'var(--green-l)' : 'var(--amber-l)'};border:1.5px solid ${IMAGING_LAST_FEEDBACK.type === 'hit' ? 'var(--green)' : 'var(--amber)'};font-size:.88rem;color:var(--ink)">
            <b>${IMAGING_LAST_FEEDBACK.type === 'hit' ? '✓ Trafienie!' : '⚠️ Blisko, ale to jeszcze nie to!'}</b> ${esc(IMAGING_LAST_FEEDBACK.text)}
          </div>
        ` : ''}

        <!-- KROK 2: Decyzja kliniczna i postępowanie -->
        <div style="margin-top:1.6rem">
          ${cProg.hotspot ? `
            <div class="imaging-step-card" style="border-color:${cProg.solved ? 'var(--green)' : 'var(--teal)'}">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span class="chip" style="background:${cProg.solved ? 'var(--green-l)' : 'var(--teal-l)'};color:${cProg.solved ? 'var(--green)' : 'var(--teal-d)'};font-weight:800">
                  ${cProg.solved ? '✓ KROK 2 ROZWIĄZANY' : '🎯 KROK 2: DECYZJA KLINICZNA'}
                </span>
                <span class="srcline" style="font-size:.82rem">Wytyczne PALS / Standardy Dziecięce</span>
              </div>

              <div style="font-size:1.05rem;font-weight:700;line-height:1.45;color:var(--ink)">
                ${esc(activeCase.clinicalQuestion.q)}
              </div>

              <!-- Opcje odpowiedzi -->
              <div class="opts" style="margin:.6rem 0">
                ${activeCase.clinicalQuestion.opts.map((opt, i) => {
                  let cls = '';
                  const isChosen = cProg.selectedOpt === i;
                  const isCorrect = i === activeCase.clinicalQuestion.correct;
                  if (cProg.solved) {
                    if (isCorrect) cls = 'ok';
                    else if (isChosen) cls = 'bad';
                    else cls = 'dim';
                  } else if (isChosen) {
                    cls = isCorrect ? 'ok' : 'bad';
                  }
                  return `<button class="opt ${cls}" data-img-opt="${i}">
                    <span class="l">${L[i]}</span>
                    <span>${esc(opt)}</span>
                  </button>`;
                }).join('')}
              </div>

              <!-- Wyjaśnienie i Złota Perła Egzaminacyjna po rozwiązaniu -->
              ${cProg.solved ? `
                <div style="background:var(--surface);border:1px solid rgba(47,132,80,0.35);padding:.9rem 1.1rem;border-radius:var(--r);font-size:.9rem;line-height:1.5;margin-top:.4rem">
                  <b style="color:var(--green)">✓ Uzasadnienie postępowania:</b>
                  <p class="srcline" style="margin-top:.3rem;color:var(--ink)">${esc(activeCase.clinicalQuestion.explanation)}</p>
                </div>

                <div class="imaging-pearl-box">
                  <div style="font-size:1.3rem">💡</div>
                  <div>
                    <b style="font-size:.92rem">Złota zasada egzaminacyjna (High-Yield Pearl):</b>
                    <div style="margin-top:.2rem">${esc(activeCase.clinicalQuestion.pearl)}</div>
                  </div>
                </div>

                <div class="acts" style="margin-top:.6rem;justify-content:space-between">
                  <a class="btn pri sm" href="#/atlas/${activeCase.atlas}/${activeCase.sec}">📖 Temat w atlasie (${ASHORT[activeCase.atlas] || activeCase.atlas}) →</a>
                  <button class="btn sec sm" id="btnNextImagingCase2">Następny przypadek →</button>
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="card" style="background:var(--bg);padding:1.4rem;text-align:center;border:1.5px dashed var(--line)">
              <div style="font-size:1.8rem;margin-bottom:.4rem">🔒</div>
              <h4 style="margin:0 0 .3rem">Krok 2: Decyzja kliniczna jest zablokowany</h4>
              <p class="srcline" style="max-width:480px;margin:0 auto .9rem">
                Zgodnie z protokołem symulatora, najpierw wskaż patologię na obrazie diagnostycznym powyżej (Krok 1).
              </p>
              <button class="btn sec sm" id="btnSkipToQuestion">Pomiń szukanie i przejdź od razu do pytania →</button>
            </div>
          `}
        </div>
      </div>

      <!-- Szybka powtórka: Klasyczne objawy radiologiczne -->
      <details class="card" style="padding:1.1rem">
        <summary style="font-weight:700;font-size:1rem;cursor:pointer;color:var(--ink)">
          📚 Zestawienie 4 klasycznych objawów radiologicznych (Szybka powtórka)
        </summary>
        <div class="imaging-grid" style="margin-top:1.1rem">
          <div class="imaging-card" style="border-left:4px solid var(--red)">
            <div style="font-size:1.05rem;font-weight:800;color:var(--red)">Wgłobienie jelita (Intussusception)</div>
            <span class="chip" style="align-self:flex-start">USG jamy brzusznej</span>
            <p class="srcline"><b>Objaw tarczy strzelniczej (target / doughnut sign)</b> w poprzek oraz <b>objaw pseudonerki</b> wzdłuż. Postępowanie z wyboru: dezynwaginacja pneumatyczna/hydrostatyczna.</p>
          </div>
          <div class="imaging-card" style="border-left:4px solid var(--amber)">
            <div style="font-size:1.05rem;font-weight:800;color:var(--amber)">Przerostowe zwężenie odźwiernika (HPS)</div>
            <span class="chip" style="align-self:flex-start">USG odźwiernika</span>
            <p class="srcline">Grubość warstwy mięśniowej <b>≥ 3 mm</b>, długość kanału odźwiernika <b>≥ 15 mm</b>. Klinika: chlustające wymioty bez żółci w 3.–6. tyg., zasadowica hipochloremiczna.</p>
          </div>
          <div class="imaging-card" style="border-left:4px solid var(--blue)">
            <div style="font-size:1.05rem;font-weight:800;color:var(--blue)">Niedrożność przewodu pokarmowego (ZNZ)</div>
            <span class="chip" style="align-self:flex-start">RTG przeglądowe jamy brzusznej</span>
            <p class="srcline"><b>Poziomy płynów w pętlach jelitowych</b> na zdjęciu stojącym lub na boku promieniem poziomym, brak gazu w odbytnicy. U dzieci ze zrostami pooperacyjnymi.</p>
          </div>
          <div class="imaging-card" style="border-left:4px solid var(--violet)">
            <div style="font-size:1.05rem;font-weight:800;color:var(--violet)">Guz Wilmsa vs Neuroblastoma</div>
            <span class="chip" style="align-self:flex-start">USG / TK jamy brzusznej</span>
            <p class="srcline"><b>Wilms:</b> śródnerkowy, objaw pazura (claw sign), nie przekracza linii pośrodkowej.<br><b>Neuroblastoma:</b> nadnerczowy, przekracza linię środkową, w 85% zawiera zwapnienia.</p>
          </div>
        </div>
      </details>
    </div>`;
  };


  /* 6. Osutki Dziecięce & Pediatric Rash Engine */
  const renderDiagRashes = () => {
    const rState = RASH_STATE || {};
    const subTab = rState.subTab || 'catalog';
    const doneCount = (rState.puzzlesDone || []).length;
    const totalPuzzles = (RASH_PUZZLES || []).length;

    let subHtml = '';
    if (subTab === 'catalog') subHtml = renderRashCatalog(rState);
    else if (subTab === 'matrix') subHtml = renderRashMatrix(rState);
    else subHtml = renderRashPuzzles(rState);

    return `<div class="rash-module-wrap">
      <div class="rash-mode-bar">
        <div class="presc-mode-toggle">
          <button class="presc-mode-btn ${subTab === 'catalog' ? 'active' : ''}" data-rtab="catalog">
            📋 Katalog & Mapy Ciała (10)
          </button>
          <button class="presc-mode-btn ${subTab === 'matrix' ? 'active' : ''}" data-rtab="matrix">
            ⚖️ Matryca Różnicowa Side-by-Side
          </button>
          <button class="presc-mode-btn ${subTab === 'puzzles' ? 'active' : ''}" data-rtab="puzzles">
            🎯 Trening Diagnostyczny (10)
            <span class="chip ${doneCount === totalPuzzles ? 'm' : ''}" style="margin-left:.4rem;background:${doneCount === totalPuzzles ? 'var(--green-l)' : 'var(--teal-l)'};color:${doneCount === totalPuzzles ? 'var(--green-d)' : 'var(--teal-d)'};font-size:.74rem;padding:.15rem .45rem;border:0">
              ${doneCount}/${totalPuzzles} zaliczone
            </span>
          </button>
        </div>
      </div>
      ${subHtml}
    </div>`;
  };

  const getRashSvgOverlay = (rashId, isGlass) => {
    const isBlanching = ['odra', 'plonica', 'rozyczka', 'rumien_zakazny', 'rumien_nagly', 'kawasaki'].includes(rashId);
    const isVesicle = ['ospa_wietrzna', 'hfmd'].includes(rashId);
    const isNonBlanching = ['plamica_iga', 'meningokokemia'].includes(rashId);

    const baseOpacity = isGlass ? (isBlanching ? '0.12' : (isVesicle ? '0.2' : '1.0')) : '0.9';
    const vesicleOpacity = isGlass ? '0.95' : '0.9';

    let elements = '';

    if (rashId === 'odra') {
      elements = `
        <!-- Odra: Gruboplamisto-grudkowa zstępująca zlewająca się -->
        <g opacity="${baseOpacity}">
          <!-- Przód -->
          <circle cx="76" cy="26" r="3" fill="#e11d48"/><circle cx="85" cy="22" r="3" fill="#be123c"/><circle cx="94" cy="26" r="3" fill="#e11d48"/>
          <circle cx="70" cy="36" r="3.5" fill="#be123c"/><circle cx="100" cy="36" r="3.5" fill="#be123c"/>
          <circle cx="85" cy="38" r="3" fill="#e11d48"/><circle cx="78" cy="46" r="3" fill="#e11d48"/><circle cx="92" cy="46" r="3" fill="#e11d48"/>
          <circle cx="82" cy="58" r="3.5" fill="#be123c"/><circle cx="88" cy="62" r="3" fill="#e11d48"/>
          <!-- Klatka i brzuch zlewające się -->
          <circle cx="75" cy="74" r="4.5" fill="#e11d48"/><circle cx="85" cy="76" r="5" fill="#be123c"/><circle cx="95" cy="74" r="4.5" fill="#e11d48"/>
          <circle cx="70" cy="88" r="5" fill="#be123c"/><circle cx="82" cy="90" r="5.5" fill="#e11d48"/><circle cx="94" cy="88" r="5" fill="#be123c"/>
          <circle cx="74" cy="104" r="5" fill="#e11d48"/><circle cx="86" cy="106" r="5.5" fill="#be123c"/><circle cx="98" cy="102" r="4.5" fill="#e11d48"/>
          <circle cx="78" cy="120" r="4.5" fill="#be123c"/><circle cx="90" cy="120" r="4.5" fill="#e11d48"/>
          <!-- Ręce -->
          <circle cx="56" cy="84" r="3.5" fill="#e11d48"/><circle cx="48" cy="104" r="3.5" fill="#be123c"/><circle cx="42" cy="126" r="3" fill="#e11d48"/>
          <circle cx="114" cy="84" r="3.5" fill="#e11d48"/><circle cx="122" cy="104" r="3.5" fill="#be123c"/><circle cx="128" cy="126" r="3" fill="#e11d48"/>
          <circle cx="39" cy="152" r="2.5" fill="#be123c"/><circle cx="131" cy="152" r="2.5" fill="#be123c"/>
          <!-- Nogi -->
          <circle cx="72" cy="148" r="4" fill="#e11d48"/><circle cx="98" cy="148" r="4" fill="#be123c"/>
          <circle cx="70" cy="172" r="4" fill="#be123c"/><circle cx="100" cy="172" r="4" fill="#e11d48"/>
          <circle cx="68" cy="198" r="3.5" fill="#e11d48"/><circle cx="102" cy="198" r="3.5" fill="#be123c"/>
          <circle cx="68" cy="224" r="3" fill="#be123c"/><circle cx="102" cy="224" r="3" fill="#e11d48"/>
          <circle cx="65" cy="244" r="2.5" fill="#e11d48"/><circle cx="105" cy="244" r="2.5" fill="#be123c"/>

          <!-- Tył -->
          <circle cx="226" cy="26" r="3" fill="#e11d48"/><circle cx="244" cy="26" r="3" fill="#e11d48"/>
          <circle cx="220" cy="36" r="3.5" fill="#be123c"/><circle cx="250" cy="36" r="3.5" fill="#be123c"/>
          <circle cx="235" cy="58" r="3.5" fill="#be123c"/>
          <circle cx="225" cy="74" r="5" fill="#e11d48"/><circle cx="245" cy="74" r="5" fill="#be123c"/>
          <circle cx="220" cy="90" r="5.5" fill="#be123c"/><circle cx="235" cy="92" r="5" fill="#e11d48"/><circle cx="250" cy="90" r="5.5" fill="#be123c"/>
          <circle cx="224" cy="106" r="5" fill="#e11d48"/><circle cx="246" cy="106" r="5" fill="#be123c"/>
          <circle cx="228" cy="120" r="4.5" fill="#be123c"/><circle cx="242" cy="120" r="4.5" fill="#e11d48"/>
          <circle cx="222" cy="165" r="4" fill="#e11d48"/><circle cx="248" cy="165" r="4" fill="#be123c"/>
          <circle cx="220" cy="195" r="3.5" fill="#be123c"/><circle cx="250" cy="195" r="3.5" fill="#e11d48"/>
        </g>`;
    } else if (rashId === 'plonica') {
      elements = `
        <!-- Płonica: drobnoplamista, szorstka, trójkąt Fiłatowa, linie Pastii -->
        <g opacity="${baseOpacity}">
          <!-- Policzki rumiane -->
          <ellipse cx="76" cy="36" rx="6" ry="5" fill="#dc2626" opacity=".65"/>
          <ellipse cx="94" cy="36" rx="6" ry="5" fill="#dc2626" opacity=".65"/>
          <!-- Blady trójkąt Fiłatowa (wokół ust) -->
          <polygon points="85,38 78,50 92,50" fill="var(--surface-2)" stroke="var(--teal)" stroke-width="1" stroke-dasharray="2,2"/>
          <!-- Drobny gęsty stippling na klatce i brzuchu -->
          ${[
            [72,70],[80,68],[88,71],[96,69],[70,80],[78,82],[86,79],[94,81],[102,78],
            [68,92],[76,95],[84,91],[92,94],[100,92],[72,106],[80,104],[88,107],[96,105],
            [70,118],[78,121],[86,117],[94,119],[102,116],[76,128],[84,130],[92,127]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#dc2626"/>`).join('')}
          <!-- Pachwiny mocno zagęszczone -->
          <circle cx="75" cy="136" r="2.2" fill="#b91c1c"/><circle cx="85" cy="138" r="2.2" fill="#b91c1c"/><circle cx="95" cy="136" r="2.2" fill="#b91c1c"/>
          <!-- Linie Pastii w zgięciach łokciowych (przód) -->
          <line x1="40" y1="112" x2="52" y2="104" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>
          <line x1="118" y1="104" x2="130" y2="112" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>
          <!-- Tył stippling -->
          ${[
            [222,70],[230,68],[238,71],[246,69],[220,82],[228,80],[236,83],[244,79],[252,81],
            [222,94],[230,96],[238,93],[246,95],[224,108],[232,106],[240,109],[248,107],
            [226,122],[234,124],[242,121],[250,123]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#dc2626"/>`).join('')}
        </g>`;
    } else if (rashId === 'rozyczka') {
      elements = `
        <!-- Różyczka: bladoróżowa, drobnoplamista, powiększone węzły podpotyliczne -->
        <g opacity="${baseOpacity}">
          ${[
            [80,28],[90,26],[76,38],[94,38],[85,46],[78,60],[88,58],
            [74,74],[84,72],[94,76],[70,86],[80,88],[90,84],[100,88],
            [76,102],[86,100],[96,104],[72,116],[82,118],[92,114],
            [54,88],[46,108],[116,88],[124,108],[74,155],[96,155],[72,185],[98,185]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fb7185"/>`).join('')}
          <!-- Tył węzły podpotyliczne powiększone (charakterystyczne!) -->
          <circle cx="218" cy="44" r="5" fill="var(--blue)" stroke="#fff" stroke-width="1.5"/>
          <circle cx="252" cy="44" r="5" fill="var(--blue)" stroke="#fff" stroke-width="1.5"/>
          <text x="235" y="52" font-size="7" font-weight="800" text-anchor="middle" fill="var(--blue-d)">Węzły zauszne</text>
          ${[
            [226,74],[236,72],[246,76],[222,88],[232,86],[242,90],[250,86],
            [224,104],[234,102],[244,106],[226,118],[236,120],[246,116]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fb7185"/>`).join('')}
        </g>`;
    } else if (rashId === 'rumien_zakazny') {
      elements = `
        <!-- Rumień zakaźny: spoliczkowane dziecko + girlandy na kończynach -->
        <g opacity="${baseOpacity}">
          <!-- Policzki płonące (spoliczkowane dziecko) -->
          <ellipse cx="75" cy="38" rx="8" ry="7" fill="#ef4444" opacity=".85"/>
          <ellipse cx="95" cy="38" rx="8" ry="7" fill="#ef4444" opacity=".85"/>
          <!-- Girlandowate/koronkowate pętle na ramionach -->
          <path d="M48,80 Q40,90 48,100 Q40,110 46,120 Q38,130 42,140" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-dasharray="4,2"/>
          <path d="M122,80 Q130,90 122,100 Q130,110 124,120 Q132,130 128,140" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-dasharray="4,2"/>
          <!-- Girlandy na udach -->
          <path d="M68,145 Q62,160 70,175 Q62,190 68,205" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-dasharray="4,2"/>
          <path d="M102,145 Q108,160 100,175 Q108,190 102,205" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-dasharray="4,2"/>
          <!-- Tył ramiona girlandy -->
          <path d="M198,80 Q190,90 198,100 Q190,110 196,120" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-dasharray="4,2"/>
          <path d="M272,80 Q280,90 272,100 Q280,110 274,120" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-dasharray="4,2"/>
        </g>`;
    } else if (rashId === 'rumien_nagly') {
      elements = `
        <!-- Rumień nagły: tylko tułów, twarz i kończyny wolne! -->
        <g opacity="${baseOpacity}">
          ${[
            [74,72],[84,70],[94,74],[70,82],[78,84],[88,80],[96,82],[102,80],
            [68,94],[76,96],[86,92],[94,95],[100,93],[72,108],[82,106],[90,110],[98,107],
            [74,120],[84,122],[94,118],[80,128],[90,129]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#f43f5e"/>`).join('')}
          ${[
            [224,72],[234,70],[244,74],[220,84],[230,82],[240,85],[250,81],
            [222,96],[232,94],[242,97],[252,95],[224,110],[234,108],[244,112],
            [226,122],[236,124],[246,120]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#f43f5e"/>`).join('')}
          <!-- Wskazanie na wolną twarz -->
          <circle cx="85" cy="38" r="16" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="85" y="16" font-size="7" font-weight="700" text-anchor="middle" fill="var(--green)">Twarz czysta</text>
        </g>`;
    } else if (rashId === 'ospa_wietrzna') {
      elements = `
        <!-- Ospa wietrzna: polimorfizm (plamki, pęcherzyki, strupki), owłosiona skóra głowy -->
        <!-- Plamki rumieniowe -->
        <g opacity="${baseOpacity}">
          ${[[78,32],[92,34],[80,80],[95,100],[70,110],[120,95],[74,165],[100,190],[225,85],[245,105]].map(([x,y]) =>
            `<circle cx="${x}" cy="${y}" r="3" fill="#ef4444"/>`).join('')}
          <!-- Strupki wysuszone -->
          ${[[88,26],[72,92],[90,115],[44,120],[98,155],[235,32],[220,100],[240,120]].map(([x,y]) =>
            `<circle cx="${x}" cy="${y}" r="2.4" fill="#78350f"/>`).join('')}
        </g>
        <!-- Pęcherzyki "kropla rosy" (zostają widoczne przy szkiełku) -->
        <g opacity="${vesicleOpacity}">
          ${[
            [84,24],[76,44],[88,42],[74,72],[86,88],[96,76],[82,102],[92,108],[48,95],[124,115],
            [70,145],[96,170],[72,210],[102,215],[228,26],[242,28],[232,74],[248,80],[228,95],[244,115]
          ].map(([x,y]) => `
            <circle cx="${x}" cy="${y}" r="3.6" fill="#38bdf8" stroke="#ef4444" stroke-width="1.2"/>
            <circle cx="${x - 1}" cy="${y - 1}" r="1" fill="#ffffff"/>
          `).join('')}
          <!-- Znacznik owłosionej skóry głowy -->
          <circle cx="85" cy="22" r="8" fill="none" stroke="var(--blue)" stroke-width="1.2" stroke-dasharray="2,2"/>
          <text x="85" y="11" font-size="6.5" font-weight="700" text-anchor="middle" fill="var(--blue-d)">Włosy zajęte!</text>
        </g>`;
    } else if (rashId === 'hfmd') {
      elements = `
        <!-- HFMD: pęcherzyki na dłoniach, podeszwach stóp, w buzi, na pośladkach -->
        <g opacity="${vesicleOpacity}">
          <!-- Jama ustna -->
          <circle cx="85" cy="46" r="3.5" fill="#f87171" stroke="#dc2626" stroke-width="1"/>
          <!-- Dłonie (przód i tył) -->
          <ellipse cx="38" cy="152" rx="4.5" ry="3" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <ellipse cx="132" cy="152" rx="4.5" ry="3" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <ellipse cx="188" cy="152" rx="4.5" ry="3" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <ellipse cx="282" cy="152" rx="4.5" ry="3" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <!-- Podeszwy stóp -->
          <ellipse cx="65" cy="244" rx="5" ry="3.5" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <ellipse cx="105" cy="244" rx="5" ry="3.5" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <ellipse cx="215" cy="244" rx="5" ry="3.5" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <ellipse cx="255" cy="244" rx="5" ry="3.5" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.5"/>
          <!-- Pośladki (tył) -->
          <circle cx="226" cy="138" r="3.5" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.2"/>
          <circle cx="244" cy="138" r="3.5" fill="#cbd5e1" stroke="#dc2626" stroke-width="1.2"/>
          <text x="38" y="166" font-size="6.5" font-weight="800" text-anchor="middle" fill="#dc2626">Dłonie</text>
          <text x="65" y="258" font-size="6.5" font-weight="800" text-anchor="middle" fill="#dc2626">Stopy</text>
        </g>`;
    } else if (rashId === 'kawasaki') {
      elements = `
        <!-- Choroba Kawasakiego: czerwone oczy bez ropy, malinowe usta, obrzęk dłoni/stóp, osutka krocza -->
        <g opacity="${baseOpacity}">
          <!-- Przekrwione spojówki bez wydzieliny -->
          <circle cx="79" cy="34" r="3.5" fill="#dc2626"/><circle cx="91" cy="34" r="3.5" fill="#dc2626"/>
          <!-- Czerwone spierzchnięte wargi / język truskawkowy -->
          <ellipse cx="85" cy="45" rx="5" ry="2.5" fill="#b91c1c"/>
          <!-- Węzeł chłonny szyjny powiększony jednostronnie (>1.5 cm) -->
          <circle cx="98" cy="56" r="5" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
          <!-- Polimorficzna osutka na tułowiu i w pachwinach -->
          ${[[74,76],[86,74],[96,78],[70,90],[84,92],[98,88],[76,108],[88,106],[78,124],[92,126],[85,136]].map(([x,y]) =>
            `<circle cx="${x}" cy="${y}" r="3.5" fill="#ef4444"/>`).join('')}
          <!-- Obrzęk i bolesny rumień dłoni i stóp (bardzo charakterystyczne!) -->
          <circle cx="39" cy="152" r="8" fill="#dc2626" opacity=".75"/>
          <circle cx="131" cy="152" r="8" fill="#dc2626" opacity=".75"/>
          <ellipse cx="65" cy="244" rx="10" ry="6" fill="#dc2626" opacity=".75"/>
          <ellipse cx="105" cy="244" rx="10" ry="6" fill="#dc2626" opacity=".75"/>
          <text x="39" y="168" font-size="6.5" font-weight="800" text-anchor="middle" fill="#dc2626">Obrzęk rąk</text>
        </g>`;
    } else if (rashId === 'plamica_iga') {
      elements = `
        <!-- Plamica IgA (Schönlein-Henoch): purpura palpabilis, grawitacyjnie na pośladkach i nogach -->
        <g opacity="${baseOpacity}">
          <!-- PRZÓD: podudzia, stawy skokowe -->
          ${[
            [68,160],[72,170],[66,180],[70,190],[68,205],[72,215],[66,225],[70,235],
            [98,160],[102,170],[96,180],[100,190],[98,205],[102,215],[96,225],[100,235],
            [64,244],[106,244]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="${Math.random() > 0.5 ? 3.5 : 4.5}" fill="#7e22ce" stroke="#581c87" stroke-width="1"/>`).join('')}
          <!-- TYŁ: masywne skupienie na pośladkach i tylnych powierzchniach ud -->
          ${[
            [224,128],[232,130],[240,127],[248,131],[220,138],[228,140],[236,136],[244,141],[252,137],
            [222,150],[230,152],[242,150],[250,153],[218,165],[226,168],[244,166],[252,169],
            [218,185],[224,192],[248,188],[254,195],[216,210],[222,220],[250,215],[254,225]
          ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="${Math.random() > 0.5 ? 3.8 : 4.8}" fill="#7e22ce" stroke="#581c87" stroke-width="1"/>`).join('')}
          <!-- Bolesne obrzęki stawów skokowych -->
          <circle cx="68" cy="235" r="9" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="2,2"/>
          <circle cx="100" cy="235" r="9" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="85" y="260" font-size="7" font-weight="800" text-anchor="middle" fill="#7e22ce">Purpura palpabilis (nie blednie!)</text>
        </g>`;
    } else if (rashId === 'meningokokemia') {
      elements = `
        <!-- Meningokokemia: gwiazdkowate wybroczyny, petechiae, plamica fulminans, zimne kończyny -->
        <g opacity="${baseOpacity}">
          <!-- Asymetryczne wybroczyny i wylewy podskórne -->
          <polygon points="76,82 82,78 86,84 81,89" fill="#4a044e" stroke="#2e1065" stroke-width="1"/>
          <polygon points="92,98 100,94 104,102 96,106" fill="#4a044e" stroke="#2e1065" stroke-width="1"/>
          <polygon points="70,112 76,108 80,116 72,120" fill="#3b0764" stroke="#2e1065" stroke-width="1"/>
          <polygon points="68,160 76,155 80,165 71,172" fill="#4a044e" stroke="#2e1065" stroke-width="1"/>
          <polygon points="98,185 106,178 110,190 101,196" fill="#3b0764" stroke="#2e1065" stroke-width="1"/>
          <polygon points="66,215 74,210 78,222 69,228" fill="#4a044e" stroke="#2e1065" stroke-width="1"/>
          <!-- Drobne petechiae na ciele -->
          ${[[85,74],[70,95],[94,86],[88,124],[74,185],[98,150],[102,220],[232,84],[244,100],[228,145],[250,175]].map(([x,y]) =>
            `<circle cx="${x}" cy="${y}" r="2" fill="#581c87"/>`).join('')}
          <!-- Zimne, sine dłonie i stopy (centralizacja krążenia we wstrząsie) -->
          <circle cx="39" cy="152" r="7" fill="#64748b" opacity=".8"/>
          <circle cx="131" cy="152" r="7" fill="#64748b" opacity=".8"/>
          <ellipse cx="65" cy="244" rx="9" ry="5" fill="#64748b" opacity=".8"/>
          <ellipse cx="105" cy="244" rx="9" ry="5" fill="#64748b" opacity=".8"/>
          <text x="85" y="260" font-size="7" font-weight="900" text-anchor="middle" fill="#dc2626">ALARM: Wybroczyny nie bledną!</text>
        </g>`;
    }

    // Dodaj szkiełko ucisku jeśli włączone
    let glassLens = '';
    if (isGlass) {
      glassLens = `
        <g class="glass-lens-overlay">
          <circle cx="85" cy="95" r="42" fill="rgba(255,255,255,0.4)" stroke="var(--blue)" stroke-width="3"/>
          <circle cx="85" cy="95" r="39" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>
          <line x1="115" y1="125" x2="140" y2="150" stroke="var(--blue-d)" stroke-width="5" stroke-linecap="round"/>
          <text x="85" y="100" font-size="8" font-weight="900" text-anchor="middle" fill="${isNonBlanching ? 'var(--red)' : (isVesicle ? 'var(--blue-d)' : 'var(--green)')}">
            ${isNonBlanching ? 'NIE BLEDNIE!' : (isVesicle ? 'PĘCHERZYK' : 'BLEDNIE')}
          </text>
        </g>`;
    }

    return `<svg viewBox="0 0 350 270" class="rash-svg-canvas" role="img" aria-label="Anatomiczny rozkład osutki: ${rashId}">
      <!-- Kontury ciała przód -->
      <g class="body-anterior">
        <circle cx="85" cy="38" r="20" fill="var(--surface-2)" stroke="var(--line-2)" stroke-width="1.5"/>
        <circle cx="63" cy="38" r="4.5" fill="var(--surface-2)" stroke="var(--line-2)"/>
        <circle cx="107" cy="38" r="4.5" fill="var(--surface-2)" stroke="var(--line-2)"/>
        <rect x="79" y="58" width="12" height="8" rx="2" fill="var(--surface-2)"/>
        <path d="M66,66 L104,66 L108,132 L62,132 Z" fill="var(--surface-2)" stroke="var(--line-2)" stroke-width="1.5"/>
        <path d="M66,68 L44,110 L40,146" stroke="var(--surface-2)" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M104,68 L126,110 L130,146" stroke="var(--surface-2)" stroke-width="12" stroke-linecap="round" fill="none"/>
        <circle cx="39" cy="152" r="6.5" fill="var(--surface-2)"/>
        <circle cx="131" cy="152" r="6.5" fill="var(--surface-2)"/>
        <path d="M72,135 L70,195 L68,236" stroke="var(--surface-2)" stroke-width="13" stroke-linecap="round" fill="none"/>
        <path d="M98,135 L100,195 L102,236" stroke="var(--surface-2)" stroke-width="13" stroke-linecap="round" fill="none"/>
        <ellipse cx="65" cy="244" rx="8" ry="4.5" fill="var(--surface-2)"/>
        <ellipse cx="105" cy="244" rx="8" ry="4.5" fill="var(--surface-2)"/>
        <text x="85" y="265" font-size="8" font-weight="700" text-anchor="middle" fill="var(--muted)">PRZÓD</text>
      </g>

      <!-- Kontury ciała tył -->
      <g class="body-posterior">
        <circle cx="235" cy="38" r="20" fill="var(--surface-2)" stroke="var(--line-2)" stroke-width="1.5"/>
        <circle cx="213" cy="38" r="4.5" fill="var(--surface-2)" stroke="var(--line-2)"/>
        <circle cx="257" cy="38" r="4.5" fill="var(--surface-2)" stroke="var(--line-2)"/>
        <rect x="229" y="58" width="12" height="8" rx="2" fill="var(--surface-2)"/>
        <path d="M216,66 L254,66 L258,132 L212,132 Z" fill="var(--surface-2)" stroke="var(--line-2)" stroke-width="1.5"/>
        <path d="M212,130 Q223,148 235,134 Q247,148 258,130 Z" fill="var(--surface-2)" stroke="var(--line-2)"/>
        <path d="M216,68 L194,110 L190,146" stroke="var(--surface-2)" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M254,68 L276,110 L280,146" stroke="var(--surface-2)" stroke-width="12" stroke-linecap="round" fill="none"/>
        <circle cx="189" cy="152" r="6.5" fill="var(--surface-2)"/>
        <circle cx="281" cy="152" r="6.5" fill="var(--surface-2)"/>
        <path d="M222,135 L220,195 L218,236" stroke="var(--surface-2)" stroke-width="13" stroke-linecap="round" fill="none"/>
        <path d="M248,135 L250,195 L252,236" stroke="var(--surface-2)" stroke-width="13" stroke-linecap="round" fill="none"/>
        <ellipse cx="215" cy="244" rx="8" ry="4.5" fill="var(--surface-2)"/>
        <ellipse cx="255" cy="244" rx="8" ry="4.5" fill="var(--surface-2)"/>
        <text x="235" y="265" font-size="8" font-weight="700" text-anchor="middle" fill="var(--muted)">TYŁ</text>
      </g>

      <!-- Warstwa wykwitów choroby -->
      ${elements}

      <!-- Szkiełko uciskowe (jeśli aktywne) -->
      ${glassLens}
    </svg>`;
  };

  const renderRashCatalog = rState => {
    const list = PEDIATRIC_RASH_DATABASE || [];
    const activeRash = list.find(r => r.id === rState.selectedId) || list[0];
    const isGlass = !!rState.glassTestActive;

    return `<div class="rash-catalog-wrap">
      <!-- Pigułki wyboru choroby -->
      <div class="rash-pills-row">
        ${list.map(r => {
          const isSel = r.id === activeRash.id;
          const isAlert = r.glassTest === 'non_blanching';
          return `<button class="rash-pill-btn ${isSel ? 'active' : ''} ${isAlert ? 'alert-pill' : ''}" data-rash-id="${r.id}">
            <span>${esc(r.name.split('/')[0])}</span>
            ${isAlert ? '<span class="chip" style="font-size:.65rem;background:var(--red-l);color:var(--red);border-color:var(--red);padding:.05rem .3rem">Nieblednąca</span>' : ''}
          </button>`;
        }).join('')}
      </div>

      <!-- Obszar roboczy karty choroby -->
      <div class="rash-card-grid">
        <!-- Kolumna lewa: Sylwetka SVG + Test Szklankowy -->
        <div class="rash-visual-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.6rem;margin-bottom:.8rem">
            <div>
              <strong style="font-size:1rem;color:var(--ink)">Rozkład wykwitów na ciele</strong>
              <div class="srcline">Model anatomiczny dziecka (przód / tył)</div>
            </div>
            <button class="btn ${isGlass ? 'pri' : 'sec'} sm" id="btnToggleGlassTest">
              🔍 ${isGlass ? 'Zdejmij szkiełko' : 'Test szklankowy (ucisk)'}
            </button>
          </div>

          <div class="rash-silhouette-container">
            ${getRashSvgOverlay(activeRash.id, isGlass)}
          </div>

          <!-- Wynik testu szklankowego -->
          <div class="rash-glass-result ${activeRash.glassTest}">
            <div style="font-weight:800;font-size:.85rem;margin-bottom:.2rem">
              ${activeRash.glassTest === 'non_blanching'
                ? '🚨 TEST SZKLANKOWY UJEMNY / ALARMOWY:'
                : (activeRash.glassTest === 'vesicle' ? '💧 WYKWITY PĘCHERZYKOWE:' : '✅ TEST SZKLANKOWY DODATNI:')}
            </div>
            <p style="margin:0;font-size:.84rem;line-height:1.45">${esc(activeRash.glassTestNote)}</p>
          </div>

          <!-- Strefy charakterystyczne -->
          ${(activeRash.specialZones || []).length ? `
          <div style="margin-top:.9rem">
            <label class="muted" style="font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em">Strefy patognomoniczne:</label>
            <div style="display:flex;flex-direction:column;gap:.35rem;margin-top:.4rem">
              ${activeRash.specialZones.map(z => `
                <div class="rash-zone-badge">
                  <b>${esc(z.label)}:</b> <span>${esc(z.desc)}</span>
                </div>
              `).join('')}
            </div>
          </div>` : ''}
        </div>

        <!-- Kolumna prawa: Kompendium wiedzy klinicznej -->
        <div class="rash-details-card">
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:.45rem;border-bottom:1px solid var(--line);padding-bottom:.8rem">
            <div>
              <div class="srcline">${esc(activeRash.altName || 'Choroba osutkowa')}</div>
              <h3 style="margin:.15rem 0 .2rem;font-size:1.25rem;color:var(--ink)">${esc(activeRash.name)}</h3>
              <div class="muted" style="font-size:.82rem"><b>Etiologia:</b> ${esc(activeRash.etiology)}</div>
            </div>
            <span class="chip" style="background:var(--teal-l);color:var(--teal-d);border:0;font-weight:700">Wylęganie: ${esc(activeRash.incubation)}</span>
          </div>

          <!-- Sekcje wiedzy -->
          <div class="rash-info-sections">
            <!-- 1. Zwiastuny -->
            <div class="rash-info-row">
              <span class="rash-info-label">🤒 Zwiastuny (prodrom):</span>
              <span>${esc(activeRash.prodrome)}</span>
            </div>

            <!-- 2. Morfologia i dynamika -->
            <div class="rash-info-row">
              <span class="rash-info-label">🎨 Morfologia wykwitów:</span>
              <span><b>${esc(activeRash.rashType)}</b></span>
            </div>

            <div class="rash-info-row">
              <span class="rash-info-label">📍 Kierunek i kolejność siewu:</span>
              <span>${esc(activeRash.spread)}</span>
            </div>

            <div class="rash-info-row">
              <span class="rash-info-label">⏳ Ewolucja i zejście:</span>
              <span>${esc(activeRash.evolution)}</span>
            </div>

            <!-- 3. Objaw patognomoniczny -->
            <div class="rash-info-row" style="background:var(--surface-2);padding:.6rem .8rem;border-radius:8px;border:1px solid rgba(12,122,133,0.24)">
              <span class="rash-info-label" style="color:var(--teal-d)">⭐ Objaw patognomoniczny:</span>
              <span style="font-weight:700">${esc(activeRash.pathognomonic)}</span>
            </div>

            <!-- 4. Powikłania -->
            <div class="rash-info-row">
              <span class="rash-info-label" style="color:var(--red)">⚠️ Groźne powikłania:</span>
              <span>${esc(activeRash.complications)}</span>
            </div>

            <!-- 5. Leczenie i izolacja -->
            <div class="rash-info-row">
              <span class="rash-info-label">💊 Leczenie 1. rzutu:</span>
              <span>${esc(activeRash.treatment)}</span>
            </div>

            <div class="rash-info-row">
              <span class="rash-info-label">🛡️ Izolacja i Sanepid:</span>
              <span>${esc(activeRash.isolation)}</span>
            </div>
          </div>

          <!-- Złota perła -->
          <div class="rash-pearl-box">
            <strong>💡 Perła egzaminacyjna:</strong> ${esc(activeRash.pearl)}
          </div>
        </div>
      </div>
    </div>`;
  };

  const renderRashMatrix = rState => {
    const list = PEDIATRIC_RASH_DATABASE || [];
    const filter = rState.matrixFilter || 'all';

    let filtered = list;
    if (filter === 'non_blanching') filtered = list.filter(r => r.glassTest === 'non_blanching');
    else if (filter === 'vesicular') filtered = list.filter(r => r.glassTest === 'vesicle');
    else if (filter === 'descending') filtered = list.filter(r => ['odra', 'rozyczka'].includes(r.id));
    else if (filter === 'post_fever') filtered = list.filter(r => r.id === 'rumien_nagly');
    else if (filter === 'palms_soles') filtered = list.filter(r => ['plonica', 'hfmd', 'kawasaki', 'odra'].includes(r.id));
    else if (filter === 'sanepid') filtered = list.filter(r => ['odra', 'meningokokemia'].includes(r.id));

    const selectedIds = rState.selectedForCompare || ['odra', 'plonica'];
    const compared = list.filter(r => selectedIds.includes(r.id));

    return `<div class="rash-matrix-wrap">
      <div style="margin-bottom:1rem">
        <h3 style="margin:0 0 .3rem;font-size:1.15rem">Porównanie różnicowe osutek dziecięcych</h3>
        <p class="lead" style="font-size:.88rem;margin:0">Filtruj wg cech lub wybierz od 2 do 3 chorób do szczegółowego zestawienia Side-by-Side.</p>
      </div>

      <!-- Filtry cech klinicznych -->
      <div class="rash-matrix-filters">
        <button class="calc-pill ${filter === 'all' ? 'active' : ''}" data-rfilter="all">Wszystkie (10)</button>
        <button class="calc-pill ${filter === 'non_blanching' ? 'active' : ''}" data-rfilter="non_blanching">🚨 Nieblednące (Plamica/Posocznica)</button>
        <button class="calc-pill ${filter === 'vesicular' ? 'active' : ''}" data-rfilter="vesicular">💧 Pęcherzykowe (Ospa/HFMD)</button>
        <button class="calc-pill ${filter === 'descending' ? 'active' : ''}" data-rfilter="descending">⬇️ Zstępujące od głowy (Odra/Różyczka)</button>
        <button class="calc-pill ${filter === 'post_fever' ? 'active' : ''}" data-rfilter="post_fever">🌡️ Po spadku gorączki (Rumień nagły)</button>
        <button class="calc-pill ${filter === 'palms_soles' ? 'active' : ''}" data-rfilter="palms_soles">✋ Dłonie i stopy</button>
        <button class="calc-pill ${filter === 'sanepid' ? 'active' : ''}" data-rfilter="sanepid">📋 Pilny Sanepid</button>
      </div>

      <!-- Wybór chorób do porównania -->
      <div class="rash-compare-picker">
        <span class="srcline" style="font-weight:700">Wybierz 2–3 choroby do porównania Side-by-Side:</span>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.4rem">
          ${list.map(r => {
            const isChecked = selectedIds.includes(r.id);
            return `<button class="calc-pill ${isChecked ? 'active' : ''}" data-rcompare-toggle="${r.id}">
              ${isChecked ? '✓ ' : ''}${esc(r.name.split('/')[0])}
            </button>`;
          }).join('')}
        </div>
      </div>

      <!-- Tabela Side-by-Side -->
      <div class="rash-matrix-table-wrap">
        <table class="rash-matrix-table">
          <thead>
            <tr>
              <th style="min-width:140px">Cecha kliniczna</th>
              ${compared.map(r => `
                <th style="min-width:220px;text-align:left">
                  <div style="font-weight:800;font-size:.95rem;color:var(--ink)">${esc(r.name)}</div>
                  <span class="chip" style="font-size:.7rem;margin-top:.2rem">${esc(r.etiology.split('(')[0])}</span>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="feature-col">Zwiastuny & Gorączka</td>
              ${compared.map(r => `<td>${esc(r.prodrome)}</td>`).join('')}
            </tr>
            <tr>
              <td class="feature-col">Morfologia wykwitu</td>
              ${compared.map(r => `<td><b>${esc(r.rashType)}</b></td>`).join('')}
            </tr>
            <tr>
              <td class="feature-col">Kolejność siewu</td>
              ${compared.map(r => `<td>${esc(r.spread)}</td>`).join('')}
            </tr>
            <tr>
              <td class="feature-col">Test szklankowy</td>
              ${compared.map(r => `<td>
                <span class="chip ${r.glassTest === 'non_blanching' ? 'm' : ''}" style="background:${r.glassTest === 'non_blanching' ? 'var(--red-l)' : (r.glassTest === 'vesicle' ? 'var(--blue-l)' : 'var(--green-l)')};color:${r.glassTest === 'non_blanching' ? 'var(--red)' : (r.glassTest === 'vesicle' ? 'var(--blue-d)' : 'var(--green-d)')};font-weight:800">
                  ${r.glassTest === 'non_blanching' ? 'NIE BLEDNIE' : (r.glassTest === 'vesicle' ? 'Pęcherzyki' : 'Blednie')}
                </span>
                <div class="srcline" style="margin-top:.2rem">${esc(r.glassTestNote)}</div>
              </td>`).join('')}
            </tr>
            <tr>
              <td class="feature-col">Objaw patognomoniczny</td>
              ${compared.map(r => `<td style="font-weight:700;color:var(--teal-d)">${esc(r.pathognomonic)}</td>`).join('')}
            </tr>
            <tr>
              <td class="feature-col">Zejście i łuszczenie</td>
              ${compared.map(r => `<td>${esc(r.evolution)}</td>`).join('')}
            </tr>
            <tr>
              <td class="feature-col">Groźne powikłanie</td>
              ${compared.map(r => `<td style="color:var(--red-d)">${esc(r.complications)}</td>`).join('')}
            </tr>
            <tr>
              <td class="feature-col">Leczenie & Izolacja</td>
              ${compared.map(r => `<td><b>${esc(r.treatment)}</b><div class="srcline" style="margin-top:.2rem">${esc(r.isolation)}</div></td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;
  };

  const renderRashPuzzles = rState => {
    const puzzles = RASH_PUZZLES || [];
    const pIdx = Math.max(0, Math.min(puzzles.length - 1, rState.puzzleIdx || 0));
    const puz = puzzles[pIdx] || puzzles[0];
    const stepNum = rState.puzzleStep || 1;
    const ans = (rState.puzzleAnswers && rState.puzzleAnswers[puz.id]) || {};

    const curStepObj = stepNum === 1 ? puz.step1 : puz.step2;
    const hasAns = ans[stepNum] !== undefined;

    return `<div class="rash-puzzles-wrap">
      <div style="margin-bottom:1rem">
        <h3 style="margin:0 0 .2rem;font-size:1.15rem">Trening Diagnostyczny: 10 Zagadek Klinicznych</h3>
        <p class="lead" style="font-size:.88rem;margin:0">Przeanalizuj wywiad, zobacz rozkład osutki na sylwetce pacjenta i podejmij właściwą decyzję kliniczną krok po kroku.</p>
      </div>

      <!-- Pigułki zagadek -->
      <div class="rash-pills-row">
        ${puzzles.map((p, idx) => {
          const isSel = idx === pIdx;
          const isDone = (rState.puzzlesDone || []).includes(p.id);
          return `<button class="chal-pill-btn ${isSel ? 'active' : ''} ${isDone ? 'done' : ''}" data-rpuz-sel="${idx}">
            <span class="chal-num">${idx + 1}</span>
            <span>Przypadek ${idx + 1}</span>
            ${isDone ? '<span class="chal-check">✓</span>' : ''}
          </button>`;
        }).join('')}
      </div>

      <!-- Karta aktywnej zagadki -->
      <div class="rash-puzzle-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.8rem;border-bottom:1px solid var(--line);padding-bottom:.8rem">
          <div>
            <span class="chip" style="background:var(--teal-l);color:var(--teal-d);font-weight:800">Przypadek ${pIdx + 1} z ${puzzles.length}</span>
            <h3 style="margin:.3rem 0 .2rem;font-size:1.15rem">${esc(puz.title)}</h3>
          </div>
          <div class="srcline" style="font-weight:700">Krok ${stepNum} z 2</div>
        </div>

        <div class="rash-puzzle-body-grid">
          <!-- Mini sylwetka pacjenta -->
          <div class="rash-puzzle-svg-box">
            <div style="font-size:.78rem;font-weight:800;color:var(--muted);text-transform:uppercase;margin-bottom:.4rem">Rozkład wykwitów u pacjenta:</div>
            <div style="max-width:240px;margin:0 auto">
              ${getRashSvgOverlay(puz.rashId, false)}
            </div>
          </div>

          <!-- Opis i pytania -->
          <div class="rash-puzzle-content-box">
            <div class="rash-puzzle-vignette">
              <strong style="color:var(--teal-d)">📋 Wywiad i badanie fizykalne:</strong>
              <p style="margin:.3rem 0 0;font-size:.9rem;line-height:1.5">${esc(puz.vignette)}</p>
            </div>

            <!-- Pytanie bieżącego kroku -->
            <div style="margin-top:1rem">
              <div style="font-weight:800;font-size:.95rem;color:var(--ink);margin-bottom:.6rem">
                ${stepNum === 1 ? 'Krok 1: Rozpoznanie' : 'Krok 2: Postępowanie i wytyczne'} – ${esc(curStepObj.q)}
              </div>
              <div class="chal-options-stack">
                ${curStepObj.opts.map((opt, optIdx) => {
                  let optClass = 'chal-opt-btn';
                  if (hasAns) {
                    if (optIdx === curStepObj.correct) optClass += ' correct';
                    else if (optIdx === ans[stepNum]) optClass += ' wrong';
                    else optClass += ' disabled';
                  }
                  return `<button class="${optClass}" ${hasAns ? 'disabled' : `data-rpuz-opt="${optIdx}"`}>
                    <span class="chal-opt-letter">${String.fromCharCode(65 + optIdx)}.</span>
                    <span>${esc(opt)}</span>
                  </button>`;
                }).join('')}
              </div>
            </div>

            <!-- Feedback po odpowiedzi -->
            ${hasAns ? `
            <div class="chal-explanation-box ${ans[stepNum] === curStepObj.correct ? 'ok' : 'err'}">
              <div style="font-weight:800;margin-bottom:.25rem">
                ${ans[stepNum] === curStepObj.correct ? '✅ Doskonale! Prawidłowa odpowiedź' : '❌ Pomyłka kliniczna'}
              </div>
              <p style="margin:0;font-size:.88rem;line-height:1.45">${esc(curStepObj.explanation)}</p>
            </div>

            <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.6rem">
              ${ans[stepNum] === curStepObj.correct ? `
                ${stepNum === 1 ? `
                  <button class="btn pri" id="btnRashPuzNextStep">Przejdź do Kroku 2 (Postępowanie) →</button>
                ` : `
                  <div class="chal-congrats-banner">
                    <div style="font-weight:800;color:var(--green-d)">🎉 Gratulacje! Przypadek rozwiązany bezbłędnie!</div>
                    <div class="chal-pearl-box">
                      <strong>⭐ Złota Perła Egzaminacyjna:</strong> ${esc(puz.pearl)}
                    </div>
                  </div>
                  <button class="btn pri" id="btnRashPuzNextCase">Przejdź do kolejnego przypadku →</button>
                `}
              ` : `
                <button class="btn sec" id="btnRashPuzRetryStep">↺ Spróbuj ponownie ten krok</button>
              `}
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>`;
  };

  /* Mini-Quiz */
  const renderLabQuiz = () => {
    return `<div id="labQuizBox">
      <div style="font-weight:800;font-size:1.05rem;margin-bottom:.4rem" id="lqQuestion">
        Zagadka 1: 3-letni chłopiec z gorączką 39.5°C, sztywnością karku i wybroczynami na podudziach. Wynik PMR: cytoza 3200/µl (88% neutrofili), białko 240 mg/dl, glukoza 12 mg/dl (glikemia 90 mg/dl). Jakie jest prawidłowe natychmiastowe postępowanie?
      </div>
      <div class="opts" id="lqOpts" style="margin:1rem 0">
        <button class="opt" data-qans="1"><span class="l">A</span><span>Ceftriakson i.v. + Wankomycyna + Deksametazon (przed lub z 1. dawką antybiotyku)</span></button>
        <button class="opt" data-qans="2"><span class="l">B</span><span>Acyklowir i.v. w dawce 500 mg/m2 co 8h</span></button>
        <button class="opt" data-qans="3"><span class="l">C</span><span>Oczekiwanie na wynik posiewu i leczenie objawowe</span></button>
      </div>
      <div id="lqFeedback"></div>
    </div>`;
  };

  const updatePMRCalc = () => {
    const cyt = +($('#pmrCytoza') || {}).value || 0;
    const neut = +($('#pmrNeutro') || {}).value || 0;
    const prot = +($('#pmrProtein') || {}).value || 0;
    const glc = +($('#pmrGlc') || {}).value || 0;
    const sGlc = +($('#pmrSerumGlc') || {}).value || 100;
    const ratio = Math.round((glc / sGlc) * 100) / 100;

    let title = 'Płyn mózgowo-rdzeniowy w normie';
    let color = 'var(--green)';
    let bg = 'var(--green-l)';
    let desc = 'Parametry mieszczą się w granicach normy pediatrycznej.';

    if (cyt > 500 && neut > 60 && ratio < 0.4) {
      title = '🚨 Obraz typowy dla bakteryjnego (ropnego) ZOMR';
      color = 'var(--red)';
      bg = 'var(--red-l)';
      desc = `Wysoka pleocytoza z przewagą neutrofilów (${neut}%), podwyższone białko (${prot} mg/dl) i drastyczny spadek glukozy (wskaźnik PMR/krew = ${ratio} < 0.4). Wskazana natychmiastowa antybiotykoterapia empiryczna (Ceftriakson + Wankomycyna) oraz Deksametazon przed pierwszą dawką.`;
    } else if (cyt >= 10 && neut < 50 && ratio >= 0.5) {
      title = '⚠️ Obraz aseptycznego / wirusowego ZOMR';
      color = 'var(--amber)';
      bg = 'var(--amber-l)';
      desc = `Umiarkowana pleocytoza z przewagą limfocytów, umiarkowanie podwyższone białko (${prot} mg/dl) i prawidłowa glukoza (wskaźnik PMR/krew = ${ratio} ≥ 0.5). Najczęstsza etiologia: enterowirusy. W razie podejrzenia HSV włącz Acyklowir.`;
    } else if (cyt >= 50 && prot > 200 && ratio < 0.3) {
      title = '⚠️ Podejrzenie gruźliczego ZOMR';
      color = 'var(--violet)';
      bg = 'var(--violet-l)';
      desc = `Pleocytoza limfocytarna z bardzo wysokim stężeniem białka (${prot} mg/dl) i znaczną hipoglikorrachią (${ratio}). Może wystąpić siateczka włóknikowa po odstaniu płynu.`;
    }

    const box = $('#pmrVerdict');
    if (box) {
      box.innerHTML = `<div class="lab-verdict-banner" style="background:${bg};border:1.5px solid ${color}">
        <span class="lab-verdict-title" style="color:${color}">${title}</span>
        <div style="font-weight:700;font-size:.88rem">Wskaźnik glukozy PMR / Surowica: <b>${ratio}</b> (norma > 0.6)</div>
        <p class="srcline" style="color:var(--ink)">${desc}</p>
      </div>`;
    }
  };

  const updateGasCalc = () => {
    const ph = +($('#gasPh') || {}).value || 7.4;
    const pco2 = +($('#gasPco2') || {}).value || 40;
    const hco3 = +($('#gasHco3') || {}).value || 24;
    const na = +($('#gasNa') || {}).value || 140;
    const cl = +($('#gasCl') || {}).value || 100;

    const ag = Math.round((na - (cl + hco3)) * 10) / 10;
    let state = 'Prawidłowa równowaga kwasowo-zasadowa';
    let color = 'var(--green)';
    let bg = 'var(--green-l)';
    let detail = '';

    if (ph < 7.35) {
      if (hco3 < 22 && pco2 <= 40) {
        state = ag > 16 ? '🚨 Kwasica metaboliczna z wysoką luką anionową (HAGMA)' : '⚠️ Kwasica metaboliczna z prawidłową luką (NAGMA)';
        color = 'var(--red)'; bg = 'var(--red-l)';
        detail = ag > 16
          ? `Luka anionowa AG = ${ag} mmol/l (norma 8–16). Przyczyny HAGMA: Cukrzycowa kwasica ketonowa (DKA), kwasica mleczanowa we wstrząsie, mocznica w AKI, zatrucia.`
          : `Luka anionowa AG = ${ag} mmol/l (prawidłowa). Przyczyny NAGMA: Utrata wodorowęglanów przez przewód pokarmowy (ciężka biegunka), nerkowa kwasica cewkowa (RTA).`;
      } else if (pco2 > 45) {
        state = '🚨 Kwasica oddechowa (retencja CO2)';
        color = 'var(--red)'; bg = 'var(--red-l)';
        detail = `Hipowentylacja, ciężkie zaostrzenie astmy, ciało obce, zmęczenie mięśni oddechowych. Wymaga pilnej oceny drożności dróg oddechowych!`;
      }
    } else if (ph > 7.45) {
      if (hco3 > 26) {
        state = '⚠️ Zasadowica metaboliczna (np. wymioty kwaśną treścią)';
        color = 'var(--amber)'; bg = 'var(--amber-l)';
        detail = `Utrata jonów H+ i Cl- (np. w przeroście odźwiernika u niemowlęcia). Towarzyszy jej hipochloremia i hipokaliemia.`;
      } else if (pco2 < 35) {
        state = 'Zasadowica oddechowa (hiperwentylacja)';
        color = 'var(--blue)'; bg = 'var(--blue-l)';
        detail = `Hiperwentylacja psychogenna, wczesny wstrząs septyczny, ból, hipoksja.`;
      }
    }

    const box = $('#gasVerdict');
    if (box) {
      box.innerHTML = `<div class="lab-verdict-banner" style="background:${bg};border:1.5px solid ${color}">
        <span class="lab-verdict-title" style="color:${color}">${state}</span>
        <div style="font-weight:700;font-size:.9rem">Luka anionowa (Anion Gap): <b>${ag} mmol/l</b> [Wzór: Na - (Cl + HCO3)]</div>
        <p class="srcline" style="color:var(--ink)">${detail}</p>
      </div>`;
    }
  };

  const attachEvents = () => {
    // Zakładki
    $$('#diagTabNav button').forEach(b => {
      b.onclick = () => {
        DIAG_TAB = b.dataset.dtab;
        render();
      };
    });

    // Trenażer Badań Obrazowych (Imaging & EKG Trainer listeners)
    if (DIAG_TAB === 'imaging') {
      $$('[data-mod-filter]').forEach(b => {
        b.onclick = () => {
          IMAGING_MODALITY_FILTER = b.dataset.modFilter;
          render();
        };
      });

      $$('[data-case-id]').forEach(b => {
        b.onclick = () => {
          ACTIVE_IMAGING_CASE_ID = b.dataset.caseId;
          IMAGING_SHOW_HINT = false;
          IMAGING_LAST_FEEDBACK = null;
          render();
        };
      });

      const svgCanvas = $('#imagingSvgCanvas');
      if (svgCanvas) {
        const markHotspotHit = activeCase => {
          if (!IMAGING_PROGRESS[activeCase.id]) IMAGING_PROGRESS[activeCase.id] = {};
          IMAGING_PROGRESS[activeCase.id].hotspot = true;
          saveImagingProgress();
          IMAGING_LAST_FEEDBACK = { type: 'hit', text: `Zlokalizowano patologię: ${activeCase.hotspot.name}. Krok 2 (Decyzja kliniczna) został odblokowany!` };
          render();
        };
        const getActiveCase = () => {
          const cases = IMAGING_TRAINER_CASES || [];
          return cases.find(c => c.id === ACTIVE_IMAGING_CASE_ID) || cases[0];
        };
        svgCanvas.onclick = e => {
          const activeCase = getActiveCase();
          if (!activeCase) return;

          const rect = svgCanvas.getBoundingClientRect();
          const clickX = ((e.clientX - rect.left) / rect.width) * 320;
          const clickY = ((e.clientY - rect.top) / rect.height) * 220;
          const tx = activeCase.hotspot.targetX;
          const ty = activeCase.hotspot.targetY;
          const tr = activeCase.hotspot.radius;
          const dist = Math.sqrt((clickX - tx) ** 2 + (clickY - ty) ** 2);

          if (dist <= tr + 15 || e.target.closest('[data-hotspot-hit]')) {
            markHotspotHit(activeCase);
          } else {
            IMAGING_LAST_FEEDBACK = { type: 'miss', text: activeCase.hotspot.hint };
            render();
          }
        };
        svgCanvas.onkeydown = e => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          if (!e.target.closest('[data-hotspot-hit]')) return;
          e.preventDefault();
          const activeCase = getActiveCase();
          if (activeCase) markHotspotHit(activeCase);
        };
      }

      const btnHint = $('#btnImagingHint');
      if (btnHint) {
        btnHint.onclick = () => {
          IMAGING_SHOW_HINT = !IMAGING_SHOW_HINT;
          render();
        };
      }

      const btnSkip = $('#btnSkipToQuestion');
      if (btnSkip) {
        btnSkip.onclick = () => {
          const cases = IMAGING_TRAINER_CASES || [];
          const activeCase = cases.find(c => c.id === ACTIVE_IMAGING_CASE_ID) || cases[0];
          if (activeCase) {
            if (!IMAGING_PROGRESS[activeCase.id]) IMAGING_PROGRESS[activeCase.id] = {};
            IMAGING_PROGRESS[activeCase.id].hotspot = true;
            saveImagingProgress();
            render();
          }
        };
      }

      const btnReset = $('#btnResetImagingCase');
      if (btnReset) {
        btnReset.onclick = () => {
          const cases = IMAGING_TRAINER_CASES || [];
          const activeCase = cases.find(c => c.id === ACTIVE_IMAGING_CASE_ID) || cases[0];
          if (activeCase) {
            delete IMAGING_PROGRESS[activeCase.id];
            saveImagingProgress();
            IMAGING_SHOW_HINT = false;
            IMAGING_LAST_FEEDBACK = null;
            render();
          }
        };
      }

      $$('[data-img-opt]').forEach(b => {
        b.onclick = () => {
          const cases = IMAGING_TRAINER_CASES || [];
          const activeCase = cases.find(c => c.id === ACTIVE_IMAGING_CASE_ID) || cases[0];
          if (!activeCase) return;
          const optIdx = +b.dataset.imgOpt;
          const isCorrect = optIdx === activeCase.clinicalQuestion.correct;
          if (!IMAGING_PROGRESS[activeCase.id]) IMAGING_PROGRESS[activeCase.id] = { hotspot: true };
          IMAGING_PROGRESS[activeCase.id].selectedOpt = optIdx;
          if (isCorrect) {
            IMAGING_PROGRESS[activeCase.id].solved = true;
            saveImagingProgress();
          }
          render();
        };
      });

      ['btnNextImagingCase', 'btnNextImagingCase2'].forEach(id => {
        const btn = $('#' + id);
        if (btn) {
          btn.onclick = () => {
            const cases = IMAGING_TRAINER_CASES || [];
            const idx = cases.findIndex(c => c.id === ACTIVE_IMAGING_CASE_ID);
            const nextCase = cases[(idx + 1) % cases.length];
            ACTIVE_IMAGING_CASE_ID = nextCase.id;
            IMAGING_SHOW_HINT = false;
            IMAGING_LAST_FEEDBACK = null;
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };
        }
      });
    }

    // PMR listeners
    ['pmrCytoza', 'pmrNeutro', 'pmrProtein', 'pmrGlc', 'pmrSerumGlc'].forEach(id => {
      const el = $('#' + id);
      if (el) el.addEventListener('input', updatePMRCalc);
    });

    $$('[data-pmr-set]').forEach(b => {
      b.onclick = () => {
        const s = b.dataset.pmrSet;
        if (s === 'bact') { $('#pmrCytoza').value = 2400; $('#pmrNeutro').value = 88; $('#pmrProtein').value = 220; $('#pmrGlc').value = 16; $('#pmrSerumGlc').value = 95; }
        else if (s === 'viral') { $('#pmrCytoza').value = 140; $('#pmrNeutro').value = 25; $('#pmrProtein').value = 65; $('#pmrGlc').value = 58; $('#pmrSerumGlc').value = 95; }
        else if (s === 'tb') { $('#pmrCytoza').value = 350; $('#pmrNeutro').value = 20; $('#pmrProtein').value = 450; $('#pmrGlc').value = 20; $('#pmrSerumGlc').value = 95; }
        else if (s === 'norm') { $('#pmrCytoza').value = 2; $('#pmrNeutro').value = 0; $('#pmrProtein').value = 28; $('#pmrGlc').value = 60; $('#pmrSerumGlc').value = 95; }
        updatePMRCalc();
      };
    });

    // Gas listeners
    ['gasPh', 'gasPco2', 'gasHco3', 'gasNa', 'gasCl'].forEach(id => {
      const el = $('#' + id);
      if (el) el.addEventListener('input', updateGasCalc);
    });

    $$('[data-gas-set]').forEach(b => {
      b.onclick = () => {
        const s = b.dataset.gasSet;
        if (s === 'dka') { $('#gasPh').value = 7.15; $('#gasPco2').value = 24; $('#gasHco3').value = 8; $('#gasNa').value = 135; $('#gasCl').value = 98; }
        else if (s === 'diarrhea') { $('#gasPh').value = 7.28; $('#gasPco2').value = 30; $('#gasHco3').value = 14; $('#gasNa').value = 138; $('#gasCl').value = 112; }
        else if (s === 'asthma') { $('#gasPh').value = 7.22; $('#gasPco2').value = 62; $('#gasHco3').value = 25; $('#gasNa').value = 140; $('#gasCl').value = 101; }
        else if (s === 'pyloric') { $('#gasPh').value = 7.55; $('#gasPco2').value = 48; $('#gasHco3').value = 36; $('#gasNa').value = 134; $('#gasCl').value = 84; }
        updateGasCalc();
      };
    });

    // Quiz listener
    const quizOpts = $('#lqOpts');
    if (quizOpts) {
      quizOpts.onclick = e => {
        const b = e.target.closest('[data-qans]');
        if (!b) return;
        const ans = +b.dataset.qans;
        const fb = $('#lqFeedback');
        if (ans === 1) {
          fb.innerHTML = `<div class="card" style="background:var(--green-l);border-color:var(--green);margin-top:.8rem">
            <b style="color:var(--green)">✓ Brawo! Prawidłowa odpowiedź (A).</b>
            <p class="srcline" style="margin-top:.3rem">Obraz kliniczny i badanie PMR jednoznacznie wskazują na ropne zapalenie opon mózgowo-rdzeniowych (ZOMR). Leczeniem z wyboru jest Ceftriakson z Wankomycyną. Podanie Deksametazonu przed lub z pierwszą dawką antybiotyku zmniejsza ryzyko powikłań słuchowych i neurologicznych w zapaleniu pneumokokowym i Hib!</p>
          </div>`;
        } else {
          fb.innerHTML = `<div class="card" style="background:var(--red-l);border-color:var(--red);margin-top:.8rem">
            <b style="color:var(--red)">✗ Niestety to nie jest optymalna odpowiedź.</b>
            <p class="srcline" style="margin-top:.3rem">PMR wskazuje na ZOMR bakteryjne (cytoza neutrofilowa, drastyczny spadek glukozy). Prawidłową odpowiedzią jest natychmiastowy Ceftriakson + Wankomycyna + Deksametazon (opcja A).</p>
          </div>`;
        }
      };
    }

    if (DIAG_TAB === 'pmr') updatePMRCalc();
    if (DIAG_TAB === 'gas') updateGasCalc();

    // Obsługa Atlasu Osutek Dziecięcych
    if (DIAG_TAB === 'osutki') {
      $$('[data-rtab]').forEach(b => {
        b.onclick = () => {
          RASH_STATE.subTab = b.dataset.rtab;
          saveRashState();
          render();
        };
      });

      $$('[data-rash-id]').forEach(b => {
        b.onclick = () => {
          RASH_STATE.selectedId = b.dataset.rashId;
          RASH_STATE.glassTestActive = false;
          saveRashState();
          render();
        };
      });

      const glassBtn = $('#btnToggleGlassTest');
      if (glassBtn) {
        glassBtn.onclick = () => {
          RASH_STATE.glassTestActive = !RASH_STATE.glassTestActive;
          saveRashState();
          render();
        };
      }

      $$('[data-rfilter]').forEach(b => {
        b.onclick = () => {
          RASH_STATE.matrixFilter = b.dataset.rfilter;
          saveRashState();
          render();
        };
      });

      $$('[data-rcompare-toggle]').forEach(b => {
        b.onclick = () => {
          const rid = b.dataset.rcompareToggle;
          let sel = RASH_STATE.selectedForCompare || ['odra', 'plonica'];
          if (sel.includes(rid)) {
            if (sel.length > 2) sel = sel.filter(x => x !== rid);
            else toast('Wybierz co najmniej 2 choroby do porównania');
          } else {
            if (sel.length >= 3) sel = [sel[1], sel[2], rid];
            else sel.push(rid);
          }
          RASH_STATE.selectedForCompare = sel;
          saveRashState();
          render();
        };
      });

      $$('[data-rpuz-sel]').forEach(b => {
        b.onclick = () => {
          RASH_STATE.puzzleIdx = +b.dataset.rpuzSel;
          RASH_STATE.puzzleStep = 1;
          saveRashState();
          render();
        };
      });

      $$('[data-rpuz-opt]').forEach(b => {
        b.onclick = () => {
          const optIdx = +b.dataset.rpuzOpt;
          const puz = (RASH_PUZZLES || [])[RASH_STATE.puzzleIdx || 0];
          const stepNum = RASH_STATE.puzzleStep || 1;
          if (!RASH_STATE.puzzleAnswers) RASH_STATE.puzzleAnswers = {};
          if (!RASH_STATE.puzzleAnswers[puz.id]) RASH_STATE.puzzleAnswers[puz.id] = {};
          RASH_STATE.puzzleAnswers[puz.id][stepNum] = optIdx;

          const stepObj = stepNum === 1 ? puz.step1 : puz.step2;
          if (optIdx === stepObj.correct && stepNum === 2) {
            if (!RASH_STATE.puzzlesDone.includes(puz.id)) {
              RASH_STATE.puzzlesDone.push(puz.id);
            }
          }
          saveRashState();
          render();
        };
      });

      const puzNextStepBtn = $('#btnRashPuzNextStep');
      if (puzNextStepBtn) {
        puzNextStepBtn.onclick = () => {
          RASH_STATE.puzzleStep = 2;
          saveRashState();
          render();
        };
      }

      const puzRetryBtn = $('#btnRashPuzRetryStep');
      if (puzRetryBtn) {
        puzRetryBtn.onclick = () => {
          const puz = (RASH_PUZZLES || [])[RASH_STATE.puzzleIdx || 0];
          const sNum = RASH_STATE.puzzleStep || 1;
          if (RASH_STATE.puzzleAnswers && RASH_STATE.puzzleAnswers[puz.id]) {
            delete RASH_STATE.puzzleAnswers[puz.id][sNum];
            saveRashState();
            render();
          }
        };
      }

      const puzNextCaseBtn = $('#btnRashPuzNextCase');
      if (puzNextCaseBtn) {
        puzNextCaseBtn.onclick = () => {
          RASH_STATE.puzzleIdx = ((RASH_STATE.puzzleIdx || 0) + 1) % (RASH_PUZZLES || []).length;
          RASH_STATE.puzzleStep = 1;
          saveRashState();
          render();
        };
      }
    }
  };

  render();
}

    return { viewDiagnostics };
  };
})();
