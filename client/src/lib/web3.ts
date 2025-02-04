import { Web3 } from 'web3';
import { TOP_CLANKER_HOLDING_THRESHOLD } from './tokenData';

const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";
const web3 = new Web3(ALCHEMY_RPC);

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

  const balances: TokenBalance[] = [];

  for (const [tokenAddress, token] of Object.entries(TOP_CLANKER_HOLDING_THRESHOLD)) {
    // Convert balance to BigInt for comparison
    // For demo using a fixed value, in production would fetch actual balance
    const balance = BigInt('1000000000000000000'); // 1 token for demo

    const ranking = {
      isTop1000: balance >= BigInt(token.amt_for_1000_top_holder),
      isTop500: balance >= BigInt(token.amt_for_500_top_holder),
      isTop250: balance >= BigInt(token.amt_for_250_top_holder),
      isTop100: balance >= BigInt(token.amt_for_100_top_holder),
      isTop50: balance >= BigInt(token.amt_for_50_top_holder),
      isTop25: balance >= BigInt(token.amt_for_25_top_holder),
      isTop10: balance >= BigInt(token.amt_for_10_top_holder)
    };

    balances.push({
      address: tokenAddress,
      name: token.name,
      balance: balance.toString(),
      ranking
    });
  }

  return balances;
}