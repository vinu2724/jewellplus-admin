// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetBarcodeDetail {
  sr_no: number;
  item_code: string | null;
  pcs: number | null;
  caret_wt: number | null;
  caret_rate: number | null;
  narration: string | null;
  making: number | null;
  amount: number;
}

const useBarcodeDetail = () => {
  const { clientData } = useClient();
  const [barcodeDetail, setBarcodeDetail] = useState<GetBarcodeDetail[]>([]); // Array instead of null
  const [loading, setLoading] = useState<boolean>(false);
  const [barcodeerror, setBarcodeError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const fetchBarcodeDetail = useCallback(
    async (searchBarcode: string | null) => {
      if (!searchBarcode) return;

      setLoading(true);
      setBarcodeError(null);
      try {
        const response = await fetch("/api/barcode-detail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            barcode: searchBarcode,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch barcode detail data");
        }

        const data = await response.json();
        // ✅ Defensive programming
        setBarcodeDetail(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching barcode detail data:", error);
        setBarcodeError("Failed to fetch barcode detail data");
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    barcodeDetail,
    barcodeerror,
    loading,
    fetchBarcodeDetail,
  };
};

export default useBarcodeDetail;
