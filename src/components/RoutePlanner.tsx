import { useState, useMemo, useCallback } from 'react';
import { Navigation, ArrowRight, ArrowDownUp, Clock, TrainFront as Train, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { findRoute, getAllStationCodes, type RouteResult } from '../data/routePlanner';
import { LINES } from '../data/stations';

interface StationOption {
  code: string;
  name: string;
  line: string;
  lineColor: string;
}

const ALL_STATIONS = getAllStationCodes();

export default function RoutePlanner() {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromCode, setFromCode] = useState('');
  const [toCode, setToCode] = useState('');
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [noRoute, setNoRoute] = useState(false);
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

  const filterStations = useCallback((query: string): StationOption[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return ALL_STATIONS.filter(
      s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    ).slice(0, 12);
  }, []);

  const fromOptions = useMemo(() => filterStations(fromQuery), [fromQuery, filterStations]);
  const toOptions = useMemo(() => filterStations(toQuery), [toQuery, filterStations]);

  const selectFrom = (s: StationOption) => {
    setFromCode(s.code);
    setFromQuery(`${s.code} - ${s.name}`);
    setFromFocused(false);
  };

  const selectTo = (s: StationOption) => {
    setToCode(s.code);
    setToQuery(`${s.code} - ${s.name}`);
    setToFocused(false);
  };

  const swapStations = () => {
    const tmpCode = fromCode; const tmpQuery = fromQuery;
    setFromCode(toCode); setFromQuery(toQuery);
    setToCode(tmpCode); setToQuery(tmpQuery);
    setRoute(null); setNoRoute(false);
  };

  const search = () => {
    if (!fromCode || !toCode) return;
    const result = findRoute(fromCode, toCode);
    if (result) {
      setRoute(result);
      setNoRoute(false);
    } else {
      setRoute(null);
      setNoRoute(true);
    }
  };

  const lineName = (id: string) => LINES.find(l => l.id === id)?.name.replace(' Line', '').replace(' LRT', '') ?? id;

  return (
    <div className="space-y-4">
      {/* Input panel */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Navigation size={18} className="text-gray-700 dark:text-gray-300" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Route Planner</h2>
        </div>

        <div className="relative">
          {/* From input */}
          <div className="relative mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="From station..."
                  value={fromQuery}
                  onChange={e => { setFromQuery(e.target.value); setFromCode(''); setRoute(null); setNoRoute(false); }}
                  onFocus={() => setFromFocused(true)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                />
                {fromFocused && fromOptions.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
                    {fromOptions.map(s => (
                      <button key={s.code} onMouseDown={() => selectFrom(s)}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: s.lineColor }}>{s.line}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{s.code}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex items-center justify-center -my-1 relative z-10">
            <button onClick={swapStations}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors border border-gray-200">
              <ArrowDownUp size={14} className="text-gray-600" />
            </button>
          </div>

          {/* To input */}
          <div className="relative mt-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={12} className="text-red-600" />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="To station..."
                  value={toQuery}
                  onChange={e => { setToQuery(e.target.value); setToCode(''); setRoute(null); setNoRoute(false); }}
                  onFocus={() => setToFocused(true)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                />
                {toFocused && toOptions.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
                    {toOptions.map(s => (
                      <button key={s.code} onMouseDown={() => selectTo(s)}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: s.lineColor }}>{s.line}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{s.code}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button onClick={search} disabled={!fromCode || !toCode}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          <Navigation size={15} />
          Find Route
        </button>
      </div>

      {/* No route found */}
      {noRoute && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">No route found between these stations</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">One or both stations may be under construction or not connected.</p>
        </div>
      )}

      {/* Route result */}
      {route && (
        <div className="space-y-3">
          {/* Summary card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">Fastest Route</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{route.totalTime} min</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>{route.totalStops} stops</span>
              <span>{route.interchanges === 0 ? 'Direct' : `${route.interchanges} interchange${route.interchanges > 1 ? 's' : ''}`}</span>
            </div>
            {/* Line badges */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              {route.segments.map((seg, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: seg.lineColor }}>
                    {seg.lineId}
                  </span>
                  {i < route.segments.length - 1 && (
                    <ArrowRight size={10} className="text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Segments */}
          {route.segments.map((seg, i) => {
            const isExpanded = expandedSegment === i;
            return (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {/* Segment header */}
                <button
                  onClick={() => setExpandedSegment(isExpanded ? null : i)}
                  className="w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: seg.lineColor }}>
                    <Train size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{lineName(seg.lineId)} Line</span>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase">{seg.lineId}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {seg.fromName} → {seg.toName}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{seg.travelTime} min</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{seg.stops} stop{seg.stops !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex-shrink-0 ml-1">
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400 dark:text-gray-500" /> : <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />}
                  </div>
                </button>

                {/* Expanded station list */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                      <div className="space-y-0">
                        {seg.stations.map((station, j) => (
                          <div key={station.code} className="flex items-center gap-3 relative">
                            {/* Line indicator */}
                            <div className="flex flex-col items-center flex-shrink-0 w-6">
                              {j > 0 && <div className="w-0.5 h-2" style={{ backgroundColor: seg.lineColor }} />}
                              <div
                                className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                                style={{ borderColor: seg.lineColor, backgroundColor: (j === 0 || j === seg.stations.length - 1) ? seg.lineColor : '#fff' }}
                              />
                              {j < seg.stations.length - 1 && <div className="w-0.5 h-2" style={{ backgroundColor: seg.lineColor }} />}
                            </div>
                            {/* Station name */}
                            <div className="py-0.5">
                              <p className={`text-xs ${(j === 0 || j === seg.stations.length - 1) ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {station.code} - {station.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Interchange walk indicators between segments */}
          {route.segments.map((seg, i) => {
            if (i === route.segments.length - 1) return null;
            const nextSeg = route.segments[i + 1];
            return (
              <div key={`walk-${i}`} className="flex items-center justify-center gap-2 py-1">
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Walk to {nextSeg.lineId} Line platform</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">~5 min</span>
                </div>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
