import { useMutation } from "@tanstack/react-query";
import type { EventTemplate } from "nostr-tools";
import { DEFAULT_RELAYS } from "~/lib/constants";
import { finishEvent } from "~/lib/nostr/finishEvent";
import { parseUint8Array } from "~/lib/nostr/parseUint8Array";
// import { useAppState } from "~/store";

interface PostPayload {
  content: string;
  title: string;
  event?: string;
  url?: string;
  tags?: string[][];
  publicKey: string;
  secretKey?: string;
  writeRelays?: string[];
}

async function post(payload: PostPayload) {
  const tags: string[][] = [["title", payload.title]];

  if (payload.url) {
    tags.push(["url", payload.url]);
  }

  if (payload.event) {
    tags.push(["event", payload.event]);
  }

  if (payload.tags) {
    tags.push(...payload.tags);
  }

  const eventTemplate: EventTemplate = {
    kind: 1070,
    content: payload.content,
    tags: tags,
    created_at: Math.floor(Date.now() / 1000),
  };

  let relays: string[] = DEFAULT_RELAYS;

  if (payload.writeRelays) {
    relays = payload.writeRelays;
  }

  const secretKey = parseUint8Array(payload.secretKey);

  const event = await finishEvent(eventTemplate, secretKey);

  console.log(event);

  if (relays.length > 0 && event) {
    // await publish(event, relays);
    // const eventPointer: EventPointer = {
    //   id: event.id,
    //   relays: relays,
    //   author: event.pubkey,
    //   kind: event.kind,
    // };
    // const nevent = nip19.neventEncode(eventPointer);
    // redirectToSnippet(nevent);
    // useAppState.getState().setContent("");
    // useAppState.getState().setFilename("");
    // useAppState.getState().setDescription("");
    // useAppState.getState().setLang("typescript");
  }
}

export function usePostMutation() {
  return useMutation({
    mutationFn: post,
    onError: (error) => {
      console.error("Failed to post:", error);
    },
  });
}
