// Curated exit -> landmark data for high-traffic / tourist / interchange stations.
//
// Keyed by station NAME (not code) so interchange stations resolve once
// regardless of which line code the user arrived through (e.g. Orchard is
// both NS22 and TE14 but shares the same physical exits).
//
// Scope: ~20 stations that account for the bulk of tourist and commuter exit
// lookups. Every other station falls back to the plain lettered/numbered exit
// grid. Stations not listed here are intentionally omitted, not forgotten.
//
// Exit labels + landmarks verified against Land Transport Guru
// (landtransportguru.net) station exit guides. The TEL rule holds: TEL and
// TEL-interchange stations (Orchard, Marina Bay, Outram Park, Gardens by the
// Bay) use NUMBERED exits; all other stations use LETTERED exits. Changi
// Airport is the one exception — it labels exits by terminal (T2 / T3).
// Exits with no notable landmark are intentionally omitted.

export interface StationExit {
  label: string;        // exit label, e.g. 'A', '1', or 'T2'
  landmarks: string[];  // nearby notable destinations reached from this exit
}

export const STATION_EXITS: Record<string, StationExit[]> = {
  Orchard: [
    { label: '1', landmarks: ['Tang Plaza', 'Lucky Plaza', 'Far East Plaza', 'Mount Elizabeth Hospital'] },
    { label: '3', landmarks: ['Wisma Atria', 'Ngee Ann City'] },
    { label: '4', landmarks: ['ION Orchard'] },
    { label: '5', landmarks: ['ION Orchard', 'Wheelock Place'] },
    { label: '7', landmarks: ['ION Orchard', 'Orchard Boulevard'] },
    { label: '11', landmarks: ['Wheelock Place', 'Four Seasons Hotel', 'voco Orchard Singapore'] },
  ],

  Somerset: [
    { label: 'A', landmarks: ['111 Somerset', 'Somerset Skate Park', 'Youth Park'] },
    { label: 'B', landmarks: ['313@somerset', 'Cineleisure Orchard', 'Mandarin Gallery', 'The Heeren'] },
    { label: 'C', landmarks: ['orchardgateway', 'Design Orchard', 'Peranakan Place', 'Singapore Visitor Centre'] },
    { label: 'D', landmarks: ['Orchard Central', 'The Centrepoint', 'Concorde Hotel & Shopping Mall'] },
  ],

  'Dhoby Ghaut': [
    { label: 'A', landmarks: ['National Museum of Singapore', 'School of The Arts', 'Singapore Management University'] },
    { label: 'B', landmarks: ['Plaza Singapura', 'Fort Canning Park', 'Istana Park'] },
    { label: 'C', landmarks: ['The Istana', 'Plaza Singapura', 'Fort Canning Park'] },
    { label: 'D', landmarks: ['Plaza Singapura'] },
    { label: 'E', landmarks: ['The Atrium@Orchard', 'School of The Arts', 'Singapore Management University'] },
  ],

  'City Hall': [
    { label: 'A', landmarks: ['Raffles Hotel', 'CHIJMES', 'National Library', 'Fairmont Singapore'] },
    { label: 'B', landmarks: ['National Gallery Singapore', 'Padang', 'Supreme Court', 'Parliament House'] },
    { label: 'C', landmarks: ['Citylink Mall', 'Esplanade – Theatres on the Bay', 'Suntec City', 'Marina Square'] },
    { label: 'D', landmarks: ['Funan', 'Capitol Singapore', 'Peranakan Museum', 'Grand Park City Hall'] },
  ],

  'Raffles Place': [
    { label: 'A', landmarks: ['CapitaSpring', 'Clifford Pier', 'OUE Bayfront'] },
    { label: 'B', landmarks: ['Market Street Hawker Centre', 'OCBC Centre', 'HSBC Building'] },
    { label: 'F', landmarks: ['CapitaGreen', 'Far East Square', 'Samsung Hub'] },
    { label: 'G', landmarks: ['Boat Quay', 'UOB Plaza'] },
    { label: 'H', landmarks: ['Merlion Park', 'The Fullerton Hotel', 'Asian Civilisations Museum', 'Victoria Theatre & Concert Hall'] },
    { label: 'I', landmarks: ['Lau Pa Sat', 'Asia Square', 'SGX Centre'] },
    { label: 'J', landmarks: ['Marina Bay Link Mall'] },
  ],

  'Marina Bay': [
    { label: '1', landmarks: ['Marina Bay Financial Centre', 'Asia Square', 'Marina One', 'The Westin Singapore'] },
    { label: '2', landmarks: ['Marina Bay Link Mall', 'Red Dot Design Museum'] },
    { label: '5', landmarks: ['Singapore Chinese Cultural Centre', 'Singapore Conference Hall'] },
  ],

  Bayfront: [
    { label: 'B', landmarks: ['Marina Bay Sands Hotel', 'Sands SkyPark', 'Gardens by the Bay (Bay South)'] },
    { label: 'C', landmarks: ['The Shoppes at Marina Bay Sands', 'ArtScience Museum', 'Sands Theatre'] },
    { label: 'D', landmarks: ['Sands Expo and Convention Centre', 'The Helix Bridge'] },
    { label: 'E', landmarks: ['Marina Bay City Gallery', 'The Promontory @ Marina Bay'] },
  ],

  'Gardens by the Bay': [
    { label: '1', landmarks: ['Gardens by the Bay', 'Satay by the Bay', 'Marina Barrage'] },
    { label: '3', landmarks: ['Marina Mall'] },
  ],

  Bugis: [
    { label: 'A', landmarks: ['Bugis Street', 'Albert Centre Market & Food Centre', 'Fu Lu Shou Complex'] },
    { label: 'B', landmarks: ['Masjid Sultan', 'Malay Heritage Centre', 'Raffles Hospital', 'Istana Kampong Glam'] },
    { label: 'C', landmarks: ['Bugis Junction', 'Bugis+', 'National Library', 'InterContinental Singapore'] },
    { label: 'D', landmarks: ['Bugis Cube', 'Shaw Towers'] },
    { label: 'E', landmarks: ['Duo Galleria', 'Andaz Singapore', 'Parkroyal on Beach Road'] },
    { label: 'G', landmarks: ['Guoco Midtown'] },
  ],

  Chinatown: [
    { label: 'A', landmarks: ['Pagoda Street', 'Buddha Tooth Relic Temple', 'Sri Mariamman Temple'] },
    { label: 'C', landmarks: ["People's Park Complex"] },
    { label: 'D', landmarks: ["People's Park Centre"] },
    { label: 'E', landmarks: ['Chinatown Point'] },
    { label: 'F', landmarks: ['Hong Lim Complex', "Hong Lim Park (Speakers' Corner)"] },
  ],

  'Little India': [
    { label: 'B', landmarks: ['Tekka Market'] },
    { label: 'C', landmarks: ['Tekka Centre', 'The Verge'] },
    { label: 'D', landmarks: ['Shree Lakshminarayan Temple', 'Foochow Methodist Church'] },
    { label: 'E', landmarks: ['Sri Veeramakaliamman Temple'] },
    { label: 'F', landmarks: ["KK Women's & Children's Hospital", 'Kampong Java Park'] },
  ],

  HarbourFront: [
    { label: 'A', landmarks: ['HarbourFront Bus Interchange', 'Seah Im Food Centre'] },
    { label: 'B', landmarks: ['HarbourFront Centre', 'Singapore Cable Car', 'Singapore Cruise Centre'] },
    { label: 'C', landmarks: ['St. James Power Station'] },
    { label: 'D', landmarks: ['Mount Faber Park (Marang Trail)', 'Travelodge HarbourFront'] },
    { label: 'E', landmarks: ['VivoCity', 'Sentosa Express'] },
  ],

  Esplanade: [
    { label: 'A', landmarks: ['Suntec City', 'Pan Pacific Hotel', 'Conrad Centennial Singapore', 'Millenia Walk'] },
    { label: 'B', landmarks: ['Marina Square', 'Marina Mandarin Singapore', 'Mandarin Oriental'] },
    { label: 'C', landmarks: ['Singapore Flyer', 'Marina Square', 'One Raffles Link'] },
    { label: 'D', landmarks: ['Esplanade – Theatres on the Bay', 'CityLink Mall', 'Merlion Park', 'Esplanade Park'] },
    { label: 'E', landmarks: ['The Padang', 'Civilian War Memorial'] },
    { label: 'F', landmarks: ['Raffles Hotel', 'CHIJMES', 'Carlton Hotel', 'Bras Basah Complex'] },
    { label: 'G', landmarks: ['Raffles City', 'Fairmont Singapore', 'Swissotel The Stamford', "St Andrew's Cathedral"] },
  ],

  Promenade: [
    { label: 'A', landmarks: ['Singapore Flyer', 'Marina Square', 'The Ritz-Carlton Millenia Singapore', 'Mandarin Oriental Singapore'] },
    { label: 'B', landmarks: ['Millenia Walk', 'Conrad Centennial Singapore', 'Centennial Tower'] },
    { label: 'C', landmarks: ['Suntec City'] },
  ],

  'Bras Basah': [
    { label: 'A', landmarks: ['CHIJMES', 'National Library', 'Peranakan Museum', 'Bras Basah Complex'] },
    { label: 'B', landmarks: ['Singapore Management University', 'National Museum of Singapore', 'Fort Canning Park'] },
    { label: 'D', landmarks: ['The Cathay', 'School of The Arts (SOTA)', 'NAFA', 'Fort Canning Park'] },
  ],

  'Botanic Gardens': [
    { label: 'A', landmarks: ['Singapore Botanic Gardens', 'Adam Road Food Centre', 'Cluny Court', 'NUS Bukit Timah Campus'] },
  ],

  'Changi Airport': [
    { label: 'T2', landmarks: ['Changi Airport Terminal 2', 'Terminal 4 (shuttle bus)'] },
    { label: 'T3', landmarks: ['Changi Airport Terminal 3', 'Jewel Changi Airport', 'Terminal 1 (Skytrain)'] },
  ],

  Newton: [
    { label: 'A', landmarks: ['Sheraton Towers Singapore', 'Balmoral Plaza'] },
    { label: 'B', landmarks: ['Newton Food Centre', 'Cairnhill Community Club'] },
    { label: 'C', landmarks: ['Newton One'] },
  ],

  'Tanjong Pagar': [
    { label: 'A', landmarks: ['100 AM', 'Amara Hotel', 'Icon Village'] },
    { label: 'C', landmarks: ['International Plaza', 'Twenty Anson'] },
    { label: 'D', landmarks: ['M Hotel Singapore', 'OUE Downtown', 'Singapore Conference Hall'] },
    { label: 'F', landmarks: ['Lau Pa Sat', 'Capital Tower', 'Robinson 77'] },
    { label: 'G', landmarks: ['Thian Hock Keng Temple', 'Al-Abrar Mosque', 'Telok Ayer Chinese Methodist Church'] },
    { label: 'J', landmarks: ['Guoco Tower', 'Sofitel Singapore City Centre'] },
  ],

  'Outram Park': [
    { label: '4', landmarks: ['Dorsett Singapore', 'Oriental Plaza', 'Duxton Plain Park'] },
    { label: '6', landmarks: ['Singapore General Hospital', 'National Heart Centre Singapore', 'Duke-NUS Medical School'] },
    { label: '7', landmarks: ['National Cancer Centre Singapore', 'Singapore National Eye Centre'] },
    { label: '8', landmarks: ["Pearl's Hill City Park"] },
  ],
};

export function getStationExits(stationName: string): StationExit[] | null {
  return STATION_EXITS[stationName] ?? null;
}
