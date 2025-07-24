import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	(await cookies()).set("bearerToken", "", { expires: new Date(0), path: "/" });
	(await cookies()).set("Verified", "", { expires: new Date(0), path: "/" });
  const res= NextResponse.json({ message: "Logged out successfully" });
	res.cookies.set({
  name: "Verified",
  value: "false",
  httpOnly: true,
  secure: false,
  path: "/",
});

return res;
}
