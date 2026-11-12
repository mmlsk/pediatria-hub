const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';
function bars(id,rows,unit='%'){
  const el=$('#'+id);if(!el)return;const mx=Math.max(...rows.map(r=>r.w??r.v));
  el.innerHTML=rows.map(r=>`<div class="bar"><span>${r.l}</span><div><i class="${r.c||''}" style="width:${Math.max(3,(r.w??r.v)/mx*100)}%"></i></div><em>${r.t??r.v+unit}</em></div>`).join('');
}
function flow(id,nodes){
  $('#'+id).innerHTML=nodes.map((n,i)=>{
    let h;
    if(n.br){h=`<div class="branch">${n.br.map(col=>`<div>${col.map(x=>`<div class="fn ${x[0]}">${x[1]}</div>`).join('')}</div>`).join('')}</div>`}
    else h=`<div class="fn ${n[0]}">${n[1]}</div>`;
    return (i?'<div class="ar">▼</div>':'')+h}).join('');
}
bars('barsFreq',FREQ,'');

/* ===== PAT ===== */
const PAT={
 a:{c:'#6E4CB0',t:'🧒 Wygląd (Appearance)',d:'Odzwierciedla perfuzję i oksygenację mózgu, stan metaboliczny i neurologiczny. Nieprawidłowy wygląd to wczesny, niespecyficzny sygnał ciężkiego stanu: niedotlenienie, hipoperfuzja, hipoglikemia, zatrucie, neuroinfekcja.',
   b:'Bez dotykania dziecka: czy patrzy na rodzica, reaguje, daje się ukoić, płacze głośno?'},
 b:{c:'#2B63AE',t:'🫁 Praca oddychania (Work of breathing)',d:'Ocenia wysiłek oddechowy, nie samą liczbę oddechów. Szukaj: nietypowej pozycji (trójnoga), stridoru, świstów słyszalnych bez stetoskopu, stękania, rozszerzania skrzydełek nosa, retrakcji. Z seminarium zakładu: stękanie, rozszerzanie skrzydełek nosa i „cicha klatka” są objawami alarmowymi.',
   b:'Dodatkowo liczba oddechów wg wieku: <1 r.ż. 30–40; 2–5 lat 20–30; 5–12 lat 15–20; >12 lat 12–16 na minutę.'},
 c:{c:'#C23B2A',t:'🫀 Krążenie skóry (Circulation to skin)',d:'Bladość, marmurkowatość, sinica, wydłużony CRT (powyżej 2 s) wskazują na centralizację krążenia. Hipotensja pojawia się późno, więc jej brak nie wyklucza wstrząsu.',
   b:'Uzupełnij: tętno wg wieku (<1 r.ż. 110–160; 2–5 lat 95–140; 5–12 lat 80–120; >12 lat 60–100), diureza ≥1 ml/kg/h (niemowlęta ≥2).'}};
function showPat(k){
  const p=PAT[k];$('#triPanel').innerHTML=`<h3 style="color:${p.c}">${p.t}</h3><p style="margin:.5rem 0">${p.d}</p><p class="small">${p.b}</p>`;
  $$('#triSvg g.v').forEach(g=>g.classList.toggle('on',g.dataset.k===k));
  $('#ticls').innerHTML=k==='a'?[['T','Tonus'],['I','Interaktywność'],['C','Ukojenie (consolability)'],['L','Wzrok (look/gaze)'],['S','Głos / płacz (speech/cry)']].map(x=>`<div><b>${x[0]}</b>${x[1]}</div>`).join(''):'';
}
$$('#triSvg g.v').forEach(g=>{g.onclick=()=>showPat(g.dataset.k);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showPat(g.dataset.k)}}});
showPat('a');
const OK='<span class="sev g">prawidłowy</span>',NO='<span class="sev r">nieprawidłowy</span>';
$('#patTable').innerHTML=`<thead><tr><th>Wygląd</th><th>Oddychanie</th><th>Skóra</th><th>Interpretacja</th><th>Pilność</th></tr></thead><tbody>
<tr><td>${NO}</td><td>${OK}</td><td>${OK}</td><td>Zaburzenie OUN lub metaboliczne (hipoglikemia, drgawki, uraz głowy, zatrucie)</td><td><span class="sev a">wysoka</span></td></tr>
<tr><td>${OK}</td><td>${NO}</td><td>${OK}</td><td>Dystres oddechowy</td><td><span class="sev a">wysoka</span></td></tr>
<tr><td>${NO}</td><td>${NO}</td><td>${OK}</td><td>Niewydolność oddechowa</td><td><span class="sev r">natychmiast</span></td></tr>
<tr><td>${OK}</td><td>${OK}</td><td>${NO}</td><td>Wstrząs wyrównany</td><td><span class="sev a">wysoka</span></td></tr>
<tr><td>${NO}</td><td>${OK}</td><td>${NO}</td><td>Wstrząs niewyrównany</td><td><span class="sev r">natychmiast</span></td></tr>
<tr class="hl"><td>${NO}</td><td>${NO}</td><td>${NO}</td><td>Niewydolność krążeniowo-oddechowa (stan przedzatrzymaniowy)</td><td><span class="sev r">RKO w pogotowiu</span></td></tr></tbody>`;

flow('abcde',[
 ['start','<b>ABCDE</b> po każdej interwencji ocena ponowna'],
 ['blue','<b>A · Drożność</b><small>stridor, ślinotok, ciało obce, pozycja szyi, uraz</small>'],
 ['blue','<b>B · Oddychanie</b><small>RR, SpO₂, praca oddychania, osłuchiwanie; stękanie, cicha klatka</small>'],
 ['red','<b>C · Krążenie</b><small>HR, CRT >2 s, tętno, ciśnienie tętnicze, diureza, hepatomegalia</small>'],
 ['violet','<b>D · Zaburzenia świadomości</b><small>AVPU/GCS, źrenice, glikemia, drgawki</small>'],
 ['amber','<b>E · Ekspozycja</b><small>temperatura, wysypka i wybroczyny, uraz, masa ciała</small>']]);
