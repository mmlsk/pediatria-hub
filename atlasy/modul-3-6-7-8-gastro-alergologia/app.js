(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';

/* ---------- zakładki ---------- */
$$('.tabs').forEach(tabs=>{
  const sec=tabs.closest('section');
  $$('button',tabs).forEach(b=>b.addEventListener('click',()=>{
    $$('button',tabs).forEach(x=>x.setAttribute('aria-selected',x===b));
    $$('.panel',sec).forEach(p=>p.hidden=(p.id!==b.dataset.p));
  }));
});

/* ---------- słupki powtarzalności ---------- */
const TOP=[['Biegunka / odwodnienie',45],['HUS (zespół hemolityczno-mocznicowy)',37],['Celiakia / choroba trzewna',36],['GERD / ulewanie',35],['Alergia pokarmowa / białka mleka',30],['H. pylori / choroba wrzodowa',27],['Choroba Crohna / NZJ',26],['Anafilaksja',15],['Yersinia',14],['Rotawirus',9]];
const bars=$('#bars'); const mx=Math.max(...TOP.map(t=>t[1]));
TOP.forEach(([n,v])=>{bars.insertAdjacentHTML('beforeend',`<div class="bar"><span>${n}</span><i style="width:${v/mx*100}%"></i><b>${v}</b></div>`)});

/* ---------- Marsh ---------- */
(function(){
  const svg=$('#marshSvg'); if(!svg) return;
  const stages=[
   {t:'Marsh 0',h:52,d:14,iel:0,s:'prawidłowy'},
   {t:'Marsh 1',h:52,d:14,iel:1,s:'↑ IEL (>25/100)'},
   {t:'Marsh 2',h:52,d:30,iel:1,s:'+ przerost krypt'},
   {t:'Marsh 3a',h:30,d:30,iel:1,s:'częściowy zanik'},
   {t:'Marsh 3b',h:12,d:32,iel:1,s:'subtotalny zanik'},
   {t:'Marsh 3c',h:0,d:34,iel:1,s:'całkowity zanik'}];
  let out='<rect x="0" y="0" width="560" height="220" rx="12" fill="#FBF6EE"/>';
  stages.forEach((st,i)=>{
    const x0=10+i*92, base=120;
    out+=`<rect x="${x0}" y="${base}" width="84" height="${st.d+4}" fill="#E7BFA9" opacity=".55"/>`;
    for(let k=0;k<5;k++){
      const x=x0+4+k*16;
      if(st.h>0) out+=`<rect x="${x}" y="${base-st.h}" width="10" height="${st.h}" rx="5" fill="#F0B79C" stroke="#B5533C" stroke-width="1"/>`;
      out+=`<rect x="${x+11}" y="${base}" width="4" height="${st.d}" rx="2" fill="#C9705A"/>`;
      if(st.iel){ const ys=st.h>0?[base-st.h+6,base-st.h/2]:[base-3]; ys.forEach(y=>{out+=`<circle cx="${x+5}" cy="${y}" r="2.6" fill="#6E4CB0"/>`}); }
    }
    out+=`<text x="${x0+42}" y="186" text-anchor="middle" font-family="Satoshi,sans-serif" font-weight="800" font-size="12" fill="#13232C">${st.t}</text>`;
    out+=`<text x="${x0+42}" y="202" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="10" fill="#44545D">${st.s}</text>`;
  });
  out+='<text x="12" y="20" font-family="Satoshi,sans-serif" font-size="11" fill="#6B7A82">kosmki (różowe), krypty (ciemne), limfocyty śródnabłonkowe (fiolet)</text>';
  svg.innerHTML=out;
})();

/* ---------- jelito: Crohn vs WZJG ---------- */
(function(){
  const g=$('#colonDrawings'); if(!g) return;
  const col='M70 280 V90 Q70 45 115 45 H165 Q215 45 215 90 V240 Q215 285 175 285 Q135 285 135 255 V330';
  const small='M104 140 Q130 120 150 140 T116 172 T160 200 T112 226 T150 252 T108 262';
  function one(x,title,sub,mode){
    let s=`<g transform="translate(${x},0)" font-family="Satoshi,sans-serif">`;
    s+=`<text x="150" y="22" text-anchor="middle" font-weight="800" font-size="16" fill="#13232C">${title}</text>`;
    s+=`<text x="150" y="40" text-anchor="middle" font-size="11" fill="#44545D">${sub}</text>`;
    s+=`<g transform="translate(18,34)">`;
    s+=`<path d="${small}" fill="none" stroke="#E9A58C" stroke-width="9" stroke-linecap="round"/>`;
    s+=`<path d="${col}" fill="none" stroke="#E4D6C3" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
    if(mode==='cd'){
      s+=`<path d="M30 322 Q48 304 60 292" fill="none" stroke="#C23B2A" stroke-width="10" stroke-linecap="round"/>`;
      s+=`<path d="${col}" pathLength="100" fill="none" stroke="#C23B2A" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 1 7 22 8 32 8 22"/>`;
      s+=`<path d="M135 330 L120 346 M135 330 L150 348" stroke="#C23B2A" stroke-width="3" stroke-linecap="round"/>`;
      s+=`<text x="12" y="338" font-size="10" fill="#C23B2A" font-weight="700">krętnica końcowa</text>`;
      s+=`<text x="150" y="360" font-size="10" fill="#C23B2A" font-weight="700" text-anchor="middle">przetoki okołoodbytnicze</text>`;
    } else {
      s+=`<path d="${col}" pathLength="100" fill="none" stroke="#2B63AE" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 22 78"/>`;
      s+=`<text x="150" y="360" font-size="10" fill="#2B63AE" font-weight="700" text-anchor="middle">ciągłe zapalenie od odbytnicy</text>`;
    }
    s+=`<circle cx="70" cy="285" r="15" fill="none" stroke="#C98B3C" stroke-width="3" opacity=".7"/>`;
    s+=`<g font-size="10" fill="#44545D"><text x="30" y="200" text-anchor="end">wstępnica</text><text x="140" y="30">poprzecznica</text><text x="232" y="170">zstępnica</text><text x="228" y="282">esica</text><text x="148" y="326">odbytnica</text></g>`;
    s+=`</g></g>`;
    return s;
  }
  g.innerHTML=one(0,'Choroba Crohna','zmiany odcinkowe, cała ściana','cd')+one(320,'WZJG','ciągłość, błona śluzowa','uc');
})();

