**IMPORTANT: This library is not as useful anymore and will be deprecated. The features from this client have now almost all been integrated into [nostrl-tools](https://github.com/fiatjaf/nostr-tools) instead.<br><br> 
My efforts will now be focused on [nostr-react](https://github.com/t4t5/nostr-react), which uses `nostr-tools` under the hood!**

<p align="center">
<img width="623" alt="nostrgg-client" src="https://user-images.githubusercontent.com/2598660/208626983-e404bead-f53e-45e0-bbdf-5ee46d8368c9.png">
</p>
<p align="center">
Nostr client written in TypeScript ✨
</p>

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

