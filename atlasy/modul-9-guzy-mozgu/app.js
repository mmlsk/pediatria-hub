const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function bars(id,rows,unit='%'){
  const el=$('#'+id);if(!el)return;const mx=Math.max(...rows.map(r=>r.w??r.v));
  el.innerHTML=rows.map(r=>`<div class="bar"><span>${r.l}</span><div><i class="${r.c||''}" style="width:${Math.max(3,(r.w??r.v)/mx*100)}%"></i></div><em>${r.t??r.v+unit}</em></div>`).join('');
}
bars('barsLoc',[
 {l:'Móżdżek (podnamiotowo)',v:45,c:'r'},{l:'Półkule (nadnamiotowo)',v:24,c:'b'},{l:'Okolica siodłowa',v:16,c:'a'},{l:'Pień mózgu',v:15,c:'r'},{l:'Rdzeń kręgowy',v:12,c:'v'}]);
bars('barsHist',[
 {l:'Rdzeniak',v:25,c:'r'},{l:'Astrocytoma móżdżku',v:18,c:'r'},{l:'Czaszkogardlak',v:9,c:'a'},{l:'Astrocytoma półkul',v:6,c:'b'},
 {l:'Wyściółczak półkul',v:5,c:'b'},{l:'GBM półkul',v:5,c:'b'},{l:'Astrocytoma pnia',v:5,c:'r'},{l:'Wyściółczak pnia',v:5,c:'r'},
 {l:'Oponiak',v:4,c:'g'},{l:'Gruczolak przysadki',v:3,c:'a'},{l:'GBM pnia',v:3,c:'r'},{l:'Glejak nerwu wzrokowego',v:2,c:'a'}]);
bars('barsMB',[
 {l:'WNT',v:90,t:'>90%',c:'g'},{l:'SHH',v:80,c:'b'},{l:'Grupa 4',v:70,c:'a'},{l:'Grupa 3',v:55,t:'50–60%',c:'r'}]);
bars('barsOut',[
 {l:'<3 r.ż., niskie ryzyko: EFS 3-l.',v:55,c:'g'},{l:'<3 r.ż., niskie ryzyko: OS',v:87,t:'84–90%',c:'g'},
 {l:'<3 r.ż., wysokie ryzyko: EFS 3-l.',v:12,c:'r'},{l:'<3 r.ż., wysokie ryzyko: OS',v:31,c:'r'},
 {l:'Rdzeniak, ryzyko standardowe (5-l.)',v:70,c:'b'},{l:'Rdzeniak, ryzyko wysokie (5-l.)',v:55,t:'50–60%',c:'b'},
 {l:'Guzy zarodkowe: EFS 3-l.',v:80,t:'~80%',c:'a'},{l:'Łagodne glejaki po CTH: 3-l.',v:66,t:'~66%',c:'v'},
 {l:'Guzy pnia: przeżycie 2-l.',v:10,t:'<10%',c:'r'}],'%');

