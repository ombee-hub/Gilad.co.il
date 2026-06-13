// Split the one-page site into separate pages, reusing the existing section
// markup (so all bilingual content is preserved verbatim) with a shared
// header + footer. Run with: node build-pages.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(DIR, f), s);

// Source of truth: use the cleaned one-page source if present, otherwise
// bootstrap from the current one-page index.html. Fixes below are idempotent.
let src = read(fs.existsSync(path.join(DIR, '_source.html')) ? '_source.html' : 'index.html');
src = src
  // remove the North office contact block (lookahead keeps the match inside one office div)
  .replace(/<div class="office">(?:(?!<div class="office">)[\s\S])*?North office[\s\S]*?<\/div>\s*/, '')
  // phone numbers without +972 (local Israeli format)
  .replaceAll('tel:+97286582515', 'tel:086582515')
  .replaceAll('+972-8-6582515', '08-6582515')
  // contact phrasing
  .replaceAll('צור קשר', 'יצירת קשר')
  // growers band -> the new in-site growers portal page
  .replaceAll('href="../growers.html"', 'href="growers.html"')
  // region: Central Arava (not "Arava Valley") — handle Hebrew prepositions first
  .replaceAll('מבקעת הערבה', 'מהערבה התיכונה')
  .replaceAll('בבקעת הערבה', 'בערבה התיכונה')
  .replaceAll('בקעת הערבה', 'הערבה התיכונה')
  .replaceAll('Arava Valley', 'Central Arava')
  // remove the markets strip overlaid on the hero image
  .replace(/<div class="hero__markets">[\s\S]*?<\/section>/, '</section>');
fs.writeFileSync(path.join(DIR, '_source.html'), src); // persist cleaned source for re-runs

function section(id) {
  const m = src.match(new RegExp('<section[^>]*id="' + id + '"[\\s\\S]*?</section>'));
  if (!m) throw new Error('section not found: ' + id);
  return m[0];
}
// in-page anchors -> page links; "צור קשר" -> "יצירת קשר"
function fix(s) {
  return s
    .replaceAll('href="#home"', 'href="index.html"')
    .replaceAll('href="#about"', 'href="about.html"')
    .replaceAll('href="#products"', 'href="products.html"')
    .replaceAll('href="#process"', 'href="process.html"')
    .replaceAll('href="#quality"', 'href="quality.html"')
    .replaceAll('href="#contact"', 'href="contact.html"')
    .replaceAll('צור קשר', 'יצירת קשר');
}

const SEC = {
  hero: fix(section('home')),
  about: fix(section('about')),
  products: fix(section('products')),
  process: fix(section('process')),
  quality: fix(section('quality')),
  growers: fix(section('growers')),
  contact: fix(section('contact')),
};

const NAV = [
  ['about.html', 'About', 'אודות', 'about'],
  ['products.html', 'Products', 'מוצרים', 'products'],
  ['process.html', 'Process', 'תהליך', 'process'],
  ['quality.html', 'Quality', 'איכות', 'quality'],
  ['growers.html', 'Growers', 'מגדלים', 'growers'],
];

function head(titleEn, titleHe, descEn, descHe) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>
  (function () {
    var l = 'he';
    try { l = localStorage.getItem('gilad-site-lang') || 'he'; } catch (e) {}
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
    document.documentElement.className += ' pre';
    setTimeout(function () { document.documentElement.classList.remove('pre'); }, 1500);
  })();
</script>
<title data-en="${titleEn}" data-he="${titleHe}">${titleHe}</title>
<meta name="description" data-en="${descEn}" data-he="${descHe}">
<link rel="icon" href="assets/Gilad.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=Heebo:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>`;
}

