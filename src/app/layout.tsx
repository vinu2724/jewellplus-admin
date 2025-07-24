"use client";

import "./globals.css";
import SideMenuWrapper from "@/components/SideMenuWrapper";
import { UserProvider } from "@/context/UserContext";
import { ClientProvider } from "@/context/ClientContext";

import {
  PageNavigationLoaderProvider,
  usePageNavigationLoader,
} from "@/context/PageNavigationLoaderContext";
import PageLoaderModal from "@/components/Loader/Loader";
import { usePathname } from "next/navigation";
import { useEffect, Suspense, ReactNode } from "react";
import { inter, manrope, poppins } from "./fonts";
import { AccessProvider } from "@/context/UserAccess";
import Footer from "@/components/Footer";

function PageNavigationManager() {
  const { setIsPageLoading } = usePageNavigationLoader();
  const pathname = usePathname();

  useEffect(() => {
    setIsPageLoading(false);
  }, [pathname, setIsPageLoading]);

  return null;
}

function AppContent({ children }: { children: ReactNode }) {
  const { isPageLoading } = usePageNavigationLoader();
  return (
    <>
      <PageNavigationManager />
      {isPageLoading && <PageLoaderModal />}

      <SideMenuWrapper />
      <main>{children}</main>
      <Footer/>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>JewellPlus - Admin</title>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-85Z4VWP56J`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-85Z4VWP56J');
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <ClientProvider>
          <UserProvider>
            <AccessProvider>
              <PageNavigationLoaderProvider>
                <Suspense fallback={<PageLoaderModal />}>
                  <AppContent>{children}</AppContent>
                </Suspense>
              </PageNavigationLoaderProvider>
            </AccessProvider>
          </UserProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
