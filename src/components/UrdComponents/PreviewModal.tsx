import React from "react";
import { URDDetail, URDMain } from "@/hooks/URD_Add";
import PrintableURDNote from "./PrintURDNote";
import Button from "@/utils/Button";

interface PreviewModalProps {
  main?: URDMain;
  detail?: URDDetail[];
  onPrint: () => void;
  onCancel: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  main,
  detail,
  onPrint,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-white/10 dark:bg-white/10 backdrop-blur-sm" />
      <div className="relative bg-white z-30 border p-4 sm:p-8 rounded-xl shadow-2xl w-[95%] max-w-md flex flex-col">
        {/* Make this div scrollable */}
        <div className="mb-4 w-full flex-1 flex flex-col items-center overflow-auto max-h-[70vh]">
          <PrintableURDNote main={main} detail={detail} />
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="contained"
            className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 !rounded-2xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="bg-gradient-to-r from-green-400 to-green-700 !px-4 !py-1 !rounded-2xl"
            onClick={onPrint}
          >
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
