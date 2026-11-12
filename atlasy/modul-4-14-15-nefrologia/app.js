const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function bars(id,rows,unit='%'){
  const el=$('#'+id);if(!el)return;const mx=Math.max(...rows.map(r=>r.w??r.v));
  el.innerHTML=rows.map(r=>`<div class="bar"><span>${r.l}</span><div><i class="${r.c||''}" style="width:${Math.max(3,(r.w??r.v)/mx*100)}%"></i></div><em>${r.t??r.v+unit}</em></div>`).join('');
}

/* ===== paleta ===== */
const C={red:'#C23B2A',redL:'#FBE6E2',blue:'#2B63AE',blueL:'#E3EDF9',green:'#2F8450',greenL:'#E2F2E7',amber:'#B8730F',amberL:'#FBEFD9',violet:'#6B4FB3',violetL:'#ECE6F7',ink:'#13232C',ink2:'#44545D',line:'#C9D3D8'};
const fillOf={red:C.redL,blue:C.blueL,green:C.greenL,amber:C.amberL,violet:C.violetL};
const strokeOf={red:C.red,blue:C.blue,green:C.green,amber:C.amber,violet:C.violet};
const T=(x,y,s,o={})=>`<text x="${x}" y="${y}" font-size="${o.size||12}" font-weight="${o.w||500}" fill="${o.fill||C.ink}" text-anchor="${o.a||'start'}">${s}</text>`;
const box=(x,y,w,h,c,lines,o={})=>{
  const n=lines.length,lh=o.lh||15,y0=y+(h-(n-1)*lh)/2+4;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fillOf[c]||c}" stroke="${strokeOf[c]||C.line}" stroke-width="${o.sw||1.8}"/>`+
   lines.map((l,i)=>T(x+w/2,y0+i*lh,l,{a:'middle',w:i===0?800:500,size:i===0?(o.size||12.5):(o.ssize||11),fill:i===0?(strokeOf[c]||C.ink):C.ink2})).join('');
};
const arrow=(x1,y1,x2,y2,col=C.ink2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="2" fill="none" marker-end="url(#ah)"/>`;
const defsArrow=`<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.ink2}"/></marker></defs>`;

/* ===== wykresy słupkowe ===== */
bars('barsPchn',[
  {l:'CAKUT (wady układu moczowego)',v:40,c:'b',t:'&gt; 40%'},
  {l:'Kłębuszkowe zapalenia nerek',v:30,c:'r',t:'ok. 30%'},
  {l:'Inne (HUS, cystynoza, Alport, torbielowatość…)',v:30,c:'a',t:'reszta'}],'');

/* ===== hub-map ===== */
function hub(id,W,H,centre,nodes,cc){
  const el=$('#'+id);if(!el)return;
  const L=nodes.filter((_,i)=>i%2===0),R=nodes.filter((_,i)=>i%2===1),nw=200,nh=Math.min(78,H/L.length-14);
  let s=defsArrow;
  const place=(arr,x)=>arr.map((n,i)=>{
    const cy=(H/arr.length)*(i+.5),y=cy-nh/2;
    const cx=W/2,cyc=H/2;
    const ex=x===0?x+nw:x;
    s+=`<path d="M${ex} ${cy} L${x===0?cx-48:cx+48} ${cyc+(cy-cyc)*.35}" stroke="${strokeOf[n.c]}" stroke-width="2" stroke-dasharray="5 4" fill="none"/>`;
    s+=box(x,y,nw,nh,n.c,[n.t,...n.s],{lh:14.5,size:12,ssize:11});
  });
  place(L,0);place(R,W-nw);
  s+=`<circle cx="${W/2}" cy="${H/2}" r="48" fill="${cc}" stroke="#fff" stroke-width="3"/>`+centre.map((l,i)=>T(W/2,H/2+4+(i-(centre.length-1)/2)*16,l,{a:'middle',w:800,size:13,fill:'#fff'})).join('');
  el.innerHTML=s;
}
hub('pchnMap',520,420,['PChN'],[
  {t:'Niedokrwistość',s:['EPO / darbepoetyna + żelazo','nie transfundować (HLA)'],c:'red'},
  {t:'Kwasica metaboliczna',s:['wodorowęglan','zahamowanie wzrastania'],c:'amber'},
  {t:'Choroba kostna (MBD)',s:['Ca↓ P↑ PTH↑ kalcytriol↓','wiązacze P, witamina D'],c:'violet'},
  {t:'Nadciśnienie',s:['ACE-I / ARB, ABPM','kontrola objętości'],c:'blue'},
  {t:'Zahamowanie wzrastania',s:['hormon wzrostu','żywienie, korekta MBD i kwasicy'],c:'green'},
  {t:'Zaburzenia wodno-elektrolitowe',s:['poliuria, nocyturia, K, Na','dieta, bilans płynów'],c:'amber'}
],C.green);
hub('zumMap',520,380,['ZUM','ryzyko'],[
  {t:'Odpływ zwrotny (VUR)',s:['staza + ascendujące bakterie','CUM, blizny DMSA'],c:'red'},
  {t:'Wady układu moczowego',s:['PUV, zwężenia, CAKUT','wodonercze'],c:'red'},
  {t:'Dysfunkcja pęcherza (BBD)',s:['pęcherz neurogenny','zalegający mocz, nieregularne mikcje'],c:'blue'},
  {t:'Zaparcie',s:['ucisk na pęcherz','kolonizacja okolicy cewki'],c:'blue'},
  {t:'Stulejka, higiena, płeć',s:['chłopcy niecirkumcyzowani w 1. r.ż.','dziewczynki: krótka cewka'],c:'amber'},
  {t:'Instrumentacja',s:['cewnik, zabiegi urologiczne','wcześniactwo'],c:'amber'},
  {t:'Kamica moczowa',s:['Proteus (ureaza) → struwity','Ca 90%, moczanowa 8%, cystyna 2%'],c:'violet'},
  {t:'Cukrzyca, immunosupresja',s:['glukozuria, obniżona odporność','Candida'],c:'violet'}
],C.blue);

