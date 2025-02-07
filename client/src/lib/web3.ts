
import { Web3 } from 'web3';
import BatchCall from 'web3-batch-call';
import { TOP_CLANKER_HOLDING_THRESHOLD } from './tokenData';

const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";
const web3 = new Web3(ALCHEMY_RPC);

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

export interface TokenBalance {
  address: string;
  name: string;
  balance: string;
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

export async function getTokenBalances(address: string): Promise<TokenBalance[]> {
  if (!web3.utils.isAddress(address)) {
    throw new Error('Invalid address');
  }

  const tokenAddresses = Object.keys(TOP_CLANKER_HOLDING_THRESHOLD);
  const contracts = tokenAddresses.map(tokenAddress => ({
    addresses: [tokenAddress],
    contractAbi: ERC20_ABI,
    calls: [{
      reference: 'balanceOf',
      method: 'balanceOf',
      params: [address]
    }]
  }));

  const batchCall = new BatchCall({
    provider: ALCHEMY_RPC,
    contracts,
    blockNumber: 'latest'
  });

  try {
    const results = await batchCall.execute();
    return results.map((result: any, index: number) => {
      const tokenAddress = tokenAddresses[index];
      const token = TOP_CLANKER_HOLDING_THRESHOLD[tokenAddress];
      const balance = BigInt(result[0]?.values?.[0] || '0');
      const adjustedBalance = balance / BigInt(10 ** token.decimals);

      return {
        address: tokenAddress,
        name: token.name,
        balance: adjustedBalance.toString(),
        ranking: {
          isTop1000: adjustedBalance > BigInt(token.amt_for_1000_top_holder),
          isTop500: adjustedBalance > BigInt(token.amt_for_500_top_holder),
          isTop250: adjustedBalance > BigInt(token.amt_for_250_top_holder),
          isTop100: adjustedBalance > BigInt(token.amt_for_100_top_holder),
          isTop50: adjustedBalance > BigInt(token.amt_for_50_top_holder),
          isTop25: adjustedBalance > BigInt(token.amt_for_25_top_holder),
          isTop10: adjustedBalance > BigInt(token.amt_for_10_top_holder)
        }
      };
    });
  } catch (error) {
    console.error('Batch call failed:', error);
    throw error;
  }
}
