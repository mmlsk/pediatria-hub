(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const C={red:'#C23B2A',redl:'#FBE6E2',blue:'#2B63AE',bluel:'#E1ECF9',green:'#2F8450',greenl:'#E1F3E7',violet:'#6E4CB0',violetl:'#ECE6F8',amber:'#B8730F',amberl:'#FCEFD6',teal:'#0C7A85',teall:'#DDF1F2',ink:'#13232C',mut:'#6B7A82',rose:'#B4325A',rosel:'#FBE7EE',line:'#DCE2E0'};
const A=(u,t)=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`;

/* ---------- helpery SVG ---------- */
function svg(id,w,h,inner){
 const el=$('#'+id);el.setAttribute('viewBox',`0 0 ${w} ${h}`);el.setAttribute('width',w);el.classList.add('sch');
 el.innerHTML=`<defs><marker id="ah${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#5B6B73"/></marker></defs>`+inner.replace(/__M__/g,`url(#ah${id})`);
}
function T(x,y,t,o={}){const fs=o.fs||12.5,fw=o.fw||500,fill=o.fill||C.ink,an=o.an||'middle';return `<text x="${x}" y="${y}" font-size="${fs}" font-weight="${fw}" fill="${fill}" text-anchor="${an}">${t}</text>`}
function box(x,y,w,h,lines,o={}){
 const fs=o.fs||12,lh=o.lh||fs*1.3,f=o.f||'#fff',s=o.s||C.ink,tc=o.tc||C.ink;
 if(o.n){const nl=[],nb=[];lines.forEach((l,i)=>{W(l,o.n).forEach(x=>{nb.push((o.bold===true&&i===0)||(Array.isArray(o.bold)&&o.bold.includes(i))?nl.length:-1);nl.push(x)})});lines=nl;o={...o,bold:nb.filter(x=>x>=0)}}
 let r=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx||10}" fill="${f}" stroke="${s}" stroke-width="${o.sw||1.6}" ${o.dash?'stroke-dasharray="5 4"':''}/>`;
 const tot=lines.length*lh,y0=y+(h-tot)/2+lh*0.78;
 lines.forEach((l,i)=>{const b=(o.bold===true&&i===0)||(Array.isArray(o.bold)&&o.bold.includes(i));r+=T(x+w/2,y0+i*lh,l,{fs:fs,fw:b?800:500,fill:b&&o.hc?o.hc:tc})});
 return r;
}
function W(t,n){const w=t.split(' ');const o=[];let c='';w.forEach(x=>{if((c+' '+x).trim().length>n){o.push(c);c=x}else c=(c+' '+x).trim()});if(c)o.push(c);return o}
function path(d,col,dash){return `<path d="${d}" fill="none" stroke="${col||'#5B6B73'}" stroke-width="1.8" marker-end="__M__" ${dash?'stroke-dasharray="5 4"':''}/>`}
function line(x1,y1,x2,y2,col){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col||'#5B6B73'}" stroke-width="1.8"/>`}

/* ---------- Hero ---------- */
(function(){
 const rows=[['[12] Skazy krwotoczne','PLT · PFA · PT / APTT · TT',C.red],['[13a] Niedokrwistości','MCV · retikulocyty · ferrytyna',C.blue],['[13b] Zaburzenia odporności','JMF · Ig · limfocyty · TREC',C.violet],['Pułapki międzymodułowe','HUS · IgAV · WAS · celiakia + IgA',C.amber]];
 let s='';rows.forEach((r,i)=>{const y=14+i*76;
  s+=`<rect x="8" y="${y}" width="364" height="66" rx="12" fill="#fff" stroke="${r[2]}" stroke-width="2"/><rect x="8" y="${y}" width="12" height="66" rx="5" fill="${r[2]}"/>`;
  s+=T(34,y+28,r[0],{fs:15,fw:800,an:'start'})+T(34,y+50,r[1],{fs:12,fill:C.mut,an:'start',fw:600});});
 s+=T(190,322,'Wiek determinuje diagnozę',{fs:12,fw:700,fill:C.teal});
 $('#heroSvg').innerHTML=s;
})();

/* ---------- Schemat 1: algorytm skaz ---------- */
(function(){
 let s='';
 s+=box(300,8,300,40,['Krwawienie / wybroczyny / sińce'],{f:C.teal,s:C.teal,tc:'#fff',bold:true,fs:13.5});
 s+=path('M450 48V70');
 s+=box(300,70,300,40,['Gdzie i kiedy krwawi?'],{f:C.teall,s:C.teal,bold:true});
 s+=path('M390 110L250 140',C.red)+path('M510 110L690 140',C.violet);
 s+=box(20,140,450,56,['Skóra i błony śluzowe, krwawienie od razu po urazie','(hemostaza pierwotna: naczynia + płytki)'],{f:C.rosel,s:C.rose,fs:12.5,bold:[0]});
 s+=box(480,140,420,56,['Głębokie: stawy, mięśnie, krwawienie opóźnione','(hemostaza wtórna: osocze)'],{f:C.violetl,s:C.violet,fs:12.5,bold:[0]});
 s+=path('M245 196V220',C.rose)+path('M690 196V220',C.violet);
 s+=box(20,220,450,40,['Morfologia z rozmazem: PLT, następnie PFA-100 / czas krwawienia'],{fs:12.5,s:C.rose});
 s+=box(480,220,420,40,['PT, APTT, TT / fibrynogen (+ PLT, rozmaz)'],{fs:12.5,s:C.violet});
 const L=[[10,['PLT ↓','Małopłytkowość:','ITP, HUS / TTP, TAR,','WAS, aplazja,','białaczka, DIC,','hipersplenizm'],C.red,C.redl],
  [165,['PLT N, PFA ↑','Zaburzenie funkcji:','vWD, Glanzmann,','Bernard-Soulier,','ASA / NLPZ,','kw. walproinowy'],C.amber,C.amberl],
  [320,['PLT N, PFA N','Skaza naczyniowa:','IgAV, meningokok,','zesp. tkanki łącznej,','szkorbut'],C.rose,C.rosel]];
 L.forEach(c=>{s+=path(`M${c[0]+72} 260V290`,c[2]);s+=box(c[0],290,145,150,c[1],{f:c[3],s:c[2],bold:true,hc:c[2],fs:11.5})});
 const R=[[480,['APTT ↑, PT N','Tor wewnątrzpochodny:','hemofilia A (VIII)','hemofilia B (IX)','niedobór XI','vWD (zmienny)'],C.violet,C.violetl],
  [620,['PT ↑, APTT N','Tor zewnątrzpochodny:','niedobór VII','(wczesny niedobór','wit. K, warfaryna)'],C.blue,C.bluel],
  [760,['PT ↑ i APTT ↑','Tor wspólny:','X, V, II, fibrynogen','VKDB, choroby wątroby,','DIC (PLT ↓,','fibrynogen ↓)'],C.red,C.redl]];
 R.forEach(c=>{s+=path(`M${c[0]+66} 260V290`,c[2]);s+=box(c[0],290,132,150,c[1],{f:c[3],s:c[2],bold:true,hc:c[2],fs:11.5})});
 s+=box(480,452,420,52,['PT, APTT, TT prawidłowe, a krwawi:','niedobór XIII (stabilizacja skrzepu), α2-antyplazmina, łagodne vWD'],{f:'#fff',s:C.mut,dash:true,fs:11.5,bold:[0]});
 s+=box(20,452,450,52,['Wywiad i badanie przedmiotowe ważniejsze niż pojedynczy wynik.','Prawidłowy przesiew nie wyklucza skazy (XIII, łagodne vWD).'],{f:'#fff',s:C.mut,dash:true,fs:11.5,bold:[0]});
 s+=box(20,520,880,64,['Drugi rząd (po przesiewie): vWF:Ag, vWF:RCo i FVIII:C; aktywność VIII, IX, XI, XIII; agregacja płytek; test Coombsa; LDH, bilirubina; kreatynina i mocz (HUS, IgAV);','mielogram przy cytopenii; STEC w kale przy krwistej biegunce.'],{f:C.teall,s:C.teal,fs:12,bold:false});
 svg('svgAlg',920,600,s);
})();

