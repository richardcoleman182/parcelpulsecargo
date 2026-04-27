import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-bold">Parcel Pulse Cargo</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            UK based international courier and cargo movement for documents, parcels, commercial goods, and specialist shipments.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-300">
            <a className="flex items-center gap-3 transition hover:text-orange-300" href="mailto:support@parcelpulsecargo.com">
              <Mail size={16} /> support@parcelpulsecargo.com
            </a>
            <a className="flex items-center gap-3 transition hover:text-orange-300" href="tel:+447828243421">
              <Phone size={16} /> +44 7828 243421
            </a>
            <span className="flex items-center gap-3"><MapPin size={16} /> London, United Kingdom</span>
          </div>
        </div>

        <div>
          <p className="font-semibold">Company</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <Link href="/about">About us</Link>
            <Link href="/services">Services</Link>
            <Link href="/tracking">Track parcel</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold">Legal</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms and conditions</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Parcel Pulse Cargo. All rights reserved.
      </div>
    </footer>
  );
}
