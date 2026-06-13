export interface Station {
  code: string;
  name: string;
  line: string;
  lineColor: string;
  exits: number;
  underConstruction?: boolean;
  openingDate?: string;
  publicpreview?: string;
}

export interface Line {
  id: string;
  name: string;
  color: string;
  textColor: string;
  type: 'mrt' | 'lrt';
}

export const LINES: Line[] = [
  // MRT Lines
  { id: 'NS', name: 'North South Line', color: '#D42E12', textColor: '#fff', type: 'mrt' },
  { id: 'EW', name: 'East West Line', color: '#009645', textColor: '#fff', type: 'mrt' },
  { id: 'NE', name: 'North East Line', color: '#9900AA', textColor: '#fff', type: 'mrt' },
  { id: 'CC', name: 'Circle Line', color: '#FA9E0D', textColor: '#fff', type: 'mrt' },
  { id: 'DT', name: 'Downtown Line', color: '#005EC4', textColor: '#fff', type: 'mrt' },
  { id: 'TE', name: 'Thomson-East Coast Line', color: '#9D5B25', textColor: '#fff', type: 'mrt' },
  // LRT Lines
  { id: 'BP', name: 'Bukit Panjang LRT', color: '#7E8D2E', textColor: '#fff', type: 'lrt' },
  { id: 'SK', name: 'Sengkang LRT', color: '#9A3033', textColor: '#fff', type: 'lrt' },
  { id: 'PG', name: 'Punggol LRT', color: '#6C5B27', textColor: '#fff', type: 'lrt' },
];

