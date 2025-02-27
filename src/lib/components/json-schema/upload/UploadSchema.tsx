import { Flex, useDisclosure } from "@chakra-ui/react";
import type { ReactNode } from "react";

import type { CodeSchema, Option } from "lib/types";
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
  localSchema,
  codeId,
  codeHash,
  triggerElement,
}: UploadSchemaContentInterface) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          codeId={codeId}
          codeHash={codeHash}
          localSchema={localSchema}
          openModal={onOpen}
        />
      )}
      <JsonSchemaModal
        codeId={codeId}
        codeHash={codeHash}
        isReattach={attached}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
