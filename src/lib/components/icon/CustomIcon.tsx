import type { IconProps } from "@chakra-ui/react";

import { CircleIcon } from "./CircleIcon";
import { SvgIcon } from "./SvgIcon";
import type { IconKeys } from "./types";

interface CustomIconProps extends IconProps {
  color?: string;
  name: IconKeys;
}

export const CustomIcon = ({ color, name, ...props }: CustomIconProps) => {
  if (name === "circle") {
    return <CircleIcon color={color} />;
  }

  return <SvgIcon name={name} color={color} {...props} />;
};
