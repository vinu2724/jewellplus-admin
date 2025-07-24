"use client";
import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Optional icons

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b px-4 py-2 flex items-center justify-between">
      {/* Left: Logo + App Name */}
      <div className="flex items-center gap-2">
        <Image
          src="/diamond.png"
          alt="JewellPlus Logo"
          width={32}
          height={32}
        />
        <div>
          <h1 className="text-md font-bold text-gray-800">JewellPlus Admin</h1>
          <p className="text-xs text-gray-500 leading-tight">
            Inventory & CRM Management
          </p>
        </div>
      </div>

      {/* Right: Links and optional user */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="https://www.parasinfotech.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
        >
          <Info className="w-4 h-4" />
        </Link>

        <Link
          href="https://www.parasinfotech.co.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium hover:underline"
        >
          Powered by Paras Infotech
        </Link>
      </div>
    </header>
  );
}
