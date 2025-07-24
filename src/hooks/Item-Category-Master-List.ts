import { useClient } from "@/context/ClientContext";
import { useEffect, useState } from "react";

export interface ItemCategoryMasterList {
  item_category: string;
  item_code: string;
  srate: number;
  sale_making: number;
  purchase_making: number;
  sale_making_on: string;
  crt: number;
  prate?: number; // Optional field for purchase rate
}
interface ApiItemCategoryMasterList {
  item_category: string;
  item_code: string;
  srate: number;
  sale_making: number;
  purchase_making: number;
  sale_making_on: string;
  crt: number;
  prate?: number; // Optional field for purchase rate
}

const useItemCategoryMasterList = (searchItemCode: string = "") => {
  const { clientData } = useClient();
  const [itemsCategoryloading, setItemsCategoryLoading] =
    useState<boolean>(true);
  const [itemsCategoryError, setItemsCategoryError] = useState<string | null>(
    null
  );
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  const [itemCategoryDropDown, setItemCategoryDropDown] = useState<
    ItemCategoryMasterList[]
  >([]);

  useEffect(() => {
    const fetchItemsCategory = async () => {
      if (!searchItemCode.trim()) {
        // Skip API call if item_code is empty or not matched
        setItemCategoryDropDown([]);
        setItemsCategoryLoading(false);
        return;
      }
      setItemsCategoryLoading(true);
      setItemsCategoryError(null);
      try {
        const response = await fetch("/api/item-category-master-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: dbUrl,
            item_code: searchItemCode,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch ItemCategory: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const data: ApiItemCategoryMasterList[] = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
          // No matching categories, clear the dropdown
          setItemCategoryDropDown([]);
        } else {
          const NewItemCategoryMasterList: ItemCategoryMasterList[] = data.map(
            (ItemCategory) => ({
              item_code: ItemCategory.item_code,
              item_category: ItemCategory.item_category,
              sale_making: ItemCategory.sale_making,
              purchase_making: ItemCategory.purchase_making,
              sale_making_on: ItemCategory.sale_making_on,
              srate: ItemCategory.srate,
              crt: ItemCategory.crt,
              prate: ItemCategory.prate,
            })
          );
          setItemCategoryDropDown(NewItemCategoryMasterList);
        }
      } catch (error) {
        console.log("Error fetching ItemCategory:", error);
        setItemsCategoryError(
          "Failed to fetch ItemCategory. Please try again."
        );
      } finally {
        setItemsCategoryLoading(false);
      }
    };

    fetchItemsCategory();
  }, [searchItemCode, dbUrl]);

  return {
    itemCategoryDropDown,
    itemsCategoryloading,
    itemsCategoryError,
  };
};

export default useItemCategoryMasterList;