$('#ten').innerHTML=[
 ['','<b>Monitor i tlen</b> SpO₂, HR, RR, ciśnienie; tlen wysokoprzepływowy'],
 ['b','<b>Dostęp i.v./i.o.</b> glikemia, gazometria, morfologia, posiew, jonogram'],
 ['g','<b>Bolusy płynów</b> 10–20 ml/kg 0,9% NaCl z reewaluacją po każdym'],
 ['a','<b>Antybiotyk</b> po pobraniu posiewów, bez zwlekania przy podejrzeniu sepsy'],
 ['v','<b>Lecz przyczynę</b> adrenalina i.m., odtrutka, glukoza, benzodiazepina, odbarczenie'],
 ['','<b>Eskalacja</b> wezwij zespół resuscytacyjny, konsultacja OIT']].map(x=>`<div class="step ${x[0]}"><div>${x[1]}</div></div>`).join('');

/* ===== normy ===== */
const AG=[{l:'<1 r.ż.',hr:[110,160],rr:[30,40]},{l:'2–5 lat',hr:[95,140],rr:[20,30]},{l:'5–12 lat',hr:[80,120],rr:[15,20]},{l:'>12 lat',hr:[60,100],rr:[12,16]}];
(function(){
 const s=$('#normSvg');let h='';const X0=110,W=420;
 const draw=(title,key,max,y0,col)=>{
  h+=`<text x="10" y="${y0-14}" font-size="13" font-weight="800" fill="${col}">${title}</text>`;
  [0,0.25,0.5,0.75,1].forEach(f=>{const x=X0+f*W;h+=`<line x1="${x}" y1="${y0-6}" x2="${x}" y2="${y0+4*30}" stroke="#E2E8E6"/><text x="${x}" y="${y0+4*30+14}" font-size="10" fill="#6B7A82" text-anchor="middle">${Math.round(f*max)}</text>`});
  AG.forEach((g,i)=>{const y=y0+i*30,a=g[key][0]/max*W,b=g[key][1]/max*W;
   h+=`<text x="${X0-8}" y="${y+14}" font-size="12" text-anchor="end" fill="#44545D" font-weight="700">${g.l}</text><rect x="${X0+a}" y="${y}" width="${b-a}" height="20" rx="8" fill="${col}" opacity=".9"/><text x="${X0+b+6}" y="${y+14}" font-size="11" font-weight="800" fill="#13232C">${g[key][0]}–${g[key][1]}</text>`});
 };
 draw('Tętno / min','hr',180,28,'#C23B2A');draw('Oddechy / min','rr',50,210,'#2B63AE');
 s.innerHTML=h;
})();
function normFor(a){
 let g=a<1?AG[0]:a<2?null:a<5?AG[1]:a<=12?AG[2]:AG[3];
 const hyp=a<1?'<70 mmHg':a<=10?`<${70+2*a} mmHg`:'<90 mmHg';
 return {g,hyp};
}
function renderNorm(){
 const a=+$('#age').value;$('#ageOut').textContent=a;const n=normFor(a);
 $('#normOut').innerHTML=`<tbody><tr><td><b>Tętno</b></td><td>${n.g?n.g.hr.join('–')+' /min':'brak zakresu w slajdzie (1–2 lat)'}</td></tr><tr><td><b>Oddechy</b></td><td>${n.g?n.g.rr.join('–')+' /min':'brak zakresu w slajdzie (1–2 lat)'}</td></tr><tr><td><b>Hipotensja (SBP)</b></td><td>${n.hyp}</td></tr><tr><td><b>Diureza</b></td><td>${a<1?'≥2 ml/kg/h':'≥1 ml/kg/h'}</td></tr></tbody>`;
}
$('#age').oninput=renderNorm;renderNorm();

