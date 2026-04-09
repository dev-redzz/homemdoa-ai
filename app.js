/* Homem do Açaí – app.js */

const CREMES = [
  {n:'Calda de Ninho',e:'🥛'},{n:'Cupuaçu',e:'🌿'},{n:'Maracujá',e:'🟡'},
  {n:'Morango',e:'🍓'},{n:'Tapioca',e:'⚪'},{n:'Ovomaltine',e:'🍫'},
  {n:'Paçoquita',e:'🥜'},{n:'Energético',e:'⚡'},
];

const CALDAS = [
  {n:'Calda Morango',e:'🍓'},{n:'Leite Condensado',e:'🥛'},
  {n:'Mel',e:'🍯'},{n:'Calda Chocolate',e:'🍫'},
  {n:'Calda Caramelo',e:'🍮'},{n:'Calda de Ninho',e:'🥛'},
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
  {tam:'1kg',   preco:49.90, label:'Mega',    limite:99},
];

/* ── ESTADO ── */
let S = {
  categoria:'', tam:'', preco:0, limite:0, tipo:'Fit',
  creme:'', mix:[], gelatoNome:'', gelatoTam:'', cobertura:'',
  comGelatoExtra:false, gelatoExtraNome:'', gelatoExtraEmoji:'',
  gramAcai:500, gramCreme:300, gramCalda:200,
  usaAcai:false, usaCreme:false, usaCalda:false,
  caldaSelecionada:'', cremeSelecionado:''
};

/* ── CARRINHO ── */
let cart = [];

function addToCart(item){ cart.push(item); updateCartUI(); }
function removeFromCart(idx){ cart.splice(idx,1); updateCartUI(); }

function fmtPreco(v){ return 'R$ '+v.toFixed(2).replace('.',','); }

function updateCartUI(){
  const count = cart.length;
  const total = cart.reduce((s,i)=>s+i.preco,0);
  document.querySelectorAll('.cart-badge').forEach(b=>{
    b.textContent=count; b.style.display=count>0?'flex':'none';
  });
  const el=document.getElementById('cartTotal');
  if(el) el.textContent=fmtPreco(total);
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
        <span class="ci-preco">${fmtPreco(item.preco)}</span>
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

/* ── GELATO TAB ── */
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
        comGelatoExtra:false, gelatoExtraNome:'', gelatoExtraEmoji:'',
        gramAcai:500, gramCreme:300, gramCalda:200,
        usaAcai:false, usaCreme:false, usaCalda:false,
        caldaSelecionada:'', cremeSelecionado:'' };

  const icons={'300ml':'🥤','500ml':'🍇','750ml':'🍨','1kg':'👑'};
  document.getElementById('mIcon').textContent=icons[tam]||'🍇';
  document.getElementById('mTitulo').textContent='Açaí '+tam;
  const ilimitado=limite>=99;
  document.getElementById('mSub').textContent=tam+' · R$ '+preco+(ilimitado?' · Monte por gramas':' · '+limite+' complementos');
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

  if(ilimitado){
    /* ══════════ 1KG: SLIDERS POR GRAMAS ══════════ */
    corpo.appendChild(criarBlocoSliderAcai());
    corpo.appendChild(criarBlocoSliderCreme());
    corpo.appendChild(criarBlocoSliderCalda());
    corpo.appendChild(criarBarraTotal1kg());
    corpo.appendChild(criarBlocoMixIlimitado('mixWrap'));
  } else {
    /* creme (não-1kg) */
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
    corpo.appendChild(criarBlocoMix('mixWrap', limite));
  }

  corpo.appendChild(criarBlocoObs(ilimitado));
  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

/* ══════════ 1KG TOGGLE + SLIDER BUILDERS ══════════ */

