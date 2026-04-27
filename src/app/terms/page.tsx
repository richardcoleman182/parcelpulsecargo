import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Service rules</p>
            <h1 className="mt-4 text-5xl font-black">Terms and Conditions</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              These terms describe the practical conditions that apply when Parcel Pulse Cargo supports courier, cargo, and delivery services.
            </p>
          </div>
        </section>
        <section className="mx-auto grid max-w-5xl gap-5 px-4 py-16 sm:px-6 lg:px-8">
          {[
            ["Accurate shipment details", "Customers must provide complete and truthful sender, receiver, address, item description, value, weight, and document information. Incorrect information can cause delay, refusal, return, extra fees, or regulatory action."],
            ["Lawful and acceptable goods", "All shipments must comply with origin, transit, and destination laws, carrier rules, airline requirements, customs rules, immigration checks, and safety standards. Prohibited, dangerous, restricted, or undeclared goods may be refused or held."],
            ["Delivery estimates", "Estimated delivery times are guidance only. Timelines may change due to weather, flight availability, customs, immigration, security checks, airport congestion, carrier handover, incomplete documents, incorrect addresses, recipient unavailability, or destination handling."],
            ["Tracking updates", "Tracking records are operational updates entered as shipment information becomes available. A current location or status may change as cargo moves through hubs, airports, customs, warehouses, and delivery partners."],
            ["Charges and additional costs", "Additional charges may apply for customs duties, taxes, storage, redelivery, address correction, remote delivery, special handling, oversized cargo, insurance, return, or regulatory processing."],
            ["Claims and support", "Customers should contact support promptly with tracking number and full shipment details for delivery questions, delay enquiries, or correction requests."],
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
