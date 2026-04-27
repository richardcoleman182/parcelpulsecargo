import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, Clock3, FileText, Plane, Radar, Ship, Truck, Warehouse, type LucideIcon } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const services: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "International parcel delivery", text: "Door-to-door shipment support for personal and business parcels.", Icon: Boxes },
  { title: "Express document courier", text: "Priority movement for documents, certificates, contracts, and records.", Icon: FileText },
  { title: "Air cargo coordination", text: "Airport routing, handover updates, customs notes, and onward delivery.", Icon: Plane },
  { title: "Commercial goods movement", text: "Structured handling for retail, wholesale, and business consignments.", Icon: Warehouse },
  { title: "Sea and freight support", text: "Route planning for heavier cargo where timeline and cost need balance.", Icon: Ship },
  { title: "Last-mile delivery", text: "Destination delivery support with recipient visibility and proof-ready records.", Icon: Truck },
];

const deliveryModes: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "Express", text: "Urgent documents and parcels with priority handling and fast movement updates.", Icon: Clock3 },
  { title: "Tracked Cargo", text: "Operational visibility for heavier parcels, commercial goods, and cargo handovers.", Icon: Radar },
  { title: "Door Delivery", text: "Sender-to-receiver support through collection, routing, and final delivery.", Icon: Truck },
];

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section
          className="bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,.94), rgba(15,23,42,.62)), url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=84')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Services</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight sm:text-6xl">Courier and cargo services for international movement.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">
              Choose the delivery support your shipment needs: fast document courier, parcel delivery, air cargo coordination, commercial goods handling, freight support, and destination delivery updates.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">What we move</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black text-slate-950">Shipment options for real delivery needs.</h2>
            </div>
            <Link href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-600 px-5 font-bold text-white hover:bg-orange-700">
              Request support <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <Icon className="text-orange-600" size={28} />
                <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {deliveryModes.map(({ title, text, Icon }) => (
              <div key={title} className="rounded-lg bg-white p-7 shadow-sm">
                <Icon className="text-teal-700" size={30} />
                <h3 className="mt-5 text-2xl font-black text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8">
          <div
            className="min-h-96 rounded-lg bg-slate-200"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(15,23,42,.08), rgba(15,23,42,.42)), url('https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1400&q=84')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="grid content-center gap-5">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">Service discipline</p>
            <h2 className="text-4xl font-black text-slate-950">Every service includes structured shipment control.</h2>
            <div className="grid gap-3">
              {["Tracking number creation", "Sender and receiver notification", "PDF shipment record", "Airport, customs, immigration, and delivery issue updates"].map((item) => (
                <p key={item} className="flex items-center gap-3 rounded-md border border-slate-200 p-3 font-semibold text-slate-700">
                  <BadgeCheck className="text-teal-700" size={20} /> {item}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
