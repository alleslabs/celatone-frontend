import type { TooltipProps as ChakraTooltipProps } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip, useDisclosure } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface TooltipProps extends ChakraTooltipProps {
  disableClickCapture?: boolean;
}

export const Tooltip = ({
  placement = "top",
  children,
  disableClickCapture = false,
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
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: "fit-content",
        }}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        onClickCapture={disableClickCapture ? undefined : onToggle}
      >
        {children}
      </span>
    </ChakraTooltip>
  );
};

interface TooltipInfoProps extends Omit<TooltipProps, "children"> {
  iconVariant?: "default" | "solid";
}

export const TooltipInfo = (props: TooltipInfoProps) => (
  <Tooltip {...props}>
    <CustomIcon
      color="gray.600"
      name="info-circle"
      boxSize={3}
      m={0}
      cursor="pointer"
      onClick={(e) => e.stopPropagation()}
    />
  </Tooltip>
);
