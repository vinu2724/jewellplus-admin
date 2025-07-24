// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useState } from "react";

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

export interface AddClosingStock {
  "Insert Detail Row ": number;
}
const useAddClosingStock = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const AddClosingStock = async (
    closing_stock: GetClosingStock[]
  ): Promise<AddClosingStock | null> => {
    if (!closing_stock) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/add-closing-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          closing_stock: closing_stock,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save Closing Stock");
      }

      const data: AddClosingStock = await response.json();
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error save Closing Stock:", error);
      setError("Failed to save Closing Stock");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { AddClosingStock, error, loading };
};

export default useAddClosingStock;
