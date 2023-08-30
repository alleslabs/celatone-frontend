import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Grid,
  GridItem,
  Flex,
  Button,
  Alert,
  AlertDescription,
  Box,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { memo, useState, useEffect, useCallback } from "react";

import { CELATONE_QUERY_KEYS } from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import {
  JsonSchemaForm,
  MessageInputSwitch,
  OutputMessageTabs,
} from "lib/components/json-schema";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { AmpTrack, AmpEvent } from "lib/services/amplitude";
import { queryData } from "lib/services/contract";
import type { Activity } from "lib/stores/contract";
import type { SchemaInfo } from "lib/stores/schema";
import type {
  ContractAddr,
  HumanAddr,
  RpcQueryError,
  Option,
  JsonDataType,
} from "lib/types";
import {
  dateFromNow,
  encode,
  getCurrentDate,
  getDefaultMsg,
  isNonEmptyJsonData,
  jsonValidate,
  parseSchemaInitialData,
} from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface SchemaQueryComponentProps {
  msgSchema: SchemaInfo;
  resSchema: SchemaInfo;
  contractAddress: ContractAddr;
  lcdEndpoint: string;
  walletAddress: Option<string>;
  initialMsg: JsonDataType;
  addActivity: (activity: Activity) => void;
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

export const SchemaQueryComponent = ({
  msgSchema,
  resSchema,
  contractAddress,
  lcdEndpoint,
  walletAddress,
  initialMsg,
  addActivity,
}: SchemaQueryComponentProps) => {
  const [resTab, setResTab] = useState<Option<OutputMessageTabs>>(
    OutputMessageTabs.YOUR_SCHEMA
  );
  const [msg, setMsg] = useState(JSON.stringify(getDefaultMsg(msgSchema)));
  const [res, setRes] = useState("");
  const [queryError, setQueryError] = useState("");
  const [timestamp, setTimestamp] = useState<Date>();

  // TODO: Abstract query
  const {
    refetch,
    isFetching: queryFetching,
    isRefetching: queryRefetching,
  } = useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_QUERY,
      lcdEndpoint,
      contractAddress,
      msgSchema.title,
      msg,
    ],
    async () => queryData(lcdEndpoint, contractAddress, msg),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        const currentDate = getCurrentDate();
        setQueryError("");
        setRes(JSON.stringify(data.data, null, 2));
        setTimestamp(currentDate);
        addActivity({
          type: "query",
          action: msgSchema.title ?? "Unknown",
          sender: walletAddress as HumanAddr,
          contractAddress,
          msg: encode(msg),
          timestamp: currentDate,
        });
      },
      onError(err: AxiosError<RpcQueryError>) {
        setQueryError(err.response?.data.message || DEFAULT_RPC_ERROR);
        setTimestamp(undefined);
        setRes("");
      },
    }
  );

  const handleQuery = useCallback(() => {
    AmpTrack(AmpEvent.ACTION_QUERY);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (isNonEmptyJsonData(initialMsg)) {
      setMsg(JSON.stringify(initialMsg));
      if (!msgSchema.inputRequired) refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialMsg), msgSchema.inputRequired, refetch]);

  return (
    <AccordionItem className={`query_msg_${msgSchema.schema.required?.[0]}`}>
      <h6>
        <AccordionButton p={4}>
          <Box w="full" textAlign="start">
            <Text variant="body1" fontWeight={700}>
              {msgSchema.title}
            </Text>
            <Text variant="body3" textColor="text.dark">
              {msgSchema.description}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Grid
          templateColumns={msgSchema.inputRequired ? "1fr 1fr" : "1fr"}
          columnGap={6}
        >
          {msgSchema.inputRequired && (
            <GridItem>
              <Text variant="body2" color="text.dark" fontWeight={700}>
                Query Input
              </Text>
              <JsonSchemaForm
                formId={`query-${msgSchema.title}`}
                schema={msgSchema.schema}
                initialFormData={initialMsg}
                onChange={(data) => setMsg(JSON.stringify(data))}
              />
              <Flex gap={2} justify="flex-start">
                <CopyButton
                  isDisable={msg === ""}
                  value={msg}
                  amptrackSection="query_msg"
                  buttonText="Copy QueryMsg"
                />
                <CodeSnippet
                  type="query"
                  contractAddress={contractAddress}
                  message={msg}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleQuery}
                  isDisabled={jsonValidate(msg) !== null}
                  isLoading={queryFetching || queryRefetching}
                  leftIcon={<CustomIcon name="query" />}
                  ml="auto"
                >
                  Query
                </Button>
              </Flex>
            </GridItem>
          )}
          <GridItem>
            <Flex justify="space-between" mb={4}>
              <Flex direction="column">
                <Text variant="body2" color="text.dark" fontWeight={700}>
                  Return Output
                </Text>
                <Text variant="body3" textColor="text.dark">
                  {resSchema.description}
                </Text>
              </Flex>
              <MessageInputSwitch
                currentTab={resTab}
                onTabChange={setResTab}
                ml="auto"
                isOutput
              />
            </Flex>
            {queryError && (
              <Alert variant="error" mb={3} alignItems="center">
                <AlertDescription wordBreak="break-word">
                  {queryError}
                </AlertDescription>
              </Alert>
            )}
            <Flex direction="column" gap={2}>
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
              <TimestampText timestamp={timestamp} />
            </Flex>
            {!msgSchema.inputRequired ? (
              <Flex gap={2} justify="flex-start" mt={3}>
                <CopyButton
                  isDisable={msg === ""}
                  value={msg}
                  amptrackSection="query_msg"
                  buttonText="Copy QueryMsg"
                />
                <CodeSnippet
                  type="query"
                  contractAddress={contractAddress}
                  message={JSON.stringify({ [msgSchema.title ?? ""]: {} })}
                />
                <Flex gap={2} ml="auto">
                  <CopyButton
                    isDisable={res === "" || Boolean(queryError)}
                    value={res}
                    amptrackSection="query_response"
                    buttonText="Copy Output"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleQuery}
                    isDisabled={jsonValidate(msg) !== null}
                    isLoading={queryFetching || queryRefetching}
                    leftIcon={<CustomIcon name="query" />}
                    ml="auto"
                  >
                    Query Again
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <CopyButton
                isDisable={res === "" || Boolean(queryError)}
                value={res}
                amptrackSection="query_response"
                buttonText="Copy Output"
              />
            )}
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};
