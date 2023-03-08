import { chakra, IconButton } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { CodeInfo } from "lib/types";

import { RemoveCodeModal } from "./RemoveCode";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "full",
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
          icon={<CustomIcon name="bookmark-solid" color="violet.light" />}
          variant="ghost-gray"
        />
      }
    />
  ) : (
    <SaveCodeDetailsModal
      codeInfo={codeInfo}
      triggerElement={
        <StyledIconButton
          icon={<CustomIcon name="bookmark" />}
          variant="ghost-gray"
        />
      }
    />
  );
