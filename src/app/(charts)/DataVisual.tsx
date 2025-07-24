"use client";

import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enIN } from "date-fns/locale";

import {
  getAccountYearOptions,
  getAccountYearRange,
  getCurrentAccountYear,
} from "@/utils/accountYear";

import useSalesData from "@/hooks/useSalesData";
import useBranchData from "@/hooks/Branch-List";
import useUserList from "@/hooks/User-List";
// Charts
import WeightVsMonth from "./WeightVsMonth";

import AmountVsTimeTypeBranch from "./AmountVsBranch";

import AmountVsHour from "./AmountVsHour";
import WeightVsHour from "./WeightVsHour";
import WeightVsDay from "./WeightVsDay";
import WeightVsBranchItemTypeChart from "./WeightVsBranch";
import AmountVsWeight from "./AmountVsWeight";
import WeightByItemTypePieChart from "./WeightVsSalesman";
import AmountVsSalesman from "./AmountVsSalesMan";

const RetailDashboard = () => {
  const acYearOptions = getAccountYearOptions(5);
  const defaultAcYear = getCurrentAccountYear();
  const defaultYearRange = getAccountYearRange(defaultAcYear);
  const today = new Date();

  const [acYear, setAcYear] = useState(defaultAcYear);
  const [yearRange, setYearRange] = useState(defaultYearRange);
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [timePreset, setTimePreset] = useState("today");
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const { data, loading, error, fetchSalesData } = useSalesData();
  const { branchData, fetchBranchData } = useBranchData();
  const { dropDown: users } = useUserList();

  useEffect(() => {
    fetchBranchData();
  }, []);

  const isDateInRange = (date: Date) => {
    const from = new Date(yearRange.from);
    const to = new Date(yearRange.to);
    return date >= from && date <= to;
  };

  // On initial load → apply "today"
  useEffect(() => {
    applyPreset("today");
    setTimePreset("today");
    setInitialLoadDone(true);
  }, []);

  // Fetch data when valid state changes
  useEffect(() => {
    if (!initialLoadDone) return;

    if (!isDateInRange(startDate) || !isDateInRange(endDate)) {
      console.warn("Selected dates are outside the account year range");
      return;
    }

    const formattedFromDate = startDate.toISOString().split("T")[0];
    const formattedToDate = endDate.toISOString().split("T")[0];
    fetchSalesData(acYear, formattedFromDate, formattedToDate);
  }, [acYear, startDate, endDate, initialLoadDone]);

  const handleYearChange = (year: string) => {
    const range = getAccountYearRange(year);
    setAcYear(year);
    setYearRange(range);

    const today = new Date();
    if (today >= new Date(range.from) && today <= new Date(range.to)) {
      setStartDate(today);
      setEndDate(today);
      setTimePreset("today");
    } else {
      setStartDate(new Date(range.from));
      setEndDate(new Date(range.to));
      setTimePreset("custom");
    }
  };

  const applyPreset = (preset: string) => {
    const today = new Date();
    let from = new Date();
    let to = new Date();

    switch (preset) {
      case "today":
        from = to = today;
        break;
      case "last7":
        from = new Date(today);
        from.setDate(today.getDate() - 6);
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "thisYear":
        from = new Date(today.getFullYear(), 3, 1); // Apr 1
        break;
      case "custom":
      default:
        return;
    }

    setStartDate(from);
    setEndDate(to);
  };

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          Data Analysis Board
        </h1>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enIN}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Account Year Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="acYearLabel">Account Year</InputLabel>
              <Select
                labelId="acYearLabel"
                value={acYear}
                label="Account Year"
                onChange={(e) => handleYearChange(e.target.value)}
              >
                {acYearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Time Preset Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="presetLabel">Time Preset</InputLabel>
              <Select
                labelId="presetLabel"
                value={timePreset}
                label="Time Preset"
                onChange={(e) => {
                  const preset = e.target.value;
                  setTimePreset(preset);
                  applyPreset(preset);
                }}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="last7">Last 7 Days</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>

            {/* From Date */}
            <DatePicker
              label="From"
              value={startDate}
              minDate={new Date(yearRange.from)}
              maxDate={new Date(yearRange.to)}
              onChange={(newDate) => {
                if (newDate && isDateInRange(newDate)) {
                  setStartDate(newDate);
                  setTimePreset("custom");
                }
              }}
              disableFuture
              slotProps={{
                textField: { fullWidth: true },
              }}
            />

            {/* To Date */}
            <DatePicker
              label="To"
              value={endDate}
              minDate={new Date(yearRange.from)}
              maxDate={new Date(yearRange.to)}
              onChange={(newDate) => {
                if (newDate && isDateInRange(newDate)) {
                  setEndDate(newDate);
                  setTimePreset("custom");
                }
              }}
              disableFuture
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </div>

          {/* Chart Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
            <WeightVsDay
              title=" Weight Vs Day"
              data={data}
              loading={loading}
              error={error}
            />

            <AmountVsTimeTypeBranch
              title="Amount vs Branch"
              salesData={data}
              branchData={branchData}
              loading={loading}
              error={error}
            />
            <AmountVsHour
              title="Amount vs Hour"
              salesData={data}
              loading={loading}
              error={error}
            />

            {/* <WeightVsRate
              title="Weight vs Rate"
              data={data}
              loading={loading}
              error={error}
            /> */}
            <WeightVsHour
              title="Weight vs Hour"
              salesData={data}
              loading={loading}
              error={error}
            />
            <AmountVsSalesman
              title="Amount by Salesman"
              salesData={data}
              users={users}
              loading={loading}
              error={error}
            />
            <WeightVsMonth
              title="Weight by Month"
              data={data}
              loading={loading}
              error={error}
            />
            <WeightVsBranchItemTypeChart
              title="Weight vs Branch"
              salesData={data}
              branchData={branchData}
              loading={loading}
              error={error}
            />
            <AmountVsWeight
              title="Amount vs Weight"
              data={data}
              loading={loading}
              error={error}
            />
            <WeightByItemTypePieChart
              title="Weight by Salesman"
              salesData={data}
              loading={loading}
              error={error}
              users={users}
            />
          </div>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default RetailDashboard;
