import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import CryptoJS from "crypto-js";

interface AccessProtection {
  action_name: string;
  action_flg: string;
}

export function middleware(request: NextRequest) {
  // const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("bearerToken")?.value;
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;
  const isVerified = request.cookies.get("Verified")?.value;
  const accessData = request.cookies.get("accessData")?.value;
  // const bytes = CryptoJS.AES.decrypt(accessData ?? "", secretKey);
  // const decryptedAccessData = bytes.toString(CryptoJS.enc.Utf8);

  const AccessProtection: Record<string, string> = {
    "/order": "Counter Order Delivery Note",
    "/urd": "Counter U.R.D. Purchase Note",
    "/sales": "Counter Delivery Note",
    "/closing-stock": "Closing Stock",
    "/customerprofiles": "Customer Master",
  };
  // Route-level access control
  const actionName = AccessProtection[pathname];
  if (actionName) {
    let hasAccess = true; // default allow
    try {
      let accessArr: AccessProtection[] = [];
      if (accessData) {
        accessArr = JSON.parse(accessData);
      }
      const found = accessArr.find(
        (item: AccessProtection) => item.action_name === actionName
      );
      if (found) {
        hasAccess = found.action_flg === "Y";
      }
    } catch (e) {
      console.error("Error parsing access data:", e);
      hasAccess = true; // default allow on error
    }
    if (!hasAccess) {
      // User does not have permission for this route
      return NextResponse.redirect(new URL("/customerprofiles", request.url));
    }
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const logData = {
    timestamp: new Date().toISOString(),
    method: request.method,
    pathname,
    ip,
    // token,
    isLoggedIn,
    // cookies: Object.fromEntries(request.cookies),
  };

  fetch(`${request.nextUrl.origin}/api/logger`, {
    method: "POST",
    body: JSON.stringify(logData),
    headers: { "Content-Type": "application/json" },
  }).catch(() => {});

  //list of protected routes
  const protectedRoutes = [
    "/sales",
    "/manage-crm",
    "/urd",
    "/datavisualization",
    "/customerprofiles",
    "/closing-stock",
    "/rate-master",
    "/product-list",
    "/counter-stock-transfer",
    "/cash-book-summary",
  ];

  const isProtected = protectedRoutes.includes(pathname);

  const notLoggedIn =
    !isLoggedIn || isLoggedIn === "false" || isLoggedIn === "undefined";
  const notVerified =
    !isVerified || isVerified === "false" || isVerified === "undefined";

  if (pathname == "/login" && notVerified) {
    return NextResponse.redirect(new URL("/corporateId", request.url));
  }

  const publicRoutes = ["/", "/corporateId"];

  if (isProtected && notLoggedIn) {
    return NextResponse.redirect(new URL("/corporateId", request.url));
  }

  const isPublic =
    publicRoutes.includes(pathname) || pathname.startsWith("/api");

  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/corporateId", request.url));
  }
  if (isLoggedIn === "undefined" && isProtected) {
    return NextResponse.redirect(new URL("/corporateId", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except _next assets and APIs
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
