(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';
const A=(u,t)=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`;
const C={red:'#C23B2A',blue:'#2B63AE',green:'#2F8450',violet:'#6E4CB0',amber:'#B8730F',teal:'#0C7A85',ink:'#13232C'};

/* ---------- Hero SVG: schemat narząd -> guz ---------- */
(function(){
 const rows=[
  ['Oko','siatkówczak','<2–5 r.ż.',C.green],
  ['Nadnercze, zwoje','neuroblastoma','szczyt 2 r.ż.',C.blue],
  ['Nerka','guz Wilmsa','szczyt 3–4 r.ż.',C.red],
  ['Wątroba','hepatoblastoma','<3 r.ż.',C.amber],
  ['Tkanki miękkie','rabdomiosarcoma','2–6 i 15–19 r.ż.',C.violet],
  ['Kość','kostniakomięsak, Ewing','10–20 r.ż.',C.violet],
  ['Gonady, krzyżowo-guziczna','guzy zarodkowe','niemowlę / nastolatek',C.amber]
 ];
 let s='';
 rows.forEach((r,i)=>{const y=14+i*44;
  s+=`<rect x="8" y="${y}" width="364" height="38" rx="10" fill="#fff" stroke="${r[3]}" stroke-width="2"/>
  <rect x="8" y="${y}" width="10" height="38" rx="4" fill="${r[3]}"/>
  <text x="30" y="${y+16}" font-size="11" fill="#6B7A82" font-weight="700">${r[0]}</text>
  <text x="30" y="${y+31}" font-size="14" fill="#13232C" font-weight="800">${r[1]}</text>
  <text x="362" y="${y+24}" text-anchor="end" font-size="11.5" fill="${r[3]}" font-weight="800">${r[2]}</text>`;});
 $('#heroSvg').innerHTML=s;
})();

/* ---------- Epidemiologia ---------- */
$('#stat').innerHTML=[
 ['1234','zachorowań u osób 0–19 lat w Polsce w 2023 r.'],
 ['782','z nich w grupie 0–14 lat'],
 ['1 : 6000','dzieci w populacji wieku rozwojowego (wykład)'],
 ['4 : 3','chłopcy do dziewcząt (wykład)']
].map(x=>`<div class="card"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');
const EPI=[['Białaczki',35.4,44.0,0],['Guzy mózgu',29.8,29.6,0],['Chłoniaki',21.2,15.2,0],['Mięsaki',10.6,9.1,1],['Ukł. współczulny (NB)',9.3,11.2,1],['Guzy nerek',7.4,8.8,1],['Guzy zarodkowe',6.3,4.5,1],['Guzy kości',6.0,5.5,1],['Nabłonkowe',2.7,4.1,1],['Guzy wątroby',1.3,1.5,1]];
$('#epiBars').innerHTML=EPI.map(r=>`<div class="bar" style="grid-template-columns:minmax(120px,170px) 1fr 70px"><span>${r[0]}</span><div><i style="width:${r[1]/36*100}%;${r[3]?'':'background:linear-gradient(90deg,#8FA1A8,#B5C0C3)'}"></i><i style="width:${r[2]/36*100}%;height:6px;margin-top:3px;background:#E0A88F;opacity:.9"></i></div><span class="small"><b>${r[1]}</b> / ${r[2]}</span></div>`).join('')+`<p class="small" style="margin-top:.4rem">Gruby słupek (kolor): Polska; cienki: Europa. Wartość: Polska / Europa. Szare: nowotwory nielite.</p>`;
$('#epiPts').innerHTML=[
 `Najczęstsze nowotwory u dzieci: białaczki, guzy OUN, chłoniaki (notatki z seminarium). W Polsce w 2023 r. białaczki to 35%, chłoniaki 13% zachorowań w grupie 0–14 lat (${A('https://onkologia.org.pl/pliki/pl/publikacje/536346/0_krn-2023-book-2024-02-13-pass.pdf','Krajowy Rejestr Nowotworów, raport 2023')}).`,
 `Neuroblastoma to około 7% nowotworów wieku dziecięcego w Polsce, nowotwory wątroby około 6%, OUN 15–17% (${A('https://onkologia.org.pl/pliki/pl/publikacje/296411/0.nowotwory-krn-2025-book-20260123.pdf','KRN 2021')}).`,
 'Guz Wilmsa: 9–10% nowotworów dziecięcych, szczyt 3–4 r.ż. (wykład zakładu).',
 'Przebieg często podstępny, skąpoobjawowy lub bezobjawowy: dlatego liczy się wywiad i dokładne badanie.',
 'Wiek niemowlęcy: neuroblastoma jest najczęstszym guzem litym niemowląt i najczęstszym złośliwym nowotworem okresu noworodkowego (pula).',
 'Rejestr: ~105–130 nowych zachorowań na 1 mln dzieci poniżej 17 r.ż. rocznie (wykład).'
].map(x=>`<li>${x}</li>`).join('');

/* ---------- Mapa ciała ---------- */
const REG=[
 {id:1,x:150,y:56,t:'Oko i oczodół',p:[['siatkówczak','g'],['neuroblastoma (Horner, wytrzeszcz)','b'],['RMS oczodołu','v'],['LCH','a']],
  d:'Leukokoria (biała źrenica, brak czerwonego odblasku), zez u niemowlęcia → siatkówczak. Anizokoria i opadanie powieki (zespół Hornera) przy guzie szyi lub szczytu klatki → neuroblastoma. Wytrzeszcz + wylewy okularowe (raccoon eyes) → przerzuty neuroblastoma do kości oczodołu. Wytrzeszcz, zez, porażenie gałki → RMS oczodołu. Wytrzeszcz + wielomocz + zmiany osteolityczne → LCH.',
  f:'Badanie czerwonego odblasku, okulista z badaniem dna oka w znieczuleniu, USG oka, MR oczodołów i mózgu; przy wytrzeszczu i wylewach: USG brzucha, VMA/HVA, MIBG.'},
 {id:2,x:160,y:104,t:'Szyja, nosogardło, ucho',p:[['RMS głowy i szyi','v'],['neuroblastoma szyjne','b'],['chłoniaki [11]','r']],
  d:'RMS: guz tkanek miękkich szyi, chrypka, zaburzenia połykania; nosogardło: mowa nosowa, trudności w oddychaniu, krwawienie z nosa; ucho środkowe: przewlekły wyciek ropno-krwisty, polip w przewodzie, porażenie n. VII; zatoki: obrzęk i ból. Neuroblastoma szyjne: guz, zespół Hornera, dysfagia. Jednostronnie powiększony, niebolesny migdałek + węzły szyjne → chłoniak (Burkitt) [11].',
  f:'Badanie laryngologiczne, MR/TK głowy i szyi, przy RMS okołoopony: PMR i MR mózgu; biopsja (nie aspiracyjna), trepanobiopsja szpiku.'},
 {id:3,x:160,y:150,t:'Śródpiersie',p:[['neuroblastoma (tylne)','b'],['chłoniaki (przednie) [11]','r'],['guz zarodkowy (7%)','a']],
  d:'Tylne śródpiersie: neuroblastoma/zwojak zarodkowy współczulny (górna część klatki: duszność, infekcje płuc, dysfagia, zespół żyły głównej górnej, Horner; dolna: najczęściej bezobjawowo). Przednie: chłoniaki, guzy zarodkowe (ból w klatce, kaszel, duszność). Dobrze rokuje neuroblastoma w śródpiersiu tylnym.',
  f:'RTG klatki przed jakąkolwiek sedacją, TK/MR; VMA/HVA, NSE (tylne); LDH, AFP, β-hCG (przednie).'},
 {id:4,x:121,y:205,t:'Wątroba',p:[['hepatoblastoma','a'],['rak wątrobowokomórkowy','a']],
  d:'Guz w jamie brzusznej, wzdęcie, brak łaknienia, spadek masy ciała, ból brzucha, wymioty, żółtaczka, gorączka. Predysponują m.in. BWS, hemihipertrofia, FAP, tyrozynemia, glikogenoza typu I (von Gierke), niedobór α1-antytrypsyny, WZW B/C.',
  f:'AFP (ok. 90% przy hepatoblastoma), β-hCG, CEA wg wykładu, próby wątrobowe, koagulogram, HBV/HCV; TK/MR wątroby, TK klatki, scyntygrafia kośćca, trepanobiopsja szpiku.'},
 {id:5,x:200,y:245,t:'Nerka',p:[['guz Wilmsa','r']],
  d:'Powiększenie obwodu brzucha (najczęstszy objaw), niebolesny guz zwykle nieprzekraczający linii środkowej, ból brzucha, krwinkomocz lub krwiomocz, nawracające ZUM, nadciśnienie, zaburzenia pasażu. Wybrzuszenie okolicy lędźwiowej. Brak zwapnień (zwapnienia sugerują neuroblastoma).',
  f:'USG jamy brzusznej → TK/MR brzucha + TK klatki (przerzuty do płuc). Ciśnienie tętnicze, mocz, kreatynina. BEZ biopsji w typowym przypadku. Nie uciskać guza.'},
 {id:6,x:160,y:222,t:'Zaotrzewnowo, nadnercze',p:[['neuroblastoma','b'],['zarodkowy (4%)','a'],['RMS zaotrzewnowy','v']],
  d:'Neuroblastoma: najczęściej przestrzeń zaotrzewnowa (nadnercze lub zwoje przykręgowe). Guz często przekracza linię środkową, bywają zwapnienia. Objawy: powiększenie obwodu brzucha, brak łaknienia, wymioty, ból, senność, drażliwość, pocenie, nadciśnienie. Przerzuty w momencie rozpoznania u 60–75%.',
  f:'USG → MR/TK, VMA/HVA w moczu, NSE, ferrytyna, LDH, scyntygrafia MIBG, trepanobiopsja szpiku, histologia z oceną MYCN.'},
 {id:7,x:268,y:176,t:'Kręgosłup i rdzeń (plecy)',p:[['neuroblastoma „hantlowaty”','b'],['guz rdzenia [9]','r'],['Ewing','v']],
  d:'Okolica przykręgosłupowa: zlokalizowany ból pleców, utykanie, osłabienie kończyn dolnych, skolioza, zaburzenia funkcji pęcherza i zwieracza. Neuroblastoma wnika do kanału kręgowego i daje niedowład wiotki. Guz rdzenia: ból nasilający się w pozycji leżącej i przy Valsalvie (dziecko zasypia siedząc), opór przy skłonach, skolioza.',
  f:'MR całego kręgosłupa pilnie (ryzyko trwałego deficytu), USG brzucha i RTG klatki (szukaj guza pierwotnego), VMA/HVA.'},
 {id:8,x:266,y:312,t:'Okolica krzyżowo-guziczna, przedkrzyżowa',p:[['guz zarodkowy (42%)','a'],['neuroblastoma miednicy','b'],['RMS','v']],
  d:'Guz zarodkowy okolicy krzyżowo-guziczej: guz pośladków, ból brzucha, zatrzymanie moczu, zaburzenia oddawania stolca, osłabienie kończyn dolnych. Miednica (neuroblastoma, RMS): zaparcia, zastój moczu, masa przedkrzyżowa wyczuwalna per rectum.',
  f:'Badanie per rectum, AFP, β-hCG, USG/MR/TK miednicy.'},
 {id:9,x:160,y:322,t:'Pęcherz, pochwa, prostata',p:[['RMS (botryoid)','v']],
  d:'Pochwa/macica: krwawienie, masy groniaste w pochwie lub ujściu szyjki. Pęcherz: krwiomocz, nawracające ZUM, objawy ucisku. Cewka i prostata: zaburzenia mikcji, zaparcia lub nietrzymanie stolca.',
  f:'Wziernik/waginoskopia, cystoskopia, MR/TK miednicy, TK klatki, scyntygrafia kośćca, trepanobiopsja szpiku, biopsja guza.'},
 {id:10,x:108,y:345,t:'Gonady',p:[['guz zarodkowy jądra/jajnika','a'],['RMS przyjądrzowy','v']],
  d:'Jądro: powiększenie jądra, niebolesny guz (zapytaj o asymetrię jąder). Okołojądrowy niebolesny guz: RMS. Jajnik: ból brzucha, guz, gorączka, napięcie powłok; dysgerminoma po okresie dojrzewania; carcinoma embryonale: przedwczesne dojrzewanie, hirsutyzm.',
  f:'USG jądra lub miednicy, AFP, β-hCG, TK klatki-brzucha-miednicy, scyntygrafia kośćca.'},
 {id:11,x:128,y:462,t:'Kości długie',p:[['kostniakomięsak','v'],['mięsak Ewinga','v']],
  d:'Ból kostny (może być pierwszym objawem; różnicuj z ALL), obrzęk, kulawizna, guz. Kostniakomięsak: 2. dekada, przynasady (dalsza k. udowa, bliższa k. ramiennej), spikule w okostnej, trójkąt Codmana. Ewing: 10–20 lat, trzon kości długiej, również kości płaskie.',
  f:'RTG → MR całej kości → TK klatki, scyntygrafia/PET. Biopsję zleca i planuje ośrodek (nie robić „po drodze”). Ewing: ocena szpiku.'}
];
(function(){
 let s=`<g fill="#EEF2F0" stroke="#B5C0C3" stroke-width="2">
 <circle cx="160" cy="58" r="38"/>
 <rect x="146" y="92" width="28" height="22" rx="6"/>
 <path d="M104 118 Q160 104 216 118 L226 168 L216 200 L210 335 Q160 350 110 335 L104 200 L94 168 Z"/>
 <path d="M104 122 L66 170 L52 262 L72 266 L90 190 L106 160 Z"/>
 <path d="M216 122 L254 170 L268 262 L248 266 L230 190 L214 160 Z"/>
 <path d="M112 330 L158 336 L152 520 L128 556 L104 552 L112 470 Z"/>
 <path d="M208 330 L162 336 L168 520 L192 556 L216 552 L208 470 Z"/></g>`;
 s+=`<path d="M205 176 L252 176" stroke="#B5C0C3" stroke-dasharray="4 3"/><path d="M210 312 L252 312" stroke="#B5C0C3" stroke-dasharray="4 3"/>`;
 s+=`<text x="268" y="152" text-anchor="middle" font-size="10" fill="#6B7A82" font-weight="700">plecy</text><text x="266" y="288" text-anchor="middle" font-size="10" fill="#6B7A82" font-weight="700">krzyż</text>`;
 REG.forEach(r=>{s+=`<g class="pt" tabindex="0" role="button" aria-label="${r.t}" data-id="${r.id}"><circle cx="${r.x}" cy="${r.y}" r="11" fill="${C.teal}" stroke="#fff" stroke-width="2"/><text x="${r.x}" y="${r.y+4}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">${r.id}</text></g>`;});
 $('#bodySvg').innerHTML=s;
 const show=id=>{const r=REG.find(x=>x.id==id);$$('#bodySvg .pt').forEach(g=>g.classList.toggle('on',g.dataset.id==id));
  $('#regBox').innerHTML=`<span class="tag l">Okolica ${r.id}</span><h3 style="margin:.4rem 0">${r.t}</h3><div class="hd">${r.p.map(p=>`<span class="tpill ${p[1]}">${p[0]}</span>`).join('')}</div><p style="margin-bottom:.7rem">${r.d}</p><div class="callout"><b class="k">Pierwszy krok diagnostyczny</b>${r.f}</div>`;};
 $$('#bodySvg .pt').forEach(g=>{g.addEventListener('click',()=>show(g.dataset.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(g.dataset.id)}});});
 show(5);
})();

