const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function bars(id,rows,unit='%'){
  const el=$('#'+id);if(!el)return;const mx=Math.max(1,...rows.map(r=>r.w??r.v));
  el.innerHTML=rows.map(r=>`<div class="bar"><span>${r.l}</span><div><i class="${r.c||''}" style="width:${Math.max(3,(r.w??r.v)/mx*100)}%"></i></div><em>${r.t??r.v+unit}</em></div>`).join('');
}
function flow(id,nodes){
  $('#'+id).innerHTML=nodes.map((n,i)=>{
    let h;
    if(n.br){h=`<div class="branch">${n.br.map(col=>`<div>${col.map(x=>`<div class="fn ${x[0]}">${x[1]}</div>`).join('')}</div>`).join('')}</div>`}
    else h=`<div class="fn ${n[0]}">${n[1]}</div>`;
    return (i?'<div class="ar">▼</div>':'')+h}).join('');
}
const TC={feb:'r',gor:'b',dol:'a',wys:'v',neu:'g',sep:'r',szc:'a',x:''};
const cnt=k=>Q.filter(q=>q.t===k).length;
bars('barsFreq',Object.keys(TOPICS).map(k=>({l:TOPICS[k],v:cnt(k),c:TC[k],t:cnt(k)+' zad.'})),'');
$('#kQ').textContent=Q.length;
$('#kSrc').textContent=Q.filter(q=>q.c==='src').length;
$('#kGap').textContent=Q.filter(q=>q.gap).length;

/* ===== hero: wiek ===== */
(function(){
  const rows=[
    ['0–28 dni','Noworodek','GBS, E. coli, Listeria, HSV','#6E4CB0'],
    ['1–3 mies.','Młody niemowlak','E. coli (ZUM), RSV, enterowirusy','#2B63AE'],
    ['3 mies.–5 lat','Niemowlę i przedszkolak','pneumokok, meningokok, Hib, RSV','#C23B2A'],
    ['5–12 lat','Wiek szkolny','GAS, M. pneumoniae, EBV, pneumokok','#B8730F'],
    ['12–18 lat','Nastolatek','meningokok, M. pneumoniae, EBV','#2F8450']];
  let h='';
  rows.forEach((r,i)=>{const y=44+i*62;
    h+=`<rect x="20" y="${y}" width="380" height="52" rx="12" fill="#fff" stroke="${r[3]}" stroke-width="2.5"/><rect x="20" y="${y}" width="110" height="52" rx="12" fill="${r[3]}"/><rect x="100" y="${y}" width="30" height="52" fill="${r[3]}"/>
    <text x="75" y="${y+23}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">${r[0]}</text><text x="75" y="${y+40}" text-anchor="middle" font-size="10" fill="#fff">${r[1]}</text>
    <text x="140" y="${y+31}" font-size="11.5" font-weight="700" fill="#13232C">${r[2]}</text>`});
  $('#heroAge').innerHTML=h;
})();

