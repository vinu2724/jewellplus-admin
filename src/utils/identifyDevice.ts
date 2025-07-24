export interface DeviceInfo {
  type: "M" | "T" | "W"; // M = Mobile, T = Tablet, W = Desktop
  name: string;
}

export function detectAndLogDevice(): DeviceInfo {
  const ua =
    typeof navigator !== "undefined"
      ? navigator.userAgent ||
        navigator.vendor ||
        ((window as Window & { opera?: string }).opera ?? "")
      : "";

  const lowerUa = ua.toLowerCase();

  // Detect device type
  const isAndroid = /android/.test(lowerUa);
  const isIOS = /iphone|ipad|ipod/.test(lowerUa);
  const isTablet =
    /ipad/.test(lowerUa) || (isAndroid && !/mobile/.test(lowerUa));
  const isMobile = !isTablet && (isAndroid || isIOS);

  let type: DeviceInfo["type"];
  if (isTablet) {
    type = "T";
  } else if (isMobile) {
    type = "M";
  } else {
    type = "W";
  }

  // Extract device name
  let name = "";
  if (isAndroid) {
    const match = ua.match(/Android\s[\d.]+;\s([^)]+)/i);
    if (match && match[1]) {
      name = match[1].trim();
    }
  } else if (isIOS) {
    if (/ipad/.test(lowerUa)) {
      name = "iPad";
    } else if (/iphone/.test(lowerUa)) {
      name = "iPhone";
    } else if (/ipod/.test(lowerUa)) {
      name = "iPod";
    }
  } else {
    if (/windows/.test(lowerUa)) {
      name = "Windows PC";
    } else if (/macintosh/.test(lowerUa)) {
      name = "Macintosh";
    } else if (/linux/.test(lowerUa)) {
      name = "Linux PC";
    } else {
      name = "Desktop";
    }
  }

  // Fallback
  if (!name) {
    name =
      type === "M"
        ? "Mobile Device"
        : type === "T"
        ? "Tablet Device"
        : "Desktop";
  }

  // Log and return
  console.log("📱 Device Type:", type);
  console.log("🔍 Device Name:", name);

  return { type, name };
}
