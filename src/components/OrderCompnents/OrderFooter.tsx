import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FooterFormData } from "./Order";

interface FooterProps {
  footerData: FooterFormData;
}

const OrderFooter: React.FC<FooterProps> = ({ footerData }) => {
  const { reset, register } = useForm<FooterFormData>({
    defaultValues: footerData,
  });

  useEffect(() => {
    reset(footerData);
  }, [footerData, reset]);
  return (
   <form>
  <div className="w-full max-w-5xl mx-auto mt-6 bg-gradient-to-r from-white via-blue-50 to-white shadow-xl border border-blue-200 rounded-xl px-4 py-4 md:py-6">
    <div className="flex flex-wrap justify-between items-center gap-4 text-black text-sm font-[var(--font-inter)]">
      {[
        { label: "Total Gross Wt", name: "totalGrossWt", readOnly: true },
        { label: "Total Net Wt", name: "totalNetWt", readOnly: true },
        { label: "Total RNG Wt", name: "totalRNGWt", readOnly: true },
        { label: "Basic Amount", name: "basicAmount", readOnly: true },
        {
          label: "Total Other Charges",
          name: "totalOtherCharges",
          readOnly: true,
        },
        { label: "Making Amount", name: "makingAmount", readOnly: true },
        { label: "Total Discount", name: "totalDiscount", readOnly: true },
        { label: "Total Tax", name: "totalTax", readOnly: true },
        { label: "Total Amount", name: "totalAmount", readOnly: true },
        { label: "Making Discount", name: "makingDiscount" },
        { label: "Rate Discount", name: "rateDiscount" },
        { label: "Full Discount", name: "fullDiscount" },
      ].map(({ label, name, readOnly }, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center flex-1 min-w-[150px] max-w-[220px] px-2 py-2 bg-blue-50 rounded-lg shadow-sm border border-blue-100"
        >
          <label className="text-xs font-semibold text-black mb-1 tracking-wide text-center w-full">
            {label}
          </label>
          <div className="relative mt-1 flex w-full">
            <input
              type="text"
              {...register(name as keyof FooterFormData)}
              className={`w-full h-10 border border-blue-200 rounded-md px-3 py-2 text-blue-900 font-bold text-center outline-none ${
                readOnly ? "bg-gray-200" : "bg-gray-100"
              }`}
              disabled={readOnly}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</form>

  );
};

export default OrderFooter;
