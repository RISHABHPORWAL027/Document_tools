import { NextResponse } from "next/server";
import { getTool } from "@/lib/tools/registry";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ toolId: string }> },
) {
  const { toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  return NextResponse.json({
    tool: {
      id: tool.id,
      title: tool.title,
      summary: tool.summary,
      fields: tool.fields,
    },
  });
}

