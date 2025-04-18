import { Flex, IconButton } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCallback } from "react";

import { CustomIcon } from "../icon";
import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";
import { Tooltip } from "../Tooltip";

interface EditSchemaButtonsProps {
  codeId: number;
  codeHash: string;
  openModal: () => void;
}

export const EditSchemaButtons = ({
  codeHash,
  codeId,
  openModal,
}: EditSchemaButtonsProps) => {
  const handleReattach = useCallback(() => {
    track(AmpEvent.USE_EDIT_ATTACHED_JSON);
    openModal();
  }, [openModal]);

  return (
    <Flex gap={1}>
      <Tooltip label="Reattach JSON schema">
        <IconButton
          aria-label="reattach schema"
          icon={<CustomIcon boxSize={4} name="edit" />}
          size="sm"
          variant="ghost-gray-icon"
          onClick={handleReattach}
        />
      </Tooltip>
      <RemoveSchemaModal
        codeHash={codeHash}
        codeId={codeId}
        trigger={
          <Tooltip label="Delete your attached schema">
            <IconButton
              aria-label="delete schema"
              icon={<CustomIcon boxSize={4} name="delete" />}
              size="sm"
              variant="ghost-gray-icon"
            />
          </Tooltip>
        }
      />
    </Flex>
  );
};
