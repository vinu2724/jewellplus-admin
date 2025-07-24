export interface AccessItem {
  screen_name: string;
  action_name: string;
  action_flg: string;
}

export const hasScreenAccess = (
  accessData: AccessItem[] | undefined,
  screen: string,
  action: string
): boolean => {
  if (!Array.isArray(accessData)) return true;

  const match = accessData.find(
    (item) =>
      item.screen_name === screen && item.action_name.trim() === action.trim()
  );

  // ✅ Default to true if not found
  if (!match) return true;

  return match?.action_flg === "Y";
};
