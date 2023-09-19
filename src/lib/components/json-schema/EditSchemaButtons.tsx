import { Flex, IconButton } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";

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
  <Flex gap={2}>
    <IconButton
      variant="ghost-gray"
      size="xs"
      onClick={openDrawer}
      color="gray.600"
      icon={<CustomIcon name="edit" boxSize={3} />}
      aria-label="reattach schema"
    />
    <RemoveSchemaModal
      codeId={codeId}
      codeHash={codeHash}
      trigger={
        <IconButton
          variant="ghost-gray"
          size="xs"
          color="gray.600"
          icon={<CustomIcon name="delete" boxSize={3} />}
          aria-label="delete schema"
        />
      }
    />
  </Flex>
);