function criarBlocoSliderAcai(){
  const bloco=document.createElement('div'); bloco.className='bloco bloco-slider'; bloco.id='blocoSliderAcai';
  bloco.innerHTML=`
    <div class="bloco-titulo">🍇 Açaí</div>
    <button class="toggle-item-btn" id="btnToggleAcai">
      <span class="toggle-icon">+</span>
      <span>Quero açaí</span>
    </button>
    <div class="slider-reveal" id="revealAcai" style="display:none">
      <div class="slider-card">
        <div class="slider-display">
          <span class="slider-value" id="valAcai">${S.gramAcai}</span>
          <span class="slider-unit">g</span>
        </div>
        <input type="range" class="gram-slider slider-acai" id="sliderAcai"
          min="100" max="1000" step="50" value="${S.gramAcai}"/>
        <div class="slider-limits"><span>100g</span><span>1000g</span></div>
      </div>
    </div>`;
  const btn=bloco.querySelector('#btnToggleAcai');
  const reveal=bloco.querySelector('#revealAcai');
  btn.addEventListener('click',()=>{
    S.usaAcai=!S.usaAcai;
    btn.classList.toggle('ativo',S.usaAcai);
    btn.querySelector('.toggle-icon').textContent=S.usaAcai?'✓':'+';
    reveal.style.display=S.usaAcai?'block':'none';
    if(S.usaAcai){ const sl=bloco.querySelector('#sliderAcai'); setTimeout(()=>atualizarSliderTrack(sl),10); }
    atualizarBarraTotal1kg(); atualizarBarra();
  });
  const sl=bloco.querySelector('#sliderAcai');
  const vl=bloco.querySelector('#valAcai');
  sl.addEventListener('input',()=>{ S.gramAcai=+sl.value; vl.textContent=S.gramAcai; atualizarSliderTrack(sl); atualizarBarraTotal1kg(); });
  return bloco;
}

function criarBlocoSliderCreme(){
  const bloco=document.createElement('div'); bloco.className='bloco bloco-slider'; bloco.id='blocoSliderCreme';
  bloco.innerHTML=`
    <div class="bloco-titulo">🥛 Creme</div>
    <button class="toggle-item-btn" id="btnToggleCreme">
      <span class="toggle-icon">+</span>
      <span>Quero creme</span>
    </button>
    <div class="slider-reveal" id="revealCreme" style="display:none">
      <div class="chips-wrap" id="cremesWrap1kg"></div>
      <div class="slider-card">
        <div class="slider-display">
          <span class="slider-value" id="valCreme">${S.gramCreme}</span>
          <span class="slider-unit">g</span>
        </div>
        <input type="range" class="gram-slider slider-creme" id="sliderCreme"
          min="100" max="1000" step="50" value="${S.gramCreme}"/>
        <div class="slider-limits"><span>100g</span><span>1000g</span></div>
      </div>
    </div>`;
  const btn=bloco.querySelector('#btnToggleCreme');
  const reveal=bloco.querySelector('#revealCreme');
  btn.addEventListener('click',()=>{
    S.usaCreme=!S.usaCreme;
    btn.classList.toggle('ativo',S.usaCreme);
    btn.querySelector('.toggle-icon').textContent=S.usaCreme?'✓':'+';
    reveal.style.display=S.usaCreme?'block':'none';
    if(!S.usaCreme){ S.cremeSelecionado=''; S.creme=''; }
    if(S.usaCreme){ const sl=bloco.querySelector('#sliderCreme'); setTimeout(()=>atualizarSliderTrack(sl),10); }
    atualizarBarraTotal1kg(); atualizarBarra();
  });
  const wrap=bloco.querySelector('#cremesWrap1kg');
  CREMES.forEach(c=>{
    const b=document.createElement('button'); b.className='chip-creme'; b.textContent=c.e+' '+c.n; b.dataset.v=c.n;
    b.addEventListener('click',()=>{
      S.cremeSelecionado=S.cremeSelecionado===c.n?'':c.n;
      S.creme=S.cremeSelecionado;
      wrap.querySelectorAll('.chip-creme').forEach(x=>x.classList.toggle('ativo',x.dataset.v===S.cremeSelecionado));
      atualizarBarra();
    });
    wrap.appendChild(b);
  });
  const sl=bloco.querySelector('#sliderCreme');
  const vl=bloco.querySelector('#valCreme');
  sl.addEventListener('input',()=>{ S.gramCreme=+sl.value; vl.textContent=S.gramCreme; atualizarSliderTrack(sl); atualizarBarraTotal1kg(); });
  return bloco;
}

