"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { UsersIcon } from "@heroicons/react/20/solid";
import { Link2Icon, SatelliteDishIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { DiscussionForm, LinkForm, NostrForm } from "~/features/post";
import { cn } from "~/lib/utils";

const tabs = [
  { name: "nostr", href: "#", icon: SatelliteDishIcon, current: false },
  { name: "link", href: "#", icon: Link2Icon, current: false },
  { name: "discussion", href: "#", icon: UsersIcon, current: false },
];

export default function PostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("type") || "nostr";

  // Update URL when tab changes
  const handleTabChange = (tab: "nostr" | "link" | "discussion") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={activeTab}
          onChange={(e) =>
            handleTabChange(e.target.value as "nostr" | "link" | "discussion")
          }
          aria-label="Select a tab"
          className="-outline-offset-1 focus:-outline-offset-2 col-start-1 row-start-1 w-full appearance-none rounded-md bg-muted py-2 pr-8 pl-3 text-base text-foreground outline-1 outline-border focus:outline-2 focus:outline-primary"
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-muted-foreground"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={`?type=${tab.name}`}
                aria-current={tab.name === activeTab ? "page" : undefined}
                className={cn(
                  tab.name === activeTab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground",
                  "group inline-flex items-center border-b-2 px-1 py-4 font-medium text-sm",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(tab.name as "nostr" | "link" | "discussion");
                }}
              >
                <tab.icon
                  aria-hidden="true"
                  className={cn(
                    tab.name === activeTab
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                    "-ml-0.5 mr-2 size-5",
                  )}
                />
                <span>{tab.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex max-w-md flex-col gap-4 py-8">
        {activeTab === "discussion" && <DiscussionForm />}
        {activeTab === "link" && <LinkForm />}
        {activeTab === "nostr" && <NostrForm />}
      </div>
    </div>
  );
}
