// Auction Scout: on a ShopGoodwill or Salvation Army listing, show a small panel that
// searches eBay for the same item, and (if switched on) open the eBay sold search by itself.
// It only reads the title of the listing you are looking at. It never crawls or clicks.

// ---- Title cleanup: same rules as the phone app (index.html), kept in step by hand ----
function titleToQuery(title) {
  return title
    .replace(/\s*\|\s*shopgoodwill\.com\s*$/i, " ")
    .replace(/^\s*online thrift store\s*\|\s*shopthesalvationarmy\s*-\s*/i, " ")
    .replace(/\b(MJ|RB|RX|O[OX]|PO|OV|TF|FT|GG|S?V?PR)\s+(?=\d)/gi, "$1-")
    .replace(/\bw\/[^|]*/gi, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/(?<=^|\s)\d{2,3}\s*[-□xX\s]\s*\d{2}(?:\s*[-□xX\s]\s*\d{3})?(?=\s|$)/g, " ")
    .replace(/\b\d+\s*mm\b/gi, " ")
    .replace(/[|•,;:!*"()]/g, " ")
    .replace(/\b(?:as is|lot of|pre-owned|preowned|used|authentic|nice|great|coa)\b/gi, " ")
    .split(/\s+/)
    .filter(w => /[a-z0-9]/i.test(w) && !/^[a-z]$/i.test(w))
    .slice(0, 6).join(" ")
    .replace(/.+/, q => withBrand(q));
}
const CODE_BRANDS = [
  [/^MJ[-\s]?\d/i, "Maui Jim", /maui\s*jim/i],
  [/^RB[-\s]?\d/i, "Ray-Ban", /ray[\s-]?ban/i],
  [/^RX[-\s]?\d/i, "Ray-Ban", /ray[\s-]?ban/i],
  [/^O[OX][-\s]?\d/i, "Oakley", /oakley/i],
  [/^PO[-\s]?\d/i, "Persol", /persol/i],
  [/^OV[-\s]?\d/i, "Oliver Peoples", /oliver/i],
  [/^(?:TF|FT)[-\s]?\d/i, "Tom Ford", /tom\s*ford/i],
  [/^GG[-\s]?\d/i, "Gucci", /gucci/i],
  [/^(?:SPR|VPR|PR)[-\s]?\d/i, "Prada", /prada/i],
];
function withBrand(q) {
  const words = q.split(" ");
  for (const [code, brand, has] of CODE_BRANDS) {
    if (words.some(w => code.test(w)) && !has.test(q)) {
      const first = brand.split(/[\s-]/)[0].toLowerCase();
      return [brand, ...words.filter(w => w.toLowerCase() !== first)].slice(0, 6).join(" ");
    }
  }
  return q;
}
const ebaySoldUrl = q => "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(q) +
  "&LH_Sold=1&LH_Complete=1&LH_ItemCondition=3000&_sop=13";
const ebayLiveUrl = q => "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(q) +
  "&LH_ItemCondition=3000&_sop=1";

// ---- Which page is a listing, and when its real title has loaded ----
const isGoodwill = /shopgoodwill\.com$/i.test(location.hostname);
function listingId() {
  const m = isGoodwill ? location.pathname.match(/^\/item\/(\d+)/i)
                       : location.pathname.match(/^\/Listing\/Details\/(\d+)/i);
  return m ? (isGoodwill ? "gw" : "sa") + m[1] : null;
}
// Goodwill swaps listings without reloading, and the previous page's title lingers for a moment.
// Its listing page prints the item number, so wait until that number is on screen.
function titleReady(t, id) {
  if (!isGoodwill) return /^\s*online thrift store\s*\|\s*shopthesalvationarmy\s*-\s*\S/i.test(t);
  return /\|\s*shopgoodwill\.com\s*$/i.test(t) && document.body.innerText.includes(id.slice(2));
}

// ---- Panel ----
let host = null;
function removePanel() { if (host) { host.remove(); host = null; } }
function showPanel(query, autoSold) {
  removePanel();
  host = document.createElement("div");
  host.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:2147483647";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>
      .p{font:13px/1.3 system-ui,sans-serif;background:#16181d;color:#eee;border-radius:10px;
         box-shadow:0 6px 24px rgba(0,0,0,.35);padding:10px;width:290px}
      .h{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-weight:600}
      .x{background:none;border:0;color:#aaa;font-size:18px;cursor:pointer;padding:0 4px}
      input[type=text]{width:100%;box-sizing:border-box;padding:6px 8px;border-radius:6px;border:1px solid #444;
         background:#0e0f12;color:#fff;font:inherit}
      .b{display:flex;gap:6px;margin-top:8px}
      .b button{flex:1;padding:7px;border:0;border-radius:6px;font:inherit;font-weight:600;cursor:pointer}
      .sold{background:#2f7d4f;color:#fff}.live{background:#3a5fa8;color:#fff}
      label{display:flex;gap:6px;align-items:center;margin-top:8px;color:#bbb;font-size:12px;cursor:pointer}
    </style>
    <div class="p">
      <div class="h">eBay lookup <button class="x" title="Hide">×</button></div>
      <input type="text" aria-label="eBay search words">
      <div class="b"><button class="sold">Sold</button><button class="live">Ending soon</button></div>
      <label><input type="checkbox" class="auto"> Open eBay sold automatically</label>
    </div>`;
  const input = root.querySelector("input[type=text]");
  input.value = query;
  const open = make => chrome.runtime.sendMessage({ type: "open", url: make(input.value.trim()), focus: true });
  root.querySelector(".sold").onclick = () => open(ebaySoldUrl);
  root.querySelector(".live").onclick = () => open(ebayLiveUrl);
  input.addEventListener("keydown", e => { if (e.key === "Enter") open(ebaySoldUrl); });
  root.querySelector(".x").onclick = removePanel;
  const auto = root.querySelector(".auto");
  auto.checked = autoSold;
  auto.onchange = () => chrome.storage.local.set({ autoSold: auto.checked });
  document.documentElement.appendChild(host);
}

// ---- Watch for listings (Goodwill swaps pages without reloading, so poll) ----
let handledId = null;
function tick() {
  const id = listingId();
  if (!id) { if (handledId) { removePanel(); handledId = null; } return; }
  if (id === handledId) return;
  const t = document.title;
  if (!titleReady(t, id)) return;
  handledId = id;
  const query = titleToQuery(t);
  chrome.storage.local.get({ autoSold: true }, ({ autoSold }) => {
    if (listingId() !== id) return;
    showPanel(query, autoSold);
    // Once per listing per tab, so reloading the page doesn't open another eBay tab.
    const key = "auctionScout.opened." + id;
    if (autoSold && query && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      chrome.runtime.sendMessage({ type: "open", url: ebaySoldUrl(query), focus: false });
    }
  });
}
setInterval(tick, 700);
tick();
