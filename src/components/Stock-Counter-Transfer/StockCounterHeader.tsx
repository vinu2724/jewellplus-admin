import React, { ChangeEvent, FC } from "react";
// import { format } from "date-fns";
import { CounterTable, DataInput, Checkbox, DataList } from "@/utils/CustomTags"; // Added DataList
import { StockCounterMain } from "./StockCounter"; // Import the interface

interface CounterStockHeaderProps {
  stockCounterMainData: StockCounterMain;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFetchInward: () => void;
  counterOptions: { code: string; name: string; branch_Branch_Name: string }[];
  userOptions: { User_Code: string | null; User_Id: string; User_Name: string }[]; // Adjusted User_Code to allow null
}
const CounterStockHeader: FC<CounterStockHeaderProps> = ({
  stockCounterMainData,
  onChange,
  onCheckboxChange,
  onFetchInward,
  counterOptions,
  userOptions, // Destructure userOptions
}) => {
  const {
    docNo,
    date,
    docTime,
    senderName,
    receiverName,
    fromCounter,
    toCounter,
    transferBy,
    narration,
    acceptStockTransfer,
  } = stockCounterMainData;
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-white shadow items-end">
      <DataInput
        label="Doc No"
        name="docNo"
        value={docNo}
        onChange={onChange}
        disabled // Doc No is often auto-generated or non-editable initially
      />
    
        {/* Container for Date and Time, to keep them grouped */}
        {/* This group will be one item in the main grid layout */}
        <div className="grid grid-cols-2 gap-x-2 items-end"> {/* Added gap-x-2 for spacing and items-end for alignment */}
          <DataInput
            label="Date"
            name="date"
            type="date"
            value={date} // Already in "yyyy-MM-dd" format from initial state or onChange
            onChange={onChange}
          />
          
          {/* Time input with its own label for proper alignment and structure */}
          <div>
            <label htmlFor="docTime" className="block text-sm font-medium text-gray-700"> {/* Standard label styling */}
              Time
            </label>
            <input
              id="docTime"
              type="time"
              name="docTime"
              value={docTime ?? ""}
              onChange={onChange}
              className="block w-full h-10 border rounded-md px-3 py-2 border-gray-500 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1" // Use w-full, removed fixed width/margins, added mt-1
            />
          </div>
        </div>
      

    

      <DataList
        label="Sender Name"
        name="senderName"
        value={senderName}
        onChange={onChange}
        disabled={true} // Disable the Sender Name field
        options={userOptions.map(user => user.User_Name)} // Assuming DataList takes an array of strings or handles user objects
      />

      <DataList
        label="Receiver Name"
        name="receiverName"
        value={receiverName}
        onChange={onChange}
        options={userOptions.map(user => user.User_Name)}
      />
   
      <CounterTable
        label="From Counter"
        name="fromCounter"
        value={fromCounter}
        onChange={(val) =>
          onChange({
            target: { name: "fromCounter", value: val },
          } as ChangeEvent<HTMLInputElement>)
        }
        options={counterOptions}
      />

      <CounterTable
        label="To Counter"
        name="toCounter"
        value={toCounter}
        onChange={(val) =>
          onChange({
            target: { name: "toCounter", value: val },
          } as ChangeEvent<HTMLInputElement>)
        }
        options={counterOptions}
      />
       <Checkbox
        label="Accept Stock Transfer"
        name="acceptStockTransfer"
        checked={acceptStockTransfer}
        onChange={onCheckboxChange} // Use onCheckboxChange for checkboxes
      />
      <DataList
        label="Transfer By"
        name="transferBy"
        value={transferBy}
        onChange={onChange}
        options={userOptions.map(user => user.User_Name)}
      />

      <DataInput
        label="Narration"
        name="narration"
        value={narration}
        onChange={onChange}
      />

     
   
        <DataInput
          label="From Barcode"
          value={""}
          name="barcode"
          onChange={onChange}
        />
        <button
          type="button"
          className="bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
          onClick={() => console.log("Select Barcode")}
        >
          Select Barcode
        </button>
      
      <DataInput
        label="To Barcode" // Consistent Label Casing
        value={""}
        name="barcode"
        onChange={onChange}
      />

      <div className="flex items-end justify-start">
        <button
          type="button"
          onClick={onFetchInward}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
        >
          Fetch Todays Inward
        </button>
      </div>
    </div>
  );
};

export default CounterStockHeader;
