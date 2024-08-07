import { Flex, useDisclosure } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { AttachSchemaCard } from "../AttachSchemaCard";
import { JsonSchemaModal } from "../JsonSchemaModal";
import type { CodeSchema, Option } from "lib/types";

interface UploadSchemaContentInterface {
  attached: boolean;
  schema: Option<CodeSchema>;
  codeId: number;
  codeHash: string;
  triggerElement?: ReactNode;
}

export const UploadSchema = ({
  attached,
  schema,
  codeId,
  codeHash,
  triggerElement,
}: UploadSchemaContentInterface) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {triggerElement ? (
        <Flex
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
          schema={schema}
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
