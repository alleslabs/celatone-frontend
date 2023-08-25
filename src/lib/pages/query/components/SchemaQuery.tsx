import { Accordion, Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useBaseApiRoute, useCurrentChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { useContractStore } from "lib/providers/store";
import { AmpTrackExpandAll } from "lib/services/amplitude";
import type { QueryExecuteSchema, QuerySchema } from "lib/stores/schema";
import type { ContractAddr } from "lib/types";
import { parseSchemaInitialData } from "lib/utils";

import { SchemaQueryComponent } from "./SchemaQueryComponent";

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
          `.query_msg_${schema[msgIndex][0].schema.required?.[0]}`
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
          rightIcon={
            <CustomIcon
              name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              boxSize={3}
              right={0}
            />
          }
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
            <SchemaQueryComponent
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
