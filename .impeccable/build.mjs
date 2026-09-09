/* Generates index.html + menu.html for Bellam & Kaaram — "The Muggu Doorstep".
   Static output; run once, commit the HTML. Menu content comes from menu-data.json
   (extracted verbatim from the incumbent site). */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const menu = JSON.parse(fs.readFileSync(path.join(ROOT, ".impeccable/menu-data.json"), "utf8"));

const ZOMATO = "https://www.zomato.com/hyderabad/bellam-kaaram-1-yapral-secunderabad";
const SWIGGY = "https://www.swiggy.com/city/hyderabad/bellam-and-kaaram-yapral-kowkoor-rest1294767";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Pragathi+Nagar,+Old+Safilguda,+Secunderabad,+Telangana+500062";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* heat / sweet heuristic */
const HOT = /chilli|kaaram|pachi mirchi|gongura|pepper|miriyala|kadapa|ghee roast|pepper fry|pachi|fiery|spicy prawn|guntur|vepudu|sukka/i;
const SWEETY = /jamun|payasam|laddu|ariselu|bobbatlu|poli|sweet|halwa|kheer/i;
function taste(catName, n, d) {
  if (SWEETY.test(n) || /sweets/i.test(catName)) return "sweet";
  if (HOT.test(n) || HOT.test(d)) return "hot";
  return "reg";
}
const tasteTag = (t) =>
  t === "hot" ? '<span class="tag hot">Kaaram</span>'
  : t === "sweet" ? '<span class="tag sweet">Bellam</span>'
  : '<span class="tag reg">House</span>';

const TELUGU_CAT = {
  "Meals": "భోజనం", "Millet & Snacks": "చిరుతిండ్లు", "Non-veg Appetizers": "నాన్‌వెజ్ స్టార్టర్స్",
  "Veg Appetizers": "వెజ్ స్టార్టర్స్", "Main Course": "కూరలు", "Main Course — Veg": "వెజ్ కూరలు",
  "Special Combos": "కాంబోలు", "Biryani": "బిర్యానీ", "Pulao": "పులావ్", "Rice": "అన్నం",
  "Soup, Pickles & Breads": "సూప్ · ఊరగాయ · రొట్టెలు", "Family Packs": "ఫ్యామిలీ ప్యాక్‌లు", "Sweets": "తీపి",
};

/* --- shared fragments --------------------------------------------------- */
const HEAD = (title, desc, canonical, ogType = "website") => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#4a2f20">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@600;700;800&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Gurajada&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">`;

const TRACKING = (pixel) => `
<!-- Meta Pixel -->
<script>
(function(){
  var META_PIXEL_ID='${pixel}';
  if(!/^\\d{6,}$/.test(META_PIXEL_ID))return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',META_PIXEL_ID); fbq('track','PageView');
  window.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a[href*="swiggy.com"],a[href*="zomato"]').forEach(function(a){
      a.addEventListener('click',function(){try{fbq('track','Lead');}catch(e){}});
    });
  });
})();
</script>
<!-- Google tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-03WND9ZQL7"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-03WND9ZQL7');</script>`;

const NOSCRIPT = `<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=1213790737554855&ev=PageView&noscript=1"/></noscript>`;

const MARK = `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
  <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="20" cy="20" r="1.7" fill="currentColor"/>
  <circle cx="20" cy="8.5" r="1.7" fill="currentColor"/><circle cx="20" cy="31.5" r="1.7" fill="currentColor"/>
  <circle cx="8.5" cy="20" r="1.7" fill="currentColor"/><circle cx="31.5" cy="20" r="1.7" fill="currentColor"/>
  <path d="M20 8.5C25 13 25 27 20 31.5M8.5 20C13 15 27 15 31.5 20" stroke="currentColor" stroke-width="1.6"/>
</svg>`;

const ZICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h2l2.7 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 7H5"/></svg>`;
const SICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11a7 7 0 0 1 14 0v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M9 11V9a3 3 0 0 1 6 0v2"/></svg>`;

const orderRow = (extra = "") => `<div class="order-row">
  <a class="order zomato" href="${ZOMATO}" target="_blank" rel="noopener">${ZICON}Order on Zomato</a>
  <a class="order swiggy" href="${SWIGGY}" target="_blank" rel="noopener">${SICON}Order on Swiggy</a>${extra}
</div>`;

