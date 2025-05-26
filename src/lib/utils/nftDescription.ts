import { isValid } from "js-base64";

import { libDecode } from "./base64";

export const extractNftDescription = (description: string): string => {
  if (!isValid(description)) {
    return description;
  }

  const decoded = libDecode(description);
  try {
    const parsedJson = JSON.parse(decoded);
    return parsedJson.description || description;
  } catch {
    return description;
  }
};
