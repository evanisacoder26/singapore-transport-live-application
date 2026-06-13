import { DoorOpen, Users, CircleAlert as AlertCircle, Construction, ArrowRightLeft, Navigation, Star } from 'lucide-react';
import type { Station } from '../data/stations';
import { LINES, getInterchanges, isInterchange } from '../data/stations';
import type { CrowdEntry } from '../hooks/useMrtData';

interface Props {
  station: Station;
  crowdEntry?: CrowdEntry;
  hasMaintenance: boolean;
  onClick: () => void;
  isSelected: boolean;
  distanceLabel?: string;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
}

const crowdConfig: Record<string, { label: string; color: string }> = {
  l: { label: 'Low', color: '#16a34a' },
  m: { label: 'Moderate', color: '#d97706' },
  h: { label: 'High', color: '#dc2626' },
  na: { label: 'N/A', color: '#6b7280' },
};

const LINE_MAP: Record<string, string> = {};
for (const l of LINES) LINE_MAP[l.id] = l.color;

export default function StationCard({ station, crowdEntry, hasMaintenance, onClick, isSelected, distanceLabel, isFavourite, onToggleFavourite }: Props) {
  const crowd = crowdConfig[crowdEntry?.CrowdLevel ?? 'na'] ?? crowdConfig.na;
  const isUC = station.underConstruction;
  const interchanges = getInterchanges(station.name, station.line);
  const hasIC = isInterchange(station.name);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 transition-all duration-200 p-4 hover:shadow-md active:scale-95 dark:hover:shadow-gray-800 ${
        isUC ? 'opacity-70' : ''
      } ${isSelected ? 'shadow-lg scale-[1.01]' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
      style={isSelected ? { borderColor: station.lineColor, backgroundColor: `${station.lineColor}08` } : {}}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: isUC ? '#9ca3af' : station.lineColor }}
          >
            {station.code}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{station.name}</p>
              {hasIC && (
                <ArrowRightLeft size={11} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {distanceLabel && (
                <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Navigation size={11} />
                  {distanceLabel}
                </span>
              )}
              {/* Interchange line badges */}
              {interchanges.length > 0 && (
                <span className="flex items-center gap-1">
                  {interchanges.map(ic => (
                    <span
                      key={ic.lineId}
                      className="inline-block w-4 h-4 rounded text-[7px] font-bold text-white text-center leading-4"
                      style={{ backgroundColor: LINE_MAP[ic.lineId] ?? '#666' }}
                    >
                      {ic.lineId}
                    </span>
                  ))}
                </span>
              )}
              {!isUC && (
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <DoorOpen size={11} />
                  {station.exits} {station.exits === 1 ? 'exit' : 'exits'}
                </span>
              )}
              {isUC && (
                <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500">
                  <Construction size={11} />
                  Opens {station.openingDate}
                </span>
              )}
              {!isUC && crowdEntry?.CrowdLevel && crowdEntry.CrowdLevel !== 'na' && (
                <span className="flex items-center gap-1 text-xs" style={{ color: crowd.color }}>
                  <Users size={11} />
                  {crowd.label}
                </span>
              )}
              {hasMaintenance && (
                <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-500 text-xs">
                  <AlertCircle size={11} /> Lift
                </span>
              )}
            </div>
          </div>
        </div>
        {onToggleFavourite && (
          <span
            role="button"
            tabIndex={0}
            aria-label={isFavourite ? 'Remove favourite' : 'Add favourite'}
            onClick={e => { e.stopPropagation(); onToggleFavourite(); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onToggleFavourite(); } }}
            className="flex-shrink-0 self-center -m-2 p-3 rounded-full cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/40 active:scale-90 transition-all"
          >
            <Star
              size={20}
              className={isFavourite ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
            />
          </span>
        )}
      </div>
    </button>
  );
}
