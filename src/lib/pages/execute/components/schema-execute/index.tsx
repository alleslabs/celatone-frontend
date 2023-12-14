import { Accordion, Button, Flex, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useEffect, useMemo, useRef, useState } from "react";

import { trackUseExpandAll } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { UploadSchema } from "lib/components/json-schema";
import { EmptyState, StateImage } from "lib/components/state";
import { useSchemaStore } from "lib/providers/store";
import type { ExecuteSchema } from "lib/stores/schema";
import type { ContractAddr, Option } from "lib/types";
import { getDefaultMsg, resolveInitialMsg } from "lib/utils";

import { ExecuteBox } from "./ExecuteBox";

interface SchemaExecuteProps {
  schema: Option<ExecuteSchema>;
  contractAddress: ContractAddr;
  initialMsg: string;
  initialFunds: Coin[];
  codeId: string;
  codeHash: string;
}

export const SchemaExecute = ({
  contractAddress,
  schema,
  initialMsg,
  initialFunds,
  codeId,
  codeHash,
}: SchemaExecuteProps) => {
  // ------------------------------------------//
  // -----------------REFERENCE----------------//
  // ------------------------------------------//
  const accordionRef = useRef<HTMLDivElement>(null);
  const { getSchemaByCodeHash } = useSchemaStore();
  const fullSchema = getSchemaByCodeHash(codeHash);
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

    return schema?.filter((msg) => msg.title?.includes(keyword));
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

  if (!schema)
    return (
      <Flex
        p="24px 16px"
        direction="column"
        alignItems="center"
        bgColor="gray.900"
        borderRadius="8px"
      >
        <Flex direction="column" alignItems="center">
          <StateImage imageVariant="not-found" imageWidth="128px" />
          <Text variant="body1" fontWeight={700} mt={2}>
            Attached JSON Schema doesn’t have ExecuteMsg
          </Text>
          <Text
            variant="body2"
            textColor="text.disabled"
            fontWeight={500}
            mt={2}
            mb={4}
          >
            Please fill in Execute Message manually or change the schema
          </Text>
          <UploadSchema
            attached
            schema={fullSchema}
            codeId={codeId}
            codeHash={codeHash}
          />
        </Flex>
      </Flex>
    );

  return (
    <>
      <Flex gap={6} mb={6}>
        <InputWithIcon
          placeholder="Search with Execute Message"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size={{ base: "md", md: "lg" }}
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
            trackUseExpandAll(expandedIndexes.length ? "collapse" : "expand");
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
            const parsed = resolveInitialMsg(initialMsg, msgSchema);
            return (
              <ExecuteBox
                key={msgSchema.title}
                msgSchema={msgSchema}
                contractAddress={contractAddress}
                initialMsg={parsed}
                initialFunds={
                  JSON.stringify(parsed) !==
                  JSON.stringify(getDefaultMsg(msgSchema))
                    ? initialFunds
                    : []
                }
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
