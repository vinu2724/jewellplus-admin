"use client";

import { ChangeEvent, useState, useEffect, useCallback, useRef } from "react";

import SalesBody from "./SalesBody";
import SalesHeader from "./SaleHeader";
import useItemList from "@/hooks/Item-List";
import useItemCategoryMasterList from "@/hooks/Item-Category-Master-List";
import useCaretList from "@/hooks/Caret-List";
import useGetSaleDetail from "@/hooks/Get-Sale-Detail";
import SalesFooter from "./SalesFooter";
import useCounterList from "@/hooks/Counter-List";
import useBarcodeMain from "@/hooks/Barcode-Main";
import useBarcodeDetail from "@/hooks/Barcode-Detail";
import useSaleAdd, {
  SaleDetail,
  SaleMain,
  SaleResponse,
} from "@/hooks/Sale-Add";
import useDeleteSale from "@/hooks/Delete-Sale";
import useGetCode from "@/hooks/Get-Code";
import Feedback from "@/utils/Alert";
import SubmitModal from "@/utils/SubmitModal";
import DeleteModal from "@/utils/DeleteModal";
import useGetItemRate from "@/hooks/Get-ItemRate";
import useGetSaleMain from "@/hooks/Get-Sale-Main";
import { useUser } from "@/context/UserContext";
import PreviewModal from "./PreviewModal";
import PrintableSaleNote from "./PrintSaleNote";
import Button from "@/utils/Button";
import { useAccessControl } from "@/hooks/useAccessControl";
import useGetUserList from "@/hooks/Get-User-List";
import { SaleRawBtFormat } from "@/utils/formatReceiptForRawbt";

//Define the type for the SalesMain structure
export interface SalesMain {
  Dt: string;
  Card_No: string;
  Delevery_By: string;
  Dt_Time: string;
  Accept_By: string;
  User_Nm: string;
  User_Cd: string | null;
  Code: string;
  Mobile: string;
  Name: string | null;
  Address: string | null;
  User_Id: string;
  Delevery_By_Id: number;
  Accept_By_Id: number;
  Bill_Type: string;
  Branch_Code: string;
}

// Define the type for the card structure
export interface Card {
  Barcode: string | null;
  Item_Code: string;
  Narration: string;
  Crt: string;
  Pcs: string | number;
  Gross_Wt: string;
  Net_Wt: string;
  Rng_Wt: string;
  Making: string;
  Making_On: string;
  Making_Discount: string;
  Card_No: string;
  Rate: string;
  Making_Amt: string;
  Vat_Per: number;
  Amount: string;
  Vat_Amt: number;
  Sub_Doc_No: number;
  Counter: string;
  Item_No: number;
  Profit_Per: number;
  Item_Type: string;
  Dt: string;
  Unit: string;
  Default_Wt: number;
  Pcs_Applicable: string;
  Wt_Applicable: string;
  Ct_Applicable: string;
  Making_Applicable: string;
  St_Bal: number;
  St_Pcs: number;
  Bal: string;
  Making_For: string;
  Excise_Per: number;
  Excise_Amt: number;
  Discount_Per: number;
  User_Ent_Disc: number;
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
  Ref_No: string | null;
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

const initialSaleMain: SalesMain = {
  Dt: new Date().toISOString().split("T")[0],
  Card_No: "",
  Delevery_By: "",
  Dt_Time: new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }), // Correct 24-hour format
  Accept_By: "N",
  User_Nm: "",
  Code: "",
  User_Cd: null,
  Mobile: "",
  Name: null,
  Address: null,
  User_Id: "",
  Delevery_By_Id: 0,
  Accept_By_Id: 0,
  Bill_Type: "B",
  Branch_Code: "1",
};

