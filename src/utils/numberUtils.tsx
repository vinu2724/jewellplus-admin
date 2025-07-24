/**
 * Formats a number to a specified number of decimal places.
 * @param value - The number to format.
 * @param decimals - The number of decimal places (default is 2).
 * @returns The formatted number as a string.
 */
export function formatToDecimal(value: number | string, decimals: number = 2): string {
  const numberValue = parseFloat(value as string) || 0; // Ensure the value is a valid number
  return numberValue.toFixed(decimals);
}