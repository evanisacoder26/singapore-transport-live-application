export interface Frequency {
  peakMin: number;
  offPeakMin: number;
  firstTrain: number;
  lastTrain: number;
}

export const LINE_FREQUENCY: Record<string, Frequency> = {
  NS: { peakMin: 3, offPeakMin: 5, firstTrain: 530, lastTrain: 2330 },
  EW: { peakMin: 3, offPeakMin: 5, firstTrain: 530, lastTrain: 2330 },
  NE: { peakMin: 3, offPeakMin: 5, firstTrain: 530, lastTrain: 2359 },
  CC: { peakMin: 4, offPeakMin: 6, firstTrain: 555, lastTrain: 2333 },
  DT: { peakMin: 3, offPeakMin: 5, firstTrain: 545, lastTrain: 2330 },
  TE: { peakMin: 4, offPeakMin: 6, firstTrain: 530, lastTrain: 2330 },
  BP: { peakMin: 5, offPeakMin: 7, firstTrain: 530, lastTrain: 2330 },
  SK: { peakMin: 5, offPeakMin: 7, firstTrain: 530, lastTrain: 2330 },
  PG: { peakMin: 5, offPeakMin: 7, firstTrain: 530, lastTrain: 2330 },
};

function isPeak(now: Date): boolean {
  const totalMin = now.getHours() * 60 + now.getMinutes();
  return (totalMin >= 450 && totalMin <= 570) || (totalMin >= 1020 && totalMin <= 1200);
}

function isOperating(line: string, now: Date): boolean {
  const freq = LINE_FREQUENCY[line];
  if (!freq) return false;
  const totalMin = now.getHours() * 60 + now.getMinutes();
  const firstMin = Math.floor(freq.firstTrain / 100) * 60 + (freq.firstTrain % 100);
  const lastMin = Math.floor(freq.lastTrain / 100) * 60 + (freq.lastTrain % 100);
  return totalMin >= firstMin && totalMin <= lastMin;
}

export function getHeadway(line: string): string {
  const freq = LINE_FREQUENCY[line];
  if (!freq) return 'N/A';
  const now = new Date();
  const h = isPeak(now) ? freq.peakMin : freq.offPeakMin;
  return `Every ~${h} min`;
}

export function getOperatingHours(line: string): string {
  const freq = LINE_FREQUENCY[line];
  if (!freq) return 'N/A';
  const fmt = (n: number) => {
    const h = Math.floor(n / 100).toString().padStart(2, '0');
    const m = (n % 100).toString().padStart(2, '0');
    return `${h}:${m}`;
  };
  return `${fmt(freq.firstTrain)} – ${fmt(freq.lastTrain)}`;
}

export function isLineOperating(line: string): boolean {
  return isOperating(line, new Date());
}
