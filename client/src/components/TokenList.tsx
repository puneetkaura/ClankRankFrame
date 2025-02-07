import TokenCard from "./TokenCard";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenListProps {
  balances: TokenBalance[];
  address: string;
}

export default function TokenList({ balances, address }: TokenListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Token Holdings for {address.slice(0, 6)}...{address.slice(-4)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((token) => (
          <TokenCard key={token.address} token={token} />
        ))}
      </div>
    </div>
  );
}