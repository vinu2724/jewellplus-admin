import { useClient } from "@/context/ClientContext";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

interface DeleteClosingStock {
  "Delete Row Counter Stock": number;
}

const useDeleteClosingStock = () => {
  const { clientData } = useClient();
  const {userData} = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const userId = userData?.user_id; // Default to "1" if userId is not available
  const deleteClosingStock = async (
    SearchDate: string,
  ): Promise<DeleteClosingStock | null> => {
    if (!SearchDate) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/delete-closing-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          dt: SearchDate,
          user_id: userId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete Closing Stock record");
      }

      const data: DeleteClosingStock = await response.json();
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error deleting Closing Stock:", error);
      setError("Failed to delete Closing Stock record");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { deleteClosingStock, error, loading };
};

export default useDeleteClosingStock;
