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
<link rel="icon" type="image/png" href="images/icon.png?v=2">
<link rel="apple-touch-icon" href="images/icon.png?v=2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=Heebo:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="accessibility.css">
</head>`;
}

function header(cur) {
  const links = NAV.map(([href, en, he, key]) =>
    `      <a href="${href}"${key === cur ? ' class="current"' : ''} data-en="${en}" data-he="${he}">${he}</a>`
  ).join('\n');
  return `<header class="header" id="header">
  <div class="wrap nav">
    <div class="nav-brand-group">
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <a href="index.html" class="brand" aria-label="Gilad Desert Produce"><img src="images/Gilad.png" alt="Gilad Desert Produce"></a>
    </div>
    <nav class="nav-links" id="navLinks">
${links}
    </nav>
    <div class="nav-actions">
      <a href="contact.html" class="btn btn--primary nav-cta"><span data-en="Contact" data-he="יצירת קשר">Contact</span><svg class="plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></a>
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
    </div>
  </div>
</header>

<div class="drawer-backdrop" id="drawerBackdrop"></div>
<aside class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer-top">
    <a href="index.html" class="brand"><img src="images/Gilad.png" alt="Gilad Desert Produce"></a>
    <button class="drawer-close" id="drawerClose" aria-label="Close">&times;</button>
  </div>
  <nav class="drawer-links">
${links}
  </nav>
  <div class="drawer-foot">
    <a href="contact.html" class="btn btn--primary"><span data-en="Contact" data-he="יצירת קשר">Contact</span><svg class="plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></a>
    <div class="drawer-lang">
      <button class="lang-opt" data-lang="he">עברית</button>
      <button class="lang-opt" data-lang="en">English</button>
    </div>
  </div>
</aside>`;
}

const FOOTER = `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-col">
        <img src="images/Gilad.png" alt="Gilad Desert Produce">
        <p class="footer-tagline" data-en="Premium desert-grown produce, delivered fresh to the world's leading supermarkets." data-he="תוצרת מדברית משובחת, מגיעה טרייה לרשתות המובילות בעולם.">Premium desert-grown produce, delivered fresh to the world's leading supermarkets.</p>
      </div>
      <div class="footer-sitemap">
        <div class="sitemap-title"><span data-en="Site map" data-he="מפת האתר">מפת האתר</span></div>
        <div class="footer-cols2">
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
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year"></span> <span data-en="All rights reserved to Gilad Desert Produce Ltd" data-he="כל הזכויות שמורות ל-Gilad Desert Produce Ltd">All rights reserved to Gilad Desert Produce Ltd</span></span>
      <span class="footer-legal"><a href="accessibility-statement.html" data-en="Accessibility statement" data-he="הצהרת נגישות">הצהרת נגישות</a><a href="privacy-policy.html" data-en="Privacy policy" data-he="מדיניות פרטיות">מדיניות פרטיות</a></span>
      <a class="credit" href="https://ombee.co.il" target="_blank" rel="noopener" aria-label="OMBee — ombee.co.il">
        <span data-en="Design &amp; build by:" data-he="עיצוב ובנייה ע״י:">Design &amp; build by:</span>
        <img src="images/ombee-logo.png" alt="OMBee">
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

