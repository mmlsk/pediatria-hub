/* Pediatria V – hub. Vanilla JS, jeden plik, router hash. */
(function () {
'use strict';
const { GROUPS, MODS, ATLASES, TRAPS, CONF, BANKS, modById, atById } = window.HUB_META;
const CUSTOM_Q_KEY = 'pediatria_hub_custom_questions_v1';
let CUSTOM_Q = [];
try {
  const cqRaw = localStorage.getItem(CUSTOM_Q_KEY);
  if (cqRaw) CUSTOM_Q = JSON.parse(cqRaw);
} catch (e) { /* ignoruj */ }

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const main = $('#view');

/* ---------- helpers ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const escB = s => esc(s).replace(/&lt;br\s*\/?&gt;/gi, '<br>');
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
const L = 'ABCDEFGH';
function rich(h) {
  const t = document.createElement('template'); t.innerHTML = String(h || '');
  const ok = { B: 1, STRONG: 1, I: 1, EM: 1, BR: 1, P: 1, UL: 1, OL: 1, LI: 1, A: 1, SUB: 1, SUP: 1 };
  (function walk(n) {
    [...n.childNodes].forEach(c => {
      if (c.nodeType !== 1) return;
      if (!ok[c.tagName]) { c.replaceWith(document.createTextNode(c.textContent)); return; }
      [...c.attributes].forEach(a => { if (!(c.tagName === 'A' && a.name === 'href' && /^https?:/i.test(a.value))) c.removeAttribute(a.name); });
      if (c.tagName === 'A') { c.target = '_blank'; c.rel = 'noopener noreferrer'; }
      walk(c);
    });
  })(t.content);
  return t.innerHTML;
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
let toastT;
function toast(msg, opts = {}) {
  const t = $('#toast');
  if (typeof msg === 'string' && !opts.html) {
    t.textContent = msg;
  } else {
    t.innerHTML = msg;
  }
  t.classList.add('on');
  clearTimeout(toastT);
  const dur = opts.duration || 2200;
  if (dur > 0) toastT = setTimeout(() => t.classList.remove('on'), dur);
}
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- krótkie nazwy ---------- */
const SHORT = { '1': 'Ból brzucha', '2': 'Zakażenia', '3': 'Biegunki', '4': 'KZN', '5': 'Stany nagłe', '6': 'Wrzodowa', '7': 'IBD', '8': 'Alergie', '9': 'Guzy mózgu', '10': 'Nowotwory lite', '11': 'Krwiotwórcze', '12': 'Skazy', '13a': 'Anemie', '13b': 'Odporność', '14': 'ZUM', '15': 'AKI i PChN' };
const ASHORT = { brzuch: 'Ból brzucha', zakazenia: 'Zakażenia', gastro: 'Gastro i alergie', nefro: 'Nefrologia', nagle: 'Stany nagłe', guzy: 'Guzy mózgu', lite: 'Nowotwory lite', onko11: 'Krwiotwórcze i chłonne', hemato: 'Skazy · anemie · PID' };
const GA = { brzuch: ['var(--red)', 'var(--amber)'], zakazenia: ['var(--red)', '#F17D6E'], gastro: ['var(--amber)', '#D9A441'], nefro: ['var(--blue)', '#5E92D6'], nagle: ['var(--red)', '#E27B6B'], guzy: ['var(--violet)', '#9B7ED6'], lite: ['var(--violet)', '#C06BA8'], onko11: ['var(--violet)', 'var(--red)'], hemato: ['var(--violet)', 'var(--teal)'] };
const gOf = id => GROUPS[modById[id].g];

/* ---------- magazyn postępu ---------- */
const KEY = 'pediatria-hub.v1:';
const STORAGE_KEY = 'pediatria_hub_state_v1';
let S = { visited: {}, last: null, done: {}, ans: {}, bm: {}, examHistory: [] };

// Wczytanie stanu: localStorage z fallbackiem do window.name
try {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    Object.assign(S, JSON.parse(local));
  } else if (window.name.indexOf(KEY) === 0) {
    Object.assign(S, JSON.parse(window.name.slice(KEY.length)));
  }
} catch (e) {
  try { if (window.name.indexOf(KEY) === 0) Object.assign(S, JSON.parse(window.name.slice(KEY.length))); } catch (_) {}
}
S.examHistory = Array.isArray(S.examHistory) ? S.examHistory : [];

const save = () => {
  const serialized = JSON.stringify(S);
  try { localStorage.setItem(STORAGE_KEY, serialized); } catch (e) { /* ignoruj jeśli zablokowany */ }
  try { window.name = KEY + serialized; } catch (e) { /* ignoruj */ }
};

/* ---------- obsługa motywu (Dark Mode) ---------- */
const THEME_KEY = 'pediatria_hub_theme';
let currentTheme = 'auto'; // 'auto' | 'dark' | 'light'
try { currentTheme = localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) {}

function getEffectiveTheme() {
  if (currentTheme === 'dark') return 'dark';
  if (currentTheme === 'light') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(t, persist = true) {
  currentTheme = t;
  if (persist) {
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  const eff = getEffectiveTheme();
  if (eff === 'dark') {
    document.documentElement.dataset.theme = 'dark';
  } else {
    delete document.documentElement.dataset.theme;
  }
  updateThemeUI();
  syncIframeTheme(eff);
}

function updateThemeUI() {
  const icon = $('#themeIcon'), label = $('#themeLabel'), btn = $('#btnTheme');
  if (!icon || !label) return;
  if (currentTheme === 'dark') {
    icon.textContent = '🌙'; label.textContent = 'Ciemny';
    if (btn) btn.title = 'Motyw: Ciemny (kliknij, aby zmienić na Jasny)';
  } else if (currentTheme === 'light') {
    icon.textContent = '☀️'; label.textContent = 'Jasny';
    if (btn) btn.title = 'Motyw: Jasny (kliknij, aby zmienić na Auto)';
  } else {
    icon.textContent = '🖥️'; label.textContent = 'Auto';
    if (btn) btn.title = 'Motyw: Systemowy (kliknij, aby zmienić na Ciemny)';
  }
  $$('[data-theme-choice]').forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.themeChoice === currentTheme);
  });
}

function cycleTheme() {
  const next = currentTheme === 'auto' ? 'dark' : currentTheme === 'dark' ? 'light' : 'auto';
  applyTheme(next);
  toast(`Zmieniono motyw: ${next === 'auto' ? 'Systemowy (Auto)' : next === 'dark' ? 'Ciemny' : 'Jasny'}`);
}

function syncIframeTheme(eff) {
  const rf = $('#rf');
  if (rf && rf.contentDocument && rf.contentDocument.documentElement) {
    if (eff === 'dark') rf.contentDocument.documentElement.dataset.theme = 'dark';
    else delete rf.contentDocument.documentElement.dataset.theme;
  }
  if (rf && rf.contentWindow) {
    try { rf.contentWindow.postMessage({ type: 'SET_THEME', theme: eff }, '*'); } catch (e) {}
  }
}

try {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'auto') applyTheme('auto', false);
  });
} catch (e) {}

/* ---------- obsługa banków i pytań ---------- */
function getBank(q) {
  if (q.bank && BANKS[q.bank]) return q.bank;
  if (q.isCustom) return 'custom';
  const s = String(q.src || '').toUpperCase();
  if (s.includes('LEK')) return 'lek';
  if (s.includes('PES')) return 'pes';
  if (s.includes('MP.') || s.includes('MEDYCYNA PRAKTYCZNA')) return 'mp';
  return 'zaklad';
}

function prepQuestion(q, isCustom = false) {
  q.isCustom = !!isCustom;
  q.bank = q.bank || getBank(q);
  q.pm = q.mods.find(m => modById[m] && modById[m].at === q.at) || q.mods[0] || '1';
  q._n = norm([q.stem, (q.opts || []).join(' '), q.topic || '', q.mods.join(' '), ASHORT[q.at] || '', BANKS[q.bank] ? BANKS[q.bank].n : ''].join(' '));
  return q;
}

let Q = [...(window.HUB_Q || []).map(q => prepQuestion(q, false)), ...CUSTOM_Q.map(q => prepQuestion(q, true))];
let qById = Object.fromEntries(Q.map(q => [q.id, q]));

function saveCustomQ() {
  try { localStorage.setItem(CUSTOM_Q_KEY, JSON.stringify(CUSTOM_Q)); } catch (e) {}
  Q = [...(window.HUB_Q || []).map(q => prepQuestion(q, false)), ...CUSTOM_Q.map(q => prepQuestion(q, true))];
  qById = Object.fromEntries(Q.map(q => [q.id, q]));
}

/* ---------- dane pochodne ---------- */
const IDX = Object.fromEntries(MODS.map((m, i) => [m.id, i]));
const covered = MODS.filter(m => m.at);
const baseNums = [...new Set(MODS.map(m => parseInt(m.id, 10)))];
const coveredBase = [...new Set(covered.map(m => parseInt(m.id, 10)))];
const gapCount = Q.filter(q => q.gap).length;

const E = {};
function edgeOf(a, b) {
  if (a === b) return null;
  const [x, y] = IDX[a] < IDX[b] ? [a, b] : [b, a];
  return E[x + '|' + y] || (E[x + '|' + y] = { a: x, b: y, w: 0, traps: [] });
}
Q.forEach(q => {
  const u = [...new Set(q.mods.filter(m => modById[m]))];
  for (let i = 0; i < u.length; i++) for (let j = i + 1; j < u.length; j++) edgeOf(u[i], u[j]).w++;
});
TRAPS.forEach(t => {
  for (let i = 0; i < t.mods.length; i++) for (let j = i + 1; j < t.mods.length; j++) { const e = edgeOf(t.mods[i], t.mods[j]); if (e) e.traps.push(t); }
});
const EDGES = Object.values(E);
const edgeKey = (a, b) => (IDX[a] < IDX[b] ? a + '|' + b : b + '|' + a);

function modStats(id) {
  const qs = Q.filter(q => q.pm === id); let att = 0, ok = 0;
  qs.forEach(q => { const a = S.ans[q.id]; if (a) { att++; if (a.last) ok++; } });
  return { total: qs.length, att, ok, wrong: att - ok };
}
const doneCount = () => covered.filter(m => S.done[m.id]).length;
function updateRing() { /* miejsce na wskaźnik w nagłówku – pasek jest w widoku Postęp */ }

/* ---------- link do atlasu ---------- */
function atlasHref(q) {
  const m = q.mods.find(x => modById[x] && modById[x].at === q.at);
  return '#/atlas/' + q.at + (m ? '/' + modById[m].a : '/zadania');
}

