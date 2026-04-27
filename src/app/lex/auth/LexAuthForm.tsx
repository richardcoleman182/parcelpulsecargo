"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";

export function LexAuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("support@parcelpulsecargo.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Operations email"
        className="h-12 rounded-md border border-slate-300 px-4 outline-none focus:border-teal-700"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="h-12 rounded-md border border-slate-300 px-4 outline-none focus:border-teal-700"
        required
      />
      <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 font-bold text-white hover:bg-teal-800" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={18} /> : <LockKeyhole size={18} />}
        Sign in
      </button>
      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}
