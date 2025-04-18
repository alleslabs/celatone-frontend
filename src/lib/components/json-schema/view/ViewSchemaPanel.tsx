import type { Nullable, Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

interface ViewSchemaPanelProps {
  jsonSchema: Option<Nullable<object>>;
  codeId: number;
}

export const ViewSchemaPanel = ({
  codeId,
  jsonSchema,
}: ViewSchemaPanelProps) => (
  <>
    {jsonSchema === undefined ? (
      <Flex
        alignItems="center"
        bgColor="gray.900"
        borderRadius="8px"
        direction="column"
        p="24px 16px"
      >
        <Text fontWeight={700} variant="body1">
          You haven&#39;t attached the JSON schema for{" "}
          <CustomIcon color="gray.400" mx={1} name="code" />
          code {codeId} yet
        </Text>
        <Text
          fontWeight={500}
          mb={4}
          mt={2}
          textColor="text.disabled"
          variant="body2"
        >
          Please attach schema in Code Detail page
        </Text>
      </Flex>
    ) : (
      <JsonReadOnly
        canCopy
        showLines={26}
        text={jsonSchema ? jsonPrettify(JSON.stringify(jsonSchema)) : "null"}
      />
    )}
  </>
);
