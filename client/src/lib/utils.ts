import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClankerRank(tokenCount: number): { title: string; emoji: string } {
  if (tokenCount >= 3) {
    return { title: "Clanker Imperius", emoji: "👑" };
  } else if (tokenCount === 2) {
    return { title: "Clanker Maximus", emoji: "⚔️" };
  } else if (tokenCount === 1) {
    return { title: "Clanker Novis", emoji: "⚒️" };
  }
  return { title: "No Tokens", emoji: "🔍" };
}