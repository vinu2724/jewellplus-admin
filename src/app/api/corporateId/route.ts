import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
export async function POST(request: NextRequest) {
  try {
    const { cId } = await request.json();
    const API_URL = API_ENDPOINTS.CORPORATE_ID;
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

    if (!cId) {
      return NextResponse.json(
        { success: false, message: "Corporate ID is required." },
        { status: 400 }
      );
    }

    const apiUrl = `${API_URL}/${cId}`;

    const bearerToken = request.cookies.get("bearerToken");

    // console.log(bearerToken);

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
      console.log("API Error:", errorMessage);

      return NextResponse.json(
        { success: false, message: "Failed to retrieve data from the server." },
        { status: response.status }
      );
    }

    // // If data exists, parse the response
    const data = await response.json();

    if (data.ClientId === "") {
      return NextResponse.json(
        { success: false, message: "The id does not exists" },
        { status: 400 }
      );
    }

    const res = NextResponse.json(
      { success: true, message: "Data retrieved successfully.", data },
      { status: 200 }
    );

    res.cookies.set({
      name: "Verified",
      value: "True",
      httpOnly: true,
      secure: false,
      path: "/",
    });

    return res;
  } catch (error) {
    console.log("Error occured while fetching data !", error);
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 501,
      }
    );
  }
}
