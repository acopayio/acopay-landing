import { About } from "../components/About";
import { Hero } from "../components/Hero";
import { Roadmap } from "../components/Roadmap";

export function HomePage() {
  return (
    <>
      <Hero />
      {/* Markets/TVL hidden — ACOPAY is payment-first, not a high-liquidity DEX product. */}
      <About />
      <Roadmap />
    </>
  );
}
