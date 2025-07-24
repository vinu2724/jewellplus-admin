import React, {
  ChangeEvent,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NewCRM } from "./ManageCRM";
import useCRMList, { Customer } from "@/hooks/CRM-List";
import useCRMGroupList from "@/hooks/CRM-Group-List";

export interface NewCustomerBodyProps {
  CRMData: NewCRM;

  setCRMData: React.Dispatch<React.SetStateAction<NewCRM>>;
  errors: { Name: string; Mobile: string; Email: string; Pincode: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleMobileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePincodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMultipleOptionChange: (field: string, value: string) => void;
}

const CRMBody: FC<NewCustomerBodyProps> = ({
  CRMData,
  errors,

  handleChange,
  handleMobileChange,
  handleEmailChange,
  handlePincodeChange,
  handleMultipleOptionChange,
}) => {
  const inputClasses =
    "block h-11 w-full border border-gray-300 rounded-lg appearance-none px-4 py-1.5 text-xs  placeholder:text-gray-400 focus:outline-[#5268e6] focus:ring-1";

  const lableClases = "mb-1.5 block text-xs text-gray-700";

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { customers, fetchCustomers } = useCRMList();

  // ✅ Fetch only once on date change (not on every render)
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleReferenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setShowSuggestions(value.length > 0);
    handleChange(e);
  };

  const filteredCustomers = useMemo(() => {
    if (!customers?.length || !CRMData.Refrence_By?.trim()) return [];

    return customers.filter(
      (customer) =>
        customer.name
          ?.toLowerCase()
          .includes(CRMData.Refrence_By?.toLowerCase() || "") ||
        customer.address
          ?.toLowerCase()
          .includes(CRMData.Refrence_By?.toLowerCase() || "")
    );
  }, [customers, CRMData.Refrence_By]); // ✅ Runs only when `customers` or `searchQuery` changes

  const selectCustomer = (customer: Customer) => {
    setShowSuggestions(false);
    handleChange({
      target: { name: "Refrence_By", value: customer.name },
    } as ChangeEvent<HTMLInputElement>);
  };

  /// Fetching Ac_Group data
  const { group, groupLoading } = useCRMGroupList();

  const educationOptions = ["HSC", "GRADUATE", "POST GRADUATE", "PHD", "OTHER"];
  const occupationOptions = [
    "HOME MAKER",
    "SALARIED PRIVATE SECTOR",
    "SALARIED GOVERNMENT",
    "BUSINESS",
    "FARMING",
    "STUDENT",
  ];

  const Know_About_UsOptions = [
    "GOOGLE",
    "HOARDINGS",
    "MARKET VISITS",
    "NEWS PAPER",
    "REFERENCE",
    "SOCIAL MEDIA",
    "YOUTUBE-OTT",
  ];

