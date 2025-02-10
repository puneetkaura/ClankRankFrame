import { Metadata } from "next";
import { FIDComponent } from "@/components/FIDComponent";
import {
  getClankerTokenInfoForAddress,
  fetchUserInfoByFid,
} from "@/lib/tokenService";

type Props = {
  params: { fid: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const fid = parseInt(params.fid);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clankrank-baseedge.replit.app";

  // Fetch user data for dynamic metadata
  let userInfo = null;
  try {
    userInfo = await fetchUserInfoByFid(fid);
  } catch (error) {
    console.error("Error fetching user info for metadata:", error);
  }

  const title = userInfo ? `ClankRank - ${userInfo.display_name}` : `ClankRank - FID ${fid}`;
  const description = "View your Farcaster token holdings and Clank Rank";
  const image = `${appUrl}/api/og?fid=${fid}`;
  const postUrl = `${appUrl}/api/frame?fid=${fid}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': image,
      'fc:frame:post_url': postUrl,
      'fc:frame:button:1': "Calculate Clank Rank",
      'fc:frame:input:text': "Enter FID",
      'fc:frame:state': params.fid,
    },
  };
}

export default async function FidPage({ params }: Props) {
  const fid = parseInt(params.fid);

  try {
    const userInfo = await fetchUserInfoByFid(fid);
    const verifiedAddress = userInfo?.verified_addresses.eth_addresses[0];
    const balances = verifiedAddress ? 
      await getClankerTokenInfoForAddress(verifiedAddress) : 
      null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
        <div className="max-w-7xl mx-auto lg:max-w-[60%] space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            BaseEdge Clanker Rank
          </h1>

          <FIDComponent
            userInfo={userInfo}
            balances={balances}
            isLoading={false}
            error={{
              userError: !userInfo,
              balancesError: !balances && !!verifiedAddress,
            }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error loading profile</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }
}