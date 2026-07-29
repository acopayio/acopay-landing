/**
 * Web `/pay` — EN in en.ts; VI here.
 */
import type { Messages } from "./en";

type PaySection = Messages["payApp"];
type Partials = Record<string, { payApp: PaySection; nav?: { pay?: string } }>;

const enBase: PaySection = {
  kicker: "Pay",
  title: "Wallet",
  subtitle: "",
  loading: "Loading…",
  loginHint: "Sign in with Telegram to open your ACOPAY wallet.",
  openTelegram: "Continue with Telegram",
  waitingTelegram: "Waiting for confirmation…",
  pollingHint: "Confirm in Telegram, then return here.",
  openAgain: "Open Telegram again",
  balanceLabel: "Balance",
  tgId: "Telegram",
  logout: "Sign out",
  needWalletTitle: "Wallet not ready",
  needWalletBody: "Open @AcopayNetwork_bot to create your wallet, then come back here.",
  openBotWallet: "Open Telegram bot",
  walletLabel: "Address",
  copy: "Copy",
  copied: "Copied",
  send: "Send",
  receive: "Receive",
  history: "History",
  buy: "Buy",
  comingSoon: "",
  mintLabel: "Token",
  noPhantom: "",
  errExpired: "Session expired. Please sign in again.",
  errCopy: "Could not copy address.",
  openPayCta: "Open Wallet",
  openPayCtaHint: "",
};

export const PAY_APP_PARTIALS: Partials = {
  vi: {
    nav: { pay: "Pay" },
    payApp: {
      ...enBase,
      title: "Ví",
      loading: "Đang tải…",
      loginHint: "Đăng nhập Telegram để mở ví ACOPAY.",
      openTelegram: "Tiếp tục với Telegram",
      waitingTelegram: "Đang chờ xác nhận…",
      pollingHint: "Xác nhận trong Telegram, rồi quay lại đây.",
      openAgain: "Mở Telegram lại",
      balanceLabel: "Số dư",
      tgId: "Telegram",
      logout: "Đăng xuất",
      needWalletTitle: "Chưa có ví",
      needWalletBody: "Mở @AcopayNetwork_bot để tạo ví, rồi quay lại trang này.",
      openBotWallet: "Mở bot Telegram",
      walletLabel: "Địa chỉ",
      copy: "Sao chép",
      copied: "Đã sao chép",
      send: "Gửi",
      receive: "Nhận",
      history: "Lịch sử",
      buy: "Mua",
      mintLabel: "Token",
      errExpired: "Phiên đã hết hạn. Vui lòng đăng nhập lại.",
      errCopy: "Không sao chép được địa chỉ.",
      openPayCta: "Mở ví",
    },
  },
};
