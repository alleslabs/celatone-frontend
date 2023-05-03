import type { TooltipProps } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";

export const TooltipComponent = ({
  placement,
  ...tooltipProps
}: TooltipProps) => (
  <Tooltip
    hasArrow
    placement={placement ?? "top"}
    arrowSize={8}
    {...tooltipProps}
  />
);
