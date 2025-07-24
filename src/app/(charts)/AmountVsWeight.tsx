"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Dialog, Button } from "@mui/material";
import { SaleItem } from "@/hooks/useSalesData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

interface AmountVsWeightProps {
  title: string;
  data: SaleItem[] | null;
  loading: boolean;
  error: string | null;
}

const AmountVsWeight: React.FC<AmountVsWeightProps> = ({ title, data, loading, error }) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading chart: {error}</p>;
  if (!Array.isArray(data)) return <p>No valid sales data to display.</p>;

  const itemTypeMap: Record<string, { label: string; color: string; emoji: string }> = {
    G: { label: "Gold", color: "#FFD700", emoji: "🟡" },
    S: { label: "Silver", color: "#C0C0C0", emoji: "⚪" },
    P: { label: "Platinum", color: "#4169E1", emoji: "🔵" },
    D: { label: "Diamond", color: "#B9F2FF", emoji: "💎" },
    F: { label: "Fixed Price", color: "#8B4513", emoji: "🟤" },
    T: { label: "Stone", color: "#4B0082", emoji: "🟣" },
  };

  const groupedData: Record<string, { x: number; y: number }[]> = {};

  data.forEach((item) => {
    const itemType = (item.Item_Type || "G").toUpperCase();
    if (!itemTypeMap[itemType]) return;

    const weight = (item.Sale_Special_Detail_Net_Wt || 0) - (item.Sale_Special_Detail_Rng_Wt || 0);
    const amount =
      (item.Sale_Special_Detail_Amount || 0) +
      (item.Other_Charges || 0) +
      (item.Sale_Special_Detail_Making_Amt || 0) -
      (item.Discount_Amt || 0);

    if (weight > 0 && amount > 0) {
      if (!groupedData[itemType]) groupedData[itemType] = [];
      groupedData[itemType].push({ x: weight, y: amount });
    }
  });

  const datasets = Object.entries(groupedData).map(([type, points]) => ({
    label: `${itemTypeMap[type].emoji} ${itemTypeMap[type].label}`,
    data: points.sort((a, b) => a.x - b.x),
    backgroundColor: itemTypeMap[type].color,
    borderColor: itemTypeMap[type].color,
    tension: 0.4,
    pointRadius: 4,
    fill: false,
  }));

  const chartData = { datasets };

interface CustomLegendLabel {
  text: string;
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  hidden: boolean;
  datasetIndex: number;
}

interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      position: "top";
      labels: {
        usePointStyle: boolean;
        generateLabels: (chart: ChartJS<"line">) => CustomLegendLabel[];
        boxWidth: number;
        boxHeight: number;
        padding: number;
      };
    };
    tooltip: {
      callbacks: {
        label: (context: import("chart.js").TooltipItem<"line">) => string;
      };
    };
  };
  scales: {
    x: {
      title: { display: boolean; text: string };
      type: "linear";
      ticks: { precision: number };
    };
    y: {
      title: { display: boolean; text: string };
      beginAtZero: boolean;
      ticks: {
        callback: (val: number | string) => string | number;
      };
    };
  };
}

const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: false,
        generateLabels: (chart: ChartJS<"line">): CustomLegendLabel[] => {
          const datasets = chart.data.datasets || [];
          return (datasets as { label: string }[]).map((dataset, i): CustomLegendLabel => ({
            text: dataset.label as string,
            fillStyle: "transparent", // make color box invisible
            strokeStyle: "transparent",
            lineWidth: 0,
            hidden: !chart.isDatasetVisible(i),
            datasetIndex: i,
          }));
        },
        boxWidth: 0,
        boxHeight: 0,
        padding: 8,
      },
    },
    tooltip: {
      callbacks: {
        label: (context: import("chart.js").TooltipItem<"line">): string => {
          const raw = context.raw as { x: number; y: number };
          return `Weight: ${raw.x}g, Amount: ₹${raw.y}`;
        },
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: "Weight (g)" },
      type: "linear",
      ticks: { precision: 0 },
    },
    y: {
      title: { display: true, text: "Amount (₹)" },
      beginAtZero: true,
      ticks: {
        callback: (val: number | string): string | number =>
          typeof val === "number" ? `₹${val.toLocaleString()}` : val,
      },
    },
  },
};

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full h-[500px] sm:h-[600px] lg:h-[450px] relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 text-center pr-2">
            {title || "Amount vs Weight by Item Type"}
          </h3>
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
        <div className="h-[calc(100%-80px)] w-full">
          <div className="block lg:hidden overflow-x-auto h-full">
            <div className="min-w-[600px] h-full">
              <Line data={chartData} options={options} />
            </div>
          </div>
          <div className="hidden lg:block h-full">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog fullScreen open={fullscreenOpen} onClose={() => setFullscreenOpen(false)}>
        <div className="bg-white p-4 sm:p-6 w-full h-screen relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex-1 text-center pr-2">
              {title || "Amount vs Weight by Item Type"}
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

export default AmountVsWeight;
