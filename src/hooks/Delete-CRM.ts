import { useClient } from "@/context/ClientContext";
import { useState } from "react";

interface DeleteCRMResponse {
  "Delete Row CRM": number;
}

const useDeleteCRM = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const deleteCrmById = async (
    code: string
  ): Promise<DeleteCRMResponse | null> => {
    if (!code) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/delete-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete CRM record");
      }

      const data: DeleteCRMResponse = await response.json();
      console.log("API Response:", data); // Debug log
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error deleting CRM record:", error);
      setError("Failed to delete CRM record");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { deleteCrmById, error, loading };
};

export default useDeleteCRM;
