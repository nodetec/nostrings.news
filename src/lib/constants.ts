export const DEFAULT_RELAYS =
  process.env.NODE_ENV === "development"
    ? ["ws://localhost:10547"]
    : [
        "wss://relay.damus.io",
        //   "wss://nostr-pub.wellorder.net",
        //   "wss://relay.nostr.band"
      ];
