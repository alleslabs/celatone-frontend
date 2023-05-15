import type { TooltipProps } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip } from "@chakra-ui/react";

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
