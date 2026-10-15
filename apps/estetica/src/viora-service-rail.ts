// Geometry owns overflow and navigation; service count alone does not imply overflow.
export function railScrollState(left: number, width: number, total: number) {
  const max = Math.max(0, total - width);
  return { overflow: max > 2, previous: left > 2, next: left < max - 2 };
}
export function railTargetOffset(
  left: number,
  width: number,
  offsets: readonly number[],
  direction: -1 | 1,
): number {
  if (!offsets.length) return 0;
  if (direction > 0)
    return offsets.find((offset) => offset >= left + width - 2) ?? offsets[offsets.length - 1];
  const target = Math.max(0, left - width);
  return [...offsets].reverse().find((offset) => offset <= target + 2) ?? 0;
}
