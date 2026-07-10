// Split the one-page site into separate pages, reusing the existing section
// markup (so all bilingual content is preserved verbatim) with a shared
// header + footer. Run with: node build-pages.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(DIR, f), s);
// Base URL for canonical + hreflang (absolute, per Google). Update if a custom domain is connected.
const SITE = 'https://ombee-hub.github.io/Gilad.co.il';

// Source of truth: the one-page source is embedded below as SRC (formerly the
// separate _source.html file). The idempotent fixes below still run on it.
const SRC = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>
  /* Set language/direction before first paint (default Hebrew) and hide content until translated. */
  (function () {
    var l = 'he';
    try { l = localStorage.getItem('gilad-site-lang') || 'he'; } catch (e) {}
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
    document.documentElement.className += ' pre';
    setTimeout(function () { document.documentElement.classList.remove('pre'); }, 1500);
  })();
</script>
<title data-en="Gilad Desert Produce — Premium peppers, tomatoes &amp; melons from the Arava" data-he="גלעד תוצרת מדבר — פלפלים, עגבניות ומלונים מובחרים מהערבה">Gilad Desert Produce</title>
<meta name="description" data-en="Premium desert-grown peppers, tomatoes and melons, exported fresh to leading supermarkets in Europe, the UK, USA, Canada and Russia." data-he="פלפלים, עגבניות ומלונים מובחרים מהמדבר, מיוצאים טריים לרשתות המובילות באירופה, בריטניה, ארה״ב, קנדה ורוסיה.">
<link rel="icon" href="images/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=Heebo:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<!-- ============ HEADER ============ -->
<header class="header" id="header">
  <div class="wrap nav">
    <a href="#home" class="brand" aria-label="Gilad Desert Produce"><img src="images/logo.png" alt="Gilad Desert Produce"></a>
    <nav class="nav-links" id="navLinks">
      <a href="#about"    data-en="About"    data-he="אודות">About</a>
      <a href="#products" data-en="Products" data-he="מוצרים">Products</a>
      <a href="#process"  data-en="Process"  data-he="תהליך">Process</a>
      <a href="#quality"  data-en="Quality"  data-he="איכות">Quality</a>
      <a href="#growers"  data-en="Growers"  data-he="מגדלים">Growers</a>
      <a href="#contact"  data-en="Contact"  data-he="יצירת קשר">Contact</a>
    </nav>
    <div class="nav-actions">
      <button class="lang-toggle" id="langToggle" aria-label="Switch language">עברית</button>
      <a href="#contact" class="btn btn--primary nav-cta" data-en="Get a quote" data-he="לקבלת הצעה">Get a quote</a>
      <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<!-- ============ HERO ============ -->
<section class="hero" id="home">
  <div class="hero__bg"><img src="images/hero-arava.jpg" alt="Aerial view of Gilad's farms in the Arava desert"></div>
  <div class="wrap hero__inner">
    <h1 data-en-html="The finest fresh produce,<br><em>grown in the desert</em>" data-he-html="התוצרת הטרייה המשובחת,<br><em>שגדלה במדבר</em>">The finest fresh produce,<br><em>grown in the desert</em></h1>
    <p data-en="Gilad Desert Produce grows and exports premium peppers, tomatoes and melons from Israel's Central Arava to the most prestigious supermarkets across Europe, the UK, USA, Canada and Russia." data-he="גלעד תוצרת מדבר מגדלת ומייצאת פלפלים, עגבניות ומלונים מובחרים מהערבה התיכונה אל רשתות הסופרמרקטים היוקרתיות באירופה, בריטניה, ארה״ב, קנדה ורוסיה.">Gilad Desert Produce grows and exports premium peppers, tomatoes and melons from Israel's Central Arava to the most prestigious supermarkets across Europe, the UK, USA, Canada and Russia.</p>
    <div class="hero__cta">
      <a href="#products" class="btn btn--primary" data-en="Explore our produce" data-he="לתוצרת שלנו">Explore our produce
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a href="#contact" class="btn btn--ghost"><span data-en="Get in touch" data-he="יצירת קשר">Get in touch</span><svg class="plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></a>
    </div>
  </div>
  </section>

