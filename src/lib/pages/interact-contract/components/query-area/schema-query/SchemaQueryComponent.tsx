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
import type { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track, trackActionQuery } from "lib/amplitude";
import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import {
  JsonSchemaForm,
  MessageInputSwitch,
  OutputMessageTabs,
} from "lib/components/json-schema";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractQueryLcd } from "lib/services/wasm/contract";
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
  addActivity: (activity: Activity) => void;
  contractAddress: BechAddr32;
  initialMsg: JsonDataType;
  msgSchema: SchemaInfo;
  opened: boolean;
  resSchema: SchemaInfo;
  walletAddress: Option<BechAddr20>;
}

export const SchemaQueryComponent = ({
  addActivity,
  contractAddress,
  initialMsg,
  msgSchema,
  opened,
  resSchema,
  walletAddress,
}: SchemaQueryComponentProps) => {
  const [resTab, setResTab] = useState<Option<OutputMessageTabs>>(
    OutputMessageTabs.YOUR_SCHEMA
  );
  const [msg, setMsg] = useState(JSON.stringify(getDefaultMsg(msgSchema)));
  const [res, setRes] = useState("");
  const [queryError, setQueryError] = useState("");
  const [timestamp, setTimestamp] = useState<Date>();

  const { isFetching, refetch } = useContractQueryLcd(contractAddress, msg, {
    cacheTime: 0,
    enabled: !msgSchema.inputRequired && opened,
    onError: (err) => {
      setQueryError(
        (err as AxiosError<RpcQueryError>).response?.data.message ||
          DEFAULT_RPC_ERROR
      );
      setTimestamp(undefined);
      setRes("");
    },
    onSuccess: (data) => {
      const currentDate = getCurrentDate();
      setQueryError("");
      setRes(JSON.stringify(data, null, 2));
      setTimestamp(currentDate);
      addActivity({
        action: msgSchema.title ?? "Unknown",
        contractAddress,
        msg: encode(msg),
        sender: walletAddress,
        timestamp: currentDate,
        type: "query",
      });
    },
    retry: false,
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
          columnGap={6}
          templateColumns={msgSchema.inputRequired ? "1fr 1fr" : "1fr"}
        >
          {msgSchema.inputRequired && (
            <GridItem>
              <Text variant="body2" color="text.dark" fontWeight={700}>
                Query Input
              </Text>
              <JsonSchemaForm
                schema={msgSchema.schema}
                formId={`query-${msgSchema.title}`}
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
                  message={msg}
                  type="query"
                  contractAddress={contractAddress}
                />
                <Button
                  isDisabled={jsonValidate(msg) !== null}
                  ml="auto"
                  size="sm"
                  variant="primary"
                  isLoading={isFetching}
                  leftIcon={<CustomIcon name="query" />}
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
                <Text variant="body2" color="text.dark" fontWeight={700}>
                  Return Output
                </Text>
                <Text variant="body3" textColor="text.dark">
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
              msgSchema={msgSchema}
              res={res}
              resSchema={resSchema}
              resTab={resTab}
              timestamp={timestamp}
              isLoading={isFetching}
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
                  message={JSON.stringify({ [msgSchema.title ?? ""]: {} })}
                  type="query"
                  contractAddress={contractAddress}
                />
                <Flex gap={2} ml="auto">
                  <CopyButton
                    isDisable={res === "" || Boolean(queryError)}
                    value={res}
                    amptrackSection="query_response"
                    buttonText="Copy Output"
                  />
                  <Button
                    isDisabled={jsonValidate(msg) !== null}
                    ml="auto"
                    size="sm"
                    variant="primary"
                    isLoading={isFetching}
                    leftIcon={<CustomIcon name="query" />}
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
