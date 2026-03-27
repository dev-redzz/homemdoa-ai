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

const GELATO_COBERTURAS = [
  {n:'Beijos',e:'💋'},
  {n:'Dentaduras',e:'🦷'},
  {n:'Bananas',e:'🍌'},
  {n:'Menta',e:'🌿'},
  {n:'Leite Condensado',e:'🥛'},
  {n:'Baunilha',e:'🍦'},
  {n:'Morango',e:'🍓'},
  {n:'Açaí',e:'🍇'},
  {n:'Chocolate',e:'🍫'},
];

const GELATO_SABORES = [
  {n:'Ninho Trufado',     e:'🍦'},
  {n:'Ninho c/ Pistache', e:'🟢'},
  {n:'Oreo',              e:'🖤'},
  {n:'Flocos',            e:'✨'},
  {n:'Choco Belga',       e:'🍫'},
  {n:'Delicia de Abacaxi',e:'🍍'},
  {n:'Unicornio',         e:'🦄'},
  {n:'Brownie',           e:'🟫'},
  {n:'Pistache',          e:'🟩'},
  {n:'Tapioca',           e:'⚪'},
];

const GELATO_TAMANHOS = [
  {tam:'300ml', preco:16, label:'Pequeno', limite:4},
  {tam:'500ml', preco:25, label:'Médio',   limite:5},
  {tam:'750ml', preco:33, label:'Grande',  limite:6},
  {tam:'1kg',   preco:45, label:'Mega',    limite:99},
];

/* ── ESTADO ── */
let S = {
  categoria:'', tam:'', preco:0, limite:0, tipo:'Fit',
  creme:'', mix:[], gelatoNome:'', gelatoTam:'', cobertura:'',
  // açaí + gelato combo
  comGelatoExtra:false, gelatoExtraNome:'', gelatoExtraEmoji:''
};

/* ── CARRINHO ── */
let cart = [];

function addToCart(item){ cart.push(item); updateCartUI(); }
function removeFromCart(idx){ cart.splice(idx,1); updateCartUI(); }