/* ===== glomerulus ===== */
(function(){
  const el=$('#glomSvg');if(!el)return;
  const cx=200,cy=190,rx=140,ry=100;
  const pt=(deg,k=1,dr=0)=>{const a=deg*Math.PI/180;return [cx+(rx*k+dr)*Math.cos(a),cy+(ry*k+dr)*Math.sin(a)]};
  let s=`<rect width="520" height="470" fill="#fff"/>`;
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx-14}" ry="${ry-14}" fill="#F8D9D3"/>`;
  s+=`<ellipse cx="${cx-30}" cy="${cy+4}" rx="26" ry="16" fill="#C23B2A" opacity=".85" transform="rotate(-15 ${cx-30} ${cy+4})"/><ellipse cx="${cx+36}" cy="${cy-10}" rx="22" ry="14" fill="#C23B2A" opacity=".85" transform="rotate(20 ${cx+36} ${cy-10})"/>`;
  s+=T(cx,cy+52,'światło kapilary',{a:'middle',size:12,fill:C.red,w:700});
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx-9}" ry="${ry-9}" fill="none" stroke="#E58A7D" stroke-width="4" stroke-dasharray="16 5"/>`;
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#DCC995" stroke-width="10"/>`;
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx-4}" ry="${ry-4}" fill="none" stroke="${C.amber}" stroke-width="2.6" stroke-dasharray="2 2" opacity=".95"/>`;
  // mezangium
  s+=`<ellipse cx="365" cy="250" rx="42" ry="46" fill="#E3EDF9" stroke="${C.blue}" stroke-width="2"/>`;
  s+=`<ellipse cx="362" cy="250" rx="12" ry="14" fill="#9DBFE8" stroke="${C.blue}"/>`;
  [[345,232],[378,236],[392,262],[350,272],[372,276],[340,252]].forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="5.5" fill="${C.blue}"/>`);
  // stopki podocytów
  for(let d=0;d<360;d+=8){
    if(d>-30&&d<62||d>330)continue;
    const [x1,y1]=pt(d,1,9),[x2,y2]=pt(d,1,22);
    s+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${C.violet}" stroke-width="5" stroke-linecap="round"/>`;
  }
  // ciała podocytów
  s+=`<ellipse cx="${cx-10}" cy="${cy-ry-34}" rx="64" ry="16" fill="${C.violetL}" stroke="${C.violet}" stroke-width="2"/>`;
  s+=`<ellipse cx="${cx-12}" cy="${cy+ry+34}" rx="64" ry="16" fill="${C.violetL}" stroke="${C.violet}" stroke-width="2"/>`;
  s+=T(cx-10,cy-ry-30,'podocyt',{a:'middle',size:11.5,fill:C.violet,w:800});
  s+=T(cx-12,cy+ry+38,'podocyt',{a:'middle',size:11.5,fill:C.violet,w:800});
  // garby PSGN (podnabłonkowe)
  [110,145,205,250].forEach(d=>{const [x,y]=pt(d,1,13);s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${C.red}" stroke="#fff" stroke-width="1.5"/>`});
  // etykiety
  const lab=(y,txt,col,x1,y1,x2=412)=>`<path d="M${x1} ${y1} L${x2-4} ${y}" stroke="${col}" stroke-width="1.4" fill="none"/>`+T(x2,y+4,txt,{size:11.5,fill:col,w:700});
  const [gx,gy]=pt(340,1,0),[ex,ey]=pt(335,1,-9);
  s+=lab(112,'stopki podocytów',C.violet,...pt(300,1,16));
  s+=lab(150,'śródbłonek',C.red,ex,ey);
  s+=lab(190,'GBM',C.amber,gx,gy);
  s+=lab(250,'mezangium',C.blue,407,250);
  // legenda
  const lg=[[C.red,'PSGN: podnabłonkowe „garby” (C3↓, ASO↑)'],[C.blue,'IgA / IgAV: złogi w mezangium (C3 prawidłowe)'],[C.amber,'anty-GBM: liniowo wzdłuż błony podstawnej'],[C.violet,'MCD: zlanie stóp podocytów (bez złogów)']];
  lg.forEach(([c,t],i)=>{const y=380+i*21;s+=`<circle cx="26" cy="${y-4}" r="6" fill="${c}"/>`+T(40,y,t,{size:12.5,fill:C.ink,w:600})});
  s+=T(260,20,'Pętla kapilarna kłębuszka',{a:'middle',size:13,w:800});
  el.innerHTML=s;
})();

