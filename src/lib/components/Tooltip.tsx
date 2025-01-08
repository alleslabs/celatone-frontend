import type { TooltipProps } from "@chakra-ui/react";
import { Tooltip as ChakraTooltip, useDisclosure } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

export const Tooltip = ({
  children,
  placement = "top",
  ...tooltipProps
}: TooltipProps) => {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();
  return (
    <ChakraTooltip
      isOpen={isOpen}
      placement={placement}
      arrowSize={8}
      hasArrow
      {...tooltipProps}
    >
      <span
        style={{
          alignItems: "center",
          display: "inline-flex",
          height: "fit-content",
        }}
        onClickCapture={onToggle}
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
      m={0}
      name="info-circle"
      boxSize={3}
      color="gray.600"
      cursor="pointer"
      onClick={(e) => e.stopPropagation()}
    />
  </Tooltip>
);
