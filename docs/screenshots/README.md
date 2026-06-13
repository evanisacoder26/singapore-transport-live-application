# Screenshots

These images are embedded by [`documentation.md`](../../documentation.md). Captured from the
running app at `http://localhost:5173` via the gstack headless browser.

| File | View | Captured at |
| :--- | :--- | :--- |
| `app-showcase.png` | Desktop — MRT list + station detail panel (hero) | 1280×860 |
| `feature-crowd.png` | Mobile — station detail sheet w/ Platform Crowd bar | 390×844 |
| `feature-alerts.png` | Mobile — fail-soft service alerts banner | 390×844 |
| `feature-bus.png` | Mobile — bus arrivals board (transit-blue header) | 390×844 |

**To refresh:** start the dev server (`npm run dev`), then re-capture with the
`browse` skill (`$B goto http://localhost:5173`, navigate, `$B screenshot <path> --viewport`).
Export at 2× viewport for crisper HiDPI rendering if desired.
