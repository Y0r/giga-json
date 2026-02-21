/**
 * Reorders an element in an array by moving it from a specified old index to a new index.
 * Handles negative indices and adjusts the array's size if the new index exceeds its length.
 *
 * @param array - The array to be modified.
 * @param old_index - The current index of the element to be moved. Supports negative indices.
 * @param new_index - The target index where the element should be moved. Supports negative indices.
 * @returns The modified array with the element rearranged to the new index.
 *
 * @see https://stackoverflow.com/a/5306832
 */
export const arrayReorder = <T>(
  array: T[],
  old_index: number,
  new_index: number,
): T[] => {
  // Resolve negative indices from the end of the array.
  while (old_index < 0) {
    old_index += array.length;
  }
  while (new_index < 0) {
    new_index += array.length;
  }

  if (new_index >= array.length) {
    let k = new_index - array.length + 1;
    while (k--) {
      array.push(undefined as T);
    }
  }

  array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  return array;
};
