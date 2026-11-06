// Opens eBay searches next to the listing tab. Content scripts can't open tabs
// without a click, so the auto-open goes through here.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type !== "open" || !/^https:\/\/www\.ebay\.com\//.test(msg.url)) return;
  chrome.tabs.create({
    url: msg.url,
    active: !!msg.focus,
    index: sender.tab ? sender.tab.index + 1 : undefined,
  });
});
