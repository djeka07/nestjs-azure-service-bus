export const isEmpty = (obj: unknown): boolean =>
  !obj || Object.keys(obj).length === 0;

export const removeNullUndefined = (obj) =>
  Object.entries(obj).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {},
  );
