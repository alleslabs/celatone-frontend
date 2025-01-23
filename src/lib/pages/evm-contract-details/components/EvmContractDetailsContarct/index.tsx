import { Flex, Stack } from "@chakra-ui/react";
import { NotVerifiedDetails } from "lib/components/evm-verify-section";
import { HexAddr20 } from "lib/types";
import { EvmContractDetailsContractTabs } from "../../types";
import { useState } from "react";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { ContractByteCode, ContractByteCodeProps } from "./ContractByteCode";

interface EvmContractDetailsContractProps extends ContractByteCodeProps {
  contractAddress: HexAddr20;
}

export const EvmContractDetailsContract = ({
  contractAddress,
  byteCode,
  deployedByteCode,
}: EvmContractDetailsContractProps) => {
  const [currentTab, setCurrentTab] = useState(
    EvmContractDetailsContractTabs.ByteCode
  );

  return (
    <Stack gap={8}>
      {/* // TODO: Support all status */}
      <NotVerifiedDetails contractAddress={contractAddress} />
      <Flex>
        <TypeSwitch
          tabs={Object.values(EvmContractDetailsContractTabs)}
          onTabChange={setCurrentTab}
          currentTab={currentTab}
        />
      </Flex>
      {currentTab === EvmContractDetailsContractTabs.ByteCode && (
        <ContractByteCode
          byteCode={byteCode}
          deployedByteCode={deployedByteCode}
        />
      )}
    </Stack>
  );
};
