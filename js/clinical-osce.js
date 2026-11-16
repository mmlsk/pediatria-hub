/* Pediatria V – moduł kliniczny: Symulator egzaminu praktycznego OSCE */
(function () {
  'use strict';
  window.HUB_CLINICAL = window.HUB_CLINICAL || {};
  window.HUB_CLINICAL.osce = function (ctx) {
    const { OSCE_STATIONS } = window.HUB_META;
    const { $, $$, main, esc, toast, save, getNotes, saveNotes } = ctx;
    const getVitalStatus = (k, v) => ctx.patient.getVitalStatus(k, v);

function renderOsceImagingBadge(stationId) {
  const map = {
    'stacja-1-odwodnienie': { link: '#/badania?tab=gas', text: '🔬 Sprawdź gazometrię i odwodnienie w Trenażerze Badań →', col: 'var(--amber)', bg: 'var(--amber-l)' },
    'stacja-2-brzuch': { link: '#/badania?tab=imaging&case=usg-appendicitis', text: '🔬 Przećwicz USG wyrostka i brzucha w Trenażerze Obrazowania →', col: 'var(--teal-d)', bg: 'var(--teal-l)' },
    'stacja-3-krup': { link: '#/badania?tab=imaging&case=rtg-croup', text: '🔬 Przećwicz RTG krtani (Objaw wieży kościoła) w Trenażerze Obrazowania →', col: 'var(--blue)', bg: 'var(--blue-l)' },
    'stacja-4-igav': { link: '#/badania?tab=urine', text: '🔬 Sprawdź badanie ogólne i osad moczu w Trenażerze Badań →', col: 'var(--violet)', bg: 'var(--violet-l)' }
  };
  const item = map[stationId];
  if (!item) return '';
  return `<div style="margin-top:.4rem"><a class="chip" href="${item.link}" style="background:${item.bg};color:${item.col};font-weight:700;font-size:.78rem;text-decoration:none">${item.text}</a></div>`;
}

/* ==========================================================================
   SYMULATOR EGZAMINU PRAKTYCZNEGO OSCE (Badanie fizykalne i Status Praesens)
   ========================================================================== */

let OSCE_ACTIVE = null;

function getReactionBadge(r) {
  switch (r) {
    case 'pain':
      return '<span class="osce-reaction-badge pain">😣 Ból / Obrona mimowolna</span>';
    case 'cry':
      return '<span class="osce-reaction-badge cry">😭 Płacz / Niepokój ruchowy</span>';
    case 'lethargy':
      return '<span class="osce-reaction-badge lethargy">😴 Apatia / Letarg</span>';
    case 'crisis':
      return '<span class="osce-reaction-badge crisis">🚨 KRYZYS / ZAŁAMANIE PARAMETRÓW</span>';
    case 'normal':
    default:
      return '<span class="osce-reaction-badge normal">😊 Spokojny / Stabilny</span>';
  }
}

function getZoneClass(station, zoneId, selectedZoneObj) {
  const isSelected = selectedZoneObj && selectedZoneObj.id === zoneId;
  const isDone = station.zones && station.zones.some(z => z.id === zoneId && z.maneuvers.filter(m => m.isKey).every(m => OSCE_ACTIVE && OSCE_ACTIVE.performedManeuvers && OSCE_ACTIVE.performedManeuvers.has(m.id)));
  let cls = 'osce-anatomy-region';
  if (isSelected) cls += ' active-zone';
  if (isDone) cls += ' done-zone';
  return cls;
}

function renderInfantSilhouetteSvg(station, selectedZoneObj, viewMode = 'front') {
  const isBack = viewMode === 'back';
  const perf = (OSCE_ACTIVE && OSCE_ACTIVE.performedManeuvers) ? OSCE_ACTIVE.performedManeuvers : new Set();
  const ciemieDone = perf.has('m_ciemie');
  const oczyDone = perf.has('m_oczy');
  const sluzowkiDone = perf.has('m_sluzowki');
  const faldDone = perf.has('m_fald_skorny');
  const crtDone = perf.has('m_crt');
  const pieluchaDone = perf.has('m_pielucha_mocz');
  const oponyDone = perf.has('m_szyja_opony');
  const serceDone = perf.has('m_osluch_serca');

  return `<svg class="osce-silhouette-svg" viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sylwetka niemowlęcia">
    <defs>
      <linearGradient id="infantSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.18"/>
      </linearGradient>
      <linearGradient id="infantSkinBack" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.09"/>
        <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.19"/>
      </linearGradient>
    </defs>

    <!-- Tło łóżeczka niemowlęcego / crib -->
    <rect x="15" y="10" width="270" height="460" rx="24" fill="rgba(12,122,133,0.02)" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 4"/>
    <ellipse cx="150" cy="85" rx="76" ry="55" fill="rgba(12,122,133,0.04)" stroke="var(--line)" stroke-width="1"/>

    ${!isBack ? `
      <!-- WIDOK Z PRZODU (ANTERIOR) -->
      <!-- Kończyny dolne w pozycji zgięciowej (żabka) -->
      <path class="${getZoneClass(station, 'skora_turgor', selectedZoneObj)}" data-zone-id="skora_turgor"
            d="M 115 315 C 80 330 65 365 75 395 C 82 412 100 415 110 398 C 118 378 126 350 134 330 Z"
            fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>
      <path class="${getZoneClass(station, 'skora_turgor', selectedZoneObj)}" data-zone-id="skora_turgor"
            d="M 185 315 C 220 330 235 365 225 395 C 218 412 200 415 190 398 C 182 378 174 350 166 330 Z"
            fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Stópki niemowlęcia (marmurkowate ucieplenie) -->
      <ellipse cx="88" cy="402" rx="13" ry="8" transform="rotate(-15 88 402)" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2"/>
      <ellipse cx="212" cy="402" rx="13" ry="8" transform="rotate(15 212 402)" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Rączki niemowlęcia zgięte w łokciach -->
      <path class="${getZoneClass(station, 'serce_krazenie', selectedZoneObj)}" data-zone-id="serce_krazenie"
            d="M 95 165 C 65 175 52 205 58 233 C 62 245 76 247 82 235 C 88 220 95 195 102 180 Z"
            fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>
      <path class="${getZoneClass(station, 'serce_krazenie', selectedZoneObj)}" data-zone-id="serce_krazenie"
            d="M 205 165 C 235 175 248 205 242 233 C 238 245 224 247 218 235 C 212 220 205 195 198 180 Z"
            fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="68" cy="241" r="8" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2"/>
      <circle cx="232" cy="241" r="8" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Tułów i brzuszek -->
      <path class="${getZoneClass(station, 'brzuch', selectedZoneObj)}" data-zone-id="brzuch"
            d="M 112 150 C 92 170 88 215 90 265 C 92 295 102 320 115 325 L 185 325 C 198 320 208 295 210 265 C 212 215 208 170 188 150 Z"
            fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Klatka piersiowa - żebra i tachypnoe -->
      <g class="${getZoneClass(station, 'klatka_pluca', selectedZoneObj)}" data-zone-id="klatka_pluca">
        <path d="M 150 162 L 150 210" stroke="var(--teal)" stroke-width="1.8" stroke-opacity="0.45"/>
        <path d="M 134 182 Q 150 178 166 182" stroke="var(--teal)" stroke-width="1.2" stroke-opacity="0.35" fill="none"/>
        <path d="M 130 198 Q 150 194 170 198" stroke="var(--teal)" stroke-width="1.2" stroke-opacity="0.35" fill="none"/>
        <path d="M 132 214 Q 150 210 168 214" stroke="var(--teal)" stroke-width="1.2" stroke-opacity="0.35" fill="none"/>
      </g>

      <!-- Pieluszka (diaper) -->
      <g class="${getZoneClass(station, 'moczoplciowe', selectedZoneObj)}" data-zone-id="moczoplciowe">
        <path d="M 98 285 C 100 330 200 330 202 285 L 208 265 L 92 265 Z" fill="rgba(255,255,255,0.88)" stroke="var(--teal)" stroke-width="2"/>
        <path d="M 98 272 L 115 276" stroke="var(--teal)" stroke-width="2"/>
        <path d="M 202 272 L 185 276" stroke="var(--teal)" stroke-width="2"/>
      </g>

      <!-- Szyja niemowlęcia -->
      <path class="${getZoneClass(station, 'szyja_opony', selectedZoneObj)}" data-zone-id="szyja_opony"
            d="M 132 138 L 132 150 L 168 150 L 168 138 Z" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Główka niemowlęcia -->
      <g class="${getZoneClass(station, 'glowa_ciemie', selectedZoneObj)}" data-zone-id="glowa_ciemie">
        <ellipse cx="150" cy="85" rx="52" ry="54" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <!-- Uszka -->
        <ellipse cx="98" cy="85" rx="6" ry="10" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2"/>
        <ellipse cx="202" cy="85" rx="6" ry="10" fill="url(#infantSkin)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Buzia: zgaszony wyraz, zamknięte powieki -->
        <path d="M 126 84 Q 134 89 142 84" stroke="var(--teal)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 158 84 Q 166 89 174 84" stroke="var(--teal)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 150 91 Q 152 96 148 97" stroke="var(--teal)" stroke-width="1.5" fill="none"/>
        <path d="M 142 107 Q 150 113 158 107" stroke="var(--teal)" stroke-width="2" fill="none" stroke-linecap="round"/>

        <!-- Ciemiączko przednie (Fontanelle) -->
        ${ciemieDone ? `
          <!-- Zapadnięte ciemiączko -->
          <polygon points="150,56 158,68 150,80 142,68" fill="rgba(194,59,42,0.35)" stroke="var(--red)" stroke-width="2.2"/>
          <path d="M 146 68 L 154 68 M 150 64 L 150 72" stroke="var(--red)" stroke-width="1.8"/>
          <g class="osce-finding-badge-svg">
            <rect x="75" y="34" width="150" height="18" rx="9" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
            <text x="150" y="46" font-size="8" font-weight="800" text-anchor="middle" fill="var(--red)">⚠️ Zapadnięte ciemię (-3 mm)</text>
          </g>
        ` : `
          <polygon points="150,56 158,68 150,80 142,68" fill="rgba(12,122,133,0.2)" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="2 2"/>
        `}
      </g>

      <!-- DYNAMICZNE ZNALEZISKA KLINICZNE NA SYLWETCE -->
      ${oczyDone ? `
        <g class="osce-finding-badge-svg">
          <circle cx="134" cy="85" r="9" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="2 2"/>
          <circle cx="166" cy="85" r="9" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="2 2"/>
          <rect x="70" y="98" width="160" height="17" rx="8.5" fill="var(--surface)" stroke="var(--teal)" stroke-width="1.5"/>
          <text x="150" y="110" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--teal)">Zapadnięte gałki · Płacz bez łez</text>
        </g>
      ` : ''}

      ${sluzowkiDone ? `
        <g class="osce-finding-badge-svg">
          <rect x="75" y="118" width="150" height="16" rx="8" fill="var(--surface)" stroke="var(--amber)" stroke-width="1.5"/>
          <text x="150" y="129" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--amber)">Suche spierzchnięte śluzówki</text>
        </g>
      ` : ''}

      ${crtDone ? `
        <g class="osce-finding-badge-svg">
          <circle cx="150" cy="180" r="10" fill="rgba(194,59,42,0.25)" stroke="var(--red)" stroke-width="2"/>
          <rect x="85" y="165" width="130" height="17" rx="8.5" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
          <text x="150" y="177" font-size="7.8" font-weight="800" text-anchor="middle" fill="var(--red)">CRT 4.0s (wstrząs!)</text>
        </g>
      ` : ''}

      ${faldDone ? `
        <g class="osce-finding-badge-svg">
          <path d="M 120 238 Q 135 214 150 238" stroke="var(--amber)" stroke-width="3.5" fill="none"/>
          <rect x="65" y="210" width="170" height="17" rx="8.5" fill="var(--surface)" stroke="var(--amber)" stroke-width="1.5"/>
          <text x="150" y="222" font-size="7.8" font-weight="800" text-anchor="middle" fill="var(--amber)">Fałd >2.5s (skrajne odwodnienie)</text>
        </g>
      ` : ''}

      ${pieluchaDone ? `
        <g class="osce-finding-badge-svg">
          <rect x="75" y="295" width="150" height="18" rx="9" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
          <text x="150" y="307" font-size="7.8" font-weight="800" text-anchor="middle" fill="var(--red)">Pieluszka sucha (Anuria >12h)</text>
        </g>
      ` : ''}
    ` : `
      <!-- WIDOK OD TYŁU (POSTERIOR / GRZBIET) -->
      <!-- Tył główki (potylica) i kark -->
      <g class="${getZoneClass(station, 'szyja_opony', selectedZoneObj)}" data-zone-id="szyja_opony">
        <ellipse cx="150" cy="85" rx="52" ry="54" fill="url(#infantSkinBack)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 125 115 Q 150 125 175 115" stroke="var(--teal)" stroke-width="2" fill="none"/>
        <!-- Kark i objawy oponowe -->
        <rect x="80" y="128" width="140" height="18" rx="9" fill="var(--surface)" stroke="var(--green)" stroke-width="1.5"/>
        <text x="150" y="140" font-size="7.8" font-weight="800" text-anchor="middle" fill="var(--green)">✓ Kark wiotki · Oponowe (-)</text>
      </g>

      <!-- Kręgosłup i łopatki -->
      <g class="${getZoneClass(station, 'klatka_pluca', selectedZoneObj)}" data-zone-id="klatka_pluca">
        <!-- Grzbiet niemowlęcia -->
        <path d="M 112 150 C 92 170 88 215 90 265 C 92 295 102 320 115 325 L 185 325 C 198 320 208 295 210 265 C 212 215 208 170 188 150 Z"
              fill="url(#infantSkinBack)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Linia kręgosłupa -->
        <path d="M 150 155 L 150 280" stroke="var(--teal)" stroke-width="2" stroke-dasharray="3 3" opacity="0.6"/>
        <!-- Łopatki -->
        <path d="M 122 175 Q 130 190 120 205" stroke="var(--teal)" stroke-width="1.8" fill="none" opacity="0.5"/>
        <path d="M 178 175 Q 170 190 180 205" stroke="var(--teal)" stroke-width="1.8" fill="none" opacity="0.5"/>
        <text x="150" y="195" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Pola płucne od tyłu czyste</text>
      </g>

      <!-- Tył pieluszki -->
      <g class="${getZoneClass(station, 'moczoplciowe', selectedZoneObj)}" data-zone-id="moczoplciowe">
        <path d="M 96 280 C 100 330 200 330 204 280 L 208 265 L 92 265 Z" fill="rgba(255,255,255,0.88)" stroke="var(--teal)" stroke-width="2"/>
        ${pieluchaDone ? `
          <rect x="80" y="295" width="140" height="18" rx="9" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
          <text x="150" y="307" font-size="7.8" font-weight="800" text-anchor="middle" fill="var(--red)">Pieluszka sucha (Anuria)</text>
        ` : ''}
      </g>

      <!-- Tył nóżek i piętki -->
      <g class="${getZoneClass(station, 'skora_turgor', selectedZoneObj)}" data-zone-id="skora_turgor">
        <path d="M 115 315 C 80 330 65 365 75 395 C 82 412 100 415 110 398 C 118 378 126 350 134 330 Z" fill="url(#infantSkinBack)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 185 315 C 220 330 235 365 225 395 C 218 412 200 415 190 398 C 182 378 174 350 166 330 Z" fill="url(#infantSkinBack)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="88" cy="402" rx="12" ry="7" transform="rotate(-15 88 402)" fill="url(#infantSkinBack)" stroke="var(--teal)" stroke-width="2"/>
        <ellipse cx="212" cy="402" rx="12" ry="7" transform="rotate(15 212 402)" fill="url(#infantSkinBack)" stroke="var(--teal)" stroke-width="2"/>
        <text x="150" y="425" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Skóra marmurkowata obwodowo</text>
      </g>
    `}
  </svg>`;
}

function renderAcuteAbdomenChildSvg(station, selectedZoneObj, viewMode = 'front') {
  const isBack = viewMode === 'back';
  const perf = (OSCE_ACTIVE && OSCE_ACTIVE.performedManeuvers) ? OSCE_ACTIVE.performedManeuvers : new Set();
  const mcburneyDone = perf.has('m_mcburney');
  const blumbergDone = perf.has('m_blumberg');
  const defenseDone = perf.has('m_obrona_miesniowa');
  const peristalsisDone = perf.has('m_osluch_brzucha');
  const mosznaDone = perf.has('m_moszna');
  const goldflamDone = perf.has('m_goldflam');
  const lungsDone = perf.has('m_osluch_pluc_dol');
  const throatDone = perf.has('m_gardlo_wyrostek');

  return `<svg class="osce-silhouette-svg" viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sylwetka chłopca z ostrym brzuchem">
    <defs>
      <linearGradient id="boySkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.07"/>
        <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.17"/>
      </linearGradient>
    </defs>

    <!-- Kozetka lekarska -->
    <rect x="18" y="10" width="264" height="460" rx="20" fill="rgba(12,122,133,0.02)" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 4"/>

    ${!isBack ? `
      <!-- WIDOK Z PRZODU (ANTERIOR) -->
      <!-- Ramiona i ręce -->
      <path class="${getZoneClass(station, 'serce', selectedZoneObj)}" data-zone-id="serce"
            d="M 96 140 C 78 175 68 230 65 285 C 64 300 78 305 84 292 C 90 250 96 195 102 165 Z"
            fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="72" cy="298" r="8" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
      <path class="${getZoneClass(station, 'serce', selectedZoneObj)}" data-zone-id="serce"
            d="M 204 140 C 222 175 232 230 235 285 C 236 300 222 305 216 292 C 210 250 204 195 198 165 Z"
            fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="228" cy="298" r="8" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Nogi - Prawa noga w lekkim zgięciu antalgicznym (objaw Jaworskiego) -->
      <g class="${getZoneClass(station, 'skora_konczyny', selectedZoneObj)}" data-zone-id="skora_konczyny">
        <path d="M 104 290 L 100 375 L 102 435 C 102 448 88 450 86 438 L 88 375 L 94 290 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="94" cy="442" rx="14" ry="7" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Prawa noga (podkurczona) -->
        <path d="M 196 290 L 202 368 L 194 430 C 194 445 208 448 212 435 L 214 368 L 206 290 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="204" cy="438" rx="14" ry="7" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
      </g>

      <!-- Spodenki medyczne -->
      <g class="${getZoneClass(station, 'narzady_plciowe', selectedZoneObj)}" data-zone-id="narzady_plciowe">
        <path d="M 94 250 L 88 295 L 140 295 L 150 270 L 160 295 L 212 295 L 206 250 Z" fill="rgba(255,255,255,0.88)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Moszna i jądra -->
        <ellipse cx="150" cy="285" rx="14" ry="11" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="1.8"/>
        ${mosznaDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="75" y="295" width="150" height="17" rx="8.5" fill="var(--surface)" stroke="var(--green)" stroke-width="1.5"/>
            <text x="150" y="307" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--green)">✓ Jądra w mosznie (brak skrętu)</text>
          </g>
        ` : ''}
      </g>

      <!-- Tułów - klatka piersiowa i brzuch -->
      <path class="${getZoneClass(station, 'brzuch_palpacja', selectedZoneObj)}" data-zone-id="brzuch_palpacja"
            d="M 98 140 C 90 180 92 225 96 255 L 204 255 C 208 225 210 180 202 140 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>

      <!-- Klatka piersiowa -->
      <g class="${getZoneClass(station, 'klatka_pluca', selectedZoneObj)}" data-zone-id="klatka_pluca">
        <path d="M 112 145 Q 132 150 148 146" stroke="var(--teal)" stroke-width="1.8" fill="none" opacity="0.6"/>
        <path d="M 188 145 Q 168 150 152 146" stroke="var(--teal)" stroke-width="1.8" fill="none" opacity="0.6"/>
        <path d="M 150 148 L 150 192" stroke="var(--teal)" stroke-width="1.5" opacity="0.4"/>
        ${lungsDone ? `
          <text x="150" y="165" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Dolne płaty płuc czyste</text>
        ` : ''}
      </g>

      <!-- Jama brzuszna - kwadranty i znaleziska wyrostka -->
      <g class="${getZoneClass(station, 'brzuch_ogladanie', selectedZoneObj)}" data-zone-id="brzuch_ogladanie">
        <!-- Pępek -->
        <circle cx="150" cy="235" r="2.5" fill="var(--teal)" opacity="0.7"/>
        <!-- Dyskretne linie kwadrantów -->
        <line x1="150" y1="205" x2="150" y2="255" stroke="var(--teal)" stroke-width="1" stroke-dasharray="2 2" opacity="0.3"/>
        <line x1="105" y1="235" x2="195" y2="235" stroke="var(--teal)" stroke-width="1" stroke-dasharray="2 2" opacity="0.3"/>

        <!-- Prawy dół biodrowy (Punkt McBurneya) -->
        <circle cx="180" cy="246" r="4" fill="var(--teal)" opacity="0.5"/>
        <text x="180" y="240" font-size="6.5" font-weight="700" text-anchor="middle" fill="var(--ink-muted)">McB</text>

        ${mcburneyDone ? `
          <circle cx="180" cy="246" r="15" fill="rgba(194,59,42,0.3)" stroke="var(--red)" stroke-width="2.5" class="osce-pulse-ring"/>
          <circle cx="180" cy="246" r="5" fill="var(--red)"/>
          <g class="osce-finding-badge-svg">
            <rect x="110" y="222" width="85" height="16" rx="8" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
            <text x="152" y="233" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--red)">⚡ McBurney (+)</text>
          </g>
        ` : ''}

        ${blumbergDone ? `
          <path d="M 160 248 Q 180 234 200 248 Q 180 262 160 248" fill="rgba(194,59,42,0.2)" stroke="var(--red)" stroke-width="2"/>
          <g class="osce-finding-badge-svg">
            <rect x="115" y="258" width="85" height="16" rx="8" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
            <text x="157" y="269" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--red)">💥 Blumberg (+)</text>
          </g>
        ` : ''}

        ${defenseDone ? `
          <rect x="165" y="215" width="32" height="40" rx="4" fill="rgba(217,119,6,0.2)" stroke="var(--amber)" stroke-width="1.8" stroke-dasharray="3 3"/>
          <text x="181" y="210" font-size="7" font-weight="800" text-anchor="middle" fill="var(--amber)">Obrona powłok</text>
        ` : ''}

        ${peristalsisDone ? `
          <text x="122" y="246" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Leniwa perystaltyka 🩺</text>
        ` : ''}
      </g>

      <!-- Szyja i główka -->
      <path class="${getZoneClass(station, 'glowa_gardlo', selectedZoneObj)}" data-zone-id="glowa_gardlo"
            d="M 136 115 L 136 138 L 164 138 L 164 115 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
      <g class="${getZoneClass(station, 'glowa_gardlo', selectedZoneObj)}" data-zone-id="glowa_gardlo">
        <ellipse cx="150" cy="75" rx="42" ry="46" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 112 70 C 112 45 130 35 150 35 C 170 35 188 45 188 70 C 180 55 165 50 150 50 C 135 50 120 55 112 70 Z" fill="var(--teal)" opacity="0.25"/>
        <ellipse cx="108" cy="75" rx="5" ry="8" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
        <ellipse cx="192" cy="75" rx="5" ry="8" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Buzia cierpiąca (ból brzucha) -->
        <circle cx="136" cy="72" r="2.5" fill="var(--teal)"/>
        <circle cx="164" cy="72" r="2.5" fill="var(--teal)"/>
        <path d="M 150 77 L 148 83 L 152 83" stroke="var(--teal)" stroke-width="1.5" fill="none"/>
        <path d="M 142 96 Q 150 90 158 96" stroke="var(--teal)" stroke-width="2" fill="none" stroke-linecap="round"/>
        ${throatDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="75" y="24" width="150" height="16" rx="8" fill="var(--surface)" stroke="var(--teal)" stroke-width="1.5"/>
            <text x="150" y="35" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--teal)">Gardło blade · Brak acetonu</text>
          </g>
        ` : ''}
      </g>
    ` : `
      <!-- WIDOK OD TYŁU (POSTERIOR / PLECY) -->
      <g class="${getZoneClass(station, 'glowa_gardlo', selectedZoneObj)}" data-zone-id="glowa_gardlo">
        <ellipse cx="150" cy="75" rx="42" ry="46" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 110 75 C 110 40 130 32 150 32 C 170 32 190 40 190 75 Z" fill="var(--teal)" opacity="0.3"/>
      </g>
      <path d="M 136 115 L 136 138 L 164 138 L 164 115 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Grzbiet i lędźwie -->
      <g class="${getZoneClass(station, 'brzuch_palpacja', selectedZoneObj)}" data-zone-id="brzuch_palpacja">
        <path d="M 98 140 C 90 180 92 225 96 255 L 204 255 C 208 225 210 180 202 140 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 150 145 L 150 255" stroke="var(--teal)" stroke-width="2" stroke-dasharray="3 3" opacity="0.6"/>

        <!-- Kąty kręgowo-żebrowe / objaw Goldflama -->
        <circle cx="125" cy="225" r="10" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="2 2"/>
        <circle cx="175" cy="225" r="10" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="2 2"/>
        ${goldflamDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="75" y="215" width="150" height="18" rx="9" fill="var(--surface)" stroke="var(--green)" stroke-width="1.5"/>
            <text x="150" y="227" font-size="7.8" font-weight="800" text-anchor="middle" fill="var(--green)">✓ Objaw Goldflama (-) obustronnie</text>
          </g>
        ` : `
          <text x="150" y="228" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--ink-muted)">Badanie kątów lędźwiowych (Goldflam)</text>
        `}
      </g>

      <!-- Pośladki bez plamicy -->
      <g class="${getZoneClass(station, 'skora_konczyny', selectedZoneObj)}" data-zone-id="skora_konczyny">
        <path d="M 94 255 L 88 300 C 115 315 185 315 212 300 L 206 255 Z" fill="rgba(255,255,255,0.88)" stroke="var(--teal)" stroke-width="2"/>
        <path d="M 104 300 L 100 375 L 102 435 C 102 448 88 450 86 438 L 88 375 L 94 300 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="94" cy="442" rx="14" ry="7" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
        <path d="M 196 300 L 200 375 L 198 435 C 198 448 212 450 214 438 L 212 375 L 206 300 Z" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="206" cy="442" rx="14" ry="7" fill="url(#boySkin)" stroke="var(--teal)" stroke-width="2"/>
        <text x="150" y="325" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Skóra pośladków czysta (brak wykwitów IgAV)</text>
      </g>
    `}
  </svg>`;
}

function renderCroupToddlerSvg(station, selectedZoneObj, viewMode = 'front') {
  const isBack = viewMode === 'back';
  const perf = (OSCE_ACTIVE && OSCE_ACTIVE.performedManeuvers) ? OSCE_ACTIVE.performedManeuvers : new Set();
  const patDone = perf.has('m_pat_ocena');
  const stridorDone = perf.has('m_stridor_ocena');
  const retractionsDone = perf.has('m_zaciaganie_retractions');
  const mouthDone = perf.has('m_ogladanie_bezinwazyjne');
  const auscultDone = perf.has('m_osluch_pluc_krup');

  return `<svg class="osce-silhouette-svg" viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sylwetka dziewczynki w ramionach matki">
    <defs>
      <linearGradient id="toddlerSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.18"/>
      </linearGradient>
      <linearGradient id="motherArms" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.10"/>
      </linearGradient>
    </defs>

    <!-- RAMIONA MATKI (Zalecenie PALS - minimalizacja lęku) -->
    <path d="M 40 180 C 20 220 25 320 60 360 C 95 400 205 400 240 360 C 275 320 280 220 260 180" fill="url(#motherArms)" stroke="var(--line)" stroke-width="2" stroke-dasharray="3 3"/>
    <text x="150" y="465" font-size="8.5" font-weight="800" text-anchor="middle" fill="var(--teal)">🤱 Bezpieczna pozycja w ramionach matki (PALS)</text>

    ${!isBack ? `
      <!-- WIDOK Z PRZODU (ANTERIOR) -->
      <!-- Siedząca dziewczynka (Zosia, 3 lata) -->
      <!-- Nóżki w pozycji siedzącej na kolanach -->
      <g class="${getZoneClass(station, 'brzuch_spokoj', selectedZoneObj)}" data-zone-id="brzuch_spokoj">
        <path d="M 100 280 C 85 315 75 350 78 385 C 80 398 95 400 102 388 C 108 365 116 335 122 300 Z" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="85" cy="392" rx="12" ry="7" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2"/>
        <path d="M 200 280 C 215 315 225 350 222 385 C 220 398 205 400 198 388 C 192 365 184 335 178 300 Z" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="215" cy="392" rx="12" ry="7" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Sukienka / ubranko dziewczęce -->
        <path d="M 102 210 L 80 290 L 220 290 L 198 210 Z" fill="rgba(12,122,133,0.12)" stroke="var(--teal)" stroke-width="2"/>
      </g>

      <!-- Tułów i klatka piersiowa dziewczynki -->
      <path class="${getZoneClass(station, 'klatka_oddech', selectedZoneObj)}" data-zone-id="klatka_oddech"
            d="M 108 140 C 100 165 102 190 104 220 L 196 220 C 198 190 200 165 192 140 Z" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2.5"/>

      <!-- Dołek jarzmowy i zaciąganie mostka -->
      <g class="${getZoneClass(station, 'klatka_oddech', selectedZoneObj)}" data-zone-id="klatka_oddech">
        <!-- Dołek jarzmowy (wcięcie szyjne) -->
        <path d="M 142 138 Q 150 144 158 138" stroke="var(--teal)" stroke-width="2.2" fill="none"/>
        <polygon points="150,140 146,134 154,134" fill="var(--red)"/>
        <!-- Mostek i żebra -->
        <path d="M 150 145 L 150 195" stroke="var(--teal)" stroke-width="1.8" stroke-opacity="0.5"/>
        <path d="M 134 165 Q 150 160 166 165" stroke="var(--teal)" stroke-width="1.4" stroke-opacity="0.4" fill="none"/>
        <path d="M 130 180 Q 150 175 170 180" stroke="var(--teal)" stroke-width="1.4" stroke-opacity="0.4" fill="none"/>

        ${retractionsDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="65" y="152" width="170" height="18" rx="9" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
            <text x="150" y="164" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--red)">Zaciąganie dołka jarzmowego i klatki</text>
          </g>
        ` : ''}

        ${auscultDone ? `
          <text x="150" y="200" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Przewodzenie stridoru nad płuca</text>
        ` : ''}
      </g>

      <!-- Szyja i krtań (Podgłośniowe zwężenie) -->
      <g class="${getZoneClass(station, 'szyja_stridor', selectedZoneObj)}" data-zone-id="szyja_stridor">
        <path d="M 138 115 L 138 138 L 162 138 L 162 115 Z" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Krtań z obrzękiem podgłośniowym (lejek krtaniowy) -->
        <polygon points="144,118 156,118 152,130 148,130" fill="rgba(194,59,42,0.3)" stroke="var(--red)" stroke-width="1.8"/>

        <!-- Fale akustyczne stridoru wdechowego -->
        ${stridorDone ? `
          <path d="M 124 116 Q 114 125 124 134" stroke="var(--amber)" stroke-width="2" fill="none"/>
          <path d="M 117 111 Q 104 125 117 139" stroke="var(--amber)" stroke-width="2.5" fill="none"/>
          <path d="M 176 116 Q 186 125 176 134" stroke="var(--amber)" stroke-width="2" fill="none"/>
          <path d="M 183 111 Q 196 125 183 139" stroke="var(--amber)" stroke-width="2.5" fill="none"/>
          <g class="osce-finding-badge-svg">
            <rect x="70" y="98" width="160" height="18" rx="9" fill="var(--surface)" stroke="var(--amber)" stroke-width="1.5"/>
            <text x="150" y="110" font-size="7.8" font-weight="800" text-anchor="middle" fill="var(--amber)">🗣️ Stridor wdechowy w spoczynku</text>
          </g>
        ` : ''}
      </g>

      <!-- Głowa dziewczynki (Zosia) -->
      <g class="${getZoneClass(station, 'jama_ustna_szpatulka', selectedZoneObj)}" data-zone-id="jama_ustna_szpatulka">
        <ellipse cx="150" cy="72" rx="38" ry="42" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <!-- Fryzura dziewczęca z kucykami -->
        <path d="M 116 65 C 116 40 132 30 150 30 C 168 30 184 40 184 65 C 176 52 165 48 150 48 C 135 48 124 52 116 65 Z" fill="var(--teal)" opacity="0.25"/>
        <!-- Kucyki z kokardkami -->
        <ellipse cx="110" cy="52" rx="7" ry="11" fill="var(--teal)" opacity="0.3"/>
        <circle cx="112" cy="62" r="3" fill="var(--red)"/>
        <ellipse cx="190" cy="52" rx="7" ry="11" fill="var(--teal)" opacity="0.3"/>
        <circle cx="188" cy="62" r="3" fill="var(--red)"/>

        <!-- Buzia dziecka (lekko uchylona do oddechu) -->
        <circle cx="138" cy="70" r="2.5" fill="var(--teal)"/>
        <circle cx="162" cy="70" r="2.5" fill="var(--teal)"/>
        <path d="M 150 74 L 148 79 L 152 79" stroke="var(--teal)" stroke-width="1.5" fill="none"/>
        <ellipse cx="150" cy="88" rx="6" ry="4" fill="rgba(194,59,42,0.2)" stroke="var(--teal)" stroke-width="1.8"/>

        ${mouthDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="75" y="20" width="150" height="17" rx="8.5" fill="var(--surface)" stroke="var(--green)" stroke-width="1.5"/>
            <text x="150" y="32" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--green)">Połyka ślinę · Brak ślinotoku</text>
          </g>
        ` : ''}

        ${patDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="70" y="38" width="160" height="16" rx="8" fill="var(--surface)" stroke="var(--teal)" stroke-width="1.5"/>
            <text x="150" y="49" font-size="7.2" font-weight="800" text-anchor="middle" fill="var(--teal)">PAT: Wzmożona praca oddechowa</text>
          </g>
        ` : ''}
      </g>
    ` : `
      <!-- WIDOK OD TYŁU (POSTERIOR) -->
      <!-- Dziewczynka wtulona w matkę od tyłu -->
      <g class="${getZoneClass(station, 'ogladanie_pat', selectedZoneObj)}" data-zone-id="ogladanie_pat">
        <ellipse cx="150" cy="72" rx="38" ry="42" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 114 70 C 114 38 132 30 150 30 C 168 30 186 38 186 70 Z" fill="var(--teal)" opacity="0.3"/>
        <ellipse cx="110" cy="52" rx="7" ry="11" fill="var(--teal)" opacity="0.3"/>
        <ellipse cx="190" cy="52" rx="7" ry="11" fill="var(--teal)" opacity="0.3"/>
      </g>

      <!-- Plecy i osłuchiwanie pól płucnych -->
      <g class="${getZoneClass(station, 'klatka_oddech', selectedZoneObj)}" data-zone-id="klatka_oddech">
        <path d="M 108 140 C 100 165 102 190 104 220 L 196 220 C 198 190 200 165 192 140 Z" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 150 145 L 150 220" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.6"/>
        <circle cx="128" cy="175" r="9" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="2 2"/>
        <circle cx="172" cy="175" r="9" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-dasharray="2 2"/>
        <rect x="75" y="165" width="150" height="18" rx="9" fill="var(--surface)" stroke="var(--teal)" stroke-width="1.5"/>
        <text x="150" y="177" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Osłuchowo: Przewodzenie stridoru</text>
      </g>

      <!-- Tył sukienki i stópki -->
      <g class="${getZoneClass(station, 'brzuch_spokoj', selectedZoneObj)}" data-zone-id="brzuch_spokoj">
        <path d="M 102 210 L 80 290 L 220 290 L 198 210 Z" fill="rgba(12,122,133,0.12)" stroke="var(--teal)" stroke-width="2"/>
        <ellipse cx="85" cy="392" rx="12" ry="7" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2"/>
        <ellipse cx="215" cy="392" rx="12" ry="7" fill="url(#toddlerSkin)" stroke="var(--teal)" stroke-width="2"/>
      </g>
    `}
  </svg>`;
}

