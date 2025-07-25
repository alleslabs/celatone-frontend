import type { TooltipProps as ChakraTooltipProps } from "@chakra-ui/react";

import { Tooltip as ChakraTooltip, useDisclosure } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface TooltipProps extends ChakraTooltipProps {
  disableClickCapture?: boolean;
}

export const Tooltip = ({
  children,
  disableClickCapture = false,
  placement = "top",
  ...tooltipProps
}: TooltipProps) => {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();
  return (
    <ChakraTooltip
      arrowSize={8}
      background="gray.700"
      hasArrow
      isOpen={isOpen}
      placement={placement}
      {...tooltipProps}
    >
      <span
        style={{
          alignItems: "center",
          display: "inline-flex",
          height: "fit-content",
        }}
        onClickCapture={disableClickCapture ? undefined : onToggle}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
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
      boxSize={3}
      color="gray.600"
      cursor="pointer"
      m={0}
      name="info-circle"
      onClick={(e) => e.stopPropagation()}
    />
  </Tooltip>
);
