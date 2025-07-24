import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FooterFormData } from "./URD";

interface FooterProps {
  footerData: FooterFormData;
}

const URDFooter: React.FC<FooterProps> = ({ footerData }) => {
  const { reset, register, handleSubmit, getValues } = useForm<FooterFormData>({
    defaultValues: footerData,
  });

  useEffect(() => {
    reset(footerData);
  }, [footerData, reset]);

  const handleFormSubmit = () => {
    const formData = getValues();
    console.log("Footer Data Submitted:", formData);
  };

  return (
    <form
      className="w-full max-w-5xl mx-auto mt-6 bg-gradient-to-r from-white via-blue-50 to-white shadow-xl border border-blue-200 rounded-xl px-4 py-4 md:py-6"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex flex-wrap justify-between items-center gap-4  text-black text-sm font-[var(--font-inter)]">
        {[
          { label: "TOTAL GROSS WT", name: "totalGrossWt" },
          { label: "TOTAL NET WT", name: "totalNetWt" },
          { label: "TOTAL FINE WT", name: "totalFineWt" },
          { label: "TOTAL AMOUNT", name: "totalAmount" },
        ].map(({ label, name }, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center flex-1 min-w-[150px] max-w-[220px] px-2 py-2 bg-blue-50 rounded-lg shadow-sm border border-blue-100"
          >
            <label className="text-xs font-semibold text-blackmb-1 tracking-wide text-center w-full m-1">
              {label}
            </label>
            <input
              type="text"
              {...register(name as keyof FooterFormData)}
              className="w-full h-10 border border-blue-200 rounded-md px-3 py-2 bg-blue-100 text-blue-900 font-bold text-center outline-none"
              disabled
              readOnly
            />
          </div>
        ))}
      </div>
    </form>
  );
};

export default URDFooter;
