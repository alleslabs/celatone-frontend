import { Accordion, Button, Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { AmpTrackExpandAll } from "lib/services/amplitude";
import type { ExecuteSchema } from "lib/stores/schema";
import type { ContractAddr } from "lib/types";

import { ExecuteBox } from "./ExecuteBox";

interface SchemaExecuteProps {
  contractAddress: ContractAddr;
  schema: ExecuteSchema;
}

// TODO: add initialMsg and initialFunds
export const SchemaExecute = ({
  contractAddress,
  schema,
}: SchemaExecuteProps) => {
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
          rightIcon={<CustomIcon name="chevron-down" boxSize={3} />}
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
          allowMultiple
          rowGap={4}
          display="flex"
          flexDir="column"
          index={expandedIndexes}
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
          sx={{ ".chakra-accordion__icon": { color: "gray.600" } }}
        >
          {filteredMsgs.map((msgSchema, idx) => (
            <ExecuteBox
              key={msgSchema.title}
              msgSchema={msgSchema}
              contractAddress={contractAddress}
              opened={expandedIndexes.includes(idx)}
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
