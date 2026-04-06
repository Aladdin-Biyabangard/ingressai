import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image url" }, { status: 400 });
  }

  try {
    // server tarafında fetch yapıyoruz (CORS yok!)
    const res = await fetch(imageUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";

    return new NextResponse(buffer, {
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server fetch failed" }, { status: 500 });
  }
}