const STATEMENT_PAGE = `<section class="section section--cream">
  <div class="wrap legal">
    <h1 data-en="Accessibility Statement" data-he="הצהרת נגישות">Accessibility Statement</h1>
    <p class="lead" data-en="Gilad Desert Produce is committed to equal, accessible service for all visitors, and works to make its website usable by people with disabilities." data-he="גלעד תוצרת מדבר רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשים, ופועלת להנגשת אתר האינטרנט שלה לאנשים עם מוגבלות.">Gilad Desert Produce is committed to equal, accessible service for all visitors.</p>
    <h2 data-en="Our commitment" data-he="המחויבות שלנו">Our commitment</h2>
    <p data-en="We strive for this site to meet the Equal Rights for Persons with Disabilities Regulations (2013) and Israeli Standard IS 5568 at level AA, based on the W3C WCAG 2.0 guidelines." data-he="אנו שואפים שאתר זה יעמוד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג‑2013, ובתקן הישראלי ת״י 5568 ברמת AA, המבוסס על הנחיות WCAG 2.0.">We strive for this site to meet IS 5568 level AA (WCAG 2.0).</p>
    <h2 data-en="Accessibility features" data-he="התאמות הנגישות באתר">Accessibility features</h2>
    <p data-en="The site includes an accessibility menu (a button at the corner of the screen) that lets you, among other things:" data-he="האתר כולל תפריט נגישות (לחצן בפינת המסך) המאפשר, בין היתר:">The site includes an accessibility menu that lets you, among other things:</p>
    <ul>
      <li data-en="Adjust contrast and colours" data-he="שינוי ניגודיות וגוונים">Adjust contrast and colours</li>
      <li data-en="Enlarge text, letter spacing and line height" data-he="הגדלת טקסט, ריווח אותיות וגובה שורה">Enlarge text, letter spacing and line height</li>
      <li data-en="Highlight links and show descriptions" data-he="הדגשת קישורים והצגת תיאורים">Highlight links and show descriptions</li>
      <li data-en="Stop animations, hide images and enlarge the cursor" data-he="עצירת הנפשות, הסתרת תמונות וסמן מוגדל">Stop animations, hide images and enlarge the cursor</li>
      <li data-en="Switch to a dyslexia-friendly font" data-he="מעבר לגופן ידידותי לדיסלקציה">Switch to a dyslexia-friendly font</li>
    </ul>
    <p data-en="The site is also built with semantic structure, supports keyboard navigation and is responsive across devices." data-he="בנוסף, האתר נבנה במבנה סמנטי, ניתן לניווט במקלדת ומותאם לתצוגה במגוון מסכים ומכשירים.">The site is built with semantic structure, keyboard navigation and responsive design.</p>
    <h2 data-en="Limitations" data-he="החרגות ומגבלות">Limitations</h2>
    <p data-en="Some parts of the site, or third-party content, may not be fully accessible. We continue to improve accessibility on an ongoing basis." data-he="ייתכן שחלקים מסוימים באתר, או תכנים של צד שלישי, אינם נגישים במלואם. אנו ממשיכים לשפר את הנגישות באופן שוטף.">Some parts, or third-party content, may not be fully accessible; we keep improving.</p>
    <h2 data-en="Contact &amp; accessibility coordinator" data-he="פנייה ורכז נגישות">Contact &amp; accessibility coordinator</h2>
    <p data-en="For any question, request or report of an accessibility issue, please contact our accessibility coordinator:" data-he="בכל שאלה, בקשה או דיווח על בעיית נגישות ניתן לפנות אל רכז/ת הנגישות:">For any accessibility issue, contact our accessibility coordinator:</p>
    <ul>
      <li data-en="Phone: 08-6582515" data-he="טלפון: 08-6582515">Phone: 08-6582515</li>
      <li data-en="Email: eyal@giladltd.co.il" data-he="דוא״ל: eyal@giladltd.co.il">Email: eyal@giladltd.co.il</li>
      <li data-en="Address: Ein Yahav, Central Arava" data-he="כתובת: עין יהב, הערבה התיכונה">Address: Ein Yahav, Central Arava</li>
    </ul>
    <p class="updated" data-en="This statement was last updated in June 2026." data-he="הצהרת הנגישות עודכנה לאחרונה ביוני 2026.">Last updated June 2026.</p>
  </div>
</section>`;

const PRIVACY_PAGE = `<section class="section section--cream">
  <div class="wrap legal">
    <h1 data-en="Privacy Policy" data-he="מדיניות פרטיות">Privacy Policy</h1>
    <p class="lead" data-en="This policy explains how Gilad Desert Produce collects, uses and protects information when you use this website." data-he="מדיניות זו מסבירה כיצד גלעד תוצרת מדבר אוספת, משתמשת ושומרת מידע במסגרת השימוש באתר זה.">How Gilad Desert Produce collects, uses and protects your information.</p>
    <h2 data-en="Information we collect" data-he="איזה מידע אנו אוספים">Information we collect</h2>
    <p data-en="Information you choose to provide via the contact form (name, email, subject and message), and technical information collected automatically such as browser type, pages viewed and general usage data." data-he="מידע שתמסרו מרצונכם בטופס יצירת הקשר (שם, דוא״ל, נושא ותוכן הפנייה), וכן מידע טכני הנאסף אוטומטית כגון סוג דפדפן, עמודים שנצפו ונתוני שימוש כלליים.">Contact-form details you provide, plus automatic technical/usage data.</p>
    <h2 data-en="How we use information" data-he="שימוש במידע">How we use information</h2>
    <p data-en="To respond to enquiries, provide service and improve the website experience. We do not sell personal information to third parties." data-he="המידע משמש למענה לפניות, למתן שירות ולשיפור חוויית השימוש באתר. איננו מוכרים מידע אישי לצדדים שלישיים.">To respond to enquiries and improve the site. We do not sell personal information.</p>
    <h2 data-en="Cookies &amp; preferences" data-he="עוגיות והעדפות">Cookies &amp; preferences</h2>
    <p data-en="The site may use cookies essential to its operation. Your accessibility-menu and language preferences are stored locally in your browser and are not sent to us." data-he="האתר עשוי לעשות שימוש בעוגיות חיוניות לתפעולו. העדפות תפריט הנגישות והשפה נשמרות מקומית בדפדפן שלכם ואינן נשלחות אלינו.">Essential cookies only; accessibility and language preferences stay in your browser.</p>
    <h2 data-en="Security &amp; retention" data-he="אבטחה ושמירת מידע">Security &amp; retention</h2>
    <p data-en="We take reasonable measures to protect the information and keep it only for as long as needed for the purposes for which it was collected." data-he="אנו נוקטים אמצעים סבירים להגנה על המידע, ושומרים אותו רק למשך הזמן הנדרש למטרות שלשמן נאסף.">We protect the data and keep it only as long as needed.</p>
    <h2 data-en="Your rights" data-he="הזכויות שלכם">Your rights</h2>
    <p data-en="You may contact us at any time to review the information collected about you, correct it, or request its deletion." data-he="באפשרותכם לפנות אלינו בכל עת כדי לעיין במידע שנאסף עליכם, לתקנו או לבקש את מחיקתו.">Contact us to review, correct or delete your information.</p>
    <h2 data-en="Contact" data-he="יצירת קשר">Contact</h2>
    <p data-en="For privacy questions contact: eyal@giladltd.co.il · 08-6582515." data-he="בשאלות בנושא פרטיות ניתן לפנות אל: eyal@giladltd.co.il · 08-6582515.">For privacy questions: eyal@giladltd.co.il · 08-6582515.</p>
    <p class="updated" data-en="This policy was last updated in June 2026." data-he="המדיניות עודכנה לאחרונה ביוני 2026.">Last updated June 2026.</p>
  </div>
</section>`;

