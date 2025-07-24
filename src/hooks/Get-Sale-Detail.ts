// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetSaleDetail {
  Barcode: string | null;
  Item_Code: string | null;
  Narration: string | null;
  Counter: string | null;
  Crt: number | null;
  Pcs: number | null;
  Gross_Wt: number | null;
  Net_Wt: number;
  Rng_Wt: number;
  Making: number;
  Making_On: string;
  Making_Discount: number;
  Card_No: string | null;
  Rate: number | null;
  Making_Amt: number;
  Vat_Per: number | null;
  Amount: number;
  Vat_Amt: number | null;
  Sub_Doc_No: number;
  Item_No: number | null;
  Profit_Per: number | null;
  Item_Type: string | null;
  Dt: string | null;
  Unit: string | null;
  Default_Wt: number | null;
  Pcs_Applicable: string | null;
  Wt_Applicable: string | null;
  Ct_Applicable: string | null;
  Making_Applicable: string | null;
  St_Bal: number | null;
  St_Pcs: number | null;
  Bal: string | null;
  Making_For: string | null;
  Excise_Per: number | null;
  Excise_Amt: number;
  Discount_Per: number | null;
  User_Ent_Disc: number | null;
  Other_Charges: number | null;
  Discount: number | null;
  Discount_On: string | null;
  Discount_Amt: number;
  Rng_Pcs: number | null;
  Rng_Gross_Wt: number | null;
  Cgst_Per: number;
  Cgst_Amt: number;
  Sgst_Per: number;
  Sgst_Amt: number;
  Igst_Per: number;
  Igst_Amt: number;
  Cess_Per: number;
  Cess_Amt: number;
  Wastage: number | null;
  Huid: number | null;
  Ref_No: string | null;
  Hm_Rate: number;
  Hm_Amount: number;
}

const useGetSaleDetail = () => {
  const { clientData } = useClient();
  const [saleDetail, setSaleDetail] = useState<GetSaleDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Detailerror, setDetailError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchSaleDetail = useCallback(
    async (searchDate: string, searchCard: string) => {
      if (!searchDate || !searchCard) return;

      setLoading(true);
      setDetailError(null);
      try {
        const response = await fetch("/api/get-sale-detail", {
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
          setSaleDetail([]);
          setDetailError("card Not Found");
          return { status: 404, data: [] };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch sales Details data");
        }

        const data: GetSaleDetail[] = await response.json();
        setSaleDetail(data);
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
    saleDetail,
    Detailerror,
    loading,
    fetchSaleDetail,
  };
};

export default useGetSaleDetail;
