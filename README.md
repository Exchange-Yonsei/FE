# TableMate Yonsei

TableMate Yonsei is a mobile-first MVP web app for casual campus social meetups around Yonsei University. It helps exchange students, Korean students, and students near Sinchon find people for food, cafes, drinks, study sessions, trips, culture plans, sports, and small local experiences.

No payments. No settlement. No wallet. No bill splitting. Just meet people.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres with Row Level Security

## Included In The MVP

- Landing page with product copy and CTAs
- Public meetup browsing with category/date/open filters
- Public meetup detail page
- Host email/password signup and login
- Protected create meetup page
- Protected host dashboard
- Join requests without participant login
- Participant request status page at `/requests/[id]`
- WhatsApp link shown only to hosts and approved participants
- Supabase schema, RLS policies, and seed data
- Mock fallback meetups when Supabase env vars are not configured

## Intentionally Excluded

- Payments, settlement, bill splitting, money transfer, wallet, cards, PG integration
- OCR, receipt upload, receipt splitting
- Map API
- In-app chat
- Push or email notifications
- Admin pages
- University email verification
- OAuth or social login
- Recommendation algorithms
- Reviews or ratings

## Setup

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Supabase Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Supabase SQL Editor, run `supabase/rls.sql`.
4. Enable email/password auth in Supabase Auth settings.
5. Optional seed data:
   - Create a host account through `/signup`.
   - Copy that user's `auth.users.id`.
   - Replace `00000000-0000-0000-0000-000000000000` in `supabase/seed.sql`.
   - Run `supabase/seed.sql`.

## RLS Notes

Meetups are publicly readable because students can browse plans without logging in. The frontend selects only public fields for list/detail pages and does not request `whatsapp_link` there.

Participants do not have accounts in this MVP. Their request status page uses the participant UUID as a private claim link. The app avoids broad anonymous participant reads by using the `get_participant_request(request_id uuid)` SQL function. Anyone with the exact request UUID can view that single request, so the request URL should be treated as private.

## Local Development

```bash
npm run dev
```

Useful routes:

- `/`
- `/meetups`
- `/meetups/new`
- `/login`
- `/signup`
- `/dashboard`
- `/requests/[id]`

## Privacy Rule

The WhatsApp link is never shown on public meetup list or detail pages. It is only shown:

- to the meetup host in `/dashboard`
- to approved participants on `/requests/[id]`
