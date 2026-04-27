export type Party = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  country: string;
  dispatchBranch?: string;
};

export type ParcelStatus = {
  id: string;
  date: string;
  location: string;
  title: string;
  note: string;
  internalNote?: string;
  severity: "normal" | "warning" | "issue" | "delivered";
};

export type Parcel = {
  trackingNumber: string;
  sender: Party;
  receiver: Party;
  origin: string;
  destination: string;
  service: string;
  serviceLevel?: string;
  parcelType: string;
  itemDescription?: string;
  currency?: string;
  weightKg?: number;
  declaredValue?: number;
  insuranceValue?: number;
  currentStatus: string;
  currentLocation: string;
  notes?: string;
  statuses: ParcelStatus[];
  createdAt: string;
  updatedAt: string;
};