/* ===== mapa wiekowa ===== */
$('#ageGrid').innerHTML=[
 ['a1','🍼 Noworodek (0–28 dni)',['Posocznica: GBS, E. coli, Listeria; czynniki ryzyka: PROM >18 h, gorączka matki','Objawy niespecyficzne: bezdechy, żółtaczka, hepatomegalia','ZOMR: ampicylina + aminoglikozyd lub cefotaksym','Chlamydia trachomatis: zapalenie płuc i spojówek','Gorączka = pełna ocena i hospitalizacja']],
 ['a2','👶 Niemowlę (1–12 mies.)',['Oskrzeliki (RSV): najczęstsze zakażenie dolnych dróg <2 r.ż.','ZUM: gorączka bez ogniska [14]','Ropnie płuc i odma: S. aureus','Rumień nagły (HHV-6): 3 dni gorączki, potem wysypka','Rotawirusy: biegunka [3]; szczepienie obowiązkowe']],
 ['a3','🧒 Przedszkolak (1–5 lat)',['Wirusowe URTI; OZUŚ','Krup (dni) i zapalenie nagłośni Hib (godziny)','Pneumokokowe zapalenie płuc; ZOMR','Rumień zakaźny, odra, ospa, płonica','Choroba Kawasaki']],
 ['a4','🎒 Szkolne i nastolatek',['Angina GAS (5–15 lat); mononukleoza','Atypowe zapalenie płuc: M. pneumoniae, C. pneumoniae','Krztusiec u zaszczepionych: długotrwały kaszel','Meningokoki: IChM; profilaktyka kontaktów','Gorączka reumatyczna 2–4 tyg. po GAS']]
].map(c=>`<div class="agecol ${c[0]}"><h4>${c[1]}</h4><ul>${c[2].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('');

/* ===== gorączka wg wieku ===== */
(function(){
  const cols=[['8–21 dni','#C23B2A','Pełna ocena',['mocz: badanie i posiew','posiew krwi','PMR','antybiotyk i.v.','hospitalizacja']],
              ['22–28 dni','#B8730F','Markery + decyzja',['mocz, krew, markery','LP: gdy markery nieprawidłowe','lub wspólna decyzja z rodzicami','hospitalizacja przy zakażeniu']],
              ['29–60 dni','#2B63AE','Wg markerów',['mocz, krew, markery','LP, gdy markery nieprawidłowe','prawidłowe markery: możliwa obserwacja','PCT >0,5, ANC >4000, CRP >20']]];
  let h='<line x1="20" y1="34" x2="680" y2="34" stroke="#9AA7AD" stroke-width="3"/>';
  cols.forEach((c,i)=>{const x=10+i*228;
    h+=`<circle cx="${x+110}" cy="34" r="9" fill="${c[1]}"/><text x="${x+110}" y="20" text-anchor="middle" font-size="13" font-weight="800" fill="${c[1]}">${c[0]}</text>
    <rect x="${x}" y="58" width="220" height="200" rx="14" fill="#fff" stroke="${c[1]}" stroke-width="2.5"/><rect x="${x}" y="58" width="220" height="38" rx="14" fill="${c[1]}"/><rect x="${x}" y="82" width="220" height="14" fill="${c[1]}"/>
    <text x="${x+110}" y="83" text-anchor="middle" font-size="13.5" font-weight="800" fill="#fff">${c[2]}</text>`;
    c[3].forEach((t,j)=>h+=`<text x="${x+110}" y="${128+j*28}" text-anchor="middle" font-size="12" fill="${j==0?'#13232C':'#44545D'}">${t}</text>`)});
  $('#febSvg').innerHTML=h;
})();

/* ===== McIsaac ===== */
(function(){
  const items=[['Gorączka >38°C',1],['Brak kaszlu',1],['Bolesne powiększone węzły szyjne przednie',1],['Obrzęk lub nalot na migdałkach',1]];
  $('#mcis').innerHTML=items.map((x,i)=>`<label><input type="checkbox" class="mc" data-p="${x[1]}"> ${x[0]} (+${x[1]})</label>`).join('')+
   `<label>Wiek:&nbsp;<select id="mcAge"><option value="1">3–14 lat (+1)</option><option value="0">15–44 lat (0)</option><option value="-1">≥45 lat (−1)</option><option value="0">&lt;3 lat (0)</option></select></label>`;
  const calc=()=>{
    const s=$$('.mc').filter(x=>x.checked).length+(+$('#mcAge').value);
    const msg=s<=1?'Niskie prawdopodobieństwo GAS: zwykle bez testu i bez antybiotyku':s<=3?'Pośrednie: wymaz lub strep-test, antybiotyk po potwierdzeniu':'Wysokie: wymaz lub strep-test (wg puli antybiotyk po potwierdzeniu)';
    $('#mcres').innerHTML=`<div style="opacity:.8;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em">Wynik McIsaaca</div><b>${s}</b> <span style="opacity:.8">pkt</span><div style="margin-top:.6rem;font-size:.92rem;font-weight:700">${msg}</div><div style="margin-top:.4rem;font-size:.8rem;opacity:.8">Interpretacja progowa jest orientacyjna: progi wg lokalnych zasad; w puli rozstrzyga potwierdzenie bakteriologiczne.</div>`;
  };
  $$('#mcis input,#mcis select').forEach(e=>e.addEventListener('input',calc));calc();
})();

flow('ozusFlow',[
 ['start','Dziecko z ostrym zapaleniem ucha środkowego'],
 ['blue','<b>Ocena nasilenia i wieku</b><small>obustronność, ciężki stan, wiek, otorrhea</small>'],
 {br:[[['green','<b>Lekki przebieg, dziecko starsze</b><small>czujne wyczekiwanie 24–48 h, ibuprofen jako lek I rzutu (Moodle)</small>']],[['red','<b>Cięższy przebieg lub dziecko młodsze</b><small>amoksycylina (lub z klawulanianem) 80–90 mg/kg/dobę, 7–10 dni (wykład)</small>']]]},
 ['amber','<b>Kontrola po 24–48 h</b><small>brak poprawy lub nasilenie → antybiotyk</small>'],
 ['violet','<b>Wiek wg pul</b><small>wykład: wyczekiwanie >2 r.ż.; Moodle: >1 r.ż. lekki; 18 m.ż. w puli 5 rok 3 = antybiotyk</small>']]);

/* ===== tabela dolne drogi ===== */
$('#respTable').innerHTML=`<thead><tr><th>Stan</th><th>Wiek i czynnik</th><th>Początek</th><th>Kluczowe objawy</th><th>Postępowanie</th></tr></thead><tbody>
<tr><td><b>Krup</b> (podgłośniowe zapalenie krtani)</td><td>małe dzieci; wirusy (paragrypa)</td><td>dni, nasilenie w nocy</td><td>szczekający kaszel, chrypka, stridor wdechowy; dziecko pije</td><td>deksametazon p.o. 0,15–0,6 mg/kg jednorazowo; adrenalina w nebulizacji w ciężkim; alternatywa budezonid</td></tr>
<tr><td><b>Zapalenie nagłośni</b></td><td>1–6 lat (pula); Hib u niezaszczepionych</td><td>godziny</td><td>wysoka gorączka, ślinotok, nie pije, toksyczny wygląd, pozycja wymuszona</td><td>nie badać gardła; anestezjolog, OIOM, zabezpieczenie dróg; posiewy i cefalosporyna III gen. i.v.</td></tr>
<tr><td><b>Zapalenie oskrzelików</b></td><td>&lt;2 r.ż.; RSV</td><td>dni, po katarze</td><td>świsty, rzężenia drobnobańkowe, wypuk nadmiernie jawny, retrakcje, beczkowata klatka</td><td>leczenie wspomagające; tlen wg progów; bez antybiotyków, GKS, salbutamolu (NICE)</td></tr>
<tr><td><b>Zapalenie płuc</b></td><td>patrz tabela wiekowa</td><td>godziny–dni</td><td>gorączka, kaszel, tachypnoe, trzeszczenia, zagęszczenie w RTG</td><td>amoksycylina 80–90 mg/kg/dobę; brak poprawy 72 h → amoksycylina z klawulanianem + makrolid (wykład)</td></tr>
<tr><td><b>Krztusiec</b></td><td>każdy wiek; B. pertussis</td><td>tygodnie</td><td>napadowy kaszel, wymioty po kaszlu, wybroczyny; niemowlę: bezdechy</td><td>makrolid (wcześnie skraca przebieg, późno tylko zakaźność), izolacja, profilaktyka kontaktów</td></tr>
<tr><td><b>Ciało obce</b></td><td>1–3 lata</td><td>nagły</td><td>zadławienie, nagły kaszel, jednostronne zmiany</td><td>algorytm FBAO [5]; bronchoskopia</td></tr></tbody>`;
flow('croupFlow',[
 ['start','Dziecko ze szczekającym kaszlem i stridorem wdechowym'],
 ['blue','<b>Ocena nasilenia</b><small>stridor w spoczynku? retrakcje? SpO₂? zaburzenia świadomości?</small>'],
 {br:[[['green','<b>Lekki / umiarkowany</b><small>deksametazon p.o. 0,15–0,6 mg/kg jednorazowo (wykład); alternatywa budezonid</small>']],[['red','<b>Ciężki</b><small>adrenalina w nebulizacji, tlen, obserwacja po adrenalinie, rozważ OIOM</small>']]]},
 ['amber','<b>Pułapka</b><small>stridor + ślinotok + nie pije = nagłośnia, nie krup</small>']]);
flow('bronchFlow',[
 ['start','Niemowlę z zapaleniem oskrzelików'],
 ['blue','<b>Leczenie wspomagające</b><small>odsysanie nosa, nawodnienie, karmienie, tlen wg progu</small>'],
 ['red','<b>Przyjęcie do szpitala</b><small>bezdech, SpO₂ trwale &lt;90% (≥6 tyg.) lub &lt;92%, niewystarczające picie, stękanie, RR &gt;70/min</small>'],
 ['amber','<b>Czego nie stosować rutynowo</b><small>antybiotyk, salbutamol, GKS, adrenalina, hipertoniczny NaCl, rybawiryna</small>'],
 ['violet','<b>Pula vs NICE</b><small>pula C: 0,9% NaCl neb; Moodle #9: „skierować do szpitala” nie był kluczem</small>']]);
$('#pnTable').innerHTML=`<thead><tr><th>Wiek</th><th>Najczęstsze czynniki</th><th>Uwagi</th></tr></thead><tbody>
<tr><td>Noworodek</td><td>GBS, E. coli, Listeria; C. trachomatis</td><td>ampicylina + aminoglikozyd lub cefalosporyna III gen.</td></tr>
<tr><td>Niemowlę</td><td>RSV i inne wirusy, S. pneumoniae, S. aureus</td><td>gronkowiec: ropnie, ropniak, odma</td></tr>
<tr><td>1–5 lat</td><td>wirusy, S. pneumoniae</td><td>amoksycylina 80–90 mg/kg/dobę; płatowe zagęszczenie = pneumokok</td></tr>
<tr><td>&gt;5 lat, nastolatek</td><td>M. pneumoniae, C. pneumoniae, pneumokok; Legionella</td><td>podostry kaszel = atypowy; makrolid</td></tr>
<tr><td>Niedobór odporności</td><td>Pneumocystis jirovecii [13b]</td><td>profilaktyka kotrimoksazolem</td></tr>
<tr><td>Mukowiscydoza</td><td>Pseudomonas aeruginosa [8]</td><td>nawracające zapalenia płuc, niedożywienie</td></tr></tbody>`;
(function(){
  const st=[['Nieżytowa','1–2 tyg.','#2B63AE','katar, łagodny kaszel; największa zakaźność; makrolid najskuteczniejszy'],['Napadowa','2–6 tyg.','#C23B2A','napady kaszlu, „pianie”, wymioty, wybroczyny; niemowlę: bezdechy'],['Ustępowania','tygodnie','#2F8450','kaszel słabnie; antybiotyk nie zmienia przebiegu']];
  let h='';st.forEach((s,i)=>{const x=10+i*143;
    h+=`<rect x="${x}" y="30" width="135" height="140" rx="14" fill="#fff" stroke="${s[2]}" stroke-width="2.5"/><rect x="${x}" y="30" width="135" height="36" rx="14" fill="${s[2]}"/><rect x="${x}" y="52" width="135" height="14" fill="${s[2]}"/>
    <text x="${x+67}" y="53" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${s[0]}</text><text x="${x+67}" y="86" text-anchor="middle" font-size="12" font-weight="800" fill="${s[2]}">${s[1]}</text>`;
    const words=s[3].split(' ');let line='',y=106;words.forEach(w=>{if((line+' '+w).length>20){h+=`<text x="${x+67}" y="${y}" text-anchor="middle" font-size="10.5" fill="#44545D">${line.trim()}</text>`;line=w;y+=15}else line+=' '+w});h+=`<text x="${x+67}" y="${y}" text-anchor="middle" font-size="10.5" fill="#44545D">${line.trim()}</text>`});
  h+='<text x="10" y="18" font-size="13" font-weight="800" fill="#13232C">Krztusiec: trzy fazy</text>';
  $('#pertSvg').innerHTML=h;
})();

/* ===== wysypki ===== */
flow('rashFlow',[
 ['start','Dziecko z gorączką i wysypką'],
 ['blue','<b>Test szklanki: czy wybroczyny zanikają przy ucisku?</b>'],
 {br:[
  [['red','<b>Nie zanikają, źle wygląda</b><small>posocznica meningokokowa: antybiotyk natychmiast</small>'],['amber','<b>Nie zanikają, dobrze wygląda</b><small>HSP, ITP [12]</small>']],
  [['green','<b>Plamisto-grudkowa</b><small>odra (Koplik), różyczka, rumień nagły, rumień zakaźny, EBV po amoksycylinie</small>'],['violet','<b>Inne</b><small>drobnogrudkowa „papier ścierny”: płonica; pęcherzyki w rzutach: ospa; gorączka ≥5 dni + wargi i dłonie: Kawasaki</small>']]]}]);
(function(){
  const R=[['Odra',0,7,3,8,'#C23B2A'],['Różyczka',0,2,1,4,'#2B63AE'],['Rumień nagły',0,3,3,5,'#6E4CB0'],['Płonica',0,3,1,5,'#B8730F'],['Rumień zakaźny',0,1,3,9,'#0C7A85'],['Ospa wietrzna',0,4,0,6,'#2F8450']];
  const X0=130,U=55;let h='';
  for(let d=0;d<=10;d++){const x=X0+d*U/1.1;h+=`<line x1="${x}" y1="40" x2="${x}" y2="300" stroke="#E2E8E6"/><text x="${x}" y="320" font-size="10" text-anchor="middle" fill="#6B7A82">${d}</text>`}
  h+='<text x="10" y="24" font-size="13" font-weight="800" fill="#13232C">Dzień choroby (orientacyjnie)</text>';
  R.forEach((r,i)=>{const y=52+i*42,sc=U/1.1;
    h+=`<text x="${X0-8}" y="${y+22}" text-anchor="end" font-size="12.5" font-weight="700" fill="${r[5]}">${r[0]}</text>
    <rect x="${X0+r[1]*sc}" y="${y}" width="${(r[2]-r[1])*sc}" height="14" rx="6" fill="#C23B2A" opacity=".85"/>
    <rect x="${X0+r[3]*sc}" y="${y+18}" width="${(r[4]-r[3])*sc}" height="14" rx="6" fill="#6E4CB0" opacity=".85"/>`});
  h+='<rect x="140" y="332" width="12" height="8" fill="#C23B2A"/><text x="156" y="340" font-size="10.5" fill="#44545D">gorączka</text><rect x="230" y="332" width="12" height="8" fill="#6E4CB0"/><text x="246" y="340" font-size="10.5" fill="#44545D">wysypka</text>';
  $('#rashSvg').innerHTML=h;
})();
const RASH=[
 ['s','🔴','Odra','wirus odry · plamki Koplika',[['Obraz','Prodrom: gorączka, katar, kaszel, zapalenie spojówek; plamki Koplika; następnie plamisto-grudkowa, zlewna wysypka od twarzy w dół.'],['Powikłania','Zapalenie ucha, płuc, mózgu; SSPE (późno).'],['Izolacja','Od okresu nieżytowego do 4 dni po wysypce (Moodle #109).']],'Koplik poprzedza wysypkę o 1–2 dni.','Plamek Koplika nie ma w płonicy.'],
 ['i','🟦','Różyczka','wirus różyczki',[['Obraz','Drobnoplamista wysypka, powiększone węzły potyliczne i zauszne, łagodny przebieg.'],['Wrodzona','Triada Gregga: zaćma, wada serca, głuchota (Moodle).'],['Zakaźność','Około 7 dni przed i 6 dni po wysypce (wnioskowane).']],'Ciężarna w kontakcie = pilne badania serologiczne.','Ślepota nie należy do powikłań nabytej różyczki (Moodle).'],
 ['f','🟣','Rumień nagły','HHV-6 · trzydniówka',[['Obraz','Wysoka gorączka przez 3 dni, dobry stan, potem drobna wysypka po spadku gorączki.'],['Powikłanie','Drgawki gorączkowe.']],'Gorączka PRZED wysypką.','Odra: wysypka w szczycie gorączki.'],
 ['e','🟢','Rumień zakaźny','parwowirus B19',[['Obraz','„Policzki uderzone”, potem koronkowa lub girlandowa wysypka na tułowiu i kończynach.'],['Ryzyko','Przełom aplastyczny w niedokrwistościach hemolitycznych [13a]; obrzęk uogólniony płodu.']],'Pula: „motyl” na twarzy z gorączką = rumień zakaźny.','Nie myl z SLE.'],
 ['s','🟠','Płonica (szkarlatyna)','GAS wytwarzający toksynę',[['Obraz','Angina, malinowy język, drobnogrudkowa wysypka „papier ścierny”, trójkąt Fiłatowa, linie Pastii, późne łuszczenie.'],['Leczenie','Fenoksymetylpenicylina 100 000–200 000 j.m./kg/dobę, 10 dni.'],['Powikłania','Gorączka reumatyczna, OKZN [4].']],'Pastia i Fiłatow = płonica.','Jednostki j.m., nie mg.'],
 ['i','🫧','Ospa wietrzna i półpasiec','VZV',[['Obraz','Wykwity w rzutach: plamka, grudka, pęcherzyk, strup w różnych stadiach.'],['Zakaźność','Od 1–2 dni przed wysypką; kontakt = odroczenie zabiegu planowego (Moodle #183).'],['Szczepienie','W PSO 2026 obowiązkowe tylko w grupach ryzyka.']],'Pęcherzyki w różnych stadiach.','Noworodek matki z ospą okołoporodowo = immunoglobulina.'],
 ['e','🖐️','Choroba dłoni, stóp i jamy ustnej','Coxsackie A16, EV71 · „bostonka”',[['Obraz','Wykwity na dłoniach, stopach i błonie śluzowej jamy ustnej.'],['Pula','Dystraktor przy Kawasaki.']],'Dobry stan ogólny, przebieg samoograniczający.','Różnicuj z Kawasaki: tu nie ma 5 dni wysokiej gorączki.'],
 ['f','🧬','Mononukleoza zakaźna','EBV',[['Obraz','Angina z wysiękiem, powiększone węzły, hepatosplenomegalia.'],['Wysypka','Po amoksycylinie lub ampicylinie.'],['Pula','Fałsz: „zarażonych ok. 20–30% populacji”; przechodzi ok. 95%, objawowo ok. 20%.']],'Jednostronnie powiększony migdał = chłoniak? [11].','Nie lecz anginy EBV beta-laktamem.'],
 ['s','🧸','Choroba Kawasaki','zapalenie naczyń',[['Kryteria','Gorączka ≥5 dni + obustronne nieropne zapalenie spojówek, zmiany ust (spękane wargi, malinowy język), zmiany dłoni i stóp, wysypka, węzły szyjne.'],['Leczenie','IVIG + kwas acetylosalicylowy (Moodle #42).'],['Powikłanie','Tętniaki tętnic wieńcowych.']],'7 dni gorączki + wysypka + obrzęk dłoni po amoksycylinie bez poprawy = Kawasaki.','Różnicuj: płonica, EBV, leptospiroza, gorączka plamista Gór Skalistych, zatrucie rtęcią.'],
 ['s','🩸','Posocznica meningokokowa i plamica','N. meningitidis',[['Obraz','Gorączka, szybka progresja, zła perfuzja, wybroczyny niezanikające przy ucisku.'],['Postępowanie','Antybiotyk natychmiast, płyny, OIOM; chemioprofilaktyka kontaktów.']],'Wybroczyny + gorączka = antybiotyk bez zwłoki.','ITP i HSP: dobry wygląd [12].']
];
$('#rashCards').innerHTML=RASH.map(r=>`<details class="dc" data-c="${r[0]}"><summary><span class="em">${r[1]}</span><span class="t">${r[2]}<small>${r[3]}</small></span></summary><div class="body">${r[4].map(x=>`<div class="row"><b>${x[0]}</b> ${x[1]}</div>`).join('')}<div class="pearl">💎 ${r[5]}</div><div class="trap">⚠️ ${r[6]}</div></div></details>`).join('');

/* ===== neuro ===== */
(function(){
  const cols=[['Prawidłowy','#2F8450',['przejrzysty','bardzo mało komórek','glukoza prawidłowa','białko prawidłowe']],
              ['Wirusowe','#2B63AE',['przejrzysty / opalizujący','10–500 komórek','limfocyty','glukoza prawidłowa','białko ↑ niewielkie']],
              ['Bakteryjne','#C23B2A',['mętny','100–10 000 komórek','granulocyty','glukoza ↓','białko ↑↑']]];
  let h='<text x="10" y="20" font-size="13" font-weight="800" fill="#13232C">Płyn mózgowo-rdzeniowy</text>';
  cols.forEach((c,i)=>{const x=10+i*150;
    h+=`<rect x="${x}" y="36" width="142" height="270" rx="14" fill="#fff" stroke="${c[1]}" stroke-width="2.5"/><rect x="${x}" y="36" width="142" height="36" rx="14" fill="${c[1]}"/><rect x="${x}" y="58" width="142" height="14" fill="${c[1]}"/>
    <text x="${x+71}" y="60" text-anchor="middle" font-size="13.5" font-weight="800" fill="#fff">${c[0]}</text>`;
    c[2].forEach((t,j)=>h+=`<text x="${x+71}" y="${106+j*40}" text-anchor="middle" font-size="11.5" fill="${j<3?'#13232C':'#44545D'}" font-weight="${j==0?800:500}">${t}</text>`)});
  $('#csfSvg').innerHTML=h;
})();
flow('menFlow',[
 ['start','Podejrzenie bakteryjnego ZOMR: gorączka + ból głowy + sztywność karku lub zaburzenia świadomości'],
 ['red','<b>ABCDE, dostęp, posiew krwi, glikemia</b><small>wstrząs? płyny i antybiotyk bez zwłoki</small>'],
 ['blue','<b>Antybiotyk i.v. w ≤1 h od przyjęcia (NICE NG240)</b><small>ceftriakson; noworodek: ampicylina + aminoglikozyd lub cefotaksym; wankomycyna wg lokalnych zasad</small>'],
 ['amber','<b>Deksametazon u dzieci &gt;3 mies.</b><small>z lub przed pierwszą dawką antybiotyku; nie opóźniaj antybiotyku; nie rutynowo w IChM</small>'],
 {br:[[['green','<b>LP bezpieczna i nie opóźnia leczenia</b><small>wykonaj, najlepiej przed antybiotykiem</small>']],[['red','<b>Przeciwwskazania do LP</b><small>triada Cushinga, objawy ogniskowe, niestabilność, zaburzenia krzepnięcia → bez LP; obrazowanie po stabilizacji</small>']]]},
 ['violet','<b>Meningokoki</b><small>ceftriakson 5 dni; chemioprofilaktyka kontaktów (rifampicyna, ceftriakson, cyprofloksacyna); zgłoszenie do sanepidu</small>']]);

/* ===== sepsa ===== */
(function(){
  const X=m=>40+m/180*620;let h='<line x1="40" y1="120" x2="660" y2="120" stroke="#9AA7AD" stroke-width="4"/>';
  [[0,'0'],[60,'1 h'],[120,'2 h'],[180,'3 h']].forEach(([m,l])=>h+=`<circle cx="${X(m)}" cy="120" r="7" fill="#13232C"/><text x="${X(m)}" y="146" font-size="12" font-weight="800" text-anchor="middle" fill="#13232C">${l}</text>`);
  h+=`<rect x="${X(0)}" y="96" width="${X(60)-X(0)}" height="12" rx="5" fill="#2B63AE"/>`;
  const box=(x,y,w,t,sub,c)=>`<rect x="${x}" y="${y}" width="${w}" height="76" rx="12" fill="#fff" stroke="${c}" stroke-width="2.5"/><text x="${x+w/2}" y="${y+24}" font-size="13" font-weight="800" text-anchor="middle" fill="${c}">${t}</text>`+sub.map((u,i)=>`<text x="${x+w/2}" y="${y+44+i*16}" font-size="11.5" text-anchor="middle" fill="#44545D">${u}</text>`).join('');
  h+=box(10,8,250,'Bolusy płynów',['10–20 ml/kg, reewaluacja po każdym','do 40–60 ml/kg w 1. godzinie (z OIOM)'],'#2B63AE');
  h+=box(275,8,200,'Wstrząs septyczny',['antybiotyk ≤1 h','jak najszybciej'],'#C23B2A');
  h+=box(490,8,200,'Sepsa bez wstrząsu',['szybka ocena','antybiotyk najlepiej ≤3 h'],'#B8730F');
  h+=box(10,162,320,'Posiew krwi przed antybiotykiem',['tylko jeśli nie opóźnia leczenia'],'#6E4CB0');
  h+=box(350,162,340,'LP i obrazowanie',['nie opóźniają antybiotyku','po ustabilizowaniu dziecka'],'#0C7A85');
  h+='<text x="10" y="252" font-size="11" fill="#6B7A82">Źródło: SSC dzieci 2026 (SCCM); płyny zbilansowane preferowane nad 0,9% NaCl.</text>';
  $('#sepSvg').innerHTML=h;
})();
$('#sirsTable').innerHTML=`<thead><tr><th></th><th>Pula / wykład</th><th>Phoenix 2024</th><th>SSC dzieci 2026</th></tr></thead><tbody>
<tr><td><b>Sepsa</b></td><td>SIRS + zakażenie</td><td>zakażenie + zaburzenie narządów (PSS ≥2)</td><td>definicja wg Phoenix</td></tr>
<tr><td><b>Wstrząs</b></td><td>hipotensja, CRT &gt;2 s, tachykardia</td><td>sepsa + ≥1 pkt w układzie krążenia</td><td>antybiotyk ≤1 h</td></tr>
<tr><td><b>Płyny</b></td><td>0,9% NaCl 10–20 ml/kg</td><td>—</td><td>do 40–60 ml/kg w 1. h; zbilansowane; reewaluacja</td></tr>
<tr><td><b>Antybiotyk</b></td><td>pierwsza godzina</td><td>—</td><td>wstrząs ≤1 h; bez wstrząsu ≤3 h</td></tr></tbody>`;
$('#sepSteps').innerHTML=[
 ['','<b>Rozpoznaj</b> PAT, ABCDE, CRT, tętno, ciśnienie, świadomość [5]'],
 ['b','<b>Dostęp i monitor</b> i.v./i.o., tlen, glikemia, mleczany, posiew krwi'],
 ['g','<b>Bolus 10–20 ml/kg</b> płynu zbilansowanego, reewaluacja po każdym'],
 ['a','<b>Antybiotyk szerokospektralny</b> ≤1 h przy wstrząsie'],
 ['v','<b>Źródło zakażenia</b> drenaż, usunięcie cewnika, LP jeśli bezpieczna'],
 ['','<b>Eskalacja</b> brak odpowiedzi na płyny → konsultacja OIT']].map(x=>`<div class="step ${x[0]}"><div>${x[1]}</div></div>`).join('');

/* ===== szczepienia ===== */
$('#vacTable').innerHTML=`<thead><tr><th>Choroba (moduł)</th><th>Szczepienie</th><th>Uwaga</th></tr></thead><tbody>
<tr><td>Zapalenie nagłośni, ZOMR, posocznica Hib</td><td>Hib (np. ACT-HIB)</td><td>profilaktyka zapalenia nagłośni w kluczu puli</td></tr>
<tr><td>Pneumokokowe PZP, ZOMR, OZUŚ</td><td>PCV: 2, 4, 13–15 m.ż.</td><td>obowiązkowe w całej populacji (PSO 2026)</td></tr>
<tr><td>Rotawirusy [3]</td><td>rotawirusy</td><td>obowiązkowe (PSO 2026); klucz Moodle #224 jest przestarzały</td></tr>
<tr><td>Odra, różyczka, świnka</td><td>MMR (żywa)</td><td>po przebytej różyczce także MMR (Moodle)</td></tr>
<tr><td>Krztusiec, błonica, tężec</td><td>DTP</td><td>odporność poszczepienna słabnie; krztusiec u nastolatków</td></tr>
<tr><td>Ospa wietrzna</td><td>wiek i grupy ryzyka</td><td>obowiązkowa tylko w grupach ryzyka (PSO 2026)</td></tr>
<tr><td>Meningokoki</td><td>szczepienie zalecane</td><td>nie jest obowiązkowe w populacji; kontaktom chemioprofilaktyka</td></tr></tbody>`;

/* ===== dawki ===== */
const f=(n,d=1)=>{const v=Math.round(n*Math.pow(10,d))/Math.pow(10,d);return v>=10000?v.toLocaleString('pl-PL'):String(v).replace('.',',')};
const cap=(v,m)=>Math.min(v,m);
const DOSES=[
 ['Angina GAS i płonica (NPOA 2016)'],
 ['Fenoksymetylpenicylina',w=>w<40?`${f(w*100000,0)}–${f(w*200000,0)} j.m./dobę w 2 dawkach<small>100 000–200 000 j.m./kg/dobę, 10 dni</small>`:`2–3 mln j.m./dobę<small>&gt;40 kg, 10 dni</small>`,'NPOA 2016'],
 ['Benzylpenicylina benzatynowa i.m.',w=>w<40?`600 000 j.m. jednorazowo<small>przy braku współpracy</small>`:`1,2 mln j.m. jednorazowo<small>przy braku współpracy</small>`,'NPOA 2016'],
 ['Cefadroksyl (nawrót u nosiciela)',w=>`${f(w*30,0)} mg raz na dobę<small>30 mg/kg, 10 dni</small>`,'NPOA 2016'],
 ['OZUŚ i PZP'],
 ['Amoksycylina lub z klawulanianem',w=>`${f(w*80,0)}–${f(w*90,0)} mg/dobę<small>80–90 mg/kg/dobę w dawkach podzielonych; maks. nie określono w źródle</small>`,'Wykład zakładu'],
 ['Krup'],
 ['Deksametazon p.o.',w=>`${f(cap(w*.15,12),1)}–${f(cap(w*.6,12),1)} mg<small>0,15–0,6 mg/kg, maks. 12 mg, jednorazowo</small>`,'Wykład zakładu; QPEC; MSF'],
 ['Budezonid w nebulizacji',w=>`2 mg<small>alternatywa dla deksametazonu</small>`,'QPEC; NHS Highland'],
 ['ZOMR'],
 ['Deksametazon i.v. (&gt;3 mies.)',w=>`${f(cap(w*.15,10),1)} mg co 6 h przez 4 dni<small>0,15 mg/kg, maks. 10 mg na dawkę; z lub przed pierwszą dawką antybiotyku</small>`,'NICE NG240 (przegląd dowodów)'],
 ['Sepsa'],
 ['Bolus płynu',w=>`${f(w*10,0)}–${f(w*20,0)} ml<small>10–20 ml/kg, reewaluacja po każdym</small>`,'Wykład; SSC 2026'],
 ['Łącznie w 1. godzinie',w=>`do ${f(w*40,0)}–${f(w*60,0)} ml<small>40–60 ml/kg, gdy dostępna intensywna terapia</small>`,'SSC 2026']
];
function renderDose(){
 const w=+$('#wt').value;$('#wOut').textContent=w;$('#wtNum').value=w;
 $('#doseTable').className='dose';$('#doseTable').innerHTML=`<thead><tr><th>Lek / postępowanie</th><th>Dla ${w} kg</th><th>Źródło</th></tr></thead><tbody>`+DOSES.map(d=>d.length===1?`<tr class="grp"><td colspan="3">${d[0]}</td></tr>`:`<tr><td>${d[0]}</td><td>${d[1](w)}</td><td class="small">${d[2]}</td></tr>`).join('')+'</tbody>';
}
$('#wt').oninput=renderDose;
$('#wtNum').onchange=e=>{let v=Math.max(3,Math.min(80,+e.target.value||20));$('#wt').value=v;renderDose()};
renderDose();

/* ===== klucz vs wytyczne ===== */
$('#gapTable').innerHTML=`<thead><tr><th>Temat</th><th>Pod zaliczenie (wg puli/zakładu)</th><th>Aktualnie klinicznie (wg wytycznych)</th></tr></thead><tbody>`+GAP.map(g=>`<tr><td><b>${g[0]}</b></td><td>${g[1]}</td><td>${g[2]}</td></tr>`).join('')+'</tbody>';

/* ===== źródła ===== */
$('#srcList').innerHTML=SOURCES.map(s=>/^(https?:|\.\.\/)/.test(s[1])?`<li><a href="${s[1]}" ${s[1].startsWith('http')?'target="_blank" rel="noopener"':''}>${s[0]}</a></li>`:`<li>${s[0]} (${s[1]})</li>`).join('');

/* ===== graf międzymodułowy ===== */
(function(){
  const s=$('#crossSvg'),cx=340,cy=250;
  const N=[['[1]','Ból brzucha','wgłobienie, wyrostek, ZUM'],['[3]','Biegunki','rota, HUS, odwodnienie'],['[4]','KZN','OKZN po GAS'],['[5]','Stany nagłe','PAT, krup, nagłośnia, wstrząs'],['[11]','Hemato-onko','migdałek, PCP, neutropenia'],['[12]','Skazy','wybroczyny, HSP, ITP'],['[13b]','Odporność','PNO, szczepienia'],['[14]','ZUM','gorączka bez ogniska']];
  const col=['#B8730F','#2F8450','#2B63AE','#C23B2A','#6E4CB0','#0C7A85','#B8730F','#2B63AE'];
  let h='';const pos=N.map((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length;return [cx+245*Math.cos(a),cy+195*Math.sin(a)]});
  pos.forEach(p=>h+=`<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#9AA7AD" stroke-width="2"/>`);
  h+=`<circle cx="${cx}" cy="${cy}" r="56" fill="#0C7A85"/><text x="${cx}" y="${cy}" text-anchor="middle" fill="#fff" font-size="26" font-weight="800">[2]</text><text x="${cx}" y="${cy+20}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">Zakażenia</text>`;
  N.forEach((n,i)=>{const [x,y]=pos[i],w=190,hh=58;
    h+=`<rect x="${x-w/2}" y="${y-hh/2}" width="${w}" height="${hh}" rx="12" fill="#fff" stroke="${col[i]}" stroke-width="2.2"/><text x="${x}" y="${y-6}" text-anchor="middle" font-size="13.5" font-weight="800" fill="${col[i]}">${n[0]} ${n[1]}</text><text x="${x}" y="${y+14}" text-anchor="middle" font-size="11" fill="#44545D">${n[2]}</text>`});
  s.innerHTML=h;
})();
$('#traps').innerHTML=[
 ['[1]','Napadowy ból brzucha, szaro-blady chłopiec po infekcji: wgłobienie, nie sepsa. Gorączka bez objawów dyzurycznych: pomyśl o moczu i dolnym płacie płuca.'],
 ['[3]+[12]+[15]','Krwista biegunka, skąpomocz, wybroczyny, żółtaczka: HUS. Badania: kreatynina i morfologia z płytkami.'],
 ['[4]','Angina GAS bez pełnych 10 dni penicyliny: gorączka reumatyczna po 2–4 tygodniach, OKZN po 1–3 tygodniach.'],
 ['[5]','Stridor + ślinotok + nie pije: nagłośnia. Nie badać gardła, zabezpieczyć drogi oddechowe. Wstrząs: bolus i antybiotyk.'],
 ['[11]','Jednostronnie powiększony migdałek, węzły, objawy B: chłoniak, nie „zwykła angina”. Wybroczyny i cytopenie: białaczka.'],
 ['[13b]','Częste przeziębienia nie budzą podejrzenia PNO; ciężkie, nietypowe lub nawracające bakteryjne tak. Pneumocystis u leczonych immunosupresyjnie.'],
 ['[14]','Gorączka bez ogniska u 2-latki z leukocyturią i CRP: ZUM; mocz pobrany wiarygodnie przed antybiotykiem.']
].map(x=>`<div class="callout"><b class="k">${x[0]}</b>${x[1]}</div>`).join('');

/* ===== quiz ===== */
(function(){
 Q.forEach(q=>{if(q.fix)return;let seed=q.n*7919+13;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};
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
   return `<article class="q" id="q${q.n}"><header><span class="n">Zad. ${q.n}</span><span class="mod">[2]</span><span class="tbadge">${TOPICS[q.t]}</span><span class="kb ${c[0]}">${c[1]}</span>${q.own?'<span class="tbadge">zadanie autorskie</span>':''}${q.adapt?'<span class="tbadge" title="Treść pytania lub opcji uzupełniona/uproszczona">✎ opcje uzupełnione</span>':''}<span class="src">${q.s}</span></header>
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
bars('barsPool',Object.keys(TOPICS).map(k=>({l:TOPICS[k],v:cnt(k),c:TC[k],t:cnt(k)+' zad.'})),'');

/* nav highlight */
const links=$$('#navlist a'),secs=links.map(a=>$(a.getAttribute('href')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s&&io.observe(s));
