import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export async function POST(request: NextRequest) {
  try {

     const API_URL = API_ENDPOINTS.LOGIN_SYS;
    
        if (!API_URL) {
          console.error(
            "ERROR : process.env.NEXT_PUBLIC_ITEM_CATEGORY_MASTER_LIST  is not defined in the environment variables."
          );
          return NextResponse.json(
            {
              success: false,
              message: "API URL is missing in environment variables.",
            },
            { status: 500 }
          );
        }

    const { deviceId, db, id, password } = await request.json();

    const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

    if (!SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: "Secret key is not defined." },
        { status: 500 }
      );
    }

    const bytes = CryptoJS.AES.decrypt(password, SECRET_KEY);

    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedPassword) {
      return NextResponse.json(
        { success: false, message: "Failed to decrypt password." },
        { status: 400 }
      );
    }

    

    // retrieve bearer Token from cookies
    const bearerToken = request.cookies.get("bearerToken");

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Bearer token is missing." },
        { status: 401 }
      );
    }

    console.log("Sending request with:", {
      db,
      id,
      pass: decryptedPassword,
      deviceid: deviceId,
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${bearerToken.value}`,
      },
      body: JSON.stringify({
        db,
        id,
        pass: decryptedPassword,
        deviceid: String(deviceId),
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log("API Error:", errorMessage);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to send login data to server.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log("DATA IS", data);

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
