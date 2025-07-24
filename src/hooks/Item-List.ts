// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useState, useEffect } from "react";

export interface Item {
  firm_Cd: string;
  item_Code: string;
  item_Group: string;
  item_Name: string;
  item_Name_M: string | null;
  unit: string;
  item_Type: string;
  item_Invontry: string;
  item_Sub_Group: string | null;
  shape: string | null;
  quality: string | null;
  size: string | null;
  colour: string | null;
  rate: number;
  prate: number;
  making_On: string;
  making: number;
  profit_Per: number;
  ac_Code: string;
  sg_Code: string;
  vat_Per: number;
  label_Name: null;
  stock_Code: string;
  default_Wt: number;
  crt: number;
  pcs_Applicable: string;
  wt_Applicable: string;
  ct_Applicable: string;
  making_Applicable: string;
  min_Order_Level: number;
  max_Order_Level: number;
  discount_Per: number;
  making_For: string;
  sman_Comm: number;
  sman_Comm_On: string;
  tcs_Per: number;
  excise_Per: number;
  otherch_Applicable: string;
  discount: number;
  discount_On: string;
  discount_Per_On: string;
  hsn_Code: null;
  gst_Per: number;
  sgst_Per: number;
  cgst_Per: number;
  cess_Per: number;
  loyalti_Per: number;
  loyalti_Per_On: string;
  category_Applicable: string | null;
  hm_Applicable: string;
  hm_Rate: number;
}
interface ApiItem {
  firm_Cd: string;
  item_Code: string;
  item_Group: string;
  item_Name: string;
  item_Name_M: string | null;
  unit: string;
  item_Type: string;
  item_Invontry: string;
  item_Sub_Group: string | null;
  shape: string | null;
  quality: string | null;
  size: string | null;
  colour: string | null;
  rate: number;
  prate: number;
  making_On: string;
  making: number;
  profit_Per: number;
  ac_Code: string;
  sg_Code: string;
  vat_Per: number;
  label_Name: null;
  stock_Code: string;
  default_Wt: number;
  crt: number;
  pcs_Applicable: string;
  wt_Applicable: string;
  ct_Applicable: string;
  making_Applicable: string;
  min_Order_Level: number;
  max_Order_Level: number;
  discount_Per: number;
  making_For: string;
  sman_Comm: number;
  sman_Comm_On: string;
  tcs_Per: number;
  excise_Per: number;
  otherch_Applicable: string;
  discount: number;
  discount_On: string;
  discount_Per_On: string;
  hsn_Code: null;
  gst_Per: number;
  sgst_Per: number;
  cgst_Per: number;
  cess_Per: number;
  loyalti_Per: number;
  loyalti_Per_On: string;
  category_Applicable: string | null;
  hm_Applicable: string;
  hm_Rate: number;
}

const useItemList = () => {
  const { clientData } = useClient();
  const [itemsNames, setItemNames] = useState<string[]>([]);
  const [ItemdropDown, setItemDropDown] = useState<Item[]>([]);
  const [Itemsloading, setItemsLoading] = useState<boolean>(true);
  const [Itemserror, setItemsError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  useEffect(() => {
    const fetchItems = async () => {
      setItemsLoading(true);
      setItemsError(null);

      try {
        const response = await fetch("/api/item-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            db: dbUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch item list");
        }

        const data: ApiItem[] = await response.json();

        const ItemList: Item[] = data.map((item) => ({
          firm_Cd: item.firm_Cd,
          item_Code: item.item_Code,
          item_Group: item.item_Group,
          item_Name: item.item_Name,
          item_Name_M: item.item_Name_M,
          unit: item.unit,
          item_Type: item.item_Type,
          item_Invontry: item.item_Invontry,
          item_Sub_Group: item.item_Sub_Group,
          shape: item.shape,
          quality: item.quality,
          size: item.size,
          colour: item.colour,
          rate: item.rate,
          prate: item.prate,
          making_On: item.making_On,
          making: item.making,
          profit_Per: item.profit_Per,
          ac_Code: item.ac_Code,
          sg_Code: item.sg_Code,
          vat_Per: item.vat_Per,
          label_Name: item.label_Name,
          stock_Code: item.stock_Code,
          default_Wt: item.default_Wt,
          crt: item.crt,
          pcs_Applicable: item.pcs_Applicable,
          wt_Applicable: item.wt_Applicable,
          ct_Applicable: item.ct_Applicable,
          making_Applicable: item.making_Applicable,
          min_Order_Level: item.min_Order_Level,
          max_Order_Level: item.max_Order_Level,
          discount_Per: item.discount_Per,
          making_For: item.making_For,
          sman_Comm: item.sman_Comm,
          sman_Comm_On: item.sman_Comm_On,
          tcs_Per: item.tcs_Per,
          excise_Per: item.excise_Per,
          otherch_Applicable: item.otherch_Applicable,
          discount: item.discount,
          discount_On: item.discount_On,
          discount_Per_On: item.discount_Per_On,
          hsn_Code: item.hsn_Code,
          gst_Per: item.gst_Per,
          sgst_Per: item.sgst_Per,
          cgst_Per: item.cgst_Per,
          cess_Per: item.cess_Per,
          loyalti_Per: item.loyalti_Per,
          loyalti_Per_On: item.loyalti_Per_On,
          category_Applicable: item.category_Applicable,
          hm_Applicable: item.hm_Applicable,
          hm_Rate: item.hm_Rate,
        }));

        setItemDropDown(ItemList);

        //console.log("Fetched Items:", data); // 👈 Add this to see the response
        const filteredData = data.filter((item) => item.item_Type !== "E");
        const formattedItems: string[] =
          filteredData.length > 0
            ? filteredData.map((item) => item.item_Name.trim())
            : [];

        setItemNames(formattedItems);
      } catch (Itemserror) {
        console.log("Error fetching items:", Itemserror);
        setItemsError("Failed to load items");
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, [dbUrl]);

  return { itemsNames, ItemdropDown, Itemsloading, Itemserror };
};

export default useItemList;
