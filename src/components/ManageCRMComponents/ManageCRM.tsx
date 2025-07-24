"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import useCRMAdd from "@/hooks/Add-CRM";
import { useUser } from "@/context/UserContext";
import CRMBody from "./ManageCRMBody";
import useGetCustomerDetails from "@/hooks/Get-CRM-Details";

import SubmitModal from "@/utils/SubmitModal";

import useUpdateCRM from "@/hooks/CRM-Update";
import Feedback from "@/utils/Alert";
import { useAccessControl } from "@/hooks/useAccessControl";
import Button from "@/utils/Button";

export interface NewCRM {
  Code: number;
  Prefix: string;
  Name: string;
  Sex: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Area: string | null;
  City: string;
  Pincode: string;
  Telephone1: string | null;
  Telephone2: string | null;
  Telephone3: string | null;
  Mobile: string;
  Mobile_Flg: string;
  Birthday: string;
  Anniversary: string;
  Occupation: string | null;
  Category: string | null;
  Email: string;
  Email_Flg: string;
  Narration: string | null;
  Refrence_By: string | null;
  Mail_Flg: string;
  Firm_Cd: string;
  Ac_Year: string;
  User_Cd: string | null;
  Ac_Dt: string;
  Ac_Group: string;
  Ac_Sub_Group: string | null;
  Ac_Entered_By: string | null;
  Ac_Code: string;
  Last_Sale: string;
  Locality: string | null;
  Education: string | null;
  Know_About_Us: string | null;
  Purchase_Reason: string | null;
  Why_Choose_Us: string | null;
  Mflg: string;
  Loyalti_Code: string;
  User_Id: string;
  Ac_Entered_By_Id: number | null;
  Ac_Pan_No: string;
  Kyc_No: string;
}

//initially card blank value
const initialCRMData: NewCRM = {
  Code: 0,
  Prefix: "Mr.",
  Name: "",
  Sex: "M",
  Address1: "",
  Address2: "",
  Address3: "",
  Area: null,
  City: "",
  Pincode: "",
  Telephone1: null,
  Telephone2: null,
  Telephone3: null,
  Mobile: "",
  Mobile_Flg: "N",
  Birthday: new Date().toISOString().split("T")[0],
  Anniversary: new Date().toISOString().split("T")[0],
  Occupation: "",
  Category: null,
  Email: "",
  Email_Flg: "N",
  Narration: null,
  Refrence_By: null,
  Mail_Flg: "Y",
  Firm_Cd: "",
  Ac_Year: "",
  User_Cd: null,
  Ac_Dt: new Date().toISOString().split("T")[0],
  Ac_Group: "CUSTOMER",
  Ac_Sub_Group: null,
  Ac_Entered_By: "",
  Ac_Code: "",
  Last_Sale: new Date().toISOString().split("T")[0],
  Locality: null,
  Education: "",
  Know_About_Us: "",
  Purchase_Reason: "",
  Why_Choose_Us: "",
  Mflg: "N",
  Loyalti_Code: "",
  User_Id: "",
  Ac_Entered_By_Id: null,
  Ac_Pan_No: "",
  Kyc_No: "",
};

// --- Date Utility Functions ---

/**
 * Formats a date string (YYYY-MM-DD) to the backend's expected format (YYYY-MM-DDTHH:mm:ss).
 * Defaults to "1900-01-01T00:00:00" if the input is invalid or empty.
 */
const formatDateForBackend = (
  dateString: string | null | undefined
): string => {
  if (dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return `${dateString}T00:00:00`;
  }
  return "1900-01-01T00:00:00";
};

/**
 * Formats a date string from the backend (YYYY-MM-DDTHH:mm:ss) to YYYY-MM-DD for input fields.
 */
const formatDateForInput = (
  isoDateString: string | null | undefined
): string => {
  if (isoDateString && isoDateString.includes("T")) {
    return isoDateString.split("T")[0];
  }
  return isoDateString || ""; // Return as is if not in expected ISO format or empty
};