/* ===== oś czasu PSGN ===== */
(function(){
  const el=$('#psgnSvg');if(!el)return;
  const X0=190,K=40,x=w=>X0+w*K;
  const rows=[70,115,160,205,250,295];
  let s=defsArrow+`<defs><linearGradient id="c3g" x1="0" x2="1"><stop offset="0" stop-color="${C.red}"/><stop offset=".75" stop-color="#E7B466"/><stop offset="1" stop-color="${C.green}"/></linearGradient></defs>`;
  s+=`<rect x="${x(8)}" y="46" width="${4*K}" height="268" fill="${C.greenL}" opacity=".9"/>`;
  s+=T(x(10),58,'C3 wraca do normy: 8–12 tyg.',{a:'middle',size:11.5,fill:C.green,w:800});
  for(let w=0;w<=14;w+=2){s+=`<line x1="${x(w)}" y1="30" x2="${x(w)}" y2="314" stroke="${C.line}" stroke-dasharray="3 4"/>`+T(x(w),22,w,{a:'middle',size:11,fill:C.ink2,w:700})}
  s+=T(8,22,'tygodnie od zakażenia',{a:'start',size:11,fill:C.ink2});
  const lab=['Zakażenie GAS','Okres utajenia','Zespół nefrytyczny','ASO (miano)','C3 w surowicy','Mikroskopowy krwinkomocz'];
  rows.forEach((y,i)=>s+=T(8,y+4,lab[i],{size:12.5,w:800}));
  // GAS
  s+=`<rect x="${x(0)}" y="${rows[0]-9}" width="${.6*K}" height="18" rx="4" fill="${C.red}"/>`+T(x(.6)+8,rows[0]+4,'angina lub liszajec (impetigo)',{size:11.5,fill:C.red,w:700});
  // utajenie
  s+=`<rect x="${x(1)}" y="${rows[1]-16}" width="${2*K}" height="14" rx="4" fill="${C.amber}"/>`+T(x(3)+6,rows[1]-5,'po anginie 1–3 tyg.',{size:11,fill:C.amber,w:700});
  s+=`<rect x="${x(3)}" y="${rows[1]+2}" width="${3*K}" height="14" rx="4" fill="#C2531F"/>`+T(x(6)+6,rows[1]+13,'po zakażeniu skóry 3–6 tyg.',{size:11,fill:'#C2531F',w:700});
  // nefrytyczny
  s+=`<rect x="${x(2)}" y="${rows[2]-10}" width="${2.4*K}" height="20" rx="5" fill="${C.red}"/>`+T(x(2)+2.4*K+8,rows[2]+4,'obrzęki, nadciśnienie, krwinkomocz, oliguria',{size:11.5,fill:C.red,w:700});
  // ASO
  s+=`<path d="M${x(1)} ${rows[3]+14} C${x(2.5)} ${rows[3]+14} ${x(3)} ${rows[3]-18} ${x(4)} ${rows[3]-18} C${x(5)} ${rows[3]-18} ${x(7)} ${rows[3]+8} ${x(14)} ${rows[3]+12} L${x(14)} ${rows[3]+14} Z" fill="${C.blueL}" stroke="${C.blue}" stroke-width="2"/>`;
  s+=T(x(4)+14,rows[3]-20,'szczyt 3–5 tyg.',{size:11.5,fill:C.blue,w:700});
  // C3
  s+=`<rect x="${x(2)}" y="${rows[4]-9}" width="${10*K}" height="18" rx="5" fill="url(#c3g)"/>`+T(x(2)+8,rows[4]+4,'C3 obniżone (C4 prawidłowe)',{size:11.5,fill:'#fff',w:800});
  // krwinkomocz
  s+=`<rect x="${x(3)}" y="${rows[5]-9}" width="${11*K}" height="18" rx="5" fill="${C.redL}" stroke="${C.red}"/>`+T(x(3)+8,rows[5]+4,'może się utrzymywać miesiące, nawet do roku',{size:11.5,fill:C.red,w:700});
  s+=`<path d="M${x(14)-2} ${rows[5]} l10 0" stroke="${C.red}" stroke-width="2" marker-end="url(#ah)"/>`;
  // linia 12 tyg.
  s+=`<line x1="${x(12)}" y1="46" x2="${x(12)}" y2="314" stroke="${C.green}" stroke-width="2"/>`;
  s+=T(x(12)-6,328,'C3↓ po 12 tyg. = atypowo: MPGN / C3G, biopsja',{a:'end',size:11.5,fill:C.red,w:800});
  el.innerHTML=s;
})();

/* ===== łańcuch zespołu nerczycowego ===== */
(function(){
  const el=$('#znSvg');if(!el)return;
  let s=defsArrow;
  s+=box(110,6,300,44,'violet',['Uszkodzenie bariery filtracyjnej','podocyty, GBM (MCD: zlanie stóp)']);
  s+=arrow(260,50,260,64)+box(110,66,300,44,'red',['Białkomocz &gt; 50 mg/kg/dobę','UPCR wysoki, mocz pieniący']);
  s+=arrow(260,110,260,124)+box(110,126,300,44,'amber',['Hipoalbuminemia &lt; 25 g/l','spadek ciśnienia onkotycznego']);
  s+=arrow(190,170,85,206)+arrow(260,170,260,206)+arrow(330,170,435,206);
  s+=box(0,208,166,112,'blue',['Obrzęki, hipowolemia','powieki, lędźwie, wodobrzusze','RAA↑ → retencja Na','ryzyko przednerkowego AKI'],{lh:19,ssize:11});
  s+=box(177,208,166,112,'amber',['Hipercholesterolemia','&gt; 250 mg%','↑ wątrobowa synteza lipidów','miażdżyca (długoterminowo)'],{lh:19,ssize:11});
  s+=box(354,208,166,112,'red',['Utrata białek','IgG → zakażenia (SBP)','antytrombina III → zakrzepica','wit. D, tyroksyna'],{lh:19,ssize:11});
  el.innerHTML=s;
})();

