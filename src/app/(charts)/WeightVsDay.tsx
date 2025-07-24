'use client';

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar} from 'react-chartjs-2';
import { SaleItem } from '@/hooks/useSalesData';
import { Dialog, Button } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightVsDayProps {
  title: string;
  data: SaleItem[] | null;
  loading: boolean;
  error: string | null;
}

const itemTypeDetails: Record<string, { label: string; color: string; emoji: string }> = {
    G: { label: "Gold", color: "#FFD700", emoji: "🟡" },       // Gold - Yellow
    S: { label: "Silver", color: "#C0C0C0", emoji: "⚪" },     // Silver - Light Grey
    P: { label: "Platinum", color: "#A9A9F5", emoji: "🔵" },   // Platinum - Light Blue
    D: { label: "Diamond", color: "#B9F2FF", emoji: "💎" },    // Diamond - Light Aqua
    F: { label: "Fixed Price", color: "#8B4513", emoji: "🟤" },// Fixed Price - Brown
    T: { label: "Stone", color: "#4B0082", emoji: "🟣" },      // Stone - Indigo
  };

const fallbackColor = '#3B82F6';

const WeightVsDay: React.FC<WeightVsDayProps> = ({ title, data, loading, error }) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading data: {error}</p>;
  if (!Array.isArray(data)) return <p>No valid data available.</p>;

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const itemTypeMap = new Map<string, Map<string, number>>();

  data.forEach((item) => {
    if (!item.Dt || !item.Item_Type) return;
    const date = new Date(item.Dt);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

    const weight = (item.Sale_Special_Detail_Net_Wt ?? 0) - (item.Sale_Special_Detail_Rng_Wt ?? 0);
    const itemType = item.Item_Type;

    if (!itemTypeMap.has(itemType)) {
      itemTypeMap.set(itemType, new Map<string, number>());
    }

    const typeMap = itemTypeMap.get(itemType)!;
    typeMap.set(weekday, (typeMap.get(weekday) || 0) + weight);
  });

  const datasets = Array.from(itemTypeMap.entries()).map(([itemType, weekdayMap]) => {
    const details = itemTypeDetails[itemType] || {
      label: itemType,
      color: fallbackColor,
    };

    return {
      label: `${details.emoji} ${details.label}`,

      data: weekdays.map((day) => weekdayMap.get(day) || 0),
      fill: false,
      borderColor: details.color,
      backgroundColor: details.color,
      tension: 0.3,
      pointRadius: 3,
    };
  });

  const chartData = {
    labels: weekdays,
    datasets,
  };
// const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
//   const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
  position: 'top' as const,
  labels: {
    boxWidth: 0,
    boxHeight: 0,
    padding: 8,
  },
},

      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { title: { display: true, text: 'Weekdays' } },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Net Weight (g)' },
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
            {title || 'Weight by Day and Type'}
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

        {/* Scrollable chart on mobile/tablet */}
        <div className="h-[calc(100%-80px)] w-full">
          <div className="block lg:hidden overflow-x-auto h-full">
            <div className="min-w-[600px] h-full">
              <Bar data={chartData} options={options} />
            </div>
          </div>

          {/* Full width on desktop */}
          <div className="hidden lg:block h-full">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Dialog fullScreen open={fullscreenOpen} onClose={() => setFullscreenOpen(false)}>
        <div className="bg-white p-4 sm:p-6 w-full h-screen relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex-1 text-center pr-2">{title}</h2>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setFullscreenOpen(false)}
              className="flex-shrink-0 min-w-0"
            >
              <span className="hidden sm:inline">Close</span>
              <span className="sm:hidden text-lg">✕</span>
            </Button>
          </div>

          {/* Fullscreen chart */}
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

export default WeightVsDay;
