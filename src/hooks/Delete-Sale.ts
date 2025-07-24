// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useState } from "react";

interface GetDeleteSale {
  "Delete Row Sale Main": number;
  "Delete Row Sale Detail Item": number;
}

const useDeleteSale = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const deleteSale = async (
    SearchDate: string,
    SearchCard: string
  ): Promise<GetDeleteSale | null> => {
    if (!SearchDate || !SearchCard) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/delete-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          dt: SearchDate,
          card: SearchCard,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete Sale record");
      }

      const data: GetDeleteSale = await response.json();
      console.log("API Response:", data); // Debug log
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error deleting Sale Note:", error);
      setError("Failed to delete Sale record");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { deleteSale, error, loading };
};

export default useDeleteSale;
