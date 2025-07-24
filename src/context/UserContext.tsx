"use client";
import CryptoJS from "crypto-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Define the type of your user data
type UserData = {
  username: string;
  counter: string;
  user_onwork: string;
  firm_cd: string;
  yearname: string;
  branch_code_firm: string;
  counter_name: string;
  user_branch_code: string;
  user_branch_type: string;
  firm_name: string;
  auto_generate: string;
  logrecord: string;
  from_dt: string;
  to_dt: string;
  user_id: string;
};

// 2. Define the shape of your context
type UserContextType = {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
};

// 3. Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

// 4. Provide the context
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);

  // Function to get access data from cookies and decrypt it
  function getAccessData(): string | null {
    if (typeof document === "undefined") return null; // SSR guard
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const userDataCookie = cookies.find((cookie) =>
      cookie.startsWith("userData=")
    );
    if (!userDataCookie) return null;
    const encryptedUserData = userDataCookie.replace("userData=", "");
    const bytes = CryptoJS.AES.decrypt(encryptedUserData, secretKey!);
    const decryptedUserData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedUserData || null;
  }

  // Load from localStorage on first render
  useEffect(() => {
    const stored = sessionStorage.getItem("userData");
    if (stored) {
      setUserDataState(JSON.parse(stored));
    }
  }, []);
  // Load from localStorage on first render
  useEffect(() => {
    const dataStr = getAccessData();
    if (dataStr) {
      try {
        const parsed: UserData = JSON.parse(dataStr);
        setUserData(parsed);
      } catch (e) {
        // Optionally handle JSON parse error
        console.log("Failed to parse userData from cookies:", e);
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, []);

  // Function to set access data and update cookies
  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
    if (data) {
      const encrypteUserData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        secretKey!
      ).toString();
      document.cookie =
        "userData=" + encrypteUserData + "; path=/; max-age=86400";
      document.cookie = "isLoggedIn=true; path=/; max-age=86400";
    } else {
      document.cookie = "userData=; path=/; max-age=0";
      document.cookie = "isLoggedIn=; path=/; max-age=0";
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// 5. Export a hook to use it
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
