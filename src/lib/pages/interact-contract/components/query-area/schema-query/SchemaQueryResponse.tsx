import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";

import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { JsonSchemaForm, OutputMessageTabs } from "lib/components/json-schema";
import type { Option, SchemaInfo } from "lib/types";
import { dateFromNow, parseJsonStr } from "lib/utils";

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
    <Text variant="body3" color="text.dark" opacity={timestamp ? 1 : 0}>
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
        borderRadius={8}
        p="48px 12px"
        gap={2}
        direction="column"
        border="1px solid"
        borderColor="gray.700"
        alignItems="center"
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
          p="16px 12px"
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
              topic="Return Output"
              labelBgColor="gray.900"
              text={res}
              canCopy={res !== ""}
            />
          ) : (
            <Box bg="gray.800" p={4} borderRadius="8px">
              <JsonSchemaForm
                formId={`response-${msgSchema.title}`}
                schema={resSchema.schema}
                initialFormData={parseJsonStr(res)}
              />
            </Box>
          )}
        </>
      )}
      <TimestampText timestamp={timestamp} />
    </Flex>
  );
};
