import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { SalesMain } from "./Sales";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import useCRMList, { Customer } from "@/hooks/CRM-List";
import { Checkbox, DataInput, DataList } from "@/utils/CustomTags";
import { FiSearch } from "react-icons/fi";
import { IoIosPerson } from "react-icons/io";
import { GetSaleMain } from "@/hooks/Get-Sale-Main";
import Button from "@/utils/Button";
import { useAccessControl } from "@/hooks/useAccessControl";
import useGetUserList from "@/hooks/Get-User-List";
import { useUser } from "@/context/UserContext";

interface SalesFormProps {
  saleMainData: SalesMain;
  handleChange: (event: ChangeEvent<HTMLInputElement> | Date | null) => void;
  handleBillTypeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDeliveryByChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSalesmanChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCard_NoChange: (cardNo: string) => void;
  saleMain: GetSaleMain[];
}

const SalesHeader: FC<SalesFormProps> = ({
  saleMainData,
  handleChange,
  handleBillTypeChange,
  handleSalesmanChange,
  handleDeliveryByChange,
  handleCard_NoChange,
  saleMain,
}) => {
  const { userData } = useUser();
  console.log("userData", userData?.branch_code_firm);
  const { canCustom } = useAccessControl("w_counter_sale");

  const [users, setUsers] = useState<string[]>([]);

  //B-Account, E-Shop
  const billTypes = ["ACCOUNT", "SHOP"];

  const billTypeMapping = {
    B: "ACCOUNT",
    E: "SHOP",
  } as const;

  const handleCardNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
  };

  const handleDateChange = (Dt: Date | null) => {
    handleChange({
      target: {
        name: "Dt",
        value: Dt ? Dt.toISOString().split("T")[0] : "",
      },
    } as ChangeEvent<HTMLInputElement>);
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    // Set value to "Y" if checked, "N" if unchecked
    const value = checked ? "Y" : "N";

    handleChange({
      target: {
        name,
        value,
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  //Route redirect
  const router = useRouter();

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
    if (!customers?.length || !saleMainData.Code.trim()) return [];

    return customers.filter(
      (customer) =>
        customer.name
          ?.toLowerCase()
          .includes(saleMainData.Code.toLowerCase()) ||
        customer.address
          ?.toLowerCase()
          .includes(saleMainData.Code.toLowerCase())
    );
  }, [customers, saleMainData.Code]); // ✅ Runs only when `customers` or `searchQuery` changes

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
      setUsers(user.map((user) => user.user_name));
    }
  }, [getUserList, userData?.branch_code_firm]);
  ///////////////////////////////////////////////////////////////
  // Get Sale Main ----

  // Update form data when saleMain is fetched
  useEffect(() => {
    if (saleMainData.Card_No && saleMain && saleMain.length > 0) {
      const MainSale = saleMain[0];

      // Fill Bill Type & Delivered By
      handleChange({
        target: { name: "Bill_Type", value: MainSale.Bill_Type || "" },
      } as ChangeEvent<HTMLInputElement>);

      handleChange({
        target: { name: "User_Id", value: MainSale.User_Id || "" },
      } as ChangeEvent<HTMLInputElement>);

      ////Deivered By Drop Down
      if (getUserList) {
        // Auto-select customer using sale code
        const user = getUserList.filter(
          (users) => users.branch_code === userData?.branch_code_firm
        );

        const matchDeliveryBy = user.find(
          (deliverPerson) =>
            Number(deliverPerson.user_id) === Number(MainSale.Delevery_By_Id)
        );
        // Auto-fill Delivery By if Delevery_By
        if (matchDeliveryBy) {
          handleChange({
            target: { name: "Delevery_By", value: matchDeliveryBy.user_name },
          } as ChangeEvent<HTMLInputElement>);
        }
        // Auto-fill SalesMan if User_Nm/saleman

        const matchSalesMan = user.find(
          (salesManPerson) =>
            Number(salesManPerson.user_id) === Number(MainSale.User_Nm)
        );

        if (matchSalesMan) {
          handleChange({
            target: { name: "User_Nm", value: matchSalesMan.user_name },
          } as ChangeEvent<HTMLInputElement>);
        }
      }

      // Auto-select customer using sale code
      const selectedCustomer = customers.find(
        (customer) => customer.code === MainSale.Code
      );

      if (selectedCustomer) {
        handleChange({
          target: { name: "Code", value: String(selectedCustomer.code) },
        } as ChangeEvent<HTMLInputElement>);
        handleChange({
          target: { name: "Address", value: selectedCustomer.address },
        } as ChangeEvent<HTMLInputElement>);
        handleChange({
          target: { name: "Name", value: selectedCustomer.name },
        } as ChangeEvent<HTMLInputElement>);
      } else {
        // Clear customer if not found

        handleChange({
          target: { name: "Code", value: "" },
        } as ChangeEvent<HTMLInputElement>);
        handleChange({
          target: { name: "Address", value: "" },
        } as ChangeEvent<HTMLInputElement>);
        handleChange({
          target: { name: "Name", value: "" },
        } as ChangeEvent<HTMLInputElement>);
      }
    }
  }, [
    saleMain,
    customers,
    saleMainData.Card_No,
    getUserList,
    userData?.branch_code_firm,
    handleChange,
  ]);

  const customerDetails = customers.find(
    (c) => c.code === Number(saleMainData.Code)
  );

  return (
    <div className="max-w-6xl mx-auto mt-5 bg-white shadow-lg border rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-4 gap-4 text-black">
        <DataList
          label="BILL TYPE"
          name="Bill_Type"
          value={
            billTypeMapping[
              saleMainData.Bill_Type as keyof typeof billTypeMapping
            ] || ""
          }
          options={billTypes}
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
            value={saleMainData.Dt || ""}
            onChange={(e) =>
              handleDateChange(e.target.value ? new Date(e.target.value) : null)
            }
            disabled={!canCustom("Change Date")} // Disable if no permission
            className="mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="relative">
          <DataInput
            label="CARD NO"
            name="Card_No"
            value={saleMainData.Card_No}
            onChange={handleCardNoChange}
          />
          <div
            onClick={() => handleCard_NoChange(saleMainData.Card_No)}
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
          value={saleMainData.User_Nm}
          options={users}
          onChange={handleSalesmanChange}
        />

        <DataList
          label="DELIVERD BY"
          name="Delevery_By"
          value={saleMainData.Delevery_By}
          options={users}
          onChange={handleDeliveryByChange}
        />

        {/* Accepted By Checkbox - only show when editing/viewing an existing note */}
        {saleMain[0] && (
          <Checkbox
            label="ACCEPTED BY"
            name="Accept_By"
            checked={saleMainData.Accept_By === "Y"}
            onChange={handleCheckboxChange}
          />
        )}
        <div className="relative">
          <label className="block text-sm font-[var(--font-inter)]">
            CUSTOMER
          </label>
          <div className="relative">
            <input
              type="text"
              name="Code"
              value={saleMainData.Code}
              placeholder="Search Customer"
              onChange={handleCustomerInputChange}
              className="mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm font-[var(--font-roboto)] "
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
            className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
            size="large"
            onClick={() => router.push("/manage-crm")}
          >
            Add CRM
          </Button>
        </div>
      </div>
      <div className="flex text-gray-700 mt-4">
        {customerDetails && saleMainData.Code && (
          <div className="mt-2 w-full font-mono text-center">
            <span className="w-full px-5 py-2">{customerDetails.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHeader;
