import { useState, useMemo, useEffect } from 'react';
import { Bus, MapPin, Search, X, TrainFront as Train, Navigation, LocateFixed, Star, Clock } from 'lucide-react';
import type { BusStop } from '../hooks/useBusData';
import { getMrtStationsForBusStop, type MrtStationInfo } from '../data/busStopMrtMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { useFavourites } from '../hooks/useFavourites';
import { distanceKm, formatDistance } from '../lib/geo';

interface Props {
  stops: BusStop[];
  loading: boolean;
  onSelect: (stop: BusStop) => void;
  selectedCode: string | null;
}

const POPULAR_CODES = [
  '02009','02013','02021','04179','04171','04181',
  '03011','03021','07111','07121','08001','08011',
  '05129','05131','02211','02212','01112','01121',
  '09111','09121',
];

export default function BusStopList({ stops, loading, onSelect, selectedCode }: Props) {
  const [query, setQuery] = useState('');
  const geo = useGeolocation();
  const fav = useFavourites();

  // Ask for location as soon as the bus tab opens
  useEffect(() => { geo.request(); }, [geo.request]);

  const stopByCode = useMemo(() => {
    const m = new Map<string, BusStop>();
    for (const s of stops) m.set(s.BusStopCode, s);
    return m;
  }, [stops]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return stops.filter(s => s.Description.toLowerCase().includes(q) || s.RoadName.toLowerCase().includes(q) || s.BusStopCode.includes(q)).slice(0, 50);
  }, [stops, query]);

  const nearestStops = useMemo(() => {
    if (query.trim() || !geo.position || stops.length === 0) return [];
    return stops
      .map(s => ({ stop: s, d: distanceKm(geo.position!.lat, geo.position!.lng, s.Latitude, s.Longitude) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 15);
  }, [stops, query, geo.position]);

  const distanceMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const n of nearestStops) m.set(n.stop.BusStopCode, formatDistance(n.d));
    return m;
  }, [nearestStops]);

  // Fall back to popular stops when location is unavailable
  const popularStops = useMemo(() => {
    if (query.trim() || nearestStops.length > 0) return [];
    return POPULAR_CODES.map(code => stopByCode.get(code)).filter((s): s is BusStop => !!s);
  }, [stopByCode, query, nearestStops]);

  const favStops = useMemo(() =>
    fav.favStops.map(c => stopByCode.get(c)).filter((s): s is BusStop => !!s),
  [fav.favStops, stopByCode]);

  const recentStops = useMemo(() =>
    fav.recentStops
      .map(c => stopByCode.get(c))
      .filter((s): s is BusStop => !!s)
      .filter(s => !fav.favStops.includes(s.BusStopCode)),
  [fav.recentStops, fav.favStops, stopByCode]);

  const showFavRecent = !query.trim();
  const displayStops = query.trim() ? filtered : nearestStops.length > 0 ? nearestStops.map(n => n.stop) : popularStops;
  const showingNearest = !query.trim() && nearestStops.length > 0;

  // Precompute MRT info for every stop we might render
  const mrtInfoMap = useMemo(() => {
    const m = new Map<string, MrtStationInfo[]>();
    const all = showFavRecent ? [...favStops, ...recentStops, ...displayStops] : displayStops;
    for (const stop of all) {
      if (m.has(stop.BusStopCode)) continue;
      const info = getMrtStationsForBusStop(stop.Description);
      if (info.length > 0) m.set(stop.BusStopCode, info);
    }
    return m;
  }, [showFavRecent, favStops, recentStops, displayStops]);

  const handleSelect = (stop: BusStop) => {
    onSelect(stop);
    fav.addRecentStop(stop.BusStopCode);
  };

  const renderRow = (stop: BusStop, keyPrefix: string) => {
    const isSelected = selectedCode === stop.BusStopCode;
    const mrtStations = mrtInfoMap.get(stop.BusStopCode);
    const distance = distanceMap.get(stop.BusStopCode);
    const isFav = fav.isFavStop(stop.BusStopCode);
    return (
      <button key={`${keyPrefix}-${stop.BusStopCode}`} onClick={() => handleSelect(stop)}
        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${isSelected ? 'bg-gray-900 dark:bg-gray-800 text-white shadow-md' : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm'}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <Bus size={14} className={isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>{stop.Description}</p>
          <div className={`flex items-center gap-1.5 text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
            <MapPin size={9} />
            <span className="truncate">{stop.RoadName}</span>
            <span className="opacity-50">|</span>
            <span>{stop.BusStopCode}</span>
            {distance && (
              <>
                <span className="opacity-50">|</span>
                <span className={`flex items-center gap-0.5 font-semibold ${isSelected ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'}`}>
                  <Navigation size={9} />
                  {distance}
                </span>
              </>
            )}
          </div>
          {mrtStations && mrtStations.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Train size={10} className={isSelected ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'} />
              {mrtStations.map(mrt => (
                <span
                  key={mrt.code}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: mrt.lineColor }}
                >
                  {mrt.code}
                </span>
              ))}
            </div>
          )}
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label={isFav ? 'Remove favourite' : 'Add favourite'}
          onClick={e => { e.stopPropagation(); fav.toggleFavStop(stop.BusStopCode); }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); fav.toggleFavStop(stop.BusStopCode); } }}
          className={`flex-shrink-0 -m-2 p-3 rounded-full cursor-pointer active:scale-90 transition-all ${isSelected ? 'hover:bg-white/10' : 'hover:bg-amber-50 dark:hover:bg-amber-950/40'}`}
        >
          <Star size={20} className={isFav ? 'fill-amber-400 text-amber-400' : (isSelected ? 'text-gray-400' : 'text-gray-300 dark:text-gray-600')} />
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input type="text" placeholder="Search bus stops by name, road, or code..." value={query} onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all" />
        {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
      </div>

      {showFavRecent && favStops.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Star size={10} className="fill-amber-400 text-amber-400" /> Favourites
          </p>
          {favStops.map(stop => renderRow(stop, 'fav'))}
        </div>
      )}

      {showFavRecent && recentStops.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={10} /> Recent
          </p>
          {recentStops.map(stop => renderRow(stop, 'recent'))}
        </div>
      )}

      {loading && (
        <div className="space-y-1.5" aria-busy="true" aria-label="Loading bus stops">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-2.5 w-2/5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !query.trim() && geo.status === 'locating' && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-2 justify-center">
          <LocateFixed size={14} className="animate-pulse" /> Finding bus stops near you...
        </div>
      )}
      {!loading && !query.trim() && (geo.status === 'denied' || geo.status === 'error' || geo.status === 'unsupported') && (
        <div className="px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-700 dark:text-amber-400">
          {geo.status === 'denied'
            ? 'Location access was denied — showing popular stops instead. Allow location in your browser to see stops near you.'
            : 'Unable to get your location — showing popular stops instead.'}
        </div>
      )}
      {!loading && displayStops.length === 0 && query.trim() && <div className="text-center py-8 text-gray-400 dark:text-gray-500"><Bus size={24} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No bus stops found for "{query}"</p></div>}
      {!loading && displayStops.length === 0 && !query.trim() && geo.status !== 'locating' && favStops.length === 0 && recentStops.length === 0 && <div className="text-center py-8 text-gray-400 dark:text-gray-500"><Bus size={24} className="mx-auto mb-2 opacity-30" /><p className="text-sm">Type a stop name, road, or code to search</p></div>}

      <div className="space-y-1.5">
        {!query.trim() && displayStops.length > 0 && (
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            {showingNearest && <Navigation size={10} className="text-blue-500" />}
            {showingNearest ? 'Nearest Stops' : 'Popular Stops'}
          </p>
        )}
        {displayStops.map(stop => renderRow(stop, 'list'))}
      </div>
      {query.trim() && filtered.length >= 50 && <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Showing top 50 results. Refine your search.</p>}
    </div>
  );
}