function updateCartUI(){
  const count = cart.length;
  const total = cart.reduce((s,i)=>s+i.preco,0);
  document.querySelectorAll('.cart-badge').forEach(b=>{
    b.textContent=count; b.style.display=count>0?'flex':'none';
  });
  const el=document.getElementById('cartTotal');
  if(el) el.textContent='R$ '+total+',00';
  const list=document.getElementById('cartList');
  if(!list) return;
  list.innerHTML='';
  if(count===0){ list.innerHTML='<p class="cart-empty">Seu carrinho está vazio 🛒</p>'; return; }
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
      </div>`;
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

/* ── TABS ── */
function mudarTab(tab, btn){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('ativo'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('ativo'));
  btn.classList.add('ativo');
  document.getElementById('tab-'+tab).classList.add('ativo');
  if(tab==='gelato' && !document.getElementById('gridGelatos').children.length) buildGelatos();
}

/* ── GELATO TAB: mostra tamanhos de copo ── */
function buildGelatos(){
  const g=document.getElementById('gridGelatos');
  GELATO_TAMANHOS.forEach(gt=>{
    const card=document.createElement('button');
    card.className='card-tamanho';
    const cupClass = {300:'ct-sm',500:'ct-md',750:'ct-lg',1:'ct-xl'}[parseInt(gt.tam)] || 'ct-md';
    card.innerHTML=`
      <div class="ct-label">${gt.label}</div>
      <div class="ct-cup ${cupClass}"><div class="cup-liquid"><div class="cup-top"></div></div></div>
      <div class="ct-vol">${gt.tam.replace('ml','')}<span>${gt.tam.includes('kg')?'kg':'ml'}</span></div>
      <div class="ct-price">R$<strong>${gt.preco}</strong></div>
      <div class="ct-info">${gt.limite>=99?'Mix à vontade':gt.limite+' complementos'}</div>
      <div class="ct-btn">Montar</div>`;
    card.addEventListener('click',()=>abrirModalGelato(gt));
    g.appendChild(card);
  });
}

/* ── MODAL AÇAÍ ── */
function abrirModal(cat, tam, preco, limite){
  S = { categoria:cat, tam, preco, limite, tipo:'Fit', creme:'', mix:[],
        gelatoNome:'', gelatoTam:'', cobertura:'',
        comGelatoExtra:false, gelatoExtraNome:'', gelatoExtraEmoji:'' };

  const icons={'300ml':'🥤','500ml':'🍇','750ml':'🍨','1kg':'👑'};
  document.getElementById('mIcon').textContent=icons[tam]||'🍇';
  document.getElementById('mTitulo').textContent='Açaí '+tam;
  const ilimitado=limite>=99;
  document.getElementById('mSub').textContent=tam+' · R$ '+preco+(ilimitado?' · à vontade':' · '+limite+' complementos');
  document.getElementById('mTotal').textContent='R$ '+preco;

  const corpo=document.getElementById('modalCorpo');
  corpo.innerHTML='';

  /* tipo */
  corpo.appendChild(criarBloco('Tipo de Açaí','',`
    <div class="tipos-row">
      <button class="chip-tipo" data-v="Premium" onclick="escolherTipo(this)"><span>👑</span>Premium</button>
      <button class="chip-tipo ativo" data-v="Fit" onclick="escolherTipo(this)"><span>💪</span>Fit</button>
      <button class="chip-tipo" data-v="Tradicional" onclick="escolherTipo(this)"><span>⭐</span>Tradicional</button>
    </div>`));

  /* combinar com gelato */
  const blocoG=document.createElement('div'); blocoG.className='bloco';
  const tG=document.createElement('div'); tG.className='bloco-titulo'; tG.textContent='Combinar com Gelato?';
  blocoG.appendChild(tG);

  const pergDiv=document.createElement('div'); pergDiv.className='pergunta-row';
  ['Sim, quero Gelato','Não, obrigado'].forEach((txt,i)=>{
    const b=document.createElement('button');
    b.className='chip-perg'+(i===1?' ativo':''); b.dataset.v=i===0?'sim':'nao';
    b.textContent=txt;
    b.addEventListener('click',()=>{
      S.comGelatoExtra=b.dataset.v==='sim';
      pergDiv.querySelectorAll('.chip-perg').forEach(x=>x.classList.toggle('ativo',x===b));
      renderSaborGelatoAcai(corpo, S.comGelatoExtra);
      atualizarBarra();
    });
    pergDiv.appendChild(b);
  });
  blocoG.appendChild(pergDiv);
  corpo.appendChild(blocoG);

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
  const blocoC=document.createElement('div'); blocoC.className='bloco';
  const tC=document.createElement('div'); tC.className='bloco-titulo'; tC.innerHTML='Creme <span class="obrig">(escolha 1)</span>';
  blocoC.appendChild(tC); blocoC.appendChild(cremesDiv); corpo.appendChild(blocoC);

  /* mix */
  if(ilimitado){
    const blocoMix=document.createElement('div'); blocoMix.className='bloco';
    const tM=document.createElement('div'); tM.className='bloco-titulo'; tM.textContent='Complementos';
    const aviso=document.createElement('div'); aviso.className='aviso-vontade';
    aviso.textContent='🎉 À vontade! Informe nas observações';
    blocoMix.appendChild(tM); blocoMix.appendChild(aviso); corpo.appendChild(blocoMix);
  } else {
    corpo.appendChild(criarBlocoMix('mixWrap', limite));
  }

  corpo.appendChild(criarBlocoObs());
  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

/* selector de sabor de gelato dentro do modal açaí */
function renderSaborGelatoAcai(corpo, mostrar){
  const existing=document.getElementById('blocoSaborGelatoAcai');
  if(existing) existing.remove();
  S.gelatoExtraNome=''; S.gelatoExtraEmoji='';
  if(!mostrar) return;

  const bloco=document.createElement('div'); bloco.className='bloco'; bloco.id='blocoSaborGelatoAcai';
  const t=document.createElement('div'); t.className='bloco-titulo'; t.innerHTML='Sabor do Gelato <span class="obrig">(escolha 1)</span>';
  bloco.appendChild(t);

  const grid=document.createElement('div'); grid.className='chips-sabores-grid';
  GELATO_SABORES.forEach(gl=>{
    const b=document.createElement('button'); b.className='chip-sabor-gelato'; b.dataset.v=gl.n;
    b.innerHTML=`<em>${gl.e}</em><span>${gl.n}</span>`;
    b.addEventListener('click',()=>{
      S.gelatoExtraNome=S.gelatoExtraNome===gl.n?'':(S.gelatoExtraNome=gl.n, gl.n);
      S.gelatoExtraEmoji=gl.e;
      grid.querySelectorAll('.chip-sabor-gelato').forEach(x=>x.classList.toggle('ativo',x===b&&S.gelatoExtraNome));
      if(!S.gelatoExtraNome) S.gelatoExtraEmoji='';
      atualizarBarra();
    });
    grid.appendChild(b);
  });
  bloco.appendChild(grid);

  // insert before creme bloco
  const cremesBloco=document.getElementById('cremesWrap')?.closest('.bloco');
  if(cremesBloco) corpo.insertBefore(bloco, cremesBloco);
  else corpo.appendChild(bloco);
}

/* ── MODAL GELATO (abre por tamanho) ── */
function abrirModalGelato(gt){
  S = { categoria:'gelato', tam:gt.tam, preco:gt.preco, limite:gt.limite,
        tipo:'', creme:'', mix:[], gelatoNome:'', gelatoTam:gt.tam, cobertura:'',
        comGelatoExtra:false, gelatoExtraNome:'', gelatoExtraEmoji:'' };

  document.getElementById('mIcon').textContent='🍨';
  document.getElementById('mTitulo').textContent='Gelato '+gt.label+' '+gt.tam;
  document.getElementById('mSub').textContent='R$ '+gt.preco+(gt.limite>=99?' · mix à vontade':' · '+gt.limite+' complementos');
  document.getElementById('mTotal').textContent='R$ '+gt.preco;

  const corpo=document.getElementById('modalCorpo');
  corpo.innerHTML='';

  /* sabor */
  const blocoS=document.createElement('div'); blocoS.className='bloco';
  const tS=document.createElement('div'); tS.className='bloco-titulo'; tS.innerHTML='Sabor <span class="obrig">(escolha 1)</span>';
  blocoS.appendChild(tS);
  const gridS=document.createElement('div'); gridS.className='chips-sabores-grid';
  GELATO_SABORES.forEach(gl=>{
    const b=document.createElement('button'); b.className='chip-sabor-gelato'; b.dataset.v=gl.n;
    b.innerHTML=`<em>${gl.e}</em><span>${gl.n}</span>`;
    b.addEventListener('click',()=>{
      S.gelatoNome=S.gelatoNome===gl.n?'':gl.n;
      gridS.querySelectorAll('.chip-sabor-gelato').forEach(x=>x.classList.toggle('ativo',x===b&&S.gelatoNome));
      if(!S.gelatoNome) S.gelatoNome='';
      atualizarBarra();
    });
    gridS.appendChild(b);
  });
  blocoS.appendChild(gridS);
  corpo.appendChild(blocoS);

  /* cobertura */
  const cobDiv=document.createElement('div'); cobDiv.className='chips-wrap'; cobDiv.id='coberturaWrap';
  GELATO_COBERTURAS.forEach(c=>{
    const b=document.createElement('button'); b.className='chip-creme'; b.textContent=c.e+' '+c.n; b.dataset.v=c.n;
    b.addEventListener('click',()=>{
      S.cobertura=S.cobertura===c.n?'':c.n;
      cobDiv.querySelectorAll('.chip-creme').forEach(x=>x.classList.toggle('ativo',x.dataset.v===S.cobertura));
      atualizarBarra();
    });
    cobDiv.appendChild(b);
  });
  const blocoC=document.createElement('div'); blocoC.className='bloco';
  const tC=document.createElement('div'); tC.className='bloco-titulo'; tC.innerHTML='Cobertura <span class="obrig">(escolha 1)</span>';
  blocoC.appendChild(tC); blocoC.appendChild(cobDiv); corpo.appendChild(blocoC);

  /* mix */
  if(gt.limite>=99){
    const blocoMix=document.createElement('div'); blocoMix.className='bloco';
    const tM=document.createElement('div'); tM.className='bloco-titulo'; tM.textContent='Complementos';
    const aviso=document.createElement('div'); aviso.className='aviso-vontade';
    aviso.textContent='🎉 À vontade! Informe nas observações';
    blocoMix.appendChild(tM); blocoMix.appendChild(aviso); corpo.appendChild(blocoMix);
  } else {
    corpo.appendChild(criarBlocoMix('mixWrapG', gt.limite));
  }

  corpo.appendChild(criarBlocoObs());
  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

/* ── helpers ── */
function criarBloco(titulo, obrig, innerHtml){
  const b=document.createElement('div'); b.className='bloco';
  const t=document.createElement('div'); t.className='bloco-titulo';
  t.innerHTML=titulo+(obrig?` <span class="obrig">${obrig}</span>`:'');
  b.appendChild(t); b.insertAdjacentHTML('beforeend',innerHtml);
  return b;
}

function criarBlocoMix(wrapId, limite){
  const mixDiv=document.createElement('div'); mixDiv.className='chips-mix'; mixDiv.id=wrapId;
  const ct=document.createElement('span'); ct.className='contagem'; ct.id='contagem'; ct.textContent='0 / '+limite;
  const tM=document.createElement('div'); tM.className='bloco-titulo';
  tM.innerHTML='Complementos'; tM.appendChild(ct);
  MIX.forEach(m=>{
    const b=document.createElement('button'); b.className='chip-mix';
    b.innerHTML='<em>'+m.e+'</em>'+m.n; b.dataset.v=m.n;
    b.addEventListener('click',()=>{
      if(b.classList.contains('ativo')){ S.mix=S.mix.filter(x=>x!==m.n); b.classList.remove('ativo'); }
      else {
        if(S.mix.length>=limite){ toast('Limite de '+limite+' complementos'); return; }
        S.mix.push(m.n); b.classList.add('ativo');
      }
      ct.textContent=S.mix.length+' / '+limite;
      ct.classList.toggle('cheio',S.mix.length>=limite);
      mixDiv.querySelectorAll('.chip-mix:not(.ativo)').forEach(x=>{
        const off=S.mix.length>=limite; x.disabled=off; x.toggleAttribute('disabled',off);
      });
      atualizarBarra();
    });
    mixDiv.appendChild(b);
  });
  const blocoM=document.createElement('div'); blocoM.className='bloco';
  blocoM.appendChild(tM); blocoM.appendChild(mixDiv);
  return blocoM;
}

function criarBlocoObs(){
  const b=document.createElement('div'); b.className='bloco'; b.id='blocoObs';
  const t=document.createElement('div'); t.className='bloco-titulo';
  t.innerHTML='Observações <span class="obrig">(opcional)</span>';
  const ta=document.createElement('textarea'); ta.id='obsInput'; ta.placeholder='Ex: sem granola, bem gelado...';
  b.appendChild(t); b.appendChild(ta); return b;
}

function escolherTipo(btn){
  S.tipo=btn.dataset.v;
  document.querySelectorAll('.chip-tipo').forEach(b=>b.classList.toggle('ativo',b===btn));
  atualizarBarra();
}

function atualizarBarra(){
  let itens;
  if(S.categoria==='gelato'){
    const ilimitado=S.limite>=99;
    itens=[!!S.gelatoNome, !!S.cobertura, ilimitado||S.mix.length>0, true];
  } else {
    const ilimitado=S.limite>=99;
    const gelatoOk=!S.comGelatoExtra || !!S.gelatoExtraNome;
    itens=[!!S.tipo, gelatoOk, !!S.creme, ilimitado||S.mix.length>0];
  }
  const n=itens.filter(Boolean).length;
  document.getElementById('mBarra').style.width=(n/4*100)+'%';
}

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
    if(!S.gelatoNome){ toast('Escolha o sabor do gelato'); return; }
    if(!S.cobertura){ toast('Escolha uma cobertura'); return; }
    if(!S.mix.length && S.limite<99){ toast('Adicione pelo menos 1 complemento'); return; }
    const ilimitado=S.limite>=99;
    addToCart({
      tipo:'gelato',
      nome:`Gelato ${S.gelatoNome} ${S.gelatoTam}`,
      detalhe:`Cobertura: ${S.cobertura} · ${ilimitado?'Mix à vontade':S.mix.join(', ')}${obs?' · '+obs:''}`,
      preco: S.preco
    });
  } else {
    if(S.comGelatoExtra && !S.gelatoExtraNome){ toast('Escolha o sabor do gelato'); return; }
    if(!S.creme){ toast('Escolha um creme'); return; }
    const ilimitado=S.limite>=99;
    if(!ilimitado&&!S.mix.length){ toast('Adicione pelo menos 1 complemento'); return; }
    const gelatoSufixo=S.comGelatoExtra && S.gelatoExtraNome ? ` + Gelato ${S.gelatoExtraNome}` : '';
    addToCart({
      tipo:'acai',
      nome:`Açaí ${S.tipo} ${S.tam}${gelatoSufixo}`,
      detalhe:`Creme: ${S.creme} · ${ilimitado?'Complementos à vontade':S.mix.join(', ')}${obs?' · '+obs:''}`,
      preco: S.preco
    });
  }
  fecharModal(null,true);
  toast('Item adicionado ao carrinho! 🛒');
}

/* ── FINALIZAR ── */
function finalizarPedido(){
  if(cart.length===0){ toast('Adicione itens ao carrinho primeiro'); return; }
  fecharCarrinho();
  abrirCheckout();
}

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
    </div>`).join('')+`<div class="checkout-total-row"><strong>Total</strong><strong>R$ ${total},00</strong></div>`;
}

