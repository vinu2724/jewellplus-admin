"use client"
import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import CounterStockHeader from './StockCounterHeader'
import StockCounterBody from './StockCounterBody'; // Import StockCounterBody
import { format } from "date-fns";
import StockCounterFooter from './StockCounterFooter'; // Import StockCounterFooter
import useCounterList from "@/hooks/Counter-List"; // Assuming this hook provides { code, name, branch_Branch_Name }
import useUserList from "@/hooks/User-List"; // Import useUserList
import { useUser } from "@/context/UserContext";
import Button from '@/utils/Button';

// Define the type for the StockCounterMain structure
export interface StockCounterMain {
  docNo: string;
  date: string;
  docTime: string;
  senderName: string;
  receiverName: string;
  fromCounter: string;
  toCounter: string;
  transferBy: string;
  narration: string;
  acceptStockTransfer: boolean;
}

// Define the type for individual items in the stock counter body
export interface StockCounterItem {
  barcode: string | null;
  itemDescription: string;
  narration: string;
  itemCategory: string;
  ct: string; // Caret, e.g., "22K"
  pcs: string; // Counted quantity
  grossWt: string;
  netWt: string;
  makingRate: string;
  makingOn: string; // 'P'(Pcs), 'G'(Gms), 'F'(Full), 'W'(West.%), 'N'(N.A.)
  stockQty: string; // System's stock quantity for this item/barcode
  amount?: string; // Optional, can be calculated based on other fields
  supplier?: string; // Optional, if needed
}

// Define the type for the StockCounterFooterData structure
export interface StockCounterFooterData {
  totalGrossWt: string;
  totalNetWt: string;
  totalAmount: string;
}

// Initial state for StockCounterMain
const initialStockCounterMain: StockCounterMain = {
  docNo: "1", // Assuming Doc No is auto-generated or fetched
  date: format(new Date(), "yyyy-MM-dd"),
  docTime: new Date().toLocaleTimeString("en-GB", { // Autogenerate current time in HH:mm format
    hour: "2-digit",
    minute: "2-digit",
  }),
  senderName: "",
  receiverName: "",
  fromCounter: "",
  toCounter: "",
  transferBy: "",
  narration: "",
  acceptStockTransfer: false,

};

// Initial state for a single StockCounterItem
const initialStockCounterItem: StockCounterItem = {
  barcode: null,
  itemDescription: "", // This would typically be fetched based on barcode
  narration: "",
  itemCategory: "", // Fetched
  ct: "", // Fetched or user input
  pcs: "0",
  grossWt: "0.000",
  netWt: "0.000",
  makingRate: "0.00",
  makingOn: "N", // Default to N.A.
  stockQty: "0", // Fetched
    amount: "0.00", // Optional, can be calculated
    supplier: "", // Optional, if needed
};

// Initial state for StockCounterFooterData
const initialStockCounterFooterData: StockCounterFooterData = {
  totalGrossWt: "0.000",
  totalNetWt: "0.000",
  totalAmount: "0.00",
};

