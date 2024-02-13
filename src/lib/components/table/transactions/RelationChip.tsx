import { Tag } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { Tooltip } from "lib/components/Tooltip";

interface RelationChipProps {
  isSigner: boolean;
}

export const RelationChip = ({ isSigner }: RelationChipProps) => {
  const { theme } = useCelatoneApp();
  const message = isSigner
    ? "‘Signer’ or ‘The signing address’ is the account address that signs the transaction."
    : "‘Related’ or ‘The related address’ is related to the transaction, even if not signing it; e.g., as a recipient address.";
  const tagBgColor: CSSProperties["backgroundColor"] = isSigner
    ? theme.tag.signer.bg
    : theme.tag.related.bg;

  return (
    <Tooltip label={message}>
      <Tag
        bgColor={tagBgColor}
        color={isSigner ? theme.tag.signer.color : theme.tag.related.color}
      >
        {isSigner ? "Signer" : "Related"}
      </Tag>
    </Tooltip>
  );
};
