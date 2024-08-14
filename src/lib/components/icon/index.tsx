import type { IconProps } from "@chakra-ui/react";

import { CircleIcon } from "./CircleIcon";
import type { SvgIconKeys } from "./SvgIcon";
import { SvgIcon } from "./SvgIcon";

export * from "./SvgIcon";
export * from "./UploadIcon";

export type IconKeys = SvgIconKeys | "circle";

interface CustomIconProps extends IconProps {
  name: IconKeys;
  color?: string;
}

export const CustomIcon = ({ name, color }: CustomIconProps) => {
  if (name === "circle") {
    return <CircleIcon color={color} />;
  }

  return <SvgIcon name={name} color={color} />;
};
