import { Card, CardContent } from "@/components/ui/card";
import type { FarcasterUser, TokenBalance } from "@/lib/tokenService";
import { getClankerRank } from "@/lib/utils";
import ProfileSection from "./ProfileSection";
import TokenSection from "./TokenSection";
import { useEffect } from "react";

const frame = {
  version: "next",
  // imageUrl: `${import.meta.env.VITE_APP_URL}/opengraph-image`,
  imageUrl: `https://picsum.photos/200/300`,
  button: {
    title: "Launch Clank Rank",
    action: {
      type: "launch_frame",
      name: "Clank Rank Demo",
      // url: import.meta.env.VITE_APP_URL,
      url: "https://clankrank-baseedge.replit.app/fid/4003",
      // splashImageUrl: `${import.meta.env.VITE_APP_URL}/splash.png`,
      splashImageUrl: `ttps://picsum.photos/seed/picsum/200/300`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

// Helper function to set metadata
const setMetadata = () => {
  // Update title
  document.title = "Farcaster Frames v2 Demo";

  // Update OpenGraph meta tags
  const metaTags = {
    // "og:title": "Farcaster Frames v2 Demo",
    // "og:description": "A Farcaster Frames v2 demo app.",
    // "fc:frame": JSON.stringify(frame),
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    let metaTag = document.querySelector(`meta[name="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", name);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", content);
  });
};

interface FIDComponentProps {
  userInfo: FarcasterUser | null;
  balances: TokenBalance[] | null;
  isLoading: boolean;
  error?: { userError?: boolean; balancesError?: boolean };
}

export default function FIDComponent({
  userInfo,
  balances,
  isLoading,
  error,
}: FIDComponentProps) {
  const verifiedAddress = userInfo?.verified_addresses.eth_addresses[0] || "";
  const filteredBalances =
    balances?.filter((token) => parseFloat(token.balance) > 0).slice(0, 6) ||
    [];
  const tokenCount = filteredBalances.length;
  const { title, emoji } = getClankerRank(tokenCount);

  // Set metadata when component mounts
  useEffect(() => {
    setMetadata();
  }, []);

  if (error?.userError || error?.balancesError) {
    return (
      <Card className="border-destructive max-w-xl mx-auto">
        <CardContent className="p-4 text-center text-destructive">
          {error.userError
            ? "Failed to fetch Farcaster user info. Please try again."
            : "Failed to fetch token balances. Please try again."}
        </CardContent>
      </Card>
    );
  }

  return (
    // Grid container for desktop layout
    <div id="fid-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Profile Section - takes 5 columns on desktop */}
      <div className="lg:col-span-5 lg:h-full">
        {userInfo && (
          <ProfileSection
            userInfo={userInfo}
            isLoading={isLoading}
            verifiedAddress={verifiedAddress}
            rankTitle={title}
            rankEmoji={emoji}
            tokenCount={tokenCount}
          />
        )}
        
      </div>
      
      

      {/* Token Section - takes 7 columns on desktop */}
      <div className="lg:col-span-7 lg:h-full">
        <TokenSection
          balances={filteredBalances}
          isLoading={isLoading}
          address={verifiedAddress}
        />
      </div>
      
    </div>
  );
}
