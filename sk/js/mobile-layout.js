// Keep one DOM copy, and restore the original order above the mobile breakpoint.
const mobileLayoutMain=document.getElementById('main');
const desktopSectionOrder=[...mobileLayoutMain.children];
const phoneSectionOrder=['.hero','#menu','#places','#reviews','#about','#instagram','#faq','.closing','.ticker'].map(selector=>mobileLayoutMain.querySelector(selector));
function applySectionOrder(){
  const focus=document.activeElement;
  (mobileHeaderQuery.matches?phoneSectionOrder:desktopSectionOrder).forEach(section=>{if(section)mobileLayoutMain.append(section);});
  const invitation=document.getElementById('guest-invitation');if(invitation)document.getElementById('menu').after(invitation);
  if(focus&&focus!==document.body&&document.contains(focus))focus.focus({preventScroll:true});
}
applySectionOrder();mobileHeaderQuery.addEventListener('change',applySectionOrder);

const placeTabs=[...document.querySelectorAll('[data-place-tab]')];
placeTabs.forEach(button=>button.addEventListener('click',()=>{
  selectLocation(Number(button.dataset.placeTab));
  placeTabs.forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));
}));
// An address can also be selected through the original desktop cards.
new MutationObserver(()=>{placeTabs.forEach(tab=>tab.setAttribute('aria-pressed',String(Number(tab.dataset.placeTab)===selected)));}).observe(document.getElementById('location-list'),{childList:true});

const phoneMenu=document.getElementById('menu');
if(!motionPreference.matches&&'IntersectionObserver' in window){
  phoneMenu.classList.add('phone-menu-reveal');
  const phoneMenuObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){phoneMenu.classList.add('phone-menu-visible');phoneMenuObserver.disconnect();}},{threshold:.02});
  phoneMenuObserver.observe(phoneMenu);
}
