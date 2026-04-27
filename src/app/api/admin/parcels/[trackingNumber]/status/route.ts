import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { sendParcelEmail } from "@/lib/email";
import { addParcelStatus } from "@/lib/parcels";
import { statusSchema } from "@/lib/parcelValidation";

export async function POST(request: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = statusSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status update.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { trackingNumber } = await params;
  const parcel = await addParcelStatus(trackingNumber, parsed.data);

  if (!parcel) {
    return NextResponse.json({ error: "Parcel not found." }, { status: 404 });
  }

  const notification = await sendParcelEmail(parcel, "Shipment updated").catch((error) => {
    console.error("Status email failed", error);
    return {
      attempted: [parcel.sender.email, parcel.receiver.email].filter(Boolean),
      delivered: [],
      failed: [{ to: "all recipients", error: error instanceof Error ? error.message : "Email delivery failed" }],
      usedFallback: false,
    };
  });

  return NextResponse.json({ parcel, notification });
}
