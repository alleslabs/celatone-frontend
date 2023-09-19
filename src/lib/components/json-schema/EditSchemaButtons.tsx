import { Flex, IconButton } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";
import { Tooltip } from "../Tooltip";

interface EditSchemaButtonsProps {
  codeId: string;
  codeHash: string;
  openDrawer: () => void;
}

export const EditSchemaButtons = ({
  codeId,
  codeHash,
  openDrawer,
}: EditSchemaButtonsProps) => (
  <Flex gap={1}>
    <Tooltip label="Reattach JSON schema">
      <IconButton
        variant="ghost-gray"
        size="sm"
        onClick={openDrawer}
        color="gray.600"
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
            variant="ghost-gray"
            size="sm"
            color="gray.600"
            icon={<CustomIcon name="delete" boxSize={4} />}
            aria-label="delete schema"
          />
        </Tooltip>
      }
    />
  </Flex>
);
