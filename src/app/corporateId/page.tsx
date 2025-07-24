"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientLoginForm from "@/components/ClientLoginForm";
import useClientAuthentication from "@/hooks/useClientAuthentication";
import useFingerprint from "@/hooks/useFingerprint";
import useFetchToken from "@/hooks/useFetchToken";
import Modal from "@/components/ReusableModals/statusMsg";
import Header from "@/components/Header";

export type ClientDataProps = {
  DbServerName: string;
  DbName: string;
  ServerIp: string;
  LicenseUser: string;
  LicenseMobileUser: string;
  LicenseRateUser: string;
  LicenseSupportDate: string;
  LicenseExtraDays: string;
  ClientId: string;
  SysName: string;
};

export default function Page() {
  const [corporateId, setCorporateId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const router = useRouter();
  const fingerPrintId = useFingerprint();
  useFetchToken();

  const handleClientIdLogin = useClientAuthentication(
    corporateId,
    setError,
    router,
    fingerPrintId ?? null,
    setIsLoading,
    setShowAccessDenied
  );

  return (
    <>
      <Header />
      <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
        <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg md:flex-row md:flex-1 lg:max-w-screen-md">
          <ClientLoginForm
            corporateId={corporateId}
            setCorporateId={setCorporateId}
            error={error}
            onSubmit={handleClientIdLogin}
            isLoading={isLoading}
          />
        </div>

        <Modal
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          heading="Access is denied"
          message="You are not authorized. Kindly wait until you get authorized."
        />
      </div>
    </>
  );
}
