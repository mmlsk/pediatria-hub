(function(){
  var body=document.body;
  var tp=document.getElementById('toggle-practice');
  var ra=document.getElementById('reveal-all');
  var ha=document.getElementById('hide-all');
  var sc=document.getElementById('score');
  var quiz=document.getElementById('quiz');
  var ans=0,good=0;
  function updScore(){if(sc)sc.textContent=body.classList.contains('practice')?('Wynik: '+good+' / '+ans):'';}
  function qs(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
  function clearQ(q){
    q.classList.remove('revealed');
    qs('.picked-bad',q).forEach(function(el){el.classList.remove('picked-bad');});
  }
  if(tp){tp.addEventListener('click',function(){
    var on=body.classList.toggle('practice');
    tp.setAttribute('aria-pressed',on?'true':'false');
    tp.textContent=on?'Tryb ćwiczeń: włączony':'Tryb ćwiczeń: wyłączony';
    if(!on){qs('.q').forEach(clearQ);}
    else{qs('.tog').forEach(function(b){b.textContent='Pokaż odpowiedź i omówienie';});}
    updScore();
  });}
  if(ra){ra.addEventListener('click',function(){qs('.q').forEach(function(q){q.classList.add('revealed');});qs('.tog').forEach(function(b){b.textContent='Ukryj odpowiedź';});});}
  if(ha){ha.addEventListener('click',function(){qs('.q').forEach(clearQ);qs('.tog').forEach(function(b){b.textContent='Pokaż odpowiedź i omówienie';});ans=0;good=0;updScore();});}
  if(quiz){quiz.addEventListener('click',function(e){
    var li=e.target.closest('ol.opts li');
    if(!li||!body.classList.contains('practice'))return;
    var q=li.closest('.q');if(!q||q.classList.contains('revealed'))return;
    var isOk=li.classList.contains('ok')||li.classList.contains('no')||li.classList.contains('half');
    if(!isOk)li.classList.add('picked-bad');
    q.classList.add('revealed');
    var tb=q.querySelector('.tog');if(tb)tb.textContent='Ukryj odpowiedź';
    ans++;if(isOk)good++;updScore();
    if(window.hubSyncRecord&&/^z\d+$/.test(q.id||''))window.hubSyncRecord('onko11-q'+q.id.slice(1),isOk);
  });}
  updScore();
  qs('.tog').forEach(function(b){
    b.addEventListener('click',function(){
      var q=b.closest('.q');var r=q.classList.toggle('revealed');
      b.textContent=r?'Ukryj odpowiedź':'Pokaż odpowiedź i omówienie';
    });
  });
  // active nav
  var links=qs('.nav a[href^="#"]');
  var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){links.forEach(function(a){a.classList.remove('act');});var a=map[e.target.id];if(a){a.classList.add('act');var nw=a.closest('.wrap');if(nw){nw.scrollLeft=Math.max(0,a.offsetLeft-(nw.clientWidth-a.offsetWidth)/2);}}}
      });
    },{rootMargin:'-30% 0px -60% 0px'});
    qs('section[id]').forEach(function(s){io.observe(s);});
  }
})();
