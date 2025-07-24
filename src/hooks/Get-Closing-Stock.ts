import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetClosingStock {
  Cl_Pcs: number;
  Cl_Item: number;
  Cl_Amt: number;
  Firm_Cd: string;
  Dt: string;
  Counter: string;
  Item_Code: string;
  Bar_Pcs: number;
  Bar_Wt: number;
  Bar_Amt: number;
  Cl_Wt: number;
  Item_Name: string;
  User_Code: string;
  Cl_Qty: number;
  Flg: string;
  Item_Type: string;
  User_Code_Id: number;
}

const useGetClosingStock = () => {
  const { clientData } = useClient();
  const [getClosingStock, setGetClosingStock] = useState<GetClosingStock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [getClosingStockerror, setClosingStockError] = useState<string | null>(
    null
  );
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchGetClosingStock = useCallback(
    async (searchDate: string) => {
      if (!searchDate) return;

      setLoading(true);
      setClosingStockError(null);
      try {
        const response = await fetch("/api/get-closing-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            dt: searchDate,
            user_id: "1",
            counter: "SH1",
          }),
        });

      

        const data: GetClosingStock[] = await response.json();
        setGetClosingStock(data);
      } catch (error) {
        console.error("Error fetching sales Details data:", error);
        setClosingStockError("Failed to fetch sales Details data");
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    getClosingStock,
    getClosingStockerror,
    loading,
    fetchGetClosingStock,
  };
};

export default useGetClosingStock;
