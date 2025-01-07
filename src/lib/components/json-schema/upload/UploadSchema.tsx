import { Flex, useDisclosure } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { AttachSchemaCard } from "../AttachSchemaCard";
import { JsonSchemaModal } from "../JsonSchemaModal";
import type { CodeSchema, Option } from "lib/types";

interface UploadSchemaContentInterface {
  attached: boolean;
  codeHash: string;
  codeId: number;
  localSchema: Option<CodeSchema>;
  triggerElement?: ReactNode;
}

export const UploadSchema = ({
  attached,
  codeHash,
  codeId,
  localSchema,
  triggerElement,
}: UploadSchemaContentInterface) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      {triggerElement ? (
        <Flex
          flex={1}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          {triggerElement}
        </Flex>
      ) : (
        <AttachSchemaCard
          attached={attached}
          codeHash={codeHash}
          codeId={codeId}
          localSchema={localSchema}
          openModal={onOpen}
        />
      )}
      <JsonSchemaModal
        isOpen={isOpen}
        isReattach={attached}
        codeHash={codeHash}
        codeId={codeId}
        onClose={onClose}
      />
    </>
  );
};
