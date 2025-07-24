"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CashBookSummaryBody = () => {
const [startDate, setStartDate] = useState<Date | null>(new Date("2025-05-31"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-05-31"));

  return (   
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
            Cash Book Summary
        </h1>
        <select className="border p-1 rounded">
          <option>ALL</option>
        </select>
      </div>

      <div className="text-center font-bold text-lg">PARAS INFOTECH</div>
      <div className="text-center text-sm">
        <div>Cashier Wise Cash Summary for the period</div>
        <div className="flex justify-center items-baseline space-x-2 mt-1">
          <span>From :</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            className="border p-1 rounded text-center font-bold w-28 bg-gray-50"
            popperPlacement="bottom-start"
          />
          <span>To :</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            className="border p-1 rounded text-center font-bold w-28 bg-gray-50"
            // minDate={startDate}
            popperPlacement="bottom-start"
          />
        </div>
      </div>

      {/* Optional: Add a small margin if the date pickers are too close to the buttons below */}
      <div className="my-2"></div>


      <div className="flex justify-center space-x-2">
        <button className="border p-1 rounded"><ChevronLeft size={16} /></button>
        <button className="border p-1 rounded"><ChevronRight size={16} /></button>
      </div>

      <div className="overflow-x-auto border">
        <table className="border-collapse text-sm text-right min-w-max">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="border p-1">Sr.</th>
              <th className="border p-1 text-left">Cashier Name</th>
              <th className="border p-1">Opening Balance</th>
              <th className="border p-1">Cash Dr.</th>
              <th className="border p-1">Cash Cr.</th>
              <th className="border p-1">Closing Balance</th>
              <th className="border p-1">Credit Dr.</th>
              <th className="border p-1">Credit Cr.</th>
              <th className="border p-1">Discount</th>
              <th className="border p-1">Credit Card</th>
              <th className="border p-1">Cheque</th>
              <th className="border p-1">Other/Voucher</th>
              <th className="border p-1">Entered Cash</th>
              <th className="border p-1">Cash Diff</th>
              <th className="border p-1">Gold</th>
              <th className="border p-1">Silver</th>
              <th className="border p-1">Diamond</th>
              <th className="border p-1">Stone</th>
              <th className="border p-1">Other</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">1)</td>
              <td className="border p-1 text-left">CASH2 [1]</td>
              <td className="border p-1">22,546.00</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1">22,546.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
            </tr>
            <tr>
              <td className="border p-1">2)</td>
              <td className="border p-1 text-left">CASHIER [1]</td>
              <td className="border p-1 text-red-600">-87,67,002.00</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 text-red-600">-87,67,002.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
            </tr>
            <tr>
              <td className="border p-1">3)</td>
              <td className="border p-1 text-left">NEW CASHIER [1]</td>
              <td className="border p-1">43,998.00</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1">43,998.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
            </tr>
            <tr>
              <td className="border p-1">4)</td>
              <td className="border p-1 text-left">OWNER [1]</td>
              <td className="border p-1">40,65,158.00</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1">40,65,158.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
            </tr>
            <tr>
              <td className="border p-1">5)</td>
              <td className="border p-1 text-left">RP CASHIER [2]</td>
              <td className="border p-1">1,50,000.00</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1">1,50,000.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
            </tr>
            <tr>
              <td className="border p-1">6)</td>
              <td className="border p-1 text-left">SUVARNA</td>
              <td className="border p-1">26,419.00</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1">26,419.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
            </tr>
            <tr>
              <td className="border p-1">7)</td>
              <td className="border p-1 text-left">SUVARNA CHAVAN [1]</td>
              <td className="border p-1">46,240.00</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1">46,240.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">.00</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
              <td className="border p-1">0.000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-right font-semibold">
        Closing Cash Balance: <span className="text-red-600">-44,12,641.00</span>
      </div>
      <div className="text-left">7 Unmatch Cash Balance</div>

      <div className="text-right space-y-1 text-sm">
        <div>RNG Total : 0.000</div>
        <div>Jama Total : 0.000</div>
        <div>Sale Return Total : 0.000</div>
        <div>Total Old Jama : 0.000</div>
      </div>
    </div>

  );
};

export default CashBookSummaryBody;
