"use client"; // Mark as client component

import { usePathname } from "next/navigation";
import SideMenu from "@/components/dashMenu";

export default function SideMenuWrapper() {
  const hiddenRoutes = ["/corporateId", "/register", "/login"];
  const pathname = usePathname();

  return !hiddenRoutes.includes(pathname) ? <SideMenu /> : null;
}
