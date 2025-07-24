import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  try {
    // Get the API URL from environment variables
    const API_URL =API_ENDPOINTS.SALE_REGISTER_ITEM;
    console.log("API_URL:", API_URL);

    if (!API_URL) {
      console.error(
        'Error:SALE_REGISTER_ITEM is not defined in the environment variables.'
      );
      return NextResponse.json(
        {
          success: false,
          message: 'API URL is missing in environment variables.'
        },
        { status: 500 }
      );
    }
    // retrieve bearer Token from cookies
    const bearerToken = request.cookies.get('bearerToken');
    console.log("Bearer Token:", bearerToken?.value);

    // Check if token exists or not
    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: 'Bearer token is missing.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);

    // Fetch API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken.value}`
      },
      body: JSON.stringify(body)
    });
    console.log("External API response status:", response.status);

    const data = await response.json();
    console.log("External API response data:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in salesdata POST handler:", error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
