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

export function truncateAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 13) return address;
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}