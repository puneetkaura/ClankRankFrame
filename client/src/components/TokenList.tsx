import TokenCard from "./TokenCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenListProps {
  balances: TokenBalance[];
  address: string;
  isLoading?: boolean;
}

function getClankerRank(tokenCount: number): { title: string; emoji: string } {
  if (tokenCount >= 3) {
    return { title: "Clanker Imperius", emoji: "👑" };
  } else if (tokenCount === 2) {
    return { title: "Clanker Maximus", emoji: "⚔️" };
  } else if (tokenCount === 1) {
    return { title: "Clanker Novis", emoji: "⚒️" };
  }
  return { title: "No Tokens", emoji: "🔍" };
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

  const tokenCount = balances.filter(token => parseFloat(token.balance) > 0).length;
  const { title, emoji } = getClankerRank(tokenCount);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Holding {tokenCount} token{tokenCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            Token Holdings for {address.slice(0, 6)}...{address.slice(-4)}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {balances.map((token) => (
            <TokenCard key={token.address} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
}