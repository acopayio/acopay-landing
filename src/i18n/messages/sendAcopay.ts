/**
 * Full `sendAcopay` copy for every UI locale (EN base + VI full; others inherit EN).
 */
import type { Messages } from "./en";

type SendSection = Messages["sendAcopay"];
type Partials = Record<string, { sendAcopay: SendSection }>;

const enBase: SendSection = {
  kicker: "Telegram Pay",
  title: "Send ACOPAY with Phantom",
  intro:
    "Confirm the transfer from Telegram Pay, then sign with your linked Phantom wallet.\n\n" +
    "1. Connect the same Phantom address linked in the bot\n" +
    "2. Approve the ACOPAY transfer (SOL network fee is sponsored)\n" +
    "3. We confirm automatically in Telegram — open the bot to see the receipt",
  wrongBrowserTitle: "Use Chrome or Brave",
  wrongBrowserBody:
    "Phantom needs Google Chrome or Brave. Open this page in Chrome, then continue.",
  copyUrlChrome: "Copy page URL",
  urlCopied: "URL copied",
  mobileBody: "On mobile, open this page in the Phantom app to connect and sign.",
  missingParams: "Open this page from Telegram: confirm Send, then tap Sign with Phantom.",
  amountLabel: "Amount:",
  fromLabel: "From:",
  toLabel: "To:",
  expired: "This link expired. Run Send again in Telegram.",
  openInPhantom: "Continue in Phantom",
  connectSend: "Connect Phantom & send",
  waitingPhantom: "Waiting for Phantom…",
  sent: "Sent on-chain. Confirming in Telegram…",
  sentAndConfirmed: "Sent and confirmed in Telegram.",
  confirmingTg: "Confirming in Telegram…",
  tgDoneHint: "Check @AcopayNetwork_bot for the success receipt.",
  viewTx: "View transaction ↗",
  pasteHint:
    "Auto-confirm did not finish. Copy the command below and paste it into @AcopayNetwork_bot within 15 minutes.",
  copyPaysok: "Copy /paysok command",
  copied: "Copied",
  openTelegram: "Open Telegram Pay ↗",
  errMissing: "Missing send details. Confirm Send in Telegram first.",
  errExpired: "This link expired. Run Send again in Telegram.",
  errBadBrowser: "This browser cannot run Phantom. Open this page in Google Chrome.",
  errNoProviderMobile: "Phantom is not available here. Tap “Continue in Phantom” below.",
  errNoProviderDesktop: "Phantom extension not found. Install Phantom in Chrome, then try again.",
  errWrongWallet: "Wrong Phantom wallet. Connect {addr} (the address linked in Telegram).",
  errCancelled: "Transaction cancelled in Phantom.",
  errCopyLine: "Could not copy. Select the /paysok line manually.",
  errCopyUrl: "Could not copy URL. Select the address bar manually.",
  errConfirmTg: "On-chain send OK, but Telegram confirm failed: {detail}",
};

function L(p: Partial<SendSection> & Pick<SendSection, "title" | "intro" | "mobileBody">): {
  sendAcopay: SendSection;
} {
  return { sendAcopay: { ...enBase, ...p } };
}

export const SEND_ACOPAY_PARTIALS: Partials = {
  en: { sendAcopay: enBase },

  vi: L({
    title: "Gửi ACOPAY bằng Phantom",
    intro:
      "Xác nhận chuyển từ Telegram Pay, rồi ký bằng ví Phantom đã liên kết.\n\n" +
      "1. Kết nối đúng địa chỉ Phantom đã liên kết trong bot\n" +
      "2. Duyệt giao dịch ACOPAY (phí mạng SOL do hệ thống trả)\n" +
      "3. Hệ thống tự xác nhận trên Telegram — mở bot để xem biên lai",
    wrongBrowserTitle: "Dùng Chrome hoặc Brave",
    wrongBrowserBody:
      "Phantom cần Google Chrome hoặc Brave. Hãy mở trang này bằng Chrome rồi tiếp tục.",
    copyUrlChrome: "Sao chép URL trang",
    urlCopied: "Đã sao chép URL",
    mobileBody: "Trên điện thoại, mở trang này trong ứng dụng Phantom để kết nối và ký.",
    missingParams: "Mở trang này từ Telegram: xác nhận Gửi, rồi bấm Ký bằng Phantom.",
    amountLabel: "Số tiền:",
    fromLabel: "Từ:",
    toLabel: "Tới:",
    expired: "Link đã hết hạn. Chạy lại Gửi trong Telegram.",
    openInPhantom: "Tiếp tục trong Phantom",
    connectSend: "Kết nối Phantom & gửi",
    waitingPhantom: "Đang chờ Phantom…",
    sent: "Đã gửi on-chain. Đang xác nhận trên Telegram…",
    sentAndConfirmed: "Đã gửi và xác nhận trên Telegram.",
    confirmingTg: "Đang xác nhận trên Telegram…",
    tgDoneHint: "Mở @AcopayNetwork_bot để xem biên lai thành công.",
    viewTx: "Xem giao dịch ↗",
    pasteHint:
      "Tự xác nhận chưa xong. Sao chép lệnh bên dưới và dán vào @AcopayNetwork_bot trong vòng 15 phút.",
    copyPaysok: "Sao chép lệnh /paysok",
    copied: "Đã sao chép",
    openTelegram: "Mở Telegram Pay ↗",
    errMissing: "Thiếu thông tin gửi. Xác nhận Gửi trong Telegram trước.",
    errExpired: "Link đã hết hạn. Chạy lại Gửi trong Telegram.",
    errBadBrowser: "Trình duyệt này không chạy được Phantom. Mở trang này bằng Google Chrome.",
    errNoProviderMobile: "Không thấy Phantom ở đây. Bấm “Tiếp tục trong Phantom” bên dưới.",
    errNoProviderDesktop: "Không thấy tiện ích Phantom. Cài Phantom trên Chrome rồi thử lại.",
    errWrongWallet: "Sai ví Phantom. Hãy kết nối {addr} (địa chỉ đã liên kết trong Telegram).",
    errCancelled: "Đã hủy giao dịch trong Phantom.",
    errCopyLine: "Không sao chép được. Hãy chọn dòng /paysok thủ công.",
    errCopyUrl: "Không sao chép được URL. Hãy chọn thanh địa chỉ thủ công.",
    errConfirmTg: "Gửi on-chain OK, nhưng xác nhận Telegram lỗi: {detail}",
  }),
};