<!-- ============ ABOUT ============ -->
<section class="section section--cream" id="about">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-copy reveal">
        <span class="eyebrow" data-en="Who we are" data-he="מי אנחנו">Who we are</span>
        <h2 class="title" data-en="Rooted in the Arava, delivered to the world" data-he="שורשים בערבה, מגיעים לעולם">Rooted in the Arava, delivered to the world</h2>
        <p class="lead" data-en="For decades, Gilad Desert Produce has turned the challenge of desert farming into a source of exceptional fresh produce. Working hand-in-hand with our growers in the Central Arava, we plan, grow, pack and ship vegetables of the highest quality." data-he="במשך עשורים הופכת גלעד תוצרת מדבר את האתגר של חקלאות מדברית למקור לתוצרת טרייה יוצאת דופן. בעבודה צמודה עם המגדלים בערבה התיכונה, אנחנו מתכננים, מגדלים, אורזים ומשווקים ירקות באיכות הגבוהה ביותר.">For decades, Gilad Desert Produce has turned the challenge of desert farming into a source of exceptional fresh produce.</p>
        <p data-en="Our commitment goes beyond the produce itself: protecting the environment, reducing chemical use, ensuring full traceability and maintaining fair conditions for every worker." data-he="המחויבות שלנו רחבה מהתוצרת עצמה: שמירה על הסביבה, צמצום השימוש בחומרי הדברה, עקיבות מלאה ותנאים הוגנים לכל עובד ועובדת.">Our commitment goes beyond the produce itself.</p>
      </div>
      <div class="about-figure reveal">
        <img src="images/hero-arava.jpg" alt="Gilad's greenhouses spread across the Arava desert">
        <div class="about-badge">
          <strong data-en="Central Arava" data-he="הערבה התיכונה">Central Arava</strong>
          <span data-en="Sun-grown in the Israeli desert" data-he="גדל בשמש במדבר הישראלי">Sun-grown in the Israeli desert</span>
        </div>
      </div>
    </div>

    <div class="values">
      <div class="value-card reveal">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <h3 data-en="Quality &amp; food safety" data-he="איכות ובטיחות מזון">Quality &amp; food safety</h3>
        <p data-en="A safe, premium product is at the heart of everything we grow and pack." data-he="מוצר בטוח ומשובח עומד בלב כל מה שאנחנו מגדלים ואורזים.">A safe, premium product is at the heart of everything we grow and pack.</p>
      </div>
      <div class="value-card reveal">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
        <h3 data-en="Full traceability" data-he="עקיבות מלאה">Full traceability</h3>
        <p data-en="Every batch is traceable from the supermarket shelf back to the field." data-he="כל משלוח ניתן למעקב ממדף הסופרמרקט ועד לשדה.">Every batch is traceable from the supermarket shelf back to the field.</p>
      </div>
      <div class="value-card reveal">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5-4 8-8 8-12a8 8 0 10-16 0c0 4 3 8 8 12z"/><path d="M12 4c0 5-3 8-3 8"/></svg></div>
        <h3 data-en="Integrated pest management" data-he="הדברה משולבת">Integrated pest management</h3>
        <p data-en="We minimise chemicals through biological and integrated pest control." data-he="אנחנו ממזערים שימוש בכימיקלים באמצעות הדברה ביולוגית ומשולבת.">We minimise chemicals through biological and integrated pest control.</p>
      </div>
      <div class="value-card reveal">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-5 9 5-9 5-9-5z"/><path d="M3 9v6l9 5 9-5V9"/></svg></div>
        <h3 data-en="Centralized packing" data-he="אריזה מרוכזת">Centralized packing</h3>
        <p data-en="A single modern packing house keeps quality consistent and costs efficient." data-he="בית אריזה מודרני אחד שומר על איכות אחידה ויעילות בעלויות.">A single modern packing house keeps quality consistent and costs efficient.</p>
      </div>
      <div class="value-card reveal">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6h13v9H1zM14 9h4l3 3v3h-7z"/><circle cx="5.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg></div>
        <h3 data-en="Reliable logistics" data-he="לוגיסטיקה אמינה">Reliable logistics</h3>
        <p data-en="A dependable cold chain delivers fresh produce on time, every time." data-he="שרשרת קירור אמינה שמספקת תוצרת טרייה בזמן, בכל פעם.">A dependable cold chain delivers fresh produce on time, every time.</p>
      </div>
      <div class="value-card reveal">
        <div class="value-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="10" r="2.6"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M15 19c0-2 1-3.4 2.5-3.8"/></svg></div>
        <h3 data-en="Partnership with growers" data-he="שותפות עם המגדלים">Partnership with growers</h3>
        <p data-en="We plan each farm together with its grower and purchase inputs centrally." data-he="אנחנו מתכננים כל חווה יחד עם המגדל ורוכשים תשומות באופן מרוכז.">We plan each farm together with its grower and purchase inputs centrally.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ PRODUCTS ============ -->
