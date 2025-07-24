"use client";
import { ChangeEvent, useState, useEffect, useCallback, useRef } from "react";
import URDFooter from "./URDFooter";
import URDBody from "./URDBody";
import URDHeader from "./URDHeader";
import useGetUrdDetail from "@/hooks/Get-Urd-Detail";
import useItemList from "@/hooks/Item-List";
// import useUserList from "@/hooks/User-List";
import useItemCategoryMasterList from "@/hooks/Item-Category-Master-List";
import useCaretList from "@/hooks/Caret-List";
import useCounterList from "@/hooks/Counter-List";
// import useGetCode from "@/hooks/Get-CRM-Code";
import useDeleteUrd from "@/hooks/Delete-URD";
import useURDAdd, { URDDetail, URDMain, URDResponse } from "@/hooks/URD_Add";
import useGetCode from "@/hooks/Get-Code";
import Feedback from "@/utils/Alert";
import DeleteModal from "@/utils/DeleteModal";
import SubmitModal from "@/utils/SubmitModal";
import { useUser } from "@/context/UserContext";
import useGetUrdMain from "@/hooks/Get-URD-Main";
import PrintableURDNote from "./PrintURDNote";
import PreviewModal from "./PreviewModal";
import { useAccessControl } from "@/hooks/useAccessControl";
import Button from "@/utils/Button";
import { URDRawBtFormat } from "@/utils/formatReceiptForRawbt";
export interface URDHeaderType {
  Dt: string;
  Card_No: string;
  User_Cd: string | null;
  Dt_Time: string;
  Trans_Type: string;
  User_Id: string;
  Bill_Type: string;
  Branch_Code: string;
  Code: string;
  Name: string | null;
  Address: string | null;
  Mobile: string;
}

export interface URDBodyType {
  Item_Code: string;
  Narration: string | null;
  Crt: string;
  Pcs: string | number;
  Gross_Wt: string;
  Puriety_Per: string;
  Net_Wt: string;
  Rate: string;
  Amount: string;
  Card_No: string;
  Sr_No: number;
  Counter: string;
  Item_Type: string;
  Dt: string;
  Type: string | null;
  Unit: string;
  Pcs_Applicable: string;
  Wt_Applicable: string;
  Ct_Applicable: string;
  Diff_Amt: string;
  Eg_No: string;
  Eg_Rate: string | null;
  Gross_Wt1: string;
}

export interface FooterFormData {
  totalPcs: string;
  totalGrossWt: string;
  totalNetWt: string;
  totalFineWt: string;
  totalAmount: string;
}

const initialHeaderData: URDHeaderType = {
  Dt: new Date().toISOString().split("T")[0],
  Card_No: "",
  User_Cd: "",
  Dt_Time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
  Trans_Type: "U",
  User_Id: "",
  Bill_Type: "B",
  Branch_Code: "",
  Code: "",
  Name: null,
  Address: null,
  Mobile: "",
};

const initialBodyData: URDBodyType = {
  Item_Code: "",
  Narration: null,
  Crt: "",
  Pcs: 0,
  Gross_Wt: "0.000",
  Puriety_Per: "100.00",
  Net_Wt: "0.000",
  Rate: "0.00",
  Amount: "0.00",
  Card_No: "",
  Sr_No: 1,
  Counter: "",
  Item_Type: "",
  Dt: new Date().toISOString().split("T")[0],
  Type: null,
  Unit: "",
  Pcs_Applicable: "N",
  Wt_Applicable: "Y",
  Ct_Applicable: "Y",
  Diff_Amt: "0.00",
  Eg_No: "N",
  Eg_Rate: "0.00",
  Gross_Wt1: "0.000",
};

