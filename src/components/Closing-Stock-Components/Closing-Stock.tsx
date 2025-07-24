"use client";

import useAddClosingStock from "@/hooks/Add-Closing-Stock";
import useCounterList from "@/hooks/Counter-List";
import useDeleteClosingStock from "@/hooks/Delete-Closing-Stock";
import useGetClosingStock from "@/hooks/Get-Closing-Stock";
import useGetItemStock from "@/hooks/Get-Item-Stock";
import { useAccessControl } from "@/hooks/useAccessControl";
import Feedback from "@/utils/Alert";
import Button from "@/utils/Button";
import React, { useCallback, useEffect, useRef, useState } from "react";

type StockItem = {
  Cl_Pcs: number;
  Cl_Item: number;
  Cl_Amt: number;
  Firm_Cd: string;
  Dt: string;
  Counter: string;
  Item_Code: string;
  Bar_Pcs: number;
  Bar_Wt: number;
  Bar_Amt: number;
  Cl_Wt: number;
  Item_Name: string;
  User_Code: string;
  Cl_Qty: number;
  Flg: string;
  Item_Type: string;
  User_Code_Id: number;
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  D: "DIAMOND",
  F: "FIXED PRICE ITEM",
  G: "GOLD",
  P: "PLATINUM",
  S: "SILVER",
  T: "STONE",
};

const classNamesInput =
  "block w-full h-8 bg-transparent  border border-gray-300 rounded  text-right rounded-md px-3 py-2  focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out";
const groupByItemType = (data: StockItem[]) => {
  return data.reduce<Record<string, StockItem[]>>((acc, item) => {
    const type = item.Item_Type.toUpperCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});
};

