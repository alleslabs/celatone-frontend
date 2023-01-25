import { CopyIcon } from "@chakra-ui/icons";
import type { LayoutProps } from "@chakra-ui/react";
import { Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

interface CopierProps {
  value: string;
  ml?: string;
  className?: string;
  display?: LayoutProps["display"];
}

export const Copier = ({
  value,
  ml = "8px",
  className,
  display = "flex",
}: CopierProps) => {
  const { onCopy, hasCopied, setValue } = useClipboard(value);

  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip
      hasArrow
      isOpen={hasCopied}
      label="Copied!"
      placement="top"
      arrowSize={8}
      bg="primary.dark"
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