/* ===== dawki ===== */
const f=(n,d=1)=>{const v=Math.round(n*Math.pow(10,d))/Math.pow(10,d);return v>=10000?v.toLocaleString('pl-PL'):String(v).replace('.',',')};
const cap=(v,m)=>Math.min(v,m);
const SEM='Seminarium zakładu',WYK='Wykład zakładu',ERC='ERC 2025 PLS',ISP='ISPAD 2022';
const DOSES=[
 ['Anafilaksja'],
 ['Adrenalina i.m. (1 mg/ml)',w=>`${f(cap(w*.01,.5),2)} mg = ${f(cap(w*.01,.5),2)} ml<small>0,01 mg/kg, maks. 0,5 mg; co 5–10 min</small>`,SEM+'; EAACI 2021; ERC First Aid 2025'],
 ['Klemastyna',w=>`${f(cap(w*.05,2),2)} mg<small>0,05 mg/kg, maks. 2 mg</small>`,SEM],
 ['Hydrokortyzon',w=>`${f(cap(w*5,300),0)} mg<small>5 mg/kg, maks. 300 mg</small>`,SEM],
 ['Salbutamol',w=>`${f(w*.1,2)}–${f(w*.15,2)} mg<small>0,1–0,15 mg/kg</small>`,SEM],
 ['Wstrząs / płyny'],
 ['Bolus 0,9% NaCl',w=>`${f(w*10,0)}–${f(w*20,0)} ml<small>10–20 ml/kg, reewaluacja po każdym</small>`,SEM],
 ['Zapotrzebowanie dobowe',w=>{const v=Math.min(w,10)*100+Math.max(0,Math.min(w,20)-10)*50+Math.max(0,w-20)*20;return `${f(v,0)} ml/dobę<small>100 ml/kg (do 10 kg) + 50 ml/kg (10–20 kg) + 20 ml/kg (>20 kg)</small>`},WYK],
 ['Penicylina (angina, przypadek 1)',w=>`${f(w*100000,0)} j.m./dobę<small>100 000 j.m./kg/dobę, 10 dni</small>`,SEM],
 ['Zatrzymanie krążenia'],
 ['Adrenalina i.v./i.o.',w=>`${f(cap(w*10,1000),0)} µg<small>10 µg/kg, maks. 1 mg; co 3–5 min</small>`,ERC],
 ['Amiodaron (po 3. wyładowaniu)',w=>`${f(cap(w*5,300),0)} mg<small>5 mg/kg, maks. 300 mg</small>`,ERC],
 ['Drgawki'],
 ['Midazolam bukalnie / i.n. / i.m.',w=>`${f(cap(w*.2,10),1)}–${f(cap(w*.3,10),1)} mg<small>0,2–0,3 mg/kg, maks. 10 mg</small>`,'PMC9491331; Children’s Colorado'],
 ['Lorazepam i.v.',w=>`${f(cap(w*.1,4),1)} mg<small>0,1 mg/kg, maks. 4 mg</small>`,'PMC9491331; Children’s Colorado'],
 ['Diazepam (starszy wykład)',w=>`i.v. ${f(w*.25,1)}–${f(w*.4,1)} mg · PR ${f(w*.4,1)} mg<small>0,25–0,4 mg/kg i.v.; 0,4 mg/kg doodbytniczo</small>`,WYK+' (dawkowanie starsze)'],
 ['Lewetyracetam (II rząd)',w=>`${f(cap(w*40,4500),0)}–${f(cap(w*60,4500),0)} mg<small>40–60 mg/kg, maks. 4500 mg</small>`,'PMC9491331'],
 ['Fenytoina (II rząd)',w=>`${f(w*20,0)} mg<small>20 mg/kg</small>`,'PMC9491331'],
 ['Waproinian (II rząd)',w=>`${f(w*40,0)} mg<small>40 mg/kg</small>`,'PMC9491331'],
 ['ICP, DKA, krup'],
 ['Mannitol (ICP, wykład)',w=>`${f(w*.25,1)}–${f(w*.5,1)} g<small>0,25–0,5 g/kg</small>`,WYK],
 ['Mannitol (obrzęk mózgu w DKA)',w=>`${f(w*.5,1)}–${f(w,1)} g<small>0,5–1 g/kg w 10–15 min</small>`,ISP],
 ['3% NaCl (obrzęk mózgu w DKA)',w=>`${f(w*2.5,0)}–${f(w*5,0)} ml<small>2,5–5 ml/kg</small>`,ISP],
 ['Insulina we wlewie (DKA)',w=>`${f(w*.05,2)}–${f(w*.1,2)} j./h<small>0,05–0,1 j./kg/h, ≥1 h po rozpoczęciu płynów, bez bolusa</small>`,ISP],
 ['Deksametazon (krup)',w=>`${f(w*.15,1)}–${f(w*.6,1)} mg p.o.<small>0,15–0,6 mg/kg</small>`,SEM],
 ['Zatrucie paracetamolem'],
 ['Acetylocysteina (schemat australijski)',w=>`${f(w*200,0)} mg w 4 h, potem ${f(w*100,0)} mg w 16 h<small>200 mg/kg + 100 mg/kg; w PL wg protokołu lokalnego</small>`,'RCH Melbourne; NSW ACI']
];
function renderDose(){
 const w=+$('#wt').value;$('#wOut').textContent=w;$('#wtNum').value=w;
 $('#doseTable').innerHTML=`<thead><tr><th>Lek / postępowanie</th><th>Dla ${w} kg</th><th>Źródło</th></tr></thead><tbody>`+DOSES.map(d=>d.length===1?`<tr class="grp"><td colspan="3">${d[0]}</td></tr>`:`<tr><td>${d[0]}</td><td>${d[1](w)}</td><td class="small">${d[2]}</td></tr>`).join('')+'</tbody>';
}
$('#wt').oninput=renderDose;
$('#wtNum').onchange=e=>{let v=Math.max(3,Math.min(80,+e.target.value||20));$('#wt').value=v;renderDose()};
renderDose();

/* ===== układ oddechowy ===== */
flow('respTree',[
 ['start','Dziecko z dusznością: PAT → ABCDE'],
 {br:[
  [['blue','<b>Drogi górne</b><small>stridor wdechowy, chrypka</small>'],['amber','<b>Krup</b><small>szczekający kaszel, dniami</small>'],['red','<b>Zapalenie nagłośni</b><small>godziny, ślinotok, nie pije</small>'],['violet','<b>Ciało obce</b><small>nagły początek, zadławienie</small>']],
  [['blue','<b>Drogi dolne</b><small>świsty, rzężenia, retrakcje</small>'],['green','<b>Zapalenie oskrzelików</b><small>niemowlę, katar, świsty</small>'],['amber','<b>Astma</b><small>świsty wydechowe; cicha klatka = alarm</small>'],['red','<b>Odma prężna</b><small>nagła duszność, osłabiony szmer</small>']]]}]);
