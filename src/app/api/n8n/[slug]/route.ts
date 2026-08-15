import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

const ALLOWED_SLUGS = new Set([
  "dashboard",
  "generate-milestones",
  "goal-create",
  "checkin",
  "milestones",
  "checkin-history",
  "transcribe",
]);

async function handle(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  if (!ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ success: false, error: "Unknown webhook." }, { status: 404 });
  }

  const base = config.n8nBaseUrl;
  if (!base) {
    return NextResponse.json(
      { success: false, error: "NEXT_PUBLIC_N8N_BASE_URL is not configured." },
      { status: 500 },
    );
  }

  const n8nUrl = new URL(`${base.replace(/\/$/, "")}/webhook/${slug}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    n8nUrl.searchParams.set(key, value);
  });
  const authorization = req.headers.get("authorization");
  const body = req.method === "POST" ? await req.text() : undefined;

  let response: Response;
  try {
    response = await fetch(n8nUrl, {
      method: req.method,
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: `Could not reach the n8n webhook at ${n8nUrl.toString()}. Is n8n running?` },
      { status: 502 },
    );
  }

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  return handle(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  return handle(req, ctx);
}
