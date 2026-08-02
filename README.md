# Komitt

Komitt is an AI-powered accountability platform for turning ambitious goals into practical execution loops. Users create goals, receive structured plans, complete daily check-ins, get personalized coaching feedback, and monitor progress through a focused dashboard.

The product is built as a clean Next.js frontend that connects to automation workflows for planning, reminders, coaching, and reporting.

## Product Overview

Komitt helps users answer four questions every day:

- What am I working toward?
- What should I do next?
- Did I follow through today?
- What needs to change tomorrow?

The experience is intentionally simple for users: sign in, create a goal, review the plan, complete daily tasks, check in, and let the coach adapt the next step.

## Core Features

- **Google sign-in** through Supabase Auth
- **Goal creation** for high-level outcomes such as learning a skill, losing weight, launching a startup, or reading more books
- **AI plan generation** that breaks goals into milestones and actionable tasks
- **Task management** with priority, due date, estimated duration, and completion state
- **Daily check-ins** with yes, partial, and no completion options
- **Reflection capture** for blockers, context, and behavior patterns
- **AI accountability feedback** based on progress, postponed tasks, and check-in history
- **Execution dashboard** with goals completed, tasks completed, weekly consistency, current streak, upcoming deadlines, task queue, and coaching insights
- **Email reminders** for daily accountability
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
| `POST` | `/webhook/goal-create` | Create a goal and trigger AI plan breakdown | `{ title, description }` |
| `POST` | `/webhook/checkin` | Save the daily check-in and trigger coaching feedback | `{ completion_status, reflection }` |
| `GET` | `/webhook/dashboard` | Fetch dashboard metrics, deadlines, and insights | none |

Every live request sends the user session token as:

```http
Authorization: Bearer <supabase-access-token>
```

n8n should verify the token before reading or writing user data. The workflow set is expected to handle:

- Supabase user verification
- Goal, milestone, task, check-in, and insight writes
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
public/
  icon.svg                    App icon
  og.svg                      Social sharing preview
```

## Database Model

The n8n workflows are designed around these Supabase tables:

- `profiles`
- `goals`
- `milestones`
- `tasks`
- `checkins`
- `ai_insights`

Supabase Auth owns the user identity. Application tables should reference the authenticated user and remain protected with row-level security for any direct client-side reads.

## Deployment Notes

Komitt can be deployed to any Next.js-compatible host. For production:

- Configure Google OAuth in Supabase
- Add the public Supabase URL and anon key to the hosting environment
- Add the n8n base URL to the hosting environment
- Import and activate the n8n workflows
- Configure n8n credentials for Supabase Postgres, OpenAI, and SMTP
- Confirm webhook URLs are reachable from the deployed frontend

## Status

Komitt currently includes the public landing page, auth entry flow, dashboard UI, webhook client, SEO metadata, app icon, and social sharing image. Live persistence and AI behavior depend on the connected Supabase and n8n workflow configuration.
