"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

function createChallenge() {
  const left = Math.floor(Math.random() * 10) + 1;
  const right = Math.floor(Math.random() * 10) + 1;
  const operator = Math.random() > 0.5 ? "x" : "-";

  if (operator === "-") {
    const larger = Math.max(left, right);
    const smaller = Math.min(left, right);
    return {
      label: `${larger} - ${smaller}`,
      answer: larger - smaller,
    };
  }

  return {
    label: `${left} x ${right}`,
    answer: left * right,
  };
}

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [challenge, setChallenge] = useState({ label: "1 x 1", answer: 1 });
  const [challengeAnswer, setChallengeAnswer] = useState("");

  const isChallengeCorrect = Number(challengeAnswer) === challenge.answer;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isChallengeCorrect) {
      return;
    }

    setState("loading");
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    setState(response.ok ? "sent" : "error");
    if (response.ok) {
      form.reset();
      setChallenge(createChallenge());
      setChallengeAnswer("");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg bg-white p-6 shadow-xl shadow-slate-950/10">
      <input name="name" required placeholder="Full name" className="h-12 rounded-md border border-slate-300 px-4 outline-none focus:border-teal-700" />
      <input name="email" required type="email" placeholder="Email address" className="h-12 rounded-md border border-slate-300 px-4 outline-none focus:border-teal-700" />
      <input name="phone" placeholder="Phone number" className="h-12 rounded-md border border-slate-300 px-4 outline-none focus:border-teal-700" />
      <textarea name="message" required placeholder="How can we help?" rows={6} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-teal-700" />
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <label htmlFor="math-check" className="text-sm font-bold text-slate-950">
          Quick check: what is {challenge.label}?
        </label>
        <input
          id="math-check"
          inputMode="numeric"
          value={challengeAnswer}
          onChange={(event) => setChallengeAnswer(event.target.value)}
          placeholder="Answer"
          className="mt-3 h-12 w-full rounded-md border border-slate-300 bg-white px-4 outline-none focus:border-teal-700"
          required
        />
        <p className="mt-2 text-xs font-medium text-slate-500">The send button unlocks when the answer is correct.</p>
      </div>
      <button
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-5 font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={state === "loading" || !isChallengeCorrect}
      >
        {state === "loading" ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        Send message
      </button>
      {state === "sent" ? <p className="text-sm font-semibold text-teal-700">Message received. Our team will reply as soon as possible.</p> : null}
      {state === "error" ? (
        <p className="text-sm font-semibold text-red-700">
          Something went wrong. Please email{" "}
          <a className="underline" href="mailto:support@parcelpulsecargo.com">
            support@parcelpulsecargo.com
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