/* ===== AKI: trzy przedziały ===== */
(function(){
  const el=$('#akiSvg');if(!el)return;
  const kid=(x,y,sc,f,st)=>`<path transform="translate(${x} ${y}) scale(${sc})" d="M0 -34 C-30 -34 -40 -5 -34 22 C-29 44 -8 50 6 38 C-4 26 -2 10 6 2 C16 -8 14 -34 0 -34Z" fill="${f}" stroke="${st}" stroke-width="${2/sc}"/>`;
  let s=defsArrow;
  const P=[[0,'green','Przednerkowe','↓ perfuzja nerek'],[180,'red','Nerkowe','uszkodzenie miąższu'],[360,'blue','Zanerkowe','zastój odpływu moczu']];
  P.forEach(([x,c,t,sub])=>{
    s+=`<rect x="${x}" y="0" width="160" height="300" rx="14" fill="${fillOf[c]}" stroke="${strokeOf[c]}" stroke-width="2"/>`;
    s+=T(x+80,26,t,{a:'middle',size:14,fill:strokeOf[c],w:800})+T(x+80,44,sub,{a:'middle',size:11.5,fill:C.ink2});
  });
  // przednerkowe: naczynie ze zwężeniem
  s+=`<path d="M62 60 L62 100 L74 112 L74 130 L62 142 L62 160 M98 60 L98 100 L86 112 L86 130 L98 142 L98 160" stroke="${C.green}" stroke-width="3" fill="none"/>`;
  s+=`<path d="M80 62 L80 90" stroke="${C.red}" stroke-width="3" marker-end="url(#ah)"/>`;
  s+=kid(80,205,.9,'#F1B8AE',C.red);
  s+=T(80,262,'hipowolemia, wstrząs',{a:'middle',size:11,w:700,fill:C.green})+T(80,277,'ACE-I, NLPZ',{a:'middle',size:11,w:700,fill:C.green})+T(80,292,'FENa &lt; 1%',{a:'middle',size:11,w:700,fill:C.ink2});
  // nerkowe: kłębuszek + kanalik
  s+=kid(260,100,1.5,'#F1B8AE',C.red);
  s+=`<circle cx="262" cy="96" r="14" fill="#fff" stroke="${C.red}" stroke-width="2"/><path d="M254 96 C254 88 266 88 266 96 C266 104 256 104 258 98" stroke="${C.red}" stroke-width="2" fill="none"/>`;
  s+=`<path d="M276 100 C296 104 296 140 276 144 C256 148 252 170 272 174" stroke="${C.red}" stroke-width="3" fill="none"/>`;
  s+=`<path d="M246 160 l12 12 M258 160 l-12 12" stroke="${C.red}" stroke-width="3"/>`;
  s+=T(260,203,'ATN, HUS, KZN, AIN',{a:'middle',size:11.5,w:800,fill:C.red});
  s+=T(260,262,'osmolalność moczu &lt; 350',{a:'middle',size:11,w:700,fill:C.ink2})+T(260,277,'FENa &gt; 1%, wałeczki ziarniste',{a:'middle',size:11,w:700,fill:C.ink2})+T(260,292,'nefrotoksyny, kontrast, TLS',{a:'middle',size:11,w:700,fill:C.ink2});
  // zanerkowe: wodonercze, moczowód, blok, pęcherz
  s+=kid(440,92,1.2,'#F1B8AE',C.red);
  s+=`<circle cx="446" cy="94" r="16" fill="${C.blueL}" stroke="${C.blue}" stroke-width="2"/>`;
  s+=`<path d="M446 110 C446 140 440 150 440 168" stroke="${C.blue}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M425 176 l30 -14 M425 162 l30 14" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`;
  s+=`<ellipse cx="440" cy="206" rx="34" ry="22" fill="${C.blueL}" stroke="${C.blue}" stroke-width="2"/>`;
  s+=T(440,210,'pęcherz',{a:'middle',size:11,w:700,fill:C.blue});
  s+=T(440,262,'PUV, zwężenia, kamica',{a:'middle',size:11,w:700,fill:C.blue})+T(440,277,'pęcherz neurogenny',{a:'middle',size:11,w:700,fill:C.blue})+T(440,292,'USG: wodonercze',{a:'middle',size:11,w:700,fill:C.ink2});
  el.innerHTML=s;
})();

/* ===== stadia PChN ===== */
(function(){
  const el=$('#gfrSvg');if(!el)return;
  const seg=[['G1','≥ 90','prawidłowy lub wysoki','#2F8450'],['G2','60–89','łagodnie obniżony','#5B8F2E'],['G3a','45–59','łagodnie–umiark.','#8A7A12'],['G3b','30–44','umiark.–ciężko','#B8730F'],['G4','15–29','ciężko obniżony','#C2531F'],['G5','&lt; 15','niewydolność nerek','#A52A1E']];
  let s=defsArrow;
  seg.forEach((g,i)=>{const x=6+i*128;
    s+=`<rect x="${x}" y="10" width="122" height="96" rx="12" fill="${g[3]}"/>`;
    s+=T(x+61,44,g[0],{a:'middle',size:24,w:800,fill:'#fff'})+T(x+61,66,g[1],{a:'middle',size:14,w:800,fill:'#fff'})+T(x+61,88,g[2],{a:'middle',size:11,w:500,fill:'#fff'});
  });
  s+=`<path d="M6 128 L248 128" stroke="${C.green}" stroke-width="3"/>`+T(127,148,'obserwacja, leczenie przyczyny',{a:'middle',size:11.5,w:700,fill:C.green});
  s+=`<path d="M262 128 L504 128" stroke="${C.amber}" stroke-width="3"/>`+T(383,148,'powikłania: Hb, Ca, P, PTH, kwasica',{a:'middle',size:11.5,w:700,fill:C.amber});
  s+=`<path d="M518 128 L774 128" stroke="${C.red}" stroke-width="3"/>`+T(646,148,'przygotowanie do RRT i przeszczepu',{a:'middle',size:11.5,w:700,fill:C.red});
  s+=T(390,176,'GFR w ml/min/1,73 m². KDIGO 2024 dodaje albuminurię (A1–A3) i przyczynę.',{a:'middle',size:11,fill:C.ink2});
  el.innerHTML=s;
})();

