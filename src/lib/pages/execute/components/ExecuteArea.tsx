import { Box, Flex, Heading } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useState, useEffect } from "react";

import {
  MessageInputContent,
  MessageInputSwitch,
  MessageTabs,
} from "lib/components/json-schema";
import { EmptyState } from "lib/components/state";
import type { ExecuteSchema } from "lib/stores/schema";
import type { ContractAddr, Option } from "lib/types";

import { JsonExecute } from "./JsonExecute";
import { SchemaExecute } from "./schema-execute";

interface ExecuteAreaProps {
  contractAddress: ContractAddr;
  initialMsg: string;
  initialFunds: Coin[];
  codeId: string;
  codeHash: string;
  schema: Option<ExecuteSchema>;
}

export const ExecuteArea = ({
  contractAddress,
  initialMsg,
  initialFunds,
  codeHash,
  codeId,
  schema,
}: ExecuteAreaProps) => {
  const [tab, setTab] = useState(MessageTabs.JSON_INPUT);

  useEffect(() => {
    if (!schema) setTab(MessageTabs.JSON_INPUT);
    else setTab(MessageTabs.YOUR_SCHEMA);
  }, [schema]);

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
          tooltipLabel={
            codeId && !schema
              ? `You haven't attached the JSON Schema for code id ${codeId}. \n To use the schema, please add it on the code detail page.`
              : "Please select contract first."
          }
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
