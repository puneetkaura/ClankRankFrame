import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import AddressInput from "@/components/AddressInput";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getClankerTokenInfoForAddress, fetchUserInfoByFid } from "@/lib/tokenService";

const DEFAULT_ADDRESS = "0x862687EafbA7a988148Ef563F830E8B66fdDFD8b";
const DEFAULT_FID = 4003;

export default function Home() {
  const [, params] = useRoute("/address/:address");
  const [, setLocation] = useLocation();
  const address = params?.address || DEFAULT_ADDRESS;
  const { toast } = useToast();

  useEffect(() => {
    if (!params?.address) {
      setLocation(`/address/${DEFAULT_ADDRESS}`);
    }
  }, [params?.address, setLocation]);

  const { data: balances, isLoading: isLoadingBalances, error: balancesError } = useQuery({
    queryKey: ['balances', address],
    queryFn: () => getClankerTokenInfoForAddress(address),
    enabled: Boolean(address)
  });

  const { data: userInfo, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userInfo', DEFAULT_FID],
    queryFn: () => fetchUserInfoByFid(DEFAULT_FID)
  });

  const handleSubmit = async (addr: string) => {
    setLocation(`/address/${addr}`);
  };

  const isLoading = isLoadingBalances || isLoadingUser;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ClankRank Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyze EVM address token holdings and rankings
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
        </div>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <AddressInput onSubmit={handleSubmit} isLoading={isLoading} initialAddress={address} />
          </CardContent>
        </Card>

        {isLoading ? (
          <TokenList balances={[]} address={address} isLoading={true} />
        ) : balances ? (
          <TokenList balances={balances} address={address} isLoading={false} />
        ) : null}

        {balancesError && (
          <Card className="border-destructive">
            <CardContent className="p-4 text-center text-destructive">
              Failed to fetch token balances. Please try again.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}