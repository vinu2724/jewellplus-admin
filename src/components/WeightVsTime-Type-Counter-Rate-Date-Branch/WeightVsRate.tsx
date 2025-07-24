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

const WeightVsRate = () => {
  const data = {
    labels: ["Rate 500", "Rate 1000", "Rate 1500", "Rate 2000", "Rate 2500"], // X-Axis labels (rates)
    datasets: [
      {
        label: "Gold",
        data: [5, 10, 15, 20, 25], // Example weights for Gold
        backgroundColor: "rgba(255, 215, 0, 0.7)", // Gold color
      },
      {
        label: "Silver",
        data: [4, 8, 12, 16, 20], // Example weights for Silver
        backgroundColor: "rgba(192, 192, 192, 0.7)", // Silver color
      },
      {
        label: "Diamond",
        data: [6, 9, 14, 18, 22], // Example weights for Diamond
        backgroundColor: "rgba(185, 242, 255, 0.7)", // Diamond color
      },
      {
        label: "Platinum",
        data: [3, 7, 11, 15, 19], // Example weights for Platinum
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
        text: "Weight By Rate & Type",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Rates", // Label for x-axis
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

export default WeightVsRate;