/* ---------- Tabela profili lab ---------- */
(function(){
 const c=(t,k)=>`<td class="${k}">${t}</td>`;
 const rows=[
 ['ITP',['↓','l'],['N','n'],['N','n'],['N','n'],['N','n'],'Izolowana małopłytkowość, dziecko w dobrym stanie'],
 ['IgAV',['N','n'],['N','n'],['N','n'],['N','n'],['N','n'],'Plamica niemałopłytkowa; mocz i RR'],
 ['vWD (typ 1–2)',['N','n'],['↑','h'],['N','n'],['N lub ↑','v'],['N','n'],'vWF:Ag i RCo ↓; typ 2B może dawać małopłytkowość'],
 ['Hemofilia A / B',['N','n'],['N','n'],['N','n'],['↑','h'],['N','n'],'Aktywność VIII lub IX ↓'],
 ['VKDB / niedobór wit. K',['N','n'],['N','n'],['↑','h'],['↑','h'],['N','n'],'Zależne od K: II, VII, IX, X'],
 ['DIC',['↓','l'],['↑','h'],['↑','h'],['↑','h'],['TT ↑, fibrynogen ↓','v'],'Sepsa, uraz; D-dimery ↑'],
 ['Glanzmann (trombastenia)',['N','n'],['↑','h'],['N','n'],['N','n'],['N','n'],'Zaburzona agregacja płytek'],
 ['Niedobór XIII',['N','n'],['N','n'],['N','n'],['N','n'],['N','n'],'Krwawienie z kikuta, ICH; test rozpuszczalności skrzepu'],
 ['HUS',['↓','l'],['—','n'],['N','n'],['N','n'],['N','n'],'Schistocyty, LDH ↑, kreatynina ↑']];
 $('#labTable').innerHTML=`<tr><th>Rozpoznanie</th><th>PLT</th><th>PFA / czas krwawienia</th><th>PT</th><th>APTT</th><th>TT / fibrynogen</th><th>Uwagi</th></tr>`+rows.map(r=>`<tr><td><b>${r[0]}</b></td>${c(...r[1])}${c(...r[2])}${c(...r[3])}${c(...r[4])}${c(...r[5])}<td class="small">${r[6]}</td></tr>`).join('');
})();

/* ---------- Schemat 2: kaskada ---------- */
(function(){
 let s='';
 const K=(x,y,w,l,ky)=>box(x,y,w,38,l,{fs:12.5,bold:true,s:ky?C.red:C.ink,sw:ky?2.4:1.6});
 // nagłówki
 s+=T(150,32,'TOR WEWNĄTRZPOCHODNY',{fs:12,fw:800,fill:C.blue})+T(150,48,'badany przez APTT',{fs:11,fill:C.blue});
 s+=T(580,32,'TOR ZEWNĄTRZPOCHODNY',{fs:12,fw:800,fill:C.green})+T(580,48,'badany przez PT',{fs:11,fill:C.green});
 s+=box(85,60,130,38,['XII'],{bold:true,s:C.blue})+path('M150 98V118');
 s+=box(85,118,130,38,['XI'],{bold:true,s:C.blue})+path('M150 156V176');
 s+=box(85,176,130,38,['IX (K)'],{bold:true,s:C.red,sw:2.4})+box(245,176,130,38,['VIII + vWF'],{bold:true,s:C.blue,f:C.bluel})+line(215,195,245,195,C.mut);
 s+=box(515,60,130,38,['Uraz tkanki: TF'],{bold:false,s:C.green,fs:12})+path('M580 98V118');
 s+=box(515,118,130,38,['VII (K)'],{bold:true,s:C.red,sw:2.4});
 s+=path('M580 156V250H425V272',C.green);
 s+=path('M150 214V250H355V272',C.blue);
 s+=box(300,272,180,40,['X (K) → Xa (+ V)'],{bold:true,s:C.red,sw:2.4,f:C.amberl});
 s+=path('M390 312V340');
 s+=box(300,340,180,40,['II (K) protrombina → trombina'],{bold:true,s:C.red,sw:2.4,f:C.amberl,fs:11.5});
 s+=path('M390 380V408');
 s+=box(300,408,180,40,['Fibrynogen (I) → fibryna'],{bold:true,s:C.violet,f:C.violetl});
 s+=path('M390 448V470');
 s+=box(300,470,180,38,['XIII stabilizuje skrzep'],{s:C.mut,fs:12});
 s+=T(150,238,'(zależny od wit. K = czerwony kontur)',{fs:10.5,fill:C.red});
 // legenda testów (prawa strona)
 s+=box(540,260,250,70,['PT: VII, X, V, II, fibrynogen','(tor zewnątrzpochodny i wspólny)'],{f:C.greenl,s:C.green,fs:12,bold:[0]});
 s+=box(540,340,250,70,['APTT: XII, XI, IX, VIII, X, V, II, I','(tor wewnątrzpochodny i wspólny)'],{f:C.bluel,s:C.blue,fs:12,bold:[0]});
 s+=box(540,420,250,70,['TT: fibrynogen → fibryna','(wydłuża heparyna, hipofibrynogenemia)'],{f:C.violetl,s:C.violet,fs:12,bold:[0]});
 // choroby lewa strona
 s+=box(10,262,270,50,['Hemofilia A: VIII ↓  ·  hemofilia B: IX ↓','APTT ↑, PT prawidłowy'],{f:C.redl,s:C.red,fs:11.5,bold:[0]});
 s+=box(10,322,270,46,['VKDB / warfaryna: II, VII, IX, X ↓','PT ↑ i APTT ↑'],{f:C.redl,s:C.red,fs:11.5,bold:[0]});
 s+=box(10,378,270,46,['vWD: vWF ↓ → adhezja płytek i trwałość VIII','PFA ↑, APTT N lub ↑'],{f:C.redl,s:C.red,fs:11.5,bold:[0]});
 s+=box(10,434,270,70,['Wątroba, DIC:','kilka czynników naraz,','PT i APTT ↑, w DIC PLT ↓ i fibrynogen ↓'],{f:C.amberl,s:C.amber,fs:11.5,bold:[0]});
 svg('svgCasc',800,560,s);
})();

/* ---------- Schemat 3: ITP ---------- */
(function(){
 let s='';
 s+=box(30,14,270,44,['Nowo rozpoznana','0–3 mies. od rozpoznania'],{f:C.greenl,s:C.green,bold:[0],fs:12.5});
 s+=box(300,14,270,44,['Przetrwała','3–12 mies.'],{f:C.amberl,s:C.amber,bold:[0],fs:12.5});
 s+=box(570,14,300,44,['Przewlekła','>12 mies.'],{f:C.redl,s:C.red,bold:[0],fs:12.5});
 s+=box(30,72,840,40,['Rozpoznanie: izolowana małopłytkowość <100 G/l po wykluczeniu innych przyczyn (rozmaz krwi, wywiad lekowy i zakaźny)'],{f:C.teall,s:C.teal,fs:12.5});
 const cols=[[20,['Brak lub niewielkie','krwawienie (skóra)'],['Obserwacja','(ASH 2019: sugerowana nad GKS,','silnie nad IVIG)'],C.green,C.greenl],
 [235,['Krwawienie śluzówkowe','lub gorsza jakość życia'],['Krótki kurs GKS (≤7 dni)','preferowany nad IVIG / anty-D','prednizon 2–4 mg/kg/d (maks. 120 mg)','5–7 dni (ASH)'],C.amber,C.amberl],
 [450,['Krwawienie','zagrażające życiu'],['Leczenie łączone w trybie nagłym:','IVIG + GKS, KKP wg potrzeb','(IVIG: najszybszy wzrost PLT wg puli)'],C.red,C.redl],
 [665,['Przetrwała / przewlekła,','oporna'],['II rząd: agoniści TPO-R,','rytuksymab','Splenektomia: po >12 mies.','i oporności na leczenie'],C.violet,C.violetl]];
 cols.forEach((c,i)=>{s+=box(c[0],130,205,66,c[1],{f:c[4],s:c[3],bold:true,hc:c[3],fs:11.5,lh:14.5})+box(c[0],200,205,128,c[2],{f:'#fff',s:c[3],fs:11.5,bold:[0]});
  if(i<3)s+=path(`M${c[0]+205} 163H${cols[i+1][0]}`,C.mut)});
 s+=box(20,345,430,70,['Pod zaliczenie (wg puli): IVIG najszybciej','podnosi PLT; GKS tradycyjnie leczenie I rzutu.'],{f:C.amberl,s:C.amber,fs:12,bold:[0]});
 s+=box(465,345,415,70,['Aktualnie klinicznie (ASH 2019): obserwacja przy braku','lub niewielkim krwawieniu; leczenie według objawów.'],{f:C.bluel,s:C.blue,fs:12,bold:[0]});
 svg('svgItp',900,430,s);
})();

