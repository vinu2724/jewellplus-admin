"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Dialog, Button } from "@mui/material";
import { SaleItem } from "@/hooks/useSalesData";
import { BranchItem } from "@/hooks/Branch-List";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  title: string;
  salesData: SaleItem[];
  branchData: BranchItem[];
  loading: boolean;
  error: string | null;
}

const itemTypeMeta: Record<string, { label: string; color: string; emoji: string }> = {
  G: { label: "Gold", color: "#FFD700", emoji: "🟡" },
  S: { label: "Silver", color: "#C0C0C0", emoji: "⚪" },
  P: { label: "Platinum", color: "#A9A9F5", emoji: "🔵" },
  D: { label: "Diamond", color: "#B9F2FF", emoji: "💎" },
  F: { label: "Fixed Price", color: "#8B4513", emoji: "🟤" },
  T: { label: "T", color: "#4B0082", emoji: "🟣" },
};

const WeightVsBranchItemTypeChart: React.FC<Props> = ({
  title,
  salesData,
  branchData,
  loading,
  error,
}) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading chart: {error}</p>;
  if (!salesData.length || !branchData.length) return <p>No data available.</p>;

  const firmToBranchMap = new Map<string, string>();
  branchData.forEach((b) => {
    const firmKey = b.firm_Cd?.toString().toLowerCase();
    if (firmKey && b.branch_Name) {
      firmToBranchMap.set(firmKey, b.branch_Name);
    }
  });

  const branchItemTypeWeight: Record<string, Record<string, number>> = {};

  salesData.forEach((item) => {
    const firmCd = item.Firm_Cd?.toString().toLowerCase();
    const branchName = firmToBranchMap.get(firmCd || "") || "Unknown Branch";
    const itemType = item.Item_Type?.toUpperCase() || "G";
    const weight = (item.Sale_Special_Detail_Net_Wt || 0) - (item.Sale_Special_Detail_Rng_Wt || 0);

    if (!itemTypeMeta[itemType]) return;

    if (!branchItemTypeWeight[branchName]) {
      branchItemTypeWeight[branchName] = {};
    }

    branchItemTypeWeight[branchName][itemType] =
      (branchItemTypeWeight[branchName][itemType] || 0) + weight;
  });

  const branchLabels = Object.keys(branchItemTypeWeight);

  const datasets = Object.keys(itemTypeMeta).map((type) => {
    const data = branchLabels.map((branch) => branchItemTypeWeight[branch]?.[type] || 0);
    return {
      label: `${itemTypeMeta[type].emoji} ${itemTypeMeta[type].label}`,
      data,
      backgroundColor: itemTypeMeta[type].color,
    };
  });

  const chartData = {
    labels: branchLabels,
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
      tooltip: {
        callbacks: {
          label: (context: import("chart.js").TooltipItem<"bar">) =>
            `${context.dataset.label}: ${(context.raw as number).toFixed(2)}g`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Weight (g)" },
      },
      x: {
        title: { display: true, text: "Branch Name" },
      },
    },
  };

  return (
    <>
      {/* Main Chart Card */}
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full h-[500px] sm:h-[600px] lg:h-[450px] relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 text-center pr-2">
            {title || "Weight vs Branch (Item Type-wise)"}
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
              {title || "Weight vs Branch (Item Type-wise)"}
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

export default WeightVsBranchItemTypeChart;
