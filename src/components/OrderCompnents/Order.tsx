"use client";
import { ChangeEvent, useState, useCallback, useEffect, useRef } from "react";
import OrderBody from "./OrderBody";
import OrderHeader from "./OrderHeader";
import useItemList from "@/hooks/Item-List";
import useCaretList from "@/hooks/Caret-List";
import useItemCategoryMasterList from "@/hooks/Item-Category-Master-List";
import useCounterList from "@/hooks/Counter-List";
import useGetOrderDetail from "@/hooks/Get-Order-Detail";
import useOrderAdd, {
  OrderDetailType,
  OrderMainType,
  OrderResponse,
} from "@/hooks/Order-Add";
import useDeleteOrder from "@/hooks/Delete-Order";
import useGetCode from "@/hooks/Get-Code";
import Feedback from "@/utils/Alert";
import SubmitModal from "@/utils/SubmitModal";
import DeleteModal from "@/utils/DeleteModal";
import OrderFooter from "./OrderFooter";
import useBarcodeMain from "@/hooks/Barcode-Main";
import useBarcodeDetail from "@/hooks/Barcode-Detail";
import useGetItemRate from "@/hooks/Get-ItemRate";
import useGetOrderMain from "@/hooks/Get-Order-Main";
import { useUser } from "@/context/UserContext";
import PrintableOrderNote from "./PrintOrderNote";
import PreviewModal from "./PreviewModal";
import Button from "@/utils/Button";
import { useAccessControl } from "@/hooks/useAccessControl";
import useGetUserList from "@/hooks/Get-User-List";
import { OrderRawBtFormat } from "@/utils/formatReceiptForRawbt";
// import OrderFooter from "./OrderFooter";

//Define the type for the SalesMain structure
export interface OrderHeaderType {
  Dt: string; // ISO Date string e.g. "2025-02-19T00:00:00"
  Card_No: string;
  Flg: string; // Usually "O" for order
  Dt_Time: string; // e.g. "15:41"
  Sg_Code: string | null;
  Narration: string | null;
  User_Cd: string | null;
  User_Nm: string;
  Name: string | null;
  Address: string | null;
  Code: string;
  Mobile: string;
  User_Id: string;
  Bill_Type: string; // e.g. "B"
  Branch_Code: string;
}

// Define the type for the card structure
export interface OrderBodyType {
  Barcode: string | null;
  Item_Code: string;
  Item_Narration: string;
  Crt: string;
  Pcs: string | number; // Ensure it's a number
  Gross_Wt: string; // Ensure it's a number
  Net_Wt: string; // Ensure it's a number
  Rng_Wt: string; // Ensure it's a number
  Making: string;
  Making_On: string;
  Order_Type: string;
  Basic_Structure: string;
  Hall_Mark: string | null;
  F_Ring_Size: string;
  Lines: string;
  Length_Ruler: string;
  Length: string;
  Width_Ruler: string;
  Width: string;
  Breadth_Ruler: string;
  Breadth: string;
  Bangle_Size: string;
  Bangle_Box_Name: string;
  Bangle_Design_No: string;
  Chain_Hook_Type: string;
  Tops_Attachement: string;
  Polish_Type: string;
  Stone_Settng_Type: string;
  Design: string;
  Stock_Design_Cat: string;
  Stock_Design_No: string;
  Catelog_Name: string;
  Catelog_Page_No: string;
  Catelog_Design_No: string;
  Karigar_Code: string;
  Delivery_Days: string;
  Delivery_Date: string; // ISO string (e.g., "2025-02-22T00:00:00")
  Days_Name: string | null;
  Delivery_Time: string;
  Old_Gold: string | null;
  Advance: string | null;
  Narration: string | null;
  Card_No: string;
  Sub_Doc_No: number;
  Counter: string;
  Item_No: number | null;
  Status: string;
  Nave_Year: string | null;
  Making_Amt: string;
  Vat_Per: number;
  Nave_Type: string | null;
  Nave_No: number;
  Vat_Amt: number;
  Amount: string;
  Item_Type: string;
  Barcode_Counter: string | null;
  Dt: string; // ISO string
  Unit: string;
  Pcs_Applicable: string;
  Wt_Applicable: string;
  Ct_Applicable: string;
  Making_Applicable: string;
  Rate: string; // Ensure it's a number
  Making_For: string;
  Excise_Per: number;
  Excise_Amt: number;
  Other_Charges: string;
  Discount: string;
  Discount_On: string;
  Discount_Amt: string;
  Rng_Pcs: number;
  Rng_Gross_Wt: string;
  Cgst_Per: number;
  Cgst_Amt: number;
  Sgst_Per: number;
  Sgst_Amt: number;
  Igst_Per: number;
  Igst_Amt: number;
  Cess_Per: number;
  Cess_Amt: number;
  Wastage: number;
  Huid: string | null;
  Hm_Rate: string;
  Hm_Amount: string;
}

// Define the type for the FooterFormData structure
export interface FooterFormData {
  totalGrossWt: string;
  totalNetWt: string;
  totalRNGWt: string;
  basicAmount: string;
  totalOtherCharges: string;
  makingAmount: string;
  totalDiscount: string;
  totalTax: string;
  totalAmount: string;
  makingDiscount: string;
  rateDiscount: string;
  fullDiscount: string;
}

