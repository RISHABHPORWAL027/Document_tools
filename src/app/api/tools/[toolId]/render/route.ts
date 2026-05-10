import { NextResponse } from "next/server";
import { getTool } from "@/lib/tools/registry";
import { renderHtml } from "@/lib/render/renderTemplate";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ toolId: string }> },
) {
  const { toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as
    | { values?: unknown }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const html = renderHtml(tool.template.source, body.values, { title: tool.title });
  return NextResponse.json({ html });
}

