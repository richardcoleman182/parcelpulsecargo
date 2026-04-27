import { BadgeCheck, Globe2, Handshake, MapPinned, Plane, ShieldCheck, type LucideIcon } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const promises: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "Transparent tracking", text: "Movement updates that explain the current status, not just a vague label.", Icon: MapPinned },
  { title: "Route coordination", text: "Practical support across courier, air cargo, freight, and destination delivery.", Icon: Plane },
  { title: "Trustworthy records", text: "PDF shipment summaries and consistent tracking history for both parties.", Icon: BadgeCheck },
];

const principles: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "Customer-first communication", text: "Sender and receiver both need reliable information. Our tools are shaped around that shared visibility.", Icon: Handshake },
  { title: "Global delivery mindset", text: "We support worldwide movement while respecting local rules, documentation requirements, and destination realities.", Icon: Globe2 },
  { title: "Careful handling", text: "From documents to commercial goods, we keep records structured so each shipment can be followed responsibly.", Icon: ShieldCheck },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section
          className="bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,.94), rgba(15,23,42,.68)), url('https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1800&q=84')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">About us</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight sm:text-6xl">A UK courier partner built for accountable global movement.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">
              Parcel Pulse Cargo supports individuals, families, retailers, exporters, importers, and businesses that need clear communication while parcels and cargo move across borders.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Our operating promise</p>
            <h2 className="mt-4 text-4xl font-black text-slate-950">More than moving boxes. We move confidence.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            <p>
              International delivery can involve collections, warehouses, airports, airline cargo teams, customs, immigration checks, destination handlers, and last-mile delivery partners. Our work is to keep that journey visible and organized.
            </p>
            <p>
              Every parcel record is designed to hold the details customers ask for most: tracking number, sender and receiver information, route, current location, status history, issues, delays, and PDF documentation.
            </p>
          </div>
        </section>

        <section className="bg-slate-100 py-18">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {promises.map(({ title, text, Icon }) => (
              <div key={title} className="rounded-lg bg-white p-6 shadow-sm">
                <Icon className="text-orange-600" size={28} />
                <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div
            className="min-h-96 rounded-lg bg-slate-200"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(15,23,42,.02), rgba(15,23,42,.32)), url('https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1400&q=84')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="grid content-center gap-5">
            {principles.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 p-5">
                <Icon className="text-teal-700" size={24} />
                <h3 className="mt-3 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