/* ---------- Tabela hemofilia vs vWD ---------- */
$('#hemTable').innerHTML=`<tr><th>Cecha</th><th>Hemofilia A / B</th><th>Choroba von Willebranda (typy 1–2)</th></tr>
<tr><td><b>Defekt</b></td><td>Niedobór VIII (A) lub IX (B); B około 10 razy rzadsza</td><td>Ilościowy lub jakościowy niedobór vWF (adhezja płytek, nośnik VIII); najczęstsza wrodzona skaza osoczowa wg banku LEK</td></tr>
<tr><td><b>Dziedziczenie, płeć</b></td><td>Recesywne sprzężone z X; chłopcy (dziewczynki wyjątkowo)</td><td>Najczęściej autosomalnie dominujące (typy 1–2); obie płcie</td></tr>
<tr><td><b>Typ krwawienia</b></td><td>Hemartrozy, krwiaki mięśni, krwawienia opóźnione, po szczepieniach i.m.</td><td>Skórno-śluzówkowe: nos, dziąsła, sińce, menorrhagia, po ekstrakcji zęba</td></tr>
<tr><td><b>Wiek ujawnienia</b></td><td>Niemowlę (raczkowanie, chodzenie, szczepienia); ciężka od początku</td><td>Często późno: szkolny i nastolatka (menarche)</td></tr>
<tr><td><b>PLT / PFA / PT / APTT</b></td><td>N / N / N / ↑</td><td>N / ↑ / N / N lub ↑ (typ 2B: możliwa małopłytkowość)</td></tr>
<tr><td><b>Leczenie</b></td><td>Koncentrat czynnika, profilaktyka (standard w ciężkiej); w HA emicizumab; DDAVP w łagodnej HA; antyfibrynolityk wspomagająco</td><td>DDAVP (typ 1 reagujący; w 2B niezalecana), koncentrat vWF / FVIII, kwas traneksamowy 10–15 mg/kg co 6–8 h (zalecenia polskie)</td></tr>
<tr><td><b>Pułapka</b></td><td>Wywiad rodzinny ujemny nie wyklucza (de novo); brak NLPZ i i.m.</td><td>Hemartroza nietypowa (poza typem 3); DDAVP u &lt;2 r.ż. – ryzyko hiponatremii</td></tr>`;

/* ---------- Schemat 4: plan hemofilii ---------- */
(function(){
 let s='';
 const cols=[[10,'Profilaktyka',C.green,C.greenl,['Standard w ciężkiej hemofilii (start przed 3. r.ż.):','regularna substytucja FVIII / FIX','HA: emicizumab (z inhibitorem lub bez);','nie w hemofilii B','Sport: pływanie tak, kontaktowe nie','Pierwotna przed uszkodzeniem stawów,','wtórna po nim']],
 [305,'Ostre krwawienie',C.red,C.redl,['Substytucja czynnika jak najszybciej, RICE','Bez NLPZ i bez wstrzyknięć i.m.','Uraz głowy: czynnik natychmiast','Krwiomocz: nawodnienie i leżenie,','czynnik; bez antyfibrynolityków','Błony śluzowe: antyfibrynolityk wspomagająco','Łagodna HA: DDAVP']],
 [600,'Powikłania',C.violet,C.violetl,['Artropatia hemofilowa (staw docelowy)','Inhibitor: omijające, ITI,','emicizumab w profilaktyce HA','Krwotok śródczaszkowy','Krwiak biodrowo-lędźwiowy','Zakażenia (produkty krwi) – kontrola']]];
 cols.forEach(c=>{s+=box(c[0],10,290,44,[c[1]],{f:c[3],s:c[2],bold:true,hc:c[2],fs:14})+box(c[0],60,290,250,c[4],{f:'#fff',s:c[2],fs:12,lh:19})});
 svg('svgHem',900,330,s);
})();

/* ---------- Normy (PTP 2023) ---------- */
$('#normTable').innerHTML=`<tr><th>Wiek</th><th>Hb (g/dl)</th><th>MCV (fl)</th><th>Ferrytyna: dolna granica (µg/l)</th></tr>
<tr><td>0–7 dni</td><td>13,5–20</td><td>95–115</td><td>153</td></tr>
<tr><td>8–30 dni</td><td>10–16</td><td>85–100</td><td>247</td></tr>
<tr><td>1–3 mies.</td><td>9,5–14,5</td><td>85–100</td><td>148</td></tr>
<tr><td>4–9 mies.</td><td>9,5–13,5</td><td>75–95</td><td>21</td></tr>
<tr><td>9–24 mies.</td><td>10,5–13,5</td><td>75–85</td><td>10</td></tr>
<tr><td>2.–16. rok życia</td><td>11,5–15</td><td>77–85</td><td>10</td></tr>
<tr><td>&gt;16 lat, dziewczęta</td><td>12–16</td><td>78–95</td><td>18</td></tr>
<tr><td>&gt;16 lat, chłopcy</td><td>13–17</td><td>78–95</td><td>16</td></tr>
<tr><td colspan="4" class="small">Źródło: ${A('https://przegladpediatryczny-artykuly.pl/wp-content/uploads/2026/04/2023-3/PP_3-2023_10.26625_10029_Zalecenia_Niedobor_zelaza.pdf','zalecenia PTP 2023, tab. III')}. Przy stanie zapalnym ferrytyna &lt;30 µg/l (do 5 r.ż.) lub &lt;70 µg/l (po 5 r.ż.) wskazuje niedobór.</td></tr>`;

