export function stepGalleryIndex(index: number, delta: number, count: number): number {
  if (
    !Number.isInteger(index) ||
    !Number.isInteger(delta) ||
    !Number.isInteger(count) ||
    count < 1
  ) {
    return -1;
  }
  return (((index + delta) % count) + count) % count;
}
