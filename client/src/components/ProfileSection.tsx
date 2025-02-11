import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { truncateAddress } from "@/lib/utils";
import type { FarcasterUser } from "@/lib/tokenService";

interface ProfileSectionProps {
  userInfo: FarcasterUser;
  isLoading: boolean;
  verifiedAddress: string;
  rankTitle: string;
  rankEmoji: string;
  tokenCount: number;
}

export default function ProfileSection({
  userInfo,
  isLoading,
  verifiedAddress,
  rankTitle,
  rankEmoji,
  tokenCount,
}: ProfileSectionProps) {
  const { toast } = useToast();

  if (isLoading) {
    return (
      <>
        {/* New Header Section */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{rankEmoji}</span>
          <h3 className="text-2xl font-bold text-white">{rankTitle}</h3>
        </div>

        <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-4">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <Skeleton className="w-14 h-14 rounded-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* New Header Section */}
      <div className="flex items-center justify-center gap-2 mb-4 text-center">
        <span className="text-4xl">{rankEmoji}</span>
        <h3 className="text-4xl font-bold text-white">{rankTitle}</h3>
      </div>

      <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              {/* Left Column - Profile Photo */}
              <div className="flex flex-col gap-4">
                <img
                  src={userInfo.pfp_url}
                  alt={userInfo.username}
                  className="w-14 h-14 rounded-full border-2 border-white/20"
                />
              </div>

              {/* Right Column - User Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white">
                    {userInfo.display_name}{" "}
                    <span className="font-normal text-white/80">
                      (@{userInfo.username})
                    </span>
                  </h2>
                  <div className="flex gap-6 text-white/90 text-xs mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="font-medium">
                        {userInfo.follower_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span className="font-medium">
                        {userInfo.following_count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Address Section */}
                {verifiedAddress && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://basescan.org/address/${verifiedAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <code className="px-2 py-1 rounded bg-white/10 text-xs text-white/90 block truncate hover:bg-white/20 transition-colors">
                        {truncateAddress(verifiedAddress)}
                      </code>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white/80 hover:text-white"
                      onClick={() => {
                        navigator.clipboard.writeText(verifiedAddress);
                        toast({
                          description: "Address copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {/* Moved Token Count Display */}
                <p className="secondary-font text-xs text-white/80 mt-1">
                  {tokenCount > 0
                    ? `Holding ${tokenCount} clanker token${tokenCount !== 1 ? 's' : ''}`
                    : "No tokens yet"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
