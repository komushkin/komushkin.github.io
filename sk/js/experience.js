/* Local guest conveniences; no requests, checkout, or payment integration. */
const moodPresets={
  bright:{title:'Когда хочется взбодриться',items:[0,1,2]},
  cozy:{title:'Для тёплой, неспешной паузы',items:[3,6,14]},
  sweet:{title:'Маленькая сладкая радость',items:[5,11,8]},
  fresh:{title:'Что-нибудь прохладное',items:[7,9,10]}
};
const menuSection=document.getElementById('menu');
menuSection.addEventListener('click',event=>{
  const mood=event.target.closest('[data-mood]');
  if(mood){
    const preset=moodPresets[mood.dataset.mood];
    document.querySelectorAll('[data-mood]').forEach(button=>button.setAttribute('aria-pressed',String(button===mood)));
    const panel=document.getElementById('mood-selection');panel.hidden=false;
    document.getElementById('mood-title').textContent=preset.title;
    const results=document.getElementById('mood-results');results.innerHTML=preset.items.map(index=>menuCard(index,true)).join('');animateMenuCards(results);
    document.getElementById('mood-status').textContent=preset.title+': '+preset.items.map(index=>items[index][0]).join(', ');
  }
  const sizeButton=event.target.closest('[data-size]');
  if(sizeButton){
    const index=Number(sizeButton.dataset.item),size=Number(sizeButton.dataset.size);choices.set(index,size);
    document.querySelectorAll(`[data-card-index="${index}"]`).forEach(card=>{
      card.querySelectorAll('[data-size]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.size)===size)));
      card.querySelector('.price').textContent=items[index][6][size][1]+' ₽';
      card.style.setProperty('--cup-scale',cupScale(index,size));
    });
  }
  const addButton=event.target.closest('[data-add]');
  if(addButton){
    const index=Number(addButton.dataset.add),size=choices.get(index)||0;addOrderItem(index,size);
    if(!motionPreference.matches)addButton.animate([{transform:'scale(1)'},{transform:'scale(.82)'},{transform:'scale(1)'}],{duration:260});
  }
});
document.getElementById('mood-reset').addEventListener('click',()=>{
  const active=document.querySelector('[data-mood][aria-pressed="true"]');
  document.getElementById('mood-selection').hidden=true;
  document.querySelectorAll('[data-mood]').forEach(button=>button.setAttribute('aria-pressed','false'));
  document.getElementById('mood-status').textContent='Подбор напитков закрыт';
  active?.focus({preventScroll:true});
});

// Заказ живёт только в памяти текущей страницы.
const guestOrder=new Map();
const orderPanel=document.getElementById('order-panel');
const orderToggle=document.querySelector('.order-toggle');
let toastTimer,orderClosing=false;
function orderTotals(){let quantity=0,total=0;guestOrder.forEach(line=>{quantity+=line.qty;total+=items[line.index][6][line.size][1]*line.qty;});return{quantity,total};}
function money(value){return new Intl.NumberFormat('ru-RU').format(value)+' ₽';}

function renderGuestOrder(){
  const{quantity,total}=orderTotals();
  document.getElementById('order-count').textContent=quantity;
  orderToggle.setAttribute('aria-label',`Открыть мой заказ: ${quantity} позиций, ${money(total)}`);
  document.getElementById('order-total').textContent=money(total);
  document.getElementById('order-lines').innerHTML=guestOrder.size?[...guestOrder].map(([key,line])=>{
    const item=items[line.index],[volume,price]=item[6][line.size];
    return `<article class="order-line" data-order-key="${key}"><div class="order-line-top"><h3>${item[0]}</h3><button type="button" class="remove-order-line" data-remove="${key}" aria-label="Убрать ${item[0]}, ${volume}">×</button></div><p>${volume} · ${money(price)}</p><div class="order-line-bottom"><div class="quantity-control"><button type="button" data-quantity="${key}" data-delta="-1" aria-label="Уменьшить количество: ${item[0]}, ${volume}">−</button><span aria-label="Количество">${line.qty}</span><button type="button" data-quantity="${key}" data-delta="1" ${line.qty>=99?'disabled':''} aria-label="Увеличить количество: ${item[0]}, ${volume}">+</button></div><b>${money(price*line.qty)}</b></div></article>`;
  }).join(''):'<div class="order-empty"><span aria-hidden="true">☕</span><p>Какой будет ваша<br><em>кофейная пауза?</em></p><small>Добавляйте напитки и десерты<br>кнопкой «+» в меню.</small></div>';
}
function addOrderItem(index,size){
  const key=`${index}-${size}`,line=guestOrder.get(key);
  if(line&&line.qty>=99)return;
  guestOrder.set(key,{index,size,qty:(line?.qty||0)+1});renderGuestOrder();
  const notice=document.getElementById('order-notice');notice.textContent=`${items[index][0]} · ${items[index][6][size][0]} — в вашем заказе`;
  notice.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>notice.classList.remove('visible'),2500);
}
orderToggle.addEventListener('click',()=>{
  if(orderPanel.open)return;renderGuestOrder();orderPanel.showModal();document.documentElement.classList.add('order-open');
  document.querySelector('header').classList.remove('header-hidden');
  if(!motionPreference.matches)orderPanel.animate([{transform:'translateX(100%)',opacity:.5},{transform:'translateX(0)',opacity:1}],{duration:280,easing:'cubic-bezier(.2,.7,.25,1)'});
});
function closeGuestOrder(){
  if(!orderPanel.open||orderClosing)return;
  if(motionPreference.matches){orderPanel.close();return;}
  orderClosing=true;
  const animation=orderPanel.animate([{transform:'translateX(0)',opacity:1},{transform:'translateX(100%)',opacity:.5}],{duration:200,easing:'ease-in',fill:'forwards'});
  animation.finished.then(()=>{orderPanel.close();animation.cancel();orderClosing=false;});
}
document.querySelector('.order-close').addEventListener('click',closeGuestOrder);
document.getElementById('order-done').addEventListener('click',closeGuestOrder);
orderPanel.addEventListener('cancel',event=>{event.preventDefault();closeGuestOrder();});
orderPanel.addEventListener('close',()=>{document.documentElement.classList.remove('order-open');orderToggle.focus({preventScroll:true});});
orderPanel.addEventListener('click',event=>{
  if(event.target===orderPanel){const bounds=orderPanel.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom){closeGuestOrder();return;}}
  const quantityButton=event.target.closest('[data-quantity]'),removeButton=event.target.closest('[data-remove]');
  if(quantityButton){const key=quantityButton.dataset.quantity,line=guestOrder.get(key);if(!line)return;line.qty+=Number(quantityButton.dataset.delta);if(line.qty<=0)guestOrder.delete(key);else line.qty=Math.min(99,line.qty);renderGuestOrder();const focus=document.querySelector(`[data-quantity="${key}"][data-delta="${quantityButton.dataset.delta}"]`);(focus||document.querySelector('.order-close')).focus({preventScroll:true});}
  if(removeButton){guestOrder.delete(removeButton.dataset.remove);renderGuestOrder();document.querySelector('.order-close').focus({preventScroll:true});}
});
renderGuestOrder();

