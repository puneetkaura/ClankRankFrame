import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import FIDComponent from "@/components/FIDComponent";
import {
  getClankerTokenInfoForAddress,
  fetchUserInfoByFid,
} from "@/lib/tokenService";

export default function FidPage() {
  const [, params] = useRoute("/fid/:fid");
  const fid = params?.fid ? parseInt(params.fid) : null;

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