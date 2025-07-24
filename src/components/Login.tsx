"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

import CryptoJS from "crypto-js";
import { useAccess } from "@/context/UserAccess";
import Header from "./Header";

type LoginProps = {
  username: string;
  setUsername: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
};

type DecodedData = {
  clientId: string;
  dbServerName: string;
  dbName: string;
};

export default function Login({
  username,
  setUsername,
  password,
  setPassword,
}: LoginProps) {
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUserData } = useUser();
  const { setAccessData } = useAccess();

  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!decodedData) {
      setErrorMessage(
        "Login configuration error. Please try again or contact support."
      );
      setIsLoading(false);
      return;
    }

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        secretKey!
      ).toString();

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          db: `${decodedData.dbServerName}#${decodedData.dbName}`,
          id: username,
          password: encryptedPassword,
          deviceId: decodedData.clientId,
        }),
      });

      const data = await response.json();

      if (data.data && data.data.username) {
        setUserData(data.data);

        // ✅ Call user-access API
        const accessRes = await fetch("/api/user-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            db: `${decodedData.dbServerName}#${decodedData.dbName}`,
            user_id: `${data.data.user_id}`,
          }),
        });

        const accessData = await accessRes.json();

        const AccessData = JSON.parse(accessData.data);

        if (accessData.success) {
          setAccessData(AccessData);
          // Optionally store accessData.data in context or local state
        } else {
          console.warn("User Access Failed:", accessData.message);
        }

        router.push("/customerprofiles");
      } else {
        setErrorMessage(
          data.message || "User not found or invalid credentials."
        );
      }
    } catch (error) {
      console.error("Login request failed:", error);
      setErrorMessage("An error occurred during login. Please try again.");
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            USER LOGIN
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block px-1 text-md font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={classNameInput}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block px-1 text-md font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={classNameInput}
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errorMessage && (
                <div className="mt-2 text-red-500 text-center">
                  {errorMessage}
                </div>
              )}
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
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
