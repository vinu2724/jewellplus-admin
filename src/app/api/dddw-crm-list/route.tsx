import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import CryptoJS from "crypto-js";
export async function POST(request: NextRequest) {
  try {
    // Get the API URL from environment variables
    const API_URL = API_ENDPOINTS.DDDW_CRM_LIST;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

    if (!API_URL) {
      console.error(
        "Error: NEXT_PUBLIC_DDDW_CRM_LIST is not defined in the environment variables."
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

    // Parse request body
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
      return NextResponse.json(
        { success: false, message: `API Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const encryptedCRMList = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey!
    ).toString();
    return NextResponse.json(encryptedCRMList);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