const StockCounter = () => {
  const [stockCounterItems, setStockCounterItems] = useState<StockCounterItem[]>([{ ...initialStockCounterItem }]);
  const [stockCounterFooterData, setStockCounterFooterData] = useState<StockCounterFooterData>(initialStockCounterFooterData);

  const { userData } = useUser(); // Get logged-in user's data
 console.log("User Data:", userData?.username); // Debugging log to check user data
 // Debugging log to check user counter
 console.log("User Counter Name:", userData?.counter_name); // Debugging log to check user counter name
  const [stockCounterMainData, setStockCounterMainData] = useState<StockCounterMain>({
    ...initialStockCounterMain,
    senderName: userData?.username|| "", // Changed to User_Name based on typical usage
    fromCounter: userData?.counter_name || "", // Assuming counter_name is the name of the counter
  });
  // Fetch counter options using the custom hook, similar to Sales.tsx
  const { counterDropDown: counterOptions } = useCounterList();
  // Fetch user options for "Sender Name", "Receiver Name", "Transfer By" fields
  const { dropDown: userListOptions } = useUserList(); // Use dropDown, which seems to be the array of user objects

  // Fetch user options for "Transfer By" field, similar to Sales.tsx for Salesman/Delivery By
 
  // Handle general input changes
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStockCounterMainData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setStockCounterMainData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  // Handle fetching inward data (placeholder)
  const handleFetchInward = useCallback(() => {
    console.log("Fetching today's inward data for:", stockCounterMainData.date);
    // Actual fetch logic would go here
  }, [stockCounterMainData.date]);

  // Handle adding a new item to the stock counter body
  const handleAddStockItem = useCallback(() => {
    setStockCounterItems((prevItems) => [
      ...prevItems,
      { ...initialStockCounterItem },
    ]);
  }, []);

  // Handle updating an existing item
  const updateStockItem = useCallback((index: number, updatedItem: StockCounterItem) => {
    setStockCounterItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? updatedItem : item))
    );
  }, []);

  // Handle deleting an item
  const deleteStockItem = useCallback((index: number) => {
    setStockCounterItems((prevItems) => {
      if (prevItems.length === 1) {
        // If it's the last item, reset it to the initial state
        return [{ ...initialStockCounterItem }];
      }
      // Otherwise, filter out the item at the specified index
      return prevItems.filter((_, i) => i !== index);
    });
  }, []);
  // Calculate totals for the footer
  useEffect(() => {
    const totals = stockCounterItems.reduce(
      (acc, item) => {
        acc.totalGrossWt += parseFloat(item.grossWt) || 0;
        acc.totalNetWt += parseFloat(item.netWt) || 0;
        acc.totalAmount += parseFloat(item.amount || "0") || 0; // Ensure amount is handled if undefined
        return acc;
      },
      {
        totalGrossWt: 0,
        totalNetWt: 0,
        totalAmount: 0,
      }
    );

    setStockCounterFooterData({
      totalGrossWt: totals.totalGrossWt.toFixed(3),
      totalNetWt: totals.totalNetWt.toFixed(3),
      totalAmount: totals.totalAmount.toFixed(2),
    });
  }, [stockCounterItems]);

  // Placeholder for Submit action
  const handleSubmitStockTransfer = useCallback(async () => {
    console.log("Submitting Stock Transfer Data:");
    console.log("Main Data:", stockCounterMainData);
    console.log("Items:", stockCounterItems);
    console.log("Footer Data:", stockCounterFooterData);
    // Actual submission logic (e.g., API call) would go here
  }, [stockCounterMainData, stockCounterItems, stockCounterFooterData]);

  // Placeholder for Delete action
  const handleDeleteStockTransfer = useCallback(() => {
    console.log("Deleting Stock Transfer with Doc No:", stockCounterMainData.docNo);
    // Actual deletion logic would go here, possibly with a confirmation modal
  }, [stockCounterMainData.docNo]);


  return (
   <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
             Counter Stock Transfer
        </h1>

        <CounterStockHeader
          stockCounterMainData={stockCounterMainData}
          onChange={handleChange}
          onCheckboxChange={handleCheckboxChange}
          onFetchInward={handleFetchInward}
          counterOptions={counterOptions || []} // Pass fetched counter options, ensure it's an array
          userOptions={userListOptions || []} // Pass fetched user options
          
        />
        <StockCounterBody
          items={stockCounterItems}
          updateStockItem={updateStockItem}
          deleteStockItem={deleteStockItem}
          onAddItem={handleAddStockItem}
          // Add other necessary props like item lists, caret lists if needed for dropdowns
        />
        <div className="max-w-4xl mx-auto justify-center mt-5 bg-white shadow-lg border rounded-lg p-1 sm:p-6 pb-8">
          <StockCounterFooter footerData={stockCounterFooterData} />
          {/* Submit and Delete Buttons */}
          <div className="flex justify-around mt-5 flex-wrap gap-4 mx-4 md:mx-52 lg:mx-60 xl:mx-64">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleDeleteStockTransfer}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleSubmitStockTransfer}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockCounter
