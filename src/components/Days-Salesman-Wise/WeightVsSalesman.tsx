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

const WeightVsSalesman = () => {
  const data = {
    labels: ["Nilesh", "Kiran", "Jafar", "Soniya", "Amar"], // X-Axis labels (salesmen)
    datasets: [
      {
        label: "Gold",
        data: [18, 15, 20, 14, 16], // Example weights for Gold
        backgroundColor: "rgba(255, 215, 0, 0.7)", // Gold color
      },
      {
        label: "Silver",
        data: [14, 12, 16, 10, 13], // Example weights for Silver
        backgroundColor: "rgba(192, 192, 192, 0.7)", // Silver color
      },
      {
        label: "Diamond",
        data: [20, 18, 22, 15, 19], // Example weights for Diamond
        backgroundColor: "rgba(185, 242, 255, 0.7)", // Diamond color
      },
      {
        label: "Platinum",
        data: [12, 14, 18, 13, 15], // Example weights for Platinum
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
        text: "Weight By Salesman & Type",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Salesmen", // Label for x-axis
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

export default WeightVsSalesman;
