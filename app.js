/* ===== Gilad Desert Produce — interactions ===== */
(function () {
  'use strict';

  /* ---------- bilingual (EN / HE) ---------- */
  var STORE = 'gilad-site-lang';
  var langSwitch = document.getElementById('langSwitch');
  var langBtn = document.getElementById('langBtn');

  function applyLang(lang) {
    var he = lang === 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = he ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-en]').forEach(function (el) {
      var t = el.getAttribute(he ? 'data-he' : 'data-en');
      if (t != null) el.textContent = t;
    });
    document.querySelectorAll('[data-en-html]').forEach(function (el) {
      var t = el.getAttribute(he ? 'data-he-html' : 'data-en-html');
      if (t != null) el.innerHTML = t;
    });
    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      var t = el.getAttribute(he ? 'data-he-ph' : 'data-en-ph');
      if (t != null) el.setAttribute('placeholder', t);
    });

    // <title> lives in <head>; set document.title explicitly
    var titleEl = document.querySelector('title[data-en]');
    if (titleEl) document.title = titleEl.getAttribute(he ? 'data-he' : 'data-en');

    document.querySelectorAll('.lang-opt').forEach(function (o) {
      o.classList.toggle('active', o.getAttribute('data-lang') === lang);
    });
  }

  var saved = 'he';
  try { saved = localStorage.getItem(STORE) || 'he'; } catch (e) {}
  applyLang(saved);
  document.documentElement.classList.remove('pre'); // reveal once translated (anti-flash)

  if (langBtn && langSwitch) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = langSwitch.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.lang-opt').forEach(function (o) {
      o.addEventListener('click', function () {
        var l = o.getAttribute('data-lang');
        applyLang(l);
        try { localStorage.setItem(STORE, l); } catch (e) {} // persist explicit choice
        langSwitch.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!langSwitch.contains(e.target)) {
        langSwitch.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- sticky header state ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile drawer ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var backdrop = document.getElementById('drawerBackdrop');
  var drawerClose = document.getElementById('drawerClose');
  function setDrawer(open) {
    if (!drawer || !backdrop) return;
    drawer.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setDrawer(true); });
  if (drawerClose) drawerClose.addEventListener('click', function () { setDrawer(false); });
  if (backdrop) backdrop.addEventListener('click', function () { setDrawer(false); });
  if (drawer) {
    drawer.querySelectorAll('.drawer-links a').forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  /* ---------- product filter tabs ---------- */
  var tabs = document.getElementById('tabs');
  var grid = document.getElementById('grid');
  if (tabs && grid) {
    tabs.addEventListener('click', function (e) {
      var btn = e.target.closest('.tab');
      if (!btn) return;
      tabs.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-cat');
      grid.querySelectorAll('.product').forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('hide', !show);
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- contact form -> mailto ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var subject = (d.get('subject') || 'Website enquiry').toString();
      var body =
        'Name: ' + (d.get('name') || '') + '\n' +
        'Email: ' + (d.get('email') || '') + '\n\n' +
        (d.get('message') || '');
      window.location.href =
        'mailto:eyal@giladltd.co.il?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
