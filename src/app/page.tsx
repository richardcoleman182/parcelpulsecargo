import Link from "next/link";
import { ArrowRight, Boxes, CheckCircle2, FileCheck2, Globe2, MapPinned, Plane, Radar, ShieldCheck, Truck, Warehouse, type LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TrackingLookup } from "@/components/TrackingLookup";

export default function Home() {
  const highlights: { title: string; text: string; Icon: LucideIcon }[] = [
    { title: "Worldwide movement", text: "Cross-border courier and air cargo handling.", Icon: Globe2 },
    { title: "Express lanes", text: "Fast routing for urgent documents and parcels.", Icon: Plane },
    { title: "Door to door", text: "Collection, customs guidance, and final delivery.", Icon: Truck },
    { title: "Secure updates", text: "Admin-controlled status history for every parcel.", Icon: ShieldCheck },
  ];
  const movementPhotos = [
    {
      title: "Airport cargo handling",
      text: "Operational notes for airline handover, export checks, customs, and immigration holds.",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=82",
    },
    {
      title: "Last-mile delivery",
      text: "Receiver-focused visibility through destination hubs and final delivery attempts.",
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=82",
    },
    {
      title: "Warehouse processing",
      text: "Parcel intake, sorting, documentation, and readiness for onward movement.",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=82",
    },
  ];
  const processSteps: { title: string; text: string; Icon: LucideIcon }[] = [
    { title: "Booking created", text: "Sender and receiver details are recorded, with a PDF shipment summary.", Icon: FileCheck2 },
    { title: "Collected and sorted", text: "Packages are prepared for courier movement, hub intake, or cargo handover.", Icon: Boxes },
    { title: "Hub and airport updates", text: "Admin can add precise location, delay, customs, or immigration notes.", Icon: Warehouse },
    { title: "Delivered with history", text: "The public tracking page keeps the latest status and movement timeline visible.", Icon: MapPinned },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        <section
          className="relative min-h-[760px] overflow-hidden bg-slate-950 text-white"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,.92), rgba(15,23,42,.72), rgba(15,23,42,.34)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2200&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-300">UK based global courier</p>
              <h1 className="mt-5 text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                Parcel Pulse Cargo
              </h1>
              <div className="mt-8 max-w-3xl">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white">
                  <Radar size={18} /> Live shipment tracking
                </div>
                <TrackingLookup />
              </div>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
                International parcel, document, and cargo delivery from major trade lanes to anywhere your shipment needs to go, with clear tracking updates from pickup to final delivery.
              </p>
              <div className="mt-7 grid max-w-2xl gap-3 text-sm font-semibold text-slate-100 sm:grid-cols-3">
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-orange-300" /> Air cargo updates</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-orange-300" /> PDF shipment record</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-orange-300" /> Sender and receiver alerts</span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/services" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-600 px-6 font-bold text-white hover:bg-orange-700">
                  Explore services <ArrowRight size={18} />
                </Link>
                <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md border border-white/35 px-6 font-bold text-white hover:bg-white/10">
                  Request shipment support
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {highlights.map(({ title, text, Icon }) => (
              <div key={title} className="rounded-lg border border-slate-200 p-5">
                <Icon className="text-teal-700" size={24} />
                <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Built for real shipments</p>
              <h2 className="mt-4 text-4xl font-black text-slate-950">Cargo visibility from pickup to delivery.</h2>
            </div>
            <div className="grid gap-5 text-slate-700">
              <p className="leading-8">
                Parcel Pulse Cargo gives senders and receivers a clear tracking number, PDF shipment record, and timely movement updates across origin hubs, airports, customs, immigration, and last-mile delivery.
              </p>
              <p className="leading-8">
                Our admin dashboard is designed for operational control: create parcel records, update issues, add current locations, and keep both parties informed.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">Shipment movement</p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black text-slate-950">A professional courier flow for real-world cargo conditions.</h2>
              </div>
              <Link href="/tracking" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-5 font-bold text-white hover:bg-teal-800">
                Track now <Radar size={18} />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {movementPhotos.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div
                    className="h-64 bg-slate-200"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(15,23,42,.05), rgba(15,23,42,.4)), url('${item.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">How we keep clients informed</p>
              <h2 className="mt-4 text-4xl font-black">One tracking number, complete movement context.</h2>
              <p className="mt-5 leading-8 text-slate-300">
                Customers do not just need a status label. They need to know where the shipment is, what happened, what comes next, and whether airport, customs, immigration, or carrier checks are affecting delivery.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {processSteps.map(({ title, text, Icon }) => (
                <div key={title} className="rounded-lg border border-white/10 bg-white/6 p-5">
                  <Icon className="text-orange-300" size={26} />
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-teal-800 py-20 text-white"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(19,78,74,.94), rgba(19,78,74,.72)), url('https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1800&q=82')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-3xl text-4xl font-black">Need to send documents, parcels, commercial cargo, or specialist goods?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-teal-50">
              Tell us what is moving, where it is coming from, and where it needs to arrive. Our team will guide the next step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-orange-600 px-6 font-bold text-white hover:bg-orange-700">
                Contact support
              </Link>
              <a href="mailto:support@parcelpulsecargo.com" className="inline-flex h-12 items-center justify-center rounded-md border border-white/40 px-6 font-bold text-white hover:bg-white/10">
                Email support@parcelpulsecargo.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