<section class="section" id="products">
  <div class="wrap">
    <div class="section-head center reveal">
      <span class="eyebrow" data-en="What we grow" data-he="מה אנחנו מגדלים">What we grow</span>
      <h2 class="title" data-en="Our produce" data-he="התוצרת שלנו">Our produce</h2>
      <p class="lead" data-en="Peppers, tomatoes and melons — in conventional and certified-organic lines." data-he="פלפלים, עגבניות ומלונים — בקווים קונבנציונליים ואורגניים מאושרים.">Peppers, tomatoes and melons — in conventional and certified-organic lines.</p>
    </div>

    <div style="text-align:center">
      <div class="tabs" id="tabs">
        <button class="tab active" data-cat="all" data-en="All" data-he="הכל">All</button>
        <button class="tab" data-cat="con" data-en="Conventional" data-he="קונבנציונלי">Conventional</button>
        <button class="tab" data-cat="org" data-en="Organic" data-he="אורגני">Organic</button>
      </div>
    </div>

    <div class="products-grid" id="grid">
      <article class="product reveal" data-cat="con">
        <div class="product__img"><img src="images/pepper-red.jpg" alt="Red bell pepper"></div>
        <div class="product__body"><span class="product__tag tag-con" data-en="Conventional" data-he="קונבנציונלי">Conventional</span>
          <h3 data-en="Red Bell Pepper" data-he="פלפל אדום">Red Bell Pepper</h3>
          <p data-en="Sweet, thick-walled and vivid red." data-he="מתוק, בשרני ואדום עז.">Sweet, thick-walled and vivid red.</p></div>
      </article>
      <article class="product reveal" data-cat="con">
        <div class="product__img"><img src="images/pepper-orange.jpg" alt="Orange bell pepper"></div>
        <div class="product__body"><span class="product__tag tag-con" data-en="Conventional" data-he="קונבנציונלי">Conventional</span>
          <h3 data-en="Orange Bell Pepper" data-he="פלפל כתום">Orange Bell Pepper</h3>
          <p data-en="Crisp, colourful and naturally sweet." data-he="פריך, צבעוני ומתוק מטבעו.">Crisp, colourful and naturally sweet.</p></div>
      </article>
      <article class="product reveal" data-cat="con">
        <div class="product__img"><img src="images/pepper-yellow.jpg" alt="Yellow bell pepper"></div>
        <div class="product__body"><span class="product__tag tag-con" data-en="Conventional" data-he="קונבנציונלי">Conventional</span>
          <h3 data-en="Yellow Bell Pepper" data-he="פלפל צהוב">Yellow Bell Pepper</h3>
          <p data-en="Bright, juicy and mild." data-he="בהיר, עסיסי ועדין.">Bright, juicy and mild.</p></div>
      </article>
      <article class="product reveal" data-cat="con">
        <div class="product__img"><img src="images/chili.jpg" alt="Red chili peppers"></div>
        <div class="product__body"><span class="product__tag tag-con" data-en="Conventional" data-he="קונבנציונלי">Conventional</span>
          <h3 data-en="Hot Chili Pepper" data-he="פלפל צ'ילי חריף">Hot Chili Pepper</h3>
          <p data-en="Fiery, aromatic and deep red." data-he="חריף, ארומטי ואדום עמוק.">Fiery, aromatic and deep red.</p></div>
      </article>
      <article class="product reveal" data-cat="con">
        <div class="product__img"><img src="images/tomatoes.jpg" alt="Tomatoes on the vine"></div>
        <div class="product__body"><span class="product__tag tag-con" data-en="Conventional" data-he="קונבנציונלי">Conventional</span>
          <h3 data-en="Tomatoes on the Vine" data-he="עגבניות מקבץ">Tomatoes on the Vine</h3>
          <p data-en="Vine-ripened, full of flavour." data-he="הבשילו על הגפן, מלאות טעם.">Vine-ripened, full of flavour.</p></div>
      </article>
      <article class="product reveal" data-cat="con">
        <div class="product__img"><img src="images/cherry-vine.jpg" alt="Cherry tomatoes on the vine"></div>
        <div class="product__body"><span class="product__tag tag-con" data-en="Conventional" data-he="קונבנציונלי">Conventional</span>
          <h3 data-en="Cherry Tomatoes" data-he="עגבניות שרי">Cherry Tomatoes</h3>
          <p data-en="Small, sweet and snackable — loose or on the vine." data-he="קטנות, מתוקות ומושלמות לנשנוש — בודדות או על הגפן.">Small, sweet and snackable — loose or on the vine.</p></div>
      </article>
      <article class="product reveal" data-cat="con">
        <div class="product__img"><img src="images/melon.jpg" alt="Galia melons"></div>
        <div class="product__body"><span class="product__tag tag-con" data-en="Conventional" data-he="קונבנציונלי">Conventional</span>
          <h3 data-en="Galia Melon" data-he="מלון גליה">Galia Melon</h3>
          <p data-en="Fragrant, netted and irresistibly sweet." data-he="ריחני, רשתי ומתוק במיוחד.">Fragrant, netted and irresistibly sweet.</p></div>
      </article>
      <article class="product reveal" data-cat="org">
        <div class="product__img"><img src="images/organic-box.jpg" alt="Organic bell peppers in a Gilad box"></div>
        <div class="product__body"><span class="product__tag tag-org" data-en="Organic" data-he="אורגני">Organic</span>
          <h3 data-en="Organic Bell Peppers" data-he="פלפלים אורגניים">Organic Bell Peppers</h3>
          <p data-en="Certified-organic peppers in red, orange and yellow." data-he="פלפלים אורגניים מאושרים באדום, כתום וצהוב.">Certified-organic peppers in red, orange and yellow.</p></div>
      </article>
      <article class="product reveal" data-cat="org">
        <div class="product__img"><img src="images/tomatoes.jpg" alt="Organic tomatoes"></div>
        <div class="product__body"><span class="product__tag tag-org" data-en="Organic" data-he="אורגני">Organic</span>
          <h3 data-en="Organic Tomatoes" data-he="עגבניות אורגניות">Organic Tomatoes</h3>
          <p data-en="Vine tomatoes grown to organic standards." data-he="עגבניות מקבץ שגדלו בתקן אורגני.">Vine tomatoes grown to organic standards.</p></div>
      </article>
      <article class="product reveal" data-cat="org">
        <div class="product__img"><img src="images/cherry-vine.jpg" alt="Organic cherry tomatoes"></div>
        <div class="product__body"><span class="product__tag tag-org" data-en="Organic" data-he="אורגני">Organic</span>
          <h3 data-en="Organic Cherry Tomatoes" data-he="עגבניות שרי אורגניות">Organic Cherry Tomatoes</h3>
          <p data-en="Sweet organic cherries, loose or on the vine." data-he="שרי אורגניות מתוקות, בודדות או על הגפן.">Sweet organic cherries, loose or on the vine.</p></div>
      </article>
    </div>
  </div>
