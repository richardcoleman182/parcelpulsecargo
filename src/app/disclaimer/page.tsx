import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function DisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-orange-600 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">Important notice</p>
            <h1 className="mt-4 text-5xl font-black">Disclaimer</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-orange-50">
              Courier and cargo movement depends on many third-party and regulatory steps. This page explains how website information should be understood.
            </p>
          </div>
        </section>
        <section className="mx-auto grid max-w-5xl gap-5 px-4 py-16 sm:px-6 lg:px-8">
          {[
            ["Tracking information", "Tracking updates reflect operational information available at the time of entry. They may not represent every physical scan, handover, or internal carrier event."],
            ["External processing", "Airports, customs, immigration, security agencies, carriers, cargo handlers, warehouse partners, destination agents, and last-mile delivery providers can affect shipment movement and delivery timing."],
            ["Delivery estimates", "Any estimated delivery date or service timeline is not a guarantee. Delays can occur due to documentation checks, incomplete information, weather, strikes, inspections, airline capacity, routing changes, or recipient availability."],
            ["General information", "Website content is provided for general information and service support. It does not replace formal shipment contracts, customs documentation, insurance terms, carrier conditions, or legal advice."],
            ["Customer responsibility", "Customers remain responsible for accurate declarations, lawful goods, correct addresses, required permits, customs documents, duties, taxes, and destination-country compliance."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 leading-8 text-slate-700">{text}</p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
