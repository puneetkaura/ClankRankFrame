import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBalance } from "@/lib/formatters";
import { Star } from "lucide-react";
import type { TokenBalance } from "@/lib/tokenService";
import { getDexscreenerUrl } from "@/lib/formatters";

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
      href={getDexscreenerUrl(token.address)}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform hover:scale-[1.02] duration-200"
    >
      <Card className="bg-white/10 border-none backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
        <CardHeader className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            {token.img_url && (
              <img 
                src={token.img_url} 
                alt={token.name} 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            {highestRank && (
              <div 
                className="w-12 h-12 rounded-full bg-primary/20 flex flex-col items-center justify-center p-1"
                title={highestRank}
              >
                <Star className="w-4 h-4 text-primary-foreground" />
                <span className="text-[8px] font-medium text-primary-foreground leading-tight mt-0.5">
                  {highestRank.replace('Top ', '')}
                </span>
              </div>
            )}
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium text-white text-sm">{token.name}</p>
            <p className="text-white text-sm">{formatBalance(token.balance)}</p>
          </div>
        </CardHeader>
      </Card>
    </a>
  );
}