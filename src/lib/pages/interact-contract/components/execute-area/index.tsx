import { Flex, TabList, Tabs } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";

import { trackUseTab } from "lib/amplitude";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import {
  MessageInputContent,
  MessageTabs,
  UploadSchemaSection,
} from "lib/components/json-schema";
import { Tooltip } from "lib/components/Tooltip";
import type { BechAddr32, CodeSchema, Nullish, Option } from "lib/types";

import { JsonExecute } from "./JsonExecute";
import { SchemaExecute } from "./schema-execute";

interface ExecuteAreaProps {
  verifiedSchema: Nullish<CodeSchema>;
  localSchema: Option<CodeSchema>;
  contractAddress: BechAddr32;
  initialMsg: string;
  initialFunds: Coin[];
  codeId: Option<number>;
  codeHash: Option<string>;
}

export const ExecuteArea = observer(
  ({
    verifiedSchema,
    localSchema,
    contractAddress,
    initialMsg,
    initialFunds,
    codeHash,
    codeId,
  }: ExecuteAreaProps) => {
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
      if (!schema) setTab(MessageTabs.JSON_INPUT);
      else setTab(MessageTabs.YOUR_SCHEMA);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(schema)]);

    return (
      <>
        <ConnectWalletAlert
          subtitle="You need to connect your wallet to perform this action"
          mb={4}
        />
        <Tabs
          isLazy
          lazyBehavior="keepMounted"
          index={Object.values(MessageTabs).indexOf(tab)}
        >
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
                hidden={Boolean(contractAddress)}
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
            codeId &&
            codeHash && (
              <>
                {hasSchema ? (
                  <SchemaExecute
                    verifiedSchema={verifiedSchema}
                    localSchema={localSchema}
                    contractAddress={contractAddress}
                    initialMsg={initialMsg}
                    initialFunds={initialFunds}
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
      </>
    );
  }
);
