import { X, DoorOpen, Users, CircleAlert as AlertCircle, RefreshCw, Construction, Clock, Info, ArrowRightLeft, Star } from 'lucide-react';
import type { Station } from '../data/stations';
import { LINES, getInterchanges, isInterchange } from '../data/stations';
import type { CrowdEntry, MaintenanceEntry } from '../hooks/useMrtData';
import { getOperatingHours } from '../data/trainFrequency';
import { getStationExits } from '../data/stationExits';
import { useFavourites } from '../hooks/useFavourites';

const TEL_INTERCHANGE_STATIONS = new Set([
  'Woodlands', 'Orchard', 'Outram Park', 'Marina Bay',
  'Caldecott', 'Stevens',
]);

interface Props {
  station: Station;
  crowdEntry?: CrowdEntry;
  maintenance: MaintenanceEntry[];
  onClose: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const crowdConfig: Record<string, { label: string; color: string; bg: string; barWidth: string; barColor: string }> = {
  l: { label: 'Low', color: 'text-green-700', bg: 'bg-green-100', barWidth: 'w-1/4', barColor: 'bg-green-500' },
  m: { label: 'Moderate', color: 'text-amber-700', bg: 'bg-amber-100', barWidth: 'w-1/2', barColor: 'bg-amber-500' },
  h: { label: 'High', color: 'text-red-700', bg: 'bg-red-100', barWidth: 'w-full', barColor: 'bg-red-500' },
  na: { label: 'No data', color: 'text-gray-500', bg: 'bg-gray-100', barWidth: 'w-0', barColor: 'bg-gray-300' },
};

const LINE_MAP: Record<string, { name: string; color: string }> = {};
for (const l of LINES) LINE_MAP[l.id] = { name: l.name, color: l.color };

export default function StationDetail({ station, crowdEntry, maintenance, onClose, onRefresh, refreshing }: Props) {
  const crowd = crowdConfig[crowdEntry?.CrowdLevel ?? 'na'] ?? crowdConfig.na;
  const hours = getOperatingHours(station.line);
  const isUC = station.underConstruction;
  const interchanges = getInterchanges(station.name, station.line);
  const hasInterchange = isInterchange(station.name);
  const isTEL = station.line === 'TE';
  const usesNumberedExits = isTEL || TEL_INTERCHANGE_STATIONS.has(station.name);

  const exitLabel = (i: number) => usesNumberedExits ? String(i + 1) : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'][i] ?? String(i + 1);
  const curatedExits = getStationExits(station.name);
  const fav = useFavourites();
  const isFav = fav.isFavStation(station.code);

  return (
    <div className="flex flex-col h-full">
      <div
        className="p-5 rounded-t-2xl text-white"
        style={{ background: `linear-gradient(135deg, ${isUC ? '#6b7280' : station.lineColor}ee, ${isUC ? '#9ca3af' : station.lineColor}aa)` }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold opacity-80">{station.line} Line</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fav.toggleFavStation(station.code)}
              aria-label={isFav ? 'Remove favourite' : 'Add favourite'}
              className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-xs font-semibold"
            >
              <Star size={14} className={isFav ? 'fill-amber-300 text-amber-300' : ''} />
              {isFav ? 'Saved' : 'Save'}
            </button>
            <button onClick={onRefresh} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">{station.code}</div>
          <div>
            <h2 className="text-xl font-bold leading-tight">{station.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm opacity-70">Station {station.code}</p>
              {hasInterchange && (
                <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/20 px-1.5 py-0.5 rounded-full">
                  <ArrowRightLeft size={9} /> Interchange
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Interchange line badges in header */}
        {interchanges.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <span className="text-[10px] opacity-60 mr-1">Connects to</span>
            {interchanges.map(ic => {
              const info = LINE_MAP[ic.lineId];
              return (
                <span
                  key={ic.lineId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: info?.color ?? '#666', color: '#fff' }}
                >
                  {ic.stationCode}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isUC && (
          <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl border border-amber-200 dark:border-amber-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Construction size={16} className="text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Under Construction</h3>
            </div>
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              Expected to open on <span className="font-semibold">{station.openingDate}</span>.
            </p>
          </div>
        )}

        {!isUC && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} style={{ color: station.lineColor }} />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Station Information</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Station Code</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{station.code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Line</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{station.line} Line</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Operating Hours</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" />{hours}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Interchange section */}
        {!isUC && interchanges.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft size={16} style={{ color: station.lineColor }} />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Interchange</h3>
            </div>
            <div className="space-y-3">
              {interchanges.map(ic => {
                const info = LINE_MAP[ic.lineId];
                const icHours = getOperatingHours(ic.lineId);
                return (
                  <div key={ic.lineId} className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: info?.color ?? '#666' }}
                    >
                      {ic.lineId}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{info?.name ?? ic.lineId}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{ic.stationCode}</span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock size={10} className="text-gray-400 dark:text-gray-500" />{icHours}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isUC && curatedExits && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DoorOpen size={16} style={{ color: station.lineColor }} />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Exits & Nearby</h3>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{station.exits} exits</span>
            </div>
            <div className="space-y-2.5">
              {curatedExits.map(ex => (
                <div key={ex.label} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: station.lineColor }}
                  >
                    {ex.label}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug pt-1">{ex.landmarks.join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isUC && !curatedExits && station.exits > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DoorOpen size={16} style={{ color: station.lineColor }} />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Station Exits</h3>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{station.exits} exits</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: station.exits }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: station.lineColor }}
                >
                  {exitLabel(i)}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isUC && station.exits === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DoorOpen size={16} className="text-gray-400 dark:text-gray-500" />
              <h3 className="font-semibold text-gray-500 dark:text-gray-300 text-sm">Shell Station</h3>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">This station is built but not yet operational.</p>
          </div>
        )}

        {!isUC && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} style={{ color: station.lineColor }} />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Platform Crowd</h3>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${crowd.bg} ${crowd.color}`}>
              <span className={`w-2 h-2 rounded-full ${crowd.barColor}`} />{crowd.label}
            </div>
            <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${crowd.barWidth} ${crowd.barColor}`} />
            </div>
            {crowdEntry?.StartTime && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Updated: {new Date(crowdEntry.StartTime).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        )}

        {maintenance.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl border border-amber-200 dark:border-amber-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Active Maintenance</h3>
            </div>
            <div className="space-y-2">
              {maintenance.map((m, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-300">{m.LiftID ?? 'Lift'}</p>
                  <p className="text-amber-700 dark:text-amber-400 text-xs">{m.LiftDesc ?? 'Maintenance in progress'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
