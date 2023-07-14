import { Box, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

import { Tooltip } from "../Tooltip";

interface CopyTemplateProps {
  value: string;
  copyLabel?: string;
  triggerElement: JSX.Element;
  isDisabled?: boolean;
}

export const CopyTemplate = ({
  value,
  copyLabel = "Copied!",
  triggerElement,
  isDisabled = false,
}: CopyTemplateProps) => {
  const { onCopy, hasCopied, setValue } = useClipboard(value);
  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip isOpen={!isDisabled && hasCopied} label={copyLabel}>
      <Box
        display="inline"
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
