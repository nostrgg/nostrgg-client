# @nostrgg/client

Nostr client written in TypeScript ✨

## Installation

```
npm install @nostrgg/client
```

## Example usage:

```typescript
import {
  initNostr,
  SendMsgType,
  Kind,
} from "@nostrgg/client"

initNostr({
  relayUrls: [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
  ],
  onConnect: (relayUrl, sendEvent) => {
    console.log("Nostr connected to:", relayUrl)

    // Send a REQ event to start listening to events from that relayer:
    sendEvent([SendMsgType.REQ, {
      filter: {
        kinds: [Kind.TextNote],
        since: 0, // All events since the dawn of time
      },
    }], relayUrl)
  },
  onEvent: (relayUrl, event) => {
    console.log("Nostr received event:", event)
  },
  debug: true, // Enable logs
});
```

