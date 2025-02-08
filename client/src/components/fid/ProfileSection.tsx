import { FarcasterUser } from "@/lib/tokenService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { truncateAddress } from "@/lib/utils";

interface ProfileSectionProps {
  userInfo: FarcasterUser;
  verifiedAddress: string;
  title: string;
  emoji: string;
  tokenCount: number;
  isLoading: boolean;
}

export function ProfileSection({
  userInfo,
  verifiedAddress,
  title,
  emoji,
  tokenCount,
  isLoading
}: ProfileSectionProps) {
  const { toast } = useToast();

  return (
    <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            {/* Left Column - Rank Emoji and Profile Photo */}
            <div className="flex flex-col gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center relative overflow-hidden animate-glitter">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent glitter-effect"></div>
                <span className="text-3xl">{emoji}</span>
              </div>
              <img
                src={userInfo.pfp_url}
                alt={userInfo.username}
                className="w-14 h-14 rounded-full border-2 border-white/20"
              />
            </div>

            {/* Right Column - Rank Title and User Info */}
            <div className="flex-1">
              {/* Rank Title and Token Count */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                {isLoading ? (
                  <p className="text-sm text-white/80 mt-1 animate-pulse">
                    Loading tokens...
                  </p>
                ) : (
                  <p className="text-sm text-white/80 mt-1">
                    {tokenCount > 0
                      ? `Holding ${tokenCount} token${tokenCount !== 1 ? 's' : ''}`
                      : "No tokens yet"}
                  </p>
                )}
              </div>

              {/* User Info */}
              <div>
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
        </div>
      </CardContent>
    </Card>
  );
}
