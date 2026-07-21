import { FAQ } from "../components/FAQ";

export function FAQPage() {
  return (
    <>
      <FAQ />
      <section className="pb-20">
        <div className="page-wrap">
          <div className="orca-card p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white">Get in touch</h2>
            <p className="mt-2 text-[#9ca3af]">Partnerships, listings, and inquiries.</p>
            <a href="mailto:contact@acopay.net" className="btn-orca-secondary mt-6">
              contact@acopay.net
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
