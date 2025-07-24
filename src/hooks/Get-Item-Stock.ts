import { useClient } from "@/context/ClientContext";
import { useCallback, useState } from "react";

export interface GetItemStock {
  item_code: string;
  pcs?: number;
  wt?: number;
  error?: boolean;
  message?: string;
}

const useGetItemStock = () => {
  const { clientData } = useClient();
  const [getItemStock, setGetItemStock] = useState<GetItemStock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [getItemStockerror, setItemStockError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  console.log("ClientData", clientData);

  const fetchGetItemStock = useCallback(
    async (searchDate: string, ItemCodeArray: string[]) => {
      if (!searchDate) return;

      setLoading(true);
      setItemStockError(null);
      try {
        const response = await fetch("/api/get-item-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            ac_year: "2025-2026",
            item_code: ItemCodeArray,
            counter: "SH1",
            dt: searchDate,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Get Item Stock Details data");
        }

        const data: GetItemStock[] = await response.json();
        setGetItemStock(data);
      } catch (error: unknown) {
        console.error("Error fetching Get item stock Details data:", error);

        // Optional: narrow error type for safe access
        if (error instanceof Error) {
          setItemStockError(error.message);
        } else {
          setItemStockError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [dbUrl]
  );

  return {
    getItemStock,
    getItemStockerror,
    loading,
    fetchGetItemStock,
  };
};

export default useGetItemStock;