const initialOrderMain: OrderHeaderType = {
  Dt: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
  Card_No: "",
  Flg: "O",
  Dt_Time: new Date().toTimeString().slice(0, 5), // "HH:MM",
  Sg_Code: null,
  Narration: null,
  User_Cd: null,
  User_Nm: "",
  Name: null,
  Address: null,
  Code: "",
  Mobile: "",
  User_Id: "",
  Bill_Type: "B",
  Branch_Code: "1",
};

//initially card blank value
const initialOrderDetails: OrderBodyType = {
  Barcode: "",
  Item_Code: "",
  Item_Narration: "",
  Crt: "",
  Pcs: 0,
  Gross_Wt: "0.000",
  Net_Wt: "0.000",
  Rng_Wt: "0.000",
  Making: "0.00",
  Making_On: "",
  Order_Type: "",
  Basic_Structure: "",
  Hall_Mark: null,
  F_Ring_Size: "",
  Lines: "",
  Length_Ruler: "",
  Length: "",
  Width_Ruler: "",
  Width: "",
  Breadth_Ruler: "",
  Breadth: "",
  Bangle_Size: "",
  Bangle_Box_Name: "",
  Bangle_Design_No: "",
  Chain_Hook_Type: "",
  Tops_Attachement: "",
  Polish_Type: "",
  Stone_Settng_Type: "",
  Design: "",
  Stock_Design_Cat: "",
  Stock_Design_No: "",
  Catelog_Name: "",
  Catelog_Page_No: "",
  Catelog_Design_No: "",
  Karigar_Code: "",
  Delivery_Days: "",
  Delivery_Date: "",
  Days_Name: "",
  Delivery_Time: "",
  Old_Gold: "",
  Advance: "",
  Narration: null,
  Card_No: "",
  Sub_Doc_No: 1,
  Counter: "",
  Item_No: null,
  Status: "",
  Nave_Year: null,
  Making_Amt: "0.00",
  Vat_Per: 0,
  Nave_Type: null,
  Nave_No: 0,
  Vat_Amt: 0,
  Amount: "0.00",
  Item_Type: "",
  Barcode_Counter: null,
  Dt: new Date().toISOString().split("T")[0],
  Unit: "",
  Pcs_Applicable: "",
  Wt_Applicable: "",
  Ct_Applicable: "",
  Making_Applicable: "",
  Rate: "0.00",
  Making_For: "",
  Excise_Per: 0,
  Excise_Amt: 0,
  Other_Charges: "0.00",
  Discount: "0",
  Discount_On: "M",
  Discount_Amt: "0.00",
  Rng_Pcs: 0,
  Rng_Gross_Wt: "0.000",
  Cgst_Per: 0,
  Cgst_Amt: 0,
  Sgst_Per: 0,
  Sgst_Amt: 0,
  Igst_Per: 0,
  Igst_Amt: 0,
  Cess_Per: 0,
  Cess_Amt: 0,
  Wastage: 0,
  Huid: null,
  Hm_Rate: "0.00",
  Hm_Amount: "0.00",
};

