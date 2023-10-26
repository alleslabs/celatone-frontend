import { FIXED_POINT_TYPES } from "../constants";

export const getHelperText = (type: string) => {
  if (FIXED_POINT_TYPES.includes(type))
    return "Input might be altered due to fixed point behavior";
  return undefined;
};
