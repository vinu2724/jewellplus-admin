"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Dialog, Button } from "@mui/material";
import { SaleItem } from "@/hooks/useSalesData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WeightVsMonthProps {
  title: string;
  data: SaleItem[] | null;
  loading: boolean;
  error: string | null;
}

const itemTypeDetails: Record<string, { label: string; color: string; emoji?: string }> = {
  G: { label: "Gold", color: "#FFD700", emoji: "🟡" },
  S: { label: "Silver", color: "#C0C0C0", emoji: "⚪" },
  P: { label: "Platinum", color: "#A9A9F5", emoji: "🔵" },
  D: { label: "Diamond", color: "#B9F2FF", emoji: "💎" },
  F: { label: "Fixed Price", color: "#8B4513", emoji: "🟤" },
  T: { label: "Stone", color: "#4B0082", emoji: "🟣" },
};

const WeightVsMonth: React.FC<WeightVsMonthProps> = ({
  title,
  data,
  loading,
  error,
}) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading data: {error}</p>;
  if (!Array.isArray(data)) return <p>No valid sales data to display.</p>;

  const monthSet = new Set<string>();
  const itemMonthMap: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const itemType = item.Item_Type?.toUpperCase() || "G";
    if (!itemTypeDetails[itemType] || !item.Dt) return;

    const date = new Date(item.Dt);
    const month = date.toLocaleDateString("en-US", { month: "long" }); // e.g., June
    const weight =
      (item.Sale_Special_Detail_Net_Wt || 0) -
      (item.Sale_Special_Detail_Rng_Wt || 0);

    monthSet.add(month);
    if (!itemMonthMap[itemType]) itemMonthMap[itemType] = {};
    itemMonthMap[itemType][month] =
      (itemMonthMap[itemType][month] || 0) + weight;
  });

  const sortedMonths = Array.from(monthSet).sort(
    (a, b) => new Date(`1 ${a} 2000`).getTime() - new Date(`1 ${b} 2000`).getTime()
  );

  const datasets = Object.entries(itemMonthMap).map(([type, monthValues]) => {
    const detail = itemTypeDetails[type];
    return {
      label: `${detail.emoji || ""} ${detail.label}`,
      data: sortedMonths.map((month) => monthValues[month] || 0),
      backgroundColor: detail.color,
    };
  });

  const chartData = {
    labels: sortedMonths,
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
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Weight (g)",
        },
        ticks: {
          callback: (val: number | string) =>
            typeof val === "number" ? `${val.toLocaleString()} g` : val,
        },
      },
    },
  };

  return (
    <>
      {/* Chart Card */}
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full h-[500px] sm:h-[600px] lg:h-[450px] relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 text-center pr-2">
            {title || "Monthly Sales Weight by Item Type"}
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

        <div className="h-[calc(100%-80px)] w-full">
          <div className="block lg:hidden overflow-x-auto h-full">
            <div className="min-w-[600px] h-full">
              <Bar data={chartData} options={options} />
            </div>
          </div>
          <div className="hidden lg:block h-full">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog fullScreen open={fullscreenOpen} onClose={() => setFullscreenOpen(false)}>
        <div className="bg-white p-4 sm:p-6 w-full h-screen relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex-1 text-center pr-2">
              {title || "Monthly Sales Weight by Item Type"}
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
              <Bar data={chartData} options={options} />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default WeightVsMonth;
