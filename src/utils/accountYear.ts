// utils/accountYear.ts or UI/accountYear.ts

// Get current financial year string, e.g. "2024-2025"
export function getCurrentAccountYear(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}-${endYear}`;
}

// Return date range for an account year
export function getAccountYearRange(acYear: string): { from: string; to: string } {
  const [start, end] = acYear.split('-');
  return {
    from: `${start}-04-01`,
    to: `${end}-03-31`,
  };
}

// Generate list of last N financial years (including current)
export function getAccountYearOptions(count = 5): string[] {
  const current = getCurrentAccountYear();
  const currentStart = parseInt(current.split('-')[0]);

  const options: string[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const start = currentStart - i;
    const end = start + 1;
    options.push(`${start}-${end}`);
  }

  return options;
}
