import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { deleteParcel, findParcel, updateParcel } from "@/lib/parcels";
import { parcelSchema } from "@/lib/parcelValidation";

export async function GET(_: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  if (!(await isAdminRequest(_))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trackingNumber } = await params;
  const parcel = await findParcel(trackingNumber);
  return parcel ? NextResponse.json({ parcel }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  if (!(await isAdminRequest(_))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trackingNumber } = await params;
  const deleted = await deleteParcel(trackingNumber);
  return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = parcelSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parcel information.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { trackingNumber } = await params;
  const parcel = await updateParcel(trackingNumber, parsed.data);

  if (!parcel) {
    return NextResponse.json({ error: "Parcel not found." }, { status: 404 });
  }

  return NextResponse.json({ parcel });
}
