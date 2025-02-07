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
        <CardHeader className="space-y-3 p-4">
          {highestRank && (
            <Badge 
              variant="secondary" 
              className="w-fit mx-auto px-2 py-0.5 bg-primary/20 text-primary-foreground border-none text-[10px] font-medium"
            >
              {highestRank}
            </Badge>
          )}
          <div className="flex flex-col items-center text-center gap-2">
            {token.img_url && (
              <img 
                src={token.img_url} 
                alt={token.name} 
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <div className="w-full">
              <p className="font-medium text-white text-sm">{token.name}</p>
              <p className="font-bold text-white text-lg">{formatBalance(token.balance)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </a>
  );
}