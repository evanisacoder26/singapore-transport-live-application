import { useState, useCallback } from 'react';

export type GeoStatus = 'idle' | 'locating' | 'ready' | 'denied' | 'error' | 'unsupported';

export interface GeoPosition {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [position, setPosition] = useState<GeoPosition | null>(null);

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('ready');
      },
      err => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }, []);

  const clear = useCallback(() => {
    setStatus('idle');
    setPosition(null);
  }, []);

  return { status, position, request, clear };
}
