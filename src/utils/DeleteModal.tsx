import React, { FC } from "react";
import Button from "./Button";

interface DeleteType {
  isDate: string;
  isCard_No: string;
  confirmDelete: () => void;
  cancelDelete: () => void;
}
const DeleteModal: FC<DeleteType> = ({
  isDate,
  isCard_No,
  confirmDelete,
  cancelDelete,
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-white/10 dark:bg-white/10 backdrop-blur-sm" />
      <div className="relative lg:ml-64 bg-white z-30 border border-gray-800  p-6 sm:p-8 rounded-xl shadow-2xl w-[90%] sm:w-[400px] text-center ">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 font-bold mb-6">
          Date: {isDate}, No: {isCard_No}
        </p>
        <p className="text-gray-600  font-bold mb-6">
          Are you sure to delete this record?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button
            variant="contained"
            className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 !rounded-2xl"
            onClick={confirmDelete}
          >
            Yes, Delete
          </Button>
          <Button
            variant="contained"
            className="bg-gradient-to-r from-gray-400 to-gray-700 !px-4 !py-1 !rounded-2xl"
            onClick={cancelDelete}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
