import { TOKEN } from "../config/token";

const FAQS = [
  {
    q: "What is ACOPAY?",
    a: "A Solana Mainnet payment utility token (Token-2022) for wallet-to-wallet transfers. Tagline: Pay your way. Official site: acopay.net.",
  },
  {
    q: "What is the only official website?",
    a: "https://acopay.net — always verify the mint on this domain before buying or receiving tokens. Ignore lookalike sites and unsolicited DMs.",
  },
  {
    q: "How do I verify the contract?",
    a: "Open Contract on acopay.net, copy the mint when published, and paste it into Solana Explorer or Solscan. Confirm name, logo, supply, Token-2022, and freeze revoked.",
  },
  {
    q: "How do I buy ACOPAY?",
    a: "After mainnet mint and the ACOPAY/USDT pool are live, swap USDT → ACOPAY on Jupiter or Raydium with your own wallet. There is no OTC sale. Until then, Buy stays disabled.",
  },
  {
    q: "Can I send ACOPAY peer-to-peer?",
    a: "Yes, once the token exists. P2P transfers are for payments. DEX volume and organic trading metrics only come from swaps through a liquidity pool.",
  },
  {
    q: "Which network and supply?",
    a: `Solana Mainnet. ${TOKEN.tokenStandard}, ${TOKEN.decimals} decimals, total supply ${TOKEN.totalSupply} ACOPAY.`,
  },
  {
    q: "What are the fees?",
    a: "On-chain transfer fee is 0.01% (1 basis point), paid by the sender. Minimum transfer rules and first-account open fees may apply in ACOPAY apps. SOL gas is paid by the sending wallet.",
  },
  {
    q: "Can my wallet be frozen?",
    a: "No. Freeze authority is revoked by design.",
  },
  {
    q: "Is ACOPAY Jupiter Verified?",
    a: "Verification is submitted after the mainnet mint, metadata, and Raydium pool are live (Jupiter Standard is free). Until then, use only the mint published on acopay.net — we do not claim verified status before approval.",
  },
  {
    q: "How can I contact the project?",
    a: `Email ${TOKEN.email}. Do not send funds to addresses received only via chat or social DMs.`,
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-orca">FAQ</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Common questions</h2>
        <p className="mt-3 max-w-xl text-[#9ca3af]">
          Straight answers for users and listing reviewers. Mint details live on the Contract page.
        </p>

        <div className="mt-10 space-y-2">
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              className="orca-card group overflow-hidden !rounded-2xl open:ring-1 open:ring-[#c7f284]/20"
              open={i === 0}
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-[#c7f284] transition group-open:rotate-45">+</span>
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