/* ===== VUR I–V ===== */
(function(){
  const el=$('#vurSvg');if(!el)return;
  const G=[
    {r:'I',d:['tylko moczowód','bez poszerzenia'],f:.38,w:3,pel:0,cal:0,wave:0},
    {r:'II',d:['moczowód + miedniczka','bez poszerzenia'],f:1,w:3.5,pel:16,cal:3,wave:0},
    {r:'III',d:['łagodne–umiark. poszerzenie','stępione sklepienia'],f:1,w:7,pel:26,cal:5,wave:5},
    {r:'IV',d:['umiark. poszerzenie, kręty','brodawki widoczne'],f:1,w:10,pel:34,cal:8,wave:10},
    {r:'V',d:['ciężkie poszerzenie','brak brodawek, kręty'],f:1,w:15,pel:44,cal:11,wave:16}];
  let s='';
  G.forEach((g,i)=>{
    const x=i*160+80,c=C.blue,fill=C.blueL;
    s+=`<rect x="${i*160+2}" y="2" width="156" height="326" rx="12" fill="#fff" stroke="${C.line}"/>`;
    s+=T(x,24,'Stopień '+g.r,{a:'middle',size:14,w:800});
    s+=`<ellipse cx="${x}" cy="82" rx="38" ry="42" fill="#F6DDD8" stroke="${C.red}" stroke-width="1.8"/>`;
    // ureter
    const y1=240,y2=122,yf=y1-(y1-y2)*g.f,a=g.wave;
    const path=a?`M${x} ${y1} C${x+a} ${y1-30} ${x-a} ${y1-60} ${x} ${(y1+y2)/2} C${x+a} ${(y1+y2)/2-30} ${x-a} ${y2+25} ${x} ${y2}`:`M${x} ${y1} L${x} ${yf}`;
    s+=`<path d="${path}" stroke="${c}" stroke-opacity=".85" stroke-width="${g.w}" fill="none" stroke-linecap="round"/>`;
    if(g.pel){
      s+=`<ellipse cx="${x}" cy="88" rx="${g.pel/2}" ry="${g.pel/2.2}" fill="${c}" opacity=".85"/>`;
      for(let k=0;k<5;k++){const ang=(-150+k*50)*Math.PI/180,rr=g.pel/2+6;
        const cxk=x+rr*Math.cos(ang)*1.05,cyk=88+rr*Math.sin(ang)*.9;
        s+=`<circle cx="${cxk.toFixed(1)}" cy="${cyk.toFixed(1)}" r="${(g.cal*.55+1.5).toFixed(1)}" fill="${c}" opacity=".85"/>`}
    }
    s+=`<ellipse cx="${x}" cy="266" rx="42" ry="24" fill="${g.f<1?fill:c}" fill-opacity="${g.f<1?1:.3}" stroke="${c}" stroke-width="2"/>`;
    s+=T(x,270,'pęcherz',{a:'middle',size:11,w:700,fill:c});
    s+=T(x,306,g.d[0],{a:'middle',size:10.5,fill:C.ink2,w:600})+T(x,320,g.d[1],{a:'middle',size:10.5,fill:C.ink2});
  });
  el.innerHTML=s;
})();

/* ===== mapa powiązań międzymodułowych ===== */
(function(){
  const el=$('#crossSvg');if(!el)return;
  let s=defsArrow;
  const mid=[[50,'red','[4] KZN i ZN','pacjent nefrytyczny / nerczycowy'],[330,'green','[15] AKI i PChN','nerka jako całość'],[610,'blue','[14] ZUM','drogi moczowe']];
  const topN=[[20,'red',['[12] IgAV / HSP','plamica + ból brzucha + krwinkomocz','powikłanie: wgłobienie [1]'],150],
              [300,'green',['[3]+[12]+[15] HUS','krwista biegunka + PLT↓ + AKI','nie myl z ZUM ani KZN'],430],
              [580,'blue',['[1]+[2] gorączka i ból brzucha','bez dyzurii: zrób posiew moczu','zaparcie / BBD → nawrót ZUM'],710]];
  const botN=[[15,'violet',['[9] rzekomy guz mózgu','po steroidach w ZN','(ból głowy, tarcze zastoinowe)'],112,150],
              [230,'amber',['[11] zespół lizy guza','K↑ P↑ kwas moczowy↑','→ AKI, RRT'],327,430],
              [445,'amber',['[10] guz Wilmsa','nie uciskać, nie biopsjować','krwiomocz, nadciśnienie'],542,430],
              [660,'violet',['PUV, VUR, wady','noworodek, wodonercze','→ blizny → PChN [15]'],757,710]];
  topN.forEach(([x,c,l,cx])=>{s+=box(x,10,260,84,c,l,{lh:17,ssize:11.5});s+=`<path d="M${cx} 94 L${cx} 188" stroke="${strokeOf[c]}" stroke-width="2.2" stroke-dasharray="5 4" marker-end="url(#ah)"/>`});
  mid.forEach(([x,c,t,sub])=>{s+=`<rect x="${x}" y="190" width="200" height="86" rx="14" fill="${strokeOf[c]}"/>`+T(x+100,228,t,{a:'middle',size:16,w:800,fill:'#fff'})+T(x+100,250,sub,{a:'middle',size:11.5,fill:'#fff'})});
  s+=arrow(252,233,326,233)+T(289,222,'PChN',{a:'middle',size:10.5,w:700})+arrow(608,233,534,233)+T(571,222,'blizny',{a:'middle',size:10.5,w:700});
  botN.forEach(([x,c,l,cx,tx])=>{s+=box(x,350,200,92,c,l,{lh:17,ssize:11.5,size:12});s+=`<path d="M${cx} 350 L${tx} 278" stroke="${strokeOf[c]}" stroke-width="2.2" stroke-dasharray="5 4" marker-end="url(#ah)"/>`});
  // fix: tarczy zastoinowe
  s+=T(430,462,'Linie przerywane: gdzie dane zagadnienie przecina się z modułami nefrologicznymi',{a:'middle',size:11,fill:C.ink2});
  el.innerHTML=s;
})();

