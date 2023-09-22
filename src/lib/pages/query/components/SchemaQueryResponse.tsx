import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";

import { JsonSchemaForm, OutputMessageTabs } from "lib/components/json-schema";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type { SchemaInfo } from "lib/stores/schema";
import type { Option } from "lib/types";
import { dateFromNow, parseSchemaInitialData } from "lib/utils";

interface SchemaQueryResponseProps {
  res: string;
  resTab: Option<OutputMessageTabs>;
  msgSchema: SchemaInfo;
  resSchema: SchemaInfo;
  timestamp: Option<Date>;
  isRefetching: boolean;
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
  isRefetching,
}: SchemaQueryResponseProps) => {
  if (isRefetching)
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
                initialFormData={parseSchemaInitialData(res)}
              />
            </Box>
          )}
        </>
      )}
      <TimestampText timestamp={timestamp} />
    </Flex>
  );
};