export const STATIONS: Station[] = [
  // ===== North South Line =====
  { code: 'NS1', name: 'Jurong East', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS2', name: 'Bukit Batok', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS3', name: 'Bukit Gombak', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS4', name: 'Choa Chu Kang', line: 'NS', lineColor: '#D42E12', exits: 5 },
  { code: 'NS5', name: 'Yew Tee', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS7', name: 'Kranji', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS8', name: 'Marsiling', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS9', name: 'Woodlands', line: 'NS', lineColor: '#D42E12', exits: 7 },
  { code: 'NS10', name: 'Admiralty', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS11', name: 'Sembawang', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS12', name: 'Canberra', line: 'NS', lineColor: '#D42E12', exits: 5 },
  { code: 'NS13', name: 'Yishun', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS14', name: 'Khatib', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS15', name: 'Yio Chu Kang', line: 'NS', lineColor: '#D42E12', exits: 3 },
  { code: 'NS16', name: 'Ang Mo Kio', line: 'NS', lineColor: '#D42E12', exits: 3 },
  { code: 'NS17', name: 'Bishan', line: 'NS', lineColor: '#D42E12', exits: 5 },
  { code: 'NS18', name: 'Braddell', line: 'NS', lineColor: '#D42E12', exits: 3 },
  { code: 'NS19', name: 'Toa Payoh', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS20', name: 'Novena', line: 'NS', lineColor: '#D42E12', exits: 2 },
  { code: 'NS21', name: 'Newton', line: 'NS', lineColor: '#D42E12', exits: 3 },
  { code: 'NS22', name: 'Orchard', line: 'NS', lineColor: '#D42E12', exits: 13 },
  { code: 'NS23', name: 'Somerset', line: 'NS', lineColor: '#D42E12', exits: 2 },
  { code: 'NS24', name: 'Dhoby Ghaut', line: 'NS', lineColor: '#D42E12', exits: 6 },
  { code: 'NS25', name: 'City Hall', line: 'NS', lineColor: '#D42E12', exits: 4 },
  { code: 'NS26', name: 'Raffles Place', line: 'NS', lineColor: '#D42E12', exits: 13 },
  { code: 'NS27', name: 'Marina Bay', line: 'NS', lineColor: '#D42E12', exits: 5 },
  { code: 'NS28', name: 'Marina South Pier', line: 'NS', lineColor: '#D42E12', exits: 2 },

  // ===== East West Line =====
  { code: 'EW1', name: 'Pasir Ris', line: 'EW', lineColor: '#009645', exits: 1 },
  { code: 'EW2', name: 'Tampines', line: 'EW', lineColor: '#009645', exits: 3 },
  { code: 'EW3', name: 'Simei', line: 'EW', lineColor: '#009645', exits: 1 },
  { code: 'EW4', name: 'Tanah Merah', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW5', name: 'Bedok', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW6', name: 'Kembangan', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW7', name: 'Eunos', line: 'EW', lineColor: '#009645', exits: 3 },
  { code: 'EW8', name: 'Paya Lebar', line: 'EW', lineColor: '#009645', exits: 5 },
  { code: 'EW9', name: 'Aljunied', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW10', name: 'Kallang', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW11', name: 'Lavender', line: 'EW', lineColor: '#009645', exits: 3 },
  { code: 'EW12', name: 'Bugis', line: 'EW', lineColor: '#009645', exits: 7 },
  { code: 'EW13', name: 'City Hall', line: 'EW', lineColor: '#009645', exits: 4 },
  { code: 'EW14', name: 'Raffles Place', line: 'EW', lineColor: '#009645', exits: 13 },
  { code: 'EW15', name: 'Tanjong Pagar', line: 'EW', lineColor: '#009645', exits: 10 },
  { code: 'EW16', name: 'Outram Park', line: 'EW', lineColor: '#009645', exits: 8 },
  { code: 'EW17', name: 'Tiong Bahru', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW18', name: 'Redhill', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW19', name: 'Queenstown', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW20', name: 'Commonwealth', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW21', name: 'Buona Vista', line: 'EW', lineColor: '#009645', exits: 4 },
  { code: 'EW22', name: 'Dover', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW23', name: 'Clementi', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW24', name: 'Jurong East', line: 'EW', lineColor: '#009645', exits: 4 },
  { code: 'EW25', name: 'Chinese Garden', line: 'EW', lineColor: '#009645', exits: 3 },
  { code: 'EW26', name: 'Lakeside', line: 'EW', lineColor: '#009645', exits: 3 },
  { code: 'EW27', name: 'Boon Lay', line: 'EW', lineColor: '#009645', exits: 6 },
  { code: 'EW28', name: 'Pioneer', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW29', name: 'Joo Koon', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW30', name: 'Gul Circle', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW31', name: 'Tuas Crescent', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW32', name: 'Tuas West Road', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'EW33', name: 'Tuas Link', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'CG1', name: 'Expo', line: 'EW', lineColor: '#009645', exits: 2 },
  { code: 'CG2', name: 'Changi Airport', line: 'EW', lineColor: '#009645', exits: 2 },

  // ===== North East Line =====
  { code: 'NE1', name: 'HarbourFront', line: 'NE', lineColor: '#9900AA', exits: 5 },
  { code: 'NE3', name: 'Outram Park', line: 'NE', lineColor: '#9900AA', exits: 8 },
  { code: 'NE4', name: 'Chinatown', line: 'NE', lineColor: '#9900AA', exits: 7 },
  { code: 'NE5', name: 'Clarke Quay', line: 'NE', lineColor: '#9900AA', exits: 6 },
  { code: 'NE6', name: 'Dhoby Ghaut', line: 'NE', lineColor: '#9900AA', exits: 6 },
  { code: 'NE7', name: 'Little India', line: 'NE', lineColor: '#9900AA', exits: 6 },
  { code: 'NE8', name: 'Farrer Park', line: 'NE', lineColor: '#9900AA', exits: 9 },
  { code: 'NE9', name: 'Boon Keng', line: 'NE', lineColor: '#9900AA', exits: 3 },
  { code: 'NE10', name: 'Potong Pasir', line: 'NE', lineColor: '#9900AA', exits: 3 },
  { code: 'NE11', name: 'Woodleigh', line: 'NE', lineColor: '#9900AA', exits: 3 },
  { code: 'NE12', name: 'Serangoon', line: 'NE', lineColor: '#9900AA', exits: 6 },
  { code: 'NE13', name: 'Kovan', line: 'NE', lineColor: '#9900AA', exits: 3 },
  { code: 'NE14', name: 'Hougang', line: 'NE', lineColor: '#9900AA', exits: 3 },
  { code: 'NE15', name: 'Buangkok', line: 'NE', lineColor: '#9900AA', exits: 3 },
  { code: 'NE16', name: 'Sengkang', line: 'NE', lineColor: '#9900AA', exits: 4 },
  { code: 'NE17', name: 'Punggol', line: 'NE', lineColor: '#9900AA', exits: 4 },
  { code: 'NE18', name: 'Punggol Coast', line: 'NE', lineColor: '#9900AA', exits: 2 },

  // ===== Circle Line =====
  { code: 'CC1', name: 'Dhoby Ghaut', line: 'CC', lineColor: '#FA9E0D', exits: 6 },
  { code: 'CC2', name: 'Bras Basah', line: 'CC', lineColor: '#FA9E0D', exits: 3 },
  { code: 'CC3', name: 'Esplanade', line: 'CC', lineColor: '#FA9E0D', exits: 4 },
  { code: 'CC4', name: 'Promenade', line: 'CC', lineColor: '#FA9E0D', exits: 3 },
  { code: 'CC5', name: 'Nicoll Highway', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC6', name: 'Stadium', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC7', name: 'Mountbatten', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC8', name: 'Dakota', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC9', name: 'Paya Lebar', line: 'CC', lineColor: '#FA9E0D', exits: 5 },
  { code: 'CC10', name: 'MacPherson', line: 'CC', lineColor: '#FA9E0D', exits: 5 },
  { code: 'CC11', name: 'Tai Seng', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC12', name: 'Bartley', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC13', name: 'Serangoon', line: 'CC', lineColor: '#FA9E0D', exits: 6 },
  { code: 'CC14', name: 'Lorong Chuan', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC15', name: 'Bishan', line: 'CC', lineColor: '#FA9E0D', exits: 5 },
  { code: 'CC16', name: 'Marymount', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC17', name: 'Caldecott', line: 'CC', lineColor: '#FA9E0D', exits: 4 },
  { code: 'CC19', name: 'Botanic Gardens', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC20', name: 'Farrer Road', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC21', name: 'Holland Village', line: 'CC', lineColor: '#FA9E0D', exits: 3 },
  { code: 'CC22', name: 'Buona Vista', line: 'CC', lineColor: '#FA9E0D', exits: 4 },
  { code: 'CC23', name: 'one-north', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CC24', name: 'Kent Ridge', line: 'CC', lineColor: '#FA9E0D', exits: 5 },
  { code: 'CC25', name: 'Haw Par Villa', line: 'CC', lineColor: '#FA9E0D', exits: 1 },
  { code: 'CC26', name: 'Pasir Panjang', line: 'CC', lineColor: '#FA9E0D', exits: 1 },
  { code: 'CC27', name: 'Labrador Park', line: 'CC', lineColor: '#FA9E0D', exits: 1 },
  { code: 'CC28', name: 'Telok Blangah', line: 'CC', lineColor: '#FA9E0D', exits: 1 },
  { code: 'CC29', name: 'HarbourFront', line: 'CC', lineColor: '#FA9E0D', exits: 5 },
  { code: 'CE1', name: 'Bayfront', line: 'CC', lineColor: '#FA9E0D', exits: 2 },
  { code: 'CE2', name: 'Marina Bay', line: 'CC', lineColor: '#FA9E0D', exits: 5 },
  // CCL6 Under Construction
  { code: 'CC30', name: 'Keppel', line: 'CC', lineColor: '#FA9E0D', exits: 0, underConstruction: true, openingDate: '12 July 2026', publicpreview:  '4 July 2026'  },
  { code: 'CC31', name: 'Cantonment', line: 'CC', lineColor: '#FA9E0D', exits: 0, underConstruction: true, openingDate: '12 July 2026' },
  { code: 'CC32', name: 'Prince Edward Road', line: 'CC', lineColor: '#FA9E0D', exits: 0, underConstruction: true, openingDate: '12 July 2026' },

  // ===== Downtown Line =====
  { code: 'DT1', name: 'Bukit Panjang', line: 'DT', lineColor: '#005EC4', exits: 4 },
  { code: 'DT2', name: 'Cashew', line: 'DT', lineColor: '#005EC4', exits: 1 },
  { code: 'DT3', name: 'Hillview', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT4', name: 'Hume', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT5', name: 'Beauty World', line: 'DT', lineColor: '#005EC4', exits: 4 },
  { code: 'DT6', name: 'King Albert Park', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT7', name: 'Sixth Avenue', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT8', name: 'Tan Kah Kee', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT9', name: 'Botanic Gardens', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT10', name: 'Stevens', line: 'DT', lineColor: '#005EC4', exits: 5 },
  { code: 'DT11', name: 'Newton', line: 'DT', lineColor: '#005EC4', exits: 3 },
  { code: 'DT12', name: 'Little India', line: 'DT', lineColor: '#005EC4', exits: 6 },
  { code: 'DT13', name: 'Rochor', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT14', name: 'Bugis', line: 'DT', lineColor: '#005EC4', exits: 8 },
  { code: 'DT15', name: 'Promenade', line: 'DT', lineColor: '#005EC4', exits: 3 },
  { code: 'DT16', name: 'Bayfront', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT17', name: 'Downtown', line: 'DT', lineColor: '#005EC4', exits: 3 },
  { code: 'DT18', name: 'Telok Ayer', line: 'DT', lineColor: '#005EC4', exits: 3 },
  { code: 'DT19', name: 'Chinatown', line: 'DT', lineColor: '#005EC4', exits: 7 },
  { code: 'DT20', name: 'Fort Canning', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT21', name: 'Bencoolen', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT22', name: 'Jalan Besar', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT23', name: 'Bendemeer', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT24', name: 'Geylang Bahru', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT25', name: 'Mattar', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT26', name: 'MacPherson', line: 'DT', lineColor: '#005EC4', exits: 5 },
  { code: 'DT27', name: 'Ubi', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT28', name: 'Kaki Bukit', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT29', name: 'Bedok North', line: 'DT', lineColor: '#005EC4', exits: 3 },
  { code: 'DT30', name: 'Bedok Reservoir', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT31', name: 'Tampines West', line: 'DT', lineColor: '#005EC4', exits: 2 },
  { code: 'DT32', name: 'Tampines', line: 'DT', lineColor: '#005EC4', exits: 3 },
  { code: 'DT33', name: 'Tampines East', line: 'DT', lineColor: '#005EC4', exits: 4 },
  { code: 'DT34', name: 'Upper Changi', line: 'DT', lineColor: '#005EC4', exits: 5 },
  { code: 'DT35', name: 'Expo', line: 'DT', lineColor: '#005EC4', exits: 6 },
  { code: 'DT36', name: 'Xilin', line: 'DT', lineColor: '#005EC4', exits: 0, underConstruction: true, openingDate: '2H 2026' },
  { code: 'DT37', name: 'Sungei Bedok', line: 'DT', lineColor: '#005EC4', exits: 0, underConstruction: true, openingDate: '2H 2026' },

  // ===== Thomson-East Coast Line =====
  { code: 'TE1', name: 'Woodlands North', line: 'TE', lineColor: '#9D5B25', exits: 2 },
  { code: 'TE2', name: 'Woodlands', line: 'TE', lineColor: '#9D5B25', exits: 7 },
  { code: 'TE3', name: 'Woodlands South', line: 'TE', lineColor: '#9D5B25', exits: 4 },
  { code: 'TE4', name: 'Springleaf', line: 'TE', lineColor: '#9D5B25', exits: 3 },
  { code: 'TE5', name: 'Lentor', line: 'TE', lineColor: '#9D5B25', exits: 5 },
  { code: 'TE6', name: 'Mayflower', line: 'TE', lineColor: '#9D5B25', exits: 7 },
  { code: 'TE7', name: 'Bright Hill', line: 'TE', lineColor: '#9D5B25', exits: 4 },
  { code: 'TE8', name: 'Upper Thomson', line: 'TE', lineColor: '#9D5B25', exits: 5 },
  { code: 'TE9', name: 'Caldecott', line: 'TE', lineColor: '#9D5B25', exits: 4 },
  { code: 'TE11', name: 'Stevens', line: 'TE', lineColor: '#9D5B25', exits: 5 },
  { code: 'TE12', name: 'Napier', line: 'TE', lineColor: '#9D5B25', exits: 2 },
  { code: 'TE13', name: 'Orchard Boulevard', line: 'TE', lineColor: '#9D5B25', exits: 2 },
  { code: 'TE14', name: 'Orchard', line: 'TE', lineColor: '#9D5B25', exits: 13 },
  { code: 'TE15', name: 'Great World', line: 'TE', lineColor: '#9D5B25', exits: 5 },
  { code: 'TE16', name: 'Havelock', line: 'TE', lineColor: '#9D5B25', exits: 5 },
  { code: 'TE17', name: 'Outram Park', line: 'TE', lineColor: '#9D5B25', exits: 8 },
  { code: 'TE18', name: 'Maxwell', line: 'TE', lineColor: '#9D5B25', exits: 3 },
  { code: 'TE19', name: 'Shenton Way', line: 'TE', lineColor: '#9D5B25', exits: 3 },
  { code: 'TE21', name: 'Marina Gardens', line: 'TE', lineColor: '#9D5B25', exits: 4 },
  { code: 'TE22', name: 'Gardens by the Bay', line: 'TE', lineColor: '#9D5B25', exits: 3 },
  { code: 'TE23', name: 'Tanjong Rhu', line: 'TE', lineColor: '#9D5B25', exits: 2 },
  { code: 'TE24', name: 'Katong Park', line: 'TE', lineColor: '#9D5B25', exits: 2 },
  { code: 'TE25', name: 'Tanjong Katong', line: 'TE', lineColor: '#9D5B25', exits: 3 },
  { code: 'TE26', name: 'Marine Parade', line: 'TE', lineColor: '#9D5B25', exits: 6 },
  { code: 'TE27', name: 'Marine Terrace', line: 'TE', lineColor: '#9D5B25', exits: 6 },
  { code: 'TE28', name: 'Siglap', line: 'TE', lineColor: '#9D5B25', exits: 4 },
  { code: 'TE29', name: 'Bayshore', line: 'TE', lineColor: '#9D5B25', exits: 5 },
  { code: 'TE30', name: 'Bedok South', line: 'TE', lineColor: '#9D5B25', exits: 0, underConstruction: true, openingDate: '2H 2026' },
  { code: 'TE31', name: 'Sungei Bedok', line: 'TE', lineColor: '#9D5B25', exits: 0, underConstruction: true, openingDate: '2H 2026' },

  // ===== Bukit Panjang LRT =====
  { code: 'BP1', name: 'Choa Chu Kang', line: 'BP', lineColor: '#7E8D2E', exits: 5 },
  { code: 'BP2', name: 'South View', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP3', name: 'Keat Hong', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP4', name: 'Teck Whye', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP5', name: 'Phoenix', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP6', name: 'Bukit Panjang', line: 'BP', lineColor: '#7E8D2E', exits: 4 },
  { code: 'BP7', name: 'Petir', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP8', name: 'Pending', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP9', name: 'Bangkit', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP10', name: 'Fajar', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP11', name: 'Segar', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP12', name: 'Jelapang', line: 'BP', lineColor: '#7E8D2E', exits: 1 },
  { code: 'BP13', name: 'Senja', line: 'BP', lineColor: '#7E8D2E', exits: 1 },

  // ===== Sengkang LRT =====
  { code: 'STC', name: 'Sengkang', line: 'SK', lineColor: '#9A3033', exits: 4 },
  { code: 'SE1', name: 'Compassvale', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SE2', name: 'Rumbia', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SE3', name: 'Bakau', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SE4', name: 'Kangkar', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SE5', name: 'Ranggung', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SW1', name: 'Cheng Lim', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SW2', name: 'Farmway', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SW3', name: 'Kupang', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SW4', name: 'Thanggam', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SW5', name: 'Fernvale', line: 'SK', lineColor: '#9A3033', exits: 1 },
  { code: 'SW6', name: 'Layar', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SW7', name: 'Tongkang', line: 'SK', lineColor: '#9A3033', exits: 2 },
  { code: 'SW8', name: 'Renjong', line: 'SK', lineColor: '#9A3033', exits: 2 },

  // ===== Punggol LRT =====
  { code: 'PTC', name: 'Punggol', line: 'PG', lineColor: '#6C5B27', exits: 4 },
  { code: 'PE1', name: 'Cove', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PE2', name: 'Meridian', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PE3', name: 'Coral Edge', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PE4', name: 'Riviera', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PE5', name: 'Kadaloor', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PE6', name: 'Oasis', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PE7', name: 'Damai', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PW1', name: 'Sam Kee', line: 'PG', lineColor: '#6C5B27', exits: 3 },
  { code: 'PW2', name: 'Teck Lee', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PW3', name: 'Punggol Point', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PW4', name: 'Samudera', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PW5', name: 'Nibong', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PW6', name: 'Sumang', line: 'PG', lineColor: '#6C5B27', exits: 2 },
  { code: 'PW7', name: 'Soo Teck', line: 'PG', lineColor: '#6C5B27', exits: 2 },
];

export interface InterchangeInfo {
  lineId: string;
  stationCode: string;
}

const INTERCHANGE_MAP: Record<string, InterchangeInfo[]> = {
  'Jurong East': [
    { lineId: 'EW', stationCode: 'EW24' },
  ],
  'Bukit Panjang': [
    { lineId: 'DT', stationCode: 'DT1' },
    { lineId: 'BP', stationCode: 'BP6' },
  ],
  'Choa Chu Kang': [
    { lineId: 'NS', stationCode: 'NS4' },
    { lineId: 'BP', stationCode: 'BP1' },
  ],
  'Bishan': [
    { lineId: 'NS', stationCode: 'NS17' },
    { lineId: 'CC', stationCode: 'CC15' },
  ],
  'Newton': [
    { lineId: 'NS', stationCode: 'NS21' },
    { lineId: 'DT', stationCode: 'DT11' },
  ],
  'Orchard': [
    { lineId: 'NS', stationCode: 'NS22' },
    { lineId: 'TE', stationCode: 'TE14' },
  ],
  'Dhoby Ghaut': [
    { lineId: 'NS', stationCode: 'NS24' },
    { lineId: 'NE', stationCode: 'NE6' },
    { lineId: 'CC', stationCode: 'CC1' },
  ],
  'City Hall': [
    { lineId: 'NS', stationCode: 'NS25' },
    { lineId: 'EW', stationCode: 'EW13' },
  ],
  'Raffles Place': [
    { lineId: 'NS', stationCode: 'NS26' },
    { lineId: 'EW', stationCode: 'EW14' },
  ],
  'Marina Bay': [
    { lineId: 'NS', stationCode: 'NS27' },
    { lineId: 'CC', stationCode: 'CE2' },
    { lineId: 'TE', stationCode: 'TE20' },
  ],
  'Paya Lebar': [
    { lineId: 'EW', stationCode: 'EW8' },
    { lineId: 'CC', stationCode: 'CC9' },
  ],
  'Bugis': [
    { lineId: 'EW', stationCode: 'EW12' },
    { lineId: 'DT', stationCode: 'DT14' },
  ],
  'Outram Park': [
    { lineId: 'EW', stationCode: 'EW16' },
    { lineId: 'NE', stationCode: 'NE3' },
    { lineId: 'TE', stationCode: 'TE17' },
  ],
  'Buona Vista': [
    { lineId: 'EW', stationCode: 'EW21' },
    { lineId: 'CC', stationCode: 'CC22' },
  ],
  'Expo': [
    { lineId: 'EW', stationCode: 'CG1' },
    { lineId: 'DT', stationCode: 'DT35' },
  ],
  'Tampines': [
    { lineId: 'EW', stationCode: 'EW2' },
    { lineId: 'DT', stationCode: 'DT32' },
  ],
  'HarbourFront': [
    { lineId: 'NE', stationCode: 'NE1' },
    { lineId: 'CC', stationCode: 'CC29' },
  ],
  'Chinatown': [
    { lineId: 'NE', stationCode: 'NE4' },
    { lineId: 'DT', stationCode: 'DT19' },
  ],
  'Little India': [
    { lineId: 'NE', stationCode: 'NE7' },
    { lineId: 'DT', stationCode: 'DT12' },
  ],
  'Serangoon': [
    { lineId: 'NE', stationCode: 'NE12' },
    { lineId: 'CC', stationCode: 'CC13' },
  ],
  'Sengkang': [
    { lineId: 'NE', stationCode: 'NE16' },
    { lineId: 'SK', stationCode: 'STC' },
  ],
  'Punggol': [
    { lineId: 'NE', stationCode: 'NE17' },
    { lineId: 'PG', stationCode: 'PTC' },
  ],
  'Promenade': [
    { lineId: 'CC', stationCode: 'CC4' },
    { lineId: 'DT', stationCode: 'DT15' },
  ],
  'Bayfront': [
    { lineId: 'CC', stationCode: 'CE1' },
    { lineId: 'DT', stationCode: 'DT16' },
  ],
  'Botanic Gardens': [
    { lineId: 'CC', stationCode: 'CC19' },
    { lineId: 'DT', stationCode: 'DT9' },
  ],
  'Caldecott': [
    { lineId: 'CC', stationCode: 'CC17' },
    { lineId: 'TE', stationCode: 'TE9' },
  ],
  'MacPherson': [
    { lineId: 'CC', stationCode: 'CC10' },
    { lineId: 'DT', stationCode: 'DT26' },
  ],
  'Stevens': [
    { lineId: 'DT', stationCode: 'DT10' },
    { lineId: 'TE', stationCode: 'TE11' },
  ],
  'Woodlands': [
    { lineId: 'NS', stationCode: 'NS9' },
    { lineId: 'TE', stationCode: 'TE2' },
  ],
  'Bright Hill': [
    { lineId: 'TE', stationCode: 'TE7' },
  ],
};

export function getInterchanges(stationName: string, currentLine: string): InterchangeInfo[] {
  const all = INTERCHANGE_MAP[stationName] ?? [];
  return all.filter(i => i.lineId !== currentLine);
}

export function isInterchange(stationName: string): boolean {
  const all = INTERCHANGE_MAP[stationName] ?? [];
  return all.length > 1;
}

export function getStationsByLine(lineId: string): Station[] {
  return STATIONS.filter(s => s.line === lineId);
}

export function searchStations(query: string): Station[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return STATIONS.filter(
    s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  );
}
