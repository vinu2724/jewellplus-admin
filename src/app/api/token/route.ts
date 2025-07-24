import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const API_URL = API_ENDPOINTS.GET_TOKEN;
    if (!API_URL) {
      console.error(
        "Error: NEXT_PUBLIC_GET_CLOSING_STOCK is not defined in the environment variables."
      );
      return NextResponse.json(
        {
          success: false,
          message: "API URL is missing in environment variables.",
        },
        { status: 500 }
      );
    }
    // Make post request
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: "abc", password: "xyz" }),
    });

    // console.log(await response.text())

    // Convert the response into json
    const bearerToken = await response.text();

    const res = NextResponse.json({ success: true }, { status: 200 });

    // Set the token inside cookie
    res.cookies.set("bearerToken", bearerToken, {
      httpOnly: true,
      secure: false,
      path: "/",
    });

    // Return the response data to the frontend
    return res;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch token",
    });
  }
}
