import React, { useCallback } from 'react';
import { StockCounterItem } from './StockCounter'; // Import the item interface
import { DataInput } from '@/utils/CustomTags'; // Assuming these are available

interface StockCounterBodyProps {
  items: StockCounterItem[];
  updateStockItem: (index: number, updatedItem: StockCounterItem) => void;
  deleteStockItem: (index: number) => void;
  onAddItem: () => void;
  // Props for dropdowns if needed, e.g.,
  // itemList?: string[];
  // itemCategoryOptions?: string[];
  // caretCategoryOptions?: { caret_code: number; caret_name: string | null; }[];
}

const StockCounterBody: React.FC<StockCounterBodyProps> = ({
  items,
  updateStockItem,
  deleteStockItem,
  onAddItem,
}) => {
  const handleItemChange = useCallback(
    (index: number, name: keyof StockCounterItem, value: string) => {
      const currentItem = items[index];
      const updatedItem = { ...currentItem, [name]: value };
      updateStockItem(index, updatedItem);
    },
    [items, updateStockItem]
  );

  const handleNumericChange = useCallback(
    (index: number, name: keyof StockCounterItem, value: string) => {
      if (/^\d*\.?\d*$/.test(value)) {
        handleItemChange(index, name, value);
      }
    },
    [handleItemChange]
  );

  const handleNumericBlur = useCallback(
    (index: number, name: keyof StockCounterItem, value: string) => {
      if (value !== "") {
        let formattedValue = value;
        if (name === 'pcs' || name === 'stockQty') {
          formattedValue = Number.isFinite(parseFloat(value)) ? String(Math.round(parseFloat(value))) : "0";
        } else if (name === 'grossWt' || name === 'netWt') {
          formattedValue = Number.isFinite(parseFloat(value)) ? parseFloat(value).toFixed(3) : "0.000";
        } else if (name === 'makingRate' || name === 'amount') { // Added 'amount' for consistent formatting
          formattedValue = Number.isFinite(parseFloat(value)) ? parseFloat(value).toFixed(2) : "0.00";
        }
        handleItemChange(index, name, formattedValue);
      }
    },
    [handleItemChange]
  );

  return (
    <div className="mt-4 space-y-4">
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className="p-4 bg-white shadow rounded-md border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-semibold">Sr. {index + 1}</span>
              <button
                onClick={() => deleteStockItem(index)}
                className="text-red-500 hover:text-red-700 font-bold text-md"
                aria-label="Delete item"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
              <DataInput
                label="Barcode"
                name="barcode"
                value={item.barcode || ""}
                onChange={(e) => handleItemChange(index, 'barcode', e.target.value.toUpperCase())}
              />
              <DataInput
                label="Item Description"
                name="itemDescription"
                value={item.itemDescription}
                onChange={(e) => handleItemChange(index, 'itemDescription', e.target.value)}
                // This would typically be read-only and fetched based on barcode
                // disabled 
              />
              <DataInput
                label="Narration"
                name="narration"
                value={item.narration}
                onChange={(e) => handleItemChange(index, 'narration', e.target.value)}
              />
              <DataInput // Or DataList if options are available
                label="Item Category"
                name="itemCategory"
                value={item.itemCategory}
                onChange={(e) => handleItemChange(index, 'itemCategory', e.target.value)}
                // This would typically be read-only and fetched
                // disabled
              />
              <DataInput // Consider CrtTable if options are complex
                label="CT"
                name="ct"
                value={item.ct}
                onChange={(e) => handleItemChange(index, 'ct', e.target.value)}
              />
              <DataInput
                label="Pcs (Counted)"
                name="pcs"
                value={item.pcs}
                onChange={(e) => handleNumericChange(index, 'pcs', e.target.value)}
                onBlur={(e) => handleNumericBlur(index, 'pcs', e.target.value)}
                type="text" // Use text for custom numeric handling
              />
              <DataInput
                label="Gross Wt"
                name="grossWt"
                value={item.grossWt}
                onChange={(e) => handleNumericChange(index, 'grossWt', e.target.value)}
                onBlur={(e) => handleNumericBlur(index, 'grossWt', e.target.value)}
                type="text"
              />
              <DataInput
                label="Net Wt"
                name="netWt"
                value={item.netWt}
                onChange={(e) => handleNumericChange(index, 'netWt', e.target.value)}
                onBlur={(e) => handleNumericBlur(index, 'netWt', e.target.value)}
                type="text"
              />
              <div className="flex items-end space-x-2">
                <DataInput
                  label="Making Rate"
                  name="makingRate"
                  value={item.makingRate}
                  onChange={(e) => handleNumericChange(index, 'makingRate', e.target.value)}
                  onBlur={(e) => handleNumericBlur(index, 'makingRate', e.target.value)}
                  type="text"
                 
                />
                <select
                  name="makingOn"
                  value={item.makingOn}
                  onChange={(e) => handleItemChange(index, 'makingOn', e.target.value)}
                  className="h-10 border rounded-md px-3 py-2 border-gray-500 shadow-sm  bg-indigo-700 cursor-pointer text-white"
                  style={{ minWidth: '80px' }}
                >
                  <option value="N">N.A.</option>
                  <option value="P">Pcs</option>
                  <option value="G">Gms</option>
                  <option value="F">Full</option>
                  <option value="W">West.%</option>
                </select>
              </div>
                            {/* Added Amount Field */}
              <DataInput
                label="Amount"
                name="amount"
                value={item.amount ?? "0.00"} // Provide null if undefined
                onChange={(e) => handleNumericChange(index, 'amount', e.target.value)}
                onBlur={(e) => handleNumericBlur(index, 'amount', e.target.value)}
                type="text"
              />
              {/* Added Supplier Field */}
              <DataInput // Consider DataList if options available
                label="Supplier"
                name="supplier"
                value={item.supplier ?? ""} // Provide null if undefined
                onChange={(e) => handleItemChange(index, 'supplier', e.target.value)}
              />

              <DataInput
                label="Stock Balance"
                name="stockQty"
                value={item.stockQty}
                onChange={(e) => handleNumericChange(index, 'stockQty', e.target.value)}
                onBlur={(e) => handleNumericBlur(index, 'stockQty', e.target.value)}
                type="text"
                // This would typically be read-only and fetched
                // disabled
              />
              
            </div>
          </div>
        );
      })}

      <div className="mt-6 flex justify-center">
        <button
          onClick={onAddItem}
          className="bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default StockCounterBody;