//initially card blank value
const initialSaleDetails: Card = {
  Barcode: null,
  Item_Code: "",
  Narration: "",
  Counter: "",
  Crt: "",
  Pcs: 0,
  Gross_Wt: "0.000",
  Net_Wt: "0.000",
  Rng_Wt: "0.000",
  Making: "0.00",
  Making_On: "",
  Making_Discount: "0.00",
  Card_No: "",
  Rate: "0.00",
  Making_Amt: "0.00",
  Vat_Per: 0.0,
  Amount: "0.00",
  Vat_Amt: 0.0,
  Sub_Doc_No: 1,
  Item_No: 0,
  Profit_Per: 0.0,
  Item_Type: "",
  Dt: new Date().toISOString().split("T")[0],
  Unit: "",
  Default_Wt: 0.0,
  Pcs_Applicable: "Y",
  Wt_Applicable: "Y",
  Ct_Applicable: "Y",
  Making_Applicable: "Y",
  St_Bal: 0.0,
  St_Pcs: 0.0,
  Bal: "",
  Making_For: "",
  Excise_Per: 0.0,
  Excise_Amt: 0.0,
  Discount_Per: 0.0,
  User_Ent_Disc: 0,
  Other_Charges: "0.00",
  Discount: "0.00",
  Discount_On: "M",
  Discount_Amt: "0.00",
  Rng_Pcs: 0,
  Rng_Gross_Wt: "0.000",
  Cgst_Per: 0.0,
  Cgst_Amt: 0.0,
  Sgst_Per: 0.0,
  Sgst_Amt: 0.0,
  Igst_Per: 0.0,
  Igst_Amt: 0.0,
  Cess_Per: 0.0,
  Cess_Amt: 0.0,
  Wastage: 0.0,
  Huid: null,
  Ref_No: null,
  Hm_Rate: "0.00",
  Hm_Amount: "0.00",
};

