import TokenCard from "./TokenCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenListProps {
  balances: TokenBalance[];
  address: string;
  isLoading?: boolean;
}

export default function TokenList({ balances, address, isLoading }: TokenListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Loading Token Holdings...
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex items-center justify-between w-full">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
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