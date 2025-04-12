import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { botttsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatar(seed: string | undefined) {
  return createAvatar(botttsNeutral, {
    seed: seed ?? "",
  }).toDataUri();
}
