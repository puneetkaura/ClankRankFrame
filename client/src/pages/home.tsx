import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import AddressInput from "@/components/AddressInput";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getClankerTokenInfoForAddress, fetchUserInfoByFid } from "@/lib/tokenService";
import { getClankerRank } from "@/lib/utils";

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
  const filteredBalances = balances
    ?.filter(token => parseFloat(token.balance) > 0)
    .slice(0, 6) || [];
  const tokenCount = filteredBalances.length;
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
        ) : filteredBalances.length > 0 ? (
          <TokenList balances={filteredBalances} address={address} isLoading={false} />
        ) : (
          <Card className="border-primary/20">
            <CardContent className="p-4 text-center text-muted-foreground">
              No tokens found for this address.
            </CardContent>
          </Card>
        )}

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