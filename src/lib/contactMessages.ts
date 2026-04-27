import { isSupabaseEnabled, supabaseRequest } from "./supabase";

const demoMessages: Array<{ name: string; email: string; phone?: string; message: string; created_at: string }> = [];

export async function createContactMessage(input: { name: string; email: string; phone?: string; message: string }) {
  const record = {
    ...input,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseEnabled()) {
    demoMessages.unshift(record);
    return record;
  }

  const rows = await supabaseRequest<Array<typeof record>>("contact_messages", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify(record),
  });

  return rows?.[0] ?? record;
}
