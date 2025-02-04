export interface TokenThreshold {
  name: string;
  decimals: number;
  amt_for_1000_top_holder: number;
  amt_for_500_top_holder: number;
  amt_for_250_top_holder: number;
  amt_for_100_top_holder: number;
  amt_for_50_top_holder: number;
  amt_for_25_top_holder: number;
  amt_for_10_top_holder: number;
}

export const TOP_CLANKER_HOLDING_THRESHOLD: Record<string, TokenThreshold> = {
  "0x2f6c17fa9f9bC3600346ab4e48C0701e1d5962AE": {
    name: "Fartcoin",
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
    decimals: 18,
    amt_for_1000_top_holder: 5006000,
    amt_for_500_top_holder: 16490000,
    amt_for_250_top_holder: 64703807,
    amt_for_100_top_holder: 169534852,
    amt_for_50_top_holder: 300137271,
    amt_for_25_top_holder: 551891129,
    amt_for_10_top_holder: 1162681821
  },
  // Add rest of the tokens...
} as const;