/* ---------- Graf zespołów ---------- */
(function(){
 const L=[['Beckwith-Wiedemann','b'],['WAGR (aniridia)','w'],['Denys-Drash','d'],['Perlman','p'],['Przerost połowiczy','h'],['Sporadyczna aniridia','a'],['Dziedziczny RB1','r'],['Li-Fraumeni (TP53)','l'],['NF1 (Recklinghausen)','n'],['FAP / Gardner (APC)','f'],['Zespół Downa','ds'],['Wiskott-Aldrich','wa']];
 const R=[['Guz Wilmsa',C.red],['Hepatoblastoma',C.amber],['Rabdomiosarcoma',C.violet],['Siatkówczak',C.green],['Kostniakomięsak / mięsaki',C.violet],['Glejaki, MPNST',C.blue],['Białaczka',C.teal],['NHL / chłoniaki',C.teal]];
 const E=[[0,0,1],[0,1,1],[0,2,0],[1,0,1],[2,0,0],[3,0,0],[4,0,1],[4,1,0],[5,0,1],[6,3,1],[6,4,1],[7,4,0],[7,2,0],[7,5,0],[7,6,0],[8,5,0],[8,4,0],[8,2,0],[9,1,1],[10,6,1],[11,7,1]];
 const lx=14,lw=196,rx=440,rw=186,ly=i=>22+i*37,ry=i=>40+i*54;
 let s='';
 E.forEach(e=>{const x1=lx+lw,y1=ly(e[0])+14,x2=rx,y2=ry(e[1])+20;s+=`<path class="edge ${e[2]?'hot':''}" d="M${x1} ${y1} C ${x1+110} ${y1}, ${x2-110} ${y2}, ${x2} ${y2}"/>`;});
 L.forEach((n,i)=>{s+=`<rect x="${lx}" y="${ly(i)}" width="${lw}" height="28" rx="8" fill="#fff" stroke="#13232C" stroke-width="1.5"/><text x="${lx+10}" y="${ly(i)+18}" font-size="12.5" font-weight="700" fill="#13232C">${n[0]}</text>`;});
 R.forEach((n,i)=>{s+=`<rect x="${rx}" y="${ry(i)}" width="${rw}" height="40" rx="10" fill="#fff" stroke="${n[1]}" stroke-width="2.5"/><text x="${rx+rw/2}" y="${ry(i)+25}" text-anchor="middle" font-size="13" font-weight="800" fill="#13232C">${n[0]}</text>`;});
 $('#synSvg').innerHTML=s;
 $('#synNotes').innerHTML=[
  ['callout red','Do zaliczenia','BWS: makrosomia, makroglosja, hipoglikemia, wady powłok → ryzyko Wilms + hepatoblastoma. Aniridia / hemihipertrofia → myśl o guzie Wilmsa. Gardner (FAP) NIE zwiększa ryzyka Wilmsa. Przerost połowiczy NIE należy do WAGR.'],
  ['callout blue','Rozpoznanie w liczbach (wykład)','WAGR ~30%, BWS ~5%, Denys-Drash ~90% ryzyka Wilmsa; izolowany przerost połowiczy <5%, aniridia 1,5%. Denys-Drash: jedyny sposób wyleczenia nefropatii to transplantacja nerki (notatki).'],
  ['callout green','Nadzór wg wytycznych',`Dzieci z predyspozycją do Wilmsa: USG jamy brzusznej co 3 mies. do 7.–8. r.ż.; przy BWS i hemihipertrofii dodatkowo AFP co 3 mies. do 4. r.ż. (${A('https://aacrjournals.org/clincancerres/article/23/13/e115/79988/Surveillance-Recommendations-for-Children-with','AACR 2017')}). Sporadyczna aniridia: analiza delecji WT1/PAX6 (${A('https://www.ncbi.nlm.nih.gov/sites/books/n/gene/wilms-ov/?report=reader','GeneReviews')}).`]
 ].map(c=>`<div class="${c[0]}"><b class="k">${c[1]}</b>${c[2]}</div>`).join('');
})();

/* ---------- Wykres wieku ---------- */
(function(){
 const T=[['Neuroblastoma',[[0,10]],[2],C.blue,'60% <2 r.ż., 90% <10 r.ż.'],['Guz Wilmsa',[[0,7]],[3.5],C.red,'szczyt 3–4 r.ż.; 90% <7 r.ż.'],['Siatkówczak',[[0,5]],[1.5],C.green,'niemowlęta i małe dzieci'],['Hepatoblastoma',[[0,4]],[1.5],C.amber,'zwykle <3 r.ż.'],['Rabdomiosarcoma',[[1,8],[14,20]],[4,17],C.violet,'dwa szczyty: 2–6 i 15–19 r.ż.'],['Guzy zarodkowe',[[0,4],[11,20]],[0.5,16],C.amber,'niemowlę (krzyż.-guz.), nastolatek'],['Kostniakomięsak',[[8,20]],[15],C.violet,'2. dekada życia'],['Mięsak Ewinga',[[5,20]],[14],C.violet,'najczęściej 10–20 lat']];
 const x0=190,w=540,u=w/20,y0=40,h=40;
 let s='';
 for(let a=0;a<=20;a+=2){s+=`<line x1="${x0+a*u}" y1="${y0-8}" x2="${x0+a*u}" y2="${y0+T.length*h}" stroke="#DCE2E0"/><text x="${x0+a*u}" y="${y0-14}" text-anchor="middle" font-size="12" fill="#6B7A82" font-weight="700">${a}</text>`;}
 s+=`<text x="${x0+w}" y="${y0-30}" text-anchor="end" font-size="11" fill="#6B7A82">wiek (lata)</text>`;
 T.forEach((t,i)=>{const y=y0+i*h;
  s+=`<text x="${x0-12}" y="${y+16}" text-anchor="end" font-size="13.5" font-weight="800" fill="#13232C">${t[0]}</text><text x="${x0-12}" y="${y+30}" text-anchor="end" font-size="10" fill="#6B7A82">${t[4]}</text>`;
  t[1].forEach(r=>{s+=`<rect x="${x0+r[0]*u}" y="${y+4}" width="${(r[1]-r[0])*u}" height="18" rx="9" fill="${t[3]}" opacity=".28"/>`;});
  t[2].forEach(p=>{const cx=x0+p*u,cy=y+13;s+=`<path d="M${cx} ${cy-9} L${cx+9} ${cy} L${cx} ${cy+9} L${cx-9} ${cy} Z" fill="${t[3]}" stroke="#fff" stroke-width="1.5"/>`;});
 });
 $('#ageSvg').innerHTML=s;
})();

const AGES=['Noworodek','Niemowlę','1–5 lat','6–12 lat','Nastolatek'];
const GRP={s:'Nerka',i:'Układ współczulny',e:'Oko i wątroba',f:'Mięsaki, kości, zarodkowe'};
const HEAT=[
 ['i','Neuroblastoma',[2,3,3,1,0]],
 ['s','Guz Wilmsa',[0,1,3,1,0]],
 ['s','Wrodzony nerczak mezoblastyczny',[3,2,0,0,0]],
 ['e','Siatkówczak',[1,3,3,0,0]],
 ['e','Hepatoblastoma',[1,2,3,0,0]],
 ['f','Rabdomiosarcoma',[0,1,3,2,2]],
 ['f','Guz zarodkowy krzyżowo-guziczny',[3,3,1,0,0]],
 ['f','Guz zarodkowy gonad (jajnik, jądro)',[0,0,1,1,3]],
 ['f','Kostniakomięsak',[0,0,0,2,3]],
 ['f','Mięsak Ewinga',[0,0,1,2,3]]
];
const DOTS=['·','●','●●','●●●'];
function renderHeat(f){
 let h=`<tr><th>Guz</th>${AGES.map(a=>`<th>${a}</th>`).join('')}</tr>`;
 HEAT.forEach(r=>{if(f!=='all'&&r[0]!==f)return;
  h+=`<tr><td>${r[1]}</td>${r[2].map((v,k)=>`<td class="c${v}" data-s="${r[0]}" title="${AGES[k]}: ${['rzadkie','rzadkie','możliwe','typowe'][v]}">${DOTS[v]}</td>`).join('')}</tr>`;});
 $('#heat').innerHTML=h;
}
$('#heatFilters').innerHTML=`<button aria-pressed="true" data-f="all">Wszystkie</button>`+Object.entries(GRP).map(([k,v])=>`<button aria-pressed="false" data-f="${k}">${v}</button>`).join('');
function wireFilters(id,cb){$$('button',$(id)).forEach(b=>b.addEventListener('click',()=>{$$('button',$(id)).forEach(x=>x.setAttribute('aria-pressed',x===b));cb(b.dataset.f);}));}
renderHeat('all');wireFilters('#heatFilters',renderHeat);
$('#heat').insertAdjacentHTML('afterend','');
$('#heat').closest('.tw').insertAdjacentHTML('afterend','<p class="small" style="margin-top:.5rem">Legenda: ● rzadkie · ●● możliwe · ●●● typowe. Wartości orientacyjne, zestawione z wykładu, omówień puli i wytycznych (PDQ). Wrodzony nerczak mezoblastyczny: dodatek z wytycznych, brak w puli.</p>');

/* ---------- Tabs helper ---------- */
function tabs(id,ids){$$('#'+id+' button').forEach(b=>b.addEventListener('click',()=>{$$('#'+id+' button').forEach(x=>x.setAttribute('aria-selected',x===b));ids.forEach(p=>{$('#'+p).hidden=p!==b.dataset.p});}));}
const card=(h,body,cls='')=>`<div class="card ${cls}"><h4 style="margin-bottom:.4rem">${h}</h4>${body}</div>`;
const ul=(a,c='')=>`<ul class="chk ${c}">${a.map(x=>`<li><span>${x}</span></li>`).join('')}</ul>`;
const tl=a=>`<ul class="tight small">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const tbl=(head,rows,cls='')=>`<div class="tw"><table class="${cls}"><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;

/* ---------- Objawy ---------- */
$('#s1').innerHTML=`<div class="grid3">`+
 card('🩸 Objawy ogólne i hematologiczne',tl(['powiększenie węzłów chłonnych','bladość (oceniaj np. spojówki, skrawki ucha)','osłabienie','bóle kostne','znaczny ubytek masy ciała (np. 10% w ciągu 6 miesięcy)']))+
 card('🔎 Guzy i zmiany widoczne',tl(['guz w jakiejkolwiek okolicy','nieuzasadniona, nawracająca gorączka (wyklucz inne przyczyny, np. reumatologiczne)','nacieki dziąseł','znamię skórne: nieregularne, swędzące, wyniosłe, krwawiące, owłosione (znamię olbrzymie)']))+
 card('🫁 Objawy narządowe',tl(['przewlekły kaszel','bóle głowy (poranne, nieustępujące po lekach)','nieprawidłowości w oddawaniu moczu','bóle kończyn: uczucie rozpierania, zwiększenie obwodu']))+
 `</div><div class="grid2" style="margin-top:1rem">
 <div class="callout red"><b class="k">🚩 Niepokój onkologiczny: węzły chłonne</b>niebolesne, nieprzesuwalne względem podłoża, tworzą konglomeraty, powyżej 2 cm, twarde; nieustępujące po 2 tygodniach antybiotyku lub po 4 tygodniach bez leczenia.</div>
 <div class="callout amber"><b class="k">⚠️ Przebieg podstępny</b>Początek bywa skąpoobjawowy lub bezobjawowy. Jeśli nie wiesz, co dalej: skieruj dziecko w trybie pilnym do onkologa (wykład zakładu). Zbierz wnikliwy wywiad, zbadaj dokładnie, zleć morfologię, RTG, USG, TK, MRI.</div></div>`;
