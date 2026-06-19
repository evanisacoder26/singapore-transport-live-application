import { STATIONS } from './stations';

// Map bus stop descriptions to nearby MRT/LRT station codes
// Key: bus stop description (lowercase), Value: array of station codes
const BUS_STOP_MRT_MAP: Record<string, string[]> = {
  // NS Line
  'jurong east int': ['NS1', 'EW24'],
  'jurong east stn': ['NS1', 'EW24'],
  'bukit batok int': ['NS2'],
  'bukit batok stn': ['NS2'],
  'bukit gombak stn': ['NS3'],
  'choa chu kang int': ['NS4', 'BP1'],
  'choa chu kang stn': ['NS4', 'BP1'],
  'yew tee stn': ['NS5'],
  'kranji stn': ['NS7'],
  'marsiling stn': ['NS8'],
  'woodlands int': ['NS9', 'TE2'],
  'woodlands stn': ['NS9', 'TE2'],
  'admiralty stn': ['NS10'],
  'sembawang stn': ['NS11'],
  'canberra stn': ['NS12'],
  'yishun int': ['NS13'],
  'yishun stn': ['NS13'],
  'khatib stn': ['NS14'],
  'yio chu kang stn': ['NS15'],
  'ang mo kio int': ['NS16'],
  'ang mo kio stn': ['NS16'],
  'bishan stn': ['NS17', 'CC15'],
  'braddell stn': ['NS18'],
  'toa payoh int': ['NS19'],
  'toa payoh stn': ['NS19'],
  'novena stn': ['NS20'],
  'newton stn': ['NS21', 'DT11'],
  'orchard stn': ['NS22', 'TE14'],
  'orchard blvd stn': ['TE13'],
  'somerset stn': ['NS23'],
  'dhoby ghaut stn': ['NS24', 'NE6', 'CC1'],
  'city hall stn': ['NS25', 'EW13'],
  'raffles place stn': ['NS26', 'EW14'],
  'marina bay stn': ['NS27', 'CC33', 'TE20'],
  'marina sth pier stn': ['NS28'],

  // EW Line
  'pasir ris int': ['EW1'],
  'pasir ris stn': ['EW1'],
  'tampines int': ['EW2', 'DT32'],
  'tampines stn': ['EW2', 'DT32'],
  'simei stn': ['EW3'],
  'tanah merah stn': ['EW4'],
  'bedok int': ['EW5'],
  'bedok stn': ['EW5'],
  'kembangan stn': ['EW6'],
  'eunos stn': ['EW7'],
  'paya lebar stn': ['EW8', 'CC9'],
  'aljunied stn': ['EW9'],
  'kallang stn': ['EW10'],
  'lavender stn': ['EW11'],
  'bugis stn': ['EW12', 'DT14'],
  'tanjong pagar stn': ['EW15'],
  'outram park stn': ['EW16', 'NE3', 'TE17'],
  'tiong bahru stn': ['EW17'],
  'redhill stn': ['EW18'],
  'queenstown stn': ['EW19'],
  'commonwealth stn': ['EW20'],
  'buona vista stn': ['EW21', 'CC22'],
  'dover stn': ['EW22'],
  'clementi int': ['EW23'],
  'clementi stn': ['EW23'],
  'chinese garden stn': ['EW25'],
  'lakeside stn': ['EW26'],
  'boon lay int': ['EW27'],
  'boon lay stn': ['EW27'],
  'pioneer stn': ['EW28'],
  'joo koon stn': ['EW29'],
  'gul circle stn': ['EW30'],
  'tuas crescent stn': ['EW31'],
  'tuas west rd stn': ['EW32'],
  'tuas link stn': ['EW33'],
  'expo stn': ['CG1', 'DT35'],
  'changi airport stn': ['CG2'],

  // NE Line
  'harbourfront int': ['NE1', 'CC29'],
  'harbourfront stn': ['NE1', 'CC29'],
  'chinatown stn': ['NE4', 'DT19'],
  'clarke quay stn': ['NE5'],
  'little india stn': ['NE7', 'DT12'],
  'farrer park stn': ['NE8'],
  'boon keng stn': ['NE9'],
  'potong pasir stn': ['NE10'],
  'woodleigh stn': ['NE11'],
  'serangoon int': ['NE12', 'CC13'],
  'serangoon stn': ['NE12', 'CC13'],
  'kovan stn': ['NE13'],
  'hougang stn': ['NE14'],
  'buangkok stn': ['NE15'],
  'sengkang int': ['NE16', 'STC'],
  'sengkang stn': ['NE16', 'STC'],
  'punggol int': ['NE17', 'PTC'],
  'punggol stn': ['NE17', 'PTC'],
  'punggol coast stn': ['NE18'],

  // CC Line
  'bras basah stn': ['CC2'],
  'esplanade stn': ['CC3'],
  'promenade stn': ['CC4', 'DT15'],
  'nicoll highway stn': ['CC5'],
  'mountbatten stn': ['CC7'],
  'dakota stn': ['CC8'],
  'macpherson stn': ['CC10', 'DT26'],
  'tai seng stn': ['CC11'],
  'bartley stn': ['CC12'],
  'lorong chuan stn': ['CC14'],
  'marymount stn': ['CC16'],
  'caldecott stn': ['CC17', 'TE9'],
  'bukit brown stn': ['CC18'],
  'botanic gardens stn': ['CC19', 'DT9'],
  'farrer road stn': ['CC20'],
  'holland village stn': ['CC21'],
  'one-north stn': ['CC23'],
  'kent ridge stn': ['CC24'],
  'haw par villa stn': ['CC25'],
  'pasir panjang stn': ['CC26'],
  'labrador park stn': ['CC27'],
  'telok blangah stn': ['CC28'],
  'bayfront stn': ['CC34', 'DT16'],

  // DT Line
  'bukit panjang stn': ['DT1', 'BP6'],
  'bukit panjang int': ['DT1', 'BP6'],
  'cashew stn': ['DT2'],
  'hillview stn': ['DT3'],
  'hume stn': ['DT4'],
  'beauty world stn': ['DT5'],
  'king albert park stn': ['DT6'],
  'king albert park': ['DT6'],
  'sixth avenue stn': ['DT7'],
  'sixth avenue': ['DT7'],
  'tan kah kee stn': ['DT8'],
  'stevens stn': ['DT10', 'TE11'],
  'rochor stn': ['DT13'],
  'downtown stn': ['DT17'],
  'telok ayer stn': ['DT18'],
  'fort canning stn': ['DT20'],
  'bencoolen stn': ['DT21'],
  'jalan besar stn': ['DT22'],
  'bendemeer stn': ['DT23'],
  'geylang bahru stn': ['DT24'],
  'mattar stn': ['DT25'],
  'ubi stn': ['DT27'],
  'kaki bukit stn': ['DT28'],
  'bedok north stn': ['DT29'],
  'bedok reservoir stn': ['DT30'],
  'tampines west stn': ['DT31'],
  'tampines east stn': ['DT33'],
  'upper changi stn': ['DT34'],

  // TE Line
  'woodlands north stn': ['TE1'],
  'woodlands south stn': ['TE3'],
  'springleaf stn': ['TE4'],
  'lentor stn': ['TE5'],
  'mayflower stn': ['TE6'],
  'bright hill stn': ['TE7'],
  'upper thomson stn': ['TE8'],
  'mount pleasant stn': ['TE10'],
  'napier stn': ['TE12'],
  'great world stn': ['TE15'],
  'havelock stn': ['TE16'],
  'maxwell stn': ['TE18'],
  'shenton way stn': ['TE19'],
  'marina gardens stn': ['TE21'],
  'gardens by the bay stn': ['TE22'],
  'tanjong rhu stn': ['TE23'],
  'katong park stn': ['TE24'],
  'tanjong katong stn': ['TE25'],
  'marine parade stn': ['TE26'],
  'marine terrace stn': ['TE27'],
  'siglap stn': ['TE28'],
  'bayshore stn': ['TE29'],

  // LRT
  'south view stn': ['BP2'],
  'keat hong stn': ['BP3'],
  'teck whye stn': ['BP4'],
  'phoenix stn': ['BP5'],
  'petir stn': ['BP7'],
  'pending stn': ['BP8'],
  'bangkit stn': ['BP9'],
  'fajar stn': ['BP10'],
  'segar stn': ['BP11'],
  'jelapang stn': ['BP12'],
  'senja stn': ['BP13'],
  'compassvale stn': ['SE1'],
  'rumbia stn': ['SE2'],
  'bakau stn': ['SE3'],
  'kangkar stn': ['SE4'],
  'ranggung stn': ['SE5'],
  'cheng lim stn': ['SW1'],
  'farmway stn': ['SW2'],
  'kupang stn': ['SW3'],
  'thanggam stn': ['SW4'],
  'fernvale stn': ['SW5'],
  'layar stn': ['SW6'],
  'tongkang stn': ['SW7'],
  'renjong stn': ['SW8'],
  'cove stn': ['PE1'],
  'meridian stn': ['PE2'],
  'coral edge stn': ['PE3'],
  'riviera stn': ['PE4'],
  'kadaloor stn': ['PE5'],
  'oasis stn': ['PE6'],
  'damai stn': ['PE7'],
  'sam kee stn': ['PW1'],
  'teck lee stn': ['PW2'],
  'punggol point stn': ['PW3'],
  'samudera stn': ['PW4'],
  'nibong stn': ['PW5'],
  'sumang stn': ['PW6'],
  'soo teck stn': ['PW7'],

  // Venue-named stops that are near a specific station but don't follow the "Stn" pattern
  'national stadium': ['CC6'],
};

