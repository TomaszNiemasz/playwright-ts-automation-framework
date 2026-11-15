/** "$29.99" -> 2999. Working in cents avoids floating-point errors when summing prices. */
export function toCents(price: string): number {
  return Math.round(Number(price.replace(/[^0-9.]/g, '')) * 100);
}

/** 3998 -> "$39.98" */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
