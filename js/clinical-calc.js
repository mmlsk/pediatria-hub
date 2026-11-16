/* Pediatria V – moduł kliniczny: Kalkulator pediatryczny, płyny, antybiotyki, e-Recepty i skale */
(function () {
  'use strict';
  window.HUB_CLINICAL = window.HUB_CLINICAL || {};
  window.HUB_CLINICAL.calc = function (ctx) {
    const { PEDIATRIC_DRUG_DATABASE, PRESCRIPTION_CHALLENGES } = window.HUB_META;
    const { $, $$, main, esc, estimateWeightFromAge, getAgeFormulaHint, calcHollidaySegar, safeStorageSet, toast, getNotes, saveNotes } = ctx;

/* ---------- KALKULATOR PEDIATRYCZNY & STANY NAGŁE ---------- */
const CALC_KEY = 'pediatria_hub_calc_v1';
let CALC_STATE = {
  weight: 12.0,
  ageVal: 2,
  ageUnit: 'y', // 'y' | 'm'
  tab: 'nagle', // 'nagle' | 'plyny' | 'goraczka' | 'antybiotyki' | 'recepty' | 'skale'
  dehydr: 'mod', // 'mild' | 'mod' | 'sev'
  recepty: {
    mode: 'generator', // 'generator' | 'trening'
    cat: 'all',
    drugId: 'amoxicillin',
    indId: 'aom',
    formIdx: 0,
    days: 10,
    chalIdx: 0,
    chalStep: 1,
    chalAnswers: {},
    chalDone: []
  },
  pgcs: { eyes: 4, verbal: 5, motor: 6 },
  apgar: { hr: 2, resp: 2, tone: 2, reflex: 2, color: 2 },
  silverman: { chest: 0, ic: 0, xiph: 0, nares: 0, grunt: 0 }
};

try {
  const savedCalc = localStorage.getItem(CALC_KEY);
  if (savedCalc) {
    const parsed = JSON.parse(savedCalc);
    Object.assign(CALC_STATE, parsed);
    if (!CALC_STATE.recepty) {
      CALC_STATE.recepty = {
        mode: 'generator',
        cat: 'all',
        drugId: 'amoxicillin',
        indId: 'aom',
        formIdx: 0,
        days: 10,
        chalIdx: 0,
        chalStep: 1,
        chalAnswers: {},
        chalDone: []
      };
    }
    if (!CALC_STATE.recepty.chalAnswers) CALC_STATE.recepty.chalAnswers = {};
    if (!CALC_STATE.recepty.chalDone) CALC_STATE.recepty.chalDone = [];
  }
} catch (e) {}

function saveCalcState() {
  safeStorageSet(CALC_KEY, JSON.stringify(CALC_STATE));
}

function viewCalculator(parts, params) {
  if (params && params.tab && ['nagle', 'plyny', 'goraczka', 'antybiotyki', 'recepty', 'skale'].includes(params.tab)) {
    CALC_STATE.tab = params.tab;
  }
  if (params && params.w && !isNaN(+params.w)) {
    CALC_STATE.weight = Math.max(1, Math.min(100, +params.w));
  }
  if (params && params.lek && PEDIATRIC_DRUG_DATABASE && PEDIATRIC_DRUG_DATABASE.some(d => d.id === params.lek)) {
    CALC_STATE.recepty.drugId = params.lek;
    CALC_STATE.tab = 'recepty';
  }

  const render = () => {
    const w = CALC_STATE.weight;
    const tab = CALC_STATE.tab;

    main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:960px">
      <div class="eyebrow">Narzędzia kliniczne</div>
      <h2>Kalkulator dawek pediatrycznych & Stany nagłe</h2>
      <p class="lead">Przeliczaj dawki leków ratunkowych (PALS), płynoterapię odwodnienia (Holliday-Segar), syropy przeciwgorączkowe, antybiotyki oraz skale kliniczne w czasie rzeczywistym.</p>
      <p class="srcline" style="margin:-.8rem 0 1.2rem">⚠️ Narzędzie dydaktyczne — przed zastosowaniem u pacjenta zweryfikuj dawkę w ChPL i aktualnych wytycznych klinicznych.</p>

      <!-- Panel parametrów pacjenta -->
      <div class="calc-param-card">
        <div class="calc-param-grid">
          <!-- Masa ciała -->
          <div class="calc-field-group">
            <div style="display:flex;justify-content:space-between;align-items:baseline">
              <span class="muted" style="font-weight:800;font-size:.85rem;text-transform:uppercase;letter-spacing:.05em">Masa ciała pacjenta</span>
              <span class="srcline">Zakres: 1.0 – 100.0 kg</span>
            </div>
            <div class="calc-val-display">
              <span class="calc-val-number" id="calcWeightNum">${w.toFixed(1)}</span>
              <span style="font-weight:800;color:var(--muted);font-size:1.1rem">kg</span>
              <input type="number" id="calcWeightIn" min="1" max="100" step="0.5" value="${w}" style="width:80px;padding:.3rem .5rem;margin-left:auto;border:1.5px solid var(--line);border-radius:8px;font-weight:800;font-size:1.1rem;background:var(--bg);color:var(--ink);text-align:right">
            </div>
            <input type="range" class="calc-slider" id="calcWeightSlider" min="1" max="100" step="0.5" value="${w}">
            <div class="calc-quick-pills">
              <span class="muted" style="font-size:.74rem;align-self:center;font-weight:700;margin-right:.2rem">Szybki wybór:</span>
              <button class="calc-pill ${w === 3.5 ? 'active' : ''}" data-pw="3.5">3.5 kg (Noworodek)</button>
              <button class="calc-pill ${w === 8.0 ? 'active' : ''}" data-pw="8.0">8.0 kg (6 mż)</button>
              <button class="calc-pill ${w === 10.0 ? 'active' : ''}" data-pw="10.0">10 kg (1 rż)</button>
              <button class="calc-pill ${w === 12.0 ? 'active' : ''}" data-pw="12.0">12 kg (2 lata)</button>
              <button class="calc-pill ${w === 18.0 ? 'active' : ''}" data-pw="18.0">18 kg (5 lat)</button>
              <button class="calc-pill ${w === 25.0 ? 'active' : ''}" data-pw="25.0">25 kg (8 lat)</button>
              <button class="calc-pill ${w === 40.0 ? 'active' : ''}" data-pw="40.0">40 kg (12 lat)</button>
            </div>
          </div>

          <!-- Szacowanie z wieku -->
          <div class="calc-field-group calc-field-divider">
            <span class="muted" style="font-weight:800;font-size:.85rem;text-transform:uppercase;letter-spacing:.05em">Szacowanie wagi z wieku (APLS)</span>
            <div style="display:flex;align-items:center;gap:.6rem;margin-top:.4rem">
              <input type="number" id="calcAgeVal" min="0" max="18" value="${CALC_STATE.ageVal}" style="width:70px;padding:.4rem .6rem;border:1.5px solid var(--line);border-radius:8px;font-weight:800;background:var(--bg);color:var(--ink)">
              <select id="calcAgeUnit" style="padding:.45rem .6rem;border:1.5px solid var(--line);border-radius:8px;font-weight:700;background:var(--bg);color:var(--ink)">
                <option value="y" ${CALC_STATE.ageUnit === 'y' ? 'selected' : ''}>lat</option>
                <option value="m" ${CALC_STATE.ageUnit === 'm' ? 'selected' : ''}>miesięcy</option>
              </select>
              <button class="btn sec sm" id="btnApplyAgeEst" style="font-size:.82rem">Przelicz wagę</button>
            </div>
            <p class="srcline" id="calcAgeFormulaHint" style="margin-top:.4rem">
              Formuła: ${getAgeFormulaHint(CALC_STATE.ageVal, CALC_STATE.ageUnit)}
            </p>
            <div style="margin-top:.6rem">
              <button class="btn pri sm" id="btnExportToNotes" style="font-size:.82rem">📋 Kopiuj kartę dawek do Notatnika</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pasek zakładek -->
      <div class="calc-tab-nav" id="calcTabNav">
        <button class="calc-tab-btn ${tab === 'nagle' ? 'active' : ''}" data-tab="nagle">🚨 Stany nagłe (PALS)</button>
        <button class="calc-tab-btn ${tab === 'plyny' ? 'active' : ''}" data-tab="plyny">💧 Płynoterapia i Odwodnienie</button>
        <button class="calc-tab-btn ${tab === 'goraczka' ? 'active' : ''}" data-tab="goraczka">💊 Przeciwgorączkowe & Syropy</button>
        <button class="calc-tab-btn ${tab === 'antybiotyki' ? 'active' : ''}" data-tab="antybiotyki">🦠 Antybiotyki</button>
        <button class="calc-tab-btn ${tab === 'recepty' ? 'active' : ''}" data-tab="recepty">📝 Apteczka & Recepty</button>
        <button class="calc-tab-btn ${tab === 'skale' ? 'active' : ''}" data-tab="skale">📋 Skale kliniczne</button>
      </div>

      <!-- Treść wybranej zakładki -->
      <div id="calcTabContent">
        ${renderTabContent(tab, w)}
      </div>
    </div></section>`;

    attachEvents();
  };


  const renderTabContent = (tab, w) => {
    switch (tab) {
      case 'nagle': return renderTabEmergency(w);
      case 'plyny': return renderTabFluids(w);
      case 'goraczka': return renderTabAntipyretics(w);
      case 'antybiotyki': return renderTabAntibiotics(w);
      case 'recepty': return renderTabPrescriptions(w);
      case 'skale': return renderTabScales();
      default: return renderTabEmergency(w);
    }
  };

  /* Zakładka 1: Stany nagłe */
  const renderTabEmergency = w => {
    const adrCprDose = Math.min(1.0, Math.round((w * 0.01) * 100) / 100);
    const adrCprVol = Math.min(10.0, Math.round((w * 0.1) * 10) / 10);
    const adrAnaVol = Math.min(0.5, Math.max(0.05, Math.round((w * 0.01) * 100) / 100));
    const defibJ = Math.min(200, Math.round(w * 4));
    const cardioJ = Math.min(100, Math.round(w * 1));
    const amiodaronMg = Math.min(300, Math.round(w * 5));
    const atropinaMg = Math.min(0.5, Math.max(0.1, Math.round((w * 0.02) * 100) / 100));
    const bolusFluidMl = Math.round(w * 20);
    const midazolamBuccalMg = Math.min(10, Math.round((w * 0.25) * 10) / 10);
    const diazepamPrMg = Math.min(10, Math.round((w * 0.5) * 10) / 10);
    const dexaKrupMg = Math.min(8.0, Math.round((w * 0.15) * 10) / 10);
    const glucose10Ml = Math.round(w * 2.5);

    return `<div class="drug-grid">
      <!-- Adrenalina NZK -->
      <div class="drug-card" style="border-left:5px solid var(--red)">
        <div class="drug-header">
          <span class="drug-title">Adrenalina w NZK (1:10 000)</span>
          <span class="chip" style="background:var(--red-l);color:var(--red);border-color:var(--red)">PALS / NZK</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${adrCprDose} mg</div>
            <div class="drug-formula">Dawka: 0.01 mg/kg mc. i.v. / i.o.</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${adrCprVol} ml</div>
            <span class="srcline">roztwór 1:10 000 (0.1 mg/ml)</span>
          </div>
        </div>
        <p class="drug-notes">Podawaj co 3–5 min w asystolii/PEA lub po 3. defibrylacji w VF/pVT. Po każdej dawce podaj bolus 5 ml NaCl 0.9%.</p>
      </div>

      <!-- Adrenalina Anafilaksja -->
      <div class="drug-card" style="border-left:5px solid var(--amber)">
        <div class="drug-header">
          <span class="drug-title">Adrenalina w Anafilaksji (1:1000)</span>
          <span class="chip" style="background:var(--amber-l);color:var(--amber);border-color:var(--amber)">I rzut i.m.</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${adrAnaVol} mg</div>
            <div class="drug-formula">Dawka: 0.01 mg/kg mc. i.m. (max 0.3 / 0.5 mg)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${adrAnaVol} ml</div>
            <span class="srcline">roztwór 1:1000 (1 mg/ml nierozc.)</span>
          </div>
        </div>
        <p class="drug-notes">Wstrzyknij domięśniowo w przednio-boczną powierzchnię uda. W razie braku poprawy powtórz dawkę po 5–15 minutach.</p>
      </div>

      <!-- Defibrylacja i kardiowersja -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Energia defibrylacji i kardiowersji</span>
          <span class="chip">Elektroterapia</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${defibJ} J</div>
            <div class="drug-formula">Defibrylacja (VF/pVT): 4 J/kg mc.</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${cardioJ} J</div>
            <span class="srcline">Kardiowersja (SVT/VT): 1 J/kg mc.</span>
          </div>
        </div>
        <p class="drug-notes">Defibrylacja asynchroniczna (4 J/kg od pierwszego wyładowania). Kardiowersja zsynchronizowana (1 J/kg, kolejna 2 J/kg).</p>
      </div>

      <!-- Amiodaron -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Amiodaron (Cordarone)</span>
          <span class="chip">VF / pVT</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${amiodaronMg} mg</div>
            <div class="drug-formula">Dawka: 5 mg/kg mc. i.v. / i.o. (max 300 mg)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${(amiodaronMg / 50).toFixed(1)} ml</div>
            <span class="srcline">ampułka 150 mg / 3 ml (50 mg/ml)</span>
          </div>
        </div>
        <p class="drug-notes">Podaj w bolusie po 3. i po 5. nieskutecznym wyładowaniu defibrylatora.</p>
      </div>

      <!-- Bolus płynowy we wstrząsie -->
      <div class="drug-card" style="border-left:5px solid var(--blue)">
        <div class="drug-header">
          <span class="drug-title">Bolus płynowy we wstrząsie</span>
          <span class="chip" style="background:var(--blue-l);color:var(--blue);border-color:var(--blue)">Krystaloidy</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${bolusFluidMl} ml</div>
            <div class="drug-formula">Dawka: 20 ml/kg mc. w 10–20 min</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">Plasmalyte / NaCl 0.9%</div>
            <span class="srcline">we wstrząsie kardiogennym 5–10 ml/kg</span>
          </div>
        </div>
        <p class="drug-notes">Oceń wątrobę i płuca po każdym bolusie. W razie cech przewodnienia zatrzymaj płynoterapię i włącz inotropy.</p>
      </div>

      <!-- Midazolam w drgawkach -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Midazolam w drgawkach (Buccolam)</span>
          <span class="chip">Przeciwdrgawkowe</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${midazolamBuccalMg} mg</div>
            <div class="drug-formula">Policzkowo: 0.25 mg/kg (max 10 mg)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${(w * 0.1).toFixed(1)} mg i.v.</div>
            <span class="srcline">dożylnie: 0.1–0.15 mg/kg mc.</span>
          </div>
        </div>
        <p class="drug-notes">Buccolam gotowe dawki: 2.5 mg (3–12 mż), 5 mg (1–5 lat), 7.5 mg (5–10 lat), 10 mg (>10 lat).</p>
      </div>

      <!-- Diazepam w drgawkach -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Diazepam (Relsed / Relanium)</span>
          <span class="chip">Przeciwdrgawkowe</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${diazepamPrMg} mg p.r.</div>
            <div class="drug-formula">Doodbytniczo: 0.5 mg/kg (max 10 mg)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${w < 12 ? 'Wlewka 5 mg' : 'Wlewka 10 mg'}</div>
            <span class="srcline">i.v.: ${(w * 0.2).toFixed(1)} mg (0.2 mg/kg)</span>
          </div>
        </div>
        <p class="drug-notes">Wlewka doodbytnicza działa w 2–5 minut. Nie podawać diazepamu domięśniowo (nierówne wchłanianie).</p>
      </div>

      <!-- Deksametazon w krupie -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Deksametazon w zapaleniu krtani</span>
          <span class="chip">Krup / Podgłośniowe</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${dexaKrupMg} mg</div>
            <div class="drug-formula">Dawka: 0.15–0.6 mg/kg mc. (max 8–10 mg)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">p.o. / i.m. / i.v.</div>
            <span class="srcline">roztwór 4 mg/1 ml</span>
          </div>
        </div>
        <p class="drug-notes">Dawka 0.15 mg/kg p.o. jest równie skuteczna jak 0.6 mg/kg. W duszności spoczynkowej dołącz nebulizację z adrenaliny 1:1000 (2–5 ml).</p>
      </div>

      <!-- Glukoza 10% -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Glukoza 10% w hipoglikemii</span>
          <span class="chip">Metaboliczne</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${glucose10Ml} ml</div>
            <div class="drug-formula">Dawka: 2–5 ml/kg mc. 10% Glukozy</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${(w * 0.25).toFixed(1)} g glukozy</div>
            <span class="srcline">bolus i.v. powoli</span>
          </div>
        </div>
        <p class="drug-notes">Podaj powoli dożylnie, skontroluj glikemię po 10 minutach. Następnie włącz wlew ciągły glukozy (GIR 4–8 mg/kg/min).</p>
      </div>
    </div>`;
  };

  /* Zakładka 2: Płynoterapia */
  const renderTabFluids = w => {
    const { dailyMl, hourlyMl, dropRateStandard, dropRateMicro } = calcHollidaySegar(w);

    // Deficyt odwodnienia
    const dStage = CALC_STATE.dehydr;
    const defPct = dStage === 'mild' ? 0.05 : dStage === 'mod' ? 0.08 : 0.10;
    const deficitMl = Math.round(w * defPct * 1000);
    const totalWithDeficit = dailyMl + deficitMl;
    const phase1Rate = Math.round(((deficitMl / 2) + (dailyMl / 3)) / 8);
    const phase2Rate = Math.round(((deficitMl / 2) + (dailyMl * 2 / 3)) / 16);

    return `<div>
      <!-- Holliday Segar -->
      <div class="card" style="margin-bottom:1.4rem">
        <div class="drug-header" style="margin-bottom:.8rem">
          <div>
            <h3 style="font-size:1.25rem">Zapotrzebowanie podstawowe (Holliday-Segar)</h3>
            <span class="muted" style="font-size:.85rem">Płyny bytowe u dzieci bez odwodnienia na 24 godziny.</span>
          </div>
          <span class="chip" style="background:var(--blue-l);color:var(--blue);border-color:var(--blue)">Norma dobowa</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.1rem">
          <div class="card" style="background:var(--bg)">
            <span class="muted" style="font-size:.78rem;font-weight:700">Objętość dobowa</span>
            <div class="drug-result-dose" style="font-size:2rem;margin-top:.2rem">${dailyMl} ml/24h</div>
          </div>
          <div class="card" style="background:var(--bg)">
            <span class="muted" style="font-size:.78rem;font-weight:700">Przepływ w pompie</span>
            <div class="drug-result-dose" style="font-size:2rem;margin-top:.2rem">${hourlyMl} ml/h</div>
          </div>
          <div class="card" style="background:var(--bg)">
            <span class="muted" style="font-size:.78rem;font-weight:700">Zwykły aparat (20 kr/ml)</span>
            <div class="drug-result-vol" style="font-size:1.6rem;margin-top:.2rem">${dropRateStandard} kr/min</div>
          </div>
          <div class="card" style="background:var(--bg)">
            <span class="muted" style="font-size:.78rem;font-weight:700">Mikrodrips (60 kr/ml)</span>
            <div class="drug-result-vol" style="font-size:1.6rem;margin-top:.2rem">${dropRateMicro} kr/min</div>
          </div>
        </div>

        <div class="calc-formula-box" style="background:var(--surface);border:1px solid var(--line-2);padding:.8rem;border-radius:8px;font-size:.84rem">
          <b>Zasada Holliday-Segar:</b> pierwsze 10 kg × 100 ml/kg (${Math.min(1000, w * 100)} ml) + kolejne 10 kg × 50 ml/kg (${w > 10 ? Math.min(500, (w - 10) * 50) : 0} ml) + każdy kg > 20 kg × 20 ml/kg (${w > 20 ? (w - 20) * 20 : 0} ml).
        </div>
      </div>

      <!-- Wyrównanie odwodnienia -->
      <div class="card">
        <div class="drug-header" style="margin-bottom:.8rem">
          <div>
            <h3 style="font-size:1.25rem">Wyrównanie odwodnienia i deficytu płynowego</h3>
            <span class="muted" style="font-size:.85rem">Obliczanie całkowitego zapotrzebowania (bytowe + uzupełnienie deficytu).</span>
          </div>
          <div class="seg" id="calcDehydrSeg">
            <button data-ds="mild" aria-pressed="${dStage === 'mild'}">Lekkie (5%)</button>
            <button data-ds="mod" aria-pressed="${dStage === 'mod'}">Umiarkowane (8%)</button>
            <button data-ds="sev" aria-pressed="${dStage === 'sev'}">Ciężkie (10%)</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.1rem">
          <div class="card" style="background:var(--bg)">
            <span class="muted" style="font-size:.78rem;font-weight:700">Szacowany deficyt płynowy</span>
            <div class="drug-result-dose" style="font-size:1.8rem;color:var(--amber);margin-top:.2rem">${deficitMl} ml</div>
            <span class="srcline">${(defPct * 100).toFixed(0)}% masy ciała (${Math.round(defPct * 1000)} ml/kg)</span>
          </div>
          <div class="card" style="background:var(--bg)">
            <span class="muted" style="font-size:.78rem;font-weight:700">Płyny na 24h (Bytowe + Deficyt)</span>
            <div class="drug-result-dose" style="font-size:1.8rem;color:var(--teal);margin-top:.2rem">${totalWithDeficit} ml</div>
            <span class="srcline">średnio ${Math.round(totalWithDeficit / 24)} ml/h</span>
          </div>
        </div>

        <h4 style="margin:1rem 0 .5rem;font-size:.95rem">Dwufazowy plan nawadniania dożylnego (przy braku wstrząsu):</h4>
        <div class="calc-two-col">
          <div class="card" style="background:var(--teal-xl);border-color:var(--teal)">
            <b>Faza I (pierwsze 8 godzin)</b>
            <div style="font-size:1.3rem;font-weight:800;color:var(--teal);margin:.3rem 0">${phase1Rate} ml / godzinę</div>
            <span class="srcline">Podaj 50% deficytu (${Math.round(deficitMl / 2)} ml) + 1/3 zapotrzebowania bytowego (${Math.round(dailyMl / 3)} ml).</span>
          </div>
          <div class="card" style="background:var(--surface)">
            <b>Faza II (kolejne 16 godzin)</b>
            <div style="font-size:1.3rem;font-weight:800;color:var(--ink);margin:.3rem 0">${phase2Rate} ml / godzinę</div>
            <span class="srcline">Podaj pozostałe 50% deficytu (${Math.round(deficitMl / 2)} ml) + 2/3 zapotrzebowania bytowego (${Math.round(dailyMl * 2 / 3)} ml).</span>
          </div>
        </div>

        <div class="card" style="margin-top:1.1rem;background:var(--bg)">
          <b>Nawadnianie doustne (DPN / ORS – I rzut w odwodnieniu lekkim i umiarkowanym):</b>
          <div style="font-size:1.05rem;font-weight:800;color:var(--ink);margin:.3rem 0">${Math.round(w * 50)} – ${Math.round(w * 100)} ml płynu nawadniającego w ciągu pierwszych 4 godzin.</div>
          <span class="srcline">Podawaj łyżeczką lub strzykawką: 5 ml co 1–2 minuty. Wymioty nie są przeciwwskazaniem – zrób 10 min przerwy i kontynuuj mniejszymi porcjami.</span>
        </div>
      </div>
    </div>`;
  };

  /* Zakładka 3: Przeciwgorączkowe */
  const renderTabAntipyretics = w => {
    // Paracetamol: 15 mg/kg, max 60-75 mg/kg/doba
    const parSingleMg = Math.min(1000, Math.round(w * 15));
    const parDailyMg = Math.min(4000, Math.round(w * 60));
    const parSyr120Ml = Math.round((parSingleMg / 24) * 10) / 10;
    const parSyr200Ml = Math.round((parSingleMg / 40) * 10) / 10;
    const parSyr250Ml = Math.round((parSingleMg / 50) * 10) / 10;

    // Najbliższy czopek paracetamolu
    const parCzopki = [50, 80, 125, 150, 250, 500];
    const bestParCzopek = parCzopki.reduce((prev, curr) => Math.abs(curr - parSingleMg) < Math.abs(prev - parSingleMg) ? curr : prev);

    // Ibuprofen: 10 mg/kg, max 30-40 mg/kg/doba
    const ibuSingleMg = Math.min(400, Math.round(w * 10));
    const ibuDailyMg = Math.min(1200, Math.round(w * 30));
    const ibuSyr100Ml = Math.round((ibuSingleMg / 20) * 10) / 10;
    const ibuSyr200Ml = Math.round((ibuSingleMg / 40) * 10) / 10;
    const ibuCzopki = [60, 125, 250];
    const bestIbuCzopek = ibuCzopki.reduce((prev, curr) => Math.abs(curr - ibuSingleMg) < Math.abs(prev - ibuSingleMg) ? curr : prev);

    return `<div class="calc-two-col">
      <!-- Paracetamol -->
      <div class="card" style="border-top:4px solid var(--teal)">
        <div class="drug-header">
          <div>
            <h3 style="font-size:1.3rem;color:var(--teal)">Paracetamol (od 1. dnia życia)</h3>
            <span class="muted" style="font-size:.82rem">Lek przeciwgorączkowy i przeciwbólowy I rzutu.</span>
          </div>
          <span class="chip" style="background:var(--teal-l);color:var(--teal)">15 mg/kg</span>
        </div>

        <div class="drug-result-box" style="margin:1rem 0">
          <div>
            <div class="drug-result-dose">${parSingleMg} mg</div>
            <div class="drug-formula">Dawka jednorazowa (co 4–6 godz.)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${parDailyMg} mg</div>
            <span class="srcline">Maksymalnie na dobę (60 mg/kg)</span>
          </div>
        </div>

        <h4 style="font-size:.9rem;margin-bottom:.5rem">Przeliczenie na syropy i zawiesiny:</h4>
        <div style="display:grid;gap:.4rem;font-size:.85rem;margin-bottom:1rem">
          <div class="calc-syrup-row">
            <b>Syrop standard (120 mg / 5 ml = 24 mg/ml)</b>
            <div style="font-weight:800;color:var(--teal);text-align:right">${parSyr120Ml} ml</div>
          </div>
          <div class="calc-syrup-row">
            <b>Syrop forte (200 mg / 5 ml = 40 mg/ml)</b>
            <div style="font-weight:800;color:var(--teal);text-align:right">${parSyr200Ml} ml</div>
          </div>
          <div class="calc-syrup-row">
            <b>Syrop koncentrat (250 mg / 5 ml = 50 mg/ml)</b>
            <div style="font-weight:800;color:var(--teal);text-align:right">${parSyr250Ml} ml</div>
          </div>
          <div class="calc-syrup-row">
            <b>Rekomendowany czopek doodbytniczy:</b>
            <div style="font-weight:800;color:var(--ink);text-align:right">${bestParCzopek} mg</div>
          </div>
        </div>

        <p class="drug-notes">Paracetamol podawaj co 4–6 godzin (maksymalnie 4–5 razy na dobę). Przy podaniu doodbytniczym wchłanianie jest wolniejsze i mniej przewidywalne (dawka czopka może wynosić do 20 mg/kg).</p>
      </div>

      <!-- Ibuprofen -->
      <div class="card" style="border-top:4px solid var(--amber)">
        <div class="drug-header">
          <div>
            <h3 style="font-size:1.3rem;color:var(--amber)">Ibuprofen (> 3. miesiąca życia)</h3>
            <span class="muted" style="font-size:.82rem">Działanie przeciwgorączkowe, przeciwbólowe i przeciwzapalne.</span>
          </div>
          <span class="chip" style="background:var(--amber-l);color:var(--amber)">10 mg/kg</span>
        </div>

        <div class="drug-result-box" style="margin:1rem 0">
          <div>
            <div class="drug-result-dose" style="color:var(--amber)">${ibuSingleMg} mg</div>
            <div class="drug-formula">Dawka jednorazowa (co 6–8 godz.)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${ibuDailyMg} mg</div>
            <span class="srcline">Maksymalnie na dobę (30 mg/kg)</span>
          </div>
        </div>

        <h4 style="font-size:.9rem;margin-bottom:.5rem">Przeliczenie na syropy i zawiesiny:</h4>
        <div style="display:grid;gap:.4rem;font-size:.85rem;margin-bottom:1rem">
          <div class="calc-syrup-row">
            <b>Syrop standard (100 mg / 5 ml = 20 mg/ml)</b>
            <div style="font-weight:800;color:var(--amber);text-align:right">${ibuSyr100Ml} ml</div>
          </div>
          <div class="calc-syrup-row">
            <b>Syrop forte (200 mg / 5 ml = 40 mg/ml)</b>
            <div style="font-weight:800;color:var(--amber);text-align:right">${ibuSyr200Ml} ml</div>
          </div>
          <div class="calc-syrup-row">
            <b>Rekomendowany czopek doodbytniczy:</b>
            <div style="font-weight:800;color:var(--ink);text-align:right">${bestIbuCzopek} mg</div>
          </div>
        </div>

        <div class="drug-alert" style="margin-bottom:.7rem">
          ⚠️ <b>Przeciwwskazania bezwzględne:</b> OSPA WIETRZNA (ryzyko martwiczego zapalenia powięzi i powikłań paciorkowcowych!) oraz CIĘŻKIE ODWODNIENIE (ryzyko nefrotoksyczności i ostrej niewydolności nerek AKI).
        </div>
        <p class="drug-notes">Podawaj co 6–8 godzin (maksymalnie 3 razy na dobę). Nie stosować u niemowląt poniżej 3. miesiąca życia ani o masie < 5 kg.</p>
      </div>
    </div>`;
  };

  /* Zakładka 4: Antybiotyki */
  const renderTabAntibiotics = w => {
    const amoxHighDaily = Math.min(3000, Math.round(w * 90));
    const amoxStdDaily = Math.min(2000, Math.round(w * 50));
    const cefuroxDaily = Math.min(1000, Math.round(w * 30));
    const azithroDaily = Math.min(500, Math.round(w * 10));
    const ceftriaxDaily = Math.min(4000, Math.round(w * 80));

    return `<div class="drug-grid">
      <!-- Amoksycylina wysoka dawka -->
      <div class="drug-card" style="border-left:5px solid var(--green)">
        <div class="drug-header">
          <span class="drug-title">Amoksycylina – wysoka dawka (AOM / Zapalenie płuc)</span>
          <span class="chip" style="background:var(--green-l);color:var(--green)">90 mg/kg/dobę</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose" style="color:var(--green)">${amoxHighDaily} mg / dobę</div>
            <div class="drug-formula">Dawka: 90 mg/kg mc./dobę (max 3000 mg)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${Math.round(amoxHighDaily / 2)} mg co 12h</div>
            <span class="srcline">lub ${Math.round(amoxHighDaily / 3)} mg co 8h</span>
          </div>
        </div>
        <p class="drug-notes">I rzut w ostrym zapaleniu ucha środkowego (AOM) i pozaszpitalnym zapaleniu płuc u dzieci. Przełamuje oporność pneumokoków. Zawiesina 400 mg / 5 ml: ${(amoxHighDaily / 80).toFixed(1)} ml na dobę.</p>
      </div>

      <!-- Amoksycylina dawka standardowa -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Amoksycylina – dawka standardowa</span>
          <span class="chip">50 mg/kg/dobę</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${amoxStdDaily} mg / dobę</div>
            <div class="drug-formula">Dawka: 50 mg/kg mc./dobę (max 2000 mg)</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${Math.round(amoxStdDaily / 2)} mg co 12h</div>
            <span class="srcline">lub ${Math.round(amoxStdDaily / 3)} mg co 8h</span>
          </div>
        </div>
        <p class="drug-notes">Stosowana w łagodnych zakażeniach dróg oddechowych. W anginie paciorkowcowej (S. pyogenes) lekiem I rzutu jest Fenoksymetylopenicylina (Ospen) przez 10 dni!</p>
      </div>

      <!-- Cefuroksym aksetyl -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Cefuroksym aksetyl (Zinnat)</span>
          <span class="chip">Cefalosporyna II gen.</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${cefuroxDaily} mg / dobę</div>
            <div class="drug-formula">Dawka: 30 mg/kg mc./dobę w 2 dawkach</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${Math.round(cefuroxDaily / 2)} mg co 12h</div>
            <span class="srcline">zawiesina 125 lub 250 mg/5 ml</span>
          </div>
        </div>
        <p class="drug-notes">ZUM, zakażenia dróg oddechowych w razie nadwrażliwości na penicyliny (bez anafilaksji). Podawać bezpośrednio po posiłku (zwiększa wchłanianie).</p>
      </div>

      <!-- Azytromycyna -->
      <div class="drug-card">
        <div class="drug-header">
          <span class="drug-title">Azytromycyna (Sumamed)</span>
          <span class="chip">Makrolid</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose">${azithroDaily} mg / dobę</div>
            <div class="drug-formula">Dawka: 10 mg/kg mc. raz na dobę przez 3 dni</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">${(azithroDaily / 40).toFixed(1)} ml</div>
            <span class="srcline">zawiesina 200 mg/5 ml (40 mg/ml)</span>
          </div>
        </div>
        <p class="drug-notes">Atypowe zapalenie płuc (Mycoplasma pneumoniae, Chlamydia pneumoniae), krztusiec. Podawać 1 raz na dobę na czczo (1h przed lub 2h po posiłku).</p>
      </div>

      <!-- Ceftriakson -->
      <div class="drug-card" style="border-left:5px solid var(--violet)">
        <div class="drug-header">
          <span class="drug-title">Ceftriakson (Biotrakson)</span>
          <span class="chip" style="background:var(--violet-l);color:var(--violet)">Cefalosporyna III gen.</span>
        </div>
        <div class="drug-result-box">
          <div>
            <div class="drug-result-dose" style="color:var(--violet)">${ceftriaxDaily} mg / dobę</div>
            <div class="drug-formula">Dawka: 50–100 mg/kg mc./dobę i.v.</div>
          </div>
          <div style="text-align:right">
            <div class="drug-result-vol">1 raz na dobę i.v.</div>
            <span class="srcline">max 4000 mg/dobę</span>
          </div>
        </div>
        <p class="drug-notes">Leczenie szpitalne: podejrzenie sepsy, neuroinfekcji (ZOMR), ciężkie odmiedniczkowe zapalenie nerek (PZN). Nie łączyć z roztworami wapnia.</p>
      </div>
    </div>`;
  };


  /* Zakładka 6: Apteczka Pediatryczna & Generator Recept */
  const PRESC_CATS = [
    { id: 'all', n: 'Wszystkie leki' },
    { id: 'oral_abx', n: 'Antybiotyki p.o. (zawiesiny)' },
    { id: 'antipyretic', n: 'Przeciwgorączkowe i p/bólowe' },
    { id: 'inhalation', n: 'Wziewne & Nebulizacje' },
    { id: 'systemic_steroid', n: 'Steroidy ogólne' },
    { id: 'hospital_iv', n: 'Leki szpitalne i.v.' },
    { id: 'rehydration', n: 'Płyny & ORS' },
    { id: 'emergency_sedation', n: 'Sedacja ratunkowa' }
  ];

  const renderTabPrescriptions = w => {
    const rState = CALC_STATE.recepty || {};
    const mode = rState.mode || 'generator';
    const completedCount = (rState.chalDone || []).length;
    const totalChallenges = (PRESCRIPTION_CHALLENGES || []).length;

    const subHtml = mode === 'generator'
      ? renderPrescriptionGenerator(w, rState)
      : renderPrescriptionChallenges(rState);

    return `<div class="presc-wrap">
      <div class="presc-mode-bar">
        <div class="presc-mode-toggle">
          <button class="presc-mode-btn ${mode === 'generator' ? 'active' : ''}" data-pmode="generator">
            📝 Praktyczny Generator e-Recept & Zleceń
          </button>
          <button class="presc-mode-btn ${mode === 'trening' ? 'active' : ''}" data-pmode="trening">
            🎯 Trening Recepturowy (10 Wyzwań Klinicznych)
            <span class="chip ${completedCount === totalChallenges ? 'm' : ''}" style="margin-left:.4rem;background:${completedCount === totalChallenges ? 'var(--green-l)' : 'var(--teal-l)'};color:${completedCount === totalChallenges ? 'var(--green-d)' : 'var(--teal-d)'};font-size:.74rem;padding:.15rem .5rem;border:0">
              ${completedCount}/${totalChallenges} zaliczone
            </span>
          </button>
        </div>
      </div>
      ${subHtml}
    </div>`;
  };

  const renderPrescriptionGenerator = (w, rState) => {
    const curCat = rState.cat || 'all';
    const filteredDrugs = curCat === 'all'
      ? PEDIATRIC_DRUG_DATABASE
      : PEDIATRIC_DRUG_DATABASE.filter(d => d.category === curCat);

    const activeDrug = PEDIATRIC_DRUG_DATABASE.find(d => d.id === rState.drugId) || filteredDrugs[0] || PEDIATRIC_DRUG_DATABASE[0];
    const indList = activeDrug.indications || [];
    const activeInd = indList.find(i => i.id === rState.indId) || indList[0] || {};
    const formsList = activeDrug.forms || [];
    const formIdx = Math.max(0, Math.min(formsList.length - 1, rState.formIdx || 0));
    const activeForm = formsList[formIdx] || formsList[0] || { name: 'standard', packSizes: [100] };
    const days = rState.days || activeInd.durationDays || 7;

    let singleDoseStr = '';
    let dailyDoseStr = '';
    let singleMl = null;
    let dailyMl = null;
    let totalMl = null;
    let packSize = activeForm && activeForm.packSizes ? activeForm.packSizes[activeForm.packSizes.length - 1] : 100;
    let packCount = 1;
    let rpText = '';
    let dsText = '';
    let isHospitalIV = activeDrug.category === 'hospital_iv';
    let hospitalOrder = null;

    if (activeDrug.id === 'penicillin_v') {
      const dailyUnits = Math.round(w * 100000);
      const singleUnits = Math.round(dailyUnits / 2);
      singleMl = Math.round((singleUnits / 150000) * 10) / 10;
      dailyMl = Math.round(singleMl * 2 * 10) / 10;
      totalMl = Math.round(dailyMl * days);
      packCount = Math.max(1, Math.ceil(totalMl / 100));
      singleDoseStr = `${singleUnits.toLocaleString('pl-PL')} j.m. (${singleMl} ml)`;
      dailyDoseStr = `${dailyUnits.toLocaleString('pl-PL')} j.m./dobę (${dailyMl} ml/doba)`;
      rpText = `${activeDrug.tradeNames[0]} (${activeDrug.name})\nzawiesina doustna ${activeForm.name}\nlag. ${packCount} a 100 ml`;
      dsText = `Doustnie ${singleMl} ml co 12 godzin (2 razy na dobę) przez pełne ${days} dni. Podawać 1 godzinę przed posiłkiem (na czczo). Przed każdym podaniem energicznie wstrząsnąć butelką. Po sporządzeniu przechowywać w lodówce (2–8°C) do 14 dni.`;
    } else if (activeDrug.category === 'oral_abx') {
      const mgKgDay = activeInd.doseMgPerKgDay || 90;
      const dosesPerDay = activeInd.dosesPerDay || 2;
      const intervalH = activeInd.intervalHours || 12;
      const dailyMg = Math.round(w * mgKgDay);
      const singleMg = Math.round(dailyMg / dosesPerDay);
      if (activeForm && activeForm.strengthMgPerMl) {
        singleMl = Math.round((singleMg / activeForm.strengthMgPerMl) * 10) / 10;
        dailyMl = Math.round(singleMl * dosesPerDay * 10) / 10;
        totalMl = Math.round(dailyMl * days);
        packSize = activeForm.packSizes ? activeForm.packSizes[activeForm.packSizes.length - 1] : 100;
        packCount = Math.max(1, Math.ceil(totalMl / packSize));
      }
      singleDoseStr = `${singleMg} mg ${singleMl ? '(' + singleMl + ' ml)' : ''}`;
      dailyDoseStr = `${dailyMg} mg/dobę ${dailyMl ? '(' + dailyMl + ' ml/doba)' : ''}`;
      rpText = `${activeDrug.tradeNames[0]} (${activeDrug.name})\n${activeForm.name}\nlag. ${packCount} a ${packSize} ml`;
      dsText = `Doustnie ${singleMl ? singleMl + ' ml' : singleMg + ' mg'} co ${intervalH} godzin (${dosesPerDay} razy na dobę) przez ${days} dni. Przed każdym podaniem energicznie wstrząsnąć butelką. Po sporządzeniu przechowywać w lodówce (2–8°C) do 14 dni.`;
    } else if (activeDrug.id === 'paracetamol') {
      const singleMg = Math.min(1000, Math.round(w * 15));
      const maxDailyMg = Math.min(4000, Math.round(w * 60));
      singleMl = (singleMg / (activeForm.strengthMgPerMl || 24)).toFixed(1);
      packSize = activeForm.packSizes ? activeForm.packSizes[activeForm.packSizes.length - 1] : 100;
      singleDoseStr = `${singleMg} mg (${singleMl} ml)`;
      dailyDoseStr = `Maksymalnie ${maxDailyMg} mg/dobę (do 4 dawek/dobę)`;
      rpText = `${activeDrug.tradeNames[0]} (${activeDrug.name})\n${activeForm.name}\nlag. 1 a ${packSize} ml`;
      dsText = `Doustnie ${singleMl} ml w razie gorączki >38.5°C lub silnego bólu, nie częściej niż co 4–6 godzin (maksymalnie 4 razy na dobę).`;
    } else if (activeDrug.id === 'ibuprofen') {
      const singleMg = Math.min(400, Math.round(w * 10));
      const maxDailyMg = Math.min(1200, Math.round(w * 30));
      singleMl = (singleMg / (activeForm.strengthMgPerMl || 20)).toFixed(1);
      packSize = activeForm.packSizes ? activeForm.packSizes[activeForm.packSizes.length - 1] : 100;
      singleDoseStr = `${singleMg} mg (${singleMl} ml)`;
      dailyDoseStr = `Maksymalnie ${maxDailyMg} mg/dobę (do 3–4 dawek/dobę)`;
      rpText = `${activeDrug.tradeNames[0]} (${activeDrug.name})\n${activeForm.name}\nlag. 1 a ${packSize} ml`;
      dsText = `Doustnie ${singleMl} ml w razie gorączki >38.5°C lub bólu, nie częściej niż co 6–8 godzin (maksymalnie 3–4 razy na dobę). Podawać w trakcie lub po posiłku.`;
    } else if (activeDrug.id === 'salbutamol') {
      const singleMg = Math.max(1.25, Math.min(2.5, Math.round(w * 0.15 * 100) / 100));
      singleDoseStr = `${singleMg} mg (0.15 mg/kg mc.)`;
      dailyDoseStr = `Doraźnie w napadzie duszności`;
      rpText = `Ventolin (Salbutamolum)\npłyn do nebulizacji 1 mg/ml lub aerozol wziewny 100 mcg\nlag. 1 op.`;
      dsText = `Do nebulizacji: ${singleMg} mg (tj. ${(singleMg).toFixed(1)} ml płynu 1 mg/ml) rozcieńczone w 2.0 ml 0.9% NaCl w nebulizatorze pneumatycznym w razie duszności wydechowej.`;
    } else if (activeDrug.id === 'budesonide') {
      const singleMg = activeInd.id === 'croup_alt' ? 2.0 : 0.5;
      singleDoseStr = `${singleMg} mg na inhalację`;
      dailyDoseStr = `${singleMg * 2} mg/dobę (co 12h)`;
      rpText = `Pulmicort (Budesonidum)\nzawiesina do nebulizacji ${activeForm.name}\nlag. 1 op. (20 ampułek)`;
      dsText = `Do nebulizacji: ${singleMg} mg (${activeForm.id === 'susp_05' ? (singleMg / 0.5 * 2) : (singleMg / 0.25 * 2)} ml) przez nebulizator pneumatyczny co 12 godzin przez ${days} dni. Po nebulizacji opłukać jamę ustną i przemyć twarz wodą.`;
    } else if (activeDrug.id === 'dexamethasone') {
      const singleMg = Math.min(8.0, Math.max(1.0, Math.round(w * 0.15 * 10) / 10));
      singleMl = (singleMg / 4).toFixed(1);
      singleDoseStr = `${singleMg} mg (${singleMl} ml z amp. 4 mg/ml)`;
      dailyDoseStr = activeInd.id === 'croup_oral' ? 'Jednorazowa dawka w krup' : `${(singleMg * 4).toFixed(1)} mg/dobę (co 6h)`;
      rpText = `Dexaven / Demezon (Dexamethasonum)\nroztwór do wstrzykiwań 4 mg/ml, amp. a 1 ml\nlag. 1 op. (10 amp.)`;
      dsText = `Doustnie lub i.m. jednorazowo ${singleMg} mg (${singleMl} ml z ampułki podane doustnie np. z odrobiną soku/syropu malinowego).`;
    } else if (activeDrug.id === 'ceftriaxone_iv') {
      isHospitalIV = true;
      const dailyMg = Math.min(4000, Math.round(w * (activeInd.doseMgPerKgDay || 100)));
      const dosesPerDay = activeInd.dosesPerDay || 1;
      const singleMg = Math.round(dailyMg / dosesPerDay);
      const dilMl = w < 20 ? 50 : 100;
      const rate = dilMl * 2;
      singleDoseStr = `${singleMg} mg`;
      dailyDoseStr = `${dailyMg} mg/dobę`;
      rpText = `Biotrakson (Ceftriaxonum)\nproszek do sporządzania roztworu do wstrzykiwań/infuzji 1000 mg\nlag. ${Math.ceil((dailyMg * days) / 1000)} fiol.`;
      dsText = `Podawać we wlewie dożylnym (i.v.): ${singleMg} mg rozpuszczone w ${dilMl} ml 0.9% NaCl w ciągu 30 minut co ${activeInd.intervalHours || 24}h przez ${days} dni.`;
      hospitalOrder = {
        drug: 'Ceftriakson i.v.',
        doseMg: singleMg + ' mg',
        diluent: `${dilMl} ml 0.9% NaCl (lub 5% glukozy)`,
        route: 'dożylnie (i.v.) – wlew kroplowy',
        time: '30 minut',
        rate: `${rate} ml/h w pompie infuzyjnej`,
        freq: dosesPerDay === 1 ? '1 raz na dobę (co 24h)' : '2 razy na dobę (co 12h)'
      };
    } else if (activeDrug.id === 'ors_rehydration') {
      const minMl = Math.round(w * 50);
      const maxMl = Math.round(w * 100);
      const stoolMl = Math.round(w * 10);
      singleDoseStr = `5–10 ml strzykawką co 1–2 minuty`;
      dailyDoseStr = `Faza nawadniania: ${minMl}–${maxMl} ml w ciągu 4 godzin`;
      rpText = `Acidolit / Gastrolit / Floractin elektrolity\nproszek w saszetkach do sporządzania roztworu doustnego\nlag. 1 op.`;
      dsText = `Rozpuścić 1 saszetkę w 200 ml przegotowanej, chłodnej wody. W ciągu pierwszych 4 godzin podać łącznie ${minMl}–${maxMl} ml małymi porcjami (łyżeczką/strzykawką co 1–2 minuty). Po każdym luźnym stolcu podać dodatkowo ${stoolMl} ml.`;
    } else if (activeDrug.id === 'maintenance_fluids') {
      isHospitalIV = true;
      let dailyFluids = 0;
      if (w <= 10) dailyFluids = w * 100;
      else if (w <= 20) dailyFluids = 1000 + (w - 10) * 50;
      else dailyFluids = 1500 + Math.min(60, w - 20) * 20;
      const rateMlH = Math.round(dailyFluids / 24);
      singleDoseStr = `${rateMlH} ml/godzinę w pompie infuzyjnej`;
      dailyDoseStr = `${dailyFluids} ml/dobę`;
      rpText = `Płyn infuzyjny izotoniczny (np. Sterofundin ISO / Plasmalyte / 0.9% NaCl + 5% Gluc 1:1)\nlag. ${Math.ceil(dailyFluids / 500)} a 500 ml`;
      dsText = `Ciągły wlew dożylny w pompie: ${rateMlH} ml/h. Uwaga: chlorek potasu (KCl) dodawać dopiero po potwierdzeniu diurezy!`;
      hospitalOrder = {
        drug: 'Płynoterapia podtrzymująca (Holliday-Segar)',
        doseMg: `${dailyFluids} ml / dobę`,
        diluent: 'Płyn zrównoważony izotoniczny (np. Sterofundin ISO)',
        route: 'dożylnie (i.v.)',
        time: 'wlew ciągły 24-godzinny',
        rate: `${rateMlH} ml/h`,
        freq: 'ciągły wlew dobowy'
      };
    } else if (activeDrug.id === 'midazolam') {
      const singleMg = Math.min(10.0, Math.max(1.0, Math.round(w * 0.25 * 10) / 10));
      singleDoseStr = `${singleMg} mg na błonę śluzową policzka`;
      dailyDoseStr = `Doraźnie w napadzie drgawek`;
      rpText = `Buccolam (Midazolamum)\nroztwór do stosowania w jamie ustnej 5 mg/ml\nlag. 1 op. (ampułko-strzykawka)`;
      dsText = `Doraźnie w napadzie drgawek trwającym >5 minut: podać powoli na błonę śluzową policzka (między dziąsło a policzek) ${singleMg} mg (${(singleMg / 5).toFixed(1)} ml). W razie braku ustąpienia po 10 min – wezwać pogotowie ratunkowe (112).`;
    }

    const parentAdviceText = `ZALECENIA LEKARSKIE DLA RODZICÓW:
Pacjent: Masa ciała ${w.toFixed(1)} kg | Wiek: ${CALC_STATE.ageVal} ${CALC_STATE.ageUnit === 'y' ? 'lat' : 'miesięcy'}
Lek: ${activeDrug.name} (${activeDrug.tradeNames.join(', ')})
Dawkowanie: ${dsText}

Wskazówki praktyczne:
1. Sposób podawania: Używaj dołączonej strzykawki doustnej z podziałką. Podawaj powoli do bocznego kącika ust (na policzek). Nigdy nie wstrzykuj leku wprost do gardła ze względu na ryzyko zakrztuszenia.
2. Posiłki: ${activeDrug.parentAdvice || 'Podawać z posiłkiem lub po posiłku.'}
3. Postępowanie w razie wymiotów:
   - Wymioty do 15 min od podania leku: podaj ponownie pełną dawkę.
   - Wymioty między 15 a 30 min: rozważ podanie połowy dawki.
   - Wymioty po upływie 30 min: lek wchłonął się w wystarczającym stopniu – nie powtarzaj dawki, zaczekaj do kolejnej planowej pory.
4. Przechowywanie: Po sporządzeniu zawiesiny przechowuj butelkę w lodówce (2–8°C), chroń przed światłem i dziećmi. Zużyj w ciągu maksymalnie 14 dni.`;

    const prescriptionCopyText = `Rp.\n${rpText}\nD.S. ${dsText}`;

    const hospitalOrderCopyText = hospitalOrder ? `KARTA ZLECEŃ LEKARSKICH (ODDZIAŁ PEDIATRYCZNY):
Data: ${new Date().toLocaleDateString('pl-PL')}
Pacjent: Masa ciała ${w.toFixed(1)} kg
Zlecenie:
Lek: ${hospitalOrder.drug}
Dawka jednorazowa: ${hospitalOrder.doseMg}
Rozcieńczenie: ${hospitalOrder.diluent}
Droga podania: ${hospitalOrder.route}
Czas wlewu: ${hospitalOrder.time}
Prędkość pompy: ${hospitalOrder.rate}
Częstotliwość: ${hospitalOrder.freq}
Uwagi: Obserwować tolerancję, wkłucie obwodowe, parametry życiowe.` : '';

    return `<!-- Filtr kategorii -->
    <div class="presc-cat-pills" role="tablist">
      ${PRESC_CATS.map(c => `<button class="presc-cat-pill ${curCat === c.id ? 'active' : ''}" data-presc-cat="${c.id}">${c.n}</button>`).join('')}
    </div>

    <!-- Siatka leków -->
    <div class="presc-drug-grid">
      ${filteredDrugs.map(d => {
        const isSel = d.id === activeDrug.id;
        return `<button class="presc-drug-btn ${isSel ? 'active' : ''}" data-presc-drug="${d.id}">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <strong style="font-size:.9rem;color:var(--ink)">${esc(d.name)}</strong>
            <span class="srcline" style="font-size:.68rem">${esc(d.defaultRoute)}</span>
          </div>
          <small class="muted" style="font-size:.73rem;margin-top:.2rem">${esc((d.tradeNames || []).slice(0, 3).join(', '))}</small>
        </button>`;
      }).join('')}
    </div>

    <!-- Główny obszar roboczy recepty (2 kolumny) -->
    <div class="presc-workspace-grid">
      <!-- Kolumna lewa: Konfiguracja leku i parametry dawkowania -->
      <div class="presc-config-card">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <div>
            <h3 style="margin:0 0 .2rem;font-size:1.15rem">${esc(activeDrug.name)}</h3>
            <div class="muted" style="font-size:.82rem">Nazwy handlowe: <b>${esc((activeDrug.tradeNames || []).join(', '))}</b></div>
          </div>
          <span class="chip" style="background:var(--teal-l);color:var(--teal-d);border:0">${esc(activeDrug.categoryName)}</span>
        </div>

        <!-- Wskazania -->
        <div style="margin-top:.9rem">
          <label class="muted" style="font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em">Wskazanie kliniczne & schemat:</label>
          <div style="display:flex;flex-direction:column;gap:.4rem;margin-top:.4rem">
            ${indList.map(ind => {
              const isIndSel = ind.id === activeInd.id;
              return `<button class="presc-ind-btn ${isIndSel ? 'active' : ''}" data-presc-ind="${ind.id}">
                <div style="font-weight:700">${esc(ind.name)}</div>
                <div class="srcline" style="font-size:.75rem;margin-top:.15rem">
                  ${ind.doseMgPerKgDay ? ind.doseMgPerKgDay + ' mg/kg/doba' : (ind.doseUnitsPerKgDay ? ind.doseUnitsPerKgDay.toLocaleString('pl-PL') + ' j.m./kg/d' : (ind.doseMgPerKgDose ? ind.doseMgPerKgDose + ' mg/kg/dawkę' : (ind.doseFormula || '')))}
                  ${ind.dosesPerDay ? ' · ' + ind.dosesPerDay + 'x na dobę (co ' + ind.intervalHours + 'h)' : ''}
                  ${ind.durationDays ? ' · ' + ind.durationDays + ' dni' : ''}
                </div>
              </button>`;
            }).join('')}
          </div>
          ${activeInd.note ? `<div class="presc-ind-note"><span style="font-weight:800;color:var(--teal-d)">💡 Wytyczne: </span>${esc(activeInd.note)}</div>` : ''}
        </div>

        <!-- Dostępne postaci / stężenia -->
        ${formsList.length > 1 ? `
        <div style="margin-top:.9rem">
          <label class="muted" style="font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em">Dostępna postać i stężenie:</label>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.4rem">
            ${formsList.map((f, fIdx) => `
              <button class="calc-pill ${fIdx === formIdx ? 'active' : ''}" data-presc-form="${fIdx}">${esc(f.name)}</button>
            `).join('')}
          </div>
        </div>` : ''}

        <!-- Czas trwania kuracji -->
        <div style="margin-top:.9rem;background:var(--surface);padding:.6rem .8rem;border-radius:8px;border:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.6rem">
          <div>
            <span class="muted" style="font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em">Czas trwania kuracji (dni):</span>
            <div style="display:flex;gap:.3rem;margin-top:.3rem">
              ${[3, 5, 7, 10, 14].map(d => `<button class="calc-pill ${days === d ? 'active' : ''}" data-presc-days="${d}">${d} dni</button>`).join('')}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:.4rem">
            <input type="number" id="prescDaysIn" min="1" max="30" value="${days}" style="width:60px;padding:.3rem .5rem;border:1.5px solid var(--line);border-radius:6px;font-weight:800;text-align:center">
            <span class="srcline">dni</span>
          </div>
        </div>

        <!-- Podsumowanie wyliczeń -->
        <div class="presc-calc-summary">
          <div class="presc-calc-row">
            <span class="muted">Dawka jednorazowa dla ${w.toFixed(1)} kg:</span>
            <strong style="color:var(--teal-d);font-size:1.05rem">${singleDoseStr}</strong>
          </div>
          <div class="presc-calc-row">
            <span class="muted">Dawka dobowa:</span>
            <strong>${dailyDoseStr}</strong>
          </div>
          ${totalMl ? `
          <div class="presc-calc-row" style="border-top:1px dashed var(--line);padding-top:.4rem;margin-top:.4rem">
            <span class="muted">Całkowita objętość kuracji (${days} dni):</span>
            <strong style="color:var(--ink)">${totalMl} ml</strong>
          </div>
          <div class="presc-calc-row">
            <span class="muted">Potrzebna liczba opakowań (${packSize} ml):</span>
            <strong style="color:var(--blue-d);font-size:1.05rem">${packCount} op. a ${packSize} ml</strong>
          </div>
          ${(totalMl > packSize && totalMl <= packSize * 1.25) ? `
          <div class="presc-alert-warning">
            ⚠️ <strong>Pułapka egzaminacyjna:</strong> Całkowite zapotrzebowanie wynosi ${totalMl} ml, czyli nieznacznie przekracza 1 butelkę (${packSize} ml). Wypisanie 1 opakowania spowoduje przedwczesne przerwanie leczenia! Bezwzględnie przepisz <strong>2 opakowania</strong>.
          </div>` : ''}
          ` : ''}
        </div>
      </div>

      <!-- Kolumna prawa: Blankiet e-Recepty, Zlecenia i Instrukcja -->
      <div class="presc-output-column">
        <!-- Visual Polish e-Recepta Card -->
        <div class="prescription-blankiet">
          <div class="prescription-header-bar">
            <span>🇵🇱 e-Recepta (NFZ / P)</span>
            <span>Masa: ${w.toFixed(1)} kg | Wiek: ${CALC_STATE.ageVal} ${CALC_STATE.ageUnit === 'y' ? 'lat' : 'm.'}</span>
          </div>
          <div class="prescription-rp-box">
            <div style="display:flex;align-items:flex-start">
              <span class="prescription-rp-symbol">Rp.</span>
              <div style="flex:1">
                <div style="font-weight:800;font-size:1.02rem;color:var(--ink)">${esc((activeDrug.tradeNames || [])[0] || activeDrug.name)}</div>
                <div class="srcline" style="font-size:.82rem">${esc(activeForm.name)}</div>
                <div style="font-weight:700;color:var(--teal-d);margin-top:.2rem">lag. ${packCount} a ${packSize ? packSize + ' ml' : 'op.'}</div>
              </div>
            </div>
          </div>
          <div class="prescription-ds-box">
            <div style="font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:.2rem">D.S. (Dawkowanie słowne):</div>
            <div>${esc(dsText)}</div>
          </div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.9rem">
            <button class="btn pri sm" id="btnCopyPrescription" data-copy-text="${esc(prescriptionCopyText)}">📋 Kopiuj e-Receptę (Rp. + D.S.)</button>
            <button class="btn sec sm" id="btnCopyParentAdvice" data-copy-text="${esc(parentAdviceText)}">👨‍👩‍👧 Kopiuj zalecenia dla rodziców</button>
          </div>
        </div>

        <!-- Karta Zleceń Szpitalnych (jeśli lek i.v.) -->
        ${hospitalOrder ? `
        <div class="hospital-order-card">
          <div class="hospital-order-header">
            <span>🏥 Karta Zleceń Lekarskich (i.v. / Pompa)</span>
            <span>Oddział Pediatryczny</span>
          </div>
          <div style="font-size:.86rem;display:flex;flex-direction:column;gap:.35rem">
            <div><span class="muted">Lek i dawka:</span> <b>${esc(hospitalOrder.drug)} ${esc(hospitalOrder.doseMg)}</b></div>
            <div><span class="muted">Rozcieńczenie:</span> ${esc(hospitalOrder.diluent)}</div>
            <div><span class="muted">Czas wlewu i pompa:</span> <b>${esc(hospitalOrder.time)} (${esc(hospitalOrder.rate)})</b></div>
            <div><span class="muted">Częstotliwość:</span> ${esc(hospitalOrder.freq)}</div>
          </div>
          <div style="margin-top:.8rem">
            <button class="btn sec sm" id="btnCopyHospitalOrder" data-copy-text="${esc(hospitalOrderCopyText)}">📋 Kopiuj Zlecenie Szpitalne</button>
          </div>
        </div>` : ''}

        <!-- Instrukcja dla rodziców -->
        <div class="parent-advice-box">
          <h4 style="margin:0 0 .4rem;font-size:.88rem;color:var(--ink)">👨‍👩‍👧 Instrukcja dla rodziców (Standard Bezpieczeństwa):</h4>
          <ul style="margin:0;padding-left:1.2rem;font-size:.82rem;line-height:1.45;color:var(--muted)">
            <li><strong>Podawanie:</strong> Zawsze dołączoną strzykawką doustną do kącika ust / na wewnętrzną stronę policzka. Nigdy prosto do gardła ze względu na ryzyko zachłyśnięcia!</li>
            <li><strong>Posiłki:</strong> ${esc(activeDrug.parentAdvice || 'Podawać z posiłkiem lub bezpośrednio po.')}</li>
            <li><strong>Wymioty po podaniu:</strong> do 15 min ➔ powtórz pełną dawkę; 15–30 min ➔ pół dawki; >30 min ➔ nie powtarzaj.</li>
            <li><strong>Przechowywanie:</strong> Zawiesinę po rozpuszczeniu przechowuj w lodówce (2–8°C), zużyj do 14 dni.</li>
          </ul>
        </div>

        <!-- Ostrzeżenie kliniczne -->
        ${activeDrug.warning ? `
        <div class="presc-warning-box">
          <span style="font-weight:800;color:var(--red)">⚠️ Ostrzeżenie kliniczne: </span>
          <span>${esc(activeDrug.warning)}</span>
        </div>` : ''}
      </div>
    </div>`;
  };

  const renderPrescriptionChallenges = rState => {
    const chalIdx = Math.max(0, Math.min(PRESCRIPTION_CHALLENGES.length - 1, rState.chalIdx || 0));
    const chal = PRESCRIPTION_CHALLENGES[chalIdx] || PRESCRIPTION_CHALLENGES[0];
    const curStep = Math.max(1, Math.min(chal.steps.length, rState.chalStep || 1));
    const step = chal.steps[curStep - 1];
    const ans = (rState.chalAnswers && rState.chalAnswers[chal.id]) || {};

    return `<div class="chal-module-wrap">
      <div style="margin-bottom:1.1rem">
        <div class="eyebrow">Trening ordynacji leków</div>
        <h3 style="margin:.2rem 0">10 Wyzwań Recepturowych & Pułapki Farmakoterapii</h3>
        <p class="lead" style="font-size:.88rem;margin-bottom:0">Rozwiązuj autentyczne przypadki kliniczne z gabinetu POZ i oddziału pediatrycznego. Sprawdź, czy potrafisz dobrać dawkę w mg/kg, przeliczyć zawiesinę na ml, skalkulować liczbę butelek i uniknąć pułapek egzaminacyjnych!</p>
      </div>

      <!-- Pigułki wyboru wyzwania -->
      <div class="chal-pills-row">
        ${PRESCRIPTION_CHALLENGES.map((ch, idx) => {
          const isSel = idx === chalIdx;
          const isDone = (rState.chalDone || []).includes(ch.id);
          return `<button class="chal-pill-btn ${isSel ? 'active' : ''} ${isDone ? 'done' : ''}" data-presc-chal="${idx}">
            <span class="chal-num">${idx + 1}</span>
            <span class="chal-label">${esc(ch.title.split(':')[0])}</span>
            ${isDone ? '<span class="chal-check">✓</span>' : ''}
          </button>`;
        }).join('')}
      </div>

      <!-- Karta aktywnego wyzwania -->
      <div class="chal-card">
        <div class="chal-card-header">
          <div>
            <span class="chip" style="background:var(--teal-l);color:var(--teal-d);font-weight:800">Wyzwanie ${chalIdx + 1} z ${PRESCRIPTION_CHALLENGES.length}</span>
            <h3 style="margin:.4rem 0 .2rem;font-size:1.15rem">${esc(chal.title)}</h3>
          </div>
          <div class="chal-weight-badge">
            <span class="muted" style="font-size:.75rem">Masa ciała:</span>
            <strong style="color:var(--ink);font-size:1.1rem">${chal.weight} kg</strong>
          </div>
        </div>

        <div class="chal-vignette-box">
          <strong style="color:var(--teal-d)">📋 Opis przypadku:</strong>
          <p style="margin:.3rem 0 0;font-size:.92rem;line-height:1.5">${esc(chal.vignette)}</p>
        </div>

        <!-- Stepper -->
        <div class="chal-stepper">
          ${chal.steps.map((st, sIdx) => {
            const sNum = sIdx + 1;
            const isDone = (ans[sNum] !== undefined && ans[sNum] === st.correct);
            const isCurr = sNum === curStep;
            return `<div class="chal-step-dot ${isDone ? 'done' : (isCurr ? 'current' : '')}" title="${esc(st.title)}">
              ${isDone ? '✓' : sNum}
            </div>`;
          }).join('')}
          <span class="srcline" style="margin-left:.4rem">Krok ${curStep} z ${chal.steps.length}: <b>${esc(step.title)}</b></span>
        </div>

        <!-- Pytanie bieżącego kroku -->
        <div class="chal-question-box">
          <h4 style="margin:0 0 .7rem;color:var(--ink);font-size:.98rem">${esc(step.q)}</h4>
          <div class="chal-options-stack">
            ${step.opts.map((opt, optIdx) => {
              const hasAns = ans[curStep] !== undefined;
              let optClass = 'chal-opt-btn';
              if (hasAns) {
                if (optIdx === step.correct) optClass += ' correct';
                else if (optIdx === ans[curStep]) optClass += ' wrong';
                else optClass += ' disabled';
              }
              return `<button class="${optClass}" ${hasAns ? 'disabled' : `data-chal-opt="${optIdx}"`}>
                <span class="chal-opt-letter">${String.fromCharCode(65 + optIdx)}.</span>
                <span>${esc(opt)}</span>
              </button>`;
            }).join('')}
          </div>
        </div>

        <!-- Wyjaśnienie jeśli udzielono odpowiedzi -->
        ${ans[curStep] !== undefined ? `
        <div class="chal-explanation-box ${ans[curStep] === step.correct ? 'ok' : 'err'}">
          <div style="font-weight:800;margin-bottom:.3rem">
            ${ans[curStep] === step.correct ? '✅ Doskonale! Prawidłowa odpowiedź' : '❌ Pomyłka kliniczna'}
          </div>
          <p style="margin:0;font-size:.88rem;line-height:1.5">${esc(step.explanation)}</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;flex-wrap:wrap;gap:.6rem">
          ${ans[curStep] === step.correct ? `
            ${curStep < chal.steps.length ? `
              <button class="btn pri" id="btnChalNextStep">Przejdź do Kroku ${curStep + 1} z ${chal.steps.length} →</button>
            ` : `
              <div class="chal-congrats-banner">
                <div style="font-size:1.05rem;font-weight:800;color:var(--green-d)">🎉 Gratulacje! Ukończono całe wyzwanie!</div>
                <div class="chal-pearl-box">
                  <strong>⭐ Złota Perła Egzaminacyjna:</strong> ${esc(chal.pearl)}
                </div>
              </div>
              <button class="btn pri" id="btnChalNextChallenge">Przejdź do kolejnego wyzwania →</button>
            `}
          ` : `
            <button class="btn sec" id="btnChalRetryStep">↺ Spróbuj ponownie ten krok</button>
          `}
        </div>
        ` : ''}

        <div style="margin-top:1.4rem;padding-top:.8rem;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center">
          <span class="srcline">Postęp zapamiętywany w przeglądarce</span>
          <button class="btn sec sm" id="btnResetChalProgress" style="font-size:.75rem;opacity:.7">Zresetuj postęp wyzwań</button>
        </div>
      </div>
    </div>`;
  };

  /* Zakładka 5: Skale pediatryczne */
  const renderTabScales = () => {
    // pGCS calculation
    const g = CALC_STATE.pgcs;
    const gcsTotal = g.eyes + g.verbal + g.motor;
    let gcsInterp = 'Stan prawidłowy (13–15)';
    let gcsColor = 'var(--green)';
    if (gcsTotal <= 8) {
      gcsInterp = 'Ciężkie uszkodzenie OUN (≤8) – wskazanie do intubacji!';
      gcsColor = 'var(--red)';
    } else if (gcsTotal <= 12) {
      gcsInterp = 'Umiarkowane uszkodzenie OUN (9–12)';
      gcsColor = 'var(--amber)';
    }

    // Apgar calculation
    const a = CALC_STATE.apgar;
    const apgarTotal = a.hr + a.resp + a.tone + a.reflex + a.color;
    let apgarInterp = 'Stan dobry (8–10 punktów)';
    let apgarColor = 'var(--green)';
    if (apgarTotal <= 3) {
      apgarInterp = 'Ciężka zamartwica (0–3 pkt) – natychmiastowa resuscytacja!';
      apgarColor = 'var(--red)';
    } else if (apgarTotal <= 7) {
      apgarInterp = 'Stan średni / umiarkowane niedotlenienie (4–7 pkt)';
      apgarColor = 'var(--amber)';
    }

    // Silverman calculation
    const s = CALC_STATE.silverman;
    const silverTotal = s.chest + s.ic + s.xiph + s.nares + s.grunt;
    let silverInterp = 'Brak niewydolności oddechowej (0 pkt)';
    let silverColor = 'var(--green)';
    if (silverTotal >= 7) {
      silverInterp = 'Ciężka niewydolność oddechowa (7–10 pkt) – zagrożenie życia!';
      silverColor = 'var(--red)';
    } else if (silverTotal >= 4) {
      silverInterp = 'Umiarkowana niewydolność oddechowa (4–6 pkt)';
      silverColor = 'var(--amber)';
    } else if (silverTotal >= 1) {
      silverInterp = 'Łagodna niewydolność oddechowa (1–3 pkt)';
      silverColor = 'var(--teal)';
    }

    return `<div>
      <!-- Pediatryczna skala Glasgow (pGCS) -->
      <div class="scale-card">
        <div class="scale-header">
          <div>
            <h3 style="font-size:1.3rem">Pediatryczna skala Glasgow (pGCS)</h3>
            <span class="muted" style="font-size:.82rem">Ocena stanu świadomości dostosowana do niemowląt i małych dzieci.</span>
          </div>
          <div style="display:flex;align-items:center;gap:.8rem">
            <span style="font-weight:800;color:${gcsColor}">${gcsInterp}</span>
            <div class="scale-score-badge" style="color:${gcsColor}">${gcsTotal} / 15</div>
          </div>
        </div>

        <div class="scale-row">
          <b>Otwieranie oczu (E)</b>
          <div class="scale-opt-group" data-scale="pgcs-eyes">
            <button class="scale-opt-btn ${g.eyes === 4 ? 'active' : ''}" data-val="4">Spontaniczne (4)</button>
            <button class="scale-opt-btn ${g.eyes === 3 ? 'active' : ''}" data-val="3">Na polecenie / głos (3)</button>
            <button class="scale-opt-btn ${g.eyes === 2 ? 'active' : ''}" data-val="2">Na bodziec bólowy (2)</button>
            <button class="scale-opt-btn ${g.eyes === 1 ? 'active' : ''}" data-val="1">Brak reakcji (1)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Odpowiedź słowna (V)</b>
          <div class="scale-opt-group" data-scale="pgcs-verbal">
            <button class="scale-opt-btn ${g.verbal === 5 ? 'active' : ''}" data-val="5">Głużenie, gaworzenie, uśmiech (5)</button>
            <button class="scale-opt-btn ${g.verbal === 4 ? 'active' : ''}" data-val="4">Płacz z możliwością utulenia (4)</button>
            <button class="scale-opt-btn ${g.verbal === 3 ? 'active' : ''}" data-val="3">Płacz nieukojony / krzyk (3)</button>
            <button class="scale-opt-btn ${g.verbal === 2 ? 'active' : ''}" data-val="2">Jęki, niepokój, postękiwanie (2)</button>
            <button class="scale-opt-btn ${g.verbal === 1 ? 'active' : ''}" data-val="1">Brak odpowiedzi słownej (1)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Odpowiedź ruchowa (M)</b>
          <div class="scale-opt-group" data-scale="pgcs-motor">
            <button class="scale-opt-btn ${g.motor === 6 ? 'active' : ''}" data-val="6">Ruchy spontaniczne / spełnia polecenia (6)</button>
            <button class="scale-opt-btn ${g.motor === 5 ? 'active' : ''}" data-val="5">Lokalizuje bodziec bólowy (5)</button>
            <button class="scale-opt-btn ${g.motor === 4 ? 'active' : ''}" data-val="4">Ucieczka przed bólem (4)</button>
            <button class="scale-opt-btn ${g.motor === 3 ? 'active' : ''}" data-val="3">Zgięcie patologiczne (odkorowanie) (3)</button>
            <button class="scale-opt-btn ${g.motor === 2 ? 'active' : ''}" data-val="2">Wyprost patologiczny (odmóżdżenie) (2)</button>
            <button class="scale-opt-btn ${g.motor === 1 ? 'active' : ''}" data-val="1">Brak reakcji ruchowej / wiotkość (1)</button>
          </div>
        </div>
      </div>

      <!-- Skala Apgar -->
      <div class="scale-card">
        <div class="scale-header">
          <div>
            <h3 style="font-size:1.3rem">Skala Apgar (ocena noworodka)</h3>
            <span class="muted" style="font-size:.82rem">Ocena stanu noworodka w 1., 3., 5. i 10. minucie życia.</span>
          </div>
          <div style="display:flex;align-items:center;gap:.8rem">
            <span style="font-weight:800;color:${apgarColor}">${apgarInterp}</span>
            <div class="scale-score-badge" style="color:${apgarColor}">${apgarTotal} / 10</div>
          </div>
        </div>

        <div class="scale-row">
          <b>Czynność serca (HR)</b>
          <div class="scale-opt-group" data-scale="apgar-hr">
            <button class="scale-opt-btn ${a.hr === 2 ? 'active' : ''}" data-val="2">> 100 / min (2)</button>
            <button class="scale-opt-btn ${a.hr === 1 ? 'active' : ''}" data-val="1">< 100 / min (1)</button>
            <button class="scale-opt-btn ${a.hr === 0 ? 'active' : ''}" data-val="0">Brak czynności serca (0)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Oddychanie</b>
          <div class="scale-opt-group" data-scale="apgar-resp">
            <button class="scale-opt-btn ${a.resp === 2 ? 'active' : ''}" data-val="2">Głośny płacz / miarowy (2)</button>
            <button class="scale-opt-btn ${a.resp === 1 ? 'active' : ''}" data-val="1">Wolny / nieregularny (1)</button>
            <button class="scale-opt-btn ${a.resp === 0 ? 'active' : ''}" data-val="0">Brak oddechu (0)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Napięcie mięśni</b>
          <div class="scale-opt-group" data-scale="apgar-tone">
            <button class="scale-opt-btn ${a.tone === 2 ? 'active' : ''}" data-val="2">Ruchy aktywne (2)</button>
            <button class="scale-opt-btn ${a.tone === 1 ? 'active' : ''}" data-val="1">Kończyny zgięte (1)</button>
            <button class="scale-opt-btn ${a.tone === 0 ? 'active' : ''}" data-val="0">Wiotkie (0)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Reakcja na bodziec</b>
          <div class="scale-opt-group" data-scale="apgar-reflex">
            <button class="scale-opt-btn ${a.reflex === 2 ? 'active' : ''}" data-val="2">Kichanie, kaszel, energiczny grymas (2)</button>
            <button class="scale-opt-btn ${a.reflex === 1 ? 'active' : ''}" data-val="1">Słaby grymas (1)</button>
            <button class="scale-opt-btn ${a.reflex === 0 ? 'active' : ''}" data-val="0">Brak reakcji (0)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Zabarwienie skóry</b>
          <div class="scale-opt-group" data-scale="apgar-color">
            <button class="scale-opt-btn ${a.color === 2 ? 'active' : ''}" data-val="2">Różowe całe ciało (2)</button>
            <button class="scale-opt-btn ${a.color === 1 ? 'active' : ''}" data-val="1">Tułów różowy, sinica dłoni i stóp (1)</button>
            <button class="scale-opt-btn ${a.color === 0 ? 'active' : ''}" data-val="0">Blade lub sine uogólnione (0)</button>
          </div>
        </div>
      </div>

      <!-- Skala Silvermana -->
      <div class="scale-card">
        <div class="scale-header">
          <div>
            <h3 style="font-size:1.3rem">Skala Silvermana-Andersena (niewydolność oddechowa noworodka)</h3>
            <span class="muted" style="font-size:.82rem">Ocena nasilenia duszności u noworodka (im więcej punktów, tym cięższa niewydolność!).</span>
          </div>
          <div style="display:flex;align-items:center;gap:.8rem">
            <span style="font-weight:800;color:${silverColor}">${silverInterp}</span>
            <div class="scale-score-badge" style="color:${silverColor}">${silverTotal} / 10</div>
          </div>
        </div>

        <div class="scale-row">
          <b>Ruchy klatki i brzucha</b>
          <div class="scale-opt-group" data-scale="silv-chest">
            <button class="scale-opt-btn ${s.chest === 0 ? 'active' : ''}" data-val="0">Zsynchronizowane (0)</button>
            <button class="scale-opt-btn ${s.chest === 1 ? 'active' : ''}" data-val="1">Klatka opóźniona we wdechu (1)</button>
            <button class="scale-opt-btn ${s.chest === 2 ? 'active' : ''}" data-val="2">Ruchy huśtawkowe (paradoksalne) (2)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Zaciąganie międzyżebrzy</b>
          <div class="scale-opt-group" data-scale="silv-ic">
            <button class="scale-opt-btn ${s.ic === 0 ? 'active' : ''}" data-val="0">Brak zaciągania (0)</button>
            <button class="scale-opt-btn ${s.ic === 1 ? 'active' : ''}" data-val="1">Ledwo widoczne (1)</button>
            <button class="scale-opt-btn ${s.ic === 2 ? 'active' : ''}" data-val="2">Wyraźne zaciąganie (2)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Zaciąganie dołka podsercowego</b>
          <div class="scale-opt-group" data-scale="silv-xiph">
            <button class="scale-opt-btn ${s.xiph === 0 ? 'active' : ''}" data-val="0">Brak zaciągania (0)</button>
            <button class="scale-opt-btn ${s.xiph === 1 ? 'active' : ''}" data-val="1">Ledwo widoczne (1)</button>
            <button class="scale-opt-btn ${s.xiph === 2 ? 'active' : ''}" data-val="2">Wyraźne zaciąganie (2)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Ruchy skrzydełek nosa</b>
          <div class="scale-opt-group" data-scale="silv-nares">
            <button class="scale-opt-btn ${s.nares === 0 ? 'active' : ''}" data-val="0">Brak poruszania (0)</button>
            <button class="scale-opt-btn ${s.nares === 1 ? 'active' : ''}" data-val="1">Minimalne poruszanie (1)</button>
            <button class="scale-opt-btn ${s.nares === 2 ? 'active' : ''}" data-val="2">Wyraźne rozszerzanie (2)</button>
          </div>
        </div>

        <div class="scale-row">
          <b>Stękanie wydechowe (grunting)</b>
          <div class="scale-opt-group" data-scale="silv-grunt">
            <button class="scale-opt-btn ${s.grunt === 0 ? 'active' : ''}" data-val="0">Brak stękania (0)</button>
            <button class="scale-opt-btn ${s.grunt === 1 ? 'active' : ''}" data-val="1">Słyszalne stetoskopem (1)</button>
            <button class="scale-opt-btn ${s.grunt === 2 ? 'active' : ''}" data-val="2">Słyszalne uchem bez słuchawek (2)</button>
          </div>
        </div>
      </div>
    </div>`;
  };

  const attachEvents = () => {
    // Suwak i pole wagi
    const slider = $('#calcWeightSlider');
    const numIn = $('#calcWeightIn');

    const updateWeight = val => {
      const safeVal = Number.isFinite(val) ? val : 1;
      const clamped = Math.max(1, Math.min(100, Math.round(safeVal * 10) / 10));
      CALC_STATE.weight = clamped;
      saveCalcState();
      render();
    };

    if (slider) slider.addEventListener('input', e => updateWeight(+e.target.value));
    if (numIn) numIn.addEventListener('change', e => updateWeight(+e.target.value));

    // Pigułki szybkiego wyboru wagi
    $$('[data-pw]').forEach(btn => {
      btn.onclick = () => updateWeight(+btn.dataset.pw);
    });

    // Wiek i szacowanie APLS
    const ageValIn = $('#calcAgeVal');
    const ageUnitSel = $('#calcAgeUnit');
    const applyAgeBtn = $('#btnApplyAgeEst');

    if (applyAgeBtn) {
      applyAgeBtn.onclick = () => {
        const val = +ageValIn.value;
        const unit = ageUnitSel.value;
        CALC_STATE.ageVal = val;
        CALC_STATE.ageUnit = unit;
        const estW = estimateWeightFromAge(val, unit);
        updateWeight(estW);
        toast(`Oszacowano wagę z wieku: ${estW} kg`);
      };
    }

    // Zakładki kalkulatora
    $$('#calcTabNav button').forEach(btn => {
      btn.onclick = () => {
        CALC_STATE.tab = btn.dataset.tab;
        saveCalcState();
        render();
      };
    });

    // Płynoterapia stopień odwodnienia
    const dehydrSeg = $('#calcDehydrSeg');
    if (dehydrSeg) {
      dehydrSeg.onclick = e => {
        const b = e.target.closest('[data-ds]');
        if (!b) return;
        CALC_STATE.dehydr = b.dataset.ds;
        saveCalcState();
        render();
      };
    }

    // Skale kliniczne – przyciski wyboru opcji
    $$('[data-scale]').forEach(group => {
      group.onclick = e => {
        const b = e.target.closest('[data-val]');
        if (!b) return;
        const scaleType = group.dataset.scale;
        const val = +b.dataset.val;

        if (scaleType === 'pgcs-eyes') CALC_STATE.pgcs.eyes = val;
        else if (scaleType === 'pgcs-verbal') CALC_STATE.pgcs.verbal = val;
        else if (scaleType === 'pgcs-motor') CALC_STATE.pgcs.motor = val;
        else if (scaleType === 'apgar-hr') CALC_STATE.apgar.hr = val;
        else if (scaleType === 'apgar-resp') CALC_STATE.apgar.resp = val;
        else if (scaleType === 'apgar-tone') CALC_STATE.apgar.tone = val;
        else if (scaleType === 'apgar-reflex') CALC_STATE.apgar.reflex = val;
        else if (scaleType === 'apgar-color') CALC_STATE.apgar.color = val;
        else if (scaleType === 'silv-chest') CALC_STATE.silverman.chest = val;
        else if (scaleType === 'silv-ic') CALC_STATE.silverman.ic = val;
        else if (scaleType === 'silv-xiph') CALC_STATE.silverman.xiph = val;
        else if (scaleType === 'silv-nares') CALC_STATE.silverman.nares = val;
        else if (scaleType === 'silv-grunt') CALC_STATE.silverman.grunt = val;

        saveCalcState();
        render();
      };
    });

    // Kopiuj kartę dawek do Notatnika
    const exportBtn = $('#btnExportToNotes');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const w = CALC_STATE.weight;
        const age = `${CALC_STATE.ageVal} ${CALC_STATE.ageUnit === 'y' ? 'lat' : 'miesięcy'}`;

        const { dailyMl } = calcHollidaySegar(w);

        const md = `# Karta zlecenia i dawek leków pacjenta
**Data wygenerowania:** ${new Date().toLocaleString('pl-PL')}
**Masa ciała:** ${w.toFixed(1)} kg | **Wiek szacowany:** ${age}

---

## 1. Leki ratunkowe i stany nagłe (PALS)
| Lek | Dawka obliczona | Objętość / Postać | Sposób podania |
|---|---|---|---|
| **Adrenalina w NZK** (1:10 000) | ${(w * 0.01).toFixed(2)} mg | ${(w * 0.1).toFixed(1)} ml | i.v. / i.o. co 3–5 min |
| **Adrenalina w Anafilaksji** (1:1000) | ${Math.min(0.5, (w * 0.01)).toFixed(2)} mg | ${Math.min(0.5, (w * 0.01)).toFixed(2)} ml | i.m. udo (nierozcieńczona) |
| **Defibrylacja (VF/pVT)** | ${Math.min(200, Math.round(w * 4))} J | – | 4 J/kg mc. |
| **Bolus płynowy we wstrząsie** | ${Math.round(w * 20)} ml | Krystaloidy | w 10–20 min |
| **Amiodaron** (5 mg/kg) | ${Math.min(300, Math.round(w * 5))} mg | ${(Math.min(300, Math.round(w * 5)) / 50).toFixed(1)} ml | i.v. / i.o. po 3. i 5. defibrylacji |
| **Midazolam w drgawkach** | ${Math.min(10, (w * 0.25)).toFixed(1)} mg | Buccolam | policzkowo (buccal) |
| **Diazepam w drgawkach** | ${Math.min(10, (w * 0.5)).toFixed(1)} mg | Wlewka doodbyt. | doodbytniczo (p.r.) |
| **Deksametazon (Krup)** | ${Math.min(8, (w * 0.15)).toFixed(1)} mg | p.o. / i.m. / i.v. | 0.15–0.6 mg/kg |
| **Glukoza 10% (hipoglikemia)** | ${Math.round(w * 2.5)} ml | 10% Glukoza | bolus i.v. |

---

## 2. Płynoterapia podstawowa (Holliday-Segar)
- **Objętość dobowa:** ${dailyMl} ml / dobę
- **Przepływ w pompie infuzyjnej:** ${Math.round(dailyMl / 24)} ml / godzinę
- **Przepływ grawitacyjny (aparat 20 kr/ml):** ${Math.round((dailyMl / 24) / 3)} kropel / min

---

## 3. Leki przeciwgorączkowe i przeciwbólowe
- **Paracetamol (15 mg/kg):** ${Math.min(1000, Math.round(w * 15))} mg jednorazowo (co 4–6 godz., max ${Math.min(4000, Math.round(w * 60))} mg/dobę)
  - *Syrop 120 mg/5 ml (24 mg/ml):* ${((Math.min(1000, Math.round(w * 15))) / 24).toFixed(1)} ml
  - *Syrop forte 200 mg/5 ml (40 mg/ml):* ${((Math.min(1000, Math.round(w * 15))) / 40).toFixed(1)} ml
- **Ibuprofen (10 mg/kg):** ${Math.min(400, Math.round(w * 10))} mg jednorazowo (co 6–8 godz., max ${Math.min(1200, Math.round(w * 30))} mg/dobę)
  - *Syrop 100 mg/5 ml (20 mg/ml):* ${((Math.min(400, Math.round(w * 10))) / 20).toFixed(1)} ml
  - *Syrop forte 200 mg/5 ml (40 mg/ml):* ${((Math.min(400, Math.round(w * 10))) / 40).toFixed(1)} ml
  - *Uwaga:* Przeciwwskazany w ospie wietrznej i odwodnieniu!

---

## 4. Antybiotykoterapia
- **Amoksycylina wysoka dawka (90 mg/kg/doba - AOM/zapalenie płuc):** ${Math.min(3000, Math.round(w * 90))} mg/dobę (w 2 dawkach co 12h: ${Math.round(Math.min(3000, Math.round(w * 90)) / 2)} mg)
- **Cefuroksym aksetyl (30 mg/kg/doba):** ${Math.min(1000, Math.round(w * 30))} mg/dobę (co 12h: ${Math.round(Math.min(1000, Math.round(w * 30)) / 2)} mg po jedzeniu)
- **Azytromycyna (10 mg/kg):** ${Math.min(500, Math.round(w * 10))} mg raz na dobę przez 3 dni
`;

        const notes = getNotes();
        const note = {
          id: 'note_calc_' + Date.now(),
          title: `Karta dawek i leków pacjenta (${w.toFixed(1)} kg, ${new Date().toLocaleDateString('pl-PL')})`,
          content: md,
          mod: 'all',
          updatedAt: Date.now()
        };
        notes.unshift(note);
        saveNotes(notes);
        toast('Zapisano kartę dawek pacjenta do Notatnika!');
        location.hash = '#/notatki?id=' + note.id;
      };
    }

    // Obsługa zakładki Apteczka & Recepty
    $$('.presc-mode-btn').forEach(btn => {
      btn.onclick = () => {
        CALC_STATE.recepty.mode = btn.dataset.pmode;
        saveCalcState();
        render();
      };
    });

    $$('[data-presc-cat]').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.dataset.prescCat;
        CALC_STATE.recepty.cat = cat;
        const filtered = cat === 'all'
          ? PEDIATRIC_DRUG_DATABASE
          : PEDIATRIC_DRUG_DATABASE.filter(d => d.category === cat);
        if (!filtered.some(d => d.id === CALC_STATE.recepty.drugId) && filtered.length > 0) {
          CALC_STATE.recepty.drugId = filtered[0].id;
          CALC_STATE.recepty.indId = filtered[0].indications[0].id;
          CALC_STATE.recepty.formIdx = 0;
          CALC_STATE.recepty.days = filtered[0].indications[0].durationDays || 7;
        }
        saveCalcState();
        render();
      };
    });

    $$('[data-presc-drug]').forEach(btn => {
      btn.onclick = () => {
        const did = btn.dataset.prescDrug;
        const d = PEDIATRIC_DRUG_DATABASE.find(x => x.id === did);
        if (d) {
          CALC_STATE.recepty.drugId = d.id;
          CALC_STATE.recepty.indId = d.indications[0].id;
          CALC_STATE.recepty.formIdx = 0;
          CALC_STATE.recepty.days = d.indications[0].durationDays || 7;
          saveCalcState();
          render();
        }
      };
    });

    $$('[data-presc-ind]').forEach(btn => {
      btn.onclick = () => {
        const indId = btn.dataset.prescInd;
        const d = PEDIATRIC_DRUG_DATABASE.find(x => x.id === CALC_STATE.recepty.drugId);
        if (d) {
          const ind = d.indications.find(i => i.id === indId);
          if (ind) {
            CALC_STATE.recepty.indId = ind.id;
            if (ind.durationDays) CALC_STATE.recepty.days = ind.durationDays;
            saveCalcState();
            render();
          }
        }
      };
    });

    $$('[data-presc-form]').forEach(btn => {
      btn.onclick = () => {
        CALC_STATE.recepty.formIdx = +btn.dataset.prescForm;
        saveCalcState();
        render();
      };
    });

    const prescDaysIn = $('#prescDaysIn');
    if (prescDaysIn) {
      prescDaysIn.onchange = e => {
        CALC_STATE.recepty.days = Math.max(1, Math.min(30, +e.target.value));
        saveCalcState();
        render();
      };
    }

    $$('[data-presc-days]').forEach(btn => {
      btn.onclick = () => {
        CALC_STATE.recepty.days = +btn.dataset.prescDays;
        saveCalcState();
        render();
      };
    });

    const copyPrescBtn = $('#btnCopyPrescription');
    if (copyPrescBtn) {
      copyPrescBtn.onclick = () => {
        const text = copyPrescBtn.dataset.copyText;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            toast('Skopiowano treść e-Recepty (Rp. + D.S.) do schowka!');
          }).catch(() => {
            toast('Zaznacz i skopiuj treść recepty');
          });
        }
      };
    }

    const copyAdviceBtn = $('#btnCopyParentAdvice');
    if (copyAdviceBtn) {
      copyAdviceBtn.onclick = () => {
        const text = copyAdviceBtn.dataset.copyText;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            toast('Skopiowano zalecenia dla rodziców do schowka!');
          }).catch(() => {
            toast('Zaznacz i skopiuj zalecenia dla rodziców');
          });
        }
      };
    }

    const copyHospBtn = $('#btnCopyHospitalOrder');
    if (copyHospBtn) {
      copyHospBtn.onclick = () => {
        const text = copyHospBtn.dataset.copyText;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            toast('Skopiowano Kartę Zleceń Szpitalnych do schowka!');
          }).catch(() => {
            toast('Zaznacz i skopiuj zlecenie szpitalne');
          });
        }
      };
    }

    // Wyzwania recepturowe
    $$('[data-presc-chal]').forEach(btn => {
      btn.onclick = () => {
        CALC_STATE.recepty.chalIdx = +btn.dataset.prescChal;
        CALC_STATE.recepty.chalStep = 1;
        saveCalcState();
        render();
      };
    });

    $$('[data-chal-opt]').forEach(btn => {
      btn.onclick = () => {
        const optIdx = +btn.dataset.chalOpt;
        const chal = PRESCRIPTION_CHALLENGES[CALC_STATE.recepty.chalIdx];
        const stepNum = CALC_STATE.recepty.chalStep || 1;
        if (!CALC_STATE.recepty.chalAnswers[chal.id]) {
          CALC_STATE.recepty.chalAnswers[chal.id] = {};
        }
        CALC_STATE.recepty.chalAnswers[chal.id][stepNum] = optIdx;

        if (optIdx === chal.steps[stepNum - 1].correct && stepNum === chal.steps.length) {
          if (!CALC_STATE.recepty.chalDone.includes(chal.id)) {
            CALC_STATE.recepty.chalDone.push(chal.id);
          }
        }
        saveCalcState();
        render();
      };
    });

    const nextStepBtn = $('#btnChalNextStep');
    if (nextStepBtn) {
      nextStepBtn.onclick = () => {
        const chal = PRESCRIPTION_CHALLENGES[CALC_STATE.recepty.chalIdx];
        if (CALC_STATE.recepty.chalStep < chal.steps.length) {
          CALC_STATE.recepty.chalStep++;
          saveCalcState();
          render();
        }
      };
    }

    const retryStepBtn = $('#btnChalRetryStep');
    if (retryStepBtn) {
      retryStepBtn.onclick = () => {
        const chal = PRESCRIPTION_CHALLENGES[CALC_STATE.recepty.chalIdx];
        const sNum = CALC_STATE.recepty.chalStep || 1;
        if (CALC_STATE.recepty.chalAnswers[chal.id]) {
          delete CALC_STATE.recepty.chalAnswers[chal.id][sNum];
          saveCalcState();
          render();
        }
      };
    }

    const nextChalBtn = $('#btnChalNextChallenge');
    if (nextChalBtn) {
      nextChalBtn.onclick = () => {
        CALC_STATE.recepty.chalIdx = (CALC_STATE.recepty.chalIdx + 1) % PRESCRIPTION_CHALLENGES.length;
        CALC_STATE.recepty.chalStep = 1;
        saveCalcState();
        render();
      };
    }

    const resetChalBtn = $('#btnResetChalProgress');
    if (resetChalBtn) {
      resetChalBtn.onclick = () => {
        if (confirm('Czy na pewno chcesz zresetować postęp wyzwań recepturowych?')) {
          CALC_STATE.recepty.chalAnswers = {};
          CALC_STATE.recepty.chalDone = [];
          CALC_STATE.recepty.chalStep = 1;
          saveCalcState();
          render();
          toast('Zresetowano postęp wyzwań');
        }
      };
    }
  };

  render();
}

    return { viewCalculator };
  };
})();
