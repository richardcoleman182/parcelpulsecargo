import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-teal-800 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-200">Data care</p>
            <h1 className="mt-4 text-5xl font-black">Privacy Policy</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-teal-50">
              We handle shipment data with the same discipline expected in courier operations: only what is needed, clearly used, and protected for service delivery.
            </p>
          </div>
        </section>
        <section className="mx-auto grid max-w-5xl gap-5 px-4 py-16 sm:px-6 lg:px-8">
          {[
            ["Information we collect", "Sender and receiver names, email addresses, phone numbers, delivery addresses, parcel descriptions, service choices, tracking updates, contact-form messages, and operational notes needed to move or support a shipment."],
            ["How we use it", "We use this information to create tracking numbers, generate shipment PDFs, contact senders and receivers, update delivery progress, respond to support enquiries, and comply with logistics, customs, immigration, airline, security, and legal requirements."],
            ["Sharing and service providers", "Shipment information may be shared with carriers, cargo handlers, warehouse partners, airport processors, customs or regulatory authorities, delivery partners, email providers, database providers, and hosting services when needed to complete the service."],
            ["Retention", "Records may be retained for operational history, customer support, accounting, fraud prevention, legal compliance, and dispute handling. We keep records only for as long as reasonably necessary."],
            ["Your choices", "You may request correction of inaccurate shipment details or ask privacy questions. Some information may need to remain in shipment records where required for legal, security, or operational reasons."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 leading-8 text-slate-700">{text}</p>
            </article>
          ))}
          <article className="rounded-lg bg-slate-950 p-6 text-white">
            <h2 className="text-xl font-bold">Privacy contact</h2>
            <p className="mt-3 leading-8 text-slate-300">
              For privacy enquiries or data correction requests, email{" "}
              <a className="font-semibold text-orange-300 underline" href="mailto:support@parcelpulsecargo.com">
                support@parcelpulsecargo.com
              </a>
              .
            </p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
