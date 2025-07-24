// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetUrdMain {
  Dt: string; // ISO date string, e.g., "2025-05-01T00:00:00"
  Card_No: string;
  User_Cd: string | null;
  Dt_Time: string;
  Trans_Type: string;
  User_Id: string;
  Bill_Type: string;
  Branch_Code: string;
  Code: string | null;
  Name: string | null;
  Address: string | null;
  Mobile: string;
}

const useGetUrdMain = () => {
  const { clientData } = useClient();
  const [urdMain, setUrdMain] = useState<GetUrdMain[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Carderror, setCardError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchUrdMain = useCallback(
    async (searchDate: string, searchCard: string) => {
      if (!searchDate || !searchCard) return;

      setLoading(true);
      setCardError(null);
      try {
        const response = await fetch("/api/get-urd-main", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            dt: searchDate,
            card: searchCard,
          }),
        });

        if (response.status === 404) {
          setUrdMain([]);
          setCardError("card Not Found");
          return { status: 404, data: [] };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch sales Main data");
        }

        const data: GetUrdMain[] = await response.json();
        setUrdMain(data);
        return { status: 200, data };
      } catch (error) {
        console.error("Error fetching sales Main data:", error);
        setCardError("Failed to fetch sales MAin data");
        return { status: 500, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    urdMain,
    Carderror,
    loading,
    fetchUrdMain,
  };
};

export default useGetUrdMain;
