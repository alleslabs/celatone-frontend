import { Box, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

import { Tooltip } from "../TooltipComponent";

interface CopyTemplateProps {
  value: string;
  copyLabel?: string;
  triggerElement: JSX.Element;
}

export const CopyTemplate = ({
  value,
  copyLabel = "Copied!",
  triggerElement,
}: CopyTemplateProps) => {
  const { onCopy, hasCopied, setValue } = useClipboard(value);
  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip isOpen={hasCopied} label={copyLabel}>
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