function page(bodyClass, cur, headHtml, bodyHtml) {
  return `${headHtml}
<body${bodyClass ? ' class="' + bodyClass + '"' : ''}>

${header(cur)}

${bodyHtml}

${FOOTER}

<script src="accessibility.js"></script>
<script src="app.js"></script>
</body>
</html>
`;
}

const B = 'גלעד תוצרת מדבר בע״מ';
const BE = 'Gilad Desert Produce Ltd';
write('index.html', page('', 'home',
  head(`${BE} - Home`, `${B} - בית`,
    "Premium desert-grown produce exported fresh to leading supermarkets worldwide.", 'תוצרת מדברית משובחת המיוצאת טרייה לרשתות המובילות בעולם.'),
  `${SEC.hero}\n\n${EXPLORE}\n\n${SEC.growers}`));

write('about.html', page('inner', 'about',
  head(`${BE} - About`, `${B} - אודות`, 'Rooted in the Arava: our story, values and commitment to quality.', 'שורשים בערבה: הסיפור, הערכים והמחויבות לאיכות.'),
  SEC.about));

write('products.html', page('inner', 'products',
  head(`${BE} - Products`, `${B} - מוצרים`, 'Peppers, tomatoes and melons in conventional and organic lines.', 'פלפלים, עגבניות ומלונים בקווים קונבנציונליים ואורגניים.'),
  SEC.products));

write('process.html', page('inner', 'process',
  head(`${BE} - Process`, `${B} - תהליך`, 'From the field to your shelf in six steps.', 'מהשדה אל המדף בשישה שלבים.'),
  SEC.process));

write('quality.html', page('inner', 'quality',
  head(`${BE} - Quality`, `${B} - איכות`, 'Food safety, residue testing and full traceability.', 'בטיחות מזון, בדיקות שאריות ועקיבות מלאה.'),
  SEC.quality));

write('contact.html', page('inner', 'contact',
  head(`${BE} - Contact`, `${B} - יצירת קשר`, 'Talk to our team in Israel and Europe.', 'דברו עם הצוות שלנו בישראל ובאירופה.'),
  SEC.contact));

write('growers.html', page('inner', 'growers',
  head(`${BE} - Growers`, `${B} - מגדלים`, 'The growers portal: water tests, specs, procedures, forms and more.', 'פורטל המגדלים: בדיקות מים, מפרטים, נהלים, טפסים ועוד.'),
  GROWERS_PAGE));

write('accessibility-statement.html', page('inner', '',
  head(`${BE} - Accessibility Statement`, `${B} - הצהרת נגישות`, 'Our commitment to web accessibility and how to report an issue.', 'המחויבות שלנו לנגישות האתר וכיצד לדווח על בעיה.'),
  STATEMENT_PAGE));

write('privacy-policy.html', page('inner', '',
  head(`${BE} - Privacy Policy`, `${B} - מדיניות פרטיות`, 'How we collect, use and protect your information.', 'כיצד אנו אוספים, משתמשים ושומרים את המידע שלכם.'),
  PRIVACY_PAGE));

console.log('Built: index, about, products, process, quality, contact, growers, accessibility-statement, privacy-policy');
