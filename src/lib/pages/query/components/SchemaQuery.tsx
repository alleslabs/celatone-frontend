import {
  Accordion,
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
import type { RJSFSchema } from "@rjsf/utils";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { encode } from "js-base64";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
} from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { JsonSchemaForm } from "lib/components/json-schema";
import { EmptyState } from "lib/components/state";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractStore } from "lib/providers/store";
import { AmpTrack, AmpEvent, AmpTrackExpandAll } from "lib/services/amplitude";
import { queryData } from "lib/services/contract";
import type { Activity } from "lib/stores/contract";
import type { QueryExecuteSchema, QuerySchema } from "lib/stores/schema";
import type { ContractAddr, HumanAddr, Option, RpcQueryError } from "lib/types";
import {
  getCurrentDate,
  jsonValidate,
  parseSchemaInitialData,
} from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface QueryComponentInterface {
  msgSchema: QueryExecuteSchema;
  resSchema: RJSFSchema;
  contractAddress: ContractAddr;
  lcdEndpoint: string;
  walletAddress: Option<string>;
  initialMsg: Record<string, unknown>;
  addActivity: (activity: Activity) => void;
}

const QueryComponent = ({
  msgSchema,
  resSchema,
  contractAddress,
  lcdEndpoint,
  walletAddress,
  initialMsg,
  addActivity,
}: QueryComponentInterface) => {
  const [msg, setMsg] = useState("{}");
  const [res, setRes] = useState("{}");
  const [queryError, setQueryError] = useState("");

  useEffect(() => {
    if (Object.keys(initialMsg).length) setMsg(JSON.stringify(initialMsg));
  }, [initialMsg]);

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
    async () =>
      queryData(
        lcdEndpoint,
        contractAddress,
        msgSchema.inputRequired
          ? msg
          : JSON.stringify({ [msgSchema.title ?? ""]: {} })
      ),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        setQueryError("");
        setRes(JSON.stringify(data.data, null, 2));
        addActivity({
          type: "query",
          action: msgSchema.title ?? "Unknown",
          sender: walletAddress as HumanAddr,
          contractAddress,
          msg: encode(msg),
          timestamp: getCurrentDate(),
        });
      },
      onError(err: AxiosError<RpcQueryError>) {
        setQueryError(err.response?.data.message || DEFAULT_RPC_ERROR);
      },
    }
  );

  const handleQuery = useCallback(() => {
    AmpTrack(AmpEvent.ACTION_QUERY);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!msgSchema.inputRequired) refetch();
  }, [msgSchema.inputRequired, refetch]);

  return (
    <AccordionItem className={`msg-${msgSchema.schema.required?.[0]}`}>
      <h6>
        <AccordionButton p={4}>
          <Box w="full" textAlign="start">
            <Text variant="body1" fontWeight={700}>
              {msgSchema.title}
            </Text>
            <Text variant="body1">{msgSchema.description}</Text>
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
                onChange={(data) => setMsg(JSON.stringify(data))}
                initialFormData={initialMsg}
              />
              <Flex gap={2} justify="flex-start">
                <CopyButton
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
            <Flex align="center" gap={2} mb={3}>
              <Text variant="body1" fontWeight={700}>
                Return Output
              </Text>
              <Text variant="body3" color="text.dark">
                Query response will display here
              </Text>
              <CopyButton
                isDisable={res === "{}" || Boolean(queryError)}
                value={res}
                amptrackSection="query_response"
                buttonText="Copy Output"
                ml="auto"
              />
            </Flex>
            {queryError && (
              <Alert variant="error" mb={3} alignItems="center">
                <AlertDescription wordBreak="break-word">
                  {queryError}
                </AlertDescription>
              </Alert>
            )}
            <Box bg="gray.800" p={4} borderRadius="8px">
              <JsonSchemaForm
                formId={`response-${msgSchema.title}`}
                schema={resSchema}
                initialFormData={parseSchemaInitialData(res)}
              />
            </Box>
            {!msgSchema.inputRequired && (
              <Flex gap={2} justify="flex-start" mt={3}>
                <CopyButton
                  value={JSON.stringify({ [msgSchema.title ?? ""]: {} })}
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
                    isDisable={res === "{}" || Boolean(queryError)}
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

interface SchemaQueryProps {
  schema: QuerySchema;
  contractAddress: ContractAddr;
  initialMsg: string;
}

const resolveInitialMsg = (
  initialMsg: string,
  msgSchema: QueryExecuteSchema
) => {
  const parsed = parseSchemaInitialData(initialMsg);
  return Object.keys(parsed)[0] === msgSchema.schema.required?.[0]
    ? parsed
    : {};
};

export const SchemaQuery = ({
  schema,
  contractAddress,
  initialMsg,
}: SchemaQueryProps) => {
  const { addActivity } = useContractStore();
  const { address } = useCurrentChain();
  const lcdEndpoint = useBaseApiRoute("rest");

  const accordionRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const filteredMsgs = useMemo(
    () =>
      schema?.filter((querySchema) => querySchema[0].title?.includes(keyword)),
    [schema, keyword]
  );

  useEffect(() => {
    if (schema && initialMsg && accordionRef.current) {
      try {
        const parsedMsg = JSON.parse(initialMsg);
        const msgIndex = schema.findIndex(
          ([msg]) => msg.schema.required?.[0] === Object.keys(parsedMsg)[0]
        );
        setExpandedIndexes((prev) =>
          prev.includes(msgIndex) ? prev : prev.concat(msgIndex)
        );
        const el = document.querySelector(
          `.msg-${schema[msgIndex][0].schema.required?.[0]}`
        );
        // TODO: This is a workaround, refactor to a proper solution later
        const timeoutId = setTimeout(() => el?.scrollIntoView(), 200);
        return () => clearInterval(timeoutId);
      } catch (_) {
        //
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, initialMsg, accordionRef.current]);

  return (
    <>
      <Flex gap={6} mb={6}>
        <InputWithIcon
          placeholder="Search by command"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          action="query-message-search"
        />
        <Button
          variant="outline-gray"
          rightIcon={<CustomIcon name="chevron-down" boxSize={3} />}
          minH="40px"
          onClick={() => {
            AmpTrackExpandAll(expandedIndexes.length ? "collapse" : "expand");
            setExpandedIndexes((prev) =>
              prev.length ? [] : Array.from(Array(schema.length).keys())
            );
          }}
        >
          {expandedIndexes.length ? "Collapse All" : "Expand All"}
        </Button>
      </Flex>
      {filteredMsgs?.length ? (
        <Accordion
          ref={accordionRef}
          allowMultiple
          rowGap={4}
          display="flex"
          flexDir="column"
          index={expandedIndexes}
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
          sx={{ ".chakra-accordion__icon": { color: "gray.600" } }}
        >
          {filteredMsgs.map(([msg, res]) => (
            <QueryComponent
              key={JSON.stringify(msg.schema) + JSON.stringify(res)}
              msgSchema={msg}
              resSchema={res}
              contractAddress={contractAddress}
              lcdEndpoint={lcdEndpoint}
              walletAddress={address}
              initialMsg={resolveInitialMsg(initialMsg, msg)}
              addActivity={addActivity}
            />
          ))}
        </Accordion>
      ) : (
        <EmptyState
          imageVariant="not-found"
          message="No matched message found."
        />
      )}
    </>
  );
};