//Start Main Function
export default function Sales() {
  const { canCustom } = useAccessControl("w_counter_sale");

  //FormData initailly formdata with type card value used State
  const [saleMainData, setsaleMainData] = useState<SalesMain>(initialSaleMain);

  //desfined State for Cards from Card Type and getting value from initialFormData
  const [cards, setCards] = useState<Card[]>([{ ...initialSaleDetails }]);

  // User Data from user login
  const { userData } = useUser();

  // Item-List hooks Calling
  const { itemsNames, ItemdropDown } = useItemList();

  //used for selecte item code from Item-List hooks
  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
  //used for selecte item Caret Type from Item-List hooks
  const [selectedCaretType, setSelectedCaretType] = useState<string | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // item-category-master-list hook calling
  const { itemCategoryDropDown } = useItemCategoryMasterList(
    selectedItemCode || ""
  );

  //Caret-List hooks Calling
  const { caretCategoryDropDown } = useCaretList(selectedCaretType || "");

  //handle Change Event Defined
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | Date | null) => {
      if (event instanceof Date || event === null) {
        // Handle the date change (DatePicker)
        setsaleMainData((prev) => ({
          ...prev,
          Dt: event ? event.toISOString().split("T")[0] : "", // Convert to ISO string
        }));
      } else {
        // Handle input change for other fields
        const { name, value, type, checked } = event.target;
        setsaleMainData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
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
    setsaleMainData((prev) => ({
      ...prev,
      Bill_Type:
        billTypeReverseMapping[value as keyof typeof billTypeReverseMapping] ||
        "",
    }));
  };
  //handleSalesmanChange event define here for SalesHeader props
  const handleSalesmanChange = (event: ChangeEvent<HTMLInputElement>) => {
    setsaleMainData({ ...saleMainData, User_Nm: event.target.value });
  };
  //handleDeliveryByChange event define here for SalesHeader props
  const handleDeliveryByChange = (event: ChangeEvent<HTMLInputElement>) => {
    setsaleMainData({ ...saleMainData, Delevery_By: event.target.value });
  };

  const updateCard = (index: number, updatedCard: Card) => {
    //finding or get value in description field - item_name from ItemdropDown (get-sale-main)
    const selectedItem = ItemdropDown.find(
      (item) => item.item_Name === updatedCard.Item_Code
    );

    setCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...updatedCard } : card))
    );

    // Update the item code for category fetching
    setSelectedItemCode(selectedItem?.item_Code || null);

    // Update the item Type for category fetching
    setSelectedCaretType(selectedItem?.item_Type || null);
  };

  const prevCardNoRef = useRef<string>(saleMainData.Card_No);
  // This effect handles resetting the entire form when Card_No is cleared by the user
  useEffect(() => {
    const currentCardNo = saleMainData.Card_No;
    const previousCardNo = prevCardNoRef.current;

    if (previousCardNo && !currentCardNo) {
      setsaleMainData(initialSaleMain);
      setCards([{ ...initialSaleDetails }]);
      setSelectedItemCode(null);
      setSelectedCaretType(null);
    }

    // Update the ref for the next render
    prevCardNoRef.current = currentCardNo;
  }, [saleMainData.Card_No]);

  // Handle Add Item event with useCallback Function
  const handleAddItem = useCallback(() => {
    if (
      !canCustom("Allow Non barcode item sale ") &&
      cards.some((card) => !card.Barcode)
    ) {
      setMessage("Please add a barcode item first.");
      setTitle("warning");
      setTimeout(() => setMessage(null), 3000);
      return null;
    }
    setCards((prevCards) => [
      ...prevCards,
      { ...initialSaleDetails, Sub_Doc_No: prevCards.length + 1 },
    ]);
    console.log("Sales Main", saleMainData);
    console.log("Sales Body", cards);
  }, [, saleMainData, canCustom, cards]);

  const lastUpdatedBarcodeRef = useRef<string | null>(null);

  //Handle delete card event with respect to specific index
  const deleteCard = useCallback((index: number) => {
    setCards((prevCards) => {
      const barcodeToDelete = prevCards[index]?.Barcode;

      // If no barcode, delete only the clicked card
      if (!barcodeToDelete) {
        const updatedCards = prevCards.filter((_, i) => i !== index);
        // Reset lastUpdatedBarcodeRef if needed
        lastUpdatedBarcodeRef.current = null;
        return updatedCards.length > 0
          ? updatedCards
          : [{ ...initialSaleDetails }];
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
        : [{ ...initialSaleDetails }];
    });
  }, []);

  // Get Sale Main and Sale Detail hooks
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  const { saleMain, fetchSaleMain } = useGetSaleMain();
  const { saleDetail, fetchSaleDetail } = useGetSaleDetail();

  // Handle barcode change and set active barcode & index
  // In your main component
  const handleCard_NoChange = async (cardNo: string) => {
    // If either returns 404, show feedback
    if (cardNo.length < 5) {
      setMessage("Enter Correct Card No");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const SaleMainRes = await fetchSaleMain(saleMainData.Dt, cardNo);
    await fetchSaleDetail(saleMainData.Dt, cardNo);

    if (SaleMainRes?.data[0] === undefined) {
      setMessage(`Card Is Empty`);
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
  };

  // Counter list hooks calling
  const { counterDropDown } = useCounterList();

  // Fetch Sale Details and Update Card Data
  useEffect(() => {
    if (saleMainData.Card_No && saleDetail && saleDetail.length > 0) {
      const updatedCards = saleDetail.map((detail) => {
        const matchingItem = ItemdropDown?.find(
          (item) => item.item_Code === detail.Item_Code
        );
        const matchingCounter = counterDropDown?.find(
          (item) => item.code === detail.Counter
        );

        return {
          ...initialSaleDetails, // Keep existing fields
          Item_Code: matchingItem ? matchingItem.item_Name : "",
          Barcode: detail.Barcode ? String(detail.Barcode) : "",
          isFieldDisabled: !!detail.Barcode, // Disable counter if barcode exists
          Narration: detail.Narration || "",
          Crt: detail.Crt ? `${detail.Crt.toFixed(2)}K` : "",
          Pcs: detail.Pcs ? Number(detail.Pcs).toFixed(0) : "0",
          Gross_Wt: detail.Gross_Wt
            ? Number(detail.Gross_Wt).toFixed(3)
            : "0.000",
          Net_Wt: detail.Net_Wt ? Number(detail.Net_Wt).toFixed(3) : "0.000",
          Rng_Gross_Wt: Number(detail.Rng_Gross_Wt).toFixed(3) ?? "0.000",
          Rng_Wt: Number(detail.Rng_Wt).toFixed(3) ?? "0.000",
          Rate: detail.Rate ? Number(detail.Rate).toFixed(2) : "0.00",
          Amount: Number(detail.Amount).toFixed(2) ?? "0.00",
          Sub_Doc_No: detail.Sub_Doc_No ? detail.Sub_Doc_No : 0,
          Discount_Amt: detail.Discount_Amt
            ? Number(detail.Discount_Amt).toFixed(2)
            : "0.00",
          Other_Charges: Number(detail.Other_Charges).toFixed(2) ?? "0.00",

          Making: detail.Making ? Number(detail.Making).toFixed(2) : "0.00",
          Making_Amt: detail.Making_Amt
            ? Number(detail.Making_Amt).toFixed(2)
            : "0.00",
          Discount: detail.Discount
            ? Number(detail.Discount).toFixed(2)
            : "0.00",
          Discount_On: detail.Discount_On || "",
          Cgst_Per: detail.Cgst_Per || 0,
          Sgst_Per: detail.Sgst_Per || 0,
          Cgst_Amt: detail.Cgst_Amt || 0,
          Sgst_Amt: detail.Sgst_Amt || 0,

          Counter: matchingCounter ? matchingCounter.name : "",
          Making_On: detail.Making_On || "",
          Hm_Rate: detail.Hm_Rate ? Number(detail.Hm_Rate).toFixed(2) : "0.00",
          Hm_Amount: detail.Hm_Amount
            ? Number(detail.Hm_Amount).toFixed(2)
            : "0.00",
        };
      });

      setCards(updatedCards);
    }
  }, [saleDetail, saleMainData, ItemdropDown, counterDropDown]);

  ///////////////////////////////////////////////

  const { barcodeMain, fetchBarcodeMain } = useBarcodeMain();
  const { barcodeDetail, fetchBarcodeDetail } = useBarcodeDetail();
  const [activeIndex, setActiveIndex] = useState<number>(0); // or null if needed
  const [activeBarcode, setActiveBarcode] = useState<string | null>(null);

  // Handle barcode change and set active barcode & index
  const handleBarcodeChange = async (index: number, newBarcode: string) => {
    // Check for duplicate barcode
    const duplicateIndex = cards.findIndex(
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
      console.log("main is ", main);
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
      if (matchingItem?.item_Code && saleMainData.Dt && main.crt) {
        const S = "S";
        const isRate = await getRate(
          matchingItem?.item_Code || "",
          saleMainData.Dt,
          String(main.crt.toFixed(2)),
          S
        );
        rate = isRate?.rate ? Number(isRate.rate).toFixed(2) : "0.00";
      }

      setCards((prevCards) => {
        const updatedCards = [...prevCards];

        const isMainRender =
          (matchingItem?.item_Type === "T" || "D") &&
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
            updatedCards.push({ ...initialSaleDetails });
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
            Counter: matchingCounter
              ? matchingCounter.name
              : cards[activeIndex].Counter,
          };

          console.log("detail is ", barcodeDetail);

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
              Counter: matchingCounter
                ? matchingCounter.name
                : cards[index].Counter,
            };
          });
        } else {
          // Fill subsequent indexes with barcodeDetail
          barcodeDetail.forEach((detail, idx) => {
            const index = activeIndex + idx;
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
              Counter: matchingCounter
                ? matchingCounter.name
                : cards[index].Counter,
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
    saleMainData.Dt,
    getRate,
    activeIndex,
  ]);

  // Sales-Footer Login Starting ---->
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
    const totals = cards.reduce(
      (acc, card) => {
        acc.totalGrossWt += parseFloat(card.Gross_Wt) || 0; //
        acc.totalNetWt += parseFloat(card.Net_Wt) || 0; //
        acc.totalRngWt += parseFloat(card.Rng_Wt) || 0; //
        acc.totalOtherCharges += parseFloat(card.Other_Charges) || 0.0; //
        acc.totalBasicAmount += parseFloat(card.Amount); //----------
        acc.totalMakingAmount += parseFloat(card.Making_Amt) || 0.0; //------
        acc.totalDiscount += parseFloat(card.Discount_Amt) || 0.0; //-----
        acc.totalTax += card.Cgst_Amt + card.Sgst_Amt + card.Igst_Amt || 0.0; //----
        acc.totalAmount +=
          (parseFloat(card.Amount) || 0) +
          (parseFloat(card.Other_Charges) || 0) +
          (parseFloat(card.Making_Amt) || 0) +
          (parseFloat(card.Hm_Amount) || 0) +
          (card.Cgst_Amt || 0) +
          (card.Sgst_Amt || 0) +
          (card.Igst_Amt || 0) -
          (parseFloat(card.Discount_Amt) || 0); //-----

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
  }, [cards, footerData.totalAmount]);

  //FormData initailly formdata with type card value used State
  const { deleteSale } = useDeleteSale(); //delete order api call
  const { addSale } = useSaleAdd(); //addSale api call
  const { getCode } = useGetCode(); //get code api call

  const [finalCard_No, setFinalCard_No] = useState("");

  // console.log("finalCradNo is outside",finalCardNo)
  const [responseData, setResponseData] = useState<SaleResponse | null>(null);

  const { getUserList, fetchGetUserList } = useGetUserList();
  // ✅ Fetch only once on date change (not on every render)
  useEffect(() => {
    fetchGetUserList();
  }, [fetchGetUserList]);
  //FormData initailly formdata with type card value used State
  const [main, setMain] = useState<SaleMain>();
  //desfined State for Cards from Card Type and getting value from initialFormData
  const [detail, setDetail] = useState<SaleDetail[]>();

  // handle Submit data going to footer data
  const handleSubmit = async () => {
    if (!canCustom("Modify") && saleMainData.Card_No) {
      setMessage("You do not have permission to modify this items.");
      setTitle("warning");
      setTimeout(() => setMessage(null), 3000);
      return null;
    }
    if (isSubmitting) return; // Prevent double submit

    // Validation: Check if any card has meaningful data (not just initial values)
    const hasValidData = cards.some(
      (card) =>
        card.Barcode ||
        card.Item_Code ||
        card.Narration ||
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
    if (cards.some((card) => Number(card.Amount) === 0)) {
      setMessage("Amount cannot be zero for any item.");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setIsSubmitting(true);
    const type = "Sale";

    const isCode = await getCode(type, saleMainData.Dt);

    console.log("New Max Code", isCode?.Code);

    const finalCardNo = saleMainData.Card_No
      ? saleMainData.Card_No
      : isCode?.Code;
    setFinalCard_No(finalCardNo || "");

    const res = await deleteSale(saleMainData.Dt, finalCardNo || "");
    console.log(res);

    console.log("finalCard is ", finalCardNo);

    const user = getUserList.filter(
      (users) => users.branch_code === userData?.branch_code_firm
    );

    const matchingSalesMan = user.find(
      (item) =>
        item.user_name?.toLowerCase() === saleMainData.User_Nm?.toLowerCase()
    );

    const matchingDeliveredBy = user.find(
      (item) =>
        item.user_name?.toLowerCase() ===
        saleMainData.Delevery_By?.toLowerCase()
    );

    const currentUserId = userData?.user_id ? String(userData.user_id) : "";

    const baseUserId = saleMainData.User_Id?.trim().replace(/,+$/, ""); // Remove trailing commas

    const newUserId = baseUserId
      ? `${baseUserId},${currentUserId},`
      : `${currentUserId},`;
    // Transform saleMainData to match the expected type
    const MainData = {
      ...saleMainData,
      Card_No: finalCardNo || "",
      User_Nm: matchingSalesMan ? String(matchingSalesMan.user_id) : "",
      Code: Number(saleMainData.Code), // Convert Code to a number
      User_Id: newUserId,
      Delevery_By: " ",
      Delevery_By_Id: matchingDeliveredBy
        ? Number(matchingDeliveredBy.user_id)
        : 0,
      Accept_By:
        saleMainData.Accept_By === "Y"
          ? "Y"
          : saleMainData.Accept_By === "N"
          ? "N"
          : null,
    };

    const DetailData = cards.map((detail) => {
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
        Rng_Pcs: detail.Rng_Pcs ? Number(detail.Rng_Pcs) : 0,
        Gross_Wt: detail.Gross_Wt ? Number(detail.Gross_Wt) : 0.0,
        Net_Wt: detail.Net_Wt ? Number(detail.Net_Wt) : 0.0,
        Card_No: finalCardNo || "",
        Dt: MainData.Dt,
        Rng_Gross_Wt: detail.Rng_Gross_Wt ? Number(detail.Rng_Gross_Wt) : 0.0,
        Rng_Wt: detail.Rng_Wt ? Number(detail.Rng_Wt) : 0.0,
        Rate: detail.Rate ? Number(detail.Rate) : 0.0,
        Amount: detail.Amount ? Number(detail.Amount) : 0.0,
        Discount_Amt: detail.Discount_Amt ? Number(detail.Discount_Amt) : 0.0,
        Other_Charges: detail.Other_Charges
          ? Number(detail.Other_Charges)
          : 0.0,

        Making: detail.Making ? Number(detail.Making) : 0.0,
        Making_Amt: detail.Making_Amt ? Number(detail.Making_Amt) : 0.0,
        Making_Discount: detail.Making_Discount
          ? Number(detail.Making_Discount)
          : 0.0,

        Discount: detail.Discount ? Number(detail.Discount) : 0.0,
        Counter: matchingCounter ? matchingCounter.code : "",

        Hm_Rate: detail.Hm_Rate ? Number(detail.Hm_Rate) : 0.0,
        Hm_Amount: detail.Hm_Amount ? Number(detail.Hm_Amount) : 0.0,
      };
    });

    const saleAddRes = await addSale(MainData, DetailData);
    setMain(MainData);
    setDetail(DetailData);

    setResponseData(saleAddRes);
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
        `Sale Note Created Successfully With Card No ${finalCard_No} !!`
      ); // Set the response message
      setShowModal(true); // Show the modal
    }
    setsaleMainData(initialSaleMain);
    setCards([{ ...initialSaleDetails }]);
  }, [responseData, finalCard_No]); // Add newCRMData to the dependency array

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const receiptText = SaleRawBtFormat(main, detail, ItemdropDown);

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
  const handleDeleteSale = () => {
    setIsDate(saleMainData.Dt);
    setIsCard_No(saleMainData.Card_No);
  };

  const confirmDelete = async () => {
    if (isDate && isCard_No) {
      const res = await deleteSale(isDate, isCard_No);
      console.log("Delete response:", res);
      setMessage("Order deleted successfully.");
      setTitle("success");
      setIsDate(null);
      setIsCard_No(null);
      setTimeout(() => setMessage(null), 3000);
    }
    setsaleMainData(initialSaleMain);
    setCards([{ ...initialSaleDetails }]);
  };

  const cancelDelete = () => {
    setIsDate(null);
    setIsCard_No(null);
  };

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          SALE NOTE
        </h1>
        {/* Sales Header Section */}
        <SalesHeader
          saleMainData={saleMainData}
          handleChange={handleChange}
          handleBillTypeChange={handleBillTypeChange}
          handleDeliveryByChange={handleDeliveryByChange}
          handleSalesmanChange={handleSalesmanChange}
          handleCard_NoChange={handleCard_NoChange}
          saleMain={saleMain} // Pass saleMain to SalesHeader
        />

        {/* Sales Body Section */}
        <div className="max-w-7xl mx-auto mt-5 bg-gray-100 shadow-lg border rounded-lg p-2 py-4 md:p-4">
          {cards.length > 0 &&
            cards.map((card, index) => {
              //Item_code match from item_list and item_category_Master_list
              const filteredCategories = itemCategoryDropDown
                .filter((category) => category.item_code === selectedItemCode)
                .map((category) => category.item_category);

              //Item_code match from item_list and item_category_Master_list
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
                <SalesBody
                  key={index}
                  index={index}
                  cards={card}
                  Dt={saleMainData.Dt}
                  updateCard={updateCard}
                  deleteCard={deleteCard}
                  itemList={itemsNames}
                  itemCategoryOptions={filteredCategories} //Narration Field DropDown
                  caretCategoryOptions={filteredCaretCategories} //caret field DropDown
                  handleBarcodeChange={handleBarcodeChange}
                />
              );
            })}
          <div className="flex justify-around mt-5 flex-wrap gap-4 mx-4 md:mx-52 lg:mx-60 xl:mx-64">
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
          <SalesFooter footerData={footerData} />
          {/* Submit and Delete Buttons */}
          <div className="flex justify-around mt-5 flex-wrap gap-4 mx-4 md:mx-52 lg:mx-60 xl:mx-64">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleDeleteSale}
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
            <PrintableSaleNote ref={printRef} main={main} detail={detail} />
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
