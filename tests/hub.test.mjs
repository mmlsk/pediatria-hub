import test from 'node:test';
import assert from 'node:assert/strict';
import logic from '../js/logic.js';

const {
  esc, norm, b64EncodeUtf8, b64DecodeUtf8,
  estimateWeightFromAge, getAgeFormulaHint, calcHollidaySegar,
  parseQuestionsInput, diagnoseQuestionsInput, parseBackupCode, parseMarkdown, scoreExam
} = logic;

test('UTF-8 base64 round-trip preserves Polish diacritics and emoji', () => {
  const sample = JSON.stringify({ note: 'Zażółć gęślą jaźń 🩺', arr: [1, 2] });
  assert.deepEqual(JSON.parse(b64DecodeUtf8(b64EncodeUtf8(sample))), JSON.parse(sample));
});

test('parseQuestionsInput remaps answer key when option letters are skipped', () => {
  const text = `
1. Która opcja jest poprawna?
A. Pierwsza
C. Druga (właściwa)
D. Trzecia
Klucz: C
`;
  const [q] = parseQuestionsInput(text, 'zaklad', '1', { banks: { zaklad: { n: 'Zakład' } } });
  assert.deepEqual(q.opts, ['Pierwsza', 'Druga (właściwa)', 'Trzecia']);
  assert.deepEqual(q.keys, [1]);
});

test('parseQuestionsInput sanitizes JSON mods, ids, and out-of-range keys', () => {
  const payload = JSON.stringify([{
    id: '<script>alert(1)</script>',
    stem: 'Pytanie testowe',
    opts: ['Tak', 'Nie'],
    keys: [99, 1],
    mods: ['<img src=x onerror=alert(1)>', '1'],
    bank: 'injected'
  }]);
  const [q] = parseQuestionsInput(payload, 'custom', '1', {
    banks: { custom: { n: 'Własne' } },
    modById: { '1': { at: 'brzuch' } }
  });
  assert.ok(!q.id.includes('<'));
  assert.deepEqual(q.mods, ['1']);
  assert.deepEqual(q.keys, [1]);
  assert.equal(q.bank, 'custom');
  assert.equal(esc('<a&"b">'), '&lt;a&amp;&quot;b&quot;&gt;');
  assert.equal(norm('Żółć'), 'zolc');
});

test('parseMarkdown preserves blank lines inside fenced code blocks and escapes HTML', () => {
  const md = [
    '# Nagłówek <script>x</script>',
    '',
    '```js',
    'const a = 1;',
    '',
    'const b = 2;',
    '```',
    '',
    'Paragraf z **pogrubieniem**.'
  ].join('\n');
  const html = parseMarkdown(md);
  assert.ok(!html.includes('<script>'));
  assert.match(html, /<pre><code class="lang-js">const a = 1;\n\nconst b = 2;<\/code><\/pre>/);
  assert.ok(!html.includes('<pre><code class="lang-js">const a = 1;</p>'));
});

test('estimateWeightFromAge and getAgeFormulaHint always agree across edge inputs', () => {
  for (const [val, unit] of [[0, 'm'], [6, 'm'], [24, 'm'], [0, 'y'], [1, 'y'], [5, 'y'], [12, 'y'], [18, 'y']]) {
    const w = estimateWeightFromAge(val, unit);
    const hint = getAgeFormulaHint(val, unit);
    assert.ok(hint.endsWith(`${w.toFixed(1)} kg`), `Mismatch for ${val}${unit}: w=${w}, hint=${hint}`);
  }
});

test('calcHollidaySegar computes tiered maintenance volumes accurately', () => {
  assert.equal(calcHollidaySegar(8).dailyMl, 800);
  assert.equal(calcHollidaySegar(15).dailyMl, 1250);
  assert.equal(calcHollidaySegar(25).dailyMl, 1600);
  assert.equal(calcHollidaySegar(100).dailyMl, 2700);
});

test('scoreExam handles multi-key answers, unanswered items, and 60% pass mark', () => {
  const list = [
    { id: 'q1', keys: [0], pm: '1' },
    { id: 'q2', keys: [1, 2], pm: '1' },
    { id: 'q3', keys: [0], pm: '2' },
    { id: 'q4', keys: [3], pm: '2' },
    { id: 'q5', keys: [0], pm: '5' }
  ];
  const ans = {
    q1: new Set([0]),
    q2: new Set([1, 2]),
    q3: new Set([0]),
    q4: new Set([1])
  };
  const res = scoreExam(list, ans);
  assert.equal(res.score, 3);
  assert.equal(res.total, 5);
  assert.equal(res.pct, 60);
  assert.equal(res.passed, true);
  assert.deepEqual(res.wrongQIds, ['q4', 'q5']);
});

test('diagnoseQuestionsInput reports empty input, invalid JSON, missing fields, and missing options', () => {
  assert.match(diagnoseQuestionsInput('   '), /Wklej/i);
  assert.match(diagnoseQuestionsInput('[{"stem": "x"'), /składnia JSON/i);
  assert.match(diagnoseQuestionsInput('[{"opts": ["A", "B"]}]'), /stem|question/);
  assert.match(diagnoseQuestionsInput('1. Brak opcji tutaj'), /co najmniej 2 wariantów/i);
  assert.match(diagnoseQuestionsInput('A. Opcja 1\nB. Opcja 2'), /brakuje treści pytania/i);
});

test('parseBackupCode distinguishes empty, bad base64, bad JSON, wrong schema, and restores valid backup', () => {
  const defaults = { visited: {}, last: null, done: {}, ans: {}, bm: {}, examHistory: [], patientCases: {}, osceCases: {} };
  assert.match(parseBackupCode('', defaults).error, /Wklej kod/i);
  assert.match(parseBackupCode('!!!nie-base64!!!', defaults).error, /Base64/i);
  assert.match(parseBackupCode(b64EncodeUtf8('{nie-json'), defaults).error, /JSON/i);
  assert.match(parseBackupCode(b64EncodeUtf8('{"foo":1}'), defaults).error, /Pediatria Hub/i);

  const valid = b64EncodeUtf8(JSON.stringify({ visited: { brzuch: 1 }, last: 'brzuch', examHistory: [{ pct: 80 }] }));
  const res = parseBackupCode(`  ${valid.slice(0, 12)}\n${valid.slice(12)}  `, defaults);
  assert.equal(res.ok, true);
  assert.deepEqual(res.state.visited, { brzuch: 1 });
  assert.equal(res.state.last, 'brzuch');
  assert.equal(res.state.examHistory.length, 1);
  assert.deepEqual(res.state.done, {});
});
