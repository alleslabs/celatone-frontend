import { Flex, TabList, Tabs } from "@chakra-ui/react";
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
import type { BechAddr32, CodeSchema, Nullish, Option } from "lib/types";

import { JsonQuery } from "./JsonQuery";
import { SchemaQuery } from "./schema-query";

interface QueryAreaProps {
  verifiedSchema: Nullish<CodeSchema>;
  localSchema: Option<CodeSchema>;
  contractAddress: BechAddr32;
  initialMsg: string;
  codeId: Option<number>;
  codeHash: Option<string>;
}

export const QueryArea = observer(
  ({
    verifiedSchema,
    localSchema,
    contractAddress,
    initialMsg,
    codeId,
    codeHash,
  }: QueryAreaProps) => {
    const isMobile = useMobile();
    const [tab, setTab] = useState<MessageTabs>(MessageTabs.JSON_INPUT);

    const schema = verifiedSchema ?? localSchema;
    const hasSchema = Boolean(schema);

    const handleTabChange = useCallback(
      (nextTab: MessageTabs) => {
        if (nextTab === tab) return;
        trackUseTab(nextTab);
        setTab(nextTab);
      },
      [tab]
    );

    useEffect(() => {
      if (!schema || isMobile) setTab(MessageTabs.JSON_INPUT);
      else setTab(MessageTabs.YOUR_SCHEMA);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, JSON.stringify(schema)]);

    return (
      <>
        {!isMobile && (
          <Tabs
            isLazy
            lazyBehavior="keepMounted"
            index={Object.values(MessageTabs).indexOf(tab)}
          >
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
                  hidden={Boolean(contractAddress)}
                >
                  Your schema
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
            codeId &&
            codeHash && (
              <>
                {hasSchema ? (
                  <SchemaQuery
                    verifiedSchema={verifiedSchema}
                    localSchema={localSchema}
                    contractAddress={contractAddress}
                    initialMsg={initialMsg}
                    codeId={codeId}
                    codeHash={codeHash}
                  />
                ) : (
                  <UploadSchemaSection
                    codeId={codeId}
                    codeHash={codeHash}
                    title={
                      <Flex flexDirection="column" alignItems="center">
                        <Flex display="inline" textAlign="center">
                          You haven&#39;t attached the JSON schema for
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
      </>
    );
  }
);
