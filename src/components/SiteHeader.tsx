import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/services", label: "Services" },
  { href: "/tracking", label: "Tracking" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt="Parcel Pulse Cargo logo"
            width={48}
            height={48}
            priority
            className="h-12 w-12 rounded-md object-contain"
          />
          <span>
            <span className="block text-base font-bold tracking-[0.08em] text-slate-950">PARCEL PULSE</span>
            <span className="block text-xs font-semibold tracking-[0.22em] text-orange-600">CARGO</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-teal-700">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/tracking" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800">
          Track
        </Link>
      </div>
    </header>
  );
}
