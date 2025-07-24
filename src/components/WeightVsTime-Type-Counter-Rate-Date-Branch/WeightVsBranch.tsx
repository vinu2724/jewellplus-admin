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

const WeightVsBranch = () => {
  const data = {
    labels: ["Branch A", "Branch B", "Branch C", "Branch D", "Branch E"], // X-Axis labels (branches)
    datasets: [
      {
        label: "Gold",
        data: [100, 120, 90, 110, 105], // Example weights for Gold
        backgroundColor: "rgba(255, 215, 0, 0.7)", // Gold color
      },
      {
        label: "Silver",
        data: [80, 95, 70, 85, 90], // Example weights for Silver
        backgroundColor: "rgba(192, 192, 192, 0.7)", // Silver color
      },
      {
        label: "Diamond",
        data: [110, 130, 100, 120, 115], // Example weights for Diamond
        backgroundColor: "rgba(185, 242, 255, 0.7)", // Diamond color
      },
      {
        label: "Platinum",
        data: [90, 105, 85, 100, 95], // Example weights for Platinum
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
        text: "Weight By Branch & Type",
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
          text: "Weight (kg)", // Label for y-axis
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

export default WeightVsBranch;
