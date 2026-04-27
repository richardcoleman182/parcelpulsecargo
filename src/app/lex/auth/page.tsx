import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import { LexAuthForm } from "./LexAuthForm";

export default async function LexAuthPage() {
  if (await isAdminRequest()) {
    redirect("/admin/dashboard");
  }

  return (
    <main
      className="grid min-h-screen place-items-center bg-slate-950 px-4 py-10"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(15,23,42,.96), rgba(19,78,74,.86)), url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=85')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <Image src="/logo.webp" alt="Parcel Pulse Cargo logo" width={72} height={72} className="rounded-md object-contain" priority />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Secure operations</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Admin access</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with the operations email to manage shipment records, movement updates, and PDF notifications.
        </p>
        <LexAuthForm />
      </div>
    </main>
  );
}
