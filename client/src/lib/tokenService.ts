import { Web3 } from 'web3';
import { Multicall } from 'ethereum-multicall';

const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";

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
    "img_url": "https://token-media.defined.fi/8453_0x2f6c17fa9f9bc3600346ab4e48c0701e1d5962ae_1738610042_small.png",
    "decimals": 18,
    "amt_for_1000_top_holder": 4880000,
    "amt_for_500_top_holder": 20000000,
    "amt_for_250_top_holder": 79508995,
    "amt_for_100_top_holder": 210172569,
    "amt_for_50_top_holder": 365025750,
    "amt_for_25_top_holder": 649326066,
    "amt_for_10_top_holder": 1018654744
  },
  // ... other tokens
} as const;

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
