import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  MessageInputContent,
  MessageInputSwitch,
  MessageTabs,
} from "lib/components/json-schema";
import type { QuerySchema } from "lib/stores/schema";
import type { ContractAddr, Option } from "lib/types";

import { JsonQuery } from "./JsonQuery";
import { SchemaQuery } from "./SchemaQuery";

interface QueryAreaProps {
  contractAddress: ContractAddr;
  schema: Option<QuerySchema>;
  initialMsg: string;
}

export const QueryArea = ({
  contractAddress,
  schema,
  initialMsg,
}: QueryAreaProps) => {
  const [tab, setTab] = useState(MessageTabs.JSON_INPUT);

  useEffect(() => {
    if (!schema) setTab(MessageTabs.JSON_INPUT);
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
          <SchemaQuery schema={schema} contractAddress={contractAddress} />
        }
      />
    </>
  );
};
