import React from "react";
import { FaShareAlt } from "react-icons/fa";

const ShareButton = () => {
  const baseText =
    "I AM 👑 CLANKER MAXIMUS. A proud bearer of Clanker tokens, 🔥 forged in the fires of the Base Chain. How mighty is your clank? Unveil your power in the frame below 🔻";
  const additionalURL = window.location.href;
  const shareText = encodeURIComponent(baseText + "\n\n " + additionalURL);
  const shareURL = `https://warpcast.com/~/compose?text=${shareText}&embeds=`;

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
