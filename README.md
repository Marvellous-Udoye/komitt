# Komitt

Komitt is an AI-powered skill-accountability platform for turning learning goals into milestone-based execution loops. Users define what they want to learn, why it matters, which real-world outcome it supports, then check in against specific milestones and receive immediate coaching feedback.

The product is built as a clean Next.js frontend that connects to automation workflows for planning, reminders, coaching, and reporting.

## Product Overview

Komitt helps users answer four questions every day:

- What am I working toward?
- What should I do next?
- Did I follow through today?
- What needs to change tomorrow?

The experience is intentionally simple for users: sign in, create a learning goal, define or generate milestones, check in against a specific milestone, and let the coach adapt the next step.

Komitt's product position is:

> It's not telling you what you have to do, you already know what you want to do, it's making you accountable for that.

## Core Features

- **Google sign-in** through Supabase Auth
- **Learning goal creation** with required context, application/use-case tags, and target timing
- **Three-step goal wizard** for context, milestone structure, and schedule planning
- **AI milestone preview** through a non-destructive generation step before saving
- **Editable milestone plans** where users can add, remove, reorder, and date milestones
- **Milestone accountability** as the smallest unit of progress; tasks are intentionally not part of the model
- **Milestone check-ins** tied to one goal and one milestone, with multiple check-ins per day supported
- **Voice transcription** for goal descriptions and check-in context
- **Immediate AI coach feedback** returned after each check-in
- **Check-in history timeline** grouped by goal and milestone
- **Execution dashboard** with goals completed, milestones completed, weekly consistency, current streak, upcoming milestone deadlines, and coaching insights
- **Configurable daily summary hour** through `profiles.notification_hour`
- **Email summaries** for daily accountability
- **Responsive app shell** with desktop sidebar, sticky search header, mobile navigation, and floating goal creation action

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn-style UI primitives, lucide-react
- **Authentication:** Supabase Auth with Google OAuth
- **Database:** Supabase Postgres
- **Automation/backend:** n8n workflows
- **AI:** OpenAI through n8n orchestration
- **Notifications:** Email through n8n

## Architecture

Komitt keeps the frontend focused on product experience and delegates backend orchestration to n8n.

```text
User
  |
  v
Next.js Frontend
  |
  | Authenticated HTTP requests
  v
n8n Webhooks
  |--------> Supabase Postgres
  |--------> OpenAI
  |--------> Email notifications
  |
  v
Response back to UI
```

This keeps business logic, scheduled jobs, AI prompts, and notifications inside editable n8n workflows while the UI remains a fast, polished web application.

## n8n Integration

The frontend expects these webhook endpoints from the n8n backend:

| Method | Webhook | Purpose | Body |
|---|---|---|---|
| `POST` | `/webhook/generate-milestones` | Preview AI-suggested milestones without saving | `{ title, description, application_tags }` |
| `POST` | `/webhook/goal-create` | Persist the final goal and milestone list | `{ title, description, application_tags, milestones_source, target_start_date, target_end_date, milestones }` |
| `POST` | `/webhook/checkin` | Save a milestone check-in and return AI feedback | `{ goal_id, milestone_id, context, marks_milestone_complete }` |
| `GET` | `/webhook/dashboard` | Fetch dashboard metrics and upcoming milestone deadlines | none |
| `GET` | `/webhook/milestones?goal_id=X` | Fetch milestones for one goal | none |
| `GET` | `/webhook/checkin-history?goal_id=X&milestone_id=Y` | Fetch check-in history for one goal/milestone pair | none |
| `POST` | `/webhook/transcribe` | Convert voice input to text | `{ audio_base64, mime_type }` |

Every live request sends the user session token as:

```http
Authorization: Bearer <supabase-access-token>
```

n8n should verify the token before reading or writing user data. The workflow set is expected to handle:

- Supabase user verification
- Goal, milestone, check-in, and insight writes
- Dashboard metric queries
- OpenAI coaching and planning prompts
- Email delivery
- Scheduled daily reminders

## Environment Variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_N8N_BASE_URL=
```

`NEXT_PUBLIC_N8N_BASE_URL` should be the base URL of your n8n instance, without the `/webhook/...` path.

Example:

```env
NEXT_PUBLIC_N8N_BASE_URL=https://automation.example.com
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Project Structure

```text
src/
  app/
    page.tsx                  Landing page
    (auth)/                   Login, signup, OAuth callback
    (dashboard)/dashboard/    Dashboard route
  components/
    brand-logo.tsx            Komitt brand mark
    ui/                       UI primitives
  features/
    auth/                     Auth UI
    dashboard/                Product dashboard
    marketing/                Landing page preview components
  lib/
    auth-session.ts           Browser session helpers
    config.ts                 Public runtime config
    n8n-client.ts             Webhook client
    supabase-client.ts        Authenticated Supabase reads and narrow profile/milestone updates
public/
  icon.svg                    App icon
  og.svg                      Social sharing preview
```

## Database Model

The n8n workflows are designed around these Supabase tables:

- `profiles`
- `goals`
- `milestones`
- `checkins`
- `ai_insights`

Supabase Auth owns the user identity. All live frontend reads use the user's Supabase access token so row-level security keeps each user's goals, milestones, check-ins, and insights scoped to that user.
