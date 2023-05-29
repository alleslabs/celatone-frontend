import type { TooltipProps } from "@chakra-ui/react";
import { Flex, Tooltip as ChakraTooltip } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

export const Tooltip = ({
  placement = "top",
  ...tooltipProps
}: TooltipProps) => (
  <ChakraTooltip
    hasArrow
    placement={placement}
    arrowSize={8}
    {...tooltipProps}
  />
);

interface TooltipInfoProps extends Omit<TooltipProps, "children"> {
  iconVariant?: "default" | "solid";
}

export const TooltipInfo = ({
  iconVariant = "default",
  ...tooltipProps
}: TooltipInfoProps) => (
  <Tooltip {...tooltipProps}>
    <Flex cursor="pointer">
      <CustomIcon
        color="pebble.600"
        name={iconVariant === "solid" ? "info-circle-solid" : "info-circle"}
        boxSize="12px"
        m={0}
      />
    </Flex>
  </Tooltip>
);
