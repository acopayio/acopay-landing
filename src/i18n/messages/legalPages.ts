/**
 * Privacy / Terms / Delete-account — every supported locale.
 *
 * Same shape as `downloadPage.ts`: an English base spread into each locale by `L()`,
 * so a key added to `en.ts` can never be silently missing anywhere.
 */
import type { Messages } from "./en";

type LegalSection = Messages["legal"];
type Partials = Record<string, { legal: LegalSection }>;

const enBase: LegalSection = {
  privacyTitle: "Privacy Policy",
  termsTitle: "Terms of Service",
  deleteTitle: "Delete account & data",
  lastUpdated: "Last updated: 2 August 2026",
  privacyIntro:
    "This Privacy Policy describes how ACOPAY (“we”, “us”) handles information when you use acopay.net and the ACOPAY mobile wallet application (the “Services”).",
  privacyH1: "1. Product summary",
  privacyP1:
    "ACOPAY provides a non-custodial Solana wallet experience: you can create or import a wallet, view balances, and transfer SPL tokens (including ACOPAY, USDT, SOL, and other tokens you add). Recovery phrases and private keys stay on your device and are not collected by ACOPAY.",
  privacyH2: "2. Data we process",
  privacyLi1Label: "Wallet public addresses",
  privacyLi1Rest: " — needed to quote fees, build, simulate, and broadcast transfers you request.",
  privacyLi2Label: "Transaction metadata",
  privacyLi2Rest:
    " — amounts, recipient addresses or usernames you enter, signatures, and confirmation status when you use ACOPAY-sponsored transfer APIs.",
  privacyLi3Label: "Technical logs",
  privacyLi3Rest:
    " — standard web/server logs (IP, user agent, timestamps) for security and abuse prevention.",
  privacyLi4Label: "Optional contact",
  privacyLi4Before: " — if you email ",
  privacyLi4After: ", we process the content of that correspondence.",
  privacyH3: "3. Data we do not collect",
  privacyP3:
    "We do not collect your seed phrase, private key, or biometric templates. Biometric unlock (Face ID / fingerprint), if enabled, is handled by your device OS.",
  privacyH4: "4. On-chain data",
  privacyP4:
    "Transfers you confirm are recorded on the Solana public blockchain. Blockchain data is public and outside ACOPAY’s control once broadcast.",
  privacyH5: "5. Third parties",
  privacyP5:
    "We use infrastructure providers (hosting, CDN, RPC endpoints) to operate the Services. We do not sell personal data. We do not use advertising SDKs in the mobile app as of this date.",
  privacyH6: "6. Retention",
  privacyP6:
    "Server-side session and operational logs are retained only as long as needed for security, support, and legal obligations, then deleted or anonymized.",
  privacyH7: "7. Your choices",
  privacyP7Before:
    "You may stop using the Services at any time, uninstall the app, and wipe local wallet data from your device. See ",
  privacyP7After: ".",
  privacyH8: "8. Contact",
  privacyContact: "Questions:",
  termsIntro:
    "By using acopay.net or the ACOPAY mobile wallet (“Services”), you agree to these Terms. If you do not agree, do not use the Services.",
  termsH1: "1. Nature of the Services",
  termsP1:
    "ACOPAY is a non-custodial wallet and transfer utility for Solana tokens. We do not operate an exchange, do not custody your keys, and do not guarantee token prices or investment returns. The Services are not financial advice.",
  termsH2: "2. Your responsibilities",
  termsLi1: "You are solely responsible for securing your recovery phrase and private keys.",
  termsLi2: "You are responsible for verifying recipient addresses before transferring.",
  termsLi3: "You must comply with laws that apply to you (including crypto regulations).",
  termsLi4: "You must be at least 18 years old to use the Services.",
  termsH3: "3. Network fees",
  termsP3:
    "For supported ACOPAY transfers through ACOPAY’s sponsored flow, Solana network (gas) fees may be paid by ACOPAY/operator as disclosed in-product. For other tokens (for example USDT, SOL, or custom SPL tokens), you pay network fees from your wallet. Token transfer fees (for example the ACOPAY 0.01% on-chain fee) are separate from Solana gas and follow on-chain program rules.",
  termsH4: "4. No custody; risk of loss",
  termsP4:
    "If you lose your recovery phrase or device without a backup, your assets may be permanently unrecoverable. Blockchain transactions are irreversible once confirmed.",
  termsH5: "5. Prohibited use",
  termsP5:
    "You may not use the Services for unlawful activity, fraud, sanctions evasion, or abuse of infrastructure (spam, attacks, reverse engineering for harm).",
  termsH6: "6. Disclaimer",
  termsP6:
    "THE SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACOPAY IS NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, OR FOR LOSSES ARISING FROM USER ERROR, BLOCKCHAIN FAILURES, OR THIRD-PARTY SERVICES.",
  termsH7: "7. Changes",
  termsP7:
    "We may update these Terms. Continued use after changes constitutes acceptance of the updated Terms. Material changes will be reflected by updating the date above.",
  termsH8: "8. Contact",
  deleteIntro:
    "Google Play and App Store require a public deletion path that does not require installing the app. Last updated: 2 August 2026",
  deleteHWhat: "What “account” means here",
  deletePWhat:
    "The ACOPAY mobile wallet is non-custodial. Your keys live on your device. There is no central login account that holds your funds. Deletion means removing local wallet data and any server-side sessions / operational data tied to addresses you used with ACOPAY APIs.",
  deleteHA: "A. Delete data on your device (instant)",
  deleteA1: "Open the ACOPAY app → tap the ACOPAY logo → Sign out.",
  deleteA2: "Uninstall the app from your device.",
  deleteA3:
    "Optional: clear app storage / SecureStore before uninstall if your OS provides that control.",
  deleteWarnLabel: "Warning:",
  deleteWarn:
    " If you have not backed up your recovery phrase, signing out or uninstalling may make your funds unrecoverable.",
  deleteHB: "B. Request server-side deletion",
  deleteEmailBefore: "Email ",
  deleteEmailMid: " with subject ",
  deleteSubject: "Delete ACOPAY data",
  deleteEmailAfter: " and include:",
  deleteLi1: "Your Solana wallet address(es) used with ACOPAY",
  deleteLi2: "Approximate dates of use (if known)",
  deleteP2:
    "We will delete or anonymize associated session records and support correspondence within 30 days, except data we must retain for legal or security reasons, and except public blockchain records which cannot be deleted.",
  deleteHRelated: "Related",
};

function L(p: Partial<LegalSection>): Partials[string] {
  return { legal: { ...enBase, ...p } };
}

