"use client";

import React, { useCallback } from "react";
import { FaShareAlt } from "react-icons/fa";
import { getClankerRank } from "../lib/utils";
import { TokenBalance } from "@/lib/tokenService";
import FrameSDK from "@farcaster/frame-sdk";

interface ShareButtonProps {
  balances: TokenBalance[];
  sdk: typeof FrameSDK;
}

const ShareButton = ({ balances, sdk }: ShareButtonProps) => {
  const filteredBalances =
    balances?.filter((token) => parseFloat(token.balance) > 0).slice(0, 6) ||
    [];
  const tokenCount = filteredBalances.length;
  const { title, emoji } = getClankerRank(tokenCount);
  const baseText =
    "I AM " + emoji.toUpperCase() + " " + title.toUpperCase() + ". A proud bearer of Clanker tokens, 🔥 forged in the fires of the Base Chain. How mighty is your clank? Unveil your power in the frame below 🔻";
  const additionalURL = window.location.href;
  const shareText = encodeURIComponent(baseText + "\n\n " + additionalURL);
  const shareURL = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${additionalURL}`;

  const openUrl = useCallback(async (url: string) => {
    if (sdk && sdk.actions) {
      try {
        console.log("Opening URL:", url);
        await sdk.actions.openUrl(url);
      } catch (error) {
        console.error("Error opening URL:", error);
      }
    } else {
      console.error("SDK is not initialized or actions are not available.");
    }
  }, [sdk]);

  const handleShare = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("Sharing from share button...", shareURL);
    await openUrl(shareURL);
  }, [openUrl, shareURL]);

  return (
    <a
      href="#" 
      target="_blank"
      rel="noopener noreferrer"
      className="button share-button flex items-center gap-2 text-sm whitespace-nowrap"
      onClick={handleShare}
    >
      <FaShareAlt />
      Cast it
    </a>
  );
};

export default ShareButton;