flow('fbTree',[
 ['start','Podejrzenie zadławienia'],
 ['blue','<b>Kaszel skuteczny?</b>'],
 {br:[[['green','<b>Tak</b><small>zachęcaj do kaszlu, obserwuj, nie klep po plecach</small>']],[['amber','<b>Nie, przytomne</b><small>5 uderzeń w plecy, potem 5 uciśnięć: niemowlę – klatka; >1 r.ż. – nadbrzusze</small>'],['red','<b>Nieprzytomne</b><small>otwórz usta, 5 oddechów, RKO 15:2, wzywaj pomoc</small>']]]},
 ['violet','<b>Klucz puli:</b> przytomne, sine, oddycha własnym wysiłkiem → tlen']]);
$('#respTable').innerHTML=`<thead><tr><th>Stan</th><th>Początek</th><th>Kluczowe objawy</th><th>Postępowanie</th></tr></thead><tbody>
<tr><td>Krup</td><td>dni, nasilenie w nocy</td><td>szczekający kaszel, chrypka, stridor wdechowy; dziecko pije</td><td>deksametazon p.o. lub budezonid; adrenalina wziewnie, tlen</td></tr>
<tr><td>Zapalenie nagłośni (Hib)</td><td>godziny</td><td>gorączka >38,5°C, ślinotok, nie pije, cichy stridor, pozycja wymuszona</td><td>nie badać gardła; OIT, zestaw do intubacji, posiew, cefalosporyna i.v.</td></tr>
<tr><td>Ciało obce</td><td>nagły</td><td>zadławienie, kaszel, świsty, jednostronne zmiany w osłuchiwaniu i na RTG</td><td>algorytm FBAO; bronchoskopia</td></tr>
<tr><td>Zapalenie oskrzelików</td><td>dni, po katarze</td><td>świsty, rzężenia, wysiłek oddechowy, trudności w karmieniu</td><td>leczenie wspomagające; rybawiryna niezalecana</td></tr>
<tr><td>Astma</td><td>godziny</td><td>świsty wydechowe, wydłużony wydech; cicha klatka i zaburzenia świadomości w ciężkim napadzie</td><td>tlen, SABA, GKS; zagrażający życiu: adrenalina i.m., teofilina, ipratropium (zakład)</td></tr>
<tr><td>Odma opłucnowa</td><td>nagły</td><td>duszność, ból, osłabiony szmer; prężna: wstrząs</td><td>prężna: odbarczenie bez czekania na RTG; najczęściej po zapaleniu płuc gronkowcowym (pula)</td></tr></tbody>`;

/* ===== wstrząs ===== */
$('#shockTypes').innerHTML=[
 ['b','💧','Hipowolemiczny','biegunka, krwotok, DKA, oparzenie','Bolusy 10–20 ml/kg, przyczynowo.'],
 ['r','🦠','Dystrybucyjny','sepsa, anafilaksja, neurogenny','Sepsa: płyny + antybiotyk. Anafilaksja: adrenalina i.m.'],
 ['v','💔','Kardiogenny','kardiomiopatia, zapalenie mięśnia sercowego, wady','Hepatomegalia, rzężenia; płyny ostrożnie.'],
 ['a','🫁','Obturacyjny','odma prężna, tamponada, zatorowość','Odbarczenie lub leczenie przyczyny.']
].map(x=>`<div class="tcard ${x[0]}"><h4><span class="em">${x[1]}</span> ${x[2]}</h4><p class="small"><b>Przyczyny:</b> ${x[3]}</p><p class="small" style="margin-top:.4rem"><b>Postępowanie:</b> ${x[4]}</p></div>`).join('');
$('#dehyTable').innerHTML=`<thead><tr><th>Ubytek masy</th><th>Stopień</th><th>Objawy (standard kliniczny, [3])</th><th>Postępowanie</th></tr></thead><tbody>
<tr><td><b>&lt;5%</b></td><td><span class="sev g">lekkie</span></td><td>pragnienie, prawidłowe parametry życiowe</td><td>ORS</td></tr>
<tr><td><b>5–10%</b></td><td><span class="sev a">umiarkowane</span></td><td>suche błony śluzowe, zapadnięte ciemiączko, tachykardia, skąpomocz</td><td>ORS lub nawodnienie i.v.</td></tr>
<tr><td><b>&gt;10%</b></td><td><span class="sev r">ciężkie</span></td><td>wstrząs, CRT &gt;2 s, zaburzenia świadomości</td><td>bolus i.v./i.o. 10–20 ml/kg</td></tr></tbody>`;
(function(){
 let h=`<text x="10" y="24" font-size="13" font-weight="800" fill="#13232C">Ubytek masy ciała</text>`;
 [[10,150,'#2F8450','<5%','😐 lekkie'],[160,170,'#B8730F','5–10%','😟 umiarkowane'],[330,180,'#C23B2A','>10%','😵 ciężkie']].forEach(([x,w,c,t,l])=>{
  h+=`<rect x="${x}" y="40" width="${w}" height="46" rx="10" fill="${c}"/><text x="${x+w/2}" y="69" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">${t}</text><text x="${x+w/2}" y="108" font-size="12" font-weight="700" fill="${c}" text-anchor="middle">${l}</text>`});
 h+=`<text x="10" y="150" font-size="13" font-weight="800" fill="#13232C">Zapotrzebowanie dobowe (wykład zakładu)</text>`;
 [['1–10 kg','100 ml/kg','#2B63AE'],['10–20 kg','50 ml/kg','#6E4CB0'],['>20 kg','20 ml/kg','#0C7A85']].forEach(([a,b,c],i)=>{const x=10+i*170;
  h+=`<rect x="${x}" y="162" width="160" height="44" rx="10" fill="${c}" opacity=".12" stroke="${c}" stroke-width="2"/><text x="${x+80}" y="180" font-size="12" font-weight="700" text-anchor="middle" fill="${c}">${a}</text><text x="${x+80}" y="198" font-size="14" font-weight="800" text-anchor="middle" fill="#13232C">${b}</text>`});
 $('#dehySvg').innerHTML=h;
})();

