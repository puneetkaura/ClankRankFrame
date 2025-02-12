import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import FIDComponent from "@/components/FIDComponent";
import {
  getClankerTokenInfoForAddress,
  fetchUserInfoByFid,
} from "@/lib/tokenService";
import ButtonGroup from "@/components/ButtonGroup";
import sdk, { type Context } from "@farcaster/frame-sdk";
import ShareButton from "@/components/ShareButton";

const appUrl = "https://clankrank-baseedge.replit.app/fid/4003";
const frame = {
  version: "next",
  imageUrl: `https://picsum.photos/200/300`,
  button: {
    title: "Calculate Clank Rank",
    action: {
      type: "launch_frame",
      name: "Farcaster Frames v2 Demo",
      url: appUrl,
      splashImageUrl: `https://picsum.photos/seed/picsum/200/300`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export default function FidPage() {
  const [, params] = useRoute("/fid/:fid");
  const [, setLocation] = useLocation();
  const urlFid = params?.fid ? parseInt(params.fid) : null;

  // Add Frame SDK state
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [activeFid, setActiveFid] = useState<number | null>(null);

  // Handle Frame SDK initialization and FID selection
  useEffect(() => {
    const load = async () => {
      const ctx = await sdk.context;
      setContext(ctx);

      if (ctx) {
        console.log("Frame Context Available:", ctx);
        // If we have a FID in context.user, use that
        if (ctx.user?.fid) {
          console.log("Using FID from Frame context:", ctx.user.fid);
          setActiveFid(ctx.user.fid);
          // Update URL to match context FID if different
          if (urlFid !== ctx.user.fid) {
            setLocation(`/fid/${ctx.user.fid}`);
          }
        } else {
          console.log("No FID in Frame context, falling back to URL parameter");
          setActiveFid(urlFid);
        }
      } else {
        console.log("Frame Context Not Available, using URL parameter");
        setActiveFid(urlFid);
      }

      sdk.actions.ready();
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded, urlFid, setLocation]);

  const {
    data: userInfo,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", activeFid],
    queryFn: () => fetchUserInfoByFid(activeFid!),
    enabled: Boolean(activeFid),
  });

  const verifiedAddress = userInfo?.verified_addresses.eth_addresses[0];

  const {
    data: balances,
    isLoading: isLoadingBalances,
    error: balancesError,
  } = useQuery({
    queryKey: ["balances", verifiedAddress],
    queryFn: () => getClankerTokenInfoForAddress(verifiedAddress!),
    enabled: Boolean(verifiedAddress),
  });

  const isLoading = isLoadingUser || (verifiedAddress && isLoadingBalances);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
      <div className="max-w-7xl mx-auto lg:max-w-[60%] space-y-6">
        

        <FIDComponent
          className="fid-container"
          userInfo={userInfo || null}
          balances={balances || null}
          isLoading={isLoading}
          error={{
            userError: Boolean(userError),
            balancesError: Boolean(balancesError),
          }}
        />
      </div>
      {activeFid && (
        <div className="absolute bottom-4 right-4">

          <ButtonGroup fid={activeFid} />
          <div className="text-right text-gray-300 text-xs secondary-font">
            By Baseedge. Join waitlist for early access.
          </div>
        </div>
      )}
    </div>
  );
}