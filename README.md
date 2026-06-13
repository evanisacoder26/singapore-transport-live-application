# 🚇 SG MRT Live

A real-time public transport companion for Singapore — live MRT/LRT train and bus arrivals, station crowd levels, service alerts, and a guided **Circle Line CCL6** wayfinding tutorial. Built on the official **LTA DataMall** feed, proxied securely through a Supabase Edge Function so the API key never touches the browser.

🔗 **Repo:** https://github.com/evanisacoder26/singapore-transport-live-application

---

## ✨ Features

- **Live train arrivals** for every MRT & LRT line, with interchange and line-color badges.
- **Live bus arrivals** by stop — next-bus timing, load, and bus type.
- **Crowd levels** per station (Low / Moderate / High) from LTA's real-time crowd feed, gracefully normalized so inconsistent casing never breaks the UI.
- **Service alerts banner** with a *fail-soft* design — it holds the last known status and shows a "last checked" note instead of lying green or flickering to "unavailable" when LTA's feed hiccups.
- **Near Me** — geolocation finds your nearest MRT/LRT stations and bus stops, sorted by walking distance.
- **Favourites & Recents** for both stations and bus stops, persisted locally.
- **Station exits & landmarks** — curated exit→landmark guidance for major stations (verified against Land Transport Guru; respects the TEL numbered-exit convention).
- **CCL6 Wayfinding tab** — an interactive guide to navigating the now-closed Circle Line loop (clockwise / anticlockwise, the "via Buona Vista" cue, spur stations, and transfers).
- **Lift/facility maintenance** indicators at affected stations.
- **Dark mode** throughout, with a polished mobile bottom-sheet layout.

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Backend proxy | Supabase Edge Function (Deno) |
| Data source | [LTA DataMall](https://datamall.lta.gov.sg/) |

---

## 🔐 Architecture & Security

The LTA DataMall API key is **never** exposed to the client. The browser calls a Supabase Edge Function (`supabase/functions/mrt-arrivals`), which holds the key server-side via `Deno.env` and forwards requests to LTA.

```
Browser ──(anon key)──▶ Supabase Edge Function ──(LTA_API_KEY)──▶ LTA DataMall
```

- `VITE_SUPABASE_ANON_KEY` is public **by design** (Supabase anon keys are meant to be shipped to the client).
- `LTA_API_KEY` lives only in Supabase function secrets.
- The edge function enforces a CORS allowlist (`ALLOWED_ORIGINS`) and `verify_jwt`.

> ⚠️ Set `ALLOWED_ORIGINS` to your real production domain and the correct `project_id` in `supabase/config.toml` before deploying.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [LTA DataMall](https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html) API key

### 1. Install
```bash
npm install
```

### 2. Configure environment
Copy the template and fill in your Supabase values:
```bash
cp .env.example .env
```
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Edge Function secrets (server-side)
These are **not** in `.env` — they're set in Supabase so they stay off the client:
```bash
supabase secrets set LTA_API_KEY=your-lta-datamall-key
supabase secrets set ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
```

### 4. Deploy the edge function
```bash
supabase functions deploy mrt-arrivals
```

### 5. Run locally
```bash
npm run dev
```
Open http://localhost:5173

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server (HMR) |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 📁 Project Structure

```
src/
  components/   UI: StationCard, StationDetail, AlertsBanner, BusStopList,
                BusArrivalBoard, CclWayfinding, LineSelector, SearchBar…
  hooks/        useMrtData, useBusData, useGeolocation, useFavourites
  data/         stations, stationCoords, stationExits, trainFrequency, routePlanner
  lib/          supabase (edge-function client), geo (Haversine/distance)
supabase/
  functions/mrt-arrivals/   Deno edge function proxying LTA DataMall
  config.toml               verify_jwt + project config
```

---

## 🙏 Data & Attribution

- Real-time data © [Land Transport Authority of Singapore](https://datamall.lta.gov.sg/) via LTA DataMall.
- Exit/landmark references cross-checked with [Land Transport Guru](https://landtransportguru.net/).
- CCL wayfinding guidance inspired by the official [LTA Circle Line wayfinding](https://www.lta.gov.sg/cclwayfinding/) materials.

This is an independent project and is not affiliated with or endorsed by the LTA.

---

## 📄 License

[MIT](./LICENSE)
