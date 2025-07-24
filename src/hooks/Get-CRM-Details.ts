import { useClient } from "@/context/ClientContext";
import { useEffect, useState } from "react";


export interface CustomerDetail {
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

const useGetCRMDetail = (code: string) => {
  const { clientData } = useClient();
  const [CRMDetail, setCRMDetail] = useState<CustomerDetail[]>([]); // Array instead of null
  const [loading, setLoading] = useState<boolean>(false);
  const [Detailerror, setDetailError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  useEffect(() => {
    const fetchSaleDetail = async () => {
      if (!code) return; // Only fetch if both fields are filled

      setLoading(true);
      setDetailError(null);
      try {
        const response = await fetch("/api/get-crm-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
           code: code,
         
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sales Details data");
        }

        const data: CustomerDetail[] = await response.json();
        setCRMDetail(data);
      } catch (Detailerror) {
        console.log("Error fetching sales Details data:", Detailerror);
        setDetailError("Failed to fetch sales Details data");
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetail();
  }, [code,dbUrl]);
  return { CRMDetail, Detailerror, loading };
};

export default useGetCRMDetail;
