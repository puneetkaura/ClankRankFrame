import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBalance } from "@/lib/formatters";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenCardProps {
  token: TokenBalance;
}

export default function TokenCard({ token }: TokenCardProps) {
  const getHighestRank = () => {
    if (token.ranking.isTop10) return "Top 10";
    if (token.ranking.isTop25) return "Top 25";
    if (token.ranking.isTop50) return "Top 50";
    if (token.ranking.isTop100) return "Top 100";
    if (token.ranking.isTop250) return "Top 250";
    if (token.ranking.isTop500) return "Top 500";
    if (token.ranking.isTop1000) return "Top 1000";
    return null;
  };

  const highestRank = getHighestRank();

  return (
    <a 
      href={`https://dexscreener.com/base/${token.address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform hover:scale-[1.02] duration-200"
    >
      <Card className="bg-white/10 border-none backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
        <CardHeader className="space-y-2 p-4">
          <div className="flex items-center gap-2">
            {token.img_url && (
              <img 
                src={token.img_url} 
                alt={token.name} 
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-white">{token.name}</span>
              <span className="font-bold text-lg text-white">{formatBalance(token.balance)}</span>
            </div>
          </div>
          {highestRank && (
            <Badge variant="secondary" className="w-full justify-center bg-white/20 text-white border-none">
              {highestRank}
            </Badge>
          )}
        </CardHeader>
      </Card>
    </a>
  );
}