/* ---------- Schemat 5: algorytm anemii ---------- */
(function(){
 let s='';
 s+=box(320,8,300,40,['Niedokrwistość: Hb poniżej normy dla wieku'],{f:C.teal,s:C.teal,tc:'#fff',bold:true,fs:13});
 s+=path('M470 48V68');
 s+=box(320,68,300,38,['MCV (norma zależy od wieku)'],{f:C.teall,s:C.teal,bold:true});
 const cx=[20,330,640],hd=[['MCV ↓ mikrocytarna',C.red,C.redl],['MCV prawidłowe: normocytarna',C.amber,C.amberl],['MCV ↑ makrocytarna',C.violet,C.violetl]];
 hd.forEach((h,i)=>{s+=path(`M${470+(i-1)*150} 106L${cx[i]+140} 134`,h[1]);s+=box(cx[i],134,280,36,[h[0]],{f:h[2],s:h[1],bold:true,hc:h[1],fs:13})});
 const rows=[
 [['Ferrytyna ↓, RDW ↑','Niedobór żelaza (CRP przy zapaleniu)'],['Retikulocyty ↑','Hemoliza (LDH ↑, bilirubina pośrednia ↑, Coombs) lub ostra utrata krwi'],['Retikulocyty ↓, hipersegmentacja','Niedobór B12 / folianów (megaloblastyczna)']],
 [['Ferrytyna N, RDW N, oporność na żelazo','Talasemia (HbA2, elektroforeza Hb)'],['Retikulocyty ↓, pancytopenia','Aplastyczna, Fanconi, nacieczenie szpiku (białaczka)'],['Retikulocyty ↓, tylko linia czerwona, niemowlę','Blackfan-Diamond (aplazja czerwonokrwinkowa)']],
 [['Ferrytyna N lub ↑, żelazo w szpiku ↑','Syderoblastyczna; przewlekła choroba'],['Retikulocyty ↓, inne cytopenie N','Przewlekła choroba, nerki, przejściowa erytroblastopenia dziecięca'],['Retikulocyty ↑','Hemoliza z retikulocytozą; niedoczynność tarczycy, wątroba, leki']]];
 rows.forEach((r,ri)=>r.forEach((c,ci)=>{const y=186+ri*112,col=hd[ci][1];
  s+=(ri===0?path(`M${cx[ci]+140} 170V186`,col):path(`M${cx[ci]+140} ${y-14}V${y}`,col));
  s+=box(cx[ci],y,280,92,W(c[0],38).concat(W(c[1],38)),{f:'#fff',s:col,bold:Array.from({length:W(c[0],38).length},(_,k)=>k),hc:col,fs:11.5,lh:15.5});}));
 s+=box(20,530,900,70,['Zawsze: wiek, rozmaz krwi, retikulocyty, wywiad (dieta, leki, krwawienia, infekcje, rodzina).','Niedokrwistość + hepatosplenomegalia → wyklucz hemolizę i białaczkę; pancytopenia → szpik.'],{f:C.teall,s:C.teal,fs:12.5,bold:[0]});
 svg('svgAn',940,620,s);
})();

/* ---------- Schemat 6: żelazo ---------- */
(function(){
 let s='';
 s+=T(470,22,'Stadia niedoboru żelaza',{fs:14,fw:800});
 const st=[[20,'1. Wyczerpanie zapasów',['Ferrytyna poniżej dolnej granicy dla wieku','Hb i MCV jeszcze prawidłowe'],C.green,C.greenl],
 [330,'2. Erytropoeza niedoborowa',['TSAT <16%, wolna protoporfiryna ↑','CHr <27,5 pg (niemowlęta), RDW ↑','Hb prawidłowa lub na granicy'],C.amber,C.amberl],
 [640,'3. Niedokrwistość z niedoboru żelaza',['Hb ↓, MCV ↓, RDW ↑','Retikulocyty z czasem ↓','Objawy: bladość, męczliwość, pagofagia'],C.red,C.redl]];
 st.forEach((c,i)=>{s+=box(c[0],34,280,110,[c[1]].concat(c[2]),{f:c[4],s:c[3],bold:[0],hc:c[3],fs:12,lh:18});if(i<2)s+=path(`M${c[0]+280} 89H${st[i+1][0]}`,C.mut)});
 s+=T(470,184,'Leczenie doustne: oś czasu (PTP 2023)',{fs:14,fw:800});
 s+=line(30,225,910,225,C.teal).replace('stroke-width="1.8"','stroke-width="4"');
 const ev=[['Dzień 0','Fe elementarne 3–6 mg/kg/d w 1–3 dawkach (maks. 150–200 mg)'],['Dni 3–4','Wzrost retikulocytów (utrzymuje się ok. 2 tyg.)'],['Dni 7–14','Brak wzrostu Hb >1 g/dl w 14. dniu: sprawdź przestrzeganie, przyczynę, rozważ iv'],['Tyg. 2–4','Hb ↑ co najmniej 1 g/dl = odpowiedź na leczenie'],['Mies. 3','Kontrola Hb, ferrytyny i CRP; leczenie ok. 3 mies. po normalizacji Hb'],['Do 6 mies.','Pełna normalizacja ferrytyny']];
 ev.forEach((e,i)=>{const x=10+i*155,cxx=x+72;
  s+=`<circle cx="${cxx}" cy="225" r="8" fill="${C.teal}"/>`+T(cxx,205,e[0],{fs:13,fw:800,fill:C.teal});
  s+=line(cxx,233,cxx,250,C.mut);
  s+=box(x,250,144,104,W(e[1],24),{f:'#fff',s:C.teal,fs:11,lh:15});});
 s+=box(20,372,440,84,['Rozpoznanie NNŻ (PTP): Hb poniżej normy dla wieku','ORAZ niedobór żelaza (ferrytyna) lub MCV ↓ po wykluczeniu talasemii.','Prawidłowe wskaźniki nie wykluczają niedoboru.'],{f:C.bluel,s:C.blue,fs:11.5,bold:[0]});
 s+=box(480,372,440,84,['Pula (S4 2026/27): 4–6 mg/kg/d w 3 dawkach, 6–8 tyg.','PTP 2023: 3–6 mg/kg/d, 1–3 dawki; 3 mg/kg równie skuteczne.','Pokaż obie wersje (pod zaliczenie i klinicznie).'],{f:C.amberl,s:C.amber,fs:11.5,bold:[0]});
 svg('svgFe',940,470,s);
})();

/* ---------- Schemat 7: hemoliza ---------- */
(function(){
 let s='';
 s+=box(220,8,500,56,['Niedokrwistość hemolityczna','retikulocyty ↑, LDH ↑, bilirubina pośrednia ↑, haptoglobina ↓, w moczu urobilinogen'],{f:C.teal,s:C.teal,tc:'#fff',bold:[0],fs:12.5});
 s+=path('M360 64L240 100',C.blue)+path('M580 64L700 100',C.rose);
 s+=box(20,100,440,40,['Wrodzone (wewnątrzkrwinkowe)'],{f:C.bluel,s:C.blue,bold:true,hc:C.blue,fs:13.5});
 s+=box(480,100,440,40,['Nabyte (zewnątrzkrwinkowe)'],{f:C.rosel,s:C.rose,bold:true,hc:C.rose,fs:13.5});
 const L=[['Błona erytrocytu','Sferocytoza wrodzona, eliptocytoza: wieżowata czaszka, żółtaczka, splenomegalia; sferocyty, MCHC ↑, Coombs −; test EMA, oporność osmotyczna ↓',C.blue],
 ['Enzymy','Niedobór G6PD (fawizm, leki, infekcje) i kinazy pirogronianowej: ciałka Heinza, oznaczenie aktywności enzymu',C.green],
 ['Hemoglobina','Talasemie, anemia sierpowata: mikrocytoza, komórki tarczowate, elektroforeza Hb (HbF, HbA2); objawy po 6. mies. (przełączenie HbF → HbA)',C.violet]];
 L.forEach((c,i)=>{const y=164+i*72;s+=box(20,y,440,64,[c[0],c[1]],{f:'#fff',s:c[2],bold:[0],hc:c[2],fs:11,lh:14.5,n:70});s+=path(`M240 ${i?y-8:140}V${y}`,c[2])});
 const R=[['Immunologiczne (Coombs +)','Autoimmunologiczna (przeciwciała ciepłe, zimne); choroba hemolityczna noworodków (ABO, Rh). Leczenie: GKS, IVIG wg wskazań',C.rose],
 ['Mikroangiopatyczne','HUS, TTP, DIC, zastawki mechaniczne: schistocyty, Coombs −; HUS = hemoliza + małopłytkowość + ONN',C.red],
 ['Inne','Zakażenia, leki, zatrucia, oparzenia; hipersplenizm (splenomegalia, cytopenie)',C.amber]];
 R.forEach((c,i)=>{const y=164+i*72;s+=box(480,y,440,64,[c[0],c[1]],{f:'#fff',s:c[2],bold:[0],hc:c[2],fs:11,lh:14.5,n:70});s+=path(`M700 ${i?y-8:140}V${y}`,c[2])});
 s+=box(20,386,900,62,['Powikłania hemolizy: kamica żółciowa, kryzy aplastyczne (parwowirus B19), kryzy hemolityczne po infekcji.','Splenektomia w sferocytozie: szczepienia przed zabiegiem (pneumokoki, meningokoki, Hib) i profilaktyka antybiotykowa; kryzy aplastyczne nie są wskazaniem (wg puli).'],{f:C.amberl,s:C.amber,fs:12,bold:[0],n:125});
 s+=box(20,458,900,62,['Wieżowata czaszka + żółtaczka + splenomegalia + dodatni wywiad rodzinny → sferocytoza; chłopiec po bobie lub leku → fawizm; niemowlę z izolowaną aplazją czerwoną bez hemolizy → Blackfan-Diamond.'],{f:C.teall,s:C.teal,fs:12,n:120});
 svg('svgHemol',940,534,s);
})();

