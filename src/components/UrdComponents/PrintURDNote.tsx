import useItemList from "@/hooks/Item-List";
import { URDDetail, URDMain } from "@/hooks/URD_Add";
import React, { forwardRef } from "react";

interface PrintableURDNoteProps {
  main?: URDMain;
  detail?: URDDetail[];
}

const PrintableURDNote = forwardRef<HTMLDivElement, PrintableURDNoteProps>(
  ({ main, detail }, ref) => {
    // Calculate total amount
    const totalAmount =
      detail?.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0) ?? 0;
    // Item-List hooks Calling
    const { ItemdropDown } = useItemList();

    return (
      <div
        ref={ref}
        style={{
          width: "280px",
          padding: "8px",
          fontFamily: "monospace",
          fontSize: "10px",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          E S T I M A T E
        </div>
        <div
          style={{
            textAlign: "center",
            marginBottom: "4px",
            fontWeight: "bold",
          }}
        >
          {main?.Card_No}
        </div>
        <div style={{ marginBottom: "4px", fontWeight: "bold" }}>
          {main?.Name}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
            borderBottom: "1px solid #000",
            paddingBottom: "4px",
          }}
        >
          <div>{"Description"}</div>
          <div>
            {main?.Dt} {main?.Dt_Time}
          </div>
        </div>

        {/* Items */}
        {detail?.map((item, idx) => {
          const matchedItem = ItemdropDown?.find(
            (i) => i.item_Code === item.Item_Code
          );

          return (
            <div
              key={idx}
              style={{
                marginBottom: "6px",
                borderBottom: "1px dashed #000",
                paddingBottom: "4px",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {matchedItem?.item_Name} {item.Crt.toFixed(2) + "K"}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <div>{item.Narration}</div>
              </div>

              {/* Table */}
              <table
                style={{
                  width: "100%",
                  fontWeight: "normal",
                  marginBottom: "4px",
                }}
              >
                <thead>
                  <tr>
                    <td style={{ textAlign: "left" }}></td>
                    <td>Pcs</td>
                    <td>Wt./CT.</td>
                    <td>Rate</td>
                    <td style={{ textAlign: "right" }}>Amount</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      {matchedItem?.item_Type}
                    </td>
                    <td>{item.Pcs}</td>
                    <td>{item.Net_Wt.toFixed(2)}</td>
                    <td>{item.Rate.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>
                      {item.Amount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Charges */}
              <div
                style={{
                  width: "100%",
                  marginBottom: "4px",
                  textAlign: "right",
                  borderBottom: "1px solid #000",
                  paddingBottom: "2px",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    paddingBottom: "2px",
                  }}
                >
                  <div>Difference : {Number(item.Diff_Amt).toFixed(2)}</div>
                </div>
              </div>

              {/* Total */}
              <div
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  marginTop: "4px",
                }}
              >
                Total : {item.Amount.toFixed(2)}
              </div>
            </div>
          );
        })}

        {/* Net Total */}
        <div
          style={{
            borderTop: "1px solid #000",
            marginTop: "6px",
            paddingTop: "6px",
            textAlign: "right",
            fontWeight: "bold",
            fontSize: "11px",
          }}
        >
          Net Total : ₹{totalAmount.toFixed(2)}
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          THANK YOU !
        </div>
      </div>
    );
  }
);

PrintableURDNote.displayName = "PrintableURDNote";
export default PrintableURDNote;