$('#s2').innerHTML=tbl(['Okolica','Objawy','Pierwszy guz do rozważenia'],[
 ['<b>Oko</b>','biała źrenica, zez, brak odblasku; anizokoria, ptoza; wytrzeszcz, wylewy okularowe','siatkówczak; neuroblastoma (Horner, przerzuty); RMS oczodołu; LCH'],
 ['<b>Nosogardło, ucho, zatoki</b>','mowa nosowa, krwawienie z nosa, wyciek ropno-krwisty, polip w przewodzie słuchowym, porażenie VII','RMS parameningeal; chłoniak [11]'],
 ['<b>Klatka piersiowa</b>','duszność, infekcje płuc, dysfagia, zespół żyły głównej górnej, kaszel','neuroblastoma (tylne śródpiersie), chłoniak/guz zarodkowy (przednie) [11]'],
 ['<b>Jama brzuszna</b>','powiększenie obwodu brzucha, wybrzuszenie okolicy lędźwiowej, macalny guz, ból, wymioty, biegunki, zaparcia, hepatosplenomegalia, krwiomocz, nadciśnienie','Wilms; neuroblastoma; hepatoblastoma; guz zarodkowy zaotrzewnowy; NHL [11]'],
 ['<b>Miednica</b>','zaparcia, zastój moczu, masa przedkrzyżowa per rectum, masy groniaste w pochwie, krwiomocz, nawracające ZUM','guz zarodkowy, neuroblastoma, RMS'],
 ['<b>Gonady</b>','powiększenie jądra, niebolesny guz okołojądrowy; ból i guz brzucha (jajnik)','guz zarodkowy; RMS'],
 ['<b>Kręgosłup, kończyny dolne</b>','ból pleców, skolioza, utykanie, osłabienie, zaburzenia zwieraczy','neuroblastoma (hantlowaty), guz rdzenia [9]'],
 ['<b>Kości i kończyny</b>','ból, obrzęk, kulawizna, guz, zaburzenia chodu (ucisk na nerwy)','kostniakomięsak, Ewing; RMS kończyn; ALL [11]'],
 ['<b>Skóra</b>','guzki podskórne (noworodek), „raccoon eyes”, znamię olbrzymie, plamy café-au-lait','neuroblastoma; NF1 → mięsaki, glejaki']
]);
$('#s3').innerHTML=`<div class="grid2">`+
 card('Neuroblastoma: katecholaminy',tl(['napadowe pocenie, zaczerwienienie twarzy, bóle głowy, kołatanie serca, nadciśnienie tętnicze'])+`<p class="small" style="margin-top:.4rem">Źródło: wykład zakładu.</p>`)+
 card('Neuroblastoma: VIP',tl(['wodniste biegunki, bóle brzucha, hipoglikemia (wykład zakładu)','według notatek seminarium zespół VIP i zespół opsoklonie-mioklonie pogarszają rokowanie; patrz tabela „Klucz vs wytyczne”']))+
 card('Zespół opsoklonie-mioklonie („tańczące oczy”)',tl(['szybkie, chaotyczne ruchy gałek ocznych, mioklonie, ataksja, drażliwość','łatwo pomylić z autoimmunologicznym zapaleniem móżdżku — szukaj neuroblastoma (USG brzucha, RTG klatki, VMA/HVA, MIBG)','około połowy przypadków OMS u dzieci wiąże się z neuroblastoma']))+
 card('Guzy zarodkowe: hormony',tl(['carcinoma embryonale jajnika: przedwczesne dojrzewanie, brak miesiączki, hirsutyzm','dysgerminoma po okresie dojrzewania: brak miesiączki, nieprawidłowe krwawienia, kariotyp 46,XY (pseudohermafrodytyzm)']))+
 `</div>`;
$('#s4').innerHTML=`<div class="grid2">`+
 card('Neuroblastoma u noworodka',tl(['rozległe przerzuty do wątroby','guzki podskórne','zajęcie szpiku','krwawienie do guza nadnercza','erytroblastoza płodowa (obraz różnicowy z konfliktem serologicznym)','najczęstszy złośliwy nowotwór okresu noworodkowego (pula)']))+
 card('Inne guzy w okresie noworodkowym i niemowlęcym',tl(['potworniak krzyżowo-guziczny (guz zarodkowy w tej okolicy to 42% wszystkich)','siatkówczak: leukokoria lub zez, często wykrywany z odblasku','guz nerki <6 m.ż. i w pełni torbielowaty: według SIOP-UMBRELLA natychmiastowa operacja, nie chemioterapia; w tym wieku częstszy jest wrodzony nerczak mezoblastyczny','AFP fizjologicznie wysokie u noworodka (t½ 5–7 dni, norma poniżej 10 ng/mL ok. 1 r.ż.) — nie interpretuj bez normy dla wieku']))+
 `</div><p class="small" style="margin-top:.8rem">Źródła: wykład zakładu; ${A('https://pmc.ncbi.nlm.nih.gov/articles/PMC7136175/','SIOP-RTSG UMBRELLA')}; ${A('https://www.cancer.gov/types/liver/hp/child-liver-treatment-pdq','NCI PDQ: nowotwory wątroby u dzieci')}.</p>`;
tabs('symTabs',['s1','s2','s3','s4']);

/* ---------- Badanie ---------- */
$('#e1').innerHTML=`<div class="grid2">`+
 card('Co zawsze zmierzyć i ocenić',ul(['<b>ciśnienie tętnicze</b> (Wilms, neuroblastoma — katecholaminy; nadciśnienie to element zespołu objawów)','masa ciała, trend (ubytek 10% w 6 mies.), stan odżywienia','gorączka, bladość, wybroczyny (szpik, trombocytopenia)','wzrost i proporcje ciała: asymetria kończyn (hemihipertrofia), makroglosja, makrosomia','dysmorfie i wady (aniridia, brak kości promieniowej, wady układu moczowo-płciowego)']))+
 card('Wywiad nastawiony na guz',ul(['wywiad rodzinny: siatkówczak, nowotwory sutka, kości, tkanek miękkich, mózgu, kory nadnerczy (Li-Fraumeni, NF1)','czas narastania obwodu brzucha, krwiomocz, ból, gorączka','objawy „ukryte”: pocenie, biegunki wodniste, drażliwość, zaparcia, zaburzenia mikcji','ubytek masy ciała, bóle kostne, utykanie, ból nocny','pytaj o wszystkie wcześniejsze „niewyjaśnione” infekcje i antybiotykoterapie, które nie pomogły']))+
 `</div>`;
$('#e2').innerHTML=`<div class="nodo" style="margin-bottom:1rem"><div class="ic">⚠️</div><div><b>Jedno, łagodne badanie</b><p class="small">Jeden doświadczony badający, dziecko zrelaksowane (leżąca pozycja, zgięte kolana). Płaska dłoń, bez ugniatania, bez balotowania. Zapisz wymiary i położenie, zlecaj USG. Nie powtarzaj badania palpacyjnego „dla pewności”.</p></div></div><div class="grid2">`+
 card('Oglądanie',ul(['obwód brzucha, asymetria, wybrzuszenie okolicy lędźwiowej','widoczna sieć naczyń, hemihipertrofia','mocz: krwinkomocz/krwiomocz (makro: widoczny)']))+
 card('Opis guza (nie „macanie”)',ul(['strona, wielkość orientacyjna, powierzchnia, ruchomość','<b>przekracza linię środkową?</b> (Wilms zwykle nie; neuroblastoma często tak)','bolesność (niebolesny: Wilms/neuroblastoma; ból napadowy → wgłobienie [1])','wątroba i śledziona: powiększenie, brzeg, guzowatość']))+
 card('Czego NIE robić',ul(['głębokiego, wielokrotnego badania palpacyjnego guza nerki','badania przez kilku różnych badających','biopsji „na własną rękę” (szczególnie guza nerki)','sedacji przed oceną RTG klatki, jeśli jest guz śródpiersia [11]'],'no'))+
 card('Dlaczego',tl(['pęknięcie guza lub jego rozsiew pogarsza stopień zaawansowania i rokowanie','biopsja guza nerki podnosi stopień do III (COG/NCI)','SIOP-UMBRELLA: chemioterapia przedoperacyjna ma m.in. zmniejszyć ryzyko pęknięcia guza w trakcie operacji'])+`<p class="small" style="margin-top:.4rem">${A('https://www.cancer.gov/types/kidney/hp/wilms-treatment-pdq','NCI PDQ: guz Wilmsa')}, ${A('https://onlinelibrary.wiley.com/doi/full/10.1002/pbc.24321','SIOP PODC')}.</p>`)+
 `</div>`;
$('#e3').innerHTML=`<div class="grid2">`+
 card('Odblask i gałki',ul(['<b>czerwony odblask w obu oczach</b>; leukokoria (biała źrenica) = siatkówczak do czasu wykluczenia','zez u niemowlęcia','wytrzeszcz, obrzęk powiek, opadanie powieki','anizokoria + ptoza + enophthalmos (Horner) → guz szyi lub szczytu klatki']))+
 card('Dno oka i dalszy plan',ul(['pełne badanie dna oka w znieczuleniu ogólnym u okulisty','tarcza zastoinowa → guz OUN [9]','raccoon eyes (wylewy okularowe) → przerzuty neuroblastoma do przedniego dołu czaszki','dwustronne zmiany/rodzinne: genetyka RB1']))+
 `</div>`;
$('#e4').innerHTML=`<div class="grid2">`+
 card('Węzły chłonne',ul(['szyjne, nadobojczykowe, pachowe, pachwinowe: wielkość >2 cm, twardość, niebolesność, nieprzesuwalność, pakiety','nadobojczykowe zawsze podejrzane','brak poprawy po 2 tyg. antybiotyku → dalsza diagnostyka [11]']))+
 card('Jamy i otwory ciała',ul(['gardło: jednostronne powiększenie migdałka (RMS, chłoniak [11])','ucho: polip, wyciek ropno-krwisty','nos: jednostronna niedrożność, krwawienie','<b>wziernik</b>: masy groniaste w pochwie lub szyjce → RMS','<b>badanie per rectum</b>: masa przedkrzyżowa','<b>jądra</b>: asymetria, guzek, niebolesny guz okołojądrowy']))+
 `</div>`;
$('#e5').innerHTML=`<div class="grid2">`+
 card('Neurologiczne',ul(['siła, napięcie, odruchy: osłabione w kończynach górnych, wzmożone w dolnych w guzach rdzenia','chód, równowaga, ataksja','opsoklonie i mioklonie (neuroblastoma)','zaburzenia pęcherza i zwieracza odbytu (guz miednicy, rdzenia)']))+
 card('Kręgosłup',ul(['skolioza, bolesność wyrostków, opór przy skłonach','ból w pozycji leżącej i przy Valsalvie (guz rdzenia, dziecko śpi siedząc)','niedowłady i ból pleców + guz brzucha → neuroblastoma „hantlowaty” (MR kręgosłupa pilnie)']))+
 `</div>`;
$('#e6').innerHTML=`<div class="grid2">`+
 card('Skóra',ul(['guzki podskórne (neuroblastoma noworodka), plamy café-au-lait, nerwiakowłókniaki (NF1)','znamię: kształt, kolor, świąd, krwawienie, owłosienie','wybroczyny i bladość (zajęcie szpiku)']))+
 card('Układ kostny i wady',ul(['obrzęk, bolesność, ograniczenie ruchu, guz, kulawizna (osteosarcoma, Ewing)','brak kości promieniowej, przerost połowiczy, aniridia, makroglosja, wady powłok (zespoły predysponujące)','objaw: ból kostny może maskować ALL — morfologia z rozmazem']))+
 `</div>`;
tabs('examTabs',['e1','e2','e3','e4','e5','e6']);

/* ---------- Diagnostyka ---------- */
$('#d1').innerHTML=`<div class="flow">
 <div class="fn start">Dziecko z guzem jamy brzusznej lub podejrzeniem guza litego</div><div class="ar">↓</div>
 <div class="fn"><b>1. Wywiad + jedno łagodne badanie</b>RR, oczy (odblask), węzły, jądra, per rectum, neurologicznie, skóra. Bez uciskania guza.</div><div class="ar">↓</div>
 <div class="fn amber"><b>2. Pilnie: badania podstawowe</b>morfologia z rozmazem, LDH, kwas moczowy, kreatynina i elektrolity, ALT/AST, koagulogram, mocz ogólny</div><div class="ar">↓</div>
 <div class="fn blue"><b>3. USG jamy brzusznej + RTG klatki piersiowej</b>ustal narząd pochodzenia, przekroczenie linii środkowej, zwapnienia, przerzuty, drugą nerkę, wątrobę</div><div class="ar">↓</div>
 <div class="branch br3" style="width:100%">
  <div><div class="fn red"><b>Nerka, bez zwapnień</b>nie przekracza linii, dziecko 2–5 lat, krwiomocz/RR↑ → <b>Wilms</b><br>TK/MR brzucha + TK klatki<br><b>BEZ biopsji</b> (pula)</div></div>
  <div><div class="fn blue"><b>Zaotrzewnowo / nadnercze</b>zwapnienia, przekracza linię, &lt;5 lat, objawy ogólne → <b>neuroblastoma</b><br>VMA/HVA, NSE, ferrytyna, LDH, MIBG, MR, trepanobiopsja szpiku, MYCN</div></div>
  <div><div class="fn amber"><b>Wątroba</b>hepatomegalia, guz → <b>hepatoblastoma</b><br>AFP, β-hCG, HBV/HCV, TK/MR, TK klatki</div></div>
  <div><div class="fn violet"><b>Miednica, gonady, krzyżowo-guziczna</b><br><b>guz zarodkowy lub RMS</b><br>AFP, β-hCG, USG jąder/miednicy, TK, per rectum</div></div>
  <div><div class="fn"><b>Jelito, szybki wzrost, LDH↑ i kwas moczowy↑</b><br>→ <b>chłoniak Burkitta</b> [11]<br>biopsja, ryzyko lizy guza</div></div>
  <div><div class="fn green"><b>Brak guza w USG, krwiomocz, AKI, ↓PLT</b><br>→ <b>HUS</b> i inne [3][12][15]<br>nie „onkologia”</div></div>
 </div>
 <div class="ar">↓</div>
 <div class="fn green"><b>4. Pilny kontakt z ośrodkiem onkologii dziecięcej PRZED biopsją i operacją</b>staging, genetyka guza, decyzja o strategii (chemioterapia przedoperacyjna vs operacja)</div>
</div>
<p class="small" style="margin-top:1rem">Schemat własny, oparty na wykładzie zakładu (kolejność badań, markery, obrazowanie) oraz wytycznych SIOP/COG. Wybór między operacją pierwotną a chemioterapią przedoperacyjną w guzie nerki zależy od protokołu (SIOP vs COG) i ośrodka.</p>`;

