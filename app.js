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
  {n:'Delicia de Abacaxi',e:'🍍', preco:20},
  {n:'Unicornio',         e:'🦄', preco:24},
  {n:'Brownie',           e:'🟫', preco:22},
  {n:'Pistache',          e:'🟩', preco:24},
  {n:'Tapioca',           e:'⚪', preco:20},
];

/* ── ESTADO ── */
let S = { categoria:'', tam:'', preco:0, limite:0, tipo:'Fit', creme:'', mix:[], comAcai:false, gelatoNome:'', gelatoPreco:0 };

/* ── CARRINHO ── */
let cart = [];

function addToCart(item){
  cart.push(item);
  updateCartUI();
}

function removeFromCart(idx){
  cart.splice(idx,1);
  updateCartUI();
}

function updateCartUI(){
  const count = cart.length;
  const total = cart.reduce((s,i)=>s+i.preco,0);

  document.querySelectorAll('.cart-badge').forEach(b=>{
    b.textContent = count;
    b.style.display = count>0?'flex':'none';
  });

  const el = document.getElementById('cartTotal');
  if(el) el.textContent = 'R$ '+total+',00';

  const list = document.getElementById('cartList');
  if(!list) return;
  list.innerHTML='';
  if(count===0){
    list.innerHTML='<p class="cart-empty">Seu carrinho esta vazio 🛒</p>';
    return;
  }
  cart.forEach((item,idx)=>{
    const div=document.createElement('div'); div.className='cart-item';
    div.innerHTML=`
      <div class="ci-info">
        <span class="ci-nome">${item.nome}</span>
        <span class="ci-det">${item.detalhe}</span>
      </div>
      <div class="ci-right">
        <span class="ci-preco">R$ ${item.preco},00</span>
        <button class="ci-rem" onclick="removeFromCart(${idx})" title="Remover">&#x2715;</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function abrirCarrinho(){
  document.getElementById('cartDrawer').classList.add('aberto');
  document.getElementById('cartOverlay').classList.add('visivel');
  document.body.style.overflow='hidden';
}
function fecharCarrinho(){
  document.getElementById('cartDrawer').classList.remove('aberto');
  document.getElementById('cartOverlay').classList.remove('visivel');
  document.body.style.overflow='';
}

/* ── BANNER ── */
(function(){
  const track=document.getElementById('bannerTrack');
  const dotsEl=document.getElementById('bannerDots');
  const prev=document.getElementById('bannerPrev');
  const next=document.getElementById('bannerNext');
  let cur=0, tot=0, timer=null, busy=false;

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
  setTimeout(()=>{ if(!tot) init(); }, 800);

  function init(){
    if(tot) return;
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
        <span class="cg-btn-text">Montar &rarr;</span>
      </div>`;
    card.addEventListener('click',()=>abrirModalGelato(gl));
    g.appendChild(card);
  });
}

