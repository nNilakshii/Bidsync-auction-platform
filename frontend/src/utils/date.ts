const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const timeDivisions: Array<[number, Intl.RelativeTimeFormatUnit]> = [
  [60, 'second'],
  [60, 'minute'],
  [24, 'hour'],
  [7, 'day'],
  [4.34524, 'week'],
  [12, 'month'],
  [Number.POSITIVE_INFINITY, 'year'],
];

export function formatDistanceToNow(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  let duration = (date.getTime() - now.getTime()) / 1000;

  for (const [amount, unit] of timeDivisions) {
    if (Math.abs(duration) < amount) {
      return relativeFormatter.format(Math.round(duration), unit);
    }
    duration /= amount;
  }

  return relativeFormatter.format(Math.round(duration), 'years');
}
