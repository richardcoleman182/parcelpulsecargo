import { Clock3, Mail, MapPin, MessageSquareText, Plane, type LucideIcon } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const contactReasons: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "New shipment", text: "Ask about collection, route options, service speed, and documentation.", Icon: Plane },
  { title: "Tracking help", text: "Send a tracking number and we will review the current parcel record.", Icon: MessageSquareText },
  { title: "Delivery issue", text: "Report address updates, receiver availability, customs notes, or delivery concerns.", Icon: MapPin },
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section
          className="bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,.94), rgba(15,23,42,.68)), url('https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1800&q=84')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Contact us</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight sm:text-6xl">Speak with our shipment team.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
              Send us pickup, delivery, tracking, customs, or cargo questions. The contact form reports directly to the support email configured for Parcel Pulse Cargo.
            </p>
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Support desk</p>
            <h2 className="mt-4 text-4xl font-black text-slate-950">Tell us what is moving and where it needs to go.</h2>
            <p className="mt-5 leading-8 text-slate-700">
              For the fastest response, include the tracking number if you have one, sender name, receiver name, origin, destination, item description, and the exact question or issue.
            </p>
            <div className="mt-8 grid gap-4 text-slate-700">
              <a className="flex items-center gap-3 font-semibold text-teal-800 transition hover:text-orange-600" href="mailto:support@parcelpulsecargo.com">
                <Mail size={18} /> support@parcelpulsecargo.com
              </a>
              <a className="flex items-center gap-3 font-semibold text-teal-800 transition hover:text-orange-600" href="tel:+447828243421">
                <Clock3 size={18} /> +44 7828 243421
              </a>
              <p className="flex items-center gap-3"><MapPin size={18} /> London, United Kingdom</p>
              <p className="flex items-center gap-3"><Clock3 size={18} /> Operations support for active shipments</p>
            </div>
          </div>
          <ContactForm />
          </div>
        </section>

        <section className="bg-white py-18">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {contactReasons.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 p-6 shadow-sm">
                <Icon className="text-orange-600" size={28} />
                <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
