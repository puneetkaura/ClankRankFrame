import { Web3 } from 'web3';
import { TOP_CLANKER_HOLDING_THRESHOLD } from './tokenData';

const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";
const web3 = new Web3(ALCHEMY_RPC);

// Minimal ABI for balanceOf
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

  const balances: TokenBalance[] = [];

  for (const [tokenAddress, token] of Object.entries(TOP_CLANKER_HOLDING_THRESHOLD)) {
    try {
      // Create contract instance
      const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

      // Fetch actual balance
      const balance = BigInt(await contract.methods.balanceOf(address).call());

      // Adjust for decimals
      const adjustedBalance = balance / BigInt(10 ** token.decimals);

      const ranking = {
        isTop1000: adjustedBalance > BigInt(token.amt_for_1000_top_holder),
        isTop500: adjustedBalance > BigInt(token.amt_for_500_top_holder),
        isTop250: adjustedBalance > BigInt(token.amt_for_250_top_holder),
        isTop100: adjustedBalance > BigInt(token.amt_for_100_top_holder),
        isTop50: adjustedBalance > BigInt(token.amt_for_50_top_holder),
        isTop25: adjustedBalance > BigInt(token.amt_for_25_top_holder),
        isTop10: adjustedBalance > BigInt(token.amt_for_10_top_holder)
      };

      balances.push({
        address: tokenAddress,
        name: token.name,
        balance: adjustedBalance.toString(),
        ranking
      });
    } catch (error) {
      console.error(`Error fetching balance for ${token.name}:`, error);
      // Add token with zero balance if fetch fails
      balances.push({
        address: tokenAddress,
        name: token.name,
        balance: '0',
        ranking: {
          isTop1000: false,
          isTop500: false,
          isTop250: false,
          isTop100: false,
          isTop50: false,
          isTop25: false,
          isTop10: false
        }
      });
    }
  }

  return balances;
}