$('#mbTable').innerHTML=`<thead><tr><th>Podgrupa</th><th>Cecha</th><th>5-l. PFS</th></tr></thead><tbody>
<tr><td><b>WNT</b></td><td>mutacja CTNNB1; najlepsze rokowanie, często pozostawia się mniej intensywne leczenie w badaniach</td><td>&gt;90%</td></tr>
<tr><td><b>SHH</b></td><td>szlak Sonic Hedgehog (PTCH1, SUFU, TP53); niemowlęta i młodzież, ryzyko zależy od TP53</td><td>~80%</td></tr>
<tr><td><b>Grupa 3</b></td><td>amplifikacja MYC, częsty rozsiew po PMR; najgorsze rokowanie</td><td>50–60%</td></tr>
<tr><td><b>Grupa 4</b></td><td>najczęstsza podgrupa, izochromosom 17q; w G4 18 Gy CSI dawało gorsze EFS niż 23,4 Gy</td><td>~70%</td></tr></tbody>`;
$('#resTable').innerHTML=`<thead><tr><th>Stopień</th><th>Opis</th><th>Skala</th></tr></thead><tbody>
<tr><td>Całkowita</td><td>brak widocznej resztki</td><td>R1 / S1</td></tr>
<tr><td>Prawie całkowita</td><td>resztka &lt;1,5 cm</td><td>R1/2 / S2</td></tr>
<tr><td>Częściowa</td><td>resztka &gt;1,5 cm</td><td>R3 / S3</td></tr>
<tr><td>Biopsja</td><td>tylko materiał diagnostyczny</td><td>R4 / S4</td></tr></tbody>`;
$('#gapTable').innerHTML=`<thead><tr><th>Temat</th><th>Pod zaliczenie (wg puli/zakładu)</th><th>Aktualnie klinicznie (wg wytycznych)</th></tr></thead><tbody>
<tr><td><b>Klasyfikacja</b></td><td>Układ histologiczny: PNET, DIPG, rdzeniak, wyściółczak</td><td>WHO CNS5 integruje histologię z biologią molekularną; rdzeniak w czterech podgrupach (WNT, SHH, G3, G4); DIPG to „diffuse midline glioma, H3 K27-altered” (stopień 4)</td></tr>
<tr><td><b>Rozlany guz pnia</b></td><td>Rokowanie bardzo złe; przeżycie 2-letnie &lt;10%</td><td>Nadal bardzo złe; dordaviprone: przyspieszona rejestracja FDA (6.08.2025) w DMG z H3 K27M po wcześniejszym leczeniu, wiek ≥1 r.ż.</td></tr>
<tr><td><b>Glejaki niskiego stopnia</b></td><td>Leczeniem jest operacja; chemioterapia uzupełniająca; RTH ostrożnie</td><td>Dabrafenib + trametynib przy BRAF V600E (FDA 16.03.2023, wiek ≥1 r.ż.); tovorafenib w nawrocie lub oporności z zaburzeniem BRAF (FDA 23.04.2024, wiek ≥6 mies.)</td></tr>
<tr><td><b>Bariera krew-mózg</b></td><td>Wykład: bez większego znaczenia dla cytostatyków w guzach OUN</td><td>Uproszczenie; bariera w obrębie guza bywa uszkodzona, na obwodzie zachowana. Na zaliczeniu obowiązuje klucz wykładu</td></tr>
<tr><td><b>Diagnostyka obrazowa</b></td><td>TK, MRI, poliaminy w PMR, trepanobiopsja szpiku, scyntygrafia kości, TK brzucha</td><td>MRI mózgu i całego rdzenia (przed operacją), MRI pooperacyjne 24–72 h, cytologia PMR ≥14 dni po operacji; brak rutynowej oceny układowej</td></tr>
<tr><td><b>Punkcja lędźwiowa</b></td><td>Przeciwwskazana przy ICP; wykład podkreśla MRI</td><td>Przeciwwskazana w ostrym wodogłowiu (SIOP PODC); cytologia dopiero po operacji</td></tr>
<tr><td><b>Ograniczenia wiekowe RTH</b></td><td>Brak limitu wiekowego w wykładzie; wyniki podane dla grupy &lt;3 r.ż.</td><td>Poniżej 3 lat RTH całego OUN omija się lub odracza (w części protokołów do 4–5 lat); u starszych 23,4 Gy CSI + do 54 Gy na tylny dół w ryzyku standardowym (PDQ)</td></tr>
<tr><td><b>Dawki leków</b></td><td colspan="2">Brak w plikach zakładu. Dawek cytostatyków nie podaję; ustala je protokół leczenia ośrodka onkologicznego</td></tr></tbody>`;