const NAV = (page) => `<nav class="top">
  <a class="brand" href="index.html">${MARK}<b>Bellam <span class="amp">&amp;</span> Kaaram</b></a>
  <div class="nav-links">
    <a href="index.html#axis"${page === "home" ? "" : ""}>The idea</a>
    <a class="nav-menu-link" href="menu.html"${page === "menu" ? ' aria-current="page"' : ""}>Menu</a>
    <a href="index.html#visit">Visit</a>
    <div class="nav-order-wrap">
      <button class="nav-order-btn" aria-expanded="false" aria-haspopup="true">Order <svg viewBox="0 0 12 8" width="11" height="8" fill="none" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <div class="nav-order-menu">
        <a href="${ZOMATO}" target="_blank" rel="noopener">${ZICON}Zomato</a>
        <a href="${SWIGGY}" target="_blank" rel="noopener">${SICON}Swiggy</a>
      </div>
    </div>
  </div>
</nav>`;

const FOOTER = `<footer class="muggu-field">
  <p class="fb te-display">బెల్లం <span class="amp">&amp;</span> కారం</p>
  <p class="fr">Sweet-and-spicy Telugu home food, cooked fresh in our Old Safilguda cloud kitchen and delivered across Secunderabad &amp; Hyderabad. Delivery only.</p>
  ${orderRow()}
  <p class="fc">&copy; 2026 Bellam &amp; Kaaram &middot; Pragathi Nagar, Old Safilguda, Secunderabad, Telangana 500062 &middot; Delivery-only cloud kitchen</p>
</footer>`;

const SCRIPT = `<script>
document.documentElement.classList.add('js');
(function(){
  var w=document.querySelector('.nav-order-wrap'), b=w&&w.querySelector('.nav-order-btn');
  if(!b)return;
  b.addEventListener('click',function(e){e.stopPropagation();var o=w.classList.toggle('open');b.setAttribute('aria-expanded',o);});
  document.addEventListener('click',function(){w.classList.remove('open');b.setAttribute('aria-expanded','false');});
})();
(function(){
  if(!('IntersectionObserver' in window)){document.querySelectorAll('.reveal,.menu-grid').forEach(function(el){el.classList.add('in');});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal,.menu-grid').forEach(function(el){io.observe(el);});
  setTimeout(function(){document.querySelectorAll('.reveal,.menu-grid').forEach(function(el){el.classList.add('in');});io.disconnect();},2600);
})();
</script>`;

/* --- signature dishes for the index teaser --------------------------------- */
const pick = (cat, name) => (menu.find((c) => c.cat === cat)?.items || []).find((i) => i.n === name);
const SIGNATURE = [
  ["Non-veg Appetizers", "Gongura Royyala Vepudu"],
  ["Biryani", "Mutton Gongura Biryani"],
  ["Special Combos", "Ragi Sangati + Mutton Pulusu"],
  ["Non-veg Appetizers", "Kadapa Mutton"],
  ["Non-veg Appetizers", "Pachi Mirchi Kodi Vepudu"],
  ["Special Combos", "Bagara Rice + Kodi Kura"],
  ["Sweets", "Bobbatlu (Puran Poli)"],
  ["Non-veg Appetizers", "Bhimavaram Royyala Vepudu"],
  ["Main Course", "Kodi Koora"],
  ["Sweets", "Ariselu"],
  ["Soup, Pickles & Breads", "Mango Pickle"],
  ["Biryani", "Chicken Dum Biryani"],
].map(([c, n]) => ({ cat: c, ...pick(c, n) })).filter((x) => x.n);

const dishCell = (d) => {
  const t = taste(d.cat, d.n, d.d);
  return `<article class="dish">
  <div class="dish-head"><span class="vdot ${d.v}" aria-hidden="true"></span><h3 class="dish-name">${esc(d.n)}</h3></div>
  <p class="dish-desc">${esc(d.d)}</p>
  <div class="dish-tags">${tasteTag(t)}<span class="tag reg">${d.v === "veg" ? "Veg" : "Non-veg"}</span></div>
</article>`;
};