/* ---------- wykres powiązań ---------- */
function renderGraph(host, o = {}) {
  const size = 600, cx = 300, cy = 300, R = 196, gap = 0.2, n = MODS.length;
  const step = (Math.PI * 2 - 4 * gap) / n;
  let ang = -Math.PI / 2 + gap / 2, lastG = null; const pos = {};
  MODS.forEach(m => {
    if (lastG && m.g !== lastG) ang += gap;
    lastG = m.g; pos[m.id] = { a: ang, x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
    ang += step;
  });
  const maxW = Math.max(...EDGES.map(e => e.w));
  const arcs = Object.keys(GROUPS).map(g => {
    const ms = MODS.filter(m => m.g === g); const a0 = pos[ms[0].id].a, a1 = pos[ms[ms.length - 1].id].a;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    return `<path d="M${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}" fill="none" stroke="${GROUPS[g].hex}" stroke-width="30" stroke-linecap="round" opacity=".13"/>`;
  }).join('');
  const edges = EDGES.filter(e => e.w > 0 || e.traps.length).map(e => {
    const p = pos[e.a], q = pos[e.b];
    const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, kx = cx + (mx - cx) * .22, ky = cy + (my - cy) * .22;
    const d = `M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${kx.toFixed(1)} ${ky.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    const w = e.w, sw = (1 + Math.min(w, 8) * .55).toFixed(2), op = (.16 + Math.min(w, 8) * .06 + (e.traps.length ? .12 : 0)).toFixed(2);
    return `<g class="eg" data-e="${e.a}|${e.b}"><path class="edge${e.traps.length ? ' cur' : ''}" data-e="${e.a}|${e.b}" d="${d}" stroke-width="${sw}" opacity="${op}"/><path d="${d}" fill="none" stroke="transparent" stroke-width="14" ${o.mode === 'select' ? 'style="cursor:pointer"' : ''} data-hit="${e.a}|${e.b}"><title>[${e.a}] ↔ [${e.b}]: ${w} pytań${e.traps.length ? ', ' + e.traps.length + ' pułapek' : ''}</title></path></g>`;
  }).join('');
  const nodes = MODS.map(m => {
    const p = pos[m.id], c = Math.cos(p.a), anchor = c > .25 ? 'start' : c < -.25 ? 'end' : 'middle';
    const lx = cx + (R + 34) * Math.cos(p.a), ly = cy + (R + 34) * Math.sin(p.a) + (Math.abs(c) <= .25 ? (Math.sin(p.a) > 0 ? 10 : -4) : 0);
    return `<g class="node${m.at ? '' : ' miss'}" data-m="${m.id}" tabindex="0" role="button" aria-label="Moduł ${m.id}: ${esc(m.n)}${m.at ? '' : ', brak atlasu'}">
      <circle class="c" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="20" fill="${GROUPS[m.g].hex}" stroke="${GROUPS[m.g].hex}" stroke-width="2"/>
      <text class="n" x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}">${m.id}</text>
      ${o.labels === false ? '' : `<text class="l" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${esc(SHORT[m.id])}</text>`}
      <title>[${m.id}] ${esc(m.n)}${m.at ? '' : ' (brak atlasu)'}</title></g>`;
  }).join('');
  host.innerHTML = `<svg class="gsvg" viewBox="-40 -6 680 612" role="group" aria-label="Mapa powiązań między modułami">${arcs}<g class="edges">${edges}</g>${nodes}</svg>`;
  const svg = $('svg', host);
  const clear = () => { svg.classList.remove('hl'); $$('.on', svg).forEach(x => x.classList.remove('on')); };
  function lit(ids) {
    clear(); if (!ids || !ids.length) return; svg.classList.add('hl'); const set = new Set(ids);
    $$('.node', svg).forEach(nd => nd.classList.toggle('on', set.has(nd.dataset.m)));
    $$('.edge', svg).forEach(ed => { const [a, b] = ed.dataset.e.split('|'); ed.classList.toggle('on', set.has(a) && set.has(b)); });
  }
  function litNode(id) {
    clear(); svg.classList.add('hl'); const conn = new Set([id]);
    $$('.edge', svg).forEach(ed => { const [a, b] = ed.dataset.e.split('|'); if (a === id || b === id) { ed.classList.add('on'); conn.add(a); conn.add(b); } });
    $$('.node', svg).forEach(nd => nd.classList.toggle('on', conn.has(nd.dataset.m)));
  }
  let pinned = null;
  const restore = () => { if (pinned && pinned.length) lit(pinned); else clear(); };
  $$('.node', svg).forEach(nd => {
    const id = nd.dataset.m;
    nd.addEventListener('pointerenter', () => litNode(id));
    nd.addEventListener('pointerleave', restore);
    nd.addEventListener('focus', () => litNode(id));
    nd.addEventListener('blur', restore);
    const act = () => o.onNode && o.onNode(id);
    nd.addEventListener('click', act);
    nd.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  if (o.mode === 'select') $$('[data-hit]', svg).forEach(h => h.addEventListener('click', () => o.onEdge && o.onEdge(h.dataset.hit)));
  if (!reduce && o.draw) $$('.edge', svg).forEach((p, i) => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; p.getBoundingClientRect(); p.style.transition = `stroke-dashoffset .9s ${(i * 12) % 500}ms ease`; requestAnimationFrame(() => { p.style.strokeDashoffset = 0; }); setTimeout(() => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; p.style.transition = ''; }, 1900); });
  return { pin(ids) { pinned = ids; restore(); }, lit, litNode };
}

/* ---------- komponenty ---------- */
function confChip(c) { const k = CONF[c] || CONF.inf; return `<span class="chip" style="background:${k.l};border-color:transparent;color:${k.c}" title="${esc(k.d)}"><i class="dot" style="background:${k.c}"></i>${k.n}</span>`; }
function modChips(q) { return q.mods.map(m => `<span class="chip m" style="${modById[m] ? 'color:' + gOf(m).color : ''}">[${m}]</span>`).join(''); }
function explain(q) {
  let h = '';
  if (q.type === 'open') h += `<div class="why"><h4>Odpowiedź</h4><p>${rich(q.ans)}</p></div>`;
  if (q.zal && q.akt) h += `<div class="dual"><div class="dbox z"><h4>Pod zaliczenie</h4>${rich(q.zal)}</div><div class="dbox a"><h4>Aktualnie klinicznie</h4>${rich(q.akt)}</div></div>`;
  if (q.why) h += `<div class="why"><h4>Omówienie</h4>${/<p>/i.test(q.why) ? rich(q.why) : '<p>' + rich(q.why) + '</p>'}</div>`;
  if (q.tip) h += `<div class="tip"><h4>Jak to zapamiętać</h4>${rich(q.tip)}</div>`;
  const bits = [];
  if (q.src) bits.push('Źródło: ' + esc(q.src));
  if (q.adapt) bits.push('Opcje odpowiedzi uzupełnione lub zrekonstruowane (plik zawiera tylko klucz lub fragment)');
  if (bits.length) h += `<p class="srcline">${bits.join(' · ')}</p>`;
  return h;
}
function optsStatic(q) {
  if (q.type === 'open' || !q.opts) return '';
  return `<div class="opts">${q.opts.map((o, i) => `<div class="opt${q.keys.includes(i) ? ' ok' : ''}"><span class="l">${L[i]}</span><span>${esc(o)}</span></div>`).join('')}</div>`;
}
function bankChip(b) {
  const bank = BANKS[b] || BANKS.zaklad;
  return `<span class="chip" style="font-weight:700;background:var(--surface);border-color:var(--line)" title="${esc(bank.desc)}">${bank.icon} ${bank.short}</span>`;
}
function qCard(q, open) {
  const bm = !!S.bm[q.id];
  const a = S.ans[q.id];
  return `<details class="qc" data-q="${q.id}"${open ? ' open' : ''}>
    <summary><div><div class="stem">${escB(q.stem)}</div>
      <div class="tags">${bankChip(q.bank)}${modChips(q)}${confChip(q.conf)}${q.gap ? '<span class="chip" style="background:var(--amber-l);color:var(--amber);border-color:transparent">klucz ≠ wytyczne</span>' : ''}${q.type === 'open' ? '<span class="chip">otwarte</span>' : ''}<span class="chip">${esc(ASHORT[q.at] || 'Moduł')}</span>${a ? `<span class="chip" style="background:${a.last ? 'var(--green-l)' : 'var(--red-l)'};color:${a.last ? 'var(--green)' : 'var(--red)'};border-color:transparent">${a.last ? 'opanowane' : 'do powtórki'}</span>` : ''}</div></div>
      <span class="chev" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 4 4 4 4-4"/></svg></span></summary>
    <div class="body">${optsStatic(q)}${explain(q)}
      <div class="acts"><a class="btn sec sm" href="${atlasHref(q)}">Otwórz temat w atlasie</a><button class="bm" data-bm="${q.id}" aria-pressed="${bm}" aria-label="Zakładka" title="Zakładka"><svg width="16" height="16" viewBox="0 0 16 16" fill="${bm ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8"><path d="M3.5 2h9v12L8 11 3.5 14z"/></svg></button>${q.isCustom ? `<button class="btn sec sm del-cq" data-del="${q.id}" style="color:var(--red);margin-left:auto" title="Usuń z bazy własnych pytań">Usuń pytanie</button>` : ''}</div>
    </div></details>`;
}
function delegateBm(root, onMutate) {
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-bm]');
    if (b) {
      e.preventDefault(); const id = b.dataset.bm;
      if (S.bm[id]) delete S.bm[id]; else S.bm[id] = 1;
      save(); const on = !!S.bm[id]; b.setAttribute('aria-pressed', on); $('svg', b).setAttribute('fill', on ? 'currentColor' : 'none');
      toast(on ? 'Dodano zakładkę' : 'Usunięto zakładkę');
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      e.preventDefault(); const id = del.dataset.del;
      if (confirm('Czy na pewno chcesz usunąć to pytanie z bazy własnych?')) {
        CUSTOM_Q = CUSTOM_Q.filter(x => x.id !== id);
        saveCustomQ();
        toast('Pytanie zostało usunięte');
        if (onMutate) onMutate();
      }
    }
  });
}

/* ---------- router ---------- */
function parseHash() {
  const raw = location.hash.slice(1) || '/'; const [path, qs] = raw.split('?');
  return { parts: path.split('/').filter(Boolean).map(decodeURIComponent), params: Object.fromEntries(new URLSearchParams(qs || '')) };
}
let current = { name: null, id: null };
let SESSION = null;
function route() {
  const { parts, params } = parseHash(); const name = parts[0] || 'start';
  // czytnik: ten sam atlas → tylko kotwica
  if (name === 'atlas' && current.name === 'atlas' && current.id === parts[1] && $('#rf')) { setAnchor(parts[1], parts[2]); return; }
  document.body.classList.toggle('reader', name === 'atlas');
  $$('#menu a').forEach(a => { const r = a.dataset.r; a.classList.toggle('on', r === name || (r === 'atlasy' && name === 'atlas')); });
  const v = { start: viewStart, atlasy: viewGallery, atlas: viewReader, trening: viewTrening, egzamin: viewExam, pytania: viewQuestions, notatki: viewNotes, polaczenia: viewConnections, postep: viewProgress }[name];
  current = { name, id: parts[1] || null };
  main.classList.remove('view'); void main.offsetWidth; main.classList.add('view');
  if (!v) { location.hash = '#/'; return; }
  v(parts, params);
  renderFooter();
  if (name !== 'atlas') window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* ---------- STRONA GŁÓWNA ---------- */
function viewStart() {
  const last = S.last && atById[S.last.at];
  const contHref = last ? '#/atlas/' + S.last.at + (S.last.a ? '/' + S.last.a : '') : '#/atlas/brzuch';
  const sample = [];
  ['brzuch', 'lite', 'hemato', 'nefro'].forEach(a => { const q = Q.find(x => x.at === a && x.zal && x.akt && x.stem.length < 200); if (q && sample.length < 2) sample.push(q); });
  const confRows = ATLASES.map(a => {
    const qs = Q.filter(q => q.at === a.id), tot = qs.length;
    const seg = ['src', 'inf', 'unk', 'did', 'own'].map(k => { const c = qs.filter(q => q.conf === k).length; return c ? `<i style="width:${100 * c / tot}%;background:${CONF[k].c}" title="${CONF[k].n}: ${c}"></i>` : ''; }).join('');
    return `<div class="crow"><span>${esc(ASHORT[a.id])}</span><div class="cstack">${seg}</div><span class="mono muted">${tot}</span></div>`;
  }).join('');
  main.innerHTML = `
  <section class="hero"><div class="wrap grid">
    <div>
      <div class="eyebrow">Pediatria · V rok · zaliczenie</div>
      <h1>Cały materiał w <em>jednym</em> miejscu.</h1>
      <p class="sub">Osiem atlasów modułowych, ${Q.length} zadań testowych i mapa powiązań między tematami. Czytasz, ćwiczysz, wracasz do błędów, a hub pamięta, gdzie skończyłeś.</p>
      <div class="cta">
        <a class="btn pri" href="${contHref}" id="cont">${last ? 'Kontynuuj: ' + esc(ASHORT[S.last.at]) : 'Zacznij od bólu brzucha'} <span aria-hidden="true">→</span></a>
        <a class="btn sec" href="#/trening?auto=1">Trening mieszany · 10 pytań</a>
      </div>
      <div class="stats" aria-label="Zakres hubu">
        <div class="stat"><b data-n="${ATLASES.length}">${ATLASES.length}</b><span>atlasów</span></div>
        <div class="stat"><b><i style="font-style:normal" data-n="${coveredBase.length}">${coveredBase.length}</i><small style="font-size:1rem;color:var(--muted)">/${baseNums.length}</small></b><span>modułów pokrytych</span></div>
        <div class="stat"><b data-n="${Q.length}">${Q.length}</b><span>zadań z omówieniem</span></div>
        <div class="stat"><b data-n="${gapCount}">${gapCount}</b><span>rozbieżności klucz ↔ wytyczne</span></div>
      </div>
    </div>
    <div class="hero-viz"><div id="heroGraph"></div><p class="cap"><b>Mapa powiązań.</b> Najedź na węzeł, aby zobaczyć moduły, które łączą wspólne pytania i pułapki.</p></div>
  </div></section>

  <section class="blk" id="mapa"><div class="wrap">
    <div class="eyebrow">Mapa modułów</div><h2>Piętnaście modułów, cztery obszary</h2>
    <p class="lead">Każdy kafelek prowadzi prosto do właściwej sekcji atlasu. Przerywane obramowanie oznacza moduł, którego atlasu jeszcze nie ma w Projekcie.</p>
    <div class="map">${Object.keys(GROUPS).map(g => `<div class="mgroup" style="--gc:${GROUPS[g].color}"><div class="gl">Obszar ${g}</div><h3>${GROUPS[g].name}</h3><div class="stack">${MODS.filter(m => m.g === g).map(m => {
      const st = modStats(m.id), tag = m.at ? 'a' : 'div';
      const right = m.at ? (st.att ? `<span class="acc">${pct(st.ok, st.att)}%</span>` : `<span class="acc">${st.total}</span>`) : '<span class="acc">brak</span>';
      return `<${tag} class="mtile${m.at ? '' : ' miss'}" ${m.at ? `href="#/atlas/${m.at}/${m.a}"` : ''} style="--gc:${GROUPS[m.g].color}"><span class="nb">${m.id}</span><span><b>${esc(m.n)}</b><small>${esc(m.d)}</small></span>${right}</${tag}>`;
    }).join('')}</div></div>`).join('')}</div>
    <p class="srcline" style="margin-top:1rem">Liczba po prawej: odsetek poprawnych odpowiedzi w hubie albo, bez prób, liczba zadań modułu.</p>
  </div></section>

  <section class="blk" id="petla"><div class="wrap">
    <div class="eyebrow">Pętla nauki</div><h2>Od zrozumienia do powtórki</h2>
    <p class="lead">Cztery kroki, które hub łączy w jedną ścieżkę zamiast siedmiu osobnych plików.</p>
    <div class="loop">
      <a class="step" href="#/atlasy"><h3>Atlas</h3><p>Schematy, algorytmy, wiek a przyczyna i karty chorób, osobno dla każdego modułu.</p><span class="go">Otwórz atlasy →</span></a>
      <a class="step" href="#/trening"><h3>Trening</h3><p>Mieszane sesje ze wszystkich atlasów, w trybie nauki albo egzaminu.</p><span class="go">Ułóż sesję →</span></a>
      <a class="step" href="#/pytania"><h3>Baza pytań</h3><p>Wyszukiwarka z filtrami pewności klucza, rozbieżności i zakładek.</p><span class="go">Przeszukaj ${Q.length} zadań →</span></a>
      <a class="step" href="#/postep"><h3>Powtórka</h3><p>Moduły z największą liczbą błędów i szybki powrót do zadań, które nie wyszły.</p><span class="go">Zobacz postęp →</span></a>
    </div>
  </div></section>

  <section class="blk" id="dwa"><div class="wrap">
    <div class="eyebrow">Zasada hubu</div><h2>Pod zaliczenie czy aktualnie klinicznie?</h2>
    <p class="lead">Klucz zakładowej puli bywa nieaktualny. Tam, gdzie źródła się rozchodzą, atlasy pokazują oba stanowiska osobno, tak aby było widać, co zaznaczyć na teście, a co robić przy łóżku pacjenta.</p>
    <div class="dcase">${sample.map(q => `<div class="card"><div class="q">${esc(q.stem)}</div><div class="tags" style="display:flex;gap:.3rem;margin:.5rem 0 .8rem">${modChips(q)}${confChip(q.conf)}</div><div class="dual"><div class="dbox z"><h4>Pod zaliczenie</h4>${rich(q.zal)}</div><div class="dbox a"><h4>Aktualnie klinicznie</h4>${rich(q.akt)}</div></div></div>`).join('')}</div>
    <p style="margin-top:1rem"><a class="btn sec" href="#/pytania?gap=1">Zobacz wszystkie ${gapCount} rozbieżności →</a></p>
  </div></section>

  <section class="blk"><div class="wrap">
    <div class="eyebrow">Przejrzystość źródeł</div><h2>Jak pewny jest klucz?</h2>
    <p class="lead">Powtarzalność pytania w pulach jest sygnałem do nauki, nie prognozą egzaminu. Każde zadanie niesie więc znacznik pewności klucza.</p>
    <div class="card"><div class="cbars">${confRows}</div>
      <div class="legend">${Object.keys(CONF).filter(k => Q.some(q => q.conf === k)).map(k => `<span><i class="dot" style="background:${CONF[k].c}"></i><b>${CONF[k].n}</b> – ${CONF[k].d}</span>`).join('')}</div></div>
  </div></section>

  <section class="blk"><div class="wrap">
    <div class="eyebrow">Anty-błąd</div><h2>Pułapki, w których tematy się przecinają</h2>
    <p class="lead">Najczęstsze pomyłki powstają na styku modułów. Mapa powiązań zbiera je w jednym widoku.</p>
    <div class="agrid">${TRAPS.slice(0, 3).map(t => `<a class="acard" href="#/polaczenia?trap=${TRAPS.indexOf(t)}" style="--c1:var(--red);--c2:var(--amber)"><div class="pillrow">${t.mods.map(m => `<span class="chip m" style="color:${gOf(m).color}">[${m}]</span>`).join('')}</div><h3>${esc(t.t)}</h3><p>${esc(t.eq)}</p><p style="color:var(--red);font-weight:800">${esc(t.out)}</p></a>`).join('')}</div>
    <p style="margin-top:1.2rem"><a class="btn pri" href="#/polaczenia">Otwórz mapę powiązań →</a></p>
  </div></section>`;
  const hg = renderGraph($('#heroGraph'), { labels: false, draw: true, onNode: id => { const m = modById[id]; location.hash = m.at ? '#/atlas/' + m.at + '/' + m.a : '#/polaczenia?mod=' + id; } });
  // licznik
  if (!reduce) $$('[data-n]').forEach(el => { const t = +el.dataset.n; const t0 = performance.now(); (function tick(now) { const p = Math.min(1, (now - t0) / 900); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0); });
}

/* ---------- GALERIA ATLASÓW ---------- */
function viewGallery() {
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap">
    <div class="eyebrow">Atlasy</div><h2>Osiem atlasów modułowych</h2>
    <p class="lead">Atlasy działają wewnątrz hubu, ale zachowują własną nawigację. Ostatnio otwarte są oznaczone.</p>
    <div class="agrid">${ATLASES.map(a => {
      const qs = Q.filter(q => q.at === a.id), g = GA[a.id]; const vis = S.visited[a.id];
      const ok = qs.filter(q => S.ans[q.id] && S.ans[q.id].last).length, att = qs.filter(q => S.ans[q.id]).length;
      return `<a class="acard" href="#/atlas/${a.id}" style="--c1:${g[0]};--c2:${g[1]}"><div class="pillrow">${a.mods.map(m => `<span class="chip m" style="color:${gOf(m).color}">[${m}]</span>`).join('')}${vis ? '<span class="chip" style="background:var(--teal-l);color:var(--teal-d);border-color:transparent">otwarty</span>' : ''}</div>
      <h3>${esc(a.t)}</h3><p>${esc(a.d)}</p>
      <div class="meta"><span>${a.secs.length} sekcji</span><span>${qs.length} zadań</span><span>${att ? pct(ok, att) + '% poprawnych' : 'bez prób'}</span></div></a>`;
    }).join('')}</div>
  </div></section>`;
}

/* ---------- CZYTNIK ATLASU ---------- */
function setAnchor(id, a) {
  const at = atById[id]; if (!at) return; const f = $('#rf');
  const url = 'atlasy/' + at.dir + '/index.html' + (a ? '#' + a : '');
  if (f.getAttribute('src') !== url) f.setAttribute('src', url);
  $('#secSel').value = a || '';
  S.visited[id] = Date.now(); S.last = { at: id, a: a || null }; save();
  setTimeout(() => syncIframeTheme(getEffectiveTheme()), 60);
}
function viewReader(parts) {
  const id = parts[1], a = parts[2], at = atById[id];
  if (!at) { location.hash = '#/atlasy'; return; }
  main.innerHTML = `<div class="rbar"><div class="wrap">
    <a class="btn sec sm" href="#/atlasy" aria-label="Wróć do listy atlasów">← Atlasy</a>
    <nav class="rtabs" aria-label="Przełącznik atlasów">${ATLASES.map(x => `<a class="rtab${x.id === id ? ' on' : ''}" href="#/atlas/${x.id}"><b>${x.tag}</b> ${esc(ASHORT[x.id])}</a>`).join('')}</nav>
    <label class="sr" for="secSel">Przejdź do sekcji</label>
    <select id="secSel" class="tgl" style="max-width:190px"><option value="">Sekcje…</option>${at.secs.map(s => `<option value="${s[0]}">${esc(s[1])}</option>`).join('')}</select>
    <a class="btn pri sm" href="#/trening?at=${id}">Trening z atlasu</a>
    <a class="btn sec sm" target="_blank" rel="noopener" href="atlasy/${at.dir}/index.html" title="Otwórz atlas w osobnej karcie" aria-label="Otwórz atlas w osobnej karcie">↗</a>
  </div></div>
  <iframe id="rf" class="rframe" title="Atlas: ${esc(at.t)}" src="" loading="eager"></iframe>`;
  $('#secSel').addEventListener('change', e => { location.hash = '#/atlas/' + id + (e.target.value ? '/' + e.target.value : ''); });
  const rf = $('#rf');
  if (rf) {
    rf.addEventListener('load', () => syncIframeTheme(getEffectiveTheme()));
  }
  setAnchor(id, a);
  $('.rtab.on').scrollIntoView({ inline: 'center', block: 'nearest' });
}

/* ---------- POŁĄCZENIA ---------- */
function viewConnections(parts, params) {
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap">
    <div class="eyebrow">Połączenia międzymodułowe</div><h2>Gdzie tematy się przecinają</h2>
    <p class="lead">Grubość linii to liczba zadań oznaczonych obydwoma modułami. Turkusowe linie to pułapki kliniczne, w których jeden obraz wymaga wiedzy z kilku modułów.</p>
    <div class="conn">
      <div class="card" style="padding:.6rem"><div id="bigGraph"></div></div>
      <div class="sticky"><div id="panel"></div></div>
    </div>
  </div></section>
  <section class="blk"><div class="wrap">
    <h2>Pułapki kliniczne</h2><p class="lead">Kliknij pułapkę, aby podświetlić powiązane moduły na mapie.</p>
    <div class="agrid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))" id="traps">${TRAPS.map((t, i) => `<button class="trap" data-t="${i}"><h4>${esc(t.t)}</h4><div class="pillrow">${t.mods.map(m => `<span class="chip m" style="color:${gOf(m).color}">[${m}]</span>`).join('')}</div><span class="eq">${esc(t.eq)}</span><span class="out">→ ${esc(t.out)}</span></button>`).join('')}</div>
  </div></section>
  <section class="blk"><div class="wrap">
    <h2>Macierz współwystępowania</h2><p class="lead">Ile zadań łączy dwa moduły. Kliknij komórkę, aby wybrać parę.</p>
    <div class="card" style="overflow:auto"><div id="matrix"></div></div>
  </div></section>`;
  const panel = $('#panel');
  const g = renderGraph($('#bigGraph'), { mode: 'select', draw: true, onNode: selNode, onEdge: selEdge });
  function intro() {
    g.pin(null);
    panel.innerHTML = `<div class="card"><h3>Jak czytać mapę</h3><p class="muted" style="margin:.4rem 0 .8rem">Wybierz moduł albo linię. Panel pokaże powiązane tematy, pułapki i zadania łączące oba moduły.</p>
      <div class="legend" style="margin:0">${Object.keys(GROUPS).map(k => `<span><i class="dot" style="background:${GROUPS[k].hex}"></i>${GROUPS[k].short}</span>`).join('')}<span><i class="dot" style="background:var(--teal)"></i>pułapka kliniczna</span><span><i class="dot" style="border:2px dashed var(--muted);background:#fff"></i>brak atlasu</span></div></div>`;
  }
  function selNode(id) {
    const m = modById[id]; g.pin([id]); g.litNode(id);
    const conn = EDGES.filter(e => e.a === id || e.b === id).map(e => ({ o: e.a === id ? e.b : e.a, e })).sort((x, y) => y.e.w - x.e.w);
    panel.innerHTML = `<div class="card"><div class="pillrow"><span class="chip m" style="background:${gOf(id).color};color:#fff;border:0">[${id}]</span><span class="chip">${GROUPS[m.g].short}</span></div>
      <h3 style="margin:.5rem 0 .2rem;font-size:1.3rem;font-family:var(--font-display)">${esc(m.n)}</h3><p class="muted">${esc(m.d)}</p>
      <div class="acts" style="margin:.9rem 0">${m.at ? `<a class="btn pri sm" href="#/atlas/${m.at}/${m.a}">Atlas</a>` : '<span class="chip">brak atlasu</span>'}<a class="btn sec sm" href="#/pytania?mods=${id}">Zadania</a>${m.at ? `<a class="btn sec sm" href="#/trening?mods=${id}">Trening</a>` : ''}</div>
      <div class="flab" style="margin-bottom:.4rem">Powiązane moduły</div>
      <div class="pillrow">${conn.map(c => `<button class="tgl" data-e="${c.e.a}|${c.e.b}">[${c.o}] ${esc(SHORT[c.o])} <b>${c.e.w}</b>${c.e.traps.length ? ' ●' : ''}</button>`).join('') || '<span class="muted">brak</span>'}</div></div>`;
  }
  function selEdge(k) {
    const e = E[k]; if (!e) return; g.pin([e.a, e.b]); g.lit([e.a, e.b]);
    panel.innerHTML = `<div class="card"><div class="pillrow"><span class="chip m" style="background:${gOf(e.a).color};color:#fff;border:0">[${e.a}]</span><span aria-hidden="true">↔</span><span class="chip m" style="background:${gOf(e.b).color};color:#fff;border:0">[${e.b}]</span></div>
      <h3 style="margin:.5rem 0;font-size:1.15rem">${esc(SHORT[e.a])} ↔ ${esc(SHORT[e.b])}</h3>
      <p><b>${e.w}</b> ${e.w === 1 ? 'zadanie łączy' : 'zadań łączy'} oba moduły.</p>
      ${e.traps.map(t => `<div class="trap on" style="margin-top:.6rem;cursor:default"><h4>${esc(t.t)}</h4><span class="eq">${esc(t.eq)}</span><span class="out">→ ${esc(t.out)}</span><span class="eq">${esc(t.tip)}</span></div>`).join('')}
      <div class="acts" style="margin-top:.9rem">${e.w ? `<a class="btn pri sm" href="#/pytania?mods=${e.a},${e.b}&all=1">Pokaż zadania</a>` : ''}<button class="btn sec sm" id="clr">Wyczyść</button></div></div>`;
    const c = $('#clr'); if (c) c.onclick = () => { intro(); g.lit([]); };
  }
  panel.addEventListener('click', ev => { const b = ev.target.closest('[data-e]'); if (b) selEdge(b.dataset.e); });
  $('#traps').addEventListener('click', ev => {
    const b = ev.target.closest('[data-t]'); if (!b) return; const t = TRAPS[+b.dataset.t];
    $$('#traps .trap').forEach(x => x.classList.toggle('on', x === b)); g.pin(t.mods); g.lit(t.mods);
    panel.innerHTML = `<div class="card"><div class="eyebrow">Pułapka</div><h3 style="font-size:1.3rem;font-family:var(--font-display);margin-bottom:.4rem">${esc(t.t)}</h3><p>${esc(t.eq)}</p><p style="color:var(--red);font-weight:800;margin:.4rem 0">→ ${esc(t.out)}</p><p class="muted">${esc(t.tip)}</p>
      <div class="acts" style="margin-top:.9rem">${t.mods.map(m => modById[m].at ? `<a class="btn sec sm" href="#/atlas/${modById[m].at}/${modById[m].a}">[${m}] ${esc(SHORT[m])}</a>` : `<span class="chip">[${m}] ${esc(SHORT[m])} · brak atlasu</span>`).join('')}</div></div>`;
    if (innerWidth < 1000) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  // macierz
  const ids = MODS.map(m => m.id); const mx = Math.max(...EDGES.map(e => e.w));
  $('#matrix').innerHTML = `<table class="matrix"><tr><th></th>${ids.map(i => `<th style="color:${gOf(i).color}">${i}</th>`).join('')}</tr>${ids.map((r, ri) => `<tr><th style="text-align:right;color:${gOf(r).color}">${r}</th>${ids.map((c, ci) => {
    if (ci > ri) return '<td></td>'; if (ci === ri) return `<td style="background:${gOf(r).soft}"></td>`;
    const e = E[edgeKey(r, c)]; const w = e ? e.w : 0;
    return `<td data-e="${e ? e.a + '|' + e.b : ''}" style="background:${w ? `rgba(12,122,133,${(.14 + .86 * w / mx).toFixed(2)})` : 'var(--line-2)'};color:${w / mx > .5 ? '#fff' : 'var(--ink-2)'};${e ? 'cursor:pointer' : ''}" title="[${r}] ↔ [${c}]: ${w}">${w || ''}</td>`;
  }).join('')}</tr>`).join('')}</table>`;
  $('#matrix').addEventListener('click', ev => { const td = ev.target.closest('td[data-e]'); if (td && td.dataset.e) selEdge(td.dataset.e); });
  intro();
  if (params.mod && modById[params.mod]) selNode(params.mod);
  else if (params.trap != null && TRAPS[+params.trap]) { const b = $(`#traps [data-t="${+params.trap}"]`); b && b.click(); }
}

/* ---------- PARSER IMPORTU PYTAŃ ---------- */
function parseQuestionsInput(input, defaultBank = 'zaklad', defaultMod = '1') {
  const trimmed = String(input || '').trim();
  if (!trimmed) return [];

  // 1. Sprawdź czy dane są w formacie JSON
  if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      const parsed = JSON.parse(trimmed);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr.map((item, idx) => {
        const id = 'cq-' + Date.now() + '-' + idx + '-' + Math.floor(Math.random() * 1000);
        const stem = String(item.stem || item.question || '').trim();
        const opts = Array.isArray(item.opts || item.answers || item.options) ? (item.opts || item.answers || item.options).map(String) : [];
        let keys = [];
        if (Array.isArray(item.keys)) keys = item.keys;
        else if (typeof item.key === 'number') keys = [item.key];
        else if (typeof item.key === 'string') {
          const l = item.key.trim().toUpperCase();
          const idxL = 'ABCDEFGH'.indexOf(l);
          if (idxL !== -1) keys = [idxL];
        }
        const b = item.bank || defaultBank;
        const m = (Array.isArray(item.mods) && item.mods.length) ? item.mods : [defaultMod];
        return {
          id: item.id || id,
          at: item.at || (modById[m[0]]?.at) || 'brzuch',
          type: opts.length ? 'mcq' : 'open',
          mods: m,
          topic: item.topic || '',
          stem: stem,
          opts: opts,
          keys: keys.length ? keys : [0],
          conf: item.conf || 'src',
          adapt: !!item.adapt,
          gap: !!item.gap,
          src: item.src || (BANKS[b]?.n || 'Własne'),
          bank: b,
          why: item.why || item.explanation || '',
          tip: item.tip || '',
          zal: item.zal || '',
          akt: item.akt || '',
          ans: item.ans || '',
          isCustom: true
        };
      }).filter(q => q.stem && (q.type === 'open' || q.opts.length >= 2));
    } catch (e) {
      /* Niepoprawny JSON - spróbuj parsowania tekstu */
    }
  }

  // 2. Parser tekstu ze standardowych formatów testów (1. Pytanie... A. ... B. ... Klucz: B)
  const rawBlocks = trimmed.split(/(?=(?:^|\n)\s*(?:\d+[\.\)]|Pytanie\s*\d+[\.:]?)\s*)/i).filter(b => b.trim());
  const questions = [];

  rawBlocks.forEach((block, bIdx) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;

    let stemLines = [];
    let opts = [];
    let correctKey = -1;
    let why = '';
    let src = '';
    let inWhy = false;

    lines.forEach(line => {
      const keyMatch = line.match(/^(?:Prawid(?:ł|l)owa|Poprawna|Klucz|Odpowied(?:ź|z)|Odp|Odp\.)\s*[:=-]?\s*([A-H])/i);
      if (keyMatch) {
        correctKey = 'ABCDEFGH'.indexOf(keyMatch[1].toUpperCase());
        inWhy = false;
        return;
      }

      const whyMatch = line.match(/^(?:Om(?:ó|o)wienie|Wyja(?:ś|s)nienie|Komentarz)\s*[:=-]?\s*(.*)/i);
      if (whyMatch) {
        inWhy = true;
        if (whyMatch[1]) why += (why ? ' ' : '') + whyMatch[1];
        return;
      }

      const srcMatch = line.match(/^(?:(?:Ź|Z|z|ź)r(?:ó|o)d(?:ł|l)o|Pula|Egzamin)\s*[:=-]?\s*(.*)/i);
      if (srcMatch) {
        src = srcMatch[1];
        inWhy = false;
        return;
      }

      const optMatch = line.match(/^[\(\[]?([A-H])[\)\.\:]\s*(.*)/i);
      if (optMatch) {
        inWhy = false;
        const optLetter = optMatch[1].toUpperCase();
        const optIdx = 'ABCDEFGH'.indexOf(optLetter);
        const optText = optMatch[2].trim();
        if (/\*|\[x\]|\(x\)|\(prawid(?:ł|l)owa\)/i.test(line)) {
          correctKey = optIdx;
        }
        opts[optIdx] = optText.replace(/\*|\[x\]|\(x\)|\(prawid(?:ł|l)owa\)/gi, '').trim();
        return;
      }

      if (inWhy) {
        why += (why ? ' ' : '') + line;
      } else if (!opts.length) {
        const cleaned = line.replace(/^\d+[\.\)]\s*/, '');
        stemLines.push(cleaned);
      }
    });

    const stem = stemLines.join(' ').trim();
    const cleanOpts = opts.filter(Boolean);

    if (stem && cleanOpts.length >= 2) {
      questions.push({
        id: 'cq-' + Date.now() + '-' + bIdx + '-' + Math.floor(Math.random() * 1000),
        at: modById[defaultMod]?.at || 'brzuch',
        type: 'mcq',
        mods: [defaultMod],
        topic: '',
        stem: stem,
        opts: cleanOpts,
        keys: [correctKey >= 0 ? correctKey : 0],
        conf: 'src',
        adapt: false,
        gap: false,
        src: src || BANKS[defaultBank]?.n || 'Własne',
        bank: defaultBank,
        why: why,
        tip: '',
        zal: '',
        akt: '',
        ans: '',
        isCustom: true
      });
    }
  });

  return questions;
}

