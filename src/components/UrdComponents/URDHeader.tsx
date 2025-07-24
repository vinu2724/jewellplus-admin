import React, {
  ChangeEvent,
  FC,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import "react-datepicker/dist/react-datepicker.css";
// DatalistTable might not be needed directly here anymore for some fields
import { URDHeaderType } from "./URD";
// import DatePicker from "react-datepicker"; // Import DatePicker

import useCRMList, { Customer } from "@/hooks/CRM-List";
import { useRouter } from "next/navigation"; // Use next/navigation for routing
// import useGetUrdMain from "@/hooks/Get-URD-Main"; // Adjust the import path as necessary
import { DataInput, DataList } from "@/utils/CustomTags";
import { FiSearch } from "react-icons/fi";
import { GetUrdMain } from "@/hooks/Get-URD-Main";
import { useAccessControl } from "@/hooks/useAccessControl";
import Button from "@/utils/Button";

interface URDFormProps {
  formdata: URDHeaderType;
  handleChange: (event: ChangeEvent<HTMLInputElement> | Date | null) => void; // Update signature to include Date | null
  handleBillTypeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCard_NoChange: (cardNo: string) => void;
  urdMain: GetUrdMain[];
}

const URDHeader: FC<URDFormProps> = ({
  formdata,
  handleChange,
  handleBillTypeChange,
  handleTypeChange, // Use this prop
  handleCard_NoChange,
  urdMain,
}) => {
  const { canCustom } = useAccessControl("w_counter_purchase");
  const billTypes = ["ACCOUNT", "SHOP"];

  const billTypeMapping = {
    B: "ACCOUNT",
    E: "SHOP",
  } as const;
  const flgTypes = ["ORDER", "URD"];

  const transTypes = {
    O: "ORDER",
    U: "URD",
  } as const; // Example transaction types

  // Specific handler for DatePicker
  const handleDateChange = useCallback(
    (date: Date | null) => {
      handleChange(date); // Pass the Date object or null directly
    },
    [handleChange]
  );
  const handleCardNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
  };
  // Customer related state and hooks
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const { customers, error, loadingCRMList, fetchCustomers } = useCRMList();

  // ✅ Fetch only once on date change (not on every render)
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setShowSuggestions(value.length > 0);
    handleChange(e);
  };

  const filteredCustomers = useMemo(() => {
    if (!customers?.length || !formdata.Code || !formdata.Code.trim())
      return [];

    return customers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(formdata.Code.toLowerCase()) ||
        customer.address?.toLowerCase().includes(formdata.Code.toLowerCase())
    );
  }, [customers, formdata.Code]);

  const selectCustomer = (customer: Customer) => {
    setShowSuggestions(false);

    handleChange({
      target: { name: "Code", value: String(customer.code) },
    } as ChangeEvent<HTMLInputElement>);

    handleChange({
      target: { name: "Address", value: customer.address },
    } as ChangeEvent<HTMLInputElement>);

    handleChange({
      target: { name: "Name", value: customer.name },
    } as ChangeEvent<HTMLInputElement>);
  };

  const customerDetails = customers.find(
    (c) => c.code === Number(formdata.Code)
  );

  // Autofill formdata fields when urdMain data changes
  useEffect(() => {
    if (formdata.Card_No && urdMain && urdMain.length > 0) {
      const mainData = urdMain[0];

      handleChange({
        target: { name: "Bill_Type", value: mainData.Bill_Type || "" },
      } as ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "Branch_Code", value: mainData.Branch_Code || "" },
      } as ChangeEvent<HTMLInputElement>);

      handleChange({
        target: { name: "Trans_Type", value: mainData.Trans_Type || "" },
      } as ChangeEvent<HTMLInputElement>);

      handleChange({
        target: { name: "User_Id", value: mainData.User_Id || "" },
      } as ChangeEvent<HTMLInputElement>);

      handleChange({
        target: { name: "Code", value: String(mainData.Code) || "" },
      } as ChangeEvent<HTMLInputElement>);

      handleChange({
        target: { name: "Name", value: mainData.Name || "" },
      } as ChangeEvent<HTMLInputElement>);

      handleChange({
        target: { name: "Address", value: mainData.Address || "" },
      } as ChangeEvent<HTMLInputElement>);

      handleChange({
        target: { name: "Mobile", value: mainData.Mobile || "" },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [urdMain, formdata.Card_No, handleChange]);

  const router = useRouter(); // Use Next.js router for navigation
  return (
    <div className="max-w-6xl mx-auto mt-5 bg-white shadow-lg border rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 gap-4 text-black">
        {/* Date Picker for Dt */}
        {/* Bill Type */}
        <DataList
          label="BILL TYPE"
          name="Bill_Type"
          value={
            billTypeMapping[
              formdata.Bill_Type as keyof typeof billTypeMapping
            ] || ""
          }
          options={billTypes}
          onChange={handleBillTypeChange} // Use specific handler for Bill_Type
        />

        <div>
          <label
            htmlFor="Dt"
            className="block text-sm font-[var(--font-inter)]"
          >
            DATE
          </label>
          <input
            type="date"
            name="Dt"
            id="Dt"
            value={formdata.Dt || ""}
            onChange={(e) =>
              handleDateChange(e.target.value ? new Date(e.target.value) : null)
            }
            disabled={!canCustom("Change Date")}
            className="mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="relative">
          <DataInput
            label="CARD NO" // Corrected Label
            name="Card_No" // Use correct field name
            value={formdata.Card_No ?? ""}
            onChange={handleCardNoChange}
          />
          <div
            onClick={() => {
              handleCard_NoChange(formdata.Card_No);
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
        {/* Transaction Type - Using DataList */}
        <DataList
          label="TYPE"
          name="Trans_Type"
          options={flgTypes} // Provide actual options
          value={
            transTypes[formdata.Trans_Type as keyof typeof transTypes] || ""
          }
          onChange={handleTypeChange} // Use specific handler for Trans_Type
        />

        <div className="relative">
          <label className="block text-sm font-[var(--font-inter)]">
            CUSTOMER
          </label>
          <div className="relative ">
            <input
              type="text"
              name="Code"
              value={formdata.Code ?? ""}
              placeholder="Search Customer"
              onChange={handleCustomerInputChange}
              className="mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
            {/* Error Message */}
            {error && <p className="text-red-500 text-xs mt-1">No Customer</p>}
          </div>
          {/* Error Message */}
          {/* {error && <p className="text-red-500 text-xs mt-1">No Customer</p>} */}
          {/* Suggestion Box */}
          {/* Show no results when customers list is empty */}
          {showSuggestions && filteredCustomers.length > 0 && (
            <div className="absolute z-30 bg-white w-full border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
              {loadingCRMList ? (
                <p className="p-2 text-sm text-gray-500">
                  Loading customers...
                </p>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.code}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex flex-col"
                    onClick={() => selectCustomer(customer)} // ✅ Set customer on click
                  >
                    <span className="font-semibold text-sm">
                      {customer.name} ({customer.code})
                    </span>
                    <span className="text-xs text-gray-600">
                      {customer.address}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-center items-center">
          <Button
            size="large"
            className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
            onClick={() => router.push("/manage-crm")}
          >
            Add CRM
          </Button>
        </div>
      </div>
      <div className="flex text-gray-700 mt-4">
        {customerDetails && formdata.Code && (
          <div className="mt-2 w-full font-mono text-center">
            <span className="w-full px-5 py-2">{customerDetails.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default URDHeader;
