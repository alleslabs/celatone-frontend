import { Tag } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import { Tooltip } from "lib/components/Tooltip";

interface RelationChipProps {
  isSigner: boolean;
}

export const RelationChip = ({ isSigner }: RelationChipProps) => {
  const message = isSigner
    ? "‘Signer’ or ‘The signing address’ is the account address that signs the transaction."
    : "‘Related' or ‘The related address’ is related to the transaction, even if not signing it; e.g., as a recipient address.";
  const tagBgColor: CSSProperties["backgroundColor"] = isSigner
    ? "accent.darker"
    : "primary.dark";

  return (
    <Tooltip label={message}>
      <Tag bgColor={tagBgColor} color={isSigner ? "inherit" : "gray.900"}>
        {isSigner ? "Signer" : "Related"}
      </Tag>
    </Tooltip>
  );
};
