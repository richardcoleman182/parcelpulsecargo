import { BellRing, Clock3, FileCheck2, MapPinned, type LucideIcon } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackingLookup } from "@/components/TrackingLookup";

const trackingFeatures: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "Current location", text: "See the latest hub, airport, city, or destination update.", Icon: MapPinned },
  { title: "Movement history", text: "Review pickup, sorting, transit, customs, and delivery notes.", Icon: Clock3 },
  { title: "PDF record", text: "Shipment records can be generated for sender and receiver.", Icon: FileCheck2 },
  { title: "Issue alerts", text: "Airport, immigration, customs, or delivery issues can be explained clearly.", Icon: BellRing },
];

export default function TrackingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section
          className="bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,.94), rgba(15,23,42,.68)), url('https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=1800&q=84')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Track shipment</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight sm:text-6xl">Find the latest parcel movement.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
              Enter your Parcel Pulse Cargo tracking number to see the latest status, live location, and full movement history.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-200">Need help fast? Call +44 7828 243421.</p>
            <div className="mt-10 max-w-3xl">
              <TrackingLookup />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {trackingFeatures.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <Icon className="text-teal-700" size={26} />
                <h2 className="mt-4 font-bold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Tracking guidance</p>
              <h2 className="mt-4 text-4xl font-black text-slate-950">What your tracking record can tell you.</h2>
            </div>
            <div className="grid gap-4">
              {[
                ["Shipment created", "Your parcel has been registered and the tracking number is active."],
                ["In transit", "The shipment is moving through courier, warehouse, airline, or cargo handling points."],
                ["Held for checks", "A customs, immigration, security, documentation, or airport process needs attention or time."],
                ["Out for delivery", "The shipment has reached the destination delivery stage and is moving to the receiver."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