/* tumor cards */
const TUM=[
 {c:'r',e:'🧠',t:'Rdzeniak (medulloblastoma, IV°)',u:['najczęstszy złośliwy guz mózgu dziecka, ok. 25%','tylny dół: robak móżdżku, IV komora; wodogłowie','rozsiew po PMR: MRI rdzenia, cytologia, RTH całego OUN','podgrupy WNT, SHH, G3, G4'],p:'Wzrost naciekający, nie da się całkowicie wyciąć (wykład).'},
 {c:'g',e:'🟢',t:'Astrocytoma pilocytarny (I°)',u:['najczęstszy guz OUN dziecka','móżdżek (torbiel z guzkiem ściennym), nerw wzrokowy, pień','niski stopień, brak rozsiewu po PMR','radykalna resekcja często leczy'],p:'Jedyny pewny „nierozsiewający się” w teście. BRAF V600E lub fuzja BRAF: terapia celowana.'},
 {c:'v',e:'🔷',t:'Wyściółczak (ependymoma)',u:['60% w tylnym dole, z IV komory','postać anaplastyczna rozsiewa się po PMR, także do kości','przerzuty do kości w wykładzie'],p:'Objawy ICP wcześnie przez wodogłowie.'},
 {c:'r',e:'⚠️',t:'DMG (dawniej DIPG)',u:['pień mózgu, porażenia nerwów czaszkowych, objawy długich dróg','WHO CNS5: diffuse midline glioma, H3 K27-altered','przeżycie 2-letnie poniżej 10% (wykład)'],p:'ICP późno, bo guz rośnie w miąższu pnia.'},
 {c:'a',e:'🎯',t:'Czaszkogardlak',u:['okolica siodłowa, ok. 9% guzów mózgu','hemianopsja dwuskroniowa, zahamowanie wzrastania, moczówka prosta','guz łagodny histologicznie, nie rozsiewa się po PMR'],p:'Kojarz z hemianopsją dwuskroniową (A17 #13).'},
 {c:'b',e:'🥚',t:'Guzy z komórek rozrodczych',u:['szyszynka i okolica nadsiodłowa','AFP i β-hCG w surowicy i PMR','chemio- i radioterapia, EFS 3-l. około 80% (wykład)','germinoma rozsiewa się po PMR (podręczniki)'],p:'Parinaud, moczówka prosta; zawsze markery.'},
 {c:'a',e:'👁️',t:'Glejak nerwu wzrokowego / NF1',u:['2% guzów mózgu wg wykładu','związek z NF1 (plamy café-au-lait)','ubytki widzenia, wytrzeszcz'],p:'Skojarz: NF1 → glejak nerwu II.'},
 {c:'g',e:'🌿',t:'Stwardnienie guzowate i SEGA',u:['napady, angiofibroma, plamy odbarwione','SEGA przy otworze Monro daje wodogłowie','guz łagodny, leczenie operacyjne lub celowane'],p:'Pytanie D #11 (klucz potwierdzony).'}
];
$('#tumorCards').innerHTML=TUM.map(x=>`<div class="tcard ${x.c}"><h4><span class="em">${x.e}</span> ${x.t}</h4><ul>${x.u.map(u=>`<li>${u}</li>`).join('')}</ul><p class="small" style="margin-top:.5rem"><b>Perełka:</b> ${x.p}</p></div>`).join('');

