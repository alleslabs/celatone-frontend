import type { TooltipProps } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip } from "@chakra-ui/react";

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
    <div style={{ cursor: "pointer" }}>
      <CustomIcon
        name={iconVariant === "solid" ? "info-circle-solid" : "info-circle"}
        boxSize={3}
        m={0}
      />
    </div>
  </Tooltip>
);