function renderIgavChildSvg(station, selectedZoneObj, viewMode = 'front') {
  const isBack = viewMode === 'back';
  const perf = (OSCE_ACTIVE && OSCE_ACTIVE.performedManeuvers) ? OSCE_ACTIVE.performedManeuvers : new Set();
  const purpuraDone = perf.has('m_purpura_palpabilis');
  const jointsDone = perf.has('m_stawy_badanie');
  const bpDone = perf.has('m_pomiar_rr');
  const urineDone = perf.has('m_mocz_stix');
  const abdDone = perf.has('m_brzuch_palpacja_igav');

  return `<svg class="osce-silhouette-svg" viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sylwetka pacjenta z plamicą Schönleina-Henocha (IgAV)">
    <defs>
      <linearGradient id="olderChildSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.15"/>
      </linearGradient>
    </defs>

    <!-- Tło sali gabinetu -->
    <rect x="18" y="10" width="264" height="460" rx="20" fill="rgba(12,122,133,0.02)" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 4"/>

    ${!isBack ? `
      <!-- WIDOK Z PRZODU (ANTERIOR) -->
      <!-- Ramię lewe z MANKIETEM CIŚNIENIOMIERZA (RR) -->
      <g class="${getZoneClass(station, 'cisnienie_tetnicze', selectedZoneObj)}" data-zone-id="cisnienie_tetnicze">
        <path d="M 96 140 C 78 175 68 230 65 285 C 64 300 78 305 84 292 C 90 250 96 195 102 165 Z"
              fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <circle cx="72" cy="298" r="8" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Mankiet ciśnieniomierza na ramieniu -->
        <rect x="74" y="160" width="26" height="34" rx="4" fill="#1565c0" stroke="var(--teal)" stroke-width="2"/>
        <line x1="87" y1="194" x2="60" y2="215" stroke="#1565c0" stroke-width="2"/>
        ${bpDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="12" y="165" width="82" height="30" rx="6" fill="var(--surface)" stroke="var(--red)" stroke-width="2"/>
            <text x="53" y="177" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--red)">RR 128/82</text>
            <text x="53" y="188" font-size="6.8" font-weight="700" text-anchor="middle" fill="var(--red)">>95 pc (NT!)</text>
          </g>
        ` : ''}
      </g>

      <!-- Ramię prawe -->
      <path class="${getZoneClass(station, 'klatka_serce_pluca', selectedZoneObj)}" data-zone-id="klatka_serce_pluca"
            d="M 204 140 C 222 175 232 230 235 285 C 236 300 222 305 216 292 C 210 250 204 195 198 165 Z"
            fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
      <circle cx="228" cy="298" r="8" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Pasek moczu STIX (obok ręki) -->
      <g class="${getZoneClass(station, 'badanie_moczu_stix', selectedZoneObj)}" data-zone-id="badanie_moczu_stix">
        <rect x="238" y="240" width="10" height="70" rx="3" fill="#fff" stroke="var(--line)" stroke-width="1.5"/>
        <rect x="240" y="250" width="6" height="12" rx="1" fill="${urineDone ? '#1b5e20' : '#dcedc8'}"/>
        <rect x="240" y="268" width="6" height="12" rx="1" fill="${urineDone ? '#2e7d32' : '#fff9c4'}"/>
        ${urineDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="215" y="222" width="80" height="38" rx="6" fill="var(--surface)" stroke="var(--teal)" stroke-width="1.8"/>
            <text x="255" y="234" font-size="7.2" font-weight="800" text-anchor="middle" fill="var(--ink)">Mocz (stix):</text>
            <text x="255" y="244" font-size="6.8" font-weight="700" text-anchor="middle" fill="#1b5e20">Erytrocyty +++</text>
            <text x="255" y="253" font-size="6.8" font-weight="700" text-anchor="middle" fill="#2e7d32">Białko ++</text>
          </g>
        ` : ''}
      </g>

      <!-- Spodenki medyczne -->
      <path d="M 94 250 L 88 295 L 140 295 L 150 270 L 160 295 L 212 295 L 206 250 Z" fill="rgba(255,255,255,0.88)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Tułów i brzuch -->
      <g class="${getZoneClass(station, 'brzuch_igav', selectedZoneObj)}" data-zone-id="brzuch_igav">
        <path d="M 98 140 C 90 180 92 225 96 255 L 204 255 C 208 225 210 180 202 140 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <!-- Pępek -->
        <circle cx="150" cy="235" r="2.5" fill="var(--teal)" opacity="0.7"/>
        ${abdDone ? `
          <circle cx="150" cy="235" r="16" fill="rgba(217,119,6,0.18)" stroke="var(--amber)" stroke-width="1.8" stroke-dasharray="3 3"/>
          <g class="osce-finding-badge-svg">
            <rect x="75" y="215" width="150" height="17" rx="8.5" fill="var(--surface)" stroke="var(--amber)" stroke-width="1.5"/>
            <text x="150" y="227" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--amber)">Bóle okołopępkowe kurczowe</text>
          </g>
        ` : ''}
      </g>

      <!-- Klatka piersiowa czysta (brak wykwitów!) -->
      <g class="${getZoneClass(station, 'klatka_serce_pluca', selectedZoneObj)}" data-zone-id="klatka_serce_pluca">
        <path d="M 112 145 Q 132 150 148 146" stroke="var(--teal)" stroke-width="1.8" fill="none" opacity="0.6"/>
        <path d="M 188 145 Q 168 150 152 146" stroke="var(--teal)" stroke-width="1.8" fill="none" opacity="0.6"/>
        <text x="150" y="160" font-size="7" font-weight="700" text-anchor="middle" fill="var(--teal)">Tułów czysty (wyklucza posocznicę)</text>
      </g>

      <!-- Kończyny dolne z PURPURA PALPABILIS na podudziach i stopach -->
      <g class="${getZoneClass(station, 'skora_plamica', selectedZoneObj)}" data-zone-id="skora_plamica">
        <!-- Lewa noga -->
        <path d="M 104 290 L 100 375 L 102 435 C 102 448 88 450 86 438 L 88 375 L 94 290 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="94" cy="442" rx="14" ry="7" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>
        <!-- Prawa noga -->
        <path d="M 196 290 L 200 375 L 198 435 C 198 448 212 450 214 438 L 212 375 L 206 290 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="206" cy="442" rx="14" ry="7" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>

        <!-- Plamica uniesiona (purpura palpabilis) - fioletowe wykwity plamisto-grudkowe -->
        <!-- Lewa goleń i grzbiet stopy -->
        <circle cx="94" cy="360" r="3" fill="#800080"/>
        <circle cx="98" cy="370" r="2.5" fill="#9c27b0"/>
        <circle cx="92" cy="380" r="3.5" fill="#800080"/>
        <circle cx="96" cy="392" r="2.8" fill="#9c27b0"/>
        <circle cx="93" cy="405" r="3.2" fill="#800080"/>
        <circle cx="98" cy="415" r="2.5" fill="#9c27b0"/>
        <circle cx="90" cy="438" r="2.5" fill="#800080"/>
        <!-- Prawa goleń i grzbiet stopy -->
        <circle cx="206" cy="360" r="3" fill="#800080"/>
        <circle cx="202" cy="370" r="2.5" fill="#9c27b0"/>
        <circle cx="208" cy="380" r="3.5" fill="#800080"/>
        <circle cx="204" cy="392" r="2.8" fill="#9c27b0"/>
        <circle cx="207" cy="405" r="3.2" fill="#800080"/>
        <circle cx="202" cy="415" r="2.5" fill="#9c27b0"/>
        <circle cx="210" cy="438" r="2.5" fill="#800080"/>

        ${purpuraDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="65" y="340" width="170" height="18" rx="9" fill="var(--surface)" stroke="#800080" stroke-width="1.8"/>
            <text x="150" y="352" font-size="7.5" font-weight="800" text-anchor="middle" fill="#800080">🟣 Purpura palpabilis na podudziach</text>
          </g>
        ` : ''}
      </g>

      <!-- Stawy skokowe z obrzękiem -->
      <g class="${getZoneClass(station, 'stawy_skokowe', selectedZoneObj)}" data-zone-id="stawy_skokowe">
        <ellipse cx="95" cy="428" rx="14" ry="9" fill="rgba(194,59,42,0.18)" stroke="var(--red)" stroke-width="1.8"/>
        <ellipse cx="205" cy="428" rx="14" ry="9" fill="rgba(194,59,42,0.18)" stroke="var(--red)" stroke-width="1.8"/>
        ${jointsDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="70" y="445" width="160" height="18" rx="9" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
            <text x="150" y="457" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--red)">🦵 Obrzęk obu stawów skokowych</text>
          </g>
        ` : ''}
      </g>

      <!-- Szyja i głowa -->
      <g class="${getZoneClass(station, 'glowa_gardlo_igav', selectedZoneObj)}" data-zone-id="glowa_gardlo_igav">
        <path d="M 136 115 L 136 138 L 164 138 L 164 115 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>
        <ellipse cx="150" cy="75" rx="40" ry="44" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 114 68 C 114 42 130 34 150 34 C 170 34 186 42 186 68 C 178 54 165 48 150 48 C 135 48 122 54 114 68 Z" fill="var(--teal)" opacity="0.3"/>
        <circle cx="136" cy="74" r="2.5" fill="var(--teal)"/>
        <circle cx="164" cy="74" r="2.5" fill="var(--teal)"/>
        <path d="M 150 78 L 148 84 L 152 84" stroke="var(--teal)" stroke-width="1.5" fill="none"/>
        <path d="M 142 94 Q 150 99 158 94" stroke="var(--teal)" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
    ` : `
      <!-- WIDOK OD TYŁU (POSTERIOR) - KLUCZOWA DLA IGAV LOKALIZACJA NA POŚLADKACH -->
      <!-- Głowa i kark od tyłu -->
      <ellipse cx="150" cy="75" rx="40" ry="44" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
      <path d="M 112 75 C 112 40 130 32 150 32 C 170 32 188 40 188 75 Z" fill="var(--teal)" opacity="0.35"/>
      <path d="M 136 115 L 136 138 L 164 138 L 164 115 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>

      <!-- Grzbiet (czysty, bez plamicy) -->
      <g class="${getZoneClass(station, 'klatka_serce_pluca', selectedZoneObj)}" data-zone-id="klatka_serce_pluca">
        <path d="M 98 140 C 90 180 92 225 96 250 L 204 250 C 208 225 210 180 202 140 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 150 145 L 150 250" stroke="var(--teal)" stroke-width="2" stroke-dasharray="3 3" opacity="0.5"/>
        <rect x="75" y="160" width="150" height="18" rx="9" fill="var(--surface)" stroke="var(--teal)" stroke-width="1.5"/>
        <text x="150" y="172" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--teal)">Plecy czyste (brak wykwitów uogólnionych)</text>
      </g>

      <!-- POŚLADKI Z MASYWNĄ PLAMICĄ (PURPURA PALPABILIS) -->
      <g class="${getZoneClass(station, 'skora_plamica', selectedZoneObj)}" data-zone-id="skora_plamica">
        <!-- Pośladki -->
        <path d="M 96 250 C 90 280 110 310 150 310 C 190 310 210 280 204 250 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <path d="M 150 255 L 150 310" stroke="var(--teal)" stroke-width="2"/>

        <!-- Tył ud i podudzi -->
        <path d="M 104 305 L 100 375 L 102 435 C 102 448 88 450 86 438 L 88 375 L 96 305 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="94" cy="442" rx="14" ry="7" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>
        <path d="M 196 305 L 200 375 L 198 435 C 198 448 212 450 214 438 L 212 375 L 204 305 Z" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2.5"/>
        <ellipse cx="206" cy="442" rx="14" ry="7" fill="url(#olderChildSkin)" stroke="var(--teal)" stroke-width="2"/>

        <!-- GĘSTA, SYMETRYCZNA PLAMICA NA OBU POŚLADKACH I TYLE NÓG -->
        <!-- Lewy pośladek -->
        <circle cx="118" cy="270" r="3.5" fill="#800080"/>
        <circle cx="128" cy="265" r="2.8" fill="#9c27b0"/>
        <circle cx="138" cy="272" r="3.2" fill="#800080"/>
        <circle cx="122" cy="282" r="3.8" fill="#800080"/>
        <circle cx="134" cy="285" r="2.6" fill="#9c27b0"/>
        <circle cx="142" cy="295" r="3" fill="#800080"/>
        <circle cx="126" cy="298" r="3.4" fill="#9c27b0"/>
        <!-- Prawy pośladek -->
        <circle cx="182" cy="270" r="3.5" fill="#800080"/>
        <circle cx="172" cy="265" r="2.8" fill="#9c27b0"/>
        <circle cx="162" cy="272" r="3.2" fill="#800080"/>
        <circle cx="178" cy="282" r="3.8" fill="#800080"/>
        <circle cx="166" cy="285" r="2.6" fill="#9c27b0"/>
        <circle cx="158" cy="295" r="3" fill="#800080"/>
        <circle cx="174" cy="298" r="3.4" fill="#9c27b0"/>
        <!-- Tył ud i łydki -->
        <circle cx="96" cy="330" r="3.2" fill="#800080"/>
        <circle cx="94" cy="355" r="2.8" fill="#9c27b0"/>
        <circle cx="98" cy="380" r="3.5" fill="#800080"/>
        <circle cx="93" cy="405" r="3" fill="#9c27b0"/>
        <circle cx="204" cy="330" r="3.2" fill="#800080"/>
        <circle cx="206" cy="355" r="2.8" fill="#9c27b0"/>
        <circle cx="202" cy="380" r="3.5" fill="#800080"/>
        <circle cx="207" cy="405" r="3" fill="#9c27b0"/>

        <g class="osce-finding-badge-svg">
          <rect x="55" y="318" width="190" height="20" rx="10" fill="var(--surface)" stroke="#800080" stroke-width="1.8"/>
          <text x="150" y="331" font-size="7.8" font-weight="800" text-anchor="middle" fill="#800080">🟣 Masywna plamica na pośladkach (IgAV)!</text>
        </g>
      </g>

      <!-- Ścięgna Achillesa i tył stawów skokowych -->
      <g class="${getZoneClass(station, 'stawy_skokowe', selectedZoneObj)}" data-zone-id="stawy_skokowe">
        <ellipse cx="95" cy="428" rx="14" ry="9" fill="rgba(194,59,42,0.18)" stroke="var(--red)" stroke-width="1.8"/>
        <ellipse cx="205" cy="428" rx="14" ry="9" fill="rgba(194,59,42,0.18)" stroke="var(--red)" stroke-width="1.8"/>
        ${jointsDone ? `
          <g class="osce-finding-badge-svg">
            <rect x="70" y="445" width="160" height="18" rx="9" fill="var(--surface)" stroke="var(--red)" stroke-width="1.5"/>
            <text x="150" y="457" font-size="7.5" font-weight="800" text-anchor="middle" fill="var(--red)">Obrzęk okołostawowy kostek</text>
          </g>
        ` : ''}
      </g>
    `}
  </svg>`;
}

