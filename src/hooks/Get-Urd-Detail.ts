// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetUrdMainDetail {
  Item_Code: string;
  Narration: string | null;
  Crt: number;
  Pcs: number;
  Gross_Wt: number;
  Puriety_Per: number;
  Net_Wt: number;
  Rate: number;
  Amount: number;
  Card_No: string;
  Sr_No: number;
  Counter: string;
  Item_Type: string;
  Dt: string;
  Type: string | null;
  Unit: string;
  Pcs_Applicable: string;
  Wt_Applicable: string;
  Ct_Applicable: string;
  Diff_Amt: number;
  Eg_No: string | null;
  Eg_Rate: number | null;
  Gross_Wt1: number;
}

const useGetUrdDetail = () => {
  const { clientData } = useClient();
  const [urdDetail, setUrdDetail] = useState<GetUrdMainDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Detailerror, setDetailError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;


  const fetchUrdDetail = useCallback(
    async (searchDate: string, searchCard: string) => {
      if (!searchDate || !searchCard) return;

      setLoading(true);
      setDetailError(null);
      try {
        const response = await fetch("/api/get-urd-detail", {
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
          setUrdDetail([]);
          setDetailError("card Not Found");
          return { status: 404, data: [] };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch sales Details data");
        }

        const data: GetUrdMainDetail[] = await response.json();
        setUrdDetail(data);
        return { status: 200, data };
      } catch (error) {
        console.error("Error fetching sales Details data:", error);
        setDetailError("Failed to fetch sales Details data");
        return { status: 500, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    urdDetail,
    Detailerror,
    loading,
    fetchUrdDetail,
  };
};

export default useGetUrdDetail;
