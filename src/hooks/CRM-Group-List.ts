// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useEffect, useState } from "react";

export interface CRMGroup {
  Group_Name: string;
}

interface APICRMGroup {
  Group_Name: string;
}

const useCRMGroupList = () => {
  const { clientData } = useClient();
  const [group, setGroup] = useState<CRMGroup[]>([]);
  const [groupLoading, setGroupLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  useEffect(() => {
    const fetchCustomers = async () => {
      setGroupLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/crm-group-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.statusText}`);
        }

        const data: APICRMGroup[] = await response.json();

        const transformed: CRMGroup[] = data.map((group) => ({
          Group_Name: group.Group_Name,
        }));

        setGroup(transformed);
      } catch (error) {
        console.log("Error fetching group list:", error);
        setError("Failed to fetch group list. Please try again.");
      } finally {
        setGroupLoading(false);
      }
    };

    fetchCustomers();
  }, [dbUrl]);

  return { group, groupLoading, error };
};

export default useCRMGroupList;
