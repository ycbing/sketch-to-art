import { NextRequest, NextResponse } from "next/server";
import { getSignedCosUrl } from "@/lib/cos";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const cosKey = path.join("/");
    const signedUrl = getSignedCosUrl(cosKey);

    const res = await fetch(signedUrl);
    if (!res.ok) {
      return new NextResponse(`COS error: ${res.status}`, { status: res.status });
    }

    const headers = new Headers(res.headers);
    headers.set("Cache-Control", "public, max-age=3600");
    // Allow CORS
    headers.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(res.body, {
      status: res.status,
      headers,
    });
  } catch (error) {
    console.error("COS proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
