export const isEmpty = (obj: unknown): boolean =>
  !obj || Object.keys(obj).length === 0;
