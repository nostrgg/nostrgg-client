import { NostrEvent, ReceiveEvent, ReceiveMsgType, SendEvent } from './types';

export * from './types';
export * from './crypto';

export type SendEventFunc = (event: SendEvent, url?: string) => void;

export type OnConnectFunc = (
  relayUrl: string,
  sendEvent: SendEventFunc
) => void;

export type OnEventFunc = (relayUrl: string, event: NostrEvent) => void;

interface RelayOptions {
  relayUrls: string[];
  onConnect?: OnConnectFunc;
  onError?: (relayUrl: string, err: Event) => void;
  onClose?: (relayUrl: string) => void;
  onEvent?: OnEventFunc;
  debug?: boolean;
}

const connections: Record<string, WebSocket> = {};

export type NostrClient = {
  sendEvent: SendEventFunc;
};

const subId = Math.random()
  .toString()
  .slice(2);

export const initNostr = ({
  relayUrls,
  onConnect,
  onEvent,
  onError,
  onClose,
  debug,
}: RelayOptions): NostrClient => {
  const log = (type: 'info' | 'error' | 'warn', ...args: unknown[]) => {
    if (!debug) return;
    console[type](...args);
  };

  const sendEvent = (event: SendEvent, relayUrl?: string) => {
    const urls = relayUrl ? [relayUrl] : Object.keys(connections);

    urls.forEach(relayUrl => {
      const ws = connections[relayUrl];

      if (!ws || ws.readyState !== 1) {
        log(
          'error',
          `❌ nostrgg: Couldn't send event! Websocket connection to ${relayUrl} is not open.`
        );
        return;
      }

      const [eventType, args] = event;

      const eventWithSubId = [eventType, subId, args];
      const eventToSend = eventType === 'EVENT' ? event : eventWithSubId;

      log('info', '⬆️ nostrgg: Sending event:', eventToSend);

      const msg = JSON.stringify(eventToSend);

      ws.send(msg);
    });
  };

  relayUrls.forEach(relayUrl => {
    const connection = connections[relayUrl];

    if (!connection) {
      connections[relayUrl] = new WebSocket(relayUrl);
      const ws = connections[relayUrl];

      if (!ws) return;

      ws.onopen = () => {
        log('info', `✅ nostrgg: Connected to ${relayUrl}`);
        onConnect?.(relayUrl, sendEvent);
      };

      ws.onerror = ev => {
        log('error', `❌ nostrgg: Error connecting to ${relayUrl}!`);
        onError?.(relayUrl, ev);
      };

      ws.onclose = () => {
        log('warn', `👋 nostrgg: Connection closed for ${relayUrl}`);
        onClose?.(relayUrl);
      };

      ws.onmessage = (msg: MessageEvent) => {
        const data = JSON.parse(msg.data) as ReceiveEvent;

        log('info', '⬇️ nostrgg: Received event:', data);

        if (data[0] === ReceiveMsgType.EVENT) {
          const event = data[2];
          onEvent?.(relayUrl, event);
        }
      };
    }
  });

  return {
    sendEvent,
  };
};