</section>

<!-- ============ PROCESS ============ -->
<section class="section section--process" id="process">
  <div class="wrap">
    <div class="section-head center reveal">
      <span class="eyebrow" data-en="How it works" data-he="איך זה עובד">How it works</span>
      <h2 class="title" data-en="From the field to your shelf" data-he="מהשדה אל המדף שלכם">From the field to your shelf</h2>
      <p class="lead" data-en="Six steps connect a desert farm to a supermarket in Europe." data-he="שישה שלבים מחברים חווה במדבר לסופרמרקט באירופה.">Six steps connect a desert farm to a supermarket in Europe.</p>
    </div>
    <div class="steps reveal">
      <div class="step"><div class="step__n">1</div><h3 data-en="Grow" data-he="גידול">Grow</h3><p data-en="Sun-grown in the Arava" data-he="בשמש הערבה">Sun-grown in the Arava</p></div>
      <div class="step"><div class="step__n">2</div><h3 data-en="Harvest" data-he="קטיף">Harvest</h3><p data-en="Picked at peak ripeness" data-he="בשיא הבשלות">Picked at peak ripeness</p></div>
      <div class="step"><div class="step__n">3</div><h3 data-en="Pack" data-he="אריזה">Pack</h3><p data-en="Sorted in our packing house" data-he="מיון בבית האריזה">Sorted in our packing house</p></div>
      <div class="step"><div class="step__n">4</div><h3 data-en="Inspect" data-he="בקרה">Inspect</h3><p data-en="Quality &amp; residue checks" data-he="בדיקות איכות ושאריות">Quality &amp; residue checks</p></div>
      <div class="step"><div class="step__n">5</div><h3 data-en="Ship" data-he="שילוח">Ship</h3><p data-en="Cold-chain logistics" data-he="שרשרת קירור">Cold-chain logistics</p></div>
      <div class="step"><div class="step__n">6</div><h3 data-en="Shelf" data-he="מדף">Shelf</h3><p data-en="On supermarket shelves" data-he="על מדפי הסופרמרקט">On supermarket shelves</p></div>
    </div>
    <div class="process-imgs reveal">
      <figure><img src="images/packing-house.jpg" alt="Workers sorting peppers in Gilad's packing house"><figcaption data-en="Our central packing house" data-he="בית האריזה המרכזי שלנו">Our central packing house</figcaption></figure>
      <figure><img src="images/logistics-truck.jpg" alt="Gilad refrigerated delivery truck"><figcaption data-en="Cold-chain delivery, field to shelf" data-he="הפצה בשרשרת קירור, מהשדה למדף">Cold-chain delivery, field to shelf</figcaption></figure>
    </div>
  </div>
