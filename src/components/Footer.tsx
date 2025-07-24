"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();
  const hiddenRoutes = ["/corporateId", "/register", "/login"];

  const showSidebar = !hiddenRoutes.includes(pathname);

  return (
    <div
      className={`bg-gray-100 border-t text-sm text-black ${
        showSidebar ? "lg:ml-64" : ""
      }`}
    >
      <footer className="flex flex-col sm:flex-row justify-between items-center px-6 py-2 text-center sm:text-left">
        <a
          href="https://www.parasinfotech.co.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline"
        >
          <Image src="/diamond.png" alt="Logo" width={24} height={24} />
          <span className="font-semibold">JewellPlus Admin</span>
        </a>
        <div className="mt-2 sm:mt-0">© 2025 Developed by Paras Infotech</div>
      </footer>
    </div>
  );
}
