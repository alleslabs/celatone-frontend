import { useDisclosure } from "@chakra-ui/react";

import { AttachSchemaCard } from "../AttachSchemaCard";
import { JsonSchemaModal } from "../JsonSchemaModal";
import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

interface UploadSchemaContentInterface {
  attached: boolean;
  schema: Option<CodeSchema>;
  codeId: number;
  codeHash: string;
}

export const UploadSchema = ({
  attached,
  schema,
  codeId,
  codeHash,
}: UploadSchemaContentInterface) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <AttachSchemaCard
        attached={attached}
        codeId={codeId}
        codeHash={codeHash}
        schema={schema}
        openModal={onOpen}
      />
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
