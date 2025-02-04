export function formatBalance(balance: string): string {
  const num = parseFloat(balance);
  
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  
  return num.toFixed(0);
}

export function getDexscreenerUrl(tokenAddress: string): string {
  return `https://dexscreener.com/base/${tokenAddress}`;
}
