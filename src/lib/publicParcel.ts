import type { Parcel } from "@/types/parcel";

export function toPublicParcel(parcel: Parcel): Parcel {
  return {
    ...parcel,
    statuses: parcel.statuses.map((status) => ({
      id: status.id,
      date: status.date,
      location: status.location,
      title: status.title,
      note: status.note,
      internalNote: status.internalNote,
      severity: status.severity,
    })),
  };
}
