const discoveryInput=document.getElementById('menu-search');
const discoveryClear=document.getElementById('menu-search-clear');
const discoveryGrid=document.getElementById('menu-grid');
const discoverySection=document.getElementById('menu');
const discoveryCounter=document.getElementById('carousel-counter');
function refreshDiscovery(){menuQueryState.query=discoveryInput.value;discoveryClear.hidden=discoveryInput.value.length===0;renderMenu();}
discoveryInput.addEventListener('input',refreshDiscovery);
document.querySelector('.menu-search-form').addEventListener('submit',event=>{event.preventDefault();discoveryInput.blur();});
discoveryInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();discoveryInput.blur();}if(event.key==='Escape'&&discoveryInput.value){discoveryInput.value='';refreshDiscovery();}});
discoveryClear.addEventListener('click',()=>{discoveryInput.value='';refreshDiscovery();discoveryInput.focus({preventScroll:true});});
document.querySelectorAll('[data-quick-filter]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.quickFilter;menuQueryState[key]=!menuQueryState[key];button.setAttribute('aria-pressed',String(menuQueryState[key]));renderMenu();}));
document.getElementById('menu-search-reset').addEventListener('click',()=>{
  discoveryInput.value='';discoveryClear.hidden=true;Object.assign(menuQueryState,{category:'all',query:'',cold:false,caffeineFree:false});
  document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter==='all')));
  document.querySelectorAll('[data-quick-filter]').forEach(button=>button.setAttribute('aria-pressed','false'));renderMenu();discoveryInput.focus({preventScroll:true});
});

