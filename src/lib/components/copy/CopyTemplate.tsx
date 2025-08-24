import type { BoxProps } from "@chakra-ui/react";

import { Flex, useClipboard } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { Tooltip } from "../Tooltip";

interface CopyTemplateProps {
  copyLabel?: string;
  hoverLabel?: string;
  isDisabled?: boolean;
  ml?: BoxProps["ml"];
  triggerElement: JSX.Element;
  value: string;
  w?: BoxProps["width"];
}

export const CopyTemplate = ({
  copyLabel = "Copied!",
  hoverLabel = "Click to copy",
  isDisabled = false,
  ml,
  triggerElement,
  value,
  w = "auto",
}: CopyTemplateProps) => {
  const { hasCopied, onCopy, setValue } = useClipboard(value);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip
      isOpen={!isDisabled && (hasCopied || isHover)}
      label={hasCopied ? copyLabel : hoverLabel}
    >
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
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {triggerElement}
      </Flex>
    </Tooltip>
  );
};