function enviarPedidoWhatsApp(){
  const nome=document.getElementById('inputNome')?.value.trim();
  const tel=document.getElementById('inputTel')?.value.trim();
  const rua=document.getElementById('inputRua')?.value.trim();
  const numero=document.getElementById('inputNumero')?.value.trim();
  const bairro=document.getElementById('inputBairro')?.value.trim();
  const pag=document.querySelector('input[name="pagamento"]:checked')?.value;

  if(!nome){ toast('Informe seu nome'); return; }
  if(!tel){ toast('Informe seu número'); return; }
  if(!rua){ toast('Informe a rua'); return; }
  if(!numero){ toast('Informe o número'); return; }
  if(!bairro){ toast('Informe o bairro'); return; }
  if(!pag){ toast('Escolha a forma de pagamento'); return; }

  const endCompleto=`${rua}, ${numero} — ${bairro}`;
  const total=cart.reduce((s,i)=>s+i.preco,0);
  const itensTexto=cart.map(i=>'• '+i.nome+'\n  '+i.detalhe+'\n  R$ '+i.preco+',00').join('\n\n');

  const linhas=[
    '🍇 *Olá! Novo pedido:*','',
    itensTexto,'',
    '*Total:* R$ '+total+',00','',
    '*Nome:* '+nome,
    '*Telefone:* '+tel,
    '*Endereço:* '+endCompleto,
    '*Pagamento:* '+pag,'',
    '📲 Aguardo confirmação!'
  ];

  cart=[]; updateCartUI(); fecharCheckout();
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
