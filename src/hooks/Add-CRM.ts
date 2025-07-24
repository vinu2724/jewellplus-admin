import { useClient } from "@/context/ClientContext";
import { useState } from "react";

export interface addCRM {
  Prefix: string;
  Name: string;
  Sex: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Area: string | null;
  City: string;
  Pincode: string;
  Telephone1: string | null;
  Telephone2: string | null;
  Telephone3: string | null;
  Mobile: string;
  Mobile_Flg: string;
  Birthday: string;
  Anniversary: string;
  Occupation: string | null;
  Category: string | null;
  Email: string;
  Email_Flg: string;
  Narration: string | null;
  Refrence_By: string | null;
  Mail_Flg: string;
  Firm_Cd: string;
  Ac_Year: string;
  User_Cd: string | null;
  Ac_Dt: string;
  Ac_Group: string;
  Ac_Sub_Group: string | null;
  Ac_Entered_By: string | null;
  Ac_Code: string;
  Last_Sale: string;
  Locality: string | null;
  Education: string | null;
  Know_About_Us: string | null;
  Purchase_Reason: string | null;
  Why_Choose_Us: string | null;
  Mflg: string;
  Loyalti_Code: string;
  User_Id: string;
  Ac_Entered_By_Id: number | null;
  Ac_Pan_No: string;
  Kyc_No: string;
}

export interface CRMResponse {
  Code: number;
}

const useCRMAdd = () => {
  const { clientData } = useClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const addCRM = async (addCRM: addCRM): Promise<CRMResponse | null> => {
    if (!addCRM) return null; // Ensure required fields are provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/add-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          crm: addCRM,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save CRM");
      }

      const data: CRMResponse = await response.json();
      return data; // Return the valid response object
    } catch (error) {
      console.error("Error save CRM:", error);
      setError("Failed to save CRM");
      return null; // Return null in case of an error
    } finally {
      setLoading(false);
    }
  };

  return { addCRM, error, loading };
};

export default useCRMAdd;
