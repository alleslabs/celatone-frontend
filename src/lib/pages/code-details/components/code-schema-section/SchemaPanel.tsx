import { Flex } from "@chakra-ui/react";
import { capitalize } from "lodash";

import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { UploadSchemaSection } from "lib/components/json-schema";
import { EmptyState } from "lib/components/state";
import type { Nullable, Option } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface SchemaPanelProps {
  codeHash: string;
  codeId: number;
  hasSchema: boolean;
  jsonSchema: Option<Nullable<object>>;
  schemaProperty?: string;
}

export const SchemaPanel = ({
  codeHash,
  codeId,
  hasSchema,
  jsonSchema,
  schemaProperty,
}: SchemaPanelProps) => {
  if (jsonSchema === undefined)
    return hasSchema ? (
      <Flex h="full" w="full" bgColor="gray.900" borderRadius="8px">
        <EmptyState
          imageVariant="empty"
          message={`Schema for ${capitalize(schemaProperty)}Msg doesn't exist`}
          my={6}
        />
      </Flex>
    ) : (
      <UploadSchemaSection codeHash={codeHash} codeId={codeId} />
    );

  return (
    <JsonReadOnly
      text={jsonSchema ? jsonPrettify(JSON.stringify(jsonSchema)) : "null"}
      canCopy
      showLines={28}
    />
  );
};