/* ---------- Tabela hipoplazji ---------- */
$('#hypoTable').innerHTML=`<tr><th>Cecha</th><th>Aplazja nabyta</th><th>Fanconi</th><th>Blackfan-Diamond</th><th>TAR</th></tr>
<tr><td><b>Wiek</b></td><td>Każdy; szkolny, nastolatek</td><td>Cytopenie zwykle w wieku szkolnym (ok. 5–10 lat)</td><td>Pierwsze tygodnie–miesiące życia</td><td>Noworodek</td></tr>
<tr><td><b>Linie</b></td><td>Pancytopenia</td><td>Pancytopenia</td><td>Tylko linia czerwona</td><td>Małopłytkowość</td></tr>
<tr><td><b>MCV</b></td><td>N</td><td>Często ↑</td><td>↑ (makrocytoza)</td><td>N</td></tr>
<tr><td><b>Wady</b></td><td>Brak</td><td>Plamy café-au-lait, wady kciuka i kości promieniowej, niski wzrost</td><td>Wady kciuków i inne (część chorych)</td><td>Brak kości promieniowej, kciuki obecne</td></tr>
<tr><td><b>Rozpoznanie</b></td><td>Szpik hipokomórkowy, retikulocytopenia, bez organomegalii</td><td>Test z DEB / MMC (łamliwość chromosomów)</td><td>Aplazja czerwonokrwinkowa w szpiku, oporność na B12 / foliany</td><td>Obraz kliniczny i radiologiczny</td></tr>
<tr><td><b>Leczenie</b></td><td>Przeszczep od zgodnego dawcy lub immunosupresja (ATG + cyklosporyna)</td><td>Przeszczep; nadzór onkologiczny</td><td>GKS, transfuzje, przeszczep</td><td>Transfuzje płytek przy krwawieniu; małopłytkowość łagodnieje z wiekiem</td></tr>
<tr><td colspan="5" class="small">Tabela oparta na wykładach zakładu i standardowej wiedzy klinicznej; w plikach brak lokalnych wymagań co do dawek.</td></tr>`;

/* ---------- Schemat 8: PID donut ---------- */
(function(){
 const d=[['Humoralne',50,C.blue,'XLA, CVID, selektywny IgA'],['Złożone',20,C.violet,'SCID, WAS, A-T, hiper-IgM'],['Fagocytoza',20,C.amber,'Kostmann, CGD'],['Komórkowe',10,C.green,'DiGeorge'],['Dopełniacz',2,C.red,'niedobory C1–C9']];
 const tot=d.reduce((a,b)=>a+b[1],0),cx=130,cy=165,R=110,r=62;let ang=-Math.PI/2,s='';
 d.forEach(x=>{const a2=ang+x[1]/tot*2*Math.PI,la=(a2-ang)>Math.PI?1:0;
  const p=(rad,a)=>[cx+rad*Math.cos(a),cy+rad*Math.sin(a)];
  const [x1,y1]=p(R,ang),[x2,y2]=p(R,a2),[x3,y3]=p(r,a2),[x4,y4]=p(r,ang);
  s+=`<path d="M${x1} ${y1}A${R} ${R} 0 ${la} 1 ${x2} ${y2}L${x3} ${y3}A${r} ${r} 0 ${la} 0 ${x4} ${y4}z" fill="${x[2]}" stroke="#fff" stroke-width="2"/>`;ang=a2;});
 s+=T(cx,cy-2,'PID',{fs:20,fw:800})+T(cx,cy+18,'wg wykładu',{fs:11,fill:C.mut});
 d.forEach((x,i)=>{const y=70+i*52;s+=`<rect x="270" y="${y-12}" width="16" height="16" rx="4" fill="${x[2]}"/>`+T(294,y+1,`${x[0]} ~${x[1]}%`,{fs:13.5,fw:800,an:'start'})+T(294,y+18,x[3],{fs:11.5,fill:C.mut,an:'start'});});
 svg('svgPie',500,330,s);
})();
$('#pidTable').innerHTML=`<tr><th>Grupa</th><th>Przykłady</th><th>Typowe zakażenia</th></tr>
<tr><td><span class="pill b">Humoralne</span></td><td>XLA (Bruton), CVID, selektywny niedobór IgA, przejściowa hipogammaglobulinemia niemowląt</td><td>Bakterie otoczkowe: ucho, zatoki, płuca, sepsa</td></tr>
<tr><td><span class="pill v">Złożone</span></td><td>SCID, WAS, ataksja-teleangiektazja, hiper-IgM</td><td>Bakterie, wirusy, grzyby, Pneumocystis; po BCG rozsiana choroba</td></tr>
<tr><td><span class="pill a">Fagocytoza</span></td><td>Zespół Kostmanna, przewlekła choroba ziarniniakowa</td><td>Ropnie, S. aureus, grzyby; neutrofile stale &lt;500/µl</td></tr>
<tr><td><span class="pill g">Komórkowe</span></td><td>DiGeorge (22q11.2)</td><td>Wirusy, grzyby, Pneumocystis; hipokalcemia, wada serca</td></tr>
<tr><td><span class="pill r">Dopełniacz</span></td><td>Niedobory C1–C9</td><td>Neisseria (późne składowe), choroby autoimmunologiczne (wczesne)</td></tr>
<tr><td colspan="3" class="small">Przynależność do grup wg wykładu i klasyfikacji ogólnej; częstości orientacyjne.</td></tr>`;

/* ---------- Schemat 9: wiek ---------- */
(function(){
 let s='';
 const col=[[10,'Noworodek – 6. mies.',C.red,C.redl,['SCID: kandydoza, biegunka, brak przyrostu','DiGeorge: wada serca, hipokalcemia','Kostmann: neutrofile stale <200/µl','WAS: małopłytkowość, wyprysk','CGD: ropnie, grzyby']],
 [240,'6. mies. – 2 lata',C.blue,C.bluel,['XLA (Bruton): bakteryjne zakażenia','po wygaśnięciu matczynych IgG','Przejściowa hipogammaglobulinemia','niemowląt (minimum IgG 3–6 mies.)','Hiper-IgM']],
 [470,'2 – 6 lat',C.amber,C.amberl,['Ataksja-teleangiektazja: ataksja,','teleangiektazje, infekcje płuc','Selektywny niedobór IgA','(często bezobjawowy)','Defekty dopełniacza: Neisseria']],
 [700,'Wiek szkolny – nastolatek',C.violet,C.violetl,['CVID: nawracające zakażenia','płuc i zatok, autoimmunizacja','Selektywny niedobór IgA','Defekty dopełniacza','Opóźnione rozpoznania PID']]];
 col.forEach((c,i)=>{s+=box(c[0],14,220,44,[c[1]],{f:c[3],s:c[2],bold:true,hc:c[2],fs:13});
  s+=box(c[0],66,220,200,c[4].join(' | ').split(' | '),{f:'#fff',s:c[2],fs:11.5,lh:17,bold:[0],n:34});if(i<3)s+=path(`M${c[0]+220} 36H${col[i+1][0]}`,C.mut)});
 s+=`<rect x="10" y="286" width="220" height="14" rx="7" fill="${C.green}" opacity=".25"/>`+`<rect x="10" y="286" width="450" height="14" rx="7" fill="none"/>`;
 s+=T(120,326,'Matczyne IgG chronią do ok. 6. mies.',{fs:11.5,fw:700,fill:C.green});
 s+=T(470,326,'Zakres wieku orientacyjny; ujawnienie zależy od ciężkości defektu.',{fs:11.5,fill:C.mut,an:'start'});
 svg('svgAge',940,350,s);
})();

