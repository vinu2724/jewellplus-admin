// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

export interface GetItemRate {
  rate: number;
}

const useGetItemRate = () => {
  const { clientData } = useClient();
  const { userData } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const BranchCode = userData?.branch_code_firm;
  const getRate = async (
    searchItemCode: string,
    SearchDate: string,
    searchCrt: string,
    searchType: string
  ): Promise<GetItemRate | null> => {
    if (!searchItemCode || !SearchDate || !searchCrt || !searchType)
      return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/get_itemrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          branch_code: BranchCode,
          item_code: searchItemCode,
          dt: SearchDate,
          type: searchType,
          crt: searchCrt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get Rate");
      }

      const data: GetItemRate = await response.json();
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error getting Rate:", error);
      setError("Failed to getting Rate");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { getRate, error, loading };
};

export default useGetItemRate;
