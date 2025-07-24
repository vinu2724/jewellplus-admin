import { useClient } from "@/context/ClientContext";
import { useEffect, useState } from "react";

export interface GetAzure {
  type: string;
  url: string;
  token: string;
}

const useAzureToken = () => {
  const { clientData } = useClient();
  const [getAzureTokenData, setGetAzureTokenData] = useState<GetAzure>(); // Array instead of null
  const [loading, setLoading] = useState<boolean>(false);
  const [azureTokenError, setAzureTokenError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  useEffect(() => {
    const fetchAzureToken = async () => {
      setLoading(true);
      setAzureTokenError(null);
      try {
        const response = await fetch("/api/get-azure-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Azure token data");
        }

        const data: GetAzure = await response.json();
        setGetAzureTokenData(data);
      } catch (Carderror) {
        console.log("Error fetching Azure Token data:", Carderror);
        setAzureTokenError("Failed to fetch azure Token data");
      } finally {
        setLoading(false);
      }
    };

    fetchAzureToken();
  }, [dbUrl]);

  return { getAzureTokenData, azureTokenError, loading };
};

export default useAzureToken;
