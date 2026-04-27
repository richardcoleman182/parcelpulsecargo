import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const cookieName = "ppc_admin";

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "replace-this-secret-before-production");
}

export async function createAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifyAdminToken(token?: string) {
  if (!token) return false;

  try {
    const verified = await jwtVerify(token, secret());
    return verified.payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdminRequest(request?: Request) {
  const headerToken =
    request?.headers.get("x-admin-token") ||
    request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (await verifyAdminToken(headerToken || undefined)) {
    return true;
  }

  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(cookieName)?.value);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export function adminCookieName() {
  return cookieName;
}

export function validateAdminCredentials(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL || "support@parcelpulsecargo.com";
  const configured = process.env.ADMIN_PASSWORD || "ChangeMeParcelPulse!";
  return email.trim().toLowerCase() === configuredEmail.toLowerCase() && password === configured;
}
