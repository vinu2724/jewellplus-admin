// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useEffect, useState } from "react";

export interface CaretList {
  caret_code: number;
  metal_code: string;
  puriety_per: number;
  caret_name: string | null;
}
interface ApiCaretList {
  caret_code: number;
  metal_code: string;
  puriety_per: number;
  caret_name: string | null;
}

const useCaretList = (searchMetalCode: string = "") => {
  const { clientData } = useClient();
  const [caretCategoryloading, setCaretCategoryLoading] =
    useState<boolean>(true);
  const [caretCategoryError, setCaretCategoryError] = useState<string | null>(
    null
  );

  const [caretCategoryDropDown, setCaretCategoryDropDown] = useState<
    CaretList[]
  >([]);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  useEffect(() => {
    const fetchItemsCategory = async () => {
      if (!searchMetalCode.trim()) {
        // Skip API call if item_code is empty or not matched
        setCaretCategoryDropDown([]);
        setCaretCategoryLoading(false);
        return;
      }
      setCaretCategoryLoading(true);
      setCaretCategoryError(null);
      try {
        const response = await fetch("/api/caret-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            code: searchMetalCode,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch ItemCategory: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const data: ApiCaretList[] = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
          // No matching categories, clear the dropdown
          setCaretCategoryDropDown([]);
        } else {
          const NewCaretList: CaretList[] = data.map((CaretCategory) => ({
            caret_code: CaretCategory.caret_code,
            caret_name: CaretCategory.caret_name,
            metal_code: CaretCategory.metal_code,
            puriety_per: CaretCategory.puriety_per,
          }));
          setCaretCategoryDropDown(NewCaretList);
        }
      } catch (error) {
        console.log("Error fetching ItemCategory:", error);
        setCaretCategoryError(
          "Failed to fetch ItemCategory. Please try again."
        );
      } finally {
        setCaretCategoryLoading(false);
      }
    };

    fetchItemsCategory();
  }, [searchMetalCode, dbUrl]);

  return {
    caretCategoryDropDown,
    caretCategoryloading,
    caretCategoryError,
  };
};

export default useCaretList;
