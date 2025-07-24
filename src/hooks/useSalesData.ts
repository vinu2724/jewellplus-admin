// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface SaleItem {
  Firm_Cd: string;
  Sale_Special_Main_Ac_Year: string;
  Trans_Type: string;
  Doc_No: number;
  Dt: string; // ISO Date string
  Sale_Special_Main_Name: string | null;
  Sale_Special_Detail_Sub_Doc_No: number;
  Sale_Special_Detail_Item_No: number;
  Sale_Special_Detail_Barcode: string | null;
  Sale_Special_Detail_Item_Code: string;
  Sale_Special_Detail_Rate: number;
  Sale_Special_Detail_Rng_Wt: number;
  Sale_Special_Detail_Making_Amt: number;
  Sale_Special_Detail_Amount: number;
  Sale_Special_Detail_Narration: string;
  Item_Master_Item_Name: string;
  Item_Type: string;
  Ac_Code: string;
  Account_Master_Ac_Name: string;
  Sale_Special_Detail_Crt: number;
  Sale_Special_Detail_Pcs: number;
  Sg_Code: string;
  Sale_Special_Detail_Making: number;
  Making_On: string;
  Item_Master_Item_Invontry: string;
  Item_Master_Item_Sub_Group: string | null;
  Item_Master_Ac_Code: string;
  Item_Master_Sg_Code: string;
  Vat_Per: number;
  Vat_Amt: number;
  Sale_Special_Detail_Counter: string;
  Sale_Special_Detail_Card_No: string | null;
  Sale_Special_Detail_Net_Wt: number;
  Sale_Special_Detail_Doc_Audit: string;
  User_Cd: string | null;
  Cust_Wt: number;
  Sale_Special_Main_Address: string | null;
  Sale_Special_Detail_Srv_Tax: number;
  Sale_Special_Detail_Making_Discount: number;
  Dt_Time: string; // Time in HH:mm:ss format
  Sale_Special_Main_Kyc_No: string;
  Bill_Type: string | null;
  Tcs_Amt: number;
  Tcs_Per: number;
  Excise_Amt: number;
  Other_Charges: number;
  Ac_Add1: string | null;
  Ac_Add2: string | null;
  Ac_City: string | null;
  Ac_Pin: string | null;
  Ac_Tel_Off: string | null;
  Ac_Mobile: string | null;
  Ac_Email: string | null;
  Ac_St_No: string | null;
  Ac_Pan_No: string;
  Discount_Amt: number;
  Sale_Special_Detail_Rng_Pcs: number;
  Account_Master_Gst_No: string | null;
  Item_Master_Hsn_Code: string;
  Cgst_Per: number;
  Cgst_Amt: number;
  Sgst_Per: number;
  Sgst_Amt: number;
  Igst_Per: number;
  Igst_Amt: number;
  Sale_Special_Main_Trans_Type1: string;
  Sale_Special_Main_Doc_No1: number;
  Gbs_No: string | null;
  Cess_Per: number;
  Cess_Amt: number;
  Huid: string | null;
  Sale_Special_Detail_User_Id: number;
  Sale_Special_Main_User_Id: string;
  Sale_Special_Main_Sales_Man_Id: string | null;
}

const useSalesData = () => {
  const { clientData } = useClient();
  const [data, setData] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchSalesData = useCallback(
    async (ac_year: string, from_dt: string, to_dt: string) => {
      if (!ac_year || !from_dt || !to_dt) return;
      console.log(" hook ac_year", ac_year);
      console.log(" hook from_dt", from_dt);
      console.log(" hook to_dt", to_dt);

      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/salesdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            ac_year: ac_year,
            from_dt: from_dt,
            to_dt: to_dt,
          }),
        });

        if (response.status === 404) {
          setData([]);
          setError("card Not Found");
          return { status: 404, data: [] };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch sales Details data");
        }

        const data: SaleItem[] = await response.json();
        setData(data);
        console.log("Sales data from hook:", data);
        return { status: 200, data };
      } catch (error) {
        console.error("Error fetching sales Details data:", error);
        setError("Failed to fetch sales Details data");
        return { status: 500, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    data,
    error,
    loading,
    fetchSalesData,
  };
};

export default useSalesData;
