"use client";
import CryptoJS from "crypto-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Define the type of your client data
type ClientData = {
  ClientId: string;
  DbName: string;
  DbServerName: string;
  LicenseExtraDays: string;
  LicenseMobileUser: string;
  LicenseRateUser: string;
  LicenseSupportDate: string;
  LicenseUser: string;
  ServerIp: string;
  SysName: string;
};

// 2. Define the shape of your context
type ClientContextType = {
  clientData: ClientData | null;
  setClientData: (data: ClientData | null) => void;
};

// 3. Create the context
const ClientContext = createContext<ClientContextType | undefined>(undefined);
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

// 4. Provide the context
export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientData, setClientDataState] = useState<ClientData | null>(null);

  // Function to get access data from cookies and decrypt it
  function getAccessData(): string | null {
    if (typeof document === "undefined") return null; // SSR guard
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const clientDataCookie = cookies.find((cookie) =>
      cookie.startsWith("clientData=")
    );
    if (!clientDataCookie) return null;
    const encryptedClientData = clientDataCookie.replace("clientData=", "");
    const bytes = CryptoJS.AES.decrypt(encryptedClientData, secretKey!);
    const decryptedClientData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedClientData || null;
  }

  // Load from localStorage on first render
  useEffect(() => {
    const dataStr = getAccessData();
    if (dataStr) {
      try {
        const parsed: ClientData = JSON.parse(dataStr);
        setClientData(parsed);
      } catch (e) {
        // Optionally handle JSON parse error
        console.log("Failed to parse ClientData from cookies:", e);
        setClientData(null);
      }
    } else {
      setClientData(null);
    }
  }, []);

  // Function to set access data and update cookies
  const setClientData = (data: ClientData | null) => {
    setClientDataState(data);
    if (data) {
      const encrypteClientData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        secretKey!
      ).toString();
      document.cookie =
        "clientData=" + encrypteClientData + "; path=/; max-age=86400";
      document.cookie = "isLoggedIn=true; path=/; max-age=86400";
    } else {
      document.cookie = "clientData=; path=/; max-age=0";
      document.cookie = "isLoggedIn=; path=/; max-age=0";
    }
  };

  return (
    <ClientContext.Provider value={{ clientData, setClientData }}>
      {children}
    </ClientContext.Provider>
  );
};

// 5. Export a hook to use it
export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context)
    throw new Error("useClient must be used within a ClientProvider");
  return context;
};
