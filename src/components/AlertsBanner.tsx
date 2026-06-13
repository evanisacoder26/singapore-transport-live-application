import { useState } from 'react';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Clock, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';
import type { TrainAlert, TrainAlertMessage } from '../hooks/useMrtData';
import { LINES } from '../data/stations';

interface Props {
  alerts: TrainAlert[];
  messages: TrainAlertMessage[];
  status: number;
  everLoaded: boolean;
  stale: boolean;
  lastUpdated: number | null;
}

const LINE_LABELS: Record<string, string> = {
  NSL: 'North South', EWL: 'East West', NEL: 'North East',
  CCL: 'Circle', CEL: 'Circle Ext', CGL: 'Changi Ext',
  DTL: 'Downtown', TEL: 'Thomson-East Coast',
  BPL: 'Bukit Panjang LRT', SLRT: 'Sengkang LRT', PLRT: 'Punggol LRT',
};

const LINE_COLORS: Record<string, string> = {};
for (const l of LINES) LINE_COLORS[l.id] = l.color;

const PLANNED_DISRUPTIONS = [
  {
    line: 'TE',
    tag: 'Planned Service Adjustment',
    summary: 'Earlier Friday closures & later Saturday openings (22 May – 4 Jul 2026)',
    detail: 'From 22 May to 4 Jul 2026, TEL services will end earlier at 11.30pm on Friday nights and commence later at 8.30am on Saturday mornings. Shuttle bus services S51 (Woodlands North–Caldecott), S52 (Caldecott–Marina Bay), and S53 (Marina Bay–Bayshore) will be provided at ~5–10 min frequency for affected commuters.',
  },
  {
    line: 'SK',
    tag: 'Planned Service Adjustment',
    summary: 'Sengkang West LRT Inner Loop closed (19 Apr – 18 Oct 2026)',
    detail: 'From 19 Apr to 18 Oct 2026, the Sengkang West LRT Inner Loop (i.e. direction of STC Sengkang towards SW1 Cheng Lim) will be closed. Commuters can continue to use the Sengkang West LRT Outer Loop (i.e. direction of STC Sengkang towards SW8 Renjong), peak-hours shuttle bus services, or regular bus services.',
  },
];

function parseLineFromMessage(content: string): { lineId: string; lineColor: string } | null {
  const linePrefixes = ['NS', 'EW', 'NE', 'CC', 'DT', 'TE', 'CE', 'CG', 'BP', 'SK', 'PG'];
  for (const prefix of linePrefixes) {
    if (content.includes(`${prefix}-`)) {
      return { lineId: prefix, lineColor: LINE_COLORS[prefix] ?? '#d97706' };
    }
  }
  return null;
}

export default function AlertsBanner({ alerts, messages, status, everLoaded, stale, lastUpdated }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  // Fail-soft: hold the last good status, never lie (green on unknown), never
  // flicker (amber on a single failed poll). Amber only when we have NOTHING.
  const hasDisruption = alerts.length > 0 || status === 2;
  const showData = everLoaded;                  // we have a last-known status to show
  const showUnavailable = !everLoaded;          // never got data this session
  const isNormal = showData && !hasDisruption;

  const timeStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })
    : '';
  const freshnessNote = !showData
    ? ''
    : stale
      ? `Couldn't refresh · last checked ${timeStr}`
      : timeStr
        ? `Updated ${timeStr}`
        : '';

  // Filter out planned service messages that we already show in our static list
  const ltaPlannedPrefixes = ['CCL-Planned', 'SK-Planned', 'CC-Planned'];
  const liveMessages = (messages ?? []).filter(
    m => !ltaPlannedPrefixes.some(p => m.Content.includes(p))
  );

  return (
    <div className="space-y-2">
      {/* Live disruption alerts from AffectedSegments */}
      {hasDisruption && alerts.map((alert, i) => (
        <div key={`alert-${i}`} className="flex items-start gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl">
          <AlertTriangle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">{LINE_LABELS[alert.Line] ?? alert.Line} Line – Disruption</p>
            {alert.Message && alert.Message.length > 0 && (
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5 line-clamp-3">{alert.Message[0].Content}</p>
            )}
          </div>
        </div>
      ))}

      {/* Stale note under a held disruption — keep warning, but flag freshness */}
      {showData && hasDisruption && stale && (
        <p className="px-4 text-[11px] text-amber-600 dark:text-amber-400">{freshnessNote}</p>
      )}

      {/* Normal status — last-known good. Carries a freshness/stale note. */}
      {isNormal && (
        <div className="flex items-center justify-between gap-2.5 px-4 py-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">All lines operating normally</p>
          </div>
          {freshnessNote && (
            <span className={`flex-shrink-0 text-[11px] ${stale ? 'text-amber-600 dark:text-amber-400' : 'text-green-600/70 dark:text-green-400/70'}`}>
              {freshnessNote}
            </span>
          )}
        </div>
      )}

      {/* No data at all this session — genuinely nothing to show. Fail closed. */}
      {showUnavailable && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-xl">
          <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Live service status unavailable — couldn't reach LTA. Check official channels before travelling.</p>
        </div>
      )}

      {/* Live service messages from LTA (e.g. bus diversions, incident alerts) */}
      {liveMessages.map((msg, i) => {
        const parsed = parseLineFromMessage(msg.Content);
        return (
          <div key={`msg-${i}`} className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-xl">
            <Megaphone size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {parsed && (
                  <span
                    className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: parsed.lineColor }}
                  >
                    {parsed.lineId}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Service Alert</span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-300 line-clamp-3">{msg.Content}</p>
            </div>
          </div>
        );
      })}

      {/* Planned disruptions — collapsible */}
      {PLANNED_DISRUPTIONS.map((d, i) => {
        const lineColor = LINE_COLORS[d.line] ?? '#d97706';
        const isOpen = expanded[i] ?? false;
        return (
          <div key={`planned-${i}`} className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
              onClick={() => setExpanded(prev => ({ ...prev, [i]: !isOpen }))}
            >
              <Clock size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: lineColor }}
                  >
                    {d.line}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{d.tag}</span>
                </div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{d.summary}</p>
              </div>
              <span className="flex-shrink-0 text-amber-500 dark:text-amber-400">
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </button>
            {isOpen && (
              <div className="px-4 pb-3">
                <p className="text-xs text-amber-700 dark:text-amber-400">{d.detail}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
