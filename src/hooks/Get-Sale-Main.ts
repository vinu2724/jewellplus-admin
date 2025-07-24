// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetSaleMain {
  Dt: string;
  Card_No: string;
  Delevery_By: string;
  User_Cd: string | null;
  Dt_Time: string;
  Accept_By: string | null;
  User_Nm: string;
  Code: number;
  Mobile: string;
  Name: string;
  Address: string;
  User_Id: string;
  Delevery_By_Id: number;
  Accept_By_Id: number;
  Bill_Type: string;
  Branch_Code: string;
}

const useGetSaleMain = () => {
  const { clientData } = useClient();
  const [saleMain, setSaleMain] = useState<GetSaleMain[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Carderror, setCardError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchSaleMain = useCallback(
    async (searchDate: string, searchCard: string) => {
      if (!searchDate || !searchCard) return;

      setLoading(true);
      setCardError(null);
      try {
        const response = await fetch("/api/get-sale-main", {
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
          setSaleMain([]);
          setCardError("card Not Found");
          return { status: 404, data: [] };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch sales Main data");
        }

        const data: GetSaleMain[] = await response.json();
        setSaleMain(data);
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
    saleMain,
    Carderror,
    loading,
    fetchSaleMain,
  };
};

export default useGetSaleMain;