/* ===== karty KZN ===== */
const kzn=[
 {n:'Ostre popaciorkowcowe KZN (PSGN)',c:'r',tag:'C3 niskie, ASO↑',li:['Wiek szkolny, 1–3 tyg. po anginie lub 3–6 tyg. po zakażeniu skóry','Obrzęki twarzy, mocz „coca-cola”, oliguria, nadciśnienie','C3↓ (C4 zwykle prawidłowe), ASO / anty-DNaza B↑, erytrocyty dysmorficzne','Leczenie objawowe: sól, płyny, diuretyk pętlowy, leki hipotensyjne','Rokowanie u dzieci dobre; biopsja tylko w atypowym przebiegu']},
 {n:'Nefropatia IgA',c:'b',tag:'C3 prawidłowe',li:['Makroskopowy krwiomocz 1–3 dni po infekcji górnych dróg oddechowych','Brak okresu utajenia, nawroty epizodów','IF: IgA w mezangium; biopsja przy białkomoczu i nadciśnieniu','Leczenie nefroprotekcyjne (ACE-I) przy białkomoczu']},
 {n:'IgAV (HSP) z zajęciem nerek [12]',c:'a',tag:'plamica + brzuch',li:['Plamica na pośladkach i kończynach dolnych, bóle stawów, ból brzucha','Krwinkomocz ± białkomocz; kontrola moczu i ciśnienia przez kilka miesięcy','Powikłania: wgłobienie, krwawienie z przewodu pokarmowego','Biopsja przy dużym białkomoczu lub spadku GFR']},
 {n:'RPGN, anty-GBM, ANCA',c:'r',tag:'nagły spadek GFR',li:['Szybki wzrost kreatyniny w dniach–tygodniach, oliguria','Półksiężyce w kłębuszkach; biopsja pilna','Goodpasture: anty-GBM + krwioplucie','ANCA (GPA, MPA), SLE: odpowiednie przeciwciała','Immunosupresja i plazmafereza w ośrodku referencyjnym']},
 {n:'MPGN / C3G',c:'v',tag:'C3↓ &gt; 12 tyg.',li:['Zespół nefrytyczny, nerczycowy lub mieszany','C3 niskie przetrwale (nie wraca w 8–12 tyg.)','Biopsja: błoniasto-rozplemowy obraz, C3 dominujące w IF','Rokowanie gorsze, ryzyko PChN']},
 {n:'Zespół Alporta',c:'g',tag:'rodzinnie, słuch',li:['Rodzinny krwinkomocz, niedosłuch odbiorczy, zmiany oczne','Najczęściej COL4A5 (sprzężone z X): chłopcy cięższy przebieg','Mikroskopia elektronowa: rozwarstwienie GBM','ACE-I, nefrolog, genetyka']},
 {n:'Toczniowe zapalenie nerek (SLE)',c:'v',tag:'C3 i C4↓',li:['Młodzież, częściej dziewczęta; ANA, anty-dsDNA','C3 i C4↓, białkomocz, krwinkomocz, nadciśnienie','Biopsja klasyfikuje zajęcie nerek i decyduje o leczeniu','Immunosupresja według klasy']}];
$('#kznCards').innerHTML=kzn.map(k=>`<div class="card"><h4>${k.n} <span class="pill ${k.c}">${k.tag}</span></h4><ul class="tight small">${k.li.map(l=>`<li>${l}</li>`).join('')}</ul></div>`).join('');

$('#husCards').innerHTML=[
 {n:'Typowy HUS (D+)',c:'r',tag:'STEC',li:['Biegunka krwista, 5–10 dni później triada: niedokrwistość hemolityczna (schistocyty), małopłytkowość, AKI','Toksyna Shiga (E. coli O157:H7 i inne STEC)','Najczęstsza przyczyna AKI u dzieci 1 mż.–3 r.ż. (wykład 12)','Leczenie wspomagające, kontrola płynów i ciśnienia, dializa; nie podawać leków hamujących perystaltykę']},
 {n:'Atypowy HUS (aHUS)',c:'v',tag:'dopełniacz',li:['Bez poprzedzającej biegunki, często nawroty i obecność w rodzinie','Dysregulacja szlaku alternatywnego dopełniacza (czynnik H, I, MCP; przeciwciała anty-CFH)','Plazmafereza; inhibitor C5 (ekulizumab) w ośrodku referencyjnym','Nadciśnienie ciężkie, szybka progresja do PChN']},
 {n:'Pneumokokowy HUS',c:'b',tag:'bez FFP',li:['Zapalenie płuc z ropniakiem lub zapalenie opon wywołane S. pneumoniae','Neuraminidaza odsłania antygen T; Coombs często dodatni','FFP i krew pełna przeciwwskazane: stosuj płukane krwinki']}
].map(k=>`<div class="card"><h4>${k.n} <span class="pill ${k.c}">${k.tag}</span></h4><ul class="tight small">${k.li.map(l=>`<li>${l}</li>`).join('')}</ul></div>`).join('');