export default function URD() {
  const { canCustom } = useAccessControl("w_counter_purchase");

  const [URDMainData, setURDMainData] =
    useState<URDHeaderType>(initialHeaderData);
  const [cards, setCards] = useState<URDBodyType[]>([{ ...initialBodyData }]);
  const [footerData, setFooterData] = useState<FooterFormData>({
    totalPcs: "",
    totalGrossWt: "",
    totalNetWt: "",
    totalFineWt: "",
    totalAmount: "",
  });
  const { userData } = useUser();
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { urdMain, fetchUrdMain } = useGetUrdMain();
  const { urdDetail, fetchUrdDetail } = useGetUrdDetail();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | Date | null) => {
      if (event instanceof Date || event === null) {
        setURDMainData((prev) => ({
          ...prev,
          // Ensure Dt is not empty if event is null, fallback to current date or handle as error
          Dt: event?.toISOString().split("T")[0] ?? "",
        }));
      } else {
        const { name, value, type, checked } = event.target;
        setURDMainData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
        }));
      }
    },
    []
  );

  const billTypeReverseMapping = {
    ACCOUNT: "B",
    SHOP: "E",
  } as const;
  const handleBillTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setURDMainData((prev) => ({
      ...prev,
      Bill_Type:
        billTypeReverseMapping[value as keyof typeof billTypeReverseMapping] ||
        "",
    }));
  };

  // Reverse mapping also:
  const transTypeReverseMapping = {
    ORDER: "O",
    URD: "U",
  } as const;

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setURDMainData((prev) => ({
      ...prev,
      Trans_Type:
        transTypeReverseMapping[
          value as keyof typeof transTypeReverseMapping
        ] || "",
    }));
  };

  const updateCard = (index: number, updatedCard: URDBodyType) => {
    const selectedItem = ItemdropDown.find(
      (item) => item.item_Name === updatedCard.Item_Code
    );
    setCards((prev) =>
      prev.map((card, i) =>
        i === index
          ? {
              ...updatedCard,
            }
          : card
      )
    );
    // Update the item code for category fetching
    setSelectedItemCode(selectedItem?.item_Code || null);
    // Update the item Type for category fetching
    setSelectedCaretType(selectedItem?.item_Type || null);
  };

  const deleteCard = useCallback((index: number) => {
    setCards((prev) =>
      prev.length === 1
        ? [{ ...initialBodyData, Eg_No: "N", Eg_Rate: "0.00" }]
        : prev.filter((_, i) => i !== index)
    );
  }, []);

  const handleAddItem = useCallback(() => {
    setCards((prev) => [
      ...prev,
      { ...initialBodyData, Sr_No: prev.length + 1 },
    ]);
    console.log("Add Item Clicked", cards);
  }, [cards]);

  useEffect(() => {
    const totals = cards.reduce(
      (acc, card) => {
        acc.totalPcs += Number(card.Pcs);
        acc.totalGrossWt += Number(card.Gross_Wt1);
        acc.totalNetWt += Number(card.Gross_Wt);
        acc.totalFineWt += Number(card.Net_Wt); // Assuming Fine Wt = Net Wt
        // Calculate Net Amount for this card accurately
        const cardNetAmount = Number(card.Amount) + Number(card.Diff_Amt);
        acc.totalAmount += cardNetAmount;
        return acc;
      },
      {
        totalPcs: 0,
        totalGrossWt: 0,
        totalNetWt: 0,
        totalFineWt: 0,
        totalAmount: 0,
      }
    );

    setFooterData({
      totalPcs: totals.totalPcs.toFixed(0),
      totalGrossWt: totals.totalGrossWt.toFixed(3),
      totalNetWt: totals.totalNetWt.toFixed(3),
      totalFineWt: totals.totalFineWt.toFixed(3),
      totalAmount: totals.totalAmount.toFixed(2),
    });
  }, [cards]);

  const { deleteUrd } = useDeleteUrd(); //delete urd api call

  const { getCode } = useGetCode(); //delete order api call
  const { addURD } = useURDAdd(); //delete order api call
  const [finalCard_No, setFinalCard_No] = useState("");
  const [responseData, setResponseData] = useState<URDResponse | null>(null);
  //FormData initailly formdata with type card value used State
  const [main, setMain] = useState<URDMain>();
  //desfined State for Cards from Card Type and getting value from initialFormData
  const [detail, setDetail] = useState<URDDetail[]>();

  // // handle Submit data going to footer data
  const handleSubmit = async () => {
    if (!canCustom("Modify") && URDMainData.Card_No) {
      setMessage("You do not have permission to modify this items.");
      setTitle("warning");
      setTimeout(() => setMessage(null), 3000);
      return null;
    }
    if (isSubmitting || isDeleting) return;
    setIsSubmitting(true);
    setMessage(null); // Clear previous messages

    // Check for ORDER type with no items
    if (
      URDMainData.Trans_Type === "O" &&
      (cards.length === 0 || (cards.length === 1 && !cards[0].Item_Code))
    ) {
      setMessage(
        "Please enter the appropriate data before submitting an ORDER."
      );
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      setIsSubmitting(false);
      return;
    }

    // Check for URD type with zero rate/amount
    if (URDMainData.Trans_Type === "U") {
      const hasZeroRateOrAmountInUrd = cards.some(
        (card) =>
          card.Rate === "0.00" ||
          Number(card.Rate) === 0.0 ||
          card.Amount === "0.00" ||
          Number(card.Amount) === 0.0
      );
      if (hasZeroRateOrAmountInUrd) {
        setMessage(
          "For URD type, Rate or Amount cannot be zero. Please correct the value(s)."
        );
        setTitle("warning");
        setTimeout(() => setMessage(null), 3000);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const type = "URD";

      const isCode = await getCode(type, URDMainData.Dt);
      const finalCardNo = URDMainData.Card_No
        ? URDMainData.Card_No
        : isCode?.Code;
      setFinalCard_No(finalCardNo || "");

      await deleteUrd(URDMainData.Dt, finalCardNo || "");

      const currentUserId = userData?.user_id ? String(userData.user_id) : "";

      const baseUserId = URDMainData.User_Id?.trim().replace(/,+$/, ""); // Remove trailing commas

      const newUserId = baseUserId
        ? `${baseUserId},${currentUserId},`
        : `${currentUserId},`;

      const MainData = {
        ...URDMainData,
        Card_No: finalCardNo || "",
        Code: Number(URDMainData.Code),
        Branch_Code: userData?.branch_code_firm
          ? String(userData.branch_code_firm)
          : URDMainData.Branch_Code || "",
        User_Id: newUserId,
      };

      const DetailData = cards.map((detail) => {
        const matchingItem = ItemdropDown?.find(
          (item) => item.item_Name === detail.Item_Code
        );

        const matchingCounter = counterDropDown?.find(
          (item) => item.name === detail.Counter
        );
        const fineWeight =
          (Number(detail.Net_Wt) * Number(detail.Puriety_Per)) / 100;

        return {
          ...detail,
          Item_Code: matchingItem ? matchingItem.item_Code : "",
          Crt: detail.Crt ? parseInt(detail.Crt.toString()) : 0,
          Pcs: detail.Pcs ? Number(detail.Pcs) : 0,
          Gross_Wt: detail.Gross_Wt ? Number(detail.Gross_Wt) : 0.0,
          Gross_Wt1: detail.Gross_Wt1 ? Number(detail.Gross_Wt1) : 0.0,
          Net_Wt: fineWeight,
          Card_No: finalCardNo || "",
          Dt: MainData.Dt,
          Rate: detail.Rate ? Number(detail.Rate) : 0.0,
          Amount: detail.Amount ? Number(detail.Amount) : 0.0,
          Puriety_Per: detail.Puriety_Per ? Number(detail.Puriety_Per) : 0.0,
          Diff_Amt: detail.Diff_Amt ? Number(detail.Diff_Amt) : 0.0,
          Eg_Rate: detail.Eg_Rate ? Number(detail.Eg_Rate) : 0.0,
          Counter: matchingCounter ? matchingCounter.code : "",
        };
      });
      const urdAddRes = await addURD(MainData, DetailData);

      setMain(MainData);
      setDetail(DetailData);

      if (urdAddRes && urdAddRes["Insert Row "] > 0) {
        setResponseData(urdAddRes);
        setModalMessage(
          `URD Note Created Successfully With Card No ${finalCardNo} !!`
        );
        setShowModal(true);
        setURDMainData(initialHeaderData);
        setCards([{ ...initialBodyData }]);
      } else {
        setMessage("Failed to create URD Note. Please try again.");
        setTitle("error");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error submitting URD:", error);
      setMessage("An unexpected error occurred during submission.");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (
      responseData?.["Insert Row "] &&
      responseData != null &&
      finalCard_No.length >= 5 // Assuming Card_No length can be 5 or more
    )
      setURDMainData(initialHeaderData);
    setCards([{ ...initialBodyData }]);
  }, [responseData, finalCard_No]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const receiptText = URDRawBtFormat(main, detail, ItemdropDown);

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

  const [isCard_No, setIsCard_No] = useState<string | null>(null);
  const [isDate, setIsDate] = useState<string | null>(null);
  const handleDeleteUrd = () => {
    if (isSubmitting || isDeleting) return; // Prevent action if another is in progress
    setIsDate(URDMainData.Dt);
    setIsCard_No(URDMainData.Card_No);
  };

  const confirmDelete = async () => {
    if (isSubmitting || isDeleting) return;
    if (!isDate || !isCard_No) {
      setMessage("Date and Card No are required for deletion.");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setIsDeleting(true);
    setMessage(null);
    try {
      const res = await deleteUrd(isDate, isCard_No);
      if (
        res &&
        res["Delete Row URD Main"] === 1 &&
        res["Delete Row URD Detail Item"] === 1
      ) {
        setMessage("URD Note deleted successfully.");
        setTitle("success");
        setTimeout(() => setMessage(null), 3000);
        setURDMainData(initialHeaderData);
        setCards([{ ...initialBodyData }]);
      } else {
        // If the specific keys are not present or not 1, show a more generic failure or API message
        setMessage(
          "Failed to delete URD Note. Please check details or try again."
        );
        setTitle("error");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error deleting URD:", error);
      setMessage("An unexpected error occurred during deletion.");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsDate(null);
      setIsCard_No(null);
      setIsDeleting(false);
      setTimeout(() => setMessage(null), 3000); // Clear message after some time
    }
  };

  const cancelDelete = () => {
    setIsDate(null);
    setIsCard_No(null);
  };

  const { ItemdropDown } = useItemList();

  const itemNames = ItemdropDown.filter((item) => item.item_Group === "O").map(
    (item) => item.item_Name
  );

  //Handle barcode change and set active barcode & index
  // In your main component
  const handleCard_NoChange = async (cardNo: string) => {
    const UrdMainRes = await fetchUrdMain(URDMainData.Dt, cardNo);
    await fetchUrdDetail(URDMainData.Dt, cardNo);
    // If either returns 404, show feedback
    if (cardNo.length < 5) {
      setMessage("Enter Correct Card No");
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (UrdMainRes?.data[0] === undefined) {
      setMessage(`Card Is Empty`);
      setTitle("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
  };

  const { counterDropDown } = useCounterList();
  useEffect(() => {
    if (URDMainData.Card_No && urdDetail && urdDetail.length > 0) {
      const updatedCards = urdDetail.map((detail, index) => {
        const matchingItem = ItemdropDown?.find(
          (item) => item.item_Code === detail.Item_Code
        );
        const matchingCounter = counterDropDown?.find(
          (item) => item.code === detail.Counter
        );
        return {
          ...initialBodyData,
          Item_Code: matchingItem ? matchingItem.item_Name : "",
          Narration: detail.Narration || null,

          Crt: detail.Crt ? `${detail.Crt}K` : "",
          Pcs: detail.Pcs ? Number(detail.Pcs).toFixed(0) : "0",
          Gross_Wt: detail.Gross_Wt
            ? Number(detail.Gross_Wt).toFixed(3)
            : "0.000",
          Puriety_Per: detail.Puriety_Per
            ? Number(detail.Puriety_Per).toFixed(2)
            : "0.00",
          Net_Wt: detail.Net_Wt ? Number(detail.Net_Wt).toFixed(3) : "0.000",
          Rate: detail.Rate ? Number(detail.Rate).toFixed(2) : "0.00",
          Amount: detail.Amount ? Number(detail.Amount).toFixed(2) : "0.00",
          Card_No: URDMainData.Card_No,
          Sr_No: index + 1,
          Counter: matchingCounter ? matchingCounter.name : "",
          Item_Type: detail.Item_Type || "",
          Dt: detail.Dt || URDMainData.Dt,
          Type: detail.Type || null,
          Unit: detail.Unit || "",
          Pcs_Applicable: detail.Pcs_Applicable || "N",
          Wt_Applicable: detail.Wt_Applicable || "Y",
          Ct_Applicable: detail.Ct_Applicable || "Y",
          Diff_Amt: detail.Diff_Amt
            ? Number(detail.Diff_Amt).toFixed(2)
            : "0.00",
          Eg_No: detail.Eg_No ? detail.Eg_No : "N",
          Eg_Rate: detail.Eg_Rate ? Number(detail.Eg_Rate).toFixed(2) : "0.00",
          Gross_Wt1: detail.Gross_Wt1
            ? Number(detail.Gross_Wt1).toFixed(3)
            : "0.000",
        };
      });

      setCards(
        updatedCards.length > 0 ? updatedCards : [{ ...initialBodyData }]
      );
    } else if (URDMainData.Card_No && (!urdDetail || urdDetail.length === 0)) {
      // Card_No is present, but no details found (e.g., invalid card or new card after a valid one)
      // Reset cards to initial state to clear any previous item details.
      setCards([{ ...initialBodyData }]);
      setSelectedItemCode(null);
      setSelectedCaretType(null);
    }
    // If !URDMainData.Card_No, this effect does nothing; reset is handled by the effect below.
  }, [
    urdDetail,
    URDMainData.Card_No,
    URDMainData.Dt,
    ItemdropDown,
    counterDropDown,
  ]);

  const prevCardNoRef = useRef<string>(URDMainData.Card_No);

  // This effect handles resetting the entire form when Card_No is cleared by the user
  useEffect(() => {
    const currentCardNo = URDMainData.Card_No;
    const previousCardNo = prevCardNoRef.current;

    if (previousCardNo && !currentCardNo) {
      setURDMainData(initialHeaderData);
      setCards([{ ...initialBodyData }]);
      setSelectedItemCode(null);
      setSelectedCaretType(null);
    }

    // Update the ref for the next render
    prevCardNoRef.current = currentCardNo;
  }, [URDMainData.Card_No]);

  //used for selecte item code from Item-List hooks
  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
  const { itemCategoryDropDown } = useItemCategoryMasterList(
    selectedItemCode || ""
  );

  //used for selecte item Caret Type from Item-List hooks
  const [selectedCaretType, setSelectedCaretType] = useState<string | null>(
    null
  );
  //Caret-List hooks Calling
  const { caretCategoryDropDown } = useCaretList(selectedCaretType || "");
  //Item_code match from item_list and item_category_Master_list
  const filteredCaretCategories = caretCategoryDropDown
    .filter((caretCategory) => caretCategory.metal_code === selectedCaretType)
    .map((caretCategory) => ({
      caret_code: caretCategory.caret_code,
      puriety_per: caretCategory.puriety_per,
      caret_name: caretCategory.caret_name,
    }));

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6 ">
          URD NOTE
        </h1>

        <URDHeader
          formdata={URDMainData}
          handleChange={handleChange}
          handleCard_NoChange={handleCard_NoChange}
          handleBillTypeChange={handleBillTypeChange}
          handleTypeChange={handleTypeChange}
          urdMain={urdMain}
        />

        <div className="bg-white rounded-lg shadow p-4 max-w-7xl mx-auto mt-5">
          {cards.map((card, index) => (
            <URDBody
              key={index}
              index={index}
              formData={card}
              Dt={URDMainData.Dt}
              Type={URDMainData.Trans_Type}
              updateCard={updateCard}
              deleteCard={deleteCard}
              itemList={itemNames}
              itemCategoryDropDown={itemCategoryDropDown
                .filter((cat) => cat.prate !== undefined)
                .map((cat) => ({ ...cat, prate: cat.prate as number }))}
              caretCategoryOptions={filteredCaretCategories}
              setMessage={setMessage}
              setTitle={setTitle}
            />
          ))}
          <div className="flex justify-center mt-4">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleAddItem}
              disabled={isSubmitting || isDeleting}
            >
              Add Item
            </Button>
          </div>
        </div>
        {/* {URD footer} */}

        <URDFooter footerData={footerData} />

        <div className="flex justify-around mt-5 flex-wrap gap-4 mx-4 md:mx-52 lg:mx-60 xl:mx-64">
          <Button
            variant="contained"
            className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 !rounded-2xl !text-white"
            onClick={handleDeleteUrd}
            disabled={
              !canCustom("Delete") ||
              isSubmitting ||
              isDeleting ||
              !URDMainData.Card_No
            }
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="contained"
            className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
            onClick={handleSubmit}
            disabled={
              !canCustom("Save") ||
              !canCustom("Add") ||
              isSubmitting ||
              isDeleting
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
      {/* Hidden printable area */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <PrintableURDNote ref={printRef} main={main} detail={detail} />
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
  );
}
