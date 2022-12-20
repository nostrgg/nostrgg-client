# @nostrgg/client

Nostr client written in TypeScript ✨

## Installation

```
npm install @nostrgg/client
```

## Example usage:

```typescript
initNostr({
  relayUrls: [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
  ],
  onConnect: (relayUrl: string) => {
    console.log("Nostr connected to:", relayUrl)
  },
  onEvent: (relayUrl, event) => {
    console.log("Nostr received event:", event)
  },
});
```

