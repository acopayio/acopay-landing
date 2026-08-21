import { About } from "../components/About";
import { Hero } from "../components/Hero";
import { LaunchStatus } from "../components/LaunchStatus";
import { Roadmap } from "../components/Roadmap";
import { WalletHero } from "../components/WalletHero";
import { isMintLive } from "../config/token";
import { isWalletProfile } from "../config/siteIdentity";
import { MarketsHub } from "../components/pools/MarketsHub";

export function HomePage() {
  if (isWalletProfile()) {
    return <WalletHero />;
  }

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
