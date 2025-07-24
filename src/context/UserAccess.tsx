"use client";
// import CryptoJS from "crypto-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Define the type of your Access data
type AccessData = {
  screen_name: string;
  action_name: string;
  action_flg: string;
};

// 2. Define the shape of your context
type AccessContextType = {
  accessData: AccessData[] | null;
  setAccessData: (data: AccessData[]) => void;
};

// 3. Create the context
const AccessContext = createContext<AccessContextType | undefined>(undefined);

// const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

// 4. Provide the context
export const AccessProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessData, setAccessDataState] = useState<AccessData[] | null>(null);

  // Function to get access data from cookies and decrypt it
  function getAccessData(): string | null {
    if (typeof document === "undefined") return null; // SSR guard
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const accessDataCookie = cookies.find((cookie) =>
      cookie.startsWith("accessData=")
    );
    if (!accessDataCookie) return null;
    const encrypted = accessDataCookie.replace("accessData=", "");
    // const bytes = CryptoJS.AES.decrypt(encrypted, secretKey!);
    // const decryptedAccessData = bytes.toString(CryptoJS.enc.Utf8);
    return encrypted || null;
  }
  useEffect(() => {
    const dataStr = getAccessData();
    if (dataStr) {
      try {
        const parsed: AccessData[] = JSON.parse(dataStr);
        setAccessData(parsed);
      } catch (e) {
        // Optionally handle JSON parse error
        console.log("Failed to parse AccessData from cookies:", e);
        setAccessData([]);
      }
    } else {
      setAccessData([]);
    }
  }, []);

  // Function to set access data and update cookies
  const setAccessData = (data: AccessData[]) => {
    setAccessDataState(data);
    // const encryptedAccessData = CryptoJS.AES.encrypt(
    //   JSON.stringify(data),
    //   secretKey!
    // ).toString();
    document.cookie =
      "accessData=" + JSON.stringify(data) + "; path=/; max-age=86400";
    document.cookie = "isLoggedIn=true; path=/; max-age=86400";
  };

  return (
    <AccessContext.Provider value={{ accessData, setAccessData }}>
      {children}
    </AccessContext.Provider>
  );
};

// 5. Export a hook to use it
export const useAccess = () => {
  const context = useContext(AccessContext);
  if (!context)
    throw new Error("useAccess must be used within a AccessProvider");
  return context;
};
