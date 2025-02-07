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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ClankRank Dashboard
          </h1>

          {!isLoading && balances && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl mb-2">{emoji}</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Holding {tokenCount} token{tokenCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {userInfo && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <img src={userInfo.pfp_url} alt={userInfo.username} className="w-16 h-16 rounded-full border-2 border-primary/20" />
                <div className="text-left">
                  <h2 className="font-semibold text-xl">{userInfo.display_name}</h2>
                  <p className="text-muted-foreground">@{userInfo.username}</p>
                </div>
              </div>

              <div className="flex gap-8 items-center justify-center text-center">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-semibold">{userInfo.follower_count}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-semibold">{userInfo.following_count}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>

              {verifiedAddress && (
                <p className="text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
                  Verified ETH Address: {verifiedAddress}
                </p>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <TokenList balances={[]} address={verifiedAddress || ''} isLoading={true} />
        ) : balances && verifiedAddress ? (
          <TokenList balances={balances} address={verifiedAddress} isLoading={false} />
        ) : null}

        {error && (
          <Card className="border-destructive">
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