// hooks/useFingerprint.ts
import { useEffect, useState } from "react";
import { generateDeviceFingerprint } from "@/utils/fingerprint";

export default function useFingerprint(): string | null {
  const [fingerId, setFingerId] = useState<string | null>(null);

  useEffect(() => {
    const generateFingerId = async () => {
      if (typeof window !== "undefined") {
        let storedFingerId = localStorage.getItem("fingerId");

        if (storedFingerId) {
          localStorage.removeItem("fingerId");
          const { fingerprint } = await generateDeviceFingerprint();

          localStorage.setItem("fingerId", fingerprint);
          storedFingerId = fingerprint;
        } else {
          const { fingerprint } = await generateDeviceFingerprint();

          localStorage.setItem("fingerId", fingerprint);
          storedFingerId = fingerprint;
        }

        setFingerId(storedFingerId);
      }
    };
    //

    generateFingerId();
  }, []);

  return fingerId;
}
