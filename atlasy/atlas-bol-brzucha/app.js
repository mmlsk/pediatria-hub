(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';

/* ---------- Organ drawing ---------- */
function organs(){
 return `
 <path d="M60 20 H300 Q345 20 345 65 V365 Q345 412 298 412 H62 Q15 412 15 365 V65 Q15 20 60 20Z" fill="#FBF3EA" stroke="#D9C7B5" stroke-width="2"/>
 <path d="M42 62 Q85 40 152 64 Q168 102 142 136 Q92 152 50 122 Z" fill="#B5533C" opacity=".88"/>
 <ellipse cx="152" cy="142" rx="9" ry="14" fill="#4C9A5F"/>
 <path d="M200 64 Q268 48 302 90 Q302 142 252 142 Q214 137 214 105 Z" fill="#E8A28F"/>
 <ellipse cx="316" cy="105" rx="12" ry="24" fill="#8B3F63"/>
 <path d="M130 162 Q200 142 282 160 L282 172 Q200 162 135 180 Z" fill="#E6C04B"/>
 <ellipse cx="96" cy="208" rx="14" ry="24" fill="#9C6B5B" opacity=".45" stroke="#6b4a3f" stroke-dasharray="3 2"/>
 <ellipse cx="264" cy="208" rx="14" ry="24" fill="#9C6B5B" opacity=".45" stroke="#6b4a3f" stroke-dasharray="3 2"/>
 <path d="M72 330 L72 188 Q180 218 288 188 L288 322 Q262 352 232 330" fill="none" stroke="#C98B3C" stroke-width="15" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>
 <path d="M122 244 Q150 226 180 244 T240 244 Q252 266 222 270 T152 278 Q120 288 132 308 T200 320 Q236 324 226 302" fill="none" stroke="#E58B6E" stroke-width="10" stroke-linecap="round"/>
 <circle cx="72" cy="338" r="13" fill="#C98B3C"/>
 <path d="M72 350 Q58 374 80 384" fill="none" stroke="#8C5A2B" stroke-width="5" stroke-linecap="round"/>
 <ellipse cx="180" cy="392" rx="28" ry="15" fill="#8EC3E8"/>
 <circle cx="118" cy="368" r="8" fill="#C8A1E0"/><circle cx="242" cy="368" r="8" fill="#C8A1E0"/>`;
}
const hero=$('#heroSvg'); hero.setAttribute('viewBox','0 0 360 430'); hero.innerHTML=organs()+
 `<g font-size="11" fill="#13232C" font-weight="700"><text x="64" y="104">wątroba</text><text x="226" y="100">żołądek</text><text x="322" y="150" text-anchor="end">śledz.</text><text x="180" y="170" text-anchor="middle" font-size="10">trzustka</text><text x="150" y="258" font-size="10">jelito cienkie</text><text x="96" y="394" font-size="10" text-anchor="end">wyrostek</text><text x="180" y="396" text-anchor="middle" font-size="10" fill="#0b3d5c">pęcherz</text></g>`;

/* ---------- Region map ---------- */
const REG=[
 {n:'Prawe podżebrze',i:[['i','Zapalenie wątroby, hepatomegalia'],['i','Kamica i zapalenie pęcherzyka żółciowego (sferocytoza, mukowiscydoza)'],['e','Zapalenie płuc prawego dolnego płata, opłucnej'],['i','Wrzód dwunastnicy']]},
 {n:'Nadbrzusze',i:[['i','Zapalenie żołądka, H. pylori, choroba wrzodowa [6]'],['i','Zapalenie trzustki'],['f','Dyspepsja czynnościowa'],['s','Zwężenie odźwiernika (niemowlę)'],['e','Kwasica ketonowa (DKA) [5]']]},
 {n:'Lewe podżebrze',i:[['i','Powiększenie lub pęknięcie śledziony (uraz, mononukleoza, choroby rozrostowe)'],['e','Zapalenie płuc lewego dolnego płata'],['i','Ogon trzustki']]},
 {n:'Prawy bok',i:[['i','Kamica nerkowa, odmiedniczkowe zapalenie nerek [14]'],['s','Guz nerki (Wilms) [10]'],['s','Wgłobienie: guz w prawym górnym kwadrancie'],['i','Zaparcie (okrężnica wstępująca)']]},
 {n:'Okolica pępka',i:[['s','Wczesne zapalenie wyrostka (ból trzewny)'],['i','Zapalenie węzłów krezkowych, jersinioza'],['i','Gastroenteritis, zaparcie'],['f','Czynnościowy ból brzucha (najczęstszy)'],['i','IgAV [12]'],['s','Niedrożność jelita cienkiego, malrotacja']]},
 {n:'Lewy bok',i:[['i','Kamica nerkowa, zapalenie nerek'],['i','Zaparcie (okrężnica zstępująca)'],['s','Guz nerki lub nadnercza (neuroblastoma) [10]']]},
 {n:'Prawy dół biodrowy',i:[['s','Zapalenie wyrostka robaczkowego'],['i','Choroba Leśniowskiego-Crohna, jersinioza (ileitis) [7]'],['s','Wgłobienie krętniczo-kątnicze, chłoniak B (guz) [11]'],['s','Uwięźnięta przepuklina pachwinowa'],['s','Skręt jajnika, ciąża pozamaciczna'],['s','Skręt jądra (ból przeniesiony)']]},
 {n:'Podbrzusze',i:[['i','Zapalenie pęcherza, ZUM [14]'],['i','Zaparcie, zatrzymanie moczu'],['s','Zapalenie przydatków, ciąża, dysmenorrhea'],['s','Skręt jajnika lub jądra']]},
 {n:'Lewy dół biodrowy',i:[['i','Zaparcie (masy kałowe w esicy)'],['i','Wrzodziejące zapalenie jelita grubego [7]'],['s','Skręt jajnika, przepuklina'],['s','Skręt jądra']]}
];
const LBL={s:'chirurgiczne',i:'internistyczne',e:'pozabrzuszne',f:'czynnościowe'};
const ms=$('#mapSvg'); ms.innerHTML=organs();
const gx=[30,130,230], gy=[30,153,277];
REG.forEach((r,k)=>{
  const c=k%3, rw=Math.floor(k/3);
  const g=document.createElementNS(NS,'rect');
  g.setAttribute('x',gx[c]);g.setAttribute('y',gy[rw]);g.setAttribute('width',100);g.setAttribute('height',rw==2?123:123);
  g.setAttribute('class','reg');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',r.n);g.dataset.k=k;
  ms.appendChild(g);
  const t=document.createElementNS(NS,'text');t.setAttribute('x',gx[c]+8);t.setAttribute('y',gy[rw]+18);t.setAttribute('font-size','13');t.setAttribute('font-weight','800');t.setAttribute('fill','#075760');t.textContent=k+1;t.style.pointerEvents='none';ms.appendChild(t);
});
function showReg(k){
  $$('.reg',ms).forEach(e=>e.classList.toggle('on',e.dataset.k==k));
  const r=REG[k];
  $('#regionPanel').innerHTML=`<div class="eyebrow">Region ${k+1} z 9</div><h3>${r.n}</h3><p class="small" style="margin:.3rem 0 .7rem">Przyczyny do rozważenia (legenda: <span class="rl s">chirurgiczne</span><span class="rl i">internistyczne</span><span class="rl e">pozabrzuszne</span><span class="rl f">czynnościowe</span>)</p><ul class="rlist" style="list-style:none">${r.i.map(x=>`<li><span class="rl ${x[0]}">${LBL[x[0]]}</span>${x[1]}</li>`).join('')}</ul><p class="small" style="margin-top:.8rem">Pamiętaj: lokalizacja u dzieci poniżej 3 lat jest niewiarygodna, a ból przeniesiony (płuca, jądra, kręgosłup) bywa odczuwany w brzuchu.</p>`;
}
ms.addEventListener('click',e=>{const t=e.target.closest('.reg');if(t)showReg(+t.dataset.k)});
ms.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset.k){e.preventDefault();showReg(+e.target.dataset.k)}});
showReg(6);

