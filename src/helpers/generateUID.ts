/**
 * Generate UID
 * @returns {string}
 */
export function generateUID() {
  const timestamp = performance.now().toString(36);
  const random = Math.random().toString(36).slice(2, 15);

  return timestamp + random;
}
