import { Box, Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

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
    <Tooltip
      hasArrow
      isOpen={hasCopied}
      label={copyLabel}
      placement="top"
      arrowSize={8}
      bg="honeydew.darker"
    >
      <Box onClick={onCopy}>{triggerElement}</Box>
    </Tooltip>
  );
};
