import { useAccess } from "@/context/UserAccess";
import { AccessItem, hasScreenAccess } from "@/utils/access";
import { useCallback, useEffect, useState } from "react";
// import CryptoJS from "crypto-js";
export const useAccessControl = (screenName: string) => {
  const { accessData } = useAccess();
  const [localAccess, setLocalAccess] = useState<AccessItem[]>([]);
  // const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;

  const getAccessData = useCallback((): string | null => {
    if (typeof document === "undefined") return null; // SSR guard
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const accessDataCookie = cookies.find((cookie) =>
      cookie.startsWith("accessData=")
    );
    if (!accessDataCookie) return null;
    const encrypted = accessDataCookie.replace("accessData=", "");
    // const bytes = CryptoJS.AES.decrypt(encrypted, secretKey!);
    // const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    return encrypted || null;
  }, []);

  useEffect(() => {
    if (accessData) {
      setLocalAccess(accessData);
    } else {
      const session = getAccessData();
      console.log("inside hook useAccessControl", session);

      if (session) {
        try {
          const parsed: AccessItem[] = JSON.parse(session);
          setLocalAccess(parsed);
        } catch (e) {
          // Optionally handle JSON parse error
          console.log("Failed to parse AccessData from cookies:", e);
          setLocalAccess([]);
        }
      } else {
        setLocalAccess([]);
      }
    }
  }, [accessData, getAccessData]);

  const check = (actionName: string) =>
    hasScreenAccess(localAccess, screenName, actionName);

  return {
    canCustom: (action: string) => check(action),
  };
};
