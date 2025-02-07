import { Web3 } from "web3";
import { Multicall } from "ethereum-multicall";

const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";
const NEYNAR_API_KEY = "ED29465E-7549-469E-A427-A7F95FC28822";
const web3 = new Web3(ALCHEMY_RPC);

// Convert addresses to checksum format
function toChecksumAddress(address: string): string {
  try {
    return web3.utils.toChecksumAddress(address);
  } catch (error) {
    console.error('Invalid address format:', address);
    return address;
  }
}

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
  amt_for_1000_top_holder?: number;
  amt_for_500_top_holder?: number;
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

const multicall = new Multicall({
  web3Instance: web3,
  tryAggregate: true,
  multicallCustomContractAddress: toChecksumAddress('0xcA11bde05977b3631167028862bE2a173976CA11')
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

  address = toChecksumAddress(address);
  const tokenAddresses = Object.keys(TOP_CLANKER_HOLDING_THRESHOLD).map(addr => toChecksumAddress(addr));

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

      // Debug logging for balance conversion
      console.log(`Token ${token.name} raw result:`, result?.callsReturnContext[0]?.returnValues);

      // Safe balance conversion
      let balanceStr = result?.callsReturnContext[0]?.returnValues[0]?.hex || "0x0";
      console.log(`Token ${token.name} hex balance:`, balanceStr);

      if (!balanceStr.startsWith('0x')) {
        balanceStr = '0x' + balanceStr;
      }

      try {
        // Additional logging for balance conversion process
        console.log(`Token ${token.name} formatted balance string:`, balanceStr);
        const balance = BigInt(balanceStr);
        console.log(`Token ${token.name} BigInt balance:`, balance.toString());

        const divisor = BigInt(10 ** token.decimals);
        console.log(`Token ${token.name} divisor:`, divisor.toString());

        const adjustedBalance = balance / divisor;
        console.log(`Token ${token.name} adjusted balance:`, adjustedBalance.toString());

        // Calculate rankings after the balance conversion
        return {
          address: tokenAddress,
          name: token.name,
          img_url: token.img_url,
          balance: adjustedBalance.toString(),
          ranking: {
            isTop1000: token.amt_for_1000_top_holder ? adjustedBalance >= BigInt(token.amt_for_1000_top_holder) : false,
            isTop500: token.amt_for_500_top_holder ? adjustedBalance >= BigInt(token.amt_for_500_top_holder) : false,
            isTop250: token.amt_for_250_top_holder ? adjustedBalance >= BigInt(token.amt_for_250_top_holder) : false,
            isTop100: token.amt_for_100_top_holder ? adjustedBalance >= BigInt(token.amt_for_100_top_holder) : false,
            isTop50: token.amt_for_50_top_holder ? adjustedBalance >= BigInt(token.amt_for_50_top_holder) : false,
            isTop25: token.amt_for_25_top_holder ? adjustedBalance >= BigInt(token.amt_for_25_top_holder) : false,
            isTop10: token.amt_for_10_top_holder ? adjustedBalance >= BigInt(token.amt_for_10_top_holder) : false,
          },
        };
      } catch (e) {
        console.error(`Failed to convert balance for token ${token.name}:`, e);
        console.error('Error details:', {
          tokenAddress,
          balanceStr,
          decimals: token.decimals,
          error: e.message
        });

        return {
          address: tokenAddress,
          name: token.name,
          img_url: token.img_url,
          balance: "0",
          ranking: {
            isTop1000: false,
            isTop500: false,
            isTop250: false,
            isTop100: false,
            isTop50: false,
            isTop25: false,
            isTop10: false,
          },
        };
      }
    });
  } catch (error) {
    console.error("Multicall failed:", error);
    throw error;
  }
}

