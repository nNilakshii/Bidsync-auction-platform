import type { BidView } from '../api/types';
import { formatDistanceToNow } from '../utils/date';

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
