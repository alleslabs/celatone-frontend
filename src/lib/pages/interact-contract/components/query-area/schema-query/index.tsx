import type { BechAddr32, CodeSchema, Nullish, Option } from "lib/types";

import { Accordion, Button, Flex, Text } from "@chakra-ui/react";
import { trackUseExpandAll } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { UploadSchema } from "lib/components/json-schema";
import { EmptyState, StateImage } from "lib/components/state";
import { useContractStore } from "lib/providers/store";
import { getQuerySchema, resolveInitialMsg } from "lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

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
      schema?.filter((querySchema) =>
        querySchema[0].title?.toLowerCase().includes(keyword.toLowerCase())
      ),
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
        alignItems="center"
        bgColor="gray.900"
        borderRadius="8px"
        direction="column"
        p="24px 16px"
      >
        <Flex alignItems="center" direction="column">
          <StateImage imageVariant="not-found" imageWidth="128px" />
          <Text fontWeight={700} mt={2} variant="body1">
            {verifiedSchema ? "Verified" : "Attached"} JSON schema doesn’t have
            QueryMsg
          </Text>
          {!verifiedSchema && (
            <>
              <Text
                fontWeight={500}
                mb={4}
                mt={2}
                textColor="text.disabled"
                variant="body2"
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
          placeholder="Search by query message"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          minH="40px"
          rightIcon={
            <CustomIcon
              boxSize={3}
              name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              right={0}
            />
          }
          variant="outline-gray"
          onClick={() => {
            trackUseExpandAll(expandedIndexes.length ? "collapse" : "expand");
            setExpandedIndexes((prev) =>
              prev.length ? [] : Array.from(Array(schema.length).keys())
            );
          }}
        >
          {expandedIndexes.length ? "Collapse all" : "Expand all"}
        </Button>
      </Flex>
      {filteredMsgs?.length ? (
        <Accordion
          allowMultiple
          display="flex"
          flexDir="column"
          index={expandedIndexes}
          rowGap={4}
          sx={{ ".chakra-accordion__icon": { color: "gray.600" } }}
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
          ref={accordionRef}
        >
          {filteredMsgs.map(([msg, res], idx) => (
            <SchemaQueryComponent
              key={JSON.stringify(msg.schema) + JSON.stringify(res)}
              addActivity={addActivity}
              contractAddress={contractAddress}
              initialMsg={resolveInitialMsg(initialMsg, msg)}
              msgSchema={msg}
              opened={expandedIndexes.includes(idx)}
              resSchema={res}
              walletAddress={address}
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
