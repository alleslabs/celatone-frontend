import { Tag, Tooltip, chakra } from "@chakra-ui/react";
import type { CSSProperties } from "react";

const StyledTag = chakra(Tag, {
  baseStyle: {
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 400,
    color: "text.main",
    w: "fit-content",
  },
});

interface RelationChipProps {
  isSigner: boolean;
}

export const RelationChip = ({ isSigner }: RelationChipProps) => {
  const message = isSigner
    ? "‘Signer’ or ‘The signing address’ is the account address that signs the transaction."
    : "‘Related' or ‘The related address’ is related to the transaction, even if not signing it; e.g., as a recipient address.";
  const tagBgColor: CSSProperties["backgroundColor"] = isSigner
    ? "violet.dark"
    : "pebble.700";

  return (
    <Tooltip hasArrow label={message} placement="top">
      <StyledTag bgColor={tagBgColor}>
        {isSigner ? "Signer" : "Related"}
      </StyledTag>
    </Tooltip>
  );
};
