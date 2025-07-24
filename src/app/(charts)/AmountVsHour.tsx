"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Dialog, Button } from "@mui/material";
import { SaleItem } from "@/hooks/useSalesData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  title: string;
  salesData: SaleItem[];
  loading: boolean;
  error: string | null;
}

const AmountVsHour: React.FC<Props> = ({ title, salesData, loading, error }) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading chart: {error}</p>;
  if (!salesData?.length) return <p>No data available.</p>;

  const itemTypeDetails: Record<string, { label: string; color: string; emoji: string }> = {
    G: { label: "Gold", color: "#FFD700", emoji: "🟡" },
    S: { label: "Silver", color: "#C0C0C0", emoji: "⚪" },
    P: { label: "Platinum", color: "#A9A9F5", emoji: "🔵" },
    D: { label: "Diamond", color: "#B9F2FF", emoji: "💎" },
    F: { label: "Fixed Price", color: "#8B4513", emoji: "🟤" },
    T: { label: "Stone", color: "#4B0082", emoji: "🟣" },
  };

  const fallbackColor = "#3B82F6";

  const hourLabels = Array.from({ length: 24 }, (_, hour) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const formatted = hour % 12 === 0 ? 12 : hour % 12;
  return `${formatted} ${suffix}`;
});


  const itemTypeHourMap: Record<string, number[]> = {};
Object.keys(itemTypeDetails).forEach((type) => {
  itemTypeHourMap[type] = new Array(24).fill(0);
});

  salesData.forEach((item) => {
    const hourStr = item.Dt_Time?.split(":")[0];
    const hour = hourStr ? parseInt(hourStr, 10) : null;
    const itemType = item.Item_Type?.toUpperCase() || "G";
    const amount =
      (item.Sale_Special_Detail_Amount || 0) +
      (item.Other_Charges || 0) +
      (item.Sale_Special_Detail_Making_Amt || 0) -
      (item.Discount_Amt || 0);

 if (hour !== null && hour >= 0 && hour <= 23 && itemTypeDetails[itemType]) {
  itemTypeHourMap[itemType][hour] += amount;
}

  });

  const datasets = Object.entries(itemTypeHourMap).map(([type, values]) => {
    const detail = itemTypeDetails[type] || { label: type, color: fallbackColor, emoji: "🔘" };
    return {
      label: `${detail.emoji} ${detail.label}`,
      data: values,
      borderColor: detail.color,
      backgroundColor: detail.color,
      tension: 0.4,
      pointRadius: 3,
      fill: false,
    };
  });

  const chartData = {
    labels: hourLabels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 0,
          boxHeight: 0,
          padding: 8,
        },
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
     x: {
  title: { display: true, text: "Hour (12 AM - 11 PM)" },
},

      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount (₹)" },
        ticks: {
          callback: (val: number | string) =>
            typeof val === "number" ? `₹${val.toLocaleString()}` : val,
        },
      },
    },
  };

  return (
    <>
      {/* Chart Card */}
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full h-[500px] sm:h-[600px] lg:h-[450px] relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 text-center pr-2">
            {title || "Hourly Sales Amount by Item Type"}
          </h3>
          <div className="flex-shrink-0">
            <Button
              size="small"
              variant="outlined"
              onClick={() => setFullscreenOpen(true)}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Expand</span>
              <span className="sm:hidden">⛶</span>
            </Button>
          </div>
        </div>

        {/* Scrollable on small screens */}
        <div className="h-[calc(100%-80px)] w-full">
          <div className="block lg:hidden overflow-x-auto h-full">
            <div className="min-w-[600px] h-full">
              <Line data={chartData} options={options} />
            </div>
          </div>
          {/* Static on large screens */}
          <div className="hidden lg:block h-full">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>

      {/* Fullscreen Mode */}
      <Dialog fullScreen open={fullscreenOpen} onClose={() => setFullscreenOpen(false)}>
        <div className="bg-white p-4 sm:p-6 w-full h-screen relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex-1 text-center pr-2">
              {title || "Hourly Sales Amount by Item Type"}
            </h2>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setFullscreenOpen(false)}
            >
              <span className="hidden sm:inline">Close</span>
              <span className="sm:hidden text-lg">✕</span>
            </Button>
          </div>
          <div className="h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] w-full overflow-x-auto">
            <div className="min-w-[600px] lg:min-w-0 h-full">
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AmountVsHour;