/* ---------- BAZA PYTAŃ ---------- */
const F = { q: '', at: new Set(), mods: new Set(), banks: new Set(), all: false, conf: new Set(), gap: false, bm: false, wrong: false, open: 'all', limit: 40, tab: 'browse', addMode: 'single' };
let parsedImportStash = [];

function viewQuestions(parts, params) {
  if (Object.keys(params).length) {
    F.q = params.q || ''; F.at = new Set((params.at || '').split(',').filter(Boolean)); F.mods = new Set((params.mods || '').split(',').filter(Boolean));
    F.banks = new Set((params.bank || '').split(',').filter(Boolean));
    F.all = !!params.all; F.conf = new Set((params.conf || '').split(',').filter(Boolean)); F.gap = !!params.gap; F.bm = !!params.bm; F.wrong = !!params.wrong; F.limit = 40;
    if (params.tab) F.tab = params.tab;
  }
  
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap">
    <div class="eyebrow">Baza pytań i banki zewnętrzne</div><h2>${Q.length} zadań · Pula, LEK, PES, MP</h2>
    <p class="lead">Przeglądaj pytania według banków, sprawdzaj klucze i omówienia lub twórz własne zadania testowe i importuj całe zestawy.</p>
    
    <div class="qtabs" id="qTabs">
      <button class="qtab${F.tab === 'browse' ? ' on' : ''}" data-t="browse">🔍 Przeglądaj pytania (${Q.length})</button>
      <button class="qtab${F.tab === 'add' ? ' on' : ''}" data-t="add">➕ Dodaj nowe pytanie / Import</button>
      <button class="qtab${F.tab === 'export' ? ' on' : ''}" data-t="export">📤 Eksport dodanych (${CUSTOM_Q.length})</button>
    </div>

    <div id="qTabContent"></div>
  </div></section>`;

  $('#qTabs').addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    F.tab = b.dataset.t;
    $$('#qTabs .qtab').forEach(x => x.classList.toggle('on', x === b));
    renderTabContent();
  });

  renderTabContent();
}

function renderTabContent() {
  const container = $('#qTabContent');
  if (!container) return;

  if (F.tab === 'browse') {
    renderBrowseTab(container);
  } else if (F.tab === 'add') {
    renderAddTab(container);
  } else if (F.tab === 'export') {
    renderExportTab(container);
  }
}

function renderBrowseTab(container) {
  container.innerHTML = `
    <div class="tool">
      <input class="field" id="fq" type="search" placeholder="Szukaj w treści pytań, odpowiedziach lub omówieniach…" value="${esc(F.q)}" aria-label="Szukaj w pytaniach">
      <div class="frow"><span class="flab">Bank</span><div class="pillrow" id="fBank">${Object.keys(BANKS).map(b => `<button class="tgl" data-v="${b}" aria-pressed="${F.banks.has(b)}">${BANKS[b].icon} ${BANKS[b].short} (${Q.filter(q => q.bank === b).length})</button>`).join('')}</div></div>
      <div class="frow"><span class="flab">Atlas</span><div class="pillrow" id="fAt">${ATLASES.map(a => `<button class="tgl" data-v="${a.id}" aria-pressed="${F.at.has(a.id)}">${a.tag} ${esc(ASHORT[a.id])}</button>`).join('')}</div></div>
      <div class="frow"><span class="flab">Moduł</span><div class="pillrow" id="fMod">${MODS.filter(m => Q.some(q => q.mods.includes(m.id))).map(m => `<button class="tgl g" style="--gc:${gOf(m.id).color}" data-v="${m.id}" aria-pressed="${F.mods.has(m.id)}">[${m.id}]</button>`).join('')}<button class="tgl" id="fAll" aria-pressed="${F.all}" title="Wymagaj wszystkich wybranych modułów jednocześnie">wszystkie naraz</button></div></div>
      <div class="frow"><span class="flab">Klucz</span><div class="pillrow" id="fConf">${Object.keys(CONF).filter(k => Q.some(q => q.conf === k)).map(k => `<button class="tgl" data-v="${k}" aria-pressed="${F.conf.has(k)}">${CONF[k].n}</button>`).join('')}</div></div>
      <div class="frow"><span class="flab">Tylko</span><div class="pillrow" id="fFlag"><button class="tgl" data-f="gap" aria-pressed="${F.gap}">klucz ≠ wytyczne</button><button class="tgl" data-f="wrong" aria-pressed="${F.wrong}">moje błędne</button><button class="tgl" data-f="bm" aria-pressed="${F.bm}">zakładki</button></div>
        <span style="flex:1"></span><span class="muted" id="fCount" style="font-weight:700"></span><button class="btn sec sm" id="fClr">Wyczyść</button></div>
    </div>
    <div class="qlist" id="qlist"></div><div style="text-align:center;margin-top:1.2rem" id="more"></div>
  `;

  const list = $('#qlist');
  function filtered() {
    const toks = norm(F.q).split(/\s+/).filter(Boolean);
    return Q.filter(q => {
      if (F.banks.size && !F.banks.has(q.bank)) return false;
      if (F.at.size && !F.at.has(q.at)) return false;
      if (F.mods.size) { const ms = [...F.mods]; if (F.all ? !ms.every(m => q.mods.includes(m)) : !ms.some(m => q.mods.includes(m))) return false; }
      if (F.conf.size && !F.conf.has(q.conf)) return false;
      if (F.gap && !q.gap) return false; if (F.bm && !S.bm[q.id]) return false;
      if (F.wrong && !(S.ans[q.id] && !S.ans[q.id].last)) return false;
      return toks.every(t => q._n.includes(t));
    });
  }
  function draw() {
    const r = filtered(); $('#fCount').textContent = r.length + ' z ' + Q.length;
    list.innerHTML = r.slice(0, F.limit).map(q => qCard(q)).join('') || '<div class="card" style="text-align:center;padding:2rem"><h3>Brak wyników</h3><p class="muted" style="margin:.3rem auto">Poluzuj filtry lub zmień frazę.</p></div>';
    $('#more').innerHTML = r.length > F.limit ? `<button class="btn sec" id="moreB">Pokaż kolejne ${Math.min(40, r.length - F.limit)} (zostało ${r.length - F.limit})</button>` : '';
    const mb = $('#moreB'); if (mb) mb.onclick = () => { F.limit += 40; draw(); };
  }
  const tgl = (sel, set) => $(sel).addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; const v = b.dataset.v; set.has(v) ? set.delete(v) : set.add(v); b.setAttribute('aria-pressed', set.has(v)); F.limit = 40; draw(); });
  tgl('#fBank', F.banks); tgl('#fAt', F.at); tgl('#fMod', F.mods); tgl('#fConf', F.conf);
  $('#fAll').addEventListener('click', e => { F.all = !F.all; e.currentTarget.setAttribute('aria-pressed', F.all); draw(); });
  $('#fFlag').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; F[b.dataset.f] = !F[b.dataset.f]; b.setAttribute('aria-pressed', F[b.dataset.f]); F.limit = 40; draw(); });
  $('#fq').addEventListener('input', e => { F.q = e.target.value; F.limit = 40; draw(); });
  $('#fClr').addEventListener('click', () => { Object.assign(F, { q: '', at: new Set(), mods: new Set(), banks: new Set(), all: false, conf: new Set(), gap: false, bm: false, wrong: false, limit: 40 }); renderBrowseTab(container); });
  delegateBm(list, () => { draw(); $('#qTabs button[data-t="export"]').textContent = `📤 Eksport dodanych (${CUSTOM_Q.length})`; });
  draw();
}

function renderAddTab(container) {
  container.innerHTML = `
    <div style="display:flex;gap:.5rem;margin-bottom:1rem">
      <button class="btn ${F.addMode === 'single' ? 'pri' : 'sec'} sm" id="btnModeSingle">Pojedyncze pytanie</button>
      <button class="btn ${F.addMode === 'mass' ? 'pri' : 'sec'} sm" id="btnModeMass">Masowy import (tekst / JSON)</button>
    </div>
    <div id="addModeBox"></div>
  `;

  $('#btnModeSingle').onclick = () => { F.addMode = 'single'; renderAddTab(container); };
  $('#btnModeMass').onclick = () => { F.addMode = 'mass'; renderAddTab(container); };

  const box = $('#addModeBox');
  if (F.addMode === 'single') {
    box.innerHTML = `
      <form class="qform" id="sqForm">
        <div class="qform-row">
          <label for="sqStem">Treść pytania (stem) *</label>
          <textarea class="qform-textarea" id="sqStem" required placeholder="Wpisz treść pytania klinicznego lub teoretycznego..."></textarea>
        </div>

        <div class="qform-row">
          <label>Odpowiedzi i dystraktory (zaznacz kółkiem prawidłową odpowiedź) *</label>
          <div id="sqOptsList">
            ${['A', 'B', 'C', 'D', 'E'].map((l, i) => `
              <div class="qform-opt">
                <input type="radio" name="sqKey" value="${i}" ${i === 0 ? 'checked' : ''} title="Zaznacz odpowiedź ${l} jako prawidłową">
                <span class="opt-letter">${l}</span>
                <input class="qform-input opt-inp" placeholder="Treść opcji ${l}..." ${i < 2 ? 'required' : ''}>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="qform-grid">
          <div class="qform-row">
            <label for="sqBank">Bank / Źródło *</label>
            <select class="qform-select" id="sqBank">
              ${Object.keys(BANKS).map(b => `<option value="${b}">${BANKS[b].icon} ${BANKS[b].n}</option>`).join('')}
            </select>
          </div>
          <div class="qform-row">
            <label for="sqMod">Moduł główny *</label>
            <select class="qform-select" id="sqMod">
              ${MODS.map(m => `<option value="${m.id}">[${m.id}] ${esc(m.n)} (${GROUPS[m.g].short})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="qform-row">
          <label for="sqWhy">Omówienie / uzasadnienie kliniczne (opcjonalne)</label>
          <textarea class="qform-textarea" id="sqWhy" placeholder="Dlaczego ta odpowiedź jest prawidłowa, jakie wytyczne o tym decydują..."></textarea>
        </div>

        <div class="qform-acts">
          <button type="submit" class="btn pri">Dodaj pytanie do bazy</button>
          <button type="reset" class="btn sec">Wyczyść formularz</button>
        </div>
      </form>
    `;

    $('#sqForm').onsubmit = e => {
      e.preventDefault();
      const stem = $('#sqStem').value.trim();
      const inps = $$('.opt-inp', $('#sqOptsList'));
      const opts = inps.map(x => x.value.trim()).filter(Boolean);
      if (opts.length < 2) {
        toast('Podaj co najmniej 2 opcje odpowiedzi!');
        return;
      }
      const selRadio = $('input[name="sqKey"]:checked');
      const keyIdx = selRadio ? parseInt(selRadio.value, 10) : 0;
      const bank = $('#sqBank').value;
      const mod = $('#sqMod').value;
      const why = $('#sqWhy').value.trim();

      const newQ = {
        id: 'cq-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        at: modById[mod]?.at || 'brzuch',
        type: 'mcq',
        mods: [mod],
        topic: '',
        stem,
        opts,
        keys: [keyIdx < opts.length ? keyIdx : 0],
        conf: 'src',
        adapt: false,
        gap: false,
        src: BANKS[bank]?.n || 'Własne',
        bank,
        why,
        tip: '',
        zal: '',
        akt: '',
        ans: '',
        isCustom: true
      };

      CUSTOM_Q.push(newQ);
      saveCustomQ();
      toast('Pytanie zostało pomyślnie dodane!');
      $('#sqForm').reset();
      $('#qTabs button[data-t="export"]').textContent = `📤 Eksport dodanych (${CUSTOM_Q.length})`;
      $('#qTabs button[data-t="browse"]').textContent = `🔍 Przeglądaj pytania (${Q.length})`;
    };
  } else {
    box.innerHTML = `
      <div class="qform">
        <p class="muted">Wklej tekst pytań z numeracją i literami A–E (np. ze skryptu, PDF-a, bazy LEK/PES) lub wklej tablicę JSON. Parser automatycznie wyodrębni treść pytania, warianty odpowiedzi i klucz.</p>
        
        <div class="qform-grid">
          <div class="qform-row">
            <label for="mqBank">Domyślny bank</label>
            <select class="qform-select" id="mqBank">
              ${Object.keys(BANKS).map(b => `<option value="${b}">${BANKS[b].icon} ${BANKS[b].n}</option>`).join('')}
            </select>
          </div>
          <div class="qform-row">
            <label for="mqMod">Domyślny moduł</label>
            <select class="qform-select" id="mqMod">
              ${MODS.map(m => `<option value="${m.id}">[${m.id}] ${esc(m.n)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="qform-row">
          <label for="mqText">Treść pytań do importu</label>
          <textarea class="qform-textarea" id="mqText" style="min-height:160px" placeholder="Przykład formatu tekstowego:
1. Które ze stwierdzeń dotyczących zapalenia płuc u niemowląt jest fałszywe?
A. Najczęstszą etiologią są wirusy
B. Badaniem pierwszego wyboru jest TK klatki piersiowej
C. Duszność i tachypnoe to wiodące objawy
D. Antybiotykiem pierwszego rzutu jest amoksycylina
E. Wskazaniem do hospitalizacji jest saturacja <92%
Klucz: B
Omówienie: TK nie jest badaniem rutynowym, wystarczy badanie kliniczne i ew. RTG."></textarea>
        </div>

        <div class="qform-acts">
          <button class="btn pri" id="btnParse">Przetestuj i wyświetl podgląd</button>
          <button class="btn sec" id="btnCommitImport" style="display:none">Zatwierdź i dodaj do bazy</button>
        </div>

        <div id="mqPreview"></div>
      </div>
    `;

    $('#btnParse').onclick = () => {
      const text = $('#mqText').value;
      const b = $('#mqBank').value;
      const m = $('#mqMod').value;
      parsedImportStash = parseQuestionsInput(text, b, m);
      const prev = $('#mqPreview');
      const btnCommit = $('#btnCommitImport');

      if (!parsedImportStash.length) {
        prev.innerHTML = `<div class="card" style="margin-top:1rem;color:var(--red)">Nie udało się rozpoznać pytań. Upewnij się, że każde pytanie ma treść oraz warianty zaczynające się od A., B., C...</div>`;
        btnCommit.style.display = 'none';
        return;
      }

      btnCommit.style.display = 'inline-block';
      btnCommit.textContent = `Zatwierdź i dodaj ${parsedImportStash.length} ${parsedImportStash.length === 1 ? 'pytanie' : 'pytań'}`;

      prev.innerHTML = `
        <div class="preview-box">
          <h4 style="color:var(--green)">✓ Rozpoznano poprawnie: ${parsedImportStash.length} pytań</h4>
          <div class="qlist" style="margin-top:.8rem">
            ${parsedImportStash.slice(0, 5).map(q => qCard(q, true)).join('')}
            ${parsedImportStash.length > 5 ? `<p class="muted" style="margin-top:.5rem">...oraz ${parsedImportStash.length - 5} kolejnych pytań.</p>` : ''}
          </div>
        </div>
      `;
    };

    $('#btnCommitImport').onclick = () => {
      if (!parsedImportStash.length) return;
      CUSTOM_Q.push(...parsedImportStash);
      saveCustomQ();
      toast(`Dodano ${parsedImportStash.length} nowych pytań!`);
      parsedImportStash = [];
      $('#mqText').value = '';
      $('#mqPreview').innerHTML = '';
      $('#btnCommitImport').style.display = 'none';
      $('#qTabs button[data-t="export"]').textContent = `📤 Eksport dodanych (${CUSTOM_Q.length})`;
      $('#qTabs button[data-t="browse"]').textContent = `🔍 Przeglądaj pytania (${Q.length})`;
    };
  }
}

function renderExportTab(container) {
  const jsonStr = JSON.stringify(CUSTOM_Q, null, 2);
  container.innerHTML = `
    <div class="qform">
      <h3>Eksport pytań dodanych przez Ciebie (${CUSTOM_Q.length})</h3>
      <p class="muted">Pytania zapisane są w pamięci Twojej przeglądarki. Aby wdrożyć je na stałe do repozytorium GitHub i dla wszystkich użytkowników, skopiuj poniższy kod JSON lub pobierz plik.</p>
      
      <div class="qform-row">
        <textarea class="qform-textarea" id="expJson" style="min-height:220px;font-family:monospace;font-size:.85rem" readonly>${esc(jsonStr)}</textarea>
      </div>

      <div class="qform-acts">
        <button class="btn pri" id="btnCopyJson">Skopiuj kod JSON</button>
        <button class="btn sec" id="btnDownloadJson">Pobierz plik .json</button>
        ${CUSTOM_Q.length ? `<button class="btn sec" id="btnClearCustom" style="color:var(--red);margin-left:auto">Wyczyść wszystkie dodane (${CUSTOM_Q.length})</button>` : ''}
      </div>
    </div>
  `;

  $('#btnCopyJson').onclick = async () => {
    try {
      await navigator.clipboard.writeText(jsonStr);
      toast('Skopiowano kod JSON do schowka!');
    } catch (e) {
      $('#expJson').select();
      toast('Zaznaczono tekst, skopiuj go za pomocą Ctrl+C');
    }
  };

  $('#btnDownloadJson').onclick = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pediatria-hub-pytania-custom-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Pobrano plik JSON!');
  };

  const btnClear = $('#btnClearCustom');
  if (btnClear) {
    btnClear.onclick = () => {
      if (confirm('Czy na pewno chcesz usunąć wszystkie pytania dodane w tej przeglądarce? Tej operacji nie można cofnąć.')) {
        CUSTOM_Q = [];
        saveCustomQ();
        toast('Wyczyszczono dodane pytania');
        $('#qTabs button[data-t="export"]').textContent = `📤 Eksport dodanych (0)`;
        $('#qTabs button[data-t="browse"]').textContent = `🔍 Przeglądaj pytania (${Q.length})`;
        renderExportTab(container);
      }
    };
  }
}

/* ---------- TRENING ---------- */
const C = { at: new Set(), mods: new Set(), banks: new Set(), conf: new Set(), gap: false, wrong: false, bm: false, fresh: false, open: false, n: 10, mode: 'learn' };
function pool() {
  return Q.filter(q => {
    if (q.type === 'open' && !C.open) return false;
    if (C.banks.size && !C.banks.has(q.bank)) return false;
    if (C.at.size && !C.at.has(q.at)) return false;
    if (C.mods.size && ![...C.mods].some(m => q.mods.includes(m))) return false;
    if (C.conf.size && !C.conf.has(q.conf)) return false;
    if (C.gap && !q.gap) return false; if (C.bm && !S.bm[q.id]) return false;
    if (C.wrong && !(S.ans[q.id] && !S.ans[q.id].last)) return false;
    if (C.fresh && S.ans[q.id]) return false;
    return true;
  });
}
/* ---------- LEKKI PARSER MARKDOWN & NOTATNIK ---------- */
function parseMarkdown(src) {
  if (!src) return '';
  const codeBlocks = [];
  // Ekstrakcja bloków kodu ```...```
  let s = String(src).replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code class="${lang ? 'lang-' + esc(lang) : ''}">${esc(code.trim())}</code></pre>`);
    return `@@CODE_BLOCK_${idx}@@`;
  });

  // Bezpieczna ucieczka tagów
  s = esc(s);

  // Tabele Markdown
  s = s.replace(/(?:^|\n)(\|[^\n]+\|\n\|[\s:|-]+\|\n(?:\|[^\n]+\|(?:\n|$))+)/g, match => {
    const lines = match.trim().split('\n').map(l => l.trim());
    if (lines.length < 3) return match;
    const parseRow = row => row.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    const headers = parseRow(lines[0]);
    const bodyRows = lines.slice(2).map(parseRow);
    const ths = headers.map(h => `<th>${h}</th>`).join('');
    const trs = bodyRows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
    return `\n<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>\n`;
  });

  // Nagłówki
  s = s.replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
       .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
       .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
       .replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Poziome linie
  s = s.replace(/^(?:---|\*\*\*|___)$/gm, '<hr>');

  // Cytaty
  s = s.replace(/^(?:&gt;|>)\s?(.*?)$/gm, '<blockquote>$1</blockquote>');

  // Checklisty (task list)
  s = s.replace(/^[-*]\s+\[x\]\s+(.*?)$/gim, '<li class="task-item checked"><input type="checkbox" checked disabled> <span>$1</span></li>')
       .replace(/^[-*]\s+\[ \]\s+(.*?)$/gim, '<li class="task-item"><input type="checkbox" disabled> <span>$1</span></li>');

  // Zwykłe listy
  s = s.replace(/^[-*]\s+(.*?)$/gm, '<li class="bullet-item">$1</li>');
  s = s.replace(/^\d+\.\s+(.*?)$/gm, '<li class="num-item">$1</li>');

  // Grupowanie <li> w <ul> / <ol> z odstępami blokowymi
  s = s.replace(/(?:<li class="task-item[^"]*"[^>]*>.*?<\/li>\s*)+/gs, m => `\n\n<ul class="task-list" style="list-style:none;padding-left:.3rem">\n${m.trim()}\n</ul>\n\n`);
  s = s.replace(/(?:<li class="bullet-item"[^>]*>.*?<\/li>\s*)+/gs, m => `\n\n<ul>\n${m.replace(/class="bullet-item"/g, '').trim()}\n</ul>\n\n`);
  s = s.replace(/(?:<li class="num-item"[^>]*>.*?<\/li>\s*)+/gs, m => `\n\n<ol>\n${m.replace(/class="num-item"/g, '').trim()}\n</ol>\n\n`);

  // Formatowanie liniowe
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/_([^_]+)_/g, '<em>$1</em>');
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Przywrócenie bloków kodu
  codeBlocks.forEach((codeHtml, idx) => {
    s = s.replace(`@@CODE_BLOCK_${idx}@@`, codeHtml);
  });

  // Akapity
  const blocks = s.split(/\n{2,}/);
  const htmlBlocks = blocks.map(b => {
    b = b.trim();
    if (!b) return '';
    if (/^<(h[1-4]|table|ul|ol|pre|blockquote|hr)/i.test(b)) return b;
    return `<p>${b.replace(/\n/g, '<br>')}</p>`;
  });

  return htmlBlocks.filter(Boolean).join('\n');
}

function downloadFile(filename, content, mime = 'text/markdown') {
  const blob = new Blob([content], { type: mime + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function insertMarkdownAt(textarea, type) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const sel = val.slice(start, end);
  let ins = '';
  let cursorOffset = 0;

  switch (type) {
    case 'b': ins = `**${sel || 'pogrubienie'}**`; cursorOffset = sel ? ins.length : 2; break;
    case 'i': ins = `*${sel || 'kursywa'}*`; cursorOffset = sel ? ins.length : 1; break;
    case 'h2': ins = `\n## ${sel || 'Nagłówek sekcji'}\n`; cursorOffset = ins.length; break;
    case 'h3': ins = `\n### ${sel || 'Podnagłówek'}\n`; cursorOffset = ins.length; break;
    case 'list': ins = `\n- ${sel || 'Element listy'}\n`; cursorOffset = ins.length; break;
    case 'check': ins = `\n- [ ] ${sel || 'Zadanie / objaw do weryfikacji'}\n`; cursorOffset = ins.length; break;
    case 'table':
      ins = `\n| Cecha | Parametr A | Parametr B |\n|---|---|---|\n| Norma | Wartość 1 | Wartość 2 |\n| Patologia | Objaw 1 | Objaw 2 |\n`;
      cursorOffset = ins.length;
      break;
    case 'quote': ins = `\n> ${sel || 'Kluczowa perła kliniczna / uwaga'}\n`; cursorOffset = ins.length; break;
    case 'code': ins = `\`${sel || 'kod/dawka'}\``; cursorOffset = sel ? ins.length : 1; break;
  }

  textarea.value = val.slice(0, start) + ins + val.slice(end);
  textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
  textarea.focus();
}

const NOTES_KEY = 'pediatria_hub_notes_v1';
const SCRATCH_KEY = 'pediatria_quick_scratchpad';

const NOTE_TEMPLATES = {
  choroba: `# [Nazwa jednostki chorobowej]
**Moduł:** [Wybierz moduł]
**Atlas:** [Wybierz atlas]

### 1. Epidemiologia i patofizjologia
- Wiek szczytu zachorowań: 
- Czynnik etiologiczny / patomechanizm: 

### 2. Obraz kliniczny i objawy
- Objawy osiowe (triada/tetrada): 
- Czerwone flagi (red flags): 

### 3. Diagnostyka różnicowa
- Badania I rzutu (laboratorium / USG): 
- Złoty standard potwierdzenia: 

### 4. Leczenie i dawki
- Postępowanie objawowe / stabilizacja: 
- Terapia celowana / dawkowanie leków: 

### 5. Pułapki egzaminacyjne
- Klucz zakładowy vs wytyczne: 
`,
  nagle: `# Różnicowanie stanów nagłych: [Temat]

### Trójkąt Oceny Pediatrycznej (PAT)
- **Wygląd (Appearance):** interakcja, napięcie mięśniowe, płacz, spojrzenie
- **Oddychanie (Work of breathing):** świsty, zaciąganie, poruszanie skrzydełkami nosa
- **Krążenie (Circulation):** bladość, marmurkowatość skóry, sinica

### Ocena ABCDE
- **A (Airway):** Drożność dróg oddechowych
- **B (Breathing):** Liczba oddechów, wysiłek, SpO2, osłuchiwanie
- **C (Circulation):** Tętno, CRT (< 2s), ciśnienie tętnicze, nawodnienie
- **D (Disability):** AVPU / GCS, reakcja źrenic, poziom glukozy!
- **E (Exposure):** Wysypka (wybroczyny!), temperatura ciała

### Plan działania i dawki
1. Dostęp naczyniowy / doszpikowy (I.O.)
2. Bolus płynowy: 10–20 ml/kg mc. krystaloidów
3. Leki ratunkowe w przeliczeniu na wagę:
`,
  dawki: `# Tabela dawek leków i resuscytacja (PALS)

| Lek | Wskazanie | Dawka pediatryczna | Droga podania |
|---|---|---|---|
| Adrenalina (1:10 000) | NZK / zatrzymanie krążenia | 0,01 mg/kg (0,1 ml/kg) | I.V. / I.O. |
| Adrenalina (1:1000) | Anafilaksja | 0,01 mg/kg (max 0,3–0,5 mg) | I.M. (przednio-boczne udo) |
| Midazolam | Drgawki gorączkowe | 0,2–0,3 mg/kg mc. | Policzkowo (buccal) |
| Diazepam | Stan padaczkowy | 0,5 mg/kg mc. | Doodbytniczo (p.r.) |
| Paracetamol | Ból / gorączka | 15 mg/kg mc. co 4–6h | P.O. / P.R. / I.V. |
| Ibuprofen | Ból / zapalenie (>3 mż) | 10 mg/kg mc. co 6–8h | P.O. |
| Deksametazon | Podgłośniowe zap. krtani (krup) | 0,15–0,6 mg/kg mc. | P.O. / I.M. / I.V. |
`,
  checklista: `# Checklista powtórkowa przed egzaminem

- [ ] Moduł 1: Ból brzucha (wgłobienie, zapalenie wyrostka, ZNZ, skręt jądra)
- [ ] Moduł 2: Zakażenia u dzieci (wysypki zakaźne, neuroinfekcje, sepsa, szczepienia)
- [ ] Moduł 3: Biegunki, odwodnienie izo/hipo/hipertoniczne, celiakia
- [ ] Moduł 4: Kłębuszkowe zapalenia nerek (APSGN) i zespół nerczycowy
- [ ] Moduł 5: Stany nagłe (PAT, wstrząs, drgawki, anafilaksja, DKA, NZK)
- [ ] Moduł 6: Choroba wrzodowa i diagnostyka H. pylori (inwazyjna vs nieinwazyjna)
- [ ] Moduł 7: Nieswoiste zapalenia jelit (Choroba Leśniowskiego-Crohna vs WZJG)
- [ ] Moduł 8: Alergie pokarmowe (IgE-zależne, anafilaksja, FPIES)
- [ ] Moduł 9: Guzy mózgu (tylny dół, objawy wzmożonego ICP, dno oka)
- [ ] Moduł 10: Nowotwory lite (guz Wilmsa, neuroblastoma, siatkówczak)
- [ ] Moduł 11: ALL, AML, chłoniaki, zespół lizy guza, zespół żyły głównej górnej
- [ ] Moduł 12: Skazy krwotoczne (ITP, hemofilia A/B, choroba von Willebranda, IgAV)
- [ ] Moduł 13a: Niedokrwistości u dzieci (niedobór żelaza, talasemie, sferocytoza)
- [ ] Moduł 13b: Pierwotne niedobory odporności i zasady szczepień żywych
- [ ] Moduł 14: ZUM u dzieci, pobieranie moczu, diagnostyka obrazowa (USG, CUM)
- [ ] Moduł 15: Ostre uszkodzenie nerek (KDIGO) i przewlekła choroba nerek
`
};

function getNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {}
  return [
    {
      id: 'note_starter_1',
      title: '📋 Wskazówki i perły kliniczne do zaliczenia (Pediatria V rok)',
      content: `# 📋 Wskazówki i perły kliniczne do zaliczenia

## 1. Wartości referencyjne i normy wiekowe
| Wiek | Czynność serca (HR/min) | Oddechy (RR/min) | SBP (mmHg, 50 pc) |
|---|---|---|---|
| Noworodek (<28 dż.) | 100–160 | 30–60 | >60 |
| Niemowlę (<1 rż.) | 100–150 | 25–40 | >70 |
| Dziecko małe (1–3 l.) | 80–130 | 20–30 | >70 + (2 × wiek) |
| Wiek szkolny (4–12 l.) | 70–110 | 15–25 | >70 + (2 × wiek) |
| Młodzież (>12 l.) | 60–100 | 12–20 | >90 |

## 2. Czerwone flagi w stanach ostrych
- [ ] Ból brzucha budzący ze snu lub zlokalizowany z dala od pępka
- [ ] Poranne bóle głowy z wymiotami (tylny dół czaszki / wzrost ICP)
- [ ] Wybroczyny / petocje nieblednące pod uciskiem (wyklucz sepsę meningokokową i ITP!)
- [ ] Brak mikcji > 6 godzin u niemowlęcia
- [ ] Sinica centralna lub zaciąganie międzyżebrzy (nawrót kapilarny CRT > 2 sekundy)

## 3. Kluczowe zasady antybiotykoterapii
> **Zasada nr 1:** W zakażeniach dróg moczowych (ZUM) u dzieci zawsze pobierz mocz na posiew **przed** włączeniem pierwszej dawki antybiotyku!

- **Angina paciorkowcowa:** Fenoksymetylopenicylina (V-Penicylina) p.o. przez pełne 10 dni.
- **Zapalenie ucha środkowego (AOM):** Amoksycylina w wysokiej dawce (90 mg/kg mc./dobę).
- **ZUM niepowikłany:** Cefalosporyna II/III gen. p.o. lub furazydyna (nie u noworodków).
`,
      mod: 'all',
      updatedAt: Date.now() - 3600000
    },
    {
      id: 'note_starter_2',
      title: '🚨 Algorytmy stanów nagłych i dawki leków (PALS)',
      content: NOTE_TEMPLATES.dawki,
      mod: '5',
      updatedAt: Date.now() - 7200000
    }
  ];
}

