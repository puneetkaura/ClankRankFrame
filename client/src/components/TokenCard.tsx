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
      <Card className={`bg-white/10 border-none backdrop-blur-sm transition-colors duration-300 h-full ${highestRank ? 'border-4 border-red-500' : ''}`}>
        <CardHeader className="space-y-3 p-4 text-center">
          {/* Token Image */}
          {token.img_url && (
            <img
              src={token.img_url}
              alt={token.name}
              className="w-16 h-16 rounded-full mx-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          )}
          {/* Token Name */}
          <p className="font-bold text-white text-sm">{token.name}</p>
          {/* Token Balance and Highest Rank */}
          <div className="flex items-center justify-center space-x-2">
            {/* Highest Rank */}
            {highestRank && (
              <span className="secondary-font bg-teal-500 bg-opacity-80 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full">
                {highestRank}
              </span>
            )}
          </div>
        </CardHeader>
      </Card>
    </a>
  );
}