/* Pediatria V – hub. Vanilla JS, jeden plik, router hash. */
(function () {
'use strict';
const { GROUPS, MODS, ATLASES, TRAPS, CONF, modById, atById } = window.HUB_META;
const Q = window.HUB_Q;
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
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- krótkie nazwy ---------- */
const SHORT = { '1': 'Ból brzucha', '2': 'Zakażenia', '3': 'Biegunki', '4': 'KZN', '5': 'Stany nagłe', '6': 'Wrzodowa', '7': 'IBD', '8': 'Alergie', '9': 'Guzy mózgu', '10': 'Nowotwory lite', '11': 'Krwiotwórcze', '12': 'Skazy', '13a': 'Anemie', '13b': 'Odporność', '14': 'ZUM', '15': 'AKI i PChN' };
const ASHORT = { brzuch: 'Ból brzucha', gastro: 'Gastro i alergie', nefro: 'Nefrologia', nagle: 'Stany nagłe', guzy: 'Guzy mózgu', lite: 'Nowotwory lite', onko11: 'Krwiotwórcze i chłonne', hemato: 'Skazy · anemie · PID' };
const GA = { brzuch: ['var(--red)', 'var(--amber)'], gastro: ['var(--amber)', '#D9A441'], nefro: ['var(--blue)', '#5E92D6'], nagle: ['var(--red)', '#E27B6B'], guzy: ['var(--violet)', '#9B7ED6'], lite: ['var(--violet)', '#C06BA8'], onko11: ['var(--violet)', 'var(--red)'], hemato: ['var(--violet)', 'var(--teal)'] };
const gOf = id => GROUPS[modById[id].g];

/* ---------- magazyn postępu ---------- */
const KEY = 'pediatria-hub.v1:';
const persist = false; // podgląd w piaskownicy nie zapewnia trwałego magazynu; pełna kopia przez kod w widoku Postęp
let S = { visited: {}, last: null, done: {}, ans: {}, bm: {} };
// przetrwanie odświeżenia karty: window.name (bez dostępu do magazynów przeglądarki)
try { if (window.name.indexOf(KEY) === 0) Object.assign(S, JSON.parse(window.name.slice(KEY.length))); } catch (e) { /* pusty */ }
const save = () => { try { window.name = KEY + JSON.stringify(S); } catch (e) { /* ignoruj */ } };

/* ---------- dane pochodne ---------- */
Q.forEach(q => {
  q.pm = q.mods.find(m => modById[m] && modById[m].at === q.at) || q.mods[0];
  q._n = norm([q.stem, (q.opts || []).join(' '), q.topic, q.mods.join(' '), ASHORT[q.at]].join(' '));
});
const qById = Object.fromEntries(Q.map(q => [q.id, q]));
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
function qCard(q, open) {
  const bm = !!S.bm[q.id];
  const a = S.ans[q.id];
  return `<details class="qc" data-q="${q.id}"${open ? ' open' : ''}>
    <summary><div><div class="stem">${escB(q.stem)}</div>
      <div class="tags">${modChips(q)}${confChip(q.conf)}${q.gap ? '<span class="chip" style="background:var(--amber-l);color:var(--amber);border-color:transparent">klucz ≠ wytyczne</span>' : ''}${q.type === 'open' ? '<span class="chip">otwarte</span>' : ''}<span class="chip">${esc(ASHORT[q.at])}</span>${a ? `<span class="chip" style="background:${a.last ? 'var(--green-l)' : 'var(--red-l)'};color:${a.last ? 'var(--green)' : 'var(--red)'};border-color:transparent">${a.last ? 'opanowane' : 'do powtórki'}</span>` : ''}</div></div>
      <span class="chev" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 4 4 4 4-4"/></svg></span></summary>
    <div class="body">${optsStatic(q)}${explain(q)}
      <div class="acts"><a class="btn sec sm" href="${atlasHref(q)}">Otwórz temat w atlasie</a><button class="bm" data-bm="${q.id}" aria-pressed="${bm}" aria-label="Zakładka" title="Zakładka"><svg width="16" height="16" viewBox="0 0 16 16" fill="${bm ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8"><path d="M3.5 2h9v12L8 11 3.5 14z"/></svg></button></div>
    </div></details>`;
}
function delegateBm(root) {
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-bm]'); if (!b) return;
    e.preventDefault(); const id = b.dataset.bm;
    if (S.bm[id]) delete S.bm[id]; else S.bm[id] = 1;
    save(); const on = !!S.bm[id]; b.setAttribute('aria-pressed', on); $('svg', b).setAttribute('fill', on ? 'currentColor' : 'none');
    toast(on ? 'Dodano zakładkę' : 'Usunięto zakładkę');
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
  const v = { start: viewStart, atlasy: viewGallery, atlas: viewReader, trening: viewTrening, pytania: viewQuestions, polaczenia: viewConnections, postep: viewProgress }[name];
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
    <div class="card" style="margin-top:1.4rem;border-style:dashed;box-shadow:none"><h3>Brakujący moduł</h3><p class="muted" style="margin-top:.3rem">Atlasu dla modułu <b>[2] Zakażenia u dzieci</b> nie ma jeszcze w Projekcie. Gdy dojdzie, wystarczy dopisać go do listy atlasów hubu.</p></div>
  </div></section>`;
}

/* ---------- CZYTNIK ATLASU ---------- */
function setAnchor(id, a) {
  const at = atById[id]; if (!at) return; const f = $('#rf');
  const url = 'atlasy/' + at.dir + '/index.html' + (a ? '#' + a : '');
  if (f.getAttribute('src') !== url) f.setAttribute('src', url);
  $('#secSel').value = a || '';
  S.visited[id] = Date.now(); S.last = { at: id, a: a || null }; save();
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

/* ---------- BAZA PYTAŃ ---------- */
const F = { q: '', at: new Set(), mods: new Set(), all: false, conf: new Set(), gap: false, bm: false, wrong: false, open: 'all', limit: 40 };
function viewQuestions(parts, params) {
  if (Object.keys(params).length) {
    F.q = params.q || ''; F.at = new Set((params.at || '').split(',').filter(Boolean)); F.mods = new Set((params.mods || '').split(',').filter(Boolean));
    F.all = !!params.all; F.conf = new Set((params.conf || '').split(',').filter(Boolean)); F.gap = !!params.gap; F.bm = !!params.bm; F.wrong = !!params.wrong; F.limit = 40;
  }
  main.innerHTML = `<section class="blk" style="border:0"><div class="wrap">
    <div class="eyebrow">Baza pytań</div><h2>${Q.length} zadań, jedna wyszukiwarka</h2>
    <p class="lead">Szukaj po treści, filtruj po atlasie, module i pewności klucza. Rozwiń zadanie, aby zobaczyć poprawną odpowiedź i omówienie.</p>
    <div class="tool">
      <input class="field" id="fq" type="search" placeholder="Szukaj w treści pytań i odpowiedzi…" value="${esc(F.q)}" aria-label="Szukaj w pytaniach">
      <div class="frow"><span class="flab">Atlas</span><div class="pillrow" id="fAt">${ATLASES.map(a => `<button class="tgl" data-v="${a.id}" aria-pressed="${F.at.has(a.id)}">${a.tag} ${esc(ASHORT[a.id])}</button>`).join('')}</div></div>
      <div class="frow"><span class="flab">Moduł</span><div class="pillrow" id="fMod">${MODS.filter(m => Q.some(q => q.mods.includes(m.id))).map(m => `<button class="tgl g" style="--gc:${gOf(m.id).color}" data-v="${m.id}" aria-pressed="${F.mods.has(m.id)}">[${m.id}]</button>`).join('')}<button class="tgl" id="fAll" aria-pressed="${F.all}" title="Wymagaj wszystkich wybranych modułów jednocześnie">wszystkie naraz</button></div></div>
      <div class="frow"><span class="flab">Klucz</span><div class="pillrow" id="fConf">${Object.keys(CONF).filter(k => Q.some(q => q.conf === k)).map(k => `<button class="tgl" data-v="${k}" aria-pressed="${F.conf.has(k)}">${CONF[k].n}</button>`).join('')}</div></div>
      <div class="frow"><span class="flab">Tylko</span><div class="pillrow" id="fFlag"><button class="tgl" data-f="gap" aria-pressed="${F.gap}">klucz ≠ wytyczne</button><button class="tgl" data-f="wrong" aria-pressed="${F.wrong}">moje błędne</button><button class="tgl" data-f="bm" aria-pressed="${F.bm}">zakładki</button></div>
        <span style="flex:1"></span><span class="muted" id="fCount" style="font-weight:700"></span><button class="btn sec sm" id="fClr">Wyczyść</button></div>
    </div>
    <div class="qlist" id="qlist"></div><div style="text-align:center;margin-top:1.2rem" id="more"></div>
  </div></section>`;
  const list = $('#qlist');
  function filtered() {
    const toks = norm(F.q).split(/\s+/).filter(Boolean);
    return Q.filter(q => {
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
  tgl('#fAt', F.at); tgl('#fMod', F.mods); tgl('#fConf', F.conf);
  $('#fAll').addEventListener('click', e => { F.all = !F.all; e.currentTarget.setAttribute('aria-pressed', F.all); draw(); });
  $('#fFlag').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; F[b.dataset.f] = !F[b.dataset.f]; b.setAttribute('aria-pressed', F[b.dataset.f]); F.limit = 40; draw(); });
  $('#fq').addEventListener('input', e => { F.q = e.target.value; F.limit = 40; draw(); });
  $('#fClr').addEventListener('click', () => { Object.assign(F, { q: '', at: new Set(), mods: new Set(), all: false, conf: new Set(), gap: false, bm: false, wrong: false, limit: 40 }); viewQuestions([], {}); });
  delegateBm(list); draw();
}

/* ---------- TRENING ---------- */
const C = { at: new Set(), mods: new Set(), conf: new Set(), gap: false, wrong: false, bm: false, fresh: false, open: false, n: 10, mode: 'learn' };
function pool() {
  return Q.filter(q => {
    if (q.type === 'open' && !C.open) return false;
    if (C.at.size && !C.at.has(q.at)) return false;
    if (C.mods.size && ![...C.mods].some(m => q.mods.includes(m))) return false;
    if (C.conf.size && !C.conf.has(q.conf)) return false;
    if (C.gap && !q.gap) return false; if (C.bm && !S.bm[q.id]) return false;
    if (C.wrong && !(S.ans[q.id] && !S.ans[q.id].last)) return false;
    if (C.fresh && S.ans[q.id]) return false;
    return true;
  });
}
function viewTrening(parts, params) {
  if (params.at !== undefined || params.mods !== undefined || params.wrong || params.auto || params.gap) {
    C.at = new Set((params.at || '').split(',').filter(Boolean)); C.mods = new Set((params.mods || '').split(',').filter(Boolean));
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
  tgl('#cAt', C.at); tgl('#cConf', C.conf);
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
    ${persist ? '' : '<div class="card" style="background:var(--amber-l);border-color:#EBD3A3;margin-bottom:1.2rem"><b>Podgląd w piaskownicy.</b> Postęp przetrwa odświeżenie tej karty, ale znika po jej zamknięciu. Skorzystaj z kopii zapasowej poniżej.</div>'}
    <div class="plist">${MODS.map(m => {
      const st = modStats(m.id); const g = gOf(m.id).color; const at = m.at ? atById[m.at] : null;
      if (!m.at) return `<div class="prow" style="--gc:${g};opacity:.65"><span class="nb" style="background:transparent;border:2px dashed ${g};color:${g}">${m.id}</span><div><b>${esc(m.n)}</b><small>Brak atlasu w Projekcie</small></div><div class="muted" style="font-weight:700">–</div><span></span></div>`;
      return `<div class="prow" style="--gc:${g}"><span class="nb">${m.id}</span>
        <div><b>${esc(m.n)}</b><small>${esc(ASHORT[m.at])}${S.visited[m.at] ? ' · otwarty' : ''}</small></div>
        <div><div class="meter"><i style="width:${pct(st.att, st.total)}%;opacity:.35"></i><i style="width:${pct(st.ok, st.total)}%;position:absolute;left:0;top:0"></i></div><div class="meterl"><span>${st.ok} poprawnych · ${st.wrong} błędnych</span><span>${st.att}/${st.total}</span></div></div>
        <div class="acts"><label class="chk"><input type="checkbox" data-done="${m.id}" ${S.done[m.id] ? 'checked' : ''}> opanowany</label><a class="btn sec sm" href="#/atlas/${m.at}/${m.a}">Atlas</a><a class="btn ${st.wrong ? 'pri' : 'sec'} sm" href="#/trening?mods=${m.id}${st.wrong ? '&wrong=1' : ''}">${st.wrong ? 'Błędne' : 'Trening'}</a></div></div>`;
    }).join('')}</div>
    <h3 style="margin:2.2rem 0 .3rem">Kopia zapasowa</h3>
    <p class="muted" style="margin-bottom:.7rem">Skopiuj kod, aby przenieść postęp na inne urządzenie, albo wklej kod, aby go wczytać.</p>
    <textarea class="code" id="bk" aria-label="Kod kopii zapasowej"></textarea>
    <div class="acts" style="margin-top:.6rem"><button class="btn sec sm" id="bkGen">Wygeneruj kod</button><button class="btn sec sm" id="bkCopy">Kopiuj</button><button class="btn dark sm" id="bkLoad">Wczytaj z kodu</button><button class="btn sec sm" id="bkReset" style="color:var(--red)">Zeruj postęp</button></div>
  </div></section>`;
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
const VIEWS = [['Start', '#/'], ['Atlasy', '#/atlasy'], ['Trening mieszany', '#/trening'], ['Baza pytań', '#/pytania'], ['Mapa powiązań', '#/polaczenia'], ['Postęp i kopia zapasowa', '#/postep']];
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

route();
})();
