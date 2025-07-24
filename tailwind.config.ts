import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  safelist: [
    "border-green-500",
    "bg-green-100",
    "text-green-800",
    "border-red-500",
    "bg-red-100",
    "text-red-800",
    "border-yellow-500",
    "bg-yellow-100",
    "text-yellow-800",
    "border-blue-500",
    "bg-blue-100",
    "text-blue-800",
  ],
  plugins: [
    function ({ addUtilities }: PluginAPI) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none", // Hides the scrollbar in WebKit browsers
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none", // Hides the scrollbar in IE/Edge
          "scrollbar-width": "none", // Hides the scrollbar in Firefox
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
