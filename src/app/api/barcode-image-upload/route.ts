// ...existing imports...
import { NextRequest, NextResponse } from "next/server";

// Helper to delete blobs with the same barcode but different extensions
async function deleteExistingBlobs(
  baseUrl: string,
  folderPath: string,
  barcode: string,
  token: string
) {
  const extensions = ["jpg", "jpeg", "png", "webp"];
  for (const ext of extensions) {
    const fileName = encodeURIComponent(`${barcode}.${ext}`);
    const blobPath = `${folderPath}/${fileName}`;
    const deleteUrl = `${baseUrl}/jewellplus/${blobPath}${token}`;
    // Try to delete, ignore errors (404 means not found, which is fine)
    await fetch(deleteUrl, { method: "DELETE" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const url = formData.get("url") as string;
    const token = formData.get("token") as string;
    const asFile = formData.get("asFile") as string;
    const asFolder = formData.get("asFolder") as string;
    const blbFile = formData.get("blbFile") as Blob;

    if (!blbFile || !asFile || !url || !asFolder || !token) {
      console.error("Missing data:", { blbFile, asFile, url, asFolder, token });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Encode the file name
    const encodedFileName = encodeURIComponent(asFile);

    // Ensure proper URL construction
    const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;
    const folderPath = asFolder.startsWith("/") ? asFolder.slice(1) : asFolder;

    // Delete any existing blobs for this barcode (with any extension)
    const barcode = asFile.split(".")[0];
    await deleteExistingBlobs(baseUrl, folderPath, barcode, token);

    // Construct blob path and full upload URL
    const blobPath = `${folderPath}/${encodedFileName}`;
    const uploadUrl = `${baseUrl}/jewellplus/${blobPath}${token}`;

    // Validate blob name (not full URL) length
    if (blobPath.length > 1024) {
      return NextResponse.json(
        { error: "Blob path exceeds length limit" },
        { status: 400 }
      );
    }

    // Upload to Azure
    const azureResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": blbFile.type,
      },
      body: blbFile,
    });

    if (azureResponse.status === 201) {
      console.log("Upload successful:", azureResponse.status);
      const responseText = await azureResponse.text();
      console.log("Response Text:", responseText);
      return NextResponse.json({ success: true });
    } else {
      const errorText = await azureResponse.text();
      console.error(
        "Azure upload failed:",
        azureResponse.status,
        azureResponse.statusText,
        errorText
      );
      return NextResponse.json(
        { error: "Upload failed", details: errorText },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
