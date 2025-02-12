import React from "react";
import { FaShareAlt } from "react-icons/fa";
import { getClankerRank } from "../lib/utils";
import { TokenBalance } from "@/lib/tokenService";

interface ShareButtonProps {
  balances: TokenBalance[];
}

const ShareButton = ({ balances }: ShareButtonProps) => {
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

  return (
    <a
      href={shareURL}
      target="_blank"
      rel="noopener noreferrer"
      className="button share-button flex items-center gap-2"
    >
      <FaShareAlt />
      Share with frens!
    </a>
  );
};

export default ShareButton;
