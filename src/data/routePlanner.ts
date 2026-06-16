import { STATIONS, LINES, type Station } from './stations';

// Average inter-station travel times (minutes) by line
const LINE_TRAVEL_TIMES: Record<string, number> = {
  NS: 2.5, EW: 2.5, NE: 2.0, CC: 2.0, DT: 2.0, TE: 2.0,
  CG: 2.5, CE: 2.0,
  BP: 1.5, SK: 1.5, PG: 1.5,
};

const INTERCHANGE_WALK_TIME = 5; // minutes

export interface RouteSegment {
  lineId: string;
  lineName: string;
  lineColor: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  stations: Station[];
  stops: number;
  travelTime: number;
}

export interface RouteResult {
  segments: RouteSegment[];
  totalTime: number;
  totalStops: number;
  interchanges: number;
}

interface GraphNode {
  code: string;
  station: Station;
  edges: { target: string; line: string; time: number; targetStation: Station }[];
}

const stationByCode = new Map<string, Station>();
const graph = new Map<string, GraphNode>();

function buildGraph() {
  if (graph.size > 0) return;

  // Index all operational stations
  for (const s of STATIONS) {
    if (!s.underConstruction) {
      stationByCode.set(s.code, s);
    }
  }

  // Create graph nodes
  for (const [code, station] of stationByCode) {
    graph.set(code, { code, station, edges: [] });
  }

  // Group stations by CODE PREFIX (letters), then connect in numeric order.
  // Branch stations (CG Changi, CE Marina Bay ext) are stored under their
  // parent line's array (line:'EW'/'CC') and interleaved at the wrong spot —
  // CG1/CG2 sit after EW33 Tuas Link, CE1/CE2 between CC29 and CC30. Grouping
  // by the display `line` + array order therefore falsely links a trunk
  // terminus straight into the branch (Tuas Link → Expo). Grouping by code
  // prefix and sorting numerically gives each physical track its own chain.
  const prefixGroups = new Map<string, Station[]>();
  for (const s of STATIONS) {
    if (s.underConstruction) continue;
    const prefix = s.code.match(/^[A-Za-z]+/)?.[0] ?? s.code;
    const list = prefixGroups.get(prefix) ?? [];
    list.push(s);
    prefixGroups.set(prefix, list);
  }

  const stationNum = (code: string) => {
    const m = code.match(/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  };

  for (const [prefix, stations] of prefixGroups) {
    stations.sort((a, b) => stationNum(a.code) - stationNum(b.code));
    // Branch-specific time (CG/CE) if defined, else the display line's time.
    const travelTime = LINE_TRAVEL_TIMES[prefix] ?? LINE_TRAVEL_TIMES[stations[0]?.line] ?? 2.0;
    for (let i = 0; i < stations.length - 1; i++) {
      const a = stations[i];
      const b = stations[i + 1];
      const nodeA = graph.get(a.code);
      const nodeB = graph.get(b.code);
      if (nodeA && nodeB) {
        // Keep the display line so the route renders as the correct line.
        nodeA.edges.push({ target: b.code, line: a.line, time: travelTime, targetStation: b });
        nodeB.edges.push({ target: a.code, line: a.line, time: travelTime, targetStation: a });
      }
    }
  }

  // Branch / loop-arm junctions: physical track links that aren't adjacent in
  // the per-prefix numeric sequence — each attaches a branch to the trunk
  // station where it actually diverges.
  const JUNCTIONS: { a: string; b: string; line: string }[] = [
    { a: 'EW4', b: 'CG1', line: 'EW' },  // Tanah Merah ↔ Expo (Changi Airport branch)
    { a: 'CC4', b: 'CE1', line: 'CC' },  // Promenade ↔ Bayfront (Marina Bay extension)
    { a: 'STC', b: 'SE1', line: 'SK' },  // Sengkang ↔ East Loop
    { a: 'STC', b: 'SW1', line: 'SK' },  // Sengkang ↔ West Loop
    { a: 'PTC', b: 'PE1', line: 'PG' },  // Punggol ↔ East Loop
    { a: 'PTC', b: 'PW1', line: 'PG' },  // Punggol ↔ West Loop
  ];
  for (const j of JUNCTIONS) {
    const nodeA = graph.get(j.a);
    const nodeB = graph.get(j.b);
    const stA = stationByCode.get(j.a);
    const stB = stationByCode.get(j.b);
    if (nodeA && nodeB && stA && stB) {
      const t = LINE_TRAVEL_TIMES[j.line] ?? 2.0;
      nodeA.edges.push({ target: j.b, line: j.line, time: t, targetStation: stB });
      nodeB.edges.push({ target: j.a, line: j.line, time: t, targetStation: stA });
    }
  }

  // Add interchange edges (walking between platforms at same station)
  const byName = new Map<string, Station[]>();
  for (const [, s] of stationByCode) {
    const list = byName.get(s.name) ?? [];
    list.push(s);
    byName.set(s.name, list);
  }

  for (const [, group] of byName) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const nodeI = graph.get(group[i].code);
        const nodeJ = graph.get(group[j].code);
        if (nodeI && nodeJ) {
          nodeI.edges.push({ target: group[j].code, line: '__interchange__', time: INTERCHANGE_WALK_TIME, targetStation: group[j] });
          nodeJ.edges.push({ target: group[i].code, line: '__interchange__', time: INTERCHANGE_WALK_TIME, targetStation: group[i] });
        }
      }
    }
  }
}

