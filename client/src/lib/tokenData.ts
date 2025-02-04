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
  "0x20DD04c17AFD5c9a8b3f2cdacaa8Ee7907385BEF": {
    name: "NATIVE",
    decimals: 18,
    amt_for_1000_top_holder: 4162000,
    amt_for_500_top_holder: 13570000,
    amt_for_250_top_holder: 64949683,
    amt_for_100_top_holder: 200021367,
    amt_for_50_top_holder: 449775064,
    amt_for_25_top_holder: 685359319,
    amt_for_10_top_holder: 1200000000
  },
  "0x2D57C47BC5D2432FEEEdf2c9150162A9862D3cCf": {
    name: "DICKBUTT",
    decimals: 18,
    amt_for_1000_top_holder: 3449000,
    amt_for_500_top_holder: 15440000,
    amt_for_250_top_holder: 50000000,
    amt_for_100_top_holder: 165974306,
    amt_for_50_top_holder: 406369743,
    amt_for_25_top_holder: 826511438,
    amt_for_10_top_holder: 1500000000
  },
  "0x0fD7a301B51d0A83FCAf6718628174D527B373b6": {
    name: "LUM",
    decimals: 18,
    amt_for_1000_top_holder: 86,
    amt_for_500_top_holder: 211,
    amt_for_250_top_holder: 549,
    amt_for_100_top_holder: 1401,
    amt_for_50_top_holder: 2661,
    amt_for_25_top_holder: 11475,
    amt_for_10_top_holder: 88976
  },
  "0x0Db510e79909666d6dEc7f5e49370838c16D950f": {
    name: "ANON",
    decimals: 18,
    amt_for_1000_top_holder: 71455,
    amt_for_500_top_holder: 192719,
    amt_for_250_top_holder: 587473,
    amt_for_100_top_holder: 2000000,
    amt_for_50_top_holder: 3105000,
    amt_for_25_top_holder: 5530000,
    amt_for_10_top_holder: 12160000
  },
  "0x348409fa3651D4Cf8571dB6bDfaAdD3df35987cD": {
    name: "BILLY",
    decimals: 18,
    amt_for_10_top_holder: 550
  },
  "0x1d008f50FB828eF9DEbBBEAe1B71FfFe929bf317": {
    name: "CLANKFUN",
    decimals: 18,
    amt_for_1000_top_holder: 1292000,
    amt_for_500_top_holder: 6526000,
    amt_for_250_top_holder: 46286340,
    amt_for_100_top_holder: 167941328,
    amt_for_50_top_holder: 351435539,
    amt_for_25_top_holder: 804176137,
    amt_for_10_top_holder: 1215322775
  },
  "0x20Fd4C5396F7D9686f9997e0F10991957f7112fc": {
    name: "GDUPI",
    decimals: 18,
    amt_for_1000_top_holder: 2000000,
    amt_for_500_top_holder: 10450000,
    amt_for_250_top_holder: 35492875,
    amt_for_100_top_holder: 131747018,
    amt_for_50_top_holder: 319220029,
    amt_for_25_top_holder: 636629999,
    amt_for_10_top_holder: 1050698010
  },
  "0x291A8DA3c42b7d7f00349d6f1bE3C823A2B3fCA4": {
    name: "SMOL",
    decimals: 18,
    amt_for_1000_top_holder: 1000000,
    amt_for_500_top_holder: 7501000,
    amt_for_250_top_holder: 30666432,
    amt_for_100_top_holder: 150161763,
    amt_for_50_top_holder: 363359079,
    amt_for_25_top_holder: 760432350,
    amt_for_10_top_holder: 1381811480
  }
} as const;