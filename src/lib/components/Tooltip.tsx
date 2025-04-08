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
      arrowSize={8}
      hasArrow
      isOpen={isOpen}
      placement={placement}
      {...tooltipProps}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
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
      boxSize={3}
      color="gray.600"
      cursor="pointer"
      m={0}
      name="info-circle"
      onClick={(e) => e.stopPropagation()}
    />
  </Tooltip>
);