  const Purchase_ReasonOptions = [
    "FESTIVAL",
    "GIFT",
    "INVESTMENT",
    "SELF",
    "WEDDING",
    "OTHER",
  ];
  //here is drop down value for why choose us
  const Why_Choose_UsOptions = [
    "PRODUCT KNOWLEDGE",
    "QUALITY",
    "SERVICE",
    "TRUST",
    "VARIETY",
  ];

  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState({
    Know_About_Us: false,
    Purchase_Reason: false,
    Why_Choose_Us: false,
    Ac_Group: false,
  });
  // Optional: Close dropdown on outside click
  const acGroupRef = useRef<HTMLDivElement>(null);
  const knowAboutUsRef = useRef<HTMLDivElement>(null);
  const purchaseReasonRef = useRef<HTMLDivElement>(null);
  const whyChooseUsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        !acGroupRef.current?.contains(target) &&
        !knowAboutUsRef.current?.contains(target) &&
        !purchaseReasonRef.current?.contains(target) &&
        !whyChooseUsRef.current?.contains(target)
      ) {
        setDropdownOpen({
          Know_About_Us: false,
          Purchase_Reason: false,
          Why_Choose_Us: false,
          Ac_Group: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (
    field: "Know_About_Us" | "Purchase_Reason" | "Why_Choose_Us" | "Ac_Group"
  ) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 text-black">
      {/* Name */}
      {/* Prefix and Name */}
      <div className="col-span-1 md:col-span-2">
        <div className="relative flex ">
          <label className="mb-1.5 text-xs text-gray-700">PREFIX</label>
          <label className="mb-1.5 ml-6 flex text-xs text-gray-700">
            NAME <span className="text-red-600">*</span>
          </label>
        </div>
        <div className="relative flex ">
          <select
            name="Prefix"
            id="Prefix"
            value={CRMData.Prefix || ""}
            onChange={handleChange}
            className="block h-11 py-1.5 border text-black  border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 text-sm placeholder:text-gray-400"
          >
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
            <option value="Trans">Other</option>
          </select>
          <input
            type="text"
            name="Name"
            id="Name"
            value={CRMData.Name || ""}
            onChange={handleChange}
            className="block  h-11  w-full rounded-r-lg   border border-gray-300 shadow-sm appearance-none px-4 py-1.5 text-sm  placeholder:text-gray-400 focus:outline-[#5268e6] focus:ring-1"
            required
          />
        </div>
        {errors.Name && (
          <p className="text-red-500 text-xs mt-1">{errors.Name}</p>
        )}
      </div>
      <div>
        <label className={lableClases}>GENDER</label>

        <select
          name="Sex"
          id="Sex"
          value={CRMData.Sex || ""}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="M">MALE</option>
          <option value="F">FEMALE</option>
          <option value="O">OTHER</option>
        </select>
      </div>
      {/* Address1 */}
      <div>
        <label className={lableClases}>ADDRESS 1</label>
        <input
          name="Address1"
          value={CRMData.Address1 || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      {/* Address 2*/}
      <div>
        <label className={lableClases}>ADDRESS 2</label>
        <input
          name="Address2"
          value={CRMData.Address2 || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      {/* Address 3*/}
      <div>
        <label className={lableClases}>ADDRESS 3</label>
        <input
          name="Address3"
          value={CRMData.Address3 || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      {/* Area */}
      <div>
        <label className={lableClases}>AREA</label>
        <input
          name="Area"
          value={CRMData.Area || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      {/* City */}
      <div>
        <label className={lableClases}>CITY</label>
        <input
          name="City"
          value={CRMData.City || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      {/* Locality */}

      <div>
        <label className={lableClases}>LOCALITY</label>
        <input
          name="Locality"
          value={CRMData.Locality || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      {/* Pincode */}
      <div>
        <label className={lableClases}>
          PINCODE<span className="text-red-600">*</span>
        </label>
        <input
          name="Pincode"
          value={CRMData.Pincode || ""}
          onChange={handlePincodeChange}
          maxLength={6} // Prevents entering more than 6 digits
          pattern="\d{6}" // Ensures only digits are allowed
          className={inputClasses}
          placeholder="Enter 6-digit Pincode"
        />
        {errors.Pincode && (
          <p className="text-red-500 text-xs mt-1">{errors.Pincode}</p>
        )}
      </div>

      {/* Mobile */}
      {/* Mobile and Mobile_Flg */}
      <div>
        <div className="flex justify-between ">
          <label className={lableClases}>
            MOBILE <span className="text-red-600">*</span>
          </label>
          <label className={lableClases}>SEND SMS</label>
        </div>
        <div className="relative flex ">
          <input
            type="text"
            name="Mobile"
            id="Mobile"
            value={CRMData.Mobile || ""}
            onChange={handleMobileChange}
            className="block  h-11  w-full rounded-l-lg   border border-gray-300 shadow-sm appearance-none px-4 py-1.5 text-sm  placeholder:text-gray-400 focus:outline-[#5268e6] focus:ring-1"
            required
          />
          <select
            name="Mobile_Flg"
            id="Mobile_Flg"
            value={CRMData.Mobile_Flg || ""}
            onChange={handleChange}
            className="block w-32 h-11 py-1.5 border text-black  border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 text-sm placeholder:text-gray-400"
          >
            <option value="Y">YES</option>
            <option value="N">NO</option>
          </select>
        </div>
        {errors.Mobile && (
          <p className="text-red-500 text-xs mt-1">{errors.Mobile}</p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label className={lableClases}>MOBILE 2</label>
        <input
          type="tel"
          name="Telephone3"
          value={CRMData.Telephone3 || ""}
          onChange={handleChange}
          maxLength={10}
          pattern="\d{10}"
          className={inputClasses}
          placeholder="Enter 10-digit mobile number"
        />
      </div>
      {/* Email and Email_Flg */}

      <div>
        <div className="flex justify-between ">
          <label className={lableClases}>EMAIL</label>
          <label className={lableClases}>SEND MAIL</label>
        </div>
        <div className="relative flex ">
          <input
            type="email"
            name="Email"
            id="Email"
            value={CRMData.Email || ""}
            onChange={handleEmailChange}
            className="block  h-11  w-full rounded-l-lg   border border-gray-300 shadow-sm appearance-none px-4 py-1.5 text-sm  placeholder:text-gray-400 focus:outline-[#5268e6] focus:ring-1"
            required
          />
          <select
            name="Email_Flg"
            id="Email_Flg"
            value={CRMData.Email_Flg || ""}
            onChange={handleChange}
            className="block w-32 h-11 py-1.5 border text-black  border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 text-sm placeholder:text-gray-400"
          >
            <option value="Y">YES</option>
            <option value="N">NO</option>
          </select>
        </div>
        {errors.Email && (
          <p className="text-red-500 text-xs mt-1">{errors.Email}</p>
        )}
      </div>

      {/* Narration */}
      <div>
        <label className={lableClases}>NARRATION</label>
        <input
          name="Narration"
          value={CRMData.Narration || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      {/* Birthday Input */}

      <div>
        <label className={lableClases}>BIRTHDAY</label>
        <input
          type="date"
          name="Birthday"
          value={CRMData.Birthday || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      {/* Anniversary Input */}
      <div>
        <label className={lableClases}>ANNIVERSARY</label>
        <input
          type="date"
          name="Anniversary"
          value={CRMData.Anniversary || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      {/* reference by */}
      <div className="relative">
        <label className={lableClases}>REFERENCE BY</label>
        <input
          name="Refrence_By"
          value={CRMData.Refrence_By || ""}
          onChange={handleReferenceChange}
          className={inputClasses}
        />
        {/* Show no results when customers list is empty */}
        {showSuggestions && filteredCustomers.length > 0 && (
          <div className="absolute z-20 bg-white w-30 border mt-1 border-gray-300 rounded shadow-md max-h-60 overflow-y-auto">
            {filteredCustomers.map((customer) => (
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
            ))}
          </div>
        )}
      </div>

      {/* Ac_Group */}
      <div className="relative" ref={acGroupRef}>
        <label className={lableClases}>ACCOUNT GROUP</label>
        <div
          className={`${inputClasses} cursor-pointer`}
          onClick={() => toggleDropdown("Ac_Group")}
        >
          {CRMData.Ac_Group}
        </div>

        {dropdownOpen.Ac_Group && (
          <div className="absolute z-10 mt-1 bg-white border rounded shadow-md p-2 w-full">
            {groupLoading ? (
              <p className="p-2 text-sm text-gray-500">Loading groups...</p>
            ) : (
              group?.map((option) => (
                <label key={option.Group_Name} className="block">
                  <input
                    type="checkbox"
                    value={option.Group_Name || ""}
                    checked={CRMData.Ac_Group?.split(",").includes(
                      option.Group_Name
                    )}
                    onChange={() =>
                      handleMultipleOptionChange("Ac_Group", option.Group_Name)
                    }
                    className="mr-2"
                  />
                  {option.Group_Name}
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* EDUCATION */}
      <div>
        <label className={lableClases}>EDUCATION</label>
        <select
          name="Education"
          id="Education"
          value={CRMData.Education || ""}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">SELECT ONE</option>
          {educationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {/* Occupation */}
      <div>
        <label className={lableClases}>OCCUPATION</label>
        <select
          name="Occupation"
          id="Occupation"
          value={CRMData.Occupation || ""}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">SELECT ONE</option>
          {occupationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* income */}
      <div>
        <label className={lableClases}>INCOME</label>
        <select
          name="Telephone2"
          id="Telephone2"
          value={CRMData.Telephone2 || ""}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">SELECT ONE</option>
          <option value="BLANK">BLANK</option>
          <option value="BELOW 3 LAKHS">BELOW 3 LAKHS</option>
          <option value="3-5 LAKHS">3-5 LAKHS</option>
          <option value="5-7 LAKHS">5-7 LAKHS</option>
          <option value="7-10 LAKHS">7-10 LAKHS</option>
          <option value="ABOVE 10 LAKHS">ABOVE 10 LAKHS</option>
        </select>
      </div>
      {/* Designation */}
      <div>
        <label className={lableClases}>DESIGNATION</label>
        <input
          name="Category"
          value={CRMData.Category || ""}
          onChange={handleChange}
          className={inputClasses}
          maxLength={25}
          placeholder="Enter designation(max 25 characters)"
        />
      </div>

      {/* Know_About_Us */}
      <div className="relative" ref={knowAboutUsRef}>
        <label className={lableClases}>
          HOW DID YOU COME TO KNOW ABOUT US ?
        </label>
        <div
          className={`${inputClasses} cursor-pointer`}
          onClick={() => toggleDropdown("Know_About_Us")}
        >
          {CRMData.Know_About_Us}
        </div>

        {dropdownOpen.Know_About_Us && (
          <div className="absolute z-10 mt-1 bg-white border rounded shadow-md p-2 w-full">
            {Know_About_UsOptions.map((option) => (
              <label key={option} className="block">
                <input
                  type="checkbox"
                  value={option || ""}
                  checked={CRMData.Know_About_Us?.split(",").includes(option)}
                  onChange={() =>
                    handleMultipleOptionChange("Know_About_Us", option)
                  }
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Perchase_Reason */}
      <div className="relative" ref={purchaseReasonRef}>
        <label className={lableClases}>REASON FOR YOUR PURCHASE ?</label>
        <div
          className={`${inputClasses} cursor-pointer`}
          onClick={() => toggleDropdown("Purchase_Reason")}
        >
          {CRMData.Purchase_Reason}
        </div>

        {dropdownOpen.Purchase_Reason && (
          <div className="absolute z-10 mt-1 bg-white border rounded shadow-md p-2 w-full">
            {Purchase_ReasonOptions.map((option) => (
              <label key={option} className="block">
                <input
                  type="checkbox"
                  value={option || ""}
                  checked={CRMData.Purchase_Reason?.split(",").includes(option)}
                  onChange={() =>
                    handleMultipleOptionChange("Purchase_Reason", option)
                  }
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>

      {/*WHY DID YOU PREFER US */}
      <div className="relative" ref={whyChooseUsRef}>
        <label className={lableClases}>WHY DID YOU PREFER US ?</label>
        <div
          className={`${inputClasses} cursor-pointer`}
          onClick={() => toggleDropdown("Why_Choose_Us")}
        >
          {CRMData.Why_Choose_Us}
        </div>

        {dropdownOpen.Why_Choose_Us && (
          <div className="absolute z-10 mt-1 bg-white border rounded shadow-md p-2 w-full">
            {Why_Choose_UsOptions.map((option) => (
              <label key={option} className="block">
                <input
                  type="checkbox"
                  value={option || ""}
                  checked={CRMData.Why_Choose_Us?.split(",").includes(option)}
                  onChange={() =>
                    handleMultipleOptionChange("Why_Choose_Us", option)
                  }
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Loyalty_Code */}
      <div>
        <label className={lableClases}>LOYALTY CODE</label>
        <input
          name="Loyalti_Code"
          value={CRMData.Loyalti_Code || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      {/* Ac_Pan_No */}
      <div>
        <label className={lableClases}>PAN NO</label>
        <input
          name="Ac_Pan_No"
          value={CRMData.Ac_Pan_No || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      {/* Kyc_No */}
      <div>
        <label className={lableClases}>KYC NO</label>
        <input
          name="Kyc_No"
          value={CRMData.Kyc_No || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
    </form>
  );
};

export default CRMBody;
