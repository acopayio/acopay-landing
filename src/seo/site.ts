import {

  COIN_ORIGIN,

  WALLET_EMAIL,

  getSiteOrigin,

  isWalletProfile,

} from "../config/siteIdentity";



/** Central SEO + social copy — English (US), brand ACOPAY. */

export const SITE = {

  name: "ACOPAY",

  tagline: "Pay your way",

  /** Phase A: coin canonical = acopay.org; runtime may be .net via getSiteOrigin(). */

  url: COIN_ORIGIN,

  locale: "en_US",

  language: "en-US",

  region: "US",

  email: WALLET_EMAIL,

  themeColor: "#0c1017",

  twitterHandle: "", // add @handle when official X account exists

  /** Coin host social card (token). */
  ogImagePathCoin: "/assets/og-card.png?v=20260728i",

  /** Wallet host social card — real app screenshot (Phase 2 acceptance). */
  ogImagePathWallet: "/assets/og-wallet.png?v=20260822a",

  /** @deprecated Prefer ogImagePathWallet / ogImagePathCoin. */
  ogImagePath: "/assets/og-wallet.png?v=20260822a",

  ogImageAltWallet: "ACOPAY Wallet — non-custodial Solana wallet on acopay.net",

  ogImageAltCoin: "ACOPAY — Pay your way",

  ogImageAlt: "ACOPAY Wallet — non-custodial Solana wallet on acopay.net",

  defaultTitle: "ACOPAY — Pay your way",

  defaultDescription:

    "Non-custodial Solana wallet. Keys stay on your device. Send and receive ACOPAY, USDT, SOL, and SPL tokens.",

  /** Wallet host (.net) — no Token-2022 / markets bleed. */

  keywordsWallet: [

    "ACOPAY",

    "ACOPAY Wallet",

    "Pay your way",

    "Solana wallet",

    "non-custodial wallet",

    "mobile wallet",

    "send receive crypto",

    "Acopay.net",

  ],

  /** Coin host (.org) — token / markets vocabulary OK. */

  keywordsCoin: [

    "ACOPAY",

    "Pay your way",

    "Solana",

    "Token-2022",

    "non-custodial wallet",

    "payment utility",

    "wallet to wallet",

    "SPL token",

    "Acopay.org",

  ],

  /** @deprecated Prefer keywordsWallet / keywordsCoin — kept for callers. */

  keywords: [

    "ACOPAY",

    "Pay your way",

    "Solana",

    "non-custodial wallet",

    "payment utility",

    "wallet to wallet",

    "SPL token",

    "Acopay.net",

  ],

  hashtagsWallet: [

    "#ACOPAY",

    "#PayYourWay",

    "#Solana",

    "#NonCustodial",

    "#CryptoWallet",

    "#Web3",

  ],

  hashtagsCoin: [

    "#ACOPAY",

    "#PayYourWay",

    "#Solana",

    "#Token2022",

    "#NonCustodial",

    "#CryptoWallet",

    "#Web3",

  ],

  hashtags: [

    "#ACOPAY",

    "#PayYourWay",

    "#Solana",

    "#NonCustodial",

    "#CryptoWallet",

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

  "/markets": {

    title: "ACOPAY Markets | On-chain transfers",

    description: SITE.defaultDescription,

    path: "/markets",

  },

  "/pools": {

    title: "ACOPAY Markets | On-chain transfers",

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

    title: "ACOPAY FAQ | Wallet & transfers",

    description: SITE.defaultDescription,

    path: "/faq",

  },

  "/support": {

    title: "ACOPAY Support | Non-custodial wallet help",

    description:

      "Contact ACOPAY support for the non-custodial Solana wallet app. Email help, recovery guidance, privacy and terms links.",

    path: "/support",

  },

  "/download": {

    title: "Get ACOPAY | Android Beta and iOS TestFlight | Acopay.net",

    description:

      "Download ACOPAY Android Beta as a direct APK, or use iOS TestFlight. Google Play and App Store listings are separate and not live yet.",

    path: "/download",

  },

};



export function siteUrl(): string {

  return getSiteOrigin();

}



export function ogImagePathForProfile(): string {
  return isWalletProfile() ? SITE.ogImagePathWallet : SITE.ogImagePathCoin;
}

export function ogImageAltForProfile(): string {
  return isWalletProfile() ? SITE.ogImageAltWallet : SITE.ogImageAltCoin;
}

export function ogImageUrl(): string {
  return `${getSiteOrigin()}${ogImagePathForProfile()}`;
}



export function absoluteUrl(path: string): string {

  const origin = getSiteOrigin();

  if (path === "/") return `${origin}/`;

  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;

}


