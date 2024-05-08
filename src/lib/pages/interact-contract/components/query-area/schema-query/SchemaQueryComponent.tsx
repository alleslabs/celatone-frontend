import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track, trackActionQuery } from "lib/amplitude";
import { CELATONE_QUERY_KEYS } from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import {
  JsonSchemaForm,
  MessageInputSwitch,
  OutputMessageTabs,
} from "lib/components/json-schema";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { queryData } from "lib/services/contract";
import type { Activity } from "lib/stores/contract";
import type { SchemaInfo } from "lib/stores/schema";
import type {
  BechAddr20,
  BechAddr32,
  JsonDataType,
  Option,
  RpcQueryError,
} from "lib/types";
import {
  encode,
  getCurrentDate,
  getDefaultMsg,
  isNonEmptyJsonData,
  jsonValidate,
} from "lib/utils";

import { SchemaQueryResponse } from "./SchemaQueryResponse";

const WasmCodeSnippet = dynamic(
  () => import("lib/components/modal/WasmCodeSnippet"),
  {
    ssr: false,
  }
);

interface SchemaQueryComponentProps {
  msgSchema: SchemaInfo;
  resSchema: SchemaInfo;
  contractAddress: BechAddr32;
  lcdEndpoint: string;
  walletAddress: Option<BechAddr20>;
  initialMsg: JsonDataType;
  opened: boolean;
  addActivity: (activity: Activity) => void;
}

export const SchemaQueryComponent = ({
  msgSchema,
  resSchema,
  contractAddress,
  lcdEndpoint,
  walletAddress,
  initialMsg,
  opened,
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
      enabled: !msgSchema.inputRequired && opened,
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
          sender: walletAddress,
          contractAddress,
          msg: encode(msg),
          timestamp: currentDate,
        });
        trackActionQuery(
          AmpEvent.ACTION_QUERY,
          "schema",
          Boolean(msgSchema.inputRequired)
        );
      },
      onError(err: AxiosError<RpcQueryError>) {
        setQueryError(err.response?.data.message || DEFAULT_RPC_ERROR);
        setTimestamp(undefined);
        setRes("");
      },
    }
  );

  const handleQuery = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (isNonEmptyJsonData(initialMsg)) {
      setMsg(JSON.stringify(initialMsg));
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
                <WasmCodeSnippet
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
            {/* TODO: refactor query response */}
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
            <SchemaQueryResponse
              res={res}
              resTab={resTab}
              msgSchema={msgSchema}
              resSchema={resSchema}
              timestamp={timestamp}
              isRefetching={queryFetching || queryRefetching}
            />
            {!msgSchema.inputRequired ? (
              <Flex gap={2} justify="flex-start" mt={3}>
                <CopyButton
                  isDisable={msg === ""}
                  value={msg}
                  amptrackSection="query_msg"
                  buttonText="Copy QueryMsg"
                />
                <WasmCodeSnippet
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
                    onClick={() => {
                      handleQuery();
                      track(AmpEvent.USE_JSON_QUERY_AGAIN);
                    }}
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
