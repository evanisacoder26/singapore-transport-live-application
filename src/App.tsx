import { useState, useMemo } from 'react';
import { TrainFront as Train, TramFront as Tram, Bus, RefreshCw, MapPin, Moon, Sun, LocateFixed, Star, Clock, RotateCw } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import LineSelector from './components/LineSelector';
import StationCard from './components/StationCard';
import StationDetail from './components/StationDetail';
import AlertsBanner from './components/AlertsBanner';
import SearchBar from './components/SearchBar';
import BusStopList from './components/BusStopList';
import BusArrivalBoard from './components/BusArrivalBoard';
import CclWayfinding from './components/CclWayfinding';
import HeaderClock from './components/HeaderClock';
import { STATIONS, getStationsByLine, searchStations, type Station } from './data/stations';
import { useCrowdData, useTrainAlerts, useMaintenanceData } from './hooks/useMrtData';
import { useBusStops, type BusStop } from './hooks/useBusData';
import { useGeolocation } from './hooks/useGeolocation';
import { useFavourites } from './hooks/useFavourites';
import { getNearestStations } from './data/stationCoords';
import { formatDistance } from './lib/geo';

type Tab = 'mrt' | 'lrt' | 'bus' | 'ccl';

export default function App() {
  const { toggleTheme, theme } = useTheme();
  const [tab, setTab] = useState<Tab>('mrt');
  const [activeLine, setActiveLine] = useState('NS');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [query, setQuery] = useState('');
  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | null>(null);

  const geo = useGeolocation();
  const fav = useFavourites();

  const stationByCode = useMemo(() => {
    const m = new Map<string, Station>();
    for (const s of STATIONS) m.set(s.code, s);
    return m;
  }, []);

  const nearbyActive = geo.status === 'ready' || geo.status === 'locating';

  const nearbyStations = useMemo(() => {
    if (!geo.position) return null;
    const type = tab === 'lrt' ? 'lrt' as const : 'mrt' as const;
    return getNearestStations(geo.position.lat, geo.position.lng, type, 10);
  }, [geo.position, tab]);

  const isLrtLine = (line: string) => ['BP', 'SK', 'PG'].includes(line);

  // Favourites + recents for the current tab type (MRT vs LRT)
  const favStationObjs = useMemo(() =>
    fav.favStations
      .map(c => stationByCode.get(c))
      .filter((s): s is Station => !!s)
      .filter(s => isLrtLine(s.line) === (tab === 'lrt')),
  [fav.favStations, stationByCode, tab]);

  const recentStationObjs = useMemo(() =>
    fav.recentStations
      .map(c => stationByCode.get(c))
      .filter((s): s is Station => !!s)
      .filter(s => isLrtLine(s.line) === (tab === 'lrt'))
      .filter(s => !fav.favStations.includes(s.code)),
  [fav.recentStations, fav.favStations, stationByCode, tab]);

  // Fetch crowd for the active line, nearby lines, and any favourite/recent lines on show
  const crowdLines = useMemo(() => {
    const lines = new Set<string>([activeLine]);
    if (nearbyActive && nearbyStations) for (const n of nearbyStations) lines.add(n.station.line);
    for (const s of favStationObjs) lines.add(s.line);
    for (const s of recentStationObjs) lines.add(s.line);
    return [...lines];
  }, [nearbyActive, nearbyStations, activeLine, favStationObjs, recentStationObjs]);

  const { data: crowdData, loading: crowdLoading, refresh: refreshCrowd } = useCrowdData(crowdLines);
  const { alerts, messages, status, everLoaded: alertsEverLoaded, stale: alertsStale, lastUpdated: alertsLastUpdated } = useTrainAlerts();
  const { data: maintenance } = useMaintenanceData();
  const { stops: busStops, loading: busStopsLoading } = useBusStops();

  const displayedStations = useMemo(() => {
    if (query.trim()) return searchStations(query);
    return getStationsByLine(activeLine);
  }, [activeLine, query]);

  // Unified render list: nearby mode carries a distance label per station
  const stationList = useMemo(() => {
    if (!query.trim() && nearbyActive && nearbyStations) {
      return nearbyStations.map(n => ({ station: n.station, distanceLabel: formatDistance(n.distanceKm) }));
    }
    return displayedStations.map(s => ({ station: s, distanceLabel: undefined as string | undefined }));
  }, [query, nearbyActive, nearbyStations, displayedStations]);

  const crowdMap = useMemo(() => {
    const m: Record<string, (typeof crowdData)[0]> = {};
    for (const entry of crowdData) m[entry.Station] = entry;
    return m;
  }, [crowdData]);

  const maintenanceSet = useMemo(() => {
    const s = new Set<string>();
    for (const m of maintenance) s.add(m.StationCode);
    return s;
  }, [maintenance]);

  const selectedMaintenance = useMemo(() => {
    if (!selectedStation) return [];
    return maintenance.filter(m => m.StationCode === selectedStation.code);
  }, [selectedStation, maintenance]);

  const openStation = (station: Station) => {
    setSelectedStation(prev => (prev?.code === station.code ? null : station));
    fav.addRecentStation(station.code);
  };

  const handleLineChange = (line: string) => {
    setActiveLine(line);
    setSelectedStation(null);
    setQuery('');
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setSelectedStation(null);
    setSelectedBusStop(null);
    setQuery('');
    if (t === 'mrt' && activeLine !== 'NS') setActiveLine('NS');
    if (t === 'lrt' && !['BP','SK','PG'].includes(activeLine)) setActiveLine('BP');
  };

  const tabIcon = (t: Tab) => {
    if (t === 'bus') return <Bus size={15} />;
    if (t === 'lrt') return <Tram size={15} />;
    if (t === 'ccl') return <RotateCw size={15} />;
    return <Train size={15} />;
  };

  const tabLabel = (t: Tab) => {
    if (t === 'mrt') return 'MRT';
    if (t === 'lrt') return 'LRT';
    if (t === 'ccl') return 'CCL';
    return 'Bus';
  };

  const lineColor = STATIONS.find(s => s.line === activeLine)?.lineColor ?? '#D42E12';

  const lineFilter = tab === 'mrt' ? 'mrt' as const : tab === 'lrt' ? 'lrt' as const : 'all' as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-900 dark:bg-gray-800">
              {tabIcon(tab) && <span className="text-white">{tabIcon(tab)}</span>}
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                {tab === 'ccl' ? 'SG Circle Line' : `SG ${tabLabel(tab)} Live`}
              </h1>
              <HeaderClock />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sun size={13} className="text-gray-400 dark:text-gray-500" />
              <button
                onClick={toggleTheme}
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                aria-label="Toggle dark mode"
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <Moon size={13} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><MapPin size={12} /><span>Singapore</span></div>
          </div>
        </div>
      </header>

      {/* Tab switcher */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {(['mrt', 'lrt', 'bus', 'ccl'] as Tab[]).map(t => (
            <button key={t} onClick={() => handleTabChange(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === t ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              {tabIcon(t)}
              {tabLabel(t)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        {/* MRT & LRT shared layout */}
        {(tab === 'mrt' || tab === 'lrt') && (
          <>
            <AlertsBanner alerts={alerts} messages={messages} status={status} everLoaded={alertsEverLoaded} stale={alertsStale} lastUpdated={alertsLastUpdated} />

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {tab === 'mrt' ? 'Select MRT Line' : 'Select LRT Line'}
              </p>
              <LineSelector selected={activeLine} onChange={handleLineChange} filter={lineFilter} />
            </div>

            <SearchBar value={query} onChange={setQuery} />

            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                {!query.trim() && !nearbyActive && favStationObjs.length > 0 && (
                  <div className="mb-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      <Star size={11} className="fill-amber-400 text-amber-400" /> Favourites
                    </p>
                    <div className="space-y-2">
                      {favStationObjs.map(station => (
                        <StationCard key={`fav-${station.code}`} station={station} crowdEntry={crowdMap[station.code]}
                          hasMaintenance={maintenanceSet.has(station.code)} isSelected={selectedStation?.code === station.code}
                          isFavourite onToggleFavourite={() => fav.toggleFavStation(station.code)}
                          onClick={() => openStation(station)} />
                      ))}
                    </div>
                  </div>
                )}
                {!query.trim() && !nearbyActive && recentStationObjs.length > 0 && (
                  <div className="mb-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      <Clock size={11} /> Recent
                    </p>
                    <div className="space-y-2">
                      {recentStationObjs.map(station => (
                        <StationCard key={`recent-${station.code}`} station={station} crowdEntry={crowdMap[station.code]}
                          hasMaintenance={maintenanceSet.has(station.code)} isSelected={selectedStation?.code === station.code}
                          isFavourite={fav.isFavStation(station.code)} onToggleFavourite={() => fav.toggleFavStation(station.code)}
                          onClick={() => openStation(station)} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {query ? `Results for "${query}"` : nearbyActive ? 'Nearest Stations' : `${activeLine} Line Stations`}
                    <span className="ml-1.5 text-xs text-gray-400 font-normal">({stationList.length})</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => (nearbyActive ? geo.clear() : geo.request())}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${nearbyActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                      <LocateFixed size={12} className={geo.status === 'locating' ? 'animate-pulse' : ''} />
                      {geo.status === 'locating' ? 'Locating...' : nearbyActive ? 'Show All' : 'Near Me'}
                    </button>
                    <button onClick={refreshCrowd} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                      <RefreshCw size={12} className={crowdLoading ? 'animate-spin' : ''} /> Refresh
                    </button>
                  </div>
                </div>
                {(geo.status === 'denied' || geo.status === 'error' || geo.status === 'unsupported') && (
                  <div className="mb-3 px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                    {geo.status === 'denied'
                      ? 'Location access was denied. Allow location in your browser to see nearby stations.'
                      : 'Unable to get your location right now.'}
                  </div>
                )}
                {stationList.length === 0 ? (
                  <div className="text-center py-12 text-gray-400"><Train size={32} className="mx-auto mb-3 opacity-30" /><p className="text-sm">No stations found</p></div>
                ) : (
                  <div className="space-y-2">
                    {stationList.map(({ station, distanceLabel }) => (
                      <StationCard key={station.code} station={station} crowdEntry={crowdMap[station.code]}
                        hasMaintenance={maintenanceSet.has(station.code)} isSelected={selectedStation?.code === station.code}
                        distanceLabel={distanceLabel}
                        isFavourite={fav.isFavStation(station.code)} onToggleFavourite={() => fav.toggleFavStation(station.code)}
                        onClick={() => openStation(station)} />
                    ))}
                  </div>
                )}
              </div>
              {selectedStation && (
                <div className="hidden lg:block w-80 flex-shrink-0 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden sticky top-20 h-[calc(100vh-6rem)]">
                  <StationDetail station={selectedStation} crowdEntry={crowdMap[selectedStation.code]} maintenance={selectedMaintenance}
                    onClose={() => setSelectedStation(null)} onRefresh={refreshCrowd} refreshing={crowdLoading} />
                </div>
              )}
            </div>

            {selectedStation && (
              <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStation(null)} />
                <div className="relative bg-white dark:bg-gray-950 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                  <div className="flex-shrink-0 flex justify-center py-2.5"><div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" /></div>
                  <div className="flex-1 overflow-hidden">
                    <StationDetail station={selectedStation} crowdEntry={crowdMap[selectedStation.code]} maintenance={selectedMaintenance}
                      onClose={() => setSelectedStation(null)} onRefresh={refreshCrowd} refreshing={crowdLoading} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bus tab */}
        {tab === 'bus' && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <BusStopList stops={busStops} loading={busStopsLoading} onSelect={setSelectedBusStop} selectedCode={selectedBusStop?.BusStopCode ?? null} />
            </div>
            {selectedBusStop && (
              <div className="hidden lg:block w-96 flex-shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <BusArrivalBoard busStopCode={selectedBusStop.BusStopCode} busStopName={selectedBusStop.Description} roadName={selectedBusStop.RoadName} onClose={() => setSelectedBusStop(null)} />
              </div>
            )}
          </div>
        )}

        {/* CCL wayfinding tab */}
        {tab === 'ccl' && (
          <div className="max-w-2xl mx-auto">
            <CclWayfinding />
          </div>
        )}

        {tab === 'bus' && selectedBusStop && (
          <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedBusStop(null)} />
            <div className="relative bg-white dark:bg-gray-950 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="flex-shrink-0 flex justify-center py-2.5"><div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" /></div>
              <div className="flex-1 overflow-hidden">
                <BusArrivalBoard busStopCode={selectedBusStop.BusStopCode} busStopName={selectedBusStop.Description} roadName={selectedBusStop.RoadName} onClose={() => setSelectedBusStop(null)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
