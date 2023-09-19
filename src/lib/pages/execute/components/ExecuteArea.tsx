import { Box, Flex, Heading, TabList, Tabs } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import {
  MessageInputContent,
  MessageTabs,
  UploadSchemaSection,
} from "lib/components/json-schema";
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

export const ExecuteArea = observer(
  ({
    contractAddress,
    initialMsg,
    initialFunds,
    codeHash,
    codeId,
  }: ExecuteAreaProps) => {
    const [tab, setTab] = useState<MessageTabs>();
    const { getExecuteSchema } = useSchemaStore();
    const schema = getExecuteSchema(codeHash);

    const currentTabIdx = tab ? Object.values(MessageTabs).indexOf(tab) : 0;

    useEffect(() => {
      if (!schema) setTab(MessageTabs.JSON_INPUT);
      else setTab(MessageTabs.YOUR_SCHEMA);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(schema)]);

    return (
      <Box my={4}>
        <Heading variant="h6" as="h6" mt={8} mb={4}>
          Execute Message
        </Heading>
        <Tabs isLazy lazyBehavior="keepMounted" index={currentTabIdx}>
          <TabList mb={8} borderBottom="1px" borderColor="gray.800">
            <CustomTab onClick={() => setTab(MessageTabs.JSON_INPUT)}>
              JSON Input
            </CustomTab>
            <CustomTab
              onClick={() => setTab(MessageTabs.YOUR_SCHEMA)}
              isDisabled={!contractAddress}
            >
              Your Schema
            </CustomTab>
          </TabList>
        </Tabs>
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
              <UploadSchemaSection
                codeId={codeId}
                codeHash={codeHash}
                title={
                  <Flex flexDirection="column" alignItems="center">
                    <Flex display="inline" textAlign="center">
                      You haven&#39;t attached the JSON Schema for
                      <CustomIcon name="code" mx={1} color="gray.400" />
                      code {codeId} yet
                    </Flex>
                    <Flex textAlign="center">
                      from which this contract is instantiated yet.
                    </Flex>
                  </Flex>
                }
              />
            )
          }
        />
      </Box>
    );
  }
);
