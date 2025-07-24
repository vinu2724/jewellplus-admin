import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
  // { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
    // const clientId = (await params).clientId;
    const { clientId, SysName, fingerPrintId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { success: false, message: "Client ID is required." },
        { status: 400 }
      );
    }

    // Call the external API with the clientId
    const apiUrl = `${BASE_URL}login/device/${clientId}/${SysName}/${fingerPrintId}`;

    // Retrieve the `Bearer` token from cookies
    const bearerToken = request.cookies.get("bearerToken");

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Bearer token is missing." },
        { status: 401 }
      );
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken.value}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Device API Error:", errorMessage);

      return NextResponse.json(
        { success: false, message: "Failed to fetch device data." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { success: true, message: "Device data retrieved successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 509 }
    );
  }
}