/* ---------- Embryology SVG ---------- */
$('#embSvg').innerHTML=`
<rect x="20" y="14" width="170" height="272" rx="40" fill="#FBF3EA" stroke="#D9C7B5" stroke-width="2"/>
<rect x="34" y="40" width="142" height="62" rx="12" fill="#F1B8AE" opacity=".8"/>
<rect x="34" y="112" width="142" height="62" rx="12" fill="#A9D8DB" opacity=".9"/>
<rect x="34" y="184" width="142" height="62" rx="12" fill="#CBBDEB" opacity=".9"/>
<circle cx="105" cy="143" r="7" fill="#075760"/><text x="105" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#075760">1</text>
<circle cx="150" cy="215" r="7" fill="#C23B2A"/><text x="150" y="236" text-anchor="middle" font-size="11" font-weight="700" fill="#C23B2A">2</text>
<path d="M112 146 Q140 170 146 206" fill="none" stroke="#13232C" stroke-width="2" stroke-dasharray="4 3"/>
<g font-size="13" fill="#13232C">
<text x="206" y="62" font-weight="800">Jelito przednie</text><text x="206" y="80" font-size="12" fill="#44545D">przełyk, żołądek, dwunastnica,</text><text x="206" y="96" font-size="12" fill="#44545D">wątroba, trzustka → nadbrzusze</text>
<text x="206" y="134" font-weight="800">Jelito środkowe</text><text x="206" y="152" font-size="12" fill="#44545D">jelito cienkie, wyrostek,</text><text x="206" y="168" font-size="12" fill="#44545D">okrężnica wstępująca → pępek</text>
<text x="206" y="206" font-weight="800">Jelito tylne</text><text x="206" y="224" font-size="12" fill="#44545D">okrężnica zstępująca, esica,</text><text x="206" y="240" font-size="12" fill="#44545D">odbytnica → podbrzusze</text>
<text x="206" y="266" font-size="12" fill="#075760" font-weight="700">1 → 2: migracja bólu</text><text x="206" y="282" font-size="12" fill="#075760" font-weight="700">w zapaleniu wyrostka</text></g>`;

/* ---------- Heat grid ---------- */
const AGES=['Noworodek','Niemowlę','1–5 lat','6–11 lat','12–18 lat'];
const HEAT=[
 ['s','Chirurgiczne i urazowe',null],
 ['s','Malrotacja ze skrętem (wymioty żółciowe)',[3,2,1,1,0]],
 ['s','Wady wrodzone: atrezje, Hirschsprung, smółkowa niedrożność',[3,1,0,0,0]],
 ['s','Zwężenie odźwiernika (2.–12. tydz.)',[1,3,0,0,0]],
 ['s','Wgłobienie',[0,3,2,1,0]],
 ['s','Uwięźnięta przepuklina pachwinowa',[2,3,2,1,1]],
 ['s','Zapalenie wyrostka robaczkowego',[0,1,2,3,3]],
 ['s','Uchyłek Meckela',[0,2,3,1,0]],
 ['s','Skręt jądra lub jajnika',[1,0,1,2,3]],
 ['s','Uraz, przemoc',[1,2,2,2,2]],
 ['i','Internistyczne',null],
 ['i','Zapalenie żołądka i jelit',[1,3,3,3,2]],
 ['i','Zaparcie czynnościowe',[0,2,3,3,3]],
 ['i','ZUM, odmiedniczkowe zapalenie nerek',[2,3,3,2,2]],
 ['i','IgAV',[0,0,3,3,1]],
 ['i','HUS',[0,1,3,2,1]],
 ['i','Zapalenie węzłów krezkowych, jersinioza',[0,0,2,3,2]],
 ['i','Nieswoiste zapalenia jelit',[0,0,0,2,3]],
 ['i','Choroba wrzodowa, H. pylori, dyspepsja',[0,0,1,2,3]],
 ['i','Celiakia, alergia pokarmowa',[0,2,2,2,1]],
 ['i','Zapalenie trzustki, kamica żółciowa',[0,0,1,2,2]],
 ['i','Mukowiscydoza (niedrożność smółkowa, DIOS)',[3,0,1,2,2]],
 ['i','Nowotwory (Wilms, neuroblastoma, chłoniak)',[0,1,3,2,2]],
 ['i','Ginekologiczne (PID, ciąża, torbiel)',[0,0,0,1,3]],
 ['e','Pozabrzuszne',null],
 ['e','Zapalenie płuc, angina',[0,1,3,3,2]],
 ['e','Kwasica ketonowa (DKA)',[0,1,2,3,3]],
 ['f','Czynnościowe',null],
 ['f','Kolka niemowlęca (poniżej 5. mies.)',[0,3,0,0,0]],
 ['f','Czynnościowy ból brzucha, IBS, migrena brzuszna',[0,0,1,3,3]],
 ['f','Przyczyny psychospołeczne, stres szkolny',[0,0,1,3,3]]
];
const DOTS=['·','●','●●','●●●'];
function renderHeat(f){
  let h=`<tr><th>Rozpoznanie</th>${AGES.map(a=>`<th>${a}</th>`).join('')}</tr>`;
  HEAT.forEach(r=>{
    if(f!=='all'&&r[0]!==f)return;
    if(r[2]===null){ if(f==='all') h+=`<tr class="grp"><td colspan="6">${r[1]}</td></tr>`; return;}
    h+=`<tr><td>${r[1]}</td>${r[2].map((v,k)=>`<td class="c${v}" data-s="${r[0]}" title="${AGES[k]}: ${['rzadkie','rzadkie','możliwe','typowe'][v]}">${DOTS[v]}</td>`).join('')}</tr>`;
  });
  $('#heat').innerHTML=h;
}
renderHeat('all');
function wireFilters(id,cb){
  $$('button',$(id)).forEach(b=>b.addEventListener('click',()=>{
    $$('button',$(id)).forEach(x=>x.setAttribute('aria-pressed',x===b));cb(b.dataset.f);
  }));
}
wireFilters('#heatFilters',renderHeat);