let carouselCards=[],carouselCenters=[],carouselWidth=0,carouselCardWidth=0,carouselActive=-1,carouselFrame=0;
function softMenuTone(hex){const values=hex.slice(1).match(/../g).map(value=>parseInt(value,16));const base=[255,250,243];return 'rgb('+values.map((value,index)=>Math.round(value*.18+base[index]*.82)).join(', ')+')';}
function paintCarousel(){
  carouselFrame=0;
  if(!mobileHeaderQuery.matches||!carouselCards.length){discoverySection.style.removeProperty('--menu-tone');discoveryCounter.textContent='';return;}
  const middle=discoveryGrid.scrollLeft+carouselWidth/2;
  let nearest=0,distance=Infinity;
  carouselCards.forEach((card,index)=>{
    const gap=Math.abs(carouselCenters[index]-middle);if(gap<distance){distance=gap;nearest=index;}
    const proximity=Math.max(0,1-gap/(carouselCardWidth+20));
    card.style.setProperty('--carousel-scale',motionPreference.matches?1:(.925+.075*proximity).toFixed(4));
    card.style.setProperty('--carousel-opacity',motionPreference.matches?1:(.72+.28*proximity).toFixed(4));
  });
  if(nearest!==carouselActive){
    carouselActive=nearest;carouselCards.forEach((card,index)=>{if(index===nearest)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');});
    discoveryCounter.textContent=(nearest+1)+' / '+carouselCards.length;
    if(!motionPreference.matches)discoverySection.style.setProperty('--menu-tone',softMenuTone(items[Number(carouselCards[nearest].dataset.cardIndex)][3]));
  }
  if(motionPreference.matches)discoverySection.style.removeProperty('--menu-tone');
}
function measureCarousel(reset=false){
  carouselCards=[...discoveryGrid.querySelectorAll(':scope > .menu-card')];carouselActive=-1;
  if(!mobileHeaderQuery.matches){discoveryGrid.style.removeProperty('--carousel-gutter');carouselCards.forEach(card=>{card.style.removeProperty('--carousel-scale');card.style.removeProperty('--carousel-opacity');card.removeAttribute('aria-current');});paintCarousel();return;}
  carouselWidth=discoveryGrid.clientWidth;carouselCardWidth=carouselCards[0]?.offsetWidth||0;
  discoveryGrid.style.setProperty('--carousel-gutter',Math.max(16,(carouselWidth-carouselCardWidth)/2)+'px');
  carouselCenters=carouselCards.map(card=>card.offsetLeft+card.offsetWidth/2);
  if(reset)discoveryGrid.scrollLeft=0;paintCarousel();
}
discoveryGrid.addEventListener('menu:updated',()=>measureCarousel(true));
discoveryGrid.addEventListener('scroll',()=>{if(!carouselFrame)carouselFrame=requestAnimationFrame(paintCarousel);},{passive:true});
discoveryGrid.addEventListener('keydown',event=>{
  if(event.target!==discoveryGrid||!mobileHeaderQuery.matches||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();const next=Math.max(0,Math.min(carouselCards.length-1,carouselActive+(event.key==='ArrowRight'?1:-1)));
  if(carouselCards[next])discoveryGrid.scrollTo({left:Math.max(0,carouselCenters[next]-carouselWidth/2),behavior:motionPreference.matches?'auto':'smooth'});
});
mobileHeaderQuery.addEventListener('change',()=>measureCarousel(true));
motionPreference.addEventListener('change',()=>{carouselActive=-1;paintCarousel();});
if('ResizeObserver' in window)new ResizeObserver(()=>measureCarousel(false)).observe(discoveryGrid);else window.addEventListener('resize',()=>measureCarousel(false));
measureCarousel(true);

// Twelve small vector elements. Only compositor transforms animate; visibility
// observers pause them while the hero is off screen.
const seasonalHero=document.querySelector('.hero');
const seasonalLayer=document.querySelector('.seasonal-drift');
function seasonForMonth(month){return month>=9&&month<=11?'autumn':month===12||month<=2?'winter':month<=5?'spring':'summer';}
function seasonalDrawing(season,index){
  if(season==='winter')return '<path d="M20 3v34M5 11l30 18M5 29l30-18M15 7l5 5 5-5M15 33l5-5 5 5M7 17l7 1-2-7M33 23l-7-1 2 7M8 29l6-4-1 8M32 11l-6 4 1-8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
  if(season==='spring')return '<path d="M20 36C3 26 3 11 13 5C24-2 35 8 32 18C30 26 23 32 20 36Z" fill="currentColor"/>';
  if(season==='summer')return index%2?'<ellipse cx="20" cy="20" rx="12" ry="17" fill="currentColor"/><path d="M23 6C9 14 30 25 17 34" stroke="#fff4e4" stroke-width="2" fill="none"/>':'<path d="m9 10 21-3 4 23-22 4Z" fill="currentColor"/><path d="m9 10 9 5 16-4M18 15l3 18" stroke="#fffaf3" stroke-width="1.3" fill="none"/>';
  return '<path d="M19 35C2 29 6 10 31 4C35 21 30 32 19 35Z" fill="currentColor"/><path d="M13 38 27 12M17 29l-5-10m8 4 9-4" stroke="#fff5e7" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
}
function fillSeasonalHero(){
  const month=Number(new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Moscow',month:'numeric'}).format(new Date()));
  const season=seasonForMonth(month);seasonalLayer.dataset.season=season;
  const colors={autumn:['#af7a4e','#bc8b64','#9c8260','#ad718b'],winter:['#9aa99e','#b7bfc6','#a9b7c1'],spring:['#d49ab2','#d9adbb','#b9bea2'],summer:['#bba886','#b08c6a','#a39076']}[season];
  seasonalLayer.innerHTML=Array.from({length:12},(_,index)=>{
    const size=13+(index*7)%13,duration=19+(index*5)%14,left=3+(index*31)%94,delay=-((index*3.7)%duration);
    return `<span class="falling-element" style="left:${left}%;width:${size}px;height:${size}px;color:${colors[index%colors.length]};--fall-duration:${duration}s;--fall-delay:${delay}s;--fall-drift:${(index%2?1:-1)*(18+(index*7)%35)}px;--sway-duration:${4+(index%4)}s"><svg viewBox="0 0 40 40" aria-hidden="true">${seasonalDrawing(season,index)}</svg></span>`;
  }).join('');
  seasonalLayer.style.setProperty('--fall-height',(seasonalHero.offsetHeight+70)+'px');
}
fillSeasonalHero();
if('ResizeObserver' in window)new ResizeObserver(()=>seasonalLayer.style.setProperty('--fall-height',(seasonalHero.offsetHeight+70)+'px')).observe(seasonalHero);
if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{for(const entry of entries){if(entry.target===seasonalHero)seasonalLayer.classList.toggle('is-running',entry.isIntersecting&&!motionPreference.matches);else discoverySection.dataset.menuVisible=String(entry.isIntersecting);}},{threshold:0}).observe(seasonalHero);
  new IntersectionObserver(entries=>{entries.forEach(entry=>discoverySection.dataset.menuVisible=String(entry.isIntersecting));},{threshold:0}).observe(discoverySection);
}else seasonalLayer.classList.add('is-running');
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)seasonalLayer.classList.remove('is-running');else{const bounds=seasonalHero.getBoundingClientRect();seasonalLayer.classList.toggle('is-running',bounds.bottom>0&&bounds.top<innerHeight);}});
