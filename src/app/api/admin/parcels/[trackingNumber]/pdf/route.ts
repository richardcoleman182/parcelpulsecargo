import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { findParcel } from "@/lib/parcels";
import { createParcelPdf } from "@/lib/pdf";

export async function GET(_: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trackingNumber } = await params;
  const parcel = await findParcel(trackingNumber);

  if (!parcel) {
    return NextResponse.json({ error: "Parcel not found." }, { status: 404 });
  }

  const pdf = await createParcelPdf(parcel);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${parcel.trackingNumber}.pdf"`,
    },
  });
}
