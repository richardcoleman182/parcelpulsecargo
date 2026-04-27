"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import {
  CURRENT_LOCATION_OPTIONS,
  CURRENT_STATUS_OPTIONS,
  PACKAGE_TYPE_OPTIONS,
  SERVICE_LEVEL_OPTIONS,
  WORLD_COUNTRIES,
} from "@/lib/shipmentOptions";
import { formatDateTimeLocal, toIsoOrUndefined } from "@/lib/datetime";
import type { Parcel } from "@/types/parcel";

type EditForm = {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderCountry: string;
  dispatchBranch: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCountry: string;
  origin: string;
  destination: string;
  service: string;
  serviceLevel: string;
  parcelType: string;
  itemDescription: string;
  currency: string;
  weightKg: string;
  declaredValue: string;
  insuranceValue: string;
  currentStatus: string;
  currentLocation: string;
  createdAt: string;
  notes: string;
};

function toForm(parcel: Parcel): EditForm {
  return {
    senderName: parcel.sender.name || "",
    senderEmail: parcel.sender.email || "",
    senderPhone: parcel.sender.phone || "",
    senderAddress: parcel.sender.address || "",
    senderCountry: parcel.sender.country || "United Kingdom",
    dispatchBranch: parcel.sender.dispatchBranch || "",
    receiverName: parcel.receiver.name || "",
    receiverEmail: parcel.receiver.email || "",
    receiverPhone: parcel.receiver.phone || "",
    receiverAddress: parcel.receiver.address || "",
    receiverCountry: parcel.receiver.country || "",
    origin: parcel.origin || "",
    destination: parcel.destination || "",
    service: parcel.service || "",
    serviceLevel: parcel.serviceLevel || "Next Day",
    parcelType: parcel.parcelType || "Parcel",
    itemDescription: parcel.itemDescription || "",
    currency: parcel.currency || "GBP",
    weightKg: parcel.weightKg?.toString() || "",
    declaredValue: parcel.declaredValue?.toString() || "",
    insuranceValue: parcel.insuranceValue?.toString() || "",
    currentStatus: parcel.currentStatus || "Shipment created",
    currentLocation: parcel.currentLocation || "At origin warehouse",
    createdAt: formatDateTimeLocal(parcel.createdAt),
    notes: parcel.notes || "",
  };
}

