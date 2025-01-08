import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";

import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { JsonSchemaForm, OutputMessageTabs } from "lib/components/json-schema";
import type { Option, QueryResponse, SchemaInfo } from "lib/types";
import { dateFromNow, parseJsonStr } from "lib/utils";

interface SchemaQueryResponseProps {
  isLoading: boolean;
  msgSchema: SchemaInfo;
  res: string;
  resSchema: SchemaInfo;
  resTab: Option<OutputMessageTabs>;
  timestamp: Option<Date>;
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
    <Text variant="body3" color="text.dark" opacity={timestamp ? 1 : 0}>
      ({timestamp ? `Last queried ${dateFromNow(timestamp)}` : "N/A"})
    </Text>
  );
});

export const SchemaQueryResponse = ({
  isLoading,
  msgSchema,
  res,
  resSchema,
  resTab,
  timestamp,
}: SchemaQueryResponseProps) => {
  if (isLoading)
    return (
      <Flex
        alignItems="center"
        gap={2}
        p="48px 12px"
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
        direction="column"
      >
        <Spinner color="text.100" />
        <Text color="text.dark">Querying...</Text>
      </Flex>
    );

  return (
    <Flex gap={2} direction="column">
      {!res ? (
        <Flex
          bg="gray.800"
          p="16px 12px"
          borderRadius={8}
          justifyContent="center"
        >
          <Text variant="body3" color="text.dark">
            Query response will display here
          </Text>
        </Flex>
      ) : (
        <>
          {resTab === OutputMessageTabs.JSON_OUTPUT ? (
            <JsonReadOnly
              text={res}
              canCopy={res !== ""}
              labelBgColor="gray.900"
              topic="Return Output"
            />
          ) : (
            <Box bg="gray.800" p={4} borderRadius="8px">
              <JsonSchemaForm
                schema={resSchema.schema}
                formId={`response-${msgSchema.title}`}
                initialFormData={(parseJsonStr(res) as QueryResponse).data}
              />
            </Box>
          )}
        </>
      )}
      <TimestampText timestamp={timestamp} />
    </Flex>
  );
};
