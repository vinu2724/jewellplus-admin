import { ClientDataProps } from "@/app/corporateId/page";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback } from "react";
import { useClient } from "@/context/ClientContext";

export default function useClientAuthentication(
  corporateId: string,
  setError: (value: string) => void,
  router: AppRouterInstance,
  fingerPrintId: string | null,
  setIsLoading: (value: boolean) => void,
  setShowAccessDenied: (value: boolean) => void
) {
  const { setClientData } = useClient();

  return useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/corporateId", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cId: corporateId }),
        });

        if (!response.ok) {
          setError("The ID is invalid, please try again");
          return;
        }

        const clientResponse = await response.json();
        console.log("corprate id data", clientResponse);

        if (clientResponse.success) {
          setClientData(clientResponse.data);
          const clientId = clientResponse.data.ClientId;
          const SysName = clientResponse.data.SysName;

          await fetchIsDeviceRegister(
            clientId,
            SysName,
            clientResponse.data,
            router,
            fingerPrintId,
            setShowAccessDenied
          );
        }
      } catch (error) {
        console.error(error);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [
      corporateId,
      setError,
      router,
      setClientData,
      fingerPrintId,
      setIsLoading,
      setShowAccessDenied,
    ]
  );
}

async function fetchIsDeviceRegister(
  clientId: string,
  SysName: string,
  clientData: ClientDataProps,
  router: AppRouterInstance,
  fingerPrintId: string | null,
  setShowAccessDenied: (value: boolean) => void
) {
  try {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, SysName, fingerPrintId }),
    });

    const deviceData = await response.json();

    if (deviceData.data.Device === "Y") {
      if (response.ok && deviceData.success) {
        navigateToLogin(
          router,
          clientId,
          clientData.DbServerName,
          clientData.DbName
        );
      } else {
        console.error("Error retrieving device data:", deviceData.message);
      }
    } else if (deviceData.data.Device === "N") {
      setShowAccessDenied(true); // 👈 Show modal instead of alert
    } else if (deviceData.data.Device === "") {
      navigateToRegister(router, clientId, clientData.SysName, fingerPrintId);
    }
  } catch (error) {
    console.error("Error occurred while fetching device data", error);
  }
}

function navigateToLogin(
  router: AppRouterInstance,
  clientId: string,
  dbServerName: string,
  dbName: string
) {
  const encodedData = encodeBase64({ clientId, dbServerName, dbName });
  router.push(`/login?data=${encodeURIComponent(encodedData)}`);
}

function navigateToRegister(
  router: AppRouterInstance,
  clientId: string,
  systemName: string,
  fingerPrintId: string | null
) {
  const encodedData = encodeBase64({ clientId, systemName, fingerPrintId });
  router.push(`/register?data=${encodeURIComponent(encodedData)}`);
}

interface EncodeDataProps {
  clientId: string;
  dbServerName?: string;
  dbName?: string;
  systemName?: string;
  fingerPrintId?: string | null;
}

function encodeBase64(data: EncodeDataProps): string {
  return Buffer.from(JSON.stringify(data))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
