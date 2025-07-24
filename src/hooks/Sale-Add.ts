// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useState } from "react";
export interface SaleMain {
  Dt: string;
  Card_No: string;
  Delevery_By: string;
  Dt_Time: string;
  Accept_By: string | null;
  User_Nm: string;
  Code: number;
  Mobile: string;
  Name: string | null;
  Address: string | null;
  User_Id: string;
  Delevery_By_Id: number;
  Accept_By_Id: number;
  Bill_Type: string;
  Branch_Code: string;
}
export interface SaleDetail {
  Barcode: string | null;
  Item_Code: string;
  Narration: string;
  Counter: string;
  Crt: number;
  Pcs: number;
  Gross_Wt: number;
  Net_Wt: number;
  Rng_Wt: number;
  Making: number;
  Making_On: string;
  Making_Discount: number;
  Card_No: string;
  Rate: number;
  Making_Amt: number;
  Vat_Per: number;
  Amount: number;
  Vat_Amt: number;
  Sub_Doc_No: number;
  Item_No: number;
  Profit_Per: number;
  Item_Type: string;
  Dt: string;
  Unit: string;
  Default_Wt: number;
  Pcs_Applicable: string;
  Wt_Applicable: string;
  Ct_Applicable: string;
  Making_Applicable: string;
  St_Bal: number;
  St_Pcs: number;
  Bal: string;
  Making_For: string;
  Excise_Per: number;
  Excise_Amt: number;
  Discount_Per: number;
  User_Ent_Disc: number;
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
  Ref_No: string | null;
  Hm_Rate: number;
  Hm_Amount: number;
}

export interface SaleResponse {
  "Insert Row ": number;
}
const useSaleAdd = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const addSale = async (
    saleMainData: SaleMain | null,
    saleDetailData: SaleDetail[]
  ): Promise<SaleResponse | null> => {
    if (!saleMainData || !saleDetailData) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sale_add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          sale_main: saleMainData,
          sale_detail: saleDetailData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save sale");
      }

      const data: SaleResponse = await response.json();
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error save sale:", error);
      setError("Failed to save sale");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { addSale, error, loading };
};

export default useSaleAdd;
