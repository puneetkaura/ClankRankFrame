import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  getClankerTokenInfoForAddress,
  fetchUserInfoByFid,
} from "@/lib/tokenService";
import { Users, UserCheck, Copy } from "lucide-react";
import { getClankerRank, truncateAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function FidPage() {
  const [, params] = useRoute("/fid/:fid");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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
  const filteredBalances =
    balances?.filter((token) => parseFloat(token.balance) > 0).slice(0, 6) || [];
  const tokenCount = filteredBalances.length;
  const { title, emoji } = getClankerRank(tokenCount);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex items-center gap-4 w-full">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <p className="text-sm text-white/60 animate-pulse">
                  Loading Farcaster Profile...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive max-w-xl mx-auto">
            <CardContent className="p-4 text-center text-destructive">
              {userError
                ? "Failed to fetch Farcaster user info. Please try again."
                : "Failed to fetch token balances. Please try again."
              }
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          BaseEdge Clanker Rank
        </h1>

        <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Profile Section with Rank */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                {/* Left Column - Rank Emoji and Profile Photo */}
                <div className="flex flex-col gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center relative overflow-hidden animate-glitter">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent glitter-effect"></div>
                    <span className="text-3xl">{emoji}</span>
                  </div>
                  <img
                    src={userInfo.pfp_url}
                    alt={userInfo.username}
                    className="w-14 h-14 rounded-full border-2 border-white/20"
                  />
                </div>

                {/* Right Column - Rank Title and User Info */}
                <div className="flex-1">
                  {/* Rank Title and Token Count */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    {!isLoadingBalances && (
                      <p className="text-sm text-white/80 mt-1">
                        {tokenCount > 0 ? (
                          `Holding ${tokenCount} token${tokenCount !== 1 ? 's' : ''}`
                        ) : (
                          "No tokens yet"
                        )}
                      </p>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {userInfo.display_name}{" "}
                      <span className="font-normal text-white/80">
                        (@{userInfo.username})
                      </span>
                    </h2>
                    <div className="flex gap-6 text-white/90 text-xs mt-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">
                          {userInfo.follower_count.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        <span className="font-medium">
                          {userInfo.following_count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Address Section */}
              {verifiedAddress && (
                <div className="flex items-center gap-2">
                  <a
                    href={`https://basescan.org/address/${verifiedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <code className="px-2 py-1 rounded bg-white/10 text-xs text-white/90 block truncate hover:bg-white/20 transition-colors">
                      {truncateAddress(verifiedAddress)}
                    </code>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white/80 hover:text-white"
                    onClick={() => {
                      navigator.clipboard.writeText(verifiedAddress);
                      toast({
                        description: "Address copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Token List Section */}
        {isLoadingBalances ? (
          <div className="space-y-4">
            <Card className="border-none bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <p className="text-sm text-white/60 text-center animate-pulse">
                  Getting Blockchain Data...
                </p>
              </CardContent>
            </Card>
            <TokenList balances={[]} address={verifiedAddress!} isLoading={true} />
          </div>
        ) : filteredBalances.length > 0 ? (
          <TokenList
            balances={filteredBalances}
            address={verifiedAddress!}
            isLoading={false}
          />
        ) : (
          <Card className="border-none bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No Tokens Found</h3>
              <p className="text-white/60">
                Looks like this wallet is as empty as a penguin's refrigerator!
                <br />
                Time to start collecting some tokens? 🎯
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}