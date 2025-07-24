import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
export async function POST(request: NextRequest) {
  try {
    // Get the API URL from environment variables
    const API_URL = API_ENDPOINTS.COUNTER_LIST;

    if (!API_URL) {
      console.error(
        "Error: NEXT_PUBLIC_COUNTER_LIST is not defined in the environment variables."
      );
      return NextResponse.json(
        {
          success: false,
          message: "API URL is missing in environment variables.",
        },
        { status: 500 }
      );
    }

    // Retrieve bearer token from cookies
    const bearerToken = request.cookies.get("bearerToken");

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Bearer token is missing." },
        { status: 401 }
      );
    }
    const body = await request.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken.value}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch counter list");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching counter list:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