interface PathStep {
  code: string;
  line: string;
  time: number;
}

function dijkstra(fromCode: string, toCode: string): PathStep[] | null {
  buildGraph();

  if (!graph.has(fromCode) || !graph.has(toCode)) return null;
  if (fromCode === toCode) return [];

  const dist = new Map<string, number>([[fromCode, 0]]);
  const prev = new Map<string, string>();
  const prevLine = new Map<string, string>();
  const prevTime = new Map<string, number>();
  const visited = new Set<string>();

  const pq: string[] = [fromCode];

  while (pq.length > 0) {
    // Find unvisited node with minimum distance
    let minIdx = -1;
    let minDist = Infinity;
    for (let i = 0; i < pq.length; i++) {
      const d = dist.get(pq[i]) ?? Infinity;
      if (!visited.has(pq[i]) && d < minDist) {
        minDist = d;
        minIdx = i;
      }
    }

    if (minIdx === -1) break;

    const u = pq[minIdx];
    if (visited.has(u)) continue;
    visited.add(u);

    if (u === toCode) break;

    const node = graph.get(u);
    if (!node) continue;

    const currentDist = dist.get(u) ?? Infinity;
    for (const edge of node.edges) {
      if (visited.has(edge.target)) continue;

      const newDist = currentDist + edge.time;
      const oldDist = dist.get(edge.target) ?? Infinity;

      if (newDist < oldDist) {
        dist.set(edge.target, newDist);
        prev.set(edge.target, u);
        prevLine.set(edge.target, edge.line);
        prevTime.set(edge.target, edge.time);

        if (!pq.includes(edge.target)) {
          pq.push(edge.target);
        }
      }
    }
  }

  if (!dist.has(toCode)) return null;

  // Reconstruct path
  const path: PathStep[] = [];
  let cur = toCode;
  while (prev.has(cur)) {
    const prevCode = prev.get(cur)!;
    const line = prevLine.get(cur) ?? '';
    const time = prevTime.get(cur) ?? 0;
    path.unshift({ code: cur, line, time });
    cur = prevCode;
  }

  return path;
}

export function findRoute(fromCode: string, toCode: string): RouteResult | null {
  const pathSteps = dijkstra(fromCode, toCode);
  if (!pathSteps) return null;

  const segments: RouteSegment[] = [];
  let currentLine = '';
  let segmentStart = -1;
  let segmentTime = 0;

  // Add start station to segments
  const startStation = stationByCode.get(fromCode);
  if (!startStation) return null;

  for (let i = 0; i < pathSteps.length; i++) {
    const step = pathSteps[i];

    if (step.line === '__interchange__') {
      // Finish current segment if any
      if (currentLine && currentLine !== '__interchange__') {
        pushSegment(currentLine, segmentStart, i, segmentTime);
      }
      segmentStart = i;
      currentLine = '';
      segmentTime = 0;
      continue;
    }

    if (step.line !== currentLine) {
      // New line, finish previous segment
      if (currentLine && currentLine !== '__interchange__') {
        pushSegment(currentLine, segmentStart, i, segmentTime);
      }
      currentLine = step.line;
      segmentStart = i;
      segmentTime = step.time;
    } else {
      segmentTime += step.time;
    }
  }

  // Push final segment
  if (currentLine && currentLine !== '__interchange__') {
    pushSegment(currentLine, segmentStart, pathSteps.length, segmentTime);
  }

  function pushSegment(lineId: string, startIdx: number, endIdx: number, travelTime: number) {
    if (!pathSteps) return;
    const lineInfo = LINES.find(l => l.id === lineId);
    // Boarding station = where you get on THIS line: the journey origin for the
    // first segment, otherwise the station the previous leg / interchange walk
    // left you at (pathSteps[startIdx - 1]). Earlier this seeded every segment
    // with fromCode + all preceding stations, so each leg falsely started at the
    // origin and its stop count accumulated the whole journey.
    const boardCode = startIdx > 0 ? pathSteps[startIdx - 1].code : fromCode;
    const stationCodes: string[] = [boardCode];

    for (let i = startIdx; i < endIdx; i++) {
      stationCodes.push(pathSteps[i].code);
    }

    const uniqueCodes = Array.from(new Set(stationCodes));
    const segmentStations = uniqueCodes
      .map(c => stationByCode.get(c))
      .filter((s): s is Station => !!s);

    if (segmentStations.length < 2) return;

    const fromSt = segmentStations[0];
    const toSt = segmentStations[segmentStations.length - 1];

    segments.push({
      lineId,
      lineName: lineInfo?.name ?? lineId,
      lineColor: lineInfo?.color ?? '#666',
      fromCode: fromSt.code,
      fromName: fromSt.name,
      toCode: toSt.code,
      toName: toSt.name,
      stations: segmentStations,
      stops: segmentStations.length - 1,
      travelTime: Math.round(travelTime),
    });
  }

  const totalTime = Math.round(pathSteps.reduce((a, s) => a + s.time, 0));
  // Count ridden stops only — interchange walks aren't stops.
  const totalStops = pathSteps.filter(s => s.line !== '__interchange__').length;
  const interchanges = segments.length - 1;

  return { segments, totalTime, totalStops, interchanges };
}

export function getAllStationCodes(): { code: string; name: string; line: string; lineColor: string }[] {
  return STATIONS
    .filter(s => !s.underConstruction)
    .map(s => ({ code: s.code, name: s.name, line: s.line, lineColor: s.lineColor }));
}
