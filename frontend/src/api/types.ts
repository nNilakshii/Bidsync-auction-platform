export interface AuctionItemSummary {
  id: number;
  title: string;
  currentPrice: number;
  lastBidTime: string;
}

export interface BidView {
  id: number;
  itemId: number;
  amount: number;
  bidderDisplayName: string;
  createdAt: string;
}

export interface AuctionItemDetail {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  bids: BidView[];
}

export interface PlaceBidPayload {
  amount: number;
  bidderDisplayName: string;
}

export interface ApiError {
  message: string;
}
