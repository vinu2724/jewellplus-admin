// fonts.ts
import { Inter, Poppins, Manrope, Roboto, Space_Grotesk } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600"], // Added medium and semi-bold weights
  variable: "--font-inter",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400"], // Light and Regular weights for a subtle feel
  variable: "--font-roboto",
  display: "swap",
});
export const spaceGrotesk = Space_Grotesk({
      subsets: ["latin"],
      weight: ["400", "500", "600", "700"], // Choose weights you need
      variable: "--font-space-grotesk",
      display: "swap",
    });