function criarBlocoSliderCalda(){
  const bloco=document.createElement('div'); bloco.className='bloco bloco-slider'; bloco.id='blocoSliderCalda';
  bloco.innerHTML=`
    <div class="bloco-titulo">🍯 Calda</div>
    <button class="toggle-item-btn" id="btnToggleCalda">
      <span class="toggle-icon">+</span>
      <span>Quero calda</span>
    </button>
    <div class="slider-reveal" id="revealCalda" style="display:none">
      <div class="chips-wrap" id="caldasWrap1kg"></div>
      <div class="slider-card">
        <div class="slider-display">
          <span class="slider-value" id="valCalda">${S.gramCalda}</span>
          <span class="slider-unit">g</span>
        </div>
        <input type="range" class="gram-slider slider-calda" id="sliderCalda"
          min="100" max="1000" step="50" value="${S.gramCalda}"/>
        <div class="slider-limits"><span>100g</span><span>1000g</span></div>
      </div>
    </div>`;
  const btn=bloco.querySelector('#btnToggleCalda');
  const reveal=bloco.querySelector('#revealCalda');
  btn.addEventListener('click',()=>{
    S.usaCalda=!S.usaCalda;
    btn.classList.toggle('ativo',S.usaCalda);
    btn.querySelector('.toggle-icon').textContent=S.usaCalda?'✓':'+';
    reveal.style.display=S.usaCalda?'block':'none';
    if(!S.usaCalda){ S.caldaSelecionada=''; }
    if(S.usaCalda){ const sl=bloco.querySelector('#sliderCalda'); setTimeout(()=>atualizarSliderTrack(sl),10); }
    atualizarBarraTotal1kg(); atualizarBarra();
  });
  const wrap=bloco.querySelector('#caldasWrap1kg');
  CALDAS.forEach(c=>{
    const b=document.createElement('button'); b.className='chip-creme'; b.textContent=c.e+' '+c.n; b.dataset.v=c.n;
    b.addEventListener('click',()=>{
      S.caldaSelecionada=S.caldaSelecionada===c.n?'':c.n;
      wrap.querySelectorAll('.chip-creme').forEach(x=>x.classList.toggle('ativo',x.dataset.v===S.caldaSelecionada));
      atualizarBarra();
    });
    wrap.appendChild(b);
  });
  const sl=bloco.querySelector('#sliderCalda');
  const vl=bloco.querySelector('#valCalda');
  sl.addEventListener('input',()=>{ S.gramCalda=+sl.value; vl.textContent=S.gramCalda; atualizarSliderTrack(sl); atualizarBarraTotal1kg(); });
  return bloco;
}

function criarBarraTotal1kg(){
  const bloco=document.createElement('div'); bloco.className='bloco'; bloco.id='blocoTotal1kg';
  bloco.innerHTML=`
    <div class="total-gram-card" id="totalGramCard">
      <div class="total-gram-header">
        <span class="total-gram-label">Total na Composição</span>
        <span class="total-gram-value" id="totalGramValue">1000g</span>
      </div>
      <div class="total-gram-bar-bg">
        <div class="total-gram-bar-fill total-gram-bar-acai" id="barAcai"></div>
        <div class="total-gram-bar-fill total-gram-bar-creme" id="barCreme"></div>
        <div class="total-gram-bar-fill total-gram-bar-calda" id="barCalda"></div>
      </div>
      <div class="total-gram-legend">
        <span class="legend-item"><span class="legend-dot dot-acai"></span>Açaí</span>
        <span class="legend-item"><span class="legend-dot dot-creme"></span>Creme</span>
        <span class="legend-item"><span class="legend-dot dot-calda"></span>Calda</span>
      </div>
      <div class="total-gram-status" id="totalGramStatus"></div>
    </div>`;
  setTimeout(()=>atualizarBarraTotal1kg(),20);
  return bloco;
}

function atualizarBarraTotal1kg(){
  const acaiG=S.usaAcai?S.gramAcai:0;
  const cremeG=S.usaCreme?S.gramCreme:0;
  const caldaG=S.usaCalda?S.gramCalda:0;
  const total=acaiG+cremeG+caldaG;
  const valEl=document.getElementById('totalGramValue');
  const statusEl=document.getElementById('totalGramStatus');
  const barA=document.getElementById('barAcai');
  const barCr=document.getElementById('barCreme');
  const barCa=document.getElementById('barCalda');
  const card=document.getElementById('totalGramCard');
  if(!valEl) return;

  valEl.textContent=total+'g';
  const maxVis=Math.max(total,1000);
  barA.style.width=(acaiG/maxVis*100)+'%';
  barCr.style.width=(cremeG/maxVis*100)+'%';
  barCa.style.width=(caldaG/maxVis*100)+'%';

  card.classList.remove('total-over','total-under','total-ok');
  if(total===0){
    statusEl.textContent='👆 Selecione os itens acima';
    card.classList.add('total-under');
  } else if(total===1000){
    statusEl.textContent='✅ Perfeito! Exatamente 1kg';
    card.classList.add('total-ok');
  } else if(total>1000){
    statusEl.textContent='⚠️ Acima de 1kg ('+total+'g)';
    card.classList.add('total-over');
  } else {
    statusEl.textContent='ℹ️ Faltam '+(1000-total)+'g para 1kg';
    card.classList.add('total-under');
  }
}

