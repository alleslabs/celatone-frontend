import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import JsonReadOnly from "../json/JsonReadOnly";
import type { Option } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface ViewSchemaPanelProps {
  jsonSchema: Option<object | null>;
  codeId: string;
}
export const ViewSchemaPanel = ({
  jsonSchema,
  codeId,
}: ViewSchemaPanelProps) => {
  return (
    <>
      {jsonSchema === undefined ? (
        <Flex
          p="24px 16px"
          direction="column"
          alignItems="center"
          bgColor="gray.900"
          borderRadius="8px"
        >
          <Text variant="body1" fontWeight={700}>
            You haven&#39;t attached the JSON Schema for{" "}
            <CustomIcon name="code" mx={1} color="gray.400" />
            code {codeId} yet
          </Text>
          <Text
            variant="body2"
            textColor="text.disabled"
            fontWeight={500}
            mt={2}
            mb={4}
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
};
