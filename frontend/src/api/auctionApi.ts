import { getJson } from './httpClient';
import type { AuctionItemDetail, AuctionItemSummary } from './types';

export function getAuctionItems(): Promise<AuctionItemSummary[]> {
  return getJson('/api/items');
}

export function getAuctionItem(itemId: number): Promise<AuctionItemDetail> {
  return getJson(`/api/items/${itemId}`);
}
