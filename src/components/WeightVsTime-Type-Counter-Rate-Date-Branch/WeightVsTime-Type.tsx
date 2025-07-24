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

const WeightVsTime = () => {
  const data = {
    labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"], // X-Axis labels (time)
    datasets: [
      {
        label: "Gold",
        data: [10, 12, 14, 16, 18, 15], // Example weights for Gold
        backgroundColor: "rgba(255, 215, 0, 0.7)", // Gold color
      },
      {
        label: "Silver",
        data: [8, 10, 12, 14, 16, 12], // Example weights for Silver
        backgroundColor: "rgba(192, 192, 192, 0.7)", // Silver color
      },
      {
        label: "Diamond",
        data: [9, 11, 13, 15, 17, 22], // Example weights for Diamond
        backgroundColor: "rgba(185, 242, 255, 0.7)", // Diamond color
      },
      {
        label: "Platinum",
        data: [7, 9, 11, 13, 15, 18], // Example weights for Platinum
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
        text: "Weight By Time & Type",
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

export default WeightVsTime;
