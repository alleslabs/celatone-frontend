import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  MessageInputContent,
  MessageInputSwitch,
  MessageTabs,
} from "lib/components/json-schema";
import { EmptyState } from "lib/components/state";
import { useSchemaStore } from "lib/providers/store";
import type { ContractAddr } from "lib/types";

import { JsonQuery } from "./JsonQuery";
import { SchemaQuery } from "./SchemaQuery";

interface QueryAreaProps {
  contractAddress: ContractAddr;
  codeId: string;
  codeHash: string;
  initialMsg: string;
}

export const QueryArea = ({
  contractAddress,
  codeId,
  codeHash,
  initialMsg,
}: QueryAreaProps) => {
  const [tab, setTab] = useState<MessageTabs>();

  const { getQuerySchema, getSchemaByCodeHash } = useSchemaStore();
  const schema = getQuerySchema(codeHash);
  const attached = Boolean(getSchemaByCodeHash(codeHash));

  const tooltipLabel = (() => {
    if (!codeId) return "Please select contract first.";

    if (!attached)
      return `
          You haven’t attached the JSON Schema for
          code ${codeId} yet
       `;

    return "Attached JSON Schema doesn’t have query message.";
  })();

  useEffect(() => {
    if (!schema) setTab(MessageTabs.JSON_INPUT);
    else setTab(MessageTabs.YOUR_SCHEMA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(schema)]);

  return (
    <>
      <Flex align="center" my={8}>
        <Heading variant="h6" as="h6" mr={2}>
          Query Message
        </Heading>
        <MessageInputSwitch
          currentTab={tab}
          onTabChange={setTab}
          disabled={!schema}
          tooltipLabel={tooltipLabel}
        />
      </Flex>
      <MessageInputContent
        currentTab={tab}
        jsonContent={
          <JsonQuery
            contractAddress={contractAddress}
            initialMsg={initialMsg}
          />
        }
        schemaContent={
          codeHash && schema ? (
            <SchemaQuery
              schema={schema}
              contractAddress={contractAddress}
              initialMsg={initialMsg}
            />
          ) : (
            <EmptyState
              imageVariant="not-found"
              message="We are currently unable to retrieve the JSON schema due to
            the absence of a code hash linked to the selected contract. Please try again."
              withBorder
            />
          )
        }
      />
    </>
  );
};
