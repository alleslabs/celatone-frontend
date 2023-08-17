import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import type { RJSFSchema } from "@rjsf/utils";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { encode } from "js-base64";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
} from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { JsonSchemaForm } from "lib/components/json-schema";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractStore } from "lib/providers/store";
import { AmpTrack, AmpEvent, AmpTrackExpandAll } from "lib/services/amplitude";
import { queryData } from "lib/services/contract";
import type { Activity } from "lib/stores/contract";
import type { QueryExecuteSchema, QuerySchema } from "lib/stores/schema";
import type { ContractAddr, HumanAddr, Option, RpcQueryError } from "lib/types";
import { getCurrentDate, jsonValidate } from "lib/utils";

const CodeSnippet = dynamic(() => import("lib/components/modal/CodeSnippet"), {
  ssr: false,
});

interface QueryComponentInterface {
  msgSchema: QueryExecuteSchema;
  resSchema: RJSFSchema;
  contractAddress: ContractAddr;
  lcdEndpoint: string;
  walletAddress: Option<string>;
  addActivity: (activity: Activity) => void;
}

const QueryComponent = ({
  msgSchema,
  resSchema,
  contractAddress,
  lcdEndpoint,
  walletAddress,
  addActivity,
}: QueryComponentInterface) => {
  const [msg, setMsg] = useState("{}");
  const [res, setRes] = useState("{}");
  // console.log(JSON.stringify({ [msgSchema.title]: {} }));
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
        setRes(err.response?.data.message || DEFAULT_RPC_ERROR);
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
    <AccordionItem p={4}>
      <h6>
        <AccordionButton>
          <Box w="full" textAlign="start">
            <Text variant="body1" fontWeight={700}>
              {msgSchema.title}
            </Text>
            <Text variant="body1">{msgSchema.description}</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel py={4} px={0}>
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
              />
              <Flex gap={2} justify="flex-start">
                <CopyButton
                  isDisable={!msg.length}
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
            <Box bg="gray.800" p={4} borderRadius="8px">
              <JsonSchemaForm
                formId={`response-${msgSchema.title}`}
                schema={resSchema}
                initialFormData={JSON.parse(res)}
              />
            </Box>
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};

interface SchemaQueryProps {
  schema: Option<QuerySchema>;
  contractAddress: ContractAddr;
}

export const SchemaQuery = ({ schema, contractAddress }: SchemaQueryProps) => {
  const { addActivity } = useContractStore();
  const { address } = useCurrentChain();
  const lcdEndpoint = useBaseApiRoute("rest");

  const [keyword, setKeyword] = useState("");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  if (!schema) return null;

  return (
    <>
      <Flex gap={6} mb={6}>
        <InputGroup>
          <Input
            autoComplete="off"
            placeholder="Search by command"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            h="40px"
          />
          <InputRightElement pointerEvents="none" h="full">
            <CustomIcon name="search" color="gray.600" />
          </InputRightElement>
        </InputGroup>
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
      <Accordion
        allowMultiple
        rowGap={4}
        display="flex"
        flexDir="column"
        index={expandedIndexes}
        onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
        sx={{ ".chakra-accordion__icon": { color: "gray.600" } }}
      >
        {schema
          .filter((querySchema) => querySchema[0].title?.includes(keyword))
          .map(([msg, res]) => (
            <QueryComponent
              key={JSON.stringify(msg.schema) + JSON.stringify(res)}
              msgSchema={msg}
              resSchema={res}
              contractAddress={contractAddress}
              lcdEndpoint={lcdEndpoint}
              walletAddress={address}
              addActivity={addActivity}
            />
          ))}
      </Accordion>
    </>
  );
};
