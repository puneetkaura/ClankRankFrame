import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import AddressInput from "@/components/AddressInput";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getClankerTokenInfoForAddress } from "@/lib/tokenService";

const DEFAULT_ADDRESS = "0x862687EafbA7a988148Ef563F830E8B66fdDFD8b";

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

  const { data: balances, isLoading, error } = useQuery({
    queryKey: ['balances', address],
    queryFn: () => getClankerTokenInfoForAddress(address),
    enabled: Boolean(address)
  });

  const handleSubmit = async (addr: string) => {
    setLocation(`/address/${addr}`);
  };

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
        </div>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <AddressInput onSubmit={handleSubmit} isLoading={isLoading} initialAddress={address} />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        ) : balances ? (
          <TokenList balances={balances} address={address} />
        ) : null}

        {error && (
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