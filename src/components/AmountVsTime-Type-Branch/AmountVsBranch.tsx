"use client";
import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AmountVsBranch = () => {
  const data = {
    labels: ["Branch A", "Branch B", "Branch C", "Branch D"], // X-Axis labels (branches)
    datasets: [
      {
        label: "Gold",
        data: [1500, 1200, 1700, 1400], // Example amounts for Gold
        backgroundColor: "rgba(255, 215, 0, 0.7)", // Gold color
      },
      {
        label: "Silver",
        data: [1300, 1000, 1600, 1200], // Example amounts for Silver
        backgroundColor: "rgba(192, 192, 192, 0.7)", // Silver color
      },
      {
        label: "Diamond",
        data: [1400, 1100, 1800, 1300], // Example amounts for Diamond
        backgroundColor: "rgba(185, 242, 255, 0.7)", // Diamond color
      },
      {
        label: "Platinum",
        data: [1200, 900, 1500, 1100], // Example amounts for Platinum
        backgroundColor: "rgba(229, 228, 226, 0.7)", // Platinum color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Amount By Branch",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Branches", // Label for x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount", // Label for y-axis
        },
      },
    },
  };

  return (
    <>
      <div className="w-full max-w-4xl p-4 mt-16 bg-white shadow-lg rounded-lg">
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default AmountVsBranch;