/* ---------- Tabs ---------- */
$$('#examTabs button').forEach(b=>b.addEventListener('click',()=>{
  $$('#examTabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
  ['p1','p2','p3','p4'].forEach(p=>{$('#'+p).hidden=p!==b.dataset.p});
}));

/* ---------- Disease cards ---------- */
const D=[
{c:'s',e:'🔪',t:'Zapalenie wyrostka robaczkowego',m:'[1]',a:'najczęściej 6–18 lat; poniżej 3 lat rzadkie, częstsza perforacja',
 k:'Ból trzewny okołopępkowy → somatyczny w prawym dole biodrowym, jadłowstręt, nieliczne wymioty po bólu, stan podgorączkowy (zwykle do 38,5 °C), niechęć do ruchu i kuśtykanie.',
 d:'PAS (kalkulator poniżej), morfologia i CRP, mocz. <b>USG jako badanie pierwszego rzutu</b>; MR lub CT przy niejasnym USG w ośrodku z dostępem.',
 x:'Appendektomia (zwykle laparoskopowa). WSES 2020 dopuszcza u wybranych chorych z niepowikłanym zapaleniem leczenie zachowawcze antybiotykami po omówieniu ryzyka niepowodzenia (<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7386163/" target="_blank" rel="noopener noreferrer">WSES 2020</a>).',
 p:'Wymioty po bólu, ból przy kaszlu i skakaniu, migracja bólu.',
 tr:'Angina, zapalenie płuc, ZUM i gastroenteritis naśladują początek choroby. W puli pojawia się głównie jako dystraktor.'},
{c:'s',e:'🌀',t:'Wgłobienie jelita',m:'[1]',a:'szczyt: 4–7 m.ż. (zakład); 5–9 mies. (BSUH); 3 mies.–3 lata (ACEP)',
 k:'Napadowy, kolkowy ból z krzykiem i podkurczaniem nóg, wymioty, bladość i apatia między napadami, guz „kiełbasowaty” (walcowaty twór), stolec jak „malinowa galaretka” (ok. 60% wg wykładu). Okresy: ostry wstrząs otrzewnowy, skąpe objawy, niedrożność porażenna. Ok. 70% to postać okolicy kątnicy, najczęstsza niedrożność mechaniczna niemowląt.',
 d:'<b>USG</b> (objaw tarczy, „pseudo-nerka”; czułość 98–100%). Nie trzeba głodzić przed USG. RTG wykazuje objaw tarczy lub sierpa (<a href="https://www.acep.org/pediatrics/newsroom/2025/intussusception" target="_blank" rel="noopener noreferrer">ACEP</a>, <a href="https://www.bsuh.nhs.uk/library/wp-content/uploads/sites/8/2020/08/Paediatric-guidelines-intussusception-and-air-enema-reduction-2019.pdf" target="_blank" rel="noopener noreferrer">BSUH</a>).',
 x:'Repozycja: doodbytnicza insuflacja powietrza pod kontrolą fluoroskopii (skuteczniejsza niż kontrastowa); przeciwwskazanie: odma otrzewnowa. Operacja przy niepowodzeniu, perforacji lub zapaleniu otrzewnej.',
 p:'Czynniki: zbyt długa krezka, uchyłek Meckela, polipy, IgAV. Powikłanie IgAV (3–4% chorych).',
 tr:'U starszego dziecka lub przy nawrotach szukaj punktu prowadzącego. W IgAV często postać krętniczo-kręta, dlatego potrzebny doświadczony ultrasonografista dziecięcy.'},
{c:'s',e:'🫗',t:'Przerostowe zwężenie odźwiernika',m:'[1]',a:'2.–12. tydzień życia; 1:5000; 4× częściej chłopcy',
 k:'Chlustające wymioty niebarwione żółcią po każdym karmieniu, głodne dziecko, spadek lub brak przyrostu masy, odwodnienie. Widoczna fala perystaltyczna L→P, „oliwka” nad pępkiem po prawej. Wywiad rodzinny dodatni.',
 d:'<b>USG</b>: grubość mięśnia ≥ 4 mm, kanał odźwiernika wydłużony (&gt; 16–18 mm). Gazometria i jonogram: zasadowica metaboliczna hipochloremiczna i hipokaliemiczna (<a href="https://www.amboss.com/us/knowledge/hypertrophic-pyloric-stenosis" target="_blank" rel="noopener noreferrer">AMBOSS</a>).',
 x:'Głodzenie, nawodnienie dożylne i wyrównanie elektrolitów, następnie pyloromiotomia (Ramstedt). Przeciwwskazaniem do zabiegu jest niewyrównane nawodnienie i zaburzenia elektrolitowe.',
 p:'Nerka w hipowolemii zatrzymuje Na⁺ kosztem H⁺ i K⁺: paradoksalnie kwaśny mocz mimo zasadowicy.',
 tr:'Pula: „zasadowica hiperchloremiczna” jest błędna. „Operacja doraźna” to operacja pilna, ale dopiero po wyrównaniu zaburzeń.'},
{c:'s',e:'🚨',t:'Malrotacja i skręt jelita środkowego',m:'[1][5]',a:'głównie noworodki i niemowlęta, ale każdy wiek',
 k:'Nagłe wymioty żółciowe u dotąd zdrowego noworodka, później wzdęcie, krew w stolcu, wstrząs (niedokrwienie).',
 d:'Pilny pasaż górnego odcinka przewodu pokarmowego z kontrastem; USG z oceną układu naczyń krezkowych.',
 x:'Pilna operacja (Ladd). Równolegle stabilizacja i płyny.',
 p:'Zielone wymioty u noworodka = stan nagły chirurgiczny do wykluczenia.',
 tr:'Nie czekaj na RTG przeglądowe; pozornie zdrowe dziecko może mieć już martwicę.'},
{c:'s',e:'🧱',t:'Choroba Hirschsprunga',m:'[1][3]',a:'noworodek, niemowlę; 1:5000; chłopcy 4×',
 k:'Noworodek: brak lub opóźnione oddanie smółki, niska niedrożność. Niemowlę: przewlekłe zaparcia z nawracającą niedrożnością, okresowo obfite, gliniaste, cuchnące stolce. Brak zwojów (układ NANC, NO) w dystalnym odcinku esicy i odbytnicy w formie klasycznej.',
 d:'Badanie per rectum (wytrysk stolca po wyjęciu palca), lewatywa kontrastowa, biopsja ssąca odbytnicy.',
 x:'Operacja (usunięcie odcinka bez zwojów); wcześniej odbarczenie.',
 p:'Zespół Downa i wywiad rodzinny to sygnały ostrzegawcze (wykład).',
 tr:'Ujawnienie się „najczęściej w 2. r.ż.” jest nieprawdziwe.'},
{c:'s',e:'🩸',t:'Uchyłek Meckela',m:'[1]',a:'najczęściej do 2. r.ż.',
 k:'Obecny u ok. 2% populacji, ok. 60 cm od zastawki krętniczo-kątniczej; w 30–50% ektopowa tkanka żołądka, dwunastnicy lub trzustki. Powikłania: bezbolesne krwawienia, zapalenie lub perforacja („ostry brzuch”), wgłobienie z niedrożnością.',
 d:'Scyntygrafia z nadtechnecjanem (Tc-99m); USG, morfologia.',
 x:'Wycięcie uchyłka.',
 p:'Bezbolesne krwawienie z dolnego odcinka u małego dziecka.',
 tr:'Może imitować zapalenie wyrostka.'},
{c:'s',e:'🥚',t:'Skręt jądra i jajnika, uwięźnięta przepuklina',m:'[1]',a:'jądro: noworodek (zewnątrzosłonkowy) i dojrzewanie (wewnątrzosłonkowy)',
 k:'Nagły jednostronny ból moszny promieniujący do pachwiny i podbrzusza, nudności i wymioty, jądro uniesione, moszna obrzęknięta i bardzo tkliwa. Jajnik: nagły ból podbrzusza z wymiotami. Przepuklina: bolesny guz w pachwinie, wymioty.',
 d:'USG Doppler; w skręcie jądra nie opóźniaj eksploracji chirurgicznej.',
 x:'Pilna operacja; ratowanie narządu zależy od czasu (godziny).',
 p:'Zbadaj genitalia u każdego dziecka z bólem brzucha.',
 tr:'U nastolatków ból brzucha może być jedyną skargą.'},
{c:'i',e:'🟣',t:'Zapalenie naczyń z IgA (Schönlein-Henoch)',m:'[1][12][4]',a:'dzieci 3–15 lat',
 k:'Plamica palpacyjna na kończynach dolnych i pośladkach, obrzęk i ból stawów, kolkowy ból brzucha, krew w stolcu, krwinkomocz. Powikłania jelitowe: wgłobienie, niedokrwienie, perforacja, krwotok.',
 d:'Mocz (krwinkomocz, białkomocz), ciśnienie, USG przy silnym bólu (wykluczyć wgłobienie), kreatynina.',
 x:'Leczenie objawowe, nawodnienie, przeciwbólowo (raczej paracetamol niż NLPZ przy zajęciu nerek lub przewodu pokarmowego). Glikokortykosteroidy rozważ przy ciężkim bólu lub krwawieniu po wykluczeniu wgłobienia (prednizolon 1–2 mg/kg/d przez 1–2 tyg.) (<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11671997/" target="_blank" rel="noopener noreferrer">zalecenia 2024</a>).',
 p:'Ból brzucha bywa pierwszym objawem, przed wysypką.',
 tr:'Wysypka sama nie jest wskazaniem do GKS (pytanie z puli). GKS nie zapobiegają zapaleniu nerek.'},
{c:'i',e:'💧',t:'Zespół hemolityczno-mocznicowy (STEC-HUS)',m:'[1][3][12][15]',a:'najczęściej 1–5 lat',
 k:'Prodrom: biegunka (często krwista), wymioty, ból brzucha; po 5–10 dniach nagłe pogorszenie, bladość z żółtawym odcieniem, małopłytkowość, skaza krwotoczna, oliguria, krwiomocz, nadciśnienie, objawy z OUN.',
 d:'Niedokrwistość hemolityczna z schistocytami, małopłytkowość, kreatynina, LDH, mocz. Test Coombsa ujemny.',
 x:'Wspomagające: ostrożne nawodnienie, kontrola ciśnienia, leczenie nerkozastępcze wg wskazań. Unikaj antybiotyków, leków przeciwbiegunkowych (loperamid) i NLPZ przy krwistej biegunce.',
 p:'Triada: niedokrwistość hemolityczna + małopłytkowość + AKI.',
 tr:'Guz brzucha z krwinkomoczem u 3-latka: HUS jest najmniej prawdopodobny (pytanie z puli).'},
{c:'i',e:'🦠',t:'Jersinioza i zapalenie węzłów krezkowych',m:'[1][3][7]',a:'dzieci w wieku szkolnym',
 k:'Biegunka wodnista lub krwista, ból w prawym dole biodrowym (naśladuje zapalenie wyrostka lub chorobę Crohna), gorączka, możliwy rumień guzowaty i zapalenie stawów, pogrubienie końcowego odcinka jelita krętego, powiększone węzły krezki w USG.',
 d:'Posiew kału na specjalnej pożywce, serologia (IgM, IgG, IgA), USG.',
 x:'Najczęściej wspomagające. Notatka zakładu wymienia sulfametoksazol z trimetoprimem, ampicylinę, gentamycynę i ciprofloksacynę (&gt; 16 lat); klinicznie pamiętaj, że Y. enterocolitica bywa oporna na ampicylinę, więc kieruj się antybiogramem.',
 p:'Objawy stawowe mogą utrzymywać się miesiące po biegunce.',
 tr:'Różnicowanie z Crohnem: czas trwania, kalprotektyna, objawy pozajelitowe, zahamowanie wzrostu.'},
{c:'i',e:'🔥',t:'Nieswoiste zapalenia jelit',m:'[1][7]',a:'najczęściej nastolatki',
 k:'Przewlekłe bóle brzucha, biegunka (krwista w WZJG), utrata masy, zahamowanie wzrostu, zmiany okołoodbytnicze, afty, rumień guzowaty, zapalenie błony naczyniowej, bóle stawów.',
 d:'Kalprotektyna, CRP, OB, morfologia, albumina; ileokolonoskopia z biopsją, enterografia MR.',
 x:'Gastroenterolog dziecięcy [7].',
 p:'Zahamowanie wzrastania mocniej wiąże się z chorobą Crohna.',
 tr:'Wywiad rodzinny IBD jest cechą alarmową.'},
{c:'i',e:'🎗️',t:'Chłoniak nieziarniczy B (guz krętniczo-kątniczy)',m:'[1][11]',a:'wiek szkolny i nastolatki',
 k:'Szybko rosnący guz w prawym dole biodrowym, niedrożność, wgłobienie z punktem prowadzącym, objawy ogólne.',
 d:'USG, MR lub CT, biopsja, LDH i kwas moczowy; ryzyko zespołu lizy guza.',
 x:'Chemioterapia w ośrodku onkologicznym; profilaktyka zespołu lizy guza.',
 p:'Pula: guz krętniczo-kątniczy u 13–17-latka = NHL z komórek B.',
 tr:'Nie myl z chorobą Crohna i zapaleniem wyrostka.'},
{c:'i',e:'🫘',t:'Guz Wilmsa i neuroblastoma',m:'[1][10]',a:'zwykle do 5. r.ż.',
 k:'Wilms: najczęstszy guz jamy brzusznej u dzieci; guz ok. 90%, ból ok. 20%, krwiomocz ok. 30%, nadciśnienie; aniridia, przerost połowiczy. Neuroblastoma: guz twardy, guzowaty, przekracza linię pośrodkową.',
 d:'USG, następnie MR lub CT; w neuroblastoma markery (katecholaminy), MIBG i MYCN.',
 x:'Leczenie w ośrodku onkologicznym.',
 p:'Przerost połowiczy lub aniridia → Wilms.',
 tr:'Nie uciskaj guza wielokrotnie.'},
{c:'i',e:'🚽',t:'Zaparcie czynnościowe',m:'[1][14]',a:'każdy wiek, szczyt: trening czystości',
 k:'Ponad 90% zaparć to czynnościowe. Rzadkie stolce, bolesne wypróżnienia, zatrzymywanie stolca, masy kałowe w odbytnicy, nietrzymanie stolca z przepełnienia.',
 d:'Wywiad i badanie z oceną odbytu; per rectum; alarmy: opóźnione oddanie smółki, zahamowanie wzrostu, krew.',
 x:'Edukacja, makrogole jako leki z wyboru, dłuższe leczenie podtrzymujące.',
 p:'Zaparcie i dysfunkcja pęcherza sprzyjają nawracającym ZUM [14].',
 tr:'„Organiczna w 50%” to fałsz.'},
{c:'i',e:'🔥',t:'Choroba wrzodowa, H. pylori, celiakia',m:'[6][3]',a:'dzieci starsze i nastolatki',
 k:'Epigastralgia, nocne budzenie, wymioty krwią, melena, anemia. Celiakia: ból, wzdęcie, biegunka, niedożywienie, aftowe zapalenie jamy ustnej.',
 d:'Endoskopia przy cechach alarmowych; anty-tTG IgA; nie badaj H. pylori przy czynnościowym bólu brzucha.',
 x:'Terapia eradykacyjna wg kryteriów Maastricht i ESPGHAN [6]; dieta bezglutenowa [3].',
 p:'Wrzód dwunastnicy zwykle z nadmierną sekrecją kwasu.',
 tr:'Nie każdy ból brzucha to H. pylori.'},
{c:'e',e:'🫁',t:'Zapalenie dolnego płata płuca, angina',m:'[2]',a:'1–11 lat',
 k:'Gorączka, ból brzucha bez objawów otrzewnowych, tachypnoe, kaszel; ból gardła i wysypka w anginie paciorkowcowej.',
 d:'Osłuchiwanie, RTG klatki, szybki test na paciorkowca.',
 x:'Leczenie przyczynowe [2].',
 p:'W razie gorączki z bólem brzucha bez cech otrzewnowych szukaj płuc i dróg moczowych.',
 tr:'Operowanie „ostrego brzucha” bez zbadania klatki piersiowej.'},
{c:'e',e:'🍬',t:'Kwasica ketonowa (DKA)',m:'[5]',a:'nowa cukrzyca typu 1, 5–18 lat',
 k:'Ból brzucha, wymioty, poliuria, polidypsja, oddech Kussmaula, zapach acetonu, odwodnienie.',
 d:'Glikemia, ketony, gazometria.',
 x:'Insulina i płyny wg protokołu; ostrożnie z objętością (obrzęk mózgu) [5].',
 p:'Pseudo-„ostry brzuch”.',
 tr:'Pominięcie glikemii w badaniu przy ostrym bólu brzucha.'},
{c:'e',e:'🧪',t:'ZUM i odmiedniczkowe zapalenie nerek',m:'[14]',a:'niemowlęta do nastolatków',
 k:'U niemowląt objawy niespecyficzne (gorączka, wymioty, słabe jedzenie), u starszych dyzuria i ból w podbrzuszu lub lędźwiach.',
 d:'Prawidłowo pobrany mocz (cewnik lub środkowy strumień) przed antybiotykiem, USG, wskazania do CUM.',
 x:'Antybiotyk empiryczny wg lokalnej wrażliwości [14].',
 p:'Brak leukocytów w moczu = brak stanu zapalnego pęcherza; szukaj innej przyczyny gorączki.',
 tr:'Zaparcia i dysfunkcja pęcherza jako czynniki ryzyka.'},
{c:'f',e:'🧠',t:'Czynnościowy ból brzucha (Rome IV)',m:'[1]',a:'4–18 lat; 10–15% populacji (wykład)',
 k:'Ból kolkowy lub nękający, bez jasnej lokalizacji, często w okolicy pępka, w dzień, nasilany w spoczynku, niepokój ruchowy, brak cech alarmowych.',
 d:'Brak cech alarmowych, prawidłowe badanie i kał na krew ujemny często wystarczają do rozpoznania bez dalszej diagnostyki (AAP/NASPGHAN).',
 x:'Edukacja, regularny tryb życia, leczenie zaparcia, wsparcie psychologiczne; kolka niemowlęca: wyjaśnienie, brak dowodów na rutynowe leki.',
 p:'Najczęstsza przyczyna przewlekłego bólu.',
 tr:'Rozpoznanie czynnościowe po wykluczeniu cech alarmowych, nie zamiast nich.'}
];
function renderD(f){
  $('#dcards').innerHTML=D.filter(d=>f==='all'||d.c===f).map(d=>`
  <details class="dc" data-c="${d.c}"><summary><span class="em">${d.e}</span><span class="t">${d.t}<small>${d.m} · ${d.a}</small></span></summary>
  <div class="body">
   <p class="row"><b>Obraz</b> ${d.k}</p>
   <p class="row"><b>Diagnostyka</b> ${d.d}</p>
   <p class="row"><b>Postępowanie</b> ${d.x}</p>
   <p class="pearl">💎 ${d.p}</p>
   <p class="trap">⚠️ ${d.tr}</p>
  </div></details>`).join('');
}
renderD('all'); wireFilters('#dFilters',renderD);

/* ---------- Intussusception SVG ---------- */
$('#intSvg').innerHTML=`
<rect x="20" y="85" width="140" height="80" rx="40" fill="#F2C7B8" stroke="#B5533C" stroke-width="2"/>
<rect x="160" y="85" width="240" height="80" rx="40" fill="#F2C7B8" stroke="#B5533C" stroke-width="2"/>
<rect x="150" y="100" width="190" height="50" rx="25" fill="#E58B6E" stroke="#8E2F1C" stroke-width="2"/>
<circle cx="338" cy="125" r="24" fill="#C23B2A"/>
<path d="M60 175 L100 215 L140 175Z" fill="#E6C04B" opacity=".9"/>
<path d="M150 175 L190 215 L230 175Z" fill="#E6C04B" opacity=".9"/>
<path d="M300 38 L340 80" stroke="#13232C" stroke-width="2" marker-end="url(#a)"/>
<defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#13232C"/></marker></defs>
<g font-size="12" fill="#13232C">
<text x="20" y="30" font-weight="800">Wgłobienie krętniczo-kątnicze</text>
<text x="20" y="48" fill="#44545D">Intussusceptum wsuwa się w intussuscipiens</text>
<text x="230" y="30" fill="#8E2F1C" font-weight="700">głowa (punkt prowadzący)</text>
<text x="236" y="129" font-size="11" fill="#3a0f06" font-weight="700" text-anchor="middle">intussusceptum</text><text x="290" y="190" font-size="11" fill="#8E2F1C" font-weight="700" text-anchor="middle">intussuscipiens</text>
<text x="40" y="232" fill="#44545D">krezka wciągnięta → ucisk naczyń</text>
<text x="20" y="246" fill="#C23B2A" font-weight="700">niedokrwienie, krew + śluz w stolcu</text>
</g>`;

/* ---------- Pyloric SVG ---------- */
(function(){
 const boxes=[
  ['Przerost mięśniówki','odźwiernika',20,20,'#FCEFD6','#B8730F'],
  ['Niedrożność wypływu','wymioty niebarwione żółcią',230,20,'#FBE6E2','#C23B2A'],
  ['Utrata HCl z wymiotami','↓Cl⁻  ↓H⁺  ↑HCO₃⁻',230,95,'#E1ECF9','#2B63AE'],
  ['Hipowolemia → ↑aldosteron','zwrot Na⁺, strata K⁺ i H⁺',20,95,'#ECE6F8','#6E4CB0'],
  ['Zasadowica metaboliczna','hipochloremiczna, hipokaliemiczna',125,170,'#E1F3E7','#2F8450']
 ];
 let s='<defs><marker id="b" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#44545D"/></marker></defs>';
 boxes.forEach(b=>{s+=`<rect x="${b[2]}" y="${b[3]}" width="190" height="56" rx="10" fill="${b[4]}" stroke="${b[5]}" stroke-width="2"/><text x="${b[2]+95}" y="${b[3]+24}" text-anchor="middle" font-size="12" font-weight="800" fill="#13232C">${b[0]}</text><text x="${b[2]+95}" y="${b[3]+42}" text-anchor="middle" font-size="11" fill="#13232C">${b[1]}</text>`});
 s+='<path d="M210 48 H228" stroke="#44545D" stroke-width="2" marker-end="url(#b)"/><path d="M325 78 V93" stroke="#44545D" stroke-width="2" marker-end="url(#b)"/><path d="M228 123 H212" stroke="#44545D" stroke-width="2" marker-end="url(#b)"/><path d="M115 153 V160 Q115 198 123 198" fill="none" stroke="#44545D" stroke-width="2" marker-end="url(#b)"/>';
 s+='<text x="220" y="240" text-anchor="middle" font-size="11" fill="#44545D">paradoksalna kwaśność moczu mimo zasadowicy</text>';
 $('#pylSvg').innerHTML=s;
})();

/* ---------- PAS ---------- */
const PAS=[['Ból przy kaszlu, skakaniu lub opukiwaniu',2],['Tkliwość w prawym dole biodrowym',2],['Migracja bólu do prawego dołu biodrowego',1],['Jadłowstręt',1],['Nudności lub wymioty',1],['Gorączka ≥ 38,0 °C',1],['Leukocytoza &gt; 10 000/µl',1],['Neutrofilia &gt; 7 500/µl',1]];
$('#pasItems').innerHTML=PAS.map((p,i)=>`<label><input type="checkbox" data-p="${p[1]}"> ${p[0]} <b>${p[1]}</b></label>`).join('');
function pas(){
  let s=0;$$('#pasItems input').forEach(i=>{if(i.checked)s+=+i.dataset.p});
  $('#pasScore').textContent=s;
  const r=$('#pasRes');
  r.className='callout '+(s<4?'green':s<7?'amber':'red');
  r.innerHTML=s<4?'<b class="k">Ryzyko niskie</b>Zapalenie wyrostka mało prawdopodobne; obserwacja, ocena innych przyczyn.':s<7?'<b class="k">Ryzyko pośrednie</b>USG jamy brzusznej, konsultacja chirurgiczna, powtórne badanie.':'<b class="k">Ryzyko wysokie</b>Konsultacja chirurgiczna; USG przed decyzją operacyjną.';
}
$$('#pasItems input').forEach(i=>i.addEventListener('change',pas));pas();

/* ---------- Bars ---------- */
const BARS=[['IgAV (Schönlein-Henoch)',15],['Mukowiscydoza / DIOS',14],['HUS',13],['Wgłobienie',12],['Guz Wilmsa / nefroblastoma',12],['Chłoniaki nieziarnicze',12],['Zwężenie odźwiernika',9],['Zaparcia',9],['Choroba Leśniowskiego-Crohna',8],['H. pylori',8],['Jersinioza',3],['Choroba Hirschsprunga',3]];
$('#bars').innerHTML=BARS.map(b=>`<div class="bar"><span>${b[0]}</span><i style="width:${b[1]/15*100}%"></i><b>${b[1]}</b></div>`).join('');

/* ---------- Quiz ---------- */
const L='abcde';
const Q=[
{n:1,m:'[1]',s:'Pule S4, S7 2025/26, grupa F, 19-A (powtarza się 5×)',conf:'src',gap:true,
 q:'Wskaż zdanie fałszywe dotyczące wgłobienia u dzieci:',
 o:['występuje najczęściej u dzieci powyżej 10 roku życia','dotyczy najczęściej okolicy krętniczo-kątniczej','leczeniem jest doodbytnicza insuflacja powietrza lub zabieg operacyjny','do objawów zalicza się m.in.: kolkowe bóle brzucha, obecność śluzowego stolca (galaretka malinowa), wzdęcie brzucha','może być powikłaniem choroby Schoenleina-Henocha'],k:0,
 d:'Wgłobienie to choroba niemowląt: omówienie zakładu podaje szczyt między 4. a 7. m.ż. Pozostałe zdania są prawdziwe: najczęściej postać krętniczo-kątnicza, leczenie repozycją powietrzem lub operacją, typowy zestaw objawów oraz powikłanie IgAV.',
 zal:'Zdanie „powyżej 10. r.ż.” jest fałszywe zawsze; szczyt wg zakładu 4–7 m.ż.',akt:'Szczyt 5–9 mies. (BSUH), 3 mies.–3 lata (ACEP). USG jest badaniem pierwszego rzutu, repozycja powietrzem skuteczniejsza niż kontrastem. W IgAV bywa postać krętniczo-kręta.'},
{n:2,m:'[1][10]',s:'Pule S1 25/26 (#34), S4 (#9)',conf:'inf',
 q:'15-miesięczny chłopiec od 12 godz. ma napadowe bóle brzucha, dwa razy zwymiotował. Jego stan ogólny jest zły. Lekarz stwierdził guz w prawym górnym kwadrancie jamy brzusznej. Najbardziej prawdopodobne rozpoznanie:',
 o:['wgłobienie','guz Wilmsa','kamica układu moczowego','mononukleoza zakaźna','neuroblastoma'],k:0,
 d:'Klasyczny obraz: wiek niemowlęcy lub poniemowlęcy, napadowy ból, wymioty, zły stan ogólny i walcowaty guz. Guz Wilmsa i neuroblastoma zwykle rosną bezobjawowo lub z objawami ogólnymi, bez gwałtownych napadów bólu i bez ciężkiego stanu w ciągu 12 godzin. Brak klucza w pliku; odpowiedź wynika z obrazu klinicznego i omówienia wgłobienia.'},
{n:3,m:'[1]',s:'Pule S1 25/26 (#33), S4 (#37)',conf:'unk',gap:true,
 q:'Które z poniższych twierdzeń dotyczących zwężenia odźwiernika są prawdziwe: 1) dodatni wywiad rodzinny przemawia za rozpoznaniem; 2) wymioty są podbarwione żółcią; 3) po nakarmieniu w prawym górnym kwadrancie można wyczuć guz; 4) typowym zaburzeniem metabolicznym jest zasadowica hiperchloremiczna; 5) postępowaniem doraźnym jest operacja.',
 o:['1, 3','1, 2, 3, 4, 5','1, 3, 4','1, 3, 5','2, 4, 5'],k:0,
 d:'Pewne: 1 i 3 są prawdziwe (rodzinność, „oliwka”), 2 jest fałszywe (wymioty niebilious), 4 jest fałszywe (zasadowica hipochloremiczna i hipokaliemiczna). Wątpliwe jest 5: leczenie jest operacyjne, ale pilność oznacza operację po wyrównaniu nawodnienia i elektrolitów. Stąd najbardziej prawdopodobny klucz to „1, 3”, a „1, 3, 5” byłoby akceptowalne tylko przy szerokim rozumieniu „doraźnie”. Klucza nie ma w plikach; potwierdź w zakładzie.',
 zal:'Prawdopodobnie 1, 3 (lub 1, 3, 5, gdy zakład uzna operację za „doraźną”).',akt:'Pyloromiotomia jest zabiegiem pilnym, ale dopiero po wyrównaniu nawodnienia i zasadowicy (AMBOSS).'},
{n:4,m:'[1][3][7]',s:'Pula S4 (#27), grupa F (#55)',conf:'src',gap:true,
 q:'12-letnia dziewczynka skarży się na występujące od tygodnia bóle brzucha, biegunkę, utratę łaknienia. Badania dodatkowe wykazały mierne podwyższenie stężenia białka C-reaktywnego oraz pogrubienie ścian w obrębie ileum terminale. Najbardziej prawdopodobne rozpoznanie:',
 o:['wrzodziejące zapalenie jelita grubego','giardiaza','celiakia','alergia pokarmowa','jersinioza'],k:4,
 d:'Klucz potwierdzony podświetleniem w pliku grupy F. Krótki wywiad (tydzień), mierny wzrost CRP i zapalenie końcowego odcinka jelita krętego pasują do jersinii. WZJG dotyczy okrężnicy (krwista biegunka), giardiaza i celiakia nie dają pogrubienia ileum terminale, a alergia pokarmowa nie daje takiego obrazu. Notatka zakładu: Gram-ujemna pałeczka kolonizująca ileum terminale, ból w prawym dole biodrowym, rumień guzowaty i zapalenie stawów; posiew na specjalnej pożywce i serologia.',
 zal:'Jersinioza.',akt:'Przy dłuższym przebiegu (tygodnie), utracie masy, objawach pozajelitowych i wysokiej kalprotektynie przeważa choroba Leśniowskiego-Crohna [7]. Czas trwania jest kluczem do różnicowania.'},
{n:5,m:'[1][7]',s:'Pula S1 25/26 (#5)',conf:'inf',
 q:'Zmiany na śluzówkach jamy ustnej, zapalenie błony naczyniowej oka, bóle stawowe i rumień guzowaty u 12-letniego chłopca z bólami brzucha, przewlekłą biegunką i utratą masy ciała przemawiają za rozpoznaniem:',
 o:['choroby Leśniowskiego-Crohna','wrzodziejącego zapalenia jelita grubego','choroby Hirschsprunga','celiakii','nietolerancji laktozy'],k:0,
 d:'Zestaw objawów pozajelitowych (afty, uveitis, rumień guzowaty, artralgie) przy przewlekłej biegunce i spadku masy to klasyczny obraz IBD; z podanych opcji najlepiej pasuje choroba Crohna. Hirschsprung i nietolerancja laktozy nie dają takich objawów, celiakia rzadko daje uveitis. Brak klucza w pliku.'},
{n:6,m:'[1][11]',s:'Pula S1 25/26 (#4), skrypt Kiedrasia (#27, #31)',conf:'inf',
 q:'17-letnia pacjentka z objawami niedrożności mechanicznej. W trakcie zabiegu stwierdzono, że przyczyną był guz w okolicy krętniczo-kątniczej. Najbardziej prawdopodobne rozpoznanie:',
 o:['nieziarniczy chłoniak B komórkowy','neuroblastoma','nieziarniczy chłoniak T komórkowy','guz Wilmsa','rhabdomyosarcoma'],k:0,
 d:'Guz krętniczo-kątniczy u starszego dziecka lub nastolatka to typowa lokalizacja chłoniaka Burkitta (NHL z komórek B), często z wgłobieniem i niedrożnością. Neuroblastoma i Wilms leżą zaotrzewnowo i dotyczą młodszych dzieci. Ten sam motyw występuje w skrypcie Kiedrasia (13-latek, guz krętniczo-kątniczy → NHL B). Brak klucza w pliku.'},
{n:7,m:'[1][12][4]',s:'Pula S7 25/26 (#9)',conf:'inf',
 q:'5-letnia dziewczynka od rana skarży się na bóle stawów skokowych, które są obrzęknięte i mają ograniczoną ruchomość. Na kończynach dolnych i pośladkach polimorficzne zmiany skórne nieblednące pod uciskiem. Bóle brzucha, w stolcu świeża krew. Najbardziej prawdopodobne rozpoznanie:',
 o:['choroba Kawasaki','nieswoiste zapalenie jelita grubego','choroba Schoenleina-Henocha','gorączka reumatyczna','immunologiczna plamica małopłytkowa'],k:2,
 d:'Plamica palpacyjna (nieblednąca) na kończynach dolnych i pośladkach + zapalenie stawów + ból brzucha + krew w stolcu = IgAV [1][12][4]. W ITP plamica jest małopłytkowa bez stawów i bólu brzucha; w Kawasaki jest gorączka i zmiany śluzówkowe; gorączka reumatyczna to zapalenie wędrujące bez plamicy. Brak klucza w pliku.'},
{n:8,m:'[1][12]',s:'Grupa F (#21)',conf:'src',gap:true,
 q:'Do objawów wymagających leczenia glikokortykoidami w chorobie Schönleina-Henocha NIE należy:',
 o:['zapalenie stawów nie ustępujące po NLPZ','obrzęki wynikające z hipoproteinemii','ostry ból brzucha','uporczywa wysypka krwotoczna','krwawienie z przewodu pokarmowego'],k:3,
 d:'Klucz potwierdzony podświetleniem w pliku grupy F. Notatki zakładu: bezpośrednie wskazanie do steroidów to zajęcie przewodu pokarmowego i obrzęki (Kawalec); postać brzuszna – glikokortykoidy, postać skórno-stawowa – leczenie objawowe. Sama wysypka nie jest wskazaniem.',
 zal:'Wysypka krwotoczna nie jest wskazaniem do GKS; ból brzucha i krwawienie z przewodu pokarmowego są.',akt:'SHARE: GKS można rozważyć przy ciężkim bólu i krwawieniu po wykluczeniu wgłobienia; zalecenia brytyjskie 2024: prednizolon 1–2 mg/kg/d przez 1–2 tyg., w ciągu 3 dni od początku ciężkiego bólu (2B). GKS nie zapobiegają zapaleniu nerek.'},
{n:9,m:'[10]',s:'Grupa F (#14), skrypt Kiedrasia (#28)',conf:'src',
 q:'Matka 2-letniego chłopca z wyraźnymi cechami przerostu połowiczego zauważyła powiększenie obwodu brzucha. Najbardziej prawdopodobne rozpoznanie:',
 o:['neuroblastoma','mięsak poprzecznie prążkowany','guz Wilmsa','chłoniak nieziarniczy B-komórkowy','przewlekła białaczka szpikowa'],k:2,
 d:'Klucz potwierdzony podświetleniem w pliku grupy F. Przerost połowiczy (i aniridia, zespół Beckwitha-Wiedemanna) to wskazówki do guza Wilmsa. Wykład: najczęstszy guz jamy brzusznej, zwykle do 5. r.ż. Pamiętaj: nie uciskaj guza wielokrotnie.'},
{n:10,m:'[10]',s:'Pula S7 25/26 (#3)',conf:'unk',gap:true,
 q:'Wskaż objawy kliniczne guza Wilmsa: 1) guz w brzuchu; 2) krwiomocz; 3) bóle brzucha; 4) jadłowstręt; 5) nadciśnienie.',
 o:['1, 2, 3','1, 2, 3, 5','1, 3, 4, 5','2, 5','1, 2, 3, 4, 5'],k:1,
 d:'Klucza w pliku nie ma. Wykład: guz ok. 90%, ból ok. 20%, krwiomocz ok. 30%; nadciśnienie to klasyczny objaw (nerkowy). Jadłowstręt jest objawem ogólnym i bywa uwzględniany w niektórych podręcznikach. Najbardziej „podręcznikowa” kombinacja to 1, 2, 3, 5, ale wariant 1–5 jest możliwy.',
 zal:'Prawdopodobnie 1, 2, 3, 5; sprawdź klucz zakładu.',akt:'Rozpoznanie opiera się na obrazowaniu, nie na zestawie objawów.'},
{n:11,m:'[1][3][12][15]',s:'Grupa F, skrypt Kiedrasia (#41)',conf:'src',
 q:'14-miesięczna dziewczynka od 2 dni ma biegunkę, stolce z domieszką krwi. Od 12 godzin stan wyraźnie się pogorszył, oddała 50 ml moczu. Hb 8,0 (jednostka w puli podana błędnie jako g/l), WBC 14 G/l, płytki 70 G/l. Najbardziej prawdopodobne rozpoznanie:',
 o:['ostre odmiedniczkowe zapalenie nerek','ostre kłębuszkowe zapalenie nerek','ostra zanerkowa niewydolność nerek','zespół nerczycowy','zespół hemolityczno-mocznicowy'],k:4,
 d:'Klucz potwierdzony podświetleniem w pliku grupy F. Triada: niedokrwistość hemolityczna, małopłytkowość, AKI (oliguria) po biegunce krwistej = HUS. Pułapka: Hb 8,0 g/l w treści to literówka (g/dl). Kiedraś #41: dziecko z bólami brzucha, obniżoną diurezą, żółtaczką i wybroczynami → morfologia i kreatynina.'},
{n:12,m:'[10][15]',s:'Grupa F (#34), 19-A (#47)',conf:'src',
 q:'Które z poniższych jest NAJMNIEJ prawdopodobnym rozpoznaniem u 3-letniego dziecka z guzem jamy brzusznej i krwinkomoczem?',
 o:['nephroblastoma','zespół hemolityczno-mocznicowy','zwyrodnienie torbielowate nerek','zakrzep żyły nerkowej','roponercze'],k:1,
 d:'Klucz potwierdzony podświetleniem w pliku (19-A, grupa F). HUS daje krwinkomocz i AKI, ale nie guz jamy brzusznej. Pozostałe opcje mogą dawać wyczuwalny guz (powiększona nerka) z krwinkomoczem.'},
{n:13,m:'[1]',s:'Grupa F (#4), 19-A (#11)',conf:'src',gap:true,
 q:'3-miesięczne niemowlę karmione od 6. tyg. życia mieszanką modyfikowaną wymiotuje po każdym posiłku, nie przybiera na masie, bez poprawy po hydrolizatach kazeiny. Które badanie wykonać w pierwszej kolejności?',
 o:['scyntygrafię przełyku','EEG','pH-metrię przełyku z impedancją','RTG przewodu pokarmowego z kontrastem','USG serca'],k:3,
 d:'Klucz potwierdzony podświetleniem w pliku grupy F i 19-A (analogiczne pytanie: „dziecko źle przybiera, wymiotuje po jedzeniu – jakie badanie jako pierwsze” → kontrastowe RTG). Brak odpowiedzi na hydrolizat wyklucza alergię i sugeruje przyczynę anatomiczną (przepuklina rozworu, malrotacja, zwężenia).',
 zal:'RTG przewodu pokarmowego z kontrastem.',akt:'W wymiotach niemowlęcia 2–12 tyg. z cechami zwężenia odźwiernika pierwszym badaniem jest USG; kontrastowy pasaż jest badaniem z wyboru przy wymiotach żółciowych (malrotacja).'},
{n:14,m:'[3][1]',s:'Pula S7 25/26 (#10)',conf:'inf',gap:true,
 q:'4-letnia dziewczynka: 2 dni wymiotów (2–3×/dobę) i wodnisto-papkowatych stolców (4–5×/dobę), stany podgorączkowe, niewielki ból brzucha, płyny przyjmuje chętnie, lekkie odwodnienie. Co zalecić? 1) pojenie doustne ambulatoryjnie; 2) loperamid; 3) biseptol; 4) posiew stolca na Salmonella i Shigella; 5) kalprotektyna w kale.',
 o:['1, 2, 4, 5','1, 2, 4','3, 4','1, 3','tylko 1'],k:4,
 d:'Łagodna ostra biegunka z lekkim odwodnieniem: doustne nawadnianie jest postępowaniem z wyboru. Loperamid nie jest zalecany u małych dzieci, antybiotyk nie jest wskazany rutynowo, posiew stolca i kalprotektyna nie są potrzebne przy łagodnym przebiegu. Odpowiedź „tylko 1” wynika z wytycznych ESPGHAN/ESPID; brak klucza w pliku.',
 zal:'Tylko pojenie doustne (1).',akt:'Wytyczne ESPGHAN/ESPID: ORS, wczesne żywienie; przy krwistej biegunce rozważ STEC i unikaj antybiotyków oraz leków przeciwperystaltycznych.'},
{n:16,m:'[1]',s:'Pula S2 2024 (#46)',conf:'inf',
 q:'Zaparcia u dzieci – zaznacz zdanie fałszywe:',
 o:['makrogole z wyboru','leczy się co najmniej 6 tygodni','przyczyna organiczna zaparć w 50%','w badaniu per rectum masy kałowe','może występować retencyjne nietrzymanie stolca'],k:2,
 d:'Ponad 90% zaparć u dzieci to zaparcia czynnościowe; przyczyny organiczne (Hirschsprung, zaburzenia endokrynne, neurologiczne) stanowią mały odsetek. Makrogole to leki pierwszego rzutu, w badaniu per rectum są masy kałowe, a przepełnienie odbytnicy może dawać nietrzymanie stolca. Brak klucza w pliku.'}
];
Q.forEach((q,i)=>q.n=i+1);
const state={};let ans=0,good=0;
function renderQ(f){
  const list=Q.filter(q=>f==='all'||q.conf===f||(f==='gap'&&q.gap));
  $('#quiz').innerHTML=list.map(q=>{
    const cb={src:'KLUCZ POTWIERDZONY',inf:'KLUCZ WNIOSKOWANY',unk:'BRAK KLUCZA'}[q.conf];
    return `<article class="q" id="q${q.n}"><header><span class="n">Zad. ${q.n}</span><span class="mod">${q.m}</span><span class="kb ${q.conf}">${cb}</span><span class="src">${q.s}</span></header>
    <p class="stem">${q.q}</p>
    <div class="opts" style="list-style:none">${q.o.map((o,i)=>`<button class="opt" data-q="${q.n}" data-i="${i}"><span class="l">${L[i]}.</span><span>${o}</span></button>`).join('')}</div>
    <div class="acts"><button data-show="${q.n}">Pokaż odpowiedź</button></div>
    <div class="disc" id="d${q.n}" hidden>
      <div class="callout ${q.conf==='src'?'green':q.conf==='inf'?'amber':''}"><b class="k">Odpowiedź: ${L[q.k]}. ${q.conf==='unk'?'(prawdopodobna, klucz niepotwierdzony)':q.conf==='inf'?'(wniosek z omówień i wytycznych)':''}</b>${q.d}</div>
      ${q.zal?`<div class="cmp"><div class="a"><b class="k">Pod zaliczenie (wg puli/zakładu)</b>${q.zal}</div><div class="b"><b class="k">Aktualnie klinicznie (wg wytycznych)</b>${q.akt}</div></div>`:''}
    </div></article>`;
  }).join('');
  Object.keys(state).forEach(n=>{if(state[n]!==undefined)mark(+n,state[n],true)});
}
function mark(n,i,silent){
  const q=Q.find(x=>x.n===n);if(!q)return;
  const art=$('#q'+n);if(!art)return;
  $$('.opt',art).forEach(b=>{
    b.disabled=true;const ix=+b.dataset.i;
    if(ix===q.k)b.classList.add(ix===i?'ok':'key');
    else if(ix===i)b.classList.add('bad');
  });
  $('#d'+n).hidden=false;
}
$('#quiz').addEventListener('click',e=>{
  const b=e.target.closest('.opt');
  if(b){const n=+b.dataset.q,i=+b.dataset.i;if(state[n]!==undefined)return;state[n]=i;ans++;if(Q.find(x=>x.n===n).k===i)good++;mark(n,i);$('#score').textContent=`Wynik: ${good} / ${ans}`;}
  const s=e.target.closest('[data-show]');
  if(s){const n=+s.dataset.show;if(state[n]===undefined){state[n]=-1;}mark(n,state[n]);}
});
renderQ('all');wireFilters('#qFilters',renderQ);

/* ---------- Gap table ---------- */
const GAP=[
['Zwężenie odźwiernika','Zasadowica „hiperchloremiczna” w opcji pytania (błędna); „operacja doraźna” w opcji 5','Zasadowica hipochloremiczna i hipokaliemiczna; USG; pyloromiotomia po wyrównaniu nawodnienia i elektrolitów'],
['Wgłobienie – wiek','Szczyt 4–7 m.ż.; „powyżej 10. r.ż.” = fałsz','5–9 mies. (BSUH); 3 mies.–3 lata (ACEP); USG, repozycja powietrzem'],
['IgAV – GKS','Wskazanie: zajęcie przewodu pokarmowego i obrzęki; wysypka NIE jest wskazaniem','SHARE i zalecenia 2024: GKS rozważyć przy ciężkim bólu lub krwawieniu po wykluczeniu wgłobienia; brak profilaktyki nefropatii'],
['Zapalenie wyrostka','W puli głównie dystraktor; klasyka kliniczna','USG jako pierwsze badanie, PAS; u wybranych dzieci z niepowikłanym zapaleniem dopuszczalne leczenie antybiotykami (WSES 2020)'],
['Jersinioza kontra Crohn','Tydzień bólu, mierny CRP, pogrubienie ileum terminale = jersinioza','Czas trwania, kalprotektyna, objawy pozajelitowe i zahamowanie wzrostu decydują o diagnostyce IBD'],
['Wymioty niemowlęcia 3 mies.','Kontrastowe RTG przewodu pokarmowego jako pierwsze badanie','USG przy podejrzeniu zwężenia odźwiernika; kontrast przy wymiotach żółciowych lub podejrzeniu wady anatomicznej'],
['Leczenie jersiniozy','Biseptol, ampicylina, gentamycyna, ciprofloksacyna (&gt; 16 lat)','Wg antybiogramu; ampicylina bywa nieskuteczna (β-laktamaza); w łagodnych przypadkach leczenie wspomagające'],
['Zaparcia','Organiczne w 50% = fałsz','Czynnościowe &gt; 90%; makrogole pierwszego rzutu']
];
$('#gapTable').innerHTML=`<tr><th>Temat</th><th>Pod zaliczenie (wg puli/zakładu)</th><th>Aktualnie klinicznie (wg wytycznych)</th></tr>`+GAP.map(r=>`<tr><td><b>${r[0]}</b></td><td style="background:var(--amber-l)">${r[1]}</td><td style="background:var(--blue-l)">${r[2]}</td></tr>`).join('');

/* ---------- Cross-module graph ---------- */
(function(){
 const N=[['HUS','[3][12][15]','#2B63AE'],['IgAV','[12][4]','#6E4CB0'],['ZUM','[14]','#2B63AE'],['Płuca, angina','[2]','#2F8450'],['DKA','[5]','#2F8450'],['Wilms, NB','[10]','#C23B2A'],['Chłoniak NHL B','[11]','#C23B2A'],['IBD, jersinioza','[7][3]','#2B63AE'],['PUD, H. pylori','[6]','#2B63AE'],['Celiakia, alergie','[3][8]','#2B63AE'],['Sferocytoza','[13]','#B8730F'],['Sepsa, wstrząs','[5][2]','#2F8450']];
 let s='';const cx=340,cy=240,rx=255,ry=190;$('#crossSvg').setAttribute('viewBox','0 0 680 480');
 N.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);
  s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#B5C0C3" stroke-width="2"/>`;});
 N.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);
  s+=`<rect x="${x-62}" y="${y-22}" width="124" height="44" rx="10" fill="#fff" stroke="${n[2]}" stroke-width="2.5"/><text x="${x}" y="${y-4}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#13232C">${n[0]}</text><text x="${x}" y="${y+13}" text-anchor="middle" font-size="11" fill="${n[2]}" font-weight="800">${n[1]}</text>`;});
 s+=`<circle cx="${cx}" cy="${cy}" r="52" fill="#0C7A85"/><text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">[1]</text><text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">ból brzucha</text>`;
 $('#crossSvg').innerHTML=s;
})();
const TR=[
 ['HUS = [1]+[3]+[12]+[15]','Ból brzucha, krwista biegunka, małopłytkowość, AKI. Bez antybiotyków i loperamidu.'],
 ['IgAV = [1]+[12]+[4]','Ból brzucha, plamica na pośladkach i kończynach dolnych, krwinkomocz; sprawdź wgłobienie.'],
 ['Gorączka + ból brzucha bez objawów otrzewnowych','Wyklucz ZUM [14] i zapalenie dolnego płata płuca [2].'],
 ['Zaparcie i dysfunkcja pęcherza','Nawracające ZUM [14]; lecz zaparcie.'],
 ['Wymioty + ból brzucha + oddech Kussmaula','DKA [5]: glikemia i ketony.'],
 ['Guz brzucha','Wilms lub neuroblastoma [10]; guz krętniczo-kątniczy: NHL [11]; nie uciskaj guza.']
];
$('#traps').innerHTML=TR.map(t=>`<div class="card" style="padding:.8rem 1rem"><b>${t[0]}</b><p class="small">${t[1]}</p></div>`).join('');

/* nav highlight */
const links=$$('#navlist a');
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-40% 0px -55% 0px'});
$$('section[id],footer[id]').forEach(s=>io.observe(s));
})();
