import { NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage } from "@/lib/contactMessages";
import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  await createContactMessage(parsed.data).catch((error) => console.error("Contact save failed", error));
  await sendContactEmail(parsed.data).catch((error) => console.error("Contact email failed", error));
  return NextResponse.json({ ok: true });
}
