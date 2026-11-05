# Auction Scout

A one-page phone app for flipping thrift-auction finds.

- **Watch list**: brands/keywords with your resale value. Each item opens a Goodwill search, a Salvation Army search (both ending soonest), and eBay used sold prices.
- **Bid up to**: your value − minimum gap − that site's ship + fees estimate (set in Settings).
- **Look up a listing**: paste a listing title; it strips lot codes and frame sizes and opens eBay sold or ending-soonest results.
- **iPhone Shortcut**: open `index.html?t=<page title>&go=sold` (or `go=live`) from a Share-sheet Shortcut to jump straight to eBay.

It never reads the auction sites or eBay itself. Every search is a link you tap. The watch list is kept only in your phone's browser (localStorage).
