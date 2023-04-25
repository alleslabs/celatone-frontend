import type { TooltipProps } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

export const TooltipComponent = ({
  placement,
  ...tooltipProps
}: TooltipProps) => (
  <Tooltip
    hasArrow
    placement={placement ?? "top"}
    bg="honeydew.darker"
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
  <TooltipComponent {...tooltipProps}>
    <div style={{ cursor: "pointer" }}>
      <CustomIcon
        name={iconVariant === "solid" ? "info-circle-solid" : "info-circle"}
        boxSize={3}
        m={0}
      />
    </div>
  </TooltipComponent>
);
