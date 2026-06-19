import { STATIONS, LINES, type Station } from './stations';
import { distanceKm } from '../lib/geo';

// Approximate station coordinates (WGS84). Interchange stations share
// the same coordinates across their line codes.
const STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  // ===== North South Line =====
  NS1: { lat: 1.3330, lng: 103.7422 },
  NS2: { lat: 1.3490, lng: 103.7496 },
  NS3: { lat: 1.3589, lng: 103.7518 },
  NS4: { lat: 1.3854, lng: 103.7443 },
  NS5: { lat: 1.3973, lng: 103.7474 },
  NS7: { lat: 1.4251, lng: 103.7619 },
  NS8: { lat: 1.4326, lng: 103.7741 },
  NS9: { lat: 1.4370, lng: 103.7865 },
  NS10: { lat: 1.4406, lng: 103.8009 },
  NS11: { lat: 1.4491, lng: 103.8201 },
  NS12: { lat: 1.4430, lng: 103.8297 },
  NS13: { lat: 1.4294, lng: 103.8350 },
  NS14: { lat: 1.4173, lng: 103.8329 },
  NS15: { lat: 1.3818, lng: 103.8449 },
  NS16: { lat: 1.3700, lng: 103.8496 },
  NS17: { lat: 1.3509, lng: 103.8485 },
  NS18: { lat: 1.3404, lng: 103.8467 },
  NS19: { lat: 1.3327, lng: 103.8474 },
  NS20: { lat: 1.3204, lng: 103.8438 },
  NS21: { lat: 1.3127, lng: 103.8385 },
  NS22: { lat: 1.3044, lng: 103.8322 },
  NS23: { lat: 1.3006, lng: 103.8390 },
  NS24: { lat: 1.2993, lng: 103.8455 },
  NS25: { lat: 1.2931, lng: 103.8520 },
  NS26: { lat: 1.2840, lng: 103.8515 },
  NS27: { lat: 1.2762, lng: 103.8544 },
  NS28: { lat: 1.2713, lng: 103.8631 },

  // ===== East West Line =====
  EW1: { lat: 1.3732, lng: 103.9493 },
  EW2: { lat: 1.3546, lng: 103.9430 },
  EW3: { lat: 1.3432, lng: 103.9534 },
  EW4: { lat: 1.3274, lng: 103.9464 },
  EW5: { lat: 1.3240, lng: 103.9300 },
  EW6: { lat: 1.3210, lng: 103.9129 },
  EW7: { lat: 1.3197, lng: 103.9032 },
  EW8: { lat: 1.3177, lng: 103.8924 },
  EW9: { lat: 1.3164, lng: 103.8829 },
  EW10: { lat: 1.3115, lng: 103.8714 },
  EW11: { lat: 1.3072, lng: 103.8629 },
  EW12: { lat: 1.3008, lng: 103.8559 },
  EW13: { lat: 1.2931, lng: 103.8520 },
  EW14: { lat: 1.2840, lng: 103.8515 },
  EW15: { lat: 1.2765, lng: 103.8459 },
  EW16: { lat: 1.2802, lng: 103.8395 },
  EW17: { lat: 1.2862, lng: 103.8270 },
  EW18: { lat: 1.2896, lng: 103.8167 },
  EW19: { lat: 1.2945, lng: 103.8060 },
  EW20: { lat: 1.3025, lng: 103.7983 },
  EW21: { lat: 1.3066, lng: 103.7903 },
  EW22: { lat: 1.3113, lng: 103.7786 },
  EW23: { lat: 1.3151, lng: 103.7652 },
  EW24: { lat: 1.3330, lng: 103.7422 },
  EW25: { lat: 1.3424, lng: 103.7325 },
  EW26: { lat: 1.3442, lng: 103.7209 },
  EW27: { lat: 1.3387, lng: 103.7059 },
  EW28: { lat: 1.3375, lng: 103.6973 },
  EW29: { lat: 1.3278, lng: 103.6783 },
  EW30: { lat: 1.3194, lng: 103.6606 },
  EW31: { lat: 1.3210, lng: 103.6491 },
  EW32: { lat: 1.3300, lng: 103.6396 },
  EW33: { lat: 1.3404, lng: 103.6368 },
  CG1: { lat: 1.3354, lng: 103.9614 },
  CG2: { lat: 1.3573, lng: 103.9886 },

  // ===== North East Line =====
  NE1: { lat: 1.2653, lng: 103.8210 },
  NE3: { lat: 1.2802, lng: 103.8395 },
  NE4: { lat: 1.2847, lng: 103.8443 },
  NE5: { lat: 1.2886, lng: 103.8467 },
  NE6: { lat: 1.2993, lng: 103.8455 },
  NE7: { lat: 1.3066, lng: 103.8492 },
  NE8: { lat: 1.3124, lng: 103.8543 },
  NE9: { lat: 1.3197, lng: 103.8617 },
  NE10: { lat: 1.3313, lng: 103.8689 },
  NE11: { lat: 1.3392, lng: 103.8709 },
  NE12: { lat: 1.3499, lng: 103.8731 },
  NE13: { lat: 1.3601, lng: 103.8850 },
  NE14: { lat: 1.3713, lng: 103.8924 },
  NE15: { lat: 1.3829, lng: 103.8930 },
  NE16: { lat: 1.3916, lng: 103.8954 },
  NE17: { lat: 1.4053, lng: 103.9023 },
  NE18: { lat: 1.4147, lng: 103.9108 },

  // ===== Circle Line =====
  CC1: { lat: 1.2993, lng: 103.8455 },
  CC2: { lat: 1.2966, lng: 103.8505 },
  CC3: { lat: 1.2934, lng: 103.8553 },
  CC4: { lat: 1.2933, lng: 103.8610 },
  CC5: { lat: 1.2998, lng: 103.8636 },
  CC6: { lat: 1.3028, lng: 103.8754 },
  CC7: { lat: 1.3063, lng: 103.8825 },
  CC8: { lat: 1.3083, lng: 103.8886 },
  CC9: { lat: 1.3177, lng: 103.8924 },
  CC10: { lat: 1.3266, lng: 103.8901 },
  CC11: { lat: 1.3358, lng: 103.8880 },
  CC12: { lat: 1.3424, lng: 103.8800 },
  CC13: { lat: 1.3499, lng: 103.8731 },
  CC14: { lat: 1.3517, lng: 103.8642 },
  CC15: { lat: 1.3509, lng: 103.8485 },
  CC16: { lat: 1.3489, lng: 103.8395 },
  CC17: { lat: 1.3376, lng: 103.8395 },
  CC19: { lat: 1.3222, lng: 103.8154 },
  CC20: { lat: 1.3174, lng: 103.8077 },
  CC21: { lat: 1.3112, lng: 103.7961 },
  CC22: { lat: 1.3066, lng: 103.7903 },
  CC23: { lat: 1.2996, lng: 103.7873 },
  CC24: { lat: 1.2935, lng: 103.7845 },
  CC25: { lat: 1.2823, lng: 103.7820 },
  CC26: { lat: 1.2762, lng: 103.7917 },
  CC27: { lat: 1.2723, lng: 103.8027 },
  CC28: { lat: 1.2707, lng: 103.8097 },
  CC29: { lat: 1.2653, lng: 103.8210 },
  CC30: { lat: 1.2706, lng: 103.8328 },
  CC31: { lat: 1.2742, lng: 103.8418 },
  CC32: { lat: 1.2745, lng: 103.8479 },
  CC33: { lat: 1.2762, lng: 103.8544 }, // Marina Bay (formerly CE2)
  CC34: { lat: 1.2818, lng: 103.8590 }, // Bayfront (formerly CE1)

  // ===== Downtown Line =====
  DT1: { lat: 1.3784, lng: 103.7625 },
  DT2: { lat: 1.3694, lng: 103.7645 },
  DT3: { lat: 1.3623, lng: 103.7674 },
  DT4: { lat: 1.3537, lng: 103.7691 },
  DT5: { lat: 1.3412, lng: 103.7758 },
  DT6: { lat: 1.3355, lng: 103.7838 },
  DT7: { lat: 1.3308, lng: 103.7972 },
  DT8: { lat: 1.3258, lng: 103.8074 },
  DT9: { lat: 1.3222, lng: 103.8154 },
  DT10: { lat: 1.3199, lng: 103.8260 },
  DT11: { lat: 1.3127, lng: 103.8385 },
  DT12: { lat: 1.3066, lng: 103.8492 },
  DT13: { lat: 1.3038, lng: 103.8525 },
  DT14: { lat: 1.3008, lng: 103.8559 },
  DT15: { lat: 1.2933, lng: 103.8610 },
  DT16: { lat: 1.2818, lng: 103.8590 },
  DT17: { lat: 1.2795, lng: 103.8527 },
  DT18: { lat: 1.2823, lng: 103.8485 },
  DT19: { lat: 1.2847, lng: 103.8443 },
  DT20: { lat: 1.2925, lng: 103.8444 },
  DT21: { lat: 1.2985, lng: 103.8500 },
  DT22: { lat: 1.3055, lng: 103.8554 },
  DT23: { lat: 1.3134, lng: 103.8629 },
  DT24: { lat: 1.3213, lng: 103.8713 },
  DT25: { lat: 1.3270, lng: 103.8830 },
  DT26: { lat: 1.3266, lng: 103.8901 },
  DT27: { lat: 1.3300, lng: 103.8990 },
  DT28: { lat: 1.3349, lng: 103.9089 },
  DT29: { lat: 1.3349, lng: 103.9180 },
  DT30: { lat: 1.3367, lng: 103.9325 },
  DT31: { lat: 1.3455, lng: 103.9384 },
  DT32: { lat: 1.3546, lng: 103.9430 },
  DT33: { lat: 1.3563, lng: 103.9546 },
  DT34: { lat: 1.3416, lng: 103.9614 },
  DT35: { lat: 1.3354, lng: 103.9614 },
  DT36: { lat: 1.3290, lng: 103.9650 },
  DT37: { lat: 1.3205, lng: 103.9645 },

  // ===== Thomson-East Coast Line =====
  TE1: { lat: 1.4480, lng: 103.7855 },
  TE2: { lat: 1.4370, lng: 103.7865 },
  TE3: { lat: 1.4275, lng: 103.7935 },
  TE4: { lat: 1.3978, lng: 103.8182 },
  TE5: { lat: 1.3847, lng: 103.8364 },
  TE6: { lat: 1.3717, lng: 103.8366 },
  TE7: { lat: 1.3631, lng: 103.8332 },
  TE8: { lat: 1.3543, lng: 103.8328 },
  TE9: { lat: 1.3376, lng: 103.8395 },
  TE11: { lat: 1.3199, lng: 103.8260 },
  TE12: { lat: 1.3068, lng: 103.8190 },
  TE13: { lat: 1.3022, lng: 103.8253 },
  TE14: { lat: 1.3044, lng: 103.8322 },
  TE15: { lat: 1.2935, lng: 103.8328 },
  TE16: { lat: 1.2884, lng: 103.8337 },
  TE17: { lat: 1.2802, lng: 103.8395 },
  TE18: { lat: 1.2806, lng: 103.8442 },
  TE19: { lat: 1.2778, lng: 103.8508 },
  TE21: { lat: 1.2700, lng: 103.8630 },
  TE22: { lat: 1.2789, lng: 103.8682 },
  TE23: { lat: 1.2937, lng: 103.8730 },
  TE24: { lat: 1.2978, lng: 103.8852 },
  TE25: { lat: 1.2992, lng: 103.8987 },
  TE26: { lat: 1.3026, lng: 103.9051 },
  TE27: { lat: 1.3063, lng: 103.9152 },
  TE28: { lat: 1.3098, lng: 103.9296 },
  TE29: { lat: 1.3140, lng: 103.9437 },
  TE30: { lat: 1.3199, lng: 103.9510 },
  TE31: { lat: 1.3205, lng: 103.9645 },

  // ===== Bukit Panjang LRT =====
  BP1: { lat: 1.3854, lng: 103.7443 },
  BP2: { lat: 1.3803, lng: 103.7452 },
  BP3: { lat: 1.3786, lng: 103.7490 },
  BP4: { lat: 1.3766, lng: 103.7537 },
  BP5: { lat: 1.3786, lng: 103.7580 },
  BP6: { lat: 1.3784, lng: 103.7625 },
  BP7: { lat: 1.3778, lng: 103.7666 },
  BP8: { lat: 1.3761, lng: 103.7714 },
  BP9: { lat: 1.3800, lng: 103.7726 },
  BP10: { lat: 1.3845, lng: 103.7707 },
  BP11: { lat: 1.3878, lng: 103.7697 },
  BP12: { lat: 1.3867, lng: 103.7645 },
  BP13: { lat: 1.3826, lng: 103.7623 },

  // ===== Sengkang LRT =====
  STC: { lat: 1.3916, lng: 103.8954 },
  SE1: { lat: 1.3945, lng: 103.9004 },
  SE2: { lat: 1.3911, lng: 103.9059 },
  SE3: { lat: 1.3879, lng: 103.9054 },
  SE4: { lat: 1.3839, lng: 103.9022 },
  SE5: { lat: 1.3839, lng: 103.8973 },
  SW1: { lat: 1.3963, lng: 103.8938 },
  SW2: { lat: 1.3972, lng: 103.8892 },
  SW3: { lat: 1.3982, lng: 103.8812 },
  SW4: { lat: 1.3974, lng: 103.8755 },
  SW5: { lat: 1.3920, lng: 103.8763 },
  SW6: { lat: 1.3922, lng: 103.8800 },
  SW7: { lat: 1.3893, lng: 103.8857 },
  SW8: { lat: 1.3866, lng: 103.8903 },

  // ===== Punggol LRT =====
  PTC: { lat: 1.4053, lng: 103.9023 },
  PE1: { lat: 1.3994, lng: 103.9058 },
  PE2: { lat: 1.3969, lng: 103.9088 },
  PE3: { lat: 1.3939, lng: 103.9126 },
  PE4: { lat: 1.3944, lng: 103.9161 },
  PE5: { lat: 1.3996, lng: 103.9165 },
  PE6: { lat: 1.4022, lng: 103.9127 },
  PE7: { lat: 1.4053, lng: 103.9085 },
  PW1: { lat: 1.4098, lng: 103.9049 },
  PW2: { lat: 1.4127, lng: 103.9064 },
  PW3: { lat: 1.4168, lng: 103.9066 },
  PW4: { lat: 1.4159, lng: 103.9022 },
  PW5: { lat: 1.4118, lng: 103.9003 },
  PW6: { lat: 1.4085, lng: 103.8985 },
  PW7: { lat: 1.4053, lng: 103.8973 },
};

const LINE_TYPE: Record<string, 'mrt' | 'lrt'> = {};
for (const l of LINES) LINE_TYPE[l.id] = l.type;

export interface NearbyStation {
  station: Station;
  distanceKm: number;
}

export function getNearestStations(
  lat: number,
  lng: number,
  type: 'mrt' | 'lrt',
  limit = 10
): NearbyStation[] {
  const results: NearbyStation[] = [];
  for (const station of STATIONS) {
    if (station.underConstruction) continue;
    if (LINE_TYPE[station.line] !== type) continue;
    const coords = STATION_COORDS[station.code];
    if (!coords) continue;
    results.push({ station, distanceKm: distanceKm(lat, lng, coords.lat, coords.lng) });
  }
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  // Interchanges appear once per line code at the same spot — keep only
  // the nearest code per station name so the list isn't full of duplicates
  const seen = new Set<string>();
  const deduped: NearbyStation[] = [];
  for (const r of results) {
    if (seen.has(r.station.name)) continue;
    seen.add(r.station.name);
    deduped.push(r);
    if (deduped.length >= limit) break;
  }
  return deduped;
}