/* cross-module graph */
(function(){
 const s=$('#crossSvg'),W=680,H=480,cx=340,cy=240;
 const N=[
  ['[10]','Nowotwory lite','opsoklonus-mioklonia, Wilms',-1],
  ['[11]','Hemato-onko','OUN w ALL, ucisk rdzenia',-1],
  ['[5]','Stany nagłe','wgłobienie, ICP, drgawki',-1],
  ['[4]','Zesp. nerczycowy','pseudotumor po GKS',-1],
  ['[6]','Choroba wrzodowa','wymioty: TK/MRI głowy',-1],
  ['','Endokrynologia','moczówka, rhGH',-1],
  ['','NF1 i TSC','glejak n. II, SEGA',-1]];
 const R=190,rx=250;let h=`<defs></defs>`;
 const pos=N.map((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length;return [cx+rx*Math.cos(a)*0.98,cy+R*Math.sin(a)*1.08]});
 pos.forEach(p=>h+=`<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#9AA7AD" stroke-width="2"/>`);
 h+=`<circle cx="${cx}" cy="${cy}" r="52" fill="#0C7A85"/><text x="${cx}" y="${cy-2}" text-anchor="middle" fill="#fff" font-size="26" font-weight="800">[9]</text><text x="${cx}" y="${cy+20}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">Guzy mózgu</text>`;
 const col=['#2B63AE','#C23B2A','#B8730F','#2F8450','#6E4CB0','#0C7A85','#B8730F'];
 N.forEach((n,i)=>{const [x,y]=pos[i],w=186,hh=60;
  h+=`<rect x="${x-w/2}" y="${y-hh/2}" width="${w}" height="${hh}" rx="12" fill="#fff" stroke="${col[i]}" stroke-width="2.2"/>
  <text x="${x}" y="${y-8}" text-anchor="middle" font-size="13.5" font-weight="800" fill="${col[i]}">${(n[0]+' '+n[1]).trim()}</text>
  <text x="${x}" y="${y+12}" text-anchor="middle" font-size="11" fill="#44545D">${n[2]}</text>`;});
 s.innerHTML=h;
})();
$('#traps').innerHTML=[
 ['[10]','Oczopląs i ruchy gałek ocznych u małego dziecka bez ICP: opsoklonus-mioklonia, czyli neuroblastoma, a nie guz mózgu. Aniridia i hemihipertrofia: nefroblastoma. Leukokoria: siatkówczak; trilateral retinoblastoma dotyczy szyszynki.'],
 ['[11]','Ból pleców, osłabienie nóg, skolioza: proces wypierający w kanale kręgowym. U dziecka z ALL objawy ICP i porażenia nn. czaszkowych sugerują nawrót w OUN. Moczówka prosta: także LCH.'],
 ['[5]','Wgłobienie, bradykardia z nadciśnieniem, drgawki: stan nagły. LP przed obrazowaniem jest błędem, głowa podniesiona do ok. 30°.'],
 ['[4]','Rzekomy guz mózgu po odstawieniu glikokortykosteroidów w zespole nerczycowym lub w trakcie rhGH.'],
 ['[6]','Poranne wymioty bez efektu IPP u nastolatka: obrazowanie głowy, nie kolejna endoskopia.']
].map(x=>`<div class="callout"><b class="k">${x[0]}</b>${x[1]}</div>`).join('');

/* ===== quiz ===== */
let filter='all',list=Q.slice(),st={}; // st[n]={sel,ok}
const CONF={src:['src','KLUCZ POTWIERDZONY'],inf:['inf','KLUCZ WNIOSKOWANY'],unk:['unk','KLUCZ NIEPEWNY']};
function match(q,f){return f==='all'||q.t===f||(f==='gap'&&q.gap)||(f==='unk'&&q.c==='unk')}
function bar(){const a=Object.values(st);$('#score').textContent=`Wynik: ${a.filter(x=>x.ok).length} / ${a.length}`}
function renderQ(){
  $('#quiz').innerHTML=list.map(q=>{
   const L='ABCDEF';const done=st[q.n];const c=CONF[q.c];
   return `<article class="q" id="q${q.n}"><header><span class="n">Zad. ${q.n}</span><span class="mod">[9]</span><span class="tbadge">${TOPICS[q.t]}</span><span class="kb ${c[0]}">${c[1]}</span>${q.own?'<span class="tbadge">zadanie autorskie</span>':''}${q.adapt?'<span class="tbadge" title="Treść pytania lub opcji uzupełniona/uproszczona">✎ opcje uzupełnione</span>':''}<span class="src">${q.s}</span></header>
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
  st[q.n]={sel:i,ok:i===q.k};renderQ();
});
function setFilter(f){filter=f;list=Q.filter(q=>match(q,f));$$('#qFilters button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===f));renderQ()}
$$('#qFilters button').forEach(b=>b.onclick=()=>setFilter(b.dataset.f));
$('#rand10').onclick=()=>{const p=Q.filter(q=>match(q,filter));for(let i=p.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]]}
  list=p.slice(0,10);st={};renderQ();$('#qFilters').scrollIntoView({behavior:'smooth',block:'start'})};
$('#resetQ').onclick=()=>{st={};setFilter(filter)};
renderQ();
bars('barsPool',Object.keys(TOPICS).map((k,i)=>({l:TOPICS[k],v:Q.filter(q=>q.t===k).length,c:['b','r','a','g','v','']  [i]})),'');

/* nav highlight */
const links=$$('#navlist a'),secs=links.map(a=>$(a.getAttribute('href')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s&&io.observe(s));
