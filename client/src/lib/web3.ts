import { Web3 } from 'web3';
import { Multicall } from 'ethereum-multicall';
import { TOP_CLANKER_HOLDING_THRESHOLD } from './tokenData';

const ALCHEMY_RPC = "https://base-mainnet.g.alchemy.com/v2/ecImnMYatQyAcQFuruRJmRqo1gGW3yTA";
const web3 = new Web3(ALCHEMY_RPC);
const multicall = new Multicall({
  web3Instance: web3,
  tryAggregate: true,
  multicallCustomContractAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' // Base network multicall contract
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

  try {
    // Prepare multicall contract calls
    const contractCallContext = tokenAddresses.map((tokenAddress) => ({
      reference: tokenAddress,
      contractAddress: tokenAddress,
      abi: ERC20_ABI,
      calls: [{ reference: 'balanceOf', methodName: 'balanceOf', methodParameters: [address] }]
    }));

    // Execute multicall
    const { results } = await multicall.call(contractCallContext);

    // Process results maintaining order from tokenAddresses
    return tokenAddresses.map((tokenAddress) => {
      const token = TOP_CLANKER_HOLDING_THRESHOLD[tokenAddress];
      const result = results[tokenAddress];

      // Get balance from multicall result
      const balance = result?.callsReturnContext[0]?.returnValues[0]?.hex || '0x0';
      const adjustedBalance = BigInt(balance) / BigInt(10 ** token.decimals);

      return {
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
      };
    });
  } catch (error) {
    console.error('Multicall failed:', error);
    throw error;
  }
}