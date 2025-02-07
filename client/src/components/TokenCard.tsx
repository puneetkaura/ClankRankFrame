import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBalance, getDexscreenerUrl } from "@/lib/formatters";
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
      href={getDexscreenerUrl(token.address)}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-all hover:scale-[1.02] duration-200"
    >
      <Card className="h-full hover:border-primary/50 transition-colors duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {token.img_url && (
              <img 
                src={token.img_url} 
                alt={token.name} 
                className="w-6 h-6 rounded-full"
              />
            )}
            <h3 className="font-semibold">{token.name}</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">
              {formatBalance(token.balance)}
            </p>
            {highestRank && (
              <Badge variant="default" className="bg-primary/80">
                {highestRank}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}