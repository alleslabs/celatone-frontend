import { Accordion, Button, Flex } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useEffect, useMemo, useRef, useState } from "react";

import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { AmpTrackExpandAll } from "lib/services/amplitude";
import type { ExecuteSchema } from "lib/stores/schema";
import type { ContractAddr } from "lib/types";
import { parseSchemaInitialData } from "lib/utils";

import { ExecuteBox } from "./ExecuteBox";

interface SchemaExecuteProps {
  contractAddress: ContractAddr;
  schema: ExecuteSchema;
  initialMsg: string;
  initialFunds: Coin[];
}

// TODO: add initialMsg and initialFunds
export const SchemaExecute = ({
  contractAddress,
  schema,
  initialMsg,
  initialFunds,
}: SchemaExecuteProps) => {
  // ------------------------------------------//
  // --------------------REF-------------------//
  // ------------------------------------------//
  const accordionRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------//
  // -------------------STATES-----------------//
  // ------------------------------------------//
  const [keyword, setKeyword] = useState("");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  // ------------------------------------------//
  // -------------------LOGICS-----------------//
  // ------------------------------------------//
  const filteredMsgs = useMemo(() => {
    if (!keyword) return schema;

    return schema.filter((msg) => msg.title?.includes(keyword));
  }, [keyword, schema]);

  // ------------------------------------------//
  // -------------------EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    if (schema && initialMsg && accordionRef.current) {
      try {
        const parsedMsg = JSON.parse(initialMsg);
        const msgIndex = schema.findIndex(
          (msg) => msg.schema.required?.[0] === Object.keys(parsedMsg)[0]
        );
        setExpandedIndexes((prev) =>
          prev.includes(msgIndex) ? prev : prev.concat(msgIndex)
        );
        const el = document.querySelector(
          `.execute_msg_${schema[msgIndex].schema.required?.[0]}`
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
          placeholder="Search with Execute Message"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          action="execute-message-search"
        />
        <Button
          variant="outline-gray"
          rightIcon={
            <CustomIcon
              name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              boxSize={3}
            />
          }
          minH="40px"
          onClick={() => {
            AmpTrackExpandAll(expandedIndexes.length ? "collapse" : "expand");
            setExpandedIndexes((prev) =>
              !prev.length ? Array.from(Array(schema.length).keys()) : []
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
          {filteredMsgs.map((msgSchema, idx) => {
            const parsed = parseSchemaInitialData(initialMsg);
            const hasPayload =
              Object.keys(parsed)[0] === msgSchema.schema.required?.[0];

            return (
              <ExecuteBox
                key={msgSchema.title}
                msgSchema={msgSchema}
                contractAddress={contractAddress}
                initialMsg={hasPayload ? parsed : {}}
                initialFunds={hasPayload ? initialFunds : []}
                opened={expandedIndexes.includes(idx)}
              />
            );
          })}
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