function header(cur) {
  const links = NAV.map(([href, en, he, key]) =>
    `      <a href="${href}"${key === cur ? ' class="current"' : ''} data-en="${en}" data-he="${he}">${he}</a>`
  ).join('\n');
  return `<header class="header" id="header">
  <div class="wrap nav">
    <a href="index.html" class="brand" aria-label="Gilad Desert Produce"><img src="assets/Gilad.png" alt="Gilad Desert Produce"></a>
    <nav class="nav-links" id="navLinks">
${links}
    </nav>
    <div class="nav-actions">
      <a href="contact.html" class="btn btn--primary nav-cta" data-en="Contact" data-he="יצירת קשר">Contact</a>
      <div class="lang-switch" id="langSwitch">
        <button class="lang-btn" id="langBtn" aria-label="Language" aria-haspopup="true" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.7 3.9 5.9 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.9-3.9-9S9.4 5.7 12 3z"/></svg>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="lang-menu" id="langMenu" role="menu">
          <button class="lang-opt" data-lang="en" role="menuitem">English</button>
          <button class="lang-opt" data-lang="he" role="menuitem">עברית</button>
        </div>
      </div>
      <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

const FOOTER = `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-col">
        <img src="assets/Gilad.png" alt="Gilad Desert Produce">
        <p class="footer-tagline" data-en="Premium desert-grown produce, delivered fresh to the world's leading supermarkets." data-he="תוצרת מדברית משובחת, מגיעה טרייה לרשתות המובילות בעולם.">Premium desert-grown produce, delivered fresh to the world's leading supermarkets.</p>
      </div>
      <div class="footer-col">
        <h4 data-en="Explore" data-he="ניווט">Explore</h4>
        <ul>
          <li><a href="about.html" data-en="About" data-he="אודות">About</a></li>
          <li><a href="products.html" data-en="Products" data-he="מוצרים">Products</a></li>
          <li><a href="process.html" data-en="Process" data-he="תהליך">Process</a></li>
          <li><a href="quality.html" data-en="Quality" data-he="איכות">Quality</a></li>
          <li><a href="contact.html" data-en="Contact" data-he="יצירת קשר">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-en="Markets" data-he="שווקים">Markets</h4>
        <ul>
          <li data-en="Europe" data-he="אירופה">Europe</li>
          <li data-en="United Kingdom" data-he="בריטניה">United Kingdom</li>
          <li data-en="USA &amp; Canada" data-he="ארה״ב וקנדה">USA &amp; Canada</li>
          <li data-en="Russia" data-he="רוסיה">Russia</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year"></span> Gilad Desert Produce Ltd. <span data-en="All rights reserved." data-he="כל הזכויות שמורות.">All rights reserved.</span></span>
      <a class="credit" href="https://ombee.co.il" target="_blank" rel="noopener" aria-label="OMBee — ombee.co.il">
        <span data-en="Design &amp; build by:" data-he="עיצוב ובנייה ע״י:">Design &amp; build by:</span>
        <img src="assets/ombee-logo.png" alt="OMBee">
      </a>
    </div>
  </div>
</footer>`;

// Home "explore" hub linking to the new pages
const EXPLORE_CARDS = [
  ['about.html', 'M12 14c4 0 7 2 7 5H5c0-3 3-5 7-5z M12 4a3.5 3.5 0 100 7 3.5 3.5 0 000-7z', 'About', 'אודות', 'Our story, values and the Arava.', 'הסיפור, הערכים והערבה.'],
  ['products.html', 'M5 8h14l-1 12H6L5 8z M9 8a3 3 0 016 0', 'Products', 'מוצרים', 'Peppers, tomatoes and melons.', 'פלפלים, עגבניות ומלונים.'],
  ['process.html', 'M4 12h16 M14 6l6 6-6 6', 'Process', 'תהליך', 'From the field to your shelf.', 'מהשדה אל המדף.'],
  ['quality.html', 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z M9 12l2 2 4-4', 'Quality', 'איכות', 'Food safety and traceability.', 'בטיחות מזון ועקיבות.'],
  ['contact.html', 'M4 6h16v12H4z M4 7l8 6 8-6', 'Contact', 'יצירת קשר', 'Talk to our team.', 'דברו עם הצוות שלנו.'],
];
const EXPLORE = `<section class="section section--cream">
  <div class="wrap">
    <div class="section-head center reveal">
      <span class="eyebrow" data-en="Discover Gilad" data-he="הכירו את גלעד">Discover Gilad</span>
      <h2 class="title" data-en="Explore our world" data-he="סיור באתר">Explore our world</h2>
    </div>
    <div class="values">
${EXPLORE_CARDS.map(([href, d, en, he, ben, bhe]) => `      <a class="value-card" href="${href}">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg></div>
        <h3 data-en="${en}" data-he="${he}">${he}</h3>
        <p data-en="${ben}" data-he="${bhe}">${bhe}</p>
      </a>`).join('\n')}
    </div>
  </div>
</section>`;

// Growers portal — redesigned hub linking to the recovered resource pages (in ../)
const GROWER_CARDS = [
  ['../growers-water-tests.html', 'M12 3c4 5 6 8 6 11a6 6 0 11-12 0c0-3 2-6 6-11z', 'Water tests', 'בדיקות מים', 'Lab water-quality results.', 'תוצאות בדיקות איכות מים.'],
  ['../growers-product-specs.html', 'M7 3h7l4 4v14H7z M14 3v4h4 M9 12h6 M9 16h6', 'Product specs', 'מפרטי מוצר', 'Specifications for each product.', 'מפרטים לכל מוצר.'],
  ['../growers-procedures.html', 'M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5', 'Procedures', 'נהלים', 'Growing & packing procedures.', 'נהלי גידול ואריזה.'],
  ['../growers-training.html', 'M3 8l9-4 9 4-9 4-9-4z M7 10v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5', 'Training', 'תיק הדרכות', 'Training materials & guides.', 'חומרי הדרכה ומדריכים.'],
  ['../growers-forms.html', 'M6 3h9l3 3v15H6z M9 11h6 M9 15h6 M9 7h3', 'Forms', 'תיק טפסים', 'Downloadable forms.', 'טפסים להורדה.'],
  ['../growers-varieties-program.html', 'M12 21c0-6 3-10 8-11-1 6-4 9-8 11z M12 21c0-5-2-8-6-9 1 5 3 7 6 9z M12 21V10', 'Variety program', 'תוכנית זנים', 'Seasonal variety plans.', 'תוכניות זנים עונתיות.'],
  ['../growers-management-software.html', 'M3 4h18v12H3z M3 16l3 4h12l3-4 M9 9l2 2 4-4', 'Management software', 'תוכנת ניהול', 'Farm management system.', 'מערכת ניהול חוות.'],
  ['../growers-reports.html', 'M5 20V10 M12 20V4 M19 20v-7', 'Reports & marketing', 'דוחות ושיווק', 'Grower reports & marketing.', 'דוחות מגדלים ושיווק.'],
  ['../cams.html', 'M3 7h11l3 3v7H3z M17 11l4-2v7l-4-2', 'Cameras', 'מצלמות', 'Live field & facility cams.', 'מצלמות שדה ומתקנים.'],
];
const GROWERS_PAGE = `<section class="section section--cream">
  <div class="wrap">
    <div class="section-head center reveal">
      <span class="eyebrow" data-en="For our growers" data-he="אזור מגדלים">For our growers</span>
      <h2 class="title" data-en="Growers portal" data-he="פורטל המגדלים">Growers portal</h2>
      <p class="lead" data-en="Everything our growers need, in one place — water tests, product specs, procedures, forms, training and more." data-he="כל מה שהמגדלים שלנו צריכים, במקום אחד — בדיקות מים, מפרטי מוצר, נהלים, טפסים, הדרכות ועוד.">Everything our growers need, in one place.</p>
    </div>
    <div class="values">
${GROWER_CARDS.map(([href, d, en, he, ben, bhe]) => `      <a class="value-card" href="#">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg></div>
        <h3 data-en="${en}" data-he="${he}">${he}</h3>
        <p data-en="${ben}" data-he="${bhe}">${bhe}</p>
      </a>`).join('\n')}
    </div>
    <p style="text-align:center; color:var(--ink-2); margin-top:34px; font-size:.95rem;" data-en="The growers portal is a restricted area for Gilad growers." data-he="פורטל המגדלים הוא אזור מוגבל למגדלי גלעד.">The growers portal is a restricted area for Gilad growers.</p>
  </div>
</section>`;

function page(bodyClass, cur, headHtml, bodyHtml) {
  return `${headHtml}
<body${bodyClass ? ' class="' + bodyClass + '"' : ''}>

${header(cur)}

${bodyHtml}

${FOOTER}

<script src="app.js"></script>
</body>
</html>
`;
}

const B = 'גלעד תוצרת מדבר';
write('index.html', page('', 'home',
  head('Gilad Desert Produce — Premium peppers, tomatoes &amp; melons from the Arava', `${B} — פלפלים, עגבניות ומלונים מהערבה`,
    "Premium desert-grown produce exported fresh to leading supermarkets worldwide.", 'תוצרת מדברית משובחת המיוצאת טרייה לרשתות המובילות בעולם.'),
  `${SEC.hero}\n\n${EXPLORE}\n\n${SEC.growers}`));

write('about.html', page('inner', 'about',
  head('About — Gilad Desert Produce', `אודות — ${B}`, 'Rooted in the Arava: our story, values and commitment to quality.', 'שורשים בערבה: הסיפור, הערכים והמחויבות לאיכות.'),
  SEC.about));

write('products.html', page('inner', 'products',
  head('Products — Gilad Desert Produce', `מוצרים — ${B}`, 'Peppers, tomatoes and melons in conventional and organic lines.', 'פלפלים, עגבניות ומלונים בקווים קונבנציונליים ואורגניים.'),
  SEC.products));

write('process.html', page('inner', 'process',
  head('Process — Gilad Desert Produce', `התהליך — ${B}`, 'From the field to your shelf in six steps.', 'מהשדה אל המדף בשישה שלבים.'),
  SEC.process));

write('quality.html', page('inner', 'quality',
  head('Quality — Gilad Desert Produce', `איכות — ${B}`, 'Food safety, residue testing and full traceability.', 'בטיחות מזון, בדיקות שאריות ועקיבות מלאה.'),
  SEC.quality));

write('contact.html', page('inner', 'contact',
  head('Contact — Gilad Desert Produce', `יצירת קשר — ${B}`, 'Talk to our team in Israel and Europe.', 'דברו עם הצוות שלנו בישראל ובאירופה.'),
  SEC.contact));

write('growers.html', page('inner', 'growers',
  head('Growers — Gilad Desert Produce', `מגדלים — ${B}`, 'The growers portal: water tests, specs, procedures, forms and more.', 'פורטל המגדלים: בדיקות מים, מפרטים, נהלים, טפסים ועוד.'),
  GROWERS_PAGE));

console.log('Built: index, about, products, process, quality, contact, growers');
