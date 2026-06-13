import { useState, useEffect, useCallback } from 'react';
import { fetchLTA } from '../lib/supabase';

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

export interface BusArrivalService {
  ServiceNo: string;
  Operator: string;
  NextBus: {
    OriginCode: string;
    DestinationCode: string;
    EstimatedArrival: string;
    Monitored: number;
    Latitude: string;
    Longitude: string;
    VisitNumber: string;
    Load: 'SEA' | 'SDA' | 'LSD' | '';
    Feature: string;
    Type: 'SD' | 'DD' | 'BD' | '';
  };
  NextBus2: {
    OriginCode: string;
    DestinationCode: string;
    EstimatedArrival: string;
    Monitored: number;
    Latitude: string;
    Longitude: string;
    VisitNumber: string;
    Load: 'SEA' | 'SDA' | 'LSD' | '';
    Feature: string;
    Type: 'SD' | 'DD' | 'BD' | '';
  };
  NextBus3: {
    OriginCode: string;
    DestinationCode: string;
    EstimatedArrival: string;
    Monitored: number;
    Latitude: string;
    Longitude: string;
    VisitNumber: string;
    Load: 'SEA' | 'SDA' | 'LSD' | '';
    Feature: string;
    Type: 'SD' | 'DD' | 'BD' | '';
  };
}

export interface BusArrivalResponse {
  BusStopCode: string;
  Services: BusArrivalService[];
}

export function useBusStops() {
  const [stops, setStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const allStops: BusStop[] = [];
      let skip = 0;
      let hasMore = true;
      while (hasMore) {
        const result = await fetchLTA({ action: 'bus_stops', $skip: String(skip) });
        const batch: BusStop[] = result.value ?? [];
        allStops.push(...batch);
        if (batch.length < 500) hasMore = false;
        else skip += 500;
      }
      setStops(allStops);
      setLoaded(true);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  useEffect(() => { load(); }, [load]);

  return { stops, loading };
}

export function useBusArrivals(busStopCode: string) {
  const [data, setData] = useState<BusArrivalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!busStopCode) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLTA({ action: 'bus_arrival', BusStopCode: busStopCode });
      setData(result);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [busStopCode]);

  useEffect(() => {
    load();
    const id = setInterval(load, 20_000);
    return () => clearInterval(id);
  }, [load]);

  return { data, loading, error, refresh: load };
}

export function getMinutesUntil(isoTime: string): number | null {
  if (!isoTime) return null;
  try {
    const arrival = new Date(isoTime);
    const now = new Date();
    const diff = (arrival.getTime() - now.getTime()) / 1000;
    return Math.max(0, Math.floor(diff / 60));
  } catch {
    return null;
  }
}

export const LOAD_LABELS: Record<string, { text: string; color: string; bg: string }> = {
  SEA: { text: 'Seats available', color: 'text-green-700', bg: 'bg-green-100' },
  SDA: { text: 'Standing available', color: 'text-amber-700', bg: 'bg-amber-100' },
  LSD: { text: 'Limited standing', color: 'text-red-700', bg: 'bg-red-100' },
  '': { text: '', color: '', bg: '' },
};

export const BUS_TYPE: Record<string, string> = {
  SD: 'Single', DD: 'Double', BD: 'Bendy', '': '',
};

export const OPERATOR_NAMES: Record<string, string> = {
  SBST: 'SBS Transit', SMRT: 'SMRT', TTS: 'Tower Transit', GAS: 'Go-Ahead',
};