function renderChildSilhouetteSvg(station, selectedZoneObj, viewMode = 'front') {
  return renderAcuteAbdomenChildSvg(station, selectedZoneObj, viewMode);
}

function renderOscePatientSilhouette(station, selectedZoneObj, viewMode = 'front') {
  if (!station) return '';
  if (station.id === 'stacja-1-odwodnienie') {
    return renderInfantSilhouetteSvg(station, selectedZoneObj, viewMode);
  }
  if (station.id === 'stacja-2-brzuch') {
    return renderAcuteAbdomenChildSvg(station, selectedZoneObj, viewMode);
  }
  if (station.id === 'stacja-3-krup') {
    return renderCroupToddlerSvg(station, selectedZoneObj, viewMode);
  }
  if (station.id === 'stacja-4-igav') {
    return renderIgavChildSvg(station, selectedZoneObj, viewMode);
  }
  return renderChildSilhouetteSvg(station, selectedZoneObj, viewMode);
}

function startOsceStation(station) {
  OSCE_ACTIVE = {
    stationId: station.id,
    performedManeuvers: new Set(),
    performedQuestions: new Set(),
    performedOrder: [],
    viewMode: 'front',
    scaleExpanded: false,
    selectedZone: station.zones && station.zones[0] ? station.zones[0].id : null,
    activeTab: 'maneuvers', // 'maneuvers' | 'interview'
    reaction: (station.id === 'stacja-1-odwodnienie') ? 'lethargy' : (station.id === 'stacja-2-brzuch' ? 'pain' : (station.id === 'stacja-3-krup' ? 'cry' : 'normal')),
    currentVitals: { ...(station.patient.vitalsInitial || {}) },
    isComplication: false,
    complicationMessage: '',
    findings: [],
    fatalErrorsTriggered: 0,
    isFinished: false,
    synthesisDiagnosis: null,
    synthesisDifferentials: [],
    synthesisActions: [],
    score: null,
    startedAt: Date.now()
  };
}

