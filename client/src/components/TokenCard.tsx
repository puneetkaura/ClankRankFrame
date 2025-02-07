import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { formatBalance, getDexscreenerUrl } from "@/lib/formatters";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenCardProps {
  token: TokenBalance;
}

export default function TokenCard({ token }: TokenCardProps) {
  const rankBadges = [
    { rank: "Top 10", active: token.ranking.isTop10 },
    { rank: "Top 25", active: token.ranking.isTop25 },
    { rank: "Top 50", active: token.ranking.isTop50 },
    { rank: "Top 100", active: token.ranking.isTop100 },
    { rank: "Top 250", active: token.ranking.isTop250 },
    { rank: "Top 500", active: token.ranking.isTop500 },
    { rank: "Top 1000", active: token.ranking.isTop1000 },
  ];

  return (
    <Card className="group hover:border-primary/50 transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {token.img_url && (
            <img 
              src={token.img_url} 
              alt={token.name} 
              className="w-6 h-6 rounded-full"
            />
          )}
          <h3 className="text-lg font-semibold">{token.name}</h3>
        </div>
        <a
          href={getDexscreenerUrl(token.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold">
            {formatBalance(token.balance)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {rankBadges.map(({ rank, active }) => (
            <Badge
              key={rank}
              variant={active ? "default" : "outline"}
              className={active ? "bg-primary/80" : "opacity-50"}
            >
              {rank}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}