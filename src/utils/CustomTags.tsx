import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { BsTable } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";

interface DatalistProps {
  label: ReactNode;
  name: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const DataList: FC<DatalistProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  disabled = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hide options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    const event = {
      target: { name, value: option } as HTMLInputElement,
    } as ChangeEvent<HTMLInputElement>;

    onChange(event);
    setShowOptions(false);
  };

  const filteredOptions =
    showOptions && value === options.find((opt) => opt === value)
      ? options // Show all options when input is focused and matches an option exactly
      : options.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        );

  return (
    <div className="mb-1" ref={wrapperRef}>
      <label
        htmlFor={`${name}-input`}
        className="text-sm font-[var(--font-inter)]"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={`${name}-input`}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => setShowOptions(true)}
          onClick={() => setShowOptions(true)}
          className="block w-full h-10 border rounded-md px-3 pr-10 py-2 text-black border-gray-500 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder:text-sm placeholder:font-[var(--font-roboto)]"
          placeholder="Select or type..."
        />

        <div
          onClick={() => setShowOptions(true)}
          className="absolute top-1/2 right-0 transform -translate-y-1/2  text-black px-4 py-[11px] rounded-r-md cursor-pointer shadow-sm transition"
          title="Search Barcode"
        >
          <IoMdArrowDropdown size={26} />
        </div>

        {showOptions && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto no-scrollbar">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-black"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

//
interface InputProps {
  label: ReactNode; // Change from `string` to `ReactNode`
  name: string;
  type?: string;
  value: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void; // Add onBlur prop
  disabled?: boolean; // Add this line
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const DataInput: FC<InputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  disabled = false,
  onKeyDown,
}) => (
  <div className="mb-1">
    <label htmlFor={name} className="text-sm font-[var(--font-inter)]">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur} // Add onBlur handler
      onFocus={(e) => e.target.select()}
      disabled={disabled} // Use the disabled prop
      onKeyDown={onKeyDown}
      className={`mt-1 block w-full h-10 border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out
        ${
          ["rngPcs", "rngGWeight", "rngNWeight", "discount"].includes(name)
            ? "text-red-600"
            : ""
        }`}
      // Apply red color only for "rngPcs", "rngGWeight", "rngNWeight", "discount" fields
    />
  </div>
);

//
interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  name,
  checked,
  disabled = false,
  onChange,
}) => (
  <div className="flex items-center justify-center gap-2 mb-1">
    <label htmlFor={name} className="text-sm font-[var(--font-inter)]">
      {label}
    </label>
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked}
      disabled={disabled} // Use the disabled prop
      onChange={onChange}
      className=" mt-1 h-8 w-8 text-indigo-600 border-gray-500 rounded focus:ring-indigo-500"
    />
  </div>
);

//

