import { z } from "zod";

export const partySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().min(3),
  country: z.string().min(2),
  dispatchBranch: z.string().optional(),
});

export const parcelSchema = z.object({
  sender: partySchema,
  receiver: partySchema,
  origin: z.string().min(2),
  destination: z.string().min(2),
  service: z.string().min(2),
  serviceLevel: z.string().optional(),
  parcelType: z.string().min(2),
  itemDescription: z.string().optional(),
  currency: z.string().min(1).optional(),
  weightKg: z.coerce.number().optional(),
  declaredValue: z.coerce.number().optional(),
  insuranceValue: z.coerce.number().optional(),
  currentStatus: z.string().min(2),
  currentLocation: z.string().min(2),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
});

export const statusSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  note: z.string().min(2),
  internalNote: z.string().optional(),
  severity: z.enum(["normal", "warning", "issue", "delivered"]).default("normal"),
  date: z.string().optional(),
});