$('#d2').innerHTML=tbl(['Guz','Marker / badanie','Co oznacza','Perełki i pułapki'],[
 ['<b>Neuroblastoma</b>','VMA, HVA (mocz), NSE, ferrytyna, LDH; MIBG; MYCN','↑ katecholaminy w moczu; wg zakładu NSE &gt;150, ferrytyna &gt;150, LDH &gt;1500 i amplifikacja MYCN = gorsze rokowanie','AFP nieswoiste. Amplifikacja MYCN to czynnik ryzyka, a nie samo „potwierdzenie” rozpoznania.'],
 ['<b>Guz Wilmsa</b>','brak swoistego markera; mocz, RR, kreatynina','krwinkomocz/krwiomocz, nadciśnienie','Rozpoznanie obrazowe; nie robić biopsji „na zapas”.'],
 ['<b>Hepatoblastoma / HCC</b>','AFP, β-hCG, CEA (wykład); próby wątrobowe, HBV/HCV','AFP ↑ u ok. 90% hepatoblastoma; według wykładu u 80% HCC','AFP fizjologicznie wysokie u noworodków i niemowląt: interpretuj wg normy dla wieku.'],
 ['<b>Guzy zarodkowe</b>','AFP, β-hCG','AFP: guz pęcherzykowy żółtkowy; β-hCG: kosmówczak, zarodniak; w ocenie masy guza, reszty po leczeniu, odpowiedzi i wznowy','Guzy siodłowo-nadsiodłowe OUN: AFP i β-hCG w osoczu i PMR [9].'],
 ['<b>Rabdomiosarcoma</b>','brak markera; histologia (FOXO1 w alweolarnym); trepanobiopsja szpiku','typ embrionalny/botryoid lepiej, alweolarny/niezróżnicowany gorzej','Bez cienkoigłowej biopsji aspiracyjnej; przy okołoopon­owych: PMR i MR mózgu.'],
 ['<b>Kostniakomięsak / Ewing</b>','LDH; histologia; translokacja EWSR1 (Ewing)','LDH ↑ gorsze rokowanie (Ewing)','RTG: spikule, trójkąt Codmana; Ewing: ocena szpiku.'],
 ['<b>Siatkówczak</b>','brak markera; analiza RB1 (krew)','dziedziczny vs sporadyczny','Biopsji wewnątrzgałkowej się nie wykonuje; rozpoznanie okulistyczne i obrazowe.'],
 ['<b>Chłoniaki [11]</b>','LDH, kwas moczowy, K, P, Ca','zespół lizy guza','Przed leczeniem nawodnienie; patrz moduł [11].']
],'sm')+`<p class="small" style="margin-top:.6rem">Źródła: wykład zakładu; ${A('https://www.cancer.gov/types/extracranial-germ-cell/hp/germ-cell-treatment-pdq','NCI PDQ: pozaczaszkowe guzy zarodkowe')}; ${A('https://www.cancer.gov/types/liver/hp/child-liver-treatment-pdq','NCI PDQ: wątroba')}; ${A('https://www.cancer.gov/types/bone/hp/ewing-treatment-pdq','NCI PDQ: Ewing')}; ${A('https://www.cancer.gov/types/retinoblastoma/hp/retinoblastoma-treatment-pdq','NCI PDQ: siatkówczak')}.</p>`;

$('#d3').innerHTML=tbl(['Guz','Pierwszy rzut','Staging / uzupełnienie'],[
 ['<b>Wilms</b>','USG jamy brzusznej (nerki, żyła nerkowa, VCI, druga nerka)','TK lub MR brzucha, TK klatki piersiowej (przerzuty do płuc)'],
 ['<b>Neuroblastoma</b>','USG jamy brzusznej, RTG klatki piersiowej','MR/TK ogniska pierwotnego, scyntygrafia MIBG-J123, scyntygrafia kośćca, MR głowy/rdzenia przy podejrzeniu OUN, trepanobiopsja szpiku'],
 ['<b>Hepatoblastoma</b>','USG wątroby','TK/MR wątroby, TK klatki, scyntygrafia kośćca, trepanobiopsja szpiku'],
 ['<b>Guzy zarodkowe</b>','USG jądra lub miednicy','TK klatki, jamy brzusznej i miednicy, scyntygrafia kośćca'],
 ['<b>Rabdomiosarcoma</b>','MR i TK ogniska pierwotnego','TK klatki, scyntygrafia kośćca, trepanobiopsja szpiku, cystoskopia/waginoskopia, PMR + MR mózgu przy okołoopon­owych'],
 ['<b>Kostniakomięsak / Ewing</b>','RTG kości (przed biopsją)','MR całej kości, TK klatki, scyntygrafia lub PET; Ewing: szpik'],
 ['<b>Siatkówczak</b>','badanie dna oka w znieczuleniu, USG oka','MR oczodołów i mózgu'],
 ['<b>Guz mózgu [9]</b>','MR z kontrastem (preferowane)','MR kanału kręgowego, PMR przy podejrzeniu rozsiewu']
],'sm')+`<p class="small" style="margin-top:.6rem">${A('https://pmc.ncbi.nlm.nih.gov/articles/PMC4728859/','Wstępne obrazowanie w guzie Wilmsa: USG, potem TK/MR')}; ${A('https://www.cancer.gov/types/bone/hp/osteosarcoma-treatment-pdq','NCI PDQ: kostniakomięsak')}; wykład zakładu.</p>`;

$('#d4').innerHTML=`<div class="grid2">
 <div class="callout amber"><b class="k">Pod zaliczenie (wg puli/zakładu)</b>Guz nerki u 4-latka: biopsja jest przeciwwskazana (klucz we wszystkich pulach S2, S3, S4). Mięsaki: nie robi się biopsji aspiracyjnej, tylko trepanobiopsję (szpik); badanie histopatologiczne guza OUN jest podstawą leczenia.</div>
 <div class="callout blue"><b class="k">Aktualnie klinicznie (wg wytycznych)</b>SIOP-UMBRELLA: u dzieci ≥6 m.ż. chemioterapia przedoperacyjna bez rutynowej biopsji; biopsja gruboigłowa tylko w wybranych, nietypowych sytuacjach. COG: pierwotna nefrektomia; biopsja podnosi stopień do III (${A('https://www.cancer.gov/types/kidney/hp/wilms-treatment-pdq','NCI PDQ')}, ${A('https://pmc.ncbi.nlm.nih.gov/articles/PMC7136175/','UMBRELLA')}).</div></div>
 <div class="grid3" style="margin-top:1rem">
 ${card('Neuroblastoma',tl(['histologia (typ wg Shimady / INPC), MYCN, ploidia DNA','rozpoznanie wymaga tkanki guza (lub nacieku szpiku + podwyższone katecholaminy w moczu)']))}
 ${card('Mięsaki tkanek miękkich',tl(['biopsja guza po obrazowaniu','trepanobiopsja szpiku, nie aspiracja','biopsja węzła, jeśli podejrzenie przerzutu']))}
 ${card('Guzy kości',tl(['obrazowanie PRZED biopsją','biopsję planuje chirurg ortopeda onkolog (tor biopsji do późniejszej resekcji)','Ewing: translokacja EWSR1 (FISH)']))}
 ${card('Siatkówczak',tl(['rozpoznanie okulistyczne i obrazowe','biopsji wewnątrzgałkowej się nie wykonuje (ryzyko rozsiewu)']))}
 ${card('Guzy zarodkowe',tl(['markery (AFP, β-hCG) + obrazowanie kierują postępowaniem','histologia z guza zgodnie z protokołem ośrodka']))}
 ${card('Chłoniaki [11]',tl(['biopsja węzła lub guza','szybko, ale po ocenie ryzyka (RTG klatki, sedacja!)']))}
 </div>`;

$('#d5').innerHTML=`<div class="grid2">
 <div>${card('INRGSS: neuroblastoma (aktualny podział)',tbl(['Stadium','Definicja'],[
  ['<b>L1</b>','guz zlokalizowany, bez czynników ryzyka obrazowych (IDRF), w jednej przestrzeni anatomicznej'],
  ['<b>L2</b>','guz miejscowo-regionalny z ≥1 IDRF'],
  ['<b>M</b>','przerzuty odległe (poza MS)'],
  ['<b>MS</b>','&lt;18 mies.; przerzuty tylko do skóry, wątroby i/lub szpiku; MIBG ujemny w kościach/szpiku (dawne 4S/IVS)']
 ],'sm')+`<p class="small" style="margin-top:.5rem">${A('https://pmc.ncbi.nlm.nih.gov/articles/PMC2650389/','INRG Staging System')}; ${A('https://www.cancer.org/cancer/types/neuroblastoma/detection-diagnosis-staging/staging.html','American Cancer Society')}.</p>`)}</div>
 <div>${card('Pula używa starszego INSS: I–IV, IVS',tl(['6-miesięczna dziewczynka: guz nadnercza przekraczający linię środkową + przerzuty do wątroby i skóry, szpik wolny → <b>IV</b> (pula; guz przekracza linię środkową, więc nie 4S)','Według INRGSS ten sam obraz klasyfikuje się jako <b>MS</b> (wiek &lt;18 mies., przerzuty tylko skóra/wątroba/szpik), niezależnie od przekroczenia linii środkowej','14-miesięczny chłopiec z wytrzeszczem i wylewami okularowymi: przerzuty do kości oczodołu → IV (INRGSS: M), nie IVS']))}</div></div>
 <div class="tw" style="margin-top:1rem"><table class="sm"><tr><th>Czynnik rokowniczy w neuroblastoma</th><th>Korzystny</th><th>Niekorzystny</th></tr>
 <tr><td>Wiek</td><td>&lt;12 mies. (notatki zakładu); wg INRG/COG próg 18 mies.</td><td>starsze dziecko</td></tr>
 <tr><td>Lokalizacja</td><td>tylne śródpiersie</td><td>jama brzuszna, nadnercze (rdzeń nadnerczy)</td></tr>
 <tr><td>Surowica</td><td>NSE &lt;150, ferrytyna &lt;150, LDH &lt;1500</td><td>NSE &gt;150, ferrytyna &gt;150, LDH &gt;1500</td></tr>
 <tr><td>Genetyka</td><td>brak amplifikacji MYCN; ekspresja TrkA</td><td>amplifikacja MYCN; del 1p; 17q</td></tr>
 <tr><td>Mocz</td><td>—</td><td>niski stosunek VMA/HVA; stosunek dopaminy do noradrenaliny</td></tr>
 <tr><td>Stadium</td><td>L1, MS (niemowlę)</td><td>M, szczególnie &gt;18 mies.</td></tr></table></div>
 <p class="small" style="margin-top:.5rem">Progi surowiczych NSE, ferrytyny i LDH pochodzą z notatek zakładu; współczesne grupy ryzyka COG/INRG opierają się na stadium, wieku, histologii (INPC), MYCN i wskaźniku DNA (${A('https://www.cancer.gov/types/neuroblastoma/hp/neuroblastoma-treatment-pdq','NCI PDQ: neuroblastoma')}).</p>
 <div class="grid3" style="margin-top:1rem">
 ${card('Guz Wilmsa: stopnie',tl(['I–V, gdzie V = guz obustronny','histologia (anaplazja, blastemowy) decyduje o ryzyku','przerzuty najczęściej do płuc, potem kości; przerzuty do kości płaskich rokują najgorzej (notatki)']))}
 ${card('RMS: miejsca',tl(['korzystne: orbita, głowa-szyja nieokołoopono­we, układ moczowo-płciowy poza pęcherzem i prostatą','niekorzystne: okołoopono­we, pęcherz, prostata, kończyny']))+''}
 ${card('Kostniakomięsak / Ewing',tl(['obecność przerzutów (płuca, kości) i odpowiedź histologiczna na chemioterapię','Ewing: miejsce (miednica gorsze), wielkość guza']))}
 </div>`;

