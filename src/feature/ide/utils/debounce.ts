/**
 * Debounce function.
 *
 * @param {Function} callback - The function to debounce.
 * @param {number} timeout - The debounce timeout in milliseconds.
 */
const debounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  timeout: number = 300,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};

export default debounce;
