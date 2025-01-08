import { Flex } from "@chakra-ui/react";
import { capitalize } from "lodash";

import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { UploadSchemaSection } from "lib/components/json-schema";
import { EmptyState } from "lib/components/state";
import type { Nullable, Option } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface SchemaPanelProps {
  codeId: number;
  codeHash: string;
  jsonSchema: Option<Nullable<object>>;
  hasSchema: boolean;
  schemaProperty?: string;
}

export const SchemaPanel = ({
  codeId,
  codeHash,
  jsonSchema,
  hasSchema,
  schemaProperty,
}: SchemaPanelProps) => {
  if (jsonSchema === undefined)
    return hasSchema ? (
      <Flex w="full" h="full" bgColor="gray.900" borderRadius="8px">
        <EmptyState
          imageVariant="empty"
          message={`Schema for ${capitalize(schemaProperty)}Msg doesn't exist`}
          my={6}
        />
      </Flex>
    ) : (
      <UploadSchemaSection codeId={codeId} codeHash={codeHash} />
    );

  return (
    <JsonReadOnly
      text={jsonSchema ? jsonPrettify(JSON.stringify(jsonSchema)) : "null"}
      canCopy
      showLines={28}
    />
  );
};
