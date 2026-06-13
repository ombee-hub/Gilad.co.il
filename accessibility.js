/* Gilad — accessibility widget. Self-injects a floating button + panel.
   Each feature toggles a class / data-attribute on <html>; effects live in
   accessibility.css. State persists in localStorage. Include BEFORE app.js
   so the bilingual labels get translated by app.js. */
(function () {
  'use strict';
  var KEY = 'gilad-a11y';
  var I = function (s) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + s + '</svg>'; };

  // k: key, he/en: label, lv: 0 = on/off toggle, N = cycle 0..N
  var F = [
    { k: 'links', he: 'הדגשת קישורים', en: 'Highlight links', lv: 0, ic: '<path d="M9.5 13.5a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7L11 6.3"/><path d="M14.5 10.5a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7L13 17.7"/>' },
    { k: 'contrast', he: 'ניגודיות', en: 'Contrast', lv: 2, ic: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 010 18z" fill="currentColor" stroke="none"/>' },
    { k: 'spacing', he: 'ריווח טקסט', en: 'Text spacing', lv: 2, ic: '<path d="M3 12h18"/><path d="M6 8l-4 4 4 4"/><path d="M18 8l4 4-4 4"/>' },
    { k: 'textsize', he: 'הגדלת טקסט', en: 'Bigger text', lv: 3, ic: '<path d="M3.5 18l4.5-12 4.5 12"/><path d="M5 14h6"/><path d="M14.5 18l3-8 3 8"/><path d="M15.6 15h3.8"/>' },
    { k: 'hideimg', he: 'הסתרת תמונות', en: 'Hide images', lv: 0, ic: '<rect x="3" y="4" width="18" height="15" rx="2"/><path d="m4 16 4-4 3 2.5"/><circle cx="9" cy="9.5" r="1.2" fill="currentColor" stroke="none"/><path d="M3.5 3.5l17 17"/>' },
    { k: 'noanim', he: 'עצירת הנפשות', en: 'Stop animations', lv: 0, ic: '<circle cx="12" cy="12" r="9"/><path d="M10 9.5v5M14 9.5v5"/>' },
    { k: 'cursor', he: 'סמן גדול', en: 'Big cursor', lv: 0, ic: '<path d="M5 3l5.5 15 2.2-6.3 6.3-2.2z"/>' },
    { k: 'dyslexia', he: 'תמיכה בדיסלקציה', en: 'Dyslexia font', lv: 0, ic: '<text x="3" y="17.5" font-family="Georgia,serif" font-size="14" font-weight="700" fill="currentColor" stroke="none">Df</text>' },
    { k: 'lineheight', he: 'גובה שורה', en: 'Line height', lv: 2, ic: '<path d="M9 5h12M9 12h12M9 19h12"/><path d="M4 4v16"/><path d="M4 4 2.6 5.6M4 4l1.4 1.6M4 20l-1.4-1.6M4 20l1.4-1.6"/>' },
    { k: 'desc', he: 'תיאורים', en: 'Tooltips', lv: 0, ic: '<path d="M4 5h16v10H9l-4 4z"/><path d="M12 8h.01"/><path d="M11.2 11h1v3"/>' },
    { k: 'saturate', he: 'רוויה', en: 'Saturation', lv: 3, ic: '<path d="M12 3.5c3.5 4.5 5.5 7.5 5.5 10.5a5.5 5.5 0 01-11 0c0-3 2-6 5.5-10.5z"/>' },
    { k: 'align', he: 'יישור טקסט', en: 'Text align', lv: 3, ic: '<path d="M4 6h16M8 12h12M4 18h16"/>' }
  ];

  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  var isEn = function () { return document.documentElement.lang === 'en'; };

  // ---- build DOM ----
  var root = document.createElement('div'); root.className = 'a11y-root';
  var ACCESS_ICON = I('<circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="7.3" r="1.4" fill="currentColor" stroke="none"/><path d="M5.5 10c2 .9 4.2 1.3 6.5 1.3S16.5 10.9 18.5 10"/><path d="M12 11.3v4.2M12 15.5l-2.4 4M12 15.5l2.4 4"/>');

  var fab = document.createElement('button');
  fab.className = 'a11y-fab'; fab.type = 'button';
  fab.setAttribute('aria-label', 'תפריט נגישות'); fab.innerHTML = ACCESS_ICON;

  var backdrop = document.createElement('div'); backdrop.className = 'a11y-backdrop';

  var panel = document.createElement('aside');
  panel.className = 'a11y-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'תפריט נגישות');

  var tilesHtml = F.map(function (f) {
    var dots = f.lv > 0 ? '<span class="dots">' + Array.apply(null, { length: f.lv }).map(function () { return '<i></i>'; }).join('') + '</span>' : '';
    return '<button class="a11y-tile" type="button" data-k="' + f.k + '">' + I(f.ic) +
      '<span data-en="' + f.en + '" data-he="' + f.he + '">' + f.he + '</span>' + dots + '</button>';
  }).join('');

  panel.innerHTML =
    '<div class="a11y-head"><h2>' + ACCESS_ICON + '<span data-en="Accessibility" data-he="תפריט נגישות">תפריט נגישות</span></h2>' +
    '<button class="a11y-close" type="button" aria-label="סגירה">&times;</button></div>' +
    '<div class="a11y-grid">' + tilesHtml + '</div>' +
    '<div class="a11y-foot">' +
    '<button class="a11y-reset" type="button">' + I('<path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3M3 3v3.3h3.3"/>') +
    '<span data-en="Reset accessibility settings" data-he="איפוס הגדרות נגישות">איפוס הגדרות נגישות</span></button>' +
    '<span class="a11y-state" data-en="Powered by Gilad accessibility" data-he="נגישות אתר גלעד">נגישות אתר גלעד</span>' +
    '</div>';

  root.appendChild(backdrop); root.appendChild(panel); root.appendChild(fab);
  document.body.appendChild(root);

  var tiles = {};
  [].forEach.call(panel.querySelectorAll('.a11y-tile'), function (t) { tiles[t.getAttribute('data-k')] = t; });

  // ---- apply ----
  function apply() {
    var el = document.documentElement;
    F.forEach(function (f) {
      var v = state[f.k] || 0;
      if (f.lv === 0) el.classList.toggle('ac-' + f.k, v > 0);
      else { if (v > 0) el.setAttribute('data-ac-' + f.k, v); else el.removeAttribute('data-ac-' + f.k); }
      var t = tiles[f.k];
      if (t) {
        t.classList.toggle('on', v > 0);
        [].forEach.call(t.querySelectorAll('.dots i'), function (d, i) { d.classList.toggle('fill', i < v); });
      }
    });
    var fl = [], s = state.saturate || 0, c = state.contrast || 0;
    if (s === 1) fl.push('saturate(.5)'); else if (s === 2) fl.push('saturate(0)'); else if (s === 3) fl.push('saturate(1.7)');
    if (c === 1) fl.push('contrast(1.45)'); else if (c === 2) fl.push('contrast(1.05) invert(1) hue-rotate(180deg)');
    el.style.filter = fl.join(' ');
    el.classList.toggle('ac-negative', c === 2);
    if (state.desc) [].forEach.call(document.querySelectorAll('img[alt]'), function (im) { if (!im.getAttribute('title')) im.setAttribute('title', im.getAttribute('alt')); });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ---- events ----
  panel.querySelector('.a11y-grid').addEventListener('click', function (e) {
    var t = e.target.closest('.a11y-tile'); if (!t) return;
    var f = F.filter(function (x) { return x.k === t.getAttribute('data-k'); })[0];
    var max = f.lv || 1;
    state[f.k] = ((state[f.k] || 0) + 1) % (max + 1);
    apply();
  });
  panel.querySelector('.a11y-reset').addEventListener('click', function () {
    state = {}; document.documentElement.style.filter = ''; apply();
  });

  function setOpen(o) {
    panel.classList.toggle('open', o); backdrop.classList.toggle('open', o);
    fab.setAttribute('aria-expanded', o ? 'true' : 'false');
  }
  fab.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
  backdrop.addEventListener('click', function () { setOpen(false); });
  panel.querySelector('.a11y-close').addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  apply();
})();