/* ===== Phoenix ===== */
const MAPG=[['<1 mies.',17,30],['1–11 mies.',25,38],['1–<2 lat',31,43],['2–<5 lat',32,44],['5–<12 lat',36,48],['12–17 lat',38,51]];
function buildPhx(){
 $('#phx').innerHTML=`
 <label class="inline"><input type="checkbox" id="px_inf"> Podejrzenie lub potwierdzenie zakażenia</label>
 <fieldset><legend>Układ oddechowy (0–3)</legend>
  <label><input type="radio" name="px_r" value="0" checked> 0 · bez wsparcia oddechowego lub SpO₂/FiO₂ ≥292</label>
  <label><input type="radio" name="px_r" value="1"> 1 · SpO₂/FiO₂ &lt;292 przy tlenoterapii lub NIV</label>
  <label><input type="radio" name="px_r" value="2"> 2 · SpO₂/FiO₂ &lt;220, wentylacja inwazyjna</label>
  <label><input type="radio" name="px_r" value="3"> 3 · SpO₂/FiO₂ &lt;148, wentylacja inwazyjna</label></fieldset>
 <fieldset><legend>Układ krążenia (0–6)</legend>
  <div class="in calc" style="display:flex;gap:1rem;flex-wrap:wrap">
   <label>Leki wazoaktywne<select id="px_v"><option value="0">0</option><option value="1">1 lek</option><option value="2">≥2 leki</option></select></label>
   <label>Mleczany (mmol/l)<input type="number" id="px_l" step="0.1" min="0" value="1"></label>
   <label>Wiek<select id="px_a">${MAPG.map((g,i)=>`<option value="${i}" ${i==3?'selected':''}>${g[0]}</option>`).join('')}</select></label>
   <label>MAP (mmHg)<input type="number" id="px_m" min="10" max="150" value="60"></label></div>
  <p class="small" id="px_mapinfo" style="margin-top:.4rem"></p></fieldset>
 <fieldset><legend>Krzepnięcie (0–2; maks. 2 pkt)</legend>
  <label><input type="checkbox" class="px_c"> PLT &lt;100 tys./µl</label>
  <label><input type="checkbox" class="px_c"> INR &gt;1,3</label>
  <label><input type="checkbox" class="px_c"> D-dimery &gt;2 mg/l FEU</label>
  <label><input type="checkbox" class="px_c"> Fibrynogen &lt;100 mg/dl</label></fieldset>
 <fieldset><legend>Neurologiczny (0–2)</legend>
  <label><input type="radio" name="px_n" value="0" checked> 0 · GCS &gt;10, źrenice reagują</label>
  <label><input type="radio" name="px_n" value="1"> 1 · GCS ≤10</label>
  <label><input type="radio" name="px_n" value="2"> 2 · obustronnie nieruchome źrenice</label></fieldset>`;
 $$('#phx input,#phx select').forEach(e=>e.addEventListener('input',calcPhx));
 calcPhx();
}
function calcPhx(){
 const g=MAPG[+$('#px_a').value],m=+$('#px_m').value,lac=+$('#px_l').value;
 const rP=+($('input[name=px_r]:checked')||{value:0}).value;
 const vP=+$('#px_v').value,lP=lac>=11?2:lac>=5?1:0,mP=m<g[1]?2:m<=g[2]?1:0,cv=vP+lP+mP;
 const co=Math.min(2,$$('.px_c').filter(x=>x.checked).length),ne=+($('input[name=px_n]:checked')||{value:0}).value;
 $('#px_mapinfo').innerHTML=`Progi MAP dla ${g[0]}: 1 pkt przy ${g[1]}–${g[2]} mmHg, 2 pkt przy &lt;${g[1]} mmHg.`;
 const tot=rP+cv+co+ne,inf=$('#px_inf').checked;
 const sepsis=inf&&tot>=2,shock=sepsis&&cv>=1;
 $('#phxRes').innerHTML=`<div style="opacity:.8;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em">Phoenix Sepsis Score</div><b>${tot}</b> <span style="opacity:.8">/ 13</span>
 <div style="margin-top:.6rem;font-size:.9rem">Oddechowy ${rP} · Krążenie ${cv} · Krzepnięcie ${co} · Neurologiczny ${ne}</div>
 <div style="margin-top:.7rem;font-weight:800;font-size:1.05rem;color:${shock?'#FFB3A7':sepsis?'#F7D58A':'#9FE0B5'}">${!inf?'Zaznacz zakażenie, aby ocenić sepsę':shock?'Wstrząs septyczny (sepsa + ≥1 pkt krążenia)':sepsis?'Sepsa (PSS ≥2)':'PSS &lt;2: nie spełnia kryteriów sepsy'}</div>`;
}
buildPhx();
$('#phxCase').onclick=()=>{buildPhx();$('#px_inf').checked=true;$('#px_a').value=3;$('#px_m').value=53;$('#px_l').value=2.8;const c=$$('.px_c');c[0].checked=true;c[3].checked=true;calcPhx()};
$('#phxReset').onclick=buildPhx;