/* ---------- pytania ---------- */
const BAD={src:['KLUCZ POTWIERDZONY','src'],inf:['KLUCZ WNIOSKOWANY','inf'],unk:['KLUCZ NIEPEWNY','unk']};
const MODC={6:'m6',3:'m3',7:'m7',8:'m8'};
let score={ok:0,total:0};
function upd(){ const s=$('#score'); if(s) s.textContent=`Wynik: ${score.ok} / ${score.total}`; }
function head(q,n){
  const b=BAD[q.st];
  return `<header><span class="n">${n}</span><span class="mchip ${MODC[q.m]}">[${q.m}]</span><b>${q.t}</b><span class="kb ${b[1]}">${b[0]}</span>${q.g?'<span class="gapb">KLUCZ VS WYTYCZNE</span>':''}${q.n?`<span class="rep" title="Liczba plików z puli (z 56), w których temat występuje">📚 temat w ${q.n} plikach</span>`:''}<span class="src">${q.src}</span></header>`;
}
function tail(q){
  return `<div class="disc" hidden>${q.d}${q.now?`<div class="nowbox"><b class="k">Aktualnie klinicznie</b>${q.now}</div>`:''}</div>`;
}
function mcq(q,n){
  const L='ABCDE';
  const el=document.createElement('article'); el.className='q';
  el.innerHTML=head(q,n)+`<div class="stem">${q.stem}${q.multi?' <span class="small">(możliwych kilka odpowiedzi)</span>':''}</div><ul class="opts">${q.o.map((o,i)=>`<li><button class="opt" data-i="${i}"><span class="l">${L[i]}</span><span>${o}</span></button></li>`).join('')}</ul>${q.multi?'<button class="check">Sprawdź</button>':''}<div class="sectitle" hidden>Omówienie</div>${tail(q)}`;
  const btns=$$('.opt',el), disc=$('.disc',el), st=$('.sectitle',el);
  function finish(correct){
    btns.forEach((b,i)=>{b.disabled=true; const isK=q.k.includes(i), sel=b.classList.contains('sel')||b.dataset.chosen==='1';
      b.classList.remove('sel');
      if(isK) b.classList.add(sel?'ok':'key'); else if(sel) b.classList.add('bad');});
    disc.hidden=false; st.hidden=false; score.total++; if(correct) score.ok++; upd();
    const c=$('.check',el); if(c) c.hidden=true;
  }
  if(q.multi){
    btns.forEach(b=>b.addEventListener('click',()=>b.classList.toggle('sel')));
    $('.check',el).addEventListener('click',()=>{
      const chosen=btns.map((b,i)=>b.classList.contains('sel')?i:-1).filter(i=>i>=0);
      btns.forEach((b,i)=>{ if(chosen.includes(i)) b.dataset.chosen='1'; });
      finish(chosen.length===q.k.length&&chosen.every(i=>q.k.includes(i)));
    });
  } else {
    btns.forEach((b,i)=>b.addEventListener('click',()=>{ b.dataset.chosen='1'; finish(q.k.includes(i)&&q.k.length===1); }));
  }
  return el;
}
function open_(q,n){
  const el=document.createElement('article'); el.className='q';
  el.innerHTML=head(q,n)+`<div class="stem">${q.stem}</div><button class="reveal">Pokaż odpowiedź i omówienie</button><div class="ans" hidden><b>Odpowiedź wg puli i wykładu:</b> ${q.a}</div><div class="sectitle" hidden>Omówienie</div>${tail(q)}`;
  $('.reveal',el).addEventListener('click',e=>{e.target.hidden=true;$('.ans',el).hidden=false;$('.sectitle',el).hidden=false;$('.disc',el).hidden=false;});
  return el;
}
const QS=window.QS||[], QO=window.QO||[];
$$('.qlist').forEach(box=>{
  const m=+box.dataset.mod; let i=1;
  const a=QS.filter(q=>q.m===m), b=QO.filter(q=>q.m===m);
  if(a.length){ box.insertAdjacentHTML('beforeend','<h4 style="margin:.2rem 0 .8rem">Pytania z opcjami</h4>'); a.forEach(q=>box.appendChild(mcq(q,'Z'+(i++)))); }
  if(b.length){ box.insertAdjacentHTML('beforeend','<h4 style="margin:1rem 0 .8rem">Pytania z puli (opcje niepełne w pliku)</h4>'); b.forEach(q=>box.appendChild(open_(q,'Z'+(i++)))); }
});
$$('[data-cnt]').forEach(el=>{const m=+el.dataset.cnt; el.textContent=`🎯 ${QS.filter(q=>q.m===m).length} pytań z opcjami + ${QO.filter(q=>q.m===m).length} z omówieniem`;});

/* ---------- trening ---------- */
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const out=$('#trainOut');
$('#tr10').addEventListener('click',()=>{out.innerHTML='';shuffle(QS).slice(0,10).forEach((q,i)=>out.appendChild(mcq(q,'T'+(i+1))));out.scrollIntoView({behavior:'smooth',block:'start'});});
$('#trAll').addEventListener('click',()=>{out.innerHTML='';let i=1;QS.filter(q=>q.st!=='src'||q.g).forEach(q=>out.appendChild(mcq(q,'N'+(i++))));QO.filter(q=>q.st!=='src'||q.g).forEach(q=>out.appendChild(open_(q,'N'+(i++))));});
$('#trReset').addEventListener('click',()=>{score={ok:0,total:0};upd();out.innerHTML='';});

/* ---------- nawigacja: aktywny link ---------- */
const links=$$('#navlist a'); const secs=links.map(a=>$(a.getAttribute('href')));
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id));}})},{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s&&io.observe(s));
})();
