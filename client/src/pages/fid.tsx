import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getClankerTokenInfoForAddress, fetchUserInfoByFid } from "@/lib/tokenService";
import { Users, UserCheck } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent text-center">
          ClankRank Dashboard
        </h1>

        {!isLoading && userInfo && (
          <Card className="border border-primary/10">
            <CardContent className="py-6 px-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img 
                  src={userInfo.pfp_url} 
                  alt={userInfo.username} 
                  className="w-16 h-16 rounded-full border-2 border-primary/10"
                />
                <div className="text-left">
                  <h2 className="font-semibold text-lg">{userInfo.display_name}</h2>
                  <p className="text-muted-foreground">@{userInfo.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center p-4 rounded-md bg-primary/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary/60" />
                    <span className="font-medium text-lg">{userInfo.follower_count}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-md bg-primary/5">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-primary/60" />
                    <span className="font-medium text-lg">{userInfo.following_count}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card className="border border-primary/10">
            <CardContent className="py-6 px-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 w-full max-w-md mx-auto">
                <Skeleton className="h-20 rounded-md" />
                <Skeleton className="h-20 rounded-md" />
              </div>
            </CardContent>
          </Card>
        )}

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