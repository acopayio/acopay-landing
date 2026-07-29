/**
 * Web Pay `/pay` — EN base in en.ts; VI (+ later locales) here.
 */
import type { Messages } from "./en";

type PaySection = Messages["payApp"];
type Partials = Record<string, { payApp: PaySection; nav?: { pay?: string } }>;

const enBase: PaySection = {
  kicker: "Telegram Pay",
  title: "ACOPAY Pay",
  subtitle: "Send and receive ACOPAY with your Telegram Pay wallet — no Phantom required.",
  loading: "Loading…",
  loginHint: "Sign in with the same Telegram account you use for @AcopayNetwork_bot.",
  openTelegram: "Open Telegram to sign in",
  waitingTelegram: "Waiting for Telegram…",
  pollingHint: "Confirm in Telegram, then return here.",
  openAgain: "Open bot again",
  balanceLabel: "Balance",
  tgId: "Telegram ID",
  logout: "Sign out",
  needWalletTitle: "Create your Telegram Pay wallet",
  needWalletBody: "Open the bot, create a wallet, then refresh this page.",
  openBotWallet: "Open Telegram Pay",
  walletLabel: "Your Telegram Pay address",
  copy: "Copy",
  copied: "Copied",
  send: "Send",
  receive: "Receive",
  history: "History",
  buy: "Buy",
  comingSoon: "Coming in the next update",
  mintLabel: "Official mint:",
  noPhantom: "Signed in with Telegram Pay — no Phantom needed",
  errExpired: "Login expired. Try again.",
  errCopy: "Could not copy. Select the address manually.",
  openPayCta: "Open ACOPAY Pay",
  openPayCtaHint: "Your balance, send, and receive — Telegram wallet.",
};

export const PAY_APP_PARTIALS: Partials = {
  vi: {
    nav: { pay: "Pay" },
    payApp: {
      ...enBase,
      subtitle: "Gửi và nhận ACOPAY bằng ví Telegram Pay — không cần Phantom.",
      loading: "Đang tải…",
      loginHint: "Đăng nhập bằng cùng tài khoản Telegram dùng với @AcopayNetwork_bot.",
      openTelegram: "Mở Telegram để đăng nhập",
      waitingTelegram: "Đang chờ Telegram…",
      pollingHint: "Xác nhận trong Telegram, rồi quay lại đây.",
      openAgain: "Mở bot lại",
      balanceLabel: "Số dư",
      tgId: "ID Telegram",
      logout: "Đăng xuất",
      needWalletTitle: "Tạo ví Telegram Pay",
      needWalletBody: "Mở bot, tạo ví, rồi tải lại trang này.",
      openBotWallet: "Mở Telegram Pay",
      walletLabel: "Địa chỉ ví Telegram Pay",
      copy: "Sao chép",
      copied: "Đã sao chép",
      send: "Gửi",
      receive: "Nhận",
      history: "Lịch sử",
      buy: "Mua",
      comingSoon: "Sắp có ở bản cập nhật tiếp",
      mintLabel: "Mint chính thức:",
      noPhantom: "Đã đăng nhập Telegram Pay — không cần Phantom",
      errExpired: "Đăng nhập hết hạn. Thử lại.",
      errCopy: "Không sao chép được. Hãy chọn địa chỉ thủ công.",
      openPayCta: "Mở ACOPAY Pay",
      openPayCtaHint: "Số dư, gửi và nhận — ví Telegram.",
    },
  },
};
