/** USDT (SPL) on Solana Mainnet — ACOPAY/USDT quote. */
export const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

/**
 * Single source of truth for the official site (acopay.net).
 */
export const TOKEN = {
  name: "ACOPAY",
  symbol: "ACOPAY",
  tagline: "Pay your way",
  description:
    "ACOPAY is a Solana payment utility token (Token-2022) for wallet-to-wallet transfers.",
  status: "live" as "pending_launch" | "live",
  mintAddress: "6Pcq8xnkVYxR42FEehXrucvaMB1fZYuqoR8B9FGSAS8F",
  network: "Solana Mainnet",
  decimals: 9,
  totalSupply: "200,000,000",
  totalSupplyRaw: 200_000_000,
  tokenStandard: "Token-2022",
  transferFee: "0.01%",
  transferFeeNote: "1 bps on-chain",
  freezeAuthority: "Revoked",
  mintAuthority: "Active",
  website: "https://acopay.net",
  email: "contact@acopay.net",
  founded: "2026",
  /** Official Telegram Pay bot (shared with volume admin). */
  telegramBot: "AcopayNetwork_bot",
  telegramUrl: "https://t.me/AcopayNetwork_bot",
  telegramPayUrl: "https://t.me/AcopayNetwork_bot?start=pay",
  dex: {
    platform: "Raydium",
    pair: "ACOPAY / USDT",
    quoteMint: USDT_MINT,
    /** Raydium CPMM pool id (AMM ID). */
    poolId: "BwKQMhYMqd8hxke3HiEMJ9MMf9ud5sdbbU6VcEQLfZLj",
    status: "Live",
    poolLive: true as boolean,
  },
  safety: {
    /** Official OTC desk on /buy (bot USDT→ACOPAY). Not unsolicited private OTC. */
    officialOtc: true,
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

/** True only after Raydium pool is created — gates Buy / Jupiter CTAs. */
export function isPoolLive(): boolean {
  return isMintLive() && TOKEN.dex.poolLive === true;
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

/** Jupiter deep link USDT → ACOPAY. Null until pool is live. */
export function jupiterSwapUrl(): string | null {
  if (!isPoolLive()) return null;
  return `https://jup.ag/swap/${USDT_MINT}-${TOKEN.mintAddress}`;
}

/** Raydium swap deep link USDT → ACOPAY. Null until pool is live. */
export function raydiumSwapUrl(): string | null {
  if (!isPoolLive()) return null;
  return `https://raydium.io/swap/?inputMint=${USDT_MINT}&outputMint=${TOKEN.mintAddress}`;
}

/** Raydium pool page. */
export function raydiumPoolUrl(): string | null {
  if (!isPoolLive() || !TOKEN.dex.poolId) return null;
  return `https://raydium.io/liquidity/increase/?mode=add&pool_id=${TOKEN.dex.poolId}`;
}
