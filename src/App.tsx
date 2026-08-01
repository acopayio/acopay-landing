import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SeoManager } from "./components/SeoManager";
import { OrcaLayout } from "./layouts/OrcaLayout";
import { ContractPage } from "./pages/ContractPage";
import { FAQPage } from "./pages/FAQPage";
import { HomePage } from "./pages/HomePage";
import { PoolsPage } from "./pages/PoolsPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { TokenPage } from "./pages/TokenPage";
import { BuyPage } from "./pages/BuyPage";
import { LinkWalletPage } from "./pages/LinkWalletPage";
import { SendAcopayPage } from "./pages/SendAcopayPage";
import { PayAppPage } from "./pages/PayApp/PayAppPage";
import { DownloadPage } from "./pages/DownloadPage";

export default function App() {
  return (
    <BrowserRouter>
      <SeoManager />
      <Routes>
        <Route element={<OrcaLayout />}>
          <Route index element={<HomePage />} />
          <Route path="buy" element={<BuyPage />} />
          <Route path="pay" element={<PayAppPage />} />
          <Route path="trade" element={<Navigate to="/pay" replace />} />
          <Route path="link-wallet" element={<LinkWalletPage />} />
          <Route path="send" element={<SendAcopayPage />} />
          <Route path="token" element={<TokenPage />} />
          <Route path="markets" element={<PoolsPage />} />
          <Route path="pools" element={<Navigate to="/markets" replace />} />
          <Route path="contract" element={<ContractPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="faq" element={<FAQPage />} />
          {/* /download/android is a Pages Function serving the APK, not a route. */}
          <Route path="download" element={<DownloadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
