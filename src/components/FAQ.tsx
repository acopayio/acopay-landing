import { TOKEN } from "../config/token";

const FAQS = [
  {
    q: "What is ACOPAY?",
    a: "A Solana payment utility token (Token-2022) for wallet-to-wallet transfers. Tagline: Pay your way.",
  },
  {
    q: "Where is the contract address?",
    a: "On this site — Contract page and homepage. Confirm the same address on Solscan or Solana Explorer.",
  },
  {
    q: "How do I buy?",
    a: "When the Raydium ACOPAY/USDT pool is live, swap USDT → ACOPAY on Jupiter or Raydium with your wallet.",
  },
  {
    q: "Can I transfer ACOPAY peer-to-peer?",
    a: "Yes. Transfers are for payments. Market price discovery comes from the liquidity pool once it exists.",
  },
  {
    q: "Network and supply?",
    a: `Solana Mainnet. ${TOKEN.tokenStandard}, ${TOKEN.decimals} decimals, supply ${TOKEN.totalSupply} ACOPAY.`,
  },
  {
    q: "What are the fees?",
    a: "On-chain transfer fee is 0.01% (1 bps), paid by the sender. SOL gas is paid by the sending wallet.",
  },
  {
    q: "Can wallets be frozen?",
    a: "No. Freeze is revoked — wallets cannot be frozen.",
  },
  {
    q: "Jupiter verification?",
    a: "Will be submitted after the Raydium pool is live. Until then, use the address on this site.",
  },
  {
    q: "Contact?",
    a: `Email ${TOKEN.email}.`,
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-pad">
      <div className="page-wrap">
        <p className="label-orca">FAQ</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">FAQ</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">Product and contract facts.</p>

        <div className="mt-10 space-y-2">
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              className="orca-card group overflow-hidden !rounded-2xl open:ring-1 open:ring-[#00E5FF]/20"
              open={i === 0}
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-[#00E5FF] transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="border-t border-white/[0.06] px-5 py-4 text-sm leading-relaxed text-[#9ca3af]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
