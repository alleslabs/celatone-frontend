import type { LogDescription } from "ethers";
import type { TxReceiptJsonRpcLog } from "lib/services/types";
import type { EvmVerifyInfo, Nullable, Option } from "lib/types";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { Tooltip } from "lib/components/Tooltip";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { parseEvmLog } from "lib/utils";
import { Fragment, useState } from "react";

import { EvmEventBoxTabs } from "../../types";
import { EvmEventBoxData } from "./evm-event-box-data";
import { EvmEventBoxTopics } from "./evm-event-box-topics";

interface EvmEventBoxProps {
  log: TxReceiptJsonRpcLog;
  evmVerifyInfo: Nullable<EvmVerifyInfo>;
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

export const EvmEventBox = ({ log, evmVerifyInfo }: EvmEventBoxProps) => {
  const [currentTab, setCurrentTab] = useState(EvmEventBoxTabs.Hex);
  const parsedLog = parseEvmLog(evmVerifyInfo?.abi ?? [], log);

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
            label="Log Index"
            minWidth="120px"
          >
            {log.logIndex.toString()}
          </LabelText>
          <LabelText
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 1, md: 4 }}
            label="Contract Address"
            minWidth="120px"
          >
            <Flex alignItems="center" gap={1}>
              <CustomIcon
                boxSize={3}
                color="primary.main"
                name="contract-address"
              />
              <ExplorerLink
                textFormat="normal"
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
          <Tooltip
            hidden={!!evmVerifyInfo?.isVerified}
            label="Verify the contract to enable decoded"
            maxWidth="200px"
          >
            <TypeSwitch
              currentTab={currentTab}
              disabled={!evmVerifyInfo?.isVerified}
              disabledScrollToTop
              tabs={Object.values(EvmEventBoxTabs)}
              onTabChange={setCurrentTab}
            />
          </Tooltip>
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
