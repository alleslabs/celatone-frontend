import type { BoxProps } from "@chakra-ui/react";

import { Flex, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";
import { JSX } from "react";

import { Tooltip } from "../Tooltip";

interface CopyTemplateProps {
  value: string;
  copyLabel?: string;
  triggerElement: JSX.Element;
  isDisabled?: boolean;
  ml?: BoxProps["ml"];
  w?: BoxProps["width"];
}

export const CopyTemplate = ({
  value,
  copyLabel = "Copied!",
  triggerElement,
  isDisabled = false,
  ml,
  w = "auto",
}: CopyTemplateProps) => {
  const { onCopy, hasCopied, setValue } = useClipboard(value);
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
