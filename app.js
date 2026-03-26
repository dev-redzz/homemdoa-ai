/* Homem do Açaí – app.js */

const CREMES = [
  {n:'Calda de Ninho',e:'🥛'},{n:'Cupuaçu',e:'🌿'},{n:'Maracujá',e:'🟡'},
  {n:'Morango',e:'🍓'},{n:'Tapioca',e:'⚪'},{n:'Ovomaltine',e:'🍫'},
  {n:'Paçoquita',e:'🥜'},{n:'Energético',e:'⚡'},
];

const MIX = [
  {n:"MM's",e:'🍬'},{n:'Flocos de Arroz',e:'🌾'},{n:'Chocopower',e:'🍫'},
  {n:'Gotas de Choc.',e:'💧'},{n:'Granola',e:'🌰'},{n:'Sucrilhos',e:'🌽'},
  {n:'Jujuba',e:'🍭'},{n:'Castanha',e:'🥜'},{n:'Amendoim',e:'🥜'},
  {n:'Manga',e:'🥭'},{n:'Banana',e:'🍌'},{n:'Morango',e:'🍓'},
  {n:'Kiwi',e:'🥝'},{n:'Leite em Pó',e:'🥛'},{n:'Farinha Láctea',e:'🌾'},
  {n:'Pasta Amendoim',e:'🥜'},{n:'Paçoquita',e:'🍪'},{n:'Avelã',e:'🌰'},
  {n:'Cookies Leite',e:'🍪'},{n:'Cookies Branco',e:'🍪'},{n:'Calda Morango',e:'🍓'},
  {n:'Beijos',e:'💋'},{n:'Bananinha',e:'🍌'},{n:'Cereja',e:'🍒'},
  {n:'Coco Ralado',e:'🥥'},{n:'Amendoim Trit.',e:'🥜'},{n:'Marshmallow',e:'☁️'},
  {n:'Tubetes',e:'🍬'},{n:'Ovomaltine Mix',e:'🍫'},{n:'Leite Condensado',e:'🥛'},
  {n:'Mel',e:'🍯'},
];

/* estado */
let S = { tam:'', preco:0, limite:0, tipo:'Fit', creme:'', mix:[] };

/* ── BANNER (apenas imagens reais) ── */
(function(){
  const track = document.getElementById('bannerTrack');
  const dotsEl = document.getElementById('bannerDots');
  const prev   = document.getElementById('bannerPrev');
  const next   = document.getElementById('bannerNext');
  let cur=0, tot=0, timer=null, busy=false;

  const srcs = [
    '/posts/post1.png','/posts/post2.jpg','/posts/post3.jpg',
    '/posts/post4.jpg','/posts/post5.jpg','/posts/post6.jpg',
  ];
  let ok=[], pend=srcs.length;
  srcs.forEach(s=>{
    const i=new Image();
    i.onload=()=>{ok.push(s);done();};
    i.onerror=done;
    i.src=s;
  });

  function done(){ if(--pend===0) build(); }

  function build(){
    track.innerHTML=''; dotsEl.innerHTML='';

    if(ok.length>0){
      ok.forEach(s=>{
        const d=document.createElement('div'); d.className='banner-slide';
        const img=document.createElement('img'); img.src=s; img.alt=''; img.loading='lazy';
        d.appendChild(img); track.appendChild(d);
      });
    } else {
      /* placeholder neutro – sem texto neon */
      const logo = track.closest('section').dataset && '';
      const d=document.createElement('div'); d.className='banner-placeholder';
      d.innerHTML=`<div class="banner-placeholder-inner">
        <p>Homem do Açaí</p>
        <small>Adicione imagens na pasta /posts/ para exibir aqui</small>
      </div>`;
      track.appendChild(d);
    }

    tot = track.children.length;
    if(tot <= 1){ prev.style.display='none'; next.style.display='none'; return; }

    for(let i=0;i<tot;i++){
      const b=document.createElement('button'); b.className='banner-dot'+(i===0?' on':'');
      b.setAttribute('aria-label','Slide '+(i+1));
      b.addEventListener('click',()=>go(i)); dotsEl.appendChild(b);
    }
    start();
  }

  function go(i){
    if(busy||i===cur)return; busy=true;
    cur=(i+tot)%tot;
    track.style.transform='translateX(-'+cur*100+'%)';
    dotsEl.querySelectorAll('.banner-dot').forEach((d,j)=>d.classList.toggle('on',j===cur));
    setTimeout(()=>busy=false,580);
  }
  function start(){ clearInterval(timer); timer=setInterval(()=>go(cur+1),4500); }
  prev.addEventListener('click',()=>{go(cur-1);start();});
  next.addEventListener('click',()=>{go(cur+1);start();});
  track.parentElement.addEventListener('mouseenter',()=>clearInterval(timer));
  track.parentElement.addEventListener('mouseleave',start);
  let tx=0;
  track.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',e=>{
    const d=tx-e.changedTouches[0].clientX;
    if(Math.abs(d)>40){go(cur+(d>0?1:-1));start();}
  });
})();

