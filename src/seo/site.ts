/** Central SEO + social copy — English (US), brand ACOPAY. */
export const SITE = {
  name: "ACOPAY",
  tagline: "Pay your way",
  url: "https://Acopay.net",
  locale: "en_US",
  language: "en-US",
  region: "US",
  email: "contact@Acopay.net",
  themeColor: "#0c1017",
  twitterHandle: "", // add @handle when official X account exists
  ogImage: "https://acopay.net/assets/og-card.png?v=20260728i",
  ogImageAlt: "ACOPAY — Pay your way",
  defaultTitle: "ACOPAY — Pay your way",
  defaultDescription:
    "Solana payment utility (Token-2022).\nTrade ACOPAY/USDT on Raydium and Jupiter.",
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
    "Acopay.net",
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
    title: "Buy ACOPAY — Official USDT purchase",
    description: SITE.defaultDescription,
    path: "/buy",
  },
  "/pay": {
    title: "ACOPAY Wallet | Send & receive ACOPAY",
    description: SITE.defaultDescription,
    path: "/pay",
  },
  "/trade": {
    title: "ACOPAY Wallet | Send & receive ACOPAY",
    description: SITE.defaultDescription,
    path: "/pay",
  },
  "/markets": {
    title: "ACOPAY Markets | Transactions, Pools & Swap",
    description: SITE.defaultDescription,
    path: "/markets",
  },
  "/pools": {
    title: "ACOPAY Markets | Transactions, Pools & Swap",
    description: SITE.defaultDescription,
    path: "/markets",
  },
  "/token": {
    title: "ACOPAY Token Overview | Supply, Fee & Authorities",
    description: SITE.defaultDescription,
    path: "/token",
  },
  "/contract": {
    title: "ACOPAY Contract Address | Official Solana Mint",
    description: SITE.defaultDescription,
    path: "/contract",
  },
  "/roadmap": {
    title: "ACOPAY Roadmap | 2026–2030 Milestones",
    description: SITE.defaultDescription,
    path: "/roadmap",
  },
  "/faq": {
    title: "ACOPAY FAQ | Fees, Pool, Buying & Transfers",
    description: SITE.defaultDescription,
    path: "/faq",
  },
  "/download": {
    title: "Download ACOPAY Pay for Android | Acopay.net",
    description:
      "Get the official ACOPAY Pay Android app. Transfer and receive ACOPAY with your Telegram Pay wallet or your own self-custody wallet — ACOPAY covers the Solana network fee.",
    path: "/download",
  },
  "/link-wallet": {
    title: "Link Phantom to ACOPAY Telegram Pay",
    description: SITE.defaultDescription,
    path: "/link-wallet",
  },
  "/send": {
    title: "Approve ACOPAY transfer | Acopay.net",
    description: SITE.defaultDescription,
    path: "/send",
  },
};

export function absoluteUrl(path: string): string {
  if (path === "/") return `${SITE.url}/`;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
