import type { TooltipProps } from "@chakra-ui/react";
import { Box, Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

interface CopyTemplateProps {
  value: string;
  copyLabel?: string;
  triggerElement: JSX.Element;
  tooltipBgColor?: TooltipProps["bgColor"];
}

export const CopyTemplate = ({
  value,
  copyLabel = "Copied!",
  triggerElement,
  tooltipBgColor = "honeydew.darker",
}: CopyTemplateProps) => {
  const { onCopy, hasCopied, setValue } = useClipboard(value);
  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip
      hasArrow
      isOpen={hasCopied}
      label={copyLabel}
      placement="top"
      arrowSize={8}
      bgColor={tooltipBgColor}
    >
      <Box
        onClick={(e) => {
          onCopy();
          e.stopPropagation();
        }}
      >
        {triggerElement}
      </Box>
    </Tooltip>
  );
};
