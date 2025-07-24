import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StockCounterFooterData } from "./StockCounter"; // Import the interface

interface StockCounterFooterProps {
  footerData: StockCounterFooterData;
}

const StockCounterFooter: React.FC<StockCounterFooterProps> = ({ footerData }) => {
  const { reset, register } = useForm<StockCounterFooterData>({
    defaultValues: footerData,
  });

  useEffect(() => {
    reset(footerData);
  }, [footerData, reset]);

  const fieldsToDisplay = [
    { label: "Total Lables", name: "totalItems", readOnly: true }, // "Total Labels" interpreted as "Total Items"
    { label: "Total", name: "total", readOnly: true },     // Added "Total Pcs"
    { label: "Total Gross Wt", name: "totalGrossWt", readOnly: true },
    { label: "Total Net Wt", name: "totalNetWt", readOnly: true },
    { label: "Price", name: "totalPrice", readOnly: true },      // "Total Amount" changed to "Price"
  ];

  return (
    <form>
      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black p-4">
        {fieldsToDisplay.map(({ label, name, readOnly }) => (
          <div key={name}>
            <label className="block font-semibold text-sm text-black">
              {label}
            </label>
            <div className="relative mt-1 flex">
              <input
                type="text"
                {...register(name as keyof StockCounterFooterData)}
                className={`flex-1 w-full h-10 border border-gray-200 rounded-md px-3 py-2 ${
                  readOnly ? "bg-gray-200" : "bg-gray-100"
                }`}
                disabled={readOnly}
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default StockCounterFooter;