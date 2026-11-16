/* Wspólna synchronizacja odpowiedzi z sekcji #zadania (#trening) 9 atlasów z globalnym stanem Hubu (pediatria_hub_state_v1) */
(function () {
  var STORAGE_KEY = 'pediatria_hub_state_v1';
  var PREFIX_BY_DIR = {
    'atlas-bol-brzucha': 'brzuch-q',
    'modul-2-zakazenia': 'zak-q',
    'modul-3-6-7-8-gastro-alergologia': 'gastro-q',
    'modul-4-14-15-nefrologia': 'nefro-q',
    'modul-5-stany-nagle': 'nagle-q',
    'modul-9-guzy-mozgu': 'guzy-q',
    'nowotwory-lite-modul-10': 'lite-q',
    'modul-11-hemato-onko': 'onko11-q',
    'modul-12-13-skazy-niedokrwistosci-odpornosc': 'hemato-q'
  };

  var prefix = '';
  var parts = (location.pathname || '').split('/');
  for (var i = 0; i < parts.length; i++) {
    if (PREFIX_BY_DIR[parts[i]]) { prefix = PREFIX_BY_DIR[parts[i]]; break; }
  }
  if (!prefix) return;

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (!parsed.ans || typeof parsed.ans !== 'object') parsed.ans = {};
          return parsed;
        }
      }
    } catch (e) {}
    return { visited: {}, last: null, done: {}, ans: {}, bm: {}, examHistory: [], patientCases: {}, osceCases: {} };
  }

  function recordHubAns(hubId, ok) {
    if (!hubId) return;
    var st = loadState();
    var a = st.ans[hubId] || { n: 0, c: 0 };
    a.n = (a.n || 0) + 1;
    if (ok) a.c = (a.c || 0) + 1;
    a.last = !!ok;
    a.ts = Date.now();
    st.ans[hubId] = a;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(st)); } catch (e) {}
    if (window.parent && window.parent !== window) {
      try { window.parent.postMessage({ type: 'pediatria-atlas-ans', id: hubId, ok: !!ok }, '*'); } catch (e) {}
    }
    refreshBadges();
  }
  window.hubSyncRecord = recordHubAns;

  function resolveHubId(art) {
    if (!art) return null;
    if (art.dataset.hubId) return art.dataset.hubId;
    var m = /^(?:q|z)(\d+)$/.exec(art.id || '');
    return m ? prefix + m[1] : null;
  }

  function decorateArticle(art, ansMap) {
    var hubId = resolveHubId(art);
    if (!hubId) return;
    var hdr = art.querySelector('header');
    if (!hdr) return;
    var a = ansMap[hubId];
    var badge = hdr.querySelector('.hub-sync-badge');
    if (!a || !a.n) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tbadge hub-sync-badge';
      hdr.appendChild(badge);
    }
    badge.classList.toggle('is-ok', !!a.last);
    badge.classList.toggle('is-bad', !a.last);
    badge.textContent = (a.last ? '✓ Hub ' : '✗ Hub ') + (a.c || 0) + '/' + a.n;
    badge.title = 'Zapisano w postępie Hubu (' + (a.c || 0) + ' poprawnych na ' + a.n + ' prób)';
  }

  function refreshBadges() {
    var ansMap = loadState().ans;
    document.querySelectorAll('article.q').forEach(function (art) {
      decorateArticle(art, ansMap);
    });
  }

  document.addEventListener('click', function (ev) {
    var hit = ev.target.closest('.opt, .check');
    if (!hit) return;
    var art = hit.closest('article.q');
    if (!art) return;
    var hubId = resolveHubId(art);
    if (!hubId) return;
    queueMicrotask(function () {
      if (art.dataset.hubRecorded === '1') return;
      var answered = art.querySelector('.opt.ok, .opt.bad, .opt.key-g, .opt.key-a, .opt.wrong, .res.ok, .res.no');
      if (!answered) return;
      // Pomijamy podgląd bez wyboru opcji (np. kliknięcie "Pokaż odpowiedź")
      var userPicked = art.querySelector('.opt.bad, .opt.wrong, .opt.pick, .res.ok, .res.no') ||
        (hit.classList.contains('opt') && hit.disabled) ||
        (hit.classList.contains('check') && hit.hidden);
      if (!userPicked) return;
      art.dataset.hubRecorded = '1';
      var isOk = !art.querySelector('.opt.bad, .opt.wrong, .res.no');
      recordHubAns(hubId, isOk);
    });
  });

  var roots = [];
  function observeRoots() {
    document.querySelectorAll('#quiz, #trainOut, .qlist').forEach(function (el) {
      if (roots.indexOf(el) !== -1) return;
      roots.push(el);
      var timer = null;
      new MutationObserver(function () {
        if (timer) return;
        timer = setTimeout(function () { timer = null; refreshBadges(); }, 40);
      }).observe(el, { childList: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { observeRoots(); refreshBadges(); });
  } else {
    observeRoots();
    refreshBadges();
  }
  window.addEventListener('storage', function (ev) {
    if (ev.key === STORAGE_KEY) refreshBadges();
  });
})();
