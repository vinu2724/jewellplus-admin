// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetOrderDetail {
  Barcode: string | null;
  Item_Code: string;
  Item_Narration: string | null;
  Crt: number;
  Pcs: number;
  Gross_Wt: number;
  Net_Wt: number;
  Rng_Wt: number;
  Making: number;
  Making_On: string;
  Order_Type: string | null;
  Basic_Structure: string | null;
  Hall_Mark: string | null;
  F_Ring_Size: string | null;
  Lines: string | null;
  Length_Ruler: string | null;
  Length: string | null;
  Width_Ruler: string | null;
  Width: string | null;
  Breadth_Ruler: string | null;
  Breadth: string | null;
  Bangle_Size: string | null;
  Bangle_Box_Name: string | null;
  Bangle_Design_No: string | null;
  Chain_Hook_Type: string | null;
  Tops_Attachement: string | null;
  Polish_Type: string | null;
  Stone_Settng_Type: string | null;
  Design: string | null;
  Stock_Design_Cat: string | null;
  Stock_Design_No: string | null;
  Catelog_Name: string | null;
  Catelog_Page_No: string | null;
  Catelog_Design_No: string | null;
  Karigar_Code: string | null;
  Delivery_Days: number;
  Delivery_Date: string;
  Days_Name: string | null;
  Delivery_Time: string | null;
  Old_Gold: string | null;
  Advance: string | null;
  Narration: string | null;
  Card_No: string;
  Sub_Doc_No: number;
  Counter: string;
  Item_No: number | null;
  Status: string;
  Nave_Year: string | null;
  Making_Amt: number;
  Vat_Per: number;
  Nave_Type: string | null;
  Nave_No: number;
  Vat_Amt: number;
  Amount: number;
  Item_Type: string | null;
  Barcode_Counter: string | null;
  Dt: Date;
  Unit: string;
  Pcs_Applicable: string;
  Wt_Applicable: string;
  Ct_Applicable: string;
  Making_Applicable: string;
  Rate: number;
  Making_For: string;
  Excise_Per: number;
  Excise_Amt: number;
  Other_Charges: number;
  Discount: number;
  Discount_On: string;
  Discount_Amt: number;
  Rng_Pcs: number;
  Rng_Gross_Wt: number;
  Cgst_Per: number;
  Cgst_Amt: number;
  Sgst_Per: number;
  Sgst_Amt: number;
  Igst_Per: number;
  Igst_Amt: number;
  Cess_Per: number;
  Cess_Amt: number;
  Wastage: string | null;
  Huid: string | null;
  Hm_Rate:number;
  Hm_Amount:number
}

const useGetOrderDetail = () => {
  const { clientData } = useClient();
  const [orderDetailData, setOrderDetailData] = useState<GetOrderDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Detailerror, setDetailError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchOrderDetail = useCallback(
    async (searchDate: string, searchCard: string) => {
      if (!searchDate || !searchCard) return;

      setLoading(true);
      setDetailError(null);
      try {
        const response = await fetch("/api/get-order-detail", {
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
          setOrderDetailData([]);
          setDetailError("card Not Found");
          return { status: 404, data: [] };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch order Details data");
        }

        const data: GetOrderDetail[] = await response.json();
        setOrderDetailData(data);
        return { status: 200, data };
      } catch (error) {
        console.error("Error fetching order Details data:", error);
        setDetailError("Failed to fetch order Details data");
        return { status: 500, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    orderDetailData,
    Detailerror,
    loading,
    fetchOrderDetail,
  };
};

export default useGetOrderDetail;
