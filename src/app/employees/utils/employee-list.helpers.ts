export function reindexArray(arr: { lineNumber: number }[]): void {
  arr.forEach((item, i) => (item.lineNumber = i + 1));
}
export function isNotExpired(dateStr: string): boolean {
  if (!dateStr) return true;
  return new Date(dateStr) >= new Date();
}

export function setSinglePrimary<
  T extends { isPrimaryAccount?: boolean; isPrimaryPosition?: boolean },
>(arr: T[], index: number, key: keyof T): void {
  arr.forEach((item, i) => ((item as any)[key] = i === index));
}
