/** USDT (SPL) on Solana Mainnet — planned ACOPAY pair quote. */
export const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

/**
 * Single source of truth for the official site (acopay.net).
 * After mainnet create-token: set mintAddress + status "live", then deploy.
 */
export const TOKEN = {
  name: "ACOPAY",
  symbol: "ACOPAY",
  tagline: "Pay your way",
  description:
    "ACOPAY is a Solana Mainnet payment utility token (Token-2022) for transparent wallet-to-wallet transfers. Official source: acopay.net only.",
  status: "pending_launch" as "pending_launch" | "live",
  /** Fill after mainnet mint is created — leave empty until then. */
  mintAddress: "",
  network: "Solana Mainnet",
  decimals: 9,
  totalSupply: "100,000,000",
  totalSupplyRaw: 100_000_000,
  tokenStandard: "Token-2022",
  transferFee: "0.01%",
  transferFeeNote: "1 basis point on-chain (Token-2022 transfer fee extension)",
  freezeAuthority: "Revoked",
  mintAuthority: "Active",
  website: "https://acopay.net",
  email: "contact@acopay.net",
  founded: "2026",
  dex: {
    platform: "Raydium",
    pair: "ACOPAY / USDT",
    quoteMint: USDT_MINT,
    status: "Pending mainnet pool",
  },
  safety: {
    noOtc: true,
    freezeRevoked: true,
    officialDomainOnly: "acopay.net",
  },
  links: {
    explorer: "https://explorer.solana.com/",
    solscan: "https://solscan.io/",
    jupiter: "https://jup.ag/",
    raydium: "https://raydium.io/swap/",
    jupiterVerify: "https://verified.jup.ag/tokens",
  },
} as const;

export function isMintLive(): boolean {
  const m = TOKEN.mintAddress.trim();
  return m.length >= 32;
}

export function mintDisplay(): string {
  return isMintLive() ? TOKEN.mintAddress : "Not published yet — check back on acopay.net";
}

export function explorerUrl(): string {
  return isMintLive()
    ? `https://explorer.solana.com/address/${TOKEN.mintAddress}`
    : TOKEN.links.explorer;
}

export function solscanUrl(): string {
  return isMintLive()
    ? `https://solscan.io/token/${TOKEN.mintAddress}`
    : TOKEN.links.solscan;
}

/** Jupiter deep link USDT → ACOPAY. Null before mainnet mint. */
export function jupiterSwapUrl(): string | null {
  if (!isMintLive()) return null;
  return `https://jup.ag/swap/${USDT_MINT}-${TOKEN.mintAddress}`;
}

/** Raydium swap deep link USDT → ACOPAY. Null before mainnet mint. */
export function raydiumSwapUrl(): string | null {
  if (!isMintLive()) return null;
  return `https://raydium.io/swap/?inputMint=${USDT_MINT}&outputMint=${TOKEN.mintAddress}`;
}
