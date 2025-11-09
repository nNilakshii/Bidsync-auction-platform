import { useCallback, useEffect, useRef, useState } from 'react';
import { createBidSocket } from '../api/socketClient';
import type { BidView, PlaceBidPayload } from '../api/types';
import type { Client, IMessage } from '@stomp/stompjs';

interface UseBidSocketArgs {
  itemId?: number;
  onBid: (bid: BidView) => void;
  onError: (message: string) => void;
}

interface UseBidSocketResult {
  sendBid: (payload: PlaceBidPayload) => void;
  isReady: boolean;
}

export function useBidSocket({ itemId, onBid, onError }: UseBidSocketArgs): UseBidSocketResult {
  const clientRef = useRef<Client | null>(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    if (!itemId) {
      return () => {};
    }

    const client = createBidSocket(
      activeClient => {
        const bidSubscription = activeClient.subscribe(`/topic/items/${itemId}/bids`, (message: IMessage) => {
          const payload = JSON.parse(message.body) as BidView;
          onBid(payload);
        });

        const errorSubscription = activeClient.subscribe('/queue/errors', (message: IMessage) => {
          const payload = JSON.parse(message.body) as { message: string };
          onError(payload.message ?? 'Bid rejected');
        });

        clientRef.current = activeClient;
        setReady(true);

        activeClient.onDisconnect = () => {
          bidSubscription.unsubscribe();
          errorSubscription.unsubscribe();
          setReady(false);
        };
      },
      error => {
        onError(error);
        setReady(false);
      }
    );

    return () => {
      setReady(false);
      clientRef.current = null;
      void client.deactivate();
    };
  }, [itemId, onBid, onError]);

  const sendBid = useCallback(
    (payload: PlaceBidPayload) => {
      if (!itemId) {
        throw new Error('Select an item before bidding');
      }
      if (!clientRef.current || !isReady) {
        throw new Error('Bid channel is not ready yet');
      }

      clientRef.current.publish({
        destination: `/app/items/${itemId}/bid`,
        body: JSON.stringify(payload),
      });
    },
    [isReady, itemId]
  );

  return { sendBid, isReady };
}
