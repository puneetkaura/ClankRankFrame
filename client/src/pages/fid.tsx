import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getClankerTokenInfoForAddress, fetchUserInfoByFid } from "@/lib/tokenService";
import { Users, UserCheck } from "lucide-react";
import { getClankerRank } from "@/lib/utils";

export default function FidPage() {
  const [, params] = useRoute("/fid/:fid");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fid = params?.fid ? parseInt(params.fid) : null;

  const { data: userInfo, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['userInfo', fid],
    queryFn: () => fetchUserInfoByFid(fid!),
    enabled: Boolean(fid),
  });

  const verifiedAddress = userInfo?.verified_addresses.eth_addresses[0];

  const { data: balances, isLoading: isLoadingBalances, error: balancesError } = useQuery({
    queryKey: ['balances', verifiedAddress],
    queryFn: () => getClankerTokenInfoForAddress(verifiedAddress!),
    enabled: Boolean(verifiedAddress),
  });

  const isLoading = isLoadingUser || isLoadingBalances;
  const error = userError || balancesError;
  const tokenCount = balances?.filter(token => parseFloat(token.balance) > 0).length || 0;
  const { title, emoji } = getClankerRank(tokenCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          Baseedge Clanker Rank
        </h1>

        {userInfo && (
          <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                {/* Clanker Rank Section */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl">{emoji}</div>
                  <h3 className="text-2xl font-bold text-white mt-1">{title}</h3>
                  <p className="text-sm text-white/80">
                    Holding {tokenCount} token{tokenCount !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-3">
                  <img 
                    src={userInfo.pfp_url} 
                    alt={userInfo.username} 
                    className="w-14 h-14 rounded-full border-2 border-white/20"
                  />
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-white">{userInfo.display_name}</h2>
                    <p className="text-sm text-white/80">@{userInfo.username}</p>
                  </div>
                </div>

                {/* Following/Followers */}
                <div className="flex gap-6 text-white/90 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <div>
                      <p className="font-medium">{userInfo.follower_count.toLocaleString()}</p>
                      <p className="text-white/70">Followers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <div>
                      <p className="font-medium">{userInfo.following_count.toLocaleString()}</p>
                      <p className="text-white/70">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-36 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Token List */}
        {isLoading ? (
          <TokenList balances={[]} address={verifiedAddress || ''} isLoading={true} />
        ) : balances && verifiedAddress ? (
          <TokenList balances={balances} address={verifiedAddress} isLoading={false} />
        ) : null}

        {error && (
          <Card className="border-destructive max-w-xl mx-auto">
            <CardContent className="p-4 text-center text-destructive">
              {userError 
                ? "Failed to fetch Farcaster user info. Please try again."
                : "Failed to fetch token balances. Please try again."
              }
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}