//Start Main Function
export default function Order() {
  const { canCustom } = useAccessControl("w_counter_order");
  //FormData initailly formdata with type card value used State
  const [orderMain, setOrderMain] = useState<OrderHeaderType>(initialOrderMain);

  //desfined State for Cards from Card Type and getting value from initialFormData
  const [orderDetail, setOrderDetails] = useState<OrderBodyType[]>([
    { ...initialOrderDetails },
  ]);
  // User Data from user login
  const { userData } = useUser();

  // Item-List hooks Calling
  const { ItemdropDown } = useItemList();
  //used for selecte item Caret Type from Item-List hooks
  const [selectedCaretType, setSelectedCaretType] = useState<string | null>(
    null
  );
  //used for selecte item code from Item-List hooks
  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  //handle Change Event Defined
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | Date | null) => {
      if (event instanceof Date || event === null) {
        // Handle the date change (DatePicker)
        setOrderMain((prev) => ({
          ...prev,
          Dt: event ? event.toISOString().split("T")[0] : "", // Convert to ISO string
        }));
      } else {
        // Handle input change for other fields
        const { name, value } = event.target;
        setOrderMain((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    [] // Add dependencies here if needed (e.g., if setFormData comes from props or context)
  );

  //handleBillTypeChange event define here for OrderHeader props
  // Reverse mapping also:
  const billTypeReverseMapping = {
    ACCOUNT: "B",
    SHOP: "E",
  } as const;

  const handleBillTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOrderMain((prev) => ({
      ...prev,
      Bill_Type:
        billTypeReverseMapping[value as keyof typeof billTypeReverseMapping] ||
        "",
    }));
  };
  //handleSalesmanChange event define here for OrderHeader props
  const handleSalesmanChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOrderMain({ ...orderMain, User_Nm: event.target.value });
  };
  //handleSalesmanChange event define here for OrderHeader props
  // Reverse mapping also:
  const flgTypeReverseMapping = {
    ORDER: "O",
    REPAIRING: "R",
  } as const;

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOrderMain((prev) => ({
      ...prev,
      Flg:
        flgTypeReverseMapping[value as keyof typeof flgTypeReverseMapping] ||
        "",
    }));
  };

  // Update Card Fuction from each card
  const updateCard = (index: number, updatedCard: OrderBodyType) => {
    const selectedItem = ItemdropDown.find(
      (item) => item.item_Name === updatedCard.Item_Code
    );
    setOrderDetails((prevCards) =>
      prevCards.map((card, i) =>
        i === index
          ? {
              ...updatedCard,
            }
          : card
      )
    );

    // Update the item Type for category fetching
    setSelectedCaretType(selectedItem?.item_Type || null);
    // Update the item code for category fetching
    setSelectedItemCode(selectedItem?.item_Code || null);
  };

  const prevCardNoRef = useRef<string>(orderMain.Card_No);
  // This effect handles resetting the entire form when Card_No is cleared by the user
  useEffect(() => {
    const currentCardNo = orderMain.Card_No;
    const previousCardNo = prevCardNoRef.current;

    if (previousCardNo && !currentCardNo) {
      setOrderMain(initialOrderMain);
      setOrderDetails([{ ...initialOrderDetails }]);
      setSelectedItemCode(null);
      setSelectedCaretType(null);
    }

    // Update the ref for the next render
    prevCardNoRef.current = currentCardNo;
  }, [orderMain.Card_No]);

  //Caret-List hooks Calling
  const { caretCategoryDropDown } = useCaretList(selectedCaretType || "");
  // item-category-master-list hook calling
  const { itemCategoryDropDown } = useItemCategoryMasterList(
    selectedItemCode || ""
  );

  // Handle Add Item event with useCallback Function
  const handleAddItem = useCallback(() => {
    setOrderDetails((prevCards) => [
      ...prevCards,
      { ...initialOrderDetails, Sub_Doc_No: prevCards.length + 1 },
    ]);
    console.log("Order Details", orderDetail);
  }, [orderDetail]);

  const lastUpdatedBarcodeRef = useRef<string | null>(null);

  //Handle delete card event with respect to specific index
  const deleteCard = useCallback((index: number) => {
    setOrderDetails((prevCards) => {
      const barcodeToDelete = prevCards[index]?.Barcode;

      // If no barcode, delete only the clicked card
      if (!barcodeToDelete) {
        const updatedCards = prevCards.filter((_, i) => i !== index);
        // Reset lastUpdatedBarcodeRef if needed
        lastUpdatedBarcodeRef.current = null;
        return updatedCards.length > 0
          ? updatedCards
          : [{ ...initialOrderDetails }];
      }

      // Delete all cards with the same barcode
      const updatedCards = prevCards.filter(
        (card) => card.Barcode !== barcodeToDelete
      );

      // Reset lastUpdatedBarcodeRef if needed
      lastUpdatedBarcodeRef.current = null;

      // Ensure at least one card remains
      return updatedCards.length > 0
        ? updatedCards
        : [{ ...initialOrderDetails }];
    });
  }, []);

  // Counter list hooks calling
  const { counterDropDown } = useCounterList();

  const { orderMainData, fetchOrderMain } = useGetOrderMain();
  const { orderDetailData, fetchOrderDetail } = useGetOrderDetail();

  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  // Handle barcode change and set active barcode & index
  // In your main component
  const handleCard_NoChange = async (cardNo: string) => {
    // If either returns 404, show feedback
    if (cardNo.length < 5) {
      setMessage("Enter Correct Card No");
      setTitle("warning");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const OrderMainRes = await fetchOrderMain(orderMain.Dt, cardNo);
    await fetchOrderDetail(orderMain.Dt, cardNo);

    if (OrderMainRes?.data[0] === undefined) {
      setMessage("Card Is Empty");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
  };

  // Fetch Sale Details and Update Card Data
  useEffect(() => {
    if (orderMain.Card_No && orderDetailData && orderDetailData.length > 0) {
      const updatedCards = orderDetailData.map((detail) => {
        const matchingItem = ItemdropDown?.find(
          (item) => item.item_Code === detail.Item_Code
        );
        const matchingCounter = counterDropDown?.find(
          (item) => item.code === detail.Counter
        );

        return {
          ...initialOrderDetails, // Keep existing fields
          Item_Code: matchingItem ? matchingItem.item_Name : "",
          Barcode: detail.Barcode ? String(detail.Barcode) : "",
          Item_Narration: detail.Item_Narration || "",
          Narration: detail.Narration,
          Card_No: detail.Card_No ? detail.Card_No : "",
          Crt: detail.Crt ? `${detail.Crt.toFixed(2)}K` : "",
          Delivery_Days: detail.Delivery_Days
            ? Number(detail.Delivery_Days).toFixed(0)
            : "0",
          Days_Name: detail.Days_Name ? detail.Days_Name : "",
          Delivery_Date: detail.Delivery_Date
            ? detail.Delivery_Date.toString().split("T")[0]
            : "",
          Pcs: detail.Pcs ? Number(detail.Pcs).toFixed(0) : "0",
          Sub_Doc_No: detail.Sub_Doc_No ? detail.Sub_Doc_No : 1,
          Gross_Wt: detail.Gross_Wt
            ? Number(detail.Gross_Wt).toFixed(3)
            : "0.000",

          Net_Wt: detail.Net_Wt ? Number(detail.Net_Wt).toFixed(3) : "0.000",

          Rng_Gross_Wt: Number(detail.Rng_Gross_Wt).toFixed(3) ?? "0.000",
          Rng_Wt: Number(detail.Rng_Wt).toFixed(3) ?? "0.000",
          Rate: detail.Rate ? Number(detail.Rate).toFixed(2) : "0.00",

          Amount: Number(detail.Amount).toFixed(2) ?? "0.00",
          Discount_Amt: detail.Discount_Amt
            ? Number(detail.Discount_Amt).toFixed(2)
            : "0.00",
          Other_Charges: Number(detail.Other_Charges).toFixed(2) ?? "0.00",
          Cgst_Per: detail.Cgst_Per ? detail.Cgst_Per : 0,
          Cgst_Amt: detail.Cgst_Amt ? detail.Cgst_Amt : 0,
          Sgst_Per: detail.Sgst_Per ? detail.Sgst_Per : 0,
          Sgst_Amt: detail.Sgst_Amt ? detail.Sgst_Amt : 0,
          Igst_Per: detail.Igst_Per ? detail.Igst_Per : 0,
          Igst_Amt: detail.Igst_Amt ? detail.Igst_Amt : 0,
          Cess_Per: detail.Cess_Per ? detail.Cess_Per : 0,
          Cess_Amt: detail.Cess_Amt ? detail.Cess_Amt : 0,
          Making: detail.Making ? Number(detail.Making).toFixed(2) : "0.00",
          Making_Amt: detail.Making_Amt
            ? Number(detail.Making_Amt).toFixed(2)
            : "0.00",
          Discount: detail.Discount
            ? Number(detail.Discount).toFixed(2)
            : "0.00",
          Discount_On: detail.Discount_On || "",
          Barcode_Counter: matchingCounter ? matchingCounter.name : "",
          Making_On: detail.Making_On || "",
          Hm_Rate: detail.Hm_Rate ? Number(detail.Hm_Rate).toFixed(2) : "0.00",
          Hm_Amount: detail.Hm_Amount
            ? Number(detail.Hm_Amount).toFixed(2)
            : "0.00",
        };
      });

      setOrderDetails(updatedCards);
    }
  }, [orderDetailData, orderMain, ItemdropDown, counterDropDown]);

  //////////////////
  const { barcodeMain, fetchBarcodeMain } = useBarcodeMain();
  const { barcodeDetail, fetchBarcodeDetail } = useBarcodeDetail();
  const [activeIndex, setActiveIndex] = useState<number>(0); // or null if needed
  const [activeBarcode, setActiveBarcode] = useState<string | null>(null);

  // Handle barcode change and set active barcode & index
  const handleBarcodeChange = async (index: number, newBarcode: string) => {
    // Check for duplicate barcode
    const duplicateIndex = orderDetail.findIndex(
      (card, i) => card.Barcode === newBarcode && i !== index
    );
    if (duplicateIndex !== -1) {
      setMessage(
        `Barcode "${newBarcode}" is already entered at Sr. ${
          duplicateIndex + 1
        }.`
      );
      setTitle("info");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Clear previous barcode data before fetching new
    await fetchBarcodeMain(null); // Pass null/empty to reset
    await fetchBarcodeDetail(null);

    // Now fetch new data and check for 404
    const mainRes = await fetchBarcodeMain(newBarcode);
    if (mainRes?.status === 404) {
      setMessage("Barcode Not Found.");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    await fetchBarcodeDetail(newBarcode);

    // After both fetches are done, set active state
    setActiveIndex(index);
    setActiveBarcode(newBarcode);
  };

  const { getRate } = useGetItemRate();
  useEffect(() => {
    if (
      !activeBarcode ||
      lastUpdatedBarcodeRef.current === activeBarcode ||
      activeIndex === null
    ) {
      return;
    }

    const updateCardsFromBarcode = async () => {
      // Wait for barcodeMain and barcodeDetail to be available
      let retries = 10;
      while ((barcodeMain.length === 0 || !barcodeDetail) && retries > 0) {
        await new Promise((r) => setTimeout(r, 100));
        retries--;
      }

      // 🟢 If barcodeMain is not found or is not an array, show feedback and return
      if (!Array.isArray(barcodeMain) || barcodeMain.length === 0) {
        setMessage("Barcode Not Found.");
        setTitle("error");
        setTimeout(() => setMessage(null), 3000);

        setActiveBarcode(null); // Optionally reset activeBarcode to avoid loop
        return;
      }

      const main = barcodeMain[0];
      const matchingItem = ItemdropDown?.find(
        (item) => item.item_Code === main.item_code
      );

      const matchingCounter = counterDropDown?.find(
        (item) => item.code === main.counter
      );
      if (
        matchingCounter &&
        userData?.branch_code_firm &&
        matchingCounter.branch_Code !== userData.branch_code_firm
      ) {
        setMessage(
          "The label branch is different. You can not sale this label here."
        );
        setTitle("error");
        setTimeout(() => setMessage(null), 3000);
        setActiveBarcode(null);
        return;
      }

      // 🟢 Fetch the rate here
      let rate = "0.00";
      if (matchingItem?.item_Code && orderMain.Dt && main.crt) {
        const S = "S";
        const isRate = await getRate(
          matchingItem?.item_Code || "",
          orderMain.Dt,
          String(main.crt.toFixed(2)),
          S
        );
        rate = isRate?.rate ? Number(isRate.rate).toFixed(2) : "0.00";
      }

      setOrderDetails((prevCards) => {
        const updatedCards = [...prevCards];

        const isMainRender =
          matchingItem?.item_Type === "T" &&
          main.gross_wt == 0 &&
          main.amount == 0;

        if (matchingItem?.item_Type === "F") {
          rate = String(main.amount.toFixed(2)) ?? "0.00";
        }

        // Ensure cards has enough slots
        if (barcodeDetail.length > 0) {
          const requiredLength = isMainRender
            ? activeIndex + barcodeDetail.length
            : activeIndex + barcodeDetail.length + 1;
          while (updatedCards.length < requiredLength) {
            updatedCards.push({ ...initialOrderDetails });
          }
        }

        let SaleWeight = 0;
        if (matchingItem) {
          if (matchingItem?.item_Type === "F") {
            SaleWeight = main.pcs - updatedCards[activeIndex].Rng_Pcs;
          } else {
            SaleWeight = main.net_wt - Number(updatedCards[activeIndex].Rng_Wt);
          }
        }
        // 🟢 Only assign main values if NOT the "T" type with zero weights/amount
        if (!isMainRender) {
          // Fill activeIndex with barcodeMain[0]
          updatedCards[activeIndex] = {
            ...updatedCards[activeIndex],
            Item_Code: matchingItem?.item_Name || "",
            Narration: main.category,
            Crt: `${main.crt.toFixed(2)}K`,
            Pcs: main.pcs?.toFixed(0) ?? "0",
            Gross_Wt: main.gross_wt?.toFixed(3) ?? "0.000",
            Net_Wt: main.net_wt?.toFixed(3) ?? "0.000",
            Making: main.making?.toFixed(2) ?? "0.00",
            Making_On: main.making_on,
            Other_Charges: main.other_charges?.toFixed(2) ?? "0.00",
            Discount_On: main.discount_on,
            Barcode: main.barcode,
            Cgst_Per: matchingItem?.cgst_Per || 0,
            Sgst_Per: matchingItem?.sgst_Per || 0,
            Hm_Rate: String(matchingItem?.hm_Rate) ?? "0.00",
            Rate: rate,
            Amount: (SaleWeight * Number(rate)).toFixed(2),

            Barcode_Counter: matchingCounter
              ? matchingCounter.name
              : orderDetail[activeIndex].Counter,
          };

          // Fill subsequent indexes with barcodeDetail
          barcodeDetail.forEach((detail, idx) => {
            const index = activeIndex + idx + 1;
            const matchingItem = ItemdropDown?.find(
              (item) => item.item_Code === barcodeDetail[idx].item_code
            );
            updatedCards[index] = {
              ...updatedCards[index],
              Item_Code: matchingItem?.item_Name || "",
              Narration: detail.narration ?? "",
              Barcode: main.barcode,
              Pcs: detail.pcs?.toFixed(0) ?? "0",
              Gross_Wt: detail.caret_wt?.toFixed(3) ?? "0.000",
              Net_Wt: detail.caret_wt?.toFixed(3) ?? "0.000",
              Rate: detail.caret_rate?.toFixed(2) ?? "0.00",
              // Amount: detail.amount?.toFixed(2) ?? "0.00",
              Making: detail.making?.toFixed(2) ?? "0.00",
              Rng_Pcs: 0,
              Rng_Gross_Wt: "0.000",
              Rng_Wt: "0.000",
              Sub_Doc_No: index + 1,
              Other_Charges: "0.00",
              Discount: "0.00",
              Cgst_Per: matchingItem?.cgst_Per || 0,
              Sgst_Per: matchingItem?.sgst_Per || 0,
              Hm_Rate: String(matchingItem?.hm_Rate) ?? "0.00",
              Barcode_Counter: matchingCounter
                ? matchingCounter.name
                : orderDetail[activeIndex].Counter,
            };
          });
        } else {
          // barcodeDetail starts at activeIndex
          barcodeDetail.forEach((detail, idx) => {
            const index = activeIndex + idx;
            const matchingItem = ItemdropDown?.find(
              (item) => item.item_Code === detail.item_code
            );
            updatedCards[index] = {
              ...updatedCards[index],
              Item_Code: matchingItem?.item_Name || "",
              Narration: detail.narration ?? "",
              Barcode: main.barcode,
              Pcs: detail.pcs?.toFixed(0) ?? "0",
              Gross_Wt: detail.caret_wt?.toFixed(3) ?? "0.000",
              Net_Wt: detail.caret_wt?.toFixed(3) ?? "0.000",
              Rate: detail.caret_rate?.toFixed(2) ?? "0.00",
              // Amount: detail.amount?.toFixed(2),

              Making: detail.making?.toFixed(2) ?? "0.00",
              Rng_Pcs: 0,
              Rng_Gross_Wt: "0.000",
              Rng_Wt: "0.000",
              Sub_Doc_No: index + 1,
              Other_Charges: "0.00",
              Discount: "0.00",
              Cgst_Per: matchingItem?.cgst_Per || 0,
              Sgst_Per: matchingItem?.sgst_Per || 0,
              Hm_Rate: String(matchingItem?.hm_Rate) ?? "0.00",
              Barcode_Counter: matchingCounter
                ? matchingCounter.name
                : orderDetail[activeIndex].Counter,
            };
          });
        }
        return updatedCards;
      });

      lastUpdatedBarcodeRef.current = activeBarcode;
      setActiveBarcode(null);
    };

    updateCardsFromBarcode();
    // eslint-disable-next-line
  }, [
    barcodeMain,
    barcodeDetail,
    activeBarcode,
    ItemdropDown,
    counterDropDown,
    orderMain.Dt,
    getRate,
    activeIndex,
  ]);

  // Order-Footer Login Starting ---->
  const [footerData, setFooterData] = useState<FooterFormData>({
    totalGrossWt: "",
    totalNetWt: "",
    totalRNGWt: "",
    basicAmount: "",
    totalOtherCharges: "",
    makingAmount: "",
    totalDiscount: "",
    totalTax: "",
    totalAmount: "",
    makingDiscount: "",
    rateDiscount: "",
    fullDiscount: "",
  });

  // footer value change/Calulations
  useEffect(() => {
    const totals = orderDetail.reduce(
      (acc, details) => {
        acc.totalGrossWt += parseFloat(details.Gross_Wt) || 0;
        acc.totalNetWt += parseFloat(details.Net_Wt) || 0;
        acc.totalRngWt += parseFloat(details.Rng_Wt) || 0;
        acc.totalBasicAmount += parseFloat(details.Amount) || 0;
        acc.totalOtherCharges += parseFloat(details.Other_Charges) || 0.0;
        acc.totalMakingAmount += parseFloat(details.Making_Amt) || 0.0;
        acc.totalDiscount += parseFloat(details.Discount_Amt) || 0.0;
        acc.totalTax +=
          details.Cgst_Amt + details.Sgst_Amt + details.Igst_Amt || 0.0;
        acc.totalAmount +=
          (parseFloat(details.Amount) || 0) +
          (parseFloat(details.Other_Charges) || 0) +
          (parseFloat(details.Making_Amt) || 0) +
          (parseFloat(details.Hm_Amount) || 0) +
          (details.Cgst_Amt || 0) +
          (details.Sgst_Amt || 0) +
          (details.Igst_Amt || 0) -
          (parseFloat(details.Discount_Amt) || 0);

        return acc;
      },
      {
        totalGrossWt: 0,
        totalNetWt: 0,
        totalRngWt: 0,
        totalBasicAmount: 0,
        totalOtherCharges: 0,
        totalMakingAmount: 0,
        totalDiscount: 0,
        totalTax: 0,
        totalAmount: 0,
      }
    );
    // Custom rounding logic
    const roundOffAmount = (value: number): number => {
      const decimal = value - Math.floor(value);
      return decimal <= 0.49 ? Math.floor(value) : Math.ceil(value);
    };
    // value get in FooterData through setfooterData
    setFooterData({
      totalGrossWt: totals.totalGrossWt.toFixed(3),
      totalNetWt: totals.totalNetWt.toFixed(3),
      totalRNGWt: totals.totalRngWt.toFixed(3),
      basicAmount: totals.totalBasicAmount.toFixed(2),
      totalOtherCharges: totals.totalOtherCharges.toFixed(2),
      makingAmount: totals.totalMakingAmount.toFixed(2),
      totalDiscount: totals.totalDiscount.toFixed(2),
      totalTax: totals.totalTax.toFixed(2),
      totalAmount: roundOffAmount(totals.totalAmount).toFixed(2),
      makingDiscount: "",
      rateDiscount: "",
      fullDiscount: "",
    });
  }, [orderDetail, footerData.totalAmount]);

  //FormData initailly formdata with type card value used State
  const { deleteOrder } = useDeleteOrder(); //delete order api call
  const { setOrder } = useOrderAdd(); //delete order api call
  const { getCode } = useGetCode(); //delete order api call
  const [finalCard_No, setFinalCard_No] = useState("");
  const [responseData, setResponseData] = useState<OrderResponse | null>(null);

  const { getUserList, fetchGetUserList } = useGetUserList();
  // ✅ Fetch only once on date change (not on every render)
  useEffect(() => {
    fetchGetUserList();
  }, [fetchGetUserList]);

  //FormData initailly formdata with type card value used State
  const [main, setMain] = useState<OrderMainType>();
  //desfined State for Cards from Card Type and getting value from initialFormData
  const [detail, setDetail] = useState<OrderDetailType[]>();

  const handleSubmit = async () => {
    if (!canCustom("Modify") && orderMain.Card_No) {
      setMessage("You do not have permission to modify this items.");
      setTitle("warning");
      setTimeout(() => setMessage(null), 3000);
      return null;
    }
    // Check for compulsory delivery date
    if (
      canCustom("Order Delivery Date Compulsory") &&
      orderDetail.some(
        (card) => !card.Delivery_Date || card.Delivery_Date.trim() === ""
      )
    ) {
      setMessage("Delivery Date is compulsory for all items.");
      setTitle("warning");
      setTimeout(() => setMessage(null), 3000);
      return null;
    }
    if (isSubmitting) return; // Prevent double submit
    // Validation: Check if any card has meaningful data (not just initial values)
    const hasValidData = orderDetail.some(
      (card) =>
        card.Barcode ||
        card.Item_Code ||
        card.Item_Narration ||
        Number(card.Pcs) > 0 ||
        Number(card.Gross_Wt) > 0 ||
        Number(card.Net_Wt) > 0 ||
        Number(card.Amount) > 0
    );

    if (!hasValidData) {
      setMessage("Enter the appropriate data before submitting.");
      setTitle("warning");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (orderDetail.some((orderDetail) => Number(orderDetail.Amount) === 0)) {
      setMessage("Amount cannot be zero for any item.");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setIsSubmitting(true);
    const type = "Order";
    const isCode = await getCode(type, orderMain.Dt);
    console.log("New Max Code", isCode?.Code);
    const finalCardNo = orderMain.Card_No ? orderMain.Card_No : isCode?.Code;
    setFinalCard_No(finalCardNo || "");

    const res = await deleteOrder(orderMain.Dt, finalCardNo || "");
    console.log(res);

    console.log("finalCard is ", finalCardNo);
    const user = getUserList.filter(
      (users) => users.branch_code === userData?.branch_code_firm
    );

    const matchingSalesMan = user.find(
      (item) =>
        item.user_name?.toLowerCase() === orderMain.User_Nm?.toLowerCase()
    );

    const currentUserId = userData?.user_id ? String(userData.user_id) : "";

    const baseUserId = orderMain.User_Id?.trim().replace(/,+$/, ""); // Remove trailing commas

    const newUserId = baseUserId
      ? `${baseUserId},${currentUserId},`
      : `${currentUserId},`;

    // Transform OrderMainData to match the expected type
    const MainData = {
      ...orderMain,
      Card_No: finalCardNo || "",
      User_Nm: matchingSalesMan ? String(matchingSalesMan.user_id) : "",
      Code: Number(orderMain.Code), // Convert Code to a number
      User_Id: newUserId, // Use the constructed User_Id string
    };

    const DetailData = orderDetail.map((detail) => {
      const matchingItem = ItemdropDown?.find(
        (item) => item.item_Name === detail.Item_Code
      );
      const matchingCounter = counterDropDown?.find(
        (item) => item.name === detail.Counter
      );
      return {
        ...detail,
        Item_Code: matchingItem ? matchingItem.item_Code : "",
        Crt: detail.Crt ? parseInt(detail.Crt.toString()) : 0,
        Pcs: detail.Pcs ? Number(detail.Pcs) : 0,
        Gross_Wt: detail.Gross_Wt ? Number(detail.Gross_Wt) : 0.0,
        Net_Wt: detail.Net_Wt ? Number(detail.Net_Wt) : 0.0,
        Rng_Wt: detail.Rng_Wt ? Number(detail.Rng_Wt) : 0.0,
        Making: detail.Making ? Number(detail.Making) : 0.0,
        Barcode_Counter: matchingCounter ? matchingCounter.code : "",
        Card_No: finalCardNo || "",
        Dt: MainData.Dt,
        Delivery_Days: detail.Delivery_Days ? Number(detail.Delivery_Days) : 0,
        Making_Amt: detail.Making_Amt ? Number(detail.Making_Amt) : 0.0,
        Rate: detail.Rate ? Number(detail.Rate) : 0.0,
        Amount: detail.Amount ? Number(detail.Amount) : 0.0,
        Counter: matchingCounter ? matchingCounter.code : "",
        Other_Charges: detail.Other_Charges
          ? Number(detail.Other_Charges)
          : 0.0,
        Discount: detail.Discount ? Number(detail.Discount) : 0.0,
        Discount_Amt: detail.Discount_Amt ? Number(detail.Discount_Amt) : 0.0,
        Rng_Gross_Wt: detail.Rng_Gross_Wt ? Number(detail.Rng_Gross_Wt) : 0.0,
        Hm_Rate: detail.Hm_Rate ? Number(detail.Hm_Rate) : 0.0,
        Hm_Amount: detail.Hm_Amount ? Number(detail.Hm_Amount) : 0.0,
      };
    });

    const orderAddRes = await setOrder(MainData, DetailData);
    setMain(MainData);
    setDetail(DetailData);

    setResponseData(orderAddRes);

    setIsSubmitting(false); // Reset submitting state
  };

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (
      responseData?.["Insert Row "] &&
      responseData != null &&
      finalCard_No.length === 5
    ) {
      setModalMessage(
        `Order Note Created Successfully With Card No ${finalCard_No} !!`
      ); // Set the response message
      setShowModal(true); // Show the modal
    }
    setOrderMain(initialOrderMain);
    setOrderDetails([{ ...initialOrderDetails }]);
  }, [responseData, finalCard_No]); // Add newCRMData to the dependency array

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const receiptText = OrderRawBtFormat(main, detail, ItemdropDown);

    if (isAndroid) {
      const encoded = encodeURIComponent(receiptText);
      const rawbtUrl = `intent://rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;
      window.location.href = rawbtUrl;
    } else {
      if (printRef.current) {
        const printContents = printRef.current.innerHTML;
        const printWindow = window.open("", "_blank", "width=400,height=600");
        if (printWindow) {
          printWindow.document.write(`
             <html>
               <head>
                 <title>Print</title>
                 <style>
                   body { font-family: monospace; font-size: 10px; color: #000; padding: 12px; }
                 </style>
               </head>
               <body>${printContents}</body>
             </html>
           `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      }
    }
  };
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => setShowPreview(true);
  const handleClosePreview = () => setShowPreview(false);
  const handlePrintFromPreview = () => {
    handlePrint();
    setShowPreview(false);
  };

  const [isDate, setIsDate] = useState<string | null>(null);
  const [isCard_No, setIsCard_No] = useState<string | null>(null);

  //Handle Delete Order event
  const handleDeleteOrder = () => {
    setIsDate(orderMain.Dt);
    setIsCard_No(orderMain.Card_No);
  };

  const confirmDelete = async () => {
    if (isDate && isCard_No) {
      try {
        // Step 1: Delete the order
        const res = await deleteOrder(isDate, isCard_No);
        console.log("Delete response:", res);

        // Step 2: Show feedback message
        setMessage("Order Note Deleted Successfully");
        setTitle("error");
        setTimeout(() => setMessage(null), 3000);

        // Step 3: Clear search input
        setIsDate(null);
        setIsCard_No(null);

        // Step 4: Clear UI state to avoid showing old data
        setOrderMain(initialOrderMain);
        setOrderDetails([{ ...initialOrderDetails }]);

        // ✅ Step 5: Wait for a short delay (optional but helps with DB sync issues)
        await new Promise((res) => setTimeout(res, 300));

        // ✅ Step 6: Refetch fresh data if needed (optional)
        // const freshData = await fetchOrder(newCardNo);
        // setOrderMain(freshData.main);
        // setOrderDetails(freshData.details);
      } catch (error) {
        console.error("Error deleting order:", error);
        setMessage("Failed to delete order");
        setTitle("error");
      }
    }
  };

  const cancelDelete = () => {
    setIsDate(null);
    setIsCard_No(null);
  };

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          ORDER NOTE
        </h1>

        {/* Sales Header Section */}
        <OrderHeader
          orderMain={orderMain}
          handleChange={handleChange}
          handleBillTypeChange={handleBillTypeChange}
          handleSalesmanChange={handleSalesmanChange}
          handleTypeChange={handleTypeChange}
          handleCard_NoChange={handleCard_NoChange}
          orderMainData={orderMainData}
        />

        {/* Sales Body Section */}
        <div className="max-w-7xl mx-auto mt-5 bg-gray-100 shadow-lg border rounded-lg p-2 py-4 md:p-4">
          {orderDetail.length > 0 &&
            orderDetail.map((orderDetail, index) => {
              //Item_code match from item_list and item_category_Master_list
              const filteredCategories = itemCategoryDropDown
                .filter((category) => category.item_code === selectedItemCode)
                .map((category) => category.item_category);
              //Item_code match from item_list and metal_code from Caret-List
              const filteredCaretCategories = caretCategoryDropDown
                .filter(
                  (caretCategory) =>
                    caretCategory.metal_code === selectedCaretType
                )
                .map((caretCategory) => ({
                  caret_code: caretCategory.caret_code,
                  puriety_per: caretCategory.puriety_per,
                  caret_name: caretCategory.caret_name,
                }));
              return (
                <OrderBody
                  key={index}
                  index={index}
                  orderDetail={orderDetail}
                  Dt={orderMain.Dt}
                  caretCategoryOptions={filteredCaretCategories} //caret field DropDown
                  itemCategoryOptions={filteredCategories} //Narration Field DropDown
                  updateCard={updateCard}
                  deleteCard={deleteCard}
                  handleBarcodeChange={handleBarcodeChange}
                  // AmountFromBarcodeDetail={AmountFromBarcodeDetail}
                />
              );
            })}
          <div className="flex justify-center mt-8">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleAddItem}
              disabled={isSubmitting}
            >
              Add Item
            </Button>
          </div>
        </div>
        {/* Sales Footer */}
        <div className="max-w-4xl mx-auto justify-center mt-5 bg-white shadow-lg border rounded-lg p-1 sm:p-6 pb-8">
          <OrderFooter footerData={footerData} />
          {/* Button Row */}

          <div className="flex justify-around mt-5 flex-wrap gap-4 mx-4 md:mx-52 lg:mx-60 xl:mx-64">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleDeleteOrder}
              disabled={!canCustom("Delete") || isSubmitting}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleSubmit}
              disabled={!canCustom("Save") || !canCustom("Add") || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
        {/* Hidden printable area */}
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <PrintableOrderNote ref={printRef} main={main} detail={detail} />
          </div>
        </div>

        {showModal && (
          <SubmitModal
            modalMessage={modalMessage}
            setShowModal={setShowModal}
            onPrint={handlePrint}
            onPreview={handlePreview}
          />
        )}
        {showPreview && (
          <PreviewModal
            main={main}
            detail={detail}
            onPrint={handlePrintFromPreview}
            onCancel={handleClosePreview}
          />
        )}
        {/* Confirmation Modal */}
        {isDate && isCard_No && (
          <DeleteModal
            isDate={isDate}
            isCard_No={isCard_No}
            confirmDelete={confirmDelete}
            cancelDelete={cancelDelete}
          />
        )}

        {/* Alert Message */}
        {message && (
          <Feedback
            title={title as "success" | "error" | "warning" | "info"}
            message={message}
          />
        )}
      </div>
    </div>
  );
}
