import { TokenBalance } from "@/lib/tokenService";
import TokenList from "@/components/TokenList";
import { Card, CardContent } from "@/components/ui/card";

interface TokenSectionProps {
  balances: TokenBalance[];
  address: string;
  isLoading: boolean;
}

export function TokenSection({ balances, address, isLoading }: TokenSectionProps) {
  const filteredBalances = balances?.filter(token => parseFloat(token.balance) > 0).slice(0, 6) || [];

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card className="border-none bg-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-sm text-white/60 text-center animate-pulse">
              Getting Blockchain Data...
            </p>
          </CardContent>
        </Card>
      ) : null}
      <TokenList
        balances={isLoading ? [] : filteredBalances}
        address={address}
        isLoading={isLoading}
      />
    </div>
  );
}
