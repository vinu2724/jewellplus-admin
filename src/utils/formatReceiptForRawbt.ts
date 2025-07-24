import { OrderDetailType, OrderMainType } from "@/hooks/Order-Add";
import { SaleDetail, SaleMain } from "@/hooks/Sale-Add";
import { URDDetail, URDMain } from "@/hooks/URD_Add";
interface ItemType {
  item_Code: string;
  item_Name: string;
  item_Type: string;
}

//Sale
export function SaleRawBtFormat(
  main?: SaleMain,
  detail?: SaleDetail[],
  itemList?: ItemType[]
) {
  const lines: string[] = [];

  lines.push("       Jewellplus Admin");
  lines.push("      ---------------------");

  if (main?.Card_No) lines.push(`Card No: ${main.Card_No}`);
  if (main?.Name) lines.push(`Name: ${main.Name}`);
  if (main?.Dt) lines.push(`Date: ${main.Dt} ${main.Dt_Time}`);
  lines.push("------------------------------");

  detail?.forEach((item) => {
    const matchedItem = itemList?.find((i) => i.item_Code === item.Item_Code);
    const title = `${matchedItem?.item_Name || "Item"} ${item.Crt.toFixed(2)}K`;
    lines.push(`${title}`);
    lines.push(`${item.Narration || ""} ${item.Barcode || ""}`);
    lines.push(
      ` ${matchedItem?.item_Type || ""} Pcs:${
        item.Pcs
      } Wt:${item.Net_Wt.toFixed(2)} ₹${item.Rate.toFixed(2)}`
    );
    lines.push(`Amount: ₹${item.Amount.toFixed(2)}`);
    lines.push(`Making: ₹${item.Making_Amt.toFixed(2)}`);
    lines.push(`Other : ₹${item.Other_Charges.toFixed(2)}`);
    lines.push(`GST   : ₹${(item.Sgst_Amt + item.Cgst_Amt).toFixed(2)}`);
    const totalItem =
      item.Amount +
      item.Making_Amt +
      item.Other_Charges +
      item.Cgst_Amt +
      item.Sgst_Amt +
      item.Igst_Amt -
      item.Discount_Amt;
    lines.push(`Total : ₹${totalItem.toFixed(2)}`);
    lines.push("------------------------------");
  });

  const total =
    detail?.reduce(
      (sum, item) =>
        sum +
        (item.Amount +
          item.Making_Amt +
          item.Other_Charges +
          item.Cgst_Amt +
          item.Sgst_Amt +
          item.Igst_Amt -
          item.Discount_Amt),
      0
    ) ?? 0;

  lines.push(`NET TOTAL: ₹${total.toFixed(2)}`);
  lines.push("\n\nTHANK YOU!\n\n\n");

  return lines.join("\n");
}

//Order
export function OrderRawBtFormat(
  main?: OrderMainType,
  detail?: OrderDetailType[],
  itemList?: ItemType[]
) {
  const lines: string[] = [];

  lines.push("       Jewellplus Admin");
  lines.push("      ---------------------");

  if (main?.Card_No) lines.push(`Card No: ${main.Card_No}`);
  if (main?.Name) lines.push(`Name: ${main.Name}`);
  if (main?.Dt) lines.push(`Date: ${main.Dt} ${main.Dt_Time}`);
  lines.push("------------------------------");

  detail?.forEach((item) => {
    const matchedItem = itemList?.find((i) => i.item_Code === item.Item_Code);
    const title = `${matchedItem?.item_Name || "Item"} ${item.Crt.toFixed(2)}K`;
    lines.push(`${title}`);
    lines.push(`${item.Narration || ""} ${item.Barcode || ""}`);
    lines.push(
      ` ${matchedItem?.item_Type || ""} Pcs:${
        item.Pcs
      } Wt:${item.Net_Wt.toFixed(2)} ₹${item.Rate.toFixed(2)}`
    );
    lines.push(`Amount: ₹${item.Amount.toFixed(2)}`);
    lines.push(`Making: ₹${item.Making_Amt.toFixed(2)}`);
    lines.push(`Other : ₹${item.Other_Charges.toFixed(2)}`);
    lines.push(`GST   : ₹${(item.Sgst_Amt + item.Cgst_Amt).toFixed(2)}`);
    const totalItem =
      item.Amount +
      item.Making_Amt +
      item.Other_Charges +
      item.Cgst_Amt +
      item.Sgst_Amt +
      item.Igst_Amt -
      item.Discount_Amt;
    lines.push(`Total : ₹${totalItem.toFixed(2)}`);
    lines.push("------------------------------");
  });

  const total =
    detail?.reduce(
      (sum, item) =>
        sum +
        (item.Amount +
          item.Making_Amt +
          item.Other_Charges +
          item.Cgst_Amt +
          item.Sgst_Amt +
          item.Igst_Amt -
          item.Discount_Amt),
      0
    ) ?? 0;

  lines.push(`NET TOTAL: ₹${total.toFixed(2)}`);
  lines.push("\n\nTHANK YOU!\n\n\n");

  return lines.join("\n");
}

//URD
export function URDRawBtFormat(
  main?: URDMain,
  detail?: URDDetail[],
  itemList?: ItemType[]
) {
  const lines: string[] = [];

  lines.push("       Jewellplus Admin");
  lines.push("     ----------------------");

  if (main?.Card_No) lines.push(`Card No : ${main.Card_No}`);
  if (main?.Name) lines.push(`Name    : ${main.Name}`);
  if (main?.Dt && main?.Dt_Time)
    lines.push(`Date    : ${main.Dt} ${main.Dt_Time}`);
  lines.push("------------------------------");

  detail?.forEach((item) => {
    const matchedItem = itemList?.find((i) => i.item_Code === item.Item_Code);
    const itemName = matchedItem?.item_Name || "Item";
    const itemType = matchedItem?.item_Type || "";

    lines.push(`${itemName} ${item.Crt.toFixed(2)}K`);
    if (item.Narration) lines.push(`${item.Narration}`);

    lines.push(
      `${itemType} Pcs:${item.Pcs} Wt:${item.Net_Wt.toFixed(2)} ` +
        `Rate:${item.Rate.toFixed(2)}`
    );
    lines.push(`Amount : ₹${item.Amount.toFixed(2)}`);
    lines.push(`Diff   : ₹${Number(item.Diff_Amt).toFixed(2)}`);
    lines.push(`Total  : ₹${item.Amount.toFixed(2)}`);
    lines.push("------------------------------");
  });

  const total = detail?.reduce((sum, item) => sum + (item.Amount || 0), 0) ?? 0;

  lines.push(`NET TOTAL : ₹${total.toFixed(2)}`);
  lines.push("");
  lines.push("        THANK YOU !");
  lines.push("");

  return lines.join("\n");
}