/* ── MODAL ACAI ── */
function abrirModal(cat, tam, preco, limite){
  S = { categoria:cat, tam, preco, limite, tipo:'Fit', creme:'', mix:[], comAcai:false, gelatoNome:'', gelatoPreco:0 };

  const icons={'300ml':'🥤','500ml':'🍇','750ml':'🍨','1kg':'👑'};
  document.getElementById('mIcon').textContent = icons[tam]||'🍇';
  document.getElementById('mTitulo').textContent = 'Acai '+tam;
  const ilimitado = limite>=99;
  document.getElementById('mSub').textContent = tam+' · R$ '+preco+(ilimitado?' · a vontade':' · '+limite+' complementos');
  document.getElementById('mTotal').textContent='R$ '+preco;

  const corpo=document.getElementById('modalCorpo');
  corpo.innerHTML='';

  /* bloco tipo */
  corpo.appendChild(criarBloco('Tipo de Acai','',`
    <div class="tipos-row">
      <button class="chip-tipo" data-v="Premium" onclick="escolherTipo(this)"><span>👑</span>Premium</button>
      <button class="chip-tipo ativo" data-v="Fit" onclick="escolherTipo(this)"><span>💪</span>Fit</button>
      <button class="chip-tipo" data-v="Tradicional" onclick="escolherTipo(this)"><span>⭐</span>Tradicional</button>
    </div>
  `));

  /* bloco: quer gelato? */
  const pergDiv=document.createElement('div'); pergDiv.className='pergunta-row'; pergDiv.id='pergRowAcai';
  ['Sim, quero Gelato','Nao, sem Gelato'].forEach((txt,i)=>{
    const b=document.createElement('button'); b.className='chip-perg'+(i===1?' ativo':''); b.dataset.v=i===0?'sim':'nao';
    b.textContent=txt;
    b.addEventListener('click',()=>{
      S.comAcai=b.dataset.v==='sim';
      pergDiv.querySelectorAll('.chip-perg').forEach(x=>x.classList.toggle('ativo',x===b));
      renderGelatoSelector(corpo, S.comAcai);
      atualizarBarra();
    });
    pergDiv.appendChild(b);
  });
  const blocoG=document.createElement('div'); blocoG.className='bloco';
  const tG=document.createElement('div'); tG.className='bloco-titulo'; tG.textContent='Adicionar Gelato?';
  blocoG.appendChild(tG); blocoG.appendChild(pergDiv); corpo.appendChild(blocoG);

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
    aviso.textContent='🎉 A vontade! Escolha o que quiser e informe nas observacoes';
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

  corpo.appendChild(criarBlocoObs());
  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

/* Gelato selector dentro do modal de acai */
function renderGelatoSelector(corpo, mostrar){
  const existing=document.getElementById('blocoGelatoSelect');
  if(existing) existing.remove();
  S.gelatoNome=''; S.gelatoPreco=0;
  document.getElementById('mTotal').textContent='R$ '+S.preco;
  if(!mostrar) return;

  const blocoGS=document.createElement('div'); blocoGS.className='bloco'; blocoGS.id='blocoGelatoSelect';
  const tGS=document.createElement('div'); tGS.className='bloco-titulo'; tGS.innerHTML='Escolha o Gelato <span class="obrig">(escolha 1)</span>';
  blocoGS.appendChild(tGS);

  const grid=document.createElement('div'); grid.className='gelato-select-grid';
  GELATOS.forEach(gl=>{
    const b=document.createElement('button'); b.className='chip-gelato-sel'; b.dataset.v=gl.n;
    b.innerHTML=`<em>${gl.e}</em>${gl.n}<span class="gsel-preco">+R$${gl.preco}</span>`;
    b.addEventListener('click',()=>{
      if(S.gelatoNome===gl.n){
        S.gelatoNome=''; S.gelatoPreco=0;
        b.classList.remove('ativo');
      } else {
        S.gelatoNome=gl.n; S.gelatoPreco=gl.preco;
        grid.querySelectorAll('.chip-gelato-sel').forEach(x=>x.classList.toggle('ativo',x===b));
      }
      document.getElementById('mTotal').textContent='R$ '+(S.preco+S.gelatoPreco);
      atualizarBarra();
    });
    grid.appendChild(b);
  });
  blocoGS.appendChild(grid);

  const cremesBloco=document.getElementById('cremesWrap')?.closest('.bloco');
  if(cremesBloco) corpo.insertBefore(blocoGS, cremesBloco);
  else corpo.appendChild(blocoGS);
}

/* ── MODAL GELATO ── */
function abrirModalGelato(gl){
  S = { categoria:'gelato', tam:'', preco:gl.preco, limite:0, tipo:'', creme:'', mix:[], comAcai:false, gelatoNome:gl.n, gelatoPreco:0 };

  document.getElementById('mIcon').textContent=gl.e;
  document.getElementById('mTitulo').textContent='Gelato '+gl.n;
  document.getElementById('mSub').textContent='R$ '+gl.preco;
  document.getElementById('mTotal').textContent='R$ '+gl.preco;

  const corpo=document.getElementById('modalCorpo');
  corpo.innerHTML='';

  const pergDiv=document.createElement('div'); pergDiv.className='pergunta-row'; pergDiv.id='pergRow';
  ['Sim, com Acai','Nao, apenas Gelato'].forEach((txt,i)=>{
    const b=document.createElement('button'); b.className='chip-perg'+(i===1?' ativo':''); b.dataset.v=i===0?'sim':'nao';
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
  const tP=document.createElement('div'); tP.className='bloco-titulo'; tP.textContent='Misturar com Acai?';
  blocoP.appendChild(tP); blocoP.appendChild(pergDiv); corpo.appendChild(blocoP);

  renderCamposGelato(corpo, false);

  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

function renderCamposGelato(corpo, comAcai){
  ['blocoCremeG','blocoMixG','blocoObs'].forEach(id=>{ const el=document.getElementById(id); if(el) el.remove(); });

  if(comAcai){
    S.comAcai=true;
    const cremesDiv=document.createElement('div'); cremesDiv.className='chips-wrap'; cremesDiv.id='cremesWrapG';
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
    const tC=document.createElement('div'); tC.className='bloco-titulo'; tC.innerHTML='Creme do Acai <span class="obrig">(escolha 1)</span>';
    blocoC.appendChild(tC); blocoC.appendChild(cremesDiv); corpo.appendChild(blocoC);

    S.limite=5; S.mix=[];
    const mixDiv=document.createElement('div'); mixDiv.className='chips-mix'; mixDiv.id='mixWrapG';
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

  /* UMA unica caixa de observacoes */
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
  t.innerHTML='Observacoes <span class="obrig">(opcional)</span>';
  const ta=document.createElement('textarea'); ta.id='obsInput'; ta.placeholder='Ex: sem granola, bem gelado...';
  b.appendChild(t); b.appendChild(ta); return b;
}

/* ── TIPO ACAI ── */
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
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ fecharModal(null,true); fecharCheckout(); } });

/* ── ADICIONAR AO CARRINHO ── */
function adicionarAoCarrinho(){
  const obs=document.getElementById('obsInput')?.value.trim()||'';

  if(S.categoria==='gelato'){
    if(S.comAcai && !S.creme){ toast('Escolha um creme para o acai'); return; }
    const det=S.comAcai
      ? 'Com Acai · Creme: '+S.creme+(S.mix.length?' · '+S.mix.join(', '):'')
      : 'Apenas Gelato';
    addToCart({
      tipo:'gelato', nome:'Gelato '+S.gelatoNome,
      detalhe: det+(obs?' · '+obs:''),
      preco: S.preco
    });
  } else {
    if(!S.creme){ toast('Escolha um creme antes de continuar'); return; }
    const ilimitado=S.limite>=99;
    if(!ilimitado&&!S.mix.length){ toast('Adicione pelo menos 1 complemento'); return; }
    const gelatoExtra = S.comAcai && S.gelatoNome ? ' + Gelato '+S.gelatoNome : '';
    addToCart({
      tipo:'acai', nome:'Acai '+S.tipo+' '+S.tam+gelatoExtra,
      detalhe: 'Creme: '+S.creme+' · '+(ilimitado?'Complementos a vontade':S.mix.join(', '))+(obs?' · '+obs:''),
      preco: S.preco+S.gelatoPreco
    });
  }

  fecharModal(null,true);
  toast('Item adicionado ao carrinho! 🛒');
}

/* ── FINALIZAR PEDIDO (do carrinho) ── */
function finalizarPedido(){
  if(cart.length===0){ toast('Adicione itens ao carrinho primeiro'); return; }
  fecharCarrinho();
  abrirCheckout();
}

/* ── CHECKOUT ── */
function abrirCheckout(){
  document.getElementById('checkoutBg').classList.add('aberto');
  document.body.style.overflow='hidden';
  renderCheckoutResumo();
}
function fecharCheckout(){
  const bg=document.getElementById('checkoutBg');
  if(bg) bg.classList.remove('aberto');
  document.body.style.overflow='';
}

function renderCheckoutResumo(){
  const el=document.getElementById('checkoutResumo');
  if(!el) return;
  const total=cart.reduce((s,i)=>s+i.preco,0);
  el.innerHTML=cart.map(i=>`
    <div class="checkout-item">
      <span>${i.nome}</span>
      <span>R$ ${i.preco},00</span>
    </div>
  `).join('')+`<div class="checkout-total-row"><strong>Total</strong><strong>R$ ${total},00</strong></div>`;
}

function enviarPedidoWhatsApp(){
  const nome=document.getElementById('inputNome')?.value.trim();
  const tel=document.getElementById('inputTel')?.value.trim();
  const end=document.getElementById('inputEnd')?.value.trim();
  const pag=document.querySelector('input[name="pagamento"]:checked')?.value;

  if(!nome){ toast('Informe seu nome'); return; }
  if(!tel){ toast('Informe seu numero'); return; }
  if(!end){ toast('Informe seu endereco'); return; }
  if(!pag){ toast('Escolha a forma de pagamento'); return; }

  const total=cart.reduce((s,i)=>s+i.preco,0);
  const itensTexto=cart.map(i=>'• '+i.nome+'\n  '+i.detalhe+'\n  R$ '+i.preco+',00').join('\n\n');

  const linhas=[
    '🍇 *Ola! Novo pedido:*','',
    itensTexto,'',
    '*Total:* R$ '+total+',00','',
    '*Nome:* '+nome,
    '*Telefone:* '+tel,
    '*Endereco:* '+end,
    '*Pagamento:* '+pag,'',
    '📲 Aguardo confirmacao!'
  ];

  cart=[];
  updateCartUI();
  fecharCheckout();
  toast('Pedido enviado! 🎉');
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
