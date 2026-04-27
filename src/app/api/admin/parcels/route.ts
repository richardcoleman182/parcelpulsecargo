import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { sendParcelEmail } from "@/lib/email";
import { createParcel, listParcels } from "@/lib/parcels";
import { parcelSchema } from "@/lib/parcelValidation";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ parcels: await listParcels() });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = parcelSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parcel information.", details: parsed.error.flatten() }, { status: 400 });
  }

  const parcel = await createParcel(parsed.data);
  const notification = await sendParcelEmail(parcel).catch((error) => {
    console.error("Parcel email failed", error);
    return {
      attempted: [parcel.sender.email, parcel.receiver.email].filter(Boolean),
      delivered: [],
      failed: [{ to: "all recipients", error: error instanceof Error ? error.message : "Email delivery failed" }],
      usedFallback: false,
    };
  });
  return NextResponse.json({ parcel, notification }, { status: 201 });
}
