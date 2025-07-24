"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Modal from "@/components/ReusableModals/statusMsg";
import { detectAndLogDevice } from "@/utils/identifyDevice";
import Header from "@/components/Header";

type DecodedData = {
  clientId: string;
  systemName: string;
  fingerPrintId: string;
};

function RegisterPage() {
  const [deviceName, setDeviceName] = useState("");
  const [counter, setCounter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [deviceInfo, setDeviceInfo] = useState({
    browser: "",
    os: "",
    location: "",
  });

  const [decodedData, setDecodedData] = useState<DecodedData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const encodedData = searchParams.get("data");

    if (encodedData) {
      try {
        const base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");
        const decodedSearchParams = JSON.parse(
          Buffer.from(decodeURIComponent(base64), "base64").toString()
        );
        setDecodedData(decodedSearchParams);
      } catch (error) {
        console.error("Error decoding data:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const userAgent = navigator.userAgent.toLowerCase();
      let browser = "Unknown";
      let os = "Unknown";

      if (userAgent.includes("chrome")) browser = "Chrome";
      else if (userAgent.includes("firefox")) browser = "Firefox";
      else if (userAgent.includes("safari")) browser = "Safari";
      else if (userAgent.includes("edge")) browser = "Edge";
      else if (userAgent.includes("opera") || userAgent.includes("opr"))
        browser = "Opera";

      if (userAgent.includes("windows")) os = "Windows";
      else if (userAgent.includes("mac")) os = "MacOS";
      else if (userAgent.includes("android")) os = "Android";
      else if (userAgent.includes("iphone") || userAgent.includes("ipad"))
        os = "iOS";
      else if (userAgent.includes("linux")) os = "Linux";

      const locationdata = await fetch("https://ipapi.co/json/");
      const locationInfoJSON = await locationdata.json();

      const fingerprintId = localStorage.getItem("fingerId");

      const finalDeviceInfo = {
        browser,
        os,
        fingerprintId,
        location: `${locationInfoJSON.city}, ${locationInfoJSON.region}`,
      };

      setDeviceInfo(finalDeviceInfo);
    };
    fetchDeviceInfo();
  }, []);

  const deviceIdentify = detectAndLogDevice();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userRegisterData = {
      clientid: decodedData?.clientId,
      sysname: decodedData?.systemName,
      deviceid: decodedData?.fingerPrintId,
      devicename: deviceIdentify.name,
      deviceos: deviceInfo.os,
      requestby: `${deviceName}-${counter}`,
      narration: `Device Name: ${deviceInfo.location}`,
    };
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRegisterData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);

      setIsModalOpen(true); // ✅ Show success modal
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const classNameInput = `w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all ${
    isLoading ? "bg-gray-100 cursor-not-allowed" : ""
  }`;
  const classNameButton = `w-full bg-gradient-to-r from-pink-400 to-pink-700 hover:bg-gradient-to-r from-pink-500 to-pink-800 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center min-h-[42px] ${
    isLoading ? "opacity-70 cursor-wait" : ""
  }`;

  return (
    <>
      <Header />
      <Suspense fallback={<p>Loading...</p>}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Device Registration
            </h2>

            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label
                  htmlFor="deviceName"
                  className="block px-1 text-md font-medium text-gray-700 mb-1"
                >
                  Device Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Enter Device Name"
                  required
                  className={classNameInput}
                  autoComplete="deviceName"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="counter"
                  className="block px-1 text-md font-medium text-gray-700 mb-1"
                >
                  Counter Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="counter"
                  value={counter}
                  onChange={(e) => setCounter(e.target.value)}
                  placeholder="Enter Counter Name"
                  required
                  className={classNameInput}
                  autoComplete="counter"
                />
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
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            router.push("/corporateId");
          }}
          heading="Success"
          message="Request sent successfully. Please wait while your request is being accepted. Once accepted, you will be able to access this application."
        />
      </Suspense>
    </>
  );
}

export default dynamic(() => Promise.resolve(RegisterPage), { ssr: false });
