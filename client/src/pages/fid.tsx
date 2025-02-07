import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getClankerTokenInfoForAddress, fetchUserInfoByFid } from "@/lib/tokenService";

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
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ClankRank Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyze Farcaster user's token holdings
          </p>
          {userInfo && (
            <div className="flex items-center justify-center gap-4">
              <img src={userInfo.pfp_url} alt={userInfo.username} className="w-12 h-12 rounded-full" />
              <div className="text-left">
                <h2 className="font-semibold">{userInfo.display_name}</h2>
                <p className="text-sm text-muted-foreground">@{userInfo.username}</p>
              </div>
            </div>
          )}
          {verifiedAddress && (
            <p>Verified ETH Address: {verifiedAddress}</p>
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