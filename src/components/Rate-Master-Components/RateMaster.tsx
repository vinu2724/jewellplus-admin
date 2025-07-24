"use client";
import React, { useState } from "react";
import { DataList } from "@/utils/CustomTags";
import Button from "@/utils/Button";

type MetalType = {
  id: number;
  caret: string;
  category: string;
  saleRate: number;
  purchaseRate: number;
};

const initialProducts: MetalType[] = [
  { id: 1, caret: "24.00", category: "gold", saleRate: 150, purchaseRate: 5 },
  { id: 2, caret: "23.88", category: "Moti", saleRate: 150, purchaseRate: 5 },
  { id: 3, caret: "22.00", category: "Silver", saleRate: 150, purchaseRate: 5 },
  { id: 4, caret: "20.00", category: "Moti", saleRate: 150, purchaseRate: 5 },
  { id: 5, caret: "18.00", category: "gold", saleRate: 150, purchaseRate: 5 },
];
const classNamesInput =
  "block w-full h-8 bg-transparent text-center rounded-md px-3 py-2  focus:outline-none focus:ring-1 focus:ring-green-200 focus:border-green-200 transition duration-150 ease-in-out";
export default function RateMaster() {
  const [metals, setMetals] = useState<MetalType[]>(initialProducts);
  const [category, setCategory] = useState("");
  const metalCategories = ["GOLD", "MOTI", "PLATINUM", "SILVER"];

  const handleInputChange = (
    id: number,
    field: keyof MetalType,
    value: string
  ) => {
    const numValue = value.trim() === "" ? "" : Number(value);
    if (numValue === "" || (!isNaN(numValue) && typeof numValue === "number")) {
      setMetals((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: numValue === "" ? 0 : numValue,
              }
            : item
        )
      );
    }
  };

  const handleSubmit = () => {
    console.log("Submitted Products:", metals);
    setMetals(initialProducts);
  };

  const filteredProducts = metals.filter((item) =>
    category ? item.category.toLowerCase() === category.toLowerCase() : true
  );

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          RATE MASTER
        </h1>

        <div className="flex justify-center mb-4">
          <DataList
            label=""
            name="category"
            value={category}
            options={metalCategories}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="overflow-auto rounded-2xl border border-gray-300">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-center text-black">
              <tr>
                <th className="py-3 px-4">CARET</th>
                <th className="py-3 px-4">SALE RATE</th>
                <th className="py-3 px-4">PURCHASE RATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white border-b hover:bg-green-200 transition"
                >
                  <td className="py-2 px-4 font-medium">{product.caret}</td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={parseInt(String(product.saleRate)).toFixed(2)}
                      onChange={(e) =>
                        handleInputChange(
                          product.id,
                          "saleRate",
                          e.target.value
                        )
                      }
                      onFocus={(e) => e.target.select()}
                      className={classNamesInput}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={parseFloat(String(product.purchaseRate)).toFixed(
                        2
                      )}
                      onChange={(e) =>
                        handleInputChange(
                          product.id,
                          "purchaseRate",
                          e.target.value
                        )
                      }
                      onFocus={(e) => e.target.select()}
                      className={classNamesInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-6">No products found.</p>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <Button
            variant="contained"
            className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
