"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Edit3, Loader2, LogOut, PackagePlus, RefreshCw, Search, Send, Trash2 } from "lucide-react";
import {
  CURRENT_LOCATION_OPTIONS,
  CURRENT_STATUS_OPTIONS,
  PACKAGE_TYPE_OPTIONS,
  SERVICE_LEVEL_OPTIONS,
  STATUS_UPDATE_OPTIONS,
  WORLD_COUNTRIES,
} from "@/lib/shipmentOptions";
import { toIsoOrUndefined } from "@/lib/datetime";
import type { Parcel } from "@/types/parcel";

const emptyParcel = {
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  senderAddress: "",
  senderCountry: "United Kingdom",
  dispatchBranch: "",
  receiverName: "",
  receiverEmail: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverCountry: "",
  origin: "United Kingdom",
  destination: "",
  service: "International Courier",
  serviceLevel: "Next Day",
  parcelType: "Parcel",
  itemDescription: "",
  currency: "GBP",
  weightKg: "",
  declaredValue: "",
  insuranceValue: "",
  currentStatus: "Shipment created",
  currentLocation: "At origin warehouse",
  shipmentDate: "",
  notes: "",
};

type ParcelFormState = typeof emptyParcel;
const adminTokenKey = "ppc_admin_token";

const emptyStatusForm = {
  title: "Received",
  location: "At origin warehouse",
  note: "",
  internalNote: "",
  severity: "normal",
  date: "",
};

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-slate-950 outline-none focus:border-teal-700"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 outline-none focus:border-teal-700"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminDashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selected, setSelected] = useState<Parcel | null>(null);
  const [parcelForm, setParcelForm] = useState<ParcelFormState>(emptyParcel);
  const [statusForm, setStatusForm] = useState(emptyStatusForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [createdModal, setCreatedModal] = useState<{ sender: string; receiver: string; trackingNumber: string } | null>(null);

  const selectedNumber = selected?.trackingNumber;

  function updateParcelField(key: keyof ParcelFormState, value: string) {
    setParcelForm((current) => ({ ...current, [key]: value }));
  }

  function updateStatusField(key: keyof typeof emptyStatusForm, value: string) {
    setStatusForm((current) => ({ ...current, [key]: value }));
  }

  function applyParcelData(nextParcels: Parcel[]) {
    setParcels(nextParcels);
    setSelected((current) => nextParcels.find((parcel) => parcel.trackingNumber === current?.trackingNumber) || nextParcels[0] || null);
  }

  function adminHeaders(): Record<string, string> {
    const token = typeof window !== "undefined" ? window.localStorage.getItem(adminTokenKey) : null;
    return token ? { "x-admin-token": token } : {};
  }

  async function load() {
    const response = await fetch("/api/admin/parcels", {
      headers: adminHeaders(),
    });
    const data = await response.json();
    applyParcelData(data.parcels || []);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    async function initialLoad() {
      const response = await fetch("/api/admin/parcels", {
        headers: adminHeaders(),
      });
      const data = await response.json();

      if (mounted) {
        setParcels(data.parcels || []);
        setSelected(data.parcels?.[0] || null);
        setLoading(false);
      }
    }

    void initialLoad();

    return () => {
      mounted = false;
    };
  }, []);

  const latest = useMemo(() => {
    const normalized = query.trim().toUpperCase();
    const source = normalized
      ? parcels.filter((parcel) =>
          [parcel.trackingNumber, parcel.sender.name, parcel.receiver.name, parcel.currentLocation, parcel.destination]
            .join(" ")
            .toUpperCase()
            .includes(normalized),
        )
      : parcels;

    return source.slice(0, 8);
  }, [parcels, query]);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const body = {
      sender: {
        name: parcelForm.senderName,
        email: parcelForm.senderEmail,
        phone: parcelForm.senderPhone,
        address: parcelForm.senderAddress,
        country: parcelForm.senderCountry,
        dispatchBranch: parcelForm.dispatchBranch,
      },
      receiver: {
        name: parcelForm.receiverName,
        email: parcelForm.receiverEmail,
        phone: parcelForm.receiverPhone,
        address: parcelForm.receiverAddress,
        country: parcelForm.receiverCountry,
      },
      origin: parcelForm.origin,
      destination: parcelForm.destination,
      service: parcelForm.service,
      serviceLevel: parcelForm.serviceLevel,
      parcelType: parcelForm.parcelType,
      itemDescription: parcelForm.itemDescription,
      currency: parcelForm.currency,
      weightKg: parcelForm.weightKg || undefined,
      declaredValue: parcelForm.declaredValue || undefined,
      insuranceValue: parcelForm.insuranceValue || undefined,
      currentStatus: parcelForm.currentStatus,
      currentLocation: parcelForm.currentLocation || parcelForm.origin,
      notes: parcelForm.notes,
      createdAt: toIsoOrUndefined(parcelForm.shipmentDate),
    };

    const response = await fetch("/api/admin/parcels", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...adminHeaders() },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error || "Could not create parcel.");
      return;
    }

    setParcelForm(emptyParcel);
    const delivered = data.notification?.delivered?.length || 0;
    const failed = data.notification?.failed?.length || 0;
    const failureReason = data.notification?.failed?.[0]?.error ? ` Delivery issue: ${data.notification.failed[0].error}` : "";
    setMessage(`Shipment created. Notifications sent to ${delivered} recipient${delivered === 1 ? "" : "s"}${failed ? `, with ${failed} failed delivery${failed === 1 ? "" : "ies"}.` : "."}${failureReason}`);
    setCreatedModal({
      sender: data.parcel.sender.name,
      receiver: data.parcel.receiver.name,
      trackingNumber: data.parcel.trackingNumber,
    });
    await load();
    setSelected(data.parcel);
  }

  async function addStatus(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedNumber) return;

    setSaving(true);
    const response = await fetch(`/api/admin/parcels/${selectedNumber}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...adminHeaders() },
      body: JSON.stringify({ title: statusForm.title, location: statusForm.location, note: statusForm.note, date: toIsoOrUndefined(statusForm.date), severity: statusForm.severity }),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error || "Could not update parcel.");
      return;
    }

    setSelected(data.parcel);
    setStatusForm(emptyStatusForm);
    const delivered = data.notification?.delivered?.length || 0;
    const failed = data.notification?.failed?.length || 0;
    const failureReason = data.notification?.failed?.[0]?.error ? ` Delivery issue: ${data.notification.failed[0].error}` : "";
    setMessage(`Update successful for ${selectedNumber}. Notifications sent to ${delivered} recipient${delivered === 1 ? "" : "s"}${failed ? `, with ${failed} failed delivery${failed === 1 ? "" : "ies"}.` : "."}${failureReason}`);
    await load();
  }

  async function remove(trackingNumber: string) {
    if (!window.confirm(`Delete shipment ${trackingNumber}? This cannot be undone.`)) {
      return;
    }
    await fetch(`/api/admin/parcels/${trackingNumber}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    setMessage(`Deleted ${trackingNumber}.`);
    await load();
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.localStorage.removeItem(adminTokenKey);
    window.location.href = "/lex/auth";
  }

  async function downloadPdf(trackingNumber: string) {
    setMessage("");
    const response = await fetch(`/api/admin/parcels/${trackingNumber}/pdf`, {
      credentials: "include",
      headers: adminHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setMessage(data?.error || "Could not download the shipment PDF.");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${trackingNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Operations</p>
            <h1 className="text-2xl font-black text-slate-950">Parcel Pulse Cargo admin</h1>
          </div>
          <button onClick={logout} className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.28fr_.72fr] lg:px-8">
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Create shipment</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Compose a polished shipment record, set its opening milestone, choose the currency customers should see, and dispatch the branded PDF notice from one control surface.</p>
            </div>
            <button onClick={load} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-bold">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          <form onSubmit={create} className="mt-6 grid gap-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <SectionHeading eyebrow="Sender details" title="Sender details" text="Register the shipping party and origin handling branch with the exact contact information operations will rely on." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InputField label="Sender full name or company" value={parcelForm.senderName} onChange={(value) => updateParcelField("senderName", value)} required />
                <InputField label="Sender email" value={parcelForm.senderEmail} onChange={(value) => updateParcelField("senderEmail", value)} required type="email" />
                <InputField label="Sender phone (+44...)" value={parcelForm.senderPhone} onChange={(value) => updateParcelField("senderPhone", value)} />
                <InputField label="Full address" value={parcelForm.senderAddress} onChange={(value) => updateParcelField("senderAddress", value)} required />
                <SelectField label="Sender country" value={parcelForm.senderCountry} options={WORLD_COUNTRIES} onChange={(value) => updateParcelField("senderCountry", value)} required />
                <InputField label="Dispatch branch" value={parcelForm.dispatchBranch} onChange={(value) => updateParcelField("dispatchBranch", value)} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <SectionHeading eyebrow="Receiver details" title="Receiver details" text="Define the receiving party exactly as they should appear in delivery, alert, and tracking communication." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InputField label="Receiver full name" value={parcelForm.receiverName} onChange={(value) => updateParcelField("receiverName", value)} required />
                <InputField label="Receiver email" value={parcelForm.receiverEmail} onChange={(value) => updateParcelField("receiverEmail", value)} required type="email" />
                <InputField label="Receiver phone" value={parcelForm.receiverPhone} onChange={(value) => updateParcelField("receiverPhone", value)} />
                <InputField label="Full address" value={parcelForm.receiverAddress} onChange={(value) => updateParcelField("receiverAddress", value)} required />
                <SelectField label="Receiver country" value={parcelForm.receiverCountry} options={WORLD_COUNTRIES} onChange={(value) => updateParcelField("receiverCountry", value)} required placeholder="Select receiver country" />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <SectionHeading eyebrow="Shipment profile" title="Shipment details" text="Shape the service profile, visible financial currency, live movement stage, and shipment date that power the customer-facing tracking record." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InputField label="Origin" value={parcelForm.origin} onChange={(value) => updateParcelField("origin", value)} required />
                <InputField label="Destination" value={parcelForm.destination} onChange={(value) => updateParcelField("destination", value)} required />
                <InputField label="Service" value={parcelForm.service} onChange={(value) => updateParcelField("service", value)} required />
                <SelectField label="Service level" value={parcelForm.serviceLevel} options={SERVICE_LEVEL_OPTIONS} onChange={(value) => updateParcelField("serviceLevel", value)} />
                <SelectField label="Package type" value={parcelForm.parcelType} options={PACKAGE_TYPE_OPTIONS} onChange={(value) => updateParcelField("parcelType", value)} required />
                <InputField label="Item description" value={parcelForm.itemDescription} onChange={(value) => updateParcelField("itemDescription", value)} />
                <InputField label="Display currency" value={parcelForm.currency} onChange={(value) => updateParcelField("currency", value)} required />
                <InputField label="Weight (kg)" value={parcelForm.weightKg} onChange={(value) => updateParcelField("weightKg", value)} type="number" />
                <InputField label="Declared value" value={parcelForm.declaredValue} onChange={(value) => updateParcelField("declaredValue", value)} type="number" />
                <InputField label="Insurance value" value={parcelForm.insuranceValue} onChange={(value) => updateParcelField("insuranceValue", value)} type="number" />
                <SelectField label="Current status" value={parcelForm.currentStatus} options={CURRENT_STATUS_OPTIONS} onChange={(value) => updateParcelField("currentStatus", value)} required />
                <SelectField label="Current location" value={parcelForm.currentLocation} options={CURRENT_LOCATION_OPTIONS} onChange={(value) => updateParcelField("currentLocation", value)} required />
                <InputField label="Shipment date and time" value={parcelForm.shipmentDate} onChange={(value) => updateParcelField("shipmentDate", value)} type="datetime-local" />
                <label className="grid gap-2 text-sm font-bold text-slate-700 md:col-span-2">
                  Shipment notes visible to sender and receiver
                  <textarea
                    value={parcelForm.notes}
                    onChange={(event) => updateParcelField("notes", event.target.value)}
                    className="min-h-28 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-slate-950 outline-none focus:border-teal-700"
                  />
                </label>
              </div>
            </section>

            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-5 font-bold text-white hover:bg-teal-800" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={18} /> : <PackagePlus size={18} />}
              Create tracking number and email PDF
            </button>
          </form>

          {message ? <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{message}</p> : null}
        </section>

        <aside className="grid gap-6">
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Shipments</h2>
            <p className="mt-1 text-sm text-slate-600">Search the live book by tracking number, parties, route, or the current movement milestone.</p>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Quick scan tracking ID"
                className="h-11 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-teal-700"
              />
            </div>
            {loading ? <p className="mt-4 text-sm text-slate-500">Loading...</p> : null}
            <div className="mt-4 grid gap-3">
              {latest.map((parcel) => (
                <button
                  key={parcel.trackingNumber}
                  onClick={() => setSelected(parcel)}
                  className={`rounded-md border p-3 text-left ${parcel.trackingNumber === selectedNumber ? "border-teal-700 bg-teal-50" : "border-slate-200"}`}
                >
                  <p className="font-mono text-sm font-bold">{parcel.trackingNumber}</p>
                  <p className="text-sm font-semibold text-slate-800">{parcel.currentStatus}</p>
                  <p className="text-xs font-semibold text-slate-700">{parcel.sender.name} to {parcel.receiver.name}</p>
                  <p className="text-xs text-slate-500">{parcel.currentLocation} · {parcel.destination}</p>
                </button>
              ))}
            </div>
          </section>

          {selected ? (
            <section className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{selected.trackingNumber}</h2>
                    <p className="text-sm text-slate-600">{selected.sender.name} to {selected.receiver.name}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
                      {selected.serviceLevel || selected.service} · {selected.itemDescription || selected.parcelType}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">Booked {new Date(selected.createdAt).toLocaleString("en-GB")}</p>
                  </div>
                  <button onClick={() => remove(selected.trackingNumber)} className="grid h-10 w-10 place-items-center rounded-md bg-red-600 text-white" title="Delete shipment">
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Link href={`/admin/parcels/${selected.trackingNumber}/edit`} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white">
                    <Edit3 size={16} /> Open full editor
                  </Link>
                  <button onClick={() => void downloadPdf(selected.trackingNumber)} type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-600 px-4 text-sm font-bold text-white">
                    <Download size={16} /> Download PDF
                  </button>
                  <button onClick={load} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-700">
                    <RefreshCw size={16} /> Reload shipment
                  </button>
                </div>
              </div>

              <form onSubmit={addStatus} className="mt-5 grid gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Publish tracking milestone</p>
                <SelectField label="Current status" value={statusForm.title} options={STATUS_UPDATE_OPTIONS} onChange={(value) => updateStatusField("title", value)} />
                <SelectField label="Current location" value={statusForm.location} options={CURRENT_LOCATION_OPTIONS} onChange={(value) => updateStatusField("location", value)} />
                <InputField label="Update date and time" value={statusForm.date} onChange={(value) => updateStatusField("date", value)} type="datetime-local" />
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Update tone
                  <select value={statusForm.severity} onChange={(event) => updateStatusField("severity", event.target.value)} className="h-11 rounded-md border border-slate-300 px-3 text-sm font-normal">
                    <option value="normal">Normal update</option>
                    <option value="warning">Delay warning</option>
                    <option value="issue">Airport, customs, or immigration issue</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Update note for sender and receiver
                  <textarea value={statusForm.note} onChange={(event) => updateStatusField("note", event.target.value)} placeholder="This will be emailed to sender and receiver and shown on the tracking page" className="min-h-20 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal" />
                </label>
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 font-bold text-white" disabled={saving}>
                  <Send size={17} /> Add update and notify
                </button>
              </form>

              <div className="mt-5 grid gap-3">
                {selected.statuses.map((status) => (
                  <div key={status.id} className="border-l-2 border-teal-700 pl-3">
                    <p className="text-sm font-bold">{status.title}</p>
                    <p className="text-xs text-slate-500">{new Date(status.date).toLocaleString()} · {status.location}</p>
                    <p className="text-sm text-slate-600">{status.note}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      {createdModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Shipment created</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              Shipment from {createdModal.sender} to {createdModal.receiver} has been created.
            </h2>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-600">Tracking number</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="font-mono text-lg font-black text-slate-950">{createdModal.trackingNumber}</p>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(createdModal.trackingNumber)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setCreatedModal(null)} className="inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-5 font-bold text-white">
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