/* ===== anafilaksja ===== */
flow('anaFlow',[
 ['start','Podejrzenie anafilaksji'],
 ['red','<b>Usuń alergen, ułóż, wezwij pomoc</b><small>ABCDE, unieś nogi; przy duszności pozycja półsiedząca</small>'],
 ['red','<b>Adrenalina i.m. 0,01 mg/kg</b><small>maks. 0,5 mg, udo przednio-boczne, powtarzaj co 5–10 min</small>'],
 ['blue','<b>Tlen, dostęp i.v./i.o., bolus 10–20 ml/kg</b><small>ocena po każdym bolusie</small>'],
 ['amber','<b>Leki dodatkowe</b><small>salbutamol, klemastyna, hydrokortyzon: nie zastępują adrenaliny</small>'],
 ['green','<b>Obserwacja 4–24 h, autowstrzykiwacz, plan postępowania</b>']]);

/* ===== drgawki SVG ===== */
(function(){
 const steps=[
  ['0–5 min','#2B63AE','ABC, tlen',['glikemia przy łóżku','dostęp i.v./i.o.','czas napadu']],
  ['≥5 min','#C23B2A','1. benzodiazepina',['midazolam','i.m. / i.n. / bukalnie','lub lorazepam i.v.']],
  ['~10 min','#B8730F','2. dawka',['powtórz benzodiazepinę','maks. 2 dawki łącznie','']],
  ['~20 min','#6E4CB0','II rząd',['lewetyracetam','fenytoina','lub waproinian']],
  ['>40 min','#13232C','III rząd, OIT',['tiopental','lub wlew','midazolamu']]];
 let h='';const w=146,g=12;
 h+=`<line x1="20" y1="40" x2="780" y2="40" stroke="#9AA7AD" stroke-width="3"/>`;
 steps.forEach((s,i)=>{const x=10+i*(w+g);
  h+=`<circle cx="${x+w/2}" cy="40" r="10" fill="${s[1]}"/><text x="${x+w/2}" y="20" text-anchor="middle" font-size="13" font-weight="800" fill="${s[1]}">${s[0]}</text>
  <rect x="${x}" y="70" width="${w}" height="150" rx="14" fill="#fff" stroke="${s[1]}" stroke-width="2.5"/>
  <rect x="${x}" y="70" width="${w}" height="38" rx="14" fill="${s[1]}"/><rect x="${x}" y="94" width="${w}" height="14" fill="${s[1]}"/>
  <text x="${x+w/2}" y="94" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${s[2]}</text>`;
  s[3].forEach((t,j)=>h+=`<text x="${x+w/2}" y="${140+j*24}" text-anchor="middle" font-size="12" fill="${j==0?'#13232C':'#44545D'}">${t}</text>`)});
 h+=`<text x="10" y="242" font-size="11" fill="#6B7A82">Starszy wykład zakładu: diazepam 0,25–0,4 mg/kg i.v. lub 0,4 mg/kg PR, fenytoina 18 mg/kg (patrz kalkulator i tabela Klucz vs wytyczne).</text>`;
 $('#szSvg').innerHTML=h;
})();

/* ===== DKA ===== */
flow('dkaFlow',[
 ['start','Podejrzenie DKA: wymioty, polidypsja, oddech Kussmauła, zaburzenia świadomości'],
 ['blue','<b>Potwierdź</b><small>glikemia, ketony, gazometria; jonogram i K⁺</small>'],
 ['red','<b>ABCDE, monitor, dostęp</b><small>wstrząs? bolus 10 (–20) ml/kg 0,9% NaCl</small>'],
 ['amber','<b>Nawadnianie ostrożne</b><small>unikaj nadmiaru płynów (obrzęk mózgu)</small>'],
 ['green','<b>Insulina we wlewie 0,05–0,1 j./kg/h</b><small>≥1 h po rozpoczęciu płynów, bez bolusa</small>'],
 ['violet','<b>Monitoruj neurologicznie</b><small>ból głowy, bradykardia, spadek świadomości → mannitol lub 3% NaCl</small>']]);