/* ====================================================================== INDEX */
const INDEX = `${HEAD(
  "Bellam & Kaaram — Sweet & Spicy Telugu Cloud Kitchen | Old Safilguda, Secunderabad",
  "Bellam & Kaaram — a delivery-only cloud kitchen in Old Safilguda, Secunderabad cooking sweet & spicy Telugu home food. Gongura, biryani, ragi sangati, combos and sweets. Order on Zomato or Swiggy.",
  "https://bellamkaram.online/",
  "restaurant.restaurant",
)}
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Restaurant","name":"Bellam & Kaaram","description":"Delivery-only cloud kitchen serving authentic sweet & spicy Telugu home-style food, delivered across Old Safilguda, Secunderabad & Hyderabad.","servesCuisine":["Telugu","Andhra","South Indian","Home Food"],"priceRange":"₹₹","url":"https://bellamkaram.online/","hasMenu":"https://bellamkaram.online/menu.html","acceptsReservations":false,"address":{"@type":"PostalAddress","streetAddress":"2nd Floor, Plot #14, Pragathi Nagar, Old Safilguda, Opp. Sri Chaitanya School","addressLocality":"Secunderabad","addressRegion":"Telangana","postalCode":"500062","addressCountry":"IN"},"areaServed":["Old Safilguda","Yapral","Kowkoor","Secunderabad","Hyderabad"],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"12:00","closes":"23:00"}],"aggregateRating":{"@type":"AggregateRating","ratingValue":"3.6","reviewCount":"23"},"sameAs":["${SWIGGY}","${ZOMATO}"],"potentialAction":{"@type":"OrderAction","target":"${ZOMATO}","deliveryMethod":"http://purl.org/goodrelations/v1#DeliveryModeOwnFleet"}}
</script>
${TRACKING("1213790737554855")}
</head>
<body>
${NOSCRIPT}
<!--
  IMPECCABLE DIRECTION CONTRACT — Bellam & Kaaram landing (Persuade)
  THESIS: The kitchen as the Telugu doorstep you pass every morning — the muggu
    (dawn rice-flour threshold pattern) IS the page's structural grid, its two
    poles are bellam (jaggery-warm) and kaaram (chilli-hot), and the ~90-dish
    regional menu is navigable by that taste axis. Refuses the cream / Playfair /
    soft-shadow-photo-card "authentic South Indian delivery" template.
  OWN-WORLD: Swept-earth kaavi ground (#4a2f20) running unbroken top to bottom;
    chalk / rice-flour muggu dot-lattice (#f4ede0) as the layout grid; bellam
    pole = jaggery + turmeric (#e0a92e / #b9782e), kaaram pole = chilli +
    marigold (#a5231b / #e8531f). Darker Grotesque display, Hanken Grotesk body,
    Gurajada + Noto Sans Telugu for Telugu. Newsprint tooth, rubber-stamp price
    marks, torn tiffin-packet edges, zero photography (none exists for this brand).
  STORY: A Telugu person in Old Safilguda lands from Swiggy/Zomato, sees their own
    doorstep — the muggu, the warm earth, బెల్లం & కారం large in the lattice —
    understands instantly this is regional home food, scans the menu by taste or
    category, taps Zomato or Swiggy. Address / hours / 3.6 rating give trust
    without fabrication.
  FIRST VIEWPORT: Full-bleed swept-earth ground with a chalk muggu dot-lattice;
    బెల్లం & కారం set large with the "&" as the sweet↔spice axis (jaggery glow
    left, chilli red right); one line of positioning; the two order buttons
    (Zomato red / Swiggy orange — the only place those colours appear) on the
    threshold line; stamped 3.6 · ₹250 for one · Tue–Sun 12–11.
  FORM: Andhra muggu / doorstep ritual. Candidate 7 of 7 grounded directions —
    the roll's assignment; seed key bb026b76; decision page answer -> optionId
    "assigned", buildPath "code". Raises folded in: sweet↔spice axis (from Fight
    Poster), ruled menu grid + flip (from Split-Flap), unbroken ground (from
    Cracktro), vernacular print + reserved action colour (from Photocopied Flyer),
    name the specific thing (from Pickle Shelf), one signal for the live path
    (from Sewing Pattern).
  FINISH: unreviewed and undocumented is unfinished; this build ends with the
    finish review, the verdict, DESIGN.md, and every shipping raster carrying its
    provenance.
-->
${NAV("home")}

<header class="doorstep muggu-field">
  <h1 class="ds-te te-display"><span class="bellam" lang="te">బెల్లం</span><span class="amp">&amp;</span><span class="kaaram" lang="te">కారం</span></h1>
  <p class="ds-en">Bellam &amp; Kaaram &mdash; sweet and spicy Telugu home food, Old Safilguda</p>
  <p class="ds-lede"><b>Bellam</b> is the jaggery-sweet. <b>Kaaram</b> is the chilli-heat. Every Telugu meal lives between the two, and we cook both, fresh, to your door.</p>
  ${orderRow()}
  <div class="ds-meta">
    <span class="stamp sweet">&#9733; 3.6 &middot; 23 reviews</span>
    <span class="stamp">&#8377;250 for one</span>
    <span class="stamp hot">Tue&ndash;Sun &middot; 12&ndash;11</span>
  </div>
</header>

<section class="axis" id="axis">
  <div class="wrap">
    <h2 class="sec">Two flavours, <span class="te" lang="te" style="color:var(--turmeric);font-weight:600">రుచుల సమతూకం</span> one kitchen.</h2>
    <p class="sec-lede" style="margin-inline:auto">In a proper Telugu meal, the sweet rounds off the heat. That balance is the whole menu: sweet on one side, spice on the other, and you order across the line.</p>
    <div class="axis-bar reveal">
      <div class="axis-half b">
        <p class="word te" lang="te">బెల్లం</p>
        <p class="rom">Bellam &middot; the sweet</p>
        <p>Jaggery, ghee and warmth. Ariselu, bobbatlu, semiya payasam, rava laddu. The traditional close to a heavy meal.</p>
      </div>
      <div class="axis-vs">&amp;</div>
      <div class="axis-half k">
        <p class="word te" lang="te">కారం</p>
        <p class="rom">Kaaram &middot; the heat</p>
        <p>Guntur red chilli, roasted spice, gongura, pachi mirchi. The coastal-Andhra and Telangana fire that wakes every bite up.</p>
      </div>
    </div>
  </div>
</section>

<section class="menu-sec" id="menu">
  <div class="wrap">
    <h2 class="sec">A dozen from the kitchen. <span class="te" lang="te" style="color:var(--turmeric);font-weight:600">ఏం వండుతున్నాం</span></h2>
    <p class="sec-lede">Coastal-Andhra prawn fries, Telangana millet plates, Kadapa mutton, dum biryani, festival sweets. Ninety dishes in all. Here are the ones regulars come back for.</p>
    <div class="menu-grid reveal">
      ${SIGNATURE.map(dishCell).join("\n      ")}
    </div>
    <div class="menu-more">
      <a class="order ghost" href="menu.html">See the full menu &mdash; 89 dishes &rarr;</a>
    </div>
  </div>
</section>

<section class="why">
  <div class="wrap">
    <h2 class="sec">Home food, delivered right. <span class="te" lang="te" style="color:var(--turmeric);font-weight:600">ఇంటి వంట</span></h2>
    <div class="ledger">
      <div class="ledger-row"><span class="ln" aria-hidden="true">·</span><div><h3>Real regional cooking</h3><p>Recipes from Telangana and coastal-Andhra kitchens &mdash; not a generic "South Indian" menu.</p></div><span class="val">89 dishes</span></div>
      <div class="ledger-row"><span class="ln" aria-hidden="true">·</span><div><h3>Delivery only, cooked to order</h3><p>A dedicated cloud kitchen. No dine-in, no waiting, just cooking and delivering.</p></div><span class="val">Swiggy &middot; Zomato</span></div>
      <div class="ledger-row"><span class="ln" aria-hidden="true">·</span><div><h3>Value for a full plate</h3><p>Generous, satisfying meals at everyday prices.</p></div><span class="val">&#8377;250 / one</span></div>
      <div class="ledger-row"><span class="ln" aria-hidden="true">·</span><div><h3>Lunch and dinner</h3><p>Open Tuesday to Sunday, midday to late.</p></div><span class="val">12&ndash;11</span></div>
    </div>
  </div>
</section>

<section class="visit" id="visit">
  <div class="wrap">
    <h2 class="sec">The kitchen. <span class="te" lang="te" style="color:var(--turmeric);font-weight:600">మా వంటిల్లు</span></h2>
    <div class="visit-grid">
      <div class="panel reveal">
        <h3>Where we cook</h3>
        <div class="row"><span class="k">Address</span><span class="v">2nd Floor, Plot #14, Pragathi Nagar, Old Safilguda, Opp. Sri Chaitanya School, Secunderabad, Telangana 500062</span></div>
        <div class="row"><span class="k">Serving</span><span class="v">Old Safilguda &middot; Yapral &middot; Kowkoor &middot; Secunderabad</span></div>
        <div class="row"><span class="k">Kitchen</span><span class="v">Sweet &amp; spicy Telugu, home-style &middot; delivery only</span></div>
        <a class="maps" href="${MAPS}" target="_blank" rel="noopener">Open in Maps &rarr;</a>
      </div>
      <div class="panel reveal">
        <h3>When we cook</h3>
        <div class="hours-line"><span>Monday</span><span class="closed">Closed</span></div>
        <div class="hours-line"><span>Tuesday &ndash; Sunday</span><span>12:00 PM &ndash; 11:00 PM</span></div>
        <div style="margin-top:1.2rem">${orderRow()}</div>
      </div>
    </div>
  </div>
</section>

${FOOTER}
${SCRIPT}
</body>
</html>`;

