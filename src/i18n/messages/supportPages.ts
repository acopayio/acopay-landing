/**
 * `/support` page — full `support` section for every non-English UI locale.
 * Store-safe: non-custodial, no exchange/swap in mobile app.
 */
import type { Messages } from "./en";

type SupportSection = Messages["support"];
type Partials = Record<string, { support: SupportSection }>;

function block(s: SupportSection): { support: SupportSection } {
  return { support: s };
}

export const SUPPORT_PAGE_PARTIALS: Partials = {
  vi: block({
    title: "Hỗ trợ",
    subtitle: "Trợ giúp cho ứng dụng ví ACOPAY không giữ hộ và acopay.net.",
    intro:
      "ACOPAY là ví Solana không giữ hộ. Chúng tôi không giữ cụm từ khôi phục, khóa riêng hay quỹ của bạn. Với sự cố kỹ thuật về ứng dụng di động hoặc trang web này, hãy liên hệ qua email.",
    emailLabel: "Hỗ trợ qua email",
    emailHint:
      "Ghi rõ phiên bản ứng dụng, model thiết bị và mô tả ngắn về sự cố. Không bao giờ gửi cụm từ khôi phục hoặc khóa riêng.",
    deviceTitle: "Khôi phục quyền truy cập trên thiết bị",
    device1: "Nếu vẫn còn ứng dụng: mở Cài đặt và xác minh sao lưu ví trước khi gỡ cài đặt.",
    device2: "Nếu cài lại: dùng Nhập ví với cụm 12 từ khôi phục chỉ trên thiết bị đáng tin cậy.",
    device3: "Nếu mất cụm từ khôi phục, ACOPAY không thể khôi phục ví — tài sản trên blockchain có thể không lấy lại được.",
    relatedTitle: "Chính sách liên quan",
    privacyLink: "Chính sách quyền riêng tư",
    termsLink: "Điều khoản dịch vụ",
    deleteLink: "Xóa tài khoản & dữ liệu",
    nonCustodialNote:
      "ACOPAY không cung cấp dịch vụ sàn giao dịch, hoán đổi hay đầu tư trong ứng dụng di động. Khóa luôn nằm trên thiết bị của bạn.",
  }),
  zh: block({
    title: "支持",
    subtitle: "ACOPAY 非托管钱包应用与 acopay.net 的帮助。",
    intro:
      "ACOPAY 是非托管 Solana 钱包。我们不持有您的恢复短语、私钥或资金。如需移动应用或本网站的技术支持，请通过电子邮件联系我们。",
    emailLabel: "邮件支持",
    emailHint: "请提供应用版本、设备型号及问题的简要说明。切勿发送恢复短语或私钥。",
    deviceTitle: "在设备上恢复访问",
    device1: "若仍保留应用：卸载前请打开设置并确认钱包备份。",
    device2: "若重新安装：仅在可信设备上使用 12 词恢复短语导入钱包。",
    device3: "若丢失恢复短语，ACOPAY 无法恢复您的钱包 — 区块链资产可能无法找回。",
    relatedTitle: "相关政策",
    privacyLink: "隐私政策",
    termsLink: "服务条款",
    deleteLink: "删除账户与数据",
    nonCustodialNote: "ACOPAY 移动应用不提供交易所、兑换或投资服务。私钥保留在您的设备上。",
  }),
  ja: block({
    title: "サポート",
    subtitle: "ACOPAY 非カストディアルウォレットアプリと acopay.net のヘルプ。",
    intro:
      "ACOPAY は非カストディアルな Solana ウォレットです。リカバリーフレーズ、秘密鍵、資金を預かりません。モバイルアプリまたは本サイトの技術的な問題はメールでお問い合わせください。",
    emailLabel: "メールサポート",
    emailHint: "アプリのバージョン、端末モデル、問題の概要を記載してください。リカバリーフレーズや秘密鍵は送らないでください。",
    deviceTitle: "端末でのアクセス復旧",
    device1: "アプリが残っている場合：アンインストール前に設定でウォレットのバックアップを確認してください。",
    device2: "再インストールした場合：信頼できる端末でのみ 12 語のリカバリーフレーズでウォレットをインポートしてください。",
    device3: "リカバリーフレーズを紛失した場合、ACOPAY はウォレットを復元できません — ブロックチェーン上の資産は回復できない場合があります。",
    relatedTitle: "関連ポリシー",
    privacyLink: "プライバシーポリシー",
    termsLink: "利用規約",
    deleteLink: "アカウントとデータの削除",
    nonCustodialNote:
      "ACOPAY のモバイルアプリでは取引所、スワップ、投資サービスを提供していません。秘密鍵は端末に保管されます。",
  }),
  ko: block({
    title: "지원",
    subtitle: "ACOPAY 비수탁 지갑 앱 및 acopay.net 도움말.",
    intro:
      "ACOPAY는 비수탁 Solana 지갑입니다. 복구 문구, 개인키 또는 자금을 보관하지 않습니다. 모바일 앱 또는 이 웹사이트의 기술 문제는 이메일로 문의하세요.",
    emailLabel: "이메일 지원",
    emailHint: "앱 버전, 기기 모델, 문제에 대한 간단한 설명을 포함하세요. 복구 문구나 개인키는 절대 보내지 마세요.",
    deviceTitle: "기기에서 접근 복구",
    device1: "앱이 아직 있는 경우: 제거하기 전에 설정에서 지갑 백업을 확인하세요.",
    device2: "재설치한 경우: 신뢰할 수 있는 기기에서만 12단어 복구 문구로 지갑을 가져오세요.",
    device3: "복구 문구를 잃어버린 경우 ACOPAY는 지갑을 복구할 수 없습니다 — 블록체인 자산은 복구되지 않을 수 있습니다.",
    relatedTitle: "관련 정책",
    privacyLink: "개인정보 처리방침",
    termsLink: "서비스 약관",
    deleteLink: "계정 및 데이터 삭제",
    nonCustodialNote:
      "ACOPAY 모바일 앱에서는 거래소, 스왑 또는 투자 서비스를 제공하지 않습니다. 키는 기기에 보관됩니다.",
  }),
  th: block({
    title: "การสนับสนุน",
    subtitle: "ความช่วยเหลือสำหรับแอปกระเป๋า ACOPAY แบบไม่ฝากทรัพย์และ acopay.net",
    intro:
      "ACOPAY เป็นกระเป๋า Solana แบบไม่ฝากทรัพย์ เราไม่เก็บวลีกู้คืน คีย์ส่วนตัว หรือเงินของคุณ หากมีปัญหาทางเทคนิคเกี่ยวกับแอปมือถือหรือเว็บไซต์นี้ ติดต่อเราทางอีเมล",
    emailLabel: "สนับสนุนทางอีเมล",
    emailHint: "ระบุเวอร์ชันแอป รุ่นอุปกรณ์ และคำอธิบายปัญหาสั้นๆ ห้ามส่งวลีกู้คืนหรือคีย์ส่วนตัว",
    deviceTitle: "กู้คืนการเข้าถึงบนอุปกรณ์",
    device1: "หากยังมีแอป: เปิดการตั้งค่าและตรวจสอบการสำรองกระเป๋าก่อนถอนการติดตั้ง",
    device2: "หากติดตั้งใหม่: ใช้นำเข้ากระเป๋าด้วยวลีกู้คืน 12 คำบนอุปกรณ์ที่เชื่อถือได้เท่านั้น",
    device3: "หากสูญเสียวลีกู้คืน ACOPAY ไม่สามารถกู้คืนกระเป๋าได้ — สินทรัพย์บนบล็อกเชนอาจกู้คืนไม่ได้",
    relatedTitle: "นโยบายที่เกี่ยวข้อง",
    privacyLink: "นโยบายความเป็นส่วนตัว",
    termsLink: "ข้อกำหนดการให้บริการ",
    deleteLink: "ลบบัญชีและข้อมูล",
    nonCustodialNote:
      "ACOPAY ไม่ให้บริการแลกเปลี่ยน สวอป หรือลงทุนในแอปมือถือ คีย์อยู่บนอุปกรณ์ของคุณ",
  }),
  id: block({
    title: "Dukungan",
    subtitle: "Bantuan untuk aplikasi dompet ACOPAY non-kustodial dan acopay.net.",
    intro:
      "ACOPAY adalah dompet Solana non-kustodial. Kami tidak menyimpan frase pemulihan, kunci pribadi, atau dana Anda. Untuk masalah teknis aplikasi seluler atau situs web ini, hubungi kami melalui email.",
    emailLabel: "Dukungan email",
    emailHint:
      "Sertakan versi aplikasi, model perangkat, dan deskripsi singkat masalah. Jangan pernah mengirim frase pemulihan atau kunci pribadi.",
    deviceTitle: "Pulihkan akses di perangkat Anda",
    device1: "Jika aplikasi masih ada: buka Pengaturan dan verifikasi cadangan dompet sebelum uninstall.",
    device2: "Jika menginstal ulang: gunakan Impor dompet dengan frase pemulihan 12 kata hanya di perangkat tepercaya.",
    device3: "Jika frase pemulihan hilang, ACOPAY tidak dapat memulihkan dompet — aset blockchain mungkin tidak dapat dipulihkan.",
    relatedTitle: "Kebijakan terkait",
    privacyLink: "Kebijakan Privasi",
    termsLink: "Ketentuan Layanan",
    deleteLink: "Hapus akun & data",
    nonCustodialNote:
      "ACOPAY tidak menyediakan layanan bursa, swap, atau investasi di aplikasi seluler. Kunci tetap di perangkat Anda.",
  }),
  ms: block({
    title: "Sokongan",
    subtitle: "Bantuan untuk aplikasi dompet ACOPAY bukan jagaan dan acopay.net.",
    intro:
      "ACOPAY ialah dompet Solana bukan jagaan. Kami tidak menyimpan frasa pemulihan, kunci peribadi, atau dana anda. Untuk isu teknikal aplikasi mudah alih atau laman web ini, hubungi kami melalui e-mel.",
    emailLabel: "Sokongan e-mel",
    emailHint:
      "Sertakan versi aplikasi, model peranti, dan penerangan ringkas isu. Jangan hantar frasa pemulihan atau kunci peribadi.",
    deviceTitle: "Pulihkan akses pada peranti anda",
    device1: "Jika aplikasi masih ada: buka Tetapan dan sahkan sandaran dompet sebelum nyahpasang.",
    device2: "Jika pasang semula: gunakan Import dompet dengan frasa pemulihan 12 perkataan hanya pada peranti dipercayai.",
    device3: "Jika frasa pemulihan hilang, ACOPAY tidak boleh memulihkan dompet — aset blockchain mungkin tidak dapat dipulihkan.",
    relatedTitle: "Dasar berkaitan",
    privacyLink: "Dasar Privasi",
    termsLink: "Terma Perkhidmatan",
    deleteLink: "Padam akaun & data",
    nonCustodialNote:
      "ACOPAY tidak menyediakan perkhidmatan pertukaran, swap, atau pelaburan dalam aplikasi mudah alih. Kunci kekal pada peranti anda.",
  }),
  hi: block({
    title: "सहायता",
    subtitle: "ACOPAY गैर-कस्टोडियल वॉलेट ऐप और acopay.net के लिए सहायता।",
    intro:
      "ACOPAY एक गैर-कस्टोडियल Solana वॉलेट है। हम आपका रिकवरी वाक्यांश, निजी कुंजी या धन नहीं रखते। मोबाइल ऐप या इस वेबसाइट की तकनीकी समस्याओं के लिए ईमेल से संपर्क करें।",
    emailLabel: "ईमेल सहायता",
    emailHint:
      "ऐप संस्करण, डिवाइस मॉडल और समस्या का संक्षिप्त विवरण शामिल करें। कभी भी रिकवरी वाक्यांश या निजी कुंजी न भेजें।",
    deviceTitle: "अपने डिवाइस पर पहुँच पुनर्प्राप्त करें",
    device1: "यदि ऐप अभी भी है: अनइंस्टॉल करने से पहले सेटिंग्स खोलकर वॉलेट बैकअप सत्यापित करें।",
    device2: "यदि पुनः इंस्टॉल किया: केवल विश्वसनीय डिवाइस पर 12-शब्द रिकवरी वाक्यांश से वॉलेट आयात करें।",
    device3: "यदि रिकवरी वाक्यांश खो गया, ACOPAY वॉलेट पुनर्स्थापित नहीं कर सकता — ब्लॉकचेन संपत्ति पुनर्प्राप्त नहीं हो सकती।",
    relatedTitle: "संबंधित नीतियाँ",
    privacyLink: "गोपनीयता नीति",
    termsLink: "सेवा की शर्तें",
    deleteLink: "खाता और डेटा हटाएँ",
    nonCustodialNote:
      "ACOPAY मोबाइल ऐप में एक्सचेंज, स्वैप या निवेश सेवाएँ नहीं देता। कुंजी आपके डिवाइस पर रहती है।",
  }),
  es: block({
    title: "Soporte",
    subtitle: "Ayuda para la app de billetera ACOPAY no custodial y acopay.net.",
    intro:
      "ACOPAY es una billetera Solana no custodial. No guardamos tu frase de recuperación, claves privadas ni fondos. Para problemas técnicos con la app móvil o este sitio web, contáctanos por correo electrónico.",
    emailLabel: "Soporte por email",
    emailHint:
      "Incluye la versión de la app, el modelo del dispositivo y una breve descripción del problema. Nunca envíes tu frase de recuperación ni tu clave privada.",
    deviceTitle: "Recuperar acceso en tu dispositivo",
    device1: "Si aún tienes la app: abre Ajustes y verifica la copia de seguridad de la billetera antes de desinstalar.",
    device2: "Si reinstalaste: usa Importar billetera con tu frase de recuperación de 12 palabras solo en un dispositivo de confianza.",
    device3: "Si perdiste tu frase de recuperación, ACOPAY no puede restaurar tu billetera — los activos en blockchain pueden ser irrecuperables.",
    relatedTitle: "Políticas relacionadas",
    privacyLink: "Política de privacidad",
    termsLink: "Términos de servicio",
    deleteLink: "Eliminar cuenta y datos",
    nonCustodialNote:
      "ACOPAY no ofrece servicios de exchange, swap ni inversión en la app móvil. Las claves permanecen en tu dispositivo.",
  }),
  pt: block({
    title: "Suporte",
    subtitle: "Ajuda para o app de carteira ACOPAY não custodial e acopay.net.",
    intro:
      "ACOPAY é uma carteira Solana não custodial. Não guardamos sua frase de recuperação, chaves privadas ou fundos. Para problemas técnicos com o app móvel ou este site, entre em contato por e-mail.",
    emailLabel: "Suporte por e-mail",
    emailHint:
      "Inclua a versão do app, o modelo do dispositivo e uma descrição breve do problema. Nunca envie sua frase de recuperação ou chave privada.",
    deviceTitle: "Recuperar acesso no seu dispositivo",
    device1: "Se ainda tiver o app: abra Configurações e verifique o backup da carteira antes de desinstalar.",
    device2: "Se reinstalou: use Importar carteira com a frase de recuperação de 12 palavras apenas em um dispositivo confiável.",
    device3: "Se perdeu a frase de recuperação, a ACOPAY não pode restaurar sua carteira — ativos na blockchain podem ser irrecuperáveis.",
    relatedTitle: "Políticas relacionadas",
    privacyLink: "Política de Privacidade",
    termsLink: "Termos de Serviço",
    deleteLink: "Excluir conta e dados",
    nonCustodialNote:
      "A ACOPAY não oferece serviços de exchange, swap ou investimento no app móvel. As chaves permanecem no seu dispositivo.",
  }),
  fr: block({
    title: "Assistance",
    subtitle: "Aide pour l’app portefeuille ACOPAY non custodial et acopay.net.",
    intro:
      "ACOPAY est un portefeuille Solana non custodial. Nous ne détenons pas votre phrase de récupération, vos clés privées ni vos fonds. Pour les problèmes techniques de l’app mobile ou de ce site, contactez-nous par e-mail.",
    emailLabel: "Assistance par e-mail",
    emailHint:
      "Indiquez la version de l’app, le modèle de l’appareil et une brève description du problème. N’envoyez jamais votre phrase de récupération ni votre clé privée.",
    deviceTitle: "Récupérer l’accès sur votre appareil",
    device1: "Si vous avez encore l’app : ouvrez Réglages et vérifiez la sauvegarde du portefeuille avant de désinstaller.",
    device2: "Si vous avez réinstallé : utilisez Importer le portefeuille avec votre phrase de récupération de 12 mots sur un appareil de confiance uniquement.",
    device3: "Si vous avez perdu votre phrase de récupération, ACOPAY ne peut pas restaurer votre portefeuille — les actifs blockchain peuvent être irrécupérables.",
    relatedTitle: "Politiques associées",
    privacyLink: "Politique de confidentialité",
    termsLink: "Conditions d’utilisation",
    deleteLink: "Supprimer le compte et les données",
    nonCustodialNote:
      "ACOPAY ne fournit pas de services d’échange, de swap ou d’investissement dans l’app mobile. Les clés restent sur votre appareil.",
  }),
  de: block({
    title: "Support",
    subtitle: "Hilfe für die nicht verwahrte ACOPAY-Wallet-App und acopay.net.",
    intro:
      "ACOPAY ist eine nicht verwahrte Solana-Wallet. Wir bewahren weder Ihre Wiederherstellungsphrase, privaten Schlüssel noch Gelder auf. Bei technischen Problemen mit der mobilen App oder dieser Website kontaktieren Sie uns per E-Mail.",
    emailLabel: "E-Mail-Support",
    emailHint:
      "Geben Sie App-Version, Gerätemodell und eine kurze Problembeschreibung an. Senden Sie niemals Ihre Wiederherstellungsphrase oder Ihren privaten Schlüssel.",
    deviceTitle: "Zugriff auf Ihrem Gerät wiederherstellen",
    device1: "Wenn die App noch installiert ist: Öffnen Sie Einstellungen und prüfen Sie das Wallet-Backup vor der Deinstallation.",
    device2: "Nach Neuinstallation: Verwenden Sie Wallet importieren mit Ihrer 12-Wort-Wiederherstellungsphrase nur auf einem vertrauenswürdigen Gerät.",
    device3: "Bei verlorener Wiederherstellungsphrase kann ACOPAY Ihre Wallet nicht wiederherstellen — Blockchain-Vermögen ist ggf. nicht wiederherstellbar.",
    relatedTitle: "Verwandte Richtlinien",
    privacyLink: "Datenschutzrichtlinie",
    termsLink: "Nutzungsbedingungen",
    deleteLink: "Konto & Daten löschen",
    nonCustodialNote:
      "ACOPAY bietet in der mobilen App keine Börse, keinen Swap und keine Anlageberatung. Schlüssel bleiben auf Ihrem Gerät.",
  }),
  nl: block({
    title: "Ondersteuning",
    subtitle: "Hulp voor de non-custodial ACOPAY-wallet-app en acopay.net.",
    intro:
      "ACOPAY is een non-custodial Solana-wallet. Wij bewaren geen herstelzin, privésleutels of tegoeden. Voor technische problemen met de mobiele app of deze website kunt u ons per e-mail bereiken.",
    emailLabel: "E-mailondersteuning",
    emailHint:
      "Vermeld appversie, apparaatmodel en een korte beschrijving van het probleem. Stuur nooit uw herstelzin of privésleutel.",
    deviceTitle: "Toegang op uw apparaat herstellen",
    device1: "Als u de app nog hebt: open Instellingen en controleer uw walletback-up vóór deïnstallatie.",
    device2: "Na herinstallatie: gebruik Wallet importeren met uw herstelzin van 12 woorden alleen op een vertrouwd apparaat.",
    device3: "Bij verlies van de herstelzin kan ACOPAY uw wallet niet herstellen — blockchainactiva zijn mogelijk niet terug te halen.",
    relatedTitle: "Gerelateerd beleid",
    privacyLink: "Privacybeleid",
    termsLink: "Servicevoorwaarden",
    deleteLink: "Account en gegevens verwijderen",
    nonCustodialNote:
      "ACOPAY biedt geen exchange-, swap- of beleggingsdiensten in de mobiele app. Sleutels blijven op uw apparaat.",
  }),
  it: block({
    title: "Assistenza",
    subtitle: "Aiuto per l’app portafoglio ACOPAY non custodial e acopay.net.",
    intro:
      "ACOPAY è un portafoglio Solana non custodial. Non custodiamo la frase di recupero, le chiavi private né i fondi. Per problemi tecnici con l’app mobile o questo sito, contattaci via email.",
    emailLabel: "Assistenza email",
    emailHint:
      "Indica versione dell’app, modello del dispositivo e breve descrizione del problema. Non inviare mai la frase di recupero o la chiave privata.",
    deviceTitle: "Recupera l’accesso sul tuo dispositivo",
    device1: "Se hai ancora l’app: apri Impostazioni e verifica il backup del portafoglio prima di disinstallare.",
    device2: "Se hai reinstallato: usa Importa portafoglio con la frase di recupero di 12 parole solo su un dispositivo affidabile.",
    device3: "Se hai perso la frase di recupero, ACOPAY non può ripristinare il portafoglio — gli asset on-chain potrebbero essere irrecuperabili.",
    relatedTitle: "Policy correlate",
    privacyLink: "Informativa sulla privacy",
    termsLink: "Termini di servizio",
    deleteLink: "Elimina account e dati",
    nonCustodialNote:
      "ACOPAY non offre servizi di exchange, swap o investimento nell’app mobile. Le chiavi restano sul tuo dispositivo.",
  }),
  ru: block({
    title: "Поддержка",
    subtitle: "Помощь по некастодиальному приложению-кошельку ACOPAY и acopay.net.",
    intro:
      "ACOPAY — некастодиальный кошелёк Solana. Мы не храним вашу seed-фразу, приватные ключи или средства. По техническим вопросам мобильного приложения или этого сайта пишите на email.",
    emailLabel: "Поддержка по email",
    emailHint:
      "Укажите версию приложения, модель устройства и краткое описание проблемы. Никогда не отправляйте seed-фразу или приватный ключ.",
    deviceTitle: "Восстановление доступа на устройстве",
    device1: "Если приложение ещё установлено: откройте Настройки и проверьте резервную копию кошелька перед удалением.",
    device2: "После переустановки: используйте Импорт кошелька с 12-словной seed-фразой только на доверенном устройстве.",
    device3: "Если seed-фраза потеряна, ACOPAY не может восстановить кошелёк — активы в блокчейне могут быть безвозвратны.",
    relatedTitle: "Связанные политики",
    privacyLink: "Политика конфиденциальности",
    termsLink: "Условия использования",
    deleteLink: "Удалить аккаунт и данные",
    nonCustodialNote:
      "ACOPAY не предоставляет биржу, своп или инвестиционные услуги в мобильном приложении. Ключи остаются на вашем устройстве.",
  }),
  uk: block({
    title: "Підтримка",
    subtitle: "Допомога для некастodialного гаманця ACOPAY і acopay.net.",
    intro:
      "ACOPAY — некастodialний гаманець Solana. Ми не зберігаємо вашу seed-фразу, приватні ключі чи кошти. З технічних питань мобільного застосунку або цього сайту пишіть на email.",
    emailLabel: "Підтримка email",
    emailHint:
      "Вкажіть версію застосунку, модель пристрою та короткий опис проблеми. Ніколи не надсилайте seed-фразу чи приватний ключ.",
    deviceTitle: "Відновлення доступу на пристрої",
    device1: "Якщо застосунок ще є: відкрийте Налаштування та перевірте резервну копію гаманця перед видаленням.",
    device2: "Після перевстановлення: імпортуйте гаманець з 12-словною seed-фразою лише на довіреному пристрої.",
    device3: "Якщо seed-фразу втрачено, ACOPAY не може відновити гаманець — активи в блокчейні можуть бути безповоротні.",
    relatedTitle: "Пов’язані політики",
    privacyLink: "Політика конфіденційності",
    termsLink: "Умови надання послуг",
    deleteLink: "Видалити обліковий запис і дані",
    nonCustodialNote:
      "ACOPAY не надає біржу, своп чи інвестиційні послуги в мобільному застосунку. Ключі залишаються на вашому пристрої.",
  }),
  pl: block({
    title: "Wsparcie",
    subtitle: "Pomoc dla aplikacji portfela ACOPAY bez powiernictwa i acopay.net.",
    intro:
      "ACOPAY to portfel Solana bez powiernictwa. Nie przechowujemy frazy odzyskiwania, kluczy prywatnych ani środków. W sprawach technicznych aplikacji mobilnej lub tej strony napisz do nas e-mailem.",
    emailLabel: "Wsparcie e-mail",
    emailHint:
      "Podaj wersję aplikacji, model urządzenia i krótki opis problemu. Nigdy nie wysyłaj frazy odzyskiwania ani klucza prywatnego.",
    deviceTitle: "Odzyskaj dostęp na urządzeniu",
    device1: "Jeśli aplikacja jest jeszcze zainstalowana: otwórz Ustawienia i sprawdź kopię zapasową portfela przed odinstalowaniem.",
    device2: "Po ponownej instalacji: użyj Importuj portfel z 12-słowną frazą odzyskiwania tylko na zaufanym urządzeniu.",
    device3: "Jeśli utracono frazę odzyskiwania, ACOPAY nie może przywrócić portfela — aktywa w blockchainie mogą być nieodwracalne.",
    relatedTitle: "Powiązane polityki",
    privacyLink: "Polityka prywatności",
    termsLink: "Regulamin",
    deleteLink: "Usuń konto i dane",
    nonCustodialNote:
      "ACOPAY nie świadczy usług giełdy, swapu ani inwestycji w aplikacji mobilnej. Klucze pozostają na Twoim urządzeniu.",
  }),
  tr: block({
    title: "Destek",
    subtitle: "Saklamayan ACOPAY cüzdan uygulaması ve acopay.net için yardım.",
    intro:
      "ACOPAY saklamayan bir Solana cüzdanıdır. Kurtarma ifadenizi, özel anahtarlarınızı veya fonlarınızı tutmuyoruz. Mobil uygulama veya bu siteyle ilgili teknik sorunlar için e-posta ile iletişime geçin.",
    emailLabel: "E-posta desteği",
    emailHint:
      "Uygulama sürümü, cihaz modeli ve sorunun kısa açıklamasını ekleyin. Kurtarma ifadesi veya özel anahtar asla göndermeyin.",
    deviceTitle: "Cihazınızda erişimi kurtarın",
    device1: "Uygulama hâlâ yüklüyse: kaldırmadan önce Ayarlar’ı açın ve cüzdan yedeğinizi doğrulayın.",
    device2: "Yeniden yüklediyseniz: 12 kelimelik kurtarma ifadesiyle Cüzdan içe aktar’ı yalnızca güvenilir bir cihazda kullanın.",
    device3: "Kurtarma ifadesini kaybettiyseniz ACOPAY cüzdanı geri yükleyemez — blockchain varlıkları kurtarılamayabilir.",
    relatedTitle: "İlgili politikalar",
    privacyLink: "Gizlilik Politikası",
    termsLink: "Hizmet Şartları",
    deleteLink: "Hesabı ve verileri sil",
    nonCustodialNote:
      "ACOPAY mobil uygulamasında borsa, swap veya yatırım hizmeti sunmaz. Anahtarlar cihazınızda kalır.",
  }),
  ar: block({
    title: "الدعم",
    subtitle: "مساعدة لتطبيق محفظة ACOPAY غير الوصائي وacopay.net.",
    intro:
      "ACOPAY محفظة Solana غير وصائية. لا نحتفظ بعبارة الاسترداد أو المفاتيح الخاصة أو الأموال. للمشاكل التقنية في التطبيق أو هذا الموقع، تواصل معنا عبر البريد الإلكتروني.",
    emailLabel: "الدعم عبر البريد",
    emailHint:
      "اذكر إصدار التطبيق وطراز الجهاز ووصفاً مختصراً للمشكلة. لا ترسل أبداً عبارة الاسترداد أو المفتاح الخاص.",
    deviceTitle: "استعادة الوصول على جهازك",
    device1: "إذا كان التطبيق ما زال مثبتاً: افتح الإعدادات وتحقق من نسخة المحفظة الاحتياطية قبل إلغاء التثبيت.",
    device2: "إذا أعدت التثبيت: استخدم استيراد المحفظة بعبارة الاسترداد المكونة من 12 كلمة على جهاز موثوق فقط.",
    device3: "إذا فقدت عبارة الاسترداد، لا يمكن لـ ACOPAY استعادة محفظتك — قد تكون أصول البلوك تشين غير قابلة للاسترداد.",
    relatedTitle: "السياسات ذات الصلة",
    privacyLink: "سياسة الخصوصية",
    termsLink: "شروط الخدمة",
    deleteLink: "حذف الحساب والبيانات",
    nonCustodialNote:
      "ACOPAY لا يقدّم خدمات تداول أو مبادلة أو استثمار في التطبيق. المفاتيح تبقى على جهازك.",
  }),
};