</section>

<!-- ============ QUALITY ============ -->
<section class="section section--sand" id="quality">
  <div class="wrap">
    <div class="quality-grid">
      <div class="reveal">
        <span class="eyebrow" data-en="Quality assurance" data-he="הבטחת איכות">Quality assurance</span>
        <h2 class="title" data-en="Quality you can trace" data-he="איכות שאפשר לעקוב אחריה">Quality you can trace</h2>
        <p class="lead" data-en="Food safety isn't a department — it's how we farm, from seed to shelf." data-he="בטיחות מזון היא לא מחלקה — זו הדרך שבה אנחנו מגדלים, מהזרע ועד למדף.">Food safety isn't a department — it's how we farm, from seed to shelf.</p>
        <ul class="q-list">
          <li><span class="q-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4 10-10"/></svg></span><div><strong data-en="International food-safety standards" data-he="תקני בטיחות מזון בינלאומיים">International food-safety standards</strong><span data-en="Audited growing and packing processes from field to box." data-he="תהליכי גידול ואריזה מבוקרים מהשדה ועד לארגז.">Audited growing and packing processes from field to box.</span></div></li>
          <li><span class="q-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4 10-10"/></svg></span><div><strong data-en="Residue (MRL) testing" data-he="בדיקות שאריות (MRL)">Residue (MRL) testing</strong><span data-en="Routine lab testing keeps produce within strict residue limits." data-he="בדיקות מעבדה שוטפות שומרות על התוצרת בגבולות שאריות מחמירים.">Routine lab testing keeps produce within strict residue limits.</span></div></li>
          <li><span class="q-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4 10-10"/></svg></span><div><strong data-en="Water &amp; soil monitoring" data-he="ניטור מים וקרקע">Water &amp; soil monitoring</strong><span data-en="Regular water testing protects the crop and the consumer alike." data-he="בדיקות מים סדירות מגנות על היבול ועל הצרכן כאחד.">Regular water testing protects the crop and the consumer alike.</span></div></li>
          <li><span class="q-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4 10-10"/></svg></span><div><strong data-en="Field-to-shelf traceability" data-he="עקיבות מהשדה למדף">Field-to-shelf traceability</strong><span data-en="Every pallet is traceable back to its grower and plot." data-he="כל משטח ניתן למעקב עד למגדל ולחלקה.">Every pallet is traceable back to its grower and plot.</span></div></li>
        </ul>
      </div>
      <div class="quality-figure reveal"><img src="images/organic-box.jpg" alt="Gilad-branded boxes of fresh peppers"></div>
    </div>
  </div>
