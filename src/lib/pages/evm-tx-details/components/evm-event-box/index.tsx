import type { LogDescription } from "ethers";
import type { TxReceiptJsonRpcLog } from "lib/services/types";
import type { EvmVerifyInfo, Nullable, Option } from "lib/types";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { parseEvmLog } from "lib/utils";
import { Fragment, useEffect, useState } from "react";

import { EvmEventBoxTabs } from "../../types";
import { EvmEventBoxData } from "./evm-event-box-data";
import { EvmEventBoxTopics } from "./evm-event-box-topics";

interface EvmEventBoxProps {
  evmVerifyInfo: Nullable<EvmVerifyInfo>;
  log: TxReceiptJsonRpcLog;
}

const EvmEventBoxName = ({
  parsedLog,
}: {
  parsedLog: Option<LogDescription>;
}) => {
  if (!parsedLog) return "";

  const { fragment } = parsedLog;

  return (
    <Text variant="body2">
      {fragment.name}(
      {fragment.inputs.map((input, index) => (
        <Fragment key={input.name}>
          <Text as="span" color="success.main">
            {input.type}
          </Text>{" "}
          <Text as="span" color="text.dark">
            {input.indexed ? "indexed " : ""}
          </Text>
          <Text as="span" color="warning.main">
            {input.name}
          </Text>
          {index < fragment.inputs.length - 1 ? ", " : ""}
        </Fragment>
      ))}
      )
    </Text>
  );
};

export const EvmEventBox = ({ evmVerifyInfo, log }: EvmEventBoxProps) => {
  const [currentTab, setCurrentTab] = useState(EvmEventBoxTabs.Decoded);
  const parsedLog = parseEvmLog(evmVerifyInfo?.abi ?? [], log);

  useEffect(() => {
    if (evmVerifyInfo?.isVerified) {
      setCurrentTab(EvmEventBoxTabs.Decoded);
    } else {
      setCurrentTab(EvmEventBoxTabs.Formatted);
    }
  }, [evmVerifyInfo]);

  return (
    <Stack
      backgroundColor="gray.900"
      borderRadius="8px"
      gap={{
        base: 4,
        md: 6,
      }}
      p={4}
    >
      <Flex
        flexDirection={{
          base: "column-reverse",
          md: "row",
        }}
        gap={4}
        justifyContent="space-between"
      >
        <Stack>
          <LabelText
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 1, md: 4 }}
            label="Log index"
            minWidth="120px"
          >
            {log.logIndex.toString()}
          </LabelText>
          <LabelText
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 1, md: 4 }}
            label="Contract address"
            minWidth="120px"
          >
            <Flex alignItems="center" ml={-2}>
              <ExplorerLink
                leftIcon={
                  <CustomIcon
                    boxSize={3}
                    color="primary.main"
                    name="contract-address"
                  />
                }
                textFormat="normal"
                textLabel={evmVerifyInfo?.contractName}
                type="evm_contract_address"
                value={log.address}
                wordBreak="break-all"
              />
              {evmVerifyInfo?.isVerified && (
                <CustomIcon
                  boxSize={4}
                  color="secondary.main"
                  name="verification-solid"
                />
              )}
            </Flex>
          </LabelText>
          {evmVerifyInfo?.isVerified && parsedLog && (
            <LabelText
              alignItems="flex-start"
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 1, md: 4 }}
              label="Name"
              minWidth="120px"
            >
              <EvmEventBoxName parsedLog={parsedLog} />
            </LabelText>
          )}
        </Stack>
        <Stack alignItems="flex-end">
          <TypeSwitch
            currentTab={currentTab}
            disabledScrollToTop
            tabs={Object.values(EvmEventBoxTabs).filter((value) =>
              evmVerifyInfo?.isVerified
                ? value !== EvmEventBoxTabs.Formatted
                : value !== EvmEventBoxTabs.Decoded
            )}
            onTabChange={setCurrentTab}
          />
        </Stack>
      </Flex>
      <LabelText
        alignItems="flex-start"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 1, md: 4 }}
        label="Topic"
        minWidth="120px"
      >
        <EvmEventBoxTopics
          parsedLog={parsedLog}
          tab={currentTab}
          topics={log.topics}
        />
      </LabelText>
      <LabelText
        alignItems="flex-start"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 1, md: 4 }}
        label="Data"
        minWidth="120px"
      >
        <EvmEventBoxData
          data={log.data}
          parsedLog={parsedLog}
          tab={currentTab}
          topics={log.topics}
        />
      </LabelText>
    </Stack>
  );
};
