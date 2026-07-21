const FAQS = [
  {
    q: "What is ACOPAY?",
    a: "A payment utility token on Solana Mainnet for fast wallet-to-wallet transfers. Tagline: Pay your way.",
  },
  {
    q: "What is the official website?",
    a: "acopay.net only. Always verify the mint address on this site before buying or receiving tokens.",
  },
  {
    q: "How do I verify the contract?",
    a: "Open Contract on acopay.net, copy the mint, and paste it into Solana Explorer or Solscan. Confirm name, logo, and supply match. Do not trust lookalike sites.",
  },
  {
    q: "How do I buy ACOPAY?",
    a: "After mainnet launch, swap USDT → ACOPAY on Jupiter or Raydium with your wallet. There is no OTC sale — never send USDT to a private wallet expecting tokens. Until launch, Buy stays disabled.",
  },
  {
    q: "Can I send ACOPAY wallet-to-wallet?",
    a: "Yes. Once the token exists, peer-to-peer transfers for payments are fine. That is separate from DEX volume, which only comes from swaps through a liquidity pool.",
  },
  {
    q: "Which network and standard?",
    a: "Solana Mainnet. Token-2022 SPL, 9 decimals, supply 100,000,000 ACOPAY.",
  },
  {
    q: "What are the transfer fees?",
    a: "On-chain Token-2022 fee is 0.01% (1 basis point), paid by the sender. Minimum transfer 0.1 ACOPAY. First time a wallet receives ACOPAY, 1 ACOPAY may be charged as an account-open fee (via ACOPAY apps). SOL gas is paid by the sending wallet.",
  },
  {
    q: "Can my wallet be frozen?",
    a: "No. Freeze authority is revoked.",
  },
  {
    q: "Is ACOPAY Jupiter Verified yet?",
    a: "Verification is submitted after mainnet mint, metadata, and the ACOPAY/USDT pool are live. Until then, always use the mint published on acopay.net.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">FAQ</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Common questions</h2>
        <p className="mt-3 max-w-xl text-[#8b9cb8]">
          Short answers. For the mint address, use the Contract page.
        </p>

        <div className="mt-10 space-y-2">
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              className="orca-card group overflow-hidden !rounded-2xl open:ring-1 open:ring-[#2ed3b7]/20"
              open={i === 0}
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-[#2ed3b7] transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="border-t border-white/[0.06] px-5 py-4 text-sm leading-relaxed text-[#8b9cb8]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