/* ===== zatrucia ===== */
$('#toxTable').innerHTML=`<thead><tr><th>Środek / toksydrom</th><th>Wskazówki kliniczne</th><th>Odtrutka / leczenie</th><th>Źródło</th></tr></thead><tbody>
<tr><td>Opioidy</td><td>miosis, depresja oddechowa i OUN, zahamowana perystaltyka</td><td><b>nalokson</b></td><td>wykład; A17 #35</td></tr>
<tr><td>Benzodiazepiny</td><td>sedacja, depresja oddechowa</td><td><b>flumazenil</b> po zapewnieniu wentylacji</td><td>wykład; S2/S3 #23</td></tr>
<tr><td>Atropina / trójcykliczne</td><td>mydriasis (wykład)</td><td>leczenie wspomagające; w wykładzie mydriasis wskazuje na atropinę lub TCA</td><td>wykład</td></tr>
<tr><td>Organofosforany</td><td>miosis, cholinergiczne</td><td><b>atropina + pralidoksym</b></td><td>wykład</td></tr>
<tr><td>Paracetamol</td><td>okres bezobjawowy, potem hepatotoksyczność</td><td><b>N-acetylocysteina</b></td><td>wykład; RCH; A17</td></tr>
<tr><td>Tlenek węgla</td><td>—</td><td><b>tlen</b></td><td>wykład</td></tr>
<tr><td>Żelazo</td><td>—</td><td><b>deferoksamina</b></td><td>wykład</td></tr>
<tr><td>Digoksyna</td><td>—</td><td><b>fragmenty Fab</b></td><td>wykład</td></tr>
<tr><td>β-blokery</td><td>—</td><td><b>glukagon</b></td><td>wykład</td></tr>
<tr><td>Metanol, glikol etylenowy</td><td>—</td><td><b>etanol</b> (wykład); fomepizol w nowszych standardach</td><td>wykład</td></tr></tbody>`;
(function(){
 const X=h=>40+h/24*700;
 let s=`<line x1="40" y1="110" x2="740" y2="110" stroke="#9AA7AD" stroke-width="4"/>`;
 [[0,'0 h'],[1,'1 h'],[2,'2 h'],[4,'4 h'],[8,'8 h'],[24,'24 h']].forEach(([h,l])=>s+=`<circle cx="${X(h)}" cy="110" r="7" fill="#13232C"/><text x="${X(h)}" y="136" font-size="12" font-weight="800" text-anchor="middle" fill="#13232C">${l}</text>`);
 s+=`<rect x="${X(0)}" y="84" width="${X(1)-X(0)}" height="12" rx="5" fill="#2B63AE"/><rect x="${X(1)}" y="84" width="${X(2)-X(1)}" height="12" rx="5" fill="#6E4CB0"/><rect x="${X(4)}" y="84" width="${X(24)-X(4)}" height="12" rx="5" fill="#C23B2A" opacity=".35"/>`;
 const box=(x,y,w,t,sub,c)=>`<rect x="${x}" y="${y}" width="${w}" height="72" rx="12" fill="#fff" stroke="${c}" stroke-width="2.5"/><text x="${x+w/2}" y="${y+24}" font-size="13" font-weight="800" text-anchor="middle" fill="${c}">${t}</text>`+sub.map((u,i)=>`<text x="${x+w/2}" y="${y+44+i*16}" font-size="11.5" text-anchor="middle" fill="#44545D">${u}</text>`).join('');
 s+=box(10,6,200,'Płukanie żołądka',['tylko w 1. godzinie','(klucz A17)'],'#2B63AE');
 s+=box(225,6,215,'Węgiel aktywny do 2 h',['dawka >200 mg/kg','lub >10 g'],'#6E4CB0');
 s+=box(455,6,310,'N-acetylocysteina (NAC)',['200 mg/kg w 4 h, potem 100 mg/kg w 16 h','schemat australijski'],'#2F8450');
 s+=box(10,150,240,'Zgłoszenie po 8 h lub brak wyniku',['zacznij NAC bez czekania na wynik'],'#B8730F');
 s+=box(300,150,280,'Stężenie paracetamolu ≥4 h',['nomogram Rumack–Matthew','oraz AlAT, INR'],'#C23B2A');
 s+=`<text x="10" y="242" font-size="11" fill="#6B7A82">Klucz puli: aminotransferazy i INR. Aktualnie klinicznie: stężenie paracetamolu ≥4 h po ingestii.</text>`;
 $('#paraSvg').innerHTML=s;
})();

/* ===== NZK ===== */
flow('pblsFlow',[
 ['start','Dziecko nie reaguje, nie oddycha prawidłowo'],
 ['blue','<b>Wezwij pomoc, udrożnij drogi</b><small>5 oddechów ratunkowych</small>'],
 ['red','<b>Brak oznak życia → uciśnięcia 15:2</b><small>30:2 gdy ratownik nieprzeszkolony; głębokość ~1/3 klatki</small>'],
 ['amber','<b>Defibrylator / monitor: ocena rytmu</b>'],
 {br:[[['red','<b>Defibrylacyjny</b><small>wyładowanie; adrenalina + amiodaron po 3. wyładowaniu</small>']],[['blue','<b>Niedefibrylacyjny</b><small>adrenalina jak najszybciej, co 3–5 min</small>']]]},
 ['violet','<b>Szukaj odwracalnych przyczyn: 4H i 4T</b>']]);

/* ===== cross-module graph ===== */
(function(){
 const s=$('#crossSvg'),cx=340,cy=250;
 const N=[['[1]','Ból brzucha','wgłobienie, DKA, zatrucie'],['[2]','Zakażenia','sepsa, meningokoki'],['[3]','Biegunki','odwodnienie, hiponatremia'],['[4]','Zesp. nerczycowy','zakrzepica, zatorowość'],['[9]','Guzy mózgu','ICP, wgłobienie'],['[11]','Hemato-onko','asparaginaza, TLS'],['[12]+[15]','HUS','AKI, małopłytkowość']];
 const col=['#B8730F','#C23B2A','#2F8450','#2B63AE','#6E4CB0','#0C7A85','#B8730F'];
 let h='';const pos=N.map((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length;return [cx+245*Math.cos(a),cy+195*Math.sin(a)]});
 pos.forEach(p=>h+=`<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#9AA7AD" stroke-width="2"/>`);
 h+=`<circle cx="${cx}" cy="${cy}" r="56" fill="#C23B2A"/><text x="${cx}" y="${cy}" text-anchor="middle" fill="#fff" font-size="26" font-weight="800">[5]</text><text x="${cx}" y="${cy+20}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">Stany nagłe</text>`;
 N.forEach((n,i)=>{const [x,y]=pos[i],w=190,hh=58;
  h+=`<rect x="${x-w/2}" y="${y-hh/2}" width="${w}" height="${hh}" rx="12" fill="#fff" stroke="${col[i]}" stroke-width="2.2"/><text x="${x}" y="${y-6}" text-anchor="middle" font-size="13.5" font-weight="800" fill="${col[i]}">${n[0]} ${n[1]}</text><text x="${x}" y="${y+14}" text-anchor="middle" font-size="11" fill="#44545D">${n[2]}</text>`});
 s.innerHTML=h;
})();
$('#traps').innerHTML=[
 ['[3]','Biegunka + drgawki: hiponatremia (płyny hipotoniczne). Wstrząs hipowolemiczny: bolus, nie ORS.'],
 ['[2]','Gorączka + wybroczyny + wstrząs: sepsa meningokokowa; antybiotyk nie czeka na punkcję lędźwiową.'],
 ['[9]','Poranne wymioty i triada Cushinga: wzrost ICP; głowa do 30°, bez LP.'],
 ['[11]','L-asparaginaza w ALL: anafilaksja podczas wlewu; adrenalina i.m.'],
 ['[4]','Nerczyca: stan nadkrzepliwości; asymetryczny obrzęk kończyny z dusznością to zatorowość.'],
 ['[12]+[15]','Krwista biegunka, Hb 8, PLT 70, skąpomocz: HUS = [1]+[3]+[12]+[15].']
].map(x=>`<div class="callout"><b class="k">${x[0]}</b>${x[1]}</div>`).join('');

