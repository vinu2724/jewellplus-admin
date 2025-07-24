import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import useCounterList from "@/hooks/Counter-List";
import useItemList from "@/hooks/Item-List";

import { URDBodyType } from "./URD";
import { useUser } from "@/context/UserContext";
import useGetItemRate from "@/hooks/Get-ItemRate";
import {
  Checkbox,
  CounterTable,
  CrtTable,
  DataInput,
  DataList,
} from "@/utils/CustomTags";
import { useAccessControl } from "@/hooks/useAccessControl";

export interface ItemCategoryMaster {
  item_code: string;
  item_category: string;
  sale_making: number;
  prate: number;
  sale_making_on: string;
  srate: number;
  crt: number;
}
interface URDBodyProps {
  index: number;
  formData: URDBodyType;
  Dt: string;
  Type: string;
  updateCard: (index: number, updatedCard: URDBodyType) => void;
  deleteCard: (index: number) => void;
  setMessage: (message: string | null) => void;
  setTitle: (title: string) => void;
  itemList: string[];
  itemCategoryDropDown: ItemCategoryMaster[];
  caretCategoryOptions: {
    caret_code: number;
    puriety_per: number;
    caret_name: string | null;
  }[];
  isDataFromFetch?: boolean; // Added for Issue 2 fix
}

