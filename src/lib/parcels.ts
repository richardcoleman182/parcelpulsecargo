import type { Parcel, ParcelStatus } from "@/types/parcel";
import { isSupabaseEnabled, supabaseRequest } from "./supabase";
import { generateTrackingNumber, normalizeTrackingNumber } from "./tracking";

const demoParcels = new Map<string, Parcel>();
const CURRENCY_META_PREFIX = "[[PPC_CURRENCY:";

type ShipmentRow = {
  tracking_number: string;
  sender: Parcel["sender"];
  receiver: Parcel["receiver"];
  origin: string;
  destination: string;
  service: string;
  service_level?: string | null;
  parcel_type: string;
  item_description?: string | null;
  currency?: string | null;
  weight_kg?: number | null;
  declared_value?: number | null;
  insurance_value?: number | null;
  current_status: string;
  current_location: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

type ShipmentUpdateRow = {
  id: string;
  tracking_number: string;
  date: string;
  location: string;
  title: string;
  note: string;
  internal_note?: string | null;
  severity: ParcelStatus["severity"];
};

type CreateParcelInput = Omit<Parcel, "trackingNumber" | "statuses" | "createdAt" | "updatedAt"> & {
  createdAt?: string;
};

function now() {
  return new Date().toISOString();
}

function parseStoredNotes(raw?: string | null) {
  if (!raw) return { notes: undefined as string | undefined, currency: undefined as string | undefined };
  const match = raw.match(/^\[\[PPC_CURRENCY:(.+?)\]\]\n?/);
  if (!match) return { notes: raw, currency: undefined };
  const nextNotes = raw.slice(match[0].length).trim();
  return {
    notes: nextNotes || undefined,
    currency: match[1].trim() || undefined,
  };
}

function encodeStoredNotes(notes?: string, currency?: string) {
  const cleanNotes = notes?.replace(/^\[\[PPC_CURRENCY:(.+?)\]\]\n?/g, "").trim() || "";
  const cleanCurrency = currency?.trim();
  if (!cleanCurrency) return cleanNotes || undefined;
  return `${CURRENCY_META_PREFIX}${cleanCurrency}]]${cleanNotes ? `\n${cleanNotes}` : ""}`;
}

function toShipmentRow(input: Omit<Parcel, "trackingNumber" | "statuses" | "createdAt" | "updatedAt"> & { trackingNumber?: string; createdAt?: string }) {
  return {
    tracking_number: input.trackingNumber || "",
    sender: input.sender,
    receiver: input.receiver,
    origin: input.origin,
    destination: input.destination,
    service: input.service,
    service_level: input.serviceLevel,
    parcel_type: input.parcelType,
    item_description: input.itemDescription,
    weight_kg: input.weightKg,
    declared_value: input.declaredValue,
    insurance_value: input.insuranceValue,
    current_status: input.currentStatus,
    current_location: input.currentLocation,
    notes: encodeStoredNotes(input.notes, input.currency),
    created_at: input.createdAt || now(),
    updated_at: now(),
  };
}

function rowToStatus(row: ShipmentUpdateRow): ParcelStatus {
  return {
    id: row.id,
    date: row.date,
    location: row.location,
    title: row.title,
    note: row.note,
    internalNote: row.internal_note || undefined,
    severity: row.severity,
  };
}

function rowToParcel(row: ShipmentRow, statuses: ShipmentUpdateRow[]): Parcel {
  const parsedNotes = parseStoredNotes(row.notes);
  return {
    trackingNumber: row.tracking_number,
    sender: row.sender,
    receiver: row.receiver,
    origin: row.origin,
    destination: row.destination,
    service: row.service,
    serviceLevel: row.service_level || undefined,
    parcelType: row.parcel_type,
    itemDescription: row.item_description || undefined,
    currency: row.currency || parsedNotes.currency || undefined,
    weightKg: row.weight_kg || undefined,
    declaredValue: row.declared_value || undefined,
    insuranceValue: row.insurance_value || undefined,
    currentStatus: row.current_status,
    currentLocation: row.current_location,
    notes: parsedNotes.notes,
    statuses: statuses.map(rowToStatus).sort((a, b) => b.date.localeCompare(a.date)),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchUpdatesFor(trackingNumbers: string[]) {
  if (!trackingNumbers.length) return [] as ShipmentUpdateRow[];

  const inList = trackingNumbers.map((value) => `"${value}"`).join(",");
  return (
    (await supabaseRequest<ShipmentUpdateRow[]>(
      `shipment_updates?tracking_number=in.(${inList})&order=date.desc`,
    )) || []
  );
}

export async function listParcels() {
  if (!isSupabaseEnabled()) {
    return [...demoParcels.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const shipments =
    (await supabaseRequest<ShipmentRow[]>("shipments?select=*&order=created_at.desc")) || [];
  const updates = await fetchUpdatesFor(shipments.map((shipment) => shipment.tracking_number));

  return shipments.map((shipment) =>
    rowToParcel(
      shipment,
      updates.filter((update) => update.tracking_number === shipment.tracking_number),
    ),
  );
}

export async function findParcel(trackingNumber: string) {
  const normalized = normalizeTrackingNumber(trackingNumber);

  if (!isSupabaseEnabled()) {
    return demoParcels.get(normalized) ?? null;
  }

  const shipments =
    (await supabaseRequest<ShipmentRow[]>(
      `shipments?tracking_number=eq.${encodeURIComponent(normalized)}&select=*`,
    )) || [];

  if (!shipments[0]) return null;

  const updates =
    (await supabaseRequest<ShipmentUpdateRow[]>(
      `shipment_updates?tracking_number=eq.${encodeURIComponent(normalized)}&order=date.desc`,
    )) || [];

  return rowToParcel(shipments[0], updates);
}

export async function createParcel(input: CreateParcelInput) {
  const createdAt = input.createdAt || now();
  let trackingNumber = generateTrackingNumber();

  while (await findParcel(trackingNumber)) {
    trackingNumber = generateTrackingNumber();
  }

  const initialStatus: ParcelStatus = {
    id: crypto.randomUUID(),
    date: createdAt,
    location: input.currentLocation || input.origin,
    title: input.currentStatus || "Shipment created",
    note: "Parcel record has been created and is awaiting the next operational update.",
    severity: "normal",
  };

  const parcel: Parcel = {
    ...input,
    trackingNumber,
    statuses: [initialStatus],
    createdAt,
    updatedAt: createdAt,
  };

  if (!isSupabaseEnabled()) {
    demoParcels.set(trackingNumber, parcel);
    return parcel;
  }

  const shipmentRows = await supabaseRequest<ShipmentRow[]>("shipments", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      ...toShipmentRow({ ...input, trackingNumber }),
      tracking_number: trackingNumber,
      created_at: createdAt,
      updated_at: createdAt,
    }),
  });

  await supabaseRequest<ShipmentUpdateRow[]>("shipment_updates", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      id: initialStatus.id,
      tracking_number: trackingNumber,
      date: initialStatus.date,
      location: initialStatus.location,
      title: initialStatus.title,
      note: initialStatus.note,
      internal_note: null,
      severity: initialStatus.severity,
    }),
  });

  return rowToParcel(shipmentRows?.[0] || {
    ...toShipmentRow({ ...input, trackingNumber, createdAt }),
    tracking_number: trackingNumber,
    created_at: createdAt,
    updated_at: createdAt,
  }, [
    {
      id: initialStatus.id,
      tracking_number: trackingNumber,
      date: initialStatus.date,
      location: initialStatus.location,
      title: initialStatus.title,
      note: initialStatus.note,
      internal_note: null,
      severity: initialStatus.severity,
    },
  ]);
}