function atualizarSliderTrack(slider){
  const min=+slider.min, max=+slider.max, val=+slider.value;
  const pct=((val-min)/(max-min))*100;
  slider.style.setProperty('--pct', pct+'%');
}

/* ── GELATO DENTRO DO AÇAÍ ── */
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
  const ref=document.getElementById('cremesWrap')?.closest('.bloco') || document.querySelector('.bloco-slider');
  if(ref) corpo.insertBefore(bloco, ref);
  else corpo.appendChild(bloco);
}

/* ── MODAL GELATO ── */
function abrirModalGelato(gt){
  S = { categoria:'gelato', tam:gt.tam, preco:gt.preco, limite:gt.limite,
        tipo:'', creme:'', mix:[], gelatoNome:'', gelatoTam:gt.tam, cobertura:'',
        comGelatoExtra:false, gelatoExtraNome:'', gelatoExtraEmoji:'',
        gramAcai:500, gramCreme:300, gramCalda:200,
        usaAcai:false, usaCreme:false, usaCalda:false,
        caldaSelecionada:'', cremeSelecionado:'' };

  document.getElementById('mIcon').textContent='🍨';
  document.getElementById('mTitulo').textContent='Gelato '+gt.label+' '+gt.tam;
  document.getElementById('mSub').textContent='R$ '+gt.preco+(gt.limite>=99?' · mix à vontade':' · '+gt.limite+' complementos');
  document.getElementById('mTotal').textContent='R$ '+gt.preco;

  const corpo=document.getElementById('modalCorpo');
  corpo.innerHTML='';

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

  if(gt.limite>=99) corpo.appendChild(criarBlocoMixIlimitado('mixWrapG'));
  else corpo.appendChild(criarBlocoMix('mixWrapG', gt.limite));

  corpo.appendChild(criarBlocoObs(gt.limite>=99));
  document.getElementById('mBarra').style.width='0%';
  document.getElementById('modalBg').classList.add('aberto');
  document.body.style.overflow='hidden';
}

/* ── HELPERS ── */
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

function criarBlocoMixIlimitado(wrapId){
  const mixDiv=document.createElement('div'); mixDiv.className='chips-mix'; mixDiv.id=wrapId;
  const badge=document.createElement('span'); badge.className='contagem'; badge.id='contagem'; badge.textContent='🎉 À vontade';
  const tM=document.createElement('div'); tM.className='bloco-titulo';
  tM.innerHTML='Mix <span class="obrig">(à vontade)</span>'; tM.appendChild(badge);
  MIX.forEach(m=>{
    const b=document.createElement('button'); b.className='chip-mix';
    b.innerHTML='<em>'+m.e+'</em>'+m.n; b.dataset.v=m.n;
    b.addEventListener('click',()=>{
      if(b.classList.contains('ativo')){ S.mix=S.mix.filter(x=>x!==m.n); b.classList.remove('ativo'); }
      else { S.mix.push(m.n); b.classList.add('ativo'); }
      badge.textContent=S.mix.length>0?'🎉 '+S.mix.length+' selecionado(s)':'🎉 À vontade';
      atualizarBarra();
    });
    mixDiv.appendChild(b);
  });
  const blocoM=document.createElement('div'); blocoM.className='bloco';
  blocoM.appendChild(tM); blocoM.appendChild(mixDiv);
  return blocoM;
}