/* ---------- Karty guzów ---------- */
const D=[
{c:'i',e:'🔵',t:'Neuroblastoma',m:'[10]',a:'szczyt 2 r.ż.; 60% &lt;2 r.ż., 90% &lt;10 r.ż.; najczęstszy guz lity niemowląt',
 o:'Guz w przestrzeni zaotrzewnowej (nadnercze, zwoje), tylnym śródpiersiu, szyi lub miednicy. Powiększenie obwodu brzucha, brak łaknienia, ból, ubytek masy, senność, drażliwość; wylewy okularowe i wytrzeszcz; objaw Hornera; opsoklonie-mioklonie; biegunki wodniste (VIP); pocenie i nadciśnienie (katecholaminy); niedowłady i skolioza (guz hantlowaty). Przerzuty u 60–75% przy rozpoznaniu.',
 b:'Delikatne badanie brzucha; RR; oczy (anizokoria, wylewy); neurologicznie i kręgosłup; per rectum (miednica); skóra (guzki u noworodka).',
 dx:'VMA/HVA, NSE, ferrytyna, LDH, morfologia; USG → MR/TK; MIBG-J123; scyntygrafia kośćca; trepanobiopsja szpiku; histologia (Shimada/INPC), MYCN, ploidia, del 1p.',
 tx:'Ryzyko-adaptowane. Wysokie ryzyko: indukcja (chemioterapia + operacja) → konsolidacja (autologiczny przeszczep + RT) → immunoterapia anty-GD2 (dinutuximab) z GM-CSF i izotretynoiną; w badaniu COG 2-letnie EFS 66% vs 46% bez immunoterapii. Zakład: chemioterapia zawsze wstępna, chyba że immunomodulacja.',
 p:'Dziecko &lt;2 r.ż. z niebolesnym guzem brzucha i prawidłowym moczem → neuroblastoma. Zwapnienia w guzie → neuroblastoma, nie Wilms. Opsoklonie-mioklonie, raccoon eyes, guz hantlowaty to klasyczne „perełki”.',
 x:'Szczyt 4–5 r.ż. i „najczęściej w śródpiersiu” to zdania fałszywe w puli. AFP nie jest markerem neuroblastoma.'},
{c:'s',e:'🔴',t:'Guz Wilmsa (nefroblastoma)',m:'[10]',a:'szczyt 3–4 r.ż.; 90% do 7 r.ż.; 9–10% nowotworów dziecięcych',
 o:'Powiększenie obwodu brzucha (najczęstsze), niebolesny guz zwykle nieprzekraczający linii środkowej, ból brzucha, krwinkomocz/krwiomocz, nawracające ZUM, nadciśnienie, zaburzenia pasażu. Często zespoły: WAGR, BWS, Denys-Drash, Perlman, hemihipertrofia, aniridia.',
 b:'<strong>Nie uciskać guza.</strong> Jedno łagodne badanie. RR. Oczy (aniridia). Symetria ciała (hemihipertrofia). Genitalia (wady).',
 dx:'USG → TK/MR brzucha + TK klatki. Mocz, kreatynina. Bez biopsji w typowym przypadku. Nadzór rodzin/zespołów: USG co 3 mies.',
 tx:'Chemioterapia + nefrektomia ± radioterapia wg stopnia i histologii. SIOP: chemioterapia przedoperacyjna (≥6 m.ż.); COG: pierwotna nefrektomia. Nowotwór o najlepszym rokowaniu (pula S1). Denys-Drash: wyleczenie nefropatii wymaga przeszczepu nerki (notatki).',
 p:'Krwiomocz + nadciśnienie + guz u 2–3-latka → Wilms. Aniridia lub przerost połowiczy → myśl o Wilmsie. Wilms: brak zwapnień. Przerzuty: płuca (TK klatki).',
 x:'Najmniej prawdopodobny w zestawie „guz brzucha + krwiomocz” jest HUS (nie daje guza). Gardner nie zwiększa ryzyka. Przerost połowiczy nie wchodzi w skład WAGR.'},
{c:'e',e:'🟢',t:'Siatkówczak (retinoblastoma)',m:'[10]',a:'niemowlęta i małe dzieci; do ok. 5 r.ż.',
 o:'Leukokoria (biała źrenica, „kocie oko”), zez, brak czerwonego odblasku; później jaskra, wytrzeszcz. Może być obustronny i rodzinny (RB1, 13q14; dziedziczenie AD z niepełną penetracją).',
 b:'Odblask czerwony w obu oczach, zez, dno oka w znieczuleniu, wywiad rodzinny.',
 dx:'Okulista (dno oka w znieczuleniu), USG oka, MR oczodołów i mózgu; analiza RB1. Biopsji nie wykonuje się.',
 tx:'Chemioredukcja + leczenie miejscowe, chemioterapia dotętnicza (melfalan), enukleacja przy dużych guzach/grupie E; radioterapia zwykle rezerwowana na progresję. Dziedziczny: ryzyko kostniakomięsaka i innych mięsaków.',
 p:'Rokowanie dobre. RB1 → kostniakomięsak i mięsaki. Leukokoria nie występuje w nefroblastoma.',
 x:'„Mutacja chromosomu 5” i „złe rokowanie” to zdania fałszywe w puli. Stare klucze podają radioterapię jako leczenie z wyboru; obecnie jest zarezerwowana.'},
{c:'a',e:'🟡',t:'Hepatoblastoma (i HCC)',m:'[10]',a:'zwykle &lt;3 r.ż.; 1–2% nowotworów dziecięcych (wątroba)',
 o:'Guz jamy brzusznej, wzdęcie, brak łaknienia, ubytek masy, ból, wymioty, żółtaczka, gorączka. Współistnieją: przerost połowiczy, uchyłek Meckela, brak nadnercza, brak nerki, BWS. Choroby predysponujące: marskość, WZW B/C, von Gierke, α1-AT, cystationinuria.',
 b:'Hepatomegalia, brzeg wątroby, wady współistniejące, żółtaczka.',
 dx:'AFP (ok. 90% hepatoblastoma; HCC 80% wg wykładu), β-hCG, CEA, próby wątrobowe, koagulogram, HBV/HCV; TK/MR, TK klatki, scyntygrafia kośćca, szpik. Cele: rozległość, możliwość radykalnej resekcji, choroba poza wątrobą.',
 tx:'Chemioterapia i resekcja (radykalne usunięcie decyduje o rokowaniu).',
 p:'AFP ↑ → hepatoblastoma. AFP u noworodka bywa fizjologicznie wysokie.',
 x:'Wersje puli różnią się co do listy wad współistniejących (brak kości promieniowej).'},
{c:'f',e:'🟣',t:'Rabdomiosarcoma (RMS)',m:'[10]',a:'najczęstszy mięsak tkanek miękkich u dzieci; szczyty 2–6 i 15–19 r.ż.',
 o:'Zależnie od lokalizacji: nosogardło (mowa nosowa, krwawienie), ucho (wyciek ropno-krwisty, polip, porażenie VII), oczodół (wytrzeszcz, zez), pochwa (masy groniaste, krwawienie), pęcherz (krwiomocz, nawracające ZUM), jądro (niebolesny guz okołojądrowy), kończyny (guz, ból), zaotrzewnowo (niedrożność).',
 b:'Wziernik/waginoskopia, per rectum, jądra, ucho-nos-gardło, węzły.',
 dx:'MR + TK ogniska, TK klatki, scyntygrafia kośćca, trepanobiopsja szpiku, biopsja węzła; okołoopono­we: laryngolog, okulista, PMR, MR mózgu.',
 tx:'Skojarzone: chemioterapia zawsze jako pierwsza, radioterapia, chirurgia (niecałkowite wycięcie → nawrót). Typy: embrionalny i groniasty (lepsze), alweolarny i niezróżnicowany (gorsze).',
 p:'Masy groniaste w pochwie 4-latki → RMS botryoid. Współistnieje z wadami i NF1.',
 x:'Jednostronny migdałek + mowa nosowa → RMS lub chłoniak [11], a nie „ropień”. W puli występuje wątpliwe stwierdzenie „najczęściej w pęcherzu”.'},
{c:'f',e:'🦴',t:'Kostniakomięsak (osteosarcoma)',m:'[10]',a:'2. dekada życia, ok. 10–20 lat',
 o:'Ból i obrzęk okolicy kolana lub barku, kulawizna; przynasady (dalsza k. udowa, bliższa k. ramiennej); RTG: spikule w okostnej, trójkąt Codmana. Ból kostny może być pierwszym objawem.',
 b:'Obrzęk, ocieplenie, ograniczenie ruchu, guz.',
 dx:'RTG → MR całej kości → TK klatki, scyntygrafia/PET; biopsja planowana przez ośrodek.',
 tx:'Chemioterapia neoadiuwantowa, resekcja, chemioterapia uzupełniająca. RB1 i Li-Fraumeni predysponują.',
 p:'RB1 → kostniakomięsak. Różnicuj ból kostny z ALL [11].',
 x:'Biopsję zleca ośrodek: nie „po drodze” w POZ.'},
{c:'f',e:'🦴',t:'Mięsak Ewinga',m:'[10]',a:'10–20 lat; trzon kości długich, kości płaskie',
 o:'Ból, obrzęk, gorączka i ubytek masy; zmiany w trzonie kości długich, miednicy, żebrach; RTG „łuski cebuli”.',
 b:'Jak w osteosarcoma; węzły; badanie neurologiczne przy zajęciu kręgosłupa.',
 dx:'RTG, MR, TK klatki, scyntygrafia/PET, szpik (trepanobiopsja), EWSR1 (FISH).',
 tx:'Chemioterapia i miejscowa kontrola (chirurgia i/lub radioterapia).',
 p:'14-latek, trzon kości długiej → Ewing. W OUN: PNET.',
 x:'W puli „Ewing/PNET” pojawia się też w OUN.'},
{c:'a',e:'🥚',t:'Guzy zarodkowe (germ cell)',m:'[10]',a:'2–3% nowotworów dziecięcych; niemowlę (krzyżowo-guziczne) i nastolatek (gonady)',
 o:'Lokalizacje: krzyżowo-guziczna 42%, jajnik 24%, jądro 9%, śródpiersie 7%, szyszynka 6%, zaotrzewnowo 4%. Objawy zależą od miejsca: guz pośladków, retencja, ból brzucha, powiększenie jądra, kaszel/duszność.',
 b:'Zapytaj o asymetrię jąder i guzek; per rectum; brzuch.',
 dx:'AFP, β-hCG, TK klatki-brzucha-miednicy, USG jądra, scyntygrafia kośćca. Przerzuty: płuca, wątroba, węzły, OUN.',
 tx:'Skojarzone: chirurgia, chemioterapia, radioterapia. Bardzo dobrze reagują na chemioterapię (notatki).',
 p:'AFP i β-hCG: diagnostyka, ocena masy resztkowej, monitorowanie leczenia i wznowy.',
 x:'Siodłowo-nadsiodłowe w OUN: najpierw markery; jeśli wydzielają, radioterapia i chemioterapia (odwrotnie niż zwykle) [9].'}
];
$('#dcards').innerHTML=D.map(d=>`<details class="dc" data-c="${d.c}"><summary><span class="em">${d.e}</span><span class="t">${d.t} <span class="mod">${d.m}</span><small>${d.a}</small></span></summary><div class="body">
 <div class="row"><b>Objawy</b>${d.o}</div><div class="row"><b>Badanie</b>${d.b}</div><div class="row"><b>Diagnostyka</b>${d.dx}</div><div class="row"><b>Leczenie</b>${d.tx}</div>
 <div class="pearl">💎 ${d.p}</div><div class="trap">⚠️ ${d.x}</div></div></details>`).join('');
$('#dcards').insertAdjacentHTML('afterbegin','');
document.head.insertAdjacentHTML('beforeend','<style>details.dc[data-c=a]{border-left-color:var(--amber)}</style>');

/* ---------- Różnicowanie ---------- */
$('#diffTable').innerHTML=`<tr><th></th><th style="color:${C.red}">Guz Wilmsa</th><th style="color:${C.blue}">Neuroblastoma</th><th style="color:${C.amber}">Hepatoblastoma</th><th>Chłoniak Burkitta [11]</th><th>HUS [3][12][15]</th><th>Wgłobienie [1]</th></tr>`+[
 ['Wiek','2–5 lat (szczyt 3–4)','&lt;2 lat (szczyt 2)','&lt;3 lat','4–10 lat','&lt;5 lat','4–7 m.ż. (pula)'],
 ['Guz','duży, niebolesny, zwykle nie przekracza linii środkowej','często przekracza linię, twardy, guzowaty','prawe podżebrze, hepatomegalia','szybko rosnący, często krętniczo-kątniczy','brak guza','walcowaty, napadowy ból'],
 ['Krew w moczu','częsty krwinkomocz/krwiomocz','zwykle mocz prawidłowy','rzadko','rzadko','krwiomocz, AKI','stolec „galaretka malinowa”'],
 ['Ciśnienie','często ↑','czasem ↑ (katecholaminy)','—','—','↑ (AKI)','—'],
 ['Zwapnienia','brak','częste','możliwe','—','—','—'],
 ['Markery','brak swoistych','VMA/HVA, NSE, ferrytyna, MIBG','AFP','LDH, kwas moczowy','↓PLT, schistocyty, kreatynina','USG'],
 ['Przerzuty','płuca','kości, szpik, wątroba, skóra','płuca','OUN, szpik','—','—'],
 ['Perełka z puli','biopsja przeciwwskazana','opsoklonie, raccoon eyes, guz hantlowaty','AFP ↑ u 90%','wg modułu [11]','najmniej prawdopodobne w zestawie z guzem + krwiomoczem','guz + zły stan + napady bólu u 15-mies. = wgłobienie']
].map(r=>`<tr><td><b>${r[0]}</b></td>${r.slice(1).map(x=>`<td>${x}</td>`).join('')}</tr>`).join('');
$('#diffExtra').innerHTML=`<div class="callout blue"><b class="k">Wilms vs neuroblastoma w 5 punktach</b><ul class="tight"><li>wiek: 3–4 lata vs poniżej 2 lat</li><li>guz: gładki, rzadko przekracza linię vs twardy, przekracza linię</li><li>mocz: krwiomocz vs katecholaminy (VMA/HVA)</li><li>zwapnienia: nie vs tak</li><li>pierwszy wybór: TK klatki vs MIBG i szpik</li></ul></div>
<div class="callout amber"><b class="k">Zasada dla zadań „najmniej prawdopodobne”</b>Guz brzucha + krwiomocz: wskaż stan, który nie tworzy guza w USG (HUS). Zakrzepica żyły nerkowej, torbielowatość nerek i ropne zapalenie nerki mogą dawać powiększoną nerkę.</div>`;

/* ---------- Powtarzalność ---------- */
const BARS=[['Neuroblastoma',30],['Guz Wilmsa / nephroblastoma',28],['Osteosarcoma / Ewing',24],['Retinoblastoma',19],['Zespoły (BWS, WAGR)',19],['Guzy zarodkowe, AFP/hCG',15],['Hepatoblastoma, guzy wątroby',13],['Rhabdomyosarcoma',13],['MIBG, N-myc',10],['Biopsja guza nerki',6]];
$('#bars').innerHTML=BARS.map(b=>`<div class="bar"><span>${b[0]}</span><i style="width:${b[1]/30*100}%"></i><b>${b[1]}</b></div>`).join('');

