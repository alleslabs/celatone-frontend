import type { LayoutProps } from "@chakra-ui/react";
import { Flex, Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CustomIcon } from "./icon/CustomIcon";

interface CopierProps {
  value: string;
  ml?: string;
  className?: string;
  display?: LayoutProps["display"];
  copyLabel?: string;
}

export const Copier = ({
  value,
  ml = "8px",
  className,
  display = "flex",
  copyLabel = "Copied!",
}: CopierProps) => {
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
        <Flex
          className={className}
          display={display}
          cursor="pointer"
          marginLeft={ml}
          onClick={(e) => {
            AmpTrack(AmpEvent.USE_COPIER);
            e.stopPropagation();
            onCopy();
          }}
        >
          <CustomIcon name="copy" />
        </Flex>
      </div>
    </Tooltip>
  );
};
