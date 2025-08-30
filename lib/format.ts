export const compactNumber = (n: number): string => {
  try {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`;
    if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
    return String(n);
  }
};
