// TODO - Should return undefined
export const getFirstQueryParam = (
  param: string | string[] | undefined,
  fallback?: string
) => {
  if (typeof param === "string") {
    return param;
  }
  if (Array.isArray(param)) {
    return param[0];
  }
  return fallback || "";
};
