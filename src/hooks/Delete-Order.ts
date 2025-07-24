import { useClient } from "@/context/ClientContext";
import { useState } from "react";

interface DeleteOrderResponse {
  "Delete Row Order Main": number;
  "Delete Row Order Detail Item": number;
}

const useDeleteOrder = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const deleteOrder = async (
    SearchDate: string,
    SearchCard: string
  ): Promise<DeleteOrderResponse | null> => {
    if (!SearchDate || !SearchCard) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/delete-order", {
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
        throw new Error("Failed to delete Order record");
      }

      const data: DeleteOrderResponse = await response.json();
      console.log("API Response:", data); // Debug log
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error deleting Order Note:", error);
      setError("Failed to delete Order record");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrder, error, loading };
};

export default useDeleteOrder;
