import { Flex, Stack, Text } from "@chakra-ui/react";
import type { LogDescription } from "ethers";
import { Fragment, useState } from "react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { Tooltip } from "lib/components/Tooltip";
import { TypeSwitch } from "lib/components/TypeSwitch";
import type { TxReceiptJsonRpcLog } from "lib/services/types";
import type { EvmVerifyInfo, Nullable, Option } from "lib/types";
import { parseEvmLog } from "lib/utils";
import { EvmEventBoxData } from "./evm-event-box-data";
import { EvmEventBoxTopics } from "./evm-event-box-topics";
import { EvmEventBoxTabs } from "../../types";

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
      borderRadius="8px"
      p={4}
      gap={{
        base: 4,
        md: 6,
      }}
      backgroundColor="gray.900"
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
            label="Log index"
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 1, md: 4 }}
            minWidth="120px"
          >
            {log.logIndex.toString()}
          </LabelText>
          <LabelText
            label="Contract address"
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 1, md: 4 }}
            minWidth="120px"
          >
            <Flex alignItems="center" gap={1}>
              <CustomIcon
                color="primary.main"
                name="contract-address"
                boxSize={3}
              />
              <ExplorerLink
                textFormat="normal"
                type="evm_contract_address"
                value={log.address}
                wordBreak="break-all"
              />
              {evmVerifyInfo?.isVerified && (
                <CustomIcon
                  name="verification-solid"
                  boxSize={4}
                  color="secondary.main"
                />
              )}
            </Flex>
          </LabelText>
          {evmVerifyInfo?.isVerified && parsedLog && (
            <LabelText
              label="Name"
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 1, md: 4 }}
              minWidth="120px"
              alignItems="flex-start"
            >
              <EvmEventBoxName parsedLog={parsedLog} />
            </LabelText>
          )}
        </Stack>
        <Stack alignItems="flex-end">
          <Tooltip
            hidden={!!evmVerifyInfo?.isVerified}
            maxWidth="200px"
            label="Verify the contract to enable decoded"
          >
            <TypeSwitch
              tabs={Object.values(EvmEventBoxTabs)}
              onTabChange={setCurrentTab}
              currentTab={currentTab}
              disabled={!evmVerifyInfo?.isVerified}
              disabledScrollToTop
            />
          </Tooltip>
        </Stack>
      </Flex>
      <LabelText
        label="Topic"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 1, md: 4 }}
        minWidth="120px"
        alignItems="flex-start"
      >
        <EvmEventBoxTopics
          parsedLog={parsedLog}
          topics={log.topics}
          tab={currentTab}
        />
      </LabelText>
      <LabelText
        label="Data"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 1, md: 4 }}
        minWidth="120px"
        alignItems="flex-start"
      >
        <EvmEventBoxData
          data={log.data}
          topics={log.topics}
          parsedLog={parsedLog}
          tab={currentTab}
        />
      </LabelText>
    </Stack>
  );
};
