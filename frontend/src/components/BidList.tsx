import type { BidView } from '../api/types';

function formatDistanceToNow(dateInput: string | number | Date): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];
  for (const [secondsPerUnit, unit] of intervals) {
    const count = Math.floor(seconds / secondsPerUnit);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

interface BidListProps {
  bids: BidView[];
}

export function BidList({ bids }: BidListProps) {
  if (bids.length === 0) {
    return <p>No bids yet. Be the first!</p>;
  }

  return (
    <div className="bid-list">
      {bids.map(bid => (
        <div key={bid.id} className="bid-list__item">
          <div className="bid-list__amount">${bid.amount.toFixed(2)}</div>
          <div className="bid-list__meta">
            <strong>{bid.bidderDisplayName}</strong>
            <span>{formatDistanceToNow(bid.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