</section>

<!-- ============ GROWERS ============ -->
<section class="section" id="growers">
  <div class="wrap">
    <div class="growers reveal">
      <div>
        <h2 data-en="A dedicated portal for our growers" data-he="אזור ייעודי למגדלים שלנו">A dedicated portal for our growers</h2>
        <p data-en="Water tests, product specs, procedures, forms, training and variety programs — everything our growers need, in one place." data-he="בדיקות מים, מפרטי מוצר, נהלים, טפסים, הדרכות ותוכניות זנים — כל מה שהמגדלים שלנו צריכים, במקום אחד.">Water tests, product specs, procedures, forms, training and variety programs — everything our growers need, in one place.</p>
      </div>
      <a href="growers.html" class="btn btn--dark" data-en="Growers area" data-he="כניסת מגדלים">Growers area
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
  </div>
</section>

<!-- ============ CONTACT ============ -->
<section class="section section--cream" id="contact">
  <div class="wrap">
    <div class="section-head center reveal">
      <span class="eyebrow" data-en="Contact" data-he="יצירת קשר">Contact</span>
      <h2 class="title" data-en="Let's talk produce" data-he="בואו נדבר תוצרת">Let's talk produce</h2>
    </div>
    <div class="contact-grid">
      <div class="reveal">
        <div class="office">
          <h3><span class="pin">◍</span> <span data-en="Head office &amp; packing house" data-he="משרד ראשי ובית אריזה">Head office &amp; packing house</span></h3>
          <p data-en="Ein Yahav, Central Arava, Israel" data-he="עין יהב, הערבה התיכונה, ישראל">Ein Yahav, Central Arava, Israel</p>
          <p><a href="tel:086582515">08-6582515</a></p>
        </div>
        <div class="office">
          <h3><span class="pin">◍</span> <span data-en="Sales &amp; marketing — Europe" data-he="מכירות ושיווק — אירופה">Sales &amp; marketing — Europe</span></h3>
          <p data-en="Gilad Produce B.V., The Netherlands" data-he="Gilad Produce B.V., הולנד">Gilad Produce B.V., The Netherlands</p>
          <p><a href="mailto:jan@giladproduce.nl">jan@giladproduce.nl</a></p>
        </div>
        <div class="office" style="border-bottom:0">
          <h3><span class="pin">✉</span> <span data-en="Email us" data-he="כתבו לנו">Email us</span></h3>
          <p><a href="mailto:eyal@giladltd.co.il">eyal@giladltd.co.il</a> · <a href="mailto:yuval@giladltd.co.il">yuval@giladltd.co.il</a></p>
        </div>
      </div>

      <form class="form-card reveal" id="contactForm">
        <div class="field">
          <label data-en="Name" data-he="שם">Name</label>
          <input type="text" name="name" required data-en-ph="Your name" data-he-ph="השם שלך">
        </div>
        <div class="field">
          <label data-en="Email" data-he="אימייל">Email</label>
          <input type="email" name="email" required data-en-ph="you@company.com" data-he-ph="you@company.com">
        </div>
        <div class="field">
          <label data-en="Subject" data-he="נושא">Subject</label>
          <input type="text" name="subject" data-en-ph="How can we help?" data-he-ph="איך נוכל לעזור?">
        </div>
        <div class="field">
          <label data-en="Message" data-he="הודעה">Message</label>
          <textarea name="message" data-en-ph="Tell us about your enquiry…" data-he-ph="ספרו לנו על הפנייה שלכם…"></textarea>
        </div>
        <button type="submit" class="btn btn--green" style="width:100%; justify-content:center" data-en="Send message" data-he="שליחת הודעה">Send message</button>
      </form>
    </div>
  </div>
</section>

