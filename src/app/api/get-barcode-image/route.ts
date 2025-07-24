// src/app/api/get-barcode-image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const url = formData.get("url") as string;
    const token = formData.get("token") as string;
    const asFile = formData.get("asFile") as string;
    const asFolder = formData.get("asFolder") as string;

    if (!asFile || !url || !asFolder || !token) {
      console.error("Missing data:", { asFile, url, asFolder, token });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const encodedFileName = encodeURIComponent(asFile);
    const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;
    const folderPath = asFolder.startsWith("/") ? asFolder.slice(1) : asFolder;
    const blobPath = `${folderPath}/${encodedFileName}`;
    const imageUrl = `${baseUrl}/jewellplus/${blobPath}${token}`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${asFile}"`,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
