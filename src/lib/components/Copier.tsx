import { CopyIcon } from "@chakra-ui/icons";
import type { LayoutProps } from "@chakra-ui/react";
import { Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

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
        <CopyIcon
          className={className}
          display={display}
          boxSize="16px"
          color="text.dark"
          cursor="pointer"
          marginLeft={ml}
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
        />
      </div>
    </Tooltip>
  );
};
