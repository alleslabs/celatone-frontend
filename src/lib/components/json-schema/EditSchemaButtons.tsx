import { Button, Flex } from "@chakra-ui/react";

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
    <Button
      variant="outline-gray"
      size="sm"
      leftIcon={<CustomIcon name="edit" boxSize={3} />}
      onClick={openDrawer}
    >
      Reattach Schema
    </Button>
    <RemoveSchemaModal
      codeId={String(codeId)}
      codeHash={codeHash}
      trigger={
        <Button
          variant="outline-gray"
          size="sm"
          leftIcon={<CustomIcon name="delete" boxSize={3} />}
        >
          Delete Schema
        </Button>
      }
    />
  </Flex>
);