/* ---------- JMF ---------- */
(function(){
 const j=[['👂','≥4 nowe zapalenia ucha środkowego w ciągu roku'],['🫁','≥2 ciężkie zapalenia zatok w ciągu roku'],['💊','≥2 miesiące antybiotykoterapii z niewielkim efektem'],['🩻','≥2 zapalenia płuc w ciągu roku'],['⚖️','Brak przyrostu masy ciała lub wzrostu'],['🧫','Nawracające głębokie ropnie skóry lub narządów'],['🍄','Uporczywa kandydoza jamy ustnej lub zmiany grzybicze skóry'],['💉','Konieczność dożylnych antybiotyków'],['🩸','≥2 głębokie zakażenia, w tym sepsa'],['👪','Pierwotny niedobór odporności w rodzinie']];
 $('#jmfGrid').innerHTML=j.map((x,i)=>`<div class="card"><b class="no">${i+1}</b><span class="em">${x[0]}</span>${x[1]}</div>`).join('');
})();

/* ---------- Schemat 10: SCID ---------- */
(function(){
 let s='';
 s+=box(170,8,600,70,['Podejrzenie SCID (niemowlę, zwykle <6 mies.)','limfopenia, ciężkie lub oporne zakażenia, kandydoza, przewlekła biegunka,','brak przyrostu masy, dodatni wynik przesiewu TREC'],{f:C.red,s:C.red,tc:'#fff',bold:[0],fs:12.5});
 s+=path('M470 78V100');
 s+=T(470,118,'Natychmiast (nie czekaj na pełną diagnostykę)',{fs:13,fw:800,fill:C.red});
 const b=[[20,['STOP','szczepionki żywe','BCG, rotawirusowa,','MMR, WZV'],C.red,C.redl],[250,['Izolacja ochronna','i leczenie zakażeń','antybiotyki,','przeciwgrzybicze'],C.amber,C.amberl],[480,['Profilaktyka PCP','kotrimoksazol'],C.blue,C.bluel],[710,['Produkty krwi','napromieniowane','i odleukocytowane'],C.violet,C.violetl]];
 b.forEach(x=>{s+=path('M470 122L'+(x[0]+105)+' 140',x[2]);s+=box(x[0],140,210,100,x[1],{f:x[3],s:x[2],bold:[0],hc:x[2],fs:12.5,lh:18})});
 s+=path('M470 240V268');
 s+=box(140,268,660,64,['Diagnostyka równolegle: morfologia z rozmazem (limfocyty), fenotyp limfocytów (CD3, CD19, NK),','immunoglobuliny, TREC, badania genetyczne; ocena przed szczepieniem BCG'],{f:C.teall,s:C.teal,fs:12.5});
 s+=path('M470 332V360');
 s+=box(140,360,660,64,['Konsultacja ośrodka immunologicznego i przeszczepowego; substytucja IgG;','wczesny przeszczep komórek krwiotwórczych (przed ciężkimi zakażeniami)'],{f:C.greenl,s:C.green,fs:12.5,bold:[0]});
 s+=box(140,440,660,64,['Pułapka: BCG u niewykrytego SCID grozi rozsianą chorobą po BCG.','W 2026 BCG nadal w kalendarzu – decyzja po wyniku przesiewu i konsultacji.'],{f:C.amberl,s:C.amber,fs:12.5,bold:[0]});
 svg('svgScid',940,520,s);
})();

/* ---------- Schemat 11: PNO + szczepienia ---------- */
(function(){
 let s='';
 s+=box(330,8,280,52,['Noworodek: dzień 0–3','kalendarz + przesiew noworodkowy'],{f:C.teal,s:C.teal,tc:'#fff',bold:[0],fs:12.5});
 s+=path('M470 60V84');
 s+=box(220,84,500,56,['Rządowy program badań przesiewowych noworodków 2019–2026:','od 15.09.2025 pilotaż przesiewu w kierunku SCID (TREC)'],{f:C.teall,s:C.teal,fs:12.5,bold:[0]});
 s+=path('M360 140L230 176',C.red)+path('M580 140L710 176',C.green);
 s+=box(20,176,420,100,['Wynik dodatni lub niepewny','pilne powtórzenie / skierowanie do immunologa,','do wyjaśnienia nie podawać szczepionek żywych','(BCG, rotawirusowa)'],{f:C.redl,s:C.red,bold:[0],hc:C.red,fs:12.5});
 s+=box(500,176,420,100,['Wynik ujemny','szczepienia wg kalendarza,','dalsza czujność: objawy JMF, zakażenia w niemowlęctwie','(przesiew nie wykrywa wszystkich PID)'],{f:C.greenl,s:C.green,bold:[0],hc:C.green,fs:12.5});
 s+=T(470,306,'Szczepionki żywe a niedobory odporności',{fs:14,fw:800});
 s+=box(20,320,290,130,['Przeciwwskazane','ciężkie niedobory komórkowe i złożone (SCID),','immunosupresja, ciężka limfopenia T','BCG, rotawirusowa, MMR, WZV'],{f:C.redl,s:C.red,bold:[0],hc:C.red,fs:11.5,lh:17});
 s+=box(325,320,290,130,['Decyzja immunologa','niedobory humoralne (np. XLA, CVID):','indywidualna ocena;','DiGeorge – zależnie od liczby limfocytów T'],{f:C.amberl,s:C.amber,bold:[0],hc:C.amber,fs:11.5,lh:17});
 s+=box(630,320,290,130,['Bezpieczne','szczepionki inaktywowane i podjednostkowe','(DTaP, Hib, pneumokoki, WZW B),','odpowiedź może być słabsza'],{f:C.greenl,s:C.green,bold:[0],hc:C.green,fs:11.5,lh:17});
 s+=box(20,458,900,18,[''],{f:'#fff',s:'#fff'});
 svg('svgPno',940,470,s);
})();

/* ---------- Wiek ---------- */
$('#ageTable').innerHTML=`<tr><th>Wiek</th><th>[12] Skazy krwotoczne</th><th>[13a] Niedokrwistości</th><th>[13b] Odporność</th></tr>
<tr><td>Noworodek</td><td>VKDB, hemofilia (kikut, krwiak, ICH), TAR</td><td>Hb 13,5–20 g/dl (PTP); przyczyny: odklejenie łożyska, krwawienie, zakażenia, hemoliza</td><td>SCID, DiGeorge (hipokalcemia, wada serca), przesiew TREC</td></tr>
<tr><td>Niemowlę</td><td>Hemofilia (szczepienia i.m., raczkowanie), HUS, sepsa</td><td>Fizjologiczna niedokrwistość, IDA, B12 (karmienie piersią), sferocytoza, Blackfan-Diamond</td><td>Do 6. mies. matczyne IgG; później XLA, przejściowa hipogammaglobulinemia, WAS, CGD</td></tr>
<tr><td>Młodsze dziecko (1–6 lat)</td><td>ITP, IgAV, HUS (&lt;5 r.ż.), hemartrozy</td><td>IDA (dieta), celiakia, przejściowa erytroblastopenia</td><td>Ataksja-teleangiektazja, selektywny IgA, nawracające zakażenia</td></tr>
<tr><td>Wiek szkolny</td><td>IgAV, ITP, vWD, białaczka</td><td>Fanconi i aplazja (szpik), talasemia, sferocytoza</td><td>IgA, defekty dopełniacza, CVID (późno)</td></tr>
<tr><td>Nastolatek</td><td>vWD (menorrhagia), przewlekła ITP, białaczka</td><td>IDA (miesiączki), B12 typu dorosłego (autoimmunizacja), celiakia</td><td>CVID, autoimmunizacja</td></tr>`;

