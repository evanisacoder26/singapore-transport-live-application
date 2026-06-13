import { Bus, Clock, RefreshCw, Accessibility, MapPin, Star, X } from 'lucide-react';
import { useBusArrivals, getMinutesUntil, LOAD_LABELS, BUS_TYPE, OPERATOR_NAMES, type BusArrivalService } from '../hooks/useBusData';
import { useFavourites } from '../hooks/useFavourites';

interface Props {
  busStopCode: string;
  busStopName: string;
  roadName: string;
  onClose: () => void;
}

function BusServiceRow({ service }: { service: BusArrivalService }) {
  const buses = [service.NextBus, service.NextBus2, service.NextBus3];
  const operator = OPERATOR_NAMES[service.Operator] ?? service.Operator;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="w-14 flex-shrink-0">
        <span className="inline-flex items-center justify-center w-12 h-8 rounded-lg bg-gray-900 text-white text-sm font-bold">{service.ServiceNo}</span>
      </div>
      <div className="flex-1 flex items-center gap-2 flex-wrap">
        {buses.map((bus, i) => {
          const mins = getMinutesUntil(bus.EstimatedArrival);
          const isWAB = bus.Feature === 'WAB';
          const type = BUS_TYPE[bus.Type] ?? '';
          if (mins === null) {
            return <div key={i} className="flex flex-col items-center px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 min-w-[60px]"><span className="text-xs text-gray-400 dark:text-gray-500">--</span></div>;
          }
          const isArr = mins <= 1;
          const isClose = mins <= 3;
          return (
            <div key={i} className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg min-w-[60px] ${i === 0 ? (isArr ? 'bg-green-600 text-white' : isClose ? 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900' : 'bg-gray-50 dark:bg-gray-800') : 'bg-gray-50 dark:bg-gray-800'}`}>
              <span className={`text-sm font-bold tabular-nums ${i === 0 && isArr ? 'text-white' : isArr ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-100'}`}>{isArr ? 'Arr' : `${mins}m`}</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {bus.Load && <span className={`w-1.5 h-1.5 rounded-full ${bus.Load === 'SEA' ? 'bg-green-500' : bus.Load === 'SDA' ? 'bg-amber-500' : 'bg-red-500'}`} />}
                {isWAB && <Accessibility size={9} className={i === 0 && isArr ? 'text-white' : 'text-blue-500'} />}
                {type && <span className={`text-[9px] ${i === 0 && isArr ? 'text-white/70' : 'text-gray-400'}`}>{type === 'Double' ? 'DD' : type === 'Bendy' ? 'BD' : ''}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <span className="text-[11px] text-gray-500 dark:text-gray-400 w-16 text-right truncate hidden sm:block">{operator}</span>
    </div>
  );
}

export default function BusArrivalBoard({ busStopCode, busStopName, roadName, onClose }: Props) {
  const { data, loading, error, refresh } = useBusArrivals(busStopCode);
  const fav = useFavourites();
  const isFav = fav.isFavStop(busStopCode);
  const services = data?.Services ?? [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="text-white p-4" style={{ background: 'linear-gradient(135deg, #2563EBee, #2563EBaa)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Bus size={16} /><span className="text-sm font-semibold">Bus Arrivals</span></div>
          <div className="flex items-center gap-2">
            <button onClick={() => fav.toggleFavStop(busStopCode)} aria-label={isFav ? 'Remove favourite' : 'Add favourite'} className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold">
              <Star size={13} className={isFav ? 'fill-amber-300 text-amber-300' : ''} />
              {isFav ? 'Saved' : 'Save'}
            </button>
            <button onClick={refresh} aria-label="Refresh bus arrivals" className="p-2.5 -m-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
            <button onClick={onClose} aria-label="Close bus arrivals" className="p-2.5 -m-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white"><X size={14} /></button>
          </div>
        </div>
        <h2 className="text-lg font-bold">{busStopName}</h2>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-blue-100"><MapPin size={10} /><span>{roadName}</span><span className="text-white/40">|</span><span>Stop {busStopCode}</span></div>
      </div>
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Seats</div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Standing</div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Limited</div>
        <div className="flex items-center gap-1"><Accessibility size={9} className="text-blue-500" /> Wheelchair</div>
      </div>
      <div className="px-4 py-1 max-h-[50vh] overflow-y-auto">
        {/* Fail-soft: only show the error state when we have NOTHING to fall back on */}
        {error && services.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            <Clock size={20} className="mx-auto mb-2 opacity-40" />
            Couldn't reach LTA just now.
            <button onClick={refresh} className="block mx-auto mt-2 text-blue-600 dark:text-blue-400 font-semibold">Tap to retry</button>
          </div>
        )}
        {/* Refresh failed but we still hold the last good timings — keep showing them */}
        {error && services.length > 0 && (
          <p className="px-1 pt-2 text-[11px] text-amber-600 dark:text-amber-400">Couldn't refresh — showing last known timings.</p>
        )}
        {/* Skeleton while first load is in flight */}
        {loading && services.length === 0 && !error && (
          <div className="py-1" aria-busy="true" aria-label="Loading arrivals">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="w-12 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0" />
                <div className="flex-1 flex gap-2">
                  <div className="h-11 w-[60px] rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="h-11 w-[60px] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
        {services.length === 0 && !loading && !error && (
          <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm"><Clock size={20} className="mx-auto mb-2 opacity-40" />No bus services available at this time</div>
        )}
        {services.map(s => <BusServiceRow key={s.ServiceNo} service={s} />)}
      </div>
      {services.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 text-[11px] text-transit-muted dark:text-gray-400 flex items-center gap-1"><Clock size={10} />Live data from LTA – updates every 20s</div>
      )}
    </div>
  );
}
