/* Gilad — cookie consent bar. Self-injects a bottom banner that slides onto
   the screen with Accept / Reject. Bilingual (reads <html lang>), and the
   choice is remembered in localStorage so the bar shows only once.
   The site uses functional cookies/localStorage only (no third-party tracking),
   so both choices simply record the decision and dismiss the bar. */
(function () {
  'use strict';
  var KEY = 'gilad-cookie-consent';
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  var en = document.documentElement.lang === 'en';
  var T = en
    ? { msg: 'We use cookies to improve your experience and analyse site usage. ',
        more: 'Privacy Policy', accept: 'Accept', reject: 'Reject', aria: 'Cookie consent' }
    : { msg: 'אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה ולנתח את השימוש באתר. ',
        more: 'מדיניות פרטיות', accept: 'אישור', reject: 'דחייה', aria: 'הסכמה לעוגיות' };

  var css =
    '.cookie-bar{position:fixed;inset-inline:0;inset-block-end:0;z-index:8900;padding:0 16px 16px;' +
      'transform:translateY(130%);transition:transform .55s cubic-bezier(.22,1,.36,1);' +
      'pointer-events:none;font-family:"Assistant",system-ui,sans-serif;}' +
    '.cookie-bar.show{transform:translateY(0);}' +
    '.cookie-bar__inner{pointer-events:auto;max-width:1180px;margin:0 auto;background:#102E1C;color:#EAF3E2;' +
      'border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 18px 50px -16px rgba(0,0,0,.6);' +
      'padding:16px 20px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;justify-content:space-between;}' +
    '.cookie-bar__text{display:flex;align-items:center;gap:13px;font-size:.95rem;line-height:1.55;flex:1;min-width:240px;}' +
    '.cookie-bar__text svg{width:28px;height:28px;color:#9ED84F;flex:none;}' +
    '.cookie-bar__text a{color:#9ED84F;font-weight:700;text-decoration:underline;text-underline-offset:2px;}' +
    '.cookie-bar__actions{display:flex;gap:10px;flex:none;}' +
    '.cookie-btn{font-family:inherit;font-weight:700;font-size:.92rem;border-radius:11px;padding:11px 24px;' +
      'cursor:pointer;border:1.6px solid transparent;transition:all .2s ease;}' +
    '.cookie-btn--accept{background:#6FB02A;color:#10240f;}' +
    '.cookie-btn--accept:hover{background:#7cc230;transform:translateY(-1px);}' +
    '.cookie-btn--reject{background:transparent;color:#EAF3E2;border-color:rgba(255,255,255,.45);}' +
    '.cookie-btn--reject:hover{border-color:#fff;background:rgba(255,255,255,.08);}' +
    '@media(max-width:560px){.cookie-bar__inner{flex-direction:column;align-items:stretch;gap:14px;}' +
      '.cookie-bar__actions{justify-content:stretch;}.cookie-btn{flex:1;}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/>' +
    '<circle cx="9" cy="11" r="1" fill="currentColor" stroke="none"/>' +
    '<circle cx="13" cy="15.5" r="1" fill="currentColor" stroke="none"/>' +
    '<circle cx="16" cy="10" r="1" fill="currentColor" stroke="none"/></svg>';

  var bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', T.aria);
  bar.innerHTML =
    '<div class="cookie-bar__inner">' +
      '<div class="cookie-bar__text">' + ICON +
        '<span>' + T.msg + '<a href="privacy-policy.html">' + T.more + '</a>.</span>' +
      '</div>' +
      '<div class="cookie-bar__actions">' +
        '<button class="cookie-btn cookie-btn--reject" type="button">' + T.reject + '</button>' +
        '<button class="cookie-btn cookie-btn--accept" type="button">' + T.accept + '</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(bar);
  // tell the accessibility button how tall the bar is, so it floats above it
  document.documentElement.style.setProperty('--gilad-cookie-h', bar.offsetHeight + 'px');
  requestAnimationFrame(function () { requestAnimationFrame(function () { bar.classList.add('show'); }); });

  function decide(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    document.documentElement.style.setProperty('--gilad-cookie-h', '0px'); // let the a11y button drop back
    bar.classList.remove('show');
    setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 600);
  }
  bar.querySelector('.cookie-btn--accept').addEventListener('click', function () { decide('accepted'); });
  bar.querySelector('.cookie-btn--reject').addEventListener('click', function () { decide('rejected'); });
})();