// Direction-aware mobile header; desktop retains its existing sticky behavior.
const mobileHeaderQuery=window.matchMedia('(max-width: 760px)');
const pageHeader=document.querySelector('header');
let lastHeaderScroll=Math.max(0,window.scrollY),directionStart=lastHeaderScroll,lastDirection=0,headerFrame=false;
function syncHeaderHeight(){document.documentElement.style.setProperty('--mobile-header-height',pageHeader.offsetHeight+'px');if(!mobileHeaderQuery.matches)pageHeader.classList.remove('header-hidden');}
function updateMobileHeader(){
  headerFrame=false;const position=Math.max(0,window.scrollY),change=position-lastHeaderScroll,direction=Math.sign(change);
  if(!mobileHeaderQuery.matches){pageHeader.classList.remove('header-hidden');lastHeaderScroll=position;return;}
  if(direction&&direction!==lastDirection){directionStart=lastHeaderScroll;lastDirection=direction;}
  if(position<=pageHeader.offsetHeight+12||nav.classList.contains('open')||orderPanel.open){pageHeader.classList.remove('header-hidden');directionStart=position;}
  else if(direction>0&&position-directionStart>14)pageHeader.classList.add('header-hidden');
  else if(direction<0&&directionStart-position>8)pageHeader.classList.remove('header-hidden');
  lastHeaderScroll=position;
}
window.addEventListener('scroll',()=>{if(!headerFrame){headerFrame=true;requestAnimationFrame(updateMobileHeader);}},{passive:true});
pageHeader.addEventListener('focusin',()=>pageHeader.classList.remove('header-hidden'));
mobileHeaderQuery.addEventListener('change',()=>{lastHeaderScroll=window.scrollY;lastDirection=0;syncHeaderHeight();});
if('ResizeObserver' in window)new ResizeObserver(syncHeaderHeight).observe(pageHeader);else window.addEventListener('resize',syncHeaderHeight);
syncHeaderHeight();

// Reveal once on entry, keeping content visible when reduced motion is requested.
if(!motionPreference.matches&&'IntersectionObserver' in window){
  document.documentElement.classList.add('motion-ready');
  const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.reveal').forEach(section=>revealObserver.observe(section));
}