/* ===== tabela klucz vs wytyczne ===== */
const gl=(u,t)=>`<a href="${u}">${t}</a>`;
const L={aap11:gl('https://publications.aap.org/pediatrics/article/138/6/e20163026/52686/Reaffirmation-of-AAP-Clinical-Practice-Guideline?autologincheck=redirected','AAP 2011/2016'),aap26:gl('https://publications.aap.org/aapnews/news/35967/New-AAP-guideline-reframes-diagnosis-management-of','AAP 2026'),eau:gl('https://uroweb.org/guidelines/paediatric-urology/chapter/urinary-tract-infections-in-children','EAU/ESPU'),nice:gl('https://www.nice.org.uk/guidance/ng224','NICE NG224'),kaki:gl('https://kdigo.org/wp-content/uploads/2016/10/KDIGO-2012-AKI-Guideline-English.pdf','KDIGO 2012'),kckd:gl('https://kdigo.org/wp-content/uploads/2025/03/KDIGO-2024-CKD-Guideline-Key-Takeaways-for-Pediatricians.pdf','KDIGO 2024'),ipna:gl('https://pmc.ncbi.nlm.nih.gov/articles/PMC9589698/pdf/467_2022_Article_5739.pdf','IPNA 2022'),srns:gl('https://ncbi.nlm.nih.gov/pmc/articles/PMC7316686/','IPNA SRNS'),ndt:gl('https://academic.oup.com/ndt/article/40/10/1843/8197890','NDT 2025')};
const gap=[
 ['[14] Pobranie moczu','Cewnik lub nakłucie nadłonowe jako metoda pewna; wykład podaje próg 10⁵/ml dla woreczka, ale pula uznaje woreczek za niezalecany.',`${L.aap11}: cewnik lub nakłucie nadłonowe, woreczek zawodny. ${L.aap26}: próg w cewniku obniżony z 50 000 do 10 000 CFU/ml, progi leukocyturii zależne od wieku i metody.`],
 ['[14] Czas leczenia OOZN','Wykład: antybiotyk 10–14 dni, posiew kontrolny po 14 dniach.',`${L.eau}: gorączkowe ZUM 4–7 dni (zalecenie silne), zapalenie pęcherza 3–5 dni. ${L.aap11}: 7–14 dni. ${L.nice}: projekt aktualizacji – górne ZUM 10 dni łącznie (2–4 dni dożylnie, potem doustnie).`],
 ['[14] Obrazowanie po pierwszym gorączkowym ZUM','Pula zawiera różne warianty (USG, CUM, DMSA) zależnie od rocznika i grupy.',`${L.aap11}, ${L.eau}: USG nerek i pęcherza; CUM selektywnie (nieprawidłowe USG, nawrót, przebieg atypowy). ${L.nice}: rutynowo nie obrazować w celu lokalizacji ZUM ani wykrywania VUR. ${L.aap26}: USG słabo wykrywa VUR.`],
 ['[14] Chemioprofilaktyka','Wykład: do zakończenia diagnostyki w kierunku wady.',`${L.aap26}: profilaktyka oparta na ryzyku, nie rutynowa. ${L.nice}: profilaktyka 3-dniowa wokół CUM.`],
 ['[14] Zapalenie pęcherza u 16-latki','Warianty puli są sprzeczne (oznaczone jako klucz niepewny).',`${L.eau}: zapalenie pęcherza 3–5 dni. ${L.nice}: dolne ZUM 3 dni doustnie u dzieci ≥ 3 miesiące (projekt).`],
 ['[15] Definicja AKI','Wykład: pRIFLE (Risk, Injury, Failure, Loss, ESKD) z kryteriami diurezy 8 / 16 / 24 h.',`${L.kaki}: wzrost kreatyniny ≥ 0,3 mg/dl w 48 h lub ≥ 1,5× w 7 dni lub diureza &lt; 0,5 ml/kg/h przez 6 h; stopień 3 także przy eGFR &lt; 35 u &lt; 18 lat.`],
 ['[15] Klasyfikacja PChN','Wykład: stadia G1–G5 wg GFR.',`${L.kckd}: klasyfikacja CGA (przyczyna, G, albuminuria A1–A3); u dzieci zalecane UPCR i UACR; rozpoznanie po ≥ 3 miesiącach.`],
 ['[4] Prednizon w pierwszym epizodzie ZN','Wykład: 60 mg/m²/dobę × 6 tyg., następnie 40 mg/m² co drugi dzień × 6 tyg.',`${L.ipna}: 60 mg/m² (maks. 60 mg) × 4 lub 6 tyg., następnie 40 mg/m² co drugi dzień × 4 lub 6 tyg.; łącznie 8 lub 12 tyg.`],
 ['[4] Steroidooporność','Pula: rozpoznanie po 8 tygodniach steroidoterapii.',`${L.srns}: ocena po 4 tygodniach, następnie „okres potwierdzenia” do 6. tygodnia; biopsja i badania genetyczne.`],
 ['[4] Druga linia w SRNS','Klucz A17: cyklofosfamid; nowsza pula: inhibitory kalcyneuryny.',`${L.srns}: inhibitor kalcyneuryny (cyklosporyna lub takrolimus) pierwszej linii, ACE-I/ARB.`],
 ['[4] PSGN: C3 i biopsja','Źródła wskazują 6–8 tygodni do normalizacji C3.',`${L.ndt}: normalizacja w 8–12 tygodni; utrzymywanie &gt; 12 tyg. jest nietypowe; biopsja przy szybkim pogorszeniu, RRT, ZN lub trwałym białkomoczu.`],
 ['[14] Zastawki cewki tylnej','Klucz puli: cystoskopia.','W praktyce rozpoznanie stawia CUM (poszerzona cewka tylna, pogrubiały pęcherz); cystoskopia potwierdza i służy ablacji.'],
 ['Brak klucza w plikach','S7 #46 (USG po pierwszym ZUM „w wieku poniżej…”); 5. rok-4 #36 (12-miesięczne dziecko: 10–14 dni i.v. czy 3 dni i.v.); S3 2025/26 #5 (wskazania do dializy).','Odpowiedź wnioskowana z wykładu 20 (wskazania do RRT) lub wytycznych; zapytaj zakład o oficjalny klucz.']
];
$('#gapTable').innerHTML=`<thead><tr><th>Temat</th><th>Pod zaliczenie (wg puli/zakładu)</th><th>Aktualnie klinicznie (wg wytycznych)</th></tr></thead><tbody>${gap.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody>`;

