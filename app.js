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

const GELATOS = [
  {n:'Ninho Trufado',     e:'🍦', preco:22},
  {n:'Ninho c/ Pistache', e:'🟢', preco:24},
  {n:'Oreo',              e:'🖤', preco:20},
  {n:'Flocos',            e:'✨', preco:20},
  {n:'Choco Belga',       e:'🍫', preco:22},
  {n:'Delícia de Abacaxi',e:'🍍', preco:20},
  {n:'Unicórnio',         e:'🦄', preco:24},
  {n:'Brownie',           e:'🟫', preco:22},
  {n:'Pistache',          e:'🟩', preco:24},
  {n:'Tapioca',           e:'⚪', preco:20},
];

/* estado */
let S = { categoria:'', tam:'', preco:0, limite:0, tipo:'Fit', creme:'', mix:[], comAcai:false, gelatoNome:'' };

/* ── BANNER ── */
(function(){
  const track=document.getElementById('bannerTrack');
  const dotsEl=document.getElementById('bannerDots');
  const prev=document.getElementById('bannerPrev');
  const next=document.getElementById('bannerNext');
  let cur=0, tot=0, timer=null, busy=false;

  /* tenta carregar imagens adicionais da pasta /posts/ */
  const extras=['/posts/post2.jpg','/posts/post3.jpg','/posts/post4.jpg','/posts/post5.jpg','/posts/post6.jpg'];
  let loaded=0, extraSlides=[];
  extras.forEach(s=>{
    const i=new Image();
    i.onload=()=>{ extraSlides.push(s); check(); };
    i.onerror=check;
    i.src=s;
  });
  function check(){ if(++loaded===extras.length) addExtras(); }

  function addExtras(){
    extraSlides.forEach(s=>{
      const d=document.createElement('div'); d.className='banner-slide';
      const img=document.createElement('img'); img.src=s; img.alt=''; img.loading='lazy';
      d.appendChild(img); track.appendChild(d);
    });
    init();
  }
  /* timeout fallback se todas falharem rápido */
  setTimeout(()=>{ if(!tot) init(); }, 800);

  function init(){
    if(tot) return; /* já inicializado */
    tot=track.children.length;
    dotsEl.innerHTML='';
    if(tot<=1){ prev.style.display='none'; next.style.display='none'; return; }
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
    setTimeout(()=>busy=false,550);
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

/* ── TABS ── */
function mudarTab(tab, btn){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('ativo'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('ativo'));
  btn.classList.add('ativo');
  document.getElementById('tab-'+tab).classList.add('ativo');

  if(tab==='gelato' && !document.getElementById('gridGelatos').children.length){
    buildGelatos();
  }
}

function buildGelatos(){
  const g=document.getElementById('gridGelatos');
  GELATOS.forEach(gl=>{
    const card=document.createElement('button');
    card.className='card-gelato';
    card.innerHTML=`<div class="cg-icon">${gl.e}</div>
      <div class="cg-info">
        <div class="cg-nome">${gl.n}</div>
        <div class="cg-preco">R$ ${gl.preco}</div>
        <span class="cg-btn-text">Montar →</span>
      </div>`;
    card.addEventListener('click',()=>abrirModalGelato(gl));
    g.appendChild(card);
  });
}

/* ── MODAL AÇAÍ ── */
function abrirModal(cat, tam, preco, limite){
  S = { categoria:cat, tam, preco, limite, tipo:'Fit', creme:'', mix:[], comAcai:false, gelatoNome:'' };

  const icons={'300ml':'🥤','500ml':'🍇','750ml':'🍨','1kg':'👑'};
  document.getElementById('mIcon').textContent = icons[tam]||'🍇';
  document.getElementById('mTitulo').textContent = 'Açaí '+tam;
  const ilimitado = limite>=99;
  document.getElementById('mSub').textContent = tam+' · R$ '+preco+(ilimitado?' · à vontade':' · '+limite+' complementos');
  document.getElementById('mTotal').textContent='R$ '+preco;

  const corpo=document.getElementById('modalCorpo');
  corpo.innerHTML='';

  /* bloco tipo */
  corpo.appendChild(criarBloco('Tipo de Açaí','',`
    <div class="tipos-row">
      <button class="chip-tipo" data-v="Premium" onclick="escolherTipo(this)"><span>👑</span>Premium</button>
      <button class="chip-tipo ativo" data-v="Fit" onclick="escolherTipo(this)"><span>💪</span>Fit</button>
      <button class="chip-tipo" data-v="Tradicional" onclick="escolherTipo(this)"><span>⭐</span>Tradicional</button>
    </div>
  `));

  /* bloco creme */
  const cremesDiv=document.createElement('div'); cremesDiv.className='chips-wrap'; cremesDiv.id='cremesWrap';
  CREMES.forEach(c=>{
    const b=document.createElement('button'); b.className='chip-creme'; b.textContent=c.e+' '+c.n; b.dataset.v=c.n;
    b.addEventListener('click',()=>{
      S.creme=S.creme===c.n?'':c.n;
      cremesDiv.querySelectorAll('.chip-creme').forEach(x=>x.classList.toggle('ativo',x.dataset.v===S.creme));
      atualizarBarra();
    });
    cremesDiv.appendChild(b);
  });
  const blocoC=document.createElement('div'); blocoC.className='bloco';
  const tC=document.createElement('div'); tC.className='bloco-titulo'; tC.innerHTML='Creme <span class="obrig">(escolha 1)</span>';
  blocoC.appendChild(tC); blocoC.appendChild(cremesDiv); corpo.appendChild(blocoC);

  /* bloco mix */
  if(ilimitado){
    const blocoMix=document.createElement('div'); blocoMix.className='bloco';
    const tM=document.createElement('div'); tM.className='bloco-titulo'; tM.textContent='Complementos';
    const aviso=document.createElement('div'); aviso.className='aviso-vontade';
    aviso.textContent='🎉 À vontade! Escolha o que quiser e informe nas observações';
    blocoMix.appendChild(tM); blocoMix.appendChild(aviso); corpo.appendChild(blocoMix);
  } else {
    const mixDiv=document.createElement('div'); mixDiv.className='chips-mix'; mixDiv.id='mixWrap';
    const ct=document.createElement('span'); ct.className='contagem'; ct.id='contagem'; ct.textContent='0 / '+limite;
    const tM=document.createElement('div'); tM.className='bloco-titulo';
    tM.innerHTML='Complementos'; tM.appendChild(ct);
    MIX.forEach(m=>{
      const b=document.createElement('button'); b.className='chip-mix';
      b.innerHTML='<em>'+m.e+'</em>'+m.n; b.dataset.v=m.n;
      b.addEventListener('click',()=>{
        if(b.classList.contains('ativo')){ S.mix=S.mix.filter(x=>x!==m.n); b.classList.remove('ativo'); }
        else {
          if(S.mix.length>=S.limite){ toast('Limite de '+S.limite+' complementos'); return; }
          S.mix.push(m.n); b.classList.add('ativo');
        }
        ct.textContent=S.mix.length+' / '+S.limite;
        ct.classList.toggle('cheio',S.mix.length>=S.limite);
        mixDiv.querySelectorAll('.chip-mix:not(.ativo)').forEach(x=>{
          const off=S.mix.length>=S.limite; x.disabled=off; x.toggleAttribute('disabled',off);
        });
        atualizarBarra();
      });
      mixDiv.appendChild(b);
    });
    const blocoM=document.createElement('div'); blocoM.className='bloco';
    blocoM.appendChild(tM); blocoM.appendChild(mixDiv); corpo.appendChild(blocoM);
  }

  /* obs */
  corpo.appendChild(criarBlocoObs());

  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

/* ── MODAL GELATO ── */
function abrirModalGelato(gl){
  S = { categoria:'gelato', tam:'', preco:gl.preco, limite:0, tipo:'', creme:'', mix:[], comAcai:false, gelatoNome:gl.n };

  document.getElementById('mIcon').textContent=gl.e;
  document.getElementById('mTitulo').textContent='Gelato '+gl.n;
  document.getElementById('mSub').textContent='R$ '+gl.preco;
  document.getElementById('mTotal').textContent='R$ '+gl.preco;

  const corpo=document.getElementById('modalCorpo');
  corpo.innerHTML='';

  /* pergunta: misturar com açaí? */
  const pergDiv=document.createElement('div'); pergDiv.className='pergunta-row'; pergDiv.id='pergRow';
  ['Sim, com Açaí','Não, apenas Gelato'].forEach((txt,i)=>{
    const b=document.createElement('button'); b.className='chip-perg'+(i===0?'':' ativo'); b.dataset.v=i===0?'sim':'nao';
    b.textContent=txt;
    b.addEventListener('click',()=>{
      S.comAcai=b.dataset.v==='sim';
      pergDiv.querySelectorAll('.chip-perg').forEach(x=>x.classList.toggle('ativo',x===b));
      renderCamposGelato(corpo, S.comAcai);
      atualizarBarra();
    });
    pergDiv.appendChild(b);
  });
  const blocoP=document.createElement('div'); blocoP.className='bloco';
  const tP=document.createElement('div'); tP.className='bloco-titulo'; tP.textContent='Misturar com Açaí?';
  blocoP.appendChild(tP); blocoP.appendChild(pergDiv); corpo.appendChild(blocoP);

  /* campos default: sem açaí */
  renderCamposGelato(corpo, false);
  corpo.appendChild(criarBlocoObs());

  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

function renderCamposGelato(corpo, comAcai){
  /* remove blocos anteriores de creme/mix mas mantém pergunta e obs */
  ['blocoCremeG','blocoMixG'].forEach(id=>{ const el=document.getElementById(id); if(el) el.remove(); });

  /* obs fica por último – vamos remover e re-adicionar no final */
  const obsBloco=document.getElementById('blocoObs'); if(obsBloco) obsBloco.remove();

  if(comAcai){
    S.comAcai=true;
    /* creme */
    const cremesDiv=document.createElement('div'); cremesDiv.className='chips-wrap'; cremesDiv.id='cremesWrap';
    CREMES.forEach(c=>{
      const b=document.createElement('button'); b.className='chip-creme'; b.textContent=c.e+' '+c.n; b.dataset.v=c.n;
      b.addEventListener('click',()=>{
        S.creme=S.creme===c.n?'':c.n;
        cremesDiv.querySelectorAll('.chip-creme').forEach(x=>x.classList.toggle('ativo',x.dataset.v===S.creme));
        atualizarBarra();
      });
      cremesDiv.appendChild(b);
    });
    const blocoC=document.createElement('div'); blocoC.className='bloco'; blocoC.id='blocoCremeG';
    const tC=document.createElement('div'); tC.className='bloco-titulo'; tC.innerHTML='Creme do Açaí <span class="obrig">(escolha 1)</span>';
    blocoC.appendChild(tC); blocoC.appendChild(cremesDiv); corpo.appendChild(blocoC);

    /* mix (5 complementos) */
    S.limite=5; S.mix=[];
    const mixDiv=document.createElement('div'); mixDiv.className='chips-mix'; mixDiv.id='mixWrap';
    const ct=document.createElement('span'); ct.className='contagem'; ct.id='contagem'; ct.textContent='0 / 5';
    const tM=document.createElement('div'); tM.className='bloco-titulo'; tM.innerHTML='Complementos'; tM.appendChild(ct);
    MIX.forEach(m=>{
      const b=document.createElement('button'); b.className='chip-mix';
      b.innerHTML='<em>'+m.e+'</em>'+m.n; b.dataset.v=m.n;
      b.addEventListener('click',()=>{
        if(b.classList.contains('ativo')){ S.mix=S.mix.filter(x=>x!==m.n); b.classList.remove('ativo'); }
        else {
          if(S.mix.length>=5){ toast('Limite de 5 complementos'); return; }
          S.mix.push(m.n); b.classList.add('ativo');
        }
        ct.textContent=S.mix.length+' / 5';
        ct.classList.toggle('cheio',S.mix.length>=5);
        mixDiv.querySelectorAll('.chip-mix:not(.ativo)').forEach(x=>{
          const off=S.mix.length>=5; x.disabled=off; x.toggleAttribute('disabled',off);
        });
        atualizarBarra();
      });
      mixDiv.appendChild(b);
    });
    const blocoM=document.createElement('div'); blocoM.className='bloco'; blocoM.id='blocoMixG';
    blocoM.appendChild(tM); blocoM.appendChild(mixDiv); corpo.appendChild(blocoM);
  } else {
    S.comAcai=false; S.creme=''; S.mix=[];
  }

  corpo.appendChild(criarBlocoObs());
}

/* helpers */
function criarBloco(titulo, obrig, innerHtml){
  const b=document.createElement('div'); b.className='bloco';
  const t=document.createElement('div'); t.className='bloco-titulo';
  t.innerHTML=titulo+(obrig?` <span class="obrig">${obrig}</span>`:'');
  b.appendChild(t); b.insertAdjacentHTML('beforeend',innerHtml);
  return b;
}

function criarBlocoObs(){
  const b=document.createElement('div'); b.className='bloco'; b.id='blocoObs';
  const t=document.createElement('div'); t.className='bloco-titulo';
  t.innerHTML='Observações <span class="obrig">(opcional)</span>';
  const ta=document.createElement('textarea'); ta.id='obsInput'; ta.placeholder='Ex: sem granola, bem gelado...';
  b.appendChild(t); b.appendChild(ta); return b;
}

/* ── TIPO AÇAÍ ── */
function escolherTipo(btn){
  S.tipo=btn.dataset.v;
  document.querySelectorAll('.chip-tipo').forEach(b=>b.classList.toggle('ativo',b===btn));
  atualizarBarra();
}

/* ── BARRA PROGRESSO ── */
function atualizarBarra(){
  let itens;
  if(S.categoria==='gelato'){
    itens=[true, S.comAcai ? !!S.creme : true, S.comAcai ? S.mix.length>0 : true, true];
  } else {
    const ilimitado=S.limite>=99;
    itens=[!!S.tipo, !!S.creme, ilimitado||S.mix.length>0, true];
  }
  const n=itens.filter(Boolean).length;
  document.getElementById('mBarra').style.width=(n/4*100)+'%';
}

/* ── FECHAR MODAL ── */
function fecharModal(e, force){
  if(force||(e&&e.target===document.getElementById('modalBg'))){
    document.getElementById('modalBg').classList.remove('aberto');
    document.body.style.overflow='';
  }
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape') fecharModal(null,true); });

/* ── FINALIZAR ── */
function finalizarPedido(){
  const obs=document.getElementById('obsInput')?.value.trim()||'';

  if(S.categoria==='gelato'){
    const linhas=[
      '🍨 *Olá! Gostaria de pedir um Gelato:*','',
      `*Sabor:* ${S.gelatoNome}`,
      `*Com Açaí:* ${S.comAcai?'Sim':'Não'}`,
    ];
    if(S.comAcai){
      if(!S.creme){ toast('Escolha um creme para o açaí'); return; }
      linhas.push(`*Creme:* ${S.creme}`);
      if(S.mix.length) linhas.push(`*Complementos:* ${S.mix.join(', ')}`);
    }
    linhas.push(`*Total:* R$ ${S.preco},00`);
    if(obs) linhas.push(`*Obs:* ${obs}`);
    linhas.push('','📲 Aguardo confirmação!');
    window.open('https://wa.me/5585994101173?text='+encodeURIComponent(linhas.join('\n')),'_blank');
    return;
  }

  /* açaí */
  if(!S.creme){ toast('Escolha um creme antes de continuar'); return; }
  const ilimitado=S.limite>=99;
  if(!ilimitado&&!S.mix.length){ toast('Adicione pelo menos 1 complemento'); return; }

  const linhas=[
    '🍇 *Olá! Gostaria de fazer um pedido:*','',
    `*Tipo:* Açaí ${S.tipo}`,
    `*Tamanho:* ${S.tam} — R$ ${S.preco},00`,
    `*Creme:* ${S.creme}`,
  ];
  if(ilimitado){
    linhas.push('*Complementos:* À vontade (informar nas observações)');
  } else {
    linhas.push(`*Complementos (${S.mix.length}/${S.limite}):* ${S.mix.join(', ')}`);
  }
  if(obs) linhas.push(`*Obs:* ${obs}`);
  linhas.push('','📲 Aguardo confirmação!');
  window.open('https://wa.me/5585994101173?text='+encodeURIComponent(linhas.join('\n')),'_blank');
}

/* ── MENU ── */
const burger=document.getElementById('burger');
const drawer=document.getElementById('navDrawer');
burger.addEventListener('click',()=>{ drawer.classList.toggle('open'); burger.classList.toggle('open'); });
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
