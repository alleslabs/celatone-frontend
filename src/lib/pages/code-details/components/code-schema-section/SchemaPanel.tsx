import type { Nullable, Option } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { UploadSchemaSection } from "lib/components/json-schema";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { EmptyState } from "lib/components/state";
import { jsonPrettify } from "lib/utils";
import { capitalize } from "lodash";

interface SchemaPanelProps {
  codeId: number;
  codeHash: string;
  jsonSchema: Option<Nullable<object>>;
  hasSchema: boolean;
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
      <Flex bgColor="gray.900" borderRadius="8px" h="full" w="full">
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
      canCopy
      showLines={28}
      text={jsonSchema ? jsonPrettify(JSON.stringify(jsonSchema)) : "null"}
    />
  );
};
