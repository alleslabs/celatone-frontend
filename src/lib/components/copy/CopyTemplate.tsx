import type { BoxProps } from "@chakra-ui/react";

import { Flex, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

import { Tooltip } from "../Tooltip";

interface CopyTemplateProps {
  copyLabel?: string;
  isDisabled?: boolean;
  ml?: BoxProps["ml"];
  triggerElement: JSX.Element;
  value: string;
  w?: BoxProps["width"];
}

export const CopyTemplate = ({
  copyLabel = "Copied!",
  isDisabled = false,
  ml,
  triggerElement,
  value,
  w = "auto",
}: CopyTemplateProps) => {
  const { hasCopied, onCopy, setValue } = useClipboard(value);
  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip isOpen={!isDisabled && hasCopied} label={copyLabel}>
      <Flex
        as="span"
        display="inline-flex"
        ml={ml}
        w={w}
        onClick={(e) => {
          onCopy();
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {triggerElement}
      </Flex>
    </Tooltip>
  );
};