/* ---------- Zadania ---------- */
const L=['A','B','C','D','E'];
const Q=[
{m:'[10]',s:'Pule S2, S3, S4 2025/26; V rok 21/22 (powtarza się ≥6×)',conf:'src',gap:1,
 q:'U 4-letniego dziecka stwierdzono guz nerki. Które postępowanie jest przeciwwskazane?',
 o:['USG jamy brzusznej','biopsja guza','TK jamy brzusznej i klatki piersiowej','pomiar ciśnienia tętniczego','badanie ogólne moczu'],k:1,
 d:'W typowym guzie Wilmsa nie wykonuje się biopsji: naruszenie guza grozi rozsiewem i podniesieniem stopnia. Rozpoznanie opiera się na obrazowaniu (USG → TK/MR) i badaniach towarzyszących (RR, mocz). To najczęściej powtarzane pytanie modułu.',
 zal:'Biopsja guza nerki u dziecka: przeciwwskazana.',akt:'SIOP-UMBRELLA: bez rutynowej biopsji przed chemioterapią; tru-cut tylko w wybranych sytuacjach. COG: pierwotna nefrektomia, a biopsja zmienia stopień na III.'},
{m:'[10][3][12][15]',s:'Pule S2, S4 2025/26, „5 rok (3)”, omówienie grupy A',conf:'inf',x:1,
 q:'Dziecko z guzem w jamie brzusznej i krwiomoczem. Które rozpoznanie jest NAJMNIEJ prawdopodobne?',
 o:['guz Wilmsa','zakrzepica żyły nerkowej','torbielowatość nerek','zespół hemolityczno-mocznicowy','ropne zapalenie nerki'],k:3,
 d:'HUS (biegunka krwista, małopłytkowość, niedokrwistość hemolityczna, AKI) nie tworzy guza w jamie brzusznej. Pozostałe stany mogą dawać powiększoną nerkę i krwiomocz. Omówienie zakładu rozwija właśnie HUS; wyraźnego zaznaczenia klucza w pliku brak.'},
{m:'[10]',s:'Pula V rok 21/22, S2/S3',conf:'src',
 q:'2-letnia dziewczynka z powiększonym brzuchem i krwiomoczem. Najbardziej prawdopodobne rozpoznanie:',
 o:['zespół hemolityczno-mocznicowy','guz Wilmsa','neuroblastoma','ostre kłębuszkowe zapalenie nerek','kamica moczowa'],k:1,
 d:'Wiek 2–5 lat, powiększony obwód brzucha, krwiomocz (często i nadciśnienie) to klasyczny obraz nefroblastoma. Neuroblastoma zwykle nie daje krwiomoczu.'},
{m:'[10]',s:'Pule S2, S4; V rok 21/22',conf:'src',
 q:'2-letnie dziecko z wrodzonym brakiem tęczówki i guzem w jamie brzusznej. Najbardziej prawdopodobne rozpoznanie:',
 o:['neuroblastoma','nephroblastoma','hepatoblastoma','rabdomiosarcoma','chłoniak Burkitta'],k:1,
 d:'Aniridia (zespół WAGR) i hemihipertrofia predysponują do guza Wilmsa. Dzieci z predyspozycją wymagają nadzoru USG co 3 mies.',
 zal:'Aniridia → oznaczenie WT1 (starsze wersje) lub USG co 3 miesiące (wersja 2023/24).',akt:'Sporadyczna aniridia: analiza delecji WT1/PAX6; ryzyko Wilmsa przy delecji WT1 ok. 50%; nadzór USG co 3 mies. do 7.–8. r.ż. (AACR, GeneReviews).'},
{m:'[10]',s:'Pula V rok 21/22',conf:'src',
 q:'Lekarz bada palpacyjnie duży, niebolesny guz w jamie brzusznej nieprzekraczający linii środkowej u kilkuletniego dziecka. Najbardziej prawdopodobne rozpoznanie:',
 o:['neuroblastoma','nefroblastoma','torbiel nerki','hepatoblastoma','wodonercze'],k:1,
 d:'Duży, niebolesny, jednostronny guz nieprzekraczający linii środkowej to Wilms. Przypomnienie praktyczne: badaj jednorazowo i łagodnie, bez ugniatania guza (ryzyko pęknięcia). Neuroblastoma częściej przekracza linię środkową i jest twardsza.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',
 q:'Który z zespołów NIE zwiększa ryzyka wystąpienia guza Wilmsa?',
 o:['zespół WAGR','zespół Beckwitha-Wiedemanna','zespół Denys-Drash','zespół Gardnera','zespół Perlmana'],k:3,
 d:'Gardner (FAP, mutacja APC) predysponuje do raka jelita grubego i hepatoblastoma. Zespoły związane z Wilmsem: WAGR, BWS, Denys-Drash, Perlman, Simpson-Golabi-Behmel.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',
 q:'Który element NIE należy do zespołu WAGR?',
 o:['guz Wilmsa','aniridia','wady układu moczowo-płciowego','opóźnienie rozwoju umysłowego','przerost połowiczy ciała'],k:4,
 d:'WAGR: Wilms tumor, Aniridia, Genitourinary anomalies, Retardation. Przerost połowiczy to odrębna predyspozycja (izolowany, &lt;5%).'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',
 q:'Która z wad współistnieje NAJRZADZIEJ z guzem Wilmsa?',
 o:['aniridia','przerost połowiczy','wady układu moczowo-płciowego','brak kości promieniowej','wnętrostwo'],k:3,
 d:'Aniridia, hemihipertrofia i wady układu moczowo-płciowego to typowe wady towarzyszące. Brak kości promieniowej jest wskazany w kluczu jako wada występująca najrzadziej.'},
{m:'[10]',s:'Pule S1, S3 25/26, grupa B',conf:'src',
 q:'Noworodek z hipoglikemią, makrosomią i makroglosją. Zespół ten zwiększa ryzyko:',
 o:['guza Wilmsa i hepatoblastoma','neuroblastoma i siatkówczaka','ostrej białaczki limfoblastycznej','kostniakomięsaka','glejaków'],k:0,
 d:'Zespół Beckwitha-Wiedemanna (omphalocoele, makroglosja, gigantyzm, hipoglikemia z hiperinsulinizmu): ryzyko nowotworów zarodkowych, głównie Wilms i hepatoblastoma, także RMS.',
 zal:'BWS ~5% wg wykładu; ryzyko Wilms + hepatoblastoma.',akt:'Nadzór: USG jamy brzusznej + AFP co 3 mies. do 4. r.ż., potem USG nerek (AACR 2017).'},
{m:'[10]',s:'Pula S7 2025/26 (#3)',conf:'inf',
 q:'Objawy guza Wilmsa: 1) guz w jamie brzusznej, 2) krwiomocz, 3) bóle brzucha, 4) jadłowstręt, 5) nadciśnienie. Prawdziwe:',
 o:['1, 2, 3','1, 2, 3, 5','1, 3, 4, 5','2, 5','wszystkie'],k:1,
 d:'Wykład zakładu wymienia: powiększenie obwodu brzucha/guz, bóle brzucha, krwinkomocz/krwiomocz, nawracające ZUM, nadciśnienie, zaburzenia pasażu. Jadłowstręt jest raczej cechą neuroblastoma. Klucz w pliku nie jest zaznaczony: odpowiedź wnioskowana z wykładu.'},
{m:'[10]',s:'Pula S7 2025/26 (#12)',conf:'unk',
 q:'Które badania pomagają odróżnić nephroblastoma od neuroblastoma? 1) NSE, 2) VMA/HVA, 3) MIBG, 4) MR, 5) trepanobiopsja szpiku.',
 o:['1','1, 2','1, 2, 3','1, 2, 3, 4','wszystkie'],k:2,
 d:'Swoiste dla neuroblastoma są NSE, katecholaminy w moczu (VMA/HVA) i scyntygrafia MIBG. MR i trepanobiopsja szpiku służą ocenie zaawansowania, a nie różnicowaniu. Klucza nie zaznaczono w pliku; opcje odtworzono z pliku, odpowiedź jest wnioskowana. Sprawdź w zakładzie.'},
{m:'[10]',s:'Pula S1 25/26 (#9), V rok 21/22',conf:'src',
 q:'Neuroblastoma: 1) drugi pod względem częstości guz lity dzieci, 2) najczęstszy nowotwór lity niemowląt, 3) ok. 7% nowotworów dziecięcych, 4) przerzuty u 60–75% przy rozpoznaniu, 5) najczęściej w śródpiersiu. Prawdziwe:',
 o:['1, 2, 3, 4','1, 2, 3, 5','1, 3, 4, 5','2, 3, 4, 5','wszystkie'],k:0,
 d:'Najczęstsza lokalizacja pierwotna to przestrzeń zaotrzewnowa (nadnercze lub zwoje), nie śródpiersie. Szczyt zachorowań przypada na 2. rok życia.'},
{m:'[10]',s:'Pule S1 (zielony), 2023/24 (podświetlenie), V rok 21/22 (czerwony)',conf:'src',gap:1,
 q:'Czynniki gorszego rokowania w neuroblastoma: 1) wiek &lt;12 mies., 2) lokalizacja w tylnym śródpiersiu, 3) brak amplifikacji MYCN, 4) NSE &gt;150 ng/ml, 5) guz z rdzenia nadnerczy.',
 o:['1, 2','1, 3','4, 5','3, 4','2, 5'],k:2,
 d:'Gorzej rokują: NSE &gt;150, LDH &gt;1500, ferrytyna &gt;150, lokalizacja w jamie brzusznej (nadnercze), amplifikacja MYCN. Lepiej: wiek &lt;12–18 mies., tylne śródpiersie. Sformułowanie opcji 1–3 odtworzone; klucz „4, 5” pochodzi z pliku.',
 zal:'Klucz: NSE &gt;150 i rdzeń nadnerczy (4, 5).',akt:'Współczesne grupy ryzyka (COG/INRG): stadium, wiek (próg 18 mies.), histologia INPC, MYCN, wskaźnik DNA; NSE, ferrytyna i LDH mają znaczenie pomocnicze.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',gap:1,
 q:'6-miesięczna dziewczynka: guz nadnercza przekraczający linię środkową, przerzuty do wątroby i skóry, szpik bez nacieku. Stopień zaawansowania neuroblastoma wg INSS:',
 o:['I','II','III','IV','IVS'],k:3,
 d:'W INSS stopień 4S wymaga guza zlokalizowanego (stopień 1 lub 2) z przerzutami do skóry, wątroby i/lub szpiku. Przekroczenie linii środkowej to guz stopnia 3, więc z przerzutami daje IV.',
 zal:'Stopień IV (INSS).',akt:'INRGSS: wiek &lt;18 mies. i przerzuty tylko do skóry, wątroby, szpiku → stadium MS, niezależnie od przekroczenia linii środkowej.'},
{m:'[10]',s:'Pula V rok 21/22',conf:'src',
 q:'14-miesięczny chłopiec: guz przekraczający linię środkową, wytrzeszcz, wylewy okularowe, skaza płytkowa. Rozpoznanie:',
 o:['guz Wilmsa','neuroblastoma, stopień IVS','neuroblastoma, stopień IV','białaczka','rabdomiosarcoma'],k:2,
 d:'Wylewy okularowe i wytrzeszcz (przerzuty do kości oczodołu) są charakterystyczne dla neuroblastoma. Przerzuty do kości = IV (INRGSS: M); IVS dotyczy tylko skóry, wątroby i szpiku.'},
{m:'[10]',s:'Pule S2, S3 25/26 (zakreślone w S3)',conf:'src',gap:1,
 q:'15-miesięczne dziecko z litym guzem jamy brzusznej i zwapnieniami. Które badanie genetyczne jest związane z tym rozpoznaniem?',
 o:['amplifikacja N-myc','mutacja WT1','delecja RB1','translokacja t(11;22)','mutacja TP53'],k:0,
 d:'Guz ze zwapnieniami u niemowlęcia/małego dziecka to neuroblastoma; amplifikacja N-myc jest jego znamiennym markerem genetycznym.',
 zal:'N-myc → neuroblastoma.',akt:'Amplifikacja MYCN jest czynnikiem ryzyka (stratyfikacji), a rozpoznanie wymaga histologii lub nacieku szpiku + podwyższonych katecholamin.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',
 q:'1,5-roczne dziecko z opsoklonią i mioklonią. Najbardziej prawdopodobne rozpoznanie:',
 o:['neuroblastoma','guz Wilmsa','siatkówczak','ostre zapalenie móżdżku','białaczka'],k:0,
 d:'Zespół opsoklonie-mioklonie („tańczące oczy”) jest paraneoplastyczny; około połowy przypadków u dzieci wiąże się z neuroblastoma. Szukaj guza: USG brzucha, RTG klatki, VMA/HVA, MIBG.',
 zal:'Notatki: zespół opsoklonie-mioklonie pogarsza rokowanie.',akt:'Przeżycie w neuroblastoma z OMS jest dobre (guzy zlokalizowane, korzystna biologia), ale u większości zostają następstwa neurologiczne (AAO).'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',
 q:'5-letni chłopiec: przebarwienie wokół oczu, schudł, powiększony brzuch, poci się. Rozpoznanie:',
 o:['neuroblastoma','siatkówczak','guz Wilmsa','białaczka','chłoniak Hodgkina'],k:0,
 d:'Wylewy okularowe („raccoon eyes”) z guzem brzucha i objawami katecholaminowymi (pocenie) to neuroblastoma z przerzutami do kości oczodołu.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst: siatkówczak)',conf:'unk',gap:1,
 q:'5-letni chłopiec: anizokoria, powiększony brzuch (wariant pytania poprzedniego). Rozpoznanie:',
 o:['neuroblastoma','siatkówczak','guz Wilmsa','białaczka','chłoniak'],k:1,
 d:'W pliku jako poprawną zaznaczono odpowiedź B (siatkówczak). Klinicznie anizokoria z guzem brzucha sugeruje raczej zespół Hornera w neuroblastoma, a siatkówczak nie powoduje powiększenia brzucha. Klucz wątpliwy; zgłoś w zakładzie.',
 zal:'Klucz w pliku: B, siatkówczak.',akt:'Anizokoria + guz brzucha → neuroblastoma (Horner); siatkówczak daje leukokorię i zez.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst), S2',conf:'src',
 q:'16-miesięczna dziewczynka z bezbolesnym guzem jamy brzusznej, mocz prawidłowy. Najbardziej prawdopodobne rozpoznanie:',
 o:['guz Wilmsa','neuroblastoma','wgłobienie','hepatoblastoma','torbiel nerki'],k:1,
 d:'Wiek poniżej 2 lat, brak krwiomoczu i nadciśnienia przemawiają za neuroblastoma. Wilms: starsze dziecko, krwiomocz, gładki guz.'},
{m:'[10][1]',s:'Pule S1 25/26 (zielone), S4',conf:'src',x:1,
 q:'15-miesięczny chłopiec od 12 godzin ma napadowe bóle brzucha i wymioty, stan ogólny zły, guz w prawym górnym kwadrancie. Najbardziej prawdopodobne rozpoznanie:',
 o:['wgłobienie','guz Wilmsa','kamica moczowa','mononukleoza','neuroblastoma'],k:0,
 d:'Napady bólu, wymioty, zły stan i walcowaty guz u niemowlęcia to wgłobienie. Guzy lite (Wilms, neuroblastoma) rosną bez ostrego bólu i bez ciężkiego stanu w kilka godzin.'},
{m:'[10][9]',s:'Pule S3 (zakreślone), V rok 21/22, 5 powtórzeń',conf:'src',x:1,
 q:'Dziecko z bólem pleców ustępującym w pozycji siedzącej, skoliozą i oporem przy skłonach. Najbardziej prawdopodobne rozpoznanie:',
 o:['neuroblastoma','guz rdzenia kręgowego','ropień nadtwardówkowy','skolioza idiopatyczna','zapalenie krążka międzykręgowego'],k:1,
 d:'Ból nasilający się w pozycji leżącej i przy Valsalvie (dziecko zasypia siedząc), opór przy skłonach i skolioza to guz rdzenia [9]. Odróżnia go brak guza w jamie brzusznej i brak objawów katecholaminowych.'},
{m:'[10][9]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',x:1,
 q:'Dziewczynka z bólami pleców i osłabieniem nóg; w badaniu wyczuwalny guz w jamie brzusznej. Rozpoznanie:',
 o:['guz rdzenia kręgowego','neuroblastoma (guz hantlowaty)','guz Wilmsa','zespół Guillaina-Barrégo','zapalenie rdzenia'],k:1,
 d:'Neuroblastoma przykręgosłupowe wnika przez otwory międzykręgowe do kanału (guz hantlowaty) i daje niedowład. Guz w brzuchu + objawy rdzeniowe = neuroblastoma. Wymaga pilnego MR kręgosłupa.'},
{m:'[10]',s:'Pule S1, V rok 21/22 (3×)',conf:'src',
 q:'Scyntygrafia z MIBG jest badaniem stosowanym w diagnostyce:',
 o:['neuroblastoma','guza Wilmsa','zapalenia kłębuszków nerkowych','wad układu moczowego','hepatoblastoma'],k:0,
 d:'MIBG-J123 (meta-jodo-benzylo-guanidyna) gromadzi się w guzach wydzielających katecholaminy. Blizny nerkowe ocenia się scyntygrafią DMSA, nie MIBG.'},
{m:'[10]',s:'Pula 2023/24 (podświetlenie), V rok 21/22',conf:'src',
 q:'6-letnia dziewczynka z guzem tylnego śródpiersia. Najbardziej prawdopodobne rozpoznanie:',
 o:['chłoniak Hodgkina','grasiczak','zwojak zarodkowy współczulny','potworniak','torbiel oskrzelopochodna'],k:2,
 d:'Tylne śródpiersie to klasyczna lokalizacja neuroblastoma/zwojaka zarodkowego współczulnego (guz z zwojów współczulnych). Przednie śródpiersie: chłoniaki, guzy zarodkowe [11].'},
{m:'[10]',s:'Pula S4 2026/27 (podświetlenie)',conf:'src',
 q:'Który objaw/wynik NIE jest charakterystyczny dla neuroblastoma?',
 o:['wzrost AFP','wzrost VMA w moczu','wzrost HVA w moczu','wzrost NSE','amplifikacja MYCN'],k:0,
 d:'W neuroblastoma oznacza się VMA/HVA, NSE, ferrytynę, LDH, MYCN. AFP jest markerem hepatoblastoma i guzów zarodkowych.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',
 q:'Najczęstsze lokalizacje guzów zarodkowych u dzieci to:',
 o:['okolica krzyżowo-guziczna, jajnik, jądro','śródpiersie, szyszynka, jądro','jajnik, śródpiersie, zaotrzewnowo','wątroba, śledziona, nerka','OUN, kości, skóra'],k:0,
 d:'Wykład: krzyżowo-guziczna 42%, jajnik 24%, jądro 9%, śródpiersie 7%, szyszynka 6%, zaotrzewnowo 4%.'},
{m:'[10][9]',s:'Pule S4 2026/27 (podświetlenie), S2',conf:'src',x:1,
 q:'U dziecka z guzem okolicy siodłowo-nadsiodłowej diagnostykę rozpoczyna się od oznaczenia:',
 o:['AFP i β-hCG w osoczu i płynie mózgowo-rdzeniowym','ACTH i kortyzolu','VMA i HVA w moczu','LDH i kwasu moczowego','CEA'],k:0,
 d:'Guz zarodkowy tej okolicy wydziela AFP i β-hCG; jeśli markery dodatnie, leczy się radioterapią i chemioterapią (odwrotnie niż w większości guzów OUN). Notatki seminarium.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst); omówienie zakładu',conf:'src',gap:1,
 q:'Podwyższone stężenie którego markera w osoczu jest typowe dla hepatoblastoma?',
 o:['β-hCG','AFP','CEA','NSE','CA-125'],k:1,
 d:'AFP jest podwyższone u ok. 90% dzieci z hepatoblastoma.',
 zal:'AFP ↑ u 90% hepatoblastoma i 80% rak wątrobowokomórkowego.',akt:'PDQ: AFP ↑ u &gt;90% hepatoblastoma i ok. 2/3 HCC; fizjologicznie wysokie u noworodków (t½ 5–7 dni).'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',
 q:'Choroby predysponujące do guzów wątroby: 1) rodzinna zastoinowa marskość, 2) przewlekłe WZW B i C, 3) choroba von Gierkego, 4) niedobór α1-antytrypsyny, 5) wrodzona cystationinuria. Prawdziwe:',
 o:['1, 2','1, 2, 3','1, 2, 3, 4','2, 3, 4, 5','1, 2, 3, 4, 5'],k:4,
 d:'Wszystkie wymienione są na liście wykładu (obok tyrozynemii, marskości żółciowej, hemihipertrofii i androgenów/metotreksatu).'},
{m:'[10]',s:'Pule V rok 21/22, grupa B (omówienie: „w starej puli tak było”)',conf:'unk',gap:1,
 q:'Wady wrodzone mogące towarzyszyć hepatoblastoma: 1) przerost połowiczy, 2) uchyłek Meckela, 3) brak nadnercza, 4) brak nerki, 5) brak kości promieniowej. Prawdziwe:',
 o:['1, 2, 4, 5','1, 3, 4, 5','1, 2, 3, 4','2, 4, 5','2, 3, 4, 5'],k:2,
 d:'Lista z wykładu: przerost połowiczy, uchyłek Meckela, wrodzony brak nadnercza, wrodzony brak nerki, BWS. Brak kości promieniowej nie jest na liście wykładu. Jednak jedna wersja puli zaznacza „deformację kości promieniowej” jako prawidłową; wersje się różnią.',
 zal:'Dwie wersje puli: zaznaczona 1, 2, 3, 4 lub pozycja „deformacja kości promieniowej”.',akt:'Hepatoblastoma wiąże się głównie z BWS, hemihipertrofią i FAP.'},
{m:'[10]',s:'Pula V rok 21/22, S6',conf:'src',
 q:'Biała źrenica (leukokoria) u małego dziecka. Najbardziej prawdopodobne rozpoznanie:',
 o:['siatkówczak','neuroblastoma','jaskra','zapalenie spojówek','zez'],k:0,
 d:'Leukokoria (brak czerwonego odblasku) to klasyczny objaw siatkówczaka; w badaniu: pilne skierowanie do okulisty. Zez u niemowlęcia również wymaga wykluczenia siatkówczaka.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst)',conf:'src',gap:1,
 q:'Wskaż zdanie FAŁSZYWE dotyczące siatkówczaka:',
 o:['może być obustronny','może występować rodzinnie','zez może być objawem','wiąże się z mutacją na chromosomie 5','najczęściej występuje u niemowląt i małych dzieci'],k:3,
 d:'Gen RB1 leży na 13q14. W innym wariancie pytania fałszem jest „rokowanie złe” (rokowanie jest dobre).',
 zal:'W starszych kluczach „leczeniem z wyboru jest radioterapia”.',akt:'Chemioredukcja + leczenie miejscowe/dotętnicze, enukleacja przy dużych guzach; radioterapia zarezerwowana na progresję (PDQ).'},
{m:'[10]',s:'Pula V rok 21/22 (2×)',conf:'src',
 q:'U dziecka po leczeniu dziedzicznego siatkówczaka zwiększone jest ryzyko:',
 o:['kostniakomięsaka i innych mięsaków','guza Wilmsa','neuroblastoma','hepatoblastoma','ziarnicy złośliwej'],k:0,
 d:'Mutacja RB1 w linii zarodkowej zwiększa ryzyko drugich nowotworów, zwłaszcza kostniakomięsaka i mięsaków tkanek miękkich.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony tekst), 3×',conf:'src',x:1,
 q:'4-letnia dziewczynka z krwawieniem z pochwy; w badaniu we wzierniku masy groniaste. Najbardziej prawdopodobne rozpoznanie:',
 o:['rabdomiosarcoma (botryoid)','dysgerminoma','guz pęcherzykowy żółtkowy','polip pochwy','zapalenie pochwy'],k:0,
 d:'Botryoid (groniasty) wariant RMS dotyczy pochwy, pęcherza, nosogardła. Wykład: pochwa, macica: krwawienie i masy groniaste. Wymaga waginoskopii, MR/TK miednicy i biopsji.'},
{m:'[10]',s:'Pula V rok 21/22 (czerwony: 1–5)',conf:'unk',gap:1,
 q:'Rabdomiosarcoma: 1) najczęstszy mięsak tkanek miękkich u dzieci, 2) najczęściej w pęcherzu moczowym, 3) 70% poniżej 10 r.ż., 4) współistnieje z wadami OUN, moczowo-płciowego, pokarmowego, krążenia i chorobą Recklinghausena, 5) rodzinne występowanie nowotworów sutka, tkanek miękkich, mózgu, kory nadnerczy i kości.',
 o:['1, 2, 3','1, 3, 4, 5','1, 2, 3, 4, 5','2, 3, 4','3, 4, 5'],k:2,
 d:'W pliku zaznaczono 1–5. Zdanie 2 jest sprzeczne z wykładem zakładu (głowa i szyja 40%, układ moczowo-płciowy i jama brzuszna 35%); według tego wykładu prawidłowe byłoby 1, 3, 4, 5. Klucz niepewny: zgłoś w zakładzie.',
 zal:'Klucz w pliku: 1–5.',akt:'PDQ: układ moczowo-płciowy ok. 31%, głowa i szyja (parameningeal) ok. 25%; embrionalny 70–75%, alweolarny 20–25% (FOXO1).'},
{m:'[10][11]',s:'Omówienie grupy A (Q23); pula V rok 21/22 (czerwony: „ropień okołomigdałkowy”)',conf:'inf',x:1,gap:1,
 q:'8-letni chłopiec: niebolesny, jednostronnie powiększony migdałek i pakiet węzłów szyjnych. Najbardziej prawdopodobne rozpoznanie:',
 o:['ropień okołomigdałkowy','mononukleoza zakaźna','chłoniak Burkitta','rabdomiosarcoma nosogardła','angina paciorkowcowa'],k:2,
 d:'Jednostronne, niebolesne powiększenie migdałka z węzłami po wykluczeniu ropnia jest sugestywne dla chłoniaka Burkitta (moduł [11]); w wariancie z mową nosową brany jest też pod uwagę RMS nosogardła. W jednym z plików czerwonym oznaczono „ropień okołomigdałkowy”; ropień jest bolesny i z gorączką.',
 zal:'Jedna wersja puli zaznacza ropień okołomigdałkowy.',akt:'Jednostronny niebolesny migdałek u dziecka → biopsja (chłoniak/RMS), nie antybiotykoterapia.'},
{m:'[10]',s:'Pule V rok 21/22 (3×), S4 26/27, 2023/24',conf:'src',
 q:'17-latek: ból kolana, zmiana w przynasadzie dalszej kości udowej, spikule w okostnej, trójkąt Codmana. Rozpoznanie:',
 o:['mięsak Ewinga','kostniakomięsak','zapalenie kości i szpiku','ALL','torbiel kostna'],k:1,
 d:'Kostniakomięsak najczęściej w 2. dekadzie życia, przynasady kości długich (kolano, bark). Spikule i trójkąt Codmana to klasyczne cechy radiologiczne.'},
{m:'[10]',s:'Pula S4 26/27 (podświetlenie), V rok 21/22',conf:'src',
 q:'14-latek z bólem uda; w RTG zmiana w trzonie kości długiej. Najbardziej prawdopodobne rozpoznanie:',
 o:['kostniakomięsak','mięsak Ewinga','chłoniak Burkitta','torbiel tętniakowata','zapalenie kości'],k:1,
 d:'Ewing: 10–20 lat, trzon kości długich i kości płaskie. Ból kostny jako pierwszy objaw mogą dawać także kostniakomięsak i ALL [11].'},
{m:'[10]',s:'Pula S1 25/26 (#21, zielone)',conf:'src',
 q:'Który z nowotworów ma najlepsze rokowanie?',
 o:['guz Wilmsa','neuroblastoma w stopniu IV','rabdomiosarcoma alweolarny','kostniakomięsak z przerzutami','glejak pnia mózgu'],k:0,
 d:'Guz Wilmsa ma bardzo dobre rokowanie (notatki seminarium). Glejak pnia: 5-letnie przeżycie ok. 15%.'},
{m:'[10]',s:'Pula S4 26/27 (podświetlenie)',conf:'src',
 q:'Który z zespołów NIE wiąże się ze zwiększonym ryzykiem nowotworów?',
 o:['zespół Li-Fraumeni','niedokrwistość Fanconiego','ataksja-teleangiektazja','Osteogenesis imperfecta','zespół Blooma'],k:3,
 d:'Zespoły predysponujące (wykład): RB1, Wilms, BWS, Li-Fraumeni, ataksja-teleangiektazja, Bloom, Fanconi, Nijmegen, MEN, FAP, NF1/NF2. Zespół Downa → ALL; Wiskott-Aldrich → NHL.'},
{m:'[10][11]',s:'Pule V rok 21/22, S2 25/26 (3×)',conf:'src',x:1,
 q:'Niemowlę z ciemieniuchą, zmianami osteolitycznymi czaszki, wielomoczem i wytrzeszczem. Rozpoznanie:',
 o:['histiocytoza z komórek Langerhansa','neuroblastoma','białaczka','rabdomiosarcoma','zespół Cushinga'],k:0,
 d:'Wytrzeszcz mogą powodować LCH, neuroblastoma i RMS. Triada czaszka-moczówka-wytrzeszcz przemawia za LCH [11].'},
{m:'[10][11]',s:'Pula S1 25/26 (zielone)',conf:'src',x:1,
 q:'17-latek z niedrożnością i guzem w okolicy krętniczo-kątniczej. Najbardziej prawdopodobne rozpoznanie:',
 o:['zapalenie wyrostka','choroba Leśniowskiego-Crohna','chłoniak nieziarniczy z komórek B','wgłobienie','rak jelita grubego'],k:2,
 d:'U nastolatka guz krętniczo-kątniczy to najczęściej NHL B-komórkowy (Burkitt) [11], a nie rak jelita grubego. Ból brzucha + guz + LDH↑ → biopsja.'}
];
Q.forEach((q,i)=>q.n=i+1);
const state={};let ans=0,good=0;
const CB={src:'KLUCZ Z PLIKU',inf:'KLUCZ WNIOSKOWANY',unk:'KLUCZ NIEPEWNY'};
function renderQ(f){
 const list=Q.filter(q=>f==='all'||q.conf===f||(f==='gap'&&q.gap)||(f==='x'&&q.x));
 $('#quiz').innerHTML=list.map(q=>`<article class="q" id="q${q.n}"><header><span class="n">Zad. ${q.n}</span><span class="mod">${q.m}</span><span class="kb ${q.conf}">${CB[q.conf]}</span><span class="src">${q.s}</span></header>
 <p class="stem">${q.q}</p>
 <div class="opts">${q.o.map((o,i)=>`<button class="opt" data-q="${q.n}" data-i="${i}"><span class="l">${L[i]}.</span><span>${o}</span></button>`).join('')}</div>
 <div class="acts"><button data-show="${q.n}">Pokaż odpowiedź</button></div>
 <div class="disc" id="d${q.n}" hidden>
  <div class="callout ${q.conf==='src'?'green':q.conf==='inf'?'amber':''}"><b class="k">Odpowiedź: ${L[q.k]}. ${q.conf==='unk'?'(klucz niepewny)':q.conf==='inf'?'(wniosek z omówień i wytycznych)':''}</b>${q.d}</div>
  ${q.zal?`<div class="cmp"><div class="a"><b class="k">Pod zaliczenie (wg puli/zakładu)</b>${q.zal}</div><div class="b"><b class="k">Aktualnie klinicznie (wg wytycznych)</b>${q.akt}</div></div>`:''}
 </div></article>`).join('');
 Object.keys(state).forEach(n=>{if(state[n]!==undefined&&$('#q'+n))mark(+n,state[n])});
}
function mark(n,i){
 const q=Q.find(x=>x.n===n),art=$('#q'+n);if(!q||!art)return;
 $$('.opt',art).forEach(b=>{b.disabled=true;const ix=+b.dataset.i;
  if(ix===q.k)b.classList.add(ix===i?'ok':'key');else if(ix===i)b.classList.add('bad');});
 $('#d'+n).hidden=false;
}
$('#quiz').addEventListener('click',e=>{
 const b=e.target.closest('.opt');
 if(b){const n=+b.dataset.q,i=+b.dataset.i;if(state[n]!==undefined)return;state[n]=i;ans++;if(Q.find(x=>x.n===n).k===i)good++;mark(n,i);$('#score').textContent=`Wynik: ${good} / ${ans}`;}
 const s=e.target.closest('[data-show]');
 if(s){const n=+s.dataset.show;if(state[n]===undefined)state[n]=-1;mark(n,state[n]);}
});
renderQ('all');wireFilters('#qFilters',renderQ);

