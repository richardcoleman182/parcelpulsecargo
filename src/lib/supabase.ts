const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function restUrl(path: string) {
  return `${SUPABASE_URL}/rest/v1/${path}`;
}

export async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { allowEmpty?: boolean } = {},
) {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const response = await fetch(restUrl(path), {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  if (response.status === 204 || options.allowEmpty) {
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : null;
  }

  return (await response.json()) as T;
}

export function isSupabaseEnabled() {
  return hasSupabaseConfig();
}
