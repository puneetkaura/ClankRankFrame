// client/src/components/ShareButton.js
import React from "react";
import { FaShareAlt } from "react-icons/fa";
import "../index.css"; // Import the CSS file



const ShareButton = () => {
    const baseText = "I AM 👑 CLANKER MAXIMUS. A proud bearer of Clanker tokens, 🔥 forged in the fires of the Base Chain. How mighty is your clank? Unveil your power in the frame below 🔻";
    const additionalURL = window.location.href;
    const shareText = encodeURIComponent(baseText + "\n\n " + additionalURL);
    const shareURL = `https://warpcast.com/~/compose?text=${shareText}&embeds=`;


    return (
    <div className="share-button">
      <a href={shareURL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
        <FaShareAlt /> &nbsp;
        Share with frens!
      </a>
    </div>
  );
};

export default ShareButton;
