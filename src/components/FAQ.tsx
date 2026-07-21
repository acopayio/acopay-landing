import { TOKEN } from "../config/token";

const FAQS = [
  {
    q: "What is ACOPAY?",
    a: "ACOPAY is a Solana payment utility token (Token-2022) for wallet-to-wallet transfers and settlement.",
  },
  {
    q: "Where is the contract address?",
    a: "On this site (Contract page and homepage). Confirm the same mint on Solscan or Solana Explorer before you trade.",
  },
  {
    q: "How do I buy?",
    a: "Swap USDT → ACOPAY on Jupiter or Raydium. Always match the contract address published on this site.",
  },
  {
    q: "Can I transfer ACOPAY peer-to-peer?",
    a: "Yes. Send ACOPAY between wallets for payments. Market price comes from the Raydium ACOPAY/USDT pool.",
  },
  {
    q: "Network and supply?",
    a: `Solana Mainnet. ${TOKEN.tokenStandard}, ${TOKEN.decimals} decimals, supply ${TOKEN.totalSupply} ACOPAY.`,
  },
  {
    q: "What are the fees?",
    a: "On-chain transfer fee is 0.01% (1 bps), paid by the sender. Network gas is paid in SOL.",
  },
  {
    q: "Can wallets be frozen?",
    a: "No. Freeze authority is revoked — wallets cannot be frozen.",
  },
  {
    q: "Where is the liquidity pool?",
    a: `Raydium CPMM pair ${TOKEN.dex.pair}. Pool ID: ${TOKEN.dex.poolId}.`,
  },
  {
    q: "Jupiter verification?",
    a: "Jupiter verification will be submitted next. Until then, use the contract address on this site.",
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
        <h2 className="text-3xl font-bold text-white sm:text-4xl">FAQ</h2>

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
