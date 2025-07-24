"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { DataList } from "@/utils/CustomTags";
import Button from "@/utils/Button";

type Product = {
  id: number;
  name: string;
  weight: string;
  price: number;
  category: string; // Added category field
  purity: string;
  makingCharges: number;
  discountPercent: number;
  catalog: boolean;
  ecom: boolean;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Chain",
    weight: "4.00g",
    category: "gold",
    price: 1000,
    purity: "22K",
    makingCharges: 150,
    discountPercent: 5,
    catalog: false,
    ecom: false,
  },
  {
    id: 2,
    name: "Bracelet",
    weight: "6.50g",
    category: "gold",
    price: 1800,
    purity: "22K",
    makingCharges: 200,
    discountPercent: 7,
    catalog: false,
    ecom: false,
  },
  {
    id: 3,
    name: "Ring",
    weight: "2.00g",
    category: "silver", // Changed for variety
    price: 500,
    purity: "18K",
    makingCharges: 80,
    discountPercent: 10,
    catalog: false,
    ecom: false,
  },
  {
    id: 4,
    name: "Ghantan",
    weight: "8.20g",
    category: "gold",
    price: 2500,
    purity: "22K",
    makingCharges: 300,
    discountPercent: 6,
    catalog: false,
    ecom: false,
  },
  {
    id: 5,
    name: "Necklace",
    weight: "15.00g",
    category: "platinum", // Changed for variety
    price: 6000,
    purity: "22K",
    makingCharges: 700,
    discountPercent: 4,
    catalog: false,
    ecom: false,
  },
  {
    id: 6,
    name: "Earrings",
    weight: "3.30g",
    category: "diamond", // Changed for variety
    price: 1100,
    purity: "18K",
    makingCharges: 120,
    discountPercent: 8,
    catalog: false,
    ecom: false,
  },
  {
    id: 7,
    name: "Pendant",
    weight: "5.00g",
    category: "gold",
    price: 1300,
    purity: "22K",
    makingCharges: 160,
    discountPercent: 5,
    catalog: false,
    ecom: false,
  },
  {
    id: 8,
    name: "Bangle",
    weight: "10.00g",
    category: "silver", // Changed for variety
    price: 4000,
    purity: "22K",
    makingCharges: 500,
    discountPercent: 3,
    catalog: false,
    ecom: false,
  },
];

export default function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState(""); // Will default to "All Categories"
  const [searching, setSearching] = useState(false);
  const productCategories = ["Gold", "Silver", "Platinum", "Diamond"];

  const handleCheckboxChange = (id: number, field: "catalog" | "ecom") => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))
    );
  };

  const handleSubmit = () => {
    console.log("Submitted Products:", products);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearching(true);
    setTimeout(() => setSearching(false), 300); // Fade effect
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      category
        ? product.category.toLowerCase() === category.toLowerCase()
        : true
    );

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          PRODUCT LIST
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 text-black shadow-sm px-4 py-2 rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <DataList
            label=""
            name="category"
            value={category}
            options={productCategories}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Button
            variant="contained"
            className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-inner">
          <table className="min-w-[600px] w-full text-left table-auto transition-all duration-300 ease-in-out">
            <thead>
              <tr className="bg-gray-100 border-b font-semibold text-black">
                <th className="py-3 px-2">Name</th>
                <th>Wt</th>
                <th>Price</th>
                <th>Purity</th>
                <th>Making</th>
                <th>Discount</th>
                <th>Catalog</th>
                <th>E-Com</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={clsx(
                    "border-b hover:bg-green-200 transition duration-300 ease-in-out text-black",
                    searching && "animate-fadeIn"
                  )}
                >
                  <td className="py-3 px-2">{product.name}</td>
                  <td>{product.weight}</td>
                  <td>₹{product.price}</td>
                  <td>{product.purity}</td>
                  <td>{product.makingCharges}</td>
                  <td>{product.discountPercent}%</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.catalog}
                      onChange={() =>
                        handleCheckboxChange(product.id, "catalog")
                      }
                      className="ml-4 scale-150"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.ecom}
                      onChange={() => handleCheckboxChange(product.id, "ecom")}
                      className="ml-4 scale-150"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <p className="text-center text-black py-6">No products found.</p>
          )}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0.2;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
