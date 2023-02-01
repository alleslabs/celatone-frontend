import { CopyIcon } from "@chakra-ui/icons";
import { Button, Tooltip, useClipboard } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { useEffect } from "react";

interface CopyButtonProps {
  isDisable?: boolean;
  value: string;
  size?: ButtonProps["size"];
  copyLabel?: string;
}

export const CopyButton = ({
  isDisable,
  value,
  size = "sm",
  copyLabel = "Copied!",
}: CopyButtonProps) => {
  // TODO: revisit useClipboard later
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
      <div>
        <Button
          isDisabled={isDisable}
          variant="outline-info"
          size={size}
          float="right"
          onClick={onCopy}
          leftIcon={<CopyIcon boxSize="4" onClick={onCopy} />}
        >
          Copy
        </Button>{" "}
      </div>
    </Tooltip>
  );
};