<!-- ============ FOOTER ============ -->
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-col">
        <img src="images/logo.png" alt="Gilad Desert Produce">
        <p class="footer-tagline" data-en="Premium desert-grown produce, delivered fresh to the world's leading supermarkets." data-he="תוצרת מדברית משובחת, מגיעה טרייה לרשתות המובילות בעולם.">Premium desert-grown produce, delivered fresh to the world's leading supermarkets.</p>
      </div>
      <div class="footer-col">
        <h4 data-en="Explore" data-he="ניווט">Explore</h4>
        <ul>
          <li><a href="#about" data-en="About" data-he="אודות">About</a></li>
          <li><a href="#products" data-en="Products" data-he="מוצרים">Products</a></li>
          <li><a href="#process" data-en="Process" data-he="תהליך">Process</a></li>
          <li><a href="#quality" data-en="Quality" data-he="איכות">Quality</a></li>
          <li><a href="#contact" data-en="Contact" data-he="יצירת קשר">Contact</a></li>
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
      <span data-en="Ein Yahav · Central Arava · Israel" data-he="עין יהב · הערבה התיכונה · ישראל">Ein Yahav · Central Arava · Israel</span>
    </div>
  </div>
</footer>

<script src="app.js"></script>
</body>
</html>
`;
let src = SRC;
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

function head(L, file, titleEn, titleHe, descEn, descHe) {
  const P = L.pre, isHe = L.code === 'he';
  return `<!DOCTYPE html>
<html lang="${L.code}" dir="${L.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className+=' pre';setTimeout(function(){document.documentElement.classList.remove('pre');},1500);</script>
<title data-en="${titleEn}" data-he="${titleHe}">${isHe ? titleHe : titleEn}</title>
<meta name="description" data-en="${descEn}" data-he="${descHe}" content="${isHe ? descHe : descEn}">
<link rel="canonical" href="${isHe ? SITE + '/' + file : SITE + '/en/' + file}">
<link rel="alternate" hreflang="he" href="${SITE}/${file}">
<link rel="alternate" hreflang="en" href="${SITE}/en/${file}">
<link rel="alternate" hreflang="x-default" href="${SITE}/${file}">
<link rel="icon" type="image/png" href="${P}images/icon.png?v=2">
<link rel="apple-touch-icon" href="${P}images/icon.png?v=2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Assistant:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${P}styles.css">
<link rel="stylesheet" href="${P}accessibility.css">
</head>`;
}

function header(L, cur, file) {
  const P = L.pre;
  const links = NAV.map(([href, en, he, key]) =>
    `      <a href="${href}"${key === cur ? ' class="current"' : ''} data-en="${en}" data-he="${he}">${he}</a>`
  ).join('\n');
  const langLinks =
    `          <a class="lang-opt${L.code === 'en' ? ' active' : ''}" data-lang="en" href="${L.en(file)}" hreflang="en" role="menuitem">English</a>
          <a class="lang-opt${L.code === 'he' ? ' active' : ''}" data-lang="he" href="${L.he(file)}" hreflang="he" role="menuitem">עברית</a>`;
  return `<header class="header" id="header">
  <div class="wrap nav">
    <div class="nav-brand-group">
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <a href="index.html" class="brand" aria-label="Gilad Desert Produce"><img src="${P}images/Gilad.png" alt="Gilad Desert Produce"></a>
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
${langLinks}
        </div>
      </div>
    </div>
  </div>
</header>

<div class="drawer-backdrop" id="drawerBackdrop"></div>
<aside class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer-top">
    <a href="index.html" class="brand"><img src="${P}images/Gilad.png" alt="Gilad Desert Produce"></a>
    <button class="drawer-close" id="drawerClose" aria-label="Close">&times;</button>
  </div>
  <nav class="drawer-links">
${links}
  </nav>
  <div class="drawer-foot">
    <a href="contact.html" class="btn btn--primary"><span data-en="Contact" data-he="יצירת קשר">Contact</span><svg class="plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></a>
    <div class="drawer-lang">
${langLinks}
    </div>
  </div>
</aside>`;
}

function footer(L) {
  const P = L.pre;
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-col">
        <img src="${P}images/Gilad.png" alt="Gilad Desert Produce">
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
        <img src="${P}images/ombee-logo.png" alt="OMBee">
      </a>
    </div>
  </div>
</footer>`;
}

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

function page(L, bodyClass, cur, file, headHtml, bodyHtml) {
  const P = L.pre;
  const body = P
    ? bodyHtml.replaceAll('"images/', '"' + P + 'images/').replaceAll("'images/", "'" + P + 'images/').replaceAll('(images/', '(' + P + 'images/')
    : bodyHtml;
  return `${headHtml}
<body${bodyClass ? ' class="' + bodyClass + '"' : ''}>

${header(L, cur, file)}

${body}

${footer(L)}

<script src="${P}accessibility.js"></script>
<script src="${P}app.js"></script>
<script src="${P}cookies.js"></script>
</body>
</html>
`;
}

