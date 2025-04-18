import type { CodeSchema, Option } from "lib/types";
import type { ReactNode } from "react";

import { Flex, useDisclosure } from "@chakra-ui/react";

import { AttachSchemaCard } from "../AttachSchemaCard";
import { JsonSchemaModal } from "../JsonSchemaModal";

interface UploadSchemaContentInterface {
  attached: boolean;
  localSchema: Option<CodeSchema>;
  codeId: number;
  codeHash: string;
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
        codeHash={codeHash}
        codeId={codeId}
        isOpen={isOpen}
        isReattach={attached}
        onClose={onClose}
      />
    </>
  );
};
