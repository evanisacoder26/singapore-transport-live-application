import { useState, useEffect, useCallback } from 'react';
import { fetchLTA } from '../lib/supabase';

export type CrowdLevel = 'l' | 'm' | 'h' | 'na';

export interface CrowdEntry {
  Station: string;
  StartTime: string;
  EndTime: string;
  CrowdLevel: CrowdLevel;
}

// LTA returns CrowdLevel inconsistently cased ("l"/"L"/"na"/"NA"). Normalize to
// canonical lowercase so the UI lookup never misses (a missed key crashes the card).
function normalizeCrowd(raw: unknown): CrowdEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((e) => {
    const lvl = String((e as { CrowdLevel?: unknown })?.CrowdLevel ?? '').toLowerCase();
    const CrowdLevel: CrowdLevel = lvl === 'l' || lvl === 'm' || lvl === 'h' ? lvl : 'na';
    return { ...(e as CrowdEntry), CrowdLevel };
  });
}

export interface TrainAlertMessage {
  Content: string;
  CreatedDate: string;
}

export interface TrainAlert {
  Status: number;
  Line: string;
  Direction: string;
  Stations: string;
  FreePublicBus: string;
  FreeMRTShuttle: string;
  MRTShuttleDirection: string;
  Message: TrainAlertMessage[];
}

export interface TrainServiceAlertResponse {
  Status: number;
  AffectedSegments: TrainAlert[];
  Message: TrainAlertMessage[];
}

export interface MaintenanceEntry {
  Line: string;
  StationCode: string;
  StationName: string;
  LiftID?: string;
  LiftDesc?: string;
}

const LTA_LINE_MAP: Record<string, string> = {
  NS: 'NSL', EW: 'EWL', NE: 'NEL', CC: 'CCL',
  DT: 'DTL', TE: 'TEL', CG: 'CGL', CE: 'CEL',
  BP: 'BPL', SK: 'SLRT', PG: 'PLRT',
};

export function useCrowdData(linePrefixes: string | string[]) {
  const [data, setData] = useState<CrowdEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stable key so the effect doesn't re-run when the caller passes a new array
  const linesKey = Array.isArray(linePrefixes) ? linePrefixes.join(',') : linePrefixes;

  const load = useCallback(async () => {
    const lines = linesKey.split(',').filter(Boolean);
    if (lines.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      // LTA's crowd endpoint accepts one TrainLine per request
      const results = await Promise.all(
        lines.map(p =>
          fetchLTA({ action: 'crowd', TrainLine: LTA_LINE_MAP[p] ?? 'NSL' })
            .then(r => normalizeCrowd(r.value))
            .catch(() => [] as CrowdEntry[])
        )
      );
      setData(results.flat());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [linesKey]);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  return { data, loading, error, refresh: load };
}

export function useTrainAlerts() {
  const [alerts, setAlerts] = useState<TrainAlert[]>([]);
  const [messages, setMessages] = useState<TrainAlertMessage[]>([]);
  const [status, setStatus] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  // Fail-soft freshness tracking. We hold the last good data and degrade
  // gracefully instead of flipping to "unavailable" on a single failed poll.
  const [everLoaded, setEverLoaded] = useState(false); // got data at least once this session?
  const [stale, setStale] = useState(false);           // did the latest poll fail?
  const [lastUpdated, setLastUpdated] = useState<number | null>(null); // ts of last success

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchLTA({ action: 'alerts' });
      const value = result.value;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const resp = value as TrainServiceAlertResponse;
        setAlerts(resp.AffectedSegments ?? []);
        setMessages(resp.Message ?? []);
        setStatus(resp.Status ?? 1);
      } else if (Array.isArray(value)) {
        setAlerts(value);
        setMessages([]);
        setStatus(value.length === 0 ? 1 : 2);
      } else {
        setAlerts([]);
        setMessages([]);
        setStatus(1);
      }
      setLastUpdated(Date.now());
      setEverLoaded(true);
      setStale(false);
    } catch {
      // Fetch failed (LTA down / rate-limited). Keep the last good data in
      // place but mark it stale — the banner shows it with a "last checked"
      // note instead of either lying (green) or going dark (amber flicker).
      setStale(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  return { alerts, messages, status, loading, everLoaded, stale, lastUpdated, refresh: load };
}

export function useMaintenanceData() {
  const [data, setData] = useState<MaintenanceEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchLTA({ action: 'maintenance' });
      setData(result.value ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading };
}
