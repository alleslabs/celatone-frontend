import type { AxiosError } from "axios";
import type { Activity } from "lib/stores/contract";
import type {
  BechAddr20,
  BechAddr32,
  JsonDataType,
  Option,
  RpcQueryError,
  SchemaInfo,
} from "lib/types";

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
import { AmpEvent, track, trackActionQuery } from "lib/amplitude";
import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import {
  JsonSchemaForm,
  MessageInputSwitch,
  OutputMessageTabs,
} from "lib/components/json-schema";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractQueryRest } from "lib/services/wasm/contract";
import {
  encode,
  getCurrentDate,
  getDefaultMsg,
  isNonEmptyJsonData,
  jsonValidate,
} from "lib/utils";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

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
  walletAddress: Option<BechAddr20>;
  initialMsg: JsonDataType;
  opened: boolean;
  addActivity: (activity: Activity) => void;
}

export const SchemaQueryComponent = ({
  msgSchema,
  resSchema,
  contractAddress,
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

  const { refetch, isFetching } = useContractQueryRest(contractAddress, msg, {
    enabled: !msgSchema.inputRequired && opened,
    retry: false,
    cacheTime: 0,
    onSuccess: (data) => {
      const currentDate = getCurrentDate();
      setQueryError("");
      setRes(JSON.stringify(data, null, 2));
      setTimestamp(currentDate);
      addActivity({
        type: "query",
        action: msgSchema.title ?? "Unknown",
        sender: walletAddress,
        contractAddress,
        msg: encode(msg),
        timestamp: currentDate,
      });
    },
    onError: (err) => {
      setQueryError(
        (err as AxiosError<RpcQueryError>).response?.data.message ||
          DEFAULT_RPC_ERROR
      );
      setTimestamp(undefined);
      setRes("");
    },
  });

  const handleQuery = useCallback(() => {
    trackActionQuery(
      AmpEvent.ACTION_QUERY,
      "schema",
      Boolean(msgSchema.inputRequired)
    );
    refetch();
  }, [msgSchema.inputRequired, refetch]);

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
          <Box textAlign="start" w="full">
            <Text fontWeight={700} variant="body1">
              {msgSchema.title}
            </Text>
            <Text textColor="text.dark" variant="body3">
              {msgSchema.description}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Grid
          columnGap={6}
          templateColumns={msgSchema.inputRequired ? "1fr 1fr" : "1fr"}
        >
          {msgSchema.inputRequired && (
            <GridItem>
              <Text color="text.dark" fontWeight={700} variant="body2">
                Query Input
              </Text>
              <JsonSchemaForm
                formId={`query-${msgSchema.title}`}
                initialFormData={initialMsg}
                schema={msgSchema.schema}
                onChange={(data) => setMsg(JSON.stringify(data))}
              />
              <Flex gap={2} justify="flex-start">
                <CopyButton
                  amptrackSection="query_msg"
                  buttonText="Copy QueryMsg"
                  isDisable={msg === ""}
                  value={msg}
                />
                <WasmCodeSnippet
                  contractAddress={contractAddress}
                  message={msg}
                  type="query"
                />
                <Button
                  isDisabled={jsonValidate(msg) !== null}
                  isLoading={isFetching}
                  leftIcon={<CustomIcon name="query" />}
                  ml="auto"
                  size="sm"
                  variant="primary"
                  onClick={handleQuery}
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
                <Text color="text.dark" fontWeight={700} variant="body2">
                  Return Output
                </Text>
                <Text textColor="text.dark" variant="body3">
                  {resSchema.description}
                </Text>
              </Flex>
              <MessageInputSwitch
                currentTab={resTab}
                isOutput
                ml="auto"
                onTabChange={setResTab}
              />
            </Flex>
            {queryError && (
              <Alert alignItems="center" mb={3} variant="error">
                <AlertDescription wordBreak="break-word">
                  {queryError}
                </AlertDescription>
              </Alert>
            )}
            <SchemaQueryResponse
              isLoading={isFetching}
              msgSchema={msgSchema}
              res={res}
              resSchema={resSchema}
              resTab={resTab}
              timestamp={timestamp}
            />
            {!msgSchema.inputRequired ? (
              <Flex gap={2} justify="flex-start" mt={3}>
                <CopyButton
                  amptrackSection="query_msg"
                  buttonText="Copy QueryMsg"
                  isDisable={msg === ""}
                  value={msg}
                />
                <WasmCodeSnippet
                  contractAddress={contractAddress}
                  message={JSON.stringify({ [msgSchema.title ?? ""]: {} })}
                  type="query"
                />
                <Flex gap={2} ml="auto">
                  <CopyButton
                    amptrackSection="query_response"
                    buttonText="Copy Output"
                    isDisable={res === "" || Boolean(queryError)}
                    value={res}
                  />
                  <Button
                    isDisabled={jsonValidate(msg) !== null}
                    isLoading={isFetching}
                    leftIcon={<CustomIcon name="query" />}
                    ml="auto"
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      handleQuery();
                      track(AmpEvent.USE_JSON_QUERY_AGAIN);
                    }}
                  >
                    Query Again
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <CopyButton
                amptrackSection="query_response"
                buttonText="Copy Output"
                isDisable={res === "" || Boolean(queryError)}
                value={res}
              />
            )}
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};
