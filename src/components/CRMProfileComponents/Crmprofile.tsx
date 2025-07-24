"use client";
import { useEffect, useState } from "react";
import useCRMList, { Customer } from "../../hooks/CRM-List";
import useDeleteCRM from "../../hooks/Delete-CRM";
import { useRouter } from "next/navigation";
import DeleteModal from "@/utils/DeleteModal";
import Feedback from "@/utils/Alert";
import { FaPen, FaTrash } from "react-icons/fa";
import LogoutConfirmation from "@/utils/LogoutConfirmation";
import { useLogout } from "@/utils/logout";
import { useAccessControl } from "@/hooks/useAccessControl";
import Button from "@/utils/Button";

const CrmProfile = () => {
  const { canCustom } = useAccessControl("w_customer_master");

  const [searchQuery, setSearchQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const router = useRouter();
  const { logout } = useLogout();
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const { customers, error, fetchCustomers } = useCRMList();

  // ✅ Fetch only once on date change (not on every render)
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const { deleteCrmById } = useDeleteCRM();

  const handleEdit = (code: string) => {
    router.push(`/manage-crm?code=${code}`);
  };

  const handleDeleteClick = (code: string) => {
    console.log("handleDeleteClick triggered for code:", code);
    setConfirmId(code);
  };
  const confirmDelete = async () => {
    if (confirmId) {
      await deleteCrmById(confirmId);
      setMessage("Customer deleted.");
      setTitle("success");
      setTimeout(() => setMessage(null), 3000);
      setConfirmId(null);
      setSearchQuery("");
      fetchCustomers();
    }
  };

  const cancelDelete = () => {
    setConfirmId(null);
  };
  // Detect back navigation and show logout confirmation modal
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setIsLogoutModalOpen(true);
      // Push the current state again to prevent navigation
      window.history.pushState(null, document.title, window.location.href);
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white p-6  shadow-md mt-16 rounded-lg max-w-full mx-auto">
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          CRM DASHBOARD
        </h1>

        <div className="flex flex-col sm:flex-row justify-end items-center mb-6 sm:mb-8">
          <Button
            variant="contained"
            size="large"
            className="bg-gradient-to-r from-sky-400 to-sky-700 !px-4 !py-1 !rounded-2xl"
            onClick={() => router.push("/manage-crm")}
            disabled={!canCustom("Add")}
          >
            Add CRM
          </Button>
        </div>
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search by Code, Name, or Address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-black block w-full h-12 border border-gray-300 rounded-xl px-4 sm:px-5 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Table */}
        {error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : searchQuery.trim() === "" ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Please enter a search query to display customers.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                <tr>
                  <th className="px-4 sm:px-6 py-2 sm:py-4 text-center">
                    Code
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-4 text-left">Name</th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-left">
                    Address
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers
                  .filter((customer: Customer) => {
                    const query = searchQuery.toLowerCase();
                    return (
                      customer.code.toString().includes(query) ||
                      customer.name.toLowerCase().includes(query) ||
                      (customer.address?.toLowerCase().includes(query) ?? false)
                    );
                  })
                  .map((customer: Customer) => (
                    <tr
                      key={customer.code}
                      className="bg-white hover:bg-gray-50 text-gray-800 border-t"
                    >
                      <td className="px-4 sm:px-6 py-2 sm:py-4 text-center">
                        {customer.code}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4">
                        {customer.name}
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-2 sm:py-4">
                        {customer.address}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 text-center">
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="contained"
                            className="bg-gradient-to-r from-sky-500 to-sky-800   !font-medium"
                            onClick={() => handleEdit(String(customer.code))}
                            disabled={!canCustom("Modify")}
                          >
                            <FaPen />
                          </Button>

                          <Button
                            variant="contained"
                            className="bg-gradient-to-r from-red-500 to-red-800"
                            onClick={() =>
                              handleDeleteClick(String(customer.code))
                            }
                            disabled={!canCustom("Delete")}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {/* Show message if no customers match */}
                {customers.filter((customer: Customer) => {
                  const query = searchQuery.toLowerCase();
                  return (
                    customer.code.toString().includes(query) ||
                    customer.name.toLowerCase().includes(query) ||
                    (customer.address?.toLowerCase().includes(query) ?? false)
                  );
                }).length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-500 text-sm"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmId && (
        <>
          <DeleteModal
            isDate={formattedDate}
            isCard_No={confirmId}
            confirmDelete={confirmDelete}
            cancelDelete={cancelDelete}
          />
        </>
      )}
      {/* Alert Message */}
      {message && (
        <Feedback
          title={title as "success" | "error" | "warning" | "info"}
          message={message}
        />
      )}
      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        open={isLogoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
};

export default CrmProfile;
