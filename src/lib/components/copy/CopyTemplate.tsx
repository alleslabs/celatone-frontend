import type { BoxProps } from "@chakra-ui/react";
import { Flex, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

import { Tooltip } from "../Tooltip";

interface CopyTemplateProps {
  value: string;
  copyLabel?: string;
  triggerElement: JSX.Element;
  isDisabled?: boolean;
  ml?: BoxProps["ml"];
}

export const CopyTemplate = ({
  value,
  copyLabel = "Copied!",
  triggerElement,
  isDisabled = false,
  ml,
}: CopyTemplateProps) => {
  const { onCopy, hasCopied, setValue } = useClipboard(value);
  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip isOpen={!isDisabled && hasCopied} label={copyLabel}>
      <Flex
        direction="column"
        onClick={(e) => {
          onCopy();
          e.stopPropagation();
        }}
        ml={ml}
      >
        {triggerElement}
      </Flex>
    </Tooltip>
  );
};
