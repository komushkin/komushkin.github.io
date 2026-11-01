const locations=[{name:'Сахара кусочек 2.0',address:'ул. 1 Мая, 105',phone:'+7 (977) 644-33-88',tel:'+79776443388',open:450,hours:'07:30–22:00',id:'96607488317',slug:'sakhara_kusochek_2_0',count:251},{name:'Сахара Кусочек',address:'ул. Кирова, вл56',phone:'+7 (977) 994-31-20',tel:'+79779943120',open:480,hours:'08:00–22:00',id:'118070647353',slug:'sakhara_kusochek',count:169}];
const items=[
['Эспрессо двойной','coffee','Крепкий кофе, приготовленный под давлением. Двойная порция.','#714631','#e6d8c7','espresso',[['Двойной',200]],945],
['Американо','coffee','Эспрессо с горячей водой.','#583729','#ddd3c5','mug',[['200 мл',200],['300 мл',200]],945],
['Флэт уайт','coffee','Двойной эспрессо и молоко с тонкой микропеной.','#c99f75','#ead7bd','mug',[['200 мл',250]],945],
['Капучино','coffee','Эспрессо и молоко с нежной пеной.','#cda77c','#e8d6bd','mug',[['200 мл',240],['300 мл',260],['400 мл',290]],945],
['Латте','coffee','Эспрессо и молоко с тонким слоем пены.','#d2b08b','#eadfcf','mug',[['200 мл',240],['300 мл',260],['400 мл',290]],945],
['Раф «халва»','coffee','Кофейный напиток с халвой.','#c8a378','#e4c9ac','mug',[['300 мл',300],['400 мл',320]],945],
['Тыквенный капучино','coffee','С белым шоколадом. Тыквенное настроение из осеннего предложения.','#cc9b59','#f0dbbd','mug',[['300 мл',320],['400 мл',340]],1033,'ОСЕННЕЕ МЕНЮ'],
['Айс латте','cold','Холодный латте: эспрессо, молоко и лёд.','#c8a57e','#e8dbcc','cold',[['400 мл',290]],945],
['Персиковый айс латте','cold','С тыквенной пеной. Авторский напиток из осеннего меню.','#d49c73','#ecd6c4','cold',[['400 мл',400]],1033,'ОСЕННЕЕ МЕНЮ'],
['Земляничная матча с тыквой','cold','Земляника, матча и тыква. Подаётся со льдом.','#9ca875','#e1dfc7','cold',[['400 мл',360]],1033,'ОСЕННЕЕ МЕНЮ'],
['Тыквенный смузи','cold','Тыква, чёрная смородина и корица.','#aa707f','#e8d3dc','cold',[['400 мл',400]],1033,'ОСЕННЕЕ МЕНЮ'],
['Какао с маршмеллоу','other','Шоколадный напиток с маршмеллоу.','#815036','#e4d3bf','mug',[['200 мл',240],['300 мл',260],['400 мл',290]],946],
['Матча-латте','other','Порошковый зелёный чай и молоко.','#8c9b64','#dce0cb','mug',[['300 мл',300],['400 мл',320]],946],
['Эрл грей','other','Чёрный чай с ароматом бергамота.','#ae7133','#e6ddc4','glass',[['400 мл',190],['1 л',460]],946],
['Ореховый какао','other','Согревающий какао с ореховым вкусом.','#9d7854','#e3d1ba','mug',[['300 мл',270],['400 мл',290]],1033,'ОСЕННЕЕ МЕНЮ'],
['Сырники с розовой сметаной','food','Творожные сырники с розовой сметаной. Кухня на улице 1 Мая.','#cba063','#e8dcc5','food',[['Порция',340]],949],
['Вафля с сёмгой и пашот','food','Соус спайси, сёмга, зелень и яйцо пашот. Кухня на улице 1 Мая.','#b4794b','#dfd9c9','waffle',[['Порция',490]],950],
['Вафля с бананом','food','Кремчиз, банан, карамель и миндальные лепестки. Кухня на улице 1 Мая.','#d4a05c','#e8dac7','waffle',[['Порция',370]],950]
];
const choices=new Map();
const menuQueryState={category:"all",query:"",cold:false,caffeineFree:false};
let menuRenderGeneration=0,menuExitMotion=null;
function illustration(color,type,name){let shape='';if(type==='cake'){shape=`<path d="M64 95h75l-12 52H77z" fill="${color}"/><path d="M58 96q-3-21 21-25-4-19 19-22 25 2 25 21 24 0 22 26z" fill="#f5e7d4"/><circle cx="103" cy="46" r="8" fill="#ac604d"/><path d="M85 104l3 34m15-34v34m16-34-3 34" stroke="#fff7e4" opacity=".4" stroke-width="3"/>`;}else if(type==='roll'){shape=`<ellipse cx="105" cy="140" rx="72" ry="13" fill="#f8f0df"/><path d="M65 68h67q24 28 0 62H65z" fill="${color}"/><ellipse cx="65" cy="99" rx="28" ry="31" fill="#f3dfbf"/><path d="M62 118c-29-15-12-41 5-33s10 29-3 17" fill="none" stroke="${color}" stroke-width="7"/><path d="M80 74h38" stroke="#fff5e2" stroke-width="7"/>`;}else if(type==='food'||type==='waffle'){shape=`<ellipse cx="100" cy="113" rx="78" ry="39" fill="#f5eddf"/><ellipse cx="100" cy="113" rx="63" ry="29" fill="#e6dbc7"/>`;if(type==='food')shape+=`<ellipse cx="72" cy="107" rx="27" ry="16" fill="${color}"/><ellipse cx="115" cy="115" rx="27" ry="16" fill="${color}"/><ellipse cx="93" cy="90" rx="26" ry="16" fill="#e3ba7f"/><circle cx="137" cy="95" r="7" fill="#9a4d48"/><path d="M98 94q-12-15 6-19 18 7 3 19" fill="#fbf4e6"/>`;else shape+=`<path d="m62 79 70 8-7 50-70-8z" fill="${color}"/><path d="m69 84-7 43m20-41-6 43m20-41-6 43m20-41-6 43m20-40-6 43M60 95l68 8m-70 5 68 8m-70 5 68 8" stroke="#dfb77b" stroke-width="3"/><path d="M77 100q17-28 49-8l-16 29z" fill="#d99378"/><path d="m107 87 20-17m-13 20 25-8" stroke="#729068" stroke-width="4"/>`;}else if(type==='cold'||type==='glass'){shape=`<path d="M65 45h76l-11 102H77z" fill="${color}" stroke="#fff8e5" stroke-width="3"/><ellipse cx="103" cy="45" rx="38" ry="8" fill="#fff5e1" opacity=".7"/><path d="m112 75 12-55h23" stroke="#f7edda" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="78" y="67" width="18" height="17" rx="4" fill="#fff" opacity=".33" transform="rotate(-14 78 67)"/><rect x="108" y="92" width="18" height="17" rx="4" fill="#fff" opacity=".25"/>`;}else{const espresso=type==='espresso';shape=`<ellipse cx="100" cy="${espresso?144:149}" rx="68" ry="10" fill="#f1e6d4"/><path d="M135 71h12c24 0 24 41-4 41h-10" fill="none" stroke="#f3e9d8" stroke-width="10"/><path d="M55 ${espresso?82:58}h83v${espresso?30:56}q0 32-41 32t-42-32z" fill="${color}"/><ellipse cx="96.5" cy="${espresso?82:58}" rx="41.5" ry="10" fill="#f4e9d2"/><ellipse cx="96.5" cy="${espresso?82:58}" rx="35" ry="7" fill="${espresso?'#472b20':color}"/>${!espresso?'<path d="M98 62q-24-21-25-7 0 7 25 13 26-11 21-17-7-7-21 11" fill="#f5e5c9"/>':''}<path d="M65 ${espresso?94:76}v30" stroke="#fff6e5" stroke-width="4" opacity=".3" stroke-linecap="round"/>`;}
const hot=!['cold','food','waffle','cake','roll'].includes(type);const vapor=hot?'<g class="cup-vapor" fill="none" stroke="#8d7461" stroke-width="2" stroke-linecap="round"><path d="M78 38c-8-8 8-13 0-22"/><path d="M99 35c-8-8 8-13 0-22"/><path d="M120 38c-8-8 8-13 0-22"/></g>':'';return `<svg viewBox="0 0 200 180" role="img" aria-label="Иллюстрация: ${name}"><g class="vessel">${shape}</g>${vapor}</svg>`;}
function cupScale(index,size){const count=items[index][6].length;return count===1?1:.9+(size/(count-1))*.18;}
function menuCard(index,compact=false){const [name,cat,desc,color,bg,type,sizes,source,tag]=items[index];const choice=choices.get(index)||0;const hot=!['cold','food','waffle','cake','roll'].includes(type);return `<article class="menu-card ${compact?'recommendation-card':''}" data-card-index="${index}" style="--cup-scale:${cupScale(index,choice)}"><div class="drink-art ${hot?'hot-drink':cat==='cold'?'cold-drink':'food-art'}" style="--bg:${bg}"><span class="item-label ${tag?'seasonal-label':''}">${tag?'Сезонное':'САХАРА КУСОЧЕК'}</span>${illustration(color,type,name)}</div><div class="card-body"><h3>${name}</h3><p>${desc}</p><div class="size-choices" role="group" aria-label="Размер: ${name}">${sizes.map(([label,price],i)=>`<button type="button" data-item="${index}" data-size="${i}" aria-pressed="${i===choice}" aria-label="${name}, ${label}, ${price} рублей">${label}</button>`).join('')}</div><div class="card-bottom"><b class="price" aria-live="polite">${sizes[choice][1]} ₽</b><button type="button" class="add-to-order" data-add="${index}" aria-label="Добавить ${name} в мой заказ">+</button></div></div></article>`;}
function animateMenuCards(container){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const carousel=container.id==='menu-grid'&&window.matchMedia('(max-width:760px)').matches;container.querySelectorAll('.menu-card').forEach((card,index)=>card.animate(carousel?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,delay:Math.min(index*25,100),easing:'ease-out',fill:'backwards'}));}
function renderMenu(category=null){
  if(category!==null)menuQueryState.category=category;
  const generation=++menuRenderGeneration,filtered=filterMenuIndices(items,menuQueryState),grid=document.getElementById('menu-grid');
  if(menuExitMotion){menuExitMotion.cancel();menuExitMotion=null;}
  const commit=()=>{
    if(generation!==menuRenderGeneration)return;
    if(menuExitMotion){menuExitMotion.cancel();menuExitMotion=null;}
    grid.innerHTML=filtered.map(index=>menuCard(index)).join('');grid.hidden=filtered.length===0;
    document.getElementById('menu-empty').hidden=filtered.length!==0;
    document.getElementById('menu-count').textContent=`Найдено ${filtered.length} из ${items.length} позиций`;
    grid.scrollLeft=0;animateMenuCards(grid);grid.dispatchEvent(new CustomEvent('menu:updated',{detail:{indices:filtered}}));
  };
  if(grid.children.length&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){menuExitMotion=grid.animate([{opacity:1},{opacity:0}],{duration:90,easing:'ease-out',fill:'forwards'});menuExitMotion.finished.then(commit).catch(()=>{});}else commit();
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderMenu(button.dataset.filter);}));
const mapUrl=l=>`https://yandex.ru/maps/org/${l.slug}/${l.id}/`;
let selected=0;
function isOpen(l,date=new Date()){const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);const minutes=Number(p.find(x=>x.type==='hour').value)*60+Number(p.find(x=>x.type==='minute').value);return minutes>=l.open&&minutes<1320;}
function statusText(l){const date=new Date();const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',hourCycle:'h23'}).format(date));return l.id==='96607488317'&&hour===7?'Уточните открытие':isOpen(l)?'Открыто сейчас':'Закрыто';}
function renderLocations(){document.getElementById('location-list').innerHTML=locations.map((l,i)=>`<article class="location-card ${i===selected?'active':''}"><div class="location-head"><button data-location="${i}" aria-pressed="${i===selected}" aria-label="Показать на карте ${l.name}, ${l.address}">${l.name} <span class="mobile-decoration" aria-hidden="true">↗</span></button><span class="status ${isOpen(l)?'':'closed'}">${statusText(l)}</span></div><p class="address">Павловский Посад, ${l.address}</p><div class="hours-phone"><span>Ежедневно ${l.hours}</span><a href="tel:${l.tel}" aria-label="Позвонить ${l.phone}">${l.phone}</a></div>${i===0?'<p class="schedule-note">Кухня: 08:00–21:00.</p>':''}<div class="location-actions"><a href="https://yandex.ru/maps/?rtext=~${encodeURIComponent('Павловский Посад, '+l.address)}&rtt=auto" target="_blank" rel="noopener">Построить маршрут <span class="mobile-decoration" aria-hidden="true">↗</span></a><a href="${mapUrl(l)}" target="_blank" rel="noopener">Яндекс Карты <span class="mobile-decoration" aria-hidden="true">↗</span></a><a href="tel:${l.tel}">Позвонить</a></div></article>`).join('');document.querySelectorAll('[data-location]').forEach(b=>b.addEventListener('click',()=>selectLocation(Number(b.dataset.location),true)));}
function selectLocation(index,restoreFocus=false){selected=index;renderLocations();const l=locations[index];document.getElementById('map-label').textContent=l.name+' · '+l.address;document.getElementById('map').src=`https://yandex.ru/map-widget/v1/?mode=search&oid=${l.id}&ol=biz&z=16`;document.getElementById('map-fallback').href=mapUrl(l);if(restoreFocus)document.querySelector(`[data-location="${index}"]`).focus({preventScroll:true});}
const burger=document.querySelector('.burger'),nav=document.querySelector('nav');function closeNav(){burger.setAttribute('aria-expanded','false');nav.classList.remove('open');burger.setAttribute('aria-label','Открыть меню');}burger.addEventListener('click',()=>{const open=burger.getAttribute('aria-expanded')!=='true';burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');nav.classList.toggle('open',open);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&burger.getAttribute('aria-expanded')==='true'){closeNav();burger.focus();}});
document.getElementById('year').textContent=new Date().getFullYear();renderMenu();selectLocation(0);setInterval(()=>{document.querySelectorAll('.status').forEach((el,i)=>{const open=isOpen(locations[i]);el.textContent=statusText(locations[i]);el.classList.toggle('closed',!open);});},30000);
const schema={'@context':'https://schema.org','@graph':locations.map(l=>({'@type':'CafeOrCoffeeShop',name:l.name,telephone:l.tel,address:{'@type':'PostalAddress',streetAddress:l.address,addressLocality:'Павловский Посад',addressRegion:'Московская область',addressCountry:'RU'},hasMap:mapUrl(l),sameAs:['https://www.instagram.com/sakhara__kusochek/','https://t.me/saharcoffee'],...(l.id==='96607488317'?{}:{openingHoursSpecification:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],opens:l.open===450?'07:30':'08:00',closes:'22:00'}})}))};const ld=document.createElement('script');ld.type='application/ld+json';ld.textContent=JSON.stringify(schema);document.head.append(ld);

// Replay the short stirring/reveal only after the artwork leaves and re-enters.
const heroArtwork=document.querySelector('.hero-art');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let coffeeWasVisible=false;
let coffeeMotion=[];
function stopCoffeeMotion(){coffeeMotion.forEach(animation=>animation.cancel());coffeeMotion=[];}
function stirCoffee(){
  stopCoffeeMotion();
  if(motionPreference.matches)return;
  const mark=heroArtwork.querySelector('.foam-mark');
  const liquid=heroArtwork.querySelector('.coffee');
  const swirl=heroArtwork.querySelector('.coffee-swirl');
  const transform='translate(-50%, -50%)';
  coffeeMotion=[
    swirl.animate([{offset:0,opacity:0,transform:'translate(-50%, -50%) rotate(-120deg) scale(.7)'},{offset:.2,opacity:.32,transform:'translate(-50%, -50%) rotate(10deg) scale(.9)'},{offset:1,opacity:0,transform:'translate(-50%, -50%) rotate(250deg) scale(1.1)'}],{duration:1250,easing:'ease-out'}),
    mark.animate([
      {offset:0,opacity:0,transform:transform+' rotate(-150deg) scale(.45)',filter:'blur(5px)'},
      {offset:.3,opacity:.12,transform:transform+' rotate(-70deg) scale(.78)',filter:'blur(3px)'},
      {offset:.7,opacity:.85,transform:transform+' rotate(10deg) scale(1.03)',filter:'blur(.5px)'},
      {offset:1,opacity:1,transform:transform+' rotate(18deg) scale(1)',filter:'blur(0px)'}
    ],{duration:1650,easing:'cubic-bezier(.22,.65,.28,1)'}),
    liquid.animate([
      {offset:0,transform:'rotate(-24deg)'},
      {offset:.55,transform:'rotate(6deg)'},
      {offset:1,transform:'rotate(0deg)'}
    ],{duration:1650,easing:'cubic-bezier(.22,.65,.28,1)'})
  ];
}
if(heroArtwork&&'IntersectionObserver' in window){
  const coffeeObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting){coffeeWasVisible=false;stopCoffeeMotion();}
      else if(entry.intersectionRatio>=.4&&!coffeeWasVisible){coffeeWasVisible=true;stirCoffee();}
    }
  },{threshold:[0,.4]});
  coffeeObserver.observe(heroArtwork);
}
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)stopCoffeeMotion();});
