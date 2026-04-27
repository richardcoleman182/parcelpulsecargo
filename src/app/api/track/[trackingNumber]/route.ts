import { NextResponse } from "next/server";
import { findParcel } from "@/lib/parcels";
import { toPublicParcel } from "@/lib/publicParcel";

export async function GET(_: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  const { trackingNumber } = await params;
  const parcel = await findParcel(trackingNumber);

  if (!parcel) {
    return NextResponse.json({ error: "Tracking number not found." }, { status: 404 });
  }

  return NextResponse.json({ parcel: toPublicParcel(parcel) });
}
