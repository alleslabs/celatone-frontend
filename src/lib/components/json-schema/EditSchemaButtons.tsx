import { Flex, IconButton } from "@chakra-ui/react";
import { useCallback } from "react";

import { CustomIcon } from "../icon";
import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";
import { Tooltip } from "../Tooltip";
import { AmpEvent, track } from "lib/amplitude";

interface EditSchemaButtonsProps {
  codeHash: string;
  codeId: number;
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
          size="sm"
          variant="ghost-gray-icon"
          icon={<CustomIcon name="edit" boxSize={4} />}
          onClick={handleReattach}
        />
      </Tooltip>
      <RemoveSchemaModal
        trigger={
          <Tooltip label="Delete your attached schema">
            <IconButton
              aria-label="delete schema"
              size="sm"
              variant="ghost-gray-icon"
              icon={<CustomIcon name="delete" boxSize={4} />}
            />
          </Tooltip>
        }
        codeHash={codeHash}
        codeId={codeId}
      />
    </Flex>
  );
};
