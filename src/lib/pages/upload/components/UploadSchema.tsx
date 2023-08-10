import { useDisclosure } from "@chakra-ui/react";

import { AttachSchemaCard, JsonSchemaDrawer } from "lib/components/json-schema";
import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

interface UploadSchemaContentInterface {
  attached: boolean;
  schema: Option<CodeSchema>;
  codeId: string;
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
        openDrawer={onOpen}
      />
      <JsonSchemaDrawer
        codeId={codeId}
        codeHash={codeHash}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
