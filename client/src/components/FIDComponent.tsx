import { Card, CardContent } from "@/components/ui/card";
import type { FarcasterUser, TokenBalance } from "@/lib/tokenService";
import { getClankerRank } from "@/lib/utils";
import ProfileSection from "./ProfileSection";
import TokenSection from "./TokenSection";
import { useEffect } from "react";

interface FIDComponentProps {
  userInfo: FarcasterUser | null;
  balances: TokenBalance[] | null;
  isLoading: boolean;
  isScreenshot?: boolean;
  error?: { userError?: boolean; balancesError?: boolean };
}

export default function FIDComponent({
  userInfo,
  balances,
  isLoading,
  isScreenshot,
  error,
}: FIDComponentProps) {
  const verifiedAddress = userInfo?.verified_addresses.eth_addresses[0] || "";
  const filteredBalances =
    balances?.filter((token) => parseFloat(token.balance) > 0).slice(0, 6) ||
    [];
  const tokenCount = filteredBalances.length;
  const { title, emoji } = getClankerRank(tokenCount);

  const rankText = filteredBalances.find(balance => 
    balance.ranking.isTop10 || 
    balance.ranking.isTop25 || 
    balance.ranking.isTop50 || 
    balance.ranking.isTop100 || 
    balance.ranking.isTop250 || 
    balance.ranking.isTop500 || 
    balance.ranking.isTop1000
  );

  const rankDisplay = rankText 
    ? `Top ${rankText.ranking.isTop10 ? "10" :
        rankText.ranking.isTop25 ? "25" :
        rankText.ranking.isTop50 ? "50" :
        rankText.ranking.isTop100 ? "100" :
        rankText.ranking.isTop250 ? "250" :
        rankText.ranking.isTop500 ? "500" :
        rankText.ranking.isTop1000 ? "1000" : ""} holder of ${rankText.name}`
    : "A rising star in making";

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
  // if screenshot is true, return a simpler template that will be used for generating the screenshot
  if (isScreenshot) {
    return (
      <div id="fid-container" className="aspect-[3/2] p-2">
        <div className="flex items-center m-1">
          <img src={userInfo?.pfp_url} alt="Profile" className="w-32 h-32 mr-4 rounded-full" />
          <div className="flex flex-col">
            <div className="flex items-center">
              <h1 className="text-6xl font-bold text-white">{userInfo?.display_name}</h1>
              <span className="text-6xl text-white">&nbsp;|&nbsp; </span>
              <span className="text-6xl font-semibold text-white">{emoji}&nbsp;{title}</span>
            </div>
            <div className="secondary-font text-2xl text-white m-1">
              <span className="font-bold">{userInfo?.following_count}</span> following
              &nbsp;<span className="font-bold">{userInfo?.follower_count}</span> followers
            </div>
          </div>
        </div>
        <div className="flex items-center mt-8 backdrop-blur-md bg-black/30 p-4">
          <h1 className="text-6xl secondary-font text-white">
            ⭐️&nbsp;<span>{rankDisplay}</span>
          </h1>
        </div>
        <div className="flex items-center mt-8">
          <h1 className="text-4xl text-white">
            HOLDING CLANKER TOKENS
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filteredBalances.map((token) => (
            <div key={token.name} className="flex flex-col items-center">
              <img src={token.img_url} alt={token.name} className="w-32 h-32 rounded-full" />
              <span className="text-white text-2xl mt-1">{token.name.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    // Grid container for desktop layout
    <div id="fid-container" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Section - takes full width on mobile, 1/3 width on desktop */}
      <div className="md:col-span-1">
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
      
      

      {/* Token Section - takes full width on mobile, 2/3 width on desktop */}
      <div className="md:col-span-2">
        <TokenSection
          balances={filteredBalances}
          isLoading={isLoading}
          address={verifiedAddress}
        />
      </div>
      
    </div>
  );
}
