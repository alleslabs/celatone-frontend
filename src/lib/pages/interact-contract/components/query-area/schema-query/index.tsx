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
  verifiedSchema: Nullish<CodeSchema>;
  localSchema: Option<CodeSchema>;
  contractAddress: BechAddr32;
  initialMsg: string;
  codeId: number;
  codeHash: string;
}

export const SchemaQuery = ({
  verifiedSchema,
  localSchema,
  contractAddress,
  initialMsg,
  codeId,
  codeHash,
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
      } catch {
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
            {verifiedSchema ? "Verified" : "Attached"} JSON Schema doesn’t have
            QueryMsg
          </Text>
          {!verifiedSchema && (
            <>
              <Text
                variant="body2"
                textColor="text.disabled"
                fontWeight={500}
                mt={2}
                mb={4}
              >
                Please fill in Query Message manually or change the schema
              </Text>
              <UploadSchema
                attached
                localSchema={localSchema}
                codeId={codeId}
                codeHash={codeHash}
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
          placeholder="Search by Query Message"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="md"
          amptrackSection="query-message-search"
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
            trackUseExpandAll(expandedIndexes.length ? "collapse" : "expand");
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
          {filteredMsgs.map(([msg, res], idx) => (
            <SchemaQueryComponent
              key={JSON.stringify(msg.schema) + JSON.stringify(res)}
              msgSchema={msg}
              resSchema={res}
              contractAddress={contractAddress}
              walletAddress={address}
              initialMsg={resolveInitialMsg(initialMsg, msg)}
              addActivity={addActivity}
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
