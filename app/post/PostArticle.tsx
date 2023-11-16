"use client";

import { useRouter } from "next/navigation";
import { Event, getEventHash, getSignature } from "nostr-tools";

import { createUniqueUrl } from "@/lib/utils";
import useLoginStore from "@/stores/loginStore";
import usePostStore from "@/stores/postStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import useStore from "@/stores/useStore";

import PostTags from "./PostTags";
import PostTextArea from "./PostTextArea";
import SelectedTags from "./SelectedTags";
import validator from "validator";

export default function PostLink() {
  const loginStore = useStore(useLoginStore, (state) => state);
  const postStore = useStore(usePostStore, (state) => state);

  const router = useRouter();

  const { writeRelays } = useRelayStateStore();
  const { publishPool } = useRelayStore();

  const handleTitleChange = async (e: any) => {
    postStore?.setPostLinkTitle(e.target.value);
  };

  const validateBeforePublish = () => {
    if (postStore?.postLinkTitle === "") {
      alert("title cannot be empty");
      return false;
    }

    if (postStore?.postLinkTags.length === 0) {
      alert("choose at least one tag");
      return false;
    }

    return true;
  };

  const handlePublish = async (e: any) => {
    e.preventDefault();
    if (!validateBeforePublish()) {
      return;
    }

    const publicKey = loginStore?.userKeyPair.publicKey || "";
    const secretKey = loginStore?.userKeyPair.secretKey || "";

    const newsEventTags = [["title", postStore?.postLinkTitle]];

    postStore?.postLinkTags.forEach((tag) => {
      newsEventTags.push(["t", tag]);
    });

    let newsEvent: Event = {
      id: "",
      sig: "",
      kind: 1070,
      created_at: Math.floor(Date.now() / 1000),
      tags: newsEventTags as [string, string][],
      content: "",
      pubkey: publicKey,
    };

    newsEvent.id = getEventHash(newsEvent);
    if (secretKey) {
      newsEvent.sig = getSignature(newsEvent, secretKey);
    } else {
      newsEvent = await window.nostr.signEvent(newsEvent);
    }

    function isValidUrl(url: string): boolean {
      if (url === "") {
        return true;
      }

      return validator.isURL(url);
    }

    const handleImageChange = async (e: any) => {
      postStore?.setPostLinkUrl(e.target.value);
      if (!isValidUrl(e.target.value)) {
        postStore?.setErrorUrl("invalid url");
      } else {
        postStore?.setErrorUrl("");
      }
    };

    let commentEvent: Event | null = null;

    if (postStore?.postLinkText && postStore?.postLinkText !== "") {
      commentEvent = {
        id: "",
        sig: "",
        kind: 30700,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          [
            "d",
            createUniqueUrl(
              `${publicKey}${newsEvent.id}${newsEvent.created_at}`,
            ),
          ],
          ["e", newsEvent.id],
        ],
        content: postStore?.postLinkText,
        pubkey: publicKey,
      };
      commentEvent.id = getEventHash(commentEvent);
      if (secretKey) {
        commentEvent.sig = getSignature(commentEvent, secretKey);
      } else {
        commentEvent = await window.nostr.signEvent(commentEvent);
      }
    }

    const onCommentEventSeen = (event: Event) => {
      // TODO: cache event
      console.log("comment event", event);
      postStore?.clearPostLink();
      // TODO: router push to recent
      router.push("/");
    };

    const onNewsEventSeen = (event: Event) => {
      // TODO: cache event
      console.log("news event", event);
      if (commentEvent) {
        publishPool(writeRelays, commentEvent, onCommentEventSeen);
      } else {
        console.log("post published");
        postStore?.clearPostLink();
        // TODO: router push to recent
        router.push("/");
      }
    };

    publishPool(writeRelays, newsEvent, onNewsEventSeen);
  };

  return (
    <div className="flex flex-col justify-start space-y-6">
      <div className="max-w-lg">
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          title
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="title"
            id="title"
            onChange={handleTitleChange}
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            aria-describedby="title"
          />
        </div>
        {postStore?.postLinkTitle ? (
          <div>
            {80 - postStore?.postLinkTitle.length >= 0 ||
            postStore?.postLinkTitle.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {80 - postStore?.postLinkTitle.length} characters remaining
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                maximum title length exceeded by
                {postStore?.postLinkTitle.length &&
                  postStore?.postLinkTitle.length - 80}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            80 characters remaining
          </p>
        )}
      </div>

      <div className="max-w-lg">
        <label
          htmlFor="image"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          image
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="image"
            id="image"
            onChange={handleTitleChange}
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            aria-describedby="image url"
          />
        </div>
      </div>

      {postStore && (
        <div className="max-w-lg pt-4">
          <PostTextArea
            text={postStore.postLinkText}
            setText={postStore.setPostLinkText}
            titleWarning={true}
          />
        </div>
      )}

      <div className="max-w-lg">
        <label
          htmlFor="summary"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          summary
        </label>
        <div className="mt-2">
          <textarea
            name="summary"
            id="summary"
            onChange={handleTitleChange}
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            aria-describedby="summary"
          />
        </div>
        {postStore?.postLinkTitle ? (
          <div>
            {80 - postStore?.postLinkTitle.length >= 0 ||
            postStore?.postLinkTitle.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {80 - postStore?.postLinkTitle.length} characters remaining
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                maximum title length exceeded by
                {postStore?.postLinkTitle.length &&
                  postStore?.postLinkTitle.length - 80}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            80 characters remaining
          </p>
        )}
      </div>

      <div className="max-w-lg">
        <label
          htmlFor="tags"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          tags
        </label>
        {postStore?.postLinkTags && (
          <PostTags
            tags={postStore?.postLinkTags}
            setTags={postStore?.setPostLinkTags}
          />
        )}
      </div>

      <div className="mt-4 flex gap-x-4">
        <span className="my-2 flex items-center gap-x-2 rounded-lg text-sm font-medium dark:text-gray-300">
          Selected:
        </span>
        {postStore?.postLinkTags && (
          <SelectedTags
            tags={postStore?.postLinkTags}
            setTags={postStore?.setPostLinkTags}
          />
        )}
      </div>

      <button
        className="flex max-w-[4rem] items-center justify-center gap-x-2 rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500"
        onClick={handlePublish}
      >
        post
      </button>
    </div>
  );
}
