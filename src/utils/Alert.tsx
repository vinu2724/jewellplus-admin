import React from "react";

interface AlertProps {
  title: "success" | "error" | "warning" | "info";
  message: string;
}

const variantClasses = {
  success: "border-green-500 bg-green-100 text-green-800",
  error: "border-red-500 bg-red-100 text-red-800",
  warning: "border-yellow-500 bg-yellow-100 text-yellow-800",
  info: "border-blue-500 bg-blue-100 text-blue-800",
};

const icons = {
  success: (
    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#bbf7d0" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#22c55e"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#fecaca" />
      <path
        d="M15 9l-6 6M9 9l6 6"
        stroke="#ef4444"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#fef9c3" />
      <path
        d="M12 8v4m0 4h.01"
        stroke="#eab308"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#bae6fd" />
      <path
        d="M12 8h.01M12 12v4"
        stroke="#0ea5e9"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const Alert: React.FC<AlertProps> = ({ title, message }) => {

  console.log("class",variantClasses[title])
  return (
    <div
      className={`fixed top-24 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-lg p-4 animate-slideIn border ${variantClasses[title]}`}
      role="alert"
      style={{ minWidth: 320, maxWidth: 400 }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">{icons[title]}</div>
        <div>
          <h4 className="mb-1 text-base font-bold capitalize">{title}</h4>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