/* ---------- Międzymodułowe ---------- */
$('#xchips').innerHTML=[['HUS','[1] [3] [12] [15]'],['IgAV','[1] [4] [12]'],['WAS','[12] [13b] [11]'],['Sepsa meningokokowa','[2] [5] [12]'],['H. pylori','[6] [12] [13a]'],['Celiakia + IgA','[3] [13a] [13b]'],['HLH','[11] [12]'],['Fanconi, aplazja','[11] [13a]'],['DiGeorge','[5] [13b]']].map(x=>`<span class="xc"><b>${x[0]}</b> ${x[1].split(' ').map(m=>`<span class="mod">${m}</span>`).join('')}</span>`).join('');

/* ---------- Powtarzalność ---------- */
(function(){
 const d=[['[12] Skazy krwotoczne',22,C.red],['[13a] Niedokrwistości',15,C.blue],['[13b] Zaburzenia odporności',19,C.violet]];
 $('#bars').innerHTML=d.map(x=>`<div class="bar"><span>${x[0]}</span><i style="width:${x[1]/22*100}%;background:${x[2]}"></i><b>${x[1]}</b></div>`).join('')+'<p class="small" style="margin-top:.4rem">Liczba zadań z modułu w 7 zestawach (orientacyjna analiza własna).</p>';
})();

/* ---------- Quiz ---------- */
(function(){
 const L=['a','b','c','d','e'],CB={src:'POTWIERDZONY',inf:'WNIOSKOWANY',unk:'BRAK KLUCZA',did:'DYDAKTYCZNE'};
 let mode='study',flt='all',query='',state={},ans=0,good=0;
 const modCls=m=>m.includes('[12]')?'m12':m.includes('13a')?'m13a':'m13b';
 function keyCls(q){return (q.neg?'key-r':(q.conf==='src'?'key-g':'key-a'))+((q.neg&&q.conf!=='src')?' key-a':'')}
 function keyTxt(q){return q.neg?'szukana odpowiedź (fałsz / wyjątek)':q.conf==='src'?'klucz potwierdzony':'klucz niepotwierdzony'}
 function match(q){
  if(flt==='m12'&&!q.m.includes('[12]'))return false;
  if(flt==='m13a'&&!q.m.includes('13a'))return false;
  if(flt==='m13b'&&!q.m.includes('13b'))return false;
  if(flt==='unc'&&q.conf==='src')return false;
  if(flt==='neg'&&!q.neg)return false;
  if(flt==='gap'&&!q.gap)return false;
  if(flt==='x'&&!q.x)return false;
  if(query){const h=(q.q+q.o.join(' ')+q.d+q.m+(q.s||'')).toLowerCase();if(!h.includes(query))return false}
  return true;
 }
 function discHtml(q){
  return `<div class="callout ${q.conf==='src'?'green':'amber'}"><b class="k">Odpowiedź: ${L[q.k]}. ${q.neg?'(pytanie „wskaż fałsz”)':''}</b>${q.d}</div>
  ${q.zal?`<div class="cmp"><div class="a"><b class="k">Pod zaliczenie (wg puli/zakładu)</b>${q.zal}</div><div class="b"><b class="k">Aktualnie klinicznie (wg wytycznych)</b>${q.akt}</div></div>`:''}
  ${q.p?`<div class="pit"><b>Pułapka</b>${q.p}</div>`:''}`;
 }
 function render(){
  const list=Q.filter(match);
  $('#quiz').innerHTML=list.length?list.map(q=>{
   const st=state[q.n],study=mode==='study',revealed=study||st!==undefined;
   return `<article class="q" id="q${q.n}"><header><span class="n">Zad. ${q.n}</span>${q.m.match(/\[[^\]]+\]/g).map(m=>`<span class="mod ${modCls(m)}">${m}</span>`).join('')}<span class="kb ${q.conf}">${CB[q.conf]}</span>${q.neg?'<span class="kb neg">WSKAŻ FAŁSZ</span>':''}${q.rec?'<span class="kb rec">opcje częściowo odtworzone</span>':''}<span class="src">${q.s}</span></header>
   <p class="stem">${q.q}</p>
   <div class="opts">${q.o.map((o,i)=>{
     let c='opt';
     if(revealed){if(i===q.k)c+=' '+keyCls(q);else if(st===i)c+=' wrong'}
     if(st===i)c+=' pick';
     return `<button class="${c}" data-q="${q.n}" data-i="${i}" ${study||st!==undefined?'disabled':''}><span class="l">${L[i]}.</span><span>${o}</span>${revealed&&i===q.k?`<span class="tick">${keyTxt(q)}</span>`:''}</button>`}).join('')}</div>
   ${(!study&&st===undefined)?`<div class="acts"><button data-show="${q.n}">Pokaż odpowiedź</button></div>`:''}
   ${(!study&&st!==undefined&&st>=0)?`<p class="res ${st===q.k?'ok':'no'}">${st===q.k?'✓ Zgodnie z kluczem':'✗ Klucz: '+L[q.k]}${q.conf!=='src'?' (klucz niepotwierdzony w plikach)':''}</p>`:''}
   ${revealed?`<div class="disc">${discHtml(q)}</div>`:''}</article>`}).join(''):'<p class="small">Brak zadań dla wybranych filtrów.</p>';
  $('#score').textContent=mode==='study'?'Tryb nauki: klucze widoczne':`Tryb ćwiczeń: ${good} / ${ans}`;
 }
 $('#quiz').addEventListener('click',e=>{
  const b=e.target.closest('.opt');
  if(b&&mode==='practice'){const n=+b.dataset.q,i=+b.dataset.i;if(state[n]!==undefined)return;state[n]=i;ans++;if(Q[n-1].k===i)good++;render();$('#q'+n)&&$('#q'+n).scrollIntoView({block:'nearest'});return}
  const s=e.target.closest('[data-show]');
  if(s){const n=+s.dataset.show;state[n]=-1;render()}
 });
 const setMode=m=>{mode=m;$('#mStudy').setAttribute('aria-pressed',m==='study');$('#mPractice').setAttribute('aria-pressed',m==='practice');if(m==='practice'){state={};ans=0;good=0}render()};
 $('#mStudy').onclick=()=>setMode('study');$('#mPractice').onclick=()=>setMode('practice');
 $$('#qFilters button').forEach(b=>b.onclick=()=>{$$('#qFilters button').forEach(x=>x.setAttribute('aria-pressed',x===b));flt=b.dataset.f;render()});
 $('#qs').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render()});
 render();
})();

