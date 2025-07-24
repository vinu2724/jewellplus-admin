import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const API_URL = API_ENDPOINTS.GET_ITEM_STOCK;
    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "API URL is missing in environment variables.",
        },
        { status: 500 }
      );
    }

    const bearerToken = request.cookies.get("bearerToken");
    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Bearer token is missing." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { db, ac_year, item_code, counter, dt } = body;

    if (!Array.isArray(item_code)) {
      return NextResponse.json(
        { success: false, message: "`item_code` must be an array." },
        { status: 400 }
      );
    }

    const fetchPromises = item_code.map((code) =>
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken.value}`,
        },
        body: JSON.stringify({
          db,
          ac_year,
          item_code: code,
          counter,
          dt,
        }),
      })
        .then((res) => res.json())
        .then((data) => ({
          item_code: code,
          data, // Could be object or array depending on external API
        }))
        .catch((err) => {
          console.error(`Error fetching for item_code ${code}:`, err);
          return {
            item_code: code,
            error: true,
            message: err.message,
          };
        })
    );

    const results = await Promise.all(fetchPromises);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
