import type { BechAddr32, CodeSchema, Nullish, Option } from "lib/types";

import { Flex, TabList, Tabs } from "@chakra-ui/react";
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
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";

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
            <TabList borderBottomWidth="1px" borderColor="gray.800" mb={8}>
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
                    codeHash={codeHash}
                    codeId={codeId}
                    contractAddress={contractAddress}
                    initialMsg={initialMsg}
                    localSchema={localSchema}
                    verifiedSchema={verifiedSchema}
                  />
                ) : (
                  <UploadSchemaSection
                    codeHash={codeHash}
                    codeId={codeId}
                    title={
                      <Flex alignItems="center" flexDirection="column">
                        <Flex display="inline" textAlign="center">
                          You haven&#39;t attached the JSON schema for
                          <CustomIcon color="gray.400" mx={1} name="code" />
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
