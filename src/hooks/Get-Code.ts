import { useClient } from "@/context/ClientContext";
import { useState } from "react";

interface GetCodeResponse {
  Code: string;
}
const useGetCode = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const getCode = async (
    searchType: string,
    searchDate: string
  ): Promise<GetCodeResponse | null> => {
    if (!searchType || !searchDate) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/get-crm-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          type: searchType,
          dt: searchDate,
          branch_code: "1",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get code");
      }

      const data: GetCodeResponse = await response.json();
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error getting code:", error);
      setError("Failed to getting code");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { getCode, error, loading };
};

export default useGetCode;