function saveNotes(notes) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch (e) {}
}

function initNotesDrawer() {
  const btn = $('#btnQuickNotes');
  const drawer = $('#notesDrawer');
  const close = $('#drawerClose');
  const input = $('#drawerInput');
  const preview = $('#drawerPreview');
  const modeBtn = $('#drawerToggleMode');
  const saveBtn = $('#drawerSaveAsNote');
  const clearBtn = $('#drawerClear');
  const status = $('#scratchSavedStatus');
  if (!btn || !drawer || !input) return;

  try {
    input.value = localStorage.getItem(SCRATCH_KEY) || '';
  } catch (e) {}

  let isPreview = false;
  const updatePreview = () => {
    if (preview) preview.innerHTML = parseMarkdown(input.value) || '<p class="muted">Brak tekstu w brudnopisie...</p>';
  };

  btn.onclick = () => {
    const hidden = drawer.hasAttribute('hidden');
    if (hidden) {
      drawer.removeAttribute('hidden');
      input.focus();
      updatePreview();
    } else {
      drawer.setAttribute('hidden', '');
    }
  };

  if (close) close.onclick = () => drawer.setAttribute('hidden', '');

  let saveT;
  input.addEventListener('input', () => {
    clearTimeout(saveT);
    if (status) status.textContent = 'Zapisywanie...';
    saveT = setTimeout(() => {
      try { localStorage.setItem(SCRATCH_KEY, input.value); } catch (e) {}
      if (status) status.textContent = 'Zapisano ✓';
      updatePreview();
    }, 300);
  });

  input.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertMarkdownAt(input, 'b');
      updatePreview();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertMarkdownAt(input, 'i');
      updatePreview();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const start = input.selectionStart, end = input.selectionEnd;
      input.value = input.value.slice(0, start) + '  ' + input.value.slice(end);
      input.selectionStart = input.selectionEnd = start + 2;
    }
  });

  if (modeBtn) {
    modeBtn.onclick = () => {
      isPreview = !isPreview;
      if (isPreview) {
        input.hidden = true;
        preview.hidden = false;
        modeBtn.textContent = 'Edycja';
        updatePreview();
      } else {
        input.hidden = false;
        preview.hidden = true;
        modeBtn.textContent = 'Podgląd';
        input.focus();
      }
    };
  }

  $$('[data-md]', drawer).forEach(b => {
    b.onclick = () => {
      insertMarkdownAt(input, b.dataset.md);
      try { localStorage.setItem(SCRATCH_KEY, input.value); } catch (e) {}
      updatePreview();
    };
  });

  if (saveBtn) {
    saveBtn.onclick = () => {
      const text = input.value.trim();
      if (!text) { toast('Brudnopis jest pusty!'); return; }
      const firstLine = text.split('\n')[0].replace(/^[#\s*-]+/, '').trim();
      const title = firstLine ? firstLine.slice(0, 50) : `Notatka z brudnopisu (${new Date().toLocaleDateString('pl-PL')})`;
      const notes = getNotes();
      const newNote = {
        id: 'note_' + Date.now(),
        title,
        content: text,
        mod: 'all',
        updatedAt: Date.now()
      };
      notes.unshift(newNote);
      saveNotes(notes);
      toast('Zapisano nową notatkę w Hubie!');
      drawer.setAttribute('hidden', '');
      location.hash = '#/notatki?id=' + newNote.id;
    };
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Czy na pewno chcesz wyczyścić szybki brudnopis?')) {
        input.value = '';
        try { localStorage.removeItem(SCRATCH_KEY); } catch (e) {}
        updatePreview();
        toast('Wyczyszczono brudnopis');
      }
    };
  }
}

