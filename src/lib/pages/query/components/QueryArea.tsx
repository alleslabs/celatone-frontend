import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  MessageInputContent,
  MessageInputSwitch,
  MessageTabs,
} from "lib/components/json-schema";
import { EmptyState } from "lib/components/state";
import type { QuerySchema } from "lib/stores/schema";
import type { ContractAddr, Option } from "lib/types";

import { JsonQuery } from "./JsonQuery";
import { SchemaQuery } from "./SchemaQuery";

interface QueryAreaProps {
  contractAddress: ContractAddr;
  codeId: string;
  codeHash: string;
  schema: Option<QuerySchema>;
  initialMsg: string;
}

export const QueryArea = ({
  contractAddress,
  codeId,
  codeHash,
  schema,
  initialMsg,
}: QueryAreaProps) => {
  const [tab, setTab] = useState(MessageTabs.JSON_INPUT);

  useEffect(() => {
    if (!schema) setTab(MessageTabs.JSON_INPUT);
    else {
      setTab(MessageTabs.YOUR_SCHEMA);
    }
  }, [schema]);

  return (
    <>
      <Flex align="center" justify="space-between" my={8}>
        <Heading variant="h6" as="h6">
          Query Message
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
