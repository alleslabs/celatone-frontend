import { Accordion, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { trackUseExpandAll } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { UploadSchema } from "lib/components/json-schema";
import { EmptyState, StateImage } from "lib/components/state";
import { useContractStore } from "lib/providers/store";
import type { BechAddr32, CodeSchema, Nullish, Option } from "lib/types";
import { getQuerySchema, resolveInitialMsg } from "lib/utils";

import { SchemaQueryComponent } from "./SchemaQueryComponent";

interface SchemaQueryProps {
  codeHash: string;
  codeId: number;
  contractAddress: BechAddr32;
  initialMsg: string;
  localSchema: Option<CodeSchema>;
  verifiedSchema: Nullish<CodeSchema>;
}

export const SchemaQuery = ({
  codeHash,
  codeId,
  contractAddress,
  initialMsg,
  localSchema,
  verifiedSchema,
}: SchemaQueryProps) => {
  const { address } = useCurrentChain();
  const { addActivity } = useContractStore();

  const accordionRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const schema = getQuerySchema(verifiedSchema ?? localSchema);
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

  if (!schema)
    return (
      <Flex
        alignItems="center"
        p="24px 16px"
        bgColor="gray.900"
        borderRadius="8px"
        direction="column"
      >
        <Flex alignItems="center" direction="column">
          <StateImage imageWidth="128px" imageVariant="not-found" />
          <Text mt={2} variant="body1" fontWeight={700}>
            {verifiedSchema ? "Verified" : "Attached"} JSON Schema doesn’t have
            QueryMsg
          </Text>
          {!verifiedSchema && (
            <>
              <Text
                mb={4}
                mt={2}
                variant="body2"
                fontWeight={500}
                textColor="text.disabled"
              >
                Please fill in Query Message manually or change the schema
              </Text>
              <UploadSchema
                attached
                codeHash={codeHash}
                codeId={codeId}
                localSchema={localSchema}
              />
            </>
          )}
        </Flex>
      </Flex>
    );

  return (
    <>
      <Flex gap={6} mb={6}>
        <InputWithIcon
          size="md"
          value={keyword}
          amptrackSection="query-message-search"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by Query Message"
        />
        <Button
          minH="40px"
          variant="outline-gray"
          onClick={() => {
            trackUseExpandAll(expandedIndexes.length ? "collapse" : "expand");
            setExpandedIndexes((prev) =>
              prev.length ? [] : Array.from(Array(schema.length).keys())
            );
          }}
          rightIcon={
            <CustomIcon
              name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              right={0}
              boxSize={3}
            />
          }
        >
          {expandedIndexes.length ? "Collapse All" : "Expand All"}
        </Button>
      </Flex>
      {filteredMsgs?.length ? (
        <Accordion
          display="flex"
          flexDir="column"
          index={expandedIndexes}
          sx={{ ".chakra-accordion__icon": { color: "gray.600" } }}
          allowMultiple
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
          rowGap={4}
          ref={accordionRef}
        >
          {filteredMsgs.map(([msg, res], idx) => (
            <SchemaQueryComponent
              key={JSON.stringify(msg.schema) + JSON.stringify(res)}
              addActivity={addActivity}
              initialMsg={resolveInitialMsg(initialMsg, msg)}
              msgSchema={msg}
              resSchema={res}
              walletAddress={address}
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