/* Widok pełnego notatnika (#/notatki) */
let activeNoteId = null;
let noteViewMode = 'split'; // 'split' | 'editor' | 'preview'

function viewNotes(parts, params) {
  const notes = getNotes();
  if (params.id && notes.some(n => n.id === params.id)) {
    activeNoteId = params.id;
  } else if (!activeNoteId || !notes.some(n => n.id === activeNoteId)) {
    activeNoteId = notes[0] ? notes[0].id : null;
  }

  const activeNote = notes.find(n => n.id === activeNoteId) || {
    id: 'note_' + Date.now(),
    title: 'Nowa notatka',
    content: '',
    mod: 'all',
    updatedAt: Date.now()
  };

  const render = () => {
    main.innerHTML = `<section class="blk" style="border:0"><div class="wrap">
      <div class="eyebrow">Własne notatki</div>
      <h2>Notatnik kliniczny Markdown</h2>
      <p class="lead">Twórz i organizuj notatki do zaliczenia z pełnym wsparciem składni Markdown: tabelami parametrów, checklistami objawów, dawkami i blokami leków.</p>

      <div class="notes-layout">
        <!-- Lewy panel: Lista notatek -->
        <aside class="notes-sidebar">
          <div class="acts" style="justify-content:space-between">
            <button class="btn pri sm" id="btnNewNote">+ Nowa notatka</button>
            <span class="muted" style="font-size:.8rem;font-weight:700" id="noteCount">${notes.length} ${notes.length === 1 ? 'notatka' : 'notatek'}</span>
          </div>
          <input type="search" id="notesSearch" class="field" placeholder="Szukaj w notatkach…" style="width:100%;padding:.45rem .7rem;font-size:.85rem;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink)">
          <div class="pillrow" style="gap:.25rem" id="noteModFilter">
            <button class="tgl sm active" data-filter="all" style="font-size:.72rem;padding:.2rem .5rem">Wszystkie</button>
            ${MODS.map(m => `<button class="tgl sm" data-filter="${m.id}" style="font-size:.72rem;padding:.2rem .5rem">[${m.id}]</button>`).join('')}
          </div>
          <div class="notes-items" id="notesList">
            ${renderNoteItems(notes, activeNoteId)}
          </div>
        </aside>

        <!-- Prawy panel: Edytor i podgląd -->
        <div class="notes-editor-box">
          <div class="note-header-row">
            <input type="text" id="noteTitleIn" class="note-title-in" value="${esc(activeNote.title)}" placeholder="Tytuł notatki…">
            <select id="noteModSel" class="field" style="padding:.4rem .6rem;border-radius:8px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);font-weight:700;font-size:.84rem">
              <option value="all" ${activeNote.mod === 'all' ? 'selected' : ''}>Ogólne (Wszystkie moduły)</option>
              ${MODS.map(m => `<option value="${m.id}" ${activeNote.mod === m.id ? 'selected' : ''}>Moduł [${m.id}] ${esc(m.n)}</option>`).join('')}
            </select>
          </div>

          <div class="notes-toolbar">
            <button type="button" data-f="b" title="Pogrubienie (Ctrl+B)"><b>B</b></button>
            <button type="button" data-f="i" title="Kursywa (Ctrl+I)"><i>I</i></button>
            <button type="button" data-f="h2" title="Nagłówek sekcji">H2</button>
            <button type="button" data-f="h3" title="Podnagłówek">H3</button>
            <button type="button" data-f="list" title="Lista punktowana">• Lista</button>
            <button type="button" data-f="check" title="Checklista">☑ Zadanie</button>
            <button type="button" data-f="table" title="Tabela parametrów">▦ Tabela</button>
            <button type="button" data-f="quote" title="Cytat / uwaga">” Cytat</button>
            <button type="button" data-f="code" title="Kod / dawka">\`Kod\`</button>

            <select id="templateSel" style="padding:.25rem .5rem;border-radius:6px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:.8rem;font-weight:700">
              <option value="">Wstaw szablon medyczny…</option>
              <option value="choroba">Karta jednostki chorobowej</option>
              <option value="nagle">Różnicowanie stanów nagłych (ABCDE)</option>
              <option value="dawki">Tabela dawek i algorytm (PALS)</option>
              <option value="checklista">Checklista 15 modułów</option>
            </select>

            <div style="flex:1"></div>

            <div class="seg" id="modeSeg">
              <button data-m="split" aria-pressed="${noteViewMode === 'split'}">Podział</button>
              <button data-m="editor" aria-pressed="${noteViewMode === 'editor'}">Edytor</button>
              <button data-m="preview" aria-pressed="${noteViewMode === 'preview'}">Podgląd</button>
            </div>

            <button type="button" id="btnExportMd" class="btn sec sm" title="Pobierz plik Markdown">📥 .md</button>
            <button type="button" id="btnCopyMd" class="btn sec sm" title="Kopiuj zawartość do schowka">📋 Kopiuj</button>
            <button type="button" id="btnDeleteNote" class="btn sec sm" style="color:var(--red)" title="Usuń notatkę">🗑️</button>
          </div>

          <div class="notes-split mode-${noteViewMode}" id="notesSplit">
            <div class="notes-editor-pane">
              <textarea id="noteContentIn" placeholder="Wpisz treść notatki w formacie Markdown…">${esc(activeNote.content)}</textarea>
            </div>
            <div class="notes-preview-pane md-preview" id="notePreviewPane">
              ${parseMarkdown(activeNote.content) || '<p class="muted">Podgląd notatki Markdown pojawi się tutaj…</p>'}
            </div>
          </div>
          <div class="srcline" style="display:flex;justify-content:space-between">
            <span id="noteSaveIndicator">✓ Zapisano automatycznie</span>
            <span>Ostatnia modyfikacja: ${new Date(activeNote.updatedAt || Date.now()).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div></section>`;

    attachEvents();
  };

  const renderNoteItems = (list, curId, filterText = '', filterMod = 'all') => {
    let filtered = list;
    if (filterMod !== 'all') filtered = filtered.filter(n => n.mod === filterMod);
    if (filterText) {
      const q = norm(filterText);
      filtered = filtered.filter(n => norm(n.title + ' ' + n.content).includes(q));
    }
    if (!filtered.length) return '<p class="muted" style="font-size:.82rem;padding:.8rem;text-align:center">Brak pasujących notatek</p>';
    return filtered.map(n => {
      const active = n.id === curId;
      const d = new Date(n.updatedAt || Date.now()).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
      const modTag = n.mod && n.mod !== 'all' ? `[${n.mod}] ` : '';
      return `<button class="note-item ${active ? 'active' : ''}" data-id="${n.id}">
        <span class="note-item-title">${modTag}${esc(n.title || 'Bez tytułu')}</span>
        <span class="note-item-meta"><span>${d}</span><span>${(n.content || '').length} zn.</span></span>
      </button>`;
    }).join('');
  };

  const attachEvents = () => {
    const listCont = $('#notesList');
    const searchIn = $('#notesSearch');
    const titleIn = $('#noteTitleIn');
    const contentIn = $('#noteContentIn');
    const modSel = $('#noteModSel');
    const previewPane = $('#notePreviewPane');
    const saveInd = $('#noteSaveIndicator');
    const newBtn = $('#btnNewNote');
    const delBtn = $('#btnDeleteNote');
    const exportBtn = $('#btnExportMd');
    const copyBtn = $('#btnCopyMd');
    const tmplSel = $('#templateSel');
    let curFilterMod = 'all';

    // Przełączanie notatek
    if (listCont) {
      listCont.addEventListener('click', e => {
        const item = e.target.closest('.note-item');
        if (!item) return;
        activeNoteId = item.dataset.id;
        location.hash = '#/notatki?id=' + activeNoteId;
      });
    }

    // Nowa notatka
    if (newBtn) {
      newBtn.onclick = () => {
        const allNotes = getNotes();
        const created = {
          id: 'note_' + Date.now(),
          title: 'Nowa notatka kliniczna',
          content: '# Nowa notatka kliniczna\n\n- ',
          mod: 'all',
          updatedAt: Date.now()
        };
        allNotes.unshift(created);
        saveNotes(allNotes);
        activeNoteId = created.id;
        toast('Utworzono nową notatkę');
        viewNotes(parts, { id: created.id });
      };
    }

    // Usuwanie notatki
    if (delBtn) {
      delBtn.onclick = () => {
        let allNotes = getNotes();
        if (allNotes.length <= 1) {
          toast('Nie można usunąć ostatniej notatki');
          return;
        }
        if (confirm(`Czy na pewno chcesz usunąć notatkę "${activeNote.title}"?`)) {
          allNotes = allNotes.filter(n => n.id !== activeNote.id);
          saveNotes(allNotes);
          activeNoteId = allNotes[0].id;
          toast('Notatka usunięta');
          viewNotes(parts, { id: activeNoteId });
        }
      };
    }

    // Wyszukiwanie
    if (searchIn) {
      searchIn.addEventListener('input', () => {
        listCont.innerHTML = renderNoteItems(getNotes(), activeNoteId, searchIn.value, curFilterMod);
      });
    }

    // Filtrowanie po module
    $$('#noteModFilter button').forEach(b => {
      b.onclick = () => {
        $$('#noteModFilter button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        curFilterMod = b.dataset.filter;
        listCont.innerHTML = renderNoteItems(getNotes(), activeNoteId, (searchIn || {}).value || '', curFilterMod);
      };
    });

    // Autosave edycji
    let autoSaveT;
    const triggerSave = () => {
      clearTimeout(autoSaveT);
      if (saveInd) saveInd.textContent = 'Zapisywanie…';
      autoSaveT = setTimeout(() => {
        const allNotes = getNotes();
        const idx = allNotes.findIndex(n => n.id === activeNote.id);
        if (idx !== -1) {
          allNotes[idx].title = titleIn.value.trim() || 'Bez tytułu';
          allNotes[idx].content = contentIn.value;
          allNotes[idx].mod = modSel.value;
          allNotes[idx].updatedAt = Date.now();
          saveNotes(allNotes);
          if (saveInd) saveInd.textContent = '✓ Zapisano automatycznie';
          listCont.innerHTML = renderNoteItems(allNotes, activeNoteId, (searchIn || {}).value || '', curFilterMod);
        }
      }, 400);
    };

    if (titleIn) titleIn.addEventListener('input', triggerSave);
    if (modSel) modSel.addEventListener('change', triggerSave);

    if (contentIn) {
      contentIn.addEventListener('input', () => {
        if (previewPane) previewPane.innerHTML = parseMarkdown(contentIn.value) || '<p class="muted">Podgląd notatki Markdown…</p>';
        triggerSave();
      });

      contentIn.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
          e.preventDefault();
          insertMarkdownAt(contentIn, 'b');
          if (previewPane) previewPane.innerHTML = parseMarkdown(contentIn.value);
          triggerSave();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
          e.preventDefault();
          insertMarkdownAt(contentIn, 'i');
          if (previewPane) previewPane.innerHTML = parseMarkdown(contentIn.value);
          triggerSave();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const start = contentIn.selectionStart, end = contentIn.selectionEnd;
          contentIn.value = contentIn.value.slice(0, start) + '  ' + contentIn.value.slice(end);
          contentIn.selectionStart = contentIn.selectionEnd = start + 2;
        }
      });
    }

    // Pasek narzędzi
    $$('.notes-toolbar button[data-f]').forEach(b => {
      b.onclick = () => {
        insertMarkdownAt(contentIn, b.dataset.f);
        if (previewPane) previewPane.innerHTML = parseMarkdown(contentIn.value);
        triggerSave();
      };
    });

    // Szablony
    if (tmplSel) {
      tmplSel.addEventListener('change', () => {
        const val = tmplSel.value;
        if (!val || !NOTE_TEMPLATES[val]) return;
        if (contentIn.value.trim() && !confirm('Czy na pewno wstawić szablon na końcu notatki?')) {
          tmplSel.value = '';
          return;
        }
        contentIn.value = (contentIn.value ? contentIn.value + '\n\n' : '') + NOTE_TEMPLATES[val];
        tmplSel.value = '';
        if (previewPane) previewPane.innerHTML = parseMarkdown(contentIn.value);
        triggerSave();
        toast('Wstawiono szablon notatki');
      });
    }

    // Przełącznik trybu widoku
    $$('#modeSeg button').forEach(b => {
      b.onclick = () => {
        noteViewMode = b.dataset.m;
        $$('#modeSeg button').forEach(x => x.setAttribute('aria-pressed', x === b));
        const split = $('#notesSplit');
        if (split) {
          split.className = `notes-split mode-${noteViewMode}`;
        }
      };
    });

    // Eksport do pliku .md
    if (exportBtn) {
      exportBtn.onclick = () => {
        const safeTitle = (activeNote.title || 'notatka').toLowerCase().replace(/[^a-z0-9_-]+/gi, '-');
        downloadFile(`${safeTitle}.md`, contentIn.value);
        toast(`Pobrano plik ${safeTitle}.md`);
      };
    }

    // Kopiowanie Markdown
    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(contentIn.value);
          toast('Skopiowano treść Markdown do schowka');
        } catch (e) {
          contentIn.select();
          toast('Zaznaczono treść, skopiuj ręcznie');
        }
      };
    }
  };

  render();
}

/* ---------- SYMULACJA EGZAMINU (MOCK EXAM) ---------- */
let EXAM_CONF = {
  count: 50,
  timeMode: '1min',
  customMinutes: 50,
  banks: new Set(Object.keys(BANKS)),
  mods: new Set(MODS.map(m => m.id)),
  shuffleQ: true
};

let EXAM_SESSION = null;

function getExamQuestionsPool() {
  return Q.filter(q => {
    if (EXAM_CONF.banks.size && !EXAM_CONF.banks.has(q.bank)) return false;
    if (EXAM_CONF.mods.size && !q.mods.some(m => EXAM_CONF.mods.has(m))) return false;
    return true;
  });
}