function criarBlocoObs(ilimitado){
  const b=document.createElement('div'); b.className='bloco'; b.id='blocoObs';
  const t=document.createElement('div'); t.className='bloco-titulo';
  t.innerHTML='Observações <span class="obrig">(opcional)</span>';
  b.appendChild(t);
  const ta=document.createElement('textarea'); ta.id='obsInput';
  ta.placeholder=ilimitado
    ? 'Ex: bem gelado, capricha no açaí, extra granola...'
    : 'Ex: sem granola, bem gelado, pouco creme...';
  b.appendChild(ta); return b;
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
    if(ilimitado){
      const gelatoOk=!S.comGelatoExtra || !!S.gelatoExtraNome;
      itens=[!!S.tipo, gelatoOk, !!S.cremeSelecionado, true];
    } else {
      const gelatoOk=!S.comGelatoExtra || !!S.gelatoExtraNome;
      itens=[!!S.tipo, gelatoOk, !!S.creme, S.mix.length>0];
    }
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
    const ilimitado=S.limite>=99;

    if(ilimitado){
      if(!S.usaAcai && !S.usaCreme && !S.usaCalda){ toast('Selecione pelo menos açaí, creme ou calda'); return; }
      if(S.usaCreme && !S.cremeSelecionado){ toast('Escolha o sabor do creme'); return; }
      const gelatoSufixo=S.comGelatoExtra && S.gelatoExtraNome ? ` + Gelato ${S.gelatoExtraNome}` : '';
      const partes=[];
      if(S.usaAcai) partes.push(`Açaí: ${S.gramAcai}g`);
      if(S.usaCreme) partes.push(`Creme: ${S.cremeSelecionado} (${S.gramCreme}g)`);
      if(S.usaCalda && S.caldaSelecionada) partes.push(`Calda: ${S.caldaSelecionada} (${S.gramCalda}g)`);
      else if(S.usaCalda) partes.push(`Calda: ${S.gramCalda}g`);
      if(S.mix.length>0) partes.push(`Mix: ${S.mix.join(', ')}`);
      addToCart({
        tipo:'acai',
        nome:`Açaí ${S.tipo} 1kg${gelatoSufixo}`,
        detalhe: partes.join(' · ')+(obs?' · '+obs:''),
        preco: S.preco
      });
    } else {
      if(!S.creme){ toast('Escolha um creme'); return; }
      if(!S.mix.length){ toast('Adicione pelo menos 1 complemento'); return; }
      const gelatoSufixo=S.comGelatoExtra && S.gelatoExtraNome ? ` + Gelato ${S.gelatoExtraNome}` : '';
      addToCart({
        tipo:'acai',
        nome:`Açaí ${S.tipo} ${S.tam}${gelatoSufixo}`,
        detalhe:`Creme: ${S.creme} · ${S.mix.join(', ')}${obs?' · '+obs:''}`,
        preco: S.preco
      });
    }
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
      <span>${fmtPreco(i.preco)}</span>
    </div>`).join('')+`<div class="checkout-total-row"><strong>Total</strong><strong>${fmtPreco(total)}</strong></div>`;
}

function enviarPedidoWhatsApp(){
  const nome=document.getElementById('inputNome')?.value.trim();
  const tel=document.getElementById('inputTel')?.value.trim();
  const rua=document.getElementById('inputRua')?.value.trim();
  const numero=document.getElementById('inputNumero')?.value.trim();
  const bairro=document.getElementById('inputBairro')?.value.trim();
  const pag=document.querySelector('input[name="pagamento"]:checked')?.value;
  const troco=document.getElementById('inputTroco')?.value.trim();

  if(!nome){ toast('Informe seu nome'); return; }
  if(!tel){ toast('Informe seu número'); return; }
  if(!rua){ toast('Informe a rua'); return; }
  if(!numero){ toast('Informe o número'); return; }
  if(!bairro){ toast('Informe o bairro'); return; }
  if(!pag){ toast('Escolha a forma de pagamento'); return; }

  const endCompleto=`${rua}, ${numero} — ${bairro}`;
  const total=cart.reduce((s,i)=>s+i.preco,0);
  const itensTexto=cart.map(i=>'• '+i.nome+'\n  '+i.detalhe+'\n  '+fmtPreco(i.preco)).join('\n\n');

  const pagLine = pag==='Dinheiro' && troco
    ? `*Pagamento:* Dinheiro — troco para ${troco}`
    : pag==='Dinheiro'
      ? '*Pagamento:* Dinheiro — sem troco'
      : `*Pagamento:* ${pag}`;

  const linhas=[
    '🍇 *Olá! Novo pedido:*','',
    itensTexto,'',
    '*Total:* '+fmtPreco(total),'',
    '*Nome:* '+nome,
    '*Telefone:* '+tel,
    '*Endereço:* '+endCompleto,
    pagLine,'',
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

/* ── TROCO ── */
document.addEventListener('change', e=>{
  if(e.target.name==='pagamento'){
    const trocoWrap=document.getElementById('trocoWrap');
    if(trocoWrap) trocoWrap.style.display = e.target.value==='Dinheiro' ? 'block' : 'none';
    if(e.target.value!=='Dinheiro'){
      const inp=document.getElementById('inputTroco');
      if(inp) inp.value='';
    }
  }
});

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