/* ---------- Klucz vs wytyczne ---------- */
(function(){
 const G=[
 ['ITP: leczenie I rzutu','IVIG najszybciej podnosi PLT; GKS tradycyjnie leczeniem I rzutu (gr. D omówienie, S2 2024)',`ASH 2019: obserwacja przy braku lub niewielkim krwawieniu; krótki kurs GKS przy krwawieniu śluzówkowym ${A('https://pmc.ncbi.nlm.nih.gov/articles/PMC6963252/','ASH 2019')}`],
 ['Hemofilia: krwiomocz','W puli opcja z kwasem ε-aminokapronowym; klucza w pliku brak',`WFH 2020: antyfibrynolityki przeciwwskazane w krwiomoczu; nawodnienie, leżenie, czynnik ${A('https://haemophilia.org.uk/wp-content/uploads/2020/12/WFH-Guidelines-for-the-Management-of-Hemophilia-3rd-edition.pdf','WFH 2020')}`],
 ['Hemofilia A z inhibitorem','S7 25/26 #31 bez klucza',`WFH 2020: emicizumab w regularnej profilaktyce; nie leczy ostrych krwawień, nie w hemofilii B ${A('https://www1.wfh.org/publications/files/pdf-1863.pdf','WFH, 3. wyd.')}`],
 ['vWD: desmopresyna','Pula: DDAVP lub koncentrat vWF przy menorrhagii (bez klucza)',`Typ 2B: desmopresyna niezalecana (pogłębia małopłytkowość) ${A('https://idn.org.pl/hemofilia/Poradnik-v-Willebrand.pdf','Poradnik vWD')}; TXA u dzieci 10–15 mg/kg co 6–8 h ${A('https://journals.viamedica.pl/journal_of_transfusion_medicine_and_hemostasis/article/view/90462','zalecenia PL')}`],
 ['Witamina K u noworodka','Brak odrębnego zapisu w plikach',`1 mg i.m. w ciągu 6 h u donoszonych >1500 g, 0,5 mg przy ≤1500 g; doustnie przy przeciwwskazaniu do i.m. ${A('https://www.mp.pl/pytania/pediatria/chapter/B25.QA.1.2.26.','mp.pl')} ${A('https://www.ump.edu.pl/media/uid/267466f22aecf9d59d18/f90554.pdf','UMP')}`],
 ['HUS: przyczyna ONN u niemowląt','Pula: HUS najczęstszą przyczyną ONN u niemowląt','Omówienie zakładu: u dzieci wg CET odwodnienie; HUS najczęstszy w grupie ostrych kłębuszkowo-śródmiąższowych (wiek do 5 lat)'],
 ['Niedobór kwasu foliowego','Megaloblastyczna „nadbarwliwa”','Makrocytarna, MCHC zwykle prawidłowe'],
 ['Dawka żelaza','S4 2026/27: 4–6 mg/kg/d w 3 dawkach, 6–8 tyg.',`PTP 2023: 3–6 mg/kg/d w 1–3 dawkach; leczenie ok. 3 mies. po normalizacji Hb; 3 mg/kg równie skuteczne ${A('https://przegladpediatryczny-artykuly.pl/wp-content/uploads/2026/04/2023-3/PP_3-2023_10.26625_10029_Zalecenia_Niedobor_zelaza.pdf','PTP 2023')}`],
 ['Progi niedokrwistości','Normy z puli i wykładów zależne od wieku',`WHO 2024: Hb <105 g/l (6–23 mies.), <110 g/l (24–59 mies.), <115 g/l (5–11 lat); do praktyki tabela PTP ${A('https://www.who.int/publications/i/item/9789240088542','WHO 2024')}`],
 ['Kostmann: leczenie','Gr. C #53: „czynnik wzrostu” (omówienie: GM-CSF) vs przeszczep','Standard: G-CSF; przeszczep przy braku odpowiedzi lub transformacji; dawek nie podaję (brak w plikach)'],
 ['JMF: zapalenia ucha','Bank LEK: „2 lub więcej zapaleń ucha w roku” nie należy do objawów',`JMF: ≥4 nowe zapalenia ucha środkowego w roku ${A('https://pmc.ncbi.nlm.nih.gov/articles/PMC12734955/table/life-15-01838-t002/','JMF')}`],
 ['BCG a przesiew SCID','Pytania o SCID nie dotyczą BCG',`Od 15.09.2025 pilotaż przesiewu SCID ${A('https://www.gov.pl/web/psse-lubin/rzadowy-program-badan-przesiewowych-noworodkow-na-lata-2019-2026','gov.pl')}; BCG pozostaje w kalendarzu 2026 ${A('https://www.mp.pl/szczepienia/aktualnosci/398025,ministerstwo-zdrowia-ws-szczepienia-bcg-i-badania-przesiewowego-w-kierunku-scid','mp.pl')}`],
 ['Splenektomia w sferocytozie','Różne wersje: kryzy aplastyczne, WAS, Kostmann, powiększenie śledziony jako „nie wskazanie”','Klucz zależy od wersji pytania; zgłoś w zakładzie']
 ];
 $('#gapTable').innerHTML=`<tr><th>Temat</th><th>Pod zaliczenie (wg puli/zakładu)</th><th>Aktualnie klinicznie (wg wytycznych)</th></tr>`+G.map(r=>`<tr><td><b>${r[0]}</b></td><td style="background:var(--amber-l)">${r[1]}</td><td style="background:var(--blue-l)">${r[2]}</td></tr>`).join('');
})();

/* ---------- Źródła ---------- */
$('#srcList').innerHTML=[
 ['ASH 2019: wytyczne leczenia ITP','https://pmc.ncbi.nlm.nih.gov/articles/PMC6963252/'],
 ['IWG 2009: terminologia i definicje ITP','https://pmc.ncbi.nlm.nih.gov/articles/PMC3175326/'],
 ['WFH 2020: wytyczne leczenia hemofilii (3. wyd.), kopia 1','https://haemophilia.org.uk/wp-content/uploads/2020/12/WFH-Guidelines-for-the-Management-of-Hemophilia-3rd-edition.pdf'],
 ['WFH 2020, kopia 2','https://www1.wfh.org/publications/files/pdf-1863.pdf'],
 ['Zalecenia polskie: kwas traneksamowy w leczeniu skaz','https://journals.viamedica.pl/journal_of_transfusion_medicine_and_hemostasis/article/view/90462'],
 ['Poradnik vWD (IDN)','https://idn.org.pl/hemofilia/Poradnik-v-Willebrand.pdf'],
 ['Profilaktyka witaminą K u noworodka (mp.pl)','https://www.mp.pl/pytania/pediatria/chapter/B25.QA.1.2.26.'],
 ['Profilaktyka witaminą K (UM Poznań)','https://www.ump.edu.pl/media/uid/267466f22aecf9d59d18/f90554.pdf'],
 ['PTP 2023: zalecenia dotyczące niedoboru żelaza','https://przegladpediatryczny-artykuly.pl/wp-content/uploads/2026/04/2023-3/PP_3-2023_10.26625_10029_Zalecenia_Niedobor_zelaza.pdf'],
 ['WHO 2024: progi hemoglobiny','https://www.who.int/publications/i/item/9789240088542'],
 ['JMF: 10 objawów ostrzegawczych (tabela)','https://pmc.ncbi.nlm.nih.gov/articles/PMC12734955/table/life-15-01838-t002/'],
 ['Program badań przesiewowych noworodków 2019–2026 (PSSE Lublin)','https://www.gov.pl/web/psse-lubin/rzadowy-program-badan-przesiewowych-noworodkow-na-lata-2019-2026'],
 ['Program badań przesiewowych noworodków (Ministerstwo Zdrowia)','https://www.gov.pl/web/zdrowie/program-badan-przesiewowych-noworodkow-w-polsce-na-lata-2019-2026'],
 ['MZ i GIS o szczepieniu BCG po pilotażu SCID','https://www.mp.pl/szczepienia/aktualnosci/398025,ministerstwo-zdrowia-ws-szczepienia-bcg-i-badania-przesiewowego-w-kierunku-scid'],
 ['BCG w kalendarzu 2026 (mp.pl)','https://www.mp.pl/szczepienia/specjalne/397654,wiele-halasu-o-nic'],
 ['Omówienie ITP (Florida Pediatrician)','https://floridapediatrician.org/publications/disorders-of-primary-hemostasis-updates-on-management-2/']
].map(x=>`<li>${x[0]}: <a href="${x[1]}" target="_blank" rel="noopener noreferrer">${x[1]}</a></li>`).join('');

/* ---------- nawigacja: aktywny link ---------- */
const links=$$('.nav a'),secs=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);
addEventListener('scroll',()=>{let cur=null;secs.forEach(s=>{if(s.getBoundingClientRect().top<120)cur=s.id});links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+cur))},{passive:true});
})();
