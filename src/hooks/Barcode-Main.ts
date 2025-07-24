import { useClient } from "@/context/ClientContext";
import { useUser } from "@/context/UserContext";
import { useCallback, useState } from "react";

export interface BarcodeMain {
  barcode: string;
  item_code: string;
  amount: number;
  counter: string;
  sale_dt: string;
  gross_wt: number;
  net_wt: number;
  making_on: string;
  making: number;
  category: string;
  bill_no: number;
  crt: number;
  type: string;
  black_bids: number;
  pcs: number;
  making_for: string;
  category_0: string;
  other_charges: number;
  disc: number;
  discount_on: string;
  ref_no: number;
  wastage: number;
  huid: number;
  dt: string;
}

const useBarcodeMain = () => {
  const { clientData } = useClient();
  const { userData } = useUser();
  const [barcodeMain, setBarcodeMain] = useState<BarcodeMain[]>([]);
  const [barcodeLoading, setBarcodeLoading] = useState<boolean>(false);
  const [barcodeError, setBarcodeError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  const BranchCode = userData?.branch_code_firm;

  const fetchBarcodeMain = useCallback(
    async (searchBarcode: string | null) => {
      if (!searchBarcode) return;

      setBarcodeLoading(true);
      setBarcodeError(null);
      try {
        const response = await fetch("/api/barcode-main", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            barcode: searchBarcode,
            branchcode: BranchCode,
          }),
        });

        if (response.status === 404) {
          setBarcodeMain([]);
          setBarcodeError("Barcode Not Found");
          return { status: 404, data: [] };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch barcode main data");
        }

        const data: BarcodeMain[] = await response.json();
        setBarcodeMain(data);
        return { status: 200, data };
      } catch (error) {
        console.error("Error fetching barcode main data:", error);
        setBarcodeError("Failed to fetch barcode main data");
        return { status: 500, data: [] };
      } finally {
        setBarcodeLoading(false);
      }
    },
    [dbUrl, BranchCode]
  );

  return {
    barcodeMain,
    barcodeError,
    barcodeLoading,
    fetchBarcodeMain,
  };
};

export default useBarcodeMain;
