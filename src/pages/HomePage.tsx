import { About } from "../components/About";
import { Hero } from "../components/Hero";
import { LaunchStatus } from "../components/LaunchStatus";
import { Roadmap } from "../components/Roadmap";
import { isMintLive } from "../config/token";
import { LiquidityPoolsWidget } from "../components/pools/LiquidityPoolsWidget";

export function HomePage() {
  const live = isMintLive();

  return (
    <>
      <Hero />
      {/* Pre-launch: only real ACOPAY facts. Live Raydium TVL is not ACOPAY — keep it on /pools. */}
      {live ? <LiquidityPoolsWidget variant="home" /> : <LaunchStatus />}
      <About />
      <Roadmap />
    </>
  );
}
