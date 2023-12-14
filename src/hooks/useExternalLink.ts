import { tag } from "~/lib/nostr";
import { type Event } from "nostr-tools";

const useExternalLink = (postEvent: Event) => {
  let href = "#";
  let label = "unknown";
  let color = "text-zinc-500/90 dark:text-zinc-400/90";
  const kind = tag("k", postEvent);
  const website = tag("w", postEvent);
  const url = tag("u", postEvent);

  if (url && website) {
    href = url;
    label = website;
    color = "text-blue-500/90 dark:text-blue-400/90";
  }

  if (kind === "30050") {
    href = `https://resolvr.io/b/${tag("n", postEvent)}`;
    label = "[bounty]";
    color = "text-orange-500/90 dark:text-orange-400/90";
  }

  return { href, label, color };
};

export default useExternalLink;