function viewExam(parts, params) {
  if (params && params.id) {
    const report = (S.examHistory || []).find(x => x.id === params.id);
    if (report) return renderExamReport(report, true);
    toast('Nie znaleziono egzaminu w historii');
  }

  if (EXAM_SESSION && !EXAM_SESSION.finished) {
    return renderActiveExam();
  }

  if (EXAM_SESSION && EXAM_SESSION.finished && EXAM_SESSION.report) {
    return renderExamReport(EXAM_SESSION.report, false);
  }

  renderExamSetup();
}

function renderExamSetup() {
  const pool = getExamQuestionsPool();
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:920px">
    <div class="eyebrow">Symulator egzaminu</div>
    <h2>Egzamin próbny z pediatrii</h2>
    <p class="lead">Sprawdź swoją wiedzę w warunkach zbliżonych do oficjalnego zaliczenia: licznik czasu, brak podglądu poprawnych odpowiedzi w trakcie, nawigacja po siatce pytań z flagami „do sprawdzenia” oraz oficjalny próg zdawalności 60%.</p>

    <!-- Kafelki szybkich presetów -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.8rem">
      <div class="card" style="cursor:pointer;border:2px solid transparent" data-preset="quick">
        <div style="font-size:1.4rem;margin-bottom:.3rem">⚡ Szybki test</div>
        <b>20 pytań · 20 minut</b>
        <p class="srcline" style="margin-top:.3rem">Krótka weryfikacja wiedzy z losowych modułów.</p>
      </div>
      <div class="card" style="cursor:pointer;border:2px solid var(--teal);background:var(--teal-xl)" data-preset="standard">
        <div style="font-size:1.4rem;margin-bottom:.3rem">🎓 Egzamin standardowy</div>
        <b>50 pytań · 50 minut</b>
        <p class="srcline" style="margin-top:.3rem">Zrównoważony przekrój wszystkich 15 modułów.</p>
      </div>
      <div class="card" style="cursor:pointer;border:2px solid transparent" data-preset="full">
        <div style="font-size:1.4rem;margin-bottom:.3rem">📚 Pełny maraton</div>
        <b>100 pytań · 100 minut</b>
        <p class="srcline" style="margin-top:.3rem">Maksymalny test wytrzymałości i wiedzy.</p>
      </div>
    </div>

    <!-- Konfiguracja zaawansowana -->
    <div class="tool">
      <div class="frow">
        <span class="flab">Liczba pytań</span>
        <div class="seg" id="exN">
          <button data-n="20" aria-pressed="${EXAM_CONF.count === 20}">20</button>
          <button data-n="30" aria-pressed="${EXAM_CONF.count === 30}">30</button>
          <button data-n="50" aria-pressed="${EXAM_CONF.count === 50}">50</button>
          <button data-n="100" aria-pressed="${EXAM_CONF.count === 100}">100</button>
          <button data-n="0" aria-pressed="${EXAM_CONF.count === 0}">Wszystkie (${pool.length})</button>
        </div>
      </div>

      <div class="frow">
        <span class="flab">Czas trwania</span>
        <div class="seg" id="exTime">
          <button data-t="1min" aria-pressed="${EXAM_CONF.timeMode === '1min'}">1 min / pytanie</button>
          <button data-t="1.5min" aria-pressed="${EXAM_CONF.timeMode === '1.5min'}">1.5 min / pytanie</button>
          <button data-t="45s" aria-pressed="${EXAM_CONF.timeMode === '45s'}">45 s / pytanie</button>
          <button data-t="unlimited" aria-pressed="${EXAM_CONF.timeMode === 'unlimited'}">Bez limitu</button>
        </div>
      </div>

      <div class="frow">
        <span class="flab">Banki pytań</span>
        <div class="pillrow" id="exBanks">
          ${Object.keys(BANKS).map(b => `<button class="tgl" data-bank="${b}" aria-pressed="${EXAM_CONF.banks.has(b)}">${BANKS[b].icon} ${BANKS[b].short} (${Q.filter(q => q.bank === b).length})</button>`).join('')}
        </div>
      </div>

      <div class="frow">
        <span class="flab">Moduły kursu</span>
        <div style="flex:1">
          <div class="acts" style="margin-bottom:.5rem">
            <button class="btn sec sm" id="btnSelectAllMods" style="font-size:.76rem;padding:.2rem .6rem">Zaznacz wszystkie</button>
            <button class="btn sec sm" id="btnDeselectAllMods" style="font-size:.76rem;padding:.2rem .6rem">Odznacz wszystkie</button>
          </div>
          <div class="pillrow" id="exMods">
            ${MODS.map(m => `<button class="tgl" data-mod="${m.id}" aria-pressed="${EXAM_CONF.mods.has(m.id)}">[${m.id}] ${esc(SHORT[m.id] || m.n)}</button>`).join('')}
          </div>
        </div>
      </div>

      <div class="frow" style="justify-content:space-between;border-top:1px solid var(--line-2);padding-top:1.1rem;margin-top:.6rem">
        <div>
          <span id="exPoolInfo" style="font-weight:800;font-size:1.05rem"></span>
          <div class="srcline" id="exEstTime">Szacowany czas: ~50 minut</div>
        </div>
        <button class="btn pri" id="btnStartExam" style="font-size:1.05rem;padding:.8rem 1.6rem">Rozpocznij egzamin próbny →</button>
      </div>
    </div>
  </div></section>`;

  const updatePoolInfo = () => {
    const curPool = getExamQuestionsPool();
    const count = EXAM_CONF.count === 0 ? curPool.length : Math.min(EXAM_CONF.count, curPool.length);
    $('#exPoolInfo').textContent = curPool.length ? `Dostępna pula: ${curPool.length} pytań (do testu: ${count})` : 'Pula pusta! Zaznacz przynajmniej jeden bank i moduł.';
    $('#btnStartExam').disabled = !curPool.length;

    let timeText = 'Bez limitu czasu';
    if (EXAM_CONF.timeMode === '1min') timeText = `Limit czasu: ${count} min (1 min/pytanie)`;
    else if (EXAM_CONF.timeMode === '1.5min') timeText = `Limit czasu: ${Math.round(count * 1.5)} min (1.5 min/pytanie)`;
    else if (EXAM_CONF.timeMode === '45s') timeText = `Limit czasu: ${Math.round(count * 0.75)} min (45 s/pytanie)`;
    $('#exEstTime').textContent = timeText;
  };

  // Presety
  $$('[data-preset]').forEach(card => {
    card.onclick = () => {
      const p = card.dataset.preset;
      if (p === 'quick') { EXAM_CONF.count = 20; EXAM_CONF.timeMode = '1min'; }
      else if (p === 'standard') { EXAM_CONF.count = 50; EXAM_CONF.timeMode = '1min'; }
      else if (p === 'full') { EXAM_CONF.count = 100; EXAM_CONF.timeMode = '1min'; }
      $$('#exN button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.n === EXAM_CONF.count));
      $$('#exTime button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === EXAM_CONF.timeMode));
      updatePoolInfo();
    };
  });

  // Liczba pytań
  $('#exN').onclick = e => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    EXAM_CONF.count = +b.dataset.n;
    $$('#exN button').forEach(x => x.setAttribute('aria-pressed', x === b));
    updatePoolInfo();
  };

  // Czas
  $('#exTime').onclick = e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    EXAM_CONF.timeMode = b.dataset.t;
    $$('#exTime button').forEach(x => x.setAttribute('aria-pressed', x === b));
    updatePoolInfo();
  };

  // Banki
  $('#exBanks').onclick = e => {
    const b = e.target.closest('[data-bank]');
    if (!b) return;
    const bk = b.dataset.bank;
    EXAM_CONF.banks.has(bk) ? EXAM_CONF.banks.delete(bk) : EXAM_CONF.banks.add(bk);
    b.setAttribute('aria-pressed', EXAM_CONF.banks.has(bk));
    updatePoolInfo();
  };

  // Moduły
  $('#exMods').onclick = e => {
    const b = e.target.closest('[data-mod]');
    if (!b) return;
    const m = b.dataset.mod;
    EXAM_CONF.mods.has(m) ? EXAM_CONF.mods.delete(m) : EXAM_CONF.mods.add(m);
    b.setAttribute('aria-pressed', EXAM_CONF.mods.has(m));
    updatePoolInfo();
  };

  $('#btnSelectAllMods').onclick = () => {
    MODS.forEach(m => EXAM_CONF.mods.add(m.id));
    $$('#exMods button').forEach(b => b.setAttribute('aria-pressed', 'true'));
    updatePoolInfo();
  };

  $('#btnDeselectAllMods').onclick = () => {
    EXAM_CONF.mods.clear();
    $$('#exMods button').forEach(b => b.setAttribute('aria-pressed', 'false'));
    updatePoolInfo();
  };

  $('#btnStartExam').onclick = () => startExam();

  updatePoolInfo();
}

function startExam() {
  let pool = getExamQuestionsPool();
  if (!pool.length) { toast('Brak pytań spełniających kryteria'); return; }
  if (EXAM_CONF.shuffleQ) pool = shuffle(pool);
  const count = EXAM_CONF.count === 0 ? pool.length : Math.min(EXAM_CONF.count, pool.length);
  const list = pool.slice(0, count);

  let totalSec = null;
  if (EXAM_CONF.timeMode === '1min') totalSec = count * 60;
  else if (EXAM_CONF.timeMode === '1.5min') totalSec = Math.round(count * 90);
  else if (EXAM_CONF.timeMode === '45s') totalSec = Math.round(count * 45);

  EXAM_SESSION = {
    id: 'exam_' + Date.now(),
    list,
    i: 0,
    userAnswers: {},
    flagged: new Set(),
    startedAt: Date.now(),
    totalSec,
    remainingSec: totalSec,
    timer: null,
    finished: false,
    report: null
  };

  if (totalSec) {
    EXAM_SESSION.timer = setInterval(() => {
      if (!EXAM_SESSION || EXAM_SESSION.finished) return;
      EXAM_SESSION.remainingSec--;
      updateExamTimerUI();
      if (EXAM_SESSION.remainingSec <= 0) {
        clearInterval(EXAM_SESSION.timer);
        toast('Czas egzaminu dobiegł końca! Przechodzę do podsumowania...');
        finishExam();
      }
    }, 1000);
  }

  renderActiveExam();
}

function updateExamTimerUI() {
  const el = $('#examTimer');
  if (!el || !EXAM_SESSION) return;
  const rem = EXAM_SESSION.remainingSec;
  if (rem == null) {
    el.textContent = '⏱️ Bez limitu';
    return;
  }
  const m = Math.floor(Math.max(0, rem) / 60);
  const s = Math.max(0, rem) % 60;
  el.textContent = `⏱️ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  el.classList.toggle('warn', rem <= 300 && rem > 60);
  el.classList.toggle('danger', rem <= 60);
}

function renderActiveExam() {
  const es = EXAM_SESSION;
  if (!es || es.finished) return renderExamSetup();
  const q = es.list[es.i];
  const total = es.list.length;
  const answeredCount = Object.keys(es.userAnswers).filter(k => es.userAnswers[k] && es.userAnswers[k].size).length;
  const isFlagged = es.flagged.has(q.id);
  const currentSel = es.userAnswers[q.id] || new Set();
  const multi = q.keys.length > 1;

  main.innerHTML = `
  <!-- Pasek górny egzaminu -->
  <div class="exam-bar">
    <div class="wrap exam-bar-inner">
      <div style="display:flex;align-items:center;gap:.75rem">
        <span class="exam-timer" id="examTimer">⏱️ --:--</span>
        <span style="font-weight:700;font-size:.9rem;color:var(--ink-2)">Pytanie <b>${es.i + 1}</b> z ${total}</span>
      </div>
      <div style="display:flex;align-items:center;gap:.6rem">
        <button class="btn-flag ${isFlagged ? 'active' : ''}" id="btnExamFlag">
          <span>🚩</span><span>${isFlagged ? 'Oznaczone' : 'Oznacz flagą'}</span>
        </button>
        <button class="btn sec sm" id="btnExamQuit" style="color:var(--red)">Zakończ egzamin</button>
      </div>
    </div>
  </div>

  <section class="blk" style="border:0;padding-top:0"><div class="wrap qz">
    <!-- Pasek postępu odpowiedzi -->
    <div class="qprog" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${answeredCount}">
      <i style="width:${pct(answeredCount, total)}%"></i>
    </div>
    <div class="srcline" style="display:flex;justify-content:space-between;margin-bottom:.8rem">
      <span>Odpowiedziano: <b>${answeredCount}</b> z ${total}</span>
      <span>Oznaczone do weryfikacji: <b>${es.flagged.size}</b></span>
    </div>

    <!-- Siatka pytań 1..N -->
    <div class="exam-pill-grid" id="examGrid">
      ${es.list.map((item, idx) => {
        const hasAns = es.userAnswers[item.id] && es.userAnswers[item.id].size;
        const fl = es.flagged.has(item.id);
        const cur = idx === es.i;
        return `<button class="exam-q-pill ${cur ? 'active' : ''} ${hasAns ? 'answered' : ''} ${fl ? 'flagged' : ''}" data-idx="${idx}">${idx + 1}</button>`;
      }).join('')}
    </div>

    <!-- Karta pytania -->
    <div class="qbox">
      <div class="tags" style="display:flex;gap:.35rem;flex-wrap:wrap">
        ${modChips(q)}
        <span class="chip">${esc(ASHORT[q.at])}</span>
        ${multi ? '<span class="chip" style="background:var(--amber-l);color:var(--amber);border-color:var(--amber)">Wielokrotny wybór</span>' : ''}
      </div>

      <div class="stemL">${escB(q.stem)}</div>

      <div class="opts" id="examOpts">
        ${q.opts.map((o, idx) => {
          const isSel = currentSel.has(idx);
          return `<button class="opt ${isSel ? 'sel' : ''}" data-i="${idx}">
            <span class="l">${L[idx]}</span>
            <span>${esc(o)}</span>
          </button>`;
        }).join('')}
      </div>

      <div class="acts" style="margin-top:1.5rem;justify-content:space-between">
        <button class="btn sec" id="btnPrevQ" ${es.i === 0 ? 'disabled' : ''}>← Poprzednie</button>
        <span class="muted" style="font-size:.84rem;font-weight:700">Skróty: [←] [→] | [F] Flaga</span>
        <button class="btn pri" id="btnNextQ">${es.i + 1 < total ? 'Następne →' : 'Zakończ i podsumuj →'}</button>
      </div>
    </div>
  </div></section>`;

  updateExamTimerUI();

  // Nawigacja siatką
  $('#examGrid').onclick = e => {
    const pill = e.target.closest('[data-idx]');
    if (!pill) return;
    es.i = +pill.dataset.idx;
    renderActiveExam();
  };

  // Zaznaczanie opcji odpowiedzi
  $('#examOpts').onclick = e => {
    const optBtn = e.target.closest('[data-i]');
    if (!optBtn) return;
    const idx = +optBtn.dataset.i;
    let userSet = es.userAnswers[q.id];
    if (!userSet) userSet = es.userAnswers[q.id] = new Set();

    if (multi) {
      userSet.has(idx) ? userSet.delete(idx) : userSet.add(idx);
    } else {
      userSet.clear();
      userSet.add(idx);
    }
    renderActiveExam();
  };

  // Flaga
  $('#btnExamFlag').onclick = () => {
    es.flagged.has(q.id) ? es.flagged.delete(q.id) : es.flagged.add(q.id);
    renderActiveExam();
  };

  // Poprzednie / Następne
  $('#btnPrevQ').onclick = () => {
    if (es.i > 0) {
      es.i--;
      renderActiveExam();
      window.scrollTo(0, 0);
    }
  };

  $('#btnNextQ').onclick = () => {
    if (es.i + 1 < total) {
      es.i++;
      renderActiveExam();
      window.scrollTo(0, 0);
    } else {
      confirmFinishExam();
    }
  };

  // Zakończenie egzaminu
  $('#btnExamQuit').onclick = () => confirmFinishExam();

  function confirmFinishExam() {
    const unanswered = total - Object.keys(es.userAnswers).filter(k => es.userAnswers[k] && es.userAnswers[k].size).length;
    const msg = unanswered > 0
      ? `Pozostało jeszcze ${unanswered} pytań bez odpowiedzi oraz ${es.flagged.size} oznaczonych flagą.\n\nCzy na pewno chcesz zakończyć egzamin i poznać wynik?`
      : `Odpowiedziałeś na wszystkie pytania (${total}).\n\nCzy na pewno chcesz zakończyć egzamin i poznać wynik?`;
    if (confirm(msg)) {
      finishExam();
    }
  }
}

// Obsługa klawiatury dla egzaminu
document.addEventListener('keydown', e => {
  if (!EXAM_SESSION || EXAM_SESSION.finished || current.name !== 'egzamin') return;
  const tag = (document.activeElement || {}).tagName || '';
  if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (EXAM_SESSION.i > 0) { EXAM_SESSION.i--; renderActiveExam(); }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (EXAM_SESSION.i + 1 < EXAM_SESSION.list.length) { EXAM_SESSION.i++; renderActiveExam(); }
  } else if (e.key.toLowerCase() === 'f') {
    e.preventDefault();
    const q = EXAM_SESSION.list[EXAM_SESSION.i];
    EXAM_SESSION.flagged.has(q.id) ? EXAM_SESSION.flagged.delete(q.id) : EXAM_SESSION.flagged.add(q.id);
    renderActiveExam();
  }
});

function finishExam() {
  if (!EXAM_SESSION) return;
  if (EXAM_SESSION.timer) clearInterval(EXAM_SESSION.timer);

  const es = EXAM_SESSION;
  let score = 0;
  const byMod = {};
  const wrongQIds = [];

  es.list.forEach(q => {
    const userSet = es.userAnswers[q.id] || new Set();
    const isCorrect = userSet.size === q.keys.length && q.keys.every(k => userSet.has(k));
    if (isCorrect) score++;
    else wrongQIds.push(q.id);

    const m = q.pm || q.mods[0] || '1';
    byMod[m] = byMod[m] || { total: 0, correct: 0 };
    byMod[m].total++;
    if (isCorrect) byMod[m].correct++;
  });

  const total = es.list.length;
  const pctScore = pct(score, total);
  const passed = pctScore >= 60;
  const durationSec = Math.round((Date.now() - es.startedAt) / 1000);

  const report = {
    id: es.id,
    date: new Date().toISOString(),
    score,
    total,
    pct: pctScore,
    passed,
    durationSec,
    byMod,
    wrongQIds,
    flaggedQIds: [...es.flagged],
    qIds: es.list.map(q => q.id),
    userAnswers: Object.fromEntries(Object.entries(es.userAnswers).map(([k, v]) => [k, [...v]]))
  };

  S.examHistory = Array.isArray(S.examHistory) ? S.examHistory : [];
  S.examHistory.unshift(report);
  if (S.examHistory.length > 40) S.examHistory.pop();
  save();

  es.finished = true;
  es.report = report;

  renderExamReport(report, false);
}

