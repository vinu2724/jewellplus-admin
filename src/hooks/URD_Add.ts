// import { useClient } from "@/context/ClientContext"; // Uncomment if you use a client context for DB info
import { useClient } from "@/context/ClientContext";
import { useState } from "react";

export interface URDMain {
  Dt: string;
  Card_No: string;
  User_Cd: string | null;
  Dt_Time: string;
  Trans_Type: string;
  User_Id: string;
  Bill_Type: string;
  Branch_Code: string;
  Code: number; // API expects number, e.g., 207
  Name: string | null;
  Address: string | null;
  Mobile: string;
}

export interface URDDetail {
  Item_Code: string;
  Narration: string | null;
  Crt: number; // API expects number, e.g., 22.00
  Pcs: number; // API expects number, e.g., 0
  Gross_Wt: number; // API expects number, e.g., 10.000
  Puriety_Per: number; // API expects number, e.g., 80.00
  Net_Wt: number; // API expects number, e.g., 8.000
  Rate: number; // API expects number, e.g., 9150.00
  Amount: number; // API expects number, e.g., 73000.00
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
  Diff_Amt: number; // API expects number, e.g., -200.00
  Eg_No: string | null;
  Eg_Rate: number | null;
  Gross_Wt1: number; // API expects number, e.g., 10.000
}

export interface URDResponse {
  "Insert Row ": number;
}

const useURDAdd = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`; // Constructing the DB URL
 
  const addURD = async (
    urdMainData: URDMain | null,
    urdDetailData: URDDetail[]
  ): Promise<URDResponse | null> => {
    if (!urdMainData || !urdDetailData || urdDetailData.length === 0) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/add-urd", { // Assuming your API endpoint is /api/urd_add
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Or 'omit'/'same-origin' based on your auth setup
        body: JSON.stringify({
          db: dbUrl, // As per your example
          urd_main: urdMainData,
          urd_detail: urdDetailData,
        }),
      });

      if (!response.ok) {
        
        throw new Error("Failed to save URD Note");
      }

      const data: URDResponse = await response.json();
      return data;
    } catch (err) {
      console.error("Error saving URD Note:", err);
      setError( "Failed to save URD Note");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addURD, error, loading };
};

export default useURDAdd;