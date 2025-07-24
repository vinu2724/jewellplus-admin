"use client";
import React from "react";

import WeightVsTime from "@/components/WeightVsTime-Type-Counter-Rate-Date-Branch/WeightVsTime-Type";
import WeightVsCounter from "@/components/WeightVsTime-Type-Counter-Rate-Date-Branch/WeightVSCounter-Type";
import WeightVsRate from "@/components/WeightVsTime-Type-Counter-Rate-Date-Branch/WeightVsRate";
import WeightVsDate from "@/components/WeightVsTime-Type-Counter-Rate-Date-Branch/WeightVSDate";
import WeightVsBranch from "@/components/WeightVsTime-Type-Counter-Rate-Date-Branch/WeightVsBranch";

const DataAnalysis = () => {
  return (
    <div className="lg:ml-64">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/*charts */}

          {/* WeightVsTime */}
          <WeightVsTime />

          {/* WeightVsCounter */}
          <WeightVsCounter />

          {/*WeightVsRate */}
          <WeightVsRate />

          {/*  WeightVsDate */}
          <WeightVsDate />

          {/*WeightVsBranch */}
          <WeightVsBranch />
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;