interface CRTOption {
  caret_code: number;
  puriety_per: number;
  caret_name: string | null;
}
interface CrtTableProps {
  label: React.ReactNode;
  name: string;
  value: string;
  options: CRTOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const CrtTable: FC<CrtTableProps> = ({
  label,
  name,
  value,
  options,
  disabled = false,
  onChange,
}) => {
  const [showTable, setShowTable] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hide table when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowTable(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on query
  const filteredOptions = options.filter(
    (option) =>
      option.caret_code.toString() ||
      (option.puriety_per?.toString() ?? "") ||
      (option.caret_name ?? "").toLowerCase()
  );

  // Extract caret_code from value for highlight
  const selectedCaretCode = value ? parseFloat(value) : null;

  const handleSelect = (option: CRTOption) => {
    onChange(option.caret_code.toFixed(2) + "K");
    setShowTable(false);
  };

  return (
    <div className="relative mt-1" ref={wrapperRef}>
      <label htmlFor={name} className="text-sm font-[var(--font-inter)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value ?? ""}
        disabled={disabled}
        readOnly
        onFocus={() => setShowTable(true)}
        onClick={() => setShowTable(true)}
        placeholder="Select Caret..."
        style={{ cursor: "pointer" }}
        className="block w-full h-10 border rounded-md px-3 py-2 border-gray-500 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder:text-sm placeholder:font-[var(--font-roboto)]"
      />
      <div
        onClick={() => setShowTable(true)}
        className="absolute top-0 mt-10 right-0 transform -translate-y-1/2 text-black px-4 py-[11px] rounded-r-md cursor-pointer shadow-sm transition"
        title="Search Caret"
      >
        <BsTable size={18} />
      </div>

      {showTable && (
        <div className="absolute z-10 w-full mt-1 bg-white border-none rounded-lg shadow-lg max-h-72 overflow-y-auto no-scrollbar">
          <table className="table-auto w-full text-sm text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border-none px-2 py-1">Caret Code</th>
                <th className="border-none px-2 py-1">Purity (%)</th>
                <th className="border-none px-2 py-1">Caret Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredOptions.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-2 text-gray-400">
                    No caret found
                  </td>
                </tr>
              )}
              {filteredOptions.map((option, idx) => {
                const isSelected =
                  value &&
                  parseFloat(option.caret_code.toFixed(2)) ===
                    selectedCaretCode;
                return (
                  <tr
                    key={idx}
                    className={`cursor-pointer hover:bg-indigo-100 ${
                      isSelected ? "bg-indigo-200 font-bold" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <td className="border-none px-2 py-1">
                      {option.caret_code}
                    </td>
                    <td className="border-none px-2 py-1">
                      {option.puriety_per}
                    </td>
                    <td className="border-none px-2 py-1">
                      {option.caret_name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

//
interface CounterOption {
  code: string;
  name: string;
  branch_Branch_Name: string;
}

interface CounterTableProps {
  label: ReactNode;
  name: string;
  value: string;
  options: CounterOption[];
  onChange: (value: string) => void;
  disabled?: boolean; // Add this line
}

export const CounterTable: FC<CounterTableProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  disabled = false,
}) => {
  const [showTable, setShowTable] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hide table when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowTable(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on query
  const filteredOptions = options.filter(
    (option) =>
      option.code.toLowerCase().includes(query.toLowerCase()) ||
      (option.name || "").toLowerCase().includes(query.toLowerCase()) ||
      (option.branch_Branch_Name || "")
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  const handleSelect = (option: CounterOption) => {
    onChange(option.name);
    setShowTable(false);
  };

  return (
    <div className="relative mt-1" ref={wrapperRef}>
      <label htmlFor={name} className="text-sm font-[var(--font-inter)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value ?? ""}
        disabled={disabled}
        readOnly
        onFocus={() => setShowTable(true)}
        onClick={() => setShowTable(true)}
        placeholder="Select counter..."
        style={{ cursor: "pointer" }}
        className="block w-full h-10 border rounded-md px-3 py-2 border-gray-500 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder:text-sm placeholder:font-[var(--font-roboto)]"
      />
      <div
        onClick={() => setShowTable(true)}
        hidden={disabled}
        className="absolute top-0 mt-10 right-0 transform -translate-y-1/2 text-black px-4 py-[11px] rounded-r-md cursor-pointer shadow-sm transition"
        title="Search Counter"
      >
        <BsTable size={18} />
      </div>

      {showTable && (
        <div className="absolute z-10 w-full mt-1 bg-white border-none rounded-lg shadow-lg max-h-60 overflow-y-auto no-scrollbar">
          <div className="p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search code, name, or branch..."
              className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
              autoFocus
            />
          </div>
          <table className="table-auto w-full text-sm text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border-none px-2 py-1">Code</th>
                <th className="border-none px-2 py-1">Name</th>
                <th className="border-none px-2 py-1">Branch Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredOptions.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-2 text-gray-400">
                    No counter found
                  </td>
                </tr>
              )}
              {filteredOptions.map((option, index) => {
                const isSelected = value && option.name === value;
                return (
                  <tr
                    key={index}
                    className={`cursor-pointer hover:bg-indigo-100 ${
                      isSelected ? "bg-indigo-200 font-bold" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <td className="border-none px-2 py-1">{option.code}</td>
                    <td className="border-none px-2 py-1">{option.name}</td>
                    <td className="border-none px-2 py-1">
                      {option.branch_Branch_Name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
