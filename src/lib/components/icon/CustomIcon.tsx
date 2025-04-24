import type { IconProps } from "@chakra-ui/react";

import type { IconKeys } from "./types";

import { CircleIcon } from "./CircleIcon";
import { SvgIcon } from "./SvgIcon";

interface CustomIconProps extends IconProps {
  color?: string;
  name: IconKeys;
}

export const CustomIcon = ({ color, name, ...props }: CustomIconProps) => {
  if (name === "circle") {
    return <CircleIcon color={color} />;
  }

  return <SvgIcon color={color} name={name} {...props} />;
};
