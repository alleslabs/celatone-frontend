import { Box, Flex, Heading, TabList, Tabs } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";

import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import {
  MessageInputContent,
  MessageTabs,
  UploadSchemaSection,
} from "lib/components/json-schema";
import { Tooltip } from "lib/components/Tooltip";
import { useSchemaStore } from "lib/providers/store";
import type { BechAddr32, Option } from "lib/types";

import { JsonExecute } from "./JsonExecute";
import { SchemaExecute } from "./schema-execute";

interface ExecuteAreaProps {
  contractAddress: BechAddr32;
  initialMsg: string;
  initialFunds: Coin[];
  codeId: Option<number>;
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
    const { getExecuteSchema, getSchemaByCodeHash } = useSchemaStore();
    const schema = getExecuteSchema(codeHash);
    const attached = Boolean(getSchemaByCodeHash(codeHash));
    const currentTabIdx = tab ? Object.values(MessageTabs).indexOf(tab) : 0;

    const handleTabChange = useCallback(
      (nextTab: MessageTabs) => {
        if (nextTab === tab) return;
        trackUseTab(nextTab);
        setTab(nextTab);
      },
      [tab]
    );

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
            <CustomTab onClick={() => handleTabChange(MessageTabs.JSON_INPUT)}>
              JSON Input
            </CustomTab>
            <CustomTab
              onClick={() => handleTabChange(MessageTabs.YOUR_SCHEMA)}
              isDisabled={!contractAddress}
            >
              <Tooltip
                label="Please select contract first"
                isDisabled={Boolean(contractAddress)}
              >
                Your Schema
              </Tooltip>
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
            codeId && (
              <>
                {codeHash && attached ? (
                  <SchemaExecute
                    codeId={codeId}
                    codeHash={codeHash}
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
                          code {codeId}
                        </Flex>
                        <Flex textAlign="center">
                          from which this contract is instantiated yet.
                        </Flex>
                      </Flex>
                    }
                  />
                )}
              </>
            )
          }
        />
      </Box>
    );
  }
);
