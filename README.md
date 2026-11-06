# Auction Scout

A one-page phone app for flipping thrift-auction finds.

- **Watch list**: brands/keywords with your resale value. Each item opens a Goodwill search, a Salvation Army search (both ending soonest), and eBay used sold prices.
- **Bid up to**: your value − minimum gap − that site's ship + fees estimate (set in Settings).
- **Look up a listing**: paste a listing title; it strips lot codes and frame sizes and opens eBay sold or ending-soonest results.
- **iPhone Shortcut**: open `index.html?t=<page title>&go=sold` (or `go=live`) from a Share-sheet Shortcut to jump straight to eBay.

It never reads the auction sites or eBay itself. Every search is a link you tap. The watch list is kept only in your phone's browser (localStorage).

## Computer: browser extension (Chrome or Edge)

The `extension/` folder is an extension for Chrome or Edge. Open any ShopGoodwill or Salvation Army listing and a small **eBay lookup** panel appears in the bottom-left corner:

- **Open eBay sold automatically** (on by default): a used sold-prices search for that listing opens in a background tab next to it, so you stay on the listing. It opens once per listing, so reloading doesn't open another.
- **Sold** and **Ending soon** buttons open those eBay searches and switch to them. Edit the words first if the cleanup got them wrong; Enter runs Sold.
- **×** hides the panel until the next listing.

It reads only the title of the listing you have open, the same way the phone Shortcut does. It never browses either site or eBay on its own.

Install once:

1. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and pick the `extension` folder: `C:\Users\micha\Projects\auction-scout\extension`.

After pulling an update, click the extension's reload ↻ button on that page.

## iPhone Shortcut (Share a listing → eBay)

Live app: https://datadaddy.github.io/auction-scout/

Build once in the **Shortcuts** app:

1. Tap **+** to make a new shortcut. Name it **eBay sold**.
2. Tap the **ⓘ** (details) button and turn on **Show in Share Sheet**. Under the shortcut's input, choose **Safari web pages** only.
3. Add the action **Get Details of Safari Web Page**. Set it to get **Name** from **Shortcut Input**.
4. Add **URL Encode** (mode: Encode), using the **Name** from step 3.
5. Add **URL** with this text, then tap at the end and insert the **URL Encoded Text** variable:
   `https://datadaddy.github.io/auction-scout/?go=sold&t=`
6. Add **Open URLs**.

For live listings ending soonest, duplicate the shortcut, name it **eBay ending soon**, and change `go=sold` to `go=live`.

Use it in **Safari**: on a Goodwill or Salvation Army listing, tap Share and pick the shortcut. Leave out `go=...` to land in the app with the search words filled in so you can edit them first.

## iPhone Shortcut: scan the code on a frame arm

The iPhone reads engraved text far better than anything that runs in a web page. (A browser text reader was tested on a Maui Jim arm and read "MJ-502-23" as "TMI =8502-23".) So the iPhone does the reading and the app does the cleanup:

1. New shortcut, named **Scan frame code**. Add it to your Home Screen if you like (ⓘ → Add to Home Screen).
2. Add **Take Photo** (turn off Show Camera Preview only if you want it faster).
3. Add **Extract Text from Image**, using the **Photo**.
4. Add **URL Encode** (Encode), using the **Text from Image**.
5. Add **URL**: `https://datadaddy.github.io/auction-scout/?t=` then insert the **URL Encoded Text**.
6. Add **Open URLs**.

You land in the app with the search words filled in, for example "MAUI MJ-502-23" becomes "Maui Jim MJ-502-23". Fix any misread characters, then tap **Sold prices**. To skip the check and go straight to eBay, add `go=sold&` after the `?`.

No-Shortcut way: point the Camera at the code, tap the text (Live Text) icon, copy, then tap **Paste** in the app.
