import AmountVsBranch from "@/components/AmountVsTime-Type-Branch/AmountVsBranch";
import AmountVsTime from "@/components/AmountVsTime-Type-Branch/AmountVsTime";
import AmountVsType from "@/components/AmountVsTime-Type-Branch/AmountVsType";
import React from "react";

const AmountVsTimeTypeBranch = () => {
  return (
    <>
      <div className="lg:ml-64">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
          <AmountVsTime />
          <AmountVsType />
          <AmountVsBranch />
        </div>
      </div>
    </>
  );
};

export default AmountVsTimeTypeBranch;
