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
  },
  "0x275de0c241d52f9f005995b38e285f0ff2101155": {
    name: "streamm.tv",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 287672,
    amt_for_250_top_holder: 8618306,
    amt_for_100_top_holder: 86048003,
    amt_for_50_top_holder: 279334565,
    amt_for_25_top_holder: 550000000,
    amt_for_10_top_holder: 1300000000
  },
  "0x0a8753e39d5805bab0e570dd1974ee43f90799a8": {
    name: "BARKBARK",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 0,
    amt_for_250_top_holder: 9,
    amt_for_100_top_holder: 142,
    amt_for_50_top_holder: 456,
    amt_for_25_top_holder: 1295,
    amt_for_10_top_holder: 4201
  },
  "0x06f71fb90f84b35302d132322a3c90e4477333b0": {
    name: "BRACKY",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 882902,
    amt_for_250_top_holder: 7460735,
    amt_for_100_top_holder: 70667941,
    amt_for_50_top_holder: 210868567,
    amt_for_25_top_holder: 707291960,
    amt_for_10_top_holder: 1121515472
  },
  "0x36b0bc9b7cd78c589076c8fb7cd3f68b25b9770a": {
    name: "BOLIDE",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 1112208,
    amt_for_250_top_holder: 6431649,
    amt_for_100_top_holder: 50000000,
    amt_for_50_top_holder: 214228135,
    amt_for_25_top_holder: 747518566,
    amt_for_10_top_holder: 1691125719
  },
  "0x02e739740b007bd5e4600b9736a143b6e794d223": {
    name: "BRING",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 0,
    amt_for_250_top_holder: 2500,
    amt_for_100_top_holder: 40027565,
    amt_for_50_top_holder: 319505033,
    amt_for_25_top_holder: 692384265,
    amt_for_10_top_holder: 2988159890
  },
  "0x3849cc93e7b71b37885237cd91a215974135cd8d": {
    name: "CREATE",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 1160017,
    amt_for_250_top_holder: 14786013,
    amt_for_100_top_holder: 115903018,
    amt_for_50_top_holder: 382684155,
    amt_for_25_top_holder: 1030862918,
    amt_for_10_top_holder: 1777836265
  },
  "0x11a25224c18517980720a03a07831cde8b00c4fb": {
    name: "PUBECOIN",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 370764,
    amt_for_250_top_holder: 10808245,
    amt_for_100_top_holder: 251833898,
    amt_for_50_top_holder: 370005545,
    amt_for_25_top_holder: 539825837,
    amt_for_10_top_holder: 1100090000
  },
  "0x21e00ff5374a0b803e0dc13a72800aca95b4b09e": {
    name: "BUTTHOLE",
    decimals: 18,
    amt_for_1000_top_holder: 61709,
    amt_for_500_top_holder: 4969912,
    amt_for_250_top_holder: 31037086,
    amt_for_100_top_holder: 152135238,
    amt_for_50_top_holder: 396469310,
    amt_for_25_top_holder: 836894301,
    amt_for_10_top_holder: 1500000000
  },
  "0x1cdbb57b12f732cfb4dc06f690acef476485b2a5": {
    name: "CLANKERMON",
    decimals: 18,
    amt_for_1000_top_holder: 109,
    amt_for_500_top_holder: 53413,
    amt_for_250_top_holder: 307461,
    amt_for_100_top_holder: 1462458,
    amt_for_50_top_holder: 3706055,
    amt_for_25_top_holder: 6398165,
    amt_for_10_top_holder: 15316960
  },
  "0x1014fc96b37225e56f171a107bebef03800ff8f8": {
    name: "DEGENOS",
    decimals: 18,
    amt_for_1000_top_holder: 8,
    amt_for_500_top_holder: 2342034,
    amt_for_250_top_holder: 16616537,
    amt_for_100_top_holder: 133141388,
    amt_for_50_top_holder: 382584579,
    amt_for_25_top_holder: 728734397,
    amt_for_10_top_holder: 1610086303
  },
  "0x354d6890caa31a5e28b6059d46781f40880786a6": {
    name: "GHFFB47YII2RTEEYY10O",
    decimals: 18,
    amt_for_1000_top_holder: 1928000,
    amt_for_500_top_holder: 10342850,
    amt_for_250_top_holder: 37329304,
    amt_for_100_top_holder: 144071371,
    amt_for_50_top_holder: 337503565,
    amt_for_25_top_holder: 591966903,
    amt_for_10_top_holder: 1006536914
  },
  "0x125a3513787e4a8cc5682e98dae903e3d25dc442": {
    name: "Popeye the Sailor Man",
    decimals: 18,
    amt_for_1000_top_holder: 195856,
    amt_for_500_top_holder: 5280365,
    amt_for_250_top_holder: 29878096,
    amt_for_100_top_holder: 141546460,
    amt_for_50_top_holder: 365600973,
    amt_for_25_top_holder: 726989089,
    amt_for_10_top_holder: 1337856509
  },
  "0x1035ae3f87a91084c6c5084d0615cc6121c5e228": {
    name: "BASEDFWOG",
    decimals: 18,
    amt_for_1000_top_holder: 2585000,
    amt_for_500_top_holder: 12758500,
    amt_for_250_top_holder: 41045379,
    amt_for_100_top_holder: 132210281,
    amt_for_50_top_holder: 304107147,
    amt_for_25_top_holder: 564205030,
    amt_for_10_top_holder: 1000000000
  },
  "0x820c5f0fb255a1d18fd0ebb0f1ccefbc4d546da7": {
    name: "A0X",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 0,
    amt_for_250_top_holder: 6426268,
    amt_for_100_top_holder: 75920600,
    amt_for_50_top_holder: 255195408,
    amt_for_25_top_holder: 1112840745,
    amt_for_10_top_holder: 2070261406
  },
  "0x19975a01b71d4674325bd315e278710bc36d8e5f": {
    name: "FEDCHAIN",
    decimals: 18,
    amt_for_1000_top_holder: 206267,
    amt_for_500_top_holder: 9000000,
    amt_for_250_top_holder: 24839321,
    amt_for_100_top_holder: 130000000,
    amt_for_50_top_holder: 333422149,
    amt_for_25_top_holder: 674017318,
    amt_for_10_top_holder: 1496060110
  },
  "0x28bc44f9754f590da1564c1a7ba35f8e1d1b134a": {
    name: "BLONDE",
    decimals: 18,
    amt_for_1000_top_holder: 1413000,
    amt_for_500_top_holder: 6114000,
    amt_for_250_top_holder: 23460943,
    amt_for_100_top_holder: 119807542,
    amt_for_50_top_holder: 247388318,
    amt_for_25_top_holder: 557526840,
    amt_for_10_top_holder: 1100556016
  },
  "0x26e0331355df5ef082f69df161218093708a73ac": {
    name: "CHAOS",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 2000000,
    amt_for_250_top_holder: 18912860,
    amt_for_100_top_holder: 102904875,
    amt_for_50_top_holder: 269021817,
    amt_for_25_top_holder: 633686250,
    amt_for_10_top_holder: 1350477812
  },
  "0x08ce1d743d18617f4f6eddfb9dae53303d6d7bde": {
    name: "MITO",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 0,
    amt_for_250_top_holder: 0,
    amt_for_100_top_holder: 3160128,
    amt_for_50_top_holder: 195456197,
    amt_for_25_top_holder: 1000000000,
    amt_for_10_top_holder: 35029730891
  },
  "0x3e1a6d23303be04403badc8bff348027148fef27": {
    name: "CLANKSTER",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 1616624,
    amt_for_250_top_holder: 10449381,
    amt_for_100_top_holder: 81607154,
    amt_for_50_top_holder: 249279974,
    amt_for_25_top_holder: 545588414,
    amt_for_10_top_holder: 1307256572
  },
  "0x38b88d6568d61556d33592ad7bc24e89a7fb6691": {
    name: "OPSYS",
    decimals: 18,
    amt_for_1000_top_holder: 0,
    amt_for_500_top_holder: 500001,
    amt_for_250_top_holder: 12577808,
    amt_for_100_top_holder: 133847075,
    amt_for_50_top_holder: 395788229,
    amt_for_25_top_holder: 822788268,
    amt_for_10_top_holder: 1889901302
  }
} as const;