export const LEGAL_PAGE_PARTIALS: Partials = {
  vi: L({
    privacyTitle: "Chính sách quyền riêng tư",
    termsTitle: "Điều khoản dịch vụ",
    deleteTitle: "Xóa tài khoản & dữ liệu",
    lastUpdated: "Cập nhật lần cuối: 2 tháng 8 năm 2026",
    privacyIntro:
      "Chính sách quyền riêng tư này mô tả cách ACOPAY (\"chúng tôi\") xử lý thông tin khi bạn sử dụng acopay.net và ứng dụng ví di động ACOPAY (\"Dịch vụ\").",
    privacyH1: "1. Tóm tắt sản phẩm",
    privacyP1:
      "ACOPAY cung cấp trải nghiệm ví Solana không lưu ký: bạn có thể tạo hoặc nhập ví, xem số dư và chuyển các token SPL (bao gồm ACOPAY, USDT, SOL và các token khác bạn thêm vào). Cụm từ khôi phục và private key luôn nằm trên thiết bị của bạn, ACOPAY không thu thập.",
    privacyH2: "2. Dữ liệu chúng tôi xử lý",
    privacyLi1Label: "Địa chỉ ví công khai",
    privacyLi1Rest: " — cần để báo phí, tạo, mô phỏng và phát các giao dịch chuyển bạn yêu cầu.",
    privacyLi2Label: "Siêu dữ liệu giao dịch",
    privacyLi2Rest:
      " — số tiền, địa chỉ hoặc username người nhận bạn nhập, chữ ký và trạng thái xác nhận khi bạn dùng API chuyển tiền do ACOPAY tài trợ.",
    privacyLi3Label: "Nhật ký kỹ thuật",
    privacyLi3Rest:
      " — nhật ký web/server tiêu chuẩn (IP, user agent, thời gian) để bảo mật và ngăn lạm dụng.",
    privacyLi4Label: "Liên hệ tùy chọn",
    privacyLi4Before: " — nếu bạn gửi email tới ",
    privacyLi4After: ", chúng tôi xử lý nội dung của email đó.",
    privacyH3: "3. Dữ liệu chúng tôi không thu thập",
    privacyP3:
      "Chúng tôi không thu thập cụm từ khôi phục (seed phrase), private key hay mẫu sinh trắc học của bạn. Mở khóa sinh trắc học (Face ID / vân tay), nếu bật, do hệ điều hành thiết bị của bạn xử lý.",
    privacyH4: "4. Dữ liệu on-chain",
    privacyP4:
      "Các giao dịch bạn xác nhận được ghi lại trên blockchain công khai Solana. Dữ liệu blockchain là công khai và nằm ngoài tầm kiểm soát của ACOPAY sau khi đã phát lên mạng.",
    privacyH5: "5. Bên thứ ba",
    privacyP5:
      "Chúng tôi dùng các nhà cung cấp hạ tầng (hosting, CDN, endpoint RPC) để vận hành Dịch vụ. Chúng tôi không bán dữ liệu cá nhân. Tính đến thời điểm này, chúng tôi không dùng SDK quảng cáo trong ứng dụng di động.",
    privacyH6: "6. Lưu trữ dữ liệu",
    privacyP6:
      "Nhật ký phiên và vận hành phía server chỉ được lưu trong thời gian cần thiết cho mục đích bảo mật, hỗ trợ và nghĩa vụ pháp lý, sau đó bị xóa hoặc ẩn danh.",
    privacyH7: "7. Lựa chọn của bạn",
    privacyP7Before:
      "Bạn có thể ngừng sử dụng Dịch vụ bất kỳ lúc nào, gỡ ứng dụng và xóa dữ liệu ví cục bộ khỏi thiết bị. Xem ",
    privacyP7After: ".",
    privacyH8: "8. Liên hệ",
    privacyContact: "Thắc mắc:",
    termsIntro:
      "Khi sử dụng acopay.net hoặc ví di động ACOPAY (\"Dịch vụ\"), bạn đồng ý với các Điều khoản này. Nếu không đồng ý, vui lòng không sử dụng Dịch vụ.",
    termsH1: "1. Bản chất của Dịch vụ",
    termsP1:
      "ACOPAY là ví không lưu ký và công cụ chuyển tiền cho token Solana. Chúng tôi không vận hành sàn giao dịch, không giữ key của bạn và không đảm bảo giá token hay lợi nhuận đầu tư. Dịch vụ không phải là tư vấn tài chính.",
    termsH2: "2. Trách nhiệm của bạn",
    termsLi1: "Bạn hoàn toàn chịu trách nhiệm bảo mật cụm từ khôi phục và private key của mình.",
    termsLi2: "Bạn có trách nhiệm xác minh địa chỉ người nhận trước khi chuyển tiền.",
    termsLi3: "Bạn phải tuân thủ luật pháp áp dụng cho mình (bao gồm quy định về tiền mã hóa).",
    termsLi4: "Bạn phải từ 18 tuổi trở lên để sử dụng Dịch vụ.",
    termsH3: "3. Phí mạng",
    termsP3:
      "Với các giao dịch ACOPAY được hỗ trợ qua luồng tài trợ của ACOPAY, phí mạng Solana (gas) có thể do ACOPAY/operator chi trả như đã công bố trong sản phẩm. Với các token khác (ví dụ USDT, SOL hoặc token SPL tùy chỉnh), bạn tự trả phí mạng từ ví của mình. Phí chuyển token (ví dụ phí on-chain 0,01% của ACOPAY) tách biệt với phí gas Solana và tuân theo quy tắc của chương trình on-chain.",
    termsH4: "4. Không lưu ký; rủi ro mất tài sản",
    termsP4:
      "Nếu bạn mất cụm từ khôi phục hoặc mất thiết bị mà không có bản sao lưu, tài sản của bạn có thể vĩnh viễn không khôi phục được. Giao dịch blockchain không thể đảo ngược sau khi đã xác nhận.",
    termsH5: "5. Hành vi bị cấm",
    termsP5:
      "Bạn không được dùng Dịch vụ cho hoạt động bất hợp pháp, gian lận, né tránh lệnh trừng phạt, hoặc lạm dụng hạ tầng (spam, tấn công, reverse engineering nhằm gây hại).",
    termsH6: "6. Miễn trừ trách nhiệm",
    termsP6:
      "DỊCH VỤ ĐƯỢC CUNG CẤP \"NGUYÊN TRẠNG\" (AS IS) KHÔNG BẢO ĐẢM DƯỚI BẤT KỲ HÌNH THỨC NÀO. TRONG PHẠM VI TỐI ĐA PHÁP LUẬT CHO PHÉP, ACOPAY KHÔNG CHỊU TRÁCH NHIỆM VỀ THIỆT HẠI GIÁN TIẾP, NGẪU NHIÊN HAY HỆ QUẢ, HOẶC TỔN THẤT PHÁT SINH TỪ LỖI NGƯỜI DÙNG, SỰ CỐ BLOCKCHAIN, HOẶC DỊCH VỤ BÊN THỨ BA.",
    termsH7: "7. Thay đổi",
    termsP7:
      "Chúng tôi có thể cập nhật các Điều khoản này. Việc tiếp tục sử dụng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận Điều khoản đã cập nhật. Thay đổi quan trọng sẽ được thể hiện bằng cách cập nhật ngày ở trên.",
    termsH8: "8. Liên hệ",
    deleteIntro:
      "Google Play và App Store yêu cầu một cách xóa công khai không cần cài ứng dụng. Cập nhật lần cuối: 2 tháng 8 năm 2026",
    deleteHWhat: "\"Tài khoản\" ở đây nghĩa là gì",
    deletePWhat:
      "Ví di động ACOPAY không lưu ký. Key của bạn nằm trên thiết bị của bạn. Không có tài khoản đăng nhập trung tâm nào giữ tiền của bạn. Xóa nghĩa là gỡ dữ liệu ví cục bộ và mọi phiên/dữ liệu vận hành phía server gắn với địa chỉ bạn đã dùng với API của ACOPAY.",
    deleteHA: "A. Xóa dữ liệu trên thiết bị của bạn (tức thì)",
    deleteA1: "Mở ứng dụng ACOPAY → nhấn logo ACOPAY → Đăng xuất.",
    deleteA2: "Gỡ ứng dụng khỏi thiết bị của bạn.",
    deleteA3: "Tùy chọn: xóa bộ nhớ ứng dụng / SecureStore trước khi gỡ nếu hệ điều hành của bạn cho phép.",
    deleteWarnLabel: "Cảnh báo:",
    deleteWarn:
      " Nếu bạn chưa sao lưu cụm từ khôi phục, việc đăng xuất hoặc gỡ ứng dụng có thể khiến tài sản của bạn không thể khôi phục.",
    deleteHB: "B. Yêu cầu xóa dữ liệu phía server",
    deleteEmailBefore: "Gửi email tới ",
    deleteEmailMid: " với tiêu đề ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " và bao gồm:",
    deleteLi1: "(Các) địa chỉ ví Solana bạn đã dùng với ACOPAY",
    deleteLi2: "Thời gian sử dụng gần đúng (nếu biết)",
    deleteP2:
      "Chúng tôi sẽ xóa hoặc ẩn danh các bản ghi phiên và email hỗ trợ liên quan trong vòng 30 ngày, trừ dữ liệu chúng tôi buộc phải lưu vì lý do pháp lý hoặc bảo mật, và trừ các bản ghi công khai trên blockchain không thể xóa được.",
    deleteHRelated: "Liên quan",
  }),

  zh: L({
    privacyTitle: "隐私政策",
    termsTitle: "服务条款",
    deleteTitle: "删除账户与数据",
    lastUpdated: "最后更新：2026年8月2日",
    privacyIntro:
      "本隐私政策说明当你使用 acopay.net 和 ACOPAY 移动钱包应用（下称“服务”）时，ACOPAY（“我们”）如何处理信息。",
    privacyH1: "1. 产品概述",
    privacyP1:
      "ACOPAY 提供非托管的 Solana 钱包体验：你可以创建或导入钱包，查看余额，并转账 SPL 代币（包括 ACOPAY、USDT、SOL 及你添加的其他代币）。助记词和私钥始终保存在你的设备上，ACOPAY 不会收集。",
    privacyH2: "2. 我们处理的数据",
    privacyLi1Label: "钱包公开地址",
    privacyLi1Rest: "——用于报价手续费、构建、模拟并广播你请求的转账。",
    privacyLi2Label: "交易元数据",
    privacyLi2Rest:
      "——当你使用 ACOPAY 赞助的转账接口时，包括金额、你输入的收款地址或用户名、签名以及确认状态。",
    privacyLi3Label: "技术日志",
    privacyLi3Rest: "——标准的 Web/服务器日志（IP、用户代理、时间戳），用于安全与防滥用。",
    privacyLi4Label: "可选联系方式",
    privacyLi4Before: "——如果你发送邮件至 ",
    privacyLi4After: "，我们会处理该邮件的内容。",
    privacyH3: "3. 我们不收集的数据",
    privacyP3:
      "我们不会收集你的助记词、私钥或生物识别模板。若已启用，生物识别解锁（Face ID / 指纹）由你的设备操作系统处理。",
    privacyH4: "4. 链上数据",
    privacyP4: "你确认的转账会记录在 Solana 公开区块链上。区块链数据一旦广播即为公开信息，不受 ACOPAY 控制。",
    privacyH5: "5. 第三方",
    privacyP5:
      "我们使用基础设施提供商（托管、CDN、RPC 节点）来运营服务。我们不出售个人数据。截至目前，我们在移动应用中不使用广告 SDK。",
    privacyH6: "6. 数据保留",
    privacyP6:
      "服务器端会话与运营日志仅在安全、支持及法律义务所需的期限内保留，之后会被删除或匿名化处理。",
    privacyH7: "7. 你的选择",
    privacyP7Before: "你可以随时停止使用服务、卸载应用，并清除设备上的本地钱包数据。详见 ",
    privacyP7After: "。",
    privacyH8: "8. 联系方式",
    privacyContact: "如有疑问：",
    termsIntro:
      "使用 acopay.net 或 ACOPAY 移动钱包（“服务”）即表示你同意本条款。如果不同意，请不要使用本服务。",
    termsH1: "1. 服务的性质",
    termsP1:
      "ACOPAY 是面向 Solana 代币的非托管钱包与转账工具。我们不运营交易所，不托管你的密钥，也不保证代币价格或投资回报。本服务不构成任何财务建议。",
    termsH2: "2. 你的责任",
    termsLi1: "你须自行负责保管好你的助记词与私钥。",
    termsLi2: "转账前，你须自行核实收款地址。",
    termsLi3: "你须遵守适用于你的法律法规（包括加密货币相关规定）。",
    termsLi4: "你须年满 18 周岁方可使用本服务。",
    termsH3: "3. 网络手续费",
    termsP3:
      "对于通过 ACOPAY 赞助流程支持的转账，Solana 网络（gas）费用可能由 ACOPAY/运营方按产品内说明代付。对于其他代币（例如 USDT、SOL 或自定义 SPL 代币），网络费用由你的钱包自行支付。代币转账费用（例如 ACOPAY 的 0.01% 链上手续费）与 Solana gas 费用相互独立，并遵循链上程序规则。",
    termsH4: "4. 非托管；损失风险",
    termsP4: "如果你丢失助记词或设备且没有备份，你的资产可能永久无法找回。区块链交易一经确认即不可撤销。",
    termsH5: "5. 禁止行为",
    termsP5: "你不得将本服务用于非法活动、欺诈、规避制裁，或滥用基础设施（如垃圾信息、攻击、恶意逆向工程）。",
    termsH6: "6. 免责声明",
    termsP6:
      "本服务按“现状”提供，不附带任何形式的保证。在法律允许的最大范围内，ACOPAY 对间接、附带或后果性损害，以及因用户操作失误、区块链故障或第三方服务引起的损失概不负责。",
    termsH7: "7. 变更",
    termsP7:
      "我们可能会更新本条款。变更后继续使用即视为你接受更新后的条款。重大变更将通过更新上方日期予以体现。",
    termsH8: "8. 联系方式",
    deleteIntro: "Google Play 与 App Store 要求提供无需安装应用即可完成的公开删除途径。最后更新：2026年8月2日",
    deleteHWhat: "此处“账户”的含义",
    deletePWhat:
      "ACOPAY 移动钱包为非托管钱包。你的密钥保存在你的设备上。不存在持有你资金的中心化登录账户。删除是指移除本地钱包数据，以及与你在 ACOPAY 接口中使用过的地址相关的任何服务器端会话/运营数据。",
    deleteHA: "A. 删除设备上的数据（即时生效）",
    deleteA1: "打开 ACOPAY 应用 → 点击 ACOPAY 徽标 → 退出登录。",
    deleteA2: "从设备上卸载该应用。",
    deleteA3: "可选：如果你的操作系统支持，可在卸载前清除应用存储 / SecureStore。",
    deleteWarnLabel: "警告：",
    deleteWarn: "如果你尚未备份助记词，退出登录或卸载应用可能导致你的资产无法找回。",
    deleteHB: "B. 申请服务器端删除",
    deleteEmailBefore: "发送邮件至 ",
    deleteEmailMid: "，主题为 ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: "，并附上：",
    deleteLi1: "你在 ACOPAY 中使用过的 Solana 钱包地址",
    deleteLi2: "大致使用日期（如已知）",
    deleteP2:
      "我们将在 30 天内删除或匿名化相关的会话记录与支持往来邮件，但因法律或安全原因必须保留的数据除外，且无法删除的公开区块链记录也除外。",
    deleteHRelated: "相关内容",
  }),

  ja: L({
    privacyTitle: "プライバシーポリシー",
    termsTitle: "利用規約",
    deleteTitle: "アカウントとデータの削除",
    lastUpdated: "最終更新日：2026年8月2日",
    privacyIntro:
      "本プライバシーポリシーは、お客様が acopay.net および ACOPAY モバイルウォレットアプリ（以下「本サービス」）をご利用になる際に、ACOPAY（以下「当社」）が情報をどのように取り扱うかを説明するものです。",
    privacyH1: "1. サービス概要",
    privacyP1:
      "ACOPAY は非カストディアル型の Solana ウォレット体験を提供します。ウォレットの作成・インポート、残高の確認、SPL トークン（ACOPAY、USDT、SOL、その他追加したトークンを含む）の送金が可能です。リカバリーフレーズと秘密鍵は常にお客様の端末内に保存され、ACOPAY が収集することはありません。",
    privacyH2: "2. 当社が処理するデータ",
    privacyLi1Label: "ウォレットの公開アドレス",
    privacyLi1Rest: "——手数料の見積もり、送金リクエストの作成・シミュレーション・ブロードキャストに必要です。",
    privacyLi2Label: "取引メタデータ",
    privacyLi2Rest:
      "——ACOPAY がスポンサーする送金 API をご利用の際の、金額、入力された受取アドレスまたはユーザー名、署名、確認ステータス。",
    privacyLi3Label: "技術ログ",
    privacyLi3Rest:
      "——セキュリティおよび不正利用防止のための、標準的な Web／サーバーログ（IP、ユーザーエージェント、タイムスタンプ）。",
    privacyLi4Label: "任意の連絡先",
    privacyLi4Before: "——",
    privacyLi4After: " 宛にメールを送信された場合、その内容を処理します。",
    privacyH3: "3. 当社が収集しないデータ",
    privacyP3:
      "シードフレーズ、秘密鍵、生体認証テンプレートは収集しません。生体認証によるロック解除（Face ID／指紋）を有効にしている場合、その処理は端末の OS が行います。",
    privacyH4: "4. オンチェーンデータ",
    privacyP4:
      "お客様が確認した送金は Solana のパブリックブロックチェーンに記録されます。ブロードキャスト後のブロックチェーンデータは公開情報となり、ACOPAY の管理範囲外です。",
    privacyH5: "5. 第三者",
    privacyP5:
      "当社は本サービスの運用にあたり、インフラプロバイダー（ホスティング、CDN、RPC エンドポイント）を利用します。個人データを販売することはありません。本日時点で、モバイルアプリに広告 SDK は使用していません。",
    privacyH6: "6. データの保持",
    privacyP6:
      "サーバー側のセッションおよび運用ログは、セキュリティ、サポート、法的義務に必要な期間のみ保持され、その後削除または匿名化されます。",
    privacyH7: "7. お客様の選択肢",
    privacyP7Before:
      "本サービスの利用はいつでも中止でき、アプリのアンインストールや端末上のローカルウォレットデータの消去も可能です。詳細は ",
    privacyP7After: "をご覧ください。",
    privacyH8: "8. お問い合わせ",
    privacyContact: "ご質問：",
    termsIntro:
      "acopay.net または ACOPAY モバイルウォレット（以下「本サービス」）をご利用になることで、本規約に同意したものとみなされます。同意いただけない場合は、本サービスをご利用にならないでください。",
    termsH1: "1. 本サービスの性質",
    termsP1:
      "ACOPAY は Solana トークン向けの非カストディアル型ウォレット・送金ユーティリティです。当社は取引所を運営しておらず、お客様の鍵を保管することもなく、トークン価格や投資収益を保証するものでもありません。本サービスは投資助言ではありません。",
    termsH2: "2. お客様の責任",
    termsLi1: "リカバリーフレーズおよび秘密鍵の管理は、お客様ご自身の責任で行ってください。",
    termsLi2: "送金前に受取アドレスを確認する責任はお客様にあります。",
    termsLi3: "適用される法令（暗号資産に関する規制を含む）を遵守してください。",
    termsLi4: "本サービスの利用には満18歳以上である必要があります。",
    termsH3: "3. ネットワーク手数料",
    termsP3:
      "ACOPAY がスポンサーするフローで対応している送金については、Solana ネットワーク（ガス）手数料を製品内で開示のとおり ACOPAY／オペレーターが負担する場合があります。その他のトークン（例：USDT、SOL、カスタム SPL トークン）については、お客様のウォレットからネットワーク手数料をお支払いいただきます。トークン送金手数料（例：ACOPAY のオンチェーン手数料 0.01％）は Solana のガス代とは別物であり、オンチェーンプログラムのルールに従います。",
    termsH4: "4. 非カストディアル；損失のリスク",
    termsP4:
      "リカバリーフレーズやバックアップのない端末を紛失した場合、資産を永久に復元できなくなる可能性があります。ブロックチェーン取引は確定後、取り消すことができません。",
    termsH5: "5. 禁止事項",
    termsP5:
      "違法行為、詐欺、制裁回避、またはインフラの悪用（スパム、攻撃、加害目的のリバースエンジニアリング）のために本サービスを利用することはできません。",
    termsH6: "6. 免責事項",
    termsP6:
      "本サービスは「現状有姿」で提供され、いかなる保証もありません。法律で許容される最大限の範囲において、ACOPAY は間接的、付随的、結果的損害、またはユーザーの操作ミス、ブロックチェーンの障害、第三者サービスに起因する損失について責任を負いません。",
    termsH7: "7. 変更",
    termsP7:
      "当社は本規約を更新することがあります。変更後も本サービスの利用を継続する場合、更新後の規約に同意したものとみなされます。重要な変更は、上記の更新日を変更することで反映されます。",
    termsH8: "8. お問い合わせ",
    deleteIntro:
      "Google Play および App Store は、アプリのインストールを必要としない公開の削除方法を求めています。最終更新日：2026年8月2日",
    deleteHWhat: "ここでいう「アカウント」とは",
    deletePWhat:
      "ACOPAY モバイルウォレットは非カストディアル型です。鍵はお客様の端末内に保存されます。資金を保有する中央集権的なログインアカウントは存在しません。削除とは、ローカルのウォレットデータ、および ACOPAY の API で使用したアドレスに紐づくサーバー側のセッション／運用データを削除することを意味します。",
    deleteHA: "A. 端末上のデータを削除する（即時）",
    deleteA1: "ACOPAY アプリを開く → ACOPAY のロゴをタップ → ログアウト。",
    deleteA2: "端末からアプリをアンインストールする。",
    deleteA3: "任意：OS がその操作に対応している場合は、アンインストール前にアプリストレージ／SecureStore を消去する。",
    deleteWarnLabel: "警告：",
    deleteWarn:
      "リカバリーフレーズをバックアップしていない場合、ログアウトまたはアンインストールにより資産が復元不能になることがあります。",
    deleteHB: "B. サーバー側データの削除を依頼する",
    deleteEmailBefore: "宛先 ",
    deleteEmailMid: " ／ 件名 ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " でメールを送り、以下を記載してください：",
    deleteLi1: "ACOPAY で使用した Solana ウォレットアドレス",
    deleteLi2: "利用時期のおおよその目安（分かる場合）",
    deleteP2:
      "関連するセッション記録およびサポートのやり取りは、法的またはセキュリティ上の理由で保持が必要なデータ、および削除できない公開ブロックチェーン記録を除き、30日以内に削除または匿名化します。",
    deleteHRelated: "関連情報",
  }),

  ko: L({
    privacyTitle: "개인정보 처리방침",
    termsTitle: "이용약관",
    deleteTitle: "계정 및 데이터 삭제",
    lastUpdated: "최종 업데이트: 2026년 8월 2일",
    privacyIntro:
      "이 개인정보 처리방침은 귀하가 acopay.net 및 ACOPAY 모바일 지갑 애플리케이션(이하 “서비스”)을 이용할 때 ACOPAY(이하 “당사”)가 정보를 어떻게 처리하는지 설명합니다.",
    privacyH1: "1. 서비스 개요",
    privacyP1:
      "ACOPAY는 비수탁형 Solana 지갑 경험을 제공합니다: 지갑을 생성하거나 가져오고, 잔액을 확인하며, SPL 토큰(ACOPAY, USDT, SOL 및 귀하가 추가한 다른 토큰 포함)을 전송할 수 있습니다. 복구 구문과 개인 키는 항상 귀하의 기기에 남아 있으며 ACOPAY가 수집하지 않습니다.",
    privacyH2: "2. 당사가 처리하는 데이터",
    privacyLi1Label: "지갑 공개 주소",
    privacyLi1Rest: " — 귀하가 요청한 전송의 수수료 산정, 생성, 시뮬레이션, 브로드캐스트에 필요합니다.",
    privacyLi2Label: "거래 메타데이터",
    privacyLi2Rest:
      " — ACOPAY 후원 전송 API를 사용할 때의 금액, 입력한 수신 주소 또는 사용자 이름, 서명 및 확인 상태입니다.",
    privacyLi3Label: "기술 로그",
    privacyLi3Rest: " — 보안 및 오남용 방지를 위한 표준 웹/서버 로그(IP, 사용자 에이전트, 타임스탬프)입니다.",
    privacyLi4Label: "선택적 연락처",
    privacyLi4Before: " — ",
    privacyLi4After: "(으)로 이메일을 보내시면 해당 서신 내용을 처리합니다.",
    privacyH3: "3. 당사가 수집하지 않는 데이터",
    privacyP3:
      "당사는 귀하의 시드 구문, 개인 키, 생체 인식 템플릿을 수집하지 않습니다. 생체 인식 잠금 해제(Face ID / 지문)가 활성화된 경우 이는 기기 OS에서 처리합니다.",
    privacyH4: "4. 온체인 데이터",
    privacyP4:
      "귀하가 확인한 전송은 Solana 공개 블록체인에 기록됩니다. 블록체인 데이터는 브로드캐스트된 이후 공개되며 ACOPAY의 통제 범위를 벗어납니다.",
    privacyH5: "5. 제3자",
    privacyP5:
      "당사는 서비스 운영을 위해 인프라 제공업체(호스팅, CDN, RPC 엔드포인트)를 이용합니다. 당사는 개인 데이터를 판매하지 않습니다. 현재 시점 기준으로 모바일 앱에서 광고 SDK를 사용하지 않습니다.",
    privacyH6: "6. 보관 기간",
    privacyP6:
      "서버 측 세션 및 운영 로그는 보안, 지원, 법적 의무에 필요한 기간 동안만 보관된 후 삭제되거나 익명화됩니다.",
    privacyH7: "7. 귀하의 선택",
    privacyP7Before:
      "귀하는 언제든지 서비스 이용을 중단하고, 앱을 삭제하고, 기기에서 로컬 지갑 데이터를 지울 수 있습니다. 자세한 내용은 ",
    privacyP7After: "을 참고하세요.",
    privacyH8: "8. 연락처",
    privacyContact: "문의:",
    termsIntro:
      "acopay.net 또는 ACOPAY 모바일 지갑(이하 “서비스”)을 이용함으로써 귀하는 본 약관에 동의합니다. 동의하지 않으시면 서비스를 이용하지 마십시오.",
    termsH1: "1. 서비스의 성격",
    termsP1:
      "ACOPAY는 Solana 토큰을 위한 비수탁형 지갑 및 전송 유틸리티입니다. 당사는 거래소를 운영하지 않으며, 귀하의 키를 보관하지 않고, 토큰 가격이나 투자 수익을 보장하지 않습니다. 본 서비스는 재무 자문이 아닙니다.",
    termsH2: "2. 귀하의 책임",
    termsLi1: "복구 구문과 개인 키를 안전하게 보관하는 것은 전적으로 귀하의 책임입니다.",
    termsLi2: "전송 전에 수신 주소를 확인하는 것은 귀하의 책임입니다.",
    termsLi3: "귀하에게 적용되는 법률(암호화폐 관련 규정 포함)을 준수해야 합니다.",
    termsLi4: "서비스를 이용하려면 만 18세 이상이어야 합니다.",
    termsH3: "3. 네트워크 수수료",
    termsP3:
      "ACOPAY의 후원 흐름을 통해 지원되는 ACOPAY 전송의 경우, Solana 네트워크(가스) 수수료는 제품 내에 공지된 대로 ACOPAY/운영자가 부담할 수 있습니다. 다른 토큰(예: USDT, SOL 또는 사용자 지정 SPL 토큰)의 경우 귀하는 본인 지갑에서 네트워크 수수료를 지불합니다. 토큰 전송 수수료(예: ACOPAY의 온체인 수수료 0.01%)는 Solana 가스와 별개이며 온체인 프로그램 규칙을 따릅니다.",
    termsH4: "4. 비수탁; 손실 위험",
    termsP4:
      "백업 없이 복구 구문이나 기기를 분실하면 자산이 영구적으로 복구 불가능할 수 있습니다. 블록체인 거래는 확인된 후에는 되돌릴 수 없습니다.",
    termsH5: "5. 금지된 사용",
    termsP5:
      "귀하는 서비스를 불법 행위, 사기, 제재 회피, 또는 인프라 남용(스팸, 공격, 악의적 목적의 리버스 엔지니어링)에 사용할 수 없습니다.",
    termsH6: "6. 면책 조항",
    termsP6:
      "서비스는 어떠한 종류의 보증도 없이 “있는 그대로” 제공됩니다. 관련 법률이 허용하는 최대 범위 내에서, ACOPAY는 간접적, 부수적, 결과적 손해, 또는 사용자 오류, 블록체인 장애, 제3자 서비스로 인해 발생하는 손실에 대해 책임을 지지 않습니다.",
    termsH7: "7. 변경",
    termsP7:
      "당사는 본 약관을 업데이트할 수 있습니다. 변경 후 계속 이용하는 것은 업데이트된 약관에 대한 동의로 간주됩니다. 중요한 변경 사항은 위의 날짜를 갱신하여 반영됩니다.",
    termsH8: "8. 연락처",
    deleteIntro: "Google Play와 App Store는 앱 설치 없이도 이용 가능한 공개적인 삭제 절차를 요구합니다. 최종 업데이트: 2026년 8월 2일",
    deleteHWhat: "여기서 말하는 “계정”의 의미",
    deletePWhat:
      "ACOPAY 모바일 지갑은 비수탁형입니다. 귀하의 키는 귀하의 기기에 저장됩니다. 귀하의 자금을 보유하는 중앙 로그인 계정은 존재하지 않습니다. 삭제란 로컬 지갑 데이터와 ACOPAY API에서 사용한 주소에 연결된 서버 측 세션/운영 데이터를 제거하는 것을 의미합니다.",
    deleteHA: "A. 기기에서 데이터 삭제(즉시)",
    deleteA1: "ACOPAY 앱 열기 → ACOPAY 로고 탭 → 로그아웃.",
    deleteA2: "기기에서 앱을 삭제합니다.",
    deleteA3: "선택 사항: OS에서 지원하는 경우 삭제 전에 앱 저장소 / SecureStore를 지웁니다.",
    deleteWarnLabel: "경고:",
    deleteWarn: " 복구 구문을 백업하지 않은 경우, 로그아웃하거나 앱을 삭제하면 자산을 복구할 수 없게 될 수 있습니다.",
    deleteHB: "B. 서버 측 삭제 요청",
    deleteEmailBefore: "다음 주소로 이메일을 보내세요: ",
    deleteEmailMid: " (제목: ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: ") 그리고 다음 내용을 포함하세요:",
    deleteLi1: "ACOPAY에서 사용한 귀하의 Solana 지갑 주소",
    deleteLi2: "대략적인 사용 기간(아는 경우)",
    deleteP2:
      "당사는 법적 또는 보안상의 이유로 보관해야 하는 데이터와 삭제할 수 없는 공개 블록체인 기록을 제외하고, 관련 세션 기록 및 지원 서신을 30일 이내에 삭제하거나 익명화합니다.",
    deleteHRelated: "관련 문서",
  }),

  th: L({
    privacyTitle: "นโยบายความเป็นส่วนตัว",
    termsTitle: "ข้อกำหนดการให้บริการ",
    deleteTitle: "ลบบัญชีและข้อมูล",
    lastUpdated: "ปรับปรุงล่าสุด: 2 สิงหาคม 2026",
    privacyIntro:
      "นโยบายความเป็นส่วนตัวนี้อธิบายวิธีที่ ACOPAY (“เรา”) จัดการข้อมูลเมื่อคุณใช้ acopay.net และแอปกระเป๋าเงินมือถือ ACOPAY (“บริการ”)",
    privacyH1: "1. ภาพรวมผลิตภัณฑ์",
    privacyP1:
      "ACOPAY มอบประสบการณ์กระเป๋าเงิน Solana แบบไม่ดูแลกุญแจแทนคุณ (non-custodial) คุณสามารถสร้างหรือนำเข้ากระเป๋าเงิน ดูยอดคงเหลือ และโอนโทเคน SPL (รวมถึง ACOPAY, USDT, SOL และโทเคนอื่นที่คุณเพิ่มเข้ามา) วลีกู้คืนและคีย์ส่วนตัวจะอยู่บนอุปกรณ์ของคุณเสมอ และ ACOPAY จะไม่เก็บรวบรวมข้อมูลเหล่านี้",
    privacyH2: "2. ข้อมูลที่เราประมวลผล",
    privacyLi1Label: "ที่อยู่กระเป๋าเงินสาธารณะ",
    privacyLi1Rest: " — จำเป็นสำหรับการคำนวณค่าธรรมเนียม สร้าง จำลอง และส่งการโอนที่คุณร้องขอ",
    privacyLi2Label: "ข้อมูลเมทาดาต้าของธุรกรรม",
    privacyLi2Rest:
      " — จำนวนเงิน ที่อยู่หรือชื่อผู้ใช้ผู้รับที่คุณกรอก ลายเซ็น และสถานะการยืนยัน เมื่อคุณใช้ API การโอนที่ ACOPAY สนับสนุน",
    privacyLi3Label: "บันทึกทางเทคนิค",
    privacyLi3Rest:
      " — บันทึกเว็บ/เซิร์ฟเวอร์มาตรฐาน (IP, user agent, เวลา) เพื่อความปลอดภัยและป้องกันการใช้งานในทางที่ผิด",
    privacyLi4Label: "ช่องทางติดต่อทางเลือก",
    privacyLi4Before: " — หากคุณส่งอีเมลถึง ",
    privacyLi4After: " เราจะประมวลผลเนื้อหาของอีเมลนั้น",
    privacyH3: "3. ข้อมูลที่เราไม่เก็บรวบรวม",
    privacyP3:
      "เราไม่เก็บรวบรวมวลีกู้คืน (seed phrase) คีย์ส่วนตัว หรือแม่แบบข้อมูลชีวมิติของคุณ การปลดล็อกด้วยข้อมูลชีวมิติ (Face ID / ลายนิ้วมือ) หากเปิดใช้งาน จะดำเนินการโดยระบบปฏิบัติการของอุปกรณ์คุณ",
    privacyH4: "4. ข้อมูลบนเชน",
    privacyP4:
      "การโอนที่คุณยืนยันจะถูกบันทึกบนบล็อกเชนสาธารณะของ Solana ข้อมูลบล็อกเชนเป็นข้อมูลสาธารณะและอยู่นอกเหนือการควบคุมของ ACOPAY เมื่อถูกส่งออกไปแล้ว",
    privacyH5: "5. บุคคลที่สาม",
    privacyP5:
      "เราใช้ผู้ให้บริการโครงสร้างพื้นฐาน (โฮสติ้ง, CDN, RPC endpoint) ในการให้บริการ เราไม่ขายข้อมูลส่วนบุคคล และ ณ วันที่นี้เราไม่ใช้ advertising SDK ในแอปมือถือ",
    privacyH6: "6. การเก็บรักษาข้อมูล",
    privacyP6:
      "บันทึกเซสชันและการดำเนินงานฝั่งเซิร์ฟเวอร์จะถูกเก็บไว้เท่าที่จำเป็นต่อความปลอดภัย การสนับสนุน และข้อผูกพันทางกฎหมาย จากนั้นจะถูกลบหรือทำให้ไม่ระบุตัวตน",
    privacyH7: "7. ทางเลือกของคุณ",
    privacyP7Before:
      "คุณสามารถหยุดใช้บริการได้ทุกเมื่อ ถอนการติดตั้งแอป และล้างข้อมูลกระเป๋าเงินในเครื่องออกจากอุปกรณ์ของคุณ ดู ",
    privacyP7After: ".",
    privacyH8: "8. ติดต่อ",
    privacyContact: "สอบถามเพิ่มเติม:",
    termsIntro:
      "การใช้ acopay.net หรือกระเป๋าเงินมือถือ ACOPAY (“บริการ”) ถือว่าคุณยอมรับข้อกำหนดนี้ หากคุณไม่ยอมรับ กรุณาอย่าใช้บริการ",
    termsH1: "1. ลักษณะของบริการ",
    termsP1:
      "ACOPAY เป็นเครื่องมือกระเป๋าเงินและการโอนแบบไม่ดูแลกุญแจแทนคุณสำหรับโทเคน Solana เราไม่ได้ดำเนินการเป็นตลาดแลกเปลี่ยน ไม่เก็บรักษาคีย์ของคุณ และไม่รับประกันราคาหรือผลตอบแทนการลงทุนของโทเคน บริการนี้ไม่ใช่คำแนะนำทางการเงิน",
    termsH2: "2. ความรับผิดชอบของคุณ",
    termsLi1: "คุณต้องรับผิดชอบแต่เพียงผู้เดียวในการรักษาความปลอดภัยของวลีกู้คืนและคีย์ส่วนตัวของคุณ",
    termsLi2: "คุณมีหน้าที่ตรวจสอบที่อยู่ผู้รับก่อนทำการโอน",
    termsLi3: "คุณต้องปฏิบัติตามกฎหมายที่บังคับใช้กับคุณ (รวมถึงกฎระเบียบเกี่ยวกับคริปโท)",
    termsLi4: "คุณต้องมีอายุอย่างน้อย 18 ปีจึงจะใช้บริการนี้ได้",
    termsH3: "3. ค่าธรรมเนียมเครือข่าย",
    termsP3:
      "สำหรับการโอน ACOPAY ที่รองรับผ่านขั้นตอนที่ ACOPAY สนับสนุน ค่าธรรมเนียมเครือข่าย Solana (gas) อาจถูกจ่ายโดย ACOPAY/ผู้ดำเนินการตามที่เปิดเผยในผลิตภัณฑ์ สำหรับโทเคนอื่น (เช่น USDT, SOL หรือโทเคน SPL ที่กำหนดเอง) คุณต้องจ่ายค่าธรรมเนียมเครือข่ายจากกระเป๋าเงินของคุณเอง ค่าธรรมเนียมการโอนโทเคน (เช่น ค่าธรรมเนียมบนเชน 0.01% ของ ACOPAY) แยกต่างหากจากค่า gas ของ Solana และเป็นไปตามกฎของโปรแกรมบนเชน",
    termsH4: "4. ไม่มีการดูแลกุญแจแทน; ความเสี่ยงในการสูญเสีย",
    termsP4:
      "หากคุณทำวลีกู้คืนหรืออุปกรณ์หายโดยไม่มีการสำรองข้อมูล สินทรัพย์ของคุณอาจไม่สามารถกู้คืนได้อย่างถาวร ธุรกรรมบล็อกเชนไม่สามารถย้อนกลับได้เมื่อได้รับการยืนยันแล้ว",
    termsH5: "5. การใช้งานที่ต้องห้าม",
    termsP5:
      "คุณต้องไม่ใช้บริการนี้เพื่อกิจกรรมที่ผิดกฎหมาย การฉ้อโกง การหลีกเลี่ยงมาตรการคว่ำบาตร หรือการใช้โครงสร้างพื้นฐานในทางที่ผิด (สแปม การโจมตี หรือวิศวกรรมย้อนกลับเพื่อสร้างความเสียหาย)",
    termsH6: "6. ข้อจำกัดความรับผิด",
    termsP6:
      "บริการนี้ให้บริการ “ตามสภาพ” โดยไม่มีการรับประกันใดๆ ทั้งสิ้น เท่าที่กฎหมายอนุญาตสูงสุด ACOPAY จะไม่รับผิดต่อความเสียหายทางอ้อม ความเสียหายที่เกิดขึ้นโดยบังเอิญ หรือความเสียหายที่เป็นผลสืบเนื่อง หรือความสูญเสียที่เกิดจากความผิดพลาดของผู้ใช้ ความล้มเหลวของบล็อกเชน หรือบริการของบุคคลที่สาม",
    termsH7: "7. การเปลี่ยนแปลง",
    termsP7:
      "เราอาจปรับปรุงข้อกำหนดนี้ การใช้งานต่อเนื่องหลังการเปลี่ยนแปลงถือเป็นการยอมรับข้อกำหนดที่ปรับปรุงแล้ว การเปลี่ยนแปลงที่สำคัญจะสะท้อนด้วยการปรับปรุงวันที่ด้านบน",
    termsH8: "8. ติดต่อ",
    deleteIntro:
      "Google Play และ App Store กำหนดให้มีช่องทางลบบัญชีสาธารณะที่ไม่จำเป็นต้องติดตั้งแอป ปรับปรุงล่าสุด: 2 สิงหาคม 2026",
    deleteHWhat: "ความหมายของ “บัญชี” ในที่นี้",
    deletePWhat:
      "กระเป๋าเงินมือถือ ACOPAY เป็นแบบไม่ดูแลกุญแจแทนคุณ คีย์ของคุณอยู่บนอุปกรณ์ของคุณ ไม่มีบัญชีเข้าสู่ระบบส่วนกลางใดที่ถือครองเงินของคุณ การลบหมายถึงการลบข้อมูลกระเป๋าเงินในเครื่องและเซสชัน/ข้อมูลการดำเนินงานฝั่งเซิร์ฟเวอร์ที่เชื่อมโยงกับที่อยู่ที่คุณใช้กับ API ของ ACOPAY",
    deleteHA: "A. ลบข้อมูลบนอุปกรณ์ของคุณ (ทันที)",
    deleteA1: "เปิดแอป ACOPAY → แตะโลโก้ ACOPAY → ออกจากระบบ",
    deleteA2: "ถอนการติดตั้งแอปออกจากอุปกรณ์ของคุณ",
    deleteA3: "ทางเลือก: ล้างพื้นที่จัดเก็บของแอป / SecureStore ก่อนถอนการติดตั้ง หากระบบปฏิบัติการของคุณมีตัวเลือกนี้",
    deleteWarnLabel: "คำเตือน:",
    deleteWarn: " หากคุณยังไม่ได้สำรองวลีกู้คืน การออกจากระบบหรือถอนการติดตั้งอาจทำให้เงินของคุณไม่สามารถกู้คืนได้",
    deleteHB: "B. ขอให้ลบข้อมูลฝั่งเซิร์ฟเวอร์",
    deleteEmailBefore: "ส่งอีเมลถึง ",
    deleteEmailMid: " โดยใช้หัวข้อ ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " และแนบข้อมูลต่อไปนี้:",
    deleteLi1: "ที่อยู่กระเป๋าเงิน Solana ของคุณที่ใช้กับ ACOPAY",
    deleteLi2: "ช่วงเวลาการใช้งานโดยประมาณ (ถ้าทราบ)",
    deleteP2:
      "เราจะลบหรือทำให้ไม่ระบุตัวตนของบันทึกเซสชันและอีเมลติดต่อฝ่ายสนับสนุนที่เกี่ยวข้องภายใน 30 วัน ยกเว้นข้อมูลที่เราต้องเก็บรักษาไว้ด้วยเหตุผลทางกฎหมายหรือความปลอดภัย และยกเว้นบันทึกบล็อกเชนสาธารณะซึ่งไม่สามารถลบได้",
    deleteHRelated: "ที่เกี่ยวข้อง",
  }),

  id: L({
    privacyTitle: "Kebijakan Privasi",
    termsTitle: "Ketentuan Layanan",
    deleteTitle: "Hapus akun & data",
    lastUpdated: "Terakhir diperbarui: 2 Agustus 2026",
    privacyIntro:
      "Kebijakan Privasi ini menjelaskan bagaimana ACOPAY (“kami”) menangani informasi saat Anda menggunakan acopay.net dan aplikasi dompet seluler ACOPAY (“Layanan”).",
    privacyH1: "1. Ringkasan produk",
    privacyP1:
      "ACOPAY menyediakan pengalaman dompet Solana non-kustodian: Anda dapat membuat atau mengimpor dompet, melihat saldo, dan mentransfer token SPL (termasuk ACOPAY, USDT, SOL, dan token lain yang Anda tambahkan). Frasa pemulihan dan kunci privat tetap berada di perangkat Anda dan tidak dikumpulkan oleh ACOPAY.",
    privacyH2: "2. Data yang kami proses",
    privacyLi1Label: "Alamat publik dompet",
    privacyLi1Rest: " — diperlukan untuk menghitung biaya, membuat, mensimulasikan, dan menyiarkan transfer yang Anda minta.",
    privacyLi2Label: "Metadata transaksi",
    privacyLi2Rest:
      " — jumlah, alamat atau nama pengguna penerima yang Anda masukkan, tanda tangan, dan status konfirmasi saat Anda menggunakan API transfer yang disponsori ACOPAY.",
    privacyLi3Label: "Log teknis",
    privacyLi3Rest: " — log web/server standar (IP, user agent, stempel waktu) untuk keamanan dan pencegahan penyalahgunaan.",
    privacyLi4Label: "Kontak opsional",
    privacyLi4Before: " — jika Anda mengirim email ke ",
    privacyLi4After: ", kami memproses isi korespondensi tersebut.",
    privacyH3: "3. Data yang tidak kami kumpulkan",
    privacyP3:
      "Kami tidak mengumpulkan frasa seed, kunci privat, atau template biometrik Anda. Pembuka kunci biometrik (Face ID / sidik jari), jika diaktifkan, ditangani oleh sistem operasi perangkat Anda.",
    privacyH4: "4. Data on-chain",
    privacyP4:
      "Transfer yang Anda konfirmasi dicatat di blockchain publik Solana. Data blockchain bersifat publik dan berada di luar kendali ACOPAY setelah disiarkan.",
    privacyH5: "5. Pihak ketiga",
    privacyP5:
      "Kami menggunakan penyedia infrastruktur (hosting, CDN, endpoint RPC) untuk mengoperasikan Layanan. Kami tidak menjual data pribadi. Kami tidak menggunakan SDK periklanan di aplikasi seluler per tanggal ini.",
    privacyH6: "6. Retensi",
    privacyP6:
      "Log sesi dan operasional sisi server disimpan hanya selama diperlukan untuk keamanan, dukungan, dan kewajiban hukum, lalu dihapus atau dianonimkan.",
    privacyH7: "7. Pilihan Anda",
    privacyP7Before:
      "Anda dapat berhenti menggunakan Layanan kapan saja, mencopot pemasangan aplikasi, dan menghapus data dompet lokal dari perangkat Anda. Lihat ",
    privacyP7After: ".",
    privacyH8: "8. Kontak",
    privacyContact: "Pertanyaan:",
    termsIntro:
      "Dengan menggunakan acopay.net atau dompet seluler ACOPAY (“Layanan”), Anda menyetujui Ketentuan ini. Jika Anda tidak setuju, jangan gunakan Layanan.",
    termsH1: "1. Sifat Layanan",
    termsP1:
      "ACOPAY adalah utilitas dompet dan transfer non-kustodian untuk token Solana. Kami tidak mengoperasikan bursa, tidak menyimpan kunci Anda, dan tidak menjamin harga token atau imbal hasil investasi. Layanan ini bukan nasihat keuangan.",
    termsH2: "2. Tanggung jawab Anda",
    termsLi1: "Anda sepenuhnya bertanggung jawab untuk mengamankan frasa pemulihan dan kunci privat Anda.",
    termsLi2: "Anda bertanggung jawab memverifikasi alamat penerima sebelum melakukan transfer.",
    termsLi3: "Anda harus mematuhi hukum yang berlaku bagi Anda (termasuk regulasi kripto).",
    termsLi4: "Anda harus berusia minimal 18 tahun untuk menggunakan Layanan.",
    termsH3: "3. Biaya jaringan",
    termsP3:
      "Untuk transfer ACOPAY yang didukung melalui alur yang disponsori ACOPAY, biaya jaringan (gas) Solana dapat dibayar oleh ACOPAY/operator sebagaimana diungkapkan dalam produk. Untuk token lain (misalnya USDT, SOL, atau token SPL kustom), Anda membayar biaya jaringan dari dompet Anda sendiri. Biaya transfer token (misalnya biaya on-chain ACOPAY sebesar 0,01%) terpisah dari gas Solana dan mengikuti aturan program on-chain.",
    termsH4: "4. Tanpa kustodian; risiko kehilangan",
    termsP4:
      "Jika Anda kehilangan frasa pemulihan atau perangkat tanpa cadangan, aset Anda mungkin tidak dapat dipulihkan secara permanen. Transaksi blockchain tidak dapat dibatalkan setelah dikonfirmasi.",
    termsH5: "5. Penggunaan yang dilarang",
    termsP5:
      "Anda tidak boleh menggunakan Layanan untuk aktivitas ilegal, penipuan, penghindaran sanksi, atau penyalahgunaan infrastruktur (spam, serangan, rekayasa balik untuk tujuan merugikan).",
    termsH6: "6. Penafian",
    termsP6:
      "LAYANAN INI DISEDIAKAN “SEBAGAIMANA ADANYA” TANPA JAMINAN APA PUN. SEJAUH DIIZINKAN OLEH HUKUM, ACOPAY TIDAK BERTANGGUNG JAWAB ATAS KERUSAKAN TIDAK LANGSUNG, INSIDENTAL, ATAU KONSEKUENSIAL, ATAU KERUGIAN YANG TIMBUL DARI KESALAHAN PENGGUNA, KEGAGALAN BLOCKCHAIN, ATAU LAYANAN PIHAK KETIGA.",
    termsH7: "7. Perubahan",
    termsP7:
      "Kami dapat memperbarui Ketentuan ini. Penggunaan berkelanjutan setelah perubahan merupakan penerimaan atas Ketentuan yang diperbarui. Perubahan material akan tercermin dengan memperbarui tanggal di atas.",
    termsH8: "8. Kontak",
    deleteIntro:
      "Google Play dan App Store mewajibkan jalur penghapusan publik yang tidak mengharuskan pemasangan aplikasi. Terakhir diperbarui: 2 Agustus 2026",
    deleteHWhat: "Arti “akun” di sini",
    deletePWhat:
      "Dompet seluler ACOPAY bersifat non-kustodian. Kunci Anda berada di perangkat Anda. Tidak ada akun login pusat yang menyimpan dana Anda. Penghapusan berarti menghapus data dompet lokal dan sesi/data operasional sisi server yang terkait dengan alamat yang Anda gunakan dengan API ACOPAY.",
    deleteHA: "A. Hapus data di perangkat Anda (instan)",
    deleteA1: "Buka aplikasi ACOPAY → ketuk logo ACOPAY → Keluar.",
    deleteA2: "Copot pemasangan aplikasi dari perangkat Anda.",
    deleteA3: "Opsional: hapus penyimpanan aplikasi / SecureStore sebelum mencopot pemasangan jika OS Anda menyediakan kontrol tersebut.",
    deleteWarnLabel: "Peringatan:",
    deleteWarn: " Jika Anda belum mencadangkan frasa pemulihan, keluar atau mencopot pemasangan dapat membuat dana Anda tidak dapat dipulihkan.",
    deleteHB: "B. Meminta penghapusan sisi server",
    deleteEmailBefore: "Kirim email ke ",
    deleteEmailMid: " dengan subjek ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " dan sertakan:",
    deleteLi1: "Alamat dompet Solana Anda yang digunakan dengan ACOPAY",
    deleteLi2: "Perkiraan tanggal penggunaan (jika diketahui)",
    deleteP2:
      "Kami akan menghapus atau menganonimkan catatan sesi dan korespondensi dukungan terkait dalam waktu 30 hari, kecuali data yang harus kami simpan karena alasan hukum atau keamanan, dan kecuali catatan blockchain publik yang tidak dapat dihapus.",
    deleteHRelated: "Terkait",
  }),

  ms: L({
    privacyTitle: "Dasar Privasi",
    termsTitle: "Terma Perkhidmatan",
    deleteTitle: "Padam akaun & data",
    lastUpdated: "Terakhir dikemas kini: 2 Ogos 2026",
    privacyIntro:
      "Dasar Privasi ini menerangkan cara ACOPAY (“kami”) mengendalikan maklumat apabila anda menggunakan acopay.net dan aplikasi dompet mudah alih ACOPAY (“Perkhidmatan”).",
    privacyH1: "1. Ringkasan produk",
    privacyP1:
      "ACOPAY menyediakan pengalaman dompet Solana bukan kustodian: anda boleh mencipta atau mengimport dompet, melihat baki, dan memindahkan token SPL (termasuk ACOPAY, USDT, SOL, dan token lain yang anda tambah). Frasa pemulihan dan kunci peribadi kekal pada peranti anda dan tidak dikumpul oleh ACOPAY.",
    privacyH2: "2. Data yang kami proses",
    privacyLi1Label: "Alamat awam dompet",
    privacyLi1Rest: " — diperlukan untuk menyebut yuran, membina, mensimulasikan, dan menyiarkan pemindahan yang anda minta.",
    privacyLi2Label: "Metadata transaksi",
    privacyLi2Rest:
      " — jumlah, alamat atau nama pengguna penerima yang anda masukkan, tandatangan, dan status pengesahan apabila anda menggunakan API pemindahan yang ditaja ACOPAY.",
    privacyLi3Label: "Log teknikal",
    privacyLi3Rest: " — log web/pelayan standard (IP, ejen pengguna, cap masa) untuk keselamatan dan pencegahan penyalahgunaan.",
    privacyLi4Label: "Hubungan pilihan",
    privacyLi4Before: " — jika anda menghantar e-mel kepada ",
    privacyLi4After: ", kami memproses kandungan surat-menyurat itu.",
    privacyH3: "3. Data yang tidak kami kumpul",
    privacyP3:
      "Kami tidak mengumpul frasa benih, kunci peribadi, atau templat biometrik anda. Buka kunci biometrik (Face ID / cap jari), jika didayakan, dikendalikan oleh OS peranti anda.",
    privacyH4: "4. Data on-chain",
    privacyP4:
      "Pemindahan yang anda sahkan direkodkan pada blockchain awam Solana. Data blockchain adalah awam dan di luar kawalan ACOPAY sebaik sahaja disiarkan.",
    privacyH5: "5. Pihak ketiga",
    privacyP5:
      "Kami menggunakan penyedia infrastruktur (hosting, CDN, titik akhir RPC) untuk mengendalikan Perkhidmatan. Kami tidak menjual data peribadi. Kami tidak menggunakan SDK pengiklanan dalam aplikasi mudah alih setakat tarikh ini.",
    privacyH6: "6. Tempoh simpanan",
    privacyP6:
      "Log sesi dan operasi bahagian pelayan disimpan hanya selama diperlukan untuk keselamatan, sokongan, dan kewajipan undang-undang, kemudian dipadam atau dinamakan tanpa nama.",
    privacyH7: "7. Pilihan anda",
    privacyP7Before:
      "Anda boleh berhenti menggunakan Perkhidmatan pada bila-bila masa, nyahpasang aplikasi, dan padam data dompet tempatan daripada peranti anda. Lihat ",
    privacyP7After: ".",
    privacyH8: "8. Hubungi",
    privacyContact: "Pertanyaan:",
    termsIntro:
      "Dengan menggunakan acopay.net atau dompet mudah alih ACOPAY (“Perkhidmatan”), anda bersetuju dengan Terma ini. Jika anda tidak bersetuju, jangan gunakan Perkhidmatan.",
    termsH1: "1. Sifat Perkhidmatan",
    termsP1:
      "ACOPAY ialah utiliti dompet dan pemindahan bukan kustodian untuk token Solana. Kami tidak mengendalikan bursa, tidak menyimpan kunci anda, dan tidak menjamin harga token atau pulangan pelaburan. Perkhidmatan ini bukan nasihat kewangan.",
    termsH2: "2. Tanggungjawab anda",
    termsLi1: "Anda bertanggungjawab sepenuhnya untuk mengamankan frasa pemulihan dan kunci peribadi anda.",
    termsLi2: "Anda bertanggungjawab mengesahkan alamat penerima sebelum memindahkan.",
    termsLi3: "Anda mesti mematuhi undang-undang yang terpakai kepada anda (termasuk peraturan kripto).",
    termsLi4: "Anda mesti berumur sekurang-kurangnya 18 tahun untuk menggunakan Perkhidmatan.",
    termsH3: "3. Yuran rangkaian",
    termsP3:
      "Bagi pemindahan ACOPAY yang disokong melalui aliran tajaan ACOPAY, yuran rangkaian (gas) Solana mungkin dibayar oleh ACOPAY/operator seperti yang didedahkan dalam produk. Bagi token lain (contohnya USDT, SOL, atau token SPL tersuai), anda membayar yuran rangkaian daripada dompet anda sendiri. Yuran pemindahan token (contohnya yuran on-chain ACOPAY sebanyak 0.01%) berasingan daripada gas Solana dan mengikut peraturan program on-chain.",
    termsH4: "4. Tiada kustodian; risiko kehilangan",
    termsP4:
      "Jika anda kehilangan frasa pemulihan atau peranti tanpa sandaran, aset anda mungkin tidak dapat dipulihkan secara kekal. Transaksi blockchain tidak boleh diterbalikkan sebaik sahaja disahkan.",
    termsH5: "5. Penggunaan yang dilarang",
    termsP5:
      "Anda tidak boleh menggunakan Perkhidmatan untuk aktiviti haram, penipuan, pengelakan sekatan, atau penyalahgunaan infrastruktur (spam, serangan, kejuruteraan songsang untuk tujuan memudaratkan).",
    termsH6: "6. Penafian",
    termsP6:
      "PERKHIDMATAN INI DISEDIAKAN “SEADANYA” TANPA SEBARANG JAMINAN. SETAKAT YANG DIBENARKAN OLEH UNDANG-UNDANG, ACOPAY TIDAK BERTANGGUNGJAWAB ATAS KEROSAKAN TIDAK LANGSUNG, SAMPINGAN, ATAU BERBANGKIT, ATAU KERUGIAN YANG TIMBUL DARIPADA KESILAPAN PENGGUNA, KEGAGALAN BLOCKCHAIN, ATAU PERKHIDMATAN PIHAK KETIGA.",
    termsH7: "7. Perubahan",
    termsP7:
      "Kami boleh mengemas kini Terma ini. Penggunaan berterusan selepas perubahan membentuk penerimaan Terma yang dikemas kini. Perubahan penting akan dicerminkan dengan mengemas kini tarikh di atas.",
    termsH8: "8. Hubungi",
    deleteIntro:
      "Google Play dan App Store memerlukan laluan pemadaman awam yang tidak memerlukan pemasangan aplikasi. Terakhir dikemas kini: 2 Ogos 2026",
    deleteHWhat: "Maksud “akaun” di sini",
    deletePWhat:
      "Dompet mudah alih ACOPAY adalah bukan kustodian. Kunci anda berada pada peranti anda. Tiada akaun log masuk pusat yang menyimpan dana anda. Pemadaman bermaksud mengalih keluar data dompet tempatan dan mana-mana sesi/data operasi bahagian pelayan yang berkaitan dengan alamat yang anda gunakan dengan API ACOPAY.",
    deleteHA: "A. Padam data pada peranti anda (serta-merta)",
    deleteA1: "Buka aplikasi ACOPAY → ketik logo ACOPAY → Log keluar.",
    deleteA2: "Nyahpasang aplikasi daripada peranti anda.",
    deleteA3: "Pilihan: kosongkan storan aplikasi / SecureStore sebelum menyahpasang jika OS anda menyediakan kawalan itu.",
    deleteWarnLabel: "Amaran:",
    deleteWarn: " Jika anda belum menyandarkan frasa pemulihan anda, log keluar atau menyahpasang mungkin menyebabkan dana anda tidak dapat dipulihkan.",
    deleteHB: "B. Minta pemadaman bahagian pelayan",
    deleteEmailBefore: "E-mel ke ",
    deleteEmailMid: " dengan subjek ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " dan sertakan:",
    deleteLi1: "Alamat dompet Solana anda yang digunakan dengan ACOPAY",
    deleteLi2: "Anggaran tarikh penggunaan (jika diketahui)",
    deleteP2:
      "Kami akan memadam atau menamakan tanpa nama rekod sesi dan surat-menyurat sokongan berkaitan dalam masa 30 hari, kecuali data yang perlu kami simpan atas sebab undang-undang atau keselamatan, dan kecuali rekod blockchain awam yang tidak boleh dipadam.",
    deleteHRelated: "Berkaitan",
  }),

  hi: L({
    privacyTitle: "गोपनीयता नीति",
    termsTitle: "सेवा की शर्तें",
    deleteTitle: "खाता और डेटा हटाएँ",
    lastUpdated: "अंतिम अपडेट: 2 अगस्त 2026",
    privacyIntro:
      "यह गोपनीयता नीति बताती है कि जब आप acopay.net और ACOPAY मोबाइल वॉलेट ऐप (“सेवाएँ”) का उपयोग करते हैं, तो ACOPAY (“हम”) जानकारी को कैसे संभालता है।",
    privacyH1: "1. उत्पाद सारांश",
    privacyP1:
      "ACOPAY एक नॉन-कस्टोडियल Solana वॉलेट अनुभव प्रदान करता है: आप वॉलेट बना या इम्पोर्ट कर सकते हैं, बैलेंस देख सकते हैं, और SPL टोकन (ACOPAY, USDT, SOL और आपके द्वारा जोड़े गए अन्य टोकन सहित) ट्रांसफर कर सकते हैं। रिकवरी फ़्रेज़ और प्राइवेट की हमेशा आपके डिवाइस पर रहते हैं और ACOPAY द्वारा एकत्र नहीं किए जाते।",
    privacyH2: "2. डेटा जिसे हम प्रोसेस करते हैं",
    privacyLi1Label: "वॉलेट के सार्वजनिक पते",
    privacyLi1Rest: " — आपके अनुरोध किए गए ट्रांसफर के लिए शुल्क बताने, बनाने, सिमुलेट करने और प्रसारित करने के लिए आवश्यक।",
    privacyLi2Label: "ट्रांज़ैक्शन मेटाडेटा",
    privacyLi2Rest:
      " — राशि, आपके द्वारा दर्ज किए गए प्राप्तकर्ता पते या यूज़रनेम, हस्ताक्षर, और जब आप ACOPAY-प्रायोजित ट्रांसफर API का उपयोग करते हैं तब पुष्टि स्थिति।",
    privacyLi3Label: "तकनीकी लॉग",
    privacyLi3Rest: " — सुरक्षा और दुरुपयोग रोकथाम के लिए मानक वेब/सर्वर लॉग (IP, यूज़र एजेंट, टाइमस्टैम्प)।",
    privacyLi4Label: "वैकल्पिक संपर्क",
    privacyLi4Before: " — यदि आप ",
    privacyLi4After: " पर ईमेल भेजते हैं, तो हम उस पत्राचार की सामग्री को प्रोसेस करते हैं।",
    privacyH3: "3. डेटा जो हम एकत्र नहीं करते",
    privacyP3:
      "हम आपका सीड फ़्रेज़, प्राइवेट की, या बायोमेट्रिक टेम्पलेट एकत्र नहीं करते। बायोमेट्रिक अनलॉक (Face ID / फिंगरप्रिंट), यदि सक्षम है, तो आपके डिवाइस के OS द्वारा संभाला जाता है।",
    privacyH4: "4. ऑन-चेन डेटा",
    privacyP4:
      "आपके द्वारा पुष्टि किए गए ट्रांसफर Solana के सार्वजनिक ब्लॉकचेन पर दर्ज किए जाते हैं। प्रसारित होने के बाद ब्लॉकचेन डेटा सार्वजनिक होता है और ACOPAY के नियंत्रण से बाहर होता है।",
    privacyH5: "5. तीसरे पक्ष",
    privacyP5:
      "हम सेवाएँ संचालित करने के लिए इंफ्रास्ट्रक्चर प्रदाताओं (होस्टिंग, CDN, RPC एंडपॉइंट) का उपयोग करते हैं। हम व्यक्तिगत डेटा नहीं बेचते। इस तारीख तक, हम मोबाइल ऐप में विज्ञापन SDK का उपयोग नहीं करते।",
    privacyH6: "6. डेटा प्रतिधारण",
    privacyP6:
      "सर्वर-साइड सेशन और परिचालन लॉग केवल तब तक बनाए रखे जाते हैं जब तक सुरक्षा, सहायता और कानूनी दायित्वों के लिए आवश्यक हो, फिर उन्हें हटा दिया जाता है या गुमनाम बना दिया जाता है।",
    privacyH7: "7. आपके विकल्प",
    privacyP7Before:
      "आप किसी भी समय सेवाओं का उपयोग बंद कर सकते हैं, ऐप को अनइंस्टॉल कर सकते हैं, और अपने डिवाइस से स्थानीय वॉलेट डेटा मिटा सकते हैं। देखें ",
    privacyP7After: "।",
    privacyH8: "8. संपर्क करें",
    privacyContact: "प्रश्न:",
    termsIntro:
      "acopay.net या ACOPAY मोबाइल वॉलेट (“सेवाएँ”) का उपयोग करके, आप इन शर्तों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो सेवाओं का उपयोग न करें।",
    termsH1: "1. सेवाओं की प्रकृति",
    termsP1:
      "ACOPAY Solana टोकन के लिए एक नॉन-कस्टोडियल वॉलेट और ट्रांसफर यूटिलिटी है। हम कोई एक्सचेंज संचालित नहीं करते, आपकी की को कस्टडी में नहीं रखते, और टोकन की कीमतों या निवेश रिटर्न की गारंटी नहीं देते। सेवाएँ वित्तीय सलाह नहीं हैं।",
    termsH2: "2. आपकी ज़िम्मेदारियाँ",
    termsLi1: "अपने रिकवरी फ़्रेज़ और प्राइवेट की को सुरक्षित रखने की पूरी ज़िम्मेदारी आपकी है।",
    termsLi2: "ट्रांसफर करने से पहले प्राप्तकर्ता के पते को सत्यापित करने की ज़िम्मेदारी आपकी है।",
    termsLi3: "आपको अपने ऊपर लागू कानूनों (क्रिप्टो नियमों सहित) का पालन करना होगा।",
    termsLi4: "सेवाओं का उपयोग करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए।",
    termsH3: "3. नेटवर्क शुल्क",
    termsP3:
      "ACOPAY के प्रायोजित फ़्लो के माध्यम से समर्थित ACOPAY ट्रांसफर के लिए, Solana नेटवर्क (गैस) शुल्क उत्पाद में बताए अनुसार ACOPAY/ऑपरेटर द्वारा भुगतान किए जा सकते हैं। अन्य टोकन (उदाहरण के लिए USDT, SOL, या कस्टम SPL टोकन) के लिए, आप अपने वॉलेट से नेटवर्क शुल्क का भुगतान करते हैं। टोकन ट्रांसफर शुल्क (उदाहरण के लिए ACOPAY का 0.01% ऑन-चेन शुल्क) Solana गैस से अलग हैं और ऑन-चेन प्रोग्राम नियमों का पालन करते हैं।",
    termsH4: "4. कोई कस्टडी नहीं; हानि का जोखिम",
    termsP4:
      "यदि आप बैकअप के बिना अपना रिकवरी फ़्रेज़ या डिवाइस खो देते हैं, तो आपकी संपत्ति स्थायी रूप से अप्राप्य हो सकती है। पुष्टि होने के बाद ब्लॉकचेन ट्रांज़ैक्शन को पलटा नहीं जा सकता।",
    termsH5: "5. प्रतिबंधित उपयोग",
    termsP5:
      "आप सेवाओं का उपयोग अवैध गतिविधि, धोखाधड़ी, प्रतिबंध से बचने, या इंफ्रास्ट्रक्चर के दुरुपयोग (स्पैम, हमले, हानि पहुँचाने के लिए रिवर्स इंजीनियरिंग) के लिए नहीं कर सकते।",
    termsH6: "6. अस्वीकरण",
    termsP6:
      "सेवाएँ बिना किसी प्रकार की वारंटी के “जैसी हैं वैसी” प्रदान की जाती हैं। कानून द्वारा अनुमत अधिकतम सीमा तक, ACOPAY अप्रत्यक्ष, आकस्मिक, या परिणामी क्षति के लिए, या उपयोगकर्ता की त्रुटि, ब्लॉकचेन विफलताओं, या तृतीय-पक्ष सेवाओं से उत्पन्न हानियों के लिए उत्तरदायी नहीं है।",
    termsH7: "7. परिवर्तन",
    termsP7:
      "हम इन शर्तों को अपडेट कर सकते हैं। परिवर्तनों के बाद निरंतर उपयोग अपडेट की गई शर्तों की स्वीकृति माना जाएगा। महत्वपूर्ण परिवर्तन ऊपर दी गई तारीख को अपडेट करके दर्शाए जाएँगे।",
    termsH8: "8. संपर्क करें",
    deleteIntro:
      "Google Play और App Store को ऐसा सार्वजनिक डिलीशन तरीका चाहिए जिसके लिए ऐप इंस्टॉल करने की आवश्यकता न हो। अंतिम अपडेट: 2 अगस्त 2026",
    deleteHWhat: "यहाँ “खाते” का क्या मतलब है",
    deletePWhat:
      "ACOPAY मोबाइल वॉलेट नॉन-कस्टोडियल है। आपकी की आपके डिवाइस पर रहती है। कोई केंद्रीय लॉगिन खाता नहीं है जो आपके फंड रखता हो। हटाने का मतलब है स्थानीय वॉलेट डेटा और आपके द्वारा ACOPAY API के साथ उपयोग किए गए पतों से जुड़े किसी भी सर्वर-साइड सेशन/परिचालन डेटा को हटाना।",
    deleteHA: "A. अपने डिवाइस पर डेटा हटाएँ (तुरंत)",
    deleteA1: "ACOPAY ऐप खोलें → ACOPAY लोगो पर टैप करें → साइन आउट करें।",
    deleteA2: "अपने डिवाइस से ऐप को अनइंस्टॉल करें।",
    deleteA3: "वैकल्पिक: यदि आपका OS वह नियंत्रण प्रदान करता है, तो अनइंस्टॉल से पहले ऐप स्टोरेज / SecureStore साफ़ करें।",
    deleteWarnLabel: "चेतावनी:",
    deleteWarn: " यदि आपने अपने रिकवरी फ़्रेज़ का बैकअप नहीं लिया है, तो साइन आउट करने या अनइंस्टॉल करने से आपके फंड अप्राप्य हो सकते हैं।",
    deleteHB: "B. सर्वर-साइड डिलीशन का अनुरोध करें",
    deleteEmailBefore: "ईमेल करें ",
    deleteEmailMid: " विषय के साथ ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " और इसमें शामिल करें:",
    deleteLi1: "ACOPAY के साथ उपयोग किए गए आपके Solana वॉलेट पते",
    deleteLi2: "उपयोग की अनुमानित तारीखें (यदि ज्ञात हों)",
    deleteP2:
      "हम संबंधित सेशन रिकॉर्ड और सहायता पत्राचार को 30 दिनों के भीतर हटा देंगे या गुमनाम बना देंगे, उन डेटा को छोड़कर जिन्हें हमें कानूनी या सुरक्षा कारणों से बनाए रखना आवश्यक है, और उन सार्वजनिक ब्लॉकचेन रिकॉर्ड को छोड़कर जिन्हें हटाया नहीं जा सकता।",
    deleteHRelated: "संबंधित",
  }),

  es: L({
    privacyTitle: "Política de privacidad",
    termsTitle: "Términos del servicio",
    deleteTitle: "Eliminar cuenta y datos",
    lastUpdated: "Última actualización: 2 de agosto de 2026",
    privacyIntro:
      "Esta Política de privacidad describe cómo ACOPAY (“nosotros”) gestiona la información cuando usas acopay.net y la aplicación de cartera móvil ACOPAY (los “Servicios”).",
    privacyH1: "1. Resumen del producto",
    privacyP1:
      "ACOPAY ofrece una experiencia de cartera Solana no custodiada: puedes crear o importar una cartera, ver saldos y transferir tokens SPL (incluidos ACOPAY, USDT, SOL y otros tokens que añadas). Las frases de recuperación y las claves privadas permanecen en tu dispositivo y ACOPAY no las recopila.",
    privacyH2: "2. Datos que procesamos",
    privacyLi1Label: "Direcciones públicas de la cartera",
    privacyLi1Rest: " — necesarias para cotizar comisiones, crear, simular y difundir las transferencias que solicites.",
    privacyLi2Label: "Metadatos de la transacción",
    privacyLi2Rest:
      " — importes, direcciones o nombres de usuario del destinatario que introduzcas, firmas y estado de confirmación cuando uses las API de transferencia patrocinadas por ACOPAY.",
    privacyLi3Label: "Registros técnicos",
    privacyLi3Rest: " — registros estándar de web/servidor (IP, agente de usuario, marcas de tiempo) para seguridad y prevención de abusos.",
    privacyLi4Label: "Contacto opcional",
    privacyLi4Before: " — si envías un correo a ",
    privacyLi4After: ", procesamos el contenido de esa correspondencia.",
    privacyH3: "3. Datos que no recopilamos",
    privacyP3:
      "No recopilamos tu frase semilla, clave privada ni plantillas biométricas. El desbloqueo biométrico (Face ID / huella), si está activado, lo gestiona el sistema operativo de tu dispositivo.",
    privacyH4: "4. Datos en cadena",
    privacyP4:
      "Las transferencias que confirmas se registran en la blockchain pública de Solana. Los datos de la blockchain son públicos y quedan fuera del control de ACOPAY una vez difundidos.",
    privacyH5: "5. Terceros",
    privacyP5:
      "Usamos proveedores de infraestructura (hosting, CDN, endpoints RPC) para operar los Servicios. No vendemos datos personales. No usamos SDK de publicidad en la app móvil a fecha de hoy.",
    privacyH6: "6. Conservación",
    privacyP6:
      "Los registros de sesión y operativos del lado del servidor se conservan solo el tiempo necesario por motivos de seguridad, soporte y obligaciones legales, y luego se eliminan o anonimizan.",
    privacyH7: "7. Tus opciones",
    privacyP7Before:
      "Puedes dejar de usar los Servicios en cualquier momento, desinstalar la app y borrar los datos locales de la cartera de tu dispositivo. Consulta ",
    privacyP7After: ".",
    privacyH8: "8. Contacto",
    privacyContact: "Preguntas:",
    termsIntro:
      "Al usar acopay.net o la cartera móvil ACOPAY (los “Servicios”), aceptas estos Términos. Si no estás de acuerdo, no uses los Servicios.",
    termsH1: "1. Naturaleza de los Servicios",
    termsP1:
      "ACOPAY es una utilidad de cartera y transferencia no custodiada para tokens de Solana. No operamos un exchange, no custodiamos tus claves y no garantizamos precios de tokens ni rendimientos de inversión. Los Servicios no constituyen asesoramiento financiero.",
    termsH2: "2. Tus responsabilidades",
    termsLi1: "Eres el único responsable de proteger tu frase de recuperación y tus claves privadas.",
    termsLi2: "Eres responsable de verificar las direcciones de destino antes de transferir.",
    termsLi3: "Debes cumplir con las leyes que te sean aplicables (incluidas las regulaciones sobre criptoactivos).",
    termsLi4: "Debes tener al menos 18 años para usar los Servicios.",
    termsH3: "3. Comisiones de red",
    termsP3:
      "Para las transferencias de ACOPAY admitidas a través del flujo patrocinado de ACOPAY, las comisiones de red (gas) de Solana pueden ser pagadas por ACOPAY/el operador según se indique en el producto. Para otros tokens (por ejemplo, USDT, SOL o tokens SPL personalizados), pagas las comisiones de red desde tu propia cartera. Las comisiones de transferencia de tokens (por ejemplo, la comisión on-chain del 0,01% de ACOPAY) son independientes del gas de Solana y siguen las reglas del programa on-chain.",
    termsH4: "4. Sin custodia; riesgo de pérdida",
    termsP4:
      "Si pierdes tu frase de recuperación o tu dispositivo sin una copia de seguridad, tus activos pueden quedar permanentemente irrecuperables. Las transacciones en blockchain son irreversibles una vez confirmadas.",
    termsH5: "5. Uso prohibido",
    termsP5:
      "No puedes usar los Servicios para actividades ilegales, fraude, evasión de sanciones o abuso de la infraestructura (spam, ataques, ingeniería inversa con fines dañinos).",
    termsH6: "6. Exención de responsabilidad",
    termsP6:
      "LOS SERVICIOS SE PROPORCIONAN “TAL CUAL”, SIN GARANTÍAS DE NINGÚN TIPO. EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY, ACOPAY NO SERÁ RESPONSABLE DE DAÑOS INDIRECTOS, INCIDENTALES O CONSECUENTES, NI DE PÉRDIDAS DERIVADAS DE ERRORES DEL USUARIO, FALLOS DE LA BLOCKCHAIN O SERVICIOS DE TERCEROS.",
    termsH7: "7. Cambios",
    termsP7:
      "Podemos actualizar estos Términos. El uso continuado tras los cambios constituye la aceptación de los Términos actualizados. Los cambios materiales se reflejarán actualizando la fecha indicada arriba.",
    termsH8: "8. Contacto",
    deleteIntro:
      "Google Play y App Store exigen una vía pública de eliminación que no requiera instalar la app. Última actualización: 2 de agosto de 2026",
    deleteHWhat: "Qué significa “cuenta” aquí",
    deletePWhat:
      "La cartera móvil ACOPAY no es custodiada. Tus claves residen en tu dispositivo. No existe una cuenta de acceso central que retenga tus fondos. Eliminar significa borrar los datos locales de la cartera y cualquier sesión/dato operativo del lado del servidor vinculado a las direcciones que hayas usado con las API de ACOPAY.",
    deleteHA: "A. Eliminar datos en tu dispositivo (al instante)",
    deleteA1: "Abre la app ACOPAY → toca el logotipo de ACOPAY → Cerrar sesión.",
    deleteA2: "Desinstala la app de tu dispositivo.",
    deleteA3: "Opcional: borra el almacenamiento de la app / SecureStore antes de desinstalar si tu sistema operativo lo permite.",
    deleteWarnLabel: "Advertencia:",
    deleteWarn: " Si no has respaldado tu frase de recuperación, cerrar sesión o desinstalar puede hacer que tus fondos sean irrecuperables.",
    deleteHB: "B. Solicitar la eliminación en el servidor",
    deleteEmailBefore: "Envía un correo a ",
    deleteEmailMid: " con el asunto ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " e incluye:",
    deleteLi1: "Tus direcciones de cartera de Solana usadas con ACOPAY",
    deleteLi2: "Fechas aproximadas de uso (si las conoces)",
    deleteP2:
      "Eliminaremos o anonimizaremos los registros de sesión y la correspondencia de soporte asociados en un plazo de 30 días, salvo los datos que debamos conservar por motivos legales o de seguridad, y salvo los registros públicos de la blockchain, que no se pueden eliminar.",
    deleteHRelated: "Relacionado",
  }),

  pt: L({
    privacyTitle: "Política de Privacidade",
    termsTitle: "Termos de Serviço",
    deleteTitle: "Excluir conta e dados",
    lastUpdated: "Última atualização: 2 de agosto de 2026",
    privacyIntro:
      "Esta Política de Privacidade descreve como a ACOPAY (“nós”) trata as informações quando você usa o acopay.net e o aplicativo de carteira móvel ACOPAY (os “Serviços”).",
    privacyH1: "1. Resumo do produto",
    privacyP1:
      "A ACOPAY oferece uma experiência de carteira Solana não custodial: você pode criar ou importar uma carteira, ver saldos e transferir tokens SPL (incluindo ACOPAY, USDT, SOL e outros tokens que você adicionar). As frases de recuperação e as chaves privadas permanecem no seu dispositivo e não são coletadas pela ACOPAY.",
    privacyH2: "2. Dados que processamos",
    privacyLi1Label: "Endereços públicos da carteira",
    privacyLi1Rest: " — necessários para cotar taxas, criar, simular e transmitir as transferências que você solicitar.",
    privacyLi2Label: "Metadados da transação",
    privacyLi2Rest:
      " — valores, endereços ou nomes de usuário do destinatário que você inserir, assinaturas e status de confirmação ao usar as APIs de transferência patrocinadas pela ACOPAY.",
    privacyLi3Label: "Registros técnicos",
    privacyLi3Rest: " — registros padrão de web/servidor (IP, user agent, carimbos de data/hora) para segurança e prevenção de abusos.",
    privacyLi4Label: "Contato opcional",
    privacyLi4Before: " — se você enviar um e-mail para ",
    privacyLi4After: ", processamos o conteúdo dessa correspondência.",
    privacyH3: "3. Dados que não coletamos",
    privacyP3:
      "Não coletamos sua seed phrase, chave privada ou modelos biométricos. O desbloqueio biométrico (Face ID / impressão digital), se ativado, é gerenciado pelo sistema operacional do seu dispositivo.",
    privacyH4: "4. Dados on-chain",
    privacyP4:
      "As transferências que você confirma são registradas na blockchain pública da Solana. Os dados da blockchain são públicos e ficam fora do controle da ACOPAY assim que transmitidos.",
    privacyH5: "5. Terceiros",
    privacyP5:
      "Usamos provedores de infraestrutura (hospedagem, CDN, endpoints RPC) para operar os Serviços. Não vendemos dados pessoais. Não usamos SDKs de publicidade no aplicativo móvel até a presente data.",
    privacyH6: "6. Retenção",
    privacyP6:
      "Os registros de sessão e operacionais do lado do servidor são mantidos apenas pelo tempo necessário para segurança, suporte e obrigações legais, sendo depois excluídos ou anonimizados.",
    privacyH7: "7. Suas escolhas",
    privacyP7Before:
      "Você pode parar de usar os Serviços a qualquer momento, desinstalar o aplicativo e apagar os dados locais da carteira do seu dispositivo. Veja ",
    privacyP7After: ".",
    privacyH8: "8. Contato",
    privacyContact: "Dúvidas:",
    termsIntro:
      "Ao usar o acopay.net ou a carteira móvel ACOPAY (os “Serviços”), você concorda com estes Termos. Se não concordar, não use os Serviços.",
    termsH1: "1. Natureza dos Serviços",
    termsP1:
      "A ACOPAY é um utilitário de carteira e transferência não custodial para tokens Solana. Não operamos uma exchange, não custodiamos suas chaves e não garantimos preços de tokens ou retornos de investimento. Os Serviços não constituem aconselhamento financeiro.",
    termsH2: "2. Suas responsabilidades",
    termsLi1: "Você é o único responsável por proteger sua frase de recuperação e suas chaves privadas.",
    termsLi2: "Você é responsável por verificar os endereços do destinatário antes de transferir.",
    termsLi3: "Você deve cumprir as leis aplicáveis a você (incluindo regulamentações sobre criptoativos).",
    termsLi4: "Você deve ter pelo menos 18 anos para usar os Serviços.",
    termsH3: "3. Taxas de rede",
    termsP3:
      "Para transferências ACOPAY suportadas pelo fluxo patrocinado da ACOPAY, as taxas de rede (gás) da Solana podem ser pagas pela ACOPAY/operador, conforme divulgado no produto. Para outros tokens (por exemplo, USDT, SOL ou tokens SPL personalizados), você paga as taxas de rede pela sua própria carteira. As taxas de transferência de tokens (por exemplo, a taxa on-chain de 0,01% da ACOPAY) são separadas do gás da Solana e seguem as regras do programa on-chain.",
    termsH4: "4. Sem custódia; risco de perda",
    termsP4:
      "Se você perder sua frase de recuperação ou seu dispositivo sem backup, seus ativos podem se tornar permanentemente irrecuperáveis. As transações em blockchain são irreversíveis após a confirmação.",
    termsH5: "5. Uso proibido",
    termsP5:
      "Você não pode usar os Serviços para atividades ilegais, fraude, evasão de sanções ou abuso da infraestrutura (spam, ataques, engenharia reversa com intenção de causar dano).",
    termsH6: "6. Isenção de responsabilidade",
    termsP6:
      "OS SERVIÇOS SÃO FORNECIDOS “NO ESTADO EM QUE SE ENCONTRAM”, SEM GARANTIAS DE QUALQUER TIPO. NA MEDIDA MÁXIMA PERMITIDA POR LEI, A ACOPAY NÃO SE RESPONSABILIZA POR DANOS INDIRETOS, INCIDENTAIS OU CONSEQUENCIAIS, NEM POR PERDAS DECORRENTES DE ERRO DO USUÁRIO, FALHAS DE BLOCKCHAIN OU SERVIÇOS DE TERCEIROS.",
    termsH7: "7. Alterações",
    termsP7:
      "Podemos atualizar estes Termos. O uso continuado após as alterações constitui aceitação dos Termos atualizados. Alterações materiais serão refletidas atualizando a data acima.",
    termsH8: "8. Contato",
    deleteIntro:
      "A Google Play e a App Store exigem um caminho público de exclusão que não requeira a instalação do aplicativo. Última atualização: 2 de agosto de 2026",
    deleteHWhat: "O que significa “conta” aqui",
    deletePWhat:
      "A carteira móvel ACOPAY é não custodial. Suas chaves ficam no seu dispositivo. Não existe uma conta de login central que retenha seus fundos. Excluir significa remover os dados locais da carteira e quaisquer sessões/dados operacionais do lado do servidor vinculados aos endereços que você usou com as APIs da ACOPAY.",
    deleteHA: "A. Excluir dados no seu dispositivo (instantâneo)",
    deleteA1: "Abra o aplicativo ACOPAY → toque no logotipo da ACOPAY → Sair.",
    deleteA2: "Desinstale o aplicativo do seu dispositivo.",
    deleteA3: "Opcional: limpe o armazenamento do aplicativo / SecureStore antes de desinstalar, se o seu sistema operacional oferecer esse controle.",
    deleteWarnLabel: "Aviso:",
    deleteWarn: " Se você não fez backup da sua frase de recuperação, sair ou desinstalar pode tornar seus fundos irrecuperáveis.",
    deleteHB: "B. Solicitar exclusão no lado do servidor",
    deleteEmailBefore: "Envie um e-mail para ",
    deleteEmailMid: " com o assunto ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " e inclua:",
    deleteLi1: "Seu(s) endereço(s) de carteira Solana usado(s) com a ACOPAY",
    deleteLi2: "Datas aproximadas de uso (se conhecidas)",
    deleteP2:
      "Excluiremos ou anonimizaremos os registros de sessão e a correspondência de suporte associados em até 30 dias, exceto os dados que devamos reter por motivos legais ou de segurança, e exceto os registros públicos da blockchain, que não podem ser excluídos.",
    deleteHRelated: "Relacionado",
  }),

  fr: L({
    privacyTitle: "Politique de confidentialité",
    termsTitle: "Conditions d'utilisation",
    deleteTitle: "Supprimer le compte et les données",
    lastUpdated: "Dernière mise à jour : 2 août 2026",
    privacyIntro:
      "Cette politique de confidentialité décrit comment ACOPAY (« nous ») traite les informations lorsque vous utilisez acopay.net et l'application de portefeuille mobile ACOPAY (les « Services »).",
    privacyH1: "1. Présentation du produit",
    privacyP1:
      "ACOPAY offre une expérience de portefeuille Solana non dépositaire : vous pouvez créer ou importer un portefeuille, consulter les soldes et transférer des tokens SPL (dont ACOPAY, USDT, SOL et d'autres tokens que vous ajoutez). Les phrases de récupération et les clés privées restent sur votre appareil et ne sont pas collectées par ACOPAY.",
    privacyH2: "2. Données que nous traitons",
    privacyLi1Label: "Adresses publiques du portefeuille",
    privacyLi1Rest: " — nécessaires pour estimer les frais, construire, simuler et diffuser les transferts que vous demandez.",
    privacyLi2Label: "Métadonnées de transaction",
    privacyLi2Rest:
      " — montants, adresses ou noms d'utilisateur des destinataires que vous saisissez, signatures et statut de confirmation lorsque vous utilisez les API de transfert parrainées par ACOPAY.",
    privacyLi3Label: "Journaux techniques",
    privacyLi3Rest: " — journaux web/serveur standard (IP, user agent, horodatages) pour la sécurité et la prévention des abus.",
    privacyLi4Label: "Contact facultatif",
    privacyLi4Before: " — si vous envoyez un e-mail à ",
    privacyLi4After: ", nous traitons le contenu de cette correspondance.",
    privacyH3: "3. Données que nous ne collectons pas",
    privacyP3:
      "Nous ne collectons pas votre phrase de récupération, votre clé privée ni vos modèles biométriques. Le déverrouillage biométrique (Face ID / empreinte digitale), s'il est activé, est géré par le système d'exploitation de votre appareil.",
    privacyH4: "4. Données on-chain",
    privacyP4:
      "Les transferts que vous confirmez sont enregistrés sur la blockchain publique Solana. Les données de la blockchain sont publiques et échappent au contrôle d'ACOPAY une fois diffusées.",
    privacyH5: "5. Tiers",
    privacyP5:
      "Nous utilisons des fournisseurs d'infrastructure (hébergement, CDN, points de terminaison RPC) pour exploiter les Services. Nous ne vendons pas de données personnelles. Nous n'utilisons pas de SDK publicitaires dans l'application mobile à ce jour.",
    privacyH6: "6. Conservation",
    privacyP6:
      "Les journaux de session et d'exploitation côté serveur ne sont conservés que le temps nécessaire à la sécurité, au support et aux obligations légales, puis sont supprimés ou anonymisés.",
    privacyH7: "7. Vos choix",
    privacyP7Before:
      "Vous pouvez cesser d'utiliser les Services à tout moment, désinstaller l'application et effacer les données locales du portefeuille de votre appareil. Voir ",
    privacyP7After: ".",
    privacyH8: "8. Contact",
    privacyContact: "Questions :",
    termsIntro:
      "En utilisant acopay.net ou le portefeuille mobile ACOPAY (les « Services »), vous acceptez les présentes Conditions. Si vous n'êtes pas d'accord, n'utilisez pas les Services.",
    termsH1: "1. Nature des Services",
    termsP1:
      "ACOPAY est un utilitaire de portefeuille et de transfert non dépositaire pour les tokens Solana. Nous n'exploitons pas de plateforme d'échange, ne conservons pas vos clés et ne garantissons ni les prix des tokens ni les rendements d'investissement. Les Services ne constituent pas un conseil financier.",
    termsH2: "2. Vos responsabilités",
    termsLi1: "Vous êtes seul responsable de la sécurité de votre phrase de récupération et de vos clés privées.",
    termsLi2: "Vous êtes responsable de la vérification des adresses des destinataires avant tout transfert.",
    termsLi3: "Vous devez respecter les lois qui vous sont applicables (y compris la réglementation sur les cryptoactifs).",
    termsLi4: "Vous devez avoir au moins 18 ans pour utiliser les Services.",
    termsH3: "3. Frais de réseau",
    termsP3:
      "Pour les transferts ACOPAY pris en charge via le flux parrainé par ACOPAY, les frais de réseau (gas) Solana peuvent être payés par ACOPAY/l'opérateur, comme indiqué dans le produit. Pour les autres tokens (par exemple USDT, SOL ou tokens SPL personnalisés), vous payez les frais de réseau depuis votre propre portefeuille. Les frais de transfert de tokens (par exemple les frais on-chain de 0,01 % d'ACOPAY) sont distincts du gas Solana et suivent les règles du programme on-chain.",
    termsH4: "4. Absence de garde ; risque de perte",
    termsP4:
      "Si vous perdez votre phrase de récupération ou votre appareil sans sauvegarde, vos actifs peuvent devenir définitivement irrécupérables. Les transactions sur la blockchain sont irréversibles une fois confirmées.",
    termsH5: "5. Usages interdits",
    termsP5:
      "Vous ne pouvez pas utiliser les Services pour des activités illégales, de la fraude, le contournement de sanctions, ou l'abus de l'infrastructure (spam, attaques, rétro-ingénierie à des fins malveillantes).",
    termsH6: "6. Avertissement",
    termsP6:
      "LES SERVICES SONT FOURNIS « EN L'ÉTAT », SANS GARANTIE D'AUCUNE SORTE. DANS LA MESURE MAXIMALE PERMISE PAR LA LOI, ACOPAY N'EST PAS RESPONSABLE DES DOMMAGES INDIRECTS, ACCESSOIRES OU CONSÉCUTIFS, NI DES PERTES RÉSULTANT D'UNE ERREUR DE L'UTILISATEUR, DE DÉFAILLANCES DE LA BLOCKCHAIN OU DE SERVICES TIERS.",
    termsH7: "7. Modifications",
    termsP7:
      "Nous pouvons mettre à jour les présentes Conditions. La poursuite de l'utilisation après modification vaut acceptation des Conditions mises à jour. Les modifications importantes seront reflétées par la mise à jour de la date ci-dessus.",
    termsH8: "8. Contact",
    deleteIntro:
      "Google Play et l'App Store exigent un moyen public de suppression qui ne nécessite pas l'installation de l'application. Dernière mise à jour : 2 août 2026",
    deleteHWhat: "Ce que signifie « compte » ici",
    deletePWhat:
      "Le portefeuille mobile ACOPAY est non dépositaire. Vos clés se trouvent sur votre appareil. Il n'existe pas de compte de connexion central détenant vos fonds. Supprimer signifie effacer les données locales du portefeuille et toute session/donnée d'exploitation côté serveur liée aux adresses que vous avez utilisées avec les API d'ACOPAY.",
    deleteHA: "A. Supprimer les données sur votre appareil (immédiat)",
    deleteA1: "Ouvrez l'application ACOPAY → appuyez sur le logo ACOPAY → Déconnexion.",
    deleteA2: "Désinstallez l'application de votre appareil.",
    deleteA3: "Facultatif : effacez le stockage de l'application / SecureStore avant la désinstallation si votre système d'exploitation le permet.",
    deleteWarnLabel: "Avertissement :",
    deleteWarn: " Si vous n'avez pas sauvegardé votre phrase de récupération, vous déconnecter ou désinstaller l'application peut rendre vos fonds irrécupérables.",
    deleteHB: "B. Demander une suppression côté serveur",
    deleteEmailBefore: "Envoyez un e-mail à ",
    deleteEmailMid: " avec pour objet ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " et incluez :",
    deleteLi1: "Votre ou vos adresses de portefeuille Solana utilisées avec ACOPAY",
    deleteLi2: "Dates approximatives d'utilisation (si connues)",
    deleteP2:
      "Nous supprimerons ou anonymiserons les enregistrements de session et la correspondance de support associés sous 30 jours, à l'exception des données que nous devons conserver pour des raisons légales ou de sécurité, et à l'exception des enregistrements publics de la blockchain qui ne peuvent pas être supprimés.",
    deleteHRelated: "En rapport",
  }),

  de: L({
    privacyTitle: "Datenschutzerklärung",
    termsTitle: "Nutzungsbedingungen",
    deleteTitle: "Konto & Daten löschen",
    lastUpdated: "Zuletzt aktualisiert: 2. August 2026",
    privacyIntro:
      "Diese Datenschutzerklärung beschreibt, wie ACOPAY (“wir”) mit Informationen umgeht, wenn Sie acopay.net und die mobile ACOPAY-Geldbörsen-App (die “Dienste”) nutzen.",
    privacyH1: "1. Produktübersicht",
    privacyP1:
      "ACOPAY bietet eine nicht-verwahrende Solana-Geldbörsen-Erfahrung: Sie können eine Geldbörse erstellen oder importieren, Guthaben einsehen und SPL-Token übertragen (einschließlich ACOPAY, USDT, SOL und weiterer von Ihnen hinzugefügter Token). Wiederherstellungsphrasen und private Schlüssel verbleiben auf Ihrem Gerät und werden von ACOPAY nicht erhoben.",
    privacyH2: "2. Daten, die wir verarbeiten",
    privacyLi1Label: "Öffentliche Geldbörsenadressen",
    privacyLi1Rest: " — erforderlich, um Gebühren zu ermitteln sowie von Ihnen angeforderte Überweisungen zu erstellen, zu simulieren und zu übertragen.",
    privacyLi2Label: "Transaktionsmetadaten",
    privacyLi2Rest:
      " — Beträge, von Ihnen eingegebene Empfängeradressen oder Benutzernamen, Signaturen und Bestätigungsstatus, wenn Sie von ACOPAY gesponserte Überweisungs-APIs nutzen.",
    privacyLi3Label: "Technische Protokolle",
    privacyLi3Rest: " — Standard-Web-/Serverprotokolle (IP, User-Agent, Zeitstempel) zur Sicherheit und Missbrauchsprävention.",
    privacyLi4Label: "Optionaler Kontakt",
    privacyLi4Before: " — wenn Sie eine E-Mail an ",
    privacyLi4After: " senden, verarbeiten wir den Inhalt dieser Korrespondenz.",
    privacyH3: "3. Daten, die wir nicht erheben",
    privacyP3:
      "Wir erheben weder Ihre Seed-Phrase noch Ihren privaten Schlüssel oder biometrische Vorlagen. Die biometrische Entsperrung (Face ID / Fingerabdruck), falls aktiviert, wird vom Betriebssystem Ihres Geräts verwaltet.",
    privacyH4: "4. On-Chain-Daten",
    privacyP4:
      "Von Ihnen bestätigte Überweisungen werden auf der öffentlichen Solana-Blockchain erfasst. Blockchain-Daten sind nach der Übertragung öffentlich und liegen außerhalb der Kontrolle von ACOPAY.",
    privacyH5: "5. Dritte",
    privacyP5:
      "Wir nutzen Infrastrukturanbieter (Hosting, CDN, RPC-Endpunkte), um die Dienste zu betreiben. Wir verkaufen keine personenbezogenen Daten. Wir verwenden zum jetzigen Zeitpunkt keine Werbe-SDKs in der mobilen App.",
    privacyH6: "6. Aufbewahrung",
    privacyP6:
      "Serverseitige Sitzungs- und Betriebsprotokolle werden nur so lange aufbewahrt, wie es für Sicherheit, Support und rechtliche Verpflichtungen erforderlich ist, und danach gelöscht oder anonymisiert.",
    privacyH7: "7. Ihre Wahlmöglichkeiten",
    privacyP7Before:
      "Sie können die Nutzung der Dienste jederzeit beenden, die App deinstallieren und lokale Geldbörsendaten von Ihrem Gerät löschen. Siehe ",
    privacyP7After: ".",
    privacyH8: "8. Kontakt",
    privacyContact: "Fragen:",
    termsIntro:
      "Durch die Nutzung von acopay.net oder der mobilen ACOPAY-Geldbörse (die “Dienste”) stimmen Sie diesen Bedingungen zu. Wenn Sie nicht zustimmen, nutzen Sie die Dienste bitte nicht.",
    termsH1: "1. Art der Dienste",
    termsP1:
      "ACOPAY ist ein nicht-verwahrendes Geldbörsen- und Überweisungstool für Solana-Token. Wir betreiben keine Börse, verwahren nicht Ihre Schlüssel und garantieren weder Token-Preise noch Anlageerträge. Die Dienste stellen keine Finanzberatung dar.",
    termsH2: "2. Ihre Pflichten",
    termsLi1: "Sie sind allein dafür verantwortlich, Ihre Wiederherstellungsphrase und Ihre privaten Schlüssel zu sichern.",
    termsLi2: "Sie sind dafür verantwortlich, Empfängeradressen vor der Überweisung zu überprüfen.",
    termsLi3: "Sie müssen die für Sie geltenden Gesetze einhalten (einschließlich Kryptoregulierungen).",
    termsLi4: "Sie müssen mindestens 18 Jahre alt sein, um die Dienste zu nutzen.",
    termsH3: "3. Netzwerkgebühren",
    termsP3:
      "Bei unterstützten ACOPAY-Überweisungen über den gesponserten Ablauf von ACOPAY können Solana-Netzwerkgebühren (Gas) wie im Produkt angegeben von ACOPAY/dem Betreiber übernommen werden. Bei anderen Token (zum Beispiel USDT, SOL oder benutzerdefinierten SPL-Token) zahlen Sie die Netzwerkgebühren aus Ihrer eigenen Geldbörse. Token-Überweisungsgebühren (zum Beispiel die On-Chain-Gebühr von ACOPAY in Höhe von 0,01 %) sind von den Solana-Gasgebühren getrennt und unterliegen den Regeln des On-Chain-Programms.",
    termsH4: "4. Keine Verwahrung; Verlustrisiko",
    termsP4:
      "Wenn Sie Ihre Wiederherstellungsphrase oder Ihr Gerät ohne Backup verlieren, können Ihre Vermögenswerte dauerhaft unwiederbringlich sein. Blockchain-Transaktionen sind nach Bestätigung unwiderruflich.",
    termsH5: "5. Verbotene Nutzung",
    termsP5:
      "Sie dürfen die Dienste nicht für rechtswidrige Aktivitäten, Betrug, die Umgehung von Sanktionen oder den Missbrauch der Infrastruktur (Spam, Angriffe, schädliches Reverse Engineering) nutzen.",
    termsH6: "6. Haftungsausschluss",
    termsP6:
      "DIE DIENSTE WERDEN “WIE BESEHEN” OHNE JEGLICHE GEWÄHRLEISTUNG BEREITGESTELLT. IM GESETZLICH ZULÄSSIGEN HÖCHSTMASS HAFTET ACOPAY NICHT FÜR INDIREKTE, ZUFÄLLIGE ODER FOLGESCHÄDEN ODER FÜR VERLUSTE, DIE AUF BENUTZERFEHLERN, BLOCKCHAIN-AUSFÄLLEN ODER DIENSTEN DRITTER BERUHEN.",
    termsH7: "7. Änderungen",
    termsP7:
      "Wir können diese Bedingungen aktualisieren. Die fortgesetzte Nutzung nach Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen. Wesentliche Änderungen werden durch Aktualisierung des oben genannten Datums kenntlich gemacht.",
    termsH8: "8. Kontakt",
    deleteIntro:
      "Google Play und der App Store verlangen einen öffentlichen Löschweg, der keine Installation der App erfordert. Zuletzt aktualisiert: 2. August 2026",
    deleteHWhat: "Was “Konto” hier bedeutet",
    deletePWhat:
      "Die mobile ACOPAY-Geldbörse ist nicht verwahrend. Ihre Schlüssel befinden sich auf Ihrem Gerät. Es gibt kein zentrales Login-Konto, das Ihre Gelder verwahrt. Löschen bedeutet, lokale Geldbörsendaten sowie alle serverseitigen Sitzungen/Betriebsdaten zu entfernen, die mit von Ihnen bei ACOPAY-APIs verwendeten Adressen verknüpft sind.",
    deleteHA: "A. Daten auf Ihrem Gerät löschen (sofort)",
    deleteA1: "Öffnen Sie die ACOPAY-App → tippen Sie auf das ACOPAY-Logo → Abmelden.",
    deleteA2: "Deinstallieren Sie die App von Ihrem Gerät.",
    deleteA3: "Optional: Löschen Sie den App-Speicher / SecureStore vor der Deinstallation, sofern Ihr Betriebssystem dies ermöglicht.",
    deleteWarnLabel: "Warnung:",
    deleteWarn: " Wenn Sie Ihre Wiederherstellungsphrase nicht gesichert haben, kann das Abmelden oder Deinstallieren dazu führen, dass Ihre Gelder unwiederbringlich sind.",
    deleteHB: "B. Serverseitige Löschung beantragen",
    deleteEmailBefore: "Senden Sie eine E-Mail an ",
    deleteEmailMid: " mit dem Betreff ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " und geben Sie an:",
    deleteLi1: "Ihre mit ACOPAY verwendete(n) Solana-Geldbörsenadresse(n)",
    deleteLi2: "Ungefähre Nutzungszeiträume (falls bekannt)",
    deleteP2:
      "Wir löschen oder anonymisieren zugehörige Sitzungsdaten und Support-Korrespondenz innerhalb von 30 Tagen, mit Ausnahme von Daten, die wir aus rechtlichen oder sicherheitstechnischen Gründen aufbewahren müssen, sowie öffentlichen Blockchain-Aufzeichnungen, die nicht gelöscht werden können.",
    deleteHRelated: "Verwandt",
  }),

  nl: L({
    privacyTitle: "Privacybeleid",
    termsTitle: "Servicevoorwaarden",
    deleteTitle: "Account en gegevens verwijderen",
    lastUpdated: "Laatst bijgewerkt: 2 augustus 2026",
    privacyIntro:
      "Dit privacybeleid beschrijft hoe ACOPAY (“wij”) informatie verwerkt wanneer je acopay.net en de mobiele ACOPAY-portemonnee-app (de “Diensten”) gebruikt.",
    privacyH1: "1. Productoverzicht",
    privacyP1:
      "ACOPAY biedt een niet-bewarende Solana-portemonnee-ervaring: je kunt een portemonnee aanmaken of importeren, saldi bekijken en SPL-tokens overmaken (waaronder ACOPAY, USDT, SOL en andere tokens die je toevoegt). Herstelzinnen en privésleutels blijven op je apparaat en worden niet door ACOPAY verzameld.",
    privacyH2: "2. Gegevens die we verwerken",
    privacyLi1Label: "Openbare portemonnee-adressen",
    privacyLi1Rest: " — nodig om kosten te berekenen en de door jou gevraagde overboekingen te bouwen, te simuleren en te verzenden.",
    privacyLi2Label: "Transactiemetadata",
    privacyLi2Rest:
      " — bedragen, door jou ingevoerde ontvangeradressen of gebruikersnamen, handtekeningen en bevestigingsstatus wanneer je door ACOPAY gesponsorde overboekings-API's gebruikt.",
    privacyLi3Label: "Technische logs",
    privacyLi3Rest: " — standaard web-/serverlogs (IP, user agent, tijdstempels) voor beveiliging en misbruikpreventie.",
    privacyLi4Label: "Optioneel contact",
    privacyLi4Before: " — als je een e-mail stuurt naar ",
    privacyLi4After: ", verwerken we de inhoud van die correspondentie.",
    privacyH3: "3. Gegevens die we niet verzamelen",
    privacyP3:
      "We verzamelen je seedphrase, privésleutel of biometrische sjablonen niet. Biometrisch ontgrendelen (Face ID / vingerafdruk), indien ingeschakeld, wordt afgehandeld door het besturingssysteem van je apparaat.",
    privacyH4: "4. On-chain-gegevens",
    privacyP4:
      "Overboekingen die je bevestigt, worden vastgelegd op de openbare Solana-blockchain. Blockchaingegevens zijn openbaar en vallen zodra ze zijn verzonden buiten de controle van ACOPAY.",
    privacyH5: "5. Derden",
    privacyP5:
      "We gebruiken infrastructuurleveranciers (hosting, CDN, RPC-eindpunten) om de Diensten te exploiteren. We verkopen geen persoonsgegevens. We gebruiken tot op heden geen advertentie-SDK's in de mobiele app.",
    privacyH6: "6. Bewaartermijn",
    privacyP6:
      "Sessie- en operationele logs aan serverzijde worden alleen bewaard zolang nodig is voor beveiliging, ondersteuning en wettelijke verplichtingen, en worden daarna verwijderd of geanonimiseerd.",
    privacyH7: "7. Jouw keuzes",
    privacyP7Before:
      "Je kunt op elk moment stoppen met het gebruik van de Diensten, de app verwijderen en lokale portemonneegegevens van je apparaat wissen. Zie ",
    privacyP7After: ".",
    privacyH8: "8. Contact",
    privacyContact: "Vragen:",
    termsIntro:
      "Door acopay.net of de mobiele ACOPAY-portemonnee (de “Diensten”) te gebruiken, ga je akkoord met deze Voorwaarden. Als je niet akkoord gaat, gebruik de Diensten dan niet.",
    termsH1: "1. Aard van de Diensten",
    termsP1:
      "ACOPAY is een niet-bewarend hulpmiddel voor portemonnees en overboekingen voor Solana-tokens. We exploiteren geen beurs, bewaren je sleutels niet en garanderen geen tokenprijzen of beleggingsrendementen. De Diensten vormen geen financieel advies.",
    termsH2: "2. Jouw verantwoordelijkheden",
    termsLi1: "Jij bent als enige verantwoordelijk voor het beveiligen van je herstelzin en privésleutels.",
    termsLi2: "Jij bent verantwoordelijk voor het verifiëren van ontvangeradressen vóór het overmaken.",
    termsLi3: "Je moet je houden aan de wetten die op jou van toepassing zijn (inclusief cryptoregelgeving).",
    termsLi4: "Je moet minstens 18 jaar oud zijn om de Diensten te gebruiken.",
    termsH3: "3. Netwerkkosten",
    termsP3:
      "Voor ondersteunde ACOPAY-overboekingen via de gesponsorde flow van ACOPAY kunnen Solana-netwerkkosten (gas) worden betaald door ACOPAY/de operator, zoals in het product wordt vermeld. Voor andere tokens (bijvoorbeeld USDT, SOL of aangepaste SPL-tokens) betaal je netwerkkosten vanuit je eigen portemonnee. Tokenoverboekingskosten (bijvoorbeeld de on-chain kosten van 0,01% van ACOPAY) staan los van Solana-gas en volgen de regels van het on-chain programma.",
    termsH4: "4. Geen bewaring; risico op verlies",
    termsP4:
      "Als je je herstelzin of apparaat kwijtraakt zonder back-up, kunnen je bezittingen permanent onherstelbaar zijn. Blockchaintransacties zijn onomkeerbaar zodra ze zijn bevestigd.",
    termsH5: "5. Verboden gebruik",
    termsP5:
      "Je mag de Diensten niet gebruiken voor onwettige activiteiten, fraude, het omzeilen van sancties of misbruik van infrastructuur (spam, aanvallen, reverse engineering met schadelijke bedoelingen).",
    termsH6: "6. Vrijwaring",
    termsP6:
      "DE DIENSTEN WORDEN “IN DE HUIDIGE STAAT” GELEVERD, ZONDER ENIGE GARANTIE. VOOR ZOVER MAXIMAAL TOEGESTAAN DOOR DE WET IS ACOPAY NIET AANSPRAKELIJK VOOR INDIRECTE, INCIDENTELE OF GEVOLGSCHADE, OF VOOR VERLIEZEN DIE VOORTVLOEIEN UIT GEBRUIKERSFOUTEN, BLOCKCHAINSTORINGEN OF DIENSTEN VAN DERDEN.",
    termsH7: "7. Wijzigingen",
    termsP7:
      "We kunnen deze Voorwaarden bijwerken. Voortgezet gebruik na wijzigingen geldt als aanvaarding van de bijgewerkte Voorwaarden. Materiële wijzigingen worden weerspiegeld door de datum hierboven bij te werken.",
    termsH8: "8. Contact",
    deleteIntro:
      "Google Play en de App Store vereisen een openbare verwijderingsmethode waarvoor de app niet hoeft te worden geïnstalleerd. Laatst bijgewerkt: 2 augustus 2026",
    deleteHWhat: "Wat “account” hier betekent",
    deletePWhat:
      "De mobiele ACOPAY-portemonnee is niet-bewarend. Je sleutels bevinden zich op je apparaat. Er is geen centraal inlogaccount dat je tegoeden bewaart. Verwijderen betekent het verwijderen van lokale portemonneegegevens en eventuele serverzijdige sessies/operationele gegevens die zijn gekoppeld aan adressen die je met de API's van ACOPAY hebt gebruikt.",
    deleteHA: "A. Gegevens op je apparaat verwijderen (direct)",
    deleteA1: "Open de ACOPAY-app → tik op het ACOPAY-logo → Uitloggen.",
    deleteA2: "Verwijder de app van je apparaat.",
    deleteA3: "Optioneel: wis app-opslag / SecureStore vóór verwijdering als je besturingssysteem die optie biedt.",
    deleteWarnLabel: "Waarschuwing:",
    deleteWarn: " Als je je herstelzin niet hebt gebackupt, kan uitloggen of de app verwijderen ervoor zorgen dat je tegoeden onherstelbaar zijn.",
    deleteHB: "B. Verwijdering aan serverzijde aanvragen",
    deleteEmailBefore: "Stuur een e-mail naar ",
    deleteEmailMid: " met als onderwerp ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " en vermeld:",
    deleteLi1: "Je Solana-portemonneeadres(sen) die je met ACOPAY hebt gebruikt",
    deleteLi2: "Bij benadering periode van gebruik (indien bekend)",
    deleteP2:
      "We verwijderen of anonimiseren gerelateerde sessiegegevens en supportcorrespondentie binnen 30 dagen, behalve gegevens die we om juridische of beveiligingsredenen moeten bewaren, en behalve openbare blockchainrecords die niet kunnen worden verwijderd.",
    deleteHRelated: "Gerelateerd",
  }),

  it: L({
    privacyTitle: "Informativa sulla privacy",
    termsTitle: "Termini di servizio",
    deleteTitle: "Elimina account e dati",
    lastUpdated: "Ultimo aggiornamento: 2 agosto 2026",
    privacyIntro:
      "La presente Informativa sulla privacy descrive come ACOPAY (“noi”) gestisce le informazioni quando utilizzi acopay.net e l'app del wallet mobile ACOPAY (i “Servizi”).",
    privacyH1: "1. Sintesi del prodotto",
    privacyP1:
      "ACOPAY offre un'esperienza di wallet Solana non custodial: puoi creare o importare un wallet, visualizzare i saldi e trasferire token SPL (inclusi ACOPAY, USDT, SOL e altri token che aggiungi). Le frasi di recupero e le chiavi private restano sul tuo dispositivo e non vengono raccolte da ACOPAY.",
    privacyH2: "2. Dati che trattiamo",
    privacyLi1Label: "Indirizzi pubblici del wallet",
    privacyLi1Rest: " — necessari per calcolare le commissioni, creare, simulare e trasmettere i trasferimenti che richiedi.",
    privacyLi2Label: "Metadati delle transazioni",
    privacyLi2Rest:
      " — importi, indirizzi o nomi utente del destinatario che inserisci, firme e stato di conferma quando utilizzi le API di trasferimento sponsorizzate da ACOPAY.",
    privacyLi3Label: "Log tecnici",
    privacyLi3Rest: " — log web/server standard (IP, user agent, timestamp) per la sicurezza e la prevenzione degli abusi.",
    privacyLi4Label: "Contatto facoltativo",
    privacyLi4Before: " — se invii un'e-mail a ",
    privacyLi4After: ", trattiamo il contenuto di quella corrispondenza.",
    privacyH3: "3. Dati che non raccogliamo",
    privacyP3:
      "Non raccogliamo la tua seed phrase, la chiave privata o modelli biometrici. Lo sblocco biometrico (Face ID / impronta digitale), se attivato, è gestito dal sistema operativo del tuo dispositivo.",
    privacyH4: "4. Dati on-chain",
    privacyP4:
      "I trasferimenti che confermi vengono registrati sulla blockchain pubblica di Solana. I dati della blockchain sono pubblici e sfuggono al controllo di ACOPAY una volta trasmessi.",
    privacyH5: "5. Terze parti",
    privacyP5:
      "Utilizziamo fornitori di infrastrutture (hosting, CDN, endpoint RPC) per gestire i Servizi. Non vendiamo dati personali. Ad oggi non utilizziamo SDK pubblicitari nell'app mobile.",
    privacyH6: "6. Conservazione",
    privacyP6:
      "I log di sessione e operativi lato server vengono conservati solo per il tempo necessario a fini di sicurezza, supporto e obblighi legali, dopodiché vengono eliminati o resi anonimi.",
    privacyH7: "7. Le tue scelte",
    privacyP7Before:
      "Puoi smettere di usare i Servizi in qualsiasi momento, disinstallare l'app e cancellare i dati locali del wallet dal tuo dispositivo. Vedi ",
    privacyP7After: ".",
    privacyH8: "8. Contatti",
    privacyContact: "Domande:",
    termsIntro:
      "Utilizzando acopay.net o il wallet mobile ACOPAY (i “Servizi”), accetti i presenti Termini. Se non sei d'accordo, non utilizzare i Servizi.",
    termsH1: "1. Natura dei Servizi",
    termsP1:
      "ACOPAY è uno strumento di wallet e trasferimento non custodial per i token Solana. Non gestiamo un exchange, non custodiamo le tue chiavi e non garantiamo i prezzi dei token né i rendimenti degli investimenti. I Servizi non costituiscono consulenza finanziaria.",
    termsH2: "2. Le tue responsabilità",
    termsLi1: "Sei l'unico responsabile della sicurezza della tua frase di recupero e delle tue chiavi private.",
    termsLi2: "Sei responsabile della verifica degli indirizzi dei destinatari prima di effettuare un trasferimento.",
    termsLi3: "Devi rispettare le leggi a te applicabili (comprese le normative sulle criptovalute).",
    termsLi4: "Devi avere almeno 18 anni per utilizzare i Servizi.",
    termsH3: "3. Commissioni di rete",
    termsP3:
      "Per i trasferimenti ACOPAY supportati tramite il flusso sponsorizzato da ACOPAY, le commissioni di rete (gas) di Solana possono essere pagate da ACOPAY/dall'operatore come indicato nel prodotto. Per altri token (ad esempio USDT, SOL o token SPL personalizzati), paghi le commissioni di rete dal tuo stesso wallet. Le commissioni di trasferimento dei token (ad esempio la commissione on-chain dello 0,01% di ACOPAY) sono separate dal gas di Solana e seguono le regole del programma on-chain.",
    termsH4: "4. Nessuna custodia; rischio di perdita",
    termsP4:
      "Se perdi la tua frase di recupero o il dispositivo senza un backup, i tuoi asset potrebbero diventare permanentemente irrecuperabili. Le transazioni sulla blockchain sono irreversibili una volta confermate.",
    termsH5: "5. Uso vietato",
    termsP5:
      "Non puoi utilizzare i Servizi per attività illecite, frodi, elusione di sanzioni o abuso dell'infrastruttura (spam, attacchi, reverse engineering a scopo dannoso).",
    termsH6: "6. Esclusione di responsabilità",
    termsP6:
      "I SERVIZI SONO FORNITI “COSÌ COME SONO”, SENZA GARANZIE DI ALCUN TIPO. NELLA MISURA MASSIMA CONSENTITA DALLA LEGGE, ACOPAY NON È RESPONSABILE PER DANNI INDIRETTI, INCIDENTALI O CONSEQUENZIALI, NÉ PER PERDITE DERIVANTI DA ERRORI DELL'UTENTE, GUASTI DELLA BLOCKCHAIN O SERVIZI DI TERZI.",
    termsH7: "7. Modifiche",
    termsP7:
      "Potremmo aggiornare i presenti Termini. L'uso continuato dopo le modifiche costituisce accettazione dei Termini aggiornati. Le modifiche sostanziali saranno riflesse aggiornando la data sopra riportata.",
    termsH8: "8. Contatti",
    deleteIntro:
      "Google Play e App Store richiedono un percorso pubblico di eliminazione che non richieda l'installazione dell'app. Ultimo aggiornamento: 2 agosto 2026",
    deleteHWhat: "Cosa significa “account” in questo contesto",
    deletePWhat:
      "Il wallet mobile ACOPAY è non custodial. Le tue chiavi risiedono sul tuo dispositivo. Non esiste un account di accesso centrale che detenga i tuoi fondi. Eliminare significa rimuovere i dati locali del wallet ed eventuali sessioni/dati operativi lato server collegati agli indirizzi che hai utilizzato con le API di ACOPAY.",
    deleteHA: "A. Elimina i dati sul tuo dispositivo (immediato)",
    deleteA1: "Apri l'app ACOPAY → tocca il logo ACOPAY → Esci.",
    deleteA2: "Disinstalla l'app dal tuo dispositivo.",
    deleteA3: "Facoltativo: cancella l'archiviazione dell'app / SecureStore prima della disinstallazione se il tuo sistema operativo lo consente.",
    deleteWarnLabel: "Avviso:",
    deleteWarn: " Se non hai eseguito il backup della tua frase di recupero, l'uscita o la disinstallazione potrebbero rendere irrecuperabili i tuoi fondi.",
    deleteHB: "B. Richiedi l'eliminazione lato server",
    deleteEmailBefore: "Invia un'e-mail a ",
    deleteEmailMid: " con oggetto ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " e includi:",
    deleteLi1: "Il tuo/i tuoi indirizzo/i wallet Solana utilizzati con ACOPAY",
    deleteLi2: "Date approssimative di utilizzo (se note)",
    deleteP2:
      "Elimineremo o renderemo anonimi i record di sessione e la corrispondenza di supporto associati entro 30 giorni, ad eccezione dei dati che dobbiamo conservare per motivi legali o di sicurezza, e ad eccezione dei record pubblici sulla blockchain, che non possono essere eliminati.",
    deleteHRelated: "Correlati",
  }),

  ru: L({
    privacyTitle: "Политика конфиденциальности",
    termsTitle: "Условия использования",
    deleteTitle: "Удаление аккаунта и данных",
    lastUpdated: "Последнее обновление: 2 августа 2026 г.",
    privacyIntro:
      "Настоящая Политика конфиденциальности описывает, как ACOPAY («мы») обрабатывает информацию, когда вы используете acopay.net и мобильное приложение-кошелёк ACOPAY («Сервисы»).",
    privacyH1: "1. Обзор продукта",
    privacyP1:
      "ACOPAY предоставляет некастодиальный кошелёк для Solana: вы можете создать или импортировать кошелёк, просматривать баланс и переводить токены SPL (включая ACOPAY, USDT, SOL и другие добавленные вами токены). Фразы восстановления и приватные ключи остаются на вашем устройстве и не собираются ACOPAY.",
    privacyH2: "2. Данные, которые мы обрабатываем",
    privacyLi1Label: "Публичные адреса кошелька",
    privacyLi1Rest: " — необходимы для расчёта комиссии, формирования, симуляции и отправки запрошенных вами переводов.",
    privacyLi2Label: "Метаданные транзакций",
    privacyLi2Rest:
      " — суммы, введённые вами адреса или имена пользователей получателей, подписи и статус подтверждения при использовании API переводов, спонсируемых ACOPAY.",
    privacyLi3Label: "Технические журналы",
    privacyLi3Rest: " — стандартные веб-/серверные журналы (IP, user agent, отметки времени) для безопасности и предотвращения злоупотреблений.",
    privacyLi4Label: "Необязательный контакт",
    privacyLi4Before: " — если вы отправляете письмо на ",
    privacyLi4After: ", мы обрабатываем содержание этой переписки.",
    privacyH3: "3. Данные, которые мы не собираем",
    privacyP3:
      "Мы не собираем вашу seed-фразу, приватный ключ или биометрические шаблоны. Биометрическая разблокировка (Face ID / отпечаток пальца), если включена, обрабатывается операционной системой вашего устройства.",
    privacyH4: "4. Данные ончейн",
    privacyP4:
      "Подтверждённые вами переводы записываются в публичный блокчейн Solana. Данные блокчейна становятся публичными и выходят из-под контроля ACOPAY после отправки.",
    privacyH5: "5. Третьи стороны",
    privacyP5:
      "Мы используем поставщиков инфраструктуры (хостинг, CDN, RPC-эндпоинты) для работы Сервисов. Мы не продаём персональные данные. На сегодняшний день мы не используем рекламные SDK в мобильном приложении.",
    privacyH6: "6. Хранение данных",
    privacyP6:
      "Серверные журналы сессий и операций хранятся только в течение времени, необходимого для безопасности, поддержки и выполнения юридических обязательств, после чего удаляются или обезличиваются.",
    privacyH7: "7. Ваш выбор",
    privacyP7Before:
      "Вы можете прекратить использование Сервисов в любое время, удалить приложение и стереть локальные данные кошелька с устройства. См. ",
    privacyP7After: ".",
    privacyH8: "8. Контакты",
    privacyContact: "Вопросы:",
    termsIntro:
      "Используя acopay.net или мобильный кошелёк ACOPAY («Сервисы»), вы соглашаетесь с настоящими Условиями. Если вы не согласны, не используйте Сервисы.",
    termsH1: "1. Характер Сервисов",
    termsP1:
      "ACOPAY — это некастодиальный кошелёк и инструмент перевода токенов Solana. Мы не управляем биржей, не храним ваши ключи и не гарантируем цены токенов или инвестиционную доходность. Сервисы не являются финансовой консультацией.",
    termsH2: "2. Ваши обязанности",
    termsLi1: "Вы несёте единоличную ответственность за защиту своей фразы восстановления и приватных ключей.",
    termsLi2: "Вы несёте ответственность за проверку адресов получателей перед переводом.",
    termsLi3: "Вы обязаны соблюдать применимое к вам законодательство (включая нормы о криптовалютах).",
    termsLi4: "Для использования Сервисов вам должно быть не менее 18 лет.",
    termsH3: "3. Сетевые комиссии",
    termsP3:
      "Для поддерживаемых переводов ACOPAY через спонсируемый поток ACOPAY сетевые комиссии (газ) Solana могут оплачиваться ACOPAY/оператором, как указано в продукте. Для других токенов (например, USDT, SOL или пользовательских SPL-токенов) вы оплачиваете сетевые комиссии из своего кошелька. Комиссии за перевод токенов (например, комиссия ACOPAY в размере 0,01% ончейн) отделены от газа Solana и подчиняются правилам ончейн-программы.",
    termsH4: "4. Отсутствие хранения; риск потери",
    termsP4:
      "Если вы потеряете фразу восстановления или устройство без резервной копии, ваши активы могут стать безвозвратно утраченными. Транзакции в блокчейне необратимы после подтверждения.",
    termsH5: "5. Запрещённое использование",
    termsP5:
      "Вы не можете использовать Сервисы для незаконной деятельности, мошенничества, обхода санкций или злоупотребления инфраструктурой (спам, атаки, вредоносный реверс-инжиниринг).",
    termsH6: "6. Отказ от ответственности",
    termsP6:
      "СЕРВИСЫ ПРЕДОСТАВЛЯЮТСЯ «КАК ЕСТЬ» БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ. В МАКСИМАЛЬНОЙ СТЕПЕНИ, РАЗРЕШЁННОЙ ЗАКОНОМ, ACOPAY НЕ НЕСЁТ ОТВЕТСТВЕННОСТИ ЗА КОСВЕННЫЕ, СЛУЧАЙНЫЕ ИЛИ КОСВЕННЫЕ УБЫТКИ, А ТАКЖЕ ЗА УБЫТКИ, ВОЗНИКШИЕ ИЗ-ЗА ОШИБОК ПОЛЬЗОВАТЕЛЯ, СБОЕВ БЛОКЧЕЙНА ИЛИ СЕРВИСОВ ТРЕТЬИХ СТОРОН.",
    termsH7: "7. Изменения",
    termsP7:
      "Мы можем обновлять настоящие Условия. Продолжение использования после изменений означает принятие обновлённых Условий. Существенные изменения будут отражены обновлением указанной выше даты.",
    termsH8: "8. Контакты",
    deleteIntro:
      "Google Play и App Store требуют публичного способа удаления, не требующего установки приложения. Последнее обновление: 2 августа 2026 г.",
    deleteHWhat: "Что здесь означает «аккаунт»",
    deletePWhat:
      "Мобильный кошелёк ACOPAY является некастодиальным. Ваши ключи хранятся на вашем устройстве. Не существует центрального аккаунта для входа, который хранил бы ваши средства. Удаление означает удаление локальных данных кошелька и любых серверных сессий/операционных данных, связанных с адресами, которые вы использовали с API ACOPAY.",
    deleteHA: "A. Удаление данных на вашем устройстве (мгновенно)",
    deleteA1: "Откройте приложение ACOPAY → нажмите на логотип ACOPAY → Выйти.",
    deleteA2: "Удалите приложение со своего устройства.",
    deleteA3: "Опционально: очистите хранилище приложения / SecureStore перед удалением, если ваша ОС предоставляет такую возможность.",
    deleteWarnLabel: "Предупреждение:",
    deleteWarn: " Если вы не сделали резервную копию фразы восстановления, выход из аккаунта или удаление приложения может сделать ваши средства невосстановимыми.",
    deleteHB: "B. Запрос на удаление на стороне сервера",
    deleteEmailBefore: "Отправьте письмо на ",
    deleteEmailMid: " с темой ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " и укажите:",
    deleteLi1: "Ваш(и) адрес(а) кошелька Solana, использованный(е) с ACOPAY",
    deleteLi2: "Примерные даты использования (если известны)",
    deleteP2:
      "Мы удалим или обезличим связанные записи сессий и переписку со службой поддержки в течение 30 дней, за исключением данных, которые мы обязаны хранить по юридическим или соображениям безопасности, а также публичных записей блокчейна, которые невозможно удалить.",
    deleteHRelated: "См. также",
  }),

  uk: L({
    privacyTitle: "Політика конфіденційності",
    termsTitle: "Умови надання послуг",
    deleteTitle: "Видалення акаунта та даних",
    lastUpdated: "Останнє оновлення: 2 серпня 2026 р.",
    privacyIntro:
      "Ця Політика конфіденційності описує, як ACOPAY («ми») обробляє інформацію, коли ви використовуєте acopay.net та мобільний додаток-гаманець ACOPAY («Сервіси»).",
    privacyH1: "1. Огляд продукту",
    privacyP1:
      "ACOPAY надає некастодіальний досвід гаманця Solana: ви можете створити або імпортувати гаманець, переглядати баланси та переказувати токени SPL (включно з ACOPAY, USDT, SOL та іншими доданими вами токенами). Фрази відновлення та приватні ключі завжди залишаються на вашому пристрої і не збираються ACOPAY.",
    privacyH2: "2. Дані, які ми обробляємо",
    privacyLi1Label: "Публічні адреси гаманця",
    privacyLi1Rest: " — необхідні для розрахунку комісій, формування, симуляції та трансляції запитаних вами переказів.",
    privacyLi2Label: "Метадані транзакцій",
    privacyLi2Rest:
      " — суми, введені вами адреси або імена користувачів отримувачів, підписи та статус підтвердження під час використання API переказів, спонсорованих ACOPAY.",
    privacyLi3Label: "Технічні журнали",
    privacyLi3Rest: " — стандартні веб-/серверні журнали (IP, user agent, часові мітки) для безпеки та запобігання зловживанням.",
    privacyLi4Label: "Необов'язковий контакт",
    privacyLi4Before: " — якщо ви надсилаєте лист на ",
    privacyLi4After: ", ми обробляємо зміст цього листування.",
    privacyH3: "3. Дані, які ми не збираємо",
    privacyP3:
      "Ми не збираємо вашу seed-фразу, приватний ключ чи біометричні шаблони. Біометричне розблокування (Face ID / відбиток пальця), якщо увімкнено, обробляється операційною системою вашого пристрою.",
    privacyH4: "4. Дані ончейн",
    privacyP4:
      "Підтверджені вами перекази записуються в публічний блокчейн Solana. Дані блокчейну є публічними і виходять з-під контролю ACOPAY після трансляції.",
    privacyH5: "5. Треті сторони",
    privacyP5:
      "Ми використовуємо постачальників інфраструктури (хостинг, CDN, RPC-endpoint) для роботи Сервісів. Ми не продаємо персональні дані. Станом на сьогодні ми не використовуємо рекламні SDK в мобільному додатку.",
    privacyH6: "6. Зберігання даних",
    privacyP6:
      "Серверні журнали сесій та операцій зберігаються лише протягом часу, необхідного для безпеки, підтримки та виконання юридичних зобов'язань, після чого видаляються або знеособлюються.",
    privacyH7: "7. Ваш вибір",
    privacyP7Before:
      "Ви можете припинити використання Сервісів у будь-який час, видалити додаток і стерти локальні дані гаманця з пристрою. Див. ",
    privacyP7After: ".",
    privacyH8: "8. Контакти",
    privacyContact: "Питання:",
    termsIntro:
      "Використовуючи acopay.net або мобільний гаманець ACOPAY («Сервіси»), ви погоджуєтеся з цими Умовами. Якщо ви не згодні, не використовуйте Сервіси.",
    termsH1: "1. Характер Сервісів",
    termsP1:
      "ACOPAY — це некастодіальний гаманець та інструмент переказу токенів Solana. Ми не керуємо біржею, не зберігаємо ваші ключі та не гарантуємо цін токенів чи інвестиційної дохідності. Сервіси не є фінансовою консультацією.",
    termsH2: "2. Ваші обов'язки",
    termsLi1: "Ви несете одноосібну відповідальність за захист своєї фрази відновлення та приватних ключів.",
    termsLi2: "Ви відповідаєте за перевірку адрес отримувачів перед переказом.",
    termsLi3: "Ви повинні дотримуватися законів, що застосовуються до вас (включно з регулюванням криптовалют).",
    termsLi4: "Вам має бути щонайменше 18 років для використання Сервісів.",
    termsH3: "3. Мережеві комісії",
    termsP3:
      "Для підтримуваних переказів ACOPAY через спонсорований потік ACOPAY мережеві комісії (газ) Solana можуть сплачуватися ACOPAY/оператором, як зазначено в продукті. Для інших токенів (наприклад, USDT, SOL або користувацьких токенів SPL) ви сплачуєте мережеві комісії зі свого гаманця. Комісії за переказ токенів (наприклад, комісія ACOPAY 0,01% ончейн) окремі від газу Solana і підпорядковуються правилам ончейн-програми.",
    termsH4: "4. Відсутність кастодіального зберігання; ризик втрати",
    termsP4:
      "Якщо ви втратите фразу відновлення або пристрій без резервної копії, ваші активи можуть стати назавжди недоступними для відновлення. Транзакції в блокчейні незворотні після підтвердження.",
    termsH5: "5. Заборонене використання",
    termsP5:
      "Ви не можете використовувати Сервіси для незаконної діяльності, шахрайства, обходу санкцій або зловживання інфраструктурою (спам, атаки, шкідливий реверс-інжиніринг).",
    termsH6: "6. Відмова від відповідальності",
    termsP6:
      "СЕРВІСИ НАДАЮТЬСЯ «ЯК Є» БЕЗ БУДЬ-ЯКИХ ГАРАНТІЙ. У МАКСИМАЛЬНОМУ ОБСЯЗІ, ДОЗВОЛЕНОМУ ЗАКОНОМ, ACOPAY НЕ НЕСЕ ВІДПОВІДАЛЬНОСТІ ЗА НЕПРЯМІ, ВИПАДКОВІ АБО НАСЛІДКОВІ ЗБИТКИ, А ТАКОЖ ЗА ВТРАТИ, ЩО ВИНИКЛИ ВНАСЛІДОК ПОМИЛОК КОРИСТУВАЧА, ЗБОЇВ БЛОКЧЕЙНУ АБО СЕРВІСІВ ТРЕТІХ СТОРІН.",
    termsH7: "7. Зміни",
    termsP7:
      "Ми можемо оновлювати ці Умови. Продовження використання після змін означає прийняття оновлених Умов. Суттєві зміни будуть відображені шляхом оновлення зазначеної вище дати.",
    termsH8: "8. Контакти",
    deleteIntro:
      "Google Play та App Store вимагають публічного способу видалення, що не потребує встановлення додатку. Останнє оновлення: 2 серпня 2026 р.",
    deleteHWhat: "Що тут означає «акаунт»",
    deletePWhat:
      "Мобільний гаманець ACOPAY є некастодіальним. Ваші ключі зберігаються на вашому пристрої. Не існує центрального облікового запису для входу, який утримував би ваші кошти. Видалення означає видалення локальних даних гаманця та будь-яких серверних сесій/операційних даних, пов'язаних з адресами, які ви використовували з API ACOPAY.",
    deleteHA: "A. Видалення даних на вашому пристрої (миттєво)",
    deleteA1: "Відкрийте додаток ACOPAY → торкніться логотипу ACOPAY → Вийти.",
    deleteA2: "Видаліть додаток зі свого пристрою.",
    deleteA3: "Необов'язково: очистіть сховище додатку / SecureStore перед видаленням, якщо ваша ОС надає таку можливість.",
    deleteWarnLabel: "Попередження:",
    deleteWarn: " Якщо ви не зробили резервну копію фрази відновлення, вихід з облікового запису або видалення додатку може зробити ваші кошти неможливими для відновлення.",
    deleteHB: "B. Запит на видалення на стороні сервера",
    deleteEmailBefore: "Надішліть лист на ",
    deleteEmailMid: " з темою ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " та вкажіть:",
    deleteLi1: "Вашу(і) адресу(и) гаманця Solana, використану(і) з ACOPAY",
    deleteLi2: "Приблизні дати використання (якщо відомі)",
    deleteP2:
      "Ми видалимо або знеособимо пов'язані записи сесій та листування з підтримкою протягом 30 днів, за винятком даних, які ми повинні зберігати з юридичних причин або міркувань безпеки, а також публічних записів блокчейну, які неможливо видалити.",
    deleteHRelated: "Пов'язане",
  }),

  pl: L({
    privacyTitle: "Polityka prywatności",
    termsTitle: "Warunki korzystania z usługi",
    deleteTitle: "Usuń konto i dane",
    lastUpdated: "Ostatnia aktualizacja: 2 sierpnia 2026",
    privacyIntro:
      "Niniejsza Polityka prywatności opisuje, w jaki sposób ACOPAY (“my”) przetwarza informacje, gdy korzystasz z acopay.net i mobilnej aplikacji portfela ACOPAY (“Usługi”).",
    privacyH1: "1. Podsumowanie produktu",
    privacyP1:
      "ACOPAY zapewnia niekustodialne doświadczenie portfela Solana: możesz utworzyć lub zaimportować portfel, sprawdzać salda i przesyłać tokeny SPL (w tym ACOPAY, USDT, SOL oraz inne dodane przez Ciebie tokeny). Frazy odzyskiwania i klucze prywatne pozostają na Twoim urządzeniu i nie są zbierane przez ACOPAY.",
    privacyH2: "2. Dane, które przetwarzamy",
    privacyLi1Label: "Publiczne adresy portfela",
    privacyLi1Rest: " — potrzebne do wyceny opłat, tworzenia, symulowania i nadawania żądanych przez Ciebie przelewów.",
    privacyLi2Label: "Metadane transakcji",
    privacyLi2Rest:
      " — kwoty, wprowadzone przez Ciebie adresy lub nazwy użytkowników odbiorców, podpisy oraz status potwierdzenia podczas korzystania z API przelewów sponsorowanych przez ACOPAY.",
    privacyLi3Label: "Dzienniki techniczne",
    privacyLi3Rest: " — standardowe dzienniki web/serwera (IP, user agent, znaczniki czasu) w celu zapewnienia bezpieczeństwa i zapobiegania nadużyciom.",
    privacyLi4Label: "Opcjonalny kontakt",
    privacyLi4Before: " — jeśli wyślesz e-mail na adres ",
    privacyLi4After: ", przetwarzamy treść tej korespondencji.",
    privacyH3: "3. Dane, których nie zbieramy",
    privacyP3:
      "Nie zbieramy Twojej frazy seed, klucza prywatnego ani wzorców biometrycznych. Odblokowanie biometryczne (Face ID / odcisk palca), jeśli włączone, jest obsługiwane przez system operacyjny Twojego urządzenia.",
    privacyH4: "4. Dane on-chain",
    privacyP4:
      "Potwierdzane przez Ciebie przelewy są zapisywane w publicznym blockchainie Solana. Dane blockchaina są publiczne i po nadaniu pozostają poza kontrolą ACOPAY.",
    privacyH5: "5. Strony trzecie",
    privacyP5:
      "Korzystamy z dostawców infrastruktury (hosting, CDN, punkty końcowe RPC) do obsługi Usług. Nie sprzedajemy danych osobowych. Na dzień dzisiejszy nie korzystamy z SDK reklamowych w aplikacji mobilnej.",
    privacyH6: "6. Przechowywanie danych",
    privacyP6:
      "Dzienniki sesji i operacyjne po stronie serwera są przechowywane wyłącznie przez czas niezbędny do zapewnienia bezpieczeństwa, wsparcia i spełnienia obowiązków prawnych, a następnie usuwane lub anonimizowane.",
    privacyH7: "7. Twoje wybory",
    privacyP7Before:
      "Możesz w każdej chwili zaprzestać korzystania z Usług, odinstalować aplikację i usunąć lokalne dane portfela z urządzenia. Zobacz ",
    privacyP7After: ".",
    privacyH8: "8. Kontakt",
    privacyContact: "Pytania:",
    termsIntro:
      "Korzystając z acopay.net lub mobilnego portfela ACOPAY (“Usługi”), akceptujesz niniejsze Warunki. Jeśli się nie zgadzasz, nie korzystaj z Usług.",
    termsH1: "1. Charakter Usług",
    termsP1:
      "ACOPAY to niekustodialne narzędzie portfela i przelewów dla tokenów Solana. Nie prowadzimy giełdy, nie przechowujemy Twoich kluczy ani nie gwarantujemy cen tokenów czy zwrotów z inwestycji. Usługi nie stanowią porady finansowej.",
    termsH2: "2. Twoje obowiązki",
    termsLi1: "Ponosisz wyłączną odpowiedzialność za zabezpieczenie frazy odzyskiwania i kluczy prywatnych.",
    termsLi2: "Jesteś odpowiedzialny za weryfikację adresów odbiorców przed dokonaniem przelewu.",
    termsLi3: "Musisz przestrzegać przepisów prawa mających do Ciebie zastosowanie (w tym regulacji dotyczących kryptowalut).",
    termsLi4: "Aby korzystać z Usług, musisz mieć ukończone 18 lat.",
    termsH3: "3. Opłaty sieciowe",
    termsP3:
      "W przypadku obsługiwanych przelewów ACOPAY realizowanych przez sponsorowany przepływ ACOPAY, opłaty sieciowe (gas) Solana mogą być pokrywane przez ACOPAY/operatora, zgodnie z informacją w produkcie. W przypadku innych tokenów (np. USDT, SOL lub niestandardowych tokenów SPL) opłaty sieciowe pokrywasz z własnego portfela. Opłaty za przesyłanie tokenów (np. opłata on-chain ACOPAY w wysokości 0,01%) są niezależne od gasu Solana i podlegają zasadom programu on-chain.",
    termsH4: "4. Brak kustodii; ryzyko utraty",
    termsP4:
      "Jeśli utracisz frazę odzyskiwania lub urządzenie bez kopii zapasowej, Twoje aktywa mogą stać się trwale nie do odzyskania. Transakcje w blockchainie są nieodwracalne po potwierdzeniu.",
    termsH5: "5. Zabronione użycie",
    termsP5:
      "Nie możesz korzystać z Usług do działań niezgodnych z prawem, oszustw, obchodzenia sankcji lub nadużywania infrastruktury (spam, ataki, inżynieria wsteczna w celu wyrządzenia szkody).",
    termsH6: "6. Zastrzeżenie",
    termsP6:
      "USŁUGI SĄ ŚWIADCZONE “W STANIE, W JAKIM SIĘ ZNAJDUJĄ”, BEZ JAKICHKOLWIEK GWARANCJI. W MAKSYMALNYM ZAKRESIE DOZWOLONYM PRZEZ PRAWO, ACOPAY NIE PONOSI ODPOWIEDZIALNOŚCI ZA SZKODY POŚREDNIE, UBOCZNE LUB WTÓRNE, ANI ZA STRATY WYNIKAJĄCE Z BŁĘDU UŻYTKOWNIKA, AWARII BLOCKCHAINA LUB USŁUG STRON TRZECICH.",
    termsH7: "7. Zmiany",
    termsP7:
      "Możemy aktualizować niniejsze Warunki. Dalsze korzystanie po wprowadzeniu zmian oznacza akceptację zaktualizowanych Warunków. Istotne zmiany będą odzwierciedlone poprzez aktualizację powyższej daty.",
    termsH8: "8. Kontakt",
    deleteIntro:
      "Google Play i App Store wymagają publicznej ścieżki usuwania, która nie wymaga instalacji aplikacji. Ostatnia aktualizacja: 2 sierpnia 2026",
    deleteHWhat: "Co oznacza tutaj “konto”",
    deletePWhat:
      "Mobilny portfel ACOPAY jest niekustodialny. Twoje klucze znajdują się na Twoim urządzeniu. Nie istnieje centralne konto logowania przechowujące Twoje środki. Usunięcie oznacza usunięcie lokalnych danych portfela oraz wszelkich sesji/danych operacyjnych po stronie serwera powiązanych z adresami używanymi przez Ciebie z API ACOPAY.",
    deleteHA: "A. Usuń dane na swoim urządzeniu (natychmiast)",
    deleteA1: "Otwórz aplikację ACOPAY → dotknij logo ACOPAY → Wyloguj się.",
    deleteA2: "Odinstaluj aplikację ze swojego urządzenia.",
    deleteA3: "Opcjonalnie: wyczyść pamięć aplikacji / SecureStore przed odinstalowaniem, jeśli Twój system operacyjny na to pozwala.",
    deleteWarnLabel: "Ostrzeżenie:",
    deleteWarn: " Jeśli nie wykonałeś kopii zapasowej frazy odzyskiwania, wylogowanie się lub odinstalowanie aplikacji może uniemożliwić odzyskanie środków.",
    deleteHB: "B. Poproś o usunięcie danych po stronie serwera",
    deleteEmailBefore: "Wyślij e-mail na adres ",
    deleteEmailMid: " z tematem ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " i podaj:",
    deleteLi1: "Twój adres (lub adresy) portfela Solana używany(e) z ACOPAY",
    deleteLi2: "Przybliżone daty korzystania (jeśli znane)",
    deleteP2:
      "Usuniemy lub zanonimizujemy powiązane zapisy sesji i korespondencję pomocy technicznej w ciągu 30 dni, z wyjątkiem danych, które musimy przechowywać z przyczyn prawnych lub bezpieczeństwa, oraz z wyjątkiem publicznych zapisów blockchaina, których nie można usunąć.",
    deleteHRelated: "Powiązane",
  }),

  tr: L({
    privacyTitle: "Gizlilik Politikası",
    termsTitle: "Hizmet Şartları",
    deleteTitle: "Hesap ve verileri sil",
    lastUpdated: "Son güncelleme: 2 Ağustos 2026",
    privacyIntro:
      "Bu Gizlilik Politikası, acopay.net'i ve ACOPAY mobil cüzdan uygulamasını (“Hizmetler”) kullandığınızda ACOPAY'in (“biz”) bilgileri nasıl işlediğini açıklar.",
    privacyH1: "1. Ürün özeti",
    privacyP1:
      "ACOPAY, saklayıcı olmayan bir Solana cüzdan deneyimi sunar: bir cüzdan oluşturabilir veya içe aktarabilir, bakiyeleri görüntüleyebilir ve SPL token'larını (ACOPAY, USDT, SOL ve eklediğiniz diğer token'lar dahil) transfer edebilirsiniz. Kurtarma ifadeleri ve özel anahtarlar her zaman cihazınızda kalır ve ACOPAY tarafından toplanmaz.",
    privacyH2: "2. İşlediğimiz veriler",
    privacyLi1Label: "Cüzdan herkese açık adresleri",
    privacyLi1Rest: " — talep ettiğiniz transferlerin ücretini hesaplamak, oluşturmak, simüle etmek ve yayınlamak için gereklidir.",
    privacyLi2Label: "İşlem meta verileri",
    privacyLi2Rest:
      " — ACOPAY tarafından desteklenen transfer API'lerini kullandığınızda tutarlar, girdiğiniz alıcı adresleri veya kullanıcı adları, imzalar ve onay durumu.",
    privacyLi3Label: "Teknik günlükler",
    privacyLi3Rest: " — güvenlik ve kötüye kullanımın önlenmesi için standart web/sunucu günlükleri (IP, user agent, zaman damgaları).",
    privacyLi4Label: "İsteğe bağlı iletişim",
    privacyLi4Before: " — şu adrese e-posta gönderirseniz ",
    privacyLi4After: ", o yazışmanın içeriğini işleriz.",
    privacyH3: "3. Toplamadığımız veriler",
    privacyP3:
      "Seed ifadenizi, özel anahtarınızı veya biyometrik şablonlarınızı toplamayız. Etkinleştirilmişse biyometrik kilit açma (Face ID / parmak izi) cihazınızın işletim sistemi tarafından yönetilir.",
    privacyH4: "4. Zincir üstü veriler",
    privacyP4:
      "Onayladığınız transferler Solana'nın herkese açık blok zincirine kaydedilir. Blok zinciri verileri yayınlandıktan sonra herkese açıktır ve ACOPAY'in kontrolü dışındadır.",
    privacyH5: "5. Üçüncü taraflar",
    privacyP5:
      "Hizmetleri işletmek için altyapı sağlayıcılarını (barındırma, CDN, RPC uç noktaları) kullanırız. Kişisel verileri satmıyoruz. Bu tarih itibarıyla mobil uygulamada reklam SDK'sı kullanmıyoruz.",
    privacyH6: "6. Saklama",
    privacyP6:
      "Sunucu tarafı oturum ve operasyonel günlükler yalnızca güvenlik, destek ve yasal yükümlülükler için gerekli olduğu sürece saklanır, ardından silinir veya anonimleştirilir.",
    privacyH7: "7. Seçenekleriniz",
    privacyP7Before:
      "İstediğiniz zaman Hizmetleri kullanmayı bırakabilir, uygulamayı kaldırabilir ve cihazınızdaki yerel cüzdan verilerini silebilirsiniz. Bkz. ",
    privacyP7After: ".",
    privacyH8: "8. İletişim",
    privacyContact: "Sorular:",
    termsIntro:
      "acopay.net'i veya ACOPAY mobil cüzdanını (“Hizmetler”) kullanarak bu Şartları kabul etmiş olursunuz. Kabul etmiyorsanız, Hizmetleri kullanmayın.",
    termsH1: "1. Hizmetlerin niteliği",
    termsP1:
      "ACOPAY, Solana token'ları için saklayıcı olmayan bir cüzdan ve transfer aracıdır. Bir borsa işletmiyoruz, anahtarlarınızı saklamıyoruz ve token fiyatlarını veya yatırım getirilerini garanti etmiyoruz. Hizmetler finansal tavsiye niteliği taşımaz.",
    termsH2: "2. Sorumluluklarınız",
    termsLi1: "Kurtarma ifadenizi ve özel anahtarlarınızı güvence altına almaktan yalnızca siz sorumlusunuz.",
    termsLi2: "Transfer yapmadan önce alıcı adreslerini doğrulamaktan siz sorumlusunuz.",
    termsLi3: "Size uygulanan yasalara (kripto düzenlemeleri dahil) uymalısınız.",
    termsLi4: "Hizmetleri kullanmak için en az 18 yaşında olmalısınız.",
    termsH3: "3. Ağ ücretleri",
    termsP3:
      "ACOPAY'in sponsorlu akışı üzerinden desteklenen ACOPAY transferleri için, Solana ağ (gas) ücretleri üründe açıklandığı şekilde ACOPAY/operatör tarafından ödenebilir. Diğer token'lar için (örneğin USDT, SOL veya özel SPL token'ları), ağ ücretlerini kendi cüzdanınızdan ödersiniz. Token transfer ücretleri (örneğin ACOPAY'in %0,01'lik zincir üstü ücreti) Solana gas ücretinden ayrıdır ve zincir üstü program kurallarına tabidir.",
    termsH4: "4. Saklama yok; kayıp riski",
    termsP4:
      "Kurtarma ifadenizi veya cihazınızı yedeklemeden kaybederseniz, varlıklarınız kalıcı olarak geri alınamaz hale gelebilir. Blok zinciri işlemleri onaylandıktan sonra geri alınamaz.",
    termsH5: "5. Yasaklı kullanım",
    termsP5:
      "Hizmetleri yasa dışı faaliyetler, dolandırıcılık, yaptırımlardan kaçınma veya altyapının kötüye kullanılması (spam, saldırılar, zarar verme amaçlı tersine mühendislik) için kullanamazsınız.",
    termsH6: "6. Sorumluluk reddi",
    termsP6:
      "HİZMETLER, HERHANGİ BİR TÜR GARANTİ OLMAKSIZIN “OLDUĞU GİBİ” SUNULMAKTADIR. YASALARIN İZİN VERDİĞİ AZAMİ ÖLÇÜDE, ACOPAY DOLAYLI, ARIZİ VEYA SONUÇSAL ZARARLARDAN YA DA KULLANICI HATASI, BLOK ZİNCİRİ ARIZALARI VEYA ÜÇÜNCÜ TARAF HİZMETLERİNDEN KAYNAKLANAN KAYIPLARDAN SORUMLU DEĞİLDİR.",
    termsH7: "7. Değişiklikler",
    termsP7:
      "Bu Şartları güncelleyebiliriz. Değişikliklerden sonra kullanıma devam edilmesi, güncellenmiş Şartların kabulü anlamına gelir. Önemli değişiklikler, yukarıdaki tarihin güncellenmesiyle yansıtılacaktır.",
    termsH8: "8. İletişim",
    deleteIntro:
      "Google Play ve App Store, uygulamanın kurulmasını gerektirmeyen herkese açık bir silme yolu talep eder. Son güncelleme: 2 Ağustos 2026",
    deleteHWhat: "Burada “hesap” ne anlama gelir",
    deletePWhat:
      "ACOPAY mobil cüzdanı saklayıcı değildir. Anahtarlarınız cihazınızda bulunur. Fonlarınızı tutan merkezi bir giriş hesabı yoktur. Silme, yerel cüzdan verilerinin ve ACOPAY API'leriyle kullandığınız adreslere bağlı sunucu tarafı oturumların/operasyonel verilerin kaldırılması anlamına gelir.",
    deleteHA: "A. Cihazınızdaki verileri silin (anında)",
    deleteA1: "ACOPAY uygulamasını açın → ACOPAY logosuna dokunun → Oturumu kapatın.",
    deleteA2: "Uygulamayı cihazınızdan kaldırın.",
    deleteA3: "İsteğe bağlı: işletim sisteminiz bu kontrolü sağlıyorsa, kaldırmadan önce uygulama depolamasını / SecureStore'u temizleyin.",
    deleteWarnLabel: "Uyarı:",
    deleteWarn: " Kurtarma ifadenizi yedeklemediyseniz, oturumu kapatmak veya uygulamayı kaldırmak fonlarınızın geri alınamaz hale gelmesine neden olabilir.",
    deleteHB: "B. Sunucu tarafı silme talep edin",
    deleteEmailBefore: "Şu adrese e-posta gönderin: ",
    deleteEmailMid: ", konu: ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " ve şunları ekleyin:",
    deleteLi1: "ACOPAY ile kullandığınız Solana cüzdan adres(ler)iniz",
    deleteLi2: "Yaklaşık kullanım tarihleri (biliniyorsa)",
    deleteP2:
      "Yasal veya güvenlik nedenleriyle saklamamız gereken veriler ile silinemeyen kamuya açık blok zinciri kayıtları hariç olmak üzere, ilgili oturum kayıtlarını ve destek yazışmalarını 30 gün içinde sileceğiz veya anonimleştireceğiz.",
    deleteHRelated: "İlgili",
  }),

  ar: L({
    privacyTitle: "سياسة الخصوصية",
    termsTitle: "شروط الخدمة",
    deleteTitle: "حذف الحساب والبيانات",
    lastUpdated: "آخر تحديث: 2 أغسطس 2026",
    privacyIntro:
      "توضح سياسة الخصوصية هذه كيفية تعامل ACOPAY (“نحن”) مع المعلومات عند استخدامك لموقع acopay.net وتطبيق محفظة ACOPAY للجوال (“الخدمات”).",
    privacyH1: "1. ملخص المنتج",
    privacyP1:
      "توفر ACOPAY تجربة محفظة Solana غير احتجازية: يمكنك إنشاء محفظة أو استيرادها، وعرض الأرصدة، وتحويل عملات SPL (بما في ذلك ACOPAY وUSDT وSOL وعملات أخرى تضيفها). تبقى عبارات الاسترداد والمفاتيح الخاصة على جهازك ولا تجمعها ACOPAY.",
    privacyH2: "2. البيانات التي نعالجها",
    privacyLi1Label: "عناوين المحفظة العامة",
    privacyLi1Rest: " — لازمة لتقدير الرسوم، وإنشاء التحويلات التي تطلبها ومحاكاتها وبثها.",
    privacyLi2Label: "بيانات وصفية للمعاملات",
    privacyLi2Rest:
      " — المبالغ، وعناوين أو أسماء مستخدمي المستلمين التي تُدخلها، والتوقيعات، وحالة التأكيد عند استخدامك واجهات برمجة تطبيقات التحويل التي ترعاها ACOPAY.",
    privacyLi3Label: "سجلات تقنية",
    privacyLi3Rest: " — سجلات ويب/خادم قياسية (IP، وكيل المستخدم، الطوابع الزمنية) للأمان ومنع إساءة الاستخدام.",
    privacyLi4Label: "تواصل اختياري",
    privacyLi4Before: " — إذا راسلتنا عبر البريد الإلكتروني على ",
    privacyLi4After: "، فإننا نعالج محتوى تلك المراسلة.",
    privacyH3: "3. البيانات التي لا نجمعها",
    privacyP3:
      "لا نجمع عبارة الاسترداد الأساسية (seed phrase) أو المفتاح الخاص أو القوالب البيومترية الخاصة بك. يتم التعامل مع فتح القفل البيومتري (Face ID / بصمة الإصبع)، إن كان مفعّلاً، من قبل نظام تشغيل جهازك.",
    privacyH4: "4. البيانات على السلسلة",
    privacyP4:
      "تُسجَّل التحويلات التي تؤكدها على سلسلة كتل Solana العامة. تصبح بيانات سلسلة الكتل علنية وخارج سيطرة ACOPAY بمجرد بثها.",
    privacyH5: "5. أطراف ثالثة",
    privacyP5:
      "نستخدم مزودي بنية تحتية (استضافة، CDN، نقاط نهاية RPC) لتشغيل الخدمات. نحن لا نبيع البيانات الشخصية. اعتبارًا من هذا التاريخ، لا نستخدم أي SDK إعلانية في تطبيق الجوال.",
    privacyH6: "6. الاحتفاظ بالبيانات",
    privacyP6:
      "يتم الاحتفاظ بسجلات الجلسات والتشغيل من جانب الخادم فقط للمدة اللازمة للأمان والدعم والالتزامات القانونية، ثم تُحذف أو تُجهّل هويتها.",
    privacyH7: "7. خياراتك",
    privacyP7Before:
      "يمكنك التوقف عن استخدام الخدمات في أي وقت، وإلغاء تثبيت التطبيق، ومسح بيانات المحفظة المحلية من جهازك. راجع ",
    privacyP7After: ".",
    privacyH8: "8. تواصل معنا",
    privacyContact: "الأسئلة:",
    termsIntro:
      "باستخدامك لموقع acopay.net أو محفظة ACOPAY للجوال (“الخدمات”)، فإنك توافق على هذه الشروط. إذا كنت لا توافق، فيرجى عدم استخدام الخدمات.",
    termsH1: "1. طبيعة الخدمات",
    termsP1:
      "ACOPAY هي أداة محفظة وتحويل غير احتجازية لعملات Solana. نحن لا نُشغّل بورصة، ولا نحتفظ بمفاتيحك، ولا نضمن أسعار العملات أو عوائد الاستثمار. لا تُعد الخدمات استشارة مالية.",
    termsH2: "2. مسؤولياتك",
    termsLi1: "أنت المسؤول الوحيد عن تأمين عبارة الاسترداد ومفاتيحك الخاصة.",
    termsLi2: "أنت مسؤول عن التحقق من عناوين المستلمين قبل التحويل.",
    termsLi3: "يجب عليك الامتثال للقوانين المطبقة عليك (بما في ذلك لوائح العملات المشفرة).",
    termsLi4: "يجب أن يكون عمرك 18 عامًا على الأقل لاستخدام الخدمات.",
    termsH3: "3. رسوم الشبكة",
    termsP3:
      "بالنسبة لتحويلات ACOPAY المدعومة عبر التدفق الذي ترعاه ACOPAY، قد تُدفع رسوم شبكة Solana (الغاز) من قبل ACOPAY/المشغّل كما هو موضح داخل المنتج. بالنسبة للعملات الأخرى (مثل USDT وSOL أو عملات SPL المخصصة)، تدفع رسوم الشبكة من محفظتك الخاصة. رسوم تحويل العملات (مثل رسوم ACOPAY على السلسلة البالغة 0.01%) منفصلة عن غاز Solana وتخضع لقواعد البرنامج على السلسلة.",
    termsH4: "4. لا احتجاز؛ خطر الخسارة",
    termsP4:
      "إذا فقدت عبارة الاسترداد أو جهازك دون نسخة احتياطية، فقد تصبح أصولك غير قابلة للاسترداد بشكل دائم. معاملات سلسلة الكتل لا رجعة فيها بمجرد تأكيدها.",
    termsH5: "5. الاستخدام المحظور",
    termsP5:
      "لا يجوز لك استخدام الخدمات في أي نشاط غير قانوني أو احتيال أو التهرب من العقوبات أو إساءة استخدام البنية التحتية (البريد العشوائي، الهجمات، الهندسة العكسية بقصد الإضرار).",
    termsH6: "6. إخلاء المسؤولية",
    termsP6:
      "تُقدَّم الخدمات “كما هي” دون أي ضمانات من أي نوع. إلى أقصى حد يسمح به القانون، لا تتحمل ACOPAY المسؤولية عن الأضرار غير المباشرة أو العرضية أو التبعية، أو عن الخسائر الناجمة عن خطأ المستخدم، أو أعطال سلسلة الكتل، أو خدمات الأطراف الثالثة.",
    termsH7: "7. التغييرات",
    termsP7:
      "يجوز لنا تحديث هذه الشروط. يُعد استمرار الاستخدام بعد التغييرات قبولًا للشروط المحدّثة. سيتم توضيح التغييرات الجوهرية من خلال تحديث التاريخ أعلاه.",
    termsH8: "8. تواصل معنا",
    deleteIntro:
      "يتطلب كل من Google Play وApp Store مسارًا علنيًا للحذف لا يستلزم تثبيت التطبيق. آخر تحديث: 2 أغسطس 2026",
    deleteHWhat: "ماذا يعني “الحساب” هنا",
    deletePWhat:
      "محفظة ACOPAY للجوال غير احتجازية. تبقى مفاتيحك على جهازك. لا يوجد حساب دخول مركزي يحتفظ بأموالك. يعني الحذف إزالة بيانات المحفظة المحلية وأي جلسات/بيانات تشغيل من جانب الخادم مرتبطة بالعناوين التي استخدمتها مع واجهات برمجة تطبيقات ACOPAY.",
    deleteHA: "أ. حذف البيانات من جهازك (فوري)",
    deleteA1: "افتح تطبيق ACOPAY → اضغط على شعار ACOPAY → تسجيل الخروج.",
    deleteA2: "قم بإلغاء تثبيت التطبيق من جهازك.",
    deleteA3: "اختياري: امسح تخزين التطبيق / SecureStore قبل إلغاء التثبيت إذا كان نظام التشغيل لديك يوفر هذا الخيار.",
    deleteWarnLabel: "تحذير:",
    deleteWarn: " إذا لم تكن قد نسخت عبارة الاسترداد احتياطيًا، فقد يؤدي تسجيل الخروج أو إلغاء التثبيت إلى جعل أموالك غير قابلة للاسترداد.",
    deleteHB: "ب. طلب الحذف من جانب الخادم",
    deleteEmailBefore: "أرسل بريدًا إلكترونيًا إلى ",
    deleteEmailMid: " بموضوع ",
    deleteSubject: "Delete ACOPAY data",
    deleteEmailAfter: " مع تضمين ما يلي:",
    deleteLi1: "عنوان (عناوين) محفظة Solana الخاصة بك المستخدمة مع ACOPAY",
    deleteLi2: "التواريخ التقريبية للاستخدام (إن كانت معروفة)",
    deleteP2:
      "سنقوم بحذف سجلات الجلسات ومراسلات الدعم المرتبطة أو إخفاء هويتها خلال 30 يومًا، باستثناء البيانات التي يجب علينا الاحتفاظ بها لأسباب قانونية أو أمنية، وباستثناء سجلات سلسلة الكتل العامة التي لا يمكن حذفها.",
    deleteHRelated: "ذات صلة",
  }),
};
