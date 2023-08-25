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
import type { RJSFSchema } from "@rjsf/utils";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import type { SetStateAction, Dispatch } from "react";
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
import type { QueryExecuteSchema } from "lib/stores/schema";
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
  formatUTC,
  getCurrentDate,
  getDefaultMsg,
  isNonEmptyJsonData,
  jsonValidate,
  parseSchemaInitialData,
} from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface ReturnWidgetsProps {
  timestamp: Option<Date>;
  inputRequired: Option<boolean>;
  res: string;
  resTab: Option<OutputMessageTabs>;
  queryError: string;
  setResTab: Dispatch<SetStateAction<Option<OutputMessageTabs>>>;
}

interface SchemaQueryComponentProps {
  msgSchema: QueryExecuteSchema;
  resSchema: RJSFSchema;
  contractAddress: ContractAddr;
  lcdEndpoint: string;
  walletAddress: Option<string>;
  initialMsg: JsonDataType;
  addActivity: (activity: Activity) => void;
}

const TimestampText = memo(({ timestamp }: { timestamp: Option<Date> }) => {
  const [, setRenderCount] = useState(0);
  let text = "Query response will display here";
  if (timestamp)
    text = `Last Queried at ${formatUTC(timestamp)} (${dateFromNow(
      timestamp
    )})`;

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((prev) => prev + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Text variant="body3" color="text.dark">
      {text}
    </Text>
  );
});

const ReturnWidgets = ({
  timestamp,
  inputRequired,
  res,
  resTab,
  queryError,
  setResTab,
}: ReturnWidgetsProps) =>
  !inputRequired ? (
    <Flex align="center" gap={2} mb={3}>
      <Text variant="body1" fontWeight={700}>
        Return Output
      </Text>
      <TimestampText timestamp={timestamp} />
      <MessageInputSwitch
        currentTab={resTab}
        onTabChange={setResTab}
        ml="auto"
        isOutput
      />
    </Flex>
  ) : (
    <Flex justify="space-between" mb={6}>
      <Flex direction="column" gap={2} flex={0.6}>
        <Text variant="body1" fontWeight={700}>
          Return Output
        </Text>
        <TimestampText timestamp={timestamp} />
      </Flex>
      <Flex direction="column" gap={2}>
        <MessageInputSwitch
          currentTab={resTab}
          onTabChange={setResTab}
          ml="auto"
          isOutput
        />
        <CopyButton
          isDisable={res === "" || Boolean(queryError)}
          value={res}
          amptrackSection="query_response"
          buttonText="Copy Output"
          ml="auto"
        />
      </Flex>
    </Flex>
  );

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
            <ReturnWidgets
              timestamp={timestamp}
              inputRequired={msgSchema.inputRequired}
              res={res}
              resTab={resTab}
              queryError={queryError}
              setResTab={setResTab}
            />
            {queryError && (
              <Alert variant="error" mb={3} alignItems="center">
                <AlertDescription wordBreak="break-word">
                  {queryError}
                </AlertDescription>
              </Alert>
            )}
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
                  schema={resSchema}
                  initialFormData={parseSchemaInitialData(res)}
                />
              </Box>
            )}
            {!msgSchema.inputRequired && (
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
            )}
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};
