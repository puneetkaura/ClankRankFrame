import TokenCard from "./TokenCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenListProps {
  balances: TokenBalance[];
  address: string;
  isLoading?: boolean;
}

export default function TokenList({ balances, address, isLoading }: TokenListProps) {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner 
          size="lg"
          message="Connecting to blockchain networks..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Token Holdings for {address.slice(0, 6)}...{address.slice(-4)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {balances.map((token) => (
          <TokenCard key={token.address} token={token} />
        ))}
      </div>
    </div>
  );
}