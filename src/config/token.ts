/** USDT (SPL) on Solana Mainnet — planned ACOPAY pair quote. */
export const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

export const TOKEN = {
  name: "ACOPAY",
  symbol: "ACOPAY",
  tagline: "Pay your way",
  status: "pending_launch" as "pending_launch" | "live",
  mintAddress: "",
  network: "Solana Mainnet",
  decimals: 9,
  totalSupply: "100,000,000",
  tokenStandard: "Token-2022",
  transferFee: "0.01%",
  freezeAuthority: "Revoked",
  mintAuthority: "Active",
  website: "https://acopay.net",
  email: "contact@acopay.net",
  founded: "2026",
  dex: {
    platform: "Raydium",
    pair: "ACOPAY / USDT",
    status: "Coming soon",
  },
  links: {
    explorer: "https://explorer.solana.com/",
    solscan: "https://solscan.io/",
    jupiter: "https://jup.ag/",
    raydium: "https://raydium.io/",
  },
} as const;

export function isMintLive(): boolean {
  const m = TOKEN.mintAddress.trim();
  return m.length >= 32;
}

export function mintDisplay(): string {
  return isMintLive() ? TOKEN.mintAddress : "Not published yet";
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
