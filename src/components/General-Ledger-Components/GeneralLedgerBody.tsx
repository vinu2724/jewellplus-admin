"use client";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FiSearch } from "react-icons/fi";

// Placeholder for account data structure - replace with your actual type
type Account = {
  id: string;
  name: string;
  code: string;
};

// Placeholder for account suggestions - replace with actual data fetching/filtering logic
const dummyAccounts: Account[] = [
  { id: "1", name: "SWALEHA", code: "120231047" },
  { id: "2", name: "JOHN TRADERS", code: "120231048" },
  { id: "3", name: "GOLDEN JEWELS", code: "120231049" },
  { id: "4", name: "PARAS INFOTECH", code: "100000001" },
];

const GeneralLedgerBody = () => {
  const [accountSearch, setAccountSearch] = useState("SWALEHA [120231047]"); // Initial value
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    dummyAccounts.find(
      (acc) => `${acc.name} [${acc.code}]` === accountSearch
    ) || null
  );
  const [activeTab, setActiveTab] = useState("General Ledger"); // State for active tab
  const tabNames = [
    "General Ledger",
    "Daily Summary",
    "Monthly Summary",
    "Account Summary",
    "Branch Summary",
    "Party Stock Ledger",
    "Interest Calculation",
  ];
const [startDate, setStartDate] = useState<Date | null>(new Date("2025-05-31"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-05-31"));

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const searchInputRef = useRef<HTMLDivElement>(null); // Ref for click outside

  const handleAccountSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAccountSearch(query);
    setSelectedAccount(null); // Clear selected account when typing

    if (query) {
      setFilteredAccounts(
        dummyAccounts.filter(
          (acc) =>
            acc.name.toLowerCase().includes(query.toLowerCase()) ||
            acc.code.toLowerCase().includes(query.toLowerCase())
        )
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredAccounts([]);
    }
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setAccountSearch(`${account.name} [${account.code}]`);
    setShowSuggestions(false);
  };

  // Effect to handle clicks outside the suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="lg:ml-64 min-h-screen p-4 sm:p-6 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          General Ledger
        </h1>
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
          <label
            htmlFor="accountSearchInput"
            className="text-sm font-medium text-gray-700"
          >
            Account:
          </label>
          <div className="relative w-64" ref={searchInputRef}>
            <input
              type="text"
              id="accountSearchInput"
              value={accountSearch}
              onChange={handleAccountSearchChange}
              onFocus={() => accountSearch && setShowSuggestions(true)} // Show suggestions on focus if there's text
              placeholder="Search Account"
              className="border border-gray-300 rounded-md pl-3 pr-10 py-2 w-full text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredAccounts.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredAccounts.map((acc) => ( // border-gray-300
                  <div
                    key={acc.id}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAccount(acc)} // text-gray-700 hover:bg-gray-100
                  >
                    {acc.name} [{acc.code}]
                  </div>
                ))}
              </div>
            )}
            {showSuggestions &&
              accountSearch &&
              filteredAccounts.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg px-3 py-2 text-sm text-gray-500">
                  No accounts found. {/* text-gray-500 */}
                </div>
              )}
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="typeSelect" className="text-sm font-medium text-gray-700 sr-only">Type:</label>
            <select id="typeSelect" className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150">
              <option value="ALL">ALL</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="interestRateInput" className="text-sm font-medium text-gray-700">Int. %</label>
            <input
              type="number"
              id="interestRateInput"
              defaultValue="18.00"
              className="border border-gray-300 rounded-md px-3 py-2 w-24 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-300">
        <nav
          className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto pb-px"
          aria-label="Tabs"
        >
          {tabNames.map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-150
                ${
                  activeTab === tabName
                    ? "border-indigo-600 text-indigo-700" // Active tab style is fine
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400"
                }`}
            >
              {tabName}
            </button>
          ))}
        </nav>
      </div>

      {/* Ledger Header */}
      <div className="text-center mb-6 p-3 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold text-black">PARAS INFOTECH</h2>
        <div className="flex items-center space-x-4 align-middle justify-center mt-2 sm:flex-row flex-col sm:space-x-0 space-y-2 sm:space-y-0">
  <h3 className="whitespace-nowrap font-medium">General Ledger for the Period :</h3>
  
  <div className="flex items-baseline space-x-2">
    <span>From:</span>
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      dateFormat="dd-MM-yyyy"
      className="border p-1 rounded text-center font-bold w-28 bg-gray-50"
      popperPlacement="bottom-start"
    />
    <span>To:</span>
    <DatePicker
      selected={endDate}
      onChange={(date) => setEndDate(date)}
      dateFormat="dd-MM-yyyy"
      className="border p-1 rounded text-center font-bold w-28 bg-gray-50"
      popperPlacement="bottom-start"
    />
  </div>
</div>

        <div>
         <span className="text-lg font-[var(--font-inter)]">Account:{" "}</span> 
          <strong className="text-black">
            {selectedAccount
              ? `${selectedAccount.name} [${selectedAccount.code}]`
              : accountSearch || "N/A"}
          </strong>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-300 rounded-lg shadow-sm  overflow-x-auto">
        {/* Table Header */} {/* border-gray-300 */}
        <div className="grid grid-cols-[100px_80px_120px_1fr_110px_110px] bg-gray-200 text-black font-semibold border-b border-gray-300 min-w-[700px]">
          <div className="px-2 py-1.5 sm:px-3 sm:py-2.5 uppercase tracking-wider text-left text-xs sm:text-sm">
            Date
          </div>
          <div className="px-2 py-1.5 sm:px-3 sm:py-2.5 uppercase tracking-wider text-left border-l border-gray-300 text-xs sm:text-sm">
            Doc No.
          </div>
          <div className="px-2 py-1.5 sm:px-3 sm:py-2.5 uppercase tracking-wider text-left border-l border-gray-300 text-xs sm:text-sm">
            Type
          </div>
          <div className="px-2 py-1.5 sm:px-3 sm:py-2.5 uppercase tracking-wider text-left border-l border-gray-300 text-xs sm:text-sm">
            Narration
          </div>
          <div className="px-2 py-1.5 sm:px-3 sm:py-2.5 uppercase tracking-wider text-right border-l border-gray-300 text-xs sm:text-sm">
            Amount Dr.
          </div>
          <div className="px-2 py-1.5 sm:px-3 sm:py-2.5 uppercase tracking-wider text-right border-l border-gray-300 text-xs sm:text-sm">
            Amount Cr.
          </div>
        </div>

        {/* Data Rows */}
        {[
          {
            date: "",
            doc: "",
            type: "",
            narration: "Opening Balance:",
            dr: "63,933.00",
            cr: "",
          },
          {
            date: "23/04/2025",
            doc: "5",
            type: "Bank Order",
            narration: "Advance Received By Chq No.:",
            dr: "",
            cr: "50,000.00",
          },
          {
            date: "28/04/2025",
            doc: "63",
            type: "Sale",
            narration: ",",
            dr: "47,900.00",
            cr: "47,900.00",
          },
          {
            date: "30/04/2025",
            doc: "91",
            type: "Sale",
            narration: "Cash Received",
            dr: "9,528.00",
            cr: "9,528.00",
          },
          {
            date: "09/05/2025",
            doc: "109",
            type: "Sale",
            narration: ",",
            dr: "53,769.00",
            cr: "53,769.00",
          },
          {
            date: "09/05/2025",
            doc: "109",
            type: "Sale",
            narration: "Chq. No:",
            dr: "",
            cr: "",
          },
        ].map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[100px_80px_120px_1fr_110px_110px] bg-white items-center border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150 font-semibold text-black min-w-[700px]"
          >
            <div className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap font-semibold">
              {row.date}
            </div>
            <div className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap border-l border-gray-200">
              {row.doc}
            </div>
            <div className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap border-l border-gray-200">
              {row.type}
            </div>
            <div className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 border-l border-gray-200">
              {row.narration}
            </div>
            <div className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap border-l border-gray-200">
              {row.dr}
            </div>
            <div className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap border-l border-gray-200">
              {row.cr}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Totals */}
      <div className="grid grid-cols-[1fr_110px_110px] text-black font-semibold mt-4 pt-3 pb-2 border-t border-gray-300">
        <div className="text-right px-3 text-sm">Total :</div>
        <div className="text-right px-3 text-sm border-l border-gray-300">
          1,75,130.00
        </div>
        <div className="text-right px-3 text-sm border-l border-gray-300">
          1,61,197.00
        </div>
      </div>

      <div className="grid grid-cols-2 mt-2 font-semibold px-1">
        <div className="text-sm">
          Closing Balance:{" "}
          <span className="text-red-600 font-bold">13,933.00 Dr.</span>
        </div>
        <div className="text-right text-sm">
          Closing Balance: <strong className="font-bold">13,933.00</strong>
        </div>
      </div>
    </div>
  );
};

export default GeneralLedgerBody;
