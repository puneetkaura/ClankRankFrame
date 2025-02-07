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
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 w-full text-center">
                    <Skeleton className="h-4 w-16 mx-auto" />
                    <Skeleton className="h-5 w-12 mx-auto" />
                  </div>
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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {balances.map((token) => (
            <TokenCard key={token.address} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
}