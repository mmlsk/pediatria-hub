/* Pure, DOM-free domain logic shared between browser Hub and Node tests. */
(function (root) {
  'use strict';

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const escB = s => esc(s).replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;

  const b64EncodeUtf8 = str => {
    const bytes = new TextEncoder().encode(String(str));
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  };

  const b64DecodeUtf8 = b64 => {
    const bin = atob(String(b64));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  };

  function ageWeightInfo(val, unit) {
    const num = Number.isFinite(+val) ? +val : 0;
    if (unit === 'm') {
      const w = Math.max(2.5, Math.min(11, Math.round(((num + 9) / 2) * 10) / 10));
      return { weight: w, hint: `(<12 m.ż.): ${w.toFixed(1)} kg` };
    }
    if (num <= 5) {
      const w = Math.max(1, Math.round(((num + 4) * 2) * 10) / 10);
      return { weight: w, hint: `(1–5 lat): ${w.toFixed(1)} kg` };
    }
    if (num <= 12) {
      const w = Math.round((num * 3 + 7) * 10) / 10;
      return { weight: w, hint: `(6–12 lat): ${w.toFixed(1)} kg` };
    }
    const w = Math.min(75, Math.round(num * 3.5));
    return { weight: w, hint: `(>12 lat): ${w.toFixed(1)} kg` };
  }

  const estimateWeightFromAge = (val, unit) => ageWeightInfo(val, unit).weight;
  const getAgeFormulaHint = (val, unit) => ageWeightInfo(val, unit).hint;

  function calcHollidaySegar(w) {
    const weight = Math.max(0, Number(w) || 0);
    let dailyMl = 0;
    if (weight <= 10) dailyMl = weight * 100;
    else if (weight <= 20) dailyMl = 1000 + (weight - 10) * 50;
    else dailyMl = 1500 + Math.min(60, weight - 20) * 20;
    const hourlyMl = Math.round(dailyMl / 24);
    return {
      dailyMl,
      hourlyMl,
      dropRateStandard: Math.round(hourlyMl / 3),
      dropRateMicro: hourlyMl
    };
  }

  function sanitizeKeys(rawKeys, optsLen, fallbackKey = 0) {
    if (!optsLen) return [];
    const valid = (Array.isArray(rawKeys) ? rawKeys : [])
      .map(k => (typeof k === 'number' ? k : -1))
      .filter(k => Number.isInteger(k) && k >= 0 && k < optsLen);
    if (valid.length) return [...new Set(valid)];
    return fallbackKey >= 0 && fallbackKey < optsLen ? [fallbackKey] : [0];
  }

  function parseQuestionsInput(input, defaultBank = 'zaklad', defaultMod = '1', ctx = {}) {
    const trimmed = String(input || '').trim();
    if (!trimmed) return [];
    const modById = ctx.modById || {};
    const banks = ctx.banks || {};
    const validConfs = new Set(['src', 'inf', 'unk', 'did', 'own']);
    const safeBank = b => (typeof b === 'string' && (!Object.keys(banks).length || banks[b])) ? b : defaultBank;
    const safeConf = c => validConfs.has(c) ? c : 'src';
    const cleanMod = m => String(m || '').replace(/[^a-z0-9_-]/gi, '');
    const safeMods = raw => {
      if (!Array.isArray(raw)) return [cleanMod(defaultMod) || '1'];
      const cleaned = raw.map(cleanMod).filter(m => m && (!Object.keys(modById).length || modById[m]));
      return cleaned.length ? cleaned : [cleanMod(defaultMod) || '1'];
    };

    // 1. JSON format
    if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        const parsed = JSON.parse(trimmed);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        return arr.map((item, idx) => {
          if (!item || typeof item !== 'object') return null;
          const rawId = typeof item.id === 'string' ? item.id.replace(/[^a-z0-9_-]/gi, '') : '';
          const id = rawId || ('cq-' + Date.now() + '-' + idx + '-' + Math.floor(Math.random() * 1000));
          const stem = String(item.stem || item.question || '').trim();
          const rawOpts = item.opts || item.answers || item.options;
          const opts = Array.isArray(rawOpts) ? rawOpts.map(o => String(o == null ? '' : o).trim()).filter(Boolean) : [];
          let keys = [];
          if (Array.isArray(item.keys)) {
            keys = item.keys.map(k => typeof k === 'string' ? 'ABCDEFGH'.indexOf(k.trim().toUpperCase()) : k);
          } else if (typeof item.key === 'number') {
            keys = [item.key];
          } else if (typeof item.key === 'string') {
            const idxL = 'ABCDEFGH'.indexOf(item.key.trim().toUpperCase());
            if (idxL !== -1) keys = [idxL];
          }
          const b = safeBank(item.bank);
          const m = safeMods(item.mods);
          const safeAt = (typeof item.at === 'string' && /^[a-z0-9_-]+$/i.test(item.at))
            ? item.at
            : (modById[m[0]]?.at || 'brzuch');
          const type = opts.length ? 'mcq' : 'open';
          return {
            id,
            at: safeAt,
            type,
            mods: m,
            topic: String(item.topic || ''),
            stem,
            opts,
            keys: type === 'mcq' ? sanitizeKeys(keys, opts.length) : [],
            conf: safeConf(item.conf),
            adapt: !!item.adapt,
            gap: !!item.gap,
            src: String(item.src || (banks[b]?.n || 'Własne')),
            bank: b,
            why: String(item.why || item.explanation || ''),
            tip: String(item.tip || ''),
            zal: String(item.zal || ''),
            akt: String(item.akt || ''),
            ans: String(item.ans || ''),
            isCustom: true
          };
        }).filter(q => q && q.stem && (q.type === 'open' || q.opts.length >= 2));
      } catch (e) {
        /* Fallback to plain-text parser */
      }
    }

    // 2. Plain text format (1. Question ... A. ... B. ... Klucz: B)
    const rawBlocks = trimmed.split(/(?=(?:^|\n)\s*(?:\d+[\.\)]|Pytanie\s*\d+[\.:]?)\s*)/i).filter(b => b.trim());
    const questions = [];

    rawBlocks.forEach((block, bIdx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) return;

      const stemLines = [];
      const opts = [];
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
          const optIdx = 'ABCDEFGH'.indexOf(optMatch[1].toUpperCase());
          if (/\*|\[x\]|\(x\)|\(prawid(?:ł|l)owa\)/i.test(line)) correctKey = optIdx;
          const cleanText = optMatch[2].trim().replace(/\*|\[x\]|\(x\)|\(prawid(?:ł|l)owa\)/gi, '').trim();
          opts[optIdx] = cleanText;
          return;
        }
        if (inWhy) why += (why ? ' ' : '') + line;
        else if (!opts.length) stemLines.push(line.replace(/^\d+[\.\)]\s*/, ''));
      });

      const stem = stemLines.join(' ').trim();
      const compacted = [];
      let mappedKey = -1;
      for (let i = 0; i < opts.length; i++) {
        if (!opts[i]) continue;
        if (i === correctKey) mappedKey = compacted.length;
        compacted.push(opts[i]);
      }

      if (stem && compacted.length >= 2) {
        const b = safeBank(defaultBank);
        const mod = cleanMod(defaultMod) || '1';
        questions.push({
          id: 'cq-' + Date.now() + '-' + bIdx + '-' + Math.floor(Math.random() * 1000),
          at: modById[mod]?.at || 'brzuch',
          type: 'mcq',
          mods: [mod],
          topic: '',
          stem,
          opts: compacted,
          keys: [mappedKey >= 0 ? mappedKey : 0],
          conf: 'src',
          adapt: false,
          gap: false,
          src: src || banks[b]?.n || 'Własne',
          bank: b,
          why,
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

  function parseMarkdown(src) {
    if (!src) return '';
    const codeBlocks = [];
    let s = String(src).replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(`<pre><code class="${lang ? 'lang-' + esc(lang) : ''}">${esc(code.trim())}</code></pre>`);
      return `\n\n@@CODEBLOCK${idx}@@\n\n`;
    });

    s = esc(s);

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

    s = s.replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
         .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
         .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
         .replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    s = s.replace(/^(?:---|\*\*\*|___)$/gm, '<hr>');
    s = s.replace(/^(?:&gt;|>)\s?(.*?)$/gm, '<blockquote>$1</blockquote>');

    s = s.replace(/^[-*]\s+\[x\]\s+(.*?)$/gim, '<li class="task-item checked"><input type="checkbox" checked disabled> <span>$1</span></li>')
         .replace(/^[-*]\s+\[ \]\s+(.*?)$/gim, '<li class="task-item"><input type="checkbox" disabled> <span>$1</span></li>');

    s = s.replace(/^[-*]\s+(.*?)$/gm, '<li class="bullet-item">$1</li>');
    s = s.replace(/^\d+\.\s+(.*?)$/gm, '<li class="num-item">$1</li>');

    s = s.replace(/(?:<li class="task-item[^"]*"[^>]*>.*?<\/li>\s*)+/gs, m => `\n\n<ul class="task-list" style="list-style:none;padding-left:.3rem">\n${m.trim()}\n</ul>\n\n`);
    s = s.replace(/(?:<li class="bullet-item"[^>]*>.*?<\/li>\s*)+/gs, m => `\n\n<ul>\n${m.replace(/class="bullet-item"/g, '').trim()}\n</ul>\n\n`);
    s = s.replace(/(?:<li class="num-item"[^>]*>.*?<\/li>\s*)+/gs, m => `\n\n<ol>\n${m.replace(/class="num-item"/g, '').trim()}\n</ol>\n\n`);

    s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
         .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
         .replace(/__([^_]+)__/g, '<strong>$1</strong>')
         .replace(/\*([^*]+)\*/g, '<em>$1</em>')
         .replace(/_([^_]+)_/g, '<em>$1</em>')
         .replace(/~~([^~]+)~~/g, '<del>$1</del>')
         .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const blocks = s.split(/\n{2,}/).map(b => {
      b = b.trim();
      if (!b) return '';
      if (/^(?:<(h[1-4]|table|ul|ol|pre|blockquote|hr)|@@CODEBLOCK\d+@@$)/i.test(b)) return b;
      return `<p>${b.replace(/\n/g, '<br>')}</p>`;
    });

    let html = blocks.filter(Boolean).join('\n');
    // Restore code blocks last so blank lines inside fences are not split across paragraphs.
    codeBlocks.forEach((codeHtml, idx) => {
      html = html.replace(`@@CODEBLOCK${idx}@@`, () => codeHtml);
    });
    return html;
  }

  function scoreExam(list, userAnswers) {
    let score = 0;
    const byMod = {};
    const wrongQIds = [];
    const safeList = (list || []).filter(Boolean);

    safeList.forEach(q => {
      const userSet = (userAnswers && userAnswers[q.id]) || new Set();
      const keys = q.keys || [];
      const isCorrect = keys.length > 0 && userSet.size === keys.length && keys.every(k => userSet.has(k));
      if (isCorrect) score++;
      else wrongQIds.push(q.id);

      const m = q.pm || (q.mods && q.mods[0]) || '1';
      byMod[m] = byMod[m] || { total: 0, correct: 0 };
      byMod[m].total++;
      if (isCorrect) byMod[m].correct++;
    });

    const total = safeList.length;
    const pctScore = pct(score, total);
    return { score, total, pct: pctScore, passed: pctScore >= 60, byMod, wrongQIds };
  }

  const api = {
    esc, escB, norm, pct, b64EncodeUtf8, b64DecodeUtf8,
    estimateWeightFromAge, getAgeFormulaHint, calcHollidaySegar,
    parseQuestionsInput, parseMarkdown, scoreExam
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.HUB_LOGIC = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
