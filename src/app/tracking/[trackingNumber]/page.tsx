import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackingStatusView } from "@/components/TrackingStatusView";
import { findParcel } from "@/lib/parcels";
import { toPublicParcel } from "@/lib/publicParcel";

export default async function TrackingDetailPage({ params }: { params: Promise<{ trackingNumber: string }> }) {
  const { trackingNumber } = await params;
  const parcel = await findParcel(trackingNumber);

  if (!parcel) {
    return (
      <>
        <SiteHeader />
        <main className="bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[24px] border border-orange-200 bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-100 text-orange-600">
              <AlertCircle size={28} />
            </div>
            <h1 className="mt-6 text-4xl font-black text-slate-950">Tracking number not found</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We could not match <span className="font-bold text-slate-950">{trackingNumber}</span> to an active Parcel Pulse Cargo shipment.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/tracking" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-6 font-bold text-white hover:bg-teal-800">
                <ArrowLeft size={18} /> Try another tracking number
              </Link>
              <a href="tel:+447828243421" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 px-6 font-bold text-slate-800 hover:bg-slate-50">
                Call +44 7828 243421
              </a>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <TrackingStatusView parcel={toPublicParcel(parcel)} />
      <SiteFooter />
    </>
  );
}
