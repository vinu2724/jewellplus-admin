import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { db, user_id } = await request.json();

    const API_URL = API_ENDPOINTS.GET_USER_PROFILE;

    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "API URL is missing in environment variables.",
        },
        { status: 500 }
      );
    }

    // ✅ Retrieve bearer token from cookies
    const bearerToken = request.cookies.get("bearerToken");

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Bearer token is missing." },
        { status: 401 }
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${bearerToken.value}`,
      },
      body: JSON.stringify({ db, user_id }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log("API Error:", errorMessage);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to send access data to server.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { success: true, message: "Data sent successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { success: false, message: "Error occurred while log in" },
      { status: 500 }
    );
  }
}
