import { useCallback, useState } from "react";
import CryptoJS from "crypto-js";

import { useClient } from "@/context/ClientContext";
export interface Customer {
  code: number;
  name: string;
  address: string;
}

interface APICustomer {
  Code: number;
  Name: string;
  Address: string;
}
const useCRMList = () => {
  const { clientData } = useClient();

  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCRMList, setLoadingCRMList] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch("/api/dddw-crm-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: dbUrl,
          name: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CRM Details data");
      }

      const encrypted: string = await response.json();
      const bytes = CryptoJS.AES.decrypt(encrypted, secretKey!);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      const parsed: APICustomer[] = JSON.parse(decrypted);

      const transformed: Customer[] = parsed.map((cust) => ({
        code: cust.Code,
        name: cust.Name,
        address: cust.Address,
      }));
      setCustomers(transformed);
    } catch (error) {
      console.error("Error fetching CRM Details data:", error);
      setError("Failed to fetch CRM Details data");
    } finally {
      setLoadingCRMList(false);
    }
  }, [secretKey, dbUrl]);

  return {
    customers,
    error,
    loadingCRMList,
    fetchCustomers,
  };
};

export default useCRMList;
