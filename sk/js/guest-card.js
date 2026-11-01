(() => {
  'use strict';
  const PAID_CUPS = 5;
  // ДЕМО: условия акции «6-й кофе в подарок» взяты как пример
  // и должны быть заменены на реальные условия кофейни.
  const CONFIG = {
    paidCups: PAID_CUPS,
    confettiParticles: 24,
    texts: {
      nav: 'Карта гостя', close: 'Закрыть мою карту',
      title: 'Моя карта', invitation: 'Копите кусочки сахара, шестой кофе в подарок ♡',
      open: 'Открыть мою карту', phone: 'Номер телефона', submit: 'Показать мою карту',
      demo: 'Демо: нажимайте на кусочки, чтобы увидеть, как копится карта',
      error: 'Кажется, не хватает цифр. Введите номер полностью — и откроем вашу карту',
      greeting: 'Здравствуйте! Карта гостя', reward: 'Ваш кофе в подарок ждёт вас ☕',
      progress: n => `Ещё ${n} кофе — и шестой в подарок ♡`, // «кофе» — несклоняемое слово.
      visits: 'Последние визиты', favorite: 'Любимый напиток', menu: 'Посмотреть в меню', logout: 'Выйти',
      intro: 'Маленькая пауза становится приятной привычкой.',
      privacy: 'Без регистрации и пароля. Номер никуда не отправляется и исчезнет после обновления страницы.',
      cardLabel: 'КАРТА ГОСТЯ', pieces: (n, total) => `Собрано кусочков: ${n} из ${total}`,
      rules: 'Кусочек за каждый кофе · пять кусочков — и шестой кофе в подарок ♡',
      giftLabel: 'ПОДАРОК', giftBand: 'ПОДАРОК · шестой кофе', giftAction: 'Получить подарок', groupLabel: 'Кусочки сахара и подарок',
      giftLocked: n => `Сначала соберите ${pieceLabel(n)}`,
      resetPiece: 'Сбросить кусочки', setPiece: n => `Установить ${pieceLabel(n)}`
    },
    // ДЕМО: даты, история визитов и любимый напиток вымышлены.
    // Названия напитков взяты из существующего меню, адреса — из блока «Наши точки».
    visits: [
      { date: '2026-10-30', drink: 'Капучино', place: 'ул. Кирова, вл56' },
      { date: '2026-10-27', drink: 'Латте', place: 'ул. 1 Мая, 105' },
      { date: '2026-10-24', drink: 'Флэт уайт', place: 'ул. Кирова, вл56' }
    ],
    favorite: 'Капучино'
  };
  const t = CONFIG.texts;
  let guest = null, opener = null, pointerOutside = false, oldOverflow = '', menuAfterClose = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let svgSequence = 0, hintShown = false, interacted = false;
  function sugarCube() {
    const id = `sugar-${++svgSequence}`;
    const silhouette = 'M50 8Q53 8 56 10L83 25Q87 27 87 32V67Q87 71 83 73L55 89Q50 92 45 89L17 73Q13 71 13 67V32Q13 27 17 25L44 10Q47 8 50 8Z';
    const grains = Array.from({length:105},(_,i)=>`<circle cx="${14+(i*31%74)}" cy="${10+(i*17%81)}" r="${i%3===0?.65:.38}" fill="${i%3===0?'#e7d7b9':'#ffffff'}" opacity="${i%3===0?.6:.9}"/>`).join('');
    return `<svg class="sugar-svg" viewBox="0 0 100 105" aria-hidden="true"><defs><linearGradient id="${id}-top" x2="1" y2="1"><stop stop-color="#FFFDF8"/><stop offset="1" stop-color="#faf3e5"/></linearGradient><linearGradient id="${id}-left" x2="1" y2="1"><stop stop-color="#fffaf0"/><stop offset="1" stop-color="#f6eedc"/></linearGradient><linearGradient id="${id}-right" x2="1" y2="1"><stop stop-color="#faf3e5"/><stop offset="1" stop-color="#F3E8D2"/></linearGradient><clipPath id="${id}-clip"><path d="${silhouette}"/></clipPath></defs><g class="sugar-ghost"><path d="${silhouette}" fill="none" stroke="#fff2d6" stroke-width="1.2" stroke-dasharray="3 4"/></g><g class="sugar-solid"><ellipse cx="50" cy="97" rx="29" ry="4" fill="#140c06" opacity=".2"/><path d="${silhouette}" fill="url(#${id}-right)"/><path d="M17 26 46 10Q50 8 54 10L83 26Q85 28 81 30L54 46Q50 48 46 46L18 30Q14 28 17 26" fill="url(#${id}-top)"/><path d="M14 31Q14 30 18 32L46 48Q49 50 49 54V87Q49 90 45 88L18 72Q14 70 14 66Z" fill="url(#${id}-left)"/><g clip-path="url(#${id}-clip)">${grains}<path d="m26 19 17-7q6-3 10 0l-26 12q-5 1-1-5" fill="#ffffff" opacity=".65"/><g class="sugar-grain-glints" fill="#fff"><path d="m34 25 1.2 3.5 3.5 1.2-3.5 1.2L34 34.4l-1.2-3.5-3.5-1.2 3.5-1.2Z"/><path d="m64 52 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/><path d="m28 60 .8 2.5 2.5.8-2.5.8-.8 2.5-.8-2.5-2.5-.8 2.5-.8Z"/><path d="m72 30 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"/></g></g></g></svg>`;
  }
  function giftIcon(cup = false) {
    const bow = '<g class="gift-bow" fill="none" stroke="#d4ad61" stroke-width="2.2" stroke-linecap="round"><path d="M43 20C17 4 24 34 46 24M47 21C68 0 82 28 49 25M46 24l-9 15m11-15 11 11"/><circle cx="46" cy="23" r="3" fill="#f7e6bd"/></g>';
    const body = cup
      ? '<path d="M23 39h50v19q0 25-25 25T23 58Z" fill="url(#gift-cream-cup)" stroke="#cda95f" stroke-width="1.5"/><path d="M74 45h6c16 0 14 23-7 21M17 88h65" fill="none" stroke="#d4ad61" stroke-width="2.2"/><defs><linearGradient id="gift-cream-cup" x2="0" y2="1"><stop stop-color="#fff7e2"/><stop offset="1" stop-color="#e7c987"/></linearGradient></defs>'
      : '<path d="M50 29 82 46v31L50 94 18 77V46Z" fill="url(#gift-cream-cube)" stroke="#d4ad61" stroke-width="1.3" stroke-linejoin="round"/><path d="m18 46 32 17 32-17M50 63v31" fill="none" stroke="#d4ad61" stroke-width="1.1"/><defs><linearGradient id="gift-cream-cube" x2="1" y2="1"><stop stop-color="#fff5db"/><stop offset="1" stop-color="#dfbd73"/></linearGradient></defs>';
    return `<svg viewBox="0 0 100 105" aria-hidden="true">${body}${bow}<text x="80" y="20" fill="#f4dc9f" font-size="19">♡</text></svg>`;
  }
  function pieceWord(number) {
    const n = Math.abs(number), lastTwo = n % 100, last = n % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return 'кусочков';
    return last === 1 ? 'кусочек' : last >= 2 && last <= 4 ? 'кусочка' : 'кусочков';
  }
  function pieceLabel(number) { return `${number} ${pieceWord(number)}`; }

  function openButton(label, className) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = className; button.textContent = label;
    button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-controls', 'guest-dialog');
    button.addEventListener('click', openCard);
    return button;
  }
  const nav = document.getElementById('navigation');
  nav.append(openButton(t.nav, 'guest-nav'));
  const invite = document.createElement('section');
  invite.id = 'guest-invitation'; invite.className = 'wrap guest-invitation';
  invite.setAttribute('aria-labelledby', 'guest-invite-title');
  invite.innerHTML = `<h2 id="guest-invite-title">${t.invitation}</h2>`;
  invite.append(openButton(t.open, 'guest-menu-link'));
  document.getElementById('menu').after(invite);
  const dialog = document.createElement('dialog');
  dialog.id = 'guest-dialog'; dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'guest-title'); dialog.setAttribute('aria-describedby', 'guest-demo');
  dialog.innerHTML = `<div class="guest-dialog-head"><div><h2 id="guest-title">${t.title}</h2></div><button class="guest-close" type="button" aria-label="${t.close}">×</button></div><p id="guest-demo" class="guest-note">${t.demo}</p><div id="guest-content"></div>`;
  document.body.append(dialog);
  const content = dialog.querySelector('#guest-content');
  function openCard(event) {
    opener = event.currentTarget;
    if (typeof closeNav === 'function') closeNav();
    document.querySelector('header').classList.remove('header-hidden');
    guest ? renderCard() : renderLogin();
    oldOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    (guest ? content.querySelector('[tabindex]') : content.querySelector('input')).focus();
  }
  function closeCard() { dialog.close(); }
  dialog.querySelector('.guest-close').addEventListener('click', closeCard);
  dialog.addEventListener('close', () => {
    document.body.style.overflow = oldOverflow;
    if (menuAfterClose) {
      menuAfterClose = false;
      const menu = document.getElementById('menu'); menu.setAttribute('tabindex','-1');
      menu.focus({preventScroll:true});
      menu.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth'});
      return;
    }
    let target = opener;
    if (!target?.getClientRects().length || !target.checkVisibility()) target = document.querySelector('.burger');
    target?.focus({ preventScroll: true });
  });
  function outside(event) {
    const r = dialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  }
  dialog.addEventListener('pointerdown', e => { pointerOutside = outside(e); });
  dialog.addEventListener('click', e => { if (pointerOutside && outside(e)) closeCard(); pointerOutside = false; });
  // Нативный dialog закрывается по Esc и делает фон inert; здесь замыкаем Tab внутри окна.
  dialog.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const list = [...dialog.querySelectorAll('button, input, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    const first = list[0], last = list.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  function phoneDigits(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
    else if (value.trim().startsWith('+7')) digits = digits.slice(1);
    return digits;
  }
  function maskPhone(digits) {
    const d = digits.padEnd(10, '_');
    return `+7 (${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,8)}-${d.slice(8,10)}`;
  }
  function renderLogin() {
    content.innerHTML = `<form class="guest-login" novalidate><p>${t.intro}</p><label for="guest-phone">${t.phone}</label><input id="guest-phone" name="phone" type="tel" inputmode="tel" autocomplete="off" placeholder="+7 (___) ___-__-__" aria-describedby="guest-demo guest-error guest-privacy" required><p id="guest-error" class="guest-error" role="alert"></p><button type="submit" class="button">${t.submit} <span aria-hidden="true">↗</span></button><p id="guest-privacy" class="guest-note">${t.privacy}</p></form>`;
    const input = content.querySelector('input');
    input.addEventListener('input', () => {
      const before = input.value.slice(0, input.selectionStart);
      const position = phoneDigits(before).length;
      const digits = phoneDigits(input.value);
      if (digits.length > 10) return;
      input.value = digits ? maskPhone(digits) : '';
      const slots = [4,5,6,9,10,11,13,14,16,17];
      const caret = position ? slots[Math.min(position,10)-1] + 1 : 4;
      input.setSelectionRange(caret, caret);
      input.removeAttribute('aria-invalid'); content.querySelector('#guest-error').textContent = '';
    });
    content.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const digits = phoneDigits(input.value);
      if (!/^\d{10}$/.test(digits)) {
        input.setAttribute('aria-invalid','true'); content.querySelector('#guest-error').textContent = t.error; input.focus(); return;
      }
      guest = { suffix: digits.slice(-4), pieces: piecesForNumber(digits) };
      renderCard(); content.querySelector('[tabindex]').focus();
    });
  }
  function piecesForNumber(digits) {
    // Демо: для одного номера всегда от 1 до 4 оплаченных кофе.
    return 1 + Number(digits.at(-1)) % (CONFIG.paidCups - 1);
  }
  function renderCard() {
    content.innerHTML = `<p class="guest-greeting" tabindex="0">${t.greeting} ···${guest.suffix.slice(0,2)}-${guest.suffix.slice(2)}</p><div class="guest-plastic"><div class="guest-card-brand"><span class="official-logo"><img src="assets/logo-instagram.jpg" alt="Сахара кусочек" width="150" height="150"></span><span>сахара<br>кусочек</span></div><p class="guest-card-label">${t.cardLabel}</p><div class="guest-pieces" role="group" aria-label="${t.groupLabel}" style="--paid-cups:${CONFIG.paidCups};--total-cells:${CONFIG.paidCups+1}">${Array.from({length:CONFIG.paidCups},(_,i)=>`<button class="sugar-piece" type="button" data-piece="${i+1}" aria-label="${t.setPiece(i+1)}" aria-pressed="false">${sugarCube()}<span class="piece-burst" aria-hidden="true">✦</span></button>`).join('')}<div class="guest-gift-bridge" aria-hidden="true"><span>↓</span></div><button class="guest-gift-cell" type="button" aria-label="${t.giftAction}" aria-pressed="false"><span class="gift-desktop-icon">${giftIcon()}</span><span class="gift-mobile-icon">${giftIcon(true)}</span><span class="gift-caption">${t.giftLabel}</span><span class="gift-band-caption">${t.giftBand} <span aria-hidden="true">♡</span></span><span class="gift-lock" aria-hidden="true"><svg viewBox="0 0 20 24"><rect x="3" y="10" width="14" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 10V6a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></span><span class="gift-flash" aria-hidden="true">✦</span></button></div><div class="guest-card-bottom"><span id="guest-piece-count"></span></div><p class="guest-progress" role="status"></p><p class="guest-card-rules">${t.rules}</p></div><section class="guest-visits" aria-labelledby="guest-visits-title"><h3 id="guest-visits-title">${t.visits}</h3><ul>${CONFIG.visits.map(v=>`<li><time datetime="${v.date}">${new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long'}).format(new Date(v.date+'T12:00:00'))}</time><div><b>${v.drink}</b><span>${v.place}</span></div></li>`).join('')}</ul></section><section class="guest-favorite" aria-labelledby="guest-favorite-title"><div><h3 id="guest-favorite-title">${t.favorite}</h3><p>${CONFIG.favorite}</p></div><button class="guest-menu-link" type="button">${t.menu} ↗</button></section><button type="button" class="guest-logout">${t.logout}</button>`;
    content.querySelectorAll('[data-piece]').forEach(button => button.addEventListener('click', () => {
      const number = Number(button.dataset.piece);
      interactWithCard(number === 1 && guest.pieces === 1 ? 0 : number);
    }));
    content.querySelector('.guest-gift-cell').addEventListener('click', () => interactWithCard(CONFIG.paidCups));
    content.querySelector('.guest-logout').addEventListener('click', () => { guest = null; renderLogin(); content.querySelector('input').focus(); });
    content.querySelector('.guest-menu-link').addEventListener('click', () => { menuAfterClose = true; closeCard(); });
    paintPieces(-1);
    if (!hintShown && !interacted) {
      hintShown = true;
      content.querySelector(`[data-piece="${guest.pieces + 1}"]`)?.classList.add('piece-hint');
    }
  }
  function interactWithCard(number) {
    interacted = true;
    content.querySelector('.piece-hint')?.classList.remove('piece-hint');
    const previous = guest.pieces;
    guest.pieces = Math.max(0, Math.min(CONFIG.paidCups, number));
    paintPieces(previous);
  }
  function animatePiece(button, filled, delay) {
    if (reducedMotion.matches) return;
    const solid = button.querySelector('.sugar-solid');
    solid.getAnimations().forEach(animation => animation.cancel());
    const frames = filled ? [
      {offset:0,transform:'translateY(-25px) scale(.9)',opacity:0},
      {offset:.65,transform:'translateY(2px) scale(1.06)',opacity:1},
      {offset:1,transform:'translateY(0) scale(1)',opacity:1}
    ] : [{transform:'translateY(0) scale(1)',opacity:1},{transform:'translateY(8px) scale(.9)',opacity:0}];
    solid.animate(frames,{duration:filled?520:240,delay,fill:'backwards',easing:'ease-out'});
    if (filled) button.querySelector('.piece-burst').animate([
      {transform:'scale(.5) rotate(-15deg)',opacity:0},
      {transform:'scale(1.15) rotate(10deg)',opacity:.95,offset:.5},
      {transform:'scale(1.4) rotate(20deg)',opacity:0}
    ],{duration:480,delay:delay+250,fill:'backwards'});
  }
  function paintPieces(previous) {
    const count = guest.pieces;
    let changed = 0;
    content.querySelectorAll('[data-piece]').forEach(button => {
      const number = Number(button.dataset.piece), filled = number <= count;
      button.classList.toggle('is-filled', filled);
      button.setAttribute('aria-pressed', String(filled));
      button.setAttribute('aria-label', number === 1 && count === 1 ? t.resetPiece : t.setPiece(number));
      if (filled !== (number <= previous)) animatePiece(button, filled, changed++ * 75);
    });
    const ready = count === CONFIG.paidCups;
    const gift = content.querySelector('.guest-gift-cell');
    gift.classList.toggle('is-ready',ready); gift.setAttribute('aria-pressed',String(ready));
    gift.setAttribute('aria-description',ready?t.reward:t.giftLocked(CONFIG.paidCups));
    content.querySelector('#guest-piece-count').textContent = t.pieces(count,CONFIG.paidCups);
    content.querySelector('.guest-progress').textContent = ready?t.reward:t.progress(CONFIG.paidCups-count);
    if (ready) celebrate();
    else content.querySelector('.guest-confetti')?.remove();
  }
  function celebrate() {
    if (reducedMotion.matches) return;
    content.querySelector('.guest-confetti')?.remove();
    const confetti = document.createElement('div'); confetti.className = 'guest-confetti'; confetti.setAttribute('aria-hidden','true');
    confetti.innerHTML = Array.from({length:Math.min(40,CONFIG.confettiParticles)},(_,i)=>`<i style="--x:${(i*29)%100}%;--delay:${i*.025}s;--turn:${i%2?95:-85}deg"></i>`).join('');
    content.querySelector('.guest-plastic').append(confetti);
    confetti.addEventListener('animationend', e => { if(e.target === confetti.lastElementChild) confetti.remove(); });
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      content.getAnimations({subtree:true}).forEach(animation => animation.cancel());
      content.querySelector('.guest-confetti')?.remove();
    }
  });
})();
