import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ClankRank from "@/components/ClankRank";
import {
  getClankerTokenInfoForAddress,
  fetchUserInfoByFid,
} from "@/lib/tokenService";

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
          <div className="space-y-6">
            {/* Profile Section Loading Skeleton */}
            <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-4">
                      <Skeleton className="w-14 h-14 rounded-full" />
                      <Skeleton className="w-14 h-14 rounded-full" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Token List Loading Skeleton */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 w-full text-center">
                      <Skeleton className="h-4 w-16 mx-auto" />
                      <Skeleton className="h-5 w-12 mx-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : userInfo && balances ? (
          <ClankRank
            userInfo={userInfo}
            balances={balances}
            isLoading={false}
            verifiedAddress={verifiedAddress!}
          />
        ) : null}
      </div>
    </div>
  );
}