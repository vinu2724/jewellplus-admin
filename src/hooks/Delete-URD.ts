import { useClient } from "@/context/ClientContext";
import { useState } from "react";

interface GetDeleteUrd {
  "Delete Row URD Main": number;
  "Delete Row URD Detail Item": number;
}

const useDeleteUrd = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
 
  const deleteUrd = async (
    SearchDate: string,
    SearchCard: string
  ): Promise<GetDeleteUrd | null> => {
    if (!SearchDate || !SearchCard) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/delete-urd", {
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
        throw new Error("Failed to delete URD record");
      }

      const data: GetDeleteUrd = await response.json();
      console.log("API Response:", data); // Debug log
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error deleting urd Note:", error);
      setError("Failed to delete urd record");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { deleteUrd, error, loading };
};

export default useDeleteUrd;
