import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import FIDComponent from "@/components/FIDComponent";
import {
  getClankerTokenInfoForAddress,
  fetchUserInfoByFid,
} from "@/lib/tokenService";

import sdk, { type Context } from "@farcaster/frame-sdk";

export default function FidPage() {
  const [, params] = useRoute("/fid/:fid");
  const fid = params?.fid ? parseInt(params.fid) : null;

  // Add Frame SDK state
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);

  // Handle Frame SDK initialization
  useEffect(() => {
    const load = async () => {
      const ctx = await sdk.context;
      setContext(ctx);
      if (ctx) {
        console.log("Frame Context Available:", ctx);
      } else {
        console.log("Frame Context Not Available");
      }
      sdk.actions.ready();
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const {
    data: userInfo,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", fid],
    queryFn: () => fetchUserInfoByFid(fid!),
    enabled: Boolean(fid),
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
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          BaseEdge Clanker Rank
        </h1>

        <FIDComponent
          userInfo={userInfo || null}
          balances={balances || null}
          isLoading={isLoading}
          error={{
            userError: Boolean(userError),
            balancesError: Boolean(balancesError),
          }}
        />
      </div>
    </div>
  );
}