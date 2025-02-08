import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { FidPageSkeleton } from "@/components/fid/FidPageSkeleton";
import { ProfileSection } from "@/components/fid/ProfileSection";
import { TokenSection } from "@/components/fid/TokenSection";
import {
  getClankerTokenInfoForAddress,
  fetchUserInfoByFid,
} from "@/lib/tokenService";
import { getClankerRank } from "@/lib/utils";

export default function FidPage() {
  const [, params] = useRoute("/fid/:fid");
  const [, setLocation] = useLocation();
  const fid = params?.fid ? parseInt(params.fid) : null;

  const {
    data: userInfo,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", fid],
    queryFn: () => fetchUserInfoByFid(fid!),
    enabled: Boolean(fid),
  });

  const verifiedAddress = userInfo?.verified_addresses.eth_addresses[0];

  const {
    data: balances,
    isLoading: isLoadingBalances,
    error: balancesError,
  } = useQuery({
    queryKey: ["balances", verifiedAddress],
    queryFn: () => getClankerTokenInfoForAddress(verifiedAddress!),
    enabled: Boolean(verifiedAddress),
  });

  const error = userError || balancesError;
  const isLoading = isLoadingUser || (verifiedAddress && isLoadingBalances);

  // Calculate rank info if data is available
  const filteredBalances = balances?.filter(token => parseFloat(token.balance) > 0).slice(0, 6) || [];
  const tokenCount = filteredBalances.length;
  const { title, emoji } = getClankerRank(tokenCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          BaseEdge Clanker Rank
        </h1>

        {error ? (
          <Card className="border-destructive max-w-xl mx-auto">
            <CardContent className="p-4 text-center text-destructive">
              {userError
                ? "Failed to fetch Farcaster user info. Please try again."
                : "Failed to fetch token balances. Please try again."}
            </CardContent>
          </Card>
        ) : isLoading ? (
          <FidPageSkeleton />
        ) : userInfo && balances ? (
          <div className="space-y-6">
            <ProfileSection
              userInfo={userInfo}
              verifiedAddress={verifiedAddress!}
              title={title}
              emoji={emoji}
              tokenCount={tokenCount}
              isLoading={isLoadingBalances}
            />
            <TokenSection
              balances={balances}
              address={verifiedAddress!}
              isLoading={isLoadingBalances}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}