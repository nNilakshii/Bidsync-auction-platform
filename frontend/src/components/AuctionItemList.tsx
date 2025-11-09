import type { AuctionItemSummary } from '../api/types';
import { formatDistanceToNow } from '../utils/date';

interface AuctionItemListProps {
  items: AuctionItemSummary[];
  selectedItemId?: number;
  onSelect: (itemId: number) => void;
}

export function AuctionItemList({ items, selectedItemId, onSelect }: AuctionItemListProps) {
  if (items.length === 0) {
    return <p>No items available yet. Check back soon!</p>;
  }

  return (
    <ul className="item-list">
      {items.map(item => (
        <li key={item.id}>
          <button
            type="button"
            className={`item-card ${selectedItemId === item.id ? 'item-card--active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            {item.imageUrl ? (
              <div className="item-card__thumbnail-wrapper">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="item-card__thumbnail"
                  loading="lazy"
                />
              </div>
            ) : null}
            <span className="item-card__title">{item.title}</span>
            <span className="item-card__price">${item.currentPrice.toFixed(2)}</span>
            <span className="item-card__meta">Last bid {formatDistanceToNow(item.lastBidTime)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