/* ---------- Klucz vs wytyczne ---------- */
const GAP=[
['Biopsja guza nerki','Przeciwwskazana (klucz w wielu pulach)','SIOP-UMBRELLA: bez rutynowej biopsji przed chemioterapią (≥6 m.ż.), tru-cut wybiórczo; COG: pierwotna nefrektomia, biopsja = stopień III'],
['Strategia leczenia Wilmsa','Operacja + chemioterapia (ogólnie)','SIOP: chemioterapia przedoperacyjna; COG: operacja pierwotna. Wiek &lt;6 m.ż. i guz całkowicie torbielowaty: bezpośrednia operacja (SIOP)'],
['Siatkówczak – leczenie','Starsze klucze: radioterapia leczeniem z wyboru','Chemioredukcja + leczenie miejscowe, chemioterapia dotętnicza, enukleacja przy grupie E; radioterapia na progresję (PDQ)'],
['5-latek z anizokorią i powiększonym brzuchem','Klucz w pliku: siatkówczak','Zespół Hornera w neuroblastoma; siatkówczak nie powoduje guza brzucha'],
['Stopniowanie neuroblastoma','INSS: I–IV, IVS','INRGSS: L1, L2, M, MS (&lt;18 mies.); 6-miesięczna z przerzutami do wątroby i skóry → MS (pula: IV)'],
['Amplifikacja N-myc','„Potwierdza” neuroblastoma','Czynnik ryzyka; rozpoznanie: histologia lub szpik + katecholaminy w moczu'],
['Wiek jako czynnik rokowniczy','&lt;12 mies. korzystny (notatki)','Próg 18 mies. w klasyfikacji INRG/COG'],
['Zespół opsoklonie-mioklonie','Notatki: pogarsza rokowanie','Przeżycie dobre, ale następstwa neurologiczne u większości (AAO)'],
['AFP w raku wątrobowokomórkowym','80% (wykład)','PDQ: ok. 2/3 HCC; &gt;90% hepatoblastoma'],
['Aniridia – nadzór','Oznaczenie WT1 lub USG co 3 mies. (wersje)','USG co 3 mies. do 7.–8. r.ż.; analiza WT1/PAX6 przy sporadycznej aniridii (AACR, GeneReviews)'],
['RMS – najczęstsza lokalizacja','Pula: pęcherz; wykład: głowa i szyja 40%, UG 35%','PDQ: UG ok. 31%, głowa-szyja parameningeal ok. 25%; embrionalny 70–75%'],
['Wady z hepatoblastoma','Wersje puli różnią się (brak kości promieniowej)','Najważniejsze: BWS, hemihipertrofia, FAP'],
['Jednostronny migdałek 8-latka','Wersja puli: ropień okołomigdałkowy','Niebolesny migdałek + węzły → chłoniak Burkitta/RMS (biopsja)']
];
$('#gapTable').innerHTML=`<tr><th>Temat</th><th>Pod zaliczenie (wg puli/zakładu)</th><th>Aktualnie klinicznie (wg wytycznych)</th></tr>`+GAP.map(r=>`<tr><td><b>${r[0]}</b></td><td style="background:var(--amber-l)">${r[1]}</td><td style="background:var(--blue-l)">${r[2]}</td></tr>`).join('');

