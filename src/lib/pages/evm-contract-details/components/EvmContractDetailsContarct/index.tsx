import { Flex, Stack } from "@chakra-ui/react";
import { NotVerifiedDetails } from "lib/components/evm-verify-section";
import { HexAddr20 } from "lib/types";
import { EvmContractDetailsContractTabs } from "../../types";
import { useState } from "react";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { ContractByteCode, ContractByteCodeProps } from "./ContractByteCode";
import { ContractAbi } from "./ContractAbi";

interface EvmContractDetailsContractProps extends ContractByteCodeProps {
  contractAddress: HexAddr20;
}

export const EvmContractDetailsContract = ({
  contractAddress,
  code,
  deployedCode,
}: EvmContractDetailsContractProps) => {
  const [currentTab, setCurrentTab] = useState(
    EvmContractDetailsContractTabs.Abi
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
      {currentTab === EvmContractDetailsContractTabs.Abi && <ContractAbi />}
      {currentTab === EvmContractDetailsContractTabs.ByteCode && (
        <ContractByteCode code={code} deployedCode={deployedCode} />
      )}
    </Stack>
  );
};
