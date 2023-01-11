import { CopyIcon } from "@chakra-ui/icons";
import { Button, useClipboard } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { useEffect } from "react";

interface CopyButtonProps {
  isDisable?: boolean;
  value: string;
  size?: ButtonProps["size"];
}

export const CopyButton = ({
  isDisable,
  value,
  size = "sm",
}: CopyButtonProps) => {
  // TODO: revisit useClipboard later
  const { onCopy, setValue } = useClipboard(value);

  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Button
      isDisabled={isDisable}
      variant="outline-info"
      size={size}
      float="right"
      onClick={onCopy}
      leftIcon={<CopyIcon boxSize="5" onClick={onCopy} />}
    >
      Copy
    </Button>
  );
};
