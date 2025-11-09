import { Client, type IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_BASE_URL } from '../config';

export function createBidSocket(onConnect: (client: Client) => void, onError: (error: string) => void): Client {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_BASE_URL),
    reconnectDelay: 5000,
    onConnect: () => onConnect(client),
  onStompError: (frame: IFrame) => {
      const message = frame?.headers?.message ?? 'WebSocket error';
      onError(message);
    },
    onWebSocketError: () => {
      onError('WebSocket connection failed');
    },
  });

  client.activate();
  return client;
}
