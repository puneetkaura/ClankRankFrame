import TokenCard from "./TokenCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { TokenBalance } from "@/lib/tokenService";

interface TokenListProps {
  balances: TokenBalance[];
  address: string;
  isLoading?: boolean;
}

export default function TokenList({ balances, address, isLoading }: TokenListProps) {
  const { toast } = useToast();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        description: "Address copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy address",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white/80">
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
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white/80">
              Token Holdings for
            </h3>
            <code className="px-2 py-1 rounded bg-white/10 text-xs">{address}</code>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={copyAddress}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
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