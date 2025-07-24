// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useState } from "react";

export interface OrderMainType {
  Dt: string;
  Card_No: string;
  Flg: string;
  Dt_Time: string;
  Sg_Code: string | null;
  Narration: string | null;
  User_Cd: string | null;
  User_Nm: string | null;
  Name: string | null;
  Address: string | null;
  Code: number;
  Mobile: string;
  User_Id: string;
  Bill_Type: string;
  Branch_Code: string;
}
export interface OrderDetailType {
  Barcode: string | null;
  Item_Code: string;
  Item_Narration: string;
  Crt: number;
  Pcs: number; // Ensure it's a number
  Gross_Wt: number; // Ensure it's a number
  Net_Wt: number; // Ensure it's a number
  Rng_Wt: number; // Ensure it's a number
  Making: number;
  Making_On: string;
  Order_Type: string;
  Basic_Structure: string;
  Hall_Mark: string | null;
  F_Ring_Size: string;
  Lines: string;
  Length_Ruler: string;
  Length: string;
  Width_Ruler: string;
  Width: string;
  Breadth_Ruler: string;
  Breadth: string;
  Bangle_Size: string;
  Bangle_Box_Name: string;
  Bangle_Design_No: string;
  Chain_Hook_Type: string;
  Tops_Attachement: string;
  Polish_Type: string;
  Stone_Settng_Type: string;
  Design: string;
  Stock_Design_Cat: string;
  Stock_Design_No: string;
  Catelog_Name: string;
  Catelog_Page_No: string;
  Catelog_Design_No: string;
  Karigar_Code: string;
  Delivery_Days: number;
  Delivery_Date: string; // ISO string (e.g., "2025-02-22T00:00:00")
  Days_Name: string | null;
  Delivery_Time: string;
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
  Item_Type: string;
  Barcode_Counter: string | null;
  Dt: string; // ISO string
  Unit: string;
  Pcs_Applicable: string;
  Wt_Applicable: string;
  Ct_Applicable: string;
  Making_Applicable: string;
  Rate: number; // Ensure it's a number
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
  Wastage: number;
  Huid: string | null;
  Hm_Rate:number;
  Hm_Amount:number
}

export interface OrderResponse {
  "Insert Row ": number;
}
const useOrderAdd = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const setOrder = async (
    orderMainData: OrderMainType | null,
    orderDetailData: OrderDetailType[]
  ): Promise<OrderResponse | null> => {
    if (!orderMainData || !orderDetailData) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/order_add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          order_main: orderMainData,
          order_detail: orderDetailData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save order");
      }

      const data: OrderResponse = await response.json();
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error save order:", error);
      setError("Failed to save order");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { setOrder, error, loading };
};

export default useOrderAdd;
