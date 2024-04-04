import { Box, Flex, Heading, TabList, Tabs } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";

import { trackUseTab } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
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

import { JsonQuery } from "./JsonQuery";
import { SchemaQuery } from "./SchemaQuery";

interface QueryAreaProps {
  contractAddress: BechAddr32;
  codeId: Option<number>;
  codeHash: string;
  initialMsg: string;
}

export const QueryArea = observer(
  ({ contractAddress, codeId, codeHash, initialMsg }: QueryAreaProps) => {
    const [tab, setTab] = useState<MessageTabs>();

    const { getQuerySchema, getSchemaByCodeHash } = useSchemaStore();
    const schema = getQuerySchema(codeHash);
    const attached = Boolean(getSchemaByCodeHash(codeHash));
    const isMobile = useMobile();

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
        <Heading variant="h6" as="h6" mr={2} mt={8} mb={4}>
          Query Message
        </Heading>
        {!isMobile && (
          <Tabs isLazy lazyBehavior="keepMounted" index={currentTabIdx}>
            <TabList mb={8} borderBottom="1px" borderColor="gray.800">
              <CustomTab
                onClick={() => handleTabChange(MessageTabs.JSON_INPUT)}
              >
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
        )}
        <MessageInputContent
          currentTab={tab}
          jsonContent={
            <JsonQuery
              contractAddress={contractAddress}
              initialMsg={initialMsg}
            />
          }
          schemaContent={
            codeId && (
              <>
                {codeHash && attached ? (
                  <SchemaQuery
                    codeId={codeId}
                    codeHash={codeHash}
                    schema={schema}
                    contractAddress={contractAddress}
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
