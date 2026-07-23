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
import { TradePage } from "./pages/TradePage";

export default function App() {
  return (
    <BrowserRouter>
      <SeoManager />
      <Routes>
        <Route element={<OrcaLayout />}>
          <Route index element={<HomePage />} />
          <Route path="buy" element={<BuyPage />} />
          <Route path="token" element={<TokenPage />} />
          <Route path="markets" element={<PoolsPage />} />
          <Route path="pools" element={<Navigate to="/markets" replace />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="contract" element={<ContractPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
