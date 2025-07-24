import React, { FC } from "react";
import Button from "./Button";

interface SubmitType {
  modalMessage: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onPrint?: () => void;
  onPreview?: () => void; // Add this prop
}
const SubmitModal: FC<SubmitType> = ({ modalMessage, setShowModal, onPrint, onPreview }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-white/10 dark:bg-white/10 backdrop-blur-sm" />
      <div className="relative lg:ml-64 bg-white z-30 border p-6 sm:p-8 rounded-xl shadow-2xl w-[90%] sm:w-[400px] text-center ">
        <p className="text-lg font-semibold text-black">{modalMessage}</p>
        <div className="flex flex-col mt-4 sm:flex-row justify-center gap-4 sm:gap-6">
          <Button
            variant="contained"
            className="bg-gradient-to-r from-yellow-400 to-yellow-700 !px-4 !py-1 !rounded-2xl"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          {onPreview && (
            <Button
              variant="contained"
              className="bg-gradient-to-r from-blue-400 to-blue-700 !px-4 !py-1 !rounded-2xl"
              onClick={onPreview}
            >
              Preview
            </Button>
          )}
          {onPrint && (
            <Button
              variant="contained"
              className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
              onClick={onPrint}
            >
              Print
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;