import { RotateCw, RotateCcw, ArrowRightLeft, Volume2, MonitorSmartphone, Info, ExternalLink, Construction } from 'lucide-react';
import { STATIONS } from '../data/stations';

const CCL = '#FA9E0D';

const NEW_STATIONS = STATIONS.filter(s => ['CC30', 'CC31', 'CC32'].includes(s.code));
const SPUR_STATIONS = ['Dhoby Ghaut', 'Bras Basah', 'Esplanade'];

export default function CclWayfinding() {
  return (
    <div className="space-y-4">
      {/* Hero */}
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${CCL}ee, ${CCL}aa)` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold bg-white/25">CCL6</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">New Wayfinding</span>
        </div>
        <h2 className="text-xl font-bold leading-tight mb-1.5">The Circle Line is now a full loop</h2>
        <p className="text-sm opacity-90 leading-relaxed">
          With CCL6 closing the loop, the Circle Line becomes Singapore's first full-loop MRT service. That changes
          how you choose your direction — here's what's new and how to navigate it.
        </p>
      </div>

      {/* New stations */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Construction size={16} style={{ color: CCL }} />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Three new stations close the loop</h3>
        </div>
        <div className="space-y-2">
          {NEW_STATIONS.map(s => (
            <div key={s.code} className="flex items-center gap-3">
              <span
                className="flex-shrink-0 w-11 h-7 rounded-md flex items-center justify-center text-[11px] font-bold text-white"
                style={{ backgroundColor: CCL }}
              >
                {s.code}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex-1">{s.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Opens {s.openingDate}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
          Keppel, Cantonment and Prince Edward Road link HarbourFront to Marina Bay, joining the two ends of the line
          into one continuous circle.
        </p>
      </div>

      {/* The two directions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <RotateCw size={16} style={{ color: CCL }} />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Pick a direction: Clockwise or Anticlockwise</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
          On a loop there's no single "end of the line". Trains run in two directions, and you board the one that
          reaches your stop faster.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <RotateCw size={14} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">Clockwise Loop</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">Runs around the loop in one direction.</p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <RotateCcw size={14} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">Anticlockwise Loop</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">Runs around the loop the other way.</p>
          </div>
        </div>
      </div>

      {/* "via" cue */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MonitorSmartphone size={16} style={{ color: CCL }} />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Read the "via" cue on the platform display</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
          Station displays (STIS) show your train's direction as <span className="font-semibold text-gray-700 dark:text-gray-200">"via [next interchange station]"</span>.
          The same station shows a different "via" for each direction, so it tells you which way the train is heading.
        </p>
        <div className="rounded-xl bg-gray-900 dark:bg-black p-3 flex items-center gap-3">
          <RotateCcw size={16} style={{ color: CCL }} />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Anticlockwise</p>
            <p className="text-sm font-semibold text-white">via Buona Vista</p>
          </div>
        </div>
      </div>

      {/* Spur stations */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRightLeft size={16} style={{ color: CCL }} />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">The three spur stations: transfer at Promenade</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SPUR_STATIONS.map(name => (
            <span key={name} className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              {name}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Dhoby Ghaut, Bras Basah and Esplanade sit on a spur, not the loop itself. They're served by separate
          turnaround services. Travelling between the spur and the loop may need a quick transfer at
          <span className="font-semibold text-gray-700 dark:text-gray-200"> Promenade</span>.
        </p>
      </div>

      {/* PA announcements */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 size={16} style={{ color: CCL }} />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Listen for the announcement</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          On-board and platform announcements (PA) call out the loop direction and the "via" interchange, so you can
          confirm you're heading the right way without looking up.
        </p>
      </div>

      {/* CTA to official app */}
      <a
        href="https://www.lta.gov.sg/cclwayfinding/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 rounded-2xl p-4 text-white shadow-sm hover:opacity-95 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${CCL}ee, ${CCL}aa)` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Info size={18} className="flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight">Try LTA's interactive guide</p>
            <p className="text-xs opacity-85 truncate">Pick any origin and destination to preview the real displays and announcements.</p>
          </div>
        </div>
        <ExternalLink size={16} className="flex-shrink-0" />
      </a>

      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center px-4 leading-relaxed">
        The new wayfinding goes live when CCL6 opens. This guide is educational — for journey planning use MyTransport or your preferred app.
      </p>
    </div>
  );
}
