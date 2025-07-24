import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Card } from "./Sales";
import useCounterList from "@/hooks/Counter-List";
import useItemList from "@/hooks/Item-List";
import useItemCategoryMasterList from "@/hooks/Item-Category-Master-List";

import { useUser } from "@/context/UserContext";
import {
  CounterTable,
  CrtTable,
  DataInput,
  DataList,
} from "@/utils/CustomTags";
import useGetItemRate from "@/hooks/Get-ItemRate";
import { FiSearch } from "react-icons/fi";
import { useAccessControl } from "@/hooks/useAccessControl";
import Alert from "@/utils/Alert";

interface SalesBodyProps {
  index: number;
  cards: Card;
  Dt: string;
  updateCard: (index: number, updatedCard: Card) => void;
  deleteCard: (index: number) => void;
  // selectedItemCode: string;
  itemList: string[];
  itemCategoryOptions: string[];
  caretCategoryOptions: {
    caret_code: number;
    puriety_per: number;
    caret_name: string | null;
  }[];
  handleBarcodeChange: (index: number, Barcode: string) => void; // New prop
}

const SalesBody: FC<SalesBodyProps> = ({
  index,
  cards,
  Dt,
  updateCard,
  deleteCard,
  // selectedItemCode,
  itemList,
  itemCategoryOptions,
  caretCategoryOptions,
  handleBarcodeChange,
}) => {
  const { canCustom } = useAccessControl("w_counter_sale");
  // State to control whether Input is disabled should be disabled
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [Wt_Applicable, setWt_Applicable] = useState<boolean>(false);
  const [makingOnDiseabled, setMakingOnDiseabled] = useState<boolean>(false);
  // const [hm_Applicable, setHm_Applicable] = useState<boolean>(false);
  const [makingDiseabled, setMakingDiseabled] = useState<boolean>(false);
  const [SaleWeight, setSaleWeight] = useState("0.000");
  const [isDiscountOnDiseabled, setisDiscountOnDiseabled] =
    useState<boolean>(false);
  // Track if `ct` is manually changed
  const [isCtManuallyUpdated, setIsCtManuallyUpdated] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  // Item-List hooks
  const { ItemdropDown } = useItemList();

  const matchedItem = ItemdropDown.find(
    (item) => item.item_Name === cards.Item_Code
  );

  const updateField = useCallback(
    (name: string, value: string) => {
      const updatedCard = { ...cards, [name]: value };
      // Update the entire card
      updateCard(index, updatedCard);
      // Update the item code for category fetching
    },
    [index, cards, updateCard]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateField(e.target.name, e.target.value);
    },
    [updateField]
  );

  const handleNumericChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Allow typing any number, including decimals
      if (/^\d*\.?\d*$/.test(value)) {
        if (name === "pcs") {
          const numericValue = value === "" ? "" : Number(value).toFixed(0); // No decimals for pcs
          updateField(name, numericValue);
        } else updateField(name, value);
      }
    },
    [updateField]
  );

  const handleNumericBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (value !== "") {
        let formattedValue = value;

        if (["Gross_Wt", "Net_Wt", "Rng_Gross_Wt", "Rng_Wt"].includes(name)) {
          formattedValue = Number(value).toFixed(3) ?? "0.000"; // 3 decimals for weight fields
        } else if (
          ["Rate", "Amount", "Making", "Other_Charges"].includes(name)
        ) {
          formattedValue = Number(value).toFixed(2) ?? "0.00"; // 2 decimals for amount fields
        }

        updateField(name, formattedValue);

        // Sync netWeight with grossWeight
        if (name === "Gross_Wt") {
          updateCard(index, {
            ...cards,
            Gross_Wt: formattedValue,
            Net_Wt: formattedValue,
          });
        }

        // Sync rngNWeight with Rng_Gross_Wt
        if (name === "Rng_Gross_Wt") {
          updateCard(index, {
            ...cards,
            Rng_Gross_Wt: formattedValue,
            Rng_Wt: formattedValue,
          });
        }
      }
    },
    [updateField, updateCard, index, cards]
  );

  // Handle manual `ct` updates
  const handleCtChange = (newCt: string) => {
    setIsCtManuallyUpdated(true); // Mark `ct` as manually changed
    updateCard(index, { ...cards, Crt: newCt });
  };

  //SaleWeight calculate depend upon itemType
  useEffect(() => {
    if (matchedItem) {
      if (matchedItem.item_Type === "F") {
        setSaleWeight(
          ((Number(cards.Pcs) || 0) - (Number(cards.Rng_Pcs) || 0)).toFixed(
            3
          ) || "0.000"
        );
      } else {
        setSaleWeight(
          ((Number(cards.Net_Wt) || 0) - (Number(cards.Rng_Wt) || 0)).toFixed(
            3
          ) || "0.000"
        );
      }
    }
  }, [
    cards.Net_Wt,
    ItemdropDown,
    cards.Pcs,
    cards.Rng_Pcs,
    matchedItem,
    cards.Rng_Wt,
  ]);

  useEffect(() => {
    if (cards.Pcs && cards.Hm_Rate) {
      const calculatedHmAmount = (
        Number(cards.Pcs) * Number(cards.Hm_Rate)
      ).toFixed(2);
      updateCard(index, { ...cards, Hm_Amount: calculatedHmAmount });
    }
    // eslint-disable-next-line
  }, [cards.Pcs, cards.Hm_Rate]);

  const gstPercentage = cards.Sgst_Per + cards.Cgst_Per + cards.Igst_Per; // Example GST percentage
  const gstAmount =
    ((Number(cards.Amount) +
      Number(cards.Other_Charges) +
      Number(cards.Making_Amt) +
      Number(cards.Hm_Amount) -
      Number(cards.Discount_Amt)) *
      Number(gstPercentage)) /
    100;

  useEffect(() => {
    if (gstAmount) {
      const calculatedCgstSgst = parseFloat((gstAmount / 2).toFixed(2));
      updateCard(index, {
        ...cards,
        Cgst_Amt: calculatedCgstSgst,
        Sgst_Amt: calculatedCgstSgst,
      });
    }
    // eslint-disable-next-line
  }, [gstAmount]);

  // Calculate Total Amount with these Formula
  const amount =
    Number(cards.Amount) +
    Number(cards.Other_Charges) +
    Number(cards.Making_Amt) +
    Number(gstAmount) +
    Number(cards.Hm_Amount) -
    Number(cards.Discount_Amt);

  //Item selected

  useEffect(() => {
    if (matchedItem && !cards.Barcode) {
      const gstSplit = parseFloat((gstAmount / 2).toFixed(2));

      // Only update when values truly differ
      const shouldUpdate =
        matchedItem.discount_On != cards.Discount_On ||
        Number(matchedItem.cgst_Per) !== cards.Cgst_Per ||
        Number(matchedItem.sgst_Per) !== cards.Sgst_Per ||
        gstSplit !== cards.Cgst_Amt ||
        gstSplit !== cards.Sgst_Amt;

      if (shouldUpdate) {
        updateCard(index, {
          ...cards,
          Making_On: matchedItem.making_On,
          Discount_On: matchedItem.discount_On,
          Hm_Rate: String(matchedItem.hm_Rate) || "0.00",
          Cgst_Per: Number(matchedItem.cgst_Per) || 0,
          Sgst_Per: Number(matchedItem.sgst_Per) || 0,
          Cgst_Amt: gstSplit,
          Sgst_Amt: gstSplit,
        });
      }

      const isBarcode = !cards.Barcode;
      const isItem = !cards.Item_Code;
      const isCategory = !!cards.Narration;

      setMakingOnDiseabled(isBarcode && isItem);
      setMakingDiseabled(isBarcode && isItem && isCategory);

      setisDiscountOnDiseabled(matchedItem.discount_On !== cards.Discount_On); //
      const isDisabledType = ["D", "T", "F"].includes(matchedItem.item_Type);

      setIsInputDisabled(isDisabledType);
      setWt_Applicable(matchedItem?.wt_Applicable === "N");
      cards.Hm_Amount = String(
        (Number(cards.Pcs) * Number(cards.Hm_Rate)).toFixed(2)
      );
    }
  }, [matchedItem, index, updateCard, cards, gstAmount, ItemdropDown]);

  // Fetch item category based on selected item code
  const { itemCategoryDropDown } = useItemCategoryMasterList(
    matchedItem?.item_Code
  );
  // 🔹 Effect to update ct and makingRate based on narration
  useEffect(() => {
    if (cards.Narration && !cards.Barcode) {
      const matchedCategory = itemCategoryDropDown.find(
        (item) => item.item_category === cards.Narration
      );

      if (!matchedCategory) return; // 🚨 Prevent unnecessary updates

      const newCt = `${matchedCategory.crt.toFixed(2)}K` || "";
      const newMakingRate = matchedCategory.sale_making
        ? Number(matchedCategory.sale_making).toFixed(2)
        : "0.00";
      const newMakingOn = matchedCategory.sale_making_on || "";

      // ✅ Only update state if values have actually changed
      if (
        (!isCtManuallyUpdated && newCt === "0.00K" && cards.Crt !== newCt) ||
        cards.Making !== newMakingRate
      ) {
        updateCard(index, {
          ...cards,
          Crt: newCt, // Keep manual ct changes
          Making: newMakingRate,
          Making_On: newMakingOn,
        });
      }
    }
  }, [cards, itemCategoryDropDown, index, updateCard, isCtManuallyUpdated]);

  //get rate

  const { getRate } = useGetItemRate();
  const [rateFetched, setRateFetched] = useState(false);

  useEffect(() => {
    setRateFetched(false);
  }, [cards.Crt, matchedItem?.item_Code, Dt]);

  useEffect(() => {
    const crtValue = cards.Crt ? cards.Crt.replace(/K$/i, "") : "";

    const fetchRate = async () => {
      const S = "S";
      const rateData = await getRate(
        matchedItem?.item_Code || "",
        Dt,
        crtValue,
        S
      );

      const matchedCategory = itemCategoryDropDown.find(
        (item) => item.item_category === cards.Narration
      );

      const rateValue = rateData?.rate
        ? Number(rateData.rate)
        : Number(matchedCategory?.srate);
      // ✅ Only update state if values have actually changed
      if (cards.Rate !== Number(rateValue).toFixed(2) && !cards.Barcode) {
        console.log("rate feacting in baody");
        updateCard(index, {
          ...cards,
          Rate: Number(rateValue).toFixed(2),
        });
      }
      setRateFetched(true);
    };

    if (!rateFetched && matchedItem?.item_Code && Dt && crtValue) {
      fetchRate();
    }
  }, [
    getRate,
    index,
    cards,
    itemCategoryDropDown,
    updateCard,
    rateFetched,
    matchedItem?.item_Code,
    caretCategoryOptions,
    Dt,
  ]);

  //Amount
  useEffect(() => {
    const weight = Number(SaleWeight);
    const rate = Number(cards.Rate);
    if (weight > 0 && rate > 0) {
      const calculatedAmount = (weight * rate).toFixed(2);
      if (cards.Amount !== calculatedAmount) {
        updateCard(index, { ...cards, Amount: calculatedAmount });
      }
    }
  }, [SaleWeight, cards, index, updateCard]);

  //Making Amount Calculate using switch case
  useEffect(() => {
    let newMakingAmt = "0.00";
    const totalPcs = Number(cards.Pcs) - Number(cards.Rng_Pcs);
    const MakingAmt1 = (Number(cards.Making) * totalPcs).toFixed(2) || "0.00";
    const MakingAmt2 =
      (Number(cards.Making) * Number(SaleWeight)).toFixed(2) || "0.00";
    const MakingAmt3 = Number(cards.Making).toFixed(2) || "0.00";
    const MakingAmt4 =
      (
        ((Number(cards.Rate) * Number(cards.Making)) / 100) *
        Number(SaleWeight)
      ).toFixed(2) || "0.00";
    switch (cards.Making_On) {
      case "P":
        newMakingAmt = MakingAmt1;
        break;
      case "G":
        newMakingAmt = MakingAmt2;
        break;
      case "F":
        newMakingAmt = MakingAmt3;
        break;
      case "W":
        newMakingAmt = MakingAmt4;
        break;
      case "N":
        newMakingAmt = "0.00";
        break;
      default:
        newMakingAmt = "0.00";
        break;
    }

    if (cards.Making_Amt !== newMakingAmt) {
      updateCard(index, { ...cards, Making_Amt: newMakingAmt });
    }
  }, [cards, index, updateCard, SaleWeight]);

  //discount Amount calculate using switch case
  useEffect(() => {
    const totalPcs = Number(cards.Pcs) - Number(cards.Rng_Pcs);

    // Discount formulas
    const DiscountAmt1 =
      ((Number(cards.Amount) +
        Number(cards.Making_Amt) +
        Number(cards.Other_Charges)) *
        Number(cards.Discount)) /
      100;
    const DiscountAmt2 =
      ((Number(cards.Rate) * Number(cards.Discount)) / 100) *
      Number(SaleWeight);
    const DiscountAmt3 =
      (Number(cards.Other_Charges) * Number(cards.Discount)) / 100;
    const DiscountAmt4 =
      (Number(cards.Making_Amt) * Number(cards.Discount)) / 100;
    const DiscountAmt5 = Number(cards.Discount) * totalPcs;
    const DiscountAmt6 = Number(cards.Discount);
    const DiscountAmt7 = Number(cards.Discount) * Number(SaleWeight);

    let Discount_Amt = 0.0;
    switch (cards.Discount_On) {
      case "A":
        Discount_Amt = DiscountAmt1;
        break;
      case "R":
        Discount_Amt = DiscountAmt2;
        break;
      case "O":
        Discount_Amt = DiscountAmt3;
        break;
      case "M":
        Discount_Amt = DiscountAmt4;
        break;
      case "P":
        Discount_Amt = DiscountAmt5;
        break;
      case "F":
        Discount_Amt = DiscountAmt6;
        break;
      case "G":
        Discount_Amt = DiscountAmt7;
        break;
      default:
        Discount_Amt = 0.0;
        break;
    }

    const formattedDiscountAmt = Discount_Amt.toFixed(2);

    if (cards.Discount_Amt !== formattedDiscountAmt) {
      updateCard(index, { ...cards, Discount_Amt: formattedDiscountAmt });
    }
    // eslint-disable-next-line
  }, [
    cards.Discount_On,
    cards.Discount,
    cards.Amount,
    cards.Making_Amt,
    cards.Other_Charges,
    cards.Rate,
    SaleWeight,
    cards.Pcs,
    cards.Rng_Pcs,
  ]);

  //Counter List Hook Api call
  const { counterDropDown } = useCounterList();
  const { userData } = useUser(); // 👈 use context for user Login data info
  const counter = counterDropDown;
  // use default counter value from user data
  const defaultCounter = counter.find(
    (item) => item.name === userData?.counter_name
  )?.name;
  // Set default counter value if not already set
  useEffect(() => {
    if (!cards.Counter && defaultCounter) {
      updateCard(index, { ...cards, Counter: defaultCounter });
    }
  }, [defaultCounter, cards, index, updateCard]);

  //if barcode is present then pcs hould disabled
  const isPcsDisabled = (cards.Barcode?.length ?? 0) > 0;

  //rng pcs get disabled when pcs is 0, 1
  const isRngPcsDisabled = cards.Pcs === "0" || cards.Pcs === "1";

  const handleItemCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canCustom("Allow Non barcode item sale ")) {
      if (!cards.Barcode) {
        setMessage("Please add a barcode item first.");
        setTitle("warning");
        setTimeout(() => setMessage(null), 3000);
        return null;
      }
    }
    updateField("Item_Code", e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 bg-white shadow-lg border border-gray-200 rounded-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-800 font-semibold text-lg">
          Sr. {index + 1}
        </span>
        <span
          className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-red-700 cursor-pointer transition duration-200"
          onClick={() => deleteCard(index)}
        >
          ✕
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 text-gray-800">
        {/* Barcode */}
        <div className="relative">
          <DataInput
            label="BARCODE"
            name="Barcode"
            value={cards.Barcode || null}
            onChange={(e) =>
              updateField("Barcode", e.target.value.toUpperCase())
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBarcodeChange(index, cards.Barcode || "");
              }
            }}
          />

          <div
            onClick={() => {
              handleBarcodeChange(index, cards.Barcode || "");
            }}
            className="absolute top-1/2 right-0 mt-[10px] transform -translate-y-1/2 bg-gradient-to-r from-gray-400 to-gray-700 text-white px-4 py-[11px] rounded-r-md cursor-pointer shadow-sm transition"
            title="Search Barcode"
          >
            <FiSearch
              size={18}
              className="text-gray-50 active:text-green-600"
            />
          </div>
        </div>
        {/* Dropdown Inputs */}
        <DataList
          label="DECRIPTION"
          name="Item_Code"
          value={cards.Item_Code}
          options={itemList}
          onChange={handleItemCodeChange}
        />

        <CrtTable
          label="CRT"
          name="Crt"
          value={cards.Crt}
          options={caretCategoryOptions}
          disabled={isInputDisabled} // Disable the field
          onChange={(value) => handleCtChange(value)} // Use handleCtChange here
        />
        <div className="col-span-1 xl:col-span-3">
          <DataList
            label="NARRATION"
            name="Narration"
            value={cards.Narration || ""}
            options={itemCategoryOptions}
            onChange={(e) => updateField("Narration", e.target.value)}
          />
        </div>

        {/* PCS */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              PCS
            </span>
          }
          name="Pcs"
          value={String(cards.Pcs)}
          disabled={isPcsDisabled}
          onChange={handleNumericChange}
        />
        {/* GROSS WEIGHT */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              GROSS WEIGHT
            </span>
          }
          name="Gross_Wt"
          value={cards.Gross_Wt}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={Wt_Applicable}
        />
        {/* NET WEIGHT */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              NET WEIGHT
            </span>
          }
          name="Net_Wt"
          value={cards.Net_Wt}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={Wt_Applicable}
        />
        {/* RNG PCS */}
        <DataInput
          label={
            <span className="text-red-600 text-sm font-[var(--font-inter)]">
              RNG PCS
            </span>
          }
          name="Rng_Pcs"
          value={String(cards.Rng_Pcs)}
          onChange={handleNumericChange}
          disabled={isRngPcsDisabled}
        />
        {/* RNG G WEIGHT */}
        <DataInput
          label={
            <span className="text-red-600 text-sm font-[var(--font-inter)]">
              RNG G.WEIGHT
            </span>
          }
          name="Rng_Gross_Wt"
          value={cards.Rng_Gross_Wt}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={Wt_Applicable}
        />
        {/* RNG N WEIGHT */}
        <DataInput
          label={
            <span className="text-red-600 text-sm font-[var(--font-inter)]">
              RNG N.WEIGHT
            </span>
          }
          name="Rng_Wt"
          value={cards.Rng_Wt}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={Wt_Applicable}
        />
        {/* SALE WEIGHT */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              SALE WEIGHT
            </span>
          }
          name="SaleWeight"
          value={SaleWeight}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={true}
        />
        {/* RATE */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              RATE
            </span>
          }
          name="Rate"
          value={cards.Rate}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={!canCustom("Rate")}
        />
        {/* NET AMOUNT */}

        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              AMOUNT
            </span>
          }
          name="Amount"
          value={cards.Amount}
          onChange={handleNumericChange}
          disabled={true}
        />

        {/* OTHER CHARGES */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              OTHER CHARGES
            </span>
          }
          name="Other_Charges"
          value={cards.Other_Charges}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
        />
        {/* Making Rate */}
        {/* Making Rate & makingOn Dropdown */}
        <div className="flex items-center space-x-2">
          <DataInput
            label={
              <span className="text-blue-700 text-sm font-[var(--font-inter)]">
                MAKING RATE
              </span>
            }
            name="Making"
            value={cards.Making}
            disabled={
              !canCustom("Making Discount") ||
              isInputDisabled ||
              makingDiseabled
            } // Disable the field
            onChange={handleNumericChange}
            onBlur={handleNumericBlur}
          />

          {/* makingOn Dropdown */}
          <select
            name="Making_On"
            value={cards.Making_On}
            onChange={(e) => updateField("Making_On", e.target.value)}
            disabled={
              !canCustom("Making Discount") ||
              isInputDisabled ||
              makingOnDiseabled
            }
            className=" p-2 py-2 mt-5 w-28 h-10 rounded-md text-xs bg-gradient-to-r from-indigo-500 to-indigo-700 cursor-pointer text-black"
          >
            <option value="N">-N.A.-</option>
            <option value="P">Pcs.</option>
            <option value="G">Gms.</option>
            <option value="F">Full.</option>
            <option value="W">West.%.</option>
          </select>
        </div>
        {/* Making */}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              MAKING AMOUNT
            </span>
          }
          name="Making_Amt"
          value={cards.Making_Amt}
          onChange={handleChange}
          disabled={true}
        />
        {/* Making */}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              H.M. AMOUNT
            </span>
          }
          name="Hm_Amount"
          value={cards.Hm_Amount}
          onChange={handleChange}
          disabled={true}
        />
        {/* Discount and onDiscount dropdown*/}
        <div className="flex items-center space-x-2">
          <DataInput
            label={
              <span className="text-red-600 text-sm font-[var(--font-inter)]">
                DISCOUNT
              </span>
            }
            name="Discount"
            value={cards.Discount}
            onChange={handleNumericChange}
            disabled={!canCustom("Discount")}
          />
          {/* Ondiscount Dropdown */}
          <select
            name="Discount_On"
            value={cards.Discount_On}
            onChange={(e) => updateField("Discount_On", e.target.value)}
            disabled={!canCustom("Discount") || isDiscountOnDiseabled}
            className="p-2 py-2 mt-5 h-10 w-34 text-xs rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 cursor-pointer !text-black"
          >
            <option value="A">%On Amount</option>
            <option value="R">%On Rate</option>
            <option value="O">%On Other Ch.</option>
            <option value="M">%On Making</option>
            <option value="P">Rs.On Pcs</option>
            <option value="F">OnFull</option>
            <option value="G">On Making Rate</option>
          </select>
        </div>
        {/* Discount Amount */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              {" "}
              DISC.AMOUNT
            </span>
          }
          name="Discount_Amt"
          value={cards.Discount_Amt}
          onChange={handleNumericChange}
          disabled={true}
        />
        {/* Tax % */}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              TAX AMOUNT ({cards.Cgst_Per + cards.Sgst_Per}%)
            </span>
          }
          name="gstAmount"
          value={String(gstAmount.toFixed(2))}
          onChange={handleNumericChange}
          disabled={true}
        />
        {/* Amount (Read-only) */}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              AMOUNT
            </span>
          }
          name="amount"
          value={String(amount.toFixed(2))}
          onChange={handleChange}
          disabled={true}
        />
        <CounterTable
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              COUNTER
            </span>
          }
          name="Counter"
          value={cards.Counter}
          options={counter}
          onChange={(value) => updateField("Counter", value)}
          disabled={!canCustom("Counter")}
        />
      </div>
      {/* Alert Message */}
      {message && (
        <Alert
          title={title as "success" | "error" | "warning" | "info"}
          message={message}
        />
      )}
    </div>
  );
};

export default SalesBody;