function renderExamReport(rep, isArchive = false) {
  const total = rep.total;
  const score = rep.score;
  const p = rep.pct;
  const passed = rep.passed;
  const wrongCount = rep.wrongQIds.length;
  const flaggedCount = rep.flaggedQIds.length;
  const mins = Math.floor(rep.durationSec / 60);
  const secs = rep.durationSec % 60;
  const timeStr = `${mins} min ${secs} s`;
  const dateStr = new Date(rep.date).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' });

  // Pytania egzaminu
  const questions = rep.qIds.map(id => qById[id]).filter(Boolean);
  let reviewFilter = 'all'; // 'all' | 'wrong' | 'flagged' | 'correct'

  const renderContent = () => {
    main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:920px">
      <div class="eyebrow">${isArchive ? 'Archiwalny wynik egzaminu' : 'Podsumowanie egzaminu'}</div>
      <h2>${passed ? '🎉 Gratulacje! Egzamin zaliczony' : '⚠️ Egzamin niezaliczony'}</h2>
      <p class="lead">${isArchive ? `Podejście z dnia ${dateStr}.` : 'Oficjalny próg zdawalności wynosi 60%. Poniżej znajduje się szczegółowa diagnoza mocnych i słabych modułów oraz pełne omówienie pytań.'}</p>

      <!-- Duża karta wyniku -->
      <div class="exam-summary-card">
        <div style="text-align:center">
          <div class="big" style="color:${passed ? 'var(--green)' : 'var(--red)'}">${p}%</div>
          <div>${passed ? '<span class="exam-badge-pass">Zdany (≥60%)</span>' : '<span class="exam-badge-fail">Niezaliczony (<60%)</span>'}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
          <div><div class="muted" style="font-size:.82rem;font-weight:700">Zdobyte punkty</div><b style="font-size:1.3rem">${score} / ${total}</b></div>
          <div><div class="muted" style="font-size:.82rem;font-weight:700">Czas rozwiązywania</div><b style="font-size:1.3rem">${timeStr}</b></div>
          <div><div class="muted" style="font-size:.82rem;font-weight:700">Błędne odpowiedzi</div><b style="font-size:1.3rem;color:var(--red)">${wrongCount}</b></div>
          <div><div class="muted" style="font-size:.82rem;font-weight:700">Oznaczone flagą</div><b style="font-size:1.3rem;color:var(--amber)">${flaggedCount}</b></div>
        </div>
      </div>

      <!-- Akcje główne -->
      <div class="acts" style="margin:1.6rem 0">
        ${wrongCount ? `<button class="btn pri" id="btnTrainWrong">🎯 Trening z błędnych pytań (${wrongCount})</button>` : ''}
        <button class="btn sec" id="btnSaveToNotes">📝 Zapisz błędy do Notatnika</button>
        <button class="btn sec" id="btnNewExam">🔄 Nowy egzamin</button>
        <a class="btn sec" href="#/postep">Historia i postęp</a>
      </div>

      <!-- Diagnoza wg modułów -->
      <h3 style="margin:2.4rem 0 .4rem">Diagnoza gotowości wg modułów</h3>
      <p class="muted" style="margin-bottom:.9rem">Zwróć szczególną uwagę na moduły z wynikiem poniżej 60% – to one decydują o zdaniu egzaminu.</p>
      <div class="card" style="padding:1.2rem">
        <div class="mod-diagnostic-list">
          ${Object.keys(rep.byMod).sort((a, b) => IDX[a] - IDX[b]).map(mId => {
            const data = rep.byMod[mId];
            const modPct = pct(data.correct, data.total);
            const isModPass = modPct >= 60;
            const g = gOf(mId).color;
            return `<div class="mod-diag-row">
              <div style="display:flex;align-items:center;gap:.45rem">
                <span class="chip m" style="color:${g}">[${mId}]</span>
                <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(SHORT[mId] || mId)}</span>
              </div>
              <div class="meter">
                <i style="width:${modPct}%;background:${isModPass ? 'var(--green)' : 'var(--red)'}"></i>
              </div>
              <div style="text-align:right">
                <span class="mono" style="color:${isModPass ? 'var(--green)' : 'var(--red)'}">${modPct}%</span>
                <small class="muted" style="margin-left:.3rem">(${data.correct}/${data.total})</small>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Przegląd pytań -->
      <h3 style="margin:2.6rem 0 .4rem">Przegląd pytań i klucz odpowiedzi</h3>
      <p class="muted" style="margin-bottom:.9rem">Przeanalizuj swoje odpowiedzi w porównaniu z oficjalnym kluczem i wytycznymi klinicznymi.</p>

      <div class="seg" id="reviewFilterSeg" style="margin-bottom:1.2rem">
        <button data-rf="all" aria-pressed="${reviewFilter === 'all'}">Wszystkie (${total})</button>
        <button data-rf="wrong" aria-pressed="${reviewFilter === 'wrong'}" style="color:var(--red)">Tylko błędne (${wrongCount})</button>
        <button data-rf="flagged" aria-pressed="${reviewFilter === 'flagged'}">Oznaczone flagą (${flaggedCount})</button>
        <button data-rf="correct" aria-pressed="${reviewFilter === 'correct'}" style="color:var(--green)">Poprawne (${score})</button>
      </div>

      <div id="reviewCardsList">
        ${renderReviewCards(questions, rep, reviewFilter)}
      </div>
    </div></section>`;

    attachReportEvents();
  };

  const renderReviewCards = (list, reportData, filter) => {
    let filtered = list;
    if (filter === 'wrong') filtered = filtered.filter(q => reportData.wrongQIds.includes(q.id));
    else if (filter === 'flagged') filtered = filtered.filter(q => reportData.flaggedQIds.includes(q.id));
    else if (filter === 'correct') filtered = filtered.filter(q => !reportData.wrongQIds.includes(q.id));

    if (!filtered.length) {
      return '<div class="card" style="padding:1.6rem;text-align:center"><p class="muted">Brak pytań w tym filtrze.</p></div>';
    }

    return filtered.map((q, idx) => {
      const userSel = reportData.userAnswers[q.id] || [];
      const isCorrect = userSel.length === q.keys.length && q.keys.every(k => userSel.includes(k));
      const isFlagged = reportData.flaggedQIds.includes(q.id);

      return `<div class="exam-review-card" style="border-left:5px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;flex-wrap:wrap;gap:.4rem">
          <div class="tags" style="display:flex;gap:.35rem;align-items:center">
            <span class="chip" style="font-weight:800;background:${isCorrect ? 'var(--green-l)' : 'var(--red-l)'};color:${isCorrect ? 'var(--green)' : 'var(--red)'}">
              ${isCorrect ? '✓ Poprawna' : '✗ Błędna'}
            </span>
            ${isFlagged ? '<span class="chip" style="background:var(--amber-l);color:var(--amber)">🚩 Flaga</span>' : ''}
            ${modChips(q)}
            <span class="chip">${esc(ASHORT[q.at])}</span>
            ${confChip(q.conf)}
          </div>
          <a class="btn sec sm" href="${atlasHref(q)}" target="_blank" style="font-size:.78rem">Temat w atlasie ↗</a>
        </div>

        <div class="stemL" style="font-size:1.15rem;margin:.5rem 0 .9rem">${escB(q.stem)}</div>

        <div style="margin-bottom:1rem">
          ${q.opts.map((opt, optIdx) => {
            const isUserChoice = userSel.includes(optIdx);
            const isKey = q.keys.includes(optIdx);
            let cls = 'opt-dim';
            let badge = '';

            if (isKey && isUserChoice) {
              cls = 'opt-correct';
              badge = '<b style="color:var(--green);font-size:.8rem;margin-left:auto">✓ Twoja odpowiedź (poprawna)</b>';
            } else if (isKey && !isUserChoice) {
              cls = 'opt-correct';
              badge = '<b style="color:var(--green);font-size:.8rem;margin-left:auto">✓ Prawidłowa odpowiedź</b>';
            } else if (!isKey && isUserChoice) {
              cls = 'opt-wrong';
              badge = '<b style="color:var(--red);font-size:.8rem;margin-left:auto">✗ Twoja odpowiedź</b>';
            }

            return `<div class="opt-review ${cls}">
              <span class="l" style="font-weight:800;min-width:20px">${L[optIdx]}</span>
              <span>${esc(opt)}</span>
              ${badge}
            </div>`;
          }).join('')}
        </div>

        ${explain(q)}
      </div>`;
    }).join('');
  };

  const attachReportEvents = () => {
    // Filtr zakładek
    $$('#reviewFilterSeg button').forEach(b => {
      b.onclick = () => {
        reviewFilter = b.dataset.rf;
        $$('#reviewFilterSeg button').forEach(x => x.setAttribute('aria-pressed', x === b));
        $('#reviewCardsList').innerHTML = renderReviewCards(questions, rep, reviewFilter);
      };
    });

    // Trening z błędów
    const btnTrain = $('#btnTrainWrong');
    if (btnTrain) {
      btnTrain.onclick = () => {
        const ids = rep.wrongQIds;
        location.hash = '#/trening';
        setTimeout(() => startSession(ids), 50);
      };
    }

    // Zapisz do notatek
    const btnNote = $('#btnSaveToNotes');
    if (btnNote) {
      btnNote.onclick = () => {
        const wrongQs = rep.wrongQIds.map(id => qById[id]).filter(Boolean);
        const md = `# Podsumowanie błędów egzaminu (${new Date(rep.date).toLocaleDateString('pl-PL')})
**Wynik:** ${rep.pct}% (${rep.score}/${rep.total}) · Status: ${rep.passed ? 'ZDANY' : 'NIEZDANY'}
**Czas:** ${timeStr}

## Błędne pytania do powtórzenia (${wrongQs.length}):

${wrongQs.map((q, idx) => `### ${idx + 1}. [${q.pm || 'Moduł'}] ${q.stem.slice(0, 90)}...
- **Prawidłowa odpowiedź:** ${q.keys.map(k => `${L[k]}: ${q.opts[k]}`).join('; ')}
- **Wyjaśnienie:** ${q.why || q.tip || 'Brak omówienia'}
`).join('\n---\n\n')}
`;
        const notes = getNotes();
        const note = {
          id: 'note_' + Date.now(),
          title: `Błędy z egzaminu (${rep.pct}%, ${new Date(rep.date).toLocaleDateString('pl-PL')})`,
          content: md,
          mod: 'all',
          updatedAt: Date.now()
        };
        notes.unshift(note);
        saveNotes(notes);
        toast('Utworzono notatkę z błędnymi pytaniami!');
        location.hash = '#/notatki?id=' + note.id;
      };
    }

    // Nowy egzamin
    const btnNew = $('#btnNewExam');
    if (btnNew) {
      btnNew.onclick = () => {
        EXAM_SESSION = null;
        location.hash = '#/egzamin';
        renderExamSetup();
      };
    }
  };

  renderContent();
}

/* ---------- TRENING ---------- */
function viewTrening(parts, params) {
  if (params.at !== undefined || params.mods !== undefined || params.wrong || params.auto || params.gap || params.bank) {
    C.at = new Set((params.at || '').split(',').filter(Boolean)); C.mods = new Set((params.mods || '').split(',').filter(Boolean));
    C.banks = new Set((params.bank || '').split(',').filter(Boolean));
    C.wrong = !!params.wrong; C.gap = !!params.gap; C.conf = new Set(); C.bm = false; C.fresh = false; C.open = false;
    SESSION = null;
    if (params.auto) { startSession(); return; }
    history.replaceState && (() => { try { history.replaceState(null, '', '#/trening'); } catch (e) { /* tryb piaskownicy */ } })();
  }
  if (SESSION) return renderSession();
  renderConfig();
}
function renderConfig() {
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:900px">
    <div class="eyebrow">Trening mieszany</div><h2>Ułóż sesję</h2>
    <p class="lead">Pytania pochodzą ze wszystkich atlasów naraz. W trybie nauki omówienie pojawia się od razu, w trybie egzaminu dopiero na końcu.</p>
    <div class="tool">
      <div class="frow"><span class="flab">Bank</span><div class="pillrow" id="cBank">${Object.keys(BANKS).map(b => `<button class="tgl" data-v="${b}" aria-pressed="${C.banks.has(b)}">${BANKS[b].icon} ${BANKS[b].short} (${Q.filter(q => q.bank === b).length})</button>`).join('')}</div></div>
      <div class="frow"><span class="flab">Atlas</span><div class="pillrow" id="cAt">${ATLASES.map(a => `<button class="tgl" data-v="${a.id}" aria-pressed="${C.at.has(a.id)}">${a.tag} ${esc(ASHORT[a.id])}</button>`).join('')}</div></div>
      ${C.mods.size ? `<div class="frow"><span class="flab">Moduły</span><div class="pillrow">${[...C.mods].map(m => `<button class="tgl" data-rm="${m}" aria-pressed="true">[${m}] ✕</button>`).join('')}</div></div>` : ''}
      <div class="frow"><span class="flab">Klucz</span><div class="pillrow" id="cConf">${Object.keys(CONF).filter(k => Q.some(q => q.conf === k)).map(k => `<button class="tgl" data-v="${k}" aria-pressed="${C.conf.has(k)}">${CONF[k].n}</button>`).join('')}</div></div>
      <div class="frow"><span class="flab">Tylko</span><div class="pillrow" id="cFlag"><button class="tgl" data-f="gap" aria-pressed="${C.gap}">klucz ≠ wytyczne</button><button class="tgl" data-f="wrong" aria-pressed="${C.wrong}">moje błędne</button><button class="tgl" data-f="fresh" aria-pressed="${C.fresh}">jeszcze nie ruszone</button><button class="tgl" data-f="bm" aria-pressed="${C.bm}">zakładki</button><button class="tgl" data-f="open" aria-pressed="${C.open}">z fiszkami (otwarte)</button></div></div>
      <div class="frow"><span class="flab">Liczba</span><div class="seg" id="cN">${[10, 20, 40, 0].map(n => `<button data-n="${n}" aria-pressed="${C.n === n}">${n || 'Wszystkie'}</button>`).join('')}</div>
        <span class="flab" style="min-width:0;margin-left:1rem">Tryb</span><div class="seg" id="cMode"><button data-m="learn" aria-pressed="${C.mode === 'learn'}">Nauka</button><button data-m="exam" aria-pressed="${C.mode === 'exam'}">Egzamin</button></div></div>
      <div class="frow" style="justify-content:space-between;border-top:1px solid var(--line-2);padding-top:.9rem"><span id="cPool" style="font-weight:800"></span><button class="btn pri" id="go">Rozpocznij sesję →</button></div>
    </div></div></section>`;
  const upd = () => { const p = pool().length; $('#cPool').textContent = p ? `Pula: ${p} ${p === 1 ? 'pytanie' : 'pytań'}` : 'Pula pusta, poluzuj filtry'; $('#go').disabled = !p; };
  const tgl = (sel, set) => $(sel).addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; const v = b.dataset.v; set.has(v) ? set.delete(v) : set.add(v); b.setAttribute('aria-pressed', set.has(v)); upd(); });
  tgl('#cBank', C.banks); tgl('#cAt', C.at); tgl('#cConf', C.conf);
  $('#cFlag').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; C[b.dataset.f] = !C[b.dataset.f]; b.setAttribute('aria-pressed', C[b.dataset.f]); upd(); });
  $('#cN').addEventListener('click', e => { const b = e.target.closest('[data-n]'); if (!b) return; C.n = +b.dataset.n; $$('#cN button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#cMode').addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (!b) return; C.mode = b.dataset.m; $$('#cMode button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $$('[data-rm]').forEach(b => b.addEventListener('click', () => { C.mods.delete(b.dataset.rm); renderConfig(); }));
  $('#go').addEventListener('click', () => startSession());
  upd();
}
function startSession(ids) {
  let list = ids ? ids.map(i => qById[i]) : shuffle(pool());
  if (!ids && C.n) list = list.slice(0, C.n);
  if (!list.length) { renderConfig(); return; }
  SESSION = { list, i: 0, log: [], mode: ids ? C.mode : C.mode, locked: false, sel: new Set() };
  renderSession();
}
function renderSession() {
  const s = SESSION; if (!s) return renderConfig();
  if (s.i >= s.list.length) return renderResults();
  const q = s.list[s.i], done = s.locked, learn = s.mode === 'learn';
  const good = s.log.filter(x => x.ok).length;
  let body = '';
  if (q.type === 'open') {
    body = done ? `${explain(q)}<div class="acts" id="nextRow"></div>` : `<div class="acts"><button class="btn dark" id="reveal">Pokaż odpowiedź</button></div>`;
  } else {
    const multi = q.keys.length > 1;
    body = `${multi ? '<p class="srcline" style="margin-bottom:.5rem">Zadanie wielokrotnego wyboru: zaznacz wszystkie poprawne odpowiedzi.</p>' : ''}<div class="opts" id="opts">${q.opts.map((o, i) => {
      let cls = ''; if (done) { if (learn) cls = q.keys.includes(i) ? 'ok' : (s.sel.has(i) ? 'bad' : 'dim'); else cls = s.sel.has(i) ? 'sel' : ''; } else if (s.sel.has(i)) cls = 'sel';
      return `<button class="opt ${cls}" data-i="${i}" ${done ? 'disabled' : ''}><span class="l">${L[i]}</span><span>${esc(o)}</span></button>`;
    }).join('')}</div>${!done && multi ? '<div class="acts" style="margin-top:.7rem"><button class="btn dark" id="check" ' + (s.sel.size ? '' : 'disabled') + '>Sprawdź</button></div>' : ''}${done && learn ? explain(q) : ''}${done && !learn ? '<p class="srcline">Odpowiedź zapisana. Omówienie zobaczysz po zakończeniu sesji.</p>' : ''}<div class="acts" id="nextRow"></div>`;
  }
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap qz">
    <div class="qprog" role="progressbar" aria-valuemin="0" aria-valuemax="${s.list.length}" aria-valuenow="${s.i}"><i style="width:${100 * s.i / s.list.length}%"></i></div>
    <div class="qhead"><span>Pytanie ${s.i + 1} z ${s.list.length} · ${s.mode === 'learn' ? 'tryb nauki' : 'tryb egzaminu'}</span><span>${learn || !done ? `Poprawne: ${good}/${s.log.length}` : ''}</span><button class="btn sec sm" id="quit">Zakończ sesję</button></div>
    <div class="qbox"><div class="tags" style="display:flex;gap:.3rem;flex-wrap:wrap">${modChips(q)}${learn || q.type === 'open' ? confChip(q.conf) : ''}<span class="chip">${esc(ASHORT[q.at])}</span></div>
      <div class="stemL">${escB(q.stem)}</div>${body}</div></div></section>`;
  const nextBtn = (ok) => { $('#nextRow').innerHTML = `<a class="btn sec sm" href="${atlasHref(q)}" target="_self">Temat w atlasie</a><button class="bm" data-bm="${q.id}" aria-pressed="${!!S.bm[q.id]}" aria-label="Zakładka"><svg width="16" height="16" viewBox="0 0 16 16" fill="${S.bm[q.id] ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8"><path d="M3.5 2h9v12L8 11 3.5 14z"/></svg></button><span style="flex:1"></span><button class="btn pri" id="next">${s.i + 1 < s.list.length ? 'Dalej →' : 'Zobacz wynik →'}</button>`; $('#next').focus({ preventScroll: true }); $('#next').onclick = () => { s.i++; s.locked = false; s.sel = new Set(); renderSession(); window.scrollTo(0, 0); }; };
  delegateBm(main);
  $('#quit').onclick = () => { s.i = s.list.length; renderSession(); };
  function record(ok) {
    s.log.push({ id: q.id, ok, sel: [...s.sel] }); const a = S.ans[q.id] || { n: 0, c: 0 };
    a.n++; if (ok) a.c++; a.last = ok; a.ts = Date.now(); S.ans[q.id] = a; save();
    s.locked = true;
  }
  if (q.type === 'open') {
    if (!done) { $('#reveal').onclick = () => { s.locked = true; renderSession(); }; }
    else { $('#nextRow').innerHTML = `<span class="muted" style="font-weight:700">Czy znałeś odpowiedź?</span><button class="btn sec sm" id="yes">Tak</button><button class="btn sec sm" id="no">Nie</button>`; $('#yes').onclick = () => { s.sel = new Set(); record(true); s.locked = true; s.i++; s.locked = false; renderSession(); }; $('#no').onclick = () => { s.sel = new Set(); record(false); s.i++; s.locked = false; renderSession(); }; }
    return;
  }
  const multi = q.keys.length > 1;
  if (!done) {
    $('#opts').addEventListener('click', e => {
      const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i;
      if (multi) { s.sel.has(i) ? s.sel.delete(i) : s.sel.add(i); b.classList.toggle('sel'); $('#check').disabled = !s.sel.size; return; }
      s.sel = new Set([i]); record(i === q.keys[0]); renderSession(); nextBtn();
    });
    if (multi) $('#check').onclick = () => { const ok = s.sel.size === q.keys.length && q.keys.every(k => s.sel.has(k)); record(ok); renderSession(); nextBtn(); };
  } else nextBtn();
}
function renderResults() {
  const s = SESSION; const tot = s.log.length, good = s.log.filter(x => x.ok).length;
  const by = {}; s.log.forEach(x => { const q = qById[x.id]; const k = q.pm; (by[k] = by[k] || { t: 0, g: 0 }).t++; if (x.ok) by[k].g++; });
  const wrong = s.log.filter(x => !x.ok).map(x => qById[x.id]);
  const p = pct(good, tot), col = p >= 80 ? 'var(--green)' : p >= 60 ? 'var(--amber)' : 'var(--red)';
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap" style="max-width:900px">
    <div class="eyebrow">Wynik sesji</div>
    <div class="card res"><div><div class="big" style="color:${col}">${p}%</div><div class="muted" style="font-weight:700">${good} z ${tot} poprawnie</div></div>
      <div class="bk">${Object.keys(by).sort((a, b) => IDX[a] - IDX[b]).map(k => `<div class="bkrow"><span class="chip m" style="color:${gOf(k).color}">[${k}]</span><div class="t"><i style="width:${pct(by[k].g, by[k].t)}%;background:${gOf(k).color}"></i></div><span class="mono">${by[k].g}/${by[k].t}</span></div>`).join('') || '<span class="muted">Brak odpowiedzi</span>'}</div></div>
    <div class="acts" style="margin:1.2rem 0">${wrong.length ? `<button class="btn pri" id="redo">Powtórz błędne (${wrong.length})</button>` : ''}<button class="btn sec" id="again">Nowa sesja</button><a class="btn sec" href="#/postep">Postęp</a></div>
    ${wrong.length ? `<h3 style="margin:1.6rem 0 .2rem">Do powtórki</h3><div class="qlist">${wrong.map(q => qCard(q)).join('')}</div>` : '<div class="card" style="text-align:center;padding:2rem"><h3>Bez błędów</h3><p class="muted" style="margin:.3rem auto">Spróbuj trudniejszej puli, na przykład pytań z niepewnym kluczem.</p></div>'}
  </div></section>`;
  delegateBm(main);
  if ($('#redo')) $('#redo').onclick = () => { const ids = wrong.map(q => q.id); SESSION = null; startSession(ids); };
  $('#again').onclick = () => { SESSION = null; renderConfig(); };
  if (s.mode === 'exam') $$('details.qc', main).forEach(d => d.open = false);
}

/* ---------- POSTĘP ---------- */
function viewProgress() {
  const att = Object.keys(S.ans).filter(k => qById[k]), ok = att.filter(k => S.ans[k].last).length;
  const dc = doneCount();
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap">
    <div class="eyebrow">Postęp</div><h2>Gdzie jesteś</h2>
    <div class="agrid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-bottom:1.6rem">
      <div class="card"><div class="muted" style="font-weight:700">Moduły opanowane</div><div class="big" style="font-size:2.6rem">${dc}<span class="muted" style="font-size:1.2rem">/${covered.length}</span></div></div>
      <div class="card"><div class="muted" style="font-weight:700">Rozwiązane zadania</div><div class="big" style="font-size:2.6rem">${att.length}<span class="muted" style="font-size:1.2rem">/${Q.length}</span></div></div>
      <div class="card"><div class="muted" style="font-weight:700">Poprawne (ostatnia próba)</div><div class="big" style="font-size:2.6rem">${att.length ? pct(ok, att.length) + '%' : '–'}</div></div>
      <div class="card"><div class="muted" style="font-weight:700">Do powtórki</div><div class="big" style="font-size:2.6rem;color:var(--red)">${att.length - ok}</div></div>
    </div>
    <div class="plist">${MODS.map(m => {
      const st = modStats(m.id); const g = gOf(m.id).color; const at = m.at ? atById[m.at] : null;
      if (!m.at) return `<div class="prow" style="--gc:${g};opacity:.65"><span class="nb" style="background:transparent;border:2px dashed ${g};color:${g}">${m.id}</span><div><b>${esc(m.n)}</b><small>Brak atlasu w Projekcie</small></div><div class="muted" style="font-weight:700">–</div><span></span></div>`;
      return `<div class="prow" style="--gc:${g}"><span class="nb">${m.id}</span>
        <div><b>${esc(m.n)}</b><small>${esc(ASHORT[m.at])}${S.visited[m.at] ? ' · otwarty' : ''}</small></div>
        <div><div class="meter"><i style="width:${pct(st.att, st.total)}%;opacity:.35"></i><i style="width:${pct(st.ok, st.total)}%;position:absolute;left:0;top:0"></i></div><div class="meterl"><span>${st.ok} poprawnych · ${st.wrong} błędnych</span><span>${st.att}/${st.total}</span></div></div>
        <div class="acts"><label class="chk"><input type="checkbox" data-done="${m.id}" ${S.done[m.id] ? 'checked' : ''}> opanowany</label><a class="btn sec sm" href="#/atlas/${m.at}/${m.a}">Atlas</a><a class="btn ${st.wrong ? 'pri' : 'sec'} sm" href="#/trening?mods=${m.id}${st.wrong ? '&wrong=1' : ''}">${st.wrong ? 'Błędne' : 'Trening'}</a></div></div>`;
    }).join('')}</div>

    <h3 style="margin:2.4rem 0 .3rem">Historia egzaminów próbnych</h3>
    <p class="muted" style="margin-bottom:.7rem">Podejścia do pełnej symulacji egzaminu z progiem zdawalności 60%.</p>
    ${renderExamHistorySection()}

    <h3 style="margin:2.2rem 0 .3rem">Motyw graficzny (Dark Mode)</h3>
    <p class="muted" style="margin-bottom:.7rem">Wybierz motyw dla całego Hubu i czytnika atlasów.</p>
    <div class="seg" id="themeSeg">
      <button data-theme-choice="auto" aria-pressed="${currentTheme === 'auto'}">🖥️ Auto (systemowy)</button>
      <button data-theme-choice="light" aria-pressed="${currentTheme === 'light'}">☀️ Jasny</button>
      <button data-theme-choice="dark" aria-pressed="${currentTheme === 'dark'}">🌙 Ciemny</button>
    </div>
    <h3 style="margin:2.2rem 0 .3rem">Kopia zapasowa</h3>
    <p class="muted" style="margin-bottom:.7rem">Skopiuj kod, aby przenieść postęp na inne urządzenie, albo wklej kod, aby go wczytać.</p>
    <textarea class="code" id="bk" aria-label="Kod kopii zapasowej"></textarea>
    <div class="acts" style="margin-top:.6rem"><button class="btn sec sm" id="bkGen">Wygeneruj kod</button><button class="btn sec sm" id="bkCopy">Kopiuj</button><button class="btn dark sm" id="bkLoad">Wczytaj z kodu</button><button class="btn sec sm" id="bkReset" style="color:var(--red)">Zeruj postęp</button></div>
  </div></section>`;

  function renderExamHistorySection() {
    const h = S.examHistory || [];
    if (!h.length) {
      return `<div class="card" style="padding:1.4rem;text-align:center">
        <p class="muted" style="margin-bottom:.6rem">Brak zarejestrowanych podejść do symulacji egzaminu.</p>
        <a class="btn pri sm" href="#/egzamin">Rozpocznij pierwszy egzamin próbny →</a>
      </div>`;
    }
    const avg = Math.round(h.reduce((acc, x) => acc + x.pct, 0) / h.length);
    const passedCount = h.filter(x => x.passed).length;
    const best = Math.max(...h.map(x => x.pct));

    return `<div class="card" style="padding:1.2rem;margin-bottom:.8rem">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:1.1rem;padding-bottom:1rem;border-bottom:1px solid var(--line-2)">
        <div><div class="muted" style="font-size:.76rem;font-weight:700">Podejścia</div><b style="font-size:1.4rem">${h.length}</b></div>
        <div><div class="muted" style="font-size:.76rem;font-weight:700">Średni wynik</div><b style="font-size:1.4rem">${avg}%</b></div>
        <div><div class="muted" style="font-size:.76rem;font-weight:700">Najlepszy wynik</div><b style="font-size:1.4rem;color:var(--green)">${best}%</b></div>
        <div><div class="muted" style="font-size:.76rem;font-weight:700">Zdane / Niezdane</div><b style="font-size:1.4rem">${passedCount} / ${h.length - passedCount}</b></div>
      </div>
      <div style="display:grid;gap:.55rem">
        ${h.map(item => {
          const d = new Date(item.date).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
          const m = Math.floor(item.durationSec / 60);
          const s = item.durationSec % 60;
          return `<div class="prow" style="padding:.6rem .8rem;align-items:center">
            <span class="nb" style="background:${item.passed ? 'var(--green)' : 'var(--red)'};font-size:.85rem">${item.pct}%</span>
            <div>
              <b>${item.passed ? 'ZDANY' : 'NIEZDANY'} (${item.score}/${item.total} pkt)</b>
              <small>${d} · czas: ${m}m ${s}s · ${item.wrongQIds.length} błędów</small>
            </div>
            <div></div>
            <div class="acts">
              <a class="btn sec sm" href="#/egzamin?id=${item.id}">Raport</a>
              ${item.wrongQIds.length ? `<button class="btn pri sm" data-retry-exam="${item.id}">Błędy</button>` : ''}
              <button class="btn sec sm" data-del-exam="${item.id}" style="color:var(--red);padding:.3rem .55rem" title="Usuń próbę">✕</button>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="acts" style="margin-top:.9rem;justify-content:flex-end">
        <button class="btn sec sm" id="btnClearExamHistory" style="color:var(--red)">Wyczyść historię egzaminów</button>
      </div>
    </div>`;
  }

  // Akcje historii egzaminów
  $$('[data-del-exam]').forEach(b => {
    b.onclick = () => {
      const id = b.dataset.delExam;
      if (confirm('Czy na pewno chcesz usunąć to podejście do egzaminu?')) {
        S.examHistory = (S.examHistory || []).filter(x => x.id !== id);
        save();
        toast('Usunięto podejście z historii');
        viewProgress();
      }
    };
  });

  $$('[data-retry-exam]').forEach(b => {
    b.onclick = () => {
      const id = b.dataset.retryExam;
      const ex = (S.examHistory || []).find(x => x.id === id);
      if (ex && ex.wrongQIds.length) {
        location.hash = '#/trening';
        setTimeout(() => startSession(ex.wrongQIds), 50);
      }
    };
  });

  const clearExBtn = $('#btnClearExamHistory');
  if (clearExBtn) {
    clearExBtn.onclick = () => {
      if (confirm('Czy na pewno wyczyścić całą historię egzaminów próbnych?')) {
        S.examHistory = [];
        save();
        toast('Historia egzaminów wyczyszczona');
        viewProgress();
      }
    };
  }
  const tseg = $('#themeSeg');
  if (tseg) {
    tseg.addEventListener('click', e => {
      const b = e.target.closest('[data-theme-choice]');
      if (!b) return;
      applyTheme(b.dataset.themeChoice);
    });
  }
  $$('[data-done]').forEach(c => c.addEventListener('change', () => { c.checked ? S.done[c.dataset.done] = 1 : delete S.done[c.dataset.done]; save(); viewProgressSummaryRefresh(); }));
  function viewProgressSummaryRefresh() { const cards = $$('.agrid .card .big'); if (cards[0]) cards[0].innerHTML = `${doneCount()}<span class="muted" style="font-size:1.2rem">/${covered.length}</span>`; }
  const enc = () => btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  $('#bkGen').onclick = () => { $('#bk').value = enc(); };
  $('#bkCopy').onclick = async () => { $('#bk').value = enc(); try { await navigator.clipboard.writeText($('#bk').value); toast('Skopiowano kod'); } catch (e) { $('#bk').select(); toast('Zaznaczono kod, skopiuj ręcznie'); } };
  $('#bkLoad').onclick = () => { try { const d = JSON.parse(decodeURIComponent(escape(atob($('#bk').value.trim())))); S = Object.assign({ visited: {}, last: null, done: {}, ans: {}, bm: {} }, d); save(); toast('Wczytano postęp'); viewProgress(); } catch (e) { toast('Nieprawidłowy kod'); } };
  $('#bkReset').onclick = () => { if ($('#bkReset').dataset.s) { S = { visited: {}, last: null, done: {}, ans: {}, bm: {} }; save(); toast('Postęp wyzerowany'); viewProgress(); } else { $('#bkReset').dataset.s = 1; $('#bkReset').textContent = 'Kliknij ponownie, aby potwierdzić'; setTimeout(() => { const b = $('#bkReset'); if (b) { delete b.dataset.s; b.textContent = 'Zeruj postęp'; } }, 3000); } };
}

/* ---------- STOPKA ---------- */
function renderFooter() {
  $('#ft').innerHTML = `<div class="wrap"><div><h3>Pediatria · V rok</h3><p>Hub łączy ${ATLASES.length} atlasów z Projektu „Pediatria – zaliczenie 5. rok”. Zadania pochodzą z pul zakładowych, rekonstrukcji i uzupełnień autorskich, a każde niesie znacznik pewności klucza.</p></div>
  <div><h3>Jak czytać źródła</h3><p>Powtarzalność pytania to sygnał do nauki, nie prognoza egzaminu. Tam, gdzie klucz puli rozmija się z wytycznymi, hub pokazuje „pod zaliczenie” i „aktualnie klinicznie” osobno. Brakujących lokalnych wymogów zakładu nie uzupełniono domysłami.</p><p style="margin-top:.5rem">Szybkie wyszukiwanie: <b>Ctrl K</b> lub <b>/</b>.</p></div></div>`;
}

/* ---------- PALETA ---------- */
const pal = $('#pal'), palIn = $('#palIn'), palList = $('#palList');
let palItems = [], palCur = 0;
const VIEWS = [
  ['Start', '#/'],
  ['Atlasy', '#/atlasy'],
  ['Trening mieszany', '#/trening'],
  ['Egzamin próbny', '#/egzamin'],
  ['Baza pytań', '#/pytania'],
  ['Notatki Markdown', '#/notatki'],
  ['Mapa powiązań', '#/polaczenia'],
  ['Postęp i historia', '#/postep']
];
const ALL = [
  ...VIEWS.map(v => ({ k: 'Widok', t: v[0], h: v[1], n: norm(v[0]) })),
  ...MODS.map(m => ({ k: 'Moduł', t: `[${m.id}] ${m.n}`, h: m.at ? `#/atlas/${m.at}/${m.a}` : `#/polaczenia?mod=${m.id}`, n: norm(`${m.id} ${m.n} ${m.d}`) })),
  ...ATLASES.flatMap(a => a.secs.map(s => ({ k: 'Sekcja', t: `${ASHORT[a.id]} › ${s[1]}`, h: `#/atlas/${a.id}/${s[0]}`, n: norm(`${ASHORT[a.id]} ${s[1]}`) }))),
  ...Q.map(q => ({ k: 'Zadanie', t: q.stem.length > 120 ? q.stem.slice(0, 118) + '…' : q.stem, h: `#/pytania?q=${encodeURIComponent(q.stem.slice(0, 40))}`, n: q._n }))
];
function palRender() {
  const toks = norm(palIn.value).split(/\s+/).filter(Boolean);
  palItems = (toks.length ? ALL.filter(i => toks.every(t => i.n.includes(t))) : ALL.slice(0, 22)).slice(0, 40);
  palCur = 0;
  palList.innerHTML = palItems.length ? palItems.map((i, ix) => `<li><a href="${i.h}" class="${ix === 0 ? 'cur' : ''}" data-ix="${ix}"><span class="k">${i.k}</span><span class="t">${esc(i.t)}</span><span aria-hidden="true">↵</span></a></li>`).join('') : '<li class="empty">Brak wyników</li>';
}
function palOpen() { if (!pal.open) pal.showModal(); palIn.value = ''; palRender(); palIn.focus(); }
$('#openPal').onclick = palOpen;
palIn.addEventListener('input', palRender);
palIn.addEventListener('keydown', e => {
  const as = $$('a', palList); if (!as.length) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); palCur = (palCur + (e.key === 'ArrowDown' ? 1 : -1) + as.length) % as.length; as.forEach((a, i) => a.classList.toggle('cur', i === palCur)); as[palCur].scrollIntoView({ block: 'nearest' }); }
  if (e.key === 'Enter') { e.preventDefault(); location.hash = palItems[palCur].h; pal.close(); }
});
palList.addEventListener('click', e => { if (e.target.closest('a')) pal.close(); });
pal.addEventListener('click', e => { if (e.target === pal) pal.close(); });
document.addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); palOpen(); }
});
if (/Mac|iPhone|iPad/.test(navigator.platform)) $('.srch kbd').textContent = '⌘ K';

