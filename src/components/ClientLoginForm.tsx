import React from "react"; // Assuming you have a Loader component

type Props = {
  corporateId: string;
  setCorporateId: (value: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean; // Add isLoading prop
};

export default function ClientLoginForm({
  corporateId,
  setCorporateId,
  error,
  onSubmit,
  isLoading, // Destructure isLoading
}: Props) {
  const classNameInput = `w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all ${
    isLoading ? "bg-gray-100 cursor-not-allowed" : ""
  }`;
  const classNameButton = `w-full bg-gradient-to-r from-yellow-400 to-yellow-700 hover:bg-gradient-to-r from-yellow-500 to-yellow-800 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center min-h-[42px] ${
    isLoading ? "opacity-70 cursor-wait" : ""
  }`;
  return (
    <>
      <div className="p-4 py-6 text-white bg-yellow-600 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
        <div className="my-3 text-lg font-bold tracking-wider text-center">
          <a href="#">Welcome To Jewellplus - Admin</a>
        </div>
        <p className="mt-6 font-normal text-center text-gray-300 md:mt-0">
          With the power of Software, you can now focus only on functionaries
          for your digital products, while leaving the UI design on us!
        </p>
        <p className="flex flex-col items-center justify-center mt-10 text-center">
          <span>Device Not Register ?</span>
          <a href="#" className="underline">
            Get Register Your Device !
          </a>
        </p>
        <p className="mt-6 text-sm text-center text-gray-300">
          Read our{" "}
          <a href="#" className="underline">
            terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            conditions
          </a>
        </p>
      </div>
      <div className="flex flex-col justify-center p-5 bg-white md:flex-1">
        <h3 className="my-2 text-2xl text-center font-semibold text-gray-700">
          Corporate Authentication
        </h3>
        <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="corporateId"
              className="text-sm font-semibold text-gray-500"
            >
              Enter Corporate-ID
            </label>
            <input
              type="text"
              id="corporateId"
              name="corporateId"
              placeholder="xxx"
              value={corporateId}
              onChange={(e) => setCorporateId(e.target.value)}
              required
              className={classNameInput}
              disabled={isLoading}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={classNameButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </span>
              ) : (
                "Proceed To Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
