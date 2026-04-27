import type { Parcel } from "@/types/parcel";
import { createParcelPdf } from "./pdf";

type EmailPayload = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string }>;
};

export type EmailDeliveryResult = {
  attempted: string[];
  delivered: string[];
  failed: Array<{ to: string; error: string }>;
  usedFallback: boolean;
};

async function postEmail(payload: EmailPayload, from: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Resend not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
      attachments: payload.attachments,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend send failed (${response.status}): ${body}`);
  }

  return response.json().catch(() => null);
}

async function sendEmail(payload: EmailPayload) {
  const configuredFrom = process.env.MAIL_FROM || "Parcel Pulse Cargo <support@parcelpulsecargo.com>";
  const fallbackFrom = "Parcel Pulse Cargo <onboarding@resend.dev>";
  const recipients = [...new Set(payload.to.filter(Boolean))];
  const result: EmailDeliveryResult = {
    attempted: recipients,
    delivered: [],
    failed: [],
    usedFallback: false,
  };

  for (const recipient of recipients) {
    const singlePayload = { ...payload, to: [recipient] };

    try {
      await postEmail(singlePayload, configuredFrom);
      result.delivered.push(recipient);
      continue;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email error";

      if (!configuredFrom.includes("resend.dev")) {
        try {
          await postEmail(
            {
              ...singlePayload,
              replyTo: payload.replyTo || "support@parcelpulsecargo.com",
            },
            fallbackFrom,
          );
          result.delivered.push(recipient);
          result.usedFallback = true;
          continue;
        } catch (fallbackError) {
          const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : "Unknown fallback email error";
          result.failed.push({ to: recipient, error: `${message} | Fallback failed: ${fallbackMessage}` });
          continue;
        }
      }

      result.failed.push({ to: recipient, error: message });
    }
  }

  if (!result.delivered.length && result.failed.length) {
    throw new Error(result.failed.map((entry) => `${entry.to}: ${entry.error}`).join(" || "));
  }

  return result;
}

export async function sendParcelEmail(parcel: Parcel, subjectPrefix = "Shipment created") {
  const pdf = await createParcelPdf(parcel);
  const recipients = [parcel.sender.email, parcel.receiver.email].filter(Boolean);

  return sendEmail({
    to: recipients,
    subject: `${subjectPrefix}: ${parcel.trackingNumber}`,
    text: `Your Parcel Pulse Cargo tracking number is ${parcel.trackingNumber}. Current status: ${parcel.currentStatus} at ${parcel.currentLocation}.`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a">
        <h2 style="margin-bottom:8px;color:#0f766e">Parcel Pulse Cargo</h2>
        <p>Your tracking number is <strong>${parcel.trackingNumber}</strong>.</p>
        <p>Status: <strong>${parcel.currentStatus}</strong><br/>Location: ${parcel.currentLocation}</p>
        <p>Service: ${parcel.serviceLevel || parcel.service}<br/>Route: ${parcel.origin} to ${parcel.destination}</p>
        <p>Support: support@parcelpulsecargo.com | +44 7828 243421</p>
      </div>
    `,
    attachments: [
      {
        filename: `${parcel.trackingNumber}.pdf`,
        content: pdf.toString("base64"),
      },
    ],
  });
}

export async function sendContactEmail(input: { name: string; email: string; phone?: string; message: string }) {
  return sendEmail({
    to: [process.env.CONTACT_TO || "support@parcelpulsecargo.com"],
    replyTo: input.email,
    subject: `Website enquiry from ${input.name}`,
    text: `${input.name}\n${input.email}\n${input.phone || ""}\n\n${input.message}`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a">
        <h2 style="margin-bottom:8px;color:#0f766e">Parcel Pulse Cargo contact enquiry</h2>
        <p><strong>Name:</strong> ${input.name}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p><strong>Phone:</strong> ${input.phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${input.message.replace(/\n/g, "<br/>")}</p>
      </div>
    `,
  });
}
