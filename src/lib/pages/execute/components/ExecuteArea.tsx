import { Box, Flex, Heading } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useState, useEffect } from "react";

import {
  MessageInputContent,
  MessageInputSwitch,
  MessageTabs,
} from "lib/components/json-schema";
import { EmptyState } from "lib/components/state";
import { useSchemaStore } from "lib/providers/store";
import type { ContractAddr } from "lib/types";

import { JsonExecute } from "./JsonExecute";
import { SchemaExecute } from "./schema-execute";

interface ExecuteAreaProps {
  contractAddress: ContractAddr;
  initialMsg: string;
  initialFunds: Coin[];
  codeId: string;
  codeHash: string;
}

export const ExecuteArea = ({
  contractAddress,
  initialMsg,
  initialFunds,
  codeHash,
  codeId,
}: ExecuteAreaProps) => {
  const [tab, setTab] = useState(MessageTabs.JSON_INPUT);

  const { getExecuteSchema, getSchemaByCodeHash } = useSchemaStore();
  const schema = getExecuteSchema(codeHash);
  const attached = Boolean(getSchemaByCodeHash(codeHash));

  const tooltipLabel = (() => {
    if (!codeId) return "Please select contract first.";

    if (!attached)
      return `You haven't attached the JSON Schema for code id ${codeId}. \n To use the schema, please add it on the code detail page.`;

    return "Attached JSON Schema doesn’t have execute message.";
  })();

  useEffect(() => {
    if (!schema) setTab(MessageTabs.JSON_INPUT);
    else setTab(MessageTabs.YOUR_SCHEMA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(schema)]);

  return (
    <Box my={4}>
      <Flex align="center" my={8}>
        <Heading variant="h6" as="h6" mr={2}>
          Execute Message
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
          <JsonExecute
            contractAddress={contractAddress}
            initialFunds={initialFunds}
            initialMsg={initialMsg}
          />
        }
        schemaContent={
          codeHash && schema ? (
            <SchemaExecute
              schema={schema}
              contractAddress={contractAddress}
              initialFunds={initialFunds}
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
    </Box>
  );
};