function toBody(form: EditForm) {
  return {
    sender: {
      name: form.senderName,
      email: form.senderEmail,
      phone: form.senderPhone,
      address: form.senderAddress,
      country: form.senderCountry,
      dispatchBranch: form.dispatchBranch,
    },
    receiver: {
      name: form.receiverName,
      email: form.receiverEmail,
      phone: form.receiverPhone,
      address: form.receiverAddress,
      country: form.receiverCountry,
    },
    origin: form.origin,
    destination: form.destination,
    service: form.service,
    serviceLevel: form.serviceLevel,
    parcelType: form.parcelType,
    itemDescription: form.itemDescription,
    currency: form.currency,
    weightKg: form.weightKg || undefined,
    declaredValue: form.declaredValue || undefined,
    insuranceValue: form.insuranceValue || undefined,
    currentStatus: form.currentStatus,
    currentLocation: form.currentLocation,
    createdAt: toIsoOrUndefined(form.createdAt),
    notes: form.notes,
  };
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-black text-slate-950">{title}</h2>
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

export function EditCargoForm({ trackingNumber }: { trackingNumber: string }) {
  const [form, setForm] = useState<EditForm | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(key: keyof EditForm, value: string) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      const response = await fetch(`/api/admin/parcels/${trackingNumber}`);
      const data = await response.json();

      if (mounted && data.parcel) {
        setForm(toForm(data.parcel));
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [trackingNumber]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setMessage("");

    const response = await fetch(`/api/admin/parcels/${trackingNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBody(form)),
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error || "Could not save cargo details.");
      return;
    }

    setForm(toForm(data.parcel));
    setMessage("Cargo details saved.");
  }

  if (!form) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100">
        <p className="font-semibold text-slate-600">Loading cargo details...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Cargo editor</p>
            <h1 className="text-2xl font-black text-slate-950">{trackingNumber}</h1>
          </div>
          <Link href="/admin/dashboard" className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </header>

      <form onSubmit={save} className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <SectionHeading eyebrow="Full shipment editor" title="Edit or change any shipment detail" text="This workspace is built for precise operational control, including shipment backdating, customer-facing currency selection, and route-level corrections." />

          <div className="mt-6 grid gap-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <SectionHeading eyebrow="Sender details" title="Sender details" text="Update the shipper identity, contact, dispatch branch, and full origin address." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InputField label="Sender full name or company" value={form.senderName} onChange={(value) => updateField("senderName", value)} required />
                <InputField label="Sender email" value={form.senderEmail} onChange={(value) => updateField("senderEmail", value)} required type="email" />
                <InputField label="Sender phone (+44...)" value={form.senderPhone} onChange={(value) => updateField("senderPhone", value)} />
                <InputField label="Full address" value={form.senderAddress} onChange={(value) => updateField("senderAddress", value)} required />
                <SelectField label="Sender country" value={form.senderCountry} options={WORLD_COUNTRIES} onChange={(value) => updateField("senderCountry", value)} required />
                <InputField label="Dispatch branch" value={form.dispatchBranch} onChange={(value) => updateField("dispatchBranch", value)} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <SectionHeading eyebrow="Receiver details" title="Receiver details" text="Keep the destination contact and final delivery address complete and current." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InputField label="Receiver full name" value={form.receiverName} onChange={(value) => updateField("receiverName", value)} required />
                <InputField label="Receiver email" value={form.receiverEmail} onChange={(value) => updateField("receiverEmail", value)} required type="email" />
                <InputField label="Receiver phone" value={form.receiverPhone} onChange={(value) => updateField("receiverPhone", value)} />
                <InputField label="Full address" value={form.receiverAddress} onChange={(value) => updateField("receiverAddress", value)} required />
                <SelectField label="Receiver country" value={form.receiverCountry} options={WORLD_COUNTRIES} onChange={(value) => updateField("receiverCountry", value)} required placeholder="Select receiver country" />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <SectionHeading eyebrow="Shipment profile" title="Shipment details" text="Change routing, package classification, visible currency, booking date, and the tracking view customers see." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InputField label="Origin" value={form.origin} onChange={(value) => updateField("origin", value)} required />
                <InputField label="Destination" value={form.destination} onChange={(value) => updateField("destination", value)} required />
                <InputField label="Service" value={form.service} onChange={(value) => updateField("service", value)} required />
                <SelectField label="Service level" value={form.serviceLevel} options={SERVICE_LEVEL_OPTIONS} onChange={(value) => updateField("serviceLevel", value)} />
                <SelectField label="Package type" value={form.parcelType} options={PACKAGE_TYPE_OPTIONS} onChange={(value) => updateField("parcelType", value)} required />
                <InputField label="Item description" value={form.itemDescription} onChange={(value) => updateField("itemDescription", value)} />
                <InputField label="Display currency" value={form.currency} onChange={(value) => updateField("currency", value)} required />
                <InputField label="Weight (kg)" value={form.weightKg} onChange={(value) => updateField("weightKg", value)} type="number" />
                <InputField label="Declared value" value={form.declaredValue} onChange={(value) => updateField("declaredValue", value)} type="number" />
                <InputField label="Insurance value" value={form.insuranceValue} onChange={(value) => updateField("insuranceValue", value)} type="number" />
                <SelectField label="Current status" value={form.currentStatus} options={CURRENT_STATUS_OPTIONS} onChange={(value) => updateField("currentStatus", value)} required />
                <SelectField label="Current location" value={form.currentLocation} options={CURRENT_LOCATION_OPTIONS} onChange={(value) => updateField("currentLocation", value)} required />
                <InputField label="Shipment date and time" value={form.createdAt} onChange={(value) => updateField("createdAt", value)} type="datetime-local" />
                <label className="grid gap-2 text-sm font-bold text-slate-700 md:col-span-2">
                  Shipment notes visible to sender and receiver
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    className="min-h-32 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-slate-950 outline-none focus:border-teal-700"
                  />
                </label>
              </div>
            </section>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-6 font-bold text-white hover:bg-teal-800" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save cargo details
          </button>
          {message ? <p className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-700">{message}</p> : null}
        </div>
      </form>
    </main>
  );
}
