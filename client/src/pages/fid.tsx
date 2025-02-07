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

          {!isLoading && (
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
        </div>

        {userInfo && (
          <Card className="border border-primary/10 bg-background/50">
            <CardContent className="p-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={userInfo.pfp_url} 
                    alt={userInfo.username} 
                    className="w-14 h-14 rounded-full border border-primary/10"
                  />
                  <div className="text-left">
                    <h2 className="font-semibold text-lg">{userInfo.display_name}</h2>
                    <p className="text-muted-foreground text-sm">@{userInfo.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="flex flex-col items-center p-3 rounded bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary/60" />
                      <span className="font-medium">{userInfo.follower_count}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Followers</p>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded bg-primary/5">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary/60" />
                      <span className="font-medium">{userInfo.following_count}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Following</p>
                  </div>
                </div>

                {verifiedAddress && (
                  <p className="text-xs text-muted-foreground bg-primary/5 px-3 py-1.5 rounded">
                    {verifiedAddress.slice(0, 6)}...{verifiedAddress.slice(-4)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <Card className="border border-primary/10 bg-background/50">
            <CardContent className="p-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <Skeleton className="h-16 rounded" />
                  <Skeleton className="h-16 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

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