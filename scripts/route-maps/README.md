# Route-map cards

Renders the title-card route maps used in posts (`public/images/cities-on-foot/*.jpg`):
a MapLibre map on OpenFreeMap/OSM tiles, with the GPS route, labels, a locator inset and a stats card.

Not part of the site build. Nothing here is deployed.

## Files

- `runs/<run>.json`: one config per map (labels, POIs, padding, inset, card text and stats).
- `render.html`: loads a run in the browser, saves `out/<run>-map.png`, `-inset.png` and `-meta.json`.
- `compose.mjs`: builds the final card (`out/<run>-final.jpg`, 1800 px wide) with `sharp`.
- `server.py`: local server on port 8767 that serves this folder and accepts `POST /save/<file>` into `out/`.
- `out/`: git-ignored. GPS tracks (`<run>-latlng.json`, `[[lat, lng], ...]`), renders and finals.

## New map

1. Get the GPS track and save it as `out/<run>-latlng.json`. For a Strava activity, read the stream while logged in and POST it to `http://127.0.0.1:8767/save/<run>-latlng.json`.
2. Copy a similar `runs/*.json` to `runs/<run>.json`. Set `name`, `routeUrl` (`/out/<run>-latlng.json`), `totalKm`, `card` and the POIs.
3. Start the server: `python3 server.py`.
4. Open `http://127.0.0.1:8767/render.html?run=<run>` in a browser and wait for the tab title to start with `saved`. Check `warn` in the title for POIs sitting on the route.
5. Run `node compose.mjs <run>`.
6. Look at `out/<run>-final.jpg`, then copy it to `public/images/<post>/<name>.jpg`.

## Edit only the card text

Change `card` in `runs/<run>.json`, then run `node compose.mjs <run>`. The existing `out/<run>-map.png` is reused, so no re-render is needed.

## Conventions

- Place labels use the native names from the map data. Honolulu and Seoul cards use English + Chinese.
- Images are 1800×1296 and sit at the text-column width. Tap or click opens the full image.
- The exact start and finish of a finished trip are fine to publish.
