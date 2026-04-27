import { NextResponse } from "next/server";
import { createAdminToken, setAdminCookie, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (!validateAdminCredentials(String(body.email || ""), String(body.password || ""))) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  await setAdminCookie(await createAdminToken());
  return NextResponse.json({ ok: true });
}
