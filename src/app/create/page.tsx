
import Posts from "~/components/posts/Posts";
import { type Event } from "nostr-tools";
import { fetchPostEvents } from "~/actions/nostr";

export default async function Home() {
  // const initialPosts: Event[] = await fetchPostEvents(undefined, 5);

  return (
    <main className="flex min-h-screen flex-col items-start py-2">
      {/* <Posts initialPosts={[]} /> */}
      test
    </main>
  );
}