// Token data with checksummed addresses
export const TOP_CLANKER_HOLDING_THRESHOLD: Record<string, TokenThreshold> = {
  [toChecksumAddress("0x2f6c17fa9f9bC3600346ab4e48C0701e1d5962AE")]: {
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
  [toChecksumAddress("0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb")]: {
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
  [toChecksumAddress("0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b")]: {
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
  },
  [toChecksumAddress("0x20DD04c17AFD5c9a8b3f2cdacaa8Ee7907385BEF")]: {
    name: "NATIVE",
    img_url: "https://token-media.defined.fi/8453_0x20dd04c17afd5c9a8b3f2cdacaa8ee7907385bef_1738286103_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 4162000,
    amt_for_500_top_holder: 13570000,
    amt_for_250_top_holder: 64949683,
    amt_for_100_top_holder: 200021367,
    amt_for_50_top_holder: 449775064,
    amt_for_25_top_holder: 685359319,
    amt_for_10_top_holder: 1200000000
  },
  [toChecksumAddress("0x2D57C47BC5D2432FEEEdf2c9150162A9862D3cCf")]: {
    name: "DICKBUTT",
    img_url: "https://token-media.defined.fi/8453_0x2d57c47bc5d2432feeedf2c9150162a9862d3ccf_1738430100_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 3449000,
    amt_for_500_top_holder: 15440000,
    amt_for_250_top_holder: 50000000,
    amt_for_100_top_holder: 165974306,
    amt_for_50_top_holder: 406369743,
    amt_for_25_top_holder: 826511438,
    amt_for_10_top_holder: 1500000000
  },
  [toChecksumAddress("0x0fD7a301B51d0A83FCAf6718628174D527B373b6")]: {
    name: "LUM",
    img_url: "https://token-media.defined.fi/8453_0x0fd7a301b51d0a83fcaf6718628174d527b373b6_1738340101_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 86,
    amt_for_500_top_holder: 211,
    amt_for_250_top_holder: 549,
    amt_for_100_top_holder: 1401,
    amt_for_50_top_holder: 2661,
    amt_for_25_top_holder: 11475,
    amt_for_10_top_holder: 88976
  },
  [toChecksumAddress("0x0Db510e79909666d6dEc7f5e49370838c16D950f")]: {
    name: "ANON",
    img_url: "https://token-media.defined.fi/8453_0x0db510e79909666d6dec7f5e49370838c16d950f_1738228535_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 71455,
    amt_for_500_top_holder: 192719,
    amt_for_250_top_holder: 587473,
    amt_for_100_top_holder: 2000000,
    amt_for_50_top_holder: 3105000,
    amt_for_25_top_holder: 5530000,
    amt_for_10_top_holder: 12160000
  },
  [toChecksumAddress("0x348409fa3651D4Cf8571dB6bDfaAdD3df35987cD")]: {
    name: "BILLY",
    img_url: "https://token-media.defined.fi/8453_0x4200000000000000000000000000000000000006_small_82000c9c-885a-4387-b928-45bd661b9231.png",
    decimals: 18,
    amt_for_10_top_holder: 550
  },
  [toChecksumAddress("0x1d008f50FB828eF9DEbBBEAe1B71FfFe929bf317")]: {
    name: "CLANKFUN",
    img_url: "https://token-media.defined.fi/8453_0x1d008f50fb828ef9debbbeae1b71fffe929bf317_1738271712_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 1292000,
    amt_for_500_top_holder: 6526000,
    amt_for_250_top_holder: 46286340,
    amt_for_100_top_holder: 167941328,
    amt_for_50_top_holder: 351435539,
    amt_for_25_top_holder: 804176137,
    amt_for_10_top_holder: 1215322775
  },
  [toChecksumAddress("0x20Fd4C5396F7D9686f9997e0F10991957f7112fc")]: {
    name: "GDUPI",
    img_url: "https://token-media.defined.fi/8453_0x20fd4c5396f7d9686f9997e0f10991957f7112fc_1737767713_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 2000000,
    amt_for_500_top_holder: 10450000,
    amt_for_250_top_holder: 35492875,
    amt_for_100_top_holder: 131747018,
    amt_for_50_top_holder: 319220029,
    amt_for_25_top_holder: 636629999,
    amt_for_10_top_holder: 1050698010
  },
  [toChecksumAddress("0x291A8DA3c42b7d7f00349d6f1bE3C823a2B3fCA4")]: {
    name: "SMOL",
    img_url: "https://token-media.defined.fi/8453_0x291a8da3c42b7d7f00349d6f1be3c823a2b3fca4_1738728855_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 1000000,
    amt_for_500_top_holder: 7501000,
    amt_for_250_top_holder: 30666432,
    amt_for_100_top_holder: 150161763,
    amt_for_50_top_holder: 363359079,
    amt_for_25_top_holder: 760432350,
    amt_for_10_top_holder: 1381811480
  },
  [toChecksumAddress("0x275de0c241d52f9f005995b38e285f0ff2101155")]: {
    name: "streamm.tv",
    img_url: "https://token-media.defined.fi/8453_0x275de0c241d52f9f005995b38e285f0ff2101155_1736619358_small.png",
    decimals: 18,
    amt_for_500_top_holder: 287672,
    amt_for_250_top_holder: 8618306,
    amt_for_100_top_holder: 86048003,
    amt_for_50_top_holder: 279334565,
    amt_for_25_top_holder: 550000000,
    amt_for_10_top_holder: 1300000000
  },
  [toChecksumAddress("0x0a8753e39d5805bab0e570dd1974ee43f90799a8")]: {
    name: "BARKBARK",
    img_url: "https://token-media.defined.fi/8453_0x0a8753e39d5805bab0e570dd1974ee43f90799a8_1738228535_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 0,
    amt_for_250_top_holder: 9,
    amt_for_100_top_holder: 142,
    amt_for_50_top_holder: 456,
    amt_for_25_top_holder: 1295,
    amt_for_10_top_holder: 4201
  },
  [toChecksumAddress("0x06f71fb90f84b35302d132322a3c90e4477333b0")]: {
    name: "BRACKY",
    img_url: "https://token-media.defined.fi/8453_0x06f71fb90f84b35302d132322a3c90e4477333b0_1738509273_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 882902,
    amt_for_250_top_holder: 7460735,
    amt_for_100_top_holder: 70667941,
    amt_for_50_top_holder: 210868567,
    amt_for_25_top_holder: 707291960,
    amt_for_10_top_holder: 1121515472
  },
  [toChecksumAddress("0x36b0bc9b7cd78c589076c8fb7cd3f68b25b9770a")]: {
    name: "BOLIDE",
    img_url: "https://token-media.defined.fi/8453_0x36b0bc9b7cd78c589076c8fb7cd3f68b25b9770a_1738545340_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 1112208,
    amt_for_250_top_holder: 6431649,
    amt_for_100_top_holder: 50000000,
    amt_for_50_top_holder: 214228135,
    amt_for_25_top_holder: 747518566,
    amt_for_10_top_holder: 1691125719
  },
  [toChecksumAddress("0x02e739740b007bd5e4600b9736a143b6e794d223")]: {
    name: "BRING",
    img_url: "https://token-media.defined.fi/8453_0x02e739740b007bd5e4600b9736a143b6e794d223_1738437290_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 0,
    amt_for_250_top_holder: 2500,
    amt_for_100_top_holder: 40027565,
    amt_for_50_top_holder: 319505033,
    amt_for_25_top_holder: 692384265,
    amt_for_10_top_holder: 2988159890
  },
  [toChecksumAddress("0x3849cc93e7b71b37885237cd91a215974135cd8d")]: {
    name: "CREATE",
    img_url: "https://token-media.defined.fi/8453_0x3849cc93e7b71b37885237cd91a215974135cd8d_1738743295_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 1160017,
    amt_for_250_top_holder: 14786013,
    amt_for_100_top_holder: 115903018,
    amt_for_50_top_holder: 382684155,
    amt_for_25_top_holder: 1030862918,
    amt_for_10_top_holder: 1777836265
  },
  [toChecksumAddress("0x11a25224c18517980720a03a07831cde8b00c4fb")]: {
    name: "PUBECOIN",
    img_url: "https://token-media.defined.fi/8453_0x11a25224c18517980720a03a07831cde8b00c4fb_1738264571_small.png",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 370764,
    amt_for_250_top_holder: 10808245,
    amt_for_100_top_holder: 251833898,
    amt_for_50_top_holder: 370005545,
    amt_for_25_top_holder: 539825837,
    amt_for_10_top_holder: 1100090000
  },
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