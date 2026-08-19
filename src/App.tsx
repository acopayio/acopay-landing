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
import { PayConnectPage } from "./pages/PayApp/PayConnectPage";
import { PayAppApprovePage } from "./pages/PayApp/PayAppApprovePage";
import { DownloadPage } from "./pages/DownloadPage";
import { LegalPage } from "./pages/LegalPage";
import { SupportPage } from "./pages/SupportPage";
import { SupportLayout } from "./layouts/SupportLayout";
import { isBuyPublic, isWebPayPublic } from "./config/siteSurface";

function Hidden() {
  return <Navigate to="/" replace />;
}

export default function App() {
  const buyOn = isBuyPublic();
  const payOn = isWebPayPublic();

  return (
    <BrowserRouter>
      <SeoManager />
      <Routes>
        <Route element={<SupportLayout />}>
          <Route path="support" element={<SupportPage />} />
        </Route>
        <Route element={<OrcaLayout />}>
          <Route index element={<HomePage />} />
          <Route path="buy" element={buyOn ? <BuyPage /> : <Hidden />} />
          <Route path="pay" element={payOn ? <PayAppPage /> : <Hidden />} />
          <Route path="pay/connect" element={payOn ? <PayConnectPage /> : <Hidden />} />
          <Route path="pay/app-approve" element={payOn ? <PayAppApprovePage /> : <Hidden />} />
          <Route path="trade" element={<Navigate to={payOn ? "/pay" : "/"} replace />} />
          <Route path="link-wallet" element={payOn ? <LinkWalletPage /> : <Hidden />} />
          <Route path="send" element={payOn ? <SendAcopayPage /> : <Hidden />} />
          <Route path="token" element={<TokenPage />} />
          <Route path="markets" element={<PoolsPage />} />
          <Route path="pools" element={<Navigate to="/markets" replace />} />
          <Route path="contract" element={<ContractPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="faq" element={<FAQPage />} />
          {/* /download/android is a Pages Function serving the APK, not a route. */}
          <Route path="download" element={<DownloadPage />} />
          {/* Store / Play required public URLs */}
          <Route path="privacy" element={<LegalPage kind="privacy" />} />
          <Route path="terms" element={<LegalPage kind="terms" />} />
          <Route path="delete-account" element={<LegalPage kind="delete-account" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