/* ---------- Graf międzymodułowy ---------- */
(function(){
 const N=[['HUS: guz + krwiomocz','[3][12][15]','#2B63AE'],['Wgłobienie, ból brzucha','[1]','#2F8450'],['Guz rdzenia, guz siodłowy','[9]','#6E4CB0'],['Chłoniak, migdałek','[11]','#C23B2A'],['Guz śródpiersia','[11]','#C23B2A'],['LCH, wytrzeszcz','[11]','#C23B2A'],['Nawracające ZUM, krwiomocz','[14]','#2B63AE'],['Wiskott-Aldrich → NHL','[13]','#B8730F'],['Ból kostny vs ALL','[11]','#C23B2A'],['Zespół lizy guza','[5][11]','#2F8450']];
 let s='';const cx=340,cy=240,rx=255,ry=190;
 N.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#B5C0C3" stroke-width="2"/>`;});
 N.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);
  s+=`<rect x="${x-66}" y="${y-22}" width="132" height="44" rx="10" fill="#fff" stroke="${n[2]}" stroke-width="2.5"/><text x="${x}" y="${y-4}" text-anchor="middle" font-size="11" font-weight="700" fill="#13232C">${n[0]}</text><text x="${x}" y="${y+13}" text-anchor="middle" font-size="11" fill="${n[2]}" font-weight="800">${n[1]}</text>`;});
 s+=`<circle cx="${cx}" cy="${cy}" r="52" fill="#0C7A85"/><text x="${cx}" y="${cy-2}" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">[10]</text><text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">guzy lite</text>`;
 $('#crossSvg').innerHTML=s;
})();
$('#traps').innerHTML=[
 ['Guz brzucha + krwiomocz [3][12][15]','Wilms czy HUS? HUS nie daje guza: krwista biegunka, ↓PLT, schistocyty, ↑kreatynina. USG rozstrzyga.'],
 ['Guz brzucha + napadowy ból + zły stan [1]','Niemowlę: wgłobienie, nie nowotwór. Guzy lite rosną bez ostrego bólu.'],
 ['Ból pleców, niedowład [9]','Guz rdzenia (bez guza w brzuchu) vs neuroblastoma hantlowaty (guz w brzuchu/klatce). MR kręgosłupa pilnie.'],
 ['Guz śródpiersia [11]','Przednie: LDH, AFP/β-hCG, chłoniak/zarodkowy; tylne: VMA/HVA, neuroblastoma. RTG klatki przed sedacją.'],
 ['Guz siodłowo-nadsiodłowy [9]','Najpierw AFP i β-hCG w osoczu i PMR; jeśli dodatnie, RT i CTH zamiast chirurgii.'],
 ['Jednostronny migdałek, mowa nosowa [11]','RMS lub chłoniak Burkitta: biopsja, a nie kolejna antybiotykoterapia.'],
 ['Nawracające ZUM lub krwiomocz [14]','Pomyśl o RMS pęcherza lub Wilmsie, szczególnie z nadciśnieniem.'],
 ['Ból kostny [11]','Osteosarcoma, Ewing lub ALL: morfologia z rozmazem, RTG, nie „bóle wzrostowe”.']
].map(t=>`<div class="card" style="padding:.8rem 1rem"><b>${t[0]}</b><p class="small">${t[1]}</p></div>`).join('');
$('#pearls').innerHTML=`<div class="callout red"><b class="k">🚩 Red flags</b><ul class="tight"><li>Leukokoria lub zez u niemowlęcia</li><li>Guz brzucha u dziecka, nawet bezobjawowy</li><li>Węzły &gt;2 cm, twarde, nieprzesuwalne</li><li>Niedowład i ból pleców u dziecka</li><li>Opsoklonie-mioklonie</li><li>Wytrzeszcz i wylewy okularowe</li><li>Ubytek masy &gt;10% w 6 mies., ból kostny, nocny</li></ul></div>
<div class="callout green"><b class="k">💎 Perełki</b><ul class="tight"><li>Zwapnienia w guzie → neuroblastoma, nie Wilms</li><li>Gardner: ryzyko hepatoblastoma, nie Wilms</li><li>Zwapnienia + wiek &lt;2 lat + mocz prawidłowy → neuroblastoma</li><li>Guzy zarodkowe: AFP i β-hCG do monitorowania</li><li>RB1 → osteosarcoma</li><li>Wilms: najlepsze rokowanie</li></ul></div>
<div class="callout amber"><b class="k">⚠️ Pułapki</b><ul class="tight"><li>Ucisk i wielokrotne macanie guza Wilmsa</li><li>Biopsja guza nerki „na zapas”</li><li>Antybiotyki zamiast biopsji przy jednostronnym migdałku</li><li>AFP u noworodka bez normy wiekowej</li><li>Pomylenie guza rdzenia z neuroblastoma</li><li>Stopień IV vs MS (INSS vs INRGSS)</li></ul></div>`;

/* ---------- Źródła ---------- */
const SRC=[
 ['https://pmc.ncbi.nlm.nih.gov/articles/PMC7136175/','SIOP-RTSG UMBRELLA – wytyczne diagnostyki i leczenia guza Wilmsa'],
 ['https://www.cancer.gov/types/kidney/hp/wilms-treatment-pdq','NCI PDQ – leczenie guza Wilmsa'],
 ['https://aacrjournals.org/clincancerres/article/23/13/e115/79988/Surveillance-Recommendations-for-Children-with','AACR 2017 – nadzór u dzieci z predyspozycją do Wilmsa'],
 ['https://www.ncbi.nlm.nih.gov/sites/books/n/gene/wilms-ov/?report=reader','GeneReviews – WT1-related Wilms tumor'],
 ['https://pmc.ncbi.nlm.nih.gov/articles/PMC2650389/','INRG Staging System (neuroblastoma)'],
 ['https://www.cancer.org/cancer/types/neuroblastoma/detection-diagnosis-staging/staging.html','American Cancer Society – stopniowanie neuroblastoma'],
 ['https://www.cancer.gov/types/neuroblastoma/hp/neuroblastoma-treatment-pdq','NCI PDQ – neuroblastoma'],
 ['https://www.cancer.gov/news-events/cancer-currents-blog/2015/dinutuximab-neuroblastoma','NCI – dinutuximab w neuroblastoma (badanie ANBL0032)'],
 ['https://www.aao.org/education/disease-review/opsoclonus-myoclonus-syndrome','AAO – zespół opsoklonie-mioklonie'],
 ['https://www.cancer.gov/types/retinoblastoma/hp/retinoblastoma-treatment-pdq','NCI PDQ – siatkówczak'],
 ['https://www.cancer.gov/types/soft-tissue-sarcoma/hp/rhabdomyosarcoma-treatment-pdq','NCI PDQ – rabdomiosarcoma'],
 ['https://www.cancer.gov/types/bone/hp/osteosarcoma-treatment-pdq','NCI PDQ – kostniakomięsak'],
 ['https://www.cancer.gov/types/bone/hp/ewing-treatment-pdq','NCI PDQ – mięsak Ewinga'],
 ['https://www.cancer.gov/types/liver/hp/child-liver-treatment-pdq','NCI PDQ – nowotwory wątroby u dzieci'],
 ['https://www.cancer.gov/types/extracranial-germ-cell/hp/germ-cell-treatment-pdq','NCI PDQ – pozaczaszkowe guzy zarodkowe'],
 ['https://onlinelibrary.wiley.com/doi/full/10.1002/pbc.24321','SIOP PODC – wytyczne dla guza Wilmsa'],
 ['https://pmc.ncbi.nlm.nih.gov/articles/PMC4728859/','Obrazowanie wstępne w guzie Wilmsa'],
 ['https://onkologia.org.pl/pliki/pl/publikacje/536346/0_krn-2023-book-2024-02-13-pass.pdf','Krajowy Rejestr Nowotworów – raport 2023'],
 ['https://onkologia.org.pl/pliki/pl/publikacje/296411/0.nowotwory-krn-2025-book-20260123.pdf','Krajowy Rejestr Nowotworów – nowotwory u dzieci']
];
$('#srcList').innerHTML=SRC.map(s=>`<li>${A(s[0],s[1])}</li>`).join('');

/* ---------- Nav highlight ---------- */
const links=$$('#navlist a');
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-40% 0px -55% 0px'});
$$('section[id],footer[id]').forEach(s=>io.observe(s));
})();
