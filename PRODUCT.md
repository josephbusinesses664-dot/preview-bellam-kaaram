# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS, two hand-written pages (`index.html` + `menu.html`), no build step. Deployed as a Render static site (repo `preview-bellam-kaaram`, owner `josephbusinesses664-dot`, auto-deploy on `main`); also served from the fleet box's Caddy. Real domain: `bellamkaram.online` (note: one "a" in "karam"). This is a from-scratch visual redesign of a live paying-client site; the incumbent design is anti-reference only.

## Users

People in Old Safilguda, Yapral, Kowkoor and the wider Secunderabad / Hyderabad delivery radius, deciding what to order for lunch or dinner. They mostly arrive from a Swiggy or Zomato listing, an Instagram post, or a shared link, on a phone, hungry, comparing two or three kitchens. Many are Telugu-speaking and know exactly what "gongura", "ragi sangati", "pachi mirchi" and "bellam" mean; the site should not talk down to them. The job: decide this kitchen is worth ordering from, then tap through to Swiggy or Zomato.

## Product Purpose

Bellam & Kaaram is a **delivery-only cloud kitchen** cooking sweet-and-spicy Telugu home food. The website's only job is to convert a browsing visitor into a Swiggy/Zomato order and to make the kitchen feel like real Telangana/Andhra home cooking rather than a generic "South Indian" delivery brand. Success = order-button taps through to the aggregators (tracked as Meta `Lead`).

## Positioning

The name is the concept: **బెల్లం (bellam)** = jaggery-sweet, **కారం (kaaram)** = fiery-spicy — the two poles a proper Telugu meal is balanced between. It is a genuinely regional kitchen: coastal-Andhra prawn and gongura dishes (Bhimavaram, gongura royyala), Telangana staples (ragi sangati, bagara rice + kodi kura), Kadapa/Mangalorean ghee roasts, and traditional festive sweets (ariselu, bobbatlu, rava laddu). A neighbouring "cloud kitchen" cannot truthfully claim this depth of specific regional menu or the sweet/spice framing.

## Operating Context

- Ordering happens entirely on **Swiggy and Zomato** — the site never takes an order itself, it hands off. Every order path must be a live external link that fires the `Lead` event.
- Delivery-only: no dine-in, no reservations, no phone number published. "Visit" means the kitchen address for context/trust, not a place to go.
- Hours: **Monday closed; Tuesday–Sunday 12:00 PM – 11:00 PM** (lunch and dinner).
- Two aggregator storefronts, slightly different listing names ("Bellam and Kaaram", Yapral/Kowkoor on Swiggy; "Bellam Kaaram 1", Yapral on Zomato).
- The menu is large (~90 items on the menu page) and changes; it is maintained by hand in `menu.html`.

## Capabilities and Constraints

- **Must preserve, exactly:** the full menu content and category structure; both Swiggy and Zomato order URLs (below); GA4 `G-03WND9ZQL7`; Meta Pixel `1213790737554855` with PageView + a `Lead` event on every `a[href*="swiggy.com"], a[href*="zomato"]` click; all JSON-LD / SEO / canonical / OG / sitemap / robots; the favicon set (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`) — the mark may be redrawn but the files must stay.
- **Order URLs:** Zomato `https://www.zomato.com/hyderabad/bellam-kaaram-1-yapral-secunderabad` · Swiggy `https://www.swiggy.com/city/hyderabad/bellam-and-kaaram-yapral-kowkoor-rest1294767`
- Two pages only. Keep `index.html` (story + why + menu teaser + visit) and `menu.html` (full categorised menu). Relative links between them are load-bearing.
- Static only — no backend, no forms, no contact submission.
- The incumbent embeds a `google.com/maps?...&output=embed` iframe that renders blank (deprecated endpoint). Replace with a static map image or a plain "Open in Maps" link, not another broken embed.
- No fabricated reviews, ratings, awards, chef names, or "since 20XX" history. Real proof on hand: aggregator rating **3.6 / 23 reviews**, `₹250 for one`, the listed address, the menu itself.

## Brand Commitments

- Name: **Bellam & Kaaram** / **బెల్లం & కారం**. The sweet↔spicy duality is the brand's whole idea and must be legible in the design, not just stated in copy.
- Telugu script is a first-class brand element, not decoration — the user's explicit steer is to lean into the Telugu / Andhra-Telangana / neighbourhood identity.
- Delivery aggregator brand colours appear on the order buttons: Zomato red `#E23744`/`#DD3542`, Swiggy orange `#FC8019`.
- No client logo file exists; the current favicon is an authored abstract mark (jaggery + chilli). A redrawn mark is in scope.
- Voice: warm, plain, regional-proud; assumes the reader knows the food. Not "elevated", not cutesy.

## Evidence on Hand

- Full menu (~90 items) with descriptions and veg/non-veg flags — in the incumbent `menu.html` and the `index.html` hidden category block. This is the real content.
- Aggregator rating 3.6 (23 reviews); average cost ₹250 for one; address in Old Safilguda; Tue–Sun 12–23:00 hours; areas served Old Safilguda / Yapral / Kowkoor / Secunderabad / Hyderabad.
- **No food photography exists** for this brand — not on the current site, not supplied by the client, and the user's instruction is not to source new stock. The redesign works without dish photos: lean on Telugu typography, the sweet/spice colour system, regional pattern/motif, and the menu as content.
- No Instagram/social handle confirmed in the source (the incumbent has no social links).

## Product Principles

1. **The order button is the product.** Swiggy/Zomato hand-off is always one tap away, on every screen, and every order tap is a tracked `Lead`.
2. **Regional, not generic.** Specific Telugu/Andhra/Telangana dish names and the bellam↔kaaram framing over "authentic South Indian delivery" boilerplate.
3. **The menu is the main attraction.** A large, real, well-organised menu is this kitchen's strongest asset — present it as content worth reading, not a hidden PDF.
4. **Trust without fabrication.** Real address, real hours, real 3.6 rating, real ₹250-for-one. No invented history or reviews.
5. **Phone-first, hungry-reader.** Most visits are one-handed on mobile from an aggregator; decisions are made in seconds.

## Accessibility & Inclusion

WCAG AA: contrast (the incumbent had ~20 AA failures — do not reintroduce them), semantic landmarks and headings, keyboard-reachable nav and order buttons, visible focus, `prefers-reduced-motion` honoured, Telugu text with a font stack that actually renders Telugu (`Noto Sans Telugu` or system Telugu), `lang` attributes on Telugu spans.
