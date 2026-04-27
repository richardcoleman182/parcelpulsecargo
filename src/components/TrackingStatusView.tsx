import Link from "next/link";
import { AlertTriangle, ArrowLeft, CalendarDays, CheckCircle2, Mail, MapPinned, Package, Phone, UserRound } from "lucide-react";
import type { Parcel } from "@/types/parcel";

function toneStyles(parcel: Parcel) {
  const current = parcel.currentStatus.toLowerCase();
  const latestSeverity = parcel.statuses[0]?.severity;

  if (current.includes("cancel")) return { accent: "bg-red-600", soft: "bg-red-50 text-red-700", border: "border-red-600" };
  if (current.includes("hold") || current.includes("exception") || latestSeverity === "issue") return { accent: "bg-red-600", soft: "bg-red-50 text-red-700", border: "border-red-600" };
  if (current.includes("delay") || latestSeverity === "warning") return { accent: "bg-amber-500", soft: "bg-amber-50 text-amber-700", border: "border-amber-500" };
  if (latestSeverity === "delivered" || current.includes("delivered")) return { accent: "bg-emerald-600", soft: "bg-emerald-50 text-emerald-700", border: "border-emerald-600" };
  return { accent: "bg-teal-700", soft: "bg-teal-50 text-teal-700", border: "border-teal-700" };
}

function DetailCard({ title, lines, icon }: { title: string; lines: string[]; icon: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-slate-950">
        {icon}
        <h3 className="text-lg font-black">{title}</h3>
      </div>
      <div className="mt-4 grid gap-2 text-sm leading-6 text-slate-700">
        {lines.filter(Boolean).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
}

export function TrackingStatusView({ parcel }: { parcel: Parcel }) {
  const tone = toneStyles(parcel);
  const movementSteps = [...parcel.statuses].sort((a, b) => a.date.localeCompare(b.date));
  const barWidth = movementSteps.length > 1 ? `${(Math.max(0, movementSteps.length - 1) / movementSteps.length) * 100}%` : "0%";
  const displayCurrency = parcel.currency || "GBP";

  return (
    <main>
      <section
        className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(15,23,42,.95), rgba(15,23,42,.7)), url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=86')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <Link href="/tracking" className="inline-flex items-center gap-2 text-sm font-bold text-orange-300 hover:text-orange-200">
            <ArrowLeft size={16} /> Track another shipment
          </Link>
          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Tracking result</p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">{parcel.trackingNumber}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-100">
                Active shipment from {parcel.origin} to {parcel.destination}.
              </p>
            </div>
            <div className={`rounded-full px-5 py-3 text-sm font-black ${tone.soft}`}>
              {parcel.currentStatus}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_100%)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[20px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Live movement status</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{parcel.currentStatus}</h2>
                <p className="mt-2 text-sm text-slate-600">Current location: {parcel.currentLocation}</p>
              </div>
              <div className="grid gap-2 text-sm text-slate-600">
                <p><span className="font-bold text-slate-950">Service:</span> {parcel.serviceLevel || parcel.service}</p>
                <p><span className="font-bold text-slate-950">Package:</span> {parcel.itemDescription || parcel.parcelType}</p>
                <p><span className="font-bold text-slate-950">Booked:</span> {new Date(parcel.createdAt).toLocaleString("en-GB")}</p>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto pb-2">
              <div className="relative min-w-[720px]">
                {movementSteps.length > 1 ? (
                  <>
                    <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-slate-200" />
                    <div className={`absolute left-0 top-5 h-1 rounded-full ${tone.accent}`} style={{ width: barWidth }} />
                  </>
                ) : null}
                <div className="relative grid gap-4" style={{ gridTemplateColumns: `repeat(${movementSteps.length || 1}, minmax(0, 1fr))` }}>
                  {movementSteps.map((step, index) => (
                    <div key={step.id} className="min-w-0">
                      <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm ${tone.accent}`}>
                        {index === movementSteps.length - 1 ? <CheckCircle2 size={18} /> : <span className="text-xs font-black">{index + 1}</span>}
                      </div>
                      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm font-black text-slate-950">{step.title}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{step.location}</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                          {new Date(step.date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {tone.border !== "border-teal-700" ? (
              <div className={`mt-6 flex items-start gap-3 rounded-lg border p-4 ${tone.border} ${tone.soft}`}>
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm font-semibold">
                  Please review the latest movement card below for the newest operational note on this shipment.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <div className="grid gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <DetailCard
                title="Sender Details"
                icon={<UserRound size={22} className="text-teal-700" />}
                lines={[
                  parcel.sender.name,
                  parcel.sender.email,
                  parcel.sender.phone || "",
                  parcel.sender.address,
                  parcel.sender.country,
                  parcel.sender.dispatchBranch ? `Dispatch branch: ${parcel.sender.dispatchBranch}` : "",
                ]}
              />
              <DetailCard
                title="Receiver Details"
                icon={<Package size={22} className="text-orange-600" />}
                lines={[
                  parcel.receiver.name,
                  parcel.receiver.email,
                  parcel.receiver.phone || "",
                  parcel.receiver.address,
                  parcel.receiver.country,
                ]}
              />
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-black text-slate-950">Shipment Updates</h2>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Newest to oldest</p>
              </div>
              <div className="mt-6 grid gap-4">
                {parcel.statuses.map((status, index) => {
                  const severityTone =
                    status.severity === "warning"
                      ? "border-amber-300 bg-amber-50"
                      : status.severity === "issue"
                        ? "border-red-300 bg-red-50"
                        : status.severity === "delivered"
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white";

                  return (
                    <article key={status.id} className={`rounded-xl border p-5 shadow-sm ${severityTone}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-black text-slate-950">{status.title}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-600">{status.location}</p>
                        </div>
                        <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                          {new Date(status.date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <p className="mt-4 text-base leading-7 text-slate-700">{status.note}</p>
                      {status.internalNote ? (
                        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Operations note</p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">{status.internalNote}</p>
                        </div>
                      ) : null}
                      {index === 0 ? <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Latest update</p> : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <DetailCard
              title="Shipment Summary"
              icon={<MapPinned size={22} className="text-teal-700" />}
              lines={[
                `Origin: ${parcel.origin}`,
                `Destination: ${parcel.destination}`,
                `Current location: ${parcel.currentLocation}`,
                `Parcel type: ${parcel.parcelType}`,
                `Currency: ${displayCurrency}`,
                parcel.notes ? `Shipment notes: ${parcel.notes}` : "",
                parcel.weightKg ? `Weight: ${parcel.weightKg} kg` : "",
                parcel.declaredValue ? `Declared value: ${displayCurrency} ${parcel.declaredValue}` : "",
                parcel.insuranceValue ? `Insurance value: ${displayCurrency} ${parcel.insuranceValue}` : "",
              ]}
            />
            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-950">Need courier support?</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Use the shipment tracking number in your message so our operations team can check the latest movement record quickly.
              </p>
              <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700">
                <a href="mailto:support@parcelpulsecargo.com" className="inline-flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
                  <Mail size={18} className="text-orange-600" /> support@parcelpulsecargo.com
                </a>
                <a href="tel:+447828243421" className="inline-flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
                  <Phone size={18} className="text-teal-700" /> +44 7828 243421
                </a>
                <p className="inline-flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                  <CalendarDays size={18} className="text-slate-700" /> Created on {new Date(parcel.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
