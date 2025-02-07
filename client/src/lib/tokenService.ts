import { Web3 } from 'web3';
import { Multicall } from 'ethereum-multicall';

const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";
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
  img_url?: string;
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
    "name": "Fartcoin",
    "decimals": 18,
    "amt_for_1000_top_holder": 4880000,
    "amt_for_500_top_holder": 20000000,
    "amt_for_250_top_holder": 79508995,
    "amt_for_100_top_holder": 210172569,
    "amt_for_50_top_holder": 365025750,
    "amt_for_25_top_holder": 649326066,
    "amt_for_10_top_holder": 1018654744
  },
  "0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb": {
    "name": "CLANKER",
    "decimals": 18,
    "amt_for_1000_top_holder": 56,
    "amt_for_500_top_holder": 189,
    "amt_for_250_top_holder": 515,
    "amt_for_100_top_holder": 1465,
    "amt_for_50_top_holder": 3757,
    "amt_for_25_top_holder": 7533,
    "amt_for_10_top_holder": 12500
  },
  "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b": {
    "name": "BNKR",
    "decimals": 18,
    "amt_for_1000_top_holder": 5006000,
    "amt_for_500_top_holder": 16490000,
    "amt_for_250_top_holder": 64703807,
    "amt_for_100_top_holder": 169534852,
    "amt_for_50_top_holder": 300137271,
    "amt_for_25_top_holder": 551891129,
    "amt_for_10_top_holder": 1162681821
  },
  "0x20DD04c17AFD5c9a8b3f2cdacaa8Ee7907385BEF": {
    "name": "NATIVE",
    "decimals": 18,
    "amt_for_1000_top_holder": 4162000,
    "amt_for_500_top_holder": 13570000,
    "amt_for_250_top_holder": 64949683,
    "amt_for_100_top_holder": 200021367,
    "amt_for_50_top_holder": 449775064,
    "amt_for_25_top_holder": 685359319,
    "amt_for_10_top_holder": 1200000000
  },
  "0x2D57C47BC5D2432FEEEdf2c9150162A9862D3cCf": {
    "name": "DICKBUTT",
    "decimals": 18,
    "amt_for_1000_top_holder": 3449000,
    "amt_for_500_top_holder": 15440000,
    "amt_for_250_top_holder": 50000000,
    "amt_for_100_top_holder": 165974306,
    "amt_for_50_top_holder": 406369743,
    "amt_for_25_top_holder": 826511438,
    "amt_for_10_top_holder": 1500000000
  },
  "0x0fD7a301B51d0A83FCAf6718628174D527B373b6": {
    "name": "LUM",
    "decimals": 18,
    "amt_for_1000_top_holder": 86,
    "amt_for_500_top_holder": 211,
    "amt_for_250_top_holder": 549,
    "amt_for_100_top_holder": 1401,
    "amt_for_50_top_holder": 2661,
    "amt_for_25_top_holder": 11475,
    "amt_for_10_top_holder": 88976
  },
  "0x0Db510e79909666d6dEc7f5e49370838c16D950f": {
    "name": "ANON",
    "decimals": 18,
    "amt_for_1000_top_holder": 71455,
    "amt_for_500_top_holder": 192719,
    "amt_for_250_top_holder": 587473,
    "amt_for_100_top_holder": 2000000,
    "amt_for_50_top_holder": 3105000,
    "amt_for_25_top_holder": 5530000,
    "amt_for_10_top_holder": 12160000
  },
  "0x348409fa3651D4Cf8571dB6bDfaAdD3df35987cD": {
    "name": "BILLY",
    "decimals": 18,
    "amt_for_10_top_holder": 550
  },
  "0x1d008f50FB828eF9DEbBBEAe1B71FfFe929bf317": {
    "name": "CLANKFUN",
    "decimals": 18,
    "amt_for_1000_top_holder": 1292000,
    "amt_for_500_top_holder": 6526000,
    "amt_for_250_top_holder": 46286340,
    "amt_for_100_top_holder": 167941328,
    "amt_for_50_top_holder": 351435539,
    "amt_for_25_top_holder": 804176137,
    "amt_for_10_top_holder": 1215322775
  },
  "0x20Fd4C5396F7D9686f9997e0F10991957f7112fc": {
    "name": "GDUPI",
    "decimals": 18,
    "amt_for_1000_top_holder": 2000000,
    "amt_for_500_top_holder": 10450000,
    "amt_for_250_top_holder": 35492875,
    "amt_for_100_top_holder": 131747018,
    "amt_for_50_top_holder": 319220029,
    "amt_for_25_top_holder": 636629999,
    "amt_for_10_top_holder": 1050698010
  },
  "0x275de0c241d52f9f005995b38e285f0ff2101155": {
    "name": "streamm.tv",
    "decimals": 18,
    "amt_for_500_top_holder": 287672,
    "amt_for_250_top_holder": 8618306,
    "amt_for_100_top_holder": 86048003,
    "amt_for_50_top_holder": 279334565,
    "amt_for_25_top_holder": 550000000,
    "amt_for_10_top_holder": 1300000000
  },
  "0x0a8753e39d5805bab0e570dd1974ee43f90799a8": {
    "name": "BARKBARK",
    "decimals": 18,
    "amt_for_1000_top_holder": 0,
    "amt_for_500_top_holder": 0,
    "amt_for_250_top_holder": 9,
    "amt_for_100_top_holder": 142,
    "amt_for_50_top_holder": 456,
    "amt_for_25_top_holder": 1295,
    "amt_for_10_top_holder": 4201
  },
  "0x06f71fb90f84b35302d132322a3c90e4477333b0": {
    "name": "BRACKY",
    "decimals": 18,
    "amt_for_1000_top_holder": 0,
    "amt_for_500_top_holder": 882902,
    "amt_for_250_top_holder": 7460735,
    "amt_for_100_top_holder": 70667941,
    "amt_for_50_top_holder": 210868567,
    "amt_for_25_top_holder": 707291960,
    "amt_for_10_top_holder": 1121515472
  }
} as const;

