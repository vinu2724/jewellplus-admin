// Not in Used
import { SaleDetail, SaleMain } from "@/hooks/Sale-Add";
import React, { forwardRef } from "react";

interface PrintableSaleNoteProps {
  main?: SaleMain;
  detail?: SaleDetail[];
}

const PrintableSaleNote = forwardRef<HTMLDivElement, PrintableSaleNoteProps>(
  ({ main, detail }, ref) => {
    // Calculate total amount
    const totalAmount =
      detail?.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0) ?? 0;
    return (
      <div
        ref={ref}
        style={{
          width: "280px", // ~72mm
          padding: "8px",
          fontFamily: "monospace",
          fontSize: "10px",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          *** ESTIMATE ***
        </div>
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          #{main?.Card_No}
        </div>
        <div style={{ textAlign: "center", marginBottom: "6px" }}>
          Date: {new Date().toLocaleString()}
        </div>

        {detail?.map((item, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px dashed #000",
              paddingBottom: "4px",
              marginBottom: "4px",
            }}
          >
            <div>
              <strong>
                {index + 1}. {item.Item_Code}
              </strong>
            </div>
            <div>Barcode: {item.Barcode}</div>
            <div>
              Wt: {item.Net_Wt} | Crt: {item.Crt}
            </div>
            <div>Rate: ₹{item.Rate}</div>
            <div>Other: ₹{item.Other_Charges}</div>
            <div>Making: ₹{item.Making}</div>
            <div>GST: ₹{item.Sgst_Amt + item.Cgst_Amt}</div>
            <div>
              <strong>Amt: ₹{item.Amount}</strong>
            </div>
          </div>
        ))}

        <div
          style={{
            borderTop: "1px dashed #000",
            paddingTop: "6px",
            textAlign: "right",
          }}
        >
          <strong>Total: ₹{totalAmount}</strong>
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>Thank you!</div>
      </div>
    );
  }
);

PrintableSaleNote.displayName = "PrintableSaleNote";

export default PrintableSaleNote;
