import { chakra, IconButton } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { CodeInfo } from "lib/types";

import { RemoveCodeModal } from "./RemoveCode";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    borderRadius: "full",
    display: "flex",
    fontSize: "22px",
  },
});

interface SaveOrRemoveCodeModalProps {
  codeInfo: CodeInfo;
}

export const SaveOrRemoveCodeModal = ({
  codeInfo,
}: SaveOrRemoveCodeModalProps) =>
  codeInfo.isSaved ? (
    <RemoveCodeModal
      name={codeInfo.name}
      trigger={
        <StyledIconButton
          aria-label="button"
          variant="ghost-primary"
          icon={<CustomIcon name="bookmark-solid" />}
        />
      }
      codeId={codeInfo.id}
    />
  ) : (
    <SaveCodeDetailsModal
      triggerElement={
        <StyledIconButton
          aria-label="button"
          variant="ghost-gray"
          icon={<CustomIcon name="bookmark" />}
        />
      }
      codeInfo={codeInfo}
    />
  );
