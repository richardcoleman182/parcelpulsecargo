import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { deleteParcelStatus } from "@/lib/parcels";

export async function DELETE(request: Request, { params }: { params: Promise<{ trackingNumber: string; statusId: string }> }) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trackingNumber, statusId } = await params;
  const parcel = await deleteParcelStatus(trackingNumber, statusId);

  if (!parcel) {
    return NextResponse.json({ error: "Update not found." }, { status: 404 });
  }

  return NextResponse.json({ parcel });
}
