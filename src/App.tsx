import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { OrcaLayout } from "./layouts/OrcaLayout";
import { ContractPage } from "./pages/ContractPage";
import { FAQPage } from "./pages/FAQPage";
import { HomePage } from "./pages/HomePage";
import { PoolsPage } from "./pages/PoolsPage";
import { TokenPage } from "./pages/TokenPage";
import { TradePage } from "./pages/TradePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<OrcaLayout />}>
          <Route index element={<HomePage />} />
          <Route path="token" element={<TokenPage />} />
          <Route path="pools" element={<PoolsPage />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="contract" element={<ContractPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