const B = 'גלעד תוצרת מדבר בע״מ';
const BE = 'Gilad Desert Produce Ltd';

// Two language editions: Hebrew at the root, English under /en/.
// Asset paths get a `../` prefix in /en/; page links stay relative so they
// resolve within each folder; the language switch links between the two.
const LANGS = [
  { code: 'he', dir: 'rtl', pre: '',    out: '',    he: (f) => f,         en: (f) => 'en/' + f },
  { code: 'en', dir: 'ltr', pre: '../', out: 'en/', he: (f) => '../' + f, en: (f) => f },
];

const PAGES = [
  { file: 'index.html', cls: '', cur: 'home', te: 'Home', th: 'בית',
    de: 'Premium desert-grown produce exported fresh to leading supermarkets worldwide.', dh: 'תוצרת מדברית משובחת המיוצאת טרייה לרשתות המובילות בעולם.',
    body: `${SEC.hero}\n\n${EXPLORE}\n\n${SEC.growers}` },
  { file: 'about.html', cls: 'inner', cur: 'about', te: 'About', th: 'אודות',
    de: 'Rooted in the Arava: our story, values and commitment to quality.', dh: 'שורשים בערבה: הסיפור, הערכים והמחויבות לאיכות.', body: SEC.about },
  { file: 'products.html', cls: 'inner', cur: 'products', te: 'Products', th: 'מוצרים',
    de: 'Peppers, tomatoes and melons in conventional and organic lines.', dh: 'פלפלים, עגבניות ומלונים בקווים קונבנציונליים ואורגניים.', body: SEC.products },
  { file: 'process.html', cls: 'inner', cur: 'process', te: 'Process', th: 'תהליך',
    de: 'From the field to your shelf in six steps.', dh: 'מהשדה אל המדף בשישה שלבים.', body: SEC.process },
  { file: 'quality.html', cls: 'inner', cur: 'quality', te: 'Quality', th: 'איכות',
    de: 'Food safety, residue testing and full traceability.', dh: 'בטיחות מזון, בדיקות שאריות ועקיבות מלאה.', body: SEC.quality },
  { file: 'contact.html', cls: 'inner', cur: 'contact', te: 'Contact', th: 'יצירת קשר',
    de: 'Talk to our team in Israel and Europe.', dh: 'דברו עם הצוות שלנו בישראל ובאירופה.', body: SEC.contact },
  { file: 'growers.html', cls: 'inner', cur: 'growers', te: 'Growers', th: 'מגדלים',
    de: 'The growers portal: water tests, specs, procedures, forms and more.', dh: 'פורטל המגדלים: בדיקות מים, מפרטים, נהלים, טפסים ועוד.', body: GROWERS_PAGE },
  { file: 'accessibility-statement.html', cls: 'inner', cur: '', te: 'Accessibility Statement', th: 'הצהרת נגישות',
    de: 'Our commitment to web accessibility and how to report an issue.', dh: 'המחויבות שלנו לנגישות האתר וכיצד לדווח על בעיה.', body: STATEMENT_PAGE },
  { file: 'privacy-policy.html', cls: 'inner', cur: '', te: 'Privacy Policy', th: 'מדיניות פרטיות',
    de: 'How we collect, use and protect your information.', dh: 'כיצד אנו אוספים, משתמשים ושומרים את המידע שלכם.', body: PRIVACY_PAGE },
];

fs.mkdirSync(path.join(DIR, 'en'), { recursive: true });

for (const L of LANGS) {
  for (const p of PAGES) {
    const html = page(L, p.cls, p.cur, p.file,
      head(L, p.file, `${BE} - ${p.te}`, `${B} - ${p.th}`, p.de, p.dh),
      p.body);
    write(L.out + p.file, html);
  }
}
write('robots.txt', `User-agent: *\nAllow: /\n`);

console.log('Built he (root) + en (/en/): ' + PAGES.length + ' pages each (' + (PAGES.length * 2) + ' total)');
