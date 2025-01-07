import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type { Nullable, Option } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface ViewSchemaPanelProps {
  codeId: number;
  jsonSchema: Option<Nullable<object>>;
}

export const ViewSchemaPanel = ({
  codeId,
  jsonSchema,
}: ViewSchemaPanelProps) => (
  <>
    {jsonSchema === undefined ? (
      <Flex
        alignItems="center"
        p="24px 16px"
        bgColor="gray.900"
        borderRadius="8px"
        direction="column"
      >
        <Text variant="body1" fontWeight={700}>
          You haven&#39;t attached the JSON Schema for{" "}
          <CustomIcon mx={1} name="code" color="gray.400" />
          code {codeId} yet
        </Text>
        <Text
          mb={4}
          mt={2}
          variant="body2"
          fontWeight={500}
          textColor="text.disabled"
        >
          Please attach schema in Code Detail page
        </Text>
      </Flex>
    ) : (
      <JsonReadOnly
        text={jsonSchema ? jsonPrettify(JSON.stringify(jsonSchema)) : "null"}
        canCopy
        showLines={26}
      />
    )}
  </>
);
