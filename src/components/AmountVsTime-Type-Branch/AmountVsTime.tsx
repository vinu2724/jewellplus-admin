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

const AmountVsTime = () => {
  const data = {
    labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM"], // X-Axis labels (time)
    datasets: [
      {
        label: "Gold",
        data: [1000, 1200, 1400, 1600, 1800], // Example amounts for Gold
        backgroundColor: "rgba(255, 215, 0, 0.7)", // Gold color
      },
      {
        label: "Silver",
        data: [800, 1000, 1200, 1400, 1600], // Example amounts for Silver
        backgroundColor: "rgba(192, 192, 192, 0.7)", // Silver color
      },
      {
        label: "Diamond",
        data: [900, 1100, 1300, 1500, 1700], // Example amounts for Diamond
        backgroundColor: "rgba(185, 242, 255, 0.7)", // Diamond color
      },
      {
        label: "Platinum",
        data: [700, 900, 1100, 1300, 1500], // Example amounts for Platinum
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
        text: "Amount By Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time", // Label for x-axis
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

export default AmountVsTime;