/* ── MODAL ── */
function abrirModal(tam, preco, limite){
  S = { tam, preco, limite, tipo:'Fit', creme:'', mix:[] };

  const icons = {'300ml':'🥤','500ml':'🍇','750ml':'🍨','1kg':'👑'};
  document.getElementById('mIcon').textContent = icons[tam]||'🍇';
  document.getElementById('mTitulo').textContent = 'Monte seu Açaí '+tam;
  document.getElementById('mSub').textContent = tam+' · R$ '+preco+' · '+limite+' complementos';
  document.getElementById('mTotal').textContent = 'R$ '+preco;
  document.getElementById('obsInput').value = '';

  /* reset tipo */
  document.querySelectorAll('.chip-tipo').forEach(b=>{
    b.classList.toggle('ativo', b.dataset.v==='Fit');
  });

  /* cremes */
  const cw = document.getElementById('cremesWrap'); cw.innerHTML='';
  CREMES.forEach(c=>{
    const b=document.createElement('button'); b.className='chip-creme'; b.textContent=c.e+' '+c.n; b.dataset.v=c.n;
    b.addEventListener('click',()=>{
      S.creme = S.creme===c.n ? '' : c.n;
      cw.querySelectorAll('.chip-creme').forEach(x=>x.classList.toggle('ativo',x.dataset.v===S.creme));
      atualizarBarra();
    });
    cw.appendChild(b);
  });

  /* mix */
  const mw = document.getElementById('mixWrap'); mw.innerHTML='';
  document.getElementById('contagem').textContent='0 / '+limite;
  document.getElementById('contagem').classList.remove('cheio');
  MIX.forEach(m=>{
    const b=document.createElement('button'); b.className='chip-mix';
    b.innerHTML='<em>'+m.e+'</em>'+m.n; b.dataset.v=m.n;
    b.addEventListener('click',()=>{
      if(b.classList.contains('ativo')){
        S.mix=S.mix.filter(x=>x!==m.n); b.classList.remove('ativo');
      } else {
        if(S.mix.length>=S.limite){toast('Limite de '+S.limite+' complementos para '+S.tam);return;}
        S.mix.push(m.n); b.classList.add('ativo');
      }
      const ct=document.getElementById('contagem');
      ct.textContent=S.mix.length+' / '+S.limite;
      ct.classList.toggle('cheio',S.mix.length>=S.limite);
      mw.querySelectorAll('.chip-mix:not(.ativo)').forEach(x=>{
        x.disabled=S.mix.length>=S.limite; x.toggleAttribute('disabled',S.mix.length>=S.limite);
      });
      atualizarBarra();
    });
    mw.appendChild(b);
  });

  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

function fecharModal(e, force){
  if(force || (e && e.target===document.getElementById('modalBg'))){
    document.getElementById('modalBg').classList.remove('aberto');
    document.body.style.overflow='';
  }
}

document.addEventListener('keydown',e=>{ if(e.key==='Escape') fecharModal(null,true); });

function escolherTipo(btn){
  S.tipo=btn.dataset.v;
  document.querySelectorAll('.chip-tipo').forEach(b=>b.classList.toggle('ativo',b===btn));
  atualizarBarra();
}

function atualizarBarra(){
  const pcts = [!!S.tipo, !!S.creme, S.mix.length>0, true];
  const n = pcts.filter(Boolean).length;
  document.getElementById('mBarra').style.width=(n/4*100)+'%';
}

function finalizarPedido(){
  if(!S.creme){ toast('Escolha um creme antes de continuar'); return; }
  if(!S.mix.length){ toast('Adicione pelo menos 1 complemento'); return; }
  const obs=document.getElementById('obsInput').value.trim();
  const linhas=[
    '🍇 *Olá! Gostaria de fazer um pedido:*','',
    `*Tipo:* Açaí ${S.tipo}`,
    `*Tamanho:* ${S.tam} — R$ ${S.preco},00`,
    `*Creme:* ${S.creme}`,
    `*Complementos (${S.mix.length}/${S.limite}):* ${S.mix.join(', ')}`,
  ];
  if(obs) linhas.push(`*Obs:* ${obs}`);
  linhas.push('','📲 Aguardo confirmação!');
  window.open('https://wa.me/5585994101173?text='+encodeURIComponent(linhas.join('\n')),'_blank');
}

/* ── MENU ── */
const burger = document.getElementById('burger');
const drawer = document.getElementById('navDrawer');
burger.addEventListener('click',()=>{
  drawer.classList.toggle('open'); burger.classList.toggle('open');
});
function closeMenu(){ drawer.classList.remove('open'); burger.classList.remove('open'); }
document.addEventListener('click',e=>{ if(!e.target.closest('#header')) closeMenu(); });

/* ── HEADER SCROLL ── */
window.addEventListener('scroll',()=>{
  document.getElementById('header').classList.toggle('stuck',scrollY>40);
},{passive:true});

/* ── TOAST ── */
let tt;
function toast(msg){
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),3000);
}
