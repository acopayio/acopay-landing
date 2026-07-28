/**
 * Full `sendAcopay` copy for every UI locale (EN base + VI full; others inherit EN).
 */
import type { Messages } from "./en";

type SendSection = Messages["sendAcopay"];
type Partials = Record<string, { sendAcopay: SendSection }>;

const enBase: SendSection = {
  kicker: "Telegram Pay",
  title: "🔐 Sign ACOPAY send",
  intro: "Use your linked Phantom — SOL network fee is sponsored.",
  step1: "Connect the Phantom wallet linked in the bot",
  step2: "Approve the ACOPAY transfer",
  step3: "Telegram Pay confirms success automatically",
  wrongBrowserTitle: "Use Chrome or Brave",
  wrongBrowserBody:
    "Phantom needs Google Chrome or Brave. Open this page in Chrome, then continue.",
  copyUrlChrome: "Copy page URL",
  urlCopied: "URL copied",
  mobileBody: "Open this page in the Phantom app to connect and sign.",
  missingParams: "Open this page from Telegram after tapping Approve in Phantom.",
  amountLabel: "Amount",
  fromLabel: "From",
  toLabel: "To",
  expired: "This link expired. Run Send again in Telegram.",
  openInPhantom: "🔐 Approve in Phantom",
  connectSend: "🔐 Connect Phantom & approve",
  waitingPhantom: "Waiting for Phantom…",
  sent: "Sent on-chain. Confirming in Telegram…",
  sentAndConfirmed: "Sent and confirmed in Telegram.",
  confirmingTg: "Confirming in Telegram…",
  tgDoneHint: "Check @AcopayNetwork_bot for the success receipt.",
  viewTx: "View transaction ↗",
  pasteHint: "Telegram hasn’t confirmed yet. Copy the command below and paste it into @AcopayNetwork_bot.",
  copyPaysok: "Copy /paysok command",
  copied: "Copied",
  openTelegram: "Open Telegram Pay ↗",
  errMissing: "Missing send details. Confirm Send in Telegram first.",
  errExpired: "This link expired. Run Send again in Telegram.",
  errBadBrowser: "This browser cannot run Phantom. Open this page in Google Chrome.",
  errNoProviderMobile: "Phantom is not available here. Tap “Approve in Phantom” below.",
  errNoProviderDesktop: "Phantom extension not found. Install Phantom in Chrome, then try again.",
  errWrongWallet: "Wrong Phantom wallet. Connect {addr} (the address linked in Telegram).",
  errCancelled: "Transaction cancelled in Phantom.",
  errCopyLine: "Could not copy. Select the /paysok line manually.",
  errCopyUrl: "Could not copy URL. Select the address bar manually.",
  errConfirmTg: "On-chain send OK, but Telegram confirm failed: {detail}",
};

function L(p: Partial<SendSection> & Pick<SendSection, "title" | "intro" | "step1" | "step2" | "step3" | "mobileBody">): {
  sendAcopay: SendSection;
} {
  return { sendAcopay: { ...enBase, ...p } };
}

export const SEND_ACOPAY_PARTIALS: Partials = {
  en: { sendAcopay: enBase },

  vi: L({
    title: "🔐 Ký gửi ACOPAY",
    intro: "Dùng Phantom đã liên kết — phí SOL do hệ thống trả.",
    step1: "Kết nối đúng ví Phantom đã liên kết trong bot",
    step2: "Duyệt giao dịch ACOPAY",
    step3: "Telegram Pay tự báo chuyển thành công",
    wrongBrowserTitle: "Dùng Chrome hoặc Brave",
    wrongBrowserBody:
      "Phantom cần Google Chrome hoặc Brave. Hãy mở trang này bằng Chrome rồi tiếp tục.",
    copyUrlChrome: "Sao chép URL trang",
    urlCopied: "Đã sao chép URL",
    mobileBody: "Mở trang này trong app Phantom để kết nối và ký.",
    missingParams: "Mở trang này từ Telegram sau khi bấm Ký duyệt trên Phantom.",
    amountLabel: "Số tiền",
    fromLabel: "Từ",
    toLabel: "Tới",
    expired: "Link đã hết hạn. Chạy lại Gửi trong Telegram.",
    openInPhantom: "🔐 Ký duyệt trên Phantom",
    connectSend: "🔐 Kết nối Phantom & ký duyệt",
    waitingPhantom: "Đang chờ Phantom…",
    sent: "Đã gửi on-chain. Đang xác nhận trên Telegram…",
    sentAndConfirmed: "Đã gửi và xác nhận trên Telegram.",
    confirmingTg: "Đang xác nhận trên Telegram…",
    tgDoneHint: "Mở @AcopayNetwork_bot để xem biên lai thành công.",
    viewTx: "Xem giao dịch ↗",
    pasteHint: "Telegram chưa xác nhận. Sao chép lệnh dưới đây, dán vào @AcopayNetwork_bot.",
    copyPaysok: "Sao chép lệnh /paysok",
    copied: "Đã sao chép",
    openTelegram: "Mở Telegram Pay ↗",
    errMissing: "Thiếu thông tin gửi. Xác nhận Gửi trong Telegram trước.",
    errExpired: "Link đã hết hạn. Chạy lại Gửi trong Telegram.",
    errBadBrowser: "Trình duyệt này không chạy được Phantom. Mở trang này bằng Google Chrome.",
    errNoProviderMobile: "Không thấy Phantom ở đây. Bấm “Ký duyệt trên Phantom” bên dưới.",
    errNoProviderDesktop: "Không thấy tiện ích Phantom. Cài Phantom trên Chrome rồi thử lại.",
    errWrongWallet: "Sai ví Phantom. Hãy kết nối {addr} (địa chỉ đã liên kết trong Telegram).",
    errCancelled: "Đã hủy giao dịch trong Phantom.",
    errCopyLine: "Không sao chép được. Hãy chọn dòng /paysok thủ công.",
    errCopyUrl: "Không sao chép được URL. Hãy chọn thanh địa chỉ thủ công.",
    errConfirmTg: "Gửi on-chain OK, nhưng xác nhận Telegram lỗi: {detail}",
  }),
};
