import { Web3 } from 'web3';
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
  const balances: TokenBalance[] = [];

  // Process tokens in order they appear in TOP_CLANKER_HOLDING_THRESHOLD
  for (const tokenAddress of tokenAddresses) {
    try {
      const token = TOP_CLANKER_HOLDING_THRESHOLD[tokenAddress];
      const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

      const balance = BigInt(await contract.methods.balanceOf(address).call());
      const adjustedBalance = balance / BigInt(10 ** token.decimals);

      balances.push({
        address: tokenAddress,
        name: token.name,
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
      });
    } catch (error) {
      console.error(`Failed to fetch balance for token ${tokenAddress}:`, error);
      continue; // Skip this token and continue with others
    }
  }

  return balances;
}