export async function fetchUserInfoByFid(fid: number): Promise<FarcasterUser | null> {
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=3`,
      {
        headers: {
          'accept': 'application/json',
          'x-api-key': NEYNAR_API_KEY,
          'x-neynar-experimental': 'false'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: FarcasterResponse = await response.json();
    return data.users[0] || null;
  } catch (error) {
    console.error('Failed to fetch Farcaster user info:', error);
    throw error;
  }
}

const web3 = new Web3(ALCHEMY_RPC);
const multicall = new Multicall({
  web3Instance: web3,
  tryAggregate: true,
  multicallCustomContractAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
});

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

export async function getClankerTokenInfoForAddress(address: string): Promise<TokenBalance[]> {
  if (!web3.utils.isAddress(address)) {
    throw new Error('Invalid address');
  }

  const tokenAddresses = Object.keys(TOP_CLANKER_HOLDING_THRESHOLD);

  try {
    const contractCallContext = tokenAddresses.map((tokenAddress) => ({
      reference: tokenAddress,
      contractAddress: tokenAddress,
      abi: ERC20_ABI,
      calls: [{ reference: 'balanceOf', methodName: 'balanceOf', methodParameters: [address] }]
    }));

    const { results } = await multicall.call(contractCallContext);

    return tokenAddresses.map((tokenAddress) => {
      const token = TOP_CLANKER_HOLDING_THRESHOLD[tokenAddress];
      const result = results[tokenAddress];
      const balance = result?.callsReturnContext[0]?.returnValues[0]?.hex || '0x0';
      const adjustedBalance = BigInt(balance) / BigInt(10 ** token.decimals);

      return {
        address: tokenAddress,
        name: token.name,
        img_url: token.img_url,
        balance: adjustedBalance.toString(),
        ranking: {
          isTop1000: adjustedBalance > BigInt(token.amt_for_1000_top_holder || 0),
          isTop500: adjustedBalance > BigInt(token.amt_for_500_top_holder || 0),
          isTop250: adjustedBalance > BigInt(token.amt_for_250_top_holder || 0),
          isTop100: adjustedBalance > BigInt(token.amt_for_100_top_holder || 0),
          isTop50: adjustedBalance > BigInt(token.amt_for_50_top_holder || 0),
          isTop25: adjustedBalance > BigInt(token.amt_for_25_top_holder || 0),
          isTop10: adjustedBalance > BigInt(token.amt_for_10_top_holder || 0)
        }
      };
    });
  } catch (error) {
    console.error('Multicall failed:', error);
    throw error;
  }
}