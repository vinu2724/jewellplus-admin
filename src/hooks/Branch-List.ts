// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface BranchItem {
  firm_Cd: string;
  branch_Name: string;
  flg: string;
}

const useBranchData = () => {
  const { clientData } = useClient();
  const [branchData, setData] = useState<BranchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchBranchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/branch-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
        }),
      });

      if (response.status === 404) {
        setData([]);
        setError("card Not Found");
        return { status: 404, data: [] };
      }

      if (!response.ok) {
        throw new Error("Failed to fetch sales Details data");
      }

      const data: BranchItem[] = await response.json();
      setData(data);

      return { status: 200, data };
    } catch (error) {
      console.error("Error fetching sales Details data:", error);
      setError("Failed to fetch sales Details data");
      return { status: 500, data: [] };
    } finally {
      setLoading(false);
    }
  }, [dbUrl]);

  return {
    branchData,
    error,
    loading,
    fetchBranchData,
  };
};

export default useBranchData;
