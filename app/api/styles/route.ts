import { NextResponse } from "next/server";
import { STYLE_PRESETS } from "@/lib/styles";

// GET /api/styles — return the list of style presets
export async function GET() {
  return NextResponse.json({ styles: STYLE_PRESETS });
}
