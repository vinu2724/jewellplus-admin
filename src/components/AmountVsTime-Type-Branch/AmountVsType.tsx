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
const AmountVsType = () => {
  const data = {
    labels: ["Gold", "Silver", "Diamond", "Platinum"], // X-Axis labels (types)
    datasets: [
      {
        label: "Amount",
        data: [1000, 3000, 2000, 1150], // Example amounts for each type
        backgroundColor: "rgba(255, 215, 0, 0.7)", // Gold color for the bars
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
        text: "Amount By Type",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Types", // Label for x-axis
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

export default AmountVsType;
