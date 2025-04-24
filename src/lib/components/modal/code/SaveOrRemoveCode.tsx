import type { CodeInfo } from "lib/types";

import { chakra, IconButton } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

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
      codeId={codeInfo.id}
      name={codeInfo.name}
      trigger={
        <StyledIconButton
          aria-label="button"
          icon={<CustomIcon name="bookmark-solid" />}
          variant="ghost-primary"
        />
      }
    />
  ) : (
    <SaveCodeDetailsModal
      codeInfo={codeInfo}
      triggerElement={
        <StyledIconButton
          aria-label="button"
          icon={<CustomIcon name="bookmark" />}
          variant="ghost-gray"
        />
      }
    />
  );