export async function addParcelStatus(trackingNumber: string, status: Omit<ParcelStatus, "id" | "date"> & { date?: string }) {
  const normalized = normalizeTrackingNumber(trackingNumber);
  const updateDate = status.date || now();
  const nextStatus: ParcelStatus = {
    ...status,
    id: crypto.randomUUID(),
    date: updateDate,
  };

  const updates = {
    current_status: nextStatus.title,
    current_location: nextStatus.location,
    updated_at: now(),
  };

  if (!isSupabaseEnabled()) {
    const parcel = demoParcels.get(normalized);
    if (!parcel) return null;
    const updated = { ...parcel, currentStatus: nextStatus.title, currentLocation: nextStatus.location, updatedAt: updates.updated_at, statuses: [nextStatus, ...parcel.statuses] };
    demoParcels.set(normalized, updated);
    return updated;
  }

  await supabaseRequest<ShipmentRow[]>(
    `shipments?tracking_number=eq.${encodeURIComponent(normalized)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify(updates),
    },
    { allowEmpty: true },
  );

  await supabaseRequest<ShipmentUpdateRow[]>("shipment_updates", {
    method: "POST",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id: nextStatus.id,
      tracking_number: normalized,
      date: nextStatus.date,
      location: nextStatus.location,
      title: nextStatus.title,
      note: nextStatus.note,
      internal_note: nextStatus.internalNote || null,
      severity: nextStatus.severity,
    }),
  }, { allowEmpty: true });

  return findParcel(normalized);
}

export async function deleteParcelStatus(trackingNumber: string, statusId: string) {
  const normalized = normalizeTrackingNumber(trackingNumber);

  if (!isSupabaseEnabled()) {
    const parcel = demoParcels.get(normalized);
    if (!parcel) return null;
    const statuses = parcel.statuses.filter((status) => status.id !== statusId);
    const latestStatus = statuses[0];
    const updated: Parcel = {
      ...parcel,
      statuses,
      currentStatus: latestStatus?.title || "Shipment created",
      currentLocation: latestStatus?.location || parcel.origin,
      updatedAt: now(),
    };
    demoParcels.set(normalized, updated);
    return updated;
  }

  await supabaseRequest<null>(
    `shipment_updates?id=eq.${encodeURIComponent(statusId)}&tracking_number=eq.${encodeURIComponent(normalized)}`,
    { method: "DELETE" },
    { allowEmpty: true },
  );

  const remaining =
    (await supabaseRequest<ShipmentUpdateRow[]>(
      `shipment_updates?tracking_number=eq.${encodeURIComponent(normalized)}&order=date.desc`,
    )) || [];

  const latestStatus = remaining[0];

  await supabaseRequest<ShipmentRow[]>(
    `shipments?tracking_number=eq.${encodeURIComponent(normalized)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        current_status: latestStatus?.title || "Shipment created",
        current_location: latestStatus?.location || "At origin warehouse",
        updated_at: now(),
      }),
    },
    { allowEmpty: true },
  );

  return findParcel(normalized);
}

