import { Web3 } from "web3";
import { Multicall } from "ethereum-multicall";

const ALCHEMY_RPC =
  "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";
const NEYNAR_API_KEY = "ED29465E-7549-469E-A427-A7F95FC28822";

export interface FarcasterUserProfile {
  bio?: {
    text: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: {
      city: string;
      state: string;
      country: string;
      country_code: string;
    };
  };
}

export interface FarcasterUser {
  object: string;
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  profile: FarcasterUserProfile;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
  verified_accounts: string[];
  power_badge: boolean;
  viewer_context: {
    following: boolean;
    followed_by: boolean;
    blocking: boolean;
    blocked_by: boolean;
  };
}

export interface FarcasterResponse {
  users: FarcasterUser[];
  next: {
    cursor: string | null;
  };
}

export interface TokenThreshold {
  name: string;
  decimals: number;
  img_url: string;
  amt_for_1000_top_holder: number;
  amt_for_500_top_holder: number;
  amt_for_250_top_holder: number;
  amt_for_100_top_holder: number;
  amt_for_50_top_holder: number;
  amt_for_25_top_holder: number;
  amt_for_10_top_holder: number;
}

export interface TokenBalance {
  address: string;
  name: string;
  balance: string;
  img_url?: string;
  ranking: {
    isTop1000: boolean;
    isTop500: boolean;
    isTop250: boolean;
    isTop100: boolean;
    isTop50: boolean;
    isTop25: boolean;
    isTop10: boolean;
  };
}

export const TOP_CLANKER_HOLDING_THRESHOLD: Record<string, TokenThreshold> = {
  "0x2f6c17fa9f9bC3600346ab4e48C0701e1d5962AE": {
    name: "Fartcoin",
    img_url: "https://token-media.defined.fi/8453_0x2f6c17fa9f9bc3600346ab4e48c0701e1d5962ae_1738610042_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 4880000,
    amt_for_500_top_holder: 20000000,
    amt_for_250_top_holder: 79508995,
    amt_for_100_top_holder: 210172569,
    amt_for_50_top_holder: 365025750,
    amt_for_25_top_holder: 649326066,
    amt_for_10_top_holder: 1018654744
  },
  "0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb": {
    name: "CLANKER",
    img_url: "https://token-media.defined.fi/8453_0x1bc0c42215582d5a085795f4badbac3ff36d1bcb_1738347350_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 56,
    amt_for_500_top_holder: 189,
    amt_for_250_top_holder: 515,
    amt_for_100_top_holder: 1465,
    amt_for_50_top_holder: 3757,
    amt_for_25_top_holder: 7533,
    amt_for_10_top_holder: 12500
  },
  "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b": {
    name: "BNKR",
    img_url: "https://token-media.defined.fi/8453_0x22af33fe49fd1fa80c7149773dde5890d3c76f3b_1738462454_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 5006000,
    amt_for_500_top_holder: 16490000,
    amt_for_250_top_holder: 64703807,
    amt_for_100_top_holder: 169534852,
    amt_for_50_top_holder: 300137271,
    amt_for_25_top_holder: 551891129,
    amt_for_10_top_holder: 1162681821
  }
} as const;

export async function fetchUserInfoByFid(
  fid: number,
): Promise<FarcasterUser | null> {
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=3`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": NEYNAR_API_KEY,
          "x-neynar-experimental": "false",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: FarcasterResponse = await response.json();
    return data.users[0] || null;
  } catch (error) {
    console.error("Failed to fetch Farcaster user info:", error);
    throw error;
  }
}

const web3 = new Web3(ALCHEMY_RPC);
const multicall = new Multicall({
  web3Instance: web3,
  tryAggregate: true,
  multicallCustomContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
});

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

export async function getClankerTokenInfoForAddress(
  address: string,
): Promise<TokenBalance[]> {
  if (!web3.utils.isAddress(address)) {
    throw new Error("Invalid address");
  }

  const tokenAddresses = Object.keys(TOP_CLANKER_HOLDING_THRESHOLD);

  try {
    const contractCallContext = tokenAddresses.map((tokenAddress) => ({
      reference: tokenAddress,
      contractAddress: tokenAddress,
      abi: ERC20_ABI,
      calls: [
        {
          reference: "balanceOf",
          methodName: "balanceOf",
          methodParameters: [address],
        },
      ],
    }));

    const { results } = await multicall.call(contractCallContext);

    return tokenAddresses.map((tokenAddress) => {
      const token = TOP_CLANKER_HOLDING_THRESHOLD[tokenAddress];
      const result = results[tokenAddress];
      const balance =
        result?.callsReturnContext[0]?.returnValues[0]?.hex || "0x0";
      const adjustedBalance = BigInt(balance) / BigInt(10 ** token.decimals);

      return {
        address: tokenAddress,
        name: token.name,
        img_url: token.img_url,
        balance: adjustedBalance.toString(),
        ranking: {
          isTop1000:
            adjustedBalance > BigInt(token.amt_for_1000_top_holder || 0),
          isTop500: adjustedBalance > BigInt(token.amt_for_500_top_holder || 0),
          isTop250: adjustedBalance > BigInt(token.amt_for_250_top_holder || 0),
          isTop100: adjustedBalance > BigInt(token.amt_for_100_top_holder || 0),
          isTop50: adjustedBalance > BigInt(token.amt_for_50_top_holder || 0),
          isTop25: adjustedBalance > BigInt(token.amt_for_25_top_holder || 0),
          isTop10: adjustedBalance > BigInt(token.amt_for_10_top_holder || 0),
        },
      };
    });
  } catch (error) {
    console.error("Multicall failed:", error);
    throw error;
  }
}