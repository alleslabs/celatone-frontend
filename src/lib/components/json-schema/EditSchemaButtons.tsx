import { Flex, IconButton } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";

interface EditSchemaButtonsProps {
  codeId: number;
  codeHash: string;
  openDrawer: () => void;
}

export const EditSchemaButtons = ({
  codeId,
  codeHash,
  openDrawer,
}: EditSchemaButtonsProps) => (
  <Flex gap={2}>
    {/* <Button
      variant="ghost-gray"
      size="xs"
      leftIcon={<CustomIcon name="code" boxSize={4} />}
      onClick={openDrawer}
    >
      View Schema
    </Button> */}
    <IconButton
      variant="ghost-gray"
      size="xs"
      onClick={openDrawer}
      color="gray.600"
      icon={<CustomIcon name="edit" boxSize={3} />}
      aria-label="reattach schema"
    />
    <IconButton
      variant="ghost-gray"
      size="xs"
      onClick={openDrawer}
      color="gray.600"
      icon={<CustomIcon name="edit" boxSize={3} />}
      aria-label="reattach schema"
    />
    <RemoveSchemaModal
      codeId={String(codeId)}
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
