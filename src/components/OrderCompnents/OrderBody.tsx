import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { OrderBodyType } from "./Order";
import useItemList from "@/hooks/Item-List";
import useGetItemRate from "@/hooks/Get-ItemRate";
import useItemCategoryMasterList from "@/hooks/Item-Category-Master-List";
import { useUser } from "@/context/UserContext";
import useCounterList from "@/hooks/Counter-List";
import {
  CounterTable,
  CrtTable,
  DataInput,
  DataList,
} from "@/utils/CustomTags";
import { FiSearch } from "react-icons/fi";
import { useAccessControl } from "@/hooks/useAccessControl";

interface OrderBodyProps {
  index: number;
  orderDetail: OrderBodyType;
  Dt: string;
  updateCard: (index: number, updatedCard: OrderBodyType) => void;
  deleteCard: (index: number) => void;
  caretCategoryOptions: {
    caret_code: number;
    puriety_per: number;
    caret_name: string | null;
  }[];
  itemCategoryOptions: string[];
  handleBarcodeChange: (index: number, Barcode: string) => void; // New prop
}

const OrderBody: FC<OrderBodyProps> = ({
  index,
  orderDetail,
  Dt,
  updateCard,
  deleteCard,
  caretCategoryOptions,
  itemCategoryOptions,
  handleBarcodeChange,
}) => {
  const { canCustom } = useAccessControl("w_counter_order");
  // State to control whether Input is disabled should be disabled
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isMakingDisabled, setIsMakingDisabled] = useState<boolean>(false);
  const [Wt_Applicable, setWt_Applicable] = useState<boolean>(false);
  const [isFieldDiseabled, setIsFieldDisabled] = useState<boolean>(false);
  const [SaleWeight, setSaleWeight] = useState("0.000");
  const [isDiscountOnDiseabled, setisDiscountOnDiseabled] =
    useState<boolean>(false);

  // Track if `ct` is manually changed
  const [isCtManuallyUpdated, setIsCtManuallyUpdated] = useState(false);

  const { itemsNames: itemList, ItemdropDown } = useItemList();

  const matchedItem = ItemdropDown.find(
    (item) => item.item_Name === orderDetail.Item_Code
  );

  const updateField = useCallback(
    (name: string, value: string) => {
      const updatedCard = { ...orderDetail, [name]: value };

      // Update the entire card
      updateCard(index, updatedCard);
    },
    [index, orderDetail, updateCard]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateField(e.target.name, e.target.value);
    },
    [updateField]
  );

  const [lastUpdatedField, setLastUpdatedField] = useState<
    "date" | "days" | null
  >(null);

  const handleDeliveryDateChange = (Delivery_Date: Date | null) => {
    setLastUpdatedField("date"); // 👈 Track that user changed date
    handleChange({
      target: {
        name: "Delivery_Date",
        value: Delivery_Date ? Delivery_Date.toISOString().split("T")[0] : "",
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  const handleDeliveryDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty value for typing (optional)
    if (value === "") {
      handleChange(e);
      return;
    }

    const days = parseInt(value);
    if (!isNaN(days) && days >= 0) {
      setLastUpdatedField("days");
      handleChange(e);
    } else {
      console.warn("Delivery days must be 0 or more");
      // Optional: set to 0, or do nothing
    }
  };

  useEffect(() => {
    const today = new Date();

    if (lastUpdatedField === "days" && orderDetail.Delivery_Days) {
      const days = parseInt(orderDetail.Delivery_Days);
      if (!isNaN(days)) {
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + days);

        const newDate = deliveryDate.toISOString().split("T")[0];
        const dayName = deliveryDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (orderDetail.Delivery_Date !== newDate) {
          updateField("Delivery_Date", newDate);
        }
        if (orderDetail.Days_Name !== dayName) {
          updateField("Days_Name", dayName);
        }
      }
    }

    if (lastUpdatedField === "date" && orderDetail.Delivery_Date) {
      const deliveryDate = new Date(orderDetail.Delivery_Date);

      const timeDiff = deliveryDate.getTime() - today.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const dayName = deliveryDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (orderDetail.Delivery_Days !== String(dayDiff)) {
        updateField("Delivery_Days", String(dayDiff));
      }
      if (orderDetail.Days_Name !== dayName) {
        updateField("Days_Name", dayName);
      }
    }
  }, [
    orderDetail.Delivery_Days,
    orderDetail.Delivery_Date,
    orderDetail.Days_Name,
    lastUpdatedField,
    updateField,
  ]);

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
          ["Rate", "Amount", "Making", "Other_Charges", "Orn_Amt"].includes(
            name
          )
        ) {
          formattedValue = Number(value).toFixed(2) ?? "0.00"; // 2 decimals for amount fields
        }

        updateField(name, formattedValue);

        // Sync netWeight with grossWeight
        if (name === "Gross_Wt") {
          updateCard(index, {
            ...orderDetail,
            Gross_Wt: formattedValue,
            Net_Wt: formattedValue,
          });
        }

        // Sync rngNWeight with Rng_Gross_Wt
        if (name === "Rng_Gross_Wt") {
          updateCard(index, {
            ...orderDetail,
            Rng_Gross_Wt: formattedValue,
            Rng_Wt: formattedValue,
          });
        }
      }
    },
    [updateField, updateCard, index, orderDetail]
  );

  // Handle manual `ct` updates
  const handleCtChange = (newCt: string) => {
    setIsCtManuallyUpdated(true); // Mark `ct` as manually changed
    updateCard(index, { ...orderDetail, Crt: newCt });
  };

  //SaleWeight calculate depend upon itemType
  useEffect(() => {
    if (matchedItem) {
      if (matchedItem.item_Type === "F") {
        setSaleWeight(
          (
            (Number(orderDetail.Pcs) || 0) - (Number(orderDetail.Rng_Pcs) || 0)
          ).toFixed(3) || "0.000"
        );
      } else {
        setSaleWeight(
          (
            (Number(orderDetail.Net_Wt) || 0) -
            (Number(orderDetail.Rng_Wt) || 0)
          ).toFixed(3) || "0.000"
        );
      }
    }
  }, [
    orderDetail.Net_Wt,
    ItemdropDown,
    orderDetail.Pcs,
    orderDetail.Rng_Pcs,
    matchedItem,
    orderDetail.Rng_Wt,
  ]);

  useEffect(() => {
    if (orderDetail.Pcs && orderDetail.Hm_Rate) {
      const calculatedHmAmount = (
        Number(orderDetail.Pcs) * Number(orderDetail.Hm_Rate)
      ).toFixed(2);
      updateCard(index, { ...orderDetail, Hm_Amount: calculatedHmAmount });
    }
    // eslint-disable-next-line
  }, [orderDetail.Pcs, orderDetail.Hm_Rate]);

  const gstPercentage =
    orderDetail.Sgst_Per + orderDetail.Cgst_Per + orderDetail.Igst_Per;
  const gstAmount =
    ((Number(orderDetail.Amount) +
      Number(orderDetail.Other_Charges) +
      Number(orderDetail.Making_Amt) +
      Number(orderDetail.Hm_Amount) -
      Number(orderDetail.Discount_Amt)) *
      Number(gstPercentage)) /
    100;

  useEffect(() => {
    if (gstAmount) {
      const calculatedCgstSgst = parseFloat((gstAmount / 2).toFixed(2));
      updateCard(index, {
        ...orderDetail,
        Cgst_Amt: calculatedCgstSgst,
        Sgst_Amt: calculatedCgstSgst,
      });
    }
    // eslint-disable-next-line
  }, [gstAmount]);
  // Calculate Total Amount with these Formula
  const Orn_Amt =
    Number(orderDetail.Amount) +
    Number(orderDetail.Other_Charges) +
    Number(orderDetail.Making_Amt) +
    Number(gstAmount) +
    Number(orderDetail.Hm_Amount) -
    Number(orderDetail.Discount_Amt);

  function customRound(value: number): number {
    const decimal = value - Math.floor(value);
    if (decimal <= 0.49) {
      return Math.floor(value);
    } else {
      return Math.ceil(value);
    }
  }

  // Item selected
  useEffect(() => {
    if (matchedItem && !orderDetail.Barcode) {
      const gstSplit = parseFloat((gstAmount / 2).toFixed(2));

      // Only update when values truly differ
      const shouldUpdate =
        matchedItem.discount_On != orderDetail.Discount_On ||
        Number(matchedItem.cgst_Per) !== orderDetail.Cgst_Per ||
        Number(matchedItem.sgst_Per) !== orderDetail.Sgst_Per ||
        gstSplit !== orderDetail.Cgst_Amt ||
        gstSplit !== orderDetail.Sgst_Amt;

      if (shouldUpdate) {
        updateCard(index, {
          ...orderDetail,
          Making_On: matchedItem.making_On,
          Discount_On: matchedItem.discount_On,
          Hm_Rate: String(matchedItem.hm_Rate) || "0.00",
          Cgst_Per: Number(matchedItem.cgst_Per) || 0,
          Sgst_Per: Number(matchedItem.sgst_Per) || 0,
          Cgst_Amt: gstSplit,
          Sgst_Amt: gstSplit,
        });
      }

      setisDiscountOnDiseabled(
        matchedItem.discount_On !== orderDetail.Discount_On
      );
      const isDisabledType = ["D", "T", "F"].includes(matchedItem.item_Type);
      setIsInputDisabled(isDisabledType);
      // Set isMakingRateDisabled state based on item_Type condition
      setIsMakingDisabled(matchedItem?.making_Applicable === "N");
      setWt_Applicable(matchedItem?.wt_Applicable === "N");
      orderDetail.Hm_Amount = String(
        (Number(orderDetail.Pcs) * Number(orderDetail.Hm_Rate)).toFixed(2)
      );
    }
  }, [matchedItem, index, updateCard, orderDetail, gstAmount, ItemdropDown]);

  // Fetch item category based on selected item code
  const { itemCategoryDropDown } = useItemCategoryMasterList(
    matchedItem?.item_Code
  );

  // 🔹 Effect to update ct and makingRate based on Item_Narration
  useEffect(() => {
    if (orderDetail.Item_Narration && !orderDetail.Barcode) {
      const matchedCategory = itemCategoryDropDown.find(
        (item) => item.item_category === orderDetail.Item_Narration
      );

      if (!matchedCategory) return; // 🚨 Prevent unnecessary updates

      const newCt = `${matchedCategory.crt.toFixed(2)}K` || "";
      const newMakingRate = matchedCategory.sale_making
        ? Number(matchedCategory.sale_making).toFixed(2)
        : "0.00";
      const newMakingOn = matchedCategory.sale_making_on || "";

      // ✅ Only update state if values have actually changed
      if (
        (!isCtManuallyUpdated &&
          newCt === "0.00K" &&
          orderDetail.Crt !== newCt) ||
        orderDetail.Making !== newMakingRate
      ) {
        updateCard(index, {
          ...orderDetail,
          Crt: newCt, // Keep manual ct changes
          Making: newMakingRate,
          Making_On: newMakingOn,
        });
      }
    }
  }, [
    orderDetail,
    itemCategoryDropDown,
    index,
    updateCard,
    isCtManuallyUpdated,
  ]);

  // Get Rate

  const { getRate } = useGetItemRate();
  const [rateFetched, setRateFetched] = useState(false);
  useEffect(() => {
    setRateFetched(false);
  }, [orderDetail.Crt, matchedItem?.item_Code, Dt]);

  useEffect(() => {
    const crtValue = orderDetail.Crt ? orderDetail.Crt.replace(/K$/i, "") : "";

    const fetchRate = async () => {
      const S = "S";
      const rateData = await getRate(
        matchedItem?.item_Code || "",
        Dt,
        crtValue,
        S
      );
      const matchedCategory = itemCategoryDropDown.find(
        (item) => item.item_category === orderDetail.Item_Narration
      );

      const rateValue = rateData?.rate
        ? Number(rateData.rate)
        : Number(matchedCategory?.srate);
      // ✅ Only update state if values have actually changed
      if (
        orderDetail.Rate !== Number(rateValue).toFixed(2) &&
        !orderDetail.Barcode
      ) {
        updateCard(index, {
          ...orderDetail,
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
    itemCategoryDropDown,
    orderDetail,
    updateCard,
    rateFetched,
    matchedItem?.item_Code,
    caretCategoryOptions,
    Dt,
  ]);

  //Amount
  useEffect(() => {
    const weight = Number(SaleWeight);
    const rate = Number(orderDetail.Rate);
    if (weight > 0 && rate > 0) {
      const calculatedAmount = (weight * rate).toFixed(2);
      if (orderDetail.Amount !== calculatedAmount) {
        updateCard(index, { ...orderDetail, Amount: calculatedAmount });
      }
    }
  }, [SaleWeight, orderDetail, index, updateCard]);

  //On west % making amount formula
  useEffect(() => {
    let newMakingAmt = "0.00";
    const totalPcs = Number(orderDetail.Pcs) - Number(orderDetail.Rng_Pcs);
    const MakingAmt1 =
      (Number(orderDetail.Making) * totalPcs).toFixed(2) || "0.00";
    const MakingAmt2 =
      (Number(orderDetail.Making) * Number(SaleWeight)).toFixed(2) || "0.00";
    const MakingAmt3 = Number(orderDetail.Making).toFixed(2) || "0.00";
    const MakingAmt4 =
      (
        ((Number(orderDetail.Rate) * Number(orderDetail.Making)) / 100) *
        Number(SaleWeight)
      ).toFixed(2) || "0.00";
    switch (orderDetail.Making_On) {
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

    if (orderDetail.Making_Amt !== newMakingAmt) {
      updateCard(index, { ...orderDetail, Making_Amt: newMakingAmt });
    }
  }, [SaleWeight, orderDetail, index, updateCard]);

  //discount Amount
  useEffect(() => {
    const totalPcs = Number(orderDetail.Pcs) - Number(orderDetail.Rng_Pcs);

    // Discount formulas
    const DiscountAmt1 =
      ((Number(orderDetail.Amount) +
        Number(orderDetail.Making_Amt) +
        Number(orderDetail.Other_Charges)) *
        Number(orderDetail.Discount)) /
      100;
    const DiscountAmt2 =
      ((Number(orderDetail.Rate) * Number(orderDetail.Discount)) / 100) *
      Number(SaleWeight);
    const DiscountAmt3 =
      (Number(orderDetail.Other_Charges) * Number(orderDetail.Discount)) / 100;
    const DiscountAmt4 =
      (Number(orderDetail.Making_Amt) * Number(orderDetail.Discount)) / 100;
    const DiscountAmt5 = Number(orderDetail.Discount) * totalPcs;
    const DiscountAmt6 = Number(orderDetail.Discount);
    const DiscountAmt7 = Number(orderDetail.Discount) * Number(SaleWeight);

    let Discount_Amt = 0.0;
    switch (orderDetail.Discount_On) {
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

    if (orderDetail.Discount_Amt !== formattedDiscountAmt) {
      updateCard(index, { ...orderDetail, Discount_Amt: formattedDiscountAmt });
    }
    // eslint-disable-next-line
  }, [
    orderDetail.Discount_On,
    orderDetail.Discount,
    orderDetail.Amount,
    orderDetail.Making_Amt,
    orderDetail.Other_Charges,
    orderDetail.Rate,
    SaleWeight,
    orderDetail.Pcs,
    orderDetail.Rng_Pcs,
  ]);

  //Counter List Hook Api call
  const { counterDropDown } = useCounterList();
  const { userData } = useUser(); // 👈 use context for user Login data info

  const counter = counterDropDown.filter(
    (users) => users.branch_Code === userData?.branch_code_firm
  );

  // use default counter value from user data
  const defaultCounter = counter.find(
    (item) => item.name === userData?.counter_name
  )?.name;
  // Set default counter value if not already set
  useEffect(() => {
    if (!orderDetail.Counter && defaultCounter) {
      updateCard(index, { ...orderDetail, Counter: defaultCounter });
    }

    // Set Barcode_Counter if barcode contains "#"
    if (
      orderDetail.Barcode?.includes("#") &&
      !orderDetail.Barcode_Counter &&
      defaultCounter
    ) {
      updateCard(index, { ...orderDetail, Barcode_Counter: defaultCounter });
      setIsFieldDisabled(false);
    }
  }, [defaultCounter, orderDetail, index, updateCard]);

  //if barcode is present then pcs hould disabled
  const isPcsDisabled = (orderDetail.Barcode?.length ?? 0) > 0;
  //rng pcs get disabled when pcs is 0, 1
  const isRngPcsDisabled = orderDetail.Pcs === "0" || orderDetail.Pcs === "1";

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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 text-gray-800">
        {/* Barcode */}
        <div className="relative">
          <DataInput
            label="BARCODE"
            name="Barcode"
            value={orderDetail.Barcode || null}
            onChange={(e) =>
              updateField("Barcode", e.target.value.toUpperCase())
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBarcodeChange(index, orderDetail.Barcode || "");
              }
            }}
          />
          <div
            onClick={() => {
              handleBarcodeChange(index, orderDetail.Barcode || "");
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
          value={orderDetail.Item_Code}
          options={itemList}
          onChange={(e) => updateField("Item_Code", e.target.value)}
        />
        <CrtTable
          label="CRT"
          name="Crt"
          value={orderDetail.Crt} // Show "20K", "22K"
          options={caretCategoryOptions} // Options are like "20K"
          disabled={isInputDisabled}
          onChange={(value) => handleCtChange(value)}
        />

        <div className="col-span-1 xl:col-span-3 md:col-span-3">
          <DataList
            label="NARRATION"
            name="Item_Narration"
            value={orderDetail.Item_Narration || ""}
            options={itemCategoryOptions}
            onChange={(e) =>
              updateField("Item_Narration", e.target.value.toUpperCase())
            }
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
          value={String(orderDetail.Pcs)}
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
          value={orderDetail.Gross_Wt}
          disabled={Wt_Applicable}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
        />
        {/* NET WEIGHT */}
        <DataInput
          label={
            <span className="text-blue-800 text-sm font-[var(--font-inter)]">
              NET WEIGHT
            </span>
          }
          name="Net_Wt"
          value={orderDetail.Net_Wt}
          onChange={handleNumericChange}
          disabled={Wt_Applicable}
          onBlur={handleNumericBlur}
        />
        {/* RNG PCS */}
        <DataInput
          label={
            <span className="text-red-600 text-sm font-[var(--font-inter)]">
              RNG PCS
            </span>
          }
          name="Rng_Pcs"
          value={String(orderDetail.Rng_Pcs)}
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
          value={orderDetail.Rng_Gross_Wt}
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
          value={orderDetail.Rng_Wt}
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
          value={orderDetail.Rate}
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
          value={orderDetail.Amount}
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
          value={orderDetail.Other_Charges}
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
            value={orderDetail.Making}
            onChange={handleNumericChange}
            disabled={isMakingDisabled}
            onBlur={handleNumericBlur}
          />

          {/* makingOn Dropdown */}
          <select
            name="Making_On"
            value={orderDetail.Making_On}
            onChange={(e) => updateField("Making_On", e.target.value)}
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
          value={orderDetail.Making_Amt}
          onChange={handleChange}
          disabled={true}
        />
        {/* Making */}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              H.M AMOUNT
            </span>
          }
          name="Making_Amt"
          value={orderDetail.Hm_Amount}
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
            value={orderDetail.Discount}
            onChange={handleNumericChange}
            disabled={!canCustom("Discount")}
          />
          {/* Ondiscount Dropdown */}
          <select
            name="Discount_On"
            value={orderDetail.Discount_On}
            disabled={!canCustom("Discount") || isDiscountOnDiseabled}
            onChange={(e) => updateField("Discount_On", e.target.value)}
            className="p-2 py-2 mt-5 h-10 w-34 text-xs rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 cursor-pointer text-black"
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
              DISC. AMOUNT
            </span>
          }
          name="Discount_Amt"
          value={orderDetail.Discount_Amt}
          onChange={handleNumericChange}
          disabled={true}
        />
        {/* Tax % */}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              GST ({orderDetail.Cgst_Per + orderDetail.Sgst_Per}%)
            </span>
          }
          name="gstAmount"
          value={String(gstAmount.toFixed(2))}
          onChange={handleNumericChange}
          disabled={true}
        />
        {/* Counter*/}

        <CounterTable
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              COUNTER
            </span>
          }
          name="Counter"
          value={orderDetail.Counter}
          options={counter}
          onChange={(value) => updateField("Counter", value)}
        />

        {/* Barcode Counter*/}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              BARCODE COUNTER
            </span>
          }
          name="Barcode_Counter"
          value={orderDetail.Barcode_Counter}
          disabled={true}
          onChange={handleChange}
        />
        {/* Ornament Amount */}
        <DataInput
          label={
            <span className="text-blue-600text-sm font-[var(--font-inter)]">
              ORNAMENT AMOUNT
            </span>
          }
          name="Orn_Amt"
          value={String(customRound(Orn_Amt).toFixed(2))}
          onChange={handleNumericChange}
          onBlur={handleNumericBlur}
          disabled={true}
        />
      </div>
      <hr className="mt-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-2 text-gray-800">
        {/* Any Special Instruction */}
        <div className="col-span-1 xl:col-span-3">
          <DataInput
            label={
              <span className="text-blue-600 text-sm font-[var(--font-inter)]">
                ANY SPECIAL INSTRUCTION
              </span>
            }
            name="Narration"
            value={orderDetail.Narration}
            onChange={(e) =>
              updateField("Narration", e.target.value.toUpperCase())
            }
          />
        </div>

        <DataInput
          label="DELIVERY DAYS"
          name="Delivery_Days"
          value={orderDetail.Delivery_Days}
          disabled={isFieldDiseabled}
          onChange={handleDeliveryDaysChange}
        />

        {/* Delivery date */}

        <div>
          <label
            htmlFor="Delivery_Date"
            className="block text-sm font-[var(--font-inter)]"
          >
            DELIVERY DATE
          </label>
          <input
            type="date"
            name="Delivery_Date"
            id="Delivery_Date"
            value={orderDetail.Delivery_Date || ""}
            onChange={(e) =>
              handleDeliveryDateChange(
                e.target.value ? new Date(e.target.value) : null
              )
            }
            min={new Date().toISOString().split("T")[0]} // 👈 Prevent past dates
            disabled={isFieldDiseabled}
            className="mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>

        {/* Barcode Counter*/}
        <DataInput
          label={
            <span className="text-blue-600 text-sm font-[var(--font-inter)]">
              DAYS NAME
            </span>
          }
          name="Days_Name"
          value={orderDetail.Days_Name}
          disabled={true}
          onChange={handleChange}
        />
        {/* <DataList
          label="DELIVERY TIME"
          name="Delivery_Time"
          value={String(orderDetail.Delivery_Time)}
          options={DeliveryTIME}
          onChange={(e) => updateField("Delivery_Time", e.target.value)}
        />
        <DataList
          label="OLD GOLD"
          name="Old_Gold"
          value={String(orderDetail.Old_Gold)}
          options={OldGold}
          onChange={(e) => updateField("Old_Gold", e.target.value)}
        />
        <DataList
          label="ADVANCE"
          name="Advance"
          value={String(orderDetail.Advance)}
          options={Advance}
          onChange={(e) => updateField("Advance", e.target.value)}
        /> */}
      </div>
    </div>
  );
};

export default OrderBody;
