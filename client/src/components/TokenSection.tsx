import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TokenList from "./TokenList";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenSectionProps {
  balances: TokenBalance[];
  isLoading: boolean;
  address: string;
}

export default function TokenSection({ 
  balances, 
  isLoading, 
  address 
}: TokenSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-none bg-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-sm text-white/60 text-center animate-pulse">
              Getting Blockchain Data...
            </p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
    );
  }

  return <TokenList balances={balances} address={address} isLoading={false} />;
}