/* ---------- PWA & Service Worker ---------- */
let deferredInstallPrompt = null;
function initPWA() {
  const btnInstall = $('#btnInstall');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (btnInstall) btnInstall.style.display = 'inline-flex';
  });

  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        btnInstall.style.display = 'none';
        toast('Dziękujemy za instalację Pediatria V Hub!');
      }
      deferredInstallPrompt = null;
    });
  }

  window.addEventListener('appinstalled', () => {
    if (btnInstall) btnInstall.style.display = 'none';
    deferredInstallPrompt = null;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              toast(
                `<span>Dostępna nowa wersja materiałów.</span> <button id="swReload" style="margin-left:.6rem;background:var(--teal);color:#fff;border:0;padding:.25rem .7rem;border-radius:999px;font-weight:700;cursor:pointer">Odśwież</button>`,
                { html: true, duration: 10000 }
              );
              const b = $('#swReload');
              if (b) {
                b.onclick = () => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                };
              }
            }
          });
        });
      }).catch(err => {
        console.debug('ServiceWorker registration error:', err);
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
}

function initTheme() {
  const btn = $('#btnTheme');
  if (btn) btn.onclick = cycleTheme;
  applyTheme(currentTheme, false);
}

initTheme();
initPWA();
initNotesDrawer();
route();
})();
