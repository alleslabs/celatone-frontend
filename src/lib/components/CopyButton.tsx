import { Button, Flex, Tooltip, useClipboard } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { useEffect } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CustomIcon } from "./icon/CustomIcon";

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
          onClick={() => {
            AmpTrack(AmpEvent.USE_COPY_BUTTON);
            onCopy();
          }}
        >
          <Flex onClick={onCopy}>
            <CustomIcon
              name="copy"
              boxSize="3"
              color={isDisable ? "honeydew.darker" : "honeydew.main"}
            />
          </Flex>
          Copy
        </Button>
      </div>
    </Tooltip>
  );
};
