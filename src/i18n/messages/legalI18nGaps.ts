/**
 * Legal / chrome gaps that still fell through to English after LEGAL_PAGE_PARTIALS.
 * Merged after legalPages in index.ts.
 */
import type { Messages } from "./en";

type DeepPartialMessages = {
  [K in keyof Messages]?: {
    [P in keyof Messages[K]]?: string;
  };
};

type Partials = Record<string, DeepPartialMessages>;

export const LEGAL_I18N_GAP_PARTIALS: Partials = {
  th: {
    legal: {
      privacyLiUsernameLabel: "ชื่อผู้ใช้ Pay (ไม่บังคับ)",
      privacyLiPushLabel: "โทเค็นการแจ้งเตือนแบบพุช (ไม่บังคับ)",
      privacyLiUsernameRest:
        " — หากคุณสร้างชื่อผู้ใช้ ACOPAY Pay เราจะเก็บการจับคู่ระหว่างชื่อนั้นกับที่อยู่กระเป๋าสาธารณะ เพื่อให้ผู้อื่นชำระเงินถึงคุณด้วยชื่อผู้ใช้ได้",
      privacyLiPushRest:
        " — หากคุณเปิดการแจ้งเตือนการชำระเงินในแอป เราจะเก็บโทเค็นพุชของอุปกรณ์ที่เชื่อมกับที่อยู่กระเป๋าสาธารณะของคุณ คุณปิดการแจ้งเตือนได้ในการตั้งค่า",
      deleteIntro:
        "ใช้หน้านี้เพื่อลบข้อมูลกระเป๋า ACOPAY ออกจากอุปกรณ์ และขอให้ลบข้อมูลที่เกี่ยวข้องฝั่งเซิร์ฟเวอร์ คุณไม่จำเป็นต้องติดตั้งแอปเพื่อส่งคำขอด้านเซิร์ฟเวอร์",
      deleteLi2: "ชื่อผู้ใช้ ACOPAY Pay ที่คุณสร้างไว้ (ถ้ามี)",
      deleteLi3: "ช่วงวันที่ใช้งานโดยประมาณ (ถ้าทราบ)",
      deleteP2:
        "เราจะลบหรือทำให้ข้อมูลเซสชัน การจับคู่ชื่อผู้ใช้ Pay การลงทะเบียนพุช และจดหมายสนับสนุนที่เกี่ยวข้องไม่ระบุตัวตนภายใน 30 วันหลังคำขอที่ยืนยันได้ ยกเว้นข้อมูลที่ต้องเก็บตามกฎหมายหรือความปลอดภัย บันทึกสาธารณะบนบล็อกเชนไม่สามารถลบได้",
    },
  },
  ms: {
    legal: {
      privacyLiUsernameLabel: "Nama pengguna Pay (pilihan)",
      privacyLiPushLabel: "Token pemberitahuan push (pilihan)",
      deleteIntro:
        "Gunakan halaman ini untuk mengalih keluar data dompet ACOPAY dari peranti anda dan meminta pemadaman data berkaitan di pelayan. Anda tidak perlu memasang aplikasi untuk menghantar permintaan di sisi pelayan.",
      deleteLi2: "Sebarang nama pengguna ACOPAY Pay yang anda cipta (jika berkenaan)",
      deleteLi3: "Anggaran tarikh penggunaan (jika diketahui)",
      deleteP2:
        "Kami akan memadam atau menganonimkan rekod sesi, pemetaan nama pengguna Pay, pendaftaran push, dan surat-menyurat sokongan berkaitan dalam tempoh 30 hari selepas permintaan yang boleh disahkan, kecuali data yang mesti dikekalkan atas sebab undang-undang atau keselamatan. Rekod rantaian awam tidak boleh dipadam.",
    },
  },
  hi: {
    legal: {
      privacyLiUsernameLabel: "Pay उपयोगकर्ता नाम (वैकल्पिक)",
      privacyLiPushLabel: "पुश नोटिफिकेशन टोकन (वैकल्पिक)",
      privacyLiUsernameRest:
        " — यदि आप ACOPAY Pay उपयोगकर्ता नाम बनाते हैं, तो हम उस नाम और आपके सार्वजनिक वॉलेट पते का मैपिंग रखते हैं ताकि अन्य लोग नाम से भुगतान कर सकें।",
      privacyLiPushRest:
        " — यदि आप ऐप में भुगतान सूचनाएँ सक्षम करते हैं, तो हम आपके सार्वजनिक वॉलेट पते से जुड़ा डिवाइस पुश टोकन रखते हैं। आप सेटिंग्स में सूचनाएँ बंद कर सकते हैं।",
      deleteIntro:
        "इस पृष्ठ से अपने डिवाइस से ACOPAY वॉलेट डेटा हटाएँ और संबंधित सर्वर-साइड डेटा हटाने का अनुरोध करें। सर्वर अनुरोध के लिए ऐप इंस्टॉल होना ज़रूरी नहीं है।",
      deleteLi2: "आपका बनाया कोई भी ACOPAY Pay उपयोगकर्ता नाम (यदि लागू)",
      deleteLi3: "उपयोग की अनुमानित तिथियाँ (यदि ज्ञात हों)",
      deleteP2:
        "हम सत्यापित अनुरोध के 30 दिनों के भीतर संबंधित सत्र रिकॉर्ड, Pay उपयोगकर्ता नाम मैपिंग, पुश पंजीकरण और सहायता पत्राचार हटाएँगे या अनाम करेंगे, सिवाय उस डेटा के जिसे कानूनी या सुरक्षा कारणों से रखना आवश्यक हो। सार्वजनिक ब्लॉकचेन रिकॉर्ड हटाए नहीं जा सकते।",
    },
  },
  nl: {
    nav: { contract: "Contractadres" },
    footer: { product: "Productpagina", community: "Community & socials", contact: "Contacteer ons" },
    common: { details: "Meer details", live: "Live-status" },
    download: {
      featuresTitle: "Productinfo",
      ctaHint: "Versie {v} · Android 8+ · arm64 · {size}",
      version: "Versie {v}",
    },
    support: { title: "Ondersteuning" },
    legal: {
      privacyLiUsernameLabel: "Pay-gebruikersnaam (optioneel)",
      privacyLiPushLabel: "Pushmeldings-token (optioneel)",
      privacyH8: "9. Contacteer ons",
      termsH8: "8. Contacteer ons",
      deleteIntro:
        "Gebruik deze pagina om ACOPAY-walletdata van uw apparaat te verwijderen en verwijdering van gerelateerde serverdata aan te vragen. U hoeft de app niet te installeren om een serververzoek in te dienen.",
      deleteLi2: "Eventuele ACOPAY Pay-gebruikersnaam die u hebt aangemaakt (indien van toepassing)",
      deleteLi3: "Geschatte gebruiksdata (indien bekend)",
      deleteP2:
        "We verwijderen of anonimiseren gerelateerde sessierecords, Pay-gebruikersnaamkoppelingen, pushregistraties en supportcorrespondentie binnen 30 dagen na een verifieerbaar verzoek, behalve data die we om juridische of veiligheidsredenen moeten bewaren. Openbare blockchainrecords kunnen niet worden verwijderd.",
    },
  },
  it: {
    footer: { community: "Community e social" },
    common: { live: "In diretta" },
    legal: {
      privacyLiUsernameLabel: "Nome utente Pay (facoltativo)",
      privacyLiPushLabel: "Token di notifica push (facoltativo)",
      deleteIntro:
        "Usa questa pagina per rimuovere i dati del wallet ACOPAY dal dispositivo e richiedere l'eliminazione dei dati correlati sul server. Non serve avere l'app installata per inviare una richiesta lato server.",
      deleteLi2: "Eventuale nome utente ACOPAY Pay creato (se applicabile)",
      deleteLi3: "Date di utilizzo approssimative (se note)",
      deleteP2:
        "Elimineremo o anonimizzeremo record di sessione, mapping dei nomi utente Pay, registrazioni push e corrispondenza di assistenza correlati entro 30 giorni da una richiesta verificabile, salvo i dati che dobbiamo conservare per motivi legali o di sicurezza. I record pubblici della blockchain non possono essere eliminati.",
    },
  },
  ru: {
    legal: {
      privacyLiUsernameLabel: "Pay-имя пользователя (необязательно)",
      privacyLiPushLabel: "Токен push-уведомлений (необязательно)",
      deleteIntro:
        "Используйте эту страницу, чтобы удалить данные кошелька ACOPAY с устройства и запросить удаление связанных данных на сервере. Устанавливать приложение для серверного запроса не обязательно.",
      deleteLi2: "Любое созданное вами Pay-имя пользователя ACOPAY (если применимо)",
      deleteLi3: "Примерные даты использования (если известны)",
      deleteP2:
        "Мы удалим или обезличим связанные записи сессий, сопоставления Pay-имён, push-регистрации и переписку поддержки в течение 30 дней после проверяемого запроса, за исключением данных, которые обязаны хранить по закону или соображениям безопасности. Публичные записи блокчейна удалить нельзя.",
    },
  },
  uk: {
    legal: {
      privacyLiUsernameLabel: "Pay-ім’я користувача (необов’язково)",
      privacyLiPushLabel: "Токен push-сповіщень (необов’язково)",
      deleteIntro:
        "Скористайтеся цією сторінкою, щоб видалити дані гаманця ACOPAY з пристрою та подати запит на видалення пов’язаних даних на сервері. Встановлювати застосунок для серверного запиту не потрібно.",
      deleteLi2: "Будь-яке створене вами Pay-ім’я користувача ACOPAY (якщо застосовно)",
      deleteLi3: "Орієнтовні дати використання (якщо відомі)",
      deleteP2:
        "Ми видалимо або знеособимо пов’язані записи сесій, зіставлення Pay-імен, push-реєстрації та листування підтримки протягом 30 днів після перевіреного запиту, окрім даних, які мусимо зберігати з юридичних чи безпекових причин. Публічні записи блокчейну видалити неможливо.",
    },
  },
  pl: {
    legal: {
      privacyLiUsernameLabel: "Nazwa użytkownika Pay (opcjonalnie)",
      privacyLiPushLabel: "Token powiadomień push (opcjonalnie)",
      deleteIntro:
        "Użyj tej strony, aby usunąć dane portfela ACOPAY z urządzenia i poprosić o usunięcie powiązanych danych po stronie serwera. Nie musisz mieć zainstalowanej aplikacji, aby złożyć wniosek serwerowy.",
      deleteLi2: "Ewentualna utworzona nazwa użytkownika ACOPAY Pay (jeśli dotyczy)",
      deleteLi3: "Przybliżone daty korzystania (jeśli znane)",
      deleteP2:
        "Usuniemy lub zanonimizujemy powiązane rekordy sesji, mapowania nazw użytkownika Pay, rejestracje push oraz korespondencję wsparcia w ciągu 30 dni od weryfikowalnego wniosku, z wyjątkiem danych, które musimy zachować z powodów prawnych lub bezpieczeństwa. Publicznych rekordów blockchain nie można usunąć.",
    },
  },
  tr: {
    legal: {
      privacyLiUsernameLabel: "Pay kullanıcı adı (isteğe bağlı)",
      privacyLiPushLabel: "Anlık bildirim jetonu (isteğe bağlı)",
      deleteIntro:
        "Bu sayfayı cihazınızdaki ACOPAY cüzdan verilerini kaldırmak ve ilgili sunucu tarafı verilerin silinmesini istemek için kullanın. Sunucu talebi göndermek için uygulamanın yüklü olması gerekmez.",
      deleteLi2: "Oluşturduğunuz herhangi bir ACOPAY Pay kullanıcı adı (varsa)",
      deleteLi3: "Yaklaşık kullanım tarihleri (biliniyorsa)",
      deleteP2:
        "Doğrulanabilir bir talepten sonra 30 gün içinde ilgili oturum kayıtlarını, Pay kullanıcı adı eşlemelerini, anlık bildirim kayıtlarını ve destek yazışmalarını silecek veya anonimleştireceğiz; yasal veya güvenlik nedeniyle saklamak zorunda olduğumuz veriler hariç. Herkese açık blokzincir kayıtları silinemez.",
    },
  },
  ar: {
    legal: {
      privacyLiUsernameLabel: "اسم مستخدم Pay (اختياري)",
      privacyLiPushLabel: "رمز إشعارات الدفع (اختياري)",
      deleteIntro:
        "استخدم هذه الصفحة لإزالة بيانات محفظة ACOPAY من جهازك وطلب حذف البيانات ذات الصلة على الخادم. لا يلزم تثبيت التطبيق لإرسال طلب من جانب الخادم.",
      deleteLi2: "أي اسم مستخدم ACOPAY Pay أنشأته (إن وُجد)",
      deleteLi3: "تواريخ الاستخدام التقريبية (إن عُرفت)",
      deleteP2:
        "سنحذف أو نُعمّي سجلات الجلسات وربط أسماء مستخدمي Pay وتسجيلات الإشعارات ومراسلات الدعم ذات الصلة خلال 30 يومًا من طلب قابل للتحقق، باستثناء البيانات التي يجب الاحتفاظ بها لأسباب قانونية أو أمنية. سجلات سلسلة الكتل العامة لا يمكن حذفها.",
    },
  },
  fr: {
    footer: { contact: "Nous contacter" },
    download: {
      ctaHint: "Version {v} · Android 8+ · arm64 · {size}",
      version: "Version appli {v}",
    },
    legal: {
      privacyH8: "9. Nous contacter",
      termsH8: "8. Nous contacter",
    },
  },
  de: {
    footer: { community: "Community & Social" },
    common: { details: "Mehr Details", live: "Live-Status" },
    support: { title: "Hilfe & Support" },
    download: {
      ctaHint: "Version {v} · Android 8+ · arm64 · {size}",
      version: "App-Version {v}",
    },
  },
};
