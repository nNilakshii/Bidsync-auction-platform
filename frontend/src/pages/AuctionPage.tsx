import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAuctionItem, getAuctionItems } from '../api/auctionApi';
import type { AuctionItemDetail, AuctionItemSummary, BidView, PlaceBidPayload } from '../api/types';
import { AuctionItemDetail as AuctionItemDetailSection } from '../components/AuctionItemDetail';
import { AuctionItemList } from '../components/AuctionItemList';
import { StatusBanner } from '../components/StatusBanner';
import { useBidSocket } from '../hooks/useBidSocket';

export function AuctionPage() {
  const [items, setItems] = useState<AuctionItemSummary[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>();
  const [detail, setDetail] = useState<AuctionItemDetail | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const data = await getAuctionItems();
        setItems(data);
        if (data.length > 0) {
          setSelectedItemId(prev => prev ?? data[0].id);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load auction items';
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    loadItems().catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedItemId) {
      setDetail(null);
      return;
    }

    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await getAuctionItem(selectedItemId);
        setDetail(data);
        setInfoMessage(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load item details';
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail().catch(console.error);
  }, [selectedItemId]);

  const handleBidReceived = useCallback((bid: BidView) => {
    setDetail(current => {
      if (!current || current.id !== bid.itemId) {
        return current;
      }
      setInfoMessage('Bid accepted!');
      return {
        ...current,
        currentPrice: bid.amount,
        bids: [bid, ...current.bids.filter(existing => existing.id !== bid.id)],
      };
    });
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === bid.itemId
          ? { ...item, currentPrice: bid.amount, lastBidTime: bid.createdAt }
          : item
      )
    );
  }, []);

  const handleSocketError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const { sendBid, isReady } = useBidSocket({
    itemId: selectedItemId,
    onBid: handleBidReceived,
    onError: handleSocketError,
  });

  const handleBidSubmit = useCallback(
    async (payload: PlaceBidPayload) => {
      try {
        sendBid(payload);
        setInfoMessage('Bid submitted! Waiting for confirmation…');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to submit bid';
        setErrorMessage(message);
        throw error instanceof Error ? error : new Error(message);
      }
    },
    [sendBid]
  );

  const selectedItem = useMemo(
    () => items.find(item => item.id === selectedItemId),
    [items, selectedItemId]
  );

  return (
    <div className="page">
      <header className="page__header">
        <h1>Bidsync Auction</h1>
        <p>Real-time auctions with instant bid updates.</p>
      </header>

      <main className="page__layout">
        <aside className="page__sidebar">
          <h2 className="sidebar__title">Items</h2>
          {isLoading && items.length === 0 ? <p>Loading items…</p> : null}
          <AuctionItemList
            items={items}
            selectedItemId={selectedItemId}
            onSelect={setSelectedItemId}
          />
        </aside>

        <section className="page__content">
          {detail && selectedItem ? (
            <AuctionItemDetailSection
              item={detail}
              isSocketReady={isReady}
              onSubmitBid={handleBidSubmit}
            />
          ) : (
            <p>Select an item to view details.</p>
          )}
        </section>
      </main>

      <footer className="page__footer">
        <small>Built with React, Spring Boot, and PostgreSQL.</small>
      </footer>

      {errorMessage ? (
        <StatusBanner status="error" message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      ) : null}
      {infoMessage ? (
        <StatusBanner status="info" message={infoMessage} onDismiss={() => setInfoMessage(null)} />
      ) : null}
    </div>
  );
}