const URDBody: FC<URDBodyProps> = ({
  index,
  formData,
  Dt,
  Type,
  updateCard,
  deleteCard,
  setMessage,
  setTitle,
  itemList,
  itemCategoryDropDown,
  caretCategoryOptions,
  isDataFromFetch = false, // Added for Issue 2 fix
}) => {
  const { canCustom } = useAccessControl("w_counter_purchase");
  const [selectedItemCode, setLocalSelectedItemCode] = useState<string | null>(
    null
  );
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isPcsDesible, setIsPcsDesible] = useState<boolean>(false);
  const [isPurityFieldDisabled, setIsPurityFieldDisabled] =
    useState<boolean>(true); // Default to disabled

  // Added for Issue 2 fix
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [disableFineWeightCalculation, setDisableFineWeightCalculation] =
    useState(isDataFromFetch);

  const rcpUpdateSourceRef = useRef(false); // Define rcpUpdateSourceRef at the component's top level
  const diffAmtManuallyUpdatedRef = useRef(false);

  const narrationOptions = itemCategoryDropDown.map((c) => c.item_category);

  const updateField = useCallback(
    (name: string, value: string) => {
      const updatedCard = { ...formData, [name]: value };
      updateCard(index, updatedCard); // Update the entire card in the parent state
    },
    [index, formData, updateCard]
  );

  useEffect(() => {
    if (formData.Item_Type === "D" && formData.Narration) {
      const selectedCategory = itemCategoryDropDown.find(
        (c) => c.item_category === formData.Narration
      );
      if (selectedCategory && selectedCategory.prate) {
        const newRate = Number(selectedCategory.prate).toFixed(2);
        if (formData.Rate !== newRate) {
          updateField("Rate", newRate);
        }
      }
    }
  }, [
    formData.Narration,
    formData.Item_Type,
    itemCategoryDropDown,
    updateField,
    formData.Rate,
  ]);

  const handleNumericChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === "Diff_Amt") {
        // Allow only numerical values with + or -, and up to two decimal places
        if (/^[-+]?\d*\.?\d{0,2}$/.test(value)) {
          diffAmtManuallyUpdatedRef.current = true; // Signal Diff_Amt is the source
          rcpUpdateSourceRef.current = false; // Not from RCP edit
          updateField(name, value);
        }
      } else if (name === "Puriety_Per") {
        // Allow only values between 1 and 100
        if (/^\d{0,3}$/.test(value) && Number(value) <= 100) {
          updateField(name, value);
        }
      } else {
        // Default behavior for other fields
        if (/^\d*\.?\d*$/.test(value)) {
          if (name === "Pcs") {
            const numericValue = value === "" ? "" : Number(value).toFixed(0); // No decimals for pcs
            updateField(name, numericValue);
          } else {
            updateField(name, value);
          }
        }
      }
    },
    [updateField]
  );

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    // Set Eg_No to "Y" if checked, "N" if unchecked
    updateField(name, checked ? "Y" : "N");
  };

  const handleNumericBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      let formattedValue = value.trim();

      // --- Formatting ---
      if (formattedValue !== "") {
        if (name === "Diff_Amt") {
          formattedValue = Number(formattedValue).toFixed(2);
        } else if (name === "Puriety_Per") {
          const purityValue = Math.min(
            Math.max(Number(formattedValue), 0),
            110
          ); // Allow 0-110 on blur
          formattedValue = purityValue.toFixed(2); // No decimals for purity
        } else if (["Gross_Wt", "Net_Wt", "Gross_Wt1"].includes(name)) {
          formattedValue = Number(formattedValue).toFixed(3);
        } else if (["Rate", "Amount", "Eg_Rate"].includes(name)) {
          formattedValue = Number(formattedValue).toFixed(2); // 2 decimals for amount fields
        } else if (name === "Pcs") {
          formattedValue = Number(formattedValue).toFixed(0);
        }
      } else {
        // Value is empty or whitespace
        if (name === "Puriety_Per")
          formattedValue = "100"; // Default purity if cleared
        else if (["Gross_Wt", "Net_Wt", "Gross_Wt1"].includes(name))
          formattedValue = "0.000";
        else if (["Rate", "Amount", "Eg_Rate", "Diff_Amt"].includes(name))
          formattedValue = "0.00";
        else if (name === "Pcs") formattedValue = "0";
      }

      if (name === "Gross_Wt") {
        // This is the UI "NET WEIGHT" field
        const netWtNumeric = Number(formattedValue);
        const grossWt1Numeric = Number(formData.Gross_Wt1); // This is the UI "GROSS WEIGHT" field

        if (netWtNumeric > grossWt1Numeric) {
          setMessage(
            "Net Weight cannot be more than Gross Weight. Value has been corrected."
          );
          setTitle("warning");
          formattedValue = formData.Gross_Wt1; // Correct Net_Wt to Gross_Wt1's current (formatted) value
          setTimeout(() => setMessage(null), 3000);
        }
        updateField(name, formattedValue); // Apply the (potentially corrected) formatted value
      } else if (name === "Gross_Wt1") {
        // This is the UI "GROSS WEIGHT" field
        const newGrossWt1Formatted = formattedValue;
        const currentNetWtBeforeGrossWt1Update = Number(formData.Gross_Wt); // Net Wt before this Gross_Wt1 blur

        const updatedCardData = {
          ...formData,
          Gross_Wt1: newGrossWt1Formatted,
          Gross_Wt: newGrossWt1Formatted,
        };

        if (
          Number(newGrossWt1Formatted) < currentNetWtBeforeGrossWt1Update &&
          currentNetWtBeforeGrossWt1Update !== Number(formData.Gross_Wt1)
        ) {
          // This condition implies Gross_Wt1 was lowered significantly, and Gross_Wt (Net Wt) needs to follow.
          // The message is for when Gross_Wt was explicitly higher and now gets corrected down.
          setMessage("Net Weight adjusted to match new Gross Weight.");
          setTitle("info");
          setTimeout(() => setMessage(null), 3000);
        }
        updateCard(index, updatedCardData);
      } else {
        // For all other fields, just update the field with its formatted value
        updateField(name, formattedValue);
      }
    },
    [updateField, updateCard, index, formData, setMessage, setTitle]
  );

  // Handle manual `ct` updates
  const handleCtChange = (newCt: string) => {
    updateCard(index, { ...formData, Crt: newCt });
  };

  const { ItemdropDown } = useItemList();
  const { counterDropDown } = useCounterList();

  useEffect(() => {
    if (formData.Item_Code) {
      const matchedItem = ItemdropDown.find(
        (item) => item.item_Name === formData.Item_Code
      );
      if (matchedItem) {
        if (selectedItemCode !== matchedItem.item_Code) {
          setLocalSelectedItemCode(matchedItem.item_Code);
        }
        if (formData.Item_Type !== matchedItem.item_Type) {
          updateField("Item_Type", matchedItem.item_Type);
        }
      }
    }
  }, [
    formData.Item_Code,
    ItemdropDown,
    selectedItemCode,
    updateField,
    formData.Item_Type,
  ]);

  useEffect(() => {
    if (selectedItemCode) {
      const matchedItem = ItemdropDown.find(
        (item) => item.item_Code === selectedItemCode
      );

      // Original logic for disabling general inputs (GrossWt, NetWt, Crt, etc.)
      setIsInputDisabled(
        matchedItem?.item_Type === "F" ||
          matchedItem?.item_Group === "D" ||
          matchedItem?.item_Group === "T" ||
          matchedItem?.item_Group === "F" ||
          matchedItem?.wt_Applicable === "N"
      );

      setIsPcsDesible(matchedItem?.pcs_Applicable === "N");

      // New logic for Purity field editability
      if (matchedItem) {
        if (
          matchedItem.item_Code === "SO" &&
          matchedItem.ct_Applicable === "N"
        ) {
          updateCard(index, { ...formData, Crt: "0.00K" });
        }
        // Assuming 'G', 'S', 'P' are item_Type codes for Gold, Silver, Platinum
        const isGoldSilverPlatinum = ["G", "S", "P"].includes(
          matchedItem.item_Type
        );
        const isWeightApplicable = matchedItem.wt_Applicable === "Y";

        if (isGoldSilverPlatinum && isWeightApplicable) {
          setIsPurityFieldDisabled(false);
        } else {
          setIsPurityFieldDisabled(true);
        }
      } else {
        setIsPurityFieldDisabled(true);
      }
    }
  }, [selectedItemCode, ItemdropDown]);

  const { userData } = useUser();
  const counter = counterDropDown;

  const defaultCounter = counter.find(
    (item) => item.name === userData?.counter_name
  )?.name;

  // Set default counter value if not already set
  useEffect(() => {
    if (!formData.Counter && defaultCounter) {
      updateCard(index, { ...formData, Counter: defaultCounter });
    }
  }, [defaultCounter, formData, index, updateCard]);

  // Get crtValue from caretCategoryOptions based on caret_code
  const crtValue =
    caretCategoryOptions
      .find(
        (option) =>
          option.caret_code === Number(formData.Crt?.match(/\d+/)?.[0])
      )
      ?.caret_code.toString() || "";

  const { getRate } = useGetItemRate();
  const [rateFetched, setRateFetched] = useState(false);
  const [normalRate, setNormalRate] = useState("0.00");

  useEffect(() => {
    setRateFetched(false);
  }, [crtValue, selectedItemCode, Dt]);
  useEffect(() => {
    const fetchRate = async () => {
      const P = "P";
      const normalRate = await getRate(selectedItemCode || "", Dt, crtValue, P);

      const rateValue = normalRate?.rate ? Number(normalRate.rate) : "0.00";
      setNormalRate(String(rateValue));
      // ✅ Only update state if values have actually changed
      if (Number(formData.Rate) === 0 && formData.Rate != String(rateValue)) {
        updateCard(index, {
          ...formData,
          Rate: String(rateValue),
        });
      }
      setRateFetched(true);
    };

    if (
      !rateFetched &&
      selectedItemCode &&
      Dt &&
      crtValue &&
      formData.Item_Type !== "D"
    ) {
      fetchRate();
    }
  }, [
    getRate,
    index,
    formData,
    updateCard,
    rateFetched,
    selectedItemCode,
    Dt,
    crtValue,
    formData.Crt,
    formData.Item_Type,
  ]); // ✅ keep minimal and stable

  const [exchangeRateValue, setExchangeRateValue] = useState("0.00");

  useEffect(() => {
    const fetchRate = async () => {
      const S = "S";
      const exchangeRate = await getRate(
        selectedItemCode || "",
        Dt,
        crtValue,
        S
      );

      const rateValue = exchangeRate?.rate ? Number(exchangeRate.rate) : "0.00";
      setExchangeRateValue(String(rateValue));
      // ✅ Only update state if values have actually changed
      if (Number(formData.Rate) === 0 && formData.Rate != String(rateValue)) {
        updateCard(index, {
          ...formData,
          Rate: String(rateValue),
        });
      }
      setRateFetched(true);
    };

    if (
      !rateFetched &&
      selectedItemCode &&
      Dt &&
      crtValue &&
      formData.Item_Type !== "D"
    ) {
      fetchRate();
    }
  }, [
    getRate,
    index,
    formData,
    updateCard,
    rateFetched,
    selectedItemCode,
    Dt,
    crtValue,
    formData.Crt,
    formData.Item_Type,
  ]); // ✅ keep minimal and stable

  const fineWeight = (
    (Number(formData.Gross_Wt) * Number(formData.Puriety_Per)) /
    100
  ).toFixed(3);

  // ISSUE 2 FIX: Modified Fine Weight calculation to prevent auto-calculation when fetching data
  useEffect(() => {
    // Skip calculation if data is from fetch and it's initial load
    if (isDataFromFetch && isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Skip calculation if explicitly disabled
    if (disableFineWeightCalculation) {
      return;
    }

    const calculatedFineWeight = (
      (Number(formData.Gross_Wt) * Number(formData.Puriety_Per)) /
      100
    ).toFixed(3);

    if (formData.Net_Wt !== calculatedFineWeight) {
      updateCard(index, { ...formData, Net_Wt: calculatedFineWeight });
    }
  }, [
    formData.Gross_Wt,
    formData.Puriety_Per,
    formData.Net_Wt,
    index,
    formData,
    updateCard,
    isDataFromFetch,
    isInitialLoad,
    disableFineWeightCalculation,
  ]);

  // Effect to enable fine weight calculation after initial load from fetch
  useEffect(() => {
    if (isDataFromFetch && !isInitialLoad) {
      const timer = setTimeout(() => {
        setDisableFineWeightCalculation(false);
      }, 1000); // Allow 1 second for data to settle

      return () => clearTimeout(timer);
    }
  }, [isDataFromFetch, isInitialLoad]);

  const amountValue =
    formData.Item_Type === "F"
      ? (Number(formData.Rate) * Number(formData.Pcs)).toFixed(2)
      : (Number(formData.Rate) * Number(fineWeight)).toFixed(2);

  // Correct netAmount calculation: sum of amountValue and Diff_Amt
  const netAmount = Math.round(
    Number(amountValue) + Number(formData.Diff_Amt)
  ).toFixed(2);

  useEffect(() => {
    if (formData.Eg_No === "Y") {
      const rate =
        exchangeRateValue !== undefined
          ? Number(exchangeRateValue).toFixed(2)
          : "0.00";
      if (formData.Eg_Rate !== rate) {
        updateField("Eg_Rate", rate);
      }
    } else {
      if (formData.Eg_Rate !== "0.00") {
        updateField("Eg_Rate", "0.00");
      }
    }
    // eslint-disable-next-line
  }, [formData.Eg_No, exchangeRateValue, updateField]);

  // Effect to calculate and update formData.Amount when its dependencies change
  useEffect(() => {
    let newAmount;
    if (formData.Item_Type === "F") {
      newAmount = (Number(formData.Rate) * Number(formData.Pcs)).toFixed(2);
    } else {
      const netWt = Number(formData.Gross_Wt);
      const purity = Number(formData.Puriety_Per);
      const rate = Number(formData.Rate);
      const currentFineWeightNumeric = (netWt * purity) / 100;

      newAmount = (rate * currentFineWeightNumeric).toFixed(2);
    }

    if (formData.Amount !== newAmount) {
      updateField("Amount", newAmount);
    }
  }, [
    formData.Gross_Wt,
    formData.Puriety_Per,
    formData.Rate,
    formData.Pcs,
    formData.Item_Type,
    formData.Amount,
    updateField,
  ]);

  // Keep only this effect:
  useEffect(() => {
    if (Type === "O") {
      if (formData.Rate !== "0.00") {
        updateField("Rate", "0.00");
      }
      return;
    }
    if (
      formData.Item_Type !== "D" &&
      formData.Item_Code &&
      formData.Crt &&
      normalRate !== undefined
    ) {
      const fetchedRate = Number(normalRate).toFixed(2);
      if (formData.Rate !== fetchedRate) {
        updateField("Rate", fetchedRate);
      }
    }
  }, [
    Type,
    formData.Item_Code,
    formData.Crt,
    formData.Rate,
    normalRate,
    updateField,
    formData.Item_Type,
  ]);

  const isRateFieldActuallyDisabled = Type === "O";

  // Add a new ref to track if user is actively typing in RCP field
  const isTypingRcpRef = useRef(false);

  // Local state for RCP Amount, initialized from amountValue + Diff_Amt
  const [editableRcpAmount, setEditableRcpAmount] = useState<string>(
    (Number(amountValue) + Number(formData.Diff_Amt)).toFixed(2)
  );

  // ISSUE 1 FIX: MODIFIED Purity calculation when Diff_Amt is manually updated
  useEffect(() => {
    if (
      diffAmtManuallyUpdatedRef.current &&
      !rcpUpdateSourceRef.current &&
      formData.Item_Type !== "F"
    ) {
      const R_val = parseFloat(formData.Rate);
      const DA_new_val = parseFloat(formData.Diff_Amt);
      const currentTargetTotalRcp = parseFloat(editableRcpAmount);
      console.log("Editable RCP Amount1:", editableRcpAmount);
      if (!isPurityFieldDisabled) {
        // Scenario 1: Purity is editable. Recalculate Purity, keeping Gross_Wt and Rate constant.
        // FIXED: Use Gross_Wt instead of Net_Wt for purity calculation
        const GW_val = parseFloat(formData.Gross_Wt); // Changed from Net_Wt
        const targetBaseAmountForPurity = currentTargetTotalRcp - DA_new_val;
        let newPurityStr = formData.Puriety_Per;

        if (R_val > 0 && GW_val > 0 && targetBaseAmountForPurity >= 0) {
          // CORRECTED FORMULA: Purity = (Target Amount * 100) / (Rate * Gross Weight)
          const P_new_percent =
            (targetBaseAmountForPurity * 100) / (R_val * GW_val);
          const boundedPurity = Math.min(Math.max(P_new_percent, 0), 110);
          newPurityStr = boundedPurity.toFixed(0);
        } else if (targetBaseAmountForPurity < 0 || GW_val <= 0 || R_val <= 0) {
          newPurityStr = "1"; // Min purity
        }

        if (formData.Puriety_Per !== newPurityStr) {
          // Update Purity. Diff_Amt is already set from user input.
          updateCard(index, {
            ...formData,
            Puriety_Per: newPurityStr,
            Diff_Amt: DA_new_val.toFixed(2),
          });
        }
      } else {
        // Scenario 2: Purity is NOT editable. Recalculate Net_Wt, keeping Purity and Rate constant.
        const P_percent_val = parseFloat(formData.Puriety_Per); // Current (fixed) Purity
        if (R_val > 0 && P_percent_val > 0) {
          const P_actual = P_percent_val / 100;
          const targetBaseAmountForNetWtCalc =
            currentTargetTotalRcp - DA_new_val;

          if (targetBaseAmountForNetWtCalc >= 0) {
            const GW_new_val =
              targetBaseAmountForNetWtCalc / (R_val * P_actual);
            if (!isNaN(GW_new_val) && GW_new_val >= 0) {
              const newNetWtStr = GW_new_val.toFixed(3);
              if (formData.Gross_Wt !== newNetWtStr) {
                updateCard(index, {
                  ...formData,
                  Gross_Wt: newNetWtStr,
                  Gross_Wt1: newNetWtStr,
                  Diff_Amt: DA_new_val.toFixed(2),
                });
              }
            }
          } else {
            if (formData.Gross_Wt !== "0.000") {
              updateCard(index, {
                ...formData,
                Gross_Wt: "0.000",
                Gross_Wt1: "0.000",
                Diff_Amt: DA_new_val.toFixed(2),
              });
            }
          }
        }
      }
      diffAmtManuallyUpdatedRef.current = false; // Reset flag
    }
  }, [
    formData.Diff_Amt,
    editableRcpAmount,
    formData.Rate,
    formData.Puriety_Per,
    formData.Gross_Wt, // Changed from Net_Wt
    formData.Item_Type,
    updateCard,
    index,
    formData,
    isPurityFieldDisabled,
  ]);

  const handleEditableRcpAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      isTypingRcpRef.current = true;

      rcpUpdateSourceRef.current = true;
      diffAmtManuallyUpdatedRef.current = false;
      setEditableRcpAmount(value);
    }
  };

  const handleEditableRcpAmountBlur = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (
      value.trim() === "" ||
      value.trim() === "." ||
      isNaN(parseFloat(value))
    ) {
      value = (Number(amountValue) + Number(formData.Diff_Amt)).toFixed(2);
    } else {
      value = Number(value).toFixed(2);
    }
    if (editableRcpAmount !== value) {
      rcpUpdateSourceRef.current = true;
      diffAmtManuallyUpdatedRef.current = false;
      setEditableRcpAmount(value);
    }
    isTypingRcpRef.current = false;
  };

  // Effect to RECALCULATE Diff_Amt if editableRcpAmount (target total) or amountValue (base) changes,
  // AND rcpUpdateSourceRef is true (meaning RCP amount was the source of change).
  useEffect(() => {
    if (isTypingRcpRef.current) {
      return;
    }
    if (rcpUpdateSourceRef.current && !diffAmtManuallyUpdatedRef.current) {
      const newDiffAmt = (
        Number(editableRcpAmount) - Number(amountValue)
      ).toFixed(2);
      if (formData.Diff_Amt !== newDiffAmt) {
        updateField("Diff_Amt", newDiffAmt);
      } else {
        // If Diff_Amt is now consistent, the cascade from RCP input might be complete.
        rcpUpdateSourceRef.current = false;
      }
    }
  }, [editableRcpAmount, amountValue, formData.Diff_Amt, updateField]);

  // ISSUE 1 FIX: CORRECTED Purity calculation when RCP amount is changed
  useEffect(() => {
    if (isTypingRcpRef.current) {
      return;
    }
    // Only run if RCP amount was the source, not "F" type, and Purity field is editable
    if (
      rcpUpdateSourceRef.current &&
      !diffAmtManuallyUpdatedRef.current &&
      formData.Item_Type !== "F" &&
      !isPurityFieldDisabled
    ) {
      const R_val = parseFloat(formData.Rate);
      // FIXED: Use Gross_Wt instead of Net_Wt for purity calculation
      const GW_val = parseFloat(formData.Gross_Wt); // Changed from Net_Wt
      const targetRcpTotal = parseFloat(editableRcpAmount);
      const currentDiffAmt = parseFloat(formData.Diff_Amt);

      const targetBaseAmountForPurityCalc = targetRcpTotal - currentDiffAmt;

      if (R_val > 0 && GW_val > 0) {
        let newPurityPercent;
        if (targetBaseAmountForPurityCalc >= 0) {
          // CORRECTED FORMULA: Purity = (Target Amount * 100) / (Rate * Gross Weight)
          newPurityPercent =
            (targetBaseAmountForPurityCalc * 100) / (R_val * GW_val);
        } else {
          newPurityPercent = 1;
        }

        const boundedPurity = Math.min(Math.max(newPurityPercent, 0), 110);
        const newPurityStr = boundedPurity.toFixed(2);

        if (formData.Puriety_Per !== newPurityStr) {
          updateField("Puriety_Per", newPurityStr);
        }
      }
    }
    console.log("Editable RCP Amount3:", editableRcpAmount);
  }, [
    editableRcpAmount,
    formData.Rate,
    formData.Gross_Wt, // Changed from Net_Wt
    formData.Diff_Amt,
    formData.Item_Type,
    formData.Puriety_Per,
    isPurityFieldDisabled,
    updateField,
  ]);

  // Effect to SYNCHRONIZE editableRcpAmount display with (amountValue + formData.Diff_Amt)
  // when no manual edits are actively driving changes.
  useEffect(() => {
    if (!rcpUpdateSourceRef.current && !diffAmtManuallyUpdatedRef.current) {
      const currentTotalFromFormData = (
        Number(amountValue) + Number(formData.Diff_Amt)
      ).toFixed(2);
      if (editableRcpAmount !== currentTotalFromFormData) {
        setEditableRcpAmount(currentTotalFromFormData);
      }
    }
    console.log("Editable RCP Amount4:", editableRcpAmount);
  }, [amountValue, formData.Diff_Amt, editableRcpAmount]);

  useEffect(() => {
    formData.Diff_Amt = String(
      Number(Number(netAmount) - Number(amountValue)).toFixed(2)
    ); // Ensure Diff_Amt is always set to the current amountValue
  }, [amountValue, netAmount, formData.Diff_Amt, formData]);

  return (
    <div className="max-w-6xl mx-auto mt-6 bg-white shadow-lg border border-gray-200 rounded-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-800 font-semibold text-lg">
          Sr. {index + 1}
        </span>
        <button
          className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-red-700 cursor-pointer transition duration-200"
          onClick={() => deleteCard(index)}
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-gray-800">
        <div className="col-span-1 xl:col-span-2">
          {/* Dropdown Inputs */}
          <DataList
            label="DECRIPTION"
            name="Item_Code"
            value={formData.Item_Code}
            options={itemList} // Prop from parent (HBdta)
            onChange={(e) => updateField("Item_Code", e.target.value)}
          />{" "}
        </div>
        <div className="col-span-1 xl:col-span-2">
          <DataList
            label="NARRATION"
            name="Narration"
            value={formData.Narration || ""}
            options={narrationOptions} // Prop from
            onChange={(e) => updateField("Narration", e.target.value)}
          />
        </div>
        <CrtTable
          label="CRT"
          name="Crt"
          value={formData.Crt ? formData.Crt.toString() : ""}
          options={caretCategoryOptions}
          disabled={isInputDisabled}
          onChange={(value) => handleCtChange(value)}
        />

        {/* PCS */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              PCS
            </span>
          }
          name="Pcs"
          value={String(formData.Pcs)}
          onChange={handleNumericChange}
          disabled={isPcsDesible} // <-- Disable if not applicable
        />

        {/* GROSS WEIGHT */}

        {/* GROSS WEIGHT */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              GROSS WEIGHT
            </span>
          }
          name="Gross_Wt1"
          value={formData.Gross_Wt1}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={isInputDisabled}
        />
        {/* NET WEIGHT */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              NET WEIGHT
            </span>
          }
          name="Gross_Wt"
          value={formData.Gross_Wt}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={isInputDisabled}
        />

        <DataInput
          label="PURITY"
          name="Puriety_Per"
          value={formData.Puriety_Per}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={isPurityFieldDisabled}
        />
        {/* FINE WEIGHT */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              FINE WEIGHT
            </span>
          }
          name="Net_Wt"
          value={fineWeight}
          disabled // Calculated in parent
          onChange={() => {}} // Read-only
          onBlur={handleNumericBlur}
        />
        <DataInput
          label="RATE"
          name="Rate"
          value={formData.Rate}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={!canCustom("Rate") || isRateFieldActuallyDisabled}
        />

        <div className="flex items-end space-x-2">
          {" "}
          <div className="flex-grow">
            {" "}
            <DataInput
              label={
                <span className="text-blue-800 text-sm font-[var(--font-inter)]">
                  EXCHANGE RATE
                </span>
              }
              name="Eg_Rate"
              value={formData.Eg_Rate}
              onBlur={handleNumericBlur}
              onChange={(e) => updateField("Eg_Rate", e.target.value)}
              disabled={formData.Eg_No !== "Y" || Type === "O"}
            />
          </div>
          <div className="pb-1">
            {" "}
            <Checkbox
              name="Eg_No"
              label=""
              checked={formData.Eg_No === "Y"}
              onChange={handleCheckboxChange}
              disabled={isInputDisabled || Type === "O"} // Disable checkbox if input is disabled or Type is "O"
            />
          </div>
        </div>

        <DataInput
          label="AMOUNT"
          name="Amount"
          value={amountValue}
          disabled
          onChange={() => {}}
          onBlur={handleNumericBlur}
        />
        <DataInput
          label="DIFFERENCE"
          name="Diff_Amt"
          value={formData.Diff_Amt}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
        />
        <DataInput
          label=" NET AMOUNT"
          name=" Net_Amount"
          value={netAmount}
          disabled
          onChange={() => {}} // Read-only
          onBlur={handleNumericBlur}
        />
        <CounterTable
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              COUNTER
            </span>
          }
          name="Counter"
          value={formData.Counter}
          options={counter}
          onChange={(value) => updateField("Counter", value)}
        />
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              Reverse Calculate Purity on Amount
            </span>
          }
          name="Rcp_Amount"
          value={editableRcpAmount}
          onChange={handleEditableRcpAmountChange}
          onBlur={handleEditableRcpAmountBlur}
          disabled={formData.Eg_No === "Y" || formData.Item_Type === "F"}
        />
      </div>
    </div>
  );
};

export default URDBody;
