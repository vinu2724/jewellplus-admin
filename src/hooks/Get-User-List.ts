import { useCallback, useState } from "react";

import { useClient } from "@/context/ClientContext";
export interface GetUserList {
  user_name: string;
  user_id: number;
  branch_code: string;
}

interface APIGetUserList {
  user_name: string;
  user_id: number;
  branch_code: string;
}
const useGetUserList = () => {
  const { clientData } = useClient();

  const [getUserList, setGetUserList] = useState<GetUserList[]>([]);
  const [loadingUserList, setLoadingUserList] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchGetUserList = useCallback(async () => {
    try {
      const response = await fetch("/api/get-user-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch get user list data");
      }

      const data: APIGetUserList[] = await response.json();

      const transformed: GetUserList[] = data.map((cust) => ({
        user_name: cust.user_name,
        user_id: cust.user_id,
        branch_code: cust.branch_code,
      }));
      setGetUserList(transformed);
    } catch (error) {
      console.error("Error fetching get user list data:", error);
      setError("Failed to fetch get user list data");
    } finally {
      setLoadingUserList(false);
    }
  }, [dbUrl]);

  return {
    getUserList,
    error,
    loadingUserList,
    fetchGetUserList,
  };
};

export default useGetUserList;