/* ====================================================================== MENU */
const catBlock = (c) => `<section class="mcat reveal" aria-labelledby="c-${c.cat.replace(/[^a-z]/gi, "")}">
  <div class="mcat-head">
    <h2 id="c-${c.cat.replace(/[^a-z]/gi, "")}">${esc(c.cat)}</h2>
    <span class="cnt">${c.items.length}</span>
    <span class="te" lang="te">${TELUGU_CAT[c.cat] || ""}</span>
  </div>
  <div class="mlist">
    ${c.items.map((d) => {
      const t = taste(c.cat, d.n, d.d);
      return `<div class="mrow">
      <span class="vdot ${d.v}" aria-hidden="true" title="${d.v === "veg" ? "Veg" : "Non-veg"}"></span>
      <div><div class="mn">${esc(d.n)}</div><div class="md">${esc(d.d)}</div></div>
      <span class="mtag">${t === "reg" ? "" : tasteTag(t)}</span>
    </div>`;
    }).join("\n    ")}
  </div>
</section>`;

const MENU = `${HEAD(
  "Menu — Bellam & Kaaram | Sweet & Spicy Telugu Food, Old Safilguda, Secunderabad",
  "The full Bellam & Kaaram menu — 89 sweet & spicy Telugu home-style dishes: coastal-Andhra appetisers, Telangana combos, biryani, pulao, rice, pickles and festival sweets. Order on Zomato or Swiggy.",
  "https://bellamkaram.online/menu.html",
  "restaurant.restaurant",
)}
${TRACKING("1213790737554855")}
</head>
<body>
${NOSCRIPT}
${NAV("menu")}

<header class="menu-page-head muggu-field">
  <div class="wrap">
    <h1 class="sec" style="margin-inline:auto">బెల్లం &amp; కారం &mdash; 89 dishes</h1>
    <p class="sec-lede" style="margin-inline:auto">Cooked fresh in our Old Safilguda kitchen. Prices and today's specials are on Swiggy and Zomato. <span class="te" lang="te" style="opacity:.7">కారం = spice, బెల్లం = sweet.</span></p>
    <div style="margin-top:1.6rem">${orderRow()}</div>
  </div>
</header>

<main class="wrap" style="padding-bottom:2rem">
  ${menu.map(catBlock).join("\n  ")}
</main>

<div class="menu-sticky-order">
  <a class="order zomato" href="${ZOMATO}" target="_blank" rel="noopener">${ZICON}Zomato</a>
  <a class="order swiggy" href="${SWIGGY}" target="_blank" rel="noopener">${SICON}Swiggy</a>
</div>

${FOOTER}
${SCRIPT}
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, "index.html"), INDEX);
fs.writeFileSync(path.join(ROOT, "menu.html"), MENU);
console.log("wrote index.html (" + INDEX.length + ") + menu.html (" + MENU.length + ")");
