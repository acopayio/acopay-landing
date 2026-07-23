import { About } from "../components/About";
import { Hero } from "../components/Hero";
import { LaunchStatus } from "../components/LaunchStatus";
import { Roadmap } from "../components/Roadmap";
import { isMintLive } from "../config/token";
import { MarketsHub } from "../components/pools/MarketsHub";

export function HomePage() {
  const live = isMintLive();

  return (
    <>
      <Hero />
      {live ? <MarketsHub variant="home" /> : <LaunchStatus />}
      <About />
      <Roadmap />
    </>
  );
}
