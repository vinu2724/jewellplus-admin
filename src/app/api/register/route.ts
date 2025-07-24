import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export async function POST(request: NextRequest) {
	try {

		 const API_URL = API_ENDPOINTS.REGISTER_DEVICE;
			
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
		const registerData = await request.json();

		if (!registerData) {
			return NextResponse.json(
				{ success: false, message: "Register data is required." },
				{ status: 400 }
			);
		}

    console.log(registerData);

		
		const bearerToken = request.cookies.get("bearerToken");

		if (!bearerToken) {
			return NextResponse.json(
				{ success: false, message: "Bearer token is missing." },
				{ status: 401 }
			);
		}

		const response = await fetch(API_URL, {
			method:"POST",
			headers: {
				"Content-Type":"application/json",
				Authorization:`Bearer ${bearerToken.value}`,
			},
			body: JSON.stringify(registerData),
		});

		const responseData = await response.json();
    
		return NextResponse.json(
			{
				success: true,
				message: "Registered Successfully",
				data: responseData,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: "Error occured fetching register data ",
				error: error instanceof Error ? error.message : error,
			},
			{
				status: 501,
			}
		);
	}
}