/* ===== klucz vs wytyczne ===== */
$('#gapTable').innerHTML=`<thead><tr><th>Temat</th><th>Pod zaliczenie (wg puli/zakładu)</th><th>Aktualnie klinicznie (wg wytycznych)</th></tr></thead><tbody>`+GAP.map(g=>`<tr><td><b>${g[0]}</b></td><td>${g[1]}</td><td>${g[2]}</td></tr>`).join('')+'</tbody>';

/* ===== źródła ===== */
$('#srcList').innerHTML=SOURCES.map(s=>/^https?:/.test(s[1])?`<li><a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a></li>`:`<li>${s[0]} (${s[1]})</li>`).join('');

/* ===== quiz ===== */
(function(){ /* stała (deterministyczna) permutacja opcji, aby klucz nie był zawsze na początku */
 Q.forEach(q=>{let seed=q.n*7919+13;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};
  const idx=q.o.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
  q.o=idx.map(i=>q.o[i]);q.k=idx.indexOf(q.k)});
})();
let filter='all',list=Q.slice(),st={};
const CONF={src:['src','KLUCZ POTWIERDZONY'],inf:['inf','KLUCZ WNIOSKOWANY'],unk:['unk','KLUCZ NIEPEWNY']};
$('#qFilters').innerHTML=[['all','Wszystkie']].concat(Object.keys(TOPICS).map(k=>[k,TOPICS[k]])).concat([['gap','Klucz vs wytyczne'],['unk','Klucz niepewny']]).map((x,i)=>`<button aria-pressed="${i==0}" data-f="${x[0]}">${x[1]}</button>`).join('');
function match(q,f){return f==='all'||q.t===f||(f==='gap'&&q.gap)||(f==='unk'&&q.c==='unk')}
function bar(){const a=Object.values(st);$('#score').textContent=`Wynik: ${a.filter(x=>x.ok).length} / ${a.length}`}
function renderQ(){
  $('#quiz').innerHTML=list.map(q=>{
   const L='ABCDEF';const done=st[q.n];const c=CONF[q.c];
   return `<article class="q" id="q${q.n}"><header><span class="n">Zad. ${q.n}</span><span class="mod">[5]</span><span class="tbadge">${TOPICS[q.t]}</span><span class="kb ${c[0]}">${c[1]}</span>${q.own?'<span class="tbadge">zadanie autorskie</span>':''}${q.adapt?'<span class="tbadge" title="Treść pytania lub opcji uzupełniona/uproszczona">✎ opcje uzupełnione</span>':''}<span class="src">${q.s}</span></header>
   <div class="stem">${q.stem}</div>
   <div class="opts" role="group">${q.o.map((o,i)=>{
     let cl='opt';if(done){if(i===q.k)cl+=' key ok';else if(i===done.sel)cl+=' bad'}
     return `<button class="${cl}" data-q="${q.n}" data-i="${i}" ${done?'disabled':''}><span class="l">${L[i]}</span><span>${o}</span></button>`}).join('')}</div>
   <div class="disc" ${done?'':'hidden'}>
     <div class="callout ${done&&done.ok?'green':'red'}"><b class="k">${done&&done.ok?'Poprawnie':'Błędnie'} · prawidłowa odpowiedź: ${L[q.k]}</b>${q.why}</div>
     ${q.tip?`<div class="callout blue"><b class="k">Wskazówka testowa</b>${q.tip}</div>`:''}
     ${q.gap?`<div class="cmp"><div class="a"><b class="k">Pod zaliczenie (wg puli/zakładu)</b>${q.gap.pool}</div><div class="b"><b class="k">Aktualnie klinicznie (wg wytycznych)</b>${q.gap.now}</div></div>`:''}
   </div></article>`}).join('')||'<p>Brak zadań w tym filtrze.</p>';
  bar();
}
$('#quiz').addEventListener('click',e=>{
  const b=e.target.closest('.opt');if(!b)return;
  const q=Q.find(x=>x.n==b.dataset.q),i=+b.dataset.i;if(st[q.n])return;
  st[q.n]={sel:i,ok:i===q.k};const y=window.scrollY;renderQ();window.scrollTo(0,y);
});
function setFilter(f){filter=f;list=Q.filter(q=>match(q,f));$$('#qFilters button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===f));renderQ()}
$$('#qFilters button').forEach(b=>b.onclick=()=>setFilter(b.dataset.f));
$('#rand10').onclick=()=>{const p=Q.filter(q=>match(q,filter));for(let i=p.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]]}
  list=p.slice(0,10);st={};renderQ();$('#qFilters').scrollIntoView({behavior:'smooth',block:'start'})};
$('#resetQ').onclick=()=>{st={};setFilter(filter)};
renderQ();
bars('barsPool',Object.keys(TOPICS).map((k,i)=>({l:TOPICS[k],v:Q.filter(q=>q.t===k).length,c:['b','r','a','v','g','r','a','']  [i]})),'');

/* nav highlight */
const links=$$('#navlist a'),secs=links.map(a=>$(a.getAttribute('href')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s&&io.observe(s));
