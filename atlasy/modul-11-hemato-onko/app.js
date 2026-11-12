(function(){
  var body=document.body;
  var tp=document.getElementById('toggle-practice');
  var ra=document.getElementById('reveal-all');
  var ha=document.getElementById('hide-all');
  function qs(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
  if(tp){tp.addEventListener('click',function(){
    var on=body.classList.toggle('practice');
    tp.setAttribute('aria-pressed',on?'true':'false');
    tp.textContent=on?'Tryb ćwiczeń: włączony':'Tryb ćwiczeń: wyłączony';
    if(!on){qs('.q').forEach(function(q){q.classList.remove('revealed');});}
  });}
  if(ra){ra.addEventListener('click',function(){qs('.q').forEach(function(q){q.classList.add('revealed');});qs('.tog').forEach(function(b){b.textContent='Ukryj odpowiedź';});});}
  if(ha){ha.addEventListener('click',function(){qs('.q').forEach(function(q){q.classList.remove('revealed');});qs('.tog').forEach(function(b){b.textContent='Pokaż odpowiedź i omówienie';});});}
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
        if(e.isIntersecting){links.forEach(function(a){a.classList.remove('act');});var a=map[e.target.id];if(a){a.classList.add('act');a.scrollIntoView({block:'nearest',inline:'center'});}}
      });
    },{rootMargin:'-30% 0px -60% 0px'});
    qs('section[id]').forEach(function(s){io.observe(s);});
  }
})();
