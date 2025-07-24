import { useState } from "react";

const SearchBar = ({ placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center border-2 rounded-3xl focus-within:border-yellow-700 transition-colors duration-300 px-4 py-2 w-full max-w-md bg-white shadow-sm ">
      <svg
        className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6-10.6 7.5 7.5 0 0010.6 10.6z"
        />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full text-gray-700  focus:outline-none bg-transparent"
      />
    </div>
  );
};

export default SearchBar;
