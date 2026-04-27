# Parcel Pulse Cargo

Professional Next.js courier website for parcelpulsecargo.com.

## Features

- Public home page with hero cargo image and tracking lookup
- About, Services, Contact, Tracking, FAQ, Privacy, Terms, and Disclaimer pages
- Admin login under `/lex/auth`
- Admin dashboard for creating parcels and generating tracking numbers
- Parcel status updates for locations, airport/customs/immigration issues, delays, and delivery
- PDF shipment record generation
- Resend email notifications to sender and receiver with PDF attachments
- Supabase-backed shipment, update, and contact data

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Default local admin email is `ops@parcelpulsecargo.com` and password is `ChangeMeParcelPulse!`. Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` before production.

## Supabase Setup

Run the SQL in [schema.sql](/Users/stanlex/Documents/parcelpulsecargo/supabase/schema.sql) inside your Supabase SQL editor before using the production data layer.

The app uses:

- `SUPABASE_SERVICE_ROLE_KEY` on the server for shipment and contact CRUD
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-ready project metadata
- `RESEND_API_KEY` for shipment and contact emails

## Email Notes

Cloudflare email routing forwards inbound mail to Gmail. Outbound app email is now sent through Resend's email API.

If you want Supabase Auth to send its own emails through Resend, configure that in Supabase Dashboard > Authentication > SMTP Settings using Resend SMTP.

## Deployment

Deploy to Vercel, add the environment variables, then point `parcelpulsecargo.com` from Cloudflare to Vercel using Vercel's domain instructions.
