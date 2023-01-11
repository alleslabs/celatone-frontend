import { CopyIcon } from "@chakra-ui/icons";
import { Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect } from "react";

interface CopierProps {
  value: string;
  ml?: string;
}

export const Copier = ({ value, ml = "8px" }: CopierProps) => {
  const { onCopy, hasCopied, setValue } = useClipboard(value);

  useEffect(() => setValue(value), [value, setValue]);

  return (
    <Tooltip
      hasArrow
      isOpen={hasCopied}
      label="Copied!"
      placement="top"
      bg="primary.dark"
      color="text.main"
      fontWeight={400}
      fontSize="14px"
      p="8px 16px"
      borderRadius="8px"
      arrowSize={8}
      mb="4px"
    >
      <CopyIcon
        display="flex"
        boxSize="16px"
        color="text.dark"
        cursor="pointer"
        marginLeft={ml}
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
      />
    </Tooltip>
  );
};
