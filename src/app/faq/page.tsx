import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const faqs = [
  ["How do I track a parcel?", "Use the tracking box on the home page or tracking page with the tracking number provided by Parcel Pulse Cargo. The record shows the latest status, current location, ETA where available, and movement history."],
  ["Do you ship internationally?", "Yes. Parcel Pulse Cargo supports international courier and cargo movement from multiple origins to destinations worldwide, including documents, parcels, commercial goods, and specialist consignments."],
  ["What happens if customs or immigration delays a shipment?", "The operations team can add a shipment update explaining the issue, current location, and next expected action. Delays may happen at airports, customs, immigration, security checks, carrier handover, or destination processing."],
  ["Will sender and receiver receive shipment information?", "Yes. When email is configured, both parties receive the tracking number and shipment PDF. Updates can also trigger notification emails so everyone sees the same parcel record."],
  ["Can I ship restricted or sensitive items?", "Every shipment must be declared accurately. Restricted, dangerous, prohibited, or controlled goods may require additional checks, permits, carrier approval, or may be refused."],
  ["What information should I provide before booking?", "Sender details, receiver details, pickup location, destination address, item description, weight, declared value, preferred service speed, and any documents needed for customs or delivery."],
];

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Customer help</p>
            <h1 className="mt-4 text-5xl font-black">FAQ</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Clear answers for common courier, cargo, tracking, customs, airport, and delivery questions.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5">
            {faqs.map(([question, answer]) => (
            <article key={question} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">{question}</h2>
              <p className="mt-3 leading-7 text-slate-600">{answer}</p>
            </article>
          ))}
          </div>
          <div className="mt-8 rounded-lg bg-teal-700 p-6 text-white">
            <h2 className="text-2xl font-black">Still need help?</h2>
            <p className="mt-2 leading-7 text-teal-50">Email our support team with your tracking number, sender name, receiver name, and destination.</p>
            <a className="mt-5 inline-flex rounded-md bg-white px-5 py-3 font-bold text-teal-800" href="mailto:support@parcelpulsecargo.com">
              support@parcelpulsecargo.com
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
