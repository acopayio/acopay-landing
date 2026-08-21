import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SeoManager } from "./components/SeoManager";
import { CrossHostRedirect } from "./components/CrossHostRedirect";
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
import {
  COIN_ORIGIN,
  WALLET_ORIGIN,
  isCoinHost,
  isWalletHost,
} from "./config/siteIdentity";

function Hidden() {
  return <Navigate to="/" replace />;
}

/** On .net, coin pages go to the coin host (same path). */
function CoinPage({ children }: { children: ReactNode }) {
  if (typeof window !== "undefined" && isWalletHost(window.location.hostname)) {
    return <CrossHostRedirect origin={COIN_ORIGIN} />;
  }
  return <>{children}</>;
}

/** FAQ and similar: not on wallet chrome — stay on home. */
function WalletHide({ children }: { children: ReactNode }) {
  if (typeof window !== "undefined" && isWalletHost(window.location.hostname)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

/** On .org, download goes to acopay.net (APK + store listing). */
function WalletDownloadPage() {
  if (typeof window !== "undefined" && isCoinHost(window.location.hostname)) {
    return <CrossHostRedirect origin={WALLET_ORIGIN} path="/download" />;
  }
  return <DownloadPage />;
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
          <Route
            path="buy"
            element={
              <CoinPage>{buyOn ? <BuyPage /> : <Hidden />}</CoinPage>
            }
          />
          <Route path="pay" element={payOn ? <PayAppPage /> : <Hidden />} />
          <Route path="pay/connect" element={payOn ? <PayConnectPage /> : <Hidden />} />
          <Route path="pay/app-approve" element={payOn ? <PayAppApprovePage /> : <Hidden />} />
          <Route path="trade" element={<Navigate to={payOn ? "/pay" : "/"} replace />} />
          <Route path="link-wallet" element={payOn ? <LinkWalletPage /> : <Hidden />} />
          <Route path="send" element={payOn ? <SendAcopayPage /> : <Hidden />} />
          <Route path="token" element={<CoinPage><TokenPage /></CoinPage>} />
          <Route path="markets" element={<CoinPage><PoolsPage /></CoinPage>} />
          <Route
            path="pools"
            element={
              <CoinPage>
                <Navigate to="/markets" replace />
              </CoinPage>
            }
          />
          <Route path="contract" element={<CoinPage><ContractPage /></CoinPage>} />
          <Route path="roadmap" element={<CoinPage><RoadmapPage /></CoinPage>} />
          <Route path="faq" element={<WalletHide><FAQPage /></WalletHide>} />
          <Route path="download" element={<WalletDownloadPage />} />
          <Route path="privacy" element={<LegalPage kind="privacy" />} />
          <Route path="terms" element={<LegalPage kind="terms" />} />
          <Route path="delete-account" element={<LegalPage kind="delete-account" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
