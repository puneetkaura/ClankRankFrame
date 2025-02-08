import { Card, CardHeader } from "@/components/ui/card";
import { formatBalance } from "@/lib/formatters";
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
      <Card className="bg-white/10 border-none backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 h-full">
        <CardHeader className="space-y-3 p-4">
          <div className="flex items-center justify-between min-h-[3.5rem]">
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
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center p-1 relative overflow-hidden animate-glitter">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent glitter-effect"></div>
              <span className="text-xs font-bold text-primary-foreground leading-tight">
                {highestRank || "Hold"}
              </span>
            </div>
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