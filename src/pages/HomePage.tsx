import { About } from "../components/About";
import { Hero } from "../components/Hero";
import { LaunchStatus } from "../components/LaunchStatus";
import { Roadmap } from "../components/Roadmap";
import { isMintLive } from "../config/token";
import { BinanceMarketsTable } from "../components/pools/BinanceMarketsTable";

export function HomePage() {
  const live = isMintLive();

  return (
    <>
      <Hero />
      {live ? <BinanceMarketsTable variant="home" /> : <LaunchStatus />}
      <About />
      <Roadmap />
    </>
  );
}
