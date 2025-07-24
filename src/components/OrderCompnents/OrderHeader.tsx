import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OrderHeaderType } from "./Order";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import useCRMList, { Customer } from "@/hooks/CRM-List";
import { DataInput, DataList } from "@/utils/CustomTags";
import { FiSearch } from "react-icons/fi";
import { IoIosPerson } from "react-icons/io";
import { GetOrderMain } from "@/hooks/Get-Order-Main";
import Button from "@/utils/Button";
import { useAccessControl } from "@/hooks/useAccessControl";
import useGetUserList from "@/hooks/Get-User-List";
import { useUser } from "@/context/UserContext";

interface SalesFormProps {
  orderMain: OrderHeaderType;
  handleChange: (event: ChangeEvent<HTMLInputElement> | Date | null) => void;
  handleBillTypeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSalesmanChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCard_NoChange: (cardNo: string) => void;
  orderMainData: GetOrderMain[];
}

const OrderHeader: FC<SalesFormProps> = ({
  orderMain,
  handleChange,
  handleBillTypeChange,
  handleSalesmanChange,
  handleTypeChange,
  handleCard_NoChange,
  orderMainData,
}) => {
  const { userData } = useUser();
  const { canCustom } = useAccessControl("w_counter_order");
  const [salesMan, setSalesman] = useState<string[]>([]);
  //B-Account, E-Shop
  const billTypes = ["ACCOUNT", "SHOP"];

  const billTypeMapping = {
    B: "ACCOUNT",
    E: "SHOP",
  } as const;

  const flgTypes = ["ORDER", "REPAIRING"];

  const flgTypeMapping = {
    O: "ORDER",
    R: "REPAIRING",
  } as const;

  const handleDateChange = (Dt: Date | null) => {
    handleChange({
      target: {
        name: "Dt",
        value: Dt ? Dt.toISOString().split("T")[0] : "",
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  const handleCardChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      // Allow only up to 5 digit numeric values
      if (/^\d{0,5}$/.test(value)) {
        handleChange({
          target: {
            name,
            value,
          },
        } as ChangeEvent<HTMLInputElement>); // Call with correct parameters
      }
    },
    [handleChange]
  );

  //Route redirect
  const router = useRouter();

  // Customer Search functionality
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { customers, error, loadingCRMList, fetchCustomers } = useCRMList();

  // ✅ Fetch only once on date change (not on every render)
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  //handle customer selection
  const handleCustomerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setShowSuggestions(value.length > 0);
    handleChange(e);
  };
  //filter customer list based on input
  const filteredCustomers = useMemo(() => {
    if (!customers?.length || !orderMain.Code?.trim()) return [];

    return customers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(orderMain.Code.toLowerCase()) ||
        customer.address?.toLowerCase().includes(orderMain.Code.toLowerCase())
    );
  }, [customers, orderMain.Code]); // ✅ Runs only when `customers` or `searchQuery` changes
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
  //display customer selection
  const customerDetails = customers.find(
    (c) => c.code === Number(orderMain.Code)
  );

  //User-List

  const { getUserList, fetchGetUserList } = useGetUserList();

  // ✅ Fetch only once on date change (not on every render)
  useEffect(() => {
    fetchGetUserList();
  }, [fetchGetUserList]);
  useEffect(() => {
    if (getUserList && userData?.branch_code_firm) {
      const user = getUserList.filter(
        (users) => users.branch_code === userData.branch_code_firm
      );
      setSalesman(user.map((user) => user.user_name));
    }
  }, [getUserList, userData?.branch_code_firm]);

  //Get Sale Main API Hook Calling

  useEffect(() => {
    if (orderMain.Card_No && orderMainData && orderMainData.length > 0) {
      const MainOrder = orderMainData[0];

      // Fill Bill Type & Delivered By
      handleChange({
        target: { name: "Bill_Type", value: MainOrder.Bill_Type || "" },
      } as ChangeEvent<HTMLInputElement>);
      handleChange({
        target: { name: "User_Id", value: MainOrder.User_Id || "" },
      } as ChangeEvent<HTMLInputElement>);
      // Name
      handleChange({
        target: { name: "Name", value: MainOrder.Name || "" },
      } as ChangeEvent<HTMLInputElement>);
      // Address
      handleChange({
        target: { name: "Address", value: MainOrder.Address || "" },
      } as ChangeEvent<HTMLInputElement>);
      // Address
      handleChange({
        target: { name: "Flg", value: MainOrder.Flg || "" },
      } as ChangeEvent<HTMLInputElement>);

      ////Deivered By Drop Down
      const SalesManDropDown = MainOrder.User_Id?.split(",")[0]?.trim(); // Get the first Latter of User_Id

      const user = getUserList.filter(
        (users) => users.branch_code === userData?.branch_code_firm
      );
      const matchSalesMan = user.find(
        (salesManPerson) => salesManPerson.user_id == Number(SalesManDropDown)
      );

      if (matchSalesMan) {
        handleChange({
          target: { name: "User_Nm", value: matchSalesMan?.user_name },
        } as ChangeEvent<HTMLInputElement>);
      } else {
        handleChange({
          target: { name: "User_Nm", value: "" },
        } as ChangeEvent<HTMLInputElement>);
      }

      const selectedCustomer = customers.find(
        (customer) => customer.code === MainOrder.Code
      );

      if (selectedCustomer) {
        handleChange({
          target: { name: "Code", value: String(selectedCustomer.code) },
        } as ChangeEvent<HTMLInputElement>);
      } else {
        handleChange({
          target: { name: "Code", value: "" },
        } as ChangeEvent<HTMLInputElement>);
      }
    }
  }, [
    orderMain.Card_No,
    customers,
    orderMainData,
    getUserList,
    userData?.branch_code_firm,
    handleChange,
  ]);

  return (
    <div className="max-w-6xl mx-auto mt-5 bg-white shadow-lg border rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-4 gap-4 text-black">
        <DataList
          label="BILL TYPE"
          name="Bill_Type"
          options={billTypes}
          value={
            billTypeMapping[
              orderMain.Bill_Type as keyof typeof billTypeMapping
            ] || ""
          }
          onChange={handleBillTypeChange}
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
            value={orderMain.Dt || ""}
            disabled={!canCustom("Change Date")} // Disable if user doesn't have permission
            onChange={(e) =>
              handleDateChange(e.target.value ? new Date(e.target.value) : null)
            }
            className="mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="relative">
          <DataInput
            label="CARD NO"
            name="Card_No"
            value={orderMain.Card_No}
            onChange={handleCardChange}
          />
          <div
            onClick={() => handleCard_NoChange(orderMain.Card_No)}
            className="absolute top-1/2 right-0 mt-[10px] transform -translate-y-1/2 bg-gradient-to-r from-gray-400 to-gray-700 text-white px-4 py-[11px] rounded-r-md cursor-pointer shadow-sm transition"
            title="Search Barcode"
          >
            <FiSearch
              size={18}
              className="text-gray-50 active:text-green-600"
            />
          </div>
        </div>
        <DataList
          label="SALESMAN"
          name="User_Nm"
          value={orderMain.User_Nm}
          options={salesMan}
          onChange={handleSalesmanChange}
        />
        <DataList
          label="TYPE"
          name="Flg"
          value={
            flgTypeMapping[orderMain.Flg as keyof typeof flgTypeMapping] || ""
          }
          options={flgTypes}
          onChange={handleTypeChange}
        />
        <div className="relative">
          <label className="block text-sm font-[var(--font-inter)]">
            CUSTOMER
          </label>
          <div className="relative">
            <input
              type="text"
              name="Code"
              value={orderMain.Code}
              placeholder="Search Customer"
              onChange={handleCustomerInputChange}
              className="mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
            <div
              onClick={() => {}}
              className="absolute top-1 mt-4 right-0 transform -translate-y-1/2  text-black px-4 py-[11px] rounded-r-md cursor-pointer shadow-sm transition"
              title="Search Barcode"
            >
              <IoIosPerson size={18} />
            </div>
            {/* Error Message */}
            {error && <p className="text-red-500 text-xs mt-1">No Customer</p>}
          </div>
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
            variant="contained"
            size="large"
            className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
            onClick={() => router.push("/manage-crm")}
          >
            Add CRM
          </Button>
        </div>
      </div>
      <div className="flex text-gray-700 mt-4">
        {customerDetails && orderMain.Code && (
          <div className="mt-2 w-full font-mono text-center">
            <span className="w-full px-5 py-2">{customerDetails.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHeader;
