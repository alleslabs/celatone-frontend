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
  codeHash: Option<string>;
  codeId: Option<number>;
  contractAddress: BechAddr32;
  initialMsg: string;
  localSchema: Option<CodeSchema>;
  verifiedSchema: Nullish<CodeSchema>;
}

export const QueryArea = observer(
  ({
    codeHash,
    codeId,
    contractAddress,
    initialMsg,
    localSchema,
    verifiedSchema,
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
            index={Object.values(MessageTabs).indexOf(tab)}
            isLazy
            lazyBehavior="keepMounted"
          >
            <TabList mb={8} borderBottom="1px" borderColor="gray.800">
              <CustomTab
                onClick={() => handleTabChange(MessageTabs.JSON_INPUT)}
              >
                JSON Input
              </CustomTab>
              <CustomTab
                isDisabled={!contractAddress}
                onClick={() => handleTabChange(MessageTabs.YOUR_SCHEMA)}
              >
                <Tooltip
                  hidden={Boolean(contractAddress)}
                  label="Please select contract first"
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
              initialMsg={initialMsg}
              contractAddress={contractAddress}
            />
          }
          schemaContent={
            codeId &&
            codeHash && (
              <>
                {hasSchema ? (
                  <SchemaQuery
                    initialMsg={initialMsg}
                    verifiedSchema={verifiedSchema}
                    codeHash={codeHash}
                    codeId={codeId}
                    contractAddress={contractAddress}
                    localSchema={localSchema}
                  />
                ) : (
                  <UploadSchemaSection
                    title={
                      <Flex alignItems="center" flexDirection="column">
                        <Flex display="inline" textAlign="center">
                          You haven&#39;t attached the JSON Schema for
                          <CustomIcon mx={1} name="code" color="gray.400" />
                          code {codeId}
                        </Flex>
                        <Flex textAlign="center">
                          from which this contract is instantiated yet.
                        </Flex>
                      </Flex>
                    }
                    codeHash={codeHash}
                    codeId={codeId}
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
