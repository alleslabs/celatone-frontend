import { Flex, IconButton } from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "../icon";
import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";
import { Tooltip } from "../Tooltip";

interface EditSchemaButtonsProps {
  codeId: number;
  codeHash: string;
  openModal: () => void;
}

export const EditSchemaButtons = ({
  codeId,
  codeHash,
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
          variant="ghost-gray-icon"
          size="sm"
          onClick={handleReattach}
          icon={<CustomIcon name="edit" boxSize={4} />}
          aria-label="reattach schema"
        />
      </Tooltip>
      <RemoveSchemaModal
        codeId={codeId}
        codeHash={codeHash}
        trigger={
          <Tooltip label="Delete your attached schema">
            <IconButton
              variant="ghost-gray-icon"
              size="sm"
              icon={<CustomIcon name="delete" boxSize={4} />}
              aria-label="delete schema"
            />
          </Tooltip>
        }
      />
    </Flex>
  );
};
