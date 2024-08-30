import type { IconProps } from "@chakra-ui/react";

import { CircleIcon } from "./CircleIcon";
import { SvgIcon } from "./SvgIcon";
import type { IconKeys } from "./types";

interface CustomIconProps extends IconProps {
  name: IconKeys;
  color?: string;
}

export const CustomIcon = ({ name, color, ...props }: CustomIconProps) => {
  if (name === "circle") {
    return <CircleIcon color={color} />;
  }

  return <SvgIcon name={name} color={color} {...props} />;
};
