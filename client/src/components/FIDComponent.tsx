import { Card, CardContent } from "@/components/ui/card";
import type { FarcasterUser, TokenBalance } from "@/lib/tokenService";
import { getClankerRank } from "@/lib/utils";
import ProfileSection from "./ProfileSection";
import TokenSection from "./TokenSection";

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
  const filteredBalances = balances
    ?.filter((token) => parseFloat(token.balance) > 0)
    .slice(0, 6) || [];
  const tokenCount = filteredBalances.length;
  const { title, emoji } = getClankerRank(tokenCount);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Profile Section - takes 5 columns on desktop */}
      <div className="lg:col-span-5">
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
      <div className="lg:col-span-7">
        <TokenSection
          balances={filteredBalances}
          isLoading={isLoading}
          address={verifiedAddress}
        />
      </div>
    </div>
  );
}