// Build a lookup from station code to station info
const stationByCode = new Map<string, { code: string; name: string; line: string; lineColor: string }>();
for (const s of STATIONS) {
  stationByCode.set(s.code, { code: s.code, name: s.name, line: s.line, lineColor: s.lineColor });
}

export interface MrtStationInfo {
  code: string;
  name: string;
  line: string;
  lineColor: string;
}

export function getMrtStationsForBusStop(description: string): MrtStationInfo[] {
  const key = description.toLowerCase().trim();

  // Direct lookup
  const codes = BUS_STOP_MRT_MAP[key];
  if (codes) {
    return codes.map(c => stationByCode.get(c)).filter((s): s is MrtStationInfo => !!s);
  }

  // Fuzzy: check if any map key is contained in the description
  for (const [mapKey, mapCodes] of Object.entries(BUS_STOP_MRT_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return mapCodes.map(c => stationByCode.get(c)).filter((s): s is MrtStationInfo => !!s);
    }
  }

  // Check if bus stop name references an MRT station explicitly (e.g. "Stadium Stn", "Jurong East Int")
  // Require the station name to be followed by stn/int/interchange to avoid matching venue names
  // like "Toa Payoh Stadium" or "National Stadium" against the CC6 "Stadium" station.
  const matches: MrtStationInfo[] = [];
  for (const s of STATIONS) {
    if (s.underConstruction) continue;
    const stationNameLower = s.name.toLowerCase();
    const escaped = stationNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stationRefPattern = new RegExp(`\\b${escaped}\\s+(stn|int|interchange|station)\\b`);
    if (stationRefPattern.test(key)) {
      const existing = matches.find(m => m.code === s.code);
      if (!existing) matches.push({ code: s.code, name: s.name, line: s.line, lineColor: s.lineColor });
    }
  }

  // Deduplicate by station name (keep first code per name)
  const seen = new Set<string>();
  return matches.filter(m => {
    if (seen.has(m.name)) return false;
    seen.add(m.name);
    return true;
  });
}
