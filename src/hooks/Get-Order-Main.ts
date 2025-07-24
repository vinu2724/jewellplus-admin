// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetOrderMain {
  Dt: string;
  Card_No: string;
  Flg: string;
  Dt_Time: string | null;
  Sg_Code: string;
  Narration: string | null;
  User_Cd: string | null;
  User_Nm: string;
  Name: string;
  Mobile: string;
  Address: string;
  Code: number;
  Delevery_By_Id: number | null;
  User_Id: string;
  Bill_Type: string;
  Branch_Code: string;
}

const useGetOrderMain = () => {
  const { clientData } = useClient();
  const [orderMainData, setOrderMainData] = useState<GetOrderMain[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Carderror, setCardError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchOrderMain = useCallback(
    async (searchDate: string, searchCard: string) => {
      if (!searchDate || !searchCard) return;

      setLoading(true);
      setCardError(null);
      try {
        const response = await fetch("/api/get-order-main", {
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
          setOrderMainData([]);
          setCardError("card Not Found");
          return { status: 404, data: [] };
        }
        if (!response.ok) {
          throw new Error("Failed to fetch order main data");
        }

        const data: GetOrderMain[] = await response.json();
        setOrderMainData(data);
        return { status: 200, data };
      } catch (error) {
        console.error("Error fetching order main  data:", error);
        setCardError("Failed to fetch order main  data");
        return { status: 500, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    orderMainData,
    Carderror,
    loading,
    fetchOrderMain,
  };
};

export default useGetOrderMain;
