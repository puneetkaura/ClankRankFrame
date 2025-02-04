import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AddressInput from "@/components/AddressInput";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getTokenBalances } from "@/lib/web3";

export default function Home() {
  const [address, setAddress] = useState("");
  const { toast } = useToast();

  const { data: balances, isLoading, error, refetch } = useQuery({
    queryKey: ['balances', address],
    queryFn: () => getTokenBalances(address),
    enabled: false
  });

  const handleSubmit = async (addr: string) => {
    setAddress(addr);
    try {
      await refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch token balances",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Token Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyze EVM address token holdings and rankings
          </p>
        </div>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <AddressInput onSubmit={handleSubmit} isLoading={isLoading} />
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