const ManageCRM: React.FC = () => {
  const { canCustom } = useAccessControl("w_customer_master");
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const { userData } = useUser();
  const { updateCRM } = useUpdateCRM(); // Instantiate the update hook

  //const [isCode, setIsCode] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const isParamcode = searchParams.get("code");
  // const isEditMode = Boolean(isParamcode);
  const router = useRouter();
  // Set user info in initialCRMData
  useEffect(() => {
    if (userData) {
      setCRMData((prev) => {
        // Only update if values are different to avoid unnecessary renders
        if (
          prev.User_Id === `${userData.user_id},` &&
          prev.Firm_Cd === userData.firm_cd &&
          prev.Ac_Year === userData.yearname &&
          prev.Ac_Entered_By === userData.user_id &&
          prev.Ac_Entered_By_Id === Number(userData.user_id)
        ) {
          return prev;
        }
        return {
          ...prev,
          User_Id: `${userData.user_id},`,
          Firm_Cd: userData.firm_cd,
          Ac_Year: userData.yearname,
          Ac_Entered_By: userData.user_id,
          Ac_Entered_By_Id: Number(userData.user_id),
        };
      });
    }
  }, [userData]);

  const [CRMData, setCRMData] = useState<NewCRM>(initialCRMData);
  const [errors, setErrors] = useState({
    Name: "",
    Mobile: "",
    Email: "",
    Pincode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Fields you want to convert to uppercase
    const fieldsToUppercase = [
      "Name",
      "Address1",
      "Address2",
      "Address3",
      "Area",
      "City",
      "Locality",
    ];

    const updatedValue = fieldsToUppercase.includes(name)
      ? value.toUpperCase()
      : value;

    setCRMData((prev) => ({ ...prev, [name]: updatedValue }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle Mobile Input Change
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length <= 10) {
      setCRMData((prev) => ({ ...prev, Mobile: value }));

      // Validate if the mobile number is exactly 10 digits
      if (value.length === 10 || value.length === 0) {
        setErrors((prev) => ({ ...prev, Mobile: "" })); // Clear error if valid
      } else {
        setErrors((prev) => ({
          ...prev,
          Mobile: "Mobile number must be 10 digits",
        }));
      }
    }
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    setCRMData((prev) => ({ ...prev, Email: value }));

    // Validate email format
    if (!emailPattern.test(value)) {
      setErrors((prev) => ({ ...prev, Email: "Invalid email format" }));
    } else {
      setErrors((prev) => ({ ...prev, Email: "" }));
    }
  };

  //Handle Pincode Change
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 6) {
      setCRMData((prev) => ({ ...prev, Pincode: value }));
      // Validate if the mobile number is exactly 10 digits
      if (value.length === 6 || value.length === 0) {
        setErrors((prev) => ({ ...prev, Pincode: "" })); // Clear error if valid
      } else {
        setErrors((prev) => ({
          ...prev,
          Pincode: "Pincode must be 6 digits",
        }));
      }
    }
  };
  const handleMultipleOptionChange = (field: string, value: string) => {
    if (
      field === "Know_About_Us" ||
      field === "Purchase_Reason" ||
      field === "Why_Choose_Us" ||
      field === "Ac_Group"
    ) {
      // Split the current value by comma and filter out empty strings
      const currentValues = (CRMData[field] || "")
        .split(",")
        .filter((v) => v.trim() !== ""); // Filter out empty strings

      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      setCRMData((prev) => ({
        ...prev,
        [field]: updatedValues.join(","),
      }));

      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  //const [newCRMData, setNewCRMData] = useState<NewCRM | null>(null);
  // const [finalCode, setFinalCode] = useState(0);

  // Fetch customer details for edit
  const { CRMDetail } = useGetCustomerDetails(isParamcode || "");
  // console.log("CRMDetail for edit:", CRMDetail); // Safer logging if needed

  useEffect(() => {
    // Only populate from CRMDetail if in edit mode (isParamcode is true)
    // and CRMDetail has been fetched, contains data, and the first item is valid.
    if (isParamcode && CRMDetail && CRMDetail.length > 0 && CRMDetail[0]) {
      const customerDetails = CRMDetail[0];
      setCRMData((prevCRMData) => ({
        ...prevCRMData,
        ...customerDetails,
        // Ensure dates from backend are formatted for input fields
        Birthday: formatDateForInput(customerDetails.Birthday),
        Anniversary: formatDateForInput(customerDetails.Anniversary),
      }));
    }
    // No 'else' block needed here, as initialCRMData and the userData useEffect
    // handle the state for new CRM entries or when not in edit mode.
  }, [CRMDetail, isParamcode]); // Add isParamcode to ensure effect re-evaluates if mode changes

  const { addCRM } = useCRMAdd();
  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    setModalMessage(""); // Clear previous messages

    const newErrors = {
      Name: (CRMData.Name || "").trim() ? "" : "Name is required.",
      Mobile: (CRMData.Mobile || "").trim() ? "" : "Mobile number is required.",
      Pincode: (CRMData.Pincode || "").trim() ? "" : "Pincode is required.",
      Email: errors.Email, // Preserve existing email error or re-validate if needed
    };
    setErrors(newErrors);

    if (
      newErrors.Name ||
      newErrors.Mobile ||
      newErrors.Pincode ||
      newErrors.Email
    ) {
      setModalMessage("Please correct the errors in the form.");
      setShowModal(true);
      // No need for setTimeout here if modal has its own close logic or user closes it.
      setIsLoading(false);
      return;
    }

    try {
      const NewCRMDataToSend = {
        ...CRMData,
        Birthday: formatDateForBackend(CRMData.Birthday),
        Anniversary: formatDateForBackend(CRMData.Anniversary),
      };
      const response = await addCRM(NewCRMDataToSend);
      if (response && response.Code) {
        setModalMessage(
          `Customer Added Successfully With Code: ${response.Code}`
        );
        setShowModal(true);
        // Reset form preserving user-specific data and initial date values
        setCRMData((prev) => ({
          ...initialCRMData,
          User_Id: prev.User_Id,
          Firm_Cd: prev.Firm_Cd,
          Ac_Year: prev.Ac_Year,
          Ac_Entered_By: prev.Ac_Entered_By,
          Ac_Entered_By_Id: prev.Ac_Entered_By_Id,
        }));
      } else {
        setModalMessage("Failed to add customer. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error submitting CRM data:", error);
      setModalMessage(
        "An unexpected error occurred while adding the customer."
      );
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Update handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    setModalMessage(""); // Clear previous messages

    const newErrors = {
      Name: (CRMData.Name || "").trim() ? "" : "Name is required.",
      Mobile: (CRMData.Mobile || "").trim() ? "" : "Mobile number is required.",
      Pincode: (CRMData.Pincode || "").trim() ? "" : "Pincode is required.",
      Email: errors.Email, // Preserve existing email error or re-validate
    };

    // Re-validate email
    if ((CRMData.Email || "").trim()) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(CRMData.Email)) {
        newErrors.Email = "Invalid email format";
      } else {
        newErrors.Email = ""; // Clear if valid
      }
    } else {
      newErrors.Email = ""; // Email is not mandatory, so clear error if empty
    }

    setErrors(newErrors);

    if (
      newErrors.Name ||
      newErrors.Mobile ||
      newErrors.Pincode ||
      newErrors.Email
    ) {
      setModalMessage("Please correct the errors in the form.");
      setShowModal(true);
      // No need for setTimeout here if modal has its own close logic or user closes it.
      setIsLoading(false);
      return;
    }

    if (!isParamcode) {
      console.error("Update attempted without a CRM code.");
      setModalMessage("Error: Cannot update customer. Code is missing.");
      setShowModal(true);
      setIsLoading(false);
      return;
    }
    try {
      const dataToUpdate: NewCRM = {
        ...CRMData,
        Code: Number(isParamcode),
        Birthday: formatDateForBackend(CRMData.Birthday),
        Anniversary: formatDateForBackend(CRMData.Anniversary),
      };

      const response = await updateCRM(isParamcode, dataToUpdate);
      if (response && response["Update Recode"] === 1) {
        setMessage(`Customer Updated Successfully With Code: ${isParamcode}`);
        setTitle("success");
        setTimeout(() => setMessage(null), 3000);

        router.push("/customerprofiles"); // Consider if navigation is desired immediately or after modal close
      } else {
        setModalMessage("Failed to update customer. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error updating CRM data:", error);
      setModalMessage(
        "An unexpected error occurred while updating the customer."
      );
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCRMData((prev) => ({
      ...initialCRMData,
      User_Id: prev.User_Id,
      Firm_Cd: prev.Firm_Cd,
      Ac_Year: prev.Ac_Year,
      Ac_Entered_By: prev.Ac_Entered_By,
      Ac_Entered_By_Id: prev.Ac_Entered_By_Id,
    }));
    router.push("/manage-crm"); // Consider if navigation is desired immediately or after modal close
  };

  // --- Modal/Feedback ---
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
        <div className="bg-white p-6 shadow-md mt-16 rounded-lg max-w-full mx-auto">
          <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
            CUSTOMER RESOURCE MANAGEMENT
          </h1>
          <CRMBody
            CRMData={CRMData}
            setCRMData={setCRMData}
            errors={errors}
            handleChange={handleChange}
            handleMobileChange={handleMobileChange}
            handleEmailChange={handleEmailChange}
            handlePincodeChange={handlePincodeChange}
            handleMultipleOptionChange={handleMultipleOptionChange}
          />
          <div className="mt-6 flex justify-center gap-8">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 !rounded-2xl"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {!isParamcode && (
              <Button
                variant="contained"
                className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
                onClick={handleSubmit}
                disabled={!canCustom("Save") || !canCustom("Add") || isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
            {isParamcode && (
              <Button
                variant="contained"
                className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
                onClick={handleUpdate}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {showModal && modalMessage && (
        <SubmitModal modalMessage={modalMessage} setShowModal={setShowModal} />
      )}
      {/* Feedback Message */}
      {/* Alert Message */}
      {message && (
        <Feedback
          title={title as "success" | "error" | "warning" | "info"}
          message={message}
        />
      )}
    </>
  );
};

export default ManageCRM;
