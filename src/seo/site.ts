/** Central SEO + social copy — English (US), brand ACOPAY. */
export const SITE = {
  name: "ACOPAY",
  tagline: "Pay your way",
  url: "https://acopay.net",
  locale: "en_US",
  language: "en-US",
  region: "US",
  email: "contact@acopay.net",
  themeColor: "#0c1017",
  twitterHandle: "", // add @handle when official X account exists
  ogImage: "https://acopay.net/assets/og-image.png",
  ogImageAlt: "ACOPAY — Pay your way",
  defaultTitle: "ACOPAY — Pay your way",
  defaultDescription:
    "Token-2022 for wallet-to-wallet transfers with a 0.01% on-chain fee. Trade ACOPAY/USDT on Raydium and Jupiter.",
  keywords: [
    "ACOPAY",
    "Pay your way",
    "Solana",
    "Token-2022",
    "payment token",
    "ACOPAY USDT",
    "Raydium",
    "Jupiter",
    "crypto payments",
    "wallet to wallet",
    "SPL token",
    "acopay.net",
  ],
  hashtags: [
    "#ACOPAY",
    "#PayYourWay",
    "#Solana",
    "#Token2022",
    "#CryptoPayments",
    "#Raydium",
    "#Jupiter",
    "#Web3",
  ],
} as const;

export type PageSeo = {
  title: string;
  description: string;
  path: string;
};

export const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    path: "/",
  },
  "/buy": {
    title: "Buy ACOPAY | OTC Desk USDT 1:1 — Solana Pay QR",
    description:
      "Buy ACOPAY with USDT at 1:1 on the official OTC desk. Scan the Solana Pay QR with Phantom or Solflare — ACOPAY is sent automatically.",
    path: "/buy",
  },
  "/trade": {
    title: "How to Buy ACOPAY | OTC Desk & DEX Swap",
    description:
      "Buy ACOPAY via official OTC (USDT 1:1) or swap on Jupiter and Raydium. Match the official contract on acopay.net.",
    path: "/trade",
  },
  "/markets": {
    title: "ACOPAY Markets | Transactions, Pools & Swap",
    description:
      "Explore ACOPAY transactions, Raydium pools, spot prices, and Jupiter swap.",
    path: "/markets",
  },
  "/pools": {
    title: "ACOPAY Markets | Transactions, Pools & Swap",
    description:
      "Explore ACOPAY transactions, Raydium pools, spot prices, and Jupiter swap.",
    path: "/markets",
  },
  "/token": {
    title: "ACOPAY Token Overview | Supply, Fee & Authorities",
    description:
      "ACOPAY token details: 200M supply, Token-2022, 0.01% transfer fee, freeze revoked.",
    path: "/token",
  },
  "/contract": {
    title: "ACOPAY Contract Address | Official Solana Mint",
    description:
      "Official ACOPAY contract address on Solana Mainnet. Verify on Solscan and Explorer before you trade.",
    path: "/contract",
  },
  "/roadmap": {
    title: "ACOPAY Roadmap | 2026–2030 Milestones",
    description:
      "ACOPAY product roadmap: Raydium pool live, web and mobile payments, CoinGecko, Binance, and payment gateway.",
    path: "/roadmap",
  },
  "/faq": {
    title: "ACOPAY FAQ | Fees, Pool, Buying & Transfers",
    description:
      "Frequently asked questions about ACOPAY: how to buy, transfer fees, freeze authority, Raydium pool, and contract address.",
    path: "/faq",
  },
  "/link-wallet": {
    title: "Link Phantom to ACOPAY Telegram Pay",
    description:
      "Prove ownership of your Solana address and receive ACOPAY into Phantom via @AcopayNetwork_bot.",
    path: "/link-wallet",
  },
};

export function absoluteUrl(path: string): string {
  if (path === "/") return `${SITE.url}/`;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