function renderOsceStationList() {
  window.scrollTo(0, 0);

  const totalStations = (OSCE_STATIONS || []).length;
  const completedCount = Object.keys(ctx.S.osceCases || {}).length;
  const avgScore = completedCount > 0
    ? Math.round(Object.values(ctx.S.osceCases).reduce((acc, c) => acc + (c.score || 0), 0) / completedCount)
    : 0;

  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:1040px">
    <div class="eyebrow">Symulator kliniczny · Egzamin Praktyczny OSCE</div>
    <h2>Stacje Badania Fizykalnego i Status Praesens</h2>

    <div class="conn-tabs" role="tablist" style="margin-bottom:1.5rem">
      <button class="conn-tab-btn" data-ptab="sor" role="tab" aria-selected="false">🚨 SOR / Ostry Dyżur (${(ctx.patient.cases || []).length})</button>
      <button class="conn-tab-btn active" data-ptab="osce" role="tab" aria-selected="true">📋 Stacje OSCE / Badanie fizykalne (${totalStations})</button>
    </div>

    <p class="lead">Przyłóżkowy symulator badania fizykalnego u dzieci. Zbadaj pacjenta na wektorowej planszy manewr po manewrze, unikaj błędów krytycznych wywołujących załamanie parametrów i wygeneruj profesjonalny 9-punktowy raport Status Praesens wymagany na odprawach i egzaminie praktycznym.</p>

    <!-- Pasek statystyk OSCE -->
    <div class="hero-strip" style="margin-bottom:2rem">
      <div class="hero-stat">
        <span class="val">${totalStations}</span>
        <span class="lbl">Stacji OSCE</span>
      </div>
      <div class="hero-stat">
        <span class="val">${completedCount} / ${totalStations}</span>
        <span class="lbl">Zaliczonych</span>
      </div>
      <div class="hero-stat">
        <span class="val">${avgScore > 0 ? avgScore + '%' : '–'}</span>
        <span class="lbl">Średni wynik</span>
      </div>
      <div class="hero-stat">
        <span class="val">9 pkt</span>
        <span class="lbl">Wzorcowy Status Praesens</span>
      </div>
    </div>

    <!-- Lista stacji -->
    <div class="grid cols-2" style="gap:1.4rem">
      ${(OSCE_STATIONS || []).map(station => {
        const saved = (ctx.S.osceCases || {})[station.id];
        const isPassed = saved && saved.score >= 60;
        const totalKey = station.zones.flatMap(z => z.maneuvers).filter(m => m.isKey).length;
        const totalZones = station.zones.length;
        return `
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;border-top:4px solid var(--teal)">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;flex-wrap:wrap;gap:.4rem">
              <span class="badge" style="background:var(--teal);color:var(--on-accent);font-weight:800">STACJA ${station.number}</span>
              <span style="font-size:.82rem;color:var(--ink-muted);font-weight:700">Wiek: ${station.patient.age} · ${station.patient.gender === 'm' ? 'Chłopiec' : 'Dziewczynka'}</span>
            </div>
            <h3 style="margin-top:0;margin-bottom:.4rem"><a href="#/pacjent/osce/${station.id}">${station.title}</a></h3>
            <div style="font-size:.85rem;color:var(--teal);font-weight:700;margin-bottom:.6rem">🩺 ${station.topic}</div>
            <p style="font-size:.88rem;color:var(--ink-muted);line-height:1.45;margin-bottom:.9rem">${station.briefing.scenario}</p>

            <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem">
              <span class="badge" style="background:rgba(12,122,133,0.1);color:var(--teal)">📍 ${totalZones} stref anatomicznych</span>
              <span class="badge" style="background:rgba(12,122,133,0.1);color:var(--teal)">🔑 ${totalKey} manewrów kluczowych</span>
              <span class="badge" style="background:rgba(194,59,42,0.1);color:var(--red)">⚠️ Błędy krytyczne</span>
            </div>
          </div>

          <div style="border-top:1px solid var(--line-2);padding-top:.9rem;display:flex;align-items:center;justify-content:space-between">
            <div>
              ${saved ? `
                <span class="badge" style="background:${isPassed ? 'rgba(46,133,64,0.15)' : 'rgba(194,59,42,0.15)'};color:${isPassed ? 'var(--green)' : 'var(--red)'};font-weight:800">
                  ${isPassed ? '✅ ZALICZONE' : '❌ DO POPRAWY'}: ${saved.score}%
                </span>
              ` : `
                <span class="badge" style="background:var(--bg-card);color:var(--ink-muted)">Status: Nowa stacja</span>
              `}
            </div>
            <a href="#/pacjent/osce/${station.id}" class="btn btn-sm btn-primary">
              ${saved ? 'Powtórz badanie →' : 'Rozpocznij stację →'}
            </a>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div></section>`;

  $$('.conn-tab-btn[data-ptab]').forEach(b => {
    b.onclick = () => {
      if (b.dataset.ptab === 'osce') {
        location.hash = '#/pacjent?tab=osce';
      } else {
        location.hash = '#/pacjent';
      }
    };
  });
}

window.computeOsceScale = computeOsceScale;
window.validateOsceTechnique = validateOsceTechnique;
window.renderOsceScaleWidget = renderOsceScaleWidget;
function computeOsceScale(station) {
  if (!station || !station.scale) return null;
  const s = station.scale;
  let totalScore = 0;
  let itemsCount = s.items.length;
  let assessedCount = 0;

  const perfManeuvers = (typeof OSCE_ACTIVE !== "undefined" && OSCE_ACTIVE && OSCE_ACTIVE.performedManeuvers)
    ? OSCE_ACTIVE.performedManeuvers
    : (window.OSCE_ACTIVE && window.OSCE_ACTIVE.performedManeuvers ? window.OSCE_ACTIVE.performedManeuvers : new Set());
  const perfQuestions = (typeof OSCE_ACTIVE !== "undefined" && OSCE_ACTIVE && OSCE_ACTIVE.performedQuestions)
    ? OSCE_ACTIVE.performedQuestions
    : (window.OSCE_ACTIVE && window.OSCE_ACTIVE.performedQuestions ? window.OSCE_ACTIVE.performedQuestions : new Set());

  const itemResults = s.items.map(item => {
    let isAssessed = false;
    let earned = 0;

    if (item.triggerIntro || item.triggerVitals || item.triggerLab) {
      isAssessed = true;
      earned = item.score;
    } else {
      const maneuverHit = item.triggerManeuvers && item.triggerManeuvers.some(mId => perfManeuvers.has(mId));
      const questionHit = item.triggerQuestions && item.triggerQuestions.some(qIdx => perfQuestions.has(qIdx));
      if (maneuverHit || questionHit) {
        isAssessed = true;
        earned = item.score;
      }
    }

    if (isAssessed) {
      assessedCount++;
      totalScore += earned;
    }

    return {
      ...item,
      isAssessed,
      earned
    };
  });

  let currentInterp = s.interpretations[0];
  for (const interp of s.interpretations) {
    if (totalScore <= interp.max) {
      currentInterp = interp;
      break;
    }
    currentInterp = interp;
  }

  return {
    id: s.id,
    name: s.name,
    unit: s.unit || "pkt",
    maxScore: s.maxScore,
    currentScore: totalScore,
    assessedCount,
    totalItems: itemsCount,
    isComplete: assessedCount >= itemsCount,
    items: itemResults,
    interpretation: currentInterp
  };
}

function validateOsceTechnique(station) {
  const activeObj = (typeof OSCE_ACTIVE !== "undefined" && OSCE_ACTIVE) ? OSCE_ACTIVE : window.OSCE_ACTIVE;
  if (!activeObj || !activeObj.performedOrder) return null;
  const order = activeObj.performedOrder || [];

  if (station.id === "stacja-2-brzuch") {
    const hasAuscult = order.includes("m_osluch_brzucha");
    const hasPalpation = order.includes("m_mcburney") || order.includes("m_blumberg") || order.includes("m_obrona_miesniowa");
    if (hasAuscult && hasPalpation) {
      const idxAuscult = order.indexOf("m_osluch_brzucha");
      const idxPalp = Math.min(
        ...["m_mcburney", "m_blumberg", "m_obrona_miesniowa"].map(id => {
          const idx = order.indexOf(id);
          return idx === -1 ? 9999 : idx;
        })
      );
      if (idxAuscult < idxPalp) {
        return {
          type: "gold",
          badge: "🏅 Wzorcowa technika badania brzucha",
          text: "Osłuchano perystaltykę jelit przed bolesną palpacją i objawami otrzewnowymi. Zapobiegnięto odruchowemu wygaszeniu szmerów jelitowych."
        };
      } else {
        return {
          type: "tip",
          badge: "💡 Wskazówka techniki OSCE",
          text: "W ostrym brzuchu najpierw osłuchaj perystaltykę przez 1–2 minuty, a bolesną palpację prawego dołu biodrowego zostaw na sam koniec!"
        };
      }
    }
  }

  if (station.id === "stacja-3-krup") {
    const calmExam = order.includes("m_pat_ocena") || order.includes("m_ogladanie_bezinwazyjne") || order.includes("m_stridor_ocena");
    const avoidedSpatula = !(activeObj.performedManeuvers && activeObj.performedManeuvers.has("m_szpatulka_fatal"));
    if (calmExam && avoidedSpatula) {
      return {
        type: "gold",
        badge: "🏅 Złota zasada PALS w duszności krtaniowej",
        text: "Badanie przeprowadzone bez dotykania gardła szpatułką w objęciach matki – zapobiegnięto groźnemu skurczowi krtani i nagłemu bezdechowi."
      };
    }
  }

  if (station.id === "stacja-1-odwodnienie") {
    const hasCrt = order.includes("m_crt");
    const hasSkinFold = order.includes("m_fald_skorny");
    if (hasCrt && hasSkinFold) {
      return {
        type: "gold",
        badge: "🏅 Precyzyjna ocena hipowolemii",
        text: "Zbadano czas nawrotu kapilarnego CRT (4.0s) oraz fałd skórny (>2.5s) – dwa najczulsze parametry odwodnienia ciężkiego (>9% m.c.)."
      };
    }
  }

  if (station.id === "stacja-4-igav") {
    const hasBp = order.includes("m_pomiar_rr");
    const hasUrine = order.includes("m_mocz_stix");
    if (hasBp && hasUrine) {
      return {
        type: "gold",
        badge: "🏅 Złoty standard nefrologiczny w IgAV",
        text: "Zmierzono ciśnienie tętnicze (128/82 mmHg) oraz wykonano test paskowy moczu (krwinkomocz +++ i białkomocz ++) – wcześnie wykryto nefropatię IgA."
      };
    }
  }

  return null;
}

function renderOsceScaleWidget(station) {
  const scale = computeOsceScale(station);
  if (!scale) return "";

  const isExpanded = !!OSCE_ACTIVE.scaleExpanded;
  const techFeedback = validateOsceTechnique(station);

  return `
  <div class="card osce-scale-tray" style="margin-bottom:1.2rem;background:var(--surface);border:1px solid color-mix(in srgb, ${scale.interpretation.color} 45%, var(--line));box-shadow:inset 0 3px 0 0 ${scale.interpretation.color}">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.6rem">
      <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;min-width:0">
        <span class="badge" style="background:var(--surface-2);color:var(--ink);font-weight:800;font-size:.78rem">
          📊 PRZYŁÓŻKOWA SKALA
        </span>
        <b style="font-size:1rem;color:var(--ink)">${scale.name}</b>
        <span class="chip" style="background:color-mix(in srgb, ${scale.interpretation.color} 14%, transparent);color:${scale.interpretation.color};font-weight:800;border:1px solid color-mix(in srgb, ${scale.interpretation.color} 35%, transparent)">
          Wynik: ${scale.currentScore} / ${scale.maxScore} ${scale.unit}
        </span>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap">
        <span style="font-size:.82rem;font-weight:700;color:${scale.interpretation.color}">
          ${scale.interpretation.label}
        </span>
        <button type="button" class="btn btn-sm btn-subtle" id="btnToggleOsceScale" style="font-size:.78rem;padding:.2rem .6rem">
          ${isExpanded ? "Zwiń szczegóły ▲" : "Kryteria szczegółowe (" + scale.assessedCount + "/" + scale.totalItems + ") ▼"}
        </button>
      </div>
    </div>

    <!-- Pasek interpretacji klinicznej -->
    <div style="margin-top:.6rem;padding:.6rem .8rem;border-radius:6px;background:color-mix(in srgb, ${scale.interpretation.color} 10%, transparent);border:1px solid color-mix(in srgb, ${scale.interpretation.color} 28%, transparent);font-size:.84rem;line-height:1.45;color:var(--ink)">
      <b>💡 Wskazanie kliniczne:</b> ${scale.interpretation.tip}
    </div>

    ${techFeedback ? `
      <div style="margin-top:.6rem;padding:.55rem .8rem;border-radius:8px;background:${techFeedback.type === "gold" ? "rgba(217,119,6,0.1)" : "rgba(12,122,133,0.08)"};border:1px solid ${techFeedback.type === "gold" ? "rgba(184,115,15,0.32)" : "rgba(12,122,133,0.28)"};font-size:.82rem;line-height:1.4">
        <b style="color:${techFeedback.type === "gold" ? "var(--amber)" : "var(--teal)"}">${techFeedback.badge}:</b> ${techFeedback.text}
      </div>
    ` : ""}

    ${isExpanded ? `
      <div style="margin-top:.9rem;padding-top:.8rem;border-top:1px solid var(--line-2)">
        <div style="font-size:.78rem;font-weight:700;color:var(--ink-muted);text-transform:uppercase;margin-bottom:.5rem">
          Status poszczególnych składowych skali w badaniu:
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.5rem">
          ${scale.items.map(it => `
            <div style="padding:.5rem .7rem;border-radius:6px;background:var(--bg);border:1px solid ${it.isAssessed ? "var(--line)" : "var(--line-2)"};font-size:.8rem">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.2rem">
                <span style="font-weight:700;color:var(--ink)">${it.label}</span>
                <span class="chip" style="font-size:.7rem;padding:.1rem .35rem;background:${it.isAssessed ? "var(--teal-l)" : "var(--surface)"};color:${it.isAssessed ? "var(--teal-d)" : "var(--ink-muted)"};font-weight:700">
                  ${it.isAssessed ? "+" + it.earned + " pkt" : "⏳ Czeka"}
                </span>
              </div>
              <div style="color:${it.isAssessed ? "var(--teal)" : "var(--ink-muted)"};font-size:.76rem">
                ${it.isAssessed ? "✓ " + it.findingVal : "○ Wymaga zbadania odpowiedniej strefy"}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  </div>`;
}

function renderActiveOsceStation(station) {
  if (!OSCE_ACTIVE || OSCE_ACTIVE.stationId !== station.id) {
    startOsceStation(station);
  }

  // Obliczenia postępu
  const allManeuvers = station.zones.flatMap(z => z.maneuvers);
  const totalKey = allManeuvers.filter(m => m.isKey).length;
  const doneKey = allManeuvers.filter(m => m.isKey && OSCE_ACTIVE.performedManeuvers.has(m.id)).length;
  const progressPct = Math.round((doneKey / (totalKey || 1)) * 100);

  const selectedZoneObj = station.zones.find(z => z.id === OSCE_ACTIVE.selectedZone) || station.zones[0];
  const viewMode = OSCE_ACTIVE.viewMode || 'front';

  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:1120px">
    <!-- Nawigacja okruszkowa -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem">
      <div class="crumbs" style="margin:0">
        <a href="#/pacjent?tab=osce">← Stacje OSCE</a> / <span>${station.shortTitle}</span>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center">
        <button class="btn btn-sm" id="btnRestartOsce" title="Zresetuj stację i zacznij od początku">🔄 Od nowa</button>
        <button class="btn btn-sm btn-primary" id="btnFinishOsce">Zakończ badanie i sprawdź Status Praesens →</button>
      </div>
    </div>

    <!-- Pasek parametrów życiowych i pacjenta -->
    <div class="card" style="margin-bottom:1.2rem;background:var(--surface);border:1.5px solid var(--line);box-shadow:var(--shadow)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:.8rem">
        <div style="min-width:0;max-width:100%;flex:1 1 260px">
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;margin-bottom:.3rem">
            <span class="badge" style="background:var(--teal);color:var(--on-accent);font-weight:800;white-space:nowrap">STACJA ${station.number}</span>
            <h2 style="margin:0;font-size:1.3rem;min-width:0">${station.title}</h2>
          </div>
          <div style="font-size:.88rem;color:var(--ink-muted)">
            <b>Pacjent:</b> ${station.patient.name} (${station.patient.age}, ${station.patient.weight}) · <b>Rozpoznanie wstępne:</b> ${station.topic}
          </div>
          ${renderOsceImagingBadge(station.id)}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.3rem">
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-muted);text-transform:uppercase;letter-spacing:.05em">Reakcja kliniczna pacjenta:</div>
          <div>${getReactionBadge(OSCE_ACTIVE.reaction)}</div>
        </div>
      </div>

      <!-- Monitor parametrów życiowych pacjenta -->
      <div class="osce-vitals-monitor">
        <div class="vital-chip ${getVitalStatus('hr', parseInt(OSCE_ACTIVE.currentVitals.hr || '100'))}">
          <span class="v-lab">❤️ HR</span>
          <span class="v-val">${OSCE_ACTIVE.currentVitals.hr || '–'}<span class="v-unit">/min</span></span>
        </div>
        <div class="vital-chip ${getVitalStatus('rr', parseInt(OSCE_ACTIVE.currentVitals.rr || '25'))}">
          <span class="v-lab">💨 RR</span>
          <span class="v-val">${OSCE_ACTIVE.currentVitals.rr || '–'}<span class="v-unit">/min</span></span>
        </div>
        <div class="vital-chip">
          <span class="v-lab">🩸 RR (Ciśnienie)</span>
          <span class="v-val" style="font-size:1.05rem">${OSCE_ACTIVE.currentVitals.bp || '–'}<span class="v-unit">mmHg</span></span>
        </div>
        <div class="vital-chip ${getVitalStatus('temp', parseFloat(OSCE_ACTIVE.currentVitals.temp || '37'))}">
          <span class="v-lab">🌡️ Temp</span>
          <span class="v-val">${OSCE_ACTIVE.currentVitals.temp || '–'}</span>
        </div>
        <div class="vital-chip ${getVitalStatus('spo2', parseInt(OSCE_ACTIVE.currentVitals.spo2 || '100'))}">
          <span class="v-lab">🫁 SpO₂</span>
          <span class="v-val">${OSCE_ACTIVE.currentVitals.spo2 || '–'}</span>
        </div>
        <div class="vital-chip ${getVitalStatus('crt', parseFloat(OSCE_ACTIVE.currentVitals.crt || '1.5'))}">
          <span class="v-lab">⏱️ CRT</span>
          <span class="v-val">${OSCE_ACTIVE.currentVitals.crt || '–'}</span>
        </div>
      </div>

      <!-- Pasek postępu manewrów -->
      <div style="margin-top:.8rem">
        <div style="display:flex;justify-content:space-between;font-size:.8rem;font-weight:700;margin-bottom:.3rem">
          <span>Postęp badania fizykalnego: ${doneKey} z ${totalKey} manewrów kluczowych</span>
          <span>${progressPct}%</span>
        </div>
        <div style="height:7px;background:var(--line);border-radius:999px;overflow:hidden">
          <div style="width:${progressPct}%;height:100%;background:var(--teal);transition:width .3s ease"></div>
        </div>
      </div>
    </div>

    <!-- Przyłóżkowa Skala Diagnostyczna & Weryfikacja Techniki Badania -->
    ${renderOsceScaleWidget(station)}

    <!-- Alert błędu krytycznego i powikłania (jeśli wystąpiło) -->
    ${OSCE_ACTIVE.isComplication ? `
      <div class="osce-complication-card">
        <div style="display:flex;align-items:flex-start;gap:.8rem">
          <div style="font-size:1.8rem;line-height:1">🚨</div>
          <div style="flex:1">
            <h4 style="margin:0 0 .4rem 0;color:var(--red);font-size:1.05rem">ZAŁAMANIE STANU PACJENTA – POWIKŁANIE IATROGENNE!</h4>
            <p style="margin:0 0 .6rem 0;font-size:.9rem;line-height:1.45">${OSCE_ACTIVE.complicationMessage}</p>
            <button class="btn btn-sm" id="btnStabilizeOsce" style="background:var(--red);color:var(--ink-inv);border-color:var(--red)">
              🚑 Zastosuj natychmiastowe postępowanie ratunkowe i ustabilizuj pacjenta
            </button>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Główny układ planszy pacjenta -->
    <div class="osce-wrap">
      <!-- LEWA KOLUMNA: Plansza anatomiczna z sylwetką pacjenta i hotspotami -->
      <div class="osce-board">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;flex-wrap:wrap;gap:.4rem">
          <div>
            <span style="font-weight:800;font-size:.92rem;color:var(--ink)">
              📍 Sylwetka: ${station.patient.name} (${station.patient.age})
            </span>
            <span style="font-size:.74rem;color:var(--teal);display:block;font-weight:700">
              ${viewMode === 'front' ? 'Widok z przodu (Anterior)' : 'Widok od tyłu (Posterior / Plecy)'}
            </span>
          </div>
          <div style="display:inline-flex;border-radius:6px;border:1px solid var(--line);background:var(--bg);padding:2px">
            <button class="btn btn-sm ${viewMode === 'front' ? 'btn-primary' : 'btn-subtle'}" id="btnOsceViewFront" style="padding:.2rem .6rem;font-size:.76rem;border-radius:4px;border:0">
              🧍 Przód
            </button>
            <button class="btn btn-sm ${viewMode === 'back' ? 'btn-primary' : 'btn-subtle'}" id="btnOsceViewBack" style="padding:.2rem .6rem;font-size:.76rem;border-radius:4px;border:0">
              🔄 Tył
            </button>
          </div>
        </div>

        <div class="osce-patient-stage" id="oscePatientStage">
          <div class="osce-stage-inner">
            ${renderOscePatientSilhouette(station, selectedZoneObj, viewMode)}

            <!-- Hotspoty na ciele pacjenta (wypozycjonowane względem wybranego widoku) -->
            ${station.zones.map(zone => {
              const isDone = zone.maneuvers.filter(m => m.isKey).every(m => OSCE_ACTIVE.performedManeuvers.has(m.id));
              const isActive = selectedZoneObj && selectedZoneObj.id === zone.id;
              const doneCountInZone = zone.maneuvers.filter(m => OSCE_ACTIVE.performedManeuvers.has(m.id)).length;
              const totalInZone = zone.maneuvers.length;
              const shortName = zone.name.split('–')[0].split('(')[0].trim();
              const posX = (viewMode === 'back' && zone.backX !== undefined) ? zone.backX : zone.x;
              const posY = (viewMode === 'back' && zone.backY !== undefined) ? zone.backY : zone.y;
              return `
              <button type="button"
                      class="osce-hotspot ${isDone ? 'performed' : ''} ${isActive ? 'active' : ''}"
                      data-zone="${esc(zone.id)}"
                      style="left:${posX}%; top:${posY}%;"
                      aria-pressed="${isActive ? 'true' : 'false'}"
                      aria-label="${esc(zone.name)}"
                      title="${esc(zone.name)} (${doneCountInZone}/${totalInZone})">
                <span class="osce-pin-badge">
                  <span class="pin-icon" aria-hidden="true">${zone.icon}</span>
                  <span class="pin-name">${esc(shortName)}</span>
                  ${isDone ? '<span class="pin-check" aria-hidden="true">✓</span>' : ''}
                </span>
              </button>`;
            }).join('')}
          </div>
        </div>

        <!-- Pasek szybkiego wyboru stref anatomicznych (przyciski pomocnicze) -->
        <div style="margin-top:1rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
            <span style="font-size:.78rem;font-weight:800;color:var(--ink-muted);text-transform:uppercase;letter-spacing:.04em">
              Strefy anatomiczne:
            </span>
            <span style="font-size:.78rem;font-weight:700;color:var(--teal)">
              Wybrana: <b>${selectedZoneObj.name.split('–')[0].trim()}</b>
            </span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:.35rem">
            ${station.zones.map(zone => {
              const isDone = zone.maneuvers.filter(m => m.isKey).every(m => OSCE_ACTIVE.performedManeuvers.has(m.id));
              const isActive = selectedZoneObj && selectedZoneObj.id === zone.id;
              return `
              <button class="btn btn-sm btn-subtle zone-chip-btn ${isActive ? 'btn-primary' : ''}"
                      data-zone="${zone.id}"
                      style="font-size:.78rem;padding:.25rem .55rem;border-radius:999px;${isDone ? 'border-color:var(--green);color:var(--green)' : ''}">
                ${zone.icon} ${zone.name.split('–')[0].trim()} ${isDone ? '✓' : ''}
              </button>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- PRAWA KOLUMNA: Kontekst badania, manewry, wywiad i spostrzeżenia -->
      <div>
        <!-- Przełącznik: Manewry badania vs Wywiad z rodzicem -->
        <div class="conn-tabs" style="margin-bottom:.8rem">
          <button class="conn-tab-btn ${OSCE_ACTIVE.activeTab === 'maneuvers' ? 'active' : ''}" id="tabBtnManeuvers">
            🩺 Badanie fizykalne (${selectedZoneObj ? selectedZoneObj.name.split('–')[0].trim() : ''})
          </button>
          <button class="conn-tab-btn ${OSCE_ACTIVE.activeTab === 'interview' ? 'active' : ''}" id="tabBtnInterview">
            🗣️ Wywiad (${OSCE_ACTIVE.performedQuestions.size}/${station.interview.length})
          </button>
        </div>

        <!-- ZAKŁADKA 1: Badanie fizykalne wybranej strefy -->
        ${OSCE_ACTIVE.activeTab === 'maneuvers' ? `
          <div class="card" id="osceManeuversCard" style="margin-bottom:1rem;background:var(--surface)">
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.8rem">
              <span style="font-size:1.4rem">${selectedZoneObj.icon}</span>
              <div>
                <h4 style="margin:0;font-size:1.05rem;color:var(--ink)">${selectedZoneObj.name}</h4>
                <div style="font-size:.78rem;color:var(--ink-muted)">Dostępne manewry diagnostyczne w tej strefie:</div>
              </div>
            </div>

            <!-- Lista manewrów w strefie -->
            <div>
              ${selectedZoneObj.maneuvers.map(m => {
                const isPerformed = OSCE_ACTIVE.performedManeuvers.has(m.id);
                return `
                <div style="margin-bottom:.65rem">
                  <button class="osce-maneuver-btn ${isPerformed ? 'done' : ''}" data-maneuver="${m.id}">
                    <span style="display:flex;align-items:center;gap:.4rem;flex:1;text-align:left">
                      ${isPerformed ? '✅' : '🩺'}
                      <span>${m.label}</span>
                      ${m.isKey ? '<span class="badge" style="background:rgba(12,122,133,0.15);color:var(--teal);font-size:.68rem;padding:.15rem .4rem">KLUCZOWY</span>' : ''}
                      ${m.isFatal ? '<span class="badge" style="background:rgba(194,59,42,0.15);color:var(--red);font-size:.68rem;padding:.15rem .4rem">RYZYKO</span>' : ''}
                    </span>
                    <span style="font-size:.78rem;font-weight:800;color:${isPerformed ? 'var(--green)' : 'var(--teal)'};margin-left:.6rem">
                      ${isPerformed ? 'Wykonano' : 'Zbadaj →'}
                    </span>
                  </button>

                  <!-- Wynik badania jeśli już wykonano -->
                  ${isPerformed ? `
                    <div class="osce-finding-alert">
                      <b>Wynik badania:</b> ${m.finding}
                    </div>
                  ` : ''}
                </div>`;
              }).join('')}
            </div>
          </div>
        ` : `
          <!-- ZAKŁADKA 2: Wywiad celowany z rodzicem -->
          <div class="card" id="osceManeuversCard" style="margin-bottom:1rem;background:var(--surface)">
            <div style="margin-bottom:.8rem">
              <h4 style="margin:0 0 .2rem 0;font-size:1.05rem;color:var(--ink)">🗣️ Wywiad celowany z opiekunem pacjenta</h4>
              <p style="margin:0;font-size:.82rem;color:var(--ink-muted)">Wybierz pytania, aby uzyskać kluczowe informacje anamnestyczne:</p>
            </div>

            <div>
              ${station.interview.map((item, idx) => {
                const isAsked = OSCE_ACTIVE.performedQuestions.has(idx);
                return `
                <div class="card" style="margin-bottom:.6rem;padding:.75rem .9rem;background:var(--bg);border:1px solid ${isAsked ? 'var(--green)' : 'var(--line)'}">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:.6rem">
                    <span style="font-weight:700;font-size:.86rem;color:var(--ink)">„${item.q}”</span>
                    ${!isAsked ? `
                      <button class="btn btn-sm btn-subtle btn-ask-question" data-qidx="${idx}" style="white-space:nowrap">
                        Zapytaj 💬
                      </button>
                    ` : `
                      <span class="badge" style="background:rgba(46,133,64,0.12);color:var(--green);font-size:.72rem">Zadano</span>
                    `}
                  </div>
                  ${isAsked ? `
                    <div style="margin-top:.5rem;padding-top:.5rem;border-top:1px dashed var(--line);font-size:.84rem;color:var(--teal);line-height:1.45">
                      <b>Odpowiedź:</b> „${item.a}”
                      ${item.isKey ? '<span class="badge" style="background:rgba(12,122,133,0.15);color:var(--teal);font-size:.65rem;margin-left:.4rem">KLUCZOWE</span>' : ''}
                    </div>
                  ` : ''}
                </div>`;
              }).join('')}
            </div>
          </div>
        `}

        <!-- Dziennik spostrzeżeń klinicznych -->
        <div class="card" style="background:var(--bg);border:1px solid var(--line-2)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
            <span style="font-weight:800;font-size:.86rem;color:var(--ink)">
              📝 Ostatnio odkryte objawy kliniczne (${OSCE_ACTIVE.findings.length})
            </span>
          </div>
          ${OSCE_ACTIVE.findings.length === 0 ? `
            <div style="font-size:.82rem;color:var(--ink-muted);font-style:italic">
              Nie wykonano jeszcze żadnych manewrów. Kliknij wybraną strefę ciała, aby rozpocząć badanie fizykalne.
            </div>
          ` : `
            <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:.4rem">
              ${OSCE_ACTIVE.findings.slice(0, 5).map(f => `
                <div style="font-size:.8rem;padding:.45rem .65rem;background:var(--surface);border-radius:8px;border:1px solid ${f.isFatal ? 'rgba(194,59,42,0.32)' : 'rgba(12,122,133,0.28)'}">
                  <div style="display:flex;justify-content:space-between;color:var(--ink-muted);font-size:.72rem;margin-bottom:.15rem">
                    <span><b>${f.zoneName}</b> › ${f.label}</span>
                    <span>${f.time}</span>
                  </div>
                  <div style="color:var(--ink);line-height:1.35">${f.finding}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  </div></section>`;

  // Podpięcie zdarzeń
  const handleZoneSelect = (zoneId) => {
    const activeEl = document.activeElement;
    const refocusHotspot = activeEl?.classList?.contains('osce-hotspot');
    const refocusSvgZone = activeEl?.classList?.contains('osce-anatomy-region');
    OSCE_ACTIVE.selectedZone = zoneId;
    OSCE_ACTIVE.activeTab = 'maneuvers';
    const scrollY = window.scrollY;
    renderActiveOsceStation(station);
    if (refocusHotspot) {
      const btn = $$('.osce-hotspot[data-zone]').find(b => b.dataset.zone === zoneId);
      if (btn) btn.focus({ preventScroll: true });
    } else if (refocusSvgZone) {
      const reg = $$('.osce-anatomy-region[data-zone-id]').find(r => r.dataset.zoneId === zoneId);
      if (reg) reg.focus({ preventScroll: true });
    }
    if (window.innerWidth < 960) {
      const card = $('#osceManeuversCard');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      window.scrollTo(0, scrollY);
    }
  };

  // 1. Kliknięcie w hotspot na ciele + obsługa klawiatury dla stref SVG
  $$('.osce-hotspot[data-zone]').forEach(h => {
    h.onclick = () => handleZoneSelect(h.dataset.zone);
    h.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleZoneSelect(h.dataset.zone); } };
  });
  const zoneMap = new Map((station.zones || []).map(z => [z.id, z]));
  $$('.osce-anatomy-region[data-zone-id]').forEach(el => {
    const zId = el.dataset.zoneId;
    const zObj = zoneMap.get(zId);
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-pressed', String(OSCE_ACTIVE.selectedZone === zId));
    if (zObj) el.setAttribute('aria-label', zObj.name);
    el.onclick = () => handleZoneSelect(zId);
    el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleZoneSelect(zId); } };
  });

  // 2. Kliknięcie w chipsy wyboru strefy
  $$('.zone-chip-btn[data-zone]').forEach(b => {
    b.onclick = () => handleZoneSelect(b.dataset.zone);
  });

  // 3. Przełączanie zakładek: Badanie vs Wywiad
  const tManeuvers = $('#tabBtnManeuvers');
  if (tManeuvers) {
    tManeuvers.onclick = () => {
      OSCE_ACTIVE.activeTab = 'maneuvers';
      const scrollY = window.scrollY;
      renderActiveOsceStation(station);
      window.scrollTo(0, scrollY);
    };
  }
  const tInterview = $('#tabBtnInterview');
  if (tInterview) {
    tInterview.onclick = () => {
      OSCE_ACTIVE.activeTab = 'interview';
      const scrollY = window.scrollY;
      renderActiveOsceStation(station);
      window.scrollTo(0, scrollY);
    };
  }

  // 4. Wykonanie manewru
  $$('.osce-maneuver-btn[data-maneuver]').forEach(b => {
    b.onclick = () => {
      const maneuverId = b.dataset.maneuver;
      const maneuver = selectedZoneObj.maneuvers.find(m => m.id === maneuverId);
      if (maneuver) {
        performOsceManeuver(station, selectedZoneObj, maneuver);
      }
    };
  });

  // 5. Zadanie pytania w wywiadzie
  $$('.btn-ask-question[data-qidx]').forEach(b => {
    b.onclick = () => {
      const idx = parseInt(b.dataset.qidx);
      askOsceInterviewQuestion(station, idx);
    };
  });

  // Obsługa przyłóżkowej skali
  const btnToggleScale = $('#btnToggleOsceScale');
  if (btnToggleScale) {
    btnToggleScale.onclick = () => {
      OSCE_ACTIVE.scaleExpanded = !OSCE_ACTIVE.scaleExpanded;
      const scrollY = window.scrollY;
      renderActiveOsceStation(station);
      window.scrollTo(0, scrollY);
    };
  }

  // 6. Reset stacji
  const btnRestart = $('#btnRestartOsce');
  if (btnRestart) {
    btnRestart.onclick = () => {
      if (confirm('Czy na pewno chcesz zresetować tę stację i rozpocząć badanie od początku?')) {
        startOsceStation(station);
        renderActiveOsceStation(station);
      }
    };
  }

  // 7. Stabilizacja pacjenta po powikłaniu
  const btnStabilize = $('#btnStabilizeOsce');
  if (btnStabilize) {
    btnStabilize.onclick = () => {
      stabilizeOscePatient(station);
    };
  }

  // 8. Zakończenie badania i ewaluacja Status Praesens
  const btnFinish = $('#btnFinishOsce');
  if (btnFinish) {
    btnFinish.onclick = () => {
      finishOsceStation(station);
    };
  }
}

function performOsceManeuver(station, zone, maneuver) {
  if (!OSCE_ACTIVE) return;
  OSCE_ACTIVE.performedManeuvers.add(maneuver.id);
  if (!OSCE_ACTIVE.performedOrder) OSCE_ACTIVE.performedOrder = [];
  if (!OSCE_ACTIVE.performedOrder.includes(maneuver.id)) {
    OSCE_ACTIVE.performedOrder.push(maneuver.id);
  }

  if (maneuver.isFatal) {
    OSCE_ACTIVE.isComplication = true;
    OSCE_ACTIVE.complicationMessage = maneuver.fatalMessage;
    OSCE_ACTIVE.reaction = 'crisis';
    OSCE_ACTIVE.fatalErrorsTriggered += 1;
    if (maneuver.complicationVitals) {
      OSCE_ACTIVE.currentVitals = { ...OSCE_ACTIVE.currentVitals, ...maneuver.complicationVitals };
    }
    toast('⚠️ BŁĄD KRYTYCZNY! Sprawdź stan pacjenta!');
  } else {
    OSCE_ACTIVE.reaction = maneuver.reaction || 'normal';
    toast('Wykonano: ' + maneuver.label);
  }

  // Dodaj do rejestru spostrzeżeń
  OSCE_ACTIVE.findings.unshift({
    zoneName: zone.name.split('–')[0].trim(),
    label: maneuver.label,
    finding: maneuver.finding,
    reaction: maneuver.reaction,
    isFatal: maneuver.isFatal,
    time: new Date().toLocaleTimeString('pl-PL', { minute: '2-digit', second: '2-digit' })
  });

  const scrollY = window.scrollY;
  renderActiveOsceStation(station);
  window.scrollTo(0, scrollY);
}

function askOsceInterviewQuestion(station, index) {
  if (!OSCE_ACTIVE) return;
  OSCE_ACTIVE.performedQuestions.add(index);
  const q = station.interview[index];
  if (q && q.isKey) {
    toast('Uzyskano kluczową informację z wywiadu!');
  }
  const scrollY = window.scrollY;
  renderActiveOsceStation(station);
  window.scrollTo(0, scrollY);
}

function stabilizeOscePatient(station) {
  if (!OSCE_ACTIVE) return;
  OSCE_ACTIVE.isComplication = false;
  OSCE_ACTIVE.reaction = (station.id === 'stacja-1-odwodnienie') ? 'lethargy' : 'pain';
  OSCE_ACTIVE.currentVitals = { ...(station.patient.vitalsInitial || {}) };
  toast('🚑 Wykonano procedury ratunkowe – parametry ustabilizowane.');
  const scrollY = window.scrollY;
  renderActiveOsceStation(station);
  window.scrollTo(0, scrollY);
}

function finishOsceStation(station) {
  window.scrollTo(0, 0);

  if (!OSCE_ACTIVE || OSCE_ACTIVE.stationId !== station.id) {
    startOsceStation(station);
  }

  const allManeuvers = station.zones.flatMap(z => z.maneuvers);
  const totalKey = allManeuvers.filter(m => m.isKey).length;
  const doneKey = allManeuvers.filter(m => m.isKey && OSCE_ACTIVE.performedManeuvers.has(m.id)).length;

  const totalInterviewKey = station.interview.filter(q => q.isKey).length;
  const doneInterviewKey = station.interview.map((q, idx) => ({ q, idx })).filter(item => item.q.isKey && OSCE_ACTIVE.performedQuestions.has(item.idx)).length;

  const renderSummary = () => {
    const isEvaluated = OSCE_ACTIVE.isFinished;

    main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:980px">
      <!-- Nawigacja powrotna -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem">
        <div class="crumbs" style="margin:0">
          <a href="#/pacjent?tab=osce">← Stacje OSCE</a> /
          <a href="#/pacjent/osce/${station.id}">Badanie fizykalne</a> /
          <span>Ewaluacja i Status Praesens</span>
        </div>
        <div style="display:flex;gap:.5rem">
          <a href="#/pacjent/osce/${station.id}" class="btn btn-sm">← Wróć do badania pacjenta</a>
        </div>
      </div>

      <!-- Karta Podsumowania i Wyniku -->
      <div class="card" style="margin-bottom:1.5rem;border-top:4px solid var(--teal)">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:.8rem">
          <div>
            <div class="eyebrow" style="color:var(--teal)">Karta oceny OSCE · ${station.shortTitle}</div>
            <h2 style="margin:0">${station.title}</h2>
          </div>
          ${isEvaluated ? `
            <div style="text-align:right">
              <span class="badge" style="font-size:1.1rem;padding:.4rem .9rem;background:${OSCE_ACTIVE.score >= 60 ? 'rgba(46,133,64,0.15)' : 'rgba(194,59,42,0.15)'};color:${OSCE_ACTIVE.score >= 60 ? 'var(--green)' : 'var(--red)'};font-weight:900">
                ${OSCE_ACTIVE.score >= 60 ? '✅ ZDANY' : '❌ NIEZALICZONY'}: ${OSCE_ACTIVE.score}%
              </span>
            </div>
          ` : ''}
        </div>

        <!-- Rozbicie punktowe -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:.8rem;background:var(--bg);padding:1rem;border-radius:var(--r);margin-bottom:1rem">
          <div>
            <div style="font-size:.75rem;font-weight:800;color:var(--ink-muted)">Manewry kluczowe</div>
            <div style="font-size:1.1rem;font-weight:900;color:var(--ink)">${doneKey} / ${totalKey}</div>
          </div>
          <div>
            <div style="font-size:.75rem;font-weight:800;color:var(--ink-muted)">Kluczowy wywiad</div>
            <div style="font-size:1.1rem;font-weight:900;color:var(--ink)">${doneInterviewKey} / ${totalInterviewKey}</div>
          </div>
          <div>
            <div style="font-size:.75rem;font-weight:800;color:var(--ink-muted)">Błędy krytyczne</div>
            <div style="font-size:1.1rem;font-weight:900;color:${OSCE_ACTIVE.fatalErrorsTriggered > 0 ? 'var(--red)' : 'var(--green)'}">
              ${OSCE_ACTIVE.fatalErrorsTriggered > 0 ? `⚠️ ${OSCE_ACTIVE.fatalErrorsTriggered} powikłań` : '0 (Czysto)'}
            </div>
          </div>
          <div>
            <div style="font-size:.75rem;font-weight:800;color:var(--ink-muted)">Ocena syntetyczna</div>
            <div style="font-size:1.1rem;font-weight:900;color:var(--teal)">
              ${isEvaluated ? `${OSCE_ACTIVE.score}% punktów` : 'Oczekuje na test'}
            </div>
          </div>
        </div>

        <!-- Test syntezy diagnostycznej -->
        <div style="border-top:1px solid var(--line-2);padding-top:1.2rem">
          <h3 style="margin-top:0;margin-bottom:.5rem;font-size:1.1rem">🧠 Synteza kliniczna i decyzja egzaminacyjna</h3>
          <p style="font-size:.86rem;color:var(--ink-muted);margin-bottom:1.2rem">
            Przed wygenerowaniem wzorcowego raportu Status Praesens sformułuj rozpoznanie główne, wskaż rozpoznania różnicowe i zaplanuj postępowanie.
          </p>

          <!-- Pytanie diagnostyczne -->
          <div style="margin-bottom:1.3rem">
            <div style="font-weight:800;font-size:.92rem;margin-bottom:.6rem;color:var(--ink)">
              1. ${station.synthesis.questionDiagnostic}
            </div>
            <div style="display:flex;flex-direction:column;gap:.5rem">
              ${station.synthesis.optionsDiagnostic.map(opt => {
                const isSelected = OSCE_ACTIVE.synthesisDiagnosis === opt.id;
                return `
                <label style="display:flex;align-items:flex-start;gap:.6rem;padding:.75rem .9rem;border-radius:8px;background:var(--bg);border:1.5px solid ${isSelected ? 'var(--teal)' : 'var(--line)'};cursor:pointer;transition:all .15s">
                  <input type="radio" name="osceDiag" value="${opt.id}" ${isSelected ? 'checked' : ''} ${isEvaluated ? 'disabled' : ''} style="margin-top:.2rem"/>
                  <div style="flex:1">
                    <span style="font-size:.9rem;font-weight:700;color:var(--ink)">${opt.label}</span>
                    ${isEvaluated ? `
                      <div style="margin-top:.35rem;font-size:.82rem;color:${opt.isCorrect ? 'var(--green)' : 'var(--red)'}">
                        ${opt.isCorrect ? '✅ Prawidłowe:' : '❌ Błędne:'} ${opt.explanation}
                      </div>
                    ` : ''}
                  </div>
                </label>`;
              }).join('')}
            </div>
          </div>

          <!-- Rozpoznania różnicowe -->
          <div style="margin-bottom:1.3rem">
            <div style="font-weight:800;font-size:.92rem;margin-bottom:.6rem;color:var(--ink)">
              2. Zaznacz trafne rozpoznania różnicowe, które należy uwzględnić:
            </div>
            <div style="display:flex;flex-direction:column;gap:.5rem">
              ${station.synthesis.differentialOptions.map(diff => {
                const isChecked = (OSCE_ACTIVE.synthesisDifferentials || []).includes(diff.id);
                return `
                <label style="display:flex;align-items:center;gap:.6rem;padding:.65rem .85rem;border-radius:8px;background:var(--bg);border:1.5px solid ${isChecked ? 'var(--teal)' : 'var(--line)'};cursor:pointer">
                  <input type="checkbox" class="osce-diff-cb" value="${diff.id}" ${isChecked ? 'checked' : ''} ${isEvaluated ? 'disabled' : ''}/>
                  <span style="font-size:.88rem;color:var(--ink);flex:1">${diff.label}</span>
                  ${isEvaluated ? `
                    <span style="font-size:.8rem;font-weight:800;color:${diff.isCorrect ? 'var(--green)' : 'var(--red)'}">
                      ${diff.isCorrect ? '✅ Należy uwzględnić' : '❌ Niezwiązane'}
                    </span>
                  ` : ''}
                </label>`;
              }).join('')}
            </div>
          </div>

          <!-- Postępowanie kliniczne -->
          <div style="margin-bottom:1.3rem">
            <div style="font-weight:800;font-size:.92rem;margin-bottom:.6rem;color:var(--ink)">
              3. Zaznacz kluczowe kroki postępowania terapeutycznego i zlecenia:
            </div>
            <div style="display:flex;flex-direction:column;gap:.5rem">
              ${station.synthesis.actionOptions.map(act => {
                const isChecked = (OSCE_ACTIVE.synthesisActions || []).includes(act.id);
                return `
                <label style="display:flex;align-items:center;gap:.6rem;padding:.65rem .85rem;border-radius:8px;background:var(--bg);border:1.5px solid ${isChecked ? 'var(--teal)' : 'var(--line)'};cursor:pointer">
                  <input type="checkbox" class="osce-act-cb" value="${act.id}" ${isChecked ? 'checked' : ''} ${isEvaluated ? 'disabled' : ''}/>
                  <span style="font-size:.88rem;color:var(--ink);flex:1">${act.label}</span>
                  ${isEvaluated ? `
                    <span style="font-size:.8rem;font-weight:800;color:${act.isCorrect ? 'var(--green)' : 'var(--red)'}">
                      ${act.isCorrect ? '✅ Zalecane' : '❌ Przeciwwskazane'}
                    </span>
                  ` : ''}
                </label>`;
              }).join('')}
            </div>
          </div>

          ${!isEvaluated ? `
            <button class="btn btn-primary" id="btnSubmitOsceEvaluation" style="width:100%;padding:.8rem;font-size:.95rem">
              Zatwierdź rozpoznanie i odbierz Wzorcowy Status Praesens →
            </button>
          ` : ''}
        </div>
      </div>

      <!-- WZORCOWY RAPORT STATUS PRAESENS (9 punktów badania fizykalnego) -->
      ${isEvaluated ? `
        <div class="card" style="margin-bottom:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;margin-bottom:1rem">
            <div>
              <div class="eyebrow" style="color:var(--teal)">Egzamin kliniczny · Dokumentacja medyczna</div>
              <h3 style="margin:0">${station.statusPraesens.title}</h3>
            </div>
            <button class="btn btn-sm btn-primary" id="btnCopyStatusPraesens">
              📋 Kopiuj raport do Notatnika Markdown
            </button>
          </div>

          <p style="font-size:.86rem;color:var(--ink-muted);line-height:1.45;margin-bottom:1.2rem">
            Wzorcowy, 9-punktowy opis stanu przedmiotowego zgodny ze standardem odpraw klinicznych w klinikach pediatrii. Możesz skopiować ten raport do wbudowanego Notatnika lub schowka systemowego jednym kliknięciem.
          </p>

          <div class="status-praesens-box">
            ${station.statusPraesens.sections.map(sec => `
              <div class="status-praesens-section">
                <h4>${sec.num}. ${sec.title}</h4>
                <p style="margin:0;color:var(--ink)">${sec.content}</p>
              </div>
            `).join('')}

            <div style="margin-top:1.2rem;padding-top:1rem;border-top:1.5px solid var(--line);background:rgba(12,122,133,0.04);padding:1rem;border-radius:8px">
              <h4 style="margin:0 0 .35rem 0;color:var(--teal)">💡 Wnioski kliniczne i rozpoznanie końcowe:</h4>
              <p style="margin:0;font-size:.9rem;line-height:1.5;color:var(--ink)">${station.statusPraesens.conclusions}</p>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.2rem;flex-wrap:wrap;gap:.6rem">
            <a href="#/pacjent?tab=osce" class="btn">← Wróć do listy stacji OSCE</a>
            <div style="display:flex;gap:.5rem">
              <button class="btn" id="btnRepeatOsce">🔄 Powtórz stację</button>
              <button class="btn btn-primary" id="btnCopyStatusPraesensBottom">📋 Kopiuj do Notatnika</button>
            </div>
          </div>
        </div>
      ` : ''}
    </div></section>`;

    // Podpięcie zdarzeń formularza ewaluacji
    $$('input[name="osceDiag"]').forEach(r => {
      r.onchange = () => {
        OSCE_ACTIVE.synthesisDiagnosis = r.value;
      };
    });

    $$('.osce-diff-cb').forEach(cb => {
      cb.onchange = () => {
        const val = cb.value;
        const arr = new Set(OSCE_ACTIVE.synthesisDifferentials || []);
        if (cb.checked) arr.add(val);
        else arr.delete(val);
        OSCE_ACTIVE.synthesisDifferentials = Array.from(arr);
      };
    });

    $$('.osce-act-cb').forEach(cb => {
      cb.onchange = () => {
        const val = cb.value;
        const arr = new Set(OSCE_ACTIVE.synthesisActions || []);
        if (cb.checked) arr.add(val);
        else arr.delete(val);
        OSCE_ACTIVE.synthesisActions = Array.from(arr);
      };
    });

    const btnSubmit = $('#btnSubmitOsceEvaluation');
    if (btnSubmit) {
      btnSubmit.onclick = () => {
        if (!OSCE_ACTIVE.synthesisDiagnosis) {
          toast('Proszę wskazać rozpoznanie główne przed zatwierdzeniem');
          return;
        }

        // Kalkulacja wyniku:
        // 1. Manewry kluczowe: max 50 pkt
        const maneuverPts = (doneKey / (totalKey || 1)) * 50;
        // 2. Wywiad kluczowy: max 10 pkt
        const interviewPts = (doneInterviewKey / (totalInterviewKey || 1)) * 10;
        // 3. Rozpoznanie główne: max 20 pkt
        const correctDiag = station.synthesis.optionsDiagnostic.find(o => o.isCorrect);
        const diagPts = (OSCE_ACTIVE.synthesisDiagnosis === (correctDiag ? correctDiag.id : '')) ? 20 : 0;
        // 4. Różnicowe: max 10 pkt
        const correctDiffs = station.synthesis.differentialOptions.filter(d => d.isCorrect).map(d => d.id);
        const selectedDiffs = OSCE_ACTIVE.synthesisDifferentials || [];
        const diffMatches = selectedDiffs.filter(id => correctDiffs.includes(id)).length;
        const diffFalse = selectedDiffs.filter(id => !correctDiffs.includes(id)).length;
        const diffPts = Math.max(0, (diffMatches - diffFalse) / (correctDiffs.length || 1) * 10);
        // 5. Postępowanie: max 10 pkt
        const correctActs = station.synthesis.actionOptions.filter(a => a.isCorrect).map(a => a.id);
        const selectedActs = OSCE_ACTIVE.synthesisActions || [];
        const actMatches = selectedActs.filter(id => correctActs.includes(id)).length;
        const actFalse = selectedActs.filter(id => !correctActs.includes(id)).length;
        const actPts = Math.max(0, (actMatches - actFalse) / (correctActs.length || 1) * 10);
        // 6. Kary za błędy krytyczne: -25 pkt za każdy
        const fatalPenalty = OSCE_ACTIVE.fatalErrorsTriggered * 25;

        const totalRaw = maneuverPts + interviewPts + diagPts + diffPts + actPts - fatalPenalty;
        const finalPct = Math.max(0, Math.min(100, Math.round(totalRaw)));

        OSCE_ACTIVE.score = finalPct;
        OSCE_ACTIVE.isFinished = true;

        // Zapisz postęp w S
        ctx.S.osceCases = ctx.S.osceCases || {};
        ctx.S.osceCases[station.id] = {
          score: finalPct,
          doneAt: Date.now(),
          passed: finalPct >= 60,
          maneuversDone: doneKey,
          maneuversTotal: totalKey
        };
        save();

        toast(finalPct >= 60 ? `Gratulacje! Stacja zaliczona na ${finalPct}%` : `Wynik: ${finalPct}% – przeanalizuj błędy i powtórz badanie`);
        renderSummary();
      };
    }

    const copyBtn = $('#btnCopyStatusPraesens');
    const copyBtnBottom = $('#btnCopyStatusPraesensBottom');
    const handleCopy = () => {
      copyStatusPraesensToNotes(station);
    };
    if (copyBtn) copyBtn.onclick = handleCopy;
    if (copyBtnBottom) copyBtnBottom.onclick = handleCopy;

    const btnRepeat = $('#btnRepeatOsce');
    if (btnRepeat) {
      btnRepeat.onclick = () => {
        startOsceStation(station);
        location.hash = `#/pacjent/osce/${station.id}`;
      };
    }
  };

  renderSummary();
}

function copyStatusPraesensToNotes(station) {
  if (!station || !station.statusPraesens) return;

  const sp = station.statusPraesens;
  const nowStr = new Date().toLocaleDateString('pl-PL') + ' ' + new Date().toLocaleTimeString('pl-PL');

  const md = `# ${sp.title}
**Data badania:** ${nowStr}
**Pacjent:** ${station.patient.name} (${station.patient.age}, ${station.patient.weight})
**Tematyka kliniczna:** ${station.topic}

---

## Badanie przedmiotowe (Status Praesens)

${sp.sections.map(s => `### ${s.num}. ${s.title}\n${s.content}`).join('\n\n')}

---

### Wnioski kliniczne i rozpoznanie końcowe
${sp.conclusions}

---
*Wygenerowano w module Wirtualny Pacjent – Symulator Egzaminu Praktycznego OSCE (Pediatria V – Hub)*
`;

  try {
    const notes = getNotes();
    notes.unshift({
      id: 'osce_sp_' + Date.now(),
      title: `Status Praesens: ${station.shortTitle} (OSCE)`,
      content: md,
      body: md,
      mod: (station.mods && station.mods[0]) ? station.mods[0] : 'all',
      updatedAt: Date.now()
    });
    saveNotes(notes);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).catch(() => {});
    }
    toast('✅ Skopiowano raport do Notatnika oraz do schowka!');
  } catch (err) {
    console.error('Błąd zapisu notatki:', err);
    toast('Nie udało się zapisać notatki');
  }
}


    function openStation(station) {
      if (!OSCE_ACTIVE || OSCE_ACTIVE.stationId !== station.id) {
        startOsceStation(station);
      }
      renderActiveOsceStation(station);
    }

    return { openStation, renderOsceStationList, startOsceStation, renderActiveOsceStation };
  };
})();