/* ===== perełki i pułapki ===== */
const pearls=[
 ['green','Perełka · [14]','Prawidłowe badanie ogólne moczu nie wyklucza ZUM. O rozpoznaniu decyduje posiew z cewnika lub nakłucia.'],
 ['blue','Perełka · [4]','C3 niskie w KZN: PSGN (wraca w 8–12 tyg.), MPGN / C3G (nie wraca), SLE (także C4↓), nefritis shuntowy.'],
 ['green','Perełka · [15]','FENa &lt; 1% sugeruje przednerkowe AKI, u noworodka próg wynosi 2%. Diuretyk dopiero po nawodnieniu.'],
 ['amber','Perełka · [14]','Proteus alkalizuje mocz (ureaza): kamica struwitowa. S. saprophyticus: zapalenie pęcherza u nastolatek.'],
 ['red','Red flag · [4]','ZN z asymetrycznym obrzękiem kończyny, nagłą dusznością lub bólem brzucha z gorączką: zakrzepica albo SBP.'],
 ['violet','Perełka · [14]','Noworodek chłopiec z wodonerczem i słabym strumieniem moczu: PUV. Diagnoza w CUM.']];
$('#pearls').innerHTML=pearls.map(p=>`<div class="callout ${p[0]}"><b class="k">${p[1]}</b>${p[2]}</div>`).join('');
const traps=[
 ['red','[3]+[12]+[15] HUS','Krwista biegunka, małopłytkowość, niedokrwistość hemolityczna i AKI. Bakterie w moczu u dziecka z anemią i małopłytkowością to dystraktor.'],
 ['amber','[1]+[12]+[4] IgAV','Ból brzucha + plamica + krwinkomocz. Wgłobienie jest powikłaniem; kontroluj mocz i ciśnienie.'],
 ['blue','[1]+[2]+[14] gorączka i ból brzucha','Bez dyzurii: posiew moczu. Zaparcie i dysfunkcja pęcherza zwiększają ryzyko ZUM.'],
 ['red','[11]+[15] zespół lizy guza','Hiperurykemia, hiperfosfatemia, hiperkaliemia i hipokalcemia prowadzą do AKI. Nawodnienie, ostrożnie z kwasem moczowym.'],
 ['amber','[10] guz Wilmsa','Nie uciskać guza brzucha, nie biopsjować. Objawy: guz, krwiomocz, nadciśnienie.'],
 ['violet','[9]+[4] rzekomy guz mózgu','Po glikokortykosteroidach w ZN: ból głowy, wymioty, tarcze zastoinowe.']];
$('#traps').innerHTML=traps.map(p=>`<div class="callout ${p[0]}"><b class="k">${p[1]}</b>${p[2]}</div>`).join('');

/* ===== quiz ===== */
Q.forEach((q,i)=>q.n=i+1);
let filter='all',list=Q.slice(),st={};
const CONF={src:['src','KLUCZ POTWIERDZONY'],inf:['inf','KLUCZ WNIOSKOWANY'],unk:['unk','KLUCZ NIEPEWNY']};
const GROUP={m4:['kzn','zn'],m15:['aki','pchn'],m14:['zum','img'],x:['x']};
function match(q,f){return f==='all'||(GROUP[f]&&GROUP[f].includes(q.t))||(f==='gap'&&q.gap)||(f==='unk'&&q.c==='unk')}
function bar(){const a=Object.values(st);$('#score').textContent=`Wynik: ${a.filter(x=>x.ok).length} / ${a.length}`}
function renderQ(){
  $('#quiz').innerHTML=list.map(q=>{
   const Lt='ABCDEF';const done=st[q.n];const c=CONF[q.c];
   return `<article class="q" id="q${q.n}"><header><span class="n">Zad. ${q.n}</span><span class="mod">[${q.m}]</span><span class="tbadge">${TOPICS[q.t]}</span><span class="kb ${c[0]}">${c[1]}</span>${q.own?'<span class="tbadge">zadanie autorskie</span>':''}${q.adapt?'<span class="tbadge" title="Treść pytania lub opcji uzupełniona/uproszczona">✎ opcje uzupełnione</span>':''}<span class="src">${q.s}</span></header>
   <div class="stem">${q.stem}</div>
   <div class="opts" role="group">${q.o.map((o,i)=>{
     let cl='opt';if(done){if(i===q.k)cl+=' key ok';else if(i===done.sel)cl+=' bad'}
     return `<button class="${cl}" data-q="${q.n}" data-i="${i}" ${done?'disabled':''}><span class="l">${Lt[i]}</span><span>${o}</span></button>`}).join('')}</div>
   <div class="disc" ${done?'':'hidden'}>
     <div class="callout ${done&&done.ok?'green':'red'}"><b class="k">${done&&done.ok?'Poprawnie':'Błędnie'} · prawidłowa odpowiedź: ${Lt[q.k]}</b>${q.why}</div>
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
bars('barsPool',Object.keys(TOPICS).map((k,i)=>({l:TOPICS[k],v:Q.filter(q=>q.t===k).length,c:['r','a','g','v','b','b','']  [i]})),'');

/* nav highlight */
const links=$$('#navlist a'),secs=links.map(a=>$(a.getAttribute('href')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s&&io.observe(s));
