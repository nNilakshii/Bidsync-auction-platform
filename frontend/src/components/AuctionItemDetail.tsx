import type { AuctionItemDetail, PlaceBidPayload } from '../api/types';
import { BidForm } from './BidForm';
import { BidList } from './BidList';

interface AuctionItemDetailProps {
  item: AuctionItemDetail;
  isSocketReady: boolean;
  onSubmitBid: (payload: PlaceBidPayload) => Promise<void> | void;
}

export function AuctionItemDetail({ item, isSocketReady, onSubmitBid }: AuctionItemDetailProps) {
  return (
    <section className="item-detail">
      <header className="item-detail__header">
        <h2>{item.title}</h2>
        <p className="item-detail__price">Current price: ${item.currentPrice.toFixed(2)}</p>
        <p className="item-detail__description">{item.description}</p>
      </header>

      <div className="item-detail__content">
        <div className="item-detail__bids">
          <h3>Bid history</h3>
          <BidList bids={item.bids} />
        </div>
        <div className="item-detail__form">
          <h3>Place a bid</h3>
          <BidForm currentPrice={item.currentPrice} onSubmit={onSubmitBid} disabled={!isSocketReady} />
          {!isSocketReady ? <p className="item-detail__hint">Connecting to live updates…</p> : null}
        </div>
      </div>
    </section>
  );
}