export async function updateParcel(trackingNumber: string, input: Partial<Omit<Parcel, "trackingNumber" | "statuses" | "updatedAt">>) {
  const normalized = normalizeTrackingNumber(trackingNumber);
  const updates = {
    sender: input.sender,
    receiver: input.receiver,
    origin: input.origin,
    destination: input.destination,
    service: input.service,
    service_level: input.serviceLevel,
    parcel_type: input.parcelType,
    item_description: input.itemDescription,
    weight_kg: input.weightKg,
    declared_value: input.declaredValue,
    insurance_value: input.insuranceValue,
    current_status: input.currentStatus,
    current_location: input.currentLocation,
    notes: encodeStoredNotes(input.notes, input.currency),
    created_at: input.createdAt,
    updated_at: now(),
  };

  if (!isSupabaseEnabled()) {
    const parcel = demoParcels.get(normalized);
    if (!parcel) return null;
    const updated = {
      ...parcel,
      ...input,
      updatedAt: updates.updated_at,
    };
    demoParcels.set(normalized, updated);
    return updated;
  }

  await supabaseRequest<ShipmentRow[]>(
    `shipments?tracking_number=eq.${encodeURIComponent(normalized)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify(updates),
    },
    { allowEmpty: true },
  );

  return findParcel(normalized);
}

export async function deleteParcel(trackingNumber: string) {
  const normalized = normalizeTrackingNumber(trackingNumber);

  if (!isSupabaseEnabled()) {
    return demoParcels.delete(normalized);
  }

  await supabaseRequest<null>(
    `shipment_updates?tracking_number=eq.${encodeURIComponent(normalized)}`,
    { method: "DELETE" },
    { allowEmpty: true },
  );

  await supabaseRequest<null>(
    `shipments?tracking_number=eq.${encodeURIComponent(normalized)}`,
    { method: "DELETE" },
    { allowEmpty: true },
  );

  return true;
}