const ClosingStock = () => {
  const { canCustom } = useAccessControl("w_counter_stock");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [groupedData, setGroupedData] = useState<Record<string, StockItem[]>>(
    {}
  );
  const [stockState, setStockState] = useState<StockItem[]>([]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value; // e.g. "2025-05-01"
    const formattedDate = `${inputDate}T00:00:00`; // Convert to ISO-like format

    setSelectedDate(inputDate); // Keep raw date for input display

    // Update each item's Dt
    setStockState((prev) =>
      prev.map((item) => ({
        ...item,
        Dt: formattedDate,
      }))
    );
  };

  const { getClosingStock, loading, fetchGetClosingStock } =
    useGetClosingStock();

  const {
    getItemStock,
    loading: itemLoading,
    fetchGetItemStock,
  } = useGetItemStock();

  const ItemCodeArray = getClosingStock.map((item) => item.Item_Code);

  useEffect(() => {
    // Only fetch once on mount or when date changes
    fetchGetClosingStock(selectedDate);
  }, [selectedDate, fetchGetClosingStock]);

  // ✅ Run once when getClosingStock updates — this won't cause an infinite loop
  useEffect(() => {
    if (getClosingStock && getClosingStock.length > 0) {
      const grouped = groupByItemType(getClosingStock);
      setGroupedData(grouped);
      setStockState(getClosingStock.map((item) => ({ ...item })));
    }
  }, [getClosingStock]);

  const handleInputChange = (
    code: string,
    field: keyof StockItem,
    value: string | number
  ) => {
    const numValue =
      typeof value === "string"
        ? value.trim() === ""
          ? ""
          : Number(value)
        : value;

    // Reject alphabetic or invalid input (but allow empty string if needed)
    if (numValue === "" || (!isNaN(numValue) && typeof numValue === "number")) {
      setStockState((prev) =>
        prev.map((item) =>
          item.Item_Code === code
            ? {
                ...item,
                [field]: numValue === "" ? 0 : numValue,
              }
            : item
        )
      );
    }
  };

  const { counterDropDown } = useCounterList();

  const getGroupTotals = (items: StockItem[]) => {
    const totalPcs = items.reduce((sum, item) => sum + (item.Cl_Pcs || 0), 0);
    const totalWt = items.reduce((sum, item) => sum + (item.Cl_Item || 0), 0);
    return { totalPcs, totalWt };
  };

  const groupRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const applyItemStockToClosingStock = useCallback(() => {
    setStockState((prevStockState) =>
      prevStockState.map((stockItem) => {
        const matchedItem = getItemStock.find(
          (item) =>
            "data" in item &&
            item.item_code.toUpperCase() === stockItem.Item_Code.toUpperCase()
        );

        if (matchedItem && "data" in matchedItem) {
          const itemData = matchedItem.data as { pcs: number; wt: number };

          return {
            ...stockItem,
            Cl_Pcs: itemData.pcs,
            Cl_Item: itemData.wt,
          };
        }
        return stockItem;
      })
    );
  }, [getItemStock]);

  useEffect(() => {
    if (getItemStock.length > 0) {
      applyItemStockToClosingStock();
    }
  }, [getItemStock, applyItemStockToClosingStock]);

  const handleRefresh = () => {
    fetchGetClosingStock(selectedDate); // Manual trigger
  };

  const handleYesterdayStock = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split("T")[0];

    await fetchGetItemStock(formattedYesterday, ItemCodeArray);
    // applyItemStockToClosingStock(); // After fetching
  };

  const handleTodayStock = async () => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    await fetchGetItemStock(formattedToday, ItemCodeArray);
    // applyItemStockToClosingStock(); // After fetching
  };

  const { deleteClosingStock } = useDeleteClosingStock(); //delete closing stock api call
  const { AddClosingStock } = useAddClosingStock(); //add closing stock api call

  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  const handleSumbit = async () => {
    const deleteResponse = await deleteClosingStock(selectedDate);

    if (deleteResponse && deleteResponse["Delete Row Counter Stock"] > 0) {
      const finalStockData = stockState.map((stock) => {
        return {
          ...stock,
          Dt: selectedDate,
        };
      });
      const AddResponse = await AddClosingStock(finalStockData);

      if (AddResponse && AddResponse["Insert Detail Row "] > 0) {
        setMessage("Closing Stock saved successfully");
        setTitle("success");
        setTimeout(() => setMessage(null), 3000);
      }
    }
    fetchGetClosingStock(selectedDate); // Manual trigger
  };

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          CLOSING STOCK
        </h1>
        <div className="flex justify-between mb-4">
          <Button
            variant="contained"
            className="bg-gradient-to-r from-gray-400 to-gray-700 !px-4 !py-1 !rounded-2xl"
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border p-1 text-sm border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />

          <Button
            variant="contained"
            className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
            onClick={handleSumbit}
            disabled={!canCustom("Save")}
          >
            Submit
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-2 justify-center mb-4  gap-2"></div>

        <div className="overflow-x-auto rounded-2xl shadow-inner">
          <table className="min-w-[600px] w-full text-left table-auto transition-all duration-300 ease-in-out">
            <thead>
              <tr className="bg-gray-200 text-center   font-bold text-black">
                <th className=" py-4">Sr No.</th>
                <th className="py-4">ITEM DESCRIPION</th>
                <th className="py-4">CLOSING PCS</th>
                <th className=" py-4">CLOSING WEIGHT</th>
              </tr>
            </thead>
            <tbody>
              {loading || itemLoading ? (
                <tr>
                  <td className="text-center py-4 text-gray-600" colSpan={4}>
                    Loading Closing Stock...
                  </td>
                </tr>
              ) : (
                Object.entries(groupedData)
                  .sort(([a], [b]) => a.localeCompare(b)) // Sort groups by key alphabetically
                  .map(([type, items]) => {
                    const sortedItems = [...items].sort((a, b) =>
                      a.Item_Name.localeCompare(b.Item_Name)
                    );
                    const totals = getGroupTotals(
                      stockState.filter((s) => s.Item_Type === type)
                    );
                    const matchingCounter = counterDropDown?.find(
                      (i) => i.code === stockState[0].Counter
                    );
                    const Counter = matchingCounter?.name?.toUpperCase();

                    return (
                      <React.Fragment key={type}>
                        <tr
                          ref={(el) => {
                            groupRefs.current[type] = el;
                          }}
                          className="bg-gray-100 border-b-2 border-gray-200 py-3 font-semibold text-black"
                        >
                          <td
                            colSpan={2}
                            className=" text-center font-lg font-extrabold py-2"
                          >
                            {ITEM_TYPE_LABELS[type] || type}
                          </td>
                          <td
                            colSpan={2}
                            className="text-right px-8 font-lg font-extrabold py-2"
                          >
                            {Counter || "Unknown Counter"}
                          </td>
                        </tr>

                        {sortedItems.map((item, idx) => {
                          const state: StockItem =
                            stockState.find(
                              (s) => s.Item_Code === item.Item_Code
                            ) || item;

                          return (
                            <tr
                              key={idx}
                              ref={(el) => {
                                rowRefs.current[item.Item_Name.toUpperCase()] =
                                  el;
                              }}
                              className="hover:bg-gray-100 transition duration-200"
                            >
                              <td className=" px-2 py-1 text-center">
                                {idx + 1}
                              </td>
                              <td className=" px-2 py-1">{item.Item_Name}</td>
                              <td className=" px-2 py-1">
                                <input
                                  type="text"
                                  value={state.Cl_Pcs}
                                  onChange={(e) =>
                                    handleInputChange(
                                      item.Item_Code,
                                      "Cl_Pcs",
                                      e.target.value
                                    )
                                  }
                                  onFocus={(e) => e.target.select()}
                                  className={classNamesInput}
                                />
                              </td>
                              <td className=" px-2 py-1">
                                <input
                                  type="text"
                                  value={parseFloat(
                                    String(state.Cl_Item)
                                  ).toFixed(3)}
                                  onChange={(e) =>
                                    handleInputChange(
                                      item.Item_Code,
                                      "Cl_Item",
                                      e.target.value
                                    )
                                  }
                                  onFocus={(e) => e.target.select()}
                                  className={classNamesInput}
                                />
                                {/* ✅ Reset Button */}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Total row */}
                        <tr className="bg-gray-100 border-b-2  border-gray-600 py-3 font-semibold text-black">
                          <td
                            colSpan={2}
                            className="text-center font-lg font-extrabold  pr-2"
                          >
                            TOTAL
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={totals.totalPcs}
                              disabled={true}
                              className={classNamesInput}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              disabled={true}
                              value={parseFloat(String(totals.totalWt)).toFixed(
                                3
                              )}
                              className={classNamesInput}
                            />
                          </td>
                          <td />
                        </tr>
                      </React.Fragment>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
        {stockState.length > 0 && (
          <div className="sticky bottom-2 flex justify-between mt-4">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleYesterdayStock}
              disabled={!canCustom("Fetch Yesterdays Stock")}
            >
              Fetch Yesterday`s Stock
            </Button>

            <Button
              variant="contained"
              className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleTodayStock}
              disabled={!canCustom("Fetch Todays Stock")}
            >
              Fetch Today`s Stock
            </Button>
          </div>
        )}
        {/* Alert Message */}
        {message && (
          <Feedback
            title={title as "success" | "error" | "warning" | "info"}
            message={message}
          />
        )}
      </div>
    </div>
  );
};

export default ClosingStock;
