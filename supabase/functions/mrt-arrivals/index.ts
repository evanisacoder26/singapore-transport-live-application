import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Lock CORS to an allowlist instead of "*". Set ALLOWED_ORIGINS in the
// function's environment to a comma-separated list of your deployed origins,
// e.g. "https://sgmrt.example.com,https://www.sgmrt.example.com".
// Falls back to local dev origins so the app still works during development.
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173,http://localhost:4173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  // Reflect the origin only if it's on the allowlist; otherwise return the
  // first allowed origin, which won't match the caller and the browser blocks it.
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };
}

const LTA_API_KEY = Deno.env.get("LTA_API_KEY") ?? "";
const LTA_BASE = "https://datamall2.mytransport.sg/ltaodataservice";

const LTA_LINE_MAP: Record<string, string> = {
  NS: "NSL", EW: "EWL", NE: "NEL", CC: "CCL",
  DT: "DTL", TE: "TEL", CG: "CGL", CE: "CEL",
  BP: "BPL", SK: "SLRT", PG: "PLRT",
};

async function ltaFetch(path: string) {
  const res = await fetch(`${LTA_BASE}${path}`, {
    headers: { AccountKey: LTA_API_KEY, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`LTA API error ${res.status}: ${path}`);
  return res.json();
}

Deno.serve(async (req: Request) => {
  const cors = corsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: cors });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "crowd";
    const stationCode = url.searchParams.get("StationCode") ?? "";
    const trainLine = url.searchParams.get("TrainLine") ?? "";
    const busStopCode = url.searchParams.get("BusStopCode") ?? "";
    const skip = url.searchParams.get("$skip") ?? "0";

    let data: unknown;

    if (action === "alerts") {
      data = await ltaFetch("/TrainServiceAlerts");
    } else if (action === "crowd") {
      const lineParam = trainLine || (() => {
        const prefix = stationCode.replace(/\d+$/, "");
        return LTA_LINE_MAP[prefix] ?? "NSL";
      })();
      data = await ltaFetch(`/PCDRealTime?TrainLine=${lineParam}`);
    } else if (action === "maintenance") {
      data = await ltaFetch("/v2/FacilitiesMaintenance");
    } else if (action === "crowd_forecast") {
      const lineParam = trainLine || "NSL";
      data = await ltaFetch(`/PCDForecast?TrainLine=${lineParam}`);
    } else if (action === "bus_arrival") {
      if (!busStopCode) {
        return new Response(JSON.stringify({ error: "BusStopCode is required" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
      }
      data = await ltaFetch(`/v3/BusArrival?BusStopCode=${busStopCode}`);
    } else if (action === "bus_stops") {
      data = await ltaFetch(`/BusStops?$skip=${skip}`);
    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(data), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
