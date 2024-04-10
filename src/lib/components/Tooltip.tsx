import type { TooltipProps } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip, useDisclosure } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

export const Tooltip = ({
  placement = "top",
  children,
  ...tooltipProps
}: TooltipProps) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <ChakraTooltip
      hasArrow
      placement={placement}
      arrowSize={8}
      isOpen={isOpen}
      {...tooltipProps}
    >
      <span
        style={{ display: "flex", alignItems: "center" }}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        onClickCapture={onToggle}
      >
        {children}
      </span>
    </ChakraTooltip>
  );
};

interface TooltipInfoProps extends Omit<TooltipProps, "children"> {
  iconVariant?: "default" | "solid";
}

export const TooltipInfo = ({
  iconVariant = "default",
  ...tooltipProps
}: TooltipInfoProps) => (
  <Tooltip {...tooltipProps}>
    <CustomIcon
      color="gray.600"
      name={iconVariant === "solid" ? "info-circle-solid" : "info-circle"}
      boxSize={3}
      m={0}
      cursor="pointer"
      onClick={(e) => e.stopPropagation()}
    />
  </Tooltip>
);
