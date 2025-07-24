"use client";

import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Dialog, Button } from "@mui/material";
import { SaleItem } from "@/hooks/useSalesData";
import { User } from "@/hooks/User-List";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  title?: string;
  salesData: SaleItem[];
  loading: boolean;
  error: string | null;
  users: User[];
}

const AmountVsSalesman: React.FC<Props> = ({
  title,
  salesData,
  loading,
  error,
  users,
}) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!salesData.length || !users.length) return <p>No data to display.</p>;

  // Map user IDs to user names
  const userMap = new Map<number, string>();
  users.forEach((user) => {
    userMap.set(Number(user.User_Id), user.User_Name.trim());
  });

  // Group amount by user name
  const amountByUser: Record<string, number> = {};
  salesData.forEach((sale) => {
    const userId = sale.Sale_Special_Detail_User_Id;
    const userName = userMap.get(userId) || "Unknown";

    const amount =
      (sale.Sale_Special_Detail_Amount || 0) +
      (sale.Other_Charges || 0) +
      (sale.Sale_Special_Detail_Making_Amt || 0) -
      (sale.Discount_Amt || 0);

    amountByUser[userName] = (amountByUser[userName] || 0) + amount;
  });

  const labels = Object.keys(amountByUser);
  const amounts = Object.values(amountByUser);

  const colors = [
    "#6366F1", "#F59E0B", "#10B981", "#EF4444", "#3B82F6",
    "#8B5CF6", "#EC4899", "#F43F5E", "#22D3EE", "#84CC16",
  ];
  const backgroundColor = labels.map((_, i) => colors[i % colors.length]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Amount (₹)",
        data: amounts,
        backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // <-- donut hole size
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (
            context: import("chart.js").TooltipItem<"doughnut">
          ) {
            return `${context.label}: ₹${(context.raw as number).toFixed(2)}`;
          },
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
            {title || "Amount by Salesman"}
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

        {/* Chart Area */}
        <div className="h-[calc(100%-80px)] w-full overflow-x-auto">
          <div className="min-w-[300px] h-full">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog fullScreen open={fullscreenOpen} onClose={() => setFullscreenOpen(false)}>
        <div className="bg-white p-4 sm:p-6 w-full h-screen relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex-1 text-center pr-2">
              {title || "Amount by Salesman"}
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
            <div className="min-w-[300px] lg:min-w-0 h-full">
              <Doughnut data={chartData} options={options} />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AmountVsSalesman;
