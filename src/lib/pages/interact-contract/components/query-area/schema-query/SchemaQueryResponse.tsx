import type { Option, QueryResponse, SchemaInfo } from "lib/types";

import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { JsonSchemaForm, OutputMessageTabs } from "lib/components/json-schema";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { dateFromNow, parseJsonStr } from "lib/utils";
import { memo, useEffect, useState } from "react";

interface SchemaQueryResponseProps {
  res: string;
  resTab: Option<OutputMessageTabs>;
  msgSchema: SchemaInfo;
  resSchema: SchemaInfo;
  timestamp: Option<Date>;
  isLoading: boolean;
}

const TimestampText = memo(({ timestamp }: { timestamp: Option<Date> }) => {
  const [, setRenderCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((prev) => prev + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Text color="text.dark" opacity={timestamp ? 1 : 0} variant="body3">
      ({timestamp ? `Last queried ${dateFromNow(timestamp)}` : "N/A"})
    </Text>
  );
});

export const SchemaQueryResponse = ({
  res,
  resTab,
  msgSchema,
  resSchema,
  timestamp,
  isLoading,
}: SchemaQueryResponseProps) => {
  if (isLoading)
    return (
      <Flex
        alignItems="center"
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
        direction="column"
        gap={2}
        p="48px 12px"
      >
        <Spinner color="text.100" />
        <Text color="text.dark">Querying...</Text>
      </Flex>
    );

  return (
    <Flex direction="column" gap={2}>
      {!res ? (
        <Flex
          bg="gray.800"
          borderRadius={8}
          justifyContent="center"
          p="16px 12px"
        >
          <Text color="text.dark" variant="body3">
            Query response will display here
          </Text>
        </Flex>
      ) : (
        <>
          {resTab === OutputMessageTabs.JSON_OUTPUT ? (
            <JsonReadOnly
              canCopy={res !== ""}
              labelBgColor="gray.900"
              text={res}
              topic="Return Output"
            />
          ) : (
            <Box bg="gray.800" borderRadius="8px" p={4}>
              <JsonSchemaForm
                formId={`response-${msgSchema.title}`}
                initialFormData={(parseJsonStr(res) as QueryResponse).data}
                schema={resSchema.schema}
              />
            </Box>
          )}
        </>
      )}
      <TimestampText timestamp={timestamp} />
    </Flex>
  );
};
